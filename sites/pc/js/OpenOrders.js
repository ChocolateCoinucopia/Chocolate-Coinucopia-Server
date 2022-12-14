// OpenOrders.js



class OpenOrders {

  #active;
  #activeRequest;
  #activeThreads;
  #batchSize;
  #progress;
  #orders;
  #fulfilled;
  #key;
  #reverse;
  #threads;


  constructor(threads = 500) {

    this.#active = false;
    this.#activeRequest = {};
    this.#activeThreads = 0;
    this.#batchSize = 100;
    this.#progress = new ProgressBar('OpenOrders-Progress');
    this.#orders = {};
    this.#fulfilled = {};
    this.#key = 'Placed';
    this.#reverse = true;
    this.#threads = threads;

    this.#build();
  }



  async #build() {

    Promise.all([this.#preparePanel(), this.#prepareEventListeners(), this.#activateCoins()]).then(success => {

      this.#active = true;

      this.update();

    }).catch(error => MISC.loadContractError());
  }



  async #preparePanel() {

    this.#prepareBase();
  }

  #prepareBase() {

    let base = document.getElementById('OpenOrders-Panel-Base');
    let bases = ['Any', ...Broker.coins()];

    base.replaceChildren();

    for(let i in bases) base.appendChild(this.#generateOption(bases[i], bases[i]));

    if(base.getElementsByTagName('OPTION').length) base.getElementsByTagName('OPTION')[0].selected = true;

    this.#loadQuote({type: 'change'});
  }



  async #prepareEventListeners() {

    document.getElementById('OpenOrders-Panel-Order').addEventListener('change',  this.#updateHandler.bind(this));
    document.getElementById('OpenOrders-Panel-Order').addEventListener('keyup',  this.#updateHandler.bind(this));
    document.getElementById('OpenOrders-Panel-Base').addEventListener('change', this.#loadQuote.bind(this));
    document.getElementById('OpenOrders-Panel-Base').addEventListener('keyup', this.#loadQuote.bind(this));
    document.getElementById('OpenOrders-Panel-Quote').addEventListener('change', this.#updateHandler.bind(this));
    document.getElementById('OpenOrders-Panel-Quote').addEventListener('keyup', this.#updateHandler.bind(this));
  
    this.#prepareHeaderEventListeners();
  }

  #updateHandler(e) {

    if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

      if(this.#active) this.update();
    }
  }

  #loadQuote(e) {

    if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

      let quote = document.getElementById('OpenOrders-Panel-Quote');
      let quotes = this.#loadQuoteOptions();

      quote.replaceChildren();

      for(let i in quotes) quote.appendChild(this.#generateOption(quotes[i], quotes[i]));

      if(quote.getElementsByTagName('OPTION').length) quote.getElementsByTagName('OPTION')[0].selected = true;

      if(this.#active) this.update();
    }
  }

  #prepareHeaderEventListeners() {

    let h = document.getElementById('OpenOrders-Headers').children;

    for(let i = 0; i < h.length; i++) h[i].firstElementChild.addEventListener('click', this.organize.bind(this, h[i].firstElementChild.firstElementChild.innerText));
  }

  #loadQuoteOptions() {

    return ['Any', ...Broker.quotes(document.getElementById('OpenOrders-Panel-Base').value)];
  }

  #generateOption(text, value) {

    let e = document.createElement('OPTION');

    e.innerText = text;
    e.value = value;

    return e;
  }



  async #activateCoins() {

    let coins = Broker.coins();

    if(await Broker.activateCoins(...coins)) {

      coins.forEach(async coin => {

        if(coin != 'ETH') {

          Broker.contracts[coin].DEX.events.Order({
              filter: {'_address': window.account },
              fromBlock: 'latest'
            }).on('data', async (event) => this.#refreshOrders(this.#appendEventItem(event, 'Key', this.#activeRequest.Key)));
        }
      });

      return true;
    }

    throw TypeError('Failed to load contracts.');
  }



  async update() {

  	this.display('OpenOrders', true);

    let request = this.#getRequest();
    let exchanges = this.#getExchanges();
    let filter = this.#getFilter(request);
    let orders = document.getElementById('OpenOrders-Orders');

    this.#activeRequest = MISC.clone(request);
    this.#activeThreads = 0;
    this.#orders = {};
    this.#fulfilled = {};

    this.display('Lock');

    orders.replaceChildren();

    this.display('Unlock');

    exchanges.forEach(async (coin) => this.#collectEvents(coin, request, Math.min(100, Math.ceil(this.#threads/exchanges.length)), filter));
  }

  #getExchanges() {

    let coins = Broker.coins();
    let exchanges = [], addresses = {};

    coins.forEach(coin => {

      if(!addresses[window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address]) {

        exchanges.push(coin);
        addresses[window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address] = true;
      }
    });

    return exchanges;
  }

  async #collectEvents(dex, request, threads, filter = {}) {

    let latest = (await web3.eth.getBlock('latest')).number;

    this.#progress.reset();
    this.#progress.target(latest - window.keyRing[window.web3.currentProvider.networkVersion][dex].DEX.Block);

    this.#activeThreads += threads;

    for(let i = 0; i < threads; i++) this.#collectEventsBatch(dex, request, threads, latest - i*this.#batchSize, filter);
  }

  async #collectEventsBatch(dex, request, threads, index, filter = {}) {

    if(!this.#activeParameters(request)) return true;
    else if(index < window.keyRing[window.web3.currentProvider.networkVersion][dex].DEX.Block) {

      if(--this.#activeThreads == 0) this.#progress.reset();

      return true;
    }

    this.#progress.add(this.#batchSize);

    await Broker.contracts[dex].DEX.getPastEvents('Order', {
      filter: filter,
      fromBlock: Math.max(index - (this.#batchSize - 1), window.keyRing[window.web3.currentProvider.networkVersion][dex].DEX.Block),
      toBlock: index
    }).then(async (events) => {

      let batch = [];

      for(let i = events.length - 1; i >= 0; i--) batch.push(this.#refreshOrders(this.#appendEventItem(events[i], 'Key', request.Key)));

      await Promise.all(batch);

    }).catch(error => console.error(error));

    return this.#collectEventsBatch(dex, request, threads, index - threads*this.#batchSize, filter);
  }

  async #refreshOrders(event) {

    if(!this.#activeParameters(event.returnValues)) return true;

    if(this.#inactiveEventOrder(event)) {

      this.#fulfilled[event.returnValues._address + event.returnValues._ID] = true;

      if(this.#knownOrder(event)) {

        delete this.#orders[event.returnValues._address + event.returnValues._ID];

        this.#removeOrder('OpenOrders-' + event.returnValues._address + event.returnValues._ID);
      }
    }
    else if(!this.#fulfilledOrder(event)) {

      if(this.#knownOrder(event)) {

        if(this.#newerOrder(event)) this.#orders[event.returnValues._address + event.returnValues._ID]._fulfilled = event.returnValues._fulfilled;
        else {

          this.#orders[event.returnValues._address + event.returnValues._ID]._block = event.returnValues._block;
          this.#orders[event.returnValues._address + event.returnValues._ID]._timestamp = event.returnValues._timestamp;
        }
      }
      else this.#orders[event.returnValues._address + event.returnValues._ID] = event.returnValues;

      if(this.#activeOrder(event.returnValues._address + event.returnValues._ID)) this.#buildTable(this.#tableRow(this.#orders[event.returnValues._address + event.returnValues._ID]));
    }
  }

  #inactiveEventOrder(event) {

    return !event.returnValues._active || event.returnValues._quantity == event.returnValues._fulfilled;
  }

  #fulfilledOrder(event) {

    return this.#fulfilled[event.returnValues._address + event.returnValues._ID];
  }

  #knownOrder(event) {

    return this.#orders[event.returnValues._address + event.returnValues._ID];
  }

  #newerOrder(event) {

    return this.#orders[event.returnValues._address + event.returnValues._ID]._block.i() < event.returnValues._block.i();
  }

  #removeOrder(key) {

    if(document.getElementById(key)) {

    	this.display('Lock');

    	document.getElementById(key).parentElement.remove();

    	this.display('Unlock');
    }
  }



  organize(key = 'Placed') {

  	this.display('OpenOrders', true);

    let rows = [];
    let orders = document.getElementById('OpenOrders-Orders');
    let reverse = this.#getDirection(key);

    for(let i = 0; i < orders.children.length; i++) rows.push(orders.children[i]);

    this.display('Lock');

    orders.replaceChildren();

    this.display('Unlock');

    rows.forEach(row => this.#buildTable(row, key, reverse));
  }

  #buildTable(e, key = null, reverse = null) {

    this.#key = key != null ? key : this.#key;
    this.#reverse = reverse != null ? reverse : this.#reverse;

    let orders = document.getElementById('OpenOrders-Orders');
    let index = this.#getColumn(this.#key);

    this.#removeOrder(e.firstElementChild.id);

    if(index != null) {

      for(let i = 0; i < orders.children.length; i++) {

        if(this.#compareCells(e.children[index], orders.children[i].children[index], this.#reverse) && this.#activeOrder(e.firstElementChild.id.substring(11))) {

        	this.display('Lock');

        	orders.insertBefore(e, orders.children[i]);

        	this.display('Unlock');

        	return true;
        }
      }
    }

    if(this.#activeOrder(e.firstElementChild.id.substring(11))) {

    	this.display('Lock');

    	orders.appendChild(e);

    	this.display('Unlock');

    	return true;
    }

    return false;
  }

  #tableRow(order) {

    let row = document.createElement('TR');

    row.className = 'tall';

    row.appendChild(this.#orderDateCell(order));
    row.appendChild(this.#orderCell(order._order.ascii()));
    row.appendChild(this.#orderCell(order._base.ascii()));
    row.appendChild(this.#orderCell(order._quote.ascii()));
    row.appendChild(this.#orderCell(order._quantity.eth().format()));
    row.appendChild(this.#orderLimitCell(order));
    row.appendChild(this.#orderCell(order._fulfilled.eth().format()));
    row.appendChild(this.#orderCancelCell(order));

    return row;
  }

  #orderCell(text) {

    let cell = document.createElement('TD');

    cell.className = 'pw-10 numeric';
    cell.innerText = text;

    return cell;
  }

  #orderDateCell(order) {

    let cell = document.createElement('TD');

    cell.id = 'OpenOrders-' + order._address + order._ID;
    cell.className = 'pw-10 left numeric';
    cell.innerText = new Date(order._timestamp.i()*1000).toLocaleTimeString() + ', ' + new Date(order._timestamp.i()*1000).toLocaleDateString();

    cell.setAttribute('value', order._timestamp);

    return cell;
  }

  #orderLimitCell(order) {

    let cell = document.createElement('TD');
    let price = order._limit.D(order._E);

    cell.className = 'pw-10 ' + (price < 0.001 ? 'left ' : "") + 'numeric';
    cell.innerText = price >= 0.001 ? price.format() : price.e();

    return cell;
  }

  #orderCancelCell(order) {

    let cell = document.createElement('TD');

    cell.className = 'pw-10';
    
    cell.setAttribute('value', '0');

    cell.appendChild(this.#orderCancelButton(order));
    cell.appendChild(this.#orderCancelProcessing(order));

    return cell;
  }

  #orderCancelButton(order) {

    let button = document.createElement('BUTTON');

    button.id = 'OpenOrders-' +  order._address + order._ID + '-Cancel';
    button.className = 'btn btn-primary btn-lg exit CancelOrder';
    button.innerText = '???';

    button.addEventListener('click', OpenOrders.cancel.bind(this, order));

    return button;
  }

  #orderCancelProcessing(order) {

    let img = document.createElement('IMG');

    img.id = 'OpenOrders-' +  order._address + order._ID +  '-Processing';
    img.className = 'Loading cc45'
    img.src = '/images/ChocolateCoin.png';
    img.alt = "";
    img.style.display = document.getElementById(order._address + order._ID + '-Processing') ? document.getElementById(order._address + order._ID + '-Processing').style.display : "none";

    return img;
  }



  static async cancel(order) {

    this.display(order._address + order._ID, false);

    Broker.cancelOrderTicket(order).then(success => this.display(order._address + order._ID, true)).catch(error => this.display(order._address + order._ID, true));
  }



  #getColumn(x) {

    let h = document.getElementById('OpenOrders-Headers').children;

    x = x.toLowerCase();

    for(let i = 0; i < h.length; i++) {

      if(x == h[i].firstElementChild.firstElementChild.innerText.toLowerCase()) return i;
    }

    return null;
  }

  #getDirection(x) {

    let rows = document.getElementById('OpenOrders-Orders').children;
    let index = this.#getColumn(x);

    for(let i = 1; i < rows.length; i++) {

      if(!this.#first(rows[0].children[index], rows[i].children[index])) return false;
    }

    return true;
  }

  #compareCells(a, b, reverse = false) {

    let e12, e21;

    a = a.getAttribute('value') ? a.getAttribute('value') : a.innerText;
    b = b.getAttribute('value') ? b.getAttribute('value') : b.innerText;

    e12 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? a.s() : a.clean().f();
    e21 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? b.s() : b.clean().f();

    return reverse ? e12 >= e21 : e12 < e21;
  }

  #first(a, b, reverse = false) {

    let e12, e21;

    a = a.getAttribute('value') ? a.getAttribute('value') : a.innerText;
    b = b.getAttribute('value') ? b.getAttribute('value') : b.innerText;

    e12 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? a.s() : a.clean().f();
    e21 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? b.s() : b.clean().f();

    return reverse ? e12 >= e21 : e12 <= e21;
  }



  #getRequest() {

    return {Key: MISC.randomKey(),
            Order: document.getElementById('OpenOrders-Panel-Order').value,
            Base: document.getElementById('OpenOrders-Panel-Base').value,
            Quote: document.getElementById('OpenOrders-Panel-Quote').value
    };
  }



  #getFilter(request) {

    let filter = {_address: window.account};

    if(request.Base != 'Any') filter['_base'] = request.Base.hex();
    if(request.Quote != 'Any') filter['_quote'] = request.Quote.hex();

    return filter;
  }



  #activeParameters(request) {

    return this.#activeRequest.Key == request.Key;
  }

  #activeOrder(key) {

    return this.#orders[key] && this.#activeParameters(this.#orders[key]) && (this.#activeRequest.Order == 'Any' || this.#activeRequest.Order == this.#orders[key]._order.ascii()) && (this.#activeRequest.Base == 'Any' || this.#activeRequest.Base == this.#orders[key]._base.ascii()) && (this.#activeRequest.Quote == 'Any' || this.#activeRequest.Quote == this.#orders[key]._quote.ascii());
  }



  #appendEventItem(event, key, value) {

    event.returnValues[key] = value;

    return event;
  }



  display(menu, visible = true) {

    switch(menu) {

      case 'OpenOrders':

      	Ghost.possess(document.getElementById('OpenOrders'));
      	Ghost.visible(document.getElementById('OpenOrders-Loading'), !visible);
      	Ghost.visible(document.getElementById('OpenOrders-Content'), visible);
      	Ghost.resize(document.getElementById('OpenOrders'));
      break;
      case 'Lock': Ghost.possess(document.getElementById('OpenOrders')); break;
      case 'Unlock': Ghost.resize(document.getElementById('OpenOrders')); break;
      default: 

        if(document.getElementById('OpenOrders-' + menu + '-Cancel')) {
          if(visible) {

          	Ghost.visible(document.getElementById('OpenOrders-' + menu + '-Processing'), false);
          	Ghost.visible(document.getElementById('OpenOrders-' + menu + '-Cancel'), true);
          }
          else {

            Ghost.visible(document.getElementById('OpenOrders-' + menu + '-Cancel'), false);
          	Ghost.visible(document.getElementById('OpenOrders-' + menu + '-Processing'), true);
          }
        }
      break;
    }
  }
}
