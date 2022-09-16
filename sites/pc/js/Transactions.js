// Transactions.js



class Transactions {

	#active;
	#milestones;
	#activeRequest;
	#transactions;
	#activeThreads;
	#batchSize;
	#progress;
    #key;
    #reverse;
	#threads;


	constructor(threads = 500) {

		this.#active = false;
		this.#milestones = {};
		this.#activeRequest = {};
		this.#transactions = {}
	    this.#activeThreads = 0;
	    this.#batchSize = 100;
	    this.#progress = new ProgressBar('History-Progress');
    	this.#key = 'Confirmed';
    	this.#reverse = true;
		this.#threads = threads;

    	this.#build();
	}



	async #build() {

		Promise.all([this.#preparePanel(), this.#prepareEventListeners(), this.#prepareMilestones(), this.#activateCoins()]).then(success => {

			this.#active = true;

			this.update();

		}).catch(error => MISC.loadContractError());
	}



	async #preparePanel() {

		this.#prepareBase();
	}

	#prepareBase() {

		let base = document.getElementById('History-Panel-Base');
		let bases = ['Any', ...Broker.coins()];

		base.replaceChildren();

		for(let i in bases) base.appendChild(this.#generateOption(bases[i], bases[i]));

		if(base.getElementsByTagName('OPTION').length) base.getElementsByTagName('OPTION')[0].selected = true;

		this.#loadQuote({type: 'change'});
	}



	async #prepareEventListeners() {

		document.getElementById('History-Panel-Transaction').addEventListener('change', this.#loadTransaction.bind(this));
		document.getElementById('History-Panel-Transaction').addEventListener('keyup', this.#loadTransaction.bind(this));
		document.getElementById('History-Panel-Order').addEventListener('change',  this.#updateHandler.bind(this));
		document.getElementById('History-Panel-Order').addEventListener('keyup',  this.#updateHandler.bind(this));
		document.getElementById('History-Panel-Base').addEventListener('change', this.#loadQuote.bind(this));
		document.getElementById('History-Panel-Base').addEventListener('keyup', this.#loadQuote.bind(this));
		document.getElementById('History-Panel-Quote').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('History-Panel-Quote').addEventListener('keyup', this.#updateHandler.bind(this));
		document.getElementById('History-Panel-From').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('History-Panel-From').addEventListener('keyup', this.#updateHandler.bind(this));
		document.getElementById('History-Panel-To').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('History-Panel-To').addEventListener('keyup', this.#updateHandler.bind(this));
	
		this.#prepareHeaderEventListeners();
  	}

  	#updateHandler(e) {

  		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

  			if(this.#active) this.update();
  		}
  	}

	#loadTransaction(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			this.#loadCoinLabel();
			this.#loadOrder(e);
			this.#loadQuote(e, false);

			if(this.#active) this.update();
		}
	}

	#loadOrder(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			let order = document.getElementById('History-Panel-Order');
			let orders = this.#loadOrderOptions();

			order.replaceChildren();

			if(orders.length) {

				for(let i in orders) order.appendChild(this.#generateOption(orders[i], orders[i]));

				if(order.getElementsByTagName('OPTION').length) order.getElementsByTagName('OPTION')[0].selected = true;

				this.display('Order', true);
			}
			else this.display('Order', false);
		}
	}

	#loadQuote(e, update = true) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			let quote = document.getElementById('History-Panel-Quote');
			let quotes = this.#loadQuoteOptions();

			quote.replaceChildren();

			if(quotes.length) {

				for(let i in quotes) quote.appendChild(this.#generateOption(quotes[i], quotes[i]));

				if(quote.getElementsByTagName('OPTION').length) quote.getElementsByTagName('OPTION')[0].selected = true;

				this.display('Quote', true);
			}
			else this.display('Quote', false);

			if(this.#active && update) this.update();
		}
	}

	#prepareHeaderEventListeners() {

		let h = document.getElementById('History-Headers').children;

		for(let i = 0; i < h.length; i++) h[i].firstElementChild.addEventListener('click', this.organize.bind(this, h[i].firstElementChild.firstElementChild.getAttribute('key')));
	}

	#loadOrderOptions() {

		switch(document.getElementById('History-Panel-Transaction').value) {

			case 'Any': return ['Any', 'BUY', 'SELL', 'SEND', 'RECEIVE'];
		  	case 'Trade': return ['Any', 'BUY', 'SELL'];
		  	case 'Transfer':
		  	case 'TransferFrom': return ['Any', 'SEND', 'RECEIVE'];
		  	case 'ICO': return ['BUY'];
		  	default: return [];
		}

		return [];
 	}

 	#loadCoinLabel() {

 		let e = document.getElementById('History-Panel-Coin');

 		switch(document.getElementById('History-Panel-Transaction').value) {

 			case 'Trade':

 				e.className = 'pl-11 f20';
 				e.innerText = 'Base:';

 				document.getElementById('History-Panel-Header').innerText = 'Base';
 			break;
 			default:

 				e.className = 'pl-13 f20';
 				e.innerText = 'Coin:';

 				document.getElementById('History-Panel-Header').innerText = 'Coin';
 			break;
 		}

 		e.append('\u00A0');
 	}

  	#loadQuoteOptions() {

		switch(document.getElementById('History-Panel-Transaction').value) {

			case 'ICO': return ['ETH'];
			case 'Any':
		  	case 'Trade':

		  		switch(document.getElementById('History-Panel-Base').value) {

		  			case 'Any': return ['Any', 'ETH'];
		  			default: return ['Any', ...Broker.quotes(document.getElementById('History-Panel-Base').value)];
		  		}
		  	default: return [];
		}

		return [];
 	}

	#generateOption(text, value) {

		let e = document.createElement('OPTION');

		e.innerText = text;
		e.value = value;

		return e;
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



	async #activateCoins() {

		let coins = Broker.coins();

		if(await Broker.activateCoins(...coins)) {

			coins.forEach(async coin => {

				if(Broker.contracts[coin].Coin) {

					Broker.contracts[coin].Coin.events.TransferDetails({
							filter: {'_from': window.account},
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshTransfer(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));

					Broker.contracts[coin].Coin.events.TransferDetails({
							filter: {'_to': window.account},
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshTransfer(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));

					Broker.contracts[coin].Coin.events.Conche({
							filter: {'_chocolatier': window.account },
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshConche(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));
				}

				if(Broker.contracts[coin].ICO) {

					Broker.contracts[coin].ICO.events.Sell({
							filter: {'_buyer': window.account },
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshICO(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));
				}

				if(Broker.contracts[coin].DEX) {

					Broker.contracts[coin].DEX.events.Trade({
							filter: {'_addressA': window.account },
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshTrade(this.#appendEventItem(event, 'Key', this.#activeRequest.Key)));

					Broker.contracts[coin].DEX.events.Trade({
							filter: {'_addressB': window.account },
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshTrade(this.#appendEventItem(event, 'Key', this.#activeRequest.Key)));
				}
			});

			return true;
		}

		throw TypeError('Failed to load contracts.');
	}



	async update() {

		this.display('History', true);

		let request = this.#getRequest();
		let coins = request.Base == 'Any' ? Broker.coins() : [request.Base];
		let icos = this.#getICOs(...coins);
		let exchanges = request.Quote == 'Any' ? this.#getExchanges(...coins) : [Broker.dex(request.Base, request.Quote)];
		let requests = this.#requestCount(request, coins, icos, exchanges);
		let transactions = document.getElementById('History-Transactions');

		this.#progress.reset();
		this.#progress.target(0);

		this.#activeRequest = MISC.clone(request);
		this.#activeThreads = 0;

		this.display('Lock');

		transactions.replaceChildren();

		this.display('Unlock');

		this.#transactions = {};

		switch(request.Transaction) {

			case 'Transfer':
			case 'TransferFrom':

				switch(request.Order) {

					case 'Any':

						coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_from: window.account}));
						coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_to: window.account}));
					break;
					case 'SEND': coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_from: window.account})); break;
					case 'RECEIVE': coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_to: window.account})); break;
					default: break;
				}
				break;
			case 'Conche': coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_chocolatier: window.account})); break;
			case 'ICO': icos.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_buyer: window.account})); break;
			case 'Trade': 

				exchanges.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_addressA: window.account}));
				exchanges.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestBase(request, coin), Math.min(100, Math.ceil(this.#threads/requests)), {_addressB: window.account}));
				break;
			case 'Any':

				switch(request.Order) {

					case 'Any':

						coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Transfer', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_from: window.account}));
						coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Transfer', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_to: window.account}));
						coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Conche', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_chocolatier: window.account}));
						icos.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'ICO', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_buyer: window.account}));
						exchanges.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Trade', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_addressA: window.account}));
						exchanges.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Trade', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_addressB: window.account}));
					break;
					case 'SEND': coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Transfer', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_from: window.account})); break;
					case 'RECEIVE': coins.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Transfer', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_to: window.account})); break;
					case 'BUY': icos.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'ICO', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_buyer: window.account}));
					case 'SELL':

						exchanges.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Trade', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_addressA: window.account}));
						exchanges.forEach(async (coin) => this.#collectEvents(coin, this.#convertRequestTransactionBase(request, 'Trade', coin), Math.min(100, Math.ceil(this.#threads/requests)), {_addressB: window.account}));
					break;
					default: break;
				}
				break;
			break;
			default: break;
		}
	}

	#getICOs(...coins) {

		let icos = [], addresses = {};

		coins.forEach(coin => {

			if(window.keyRing[window.web3.currentProvider.networkVersion][coin].ICO && !addresses[window.keyRing[window.web3.currentProvider.networkVersion][coin].ICO.Address]) {

				icos.push(coin);
				addresses[window.keyRing[window.web3.currentProvider.networkVersion][coin].ICO.Address] = true;
			}
		});

		return icos;
	}

	#getExchanges(...coins) {

		let exchanges = [], addresses = {};

		coins.forEach(coin => {

			if(window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX && !addresses[window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address]) {

				exchanges.push(coin);
				addresses[window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address] = true;
			}
		});

		return exchanges;
	}

	async #collectEvents(coin, request, threads, filter = {}) {

		let d = await this.#domain(request);

		await this.#progress.addTarget(d.Max - d.Min);

		this.#activeThreads += threads;

		for(let i = 0; i < threads; i++) this.#collectEventsBatch(coin, request, threads, d, d.Max - i*this.#batchSize, filter);
	}

	async #collectEventsBatch(coin, request, threads, domain, index, filter = {}) {

		if(!this.#activeParameters(request)) return true;
		else if(index < domain.Min) {

			if(--this.#activeThreads == 0) this.#progress.reset();

			return true;
		}

		this.#progress.add(this.#batchSize);

		await Broker.contracts[coin][this.#getContract(request)].getPastEvents(this.#getContractEvent(request), {
			filter: filter,
			fromBlock: Math.max(index - (this.#batchSize - 1), domain.Min),
			toBlock: index
		}).then(async (events) => {

			let batch = [];

			for(let i = events.length - 1; i >= 0; i--) batch.push(this.#refreshTransactions(this.#appendEventItem(this.#appendEventItem(events[i], 'Coin', coin), 'Key', request.Key), request.Transaction));

			await Promise.all(batch);

		}).catch(error => console.error(error));

		return this.#collectEventsBatch(coin, request, threads, domain, index - threads*this.#batchSize, filter);
	}

	async #refreshTransactions(event, transaction) {

		switch(transaction) {

			case 'Transfer': 
			case 'TransferFrom': await this.#refreshTransfer(event); break;
			case 'Conche': await this.#refreshConche(event); break;
			case 'ICO': await this.#refreshICO(event); break;
			case 'Trade': await this.#refreshTrade(event); break;
			default: break;
		}
	}

	async #refreshTransfer(event) {

		if(!this.#activeEventTransfer(event)) return true;

		let key = MISC.randomKey();

		this.#transactions[key] = true;

		this.#buildTable(this.#tableRow({
			Key: key,
			Cells: {Confirmed: {text: this.#getDate(event), value: event.returnValues._timestamp},
					Transaction: {text: event.returnValues._transaction.ascii().replace('TRANSFERFROM', 'PROXY TRANSFER')},
					Order: {text: event.returnValues._from.toLowerCase() == window.account.toLowerCase() ? 'SEND' : (event.returnValues._to.toLowerCase() == window.account.toLowerCase() ? 'RECEIVE' : 'N/A')},
					Base: {text: event.Coin},
					Quantity: {text: event.returnValues._value.eth() >= 0.001 ? event.returnValues._value.eth().format() : event.returnValues._value.eth().e()},
					Quote: {text: 'N/A', value: 0},
					Price: {text: 'N/A', value: 0}
			}
		}));
	}

	async #refreshConche(event) {

		if(!this.#activeEventMISC(event)) return true;

		let key = MISC.randomKey();

		this.#transactions[key] = true;

		this.#buildTable(this.#tableRow({
			Key: key,
			Cells: {Confirmed: {text: this.#getDate(event), value: event.returnValues._timestamp},
					Transaction: {text: 'CONCHE'},
					Order: {text: 'N/A', value: 0},
					Base: {text: event.Coin},
					Quantity: {text: event.returnValues._value.eth() >= 0.001 ? event.returnValues._value.eth().format() : event.returnValues._value.eth().e()},
					Quote: {text: 'N/A', value: 0},
					Price: {text: 'N/A', value: 0}
			}
		}));
	}

	async #refreshICO(event) {

		if(!this.#activeEventMISC(event)) return true;

		let price, key = MISC.randomKey();
		
		this.#transactions[key] = true;

		price = (await Broker.contracts[event.Coin].ICO.methods.CoinPrice().call()).eth();

		this.#buildTable(this.#tableRow({
			Key: key,
			Cells: {Confirmed: {text: this.#getDate(event), value: event.returnValues._timestamp},
					Transaction: {text: 'ICO'},
					Order: {text: 'BUY'},
					Base: {text: event.Coin},
					Quantity: {text: event.returnValues._amount.eth() >= 0.001 ? event.returnValues._amount.eth().format() : event.returnValues._amount.eth().e()},
					Quote: {text: 'ETH'},
					Price: {text: price >= 0.001 ? price.format() : price.e()}
			}
		}));
	}

	async #refreshTrade(event) {

		if(event.returnValues._addressB == window.account) event.returnValues._order = MISC.invertOrder(event.returnValues._order);
		if(!this.#activeEventTrade(event)) return true;

		let key = MISC.randomKey();

		this.#transactions[key] = true;

		this.#buildTable(this.#tableRow({
			Key: key,
			Cells: {Confirmed: {text: this.#getDate(event), value: event.returnValues._timestamp},
					Transaction: {text: 'TRADE'},
					Order: {text: event.returnValues._order.ascii()},
					Base: {text: event.returnValues._base.ascii()},
					Quantity: {text: event.returnValues._quantity.eth() >= 0.001 ? event.returnValues._quantity.eth().format() : event.returnValues._quantity.eth().e()},
					Quote: {text: event.returnValues._quote.ascii()},
					Price: {text: event.returnValues._price.D(event.returnValues._E) >= 0.001 ? event.returnValues._price.D(event.returnValues._E).format() : event.returnValues._price.D(event.returnValues._E).e()}
			}
		}));
	}



	organize(key = 'Confirmed') {

		this.display('History', true);

		let rows = [];
		let orders = document.getElementById('History-Transactions');
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

		let transactions = document.getElementById('History-Transactions');
		let index = this.#getColumn(this.#key);

		if(index != null) {

			for(let i = 0; i < transactions.children.length; i++) {

				if(this.#compareCells(e.children[index], transactions.children[i].children[index], this.#reverse) && this.#transactions[e.getAttribute('transaction')]) {

					this.display('Lock');

					transactions.insertBefore(e, transactions.children[i]);

					this.display('Unlock');

					return true;
				}
			}
		}

		if(this.#transactions[e.getAttribute('transaction')]) {

			this.display('Lock');

			transactions.appendChild(e);

			this.display('Unlock');

			return true;
		}

		return false;
	}

	#tableRow(transaction) {

		let row = document.createElement('TR');

		row.className = 'tall';

		row.setAttribute('transaction', transaction.Key);

		for(let i in transaction.Cells) row.appendChild(this.#transactionCell(i, transaction.Cells[i]));

		return row;
	}

	#transactionCell(header, item) {

		let cell = document.createElement('TD');

		cell.className = 'pw-10' + (header == 'Confirmed' || !isNaN(item.text) && item.text.f() < 0.001 ? ' left' : "") + ' numeric';
		cell.innerText = item.text;

		if(item.value != undefined) cell.setAttribute('value', item.value);

		return cell;
	}



	#getColumn(x) {

		let h = document.getElementById('History-Headers').children;

		x = x.toLowerCase();

		for(let i = 0; i < h.length; i++) {

			if(x == h[i].firstElementChild.firstElementChild.getAttribute('key').toLowerCase()) return i;
		}

		return null;
	}

	#getDirection(x) {

		let rows = document.getElementById('History-Transactions').children;
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
				Transaction: document.getElementById('History-Panel-Transaction').value,
				Order: document.getElementById('History-Panel-Order').value,
				Base: document.getElementById('History-Panel-Base').value,
				Quote: document.getElementById('History-Panel-Quote').value,
				From: moment(document.getElementById('History-Panel-From').value).valueOf(),
				To: moment(document.getElementById('History-Panel-To').value).startOf('day').add(1, 'day').valueOf()
		};
	}

	#convertRequestTransactionBase(request, transaction, base) {
		
		return {Key: request.Key,
				Transaction: transaction,
				Order: request.Order,
				Base: base,
				Quote: request.Quote,
				From: request.From,
				To: request.To
		};
	}

	#convertRequestTransaction(request, transaction) {
		
		return {Key: request.Key,
				Transaction: transaction,
				Order: request.Order,
				Base: request.Base,
				Quote: request.Quote,
				From: request.From,
				To: request.To
		};
	}

	#convertRequestBase(request, base) {
		
		return {Key: request.Key,
				Transaction: request.Transaction,
				Order: request.Order,
				Base: base,
				Quote: request.Quote,
				From: request.From,
				To: request.To
		};
	}



	#requestCount(request, coins, icos, exchanges) {

		switch(request.Transaction) {

			case 'Transfer': 
			case 'TransferFrom':

				switch(request.Order) {

					case 'Any': return 2*coins.length;
					case 'SEND':
					case 'RECEIVE': return coins.length;
					default: break;
				}
				break;
			case 'Conche': return coins.length;
			case 'ICO': return icos.length;
			case 'Trade': return 2*exchanges.length;
			case 'Any':

				switch(request.Order) {

					case 'Any': return 3*coins.length + icos.length + 2*exchanges.length;
					case 'SEND':
					case 'RECEIVE': return coins.length;
					case 'BUY': return icos.length + 2*exchanges.length;
					case 'SELL': return 2*exchanges.length;
					default: break;
				}
				break;
			break;
			default: break;
		}

		return 1;
	}



	#activeParameters(request) {

		return this.#activeRequest.Key == request.Key;
	}

	#activeEventTransfer(event) {

		return this.#activeParameters(event) && (this.#activeRequest.Order == 'Any' || this.#activeRequest.Order == 'SEND' && event.returnValues._from.toLowerCase() == window.account.toLowerCase() || this.#activeRequest.Order == 'RECEIVE' && event.returnValues._to.toLowerCase() == window.account.toLowerCase()) && (this.#activeRequest.Base == 'Any' || this.#activeRequest.Base == event.Coin) && ((this.#activeRequest.Transaction == 'Any' && event.returnValues._transaction.ascii().replace('SHARE', 'TRANSFER').includes('TRANSFER')) || this.#activeRequest.Transaction.toUpperCase() == event.returnValues._transaction.ascii().replace('SHARE', 'TRANSFER')) && this.#activeRequest.From <= event.returnValues._timestamp*1000 && event.returnValues._timestamp*1000 <= this.#activeRequest.To && !(window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].ICO && event.returnValues._from.toLowerCase() == window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].ICO.Address.toLowerCase()) && !(window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].DEX && event.returnValues._from.toLowerCase() == window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].DEX.Address.toLowerCase()) && event.returnValues._from != event.returnValues._to;
	}

	#activeEventTrade(event) {

		return this.#activeParameters(event) && (this.#activeRequest.Order == 'Any' || this.#activeRequest.Order == event.returnValues._order.ascii()) && (this.#activeRequest.Base == 'Any' || this.#activeRequest.Base == event.returnValues._base.ascii()) && (this.#activeRequest.Quote == 'Any' || this.#activeRequest.Quote == event.returnValues._quote.ascii()) && this.#activeRequest.From <= event.returnValues._timestamp*1000 && event.returnValues._timestamp*1000 <= this.#activeRequest.To && event.returnValues._addressA != event.returnValues._addressB;
	}

	#activeEventMISC(event) {

		return this.#activeParameters(event) && (["", 'Any'].includes(this.#activeRequest.Order) || this.#activeRequest.Order == 'BUY' && event.returnValues._buyer && event.returnValues._buyer.toLowerCase() == window.account.toLowerCase()) && (this.#activeRequest.Base == 'Any' || this.#activeRequest.Base == event.Coin) && this.#activeRequest.From <= event.returnValues._timestamp*1000 && event.returnValues._timestamp*1000 <= this.#activeRequest.To;
	}



	async #domain(request) {

		let chunks = Object.keys(this.#milestones);
		let start = 0, stop = chunks.length - 1;

		for(; start < chunks.length && chunks[start] < request.From; start++) {}
		for(; stop >= 0 && chunks[stop] > request.To; stop--) {}

		return {Min: Math.max(this.#milestones[chunks[Math.max(0, --start)]], window.keyRing[window.web3.currentProvider.networkVersion][request.Base][this.#getContract(request)].Block), Max: ++stop == chunks.length ? (await window.web3.eth.getBlock('latest')).number.i() : this.#milestones[chunks[stop]].i()};
  	}



  	#getContract(request) {

	  	switch(request.Transaction) {

			case 'Trade': return 'DEX';
			case 'ICO': return 'ICO'; 
			default: return 'Coin';
	    }

	    return 'Coin';
	}

	#getContractEvent(request) {

		switch(request.Transaction) {

			case 'ICO': return 'Sell';
			default: return request.Transaction.includes('Transfer') ? 'TransferDetails' : request.Transaction;
		}

		return request.Transaction.includes('Transfer') ? 'TransferDetails' : request.Transaction;
 	}



 	#appendEventItem(event, key, value) {

 		event[key] = value;

 		return event;
 	}



 	#getDate(event) {

 		return new Date(event.returnValues._timestamp.i()*1000).toLocaleTimeString() + ', ' + new Date(event.returnValues._timestamp.i()*1000).toLocaleDateString();
 	}



	display(menu, visible = true) {

		switch(menu) {

			case 'History':

				Ghost.possess(document.getElementById('History'));
				Ghost.visible(document.getElementById('History-Loading'), !visible);
				Ghost.visible(document.getElementById('History-Content'), visible);
				Ghost.resize(document.getElementById('History'));
			break;
			case 'Order': Ghost.visible(document.getElementById('History-Panel-Offer'), visible); break;
			case 'Quote': Ghost.visible(document.getElementById('History-Panel-Units'), visible); break;
			case 'Lock': Ghost.possess(document.getElementById('History')); break;
			case 'Unlock': Ghost.resize(document.getElementById('History')); break;
			default: break;
		}
	}
}
