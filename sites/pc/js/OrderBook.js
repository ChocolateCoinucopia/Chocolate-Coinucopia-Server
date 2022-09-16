// OrderBook.js



class OrderBook {

		#listeners;
		#active;
		#activeBase;
    #activeQuote;
    #activeDEX;
		#collections;
		#activeThreads;
		#batchSize;
		#progress;
    #orders;
    #fulfilled;
    #offers;
    #lastPrice;
    #threads;


	constructor(threads = 100) {

			this.#listeners = [];
			this.#active = null;
			this.#activeBase = null;
    	this.#activeQuote = null;
    	this.#activeDEX = null;
	    this.#collections = 0;
	    this.#activeThreads = 0;
	    this.#batchSize = 100;
	    this.#progress = new ProgressBar('Exchange-Progress');
    	this.#orders = {};
    	this.#fulfilled = {};
    	this.#offers = {};
    	this.#lastPrice = {};
    	this.#threads = threads;

    	this.#build();
	}



	#build() {

		this.display('Exchange', false);

		Promise.all([this.#preparePanel(), this.#prepareEventListeners(), this.#prepareApps()]).then(success => this.update()).catch(error => MISC.loadContractError());
	}



	async #preparePanel() {

    this.#rebuildBase();
    this.#rebuildQuote({type: 'change'});
  }



	async #prepareEventListeners() {

		document.getElementById('Exchange-Base').addEventListener('change', this.#rebuildQuote.bind(this));
		document.getElementById('Exchange-Base').addEventListener('keyup', this.#rebuildQuote.bind(this));

		document.getElementById('Exchange-Base').addEventListener('change', this.#loadOrders.bind(this));
		document.getElementById('Exchange-Base').addEventListener('keyup', this.#loadOrders.bind(this));
		document.getElementById('Exchange-Quote').addEventListener('change', this.#loadOrders.bind(this));
		document.getElementById('Exchange-Quote').addEventListener('keyup', this.#loadOrders.bind(this));
		document.getElementById('Exchange-Min-Quantity').addEventListener('keyup', this.#loadOrders.bind(this));
		document.getElementById('Exchange-Max-Orders').addEventListener('change', this.#loadOrders.bind(this));
		document.getElementById('Exchange-Max-Orders').addEventListener('keyup', this.#loadOrders.bind(this));
	}

	#loadOrders(e) {

	  if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') this.update();
	}

	#clickAcceptOffer(e) {

	  if(e.type === 'keyup' && e.key ==='Enter') e.srcElement.parentElement.nextElementSibling.firstElementChild.click();
	}

	#rebuildBase() {

    let base = document.getElementById('Exchange-Base');
    let bases = Broker.coins();

      base.replaceChildren();

      for(let i in bases) base.appendChild(this.#generateOption(bases[i], bases[i]));

      base.getElementsByTagName('OPTION')[0].selected = true;
  }

	#rebuildQuote(e) {

	  if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

	  	let quote = document.getElementById('Exchange-Quote');
	    let quotes = Broker.quotes(document.getElementById('Exchange-Base').value);
	    
	    quote.replaceChildren();

	    for(let i in quotes) quote.appendChild(this.#generateOption(quotes[i], quotes[i]));

	    quote.getElementsByTagName('OPTION')[0].selected = true;
	  }
	}

	#generateOption(coin) {

	  let e = document.createElement('OPTION');

	  e.innerText = coin;
	  e.value = coin;
	  
	  return e;
	}



	async #prepareApps() {

		new Order();
	}



	async update() {

		this.display('Exchange', true);

		let key = MISC.randomKey();
		let base = document.getElementById('Exchange-Base').value;
		let quote = document.getElementById('Exchange-Quote').value;
		let dex = Broker.dex(base, quote);

		this.#progress.reset();
		this.#progress.target(0);

		this.#active = key;
		this.#activeThreads = 0;
		this.#activeBase = base;
		this.#activeQuote = quote;
		this.#activeDEX = dex;
		this.#orders = {};
		this.#fulfilled = {};
		this.#lastPrice = {};

		this.render();

		if(await this.#activateCoins(base, quote, dex)) this.#collectEvents(dex, base, quote, key);
	}

	async #activateCoins(...coins) {

		let newCoins = [];

		coins = [...new Set(coins)];

		coins.forEach(coin => { if(coin != 'ETH' && !this.#listeners.includes(coin)) newCoins.push(coin); });

		if(await Broker.activateCoins(...coins)) {

			newCoins.forEach(async coin => {

				Broker.contracts[coin].DEX.events.Order({
						fromBlock: 'latest'
					}).on('data', async (event) => this.#refresh(event));

				this.#listeners.push(coin);
			});

			return true;
		}

		throw TypeError('Failed to load contracts.');
	}

	async #collectEvents(dex, base, quote, key = null, inverse = false) {

		if(!inverse && quote != 'ETH') this.#collectEvents(dex, quote, base, key, true);

		let latest = (await web3.eth.getBlock('latest')).number;

		this.#progress.addTarget(latest - window.keyRing[window.web3.currentProvider.networkVersion][dex].DEX.Block);

		this.#collections = 0
		this.#activeThreads += this.#threads;

		for(let i = 0; i < this.#threads; i++) this.#collectEventsBatch(dex, base, quote, key, inverse, latest - i*this.#batchSize);
	}

	async #collectEventsBatch(dex, base, quote, key, inverse, index) {

		if(!this.#activeKey(key) || !this.#activeEventOrder(base, quote)) return true;
		else if(index < window.keyRing[window.web3.currentProvider.networkVersion][dex].DEX.Block) {

			if(--this.#activeThreads == 0) {

				this.#fulfilled = {};

				this.#progress.reset();
			}

			return true;
		}

		this.#progress.add(this.#batchSize);

		await Broker.contracts[dex].DEX.getPastEvents('Order', {
			filter: {_base: base.hex(), _quote: quote.hex()},
			fromBlock: Math.max(index - (this.#batchSize - 1), window.keyRing[window.web3.currentProvider.networkVersion][dex].DEX.Block),
			toBlock: index
		}).then(async (events) => {

			let batch = [];

			for(let i = events.length - 1; i >= 0; i--) batch.push(this.#refreshOrders(events[i], key, inverse));

			await Promise.all(batch);

		}).catch(error => console.error(error));

		if(++this.#collections%this.#activeThreads == 0) this.render();

		return this.#collectEventsBatch(dex, base, quote, key, inverse, index - this.#threads*this.#batchSize);
	}

	async #refreshOrders(event, key = null, inverse = false) {

		if(!this.#activeKey(key) || !this.#activeEventOrder(event.returnValues._base, event.returnValues._quote, true)) return true;

		if(!event.returnValues._active || event.returnValues._quantity == event.returnValues.fulfilled) {

			this.#fulfilled[event.returnValues._address + event.returnValues._ID] = true;
			
			delete this.#orders[event.returnValues._address + event.returnValues._ID];

			this.#refreshLastPrice(inverse ? MISC.invertOrderEvent(event) : event);
		}
		else if(!this.#fulfilledOrder(event) && (!this.#knownOrder(event) || this.#newerOrder(event))) {

			event = inverse ? MISC.invertOrderEvent(event) : event;

			this.#orders[event.returnValues._address + event.returnValues._ID] = event.returnValues;

			this.#refreshLastPrice(event);
		}
	}

	#activeKey(key) {

		return this.#active === key;
	}

	#activeEventOrder(base, quote, hex = false) {

		base = hex ? base.ascii() : base;
		quote = hex ? quote.ascii() : quote;

		return this.#activeBase == base && this.#activeQuote == quote || this.#activeBase == quote && this.#activeQuote == base;
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



	async #refresh(event) {

		if(!this.#activeEventOrder(event.returnValues._base, event.returnValues._quote, true)) return true;

		if(event.returnValues._base.ascii() == document.getElementById('Exchange-Quote').value && event.returnValues._quote.ascii() == document.getElementById('Exchange-Base').value) event.returnValues = MISC.invertOrderEvent(event.returnValues);

		let bidask = event.returnValues._order.ascii() == 'BUY' ? 'Bid' : event.returnValues._order.ascii() == 'SELL' ? 'Ask' : "";
		let base = event.returnValues._base.ascii();
		let quote = event.returnValues._quote.ascii();
		let quantity = event.returnValues._quantity.BN().sub(event.returnValues._fulfilled.BN()).eth();
		let fulfilled = event.returnValues._fulfilled.eth();
		let min = document.getElementById('Exchange-Min-Quantity').value == "" ? 0 : document.getElementById('Exchange-Min-Quantity').value.clean().f();
		let max = document.getElementById('Exchange-Max-Orders').value == "" ? 10 : document.getElementById('Exchange-Max-Orders').value.clean().f();
		let e = document.getElementById(event.returnValues._address + event.returnValues._ID);
		let r = document.getElementById('Exchange-' + bidask);

		if(base == document.getElementById('Exchange-Base').value && quote == document.getElementById('Exchange-Quote').value) {

			this.display('Lock');

			this.#orders[event.returnValues._address + event.returnValues._ID] = event.returnValues;

			this.#refreshLastPrice(event);

			if(e && (quantity == 0 || !event.returnValues._active)) {

				delete this.#orders[event.returnValues._address + event.returnValues._ID];

				e.parentElement.remove();

				for(let i in this.#offers[bidask]) {

					if(this.#offers[bidask][i]._address + this.#offers[bidask][i]._ID == event.returnValues._address + event.returnValues._ID) {

						this.#offers[bidask].splice(i, 1);

						break;
					}
				}

				if(r.childElementCount < max && r.childElementCount < this.#offers[bidask].length) r.appendChild(this.#tableRow(this.#offers[bidask][r.childElementCount]));
			}
			else if(e) {

				e.innerText = quantity.format();

				for(let i in this.#offers[bidask]) {

					if(this.#offers[bidask][i]._address + this.#offers[bidask][i]._ID == event.returnValues._address + event.returnValues._ID) {

						this.#offers[bidask][i] = event.returnValues;

						break;
					} 
				}
			}
			else if(event.returnValues._active && 0 < quantity && min <= quantity) {

				this.#offers[bidask].push(event.returnValues);

				if(bidask == 'Bid') this.#offers[bidask].sort((a, b) => { return a._limit.BN().mul(b._E.EE().BN()).gt(b._limit.BN().mul(a._E.EE().BN())) ? -1 : 1; });
				else if(bidask == 'Ask') this.#offers[bidask].sort((a, b) => { return a._limit.BN().mul(b._E.EE().BN()).lt(b._limit.BN().mul(a._E.EE().BN())) ? -1 : 1; });

				for(let i = 0; i < Math.min(max, this.#offers[bidask].length); i++) {

					if(i == this.#offers[bidask].length - 1) {

						r.appendChild(this.#tableRow(this.#offers[bidask][i]));
						break;
					}
					else if(this.#offers[bidask][i]._address + this.#offers[bidask][i]._ID == event.returnValues._address + event.returnValues._ID) {

						r.insertBefore(this.#tableRow(this.#offers[bidask][i]), r.children[i]);
						break;
					}
				}

				while(r.childElementCount > max) r.children[max].remove();
			}

			this.#updateActivity();
			this.display('Unlock');
		}
	}

	#refreshLastPrice(event) {

		if(event.returnValues._fulfilled > 0 && (event.returnValues._active || event.returnValues._quantity == event.returnValues._fulfilled) && (!this.#lastPrice.Block || this.#lastPrice.Block < event.returnValues._block)) this.#lastPrice = {'Price': event.returnValues._limit.D(event.returnValues._E), 'Block': event.returnValues._block};
	}

	async render() {

		if(this.#filterOrders()) this.#displayOrders();

		this.#updateActivity();
	}

	#filterOrders() {

		let min = (document.getElementById('Exchange-Min-Quantity').value == "" ? '0' : document.getElementById('Exchange-Min-Quantity').value.clean()).weiBN();
		let max = document.getElementById('Exchange-Max-Orders').value == "" ? 0 : document.getElementById('Exchange-Max-Orders').value.clean();
		let previous = JSON.stringify(this.#offers);
		let latest = {'Bid': [], 'Ask': []};

		for(let i in this.#orders) {

			if(this.#orders[i]._active && this.#orders[i]._quantity.BN().sub(this.#orders[i]._fulfilled.BN()).gte(min)) {

				if(this.#orders[i]._order.ascii() == 'BUY' && (latest['Bid'].length < max || this.#orders[i]._limit.BN().mul(latest['Bid'][latest['Bid'].length - 1]._E.EE().BN()).gt(latest['Bid'][latest['Bid'].length - 1]._limit.BN().mul(this.#orders[i]._E.EE().BN())))) latest = this.#insertBid(this.#orders[i], latest, max);
				else if(this.#orders[i]._order.ascii() == 'SELL' && (latest['Ask'].length < max || this.#orders[i]._limit.BN().mul(latest['Ask'][latest['Ask'].length - 1]._E.EE().BN()).lt(latest['Ask'][latest['Ask'].length - 1]._limit.BN().mul(this.#orders[i]._E.EE().BN())))) latest = this.#insertAsk(this.#orders[i], latest, max);
			}
		}

		this.#offers = latest;

		return previous != JSON.stringify(this.#offers);
	}

	#insertBid(order, offers, max) {

		for(let i = 0; i < offers['Bid'].length; i++) {

			if(order._limit.BN().mul(offers['Bid'][i]._E.EE().BN()).gt(offers['Bid'][i]._limit.BN().mul(order._E.EE().BN()))) {

				offers['Bid'].splice(i, 0, order);

				return offers;
			}
		}

		if(offers['Bid'].length < max) offers['Bid'].push(order);
		else if(offers['Bid'].length > max) offers['Bid'].pop();

		return offers;
	}

	#insertAsk(order, offers, max) {

		for(let i = 0; i < offers['Ask'].length; i++) {

			if(order._limit.BN().mul(offers['Ask'][i]._E.EE().BN()).lt(offers['Ask'][i]._limit.BN().mul(order._E.EE().BN()))) {

				offers['Ask'].splice(i, 0, order);

				return offers;
			}
		}

		if(offers['Ask'].length < max) offers['Ask'].push(order);
		else if(offers['Ask'].length > max) offers['Ask'].pop();

		return offers;
	}

	#displayOrders() {

		this.display('Lock');

		let max = document.getElementById('Exchange-Max-Orders').value == "" ? 10 : document.getElementById('Exchange-Max-Orders').value.clean();
		let bid = document.getElementById('Exchange-Bid');
		let ask = document.getElementById('Exchange-Ask');
		let focus = document.activeElement.getAttribute('target') == 'Exchange-Quantity' ? document.activeElement.parentElement.previousElementSibling.previousElementSibling.id : null;
		let statuses = this.#preserveStatuses();

		bid.replaceChildren();
		ask.replaceChildren();

		for(let i = 0; i < Math.min(max, this.#offers['Bid'].length); i++) bid.appendChild(this.#tableRow(this.#offers['Bid'][i], statuses[this.#offers['Bid'][i]._address + this.#offers['Bid'][i]._ID]));
		for(let i = 0; i < Math.min(max, this.#offers['Ask'].length); i++) ask.appendChild(this.#tableRow(this.#offers['Ask'][i], statuses[this.#offers['Ask'][i]._address + this.#offers['Ask'][i]._ID]));

		if(focus && document.getElementById(focus)) document.getElementById(focus).nextElementSibling.nextElementSibling.firstElementChild.focus();

		this.display('Unlock');
	}

	#preserveStatuses() {

		let statuses = {};
		let bid = document.getElementById('Exchange-Bid').children;
		let ask = document.getElementById('Exchange-Ask').children;

		for(let i = 0; i < bid.length; i++) statuses[bid[i].firstElementChild.id] = {Quantity: bid[i].children[2].firstElementChild.value, Accept: bid[i].children[3].firstElementChild.style.display, Processing: bid[i].children[3].firstElementChild.nextElementSibling.style.display};
		for(let i = 0; i < ask.length; i++) statuses[ask[i].firstElementChild.id] = {Quantity: ask[i].children[2].firstElementChild.value, Accept: ask[i].children[3].firstElementChild.style.display, Processing: ask[i].children[3].firstElementChild.nextElementSibling.style.display};

		return statuses;
	}

	#tableRow(offer, presets = null) {

		let row = document.createElement('TR');

		row.appendChild(this.#orderQuantityCell(offer));
		row.appendChild(this.#orderPriceCell(offer));
		row.appendChild(this.#offerQuantityCell(offer, presets));
		row.appendChild(this.#offerAcceptCell(offer, presets));

		return row;
	}

	#orderQuantityCell(offer) {

		let cell = document.createElement('TD');

		cell.id = offer._address + offer._ID;
		cell.className = 'single numeric';
		cell.innerText = offer._quantity.BN().sub(offer._fulfilled.BN()).eth().format();

		return cell;
	}

	#orderPriceCell(offer) {

		let cell = document.createElement('TD');
		let price = offer._limit.D(offer._E);

		cell.className = 'single ' + (price < 0.001 ? 'left ' : "") + 'numeric';
		cell.innerText = price >= 0.001 ? price.format() : price.e();

		return cell;
	}

	#offerQuantityCell(offer, presets = null) {

		let cell = document.createElement('TD');

		cell.className = 'single numeric';

		cell.appendChild(this.#numberInput(offer._base.ascii(), presets));

		return cell;
	}

	#numberInput(coin, presets = null) {

		let input = document.createElement('INPUT');

		input.className = 'form-control input-lg right flex humble';
		input.value = presets ? presets.Quantity : "";
		input.setAttribute('type', 'number');
		input.setAttribute('name', 'quantity');
		input.setAttribute('target', 'Exchange-Quantity');
		input.setAttribute('min', '0');
		input.setAttribute('pattern', '[0-9]+([\.,][0-9]+)?');
		input.setAttribute('placeholder', '# of ' + coin);

		input.addEventListener('keyup', this.#clickAcceptOffer.bind(this));

		return input;
	}

	#offerAcceptCell(offer, presets = null) {

		let cell = document.createElement('TD');

		cell.className = 'single';

		cell.appendChild(this.#offerAcceptButton(offer, presets));
		cell.appendChild(this.#offerProcessingDisplay(presets));

		return cell;
	}

	#offerAcceptButton(offer, presets = null) {

		let button = document.createElement('BUTTON');

		button.className = 'btn btn-primary btn-lg humble';
		button.innerText = 'Accept Order';
		button.style.display = presets ? presets.Accept : "";
		button.setAttribute('type', 'button');
		button.setAttribute('Address', offer._address);
		button.setAttribute('Order', offer._ID);
		button.setAttribute('name', 'accept');

		button.addEventListener('click', this.acceptOffer.bind(this, offer._address + offer._ID));

		return button;
	}

	#offerProcessingDisplay(presets = null) {

		let img = document.createElement('IMG');

		img.className = 'Loading cc30'
		img.src = '/images/ChocolateCoin.png';
		img.alt = "";
		img.style.display = presets ? presets.Processing : "none";

		return img;
	}

	#updateActivity() {

		document.getElementById('Update-Time').innerText = this.#updateStamp();
		document.getElementById('Update-Price').innerText = this.#updatePrice();
	}

	#updateStamp() {

		return new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString();
	}

	#updatePrice() {

		return this.#lastPrice.Price ? (this.#lastPrice.Price >= 1 ? this.#lastPrice.Price.format() : this.#lastPrice.Price.e()) + ' ' + document.getElementById('Exchange-Quote').value : "";
	}



	async acceptOffer(e) {

		this.display(e, false);

		Broker.acceptOffer(this.#orders[e], document.getElementById(e).nextElementSibling.nextElementSibling.firstElementChild.value.clean().wei()).then(success => this.display(e, true)).catch(error => this.display(e, true));
	}



	display(menu, visible = true) {

		switch(menu) {

			case 'Exchange':

				Ghost.possess(document.getElementById('Exchange'));
				Ghost.visible(document.getElementById('Exchange-Loading'), !visible);
				Ghost.visible(document.getElementById('Exchange-OrderBook'), visible);
				Ghost.resize(document.getElementById('Exchange'));
			break;
			case 'Lock': Ghost.possess(document.getElementById('Exchange')); break;
			case 'Unlock': Ghost.resize(document.getElementById('Exchange')); break;
			default: 

				if(document.getElementById(menu)) {
					if(visible) {

						Ghost.visible(document.getElementById(menu).nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling, false);
						Ghost.visible(document.getElementById(menu).nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild, true);
					}
					else {

						Ghost.visible(document.getElementById(menu).nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild, false);
						Ghost.visible(document.getElementById(menu).nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling, true);
					}
				}
			break;
		}
	}
}