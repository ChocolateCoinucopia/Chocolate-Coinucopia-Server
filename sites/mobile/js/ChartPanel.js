// ChartPanel.js




class ChartPanel {

    #blocks;
    #milestones;
    #gasRequests;
    #collections;
    #progress;
    #name;
    chart;


  constructor(name) {
    
    this.#blocks = {};
    this.#milestones = {};
    this.#gasRequests = [];
    this.#collections = 0;
    this.#progress = new ProgressBar(name + '-Progress');
    this.#name = name;
    this.chart = new Chart(this.#name);
    
    this.#build();
  }



  async #build() {

    Promise.all([this.#preparePanel(), this.#prepareChart(), this.#prepareEventListeners(), this.#prepareMilestones(), new ChartPalette(this.#name, this.chart)]).then(success => this.loader('Generate-Time-Series', false)).catch(error => MISC.loadContractError());
  }



  async #preparePanel() {

    this.#loadBase();
    this.#loadQuote({type: 'change'});
  }



  async #prepareChart() {

  	let c = document.getElementById(this.#name);
  	let g = document.getElementById(this.#name + '-Interface');
  	let p = document.getElementById(this.#name + '-Panel');
  	let b = document.body;

  	b.className = window.self === window.top ? 'WC1' : "clear";

  	c.width = c.clientWidth;
  	c.height = c.clientHeight;

  	g.width = c.width;
  	g.height = c.height;

  	c.style.top = (window.scrollY + p.getBoundingClientRect().y + p.getBoundingClientRect().height) + 'px';
  	c.style.width = c.width + 'px';
  	c.style.height = c.height + 'px';

  	g.style.top = c.style.top;
  	g.style.width = c.style.width;
  	g.style.height = c.style.height;

  	b.style.backgroundSize = '100% ' + (p.getBoundingClientRect().height + c.height) + 'px';
  }



  async #prepareEventListeners() {

    document.getElementById(this.#name + '-Panel-Base').addEventListener('change', this.#loadQuote.bind(this));
    document.getElementById(this.#name + '-Panel-Base').addEventListener('keyup', this.#loadQuote.bind(this));
    document.getElementById(this.#name + '-Panel-Curve').addEventListener('change', this.#loadCurve.bind(this));
    document.getElementById(this.#name + '-Panel-Curve').addEventListener('keyup', this.#loadCurve.bind(this));
    document.getElementById(this.#name + '-Panel-Transaction').addEventListener('change', this.#loadTransaction.bind(this));
    document.getElementById(this.#name + '-Panel-Transaction').addEventListener('keyup', this.#loadTransaction.bind(this));

    document.getElementById(this.#name + '-Panel-Add').addEventListener('click', this.generateTimeSeries.bind(this));
  }

  #loadTransaction(e) {

    if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

      var curves = this.#loadCurveOptions();
      var curve = document.getElementById(this.#name + '-Panel-Curve');

      curve.replaceChildren();

      for(let i in curves) curve.appendChild(this.#generateOption(curves[i].text, curves[i].value));

      curve.getElementsByTagName('OPTION')[0].selected = true;

      this.#loadQuote(e);
      this.#loadCurve(e)
    }
  }

  #loadCurveOptions() {

    let txn = document.getElementById(this.#name + '-Panel-Transaction').value;

    switch(txn) {

       case 'Trade': return [{text: 'Price', value: 'Price'}, 
                             {text: 'Market Cap.', value: 'MktCap'}, 
                             {text: 'Volume', value: 'Volume'}, 
                             {text: 'MA', value: 'MA'}, 
                             {text: 'EMA', value: 'EMA'}, 
                             {text: 'MACD', value: 'MACD'}, 
                             {text: 'RSI', value: 'RSI'}, 
                             {text: 'Envelope', value: 'Envelope'}, 
                             {text: 'Supply', value: 'Supply'}, 
                             {text: 'Conche', value: 'Conche'}, 
                             {text: 'Burn', value: 'Burn'}];
       case 'Sell': return [{text: 'Sold', value: 'Sold'}, 
     												{text: 'Volume', value: 'Volume'}, 
  		                      {text: 'Conche', value: 'Conche'}, 
  		                      {text: 'Burn', value: 'Burn'}];
       case 'Conche': return [{text: 'Volume', value: 'Volume'}];
       default: return [{text: 'Volume', value: 'Volume'}, 
                        {text: 'Conche', value: 'Conche'}, 
                        {text: 'Burn', value: 'Burn'}];
    }
  }

  #loadBase() {

    let base = document.getElementById(this.#name + '-Panel-Base');
    let bases = Object.keys(window.keyRing[window.web3.currentProvider.networkVersion]);

      base.replaceChildren();

      for(let i in bases) base.appendChild(this.#generateOption(bases[i], bases[i]));

      base.getElementsByTagName('OPTION')[0].selected = true;
  }

  #loadQuote(e) {

    if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

      let quote = document.getElementById(this.#name + '-Panel-Quote');
      let quotes = this.#loadQuoteOptions();
      
      quote.replaceChildren();

      for(let i in quotes) quote.appendChild(this.#generateOption(quotes[i], quotes[i]));

      quote.getElementsByTagName('OPTION')[0].selected = true;
    }
  }

  #loadQuoteOptions() {

    let base = document.getElementById(this.#name + '-Panel-Base').value;

    switch(document.getElementById(this.#name + '-Panel-Transaction').value) {

      case 'Trade':

        switch(document.getElementById(this.#name + '-Panel-Curve').value) {

          case 'Conche':
          case 'Supply': return [base];
          case 'Burn': return ['ETH'];
          default: return Broker.quotes(base);
        }
      break;
      case 'Transfer':
      case 'TransferFrom':
      case 'Sell':
      case 'Conche':

        switch(document.getElementById(this.#name + '-Panel-Curve').value) {

          case 'Burn': return ['ETH'];
          default: return [base];
        }
      break;
      default: return [base];
    }

    return [base];
  }

  #generateOption(text, value) {

    let e = document.createElement('OPTION');

    e.innerText = text;
    e.value = value;
    
    return e;
  }

  #loadCurve(e) {

    if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

      switch(document.getElementById(this.#name + '-Panel-Curve').value) {

        case 'Volume':
        case 'MA':
        case 'EMA':
        case 'RSI': 
        case 'Envelope':
        case 'Conche':
        case 'Burn': this.loader('Param1', false); break;
        case 'MACD': this.loader('Param2', false); break;
        default: this.loader('Param2', true); break;
      }

      this.#loadQuote(e);
    }
  }

  generateTimeSeries() {

    this.loader('Generate-Time-Series', true);

    this.#progress.reset();
    this.#progress.target(0);

    this.#generateTimeSeriesCurve({ Transaction: document.getElementById(this.#name + '-Panel-Transaction').value,
        					                  Base: document.getElementById(this.#name + '-Panel-Base').value,
        					                  Quote: document.getElementById(this.#name + '-Panel-Quote').value,
        					                  From: moment(document.getElementById(this.#name + '-Panel-From').value).startOf('day').valueOf(),
        					                  To: moment(document.getElementById(this.#name + '-Panel-To').value).startOf('day').add(1, 'day').valueOf(),
        					                  Curve: document.getElementById(this.#name + '-Panel-Curve').value,
        					                  P1: document.getElementById(this.#name + '-Panel-Param1').value,
        					                  P2: document.getElementById(this.#name + '-Panel-Param2').value,
        					                  Color: document.getElementById(this.#name + '-Palette-Color').value
    });
  }

  async capture() {
    
    this.chart.save();
  }



  async #prepareMilestones() {

    let min = MISC.minBlock(), max = (await web3.eth.getBlock('latest')).number;
    let batch = [];

    this.#milestones = {};

    for(let i = min; i <= max; i = i < max ? Math.min(max, i + Math.ceil((max - min)/100)) : i + (max - min)/100) {

      this.#milestones[i] = 0;

      batch.push(this.#prepareMilestone(i));
    } 

    await Promise.all(batch);

    this.#milestones = MISC.swap(this.#milestones);
  }

  async #prepareMilestone(block) {

    this.#milestones[block] = (await web3.eth.getBlock(block)).timestamp*1000;
  }



  async #collectEvents(request) {

    switch(request.Curve) {

      case 'MktCap': await Promise.all([this.#collectPastEvents(request), this.#collectPastEvents(this.#convertRequestSupply(request))]); break;
      case 'Burn':

      	switch(request.Transaction) {

      		case 'Trade': await Promise.all([this.#collectPastEvents(request), this.#collectPastEvents(this.#convertRequestOrder(request))]); break;
      		default: await this.#collectPastEvents(request); break;
      	}
      break;
      default: await this.#collectPastEvents(request); break;
    }
  }

  async #collectNewEvents(request) {

    if(await Broker.activateCoins(request.Base)) {

      Broker.contracts[request.Base][this.#getContract(request)].getPastEvents(this.#getContractEvent(request), {
            fromBlock: 'latest'
        }).on('data', event => this.#appendEvent(request, event));
    }
  }

  async #collectPastEvents(request) {

    let threads = 50, batchSize = 100;
    let d = await this.#domain(request);
    let batch = [];
    let filter = this.#requestFilter(request);

    this.#progress.addTarget(d.Max - d.Min);

    if(await Broker.activateCoins(request.Base)) {

      for(let i = 0; i < threads; i++) batch.push(this.#collectPastEventsBatch(request, d, d.Max - i*batchSize, batchSize, threads, filter));
    }

    await Promise.all(batch);
  }

  async #collectPastEventsBatch(request, domain, index, size, threads, filter = {}) {

    if(index < domain.Min) return true;

    this.#progress.add(size);

    await Broker.contracts[request.Base][this.#getContract(request)].getPastEvents(this.#getContractEvent(request), {
        filter: filter,
        fromBlock: Math.max(index - (size - 1), domain.Min),
        toBlock: index
    }).then(async (events) => {

      let batch = [];

      for(let i = events.length - 1; i >= 0; i--) batch.push(this.#appendEvent(request, events[i]));

      await Promise.all(batch);

    }).catch(error => console.error(error));

    return this.#collectPastEventsBatch(request, domain, index - size*threads, size, threads);
  }

  #getContract(request) {

  	switch(request.Curve) {

      case 'Supply': 
      case 'Conche': return 'Coin';
      default:

      	switch(request.Transaction) {

          case 'Trade': return 'DEX';
          case 'Order': return 'DEX';
  		    case 'Sell': return 'ICO';
  		    default: return 'Coin';
  		  }
  		 break;
    }

    return 'Coin';
  }

  #getContractEvent(request) {

    switch(request.Curve) {

      case 'Supply': 
      case 'Conche': return 'Conche';
      default: return request.Transaction.includes('Transfer') ? 'TransferDetails' : request.Transaction;
    }

    return request.Transaction.includes('Transfer') ? 'TransferDetails' : request.Transaction;
  }

  #convertRequestSupply(request) {

    return { Transaction: request.Transaction,
                    Base: request.Base,
                    Quote: request.Quote,
                    From: request.From,
                    To: request.To,
                    Curve: 'Supply',
                    P1: request.P1,
                    P2: request.P2,
                    Color: request.Color
    };
  }

  #convertRequestOrder(request) {

    return { Transaction: 'Order',
                    Base: request.Base,
                    Quote: request.Quote,
                    From: request.From,
                    To: request.To,
                    Curve: request.Curve,
                    P1: request.P1,
                    P2: request.P2,
                    Color: request.Color
    };
  }

  #convertRequestTrade(request) {

    return { Transaction: 'Trade',
                    Base: request.Base,
                    Quote: request.Quote,
                    From: request.From,
                    To: request.To,
                    Curve: request.Curve,
                    P1: request.P1,
                    P2: request.P2,
                    Color: request.Color
    };
  }

  #requestFilter(request) {

  	switch(request.Curve) {

  		case 'Conche':

  			switch(request.Transaction) {

  				case 'Trade': return { _coin: window.keyRing[window.web3.currentProvider.networkVersion][request.Base].Coin.Address,
  															 _transaction: ('TRADE').hex()
  														 };
  				case 'Transfer': return {	_coin: window.keyRing[window.web3.currentProvider.networkVersion][request.Base].Coin.Address,
  																	_transaction: [('TRANSFER').hex(), ('SHARE').hex()]
  																};
  				case 'TransferFrom': return {_coin: window.keyRing[window.web3.currentProvider.networkVersion][request.Base].Coin.Address,
  																		 _transaction: ('TRANSFERFROM').hex()
  																	 };
  				case "Sell": return {_coin: window.keyRing[window.web3.currentProvider.networkVersion][request.Base].Coin.Address,
  														 _transaction: ('SHARE').hex()
  													 };
  				default: return {};
  			}
  		break;
  		default: return {};
  	}

  	return {};
  }



  #appendEvent(request, event) {

  	switch(request.Curve) {

  		case 'Conche':
  		case 'Supply': this.#collectConche(request, event); break;
  		default:

  			switch(request.Transaction) {

  		    case 'Transfer':
  		    case 'TransferFrom': this.#collectTransfer(request, event); break;
  		    case 'Conche': this.#collectConche(request, event); break;
  		    case 'Sell': this.#collectSell(request, event); break;
  		    case 'Order': this.#collectOrder(request, event); break;
  		    case 'Trade': this.#collectTrade(request, event); break;
  		    default: break;
  		  }
    	break;
  	}
  }

  #collectTransfer(request, event) {

    switch(event.returnValues._transaction.ascii()) {

    	case 'TRANSFER':

    		if(this.#isGasRequest(request)) this.#collectPastGasEvents(request, event);
    		else this.#appendToBlock(request.Base + '-Transfer-Volume', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+');
    	break;
    	case 'SHARE':

    		if(event.returnValues._from != keyRing[web3.currentProvider.networkVersion][request.Base].ICO.Address) {

    			if(this.#isGasRequest(request)) this.#collectPastGasEvents(request, event);
    			else this.#appendToBlock(request.Base + '-Transfer-Volume', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+');
    		}
    	break;
    	case 'TRANSFERFROM':

    		if(this.#isGasRequest(request)) this.#collectPastGasEvents(request, event);
    		else this.#appendToBlock(request.Base + '-TransferFrom-Volume', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+');
    	break;
    	default: break;
    }
  }

  #collectConche(request, event) {

    switch(request.Curve) {

      case 'Supply': this.#appendToBlock(request.Base + '-Supply', event.returnValues._timestamp, event.returnValues._supply.eth().f(), 'Max'); break;
      case 'Volume': this.#appendToBlock(request.Base + '-' + request.Transaction + '-' + request.Curve, event.returnValues._timestamp, event.returnValues._value.eth().f(), '+'); break;
      case 'Conche': 

      	switch(request.Transaction) {

      		case 'Sell': this.#appendToBlock(request.Base + '-Sales-Conche', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+'); break;
      		case 'Transfer': 

      		switch(event.returnValues._transaction.ascii()) {

  			  	case 'SHARE': if(event.returnValues._from != window.keyRing[window.web3.currentProvider.networkVersion][request.Base].ICO.Address) this.#appendToBlock(request.Base + '-' + request.Transaction + '-Conche', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+'); break;
  			  	default: this.#appendToBlock(request.Base + '-' + request.Transaction + '-Conche', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+'); break;
  			  }
      		default: this.#appendToBlock(request.Base + '-' + request.Transaction + '-Conche', event.returnValues._timestamp, event.returnValues._value.eth().f(), '+'); break; 
      	}
      	break;
      default: break;
    }
  }

  #collectSell(request, event) {

    if(this.#isGasRequest(request)) this.#collectPastGasEvents(request, event);
    else {
    	this.#appendToBlock(request.Base + '-Sales-Volume', event.returnValues._timestamp, event.returnValues._amount.eth().f(), '+');
    	this.#appendToBlock(request.Base + '-Sold', event.returnValues._timestamp, event.returnValues._total.eth().f(), '+');
    } 
  }


  #collectOrder(request, event) {

    let bidask;

    if(this.#activeEventTransaction(request, event.returnValues._base, event.returnValues._quote, true)) {

      if(this.#isGasRequest(request)) {

      	if(event.returnValues._fulfilled == 0) this.#collectPastGasEvents(this.#convertRequestTrade(request), event);
      }
      else if(event.returnValues._active) {

        if(this.#isInverted(request, event.returnValues._base, event.returnValues._quote, true)) event = MISC.invertOrderEvent(event);
      
        bidask = event.returnValues._order.ascii() == 'BUY' ? 'Bid' : event.returnValues._order.ascii() == 'SELL' ? 'Ask' : event.returnValues._order.ascii(); 

        this.#appendToBlock(request.Base + '-' + request.Quote + '-Order-' + bidask, event.returnValues._timestamp, event.returnValues._quantity.eth().f()*event.returnValues._limit.D(event.returnValues._E), 'Max');
        this.#appendToBlock(request.Base + '-' + request.Quote + '-Order-' + bidask + '-Volume', event.returnValues._timestamp, event.returnValues._quantity.eth().f(), '+');
      }
    }
  }

  #collectTrade(request, event) {

    if(this.#activeEventTransaction(request, event.returnValues._base, event.returnValues._quote, true)) {

      if(this.#isGasRequest(request)) this.#collectPastGasEvents(request, event);
      else {

        if(this.#isInverted(request, event.returnValues._base, event.returnValues._quote, true)) event = MISC.invertTradeEvent(event);
      
        this.#appendToBlock(request.Base + '-' + request.Quote + '-Trade', event.returnValues._timestamp, event.returnValues._quantity.eth().f()*event.returnValues._price.D(event.returnValues._E), '+');
        this.#appendToBlock(request.Base + '-' + request.Quote + '-Trade-Volume', event.returnValues._timestamp, event.returnValues._quantity.eth().f(), '+');
      }
    }
  }

  #activeEventTransaction(request, base, quote, hex = false) {

    base = hex ? base.ascii() : base;
    quote = hex ? quote.ascii() : quote;

    return request.Base == base && request.Quote == quote || request.Base == quote && request.Quote == base;
  }

  #isInverted(request, base, quote, hex = false) {

    return MISC.isInverted(request.Base, request.Quote, base, quote, hex);
  }

  #isGasRequest(request) {

    return request.Curve == 'Burn';
  }

  #collectPastGasEvents(request, event) {

    this.#gasRequests.push({'Transaction': event.transactionHash, 'Variable': request.Base + (request.Transaction == 'Trade' ? '-' + request.Quote : "") + '-' + (request.Transaction == 'Sell' ? 'Sales' : request.Transaction) + '-' + request.Curve, 'Timestamp': event.returnValues._timestamp, 'Base': event.returnValues._gasBase.eth().f()});

    this.#collectPastGasEventsBatch();
  }

  async #collectPastGasEventsBatch() {

    if(this.#gasRequests.length == 0 || this.#collections >= 100) return true;

    let batch = [];

    while(this.#gasRequests.length > 0 && this.#collections++ < 100) {

    	batch.push(this.#appendGasEvent(this.#gasRequests.shift()));
    }

    await Promise.all(batch);

    this.#collectPastGasEventsBatch();
  }

  async #appendGasEvent(gasRequest) {

    this.#appendToBlock(gasRequest.Variable, gasRequest.Timestamp, (await window.web3.eth.getTransactionReceipt(gasRequest.Transaction)).gasUsed.f()*gasRequest.Base, '+');

    this.#collections--;
  }



  #generateTimeSeriesCurve(request) {

  	switch(request.Transaction) {

  		case 'Trade': this.#generateTradeTimeSeriesCurve(request); break;
  		case 'Sell': this.#generateSaleTimeSeriesCurve(request); break;
  		default: this.#generateTransferTimeSeriesCurve(request); break;
  	}
  }

  async #generateTransferTimeSeriesCurve(request) {

  	try {

  	  await this.#collectEvents(this.#convertRequestFrom(request));
  	  this.#appendTimeSeries(this.#generateTimeSeriesSumCurve(request));
  	} catch(error) { this.#progress.reset(); }

    this.#blocks = {};

    this.loader('Generate-Time-Series', false);
  }

  async #generateSaleTimeSeriesCurve(request) {

  	try {

  	  await this.#collectEvents(this.#convertRequestFrom(request));

  	  switch(request.Curve) {

  	  	case 'Sold': this.#appendTimeSeries(this.#generateTimeSeriesSoldCurve(request)); break;
  	  	default: this.#appendTimeSeries(this.#generateTimeSeriesSumCurve(request)); break;
  	  }
  	} catch(error) { this.#progress.reset(); }

    this.#blocks = {};

    this.loader('Generate-Time-Series', false);
  }

  async #generateTradeTimeSeriesCurve(request) {

  	let ts;

  	try {

  	  await this.#collectEvents(this.#convertRequestFrom(request));

  	  switch(request.Curve) {

  	    case 'Price': this.#appendTimeSeries(this.#generateTimeSeriesPriceCurve(request)); break;
  	    case 'MktCap': this.#appendTimeSeries(this.#generateTimeSeriesMktCapCurve(request)); break;
  	    case 'Volume': this.#appendTimeSeries(this.#generateTimeSeriesSumCurve(request)); break;
  	    case 'MA': this.#appendTimeSeries(this.#generateTimeSeriesMACurve(request)); break;
  	    case 'EMA': this.#appendTimeSeries(this.#generateTimeSeriesEMACurve(request)); break;
  	    case 'MACD': this.#appendTimeSeries(this.#generateTimeSeriesMACDCurve(request)); break;
  	    case 'RSI': this.#appendTimeSeries(this.#generateTimeSeriesRSICurve(request)); break;
  	    case 'Envelope': 

  	    	ts = this.#generateTimeSeriesEnvelopeCurve(request); 

  	    	this.#appendTimeSeries(ts.Upper);
  	    	this.#appendTimeSeries(ts.Lower);
  	    break;
  	    case 'Supply': this.#appendTimeSeries(this.#generateTimeSeriesSupplyCurve(request)); break;
  	    case 'Conche': this.#appendTimeSeries(this.#generateTimeSeriesSumCurve(request)); break;
  	    case 'Burn': this.#appendTimeSeries(this.#generateTimeSeriesSumCurve(request)); break;
  	    default: break;
  	  }
    } catch(error) { this.#progress.reset(); }

    this.#blocks = {};

    this.loader('Generate-Time-Series', false);
  }

  #appendTimeSeries(ts) {

    this.#progress.reset();

  	this.chart.add(ts.Data, ts.Label, ts.Units, ts.Color);
  }

  #generateTimeSeriesSumCurve(request) {

  	let variable = this.#generateTimeSeriesSumCurveVariable(request);
  	let target = request.Transaction == 'Trade' && request.Curve == 'Volume' ? 'Base' : 'Quote';
  	let day = 24*60*60*1000;
  	let sum = [];
    let volume = this.#getTimeSeries(variable, moment(request.From).subtract(request.P1, 'day').valueOf(), request.To);

    for(let i in volume) {

    	while(sum.length > 0 && sum[0].x + request.P1*day < volume[i].x) sum.shift();

    	sum.push({x: volume[i].x, y: volume[i].y});

    	volume[i].y = sum.reduce((a, b) => { return {y: a.y + b.y} }).y;
    }

    while(volume.length > 0 && volume[0].x < request.From) volume.shift();

    return {Data: volume, Label: variable + '(' + request.P1 + ')', Units: request[target], Color: request.Color};
  }

  #generateTimeSeriesSumCurveVariable(request) {

  	switch(request.Transaction) {

  		case 'Trade': 

  			switch(request.Curve) {

  				case 'Conche': return request.Base + '-' + request.Transaction + '-' + request.Curve;
  				default: return request.Base + '-' + request.Quote + '-' + request.Transaction + '-' + request.Curve;
  			}
  		break;
  		case 'Sell': 

  			switch(request.Curve) {

  				case 'Sold': return request.Base + '-Sold';
  				default: return request.Base + '-Sales-' + request.Curve;
  			}
  		break;
  		default: return request.Base + '-' + request.Transaction + '-' + request.Curve;
  	}

    return this.#generateTimeSeriesSumCurveVariable(request);
  }

  #generateTimeSeriesSoldCurve(request) {

    let sold = this.#getTimeSeries(request.Base + '-Sold', request.From, request.To);

    return {Data: sold, Label: request.Base + '-Sold', Units: request.Quote, Color: request.Color};
  }

  #generateTimeSeriesPriceCurve(request) {

    let price = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction, request.From, request.To);
    let volume = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction + '-Volume', request.From, request.To);

    for(let i in price) price[i].y /= volume[i] ? volume[i].y : 1;

    return {Data: price, Label: request.Base + '-' + request.Quote + '-Price', Units: request.Quote, Color: request.Color};
  }

  #generateTimeSeriesMACurve(request) {

  	let day = 24*60*60*1000;
  	let ma = [];
    let price = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction, moment(request.From).subtract(request.P1, 'day').valueOf(), request.To);
    let volume = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction + '-Volume', moment(request.From).subtract(request.P1, 'day').valueOf(), request.To);

    for(let i in price) {

    	while(ma.length > 0 && ma[0].x + request.P1*day < price[i].x) ma.shift();

    	ma.push({x: price[i].x, y: price[i].y/(volume[i] ? volume[i].y : 1)});

    	price[i].y = ma.reduce((a, b) => {return {y: a.y + b.y}}).y/ma.length;
    }

    while(price.length > 0 && price[0].x < request.From) price.shift();

    return {Data: price, Label: request.Base + '-' + request.Quote + '-Price-MA(' + request.P1 + ')', Units: request.Quote, Color: request.Color};
  }

  #generateTimeSeriesEMACurve(request) {

  	let max;
  	let day = 24*60*60*1000;
  	let s = 2.0/(request.P1.f() + 1);
  	let pp = [];
    let price = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction, moment(request.From).subtract(request.P1 + 1, 'day').valueOf(), request.To);
    let volume = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction + '-Volume', moment(request.From).subtract(request.P1 + 1, 'day').valueOf(), request.To);

    if(price.length > 0 && volume.length > 0) price[0].y /= volume[0] ? volume[0].y : 1;

    for(let i = 1; i < price.length;) {

    	pp = [{x: price[i].x, y: price[i].y/(volume[i] ? volume[i].y : 1)}];
    	max = moment(pp[0].x).endOf('day').valueOf();

    	for(let j = i + 1; j < price.length && price[j].x <= max; j++) pp.push({x: price[j].x, y: price[j].y/(volume[j] ? volume[j].y : 1)});
    	for(let j = 0; j < pp.length; i++, j++) price[i].y = (s/pp.length)*pp[j].y + (1 - s/pp.length)*price[i - 1].y;
    }

    while(price.length > 0 && price[0].x < request.From) price.shift();

    return {Data: price, Label: request.Base + '-' + request.Quote + '-Price-EMA(' + request.P1 + ')', Units: request.Quote, Color: request.Color};
  }

  #generateTimeSeriesMACDCurve(request) {

  	let ma1 = this.#generateTimeSeriesMACurve(request).Data;
  	let ma2 = this.#generateTimeSeriesMACurve(this.#convertRequestP1(request)).Data;

  	for(let i in ma1) ma1[i].y =ma1[i].y/ ma2[i].y*100;

  	return {Data: ma1, Label: request.Base + '-' + request.Quote + '-Price-MACD(' + request.P1 + ', ' + request.P2 + ')', Units: '%', Color: request.Color};
  }

  #generateTimeSeriesRSICurve(request) {

  	let p0, p1;
  	let day = 24*60*60*1000;
  	let u = [], d = [];
    let price = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction, moment(request.From).subtract(request.P1 + 1, 'day').valueOf(), request.To);
    let volume = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction + '-Volume', moment(request.From).subtract(request.P1 + 1, 'day').valueOf(), request.To);

    if(price.length > 0) {

    	p0 = price[0].y/(volume[0] ? volume[0].y : 1);
    	price[0].y = 50;
    }

    for(let i = 1; i < price.length; i++) {

    	p1 = price[i].y/(volume[i] ? volume[i].y : 1);

    	while(u.length > 0 && u[0].x + request.P1*day < price[i].x) u.shift();
    	while(d.length > 0 && d[0].x + request.P1*day < price[i].x) d.shift();

    	u.push({x: price[i].x, y: p1 - p0 > 0 ? p1 - p0 : 0});
    	d.push({x: price[i].x, y: p1 - p0 < 0 ? p0 - p1 : 0});

    	price[i].y = 100 - 100/(1 + (u.reduce((a, b) => {return {y: a.y + b.y}}).y/u.length)/(d.reduce((a, b) => {return {y: a.y + b.y}}).y/d.length));
    	price[i].y = isNaN(price[i].y) ? price[i - 1].y : price[i].y;

    	p0 = p1;
    }

    while(price.length > 0 && price[0].x < request.From) price.shift();

    return {Data: price, Label: request.Base + '-' + request.Quote + '-Price-RSI(' + request.P1 + ')', Units: '%', Color: request.Color};
  }

  #generateTimeSeriesEnvelopeCurve(request) {

  	let mean, s, ss;
  	let day = 24*60*60*1000;
  	let pp = [], e = {'U': [], 'L': []};
    let price = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction, moment(request.From).subtract(request.P1, 'day').valueOf(), request.To);
    let volume = this.#getTimeSeries(request.Base + '-' + request.Quote + '-' + request.Transaction + '-Volume', moment(request.From).subtract(request.P1, 'day').valueOf(), request.To);

    for(let i in price) {

    	ss = [];

    	while(pp.length > 0 && pp[0].x + request.P1*day < price[i].x) pp.shift();

    	pp.push({x: price[i].x, y: price[i].y/(volume[i] ? volume[i].y : 1)});

    	mean = pp.reduce((a, b) => {return {y: a.y + b.y}}).y/pp.length;

    	pp.forEach(a => ss.push(Math.abs(a.y - mean)));

    	s = ss.length > 1 ? ss.reduce((a, b) => a + b)/Math.sqrt(ss.length - 1) : 0;

    	e.U.push({x: pp[pp.length - 1].x, y: mean + 2*s});
    	e.L.push({x: pp[pp.length - 1].x, y: mean - 2*s});
    }

    while(e.U.length > 0 && e.U[0].x < request.From) e.U.shift();
    while(e.L.length > 0 && e.L[0].x < request.From) e.L.shift();

    return {'Upper': {Data: e.U, Label: request.Base + '-' + request.Quote + '-Price-Upper-Envelope(' + request.P1 + ')', Units: request.Quote, Color: request.Color}, 'Lower': {Data: e.L, Label: request.Base + '-' + request.Quote + '-Price-Lower-Envelope(' + request.P1 + ')', Units: request.Quote, Color: request.Color}};
  }

  #generateTimeSeriesSupplyCurve(request) {

    let supply = this.#getTimeSeries(request.Base + '-Supply', request.From, request.To);

    return {Data: supply, Label: request.Base + '-Supply', Units: request.Quote, Color: request.Color};
  }

  #generateTimeSeriesMktCapCurve(request) {

    let ts = {Price: {Data: this.#generateTimeSeriesPriceCurve(request).Data, Index: 0}, Supply: {Data: this.#generateTimeSeriesSupplyCurve(request).Data, Index: 0}};
    let mktcap = [];

    for(let curve = ts.Price.Data[0].x <= ts.Supply.Data[0].x ? ['Price', 'Supply'] : ['Supply', 'Price']; ts[curve[0]].Index < ts[curve[0]].Data.length; ts[curve[0]].Index++, ts[curve[1]].Index -= ts[curve[1]].Index == ts[curve[1]].Data.length && ts[curve[0]].Index < ts[curve[0]].Data.length ? 1 : 0, curve = curve.reverse()) {
    	for(; ts[curve[1]].Index < ts[curve[1]].Data.length && (ts[curve[0]].Index == ts[curve[0]].Data.length - 1 || ts[curve[1]].Data[ts[curve[1]].Index].x < ts[curve[0]].Data[ts[curve[0]].Index + 1].x); ts[curve[1]].Index++) {

    		if(ts[curve[0]].Data[ts[curve[0]].Index].x < ts[curve[1]].Data[0].x) mktcap.push({x: ts[curve[0]].Data[ts[curve[0]].Index].x, y: 0});
    		else mktcap.push({x: ts[curve[1]].Data[ts[curve[1]].Index].x, y: ts[curve[0]].Data[ts[curve[0]].Index].y*ts[curve[1]].Data[ts[curve[1]].Index].y});
    	}
    }

    return {Data: mktcap, Label: request.Base + '-' + request.Quote + '-MktCap', Units: request.Quote, Color: request.Color};
  }

  #convertRequestFrom(request) {

    switch(request.Curve) {

        case 'Volume': 
        case 'MA': 
        case 'EMA': 
        case 'Envelope': 
        case 'Conche': 
        case 'Burn': return { Transaction: request.Transaction,
                              Base: request.Base,
                              Quote: request.Quote,
                              From: moment(request.From).subtract(Math.max(1, request.P1.f()), 'day').startOf('day').valueOf(),
                              To: request.To,
                              Curve: request.Curve,
                              P1: request.P1,
                              P2: request.P2,
                              Color: request.Color
                            };
        case 'RSI': return {  Transaction: request.Transaction,
                              Base: request.Base,
                              Quote: request.Quote,
                              From: moment(request.From).subtract(Math.max(1, request.P1.f()) + 1, 'day').startOf('day').valueOf(),
                              To: request.To,
                              Curve: request.Curve,
                              P1: request.P1,
                              P2: request.P2,
                              Color: request.Color
                            };
        case 'MACD': return { Transaction: request.Transaction,
                              Base: request.Base,
                              Quote: request.Quote,
                              From: moment(request.From).subtract(Math.max(1, request.P1.f(), request.P2.f()), 'day').startOf('day').valueOf(),
                              To: request.To,
                              Curve: request.Curve,
                              P1: request.P1,
                              P2: request.P2,
                              Color: request.Color
                            };
        default: return request;
      }

      return request;
  }

  #convertRequestP1(request) {

    return { Transaction: request.Transaction,
                    Base: request.Base,
                    Quote: request.Quote,
                    From: request.From,
                    To: request.To,
                    Curve: request.Curve,
                    P1: request.P2,
                    P2: request.P2,
                    Color: request.Color
    };
  }



  #appendToBlock(variable, ts, item, type = '=') {

    if(!this.#blocks[variable]) this.#blocks[variable] = {};

    if(!this.#blocks[variable][ts*1000]) this.#blocks[variable][ts*1000] = item;
    else {

      switch(type) {

        case '+': this.#blocks[variable][ts*1000] += item; break;
        case '-': this.#blocks[variable][ts*1000] -= item; break;
        case '*': this.#blocks[variable][ts*1000] *= item; break;
        case '/': this.#blocks[variable][ts*1000] /= item; break;
        case 'Min': this.#blocks[variable][ts*1000] = Math.min(item, this.#blocks[variable][ts*1000]); break;
        case 'Max': this.#blocks[variable][ts*1000] = Math.max(item, this.#blocks[variable][ts*1000]); break;
        default: this.#blocks[variable][ts*1000] = item; break;
      }
    }
  }

  #getTimeSeries(variable, start = null, end = null) {

    let timeseries = [];
    let x = Object.keys(MISC.clone(this.#blocks[variable])).sort((a, b) => a.i() > b.i() ? 1 : -1);
    let min = start ? start : moment(document.getElementById('Chart-Panel-From').value).startOf('day').valueOf().i();
    let max = end ? end : moment(document.getElementById('Chart-Panel-To').value).endOf('day').valueOf().i();

    for(let i in x) if(min <= x[i] && x[i] <= max) timeseries.push({'x': x[i].i(), 'y': this.#blocks[variable][x[i]]});

    return timeseries;
  }

  #fromBlock(x) {

    return x.i() - MISC.minBlock();
  }

  #toBlock(x) {

    return x.i() + MISC.minBlock();
  }



  async #domain(request) {

    let chunks = Object.keys(this.#milestones);
    let start = 0, stop = chunks.length - 1;

    for(; start < chunks.length && chunks[start] < request.From; start++) {}
    for(; stop >= 0 && chunks[stop] > request.To; stop--) {}

    return {Min: Math.max(this.#milestones[chunks[Math.max(0, --start)]], window.keyRing[window.web3.currentProvider.networkVersion][request.Base][this.#getContract(request)].Block), Max: ++stop == chunks.length ? (await window.web3.eth.getBlock('latest')).number.i() : this.#milestones[chunks[stop]].i()};
  }



  loader(menu, visible = true) {

    switch(menu) {

      case 'Param1':

        $('#Chart-Panel-Params2').hide();
        visible ? $('#Chart-Panel-Params').hide() : $('#Chart-Panel-Params').show();
        visible ? $('#Chart-Panel-Params1').hide() : $('#Chart-Panel-Params1').show();
      break;
      case 'Param2':

        visible ? $('#Chart-Panel-Params').hide() : $('#Chart-Panel-Params').show();
        visible ? $('#Chart-Panel-Params1').hide() : $('#Chart-Panel-Params1').show();
        visible ? $('#Chart-Panel-Params2').hide() : $('#Chart-Panel-Params2').show();
      break;
      case 'Generate-Time-Series':

        visible ? $('#Chart-Panel-Add').hide() : $('#Chart-Panel-Add').show();
        visible ? $('#Chart-Panel-Coin').show() : $('#Chart-Panel-Coin').hide()
      break;
      default: break;
    }
  }
}