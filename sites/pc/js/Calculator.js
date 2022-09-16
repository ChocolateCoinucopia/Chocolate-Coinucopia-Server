// Calculator.js



class Calculator {

	#active;
	#listeners;
	#milestones;
	#previousRequest;
	#activeRequest;
	#gasRequests;
	#collections;
	#blocks;
	#activeThreads;
	#batchSize;
	#forward;
	#estimate;
	#progress;
	#threads;


	constructor(threads = 500) {

		this.#active = false;
		this.#listeners = [];
		this.#milestones = {};
		this.#previousRequest = null;
		this.#activeRequest = {};
		this.#gasRequests = [];
	    this.#collections = 0;
		this.#blocks = {};
	    this.#activeThreads = 0;
	    this.#batchSize = 100;
	    this.#forward = {};
	    this.#estimate = 0;
	    this.#progress = new ProgressBar('Valuation-Progress');
		this.#threads = threads;

		this.#build();
	}



	#build() {

		Promise.all([this.#preparePanel(), this.#prepareEventListeners(), this.#prepareMilestones()]).then(success => {

    		this.#active = true;

     		this.estimate();

    	}).catch(error => { MISC.loadContractError();});
	}



	async #preparePanel() {

		this.#prepareBase();
	}

	#prepareBase() {

		let base = document.getElementById('Valuation-Panel-Coin');
		let bases = Broker.coins();

		base.replaceChildren();

		for(let i in bases) base.appendChild(this.#generateOption(bases[i], bases[i]));

		if(base.getElementsByTagName('OPTION').length) base.getElementsByTagName('OPTION')[0].selected = true;
	}

	#generateOption(text, value) {

		let e = document.createElement('OPTION');

		e.innerText = text;
		e.value = value;

		return e;
	}



	async #prepareEventListeners() {

		document.getElementById('Valuation-Panel-Coin').addEventListener('change',  this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Coin').addEventListener('keyup',  this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Group').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Group').addEventListener('keyup', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-From').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-From').addEventListener('keyup', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-To').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-To').addEventListener('keyup', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Predict').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Predict').addEventListener('keyup', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Discount').addEventListener('change', this.#updateHandler.bind(this));
		document.getElementById('Valuation-Panel-Discount').addEventListener('keyup', this.#updateHandler.bind(this));
		
		document.getElementById('Valuation-Table-Transfer').addEventListener('change', this.render.bind(this));
		document.getElementById('Valuation-Table-Transfer').addEventListener('keyup', this.render.bind(this));
		document.getElementById('Valuation-Table-TransferFrom').addEventListener('change', this.render.bind(this));
		document.getElementById('Valuation-Table-TransferFrom').addEventListener('keyup', this.render.bind(this));
		document.getElementById('Valuation-Table-Trade').addEventListener('change', this.render.bind(this));
		document.getElementById('Valuation-Table-Trade').addEventListener('keyup', this.render.bind(this));
		document.getElementById('Valuation-Table-Supply').addEventListener('change', this.render.bind(this));
		document.getElementById('Valuation-Table-Supply').addEventListener('keyup', this.render.bind(this));
	}

	#updateHandler(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			if(this.#active) this.estimate();
		}
	}

	#edit(e) {

		if(document.getElementById('Valuation-Table-Editor')) this.#update({type: 'change'});

		let cell = e.parentElement;

		cell.setAttribute('source', 'user');

		e.remove();

		cell.appendChild(this.#generateCellInput(e.innerText));

		document.getElementById('Valuation-Table-Editor').focus();
	}

	#update(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			let input = document.getElementById('Valuation-Table-Editor');
			let cell = input.parentElement;
			let x = input.value.clean().f();

			input.remove();

			switch(cell.getAttribute('target')) {

				case 'Transfer':
				case 'TransferFrom':
				case 'Trade':
				case 'Supply': 

					if(this.#withinSunsetRequest(cell.getAttribute('period'))) this.#blocks[cell.getAttribute('period')][cell.getAttribute('target')] = x;
					else this.#forward[cell.getAttribute('period')][cell.getAttribute('target')] = x;
				break;
				default: break;
			}

			cell.appendChild(this.#generateCellAnchor(x, cell.getAttribute('period'), cell.getAttribute('target')));

			this.render();
		}
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



	async estimate() {

		this.display('Valuation', true);

		let request = this.#getRequest();

		this.#progress.reset();
		this.#progress.target(0);

		this.#previousRequest = this.#activeRequest;
		this.#activeRequest = MISC.clone(request);
		this.#activeThreads = 0;
		this.#blocks = this.#identicalBlockRequest() ? this.#blocks : (this.#similarBlockRequest() ? this.#updateBlocks() : this.#resetBlocks());
		this.#forward = this.#identicalForwardRequest() ? this.#forward : this.#resetForward();

		this.display('Table', false);

		await this.#prepareTable();

		this.display('Table', true);

		if(await this.#activateCoins(request.Coin)) {

			if(!this.#identicalBlockRequest()) {
				
				this.#collectEvents(this.#convertRequestTransaction(request, 'Transfer'), Math.ceil(this.#threads/5));
				this.#collectEvents(this.#convertRequestTransaction(request, 'Conche'), Math.ceil(this.#threads/5));
				this.#collectEvents(this.#convertRequestTransaction(request, 'ICO'), Math.ceil(this.#threads/5));
				this.#collectEvents(this.#convertRequestTransaction(request, 'Order'), Math.ceil(this.#threads/5));
				this.#collectEvents(this.#convertRequestTransaction(request, 'Trade'), Math.ceil(this.#threads/5));
			}
			else this.render();
		}
	}



	#prepareTable() {

		if(this.#identicalRequest()) return true;

		let keys = [...this.#blockKeys(), ...this.#forwardKeys()];
		let headers = document.getElementById('Valuation-Table-Head').firstElementChild;
		let rows = document.getElementById('Valuation-Table-Body').children;

		this.#resetTable();

		for(let i = 0, first = true; i < keys.length; i++) {

			if(!this.#withinDawnRequest(keys[i])) continue;

			headers.appendChild(this.#generateHeader(keys[i], first ? -1 : (i == keys.length - 1 ? 1 : 0)));

			for(let j = 0; j < rows.length - 1; j++) {

				if(rows[j].children.length >= 2) rows[j].appendChild(this.#generateCell(0, first ? 0 : keys[i], rows[j].firstElementChild.nextElementSibling.getAttribute('target')));
			}

			i += first ? -1 : 0;
			first = false;
		}

		if(rows[rows.length - 1].children.length >= 2) rows[rows.length - 1].appendChild(this.#generateCell(0, keys[0], rows[rows.length - 1].firstElementChild.nextElementSibling.getAttribute('target')));
	}



	async #activateCoins(...coins) {

		let newCoins = [];

		coins = [...new Set(coins)];

		coins.forEach(coin => { if(coin != 'ETH' && !this.#listeners.includes(coin)) newCoins.push(coin); });

		if(await Broker.activateCoins(...coins)) {

			newCoins.forEach(async coin => {

				if(Broker.contracts[coin].Coin) {

					Broker.contracts[coin].Coin.events.TransferDetails({
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshTransfer(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));

					Broker.contracts[coin].Coin.events.Conche({
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshConche(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));
				}

				if(Broker.contracts[coin].ICO) {

					Broker.contracts[coin].ICO.events.Sell({
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshICO(this.#appendEventItem(this.#appendEventItem(event, 'Coin', coin), 'Key', this.#activeRequest.Key)));
				}

				if(Broker.contracts[coin].DEX) {

					Broker.contracts[coin].DEX.events.Order({
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshOrder(this.#appendEventItem(event, 'Key', this.#activeRequest.Key)));

					Broker.contracts[coin].DEX.events.Trade({
							fromBlock: 'latest'
						}).on('data', async (event) => this.#refreshTrade(this.#appendEventItem(event, 'Key', this.#activeRequest.Key)));
				}

				this.#listeners.push(coin);
			});

			return true;
		}

		throw TypeError('Failed to load contracts.');
	}



	async #collectEvents(request, threads, filter = {}) {

		let d = await this.#domain(request);

		await this.#progress.addTarget(d.Max - d.Min);

		this.#activeThreads += threads;

		for(let i = 0; i < threads; i++) this.#collectEventsBatch(request, threads, d, d.Max - i*this.#batchSize, filter);
	}

	async #collectEventsBatch(request, threads, domain, index, filter = {}) {

		if(!this.#activeParameters(request)) return true;
		else if(index < domain.Min) {

			if(--this.#activeThreads == 0) {

				this.#progress.reset();

				this.render();
			}

			return true;
		}

		this.#progress.add(this.#batchSize);

		await Broker.contracts[request.Coin][this.#getContract(request)].getPastEvents(this.#getContractEvent(request), {
			filter: filter,
			fromBlock: Math.max(index - (this.#batchSize - 1), domain.Min),
			toBlock: index
		}).then(async (events) => {

			let batch = [];

			for(let i = events.length - 1; i >= 0; i--) batch.push(this.#refreshTransactions(this.#appendEventItem(this.#appendEventItem(events[i], 'Coin', request.Coin), 'Key', request.Key), request.Transaction));

			await Promise.all(batch);

		}).catch(error => console.error(error));

		return this.#collectEventsBatch(request, threads, domain, index - threads*this.#batchSize, filter);
	}

	async #refreshTransactions(event, transaction) {

		switch(transaction) {

			case 'Transfer': 
			case 'TransferFrom': await this.#refreshTransfer(event); break;
			case 'Conche': await this.#refreshConche(event); break;
			case 'ICO': await this.#refreshICO(event); break;
			case 'Order': await this.#refreshOrder(event); break;
			case 'Trade': await this.#refreshTrade(event); break;
			default: break;
		}
	}

	async #refreshTransfer(event) {

		if(this.#activeEventTransfer(event)) this.#collectGasEvent(event.returnValues._transaction.ascii() == 'TRANSFERFROM' ? 'TransferFrom' : 'Transfer', event);
	}

	async #refreshConche(event) {

		if(this.#activeEventMISC(event)) this.#appendToBlock('Supply', event.returnValues._timestamp, event.returnValues._supply.eth().f(), 'Max');
	}

	async #refreshICO(event) {

		if(this.#activeEventMISC(event)) this.#collectGasEvent('Transfer', event);
	}

	async #refreshOrder(event) {

		if(this.#activeEventOrder(event)) this.#collectGasEvent('Trade', event);
	}

	async #refreshTrade(event) {

		if(this.#activeEventTrade(event)) this.#collectGasEvent('Trade', event);
	}



	async #collectGasEvent(txnType, event) {

		this.#gasRequests.push({'Key': event.Key, 'Transaction': event.transactionHash, 'Variable': txnType, 'Timestamp': event.returnValues._timestamp, 'Base': event.returnValues._gasBase.eth().f()});

		this.#collectGasEventsBatch();
	}

	async #collectGasEventsBatch() {

		if(this.#gasRequests.length == 0 || this.#collections >= this.#threads) return true;

		let batch = [];

		while(this.#gasRequests.length > 0 && this.#collections++ < this.#threads) batch.push(this.#appendGasEvent(this.#gasRequests.shift()));

		await Promise.all(batch);

		this.render();

		this.#collectGasEventsBatch();
	}

	async #appendGasEvent(gasRequest) {

		if(this.#activeParameters(gasRequest)) this.#appendToBlock(gasRequest.Variable, gasRequest.Timestamp, (await window.web3.eth.getTransactionReceipt(gasRequest.Transaction)).gasUsed.f()*gasRequest.Base, '+');

		this.#collections--;
	}



	async render() {

		this.#processData();

		await this.#predict();
		
		this.#updatePrice(this.#updateTableForward(this.#updateTableBlocks()));
	}

	#processData() {

		let previous = 0;
		let keys = this.#blockKeys();

		for(let i in keys) {

			this.#blocks[keys[i]].Supply = Math.max(previous, this.#blocks[keys[i]].Supply);

			previous = this.#blocks[keys[i]].Supply;
		}

		keys = this.#forwardKeys();

		for(let i in keys) {

			this.#forward[keys[i]].Supply = Math.max(previous, this.#forward[keys[i]].Supply);

			previous = this.#forward[keys[i]].Supply;
		}
	}

	async #predict() {

		let batch = [];
		let ts = this.#generateTimeSeries();
		let keys = Object.keys(ts);

		keys.forEach(key => batch.push(this.#predictTimeSeries(ts[key], key)));

		await Promise.all(batch);
	}

	#updateTableBlocks(estimate = 0) {

		let period = 0;
		let keys = this.#blockKeys();
		let rows = document.getElementById('Valuation-Table-Body').children;

		for(let i = 0; i < keys.length; i++) {

			period = this.#withinDawnRequest(keys[i]) ? keys[i] : '0';

			for(let j = 0; j < rows.length - 1; j++) {

				if(rows[j].children.length >= 2) this.#updateCell(this.#blocks[keys[i]], rows[j].firstElementChild.nextElementSibling.getAttribute('target'), period, rows[j].firstElementChild.nextElementSibling.getAttribute('source'));
			}

			estimate += this.#blocks[keys[i]].Supply ? (this.#blocks[keys[i]].Transfer + this.#blocks[keys[i]].TransferFrom + this.#blocks[keys[i]].Trade)/this.#blocks[keys[i]].Supply : 0;
		}

		return estimate;
	}

	#updateTableForward(estimate = 0) {

		let keys = this.#forwardKeys();
		let rows = document.getElementById('Valuation-Table-Body').children;

		for(let i = 0; i < keys.length; i++) {

			for(let j = 0; j < rows.length - 1; j++) {

				if(rows[j].children.length >= 2) this.#updateCell(this.#forward[keys[i]], rows[j].firstElementChild.nextElementSibling.getAttribute('target'), keys[i], rows[j].firstElementChild.nextElementSibling.getAttribute('source'), i);
			}

			estimate += this.#forward[keys[i]].Supply ? (i == keys.length - 1 ? ((this.#forward[keys[i]].Transfer + this.#forward[keys[i]].TransferFrom + this.#forward[keys[i]].Trade)/this.#forward[keys[i]].Supply)/this.#groupRateGrowth(document.getElementById('Valuation-Table-Discount-' + keys[i]).firstElementChild.innerText.clean(), document.getElementById('Valuation-Table-Growth-' + keys[i]).firstElementChild.innerText.clean(), keys[i]) : ((this.#forward[keys[i]].Transfer + this.#forward[keys[i]].TransferFrom + this.#forward[keys[i]].Trade)/this.#forward[keys[i]].Supply)/(1 + this.#groupRate(document.getElementById('Valuation-Table-Discount-' + keys[i]).firstElementChild.innerText.clean(), keys[i]))**(i + 1)) : 0;
		}

		return estimate;
	}

	#updatePrice(estimate = 0) {

		this.#estimate = estimate;

		document.getElementById('Valuation-Price').firstElementChild.innerText = this.#estimate.wei().coin();
	}

	#updateCell(block, target, period, source, index = 0) {

		let keys, previous, sum, supply;
		let e = document.getElementById('Valuation-Table-' + target + '-' + period).firstElementChild;

		if(source == 'user' || e.tagName !== 'A') return true;

		switch(target) {

			case 'Transfer': e.innerText = block.Transfer.wei().coin(); break;
			case 'TransferFrom': e.innerText = block.TransferFrom.wei().coin(); break;
			case 'Trade': e.innerText = block.Trade.wei().coin(); break;
			case 'Total': e.innerText = (block.Transfer + block.TransferFrom + block.Trade).wei().coin(); break;
			case 'Supply': e.innerText = block.Supply.wei().coin(this.#activeRequest.Coin); break;
			case 'Growth': 

				keys = this.#forwardKeys();
				previous = period == 0 || e.parentElement.previousElementSibling.getAttribute('period') == 0 ? null : e.parentElement.previousElementSibling.getAttribute('period');
				sum = previous ? (keys.includes(previous) ? this.#forward[previous].Transfer + this.#forward[previous].TransferFrom + this.#forward[previous].Trade : this.#blocks[previous].Transfer + this.#blocks[previous].TransferFrom + this.#blocks[previous].Trade) : 0;
				supply = previous ? (keys.includes(previous) ? this.#forward[previous].Supply : this.#blocks[previous].Supply) : 0;

				e.innerText = sum > 0 ? (Math.round((((block.Transfer + block.TransferFrom + block.Trade)/sum)/(block.Supply && supply ? block.Supply/supply : 1) - 1)*1e8)/1e6).format() + '%' : "";
				break;
			case 'Discount': e.innerText = this.#withinSunsetRequest(period) ? '0' : this.#activeRequest.Discount; break;
			case 'PV': e.innerText = index == this.#forwardKeys().length - 1 ? ((block.Transfer + block.TransferFrom + block.Trade)/this.#groupRateGrowth(document.getElementById('Valuation-Table-Discount-' + period).firstElementChild.innerText.clean(), document.getElementById('Valuation-Table-Growth-' + period).firstElementChild.innerText.clean(), period)).wei().coin() : ((block.Transfer + block.TransferFrom + block.Trade)/(1 + this.#groupRate(document.getElementById('Valuation-Table-Discount-' + period).firstElementChild.innerText.clean(), period))**(index + 1)).wei().coin(); break;
			default: break;
		}
	}



	#getRequest() {

		return {Key: MISC.randomKey(),
				Transaction: 'Coin',
				Coin: document.getElementById('Valuation-Panel-Coin').value,
				Group: document.getElementById('Valuation-Panel-Group').value,
				From: moment(document.getElementById('Valuation-Panel-From').value).valueOf(),
				To: moment(document.getElementById('Valuation-Panel-To').value).startOf('day').add(1, 'day').valueOf(),
				Predict: document.getElementById('Valuation-Panel-Predict').value == "" ? '0' : document.getElementById('Valuation-Panel-Predict').value,
				Discount: document.getElementById('Valuation-Panel-Discount').value == "" ? '0' : document.getElementById('Valuation-Panel-Discount').value
		};
	}

	#convertRequestTransaction(request, transaction) {
		
		return {Key: request.Key,
				Transaction: transaction,
				Coin: request.Coin,
				Group: request.Group,
				From: request.From,
				To: request.To,
				Predict: request.Predict,
				Discount: request.Discount
		};
	}



	#identicalRequest() {

		return JSON.stringify(this.#activeRequest) == JSON.stringify(this.#previousRequest);
	}

	#identicalBlockRequest() {

		return this.#identicalCoinRequest() && this.#identicalGroupRequest() && this.#identicalHorizonRequest();
	}

	#similarBlockRequest() {

		return this.#identicalCoinRequest() && this.#identicalGroupRequest() && this.#identicalToRequest();
	}

	#identicalForwardRequest() {

		return this.#identicalCoinRequest() && this.#identicalGroupRequest() && this.#identicalHorizonRequest() && this.#identicalPredictRequest();
	}

	#identicalCoinRequest() {

		return this.#activeRequest.Coin === this.#previousRequest.Coin;
	}

	#identicalGroupRequest() {

		return this.#activeRequest.Group === this.#previousRequest.Group;
	}

	#identicalHorizonRequest() {

		return this.#identicalFromRequest() && this.#identicalToRequest();
	}

	#identicalFromRequest() {

		return this.#activeRequest.From === this.#previousRequest.From;
	}

	#identicalToRequest() {

		return this.#activeRequest.To === this.#previousRequest.To;
	}

	#identicalPredictRequest() {

		return this.#activeRequest.Predict === this.#previousRequest.Predict;
	}

	#withinHorizonRequest(timestamp) {

		return this.#withinDawnRequest(timestamp) && this.#withinSunsetRequest(timestamp);
	}

	#withinDawnRequest(timestamp) {

		return moment(this.#activeRequest.From.i()).startOf(this.#activeRequest.Group).valueOf() <= timestamp.i();
	}

	#withinSunsetRequest(timestamp) {

		return timestamp.i() <= moment(this.#activeRequest.To.i()).endOf(this.#activeRequest.Group).valueOf();
	}



	#activeParameters(request) {

		return this.#activeRequest.Key == request.Key;
	}

	#activeEventTransfer(event) {

		return this.#activeParameters(event) && this.#activeRequest.Coin == event.Coin && event.returnValues._transaction.ascii().replace('SHARE', 'TRANSFER').includes('TRANSFER') && event.returnValues._timestamp*1000 <= this.#activeRequest.To && !(window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].ICO && event.returnValues._from.toLowerCase() == window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].ICO.Address.toLowerCase()) && !(window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].DEX && event.returnValues._from.toLowerCase() == window.keyRing[window.web3.currentProvider.networkVersion][event.Coin].DEX.Address.toLowerCase() && event.returnValues._transaction.ascii() == 'TRANSFER');
	}

	#activeEventOrder(event) {

		return this.#activeParameters(event) && event.returnValues._active && event.returnValues._fulfilled == 0 && (event.returnValues._order.ascii() == 'SELL' && this.#activeRequest.Coin == event.returnValues._base.ascii() || event.returnValues._order.ascii() == 'BUY' && this.#activeRequest.Coin == event.returnValues._quote.ascii()) && event.returnValues._timestamp*1000 <= this.#activeRequest.To;
	}

	#activeEventTrade(event) {

		return this.#activeParameters(event) && (event.returnValues._order.ascii() == 'BUY' && this.#activeRequest.Coin == event.returnValues._base.ascii() || event.returnValues._order.ascii() == 'SELL' && this.#activeRequest.Coin == event.returnValues._quote.ascii()) && event.returnValues._timestamp*1000 <= this.#activeRequest.To;
	}

	#activeEventMISC(event) {

		return this.#activeParameters(event) && this.#activeRequest.Coin == event.Coin && event.returnValues._timestamp*1000 <= this.#activeRequest.To;
	}



	async #domain(request) {

		let chunks = Object.keys(this.#milestones);
		let stop = chunks.length - 1;

		for(; stop >= 0 && chunks[stop] > request.To; stop--) {}

		return {Min: window.keyRing[window.web3.currentProvider.networkVersion][request.Coin][this.#getContract(request)].Block, Max: ++stop == chunks.length ? (await window.web3.eth.getBlock('latest')).number.i() : this.#milestones[chunks[stop]].i()};
  	}



  	#getContract(request) {

	  	switch(request.Transaction) {

	  		case 'Order':
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



 	#generateBlock() {

		return {'Transfer': 0,
				'TransferFrom': 0,
				'Trade': 0,
				'Supply': 0
			   };
	}

	#appendToBlock(variable, ts, item, type = '=') {

		ts = moment(ts*1000).startOf(this.#activeRequest.Group).valueOf();

		if(!this.#blocks[ts]) this.#blocks[ts] = this.#generateBlock();
		
		switch(type) {

			case '+': this.#blocks[ts][variable] += item; break;
			case '-': this.#blocks[ts][variable] -= item; break;
			case '*': this.#blocks[ts][variable] *= item; break;
			case '/': this.#blocks[ts][variable] /= item; break;
			case 'Min': this.#blocks[ts][variable] = Math.min(item, this.#blocks[ts][variable]); break;
			case 'Max': this.#blocks[ts][variable] = Math.max(item, this.#blocks[ts][variable]); break;
			default: this.#blocks[ts][variable] = item; break;
		}
	}



 	#resetBlocks() {

		this.#blocks = {};

		this.#blocks['0'] = this.#generateBlock();

		for(let i = moment(this.#activeRequest.From).startOf(this.#activeRequest.Group), max = moment(this.#activeRequest.To).startOf('day').valueOf(); i.valueOf() < max; i.add(1, this.#activeRequest.Group)) this.#blocks[i.valueOf()] = this.#generateBlock();
	
		return this.#blocks;
	}

	#updateBlocks() {

		for(let i = moment(this.#activeRequest.From).startOf(this.#activeRequest.Group), max = moment(this.#activeRequest.To).startOf('day').valueOf(); i.valueOf() < max; i.add(1, this.#activeRequest.Group)) this.#blocks[i.valueOf()] = this.#blocks[i.valueOf()] || this.#generateBlock();
	
		return this.#blocks;
	}

	#resetForward() {

		this.#forward = {};

		for(let i = 0, key = moment(this.#blockKeys().at(-1).i()).add(1, this.#activeRequest.Group); i <= this.#activeRequest.Predict.i(); i++, key = moment(key).add(1, this.#activeRequest.Group)) this.#forward[key.valueOf()] = this.#generateBlock();

		return this.#forward;
	}



	#blockKeys() {

		return Object.keys(this.#blocks).sort((a, b) => a.i() < b.i() ? -1 : 1);
	}

	#forwardKeys() {

		return Object.keys(this.#forward).sort((a, b) => a.i() < b.i() ? -1 : 1);
	}

	

	#resetTable() {

		let headers = document.getElementById('Valuation-Table-Head').firstElementChild.children;
		let rows = document.getElementById('Valuation-Table-Body').children;

		while(headers.length > 2) headers[headers.length - 1].remove();

		for(let i = 0; i < rows.length; i++) {

			while(rows[i].children.length > 2) rows[i].children[rows[i].children.length - 1].remove();
		}
	}

	#generateHeader(text, horizon = 0) {

		let e = document.createElement('TH');

		e.className = 'pw-10';

		e.appendChild(this.#generateHeaderAnchor(text, horizon));

		return e;
	}

	#generateHeaderAnchor(text, horizon = 0) {

		let e = document.createElement('A');

		e.appendChild(this.#generateH3(text, horizon));

		return e;
	}

	#generateH3(text, horizon = 0) {

		let e = document.createElement('H3');

		e.id = 'Valuation-Table-' + (horizon < 0 ? '0' : text);
		e.className = 'mt-0 mb-0 nowrap';
		e.innerText = this.#formatTimestamp(text, horizon);

		return e;
	}

	#generateCell(text, period, target) {

		let e = document.createElement('TD');

		e.id = target == 'Estimate' ? 'Valuation-Price' : 'Valuation-Table-' + target + '-' + period;

		e.setAttribute('target', target);
		e.setAttribute('period', period);
		e.setAttribute('source', 'model');

		e.appendChild(this.#generateCellAnchor(text, period, target));

		return e;
	}

	#generateCellAnchor(text, period = 0, target = null) {

		let e = document.createElement('A');

		switch(target) {

			case 'Supply': e.innerText = text.wei().coin(this.#activeRequest.Coin); break;
			case 'Growth': e.innerText = text == 0 ? "" : (Math.round(1e8*text)/1e6).format() + '%'; break;
			case 'Discount': e.innerText = text; break;
			default: e.innerText = text.wei().coin(); break;
		}

		e.addEventListener('click', this.#isEditable(period, target) ? this.#edit.bind(this, e) : () => MISC.copy(e));

		return e;
	}

	#generateCellInput(text) {

		let e = document.createElement('INPUT');

		e.id = 'Valuation-Table-Editor';
		e.className = 'form-control input-lg right flex humble';
		e.value = text;
		e.setAttribute('type', 'number');
		e.setAttribute('name', 'editor');
		e.setAttribute('target', 'Exchange-Quantity');
		e.setAttribute('min', '0');
		e.setAttribute('pattern', '[0-9]+([\.,][0-9]+)?');
		e.setAttribute('placeholder', '#');

		e.addEventListener('keyup', this.#update.bind(this));

		return e;
	}

	#isEditable(period, target) {

		return !this.#withinSunsetRequest(period) && ['Transfer', 'TransferFrom', 'Trade', 'Supply', 'Discount'].includes(target);
	}



	#formatTimestamp(timestamp, horizon = 0) {

		let date;

		timestamp = horizon < 0 ? moment(timestamp.i()).subtract(1, this.#activeRequest.Group).endOf(this.#activeRequest.Group).startOf('day').valueOf() : timestamp.i();

		switch(this.#activeRequest.Group) {

			case 'Day': date = moment(timestamp).format('M/D/YYYY'); break;
			case 'Week': date = horizon != 0 ? moment(timestamp).format('M/D/YYYY') : moment(timestamp).add(6, 'day').format('M/D/YYYY'); break;
			case 'Month': date = moment(timestamp).format('MMM YYYY'); break;
			case 'Quarter': date = moment(timestamp).format('[Q]Q YYYY'); break;
			case 'Year': date = moment(timestamp).format('YYYY'); break;
			default: date = moment(timestamp).format('M/D/YYYY'); break;
		}

		return (timestamp > moment().valueOf() ? 'Est. ' : "") + (horizon < 0 ? '-∞ ➔ ' : "") + date + (horizon > 0 ? ' ➔ ∞' : "");
	}

	#groupRate(rate, timestamp) {

		return rate*(moment(timestamp.i()).add(1, this.#activeRequest.Group).diff(moment(timestamp.i()))/moment(timestamp.i()).add(1, 'year').diff(moment(timestamp.i())))
	}

	#groupRateGrowth(rate, growth, timestamp) {

		rate = this.#groupRate(rate, timestamp);
		growth = this.#groupRate(growth, timestamp);

		return rate > growth ? rate - growth : rate;
	}



	#generateTimeSeries() {

		let ts = this.#emptyTimeSeries();
		let keys = this.#blockKeys();

		for(let i in keys) {

			if(!this.#withinHorizonRequest(keys[i])) continue;

			ts.Transfer.push(this.#blocks[keys[i]].Transfer);
			ts.TransferFrom.push(this.#blocks[keys[i]].TransferFrom);
			ts.Trade.push(this.#blocks[keys[i]].Trade);
			ts.Supply.push(this.#blocks[keys[i]].Supply);
		}

		return ts;
	}

	#emptyTimeSeries() {

		return {'Transfer': [],
				'TransferFrom': [],
				'Trade': [],
				'Supply': []
			   };
	}

	async #predictTimeSeries(ts, transaction) {

		switch(document.getElementById('Valuation-Table-' + transaction).value) {

			case 'Average': this.#predictTimeSeriesAverage(ts, transaction); break;
			case 'Cyclical': this.#predictTimeSeriesCyclical(ts, transaction); break;
			case 'Regression': this.#predictTimeSeriesRegression(ts, transaction); break;
			case 'SARIMA': this.#predictTimeSeriesSARIMA(ts, transaction); break;
			default: break;
		}
	}

	#predictTimeSeriesAverage(ts, transaction) {

		let s = new SARIMA();

		try {

			s.fit(this.#diffTimeSeries(ts, transaction), null, 1, 0, 'M');

			this.#integrateTimeSeries(s.predict(this.#forwardKeys().length), transaction);

		} catch(error) {}
	}

	#predictTimeSeriesCyclical(ts, transaction) {

		let s = new SARIMA();

		try {

			s.fit(this.#diffTimeSeries(ts, transaction), null, null, 0, 'M');

			this.#integrateTimeSeries(s.predict(this.#forwardKeys().length), transaction);

		} catch(error) {}
	}

	#predictTimeSeriesRegression(ts, transaction) {

		let s = new SARIMA();

		try {

			s.fit(this.#diffTimeSeries(ts, transaction), null, null, null, 'OLS');

			this.#integrateTimeSeries(s.predict(this.#forwardKeys().length), transaction);

		} catch(error) {}
	}

	#predictTimeSeriesSARIMA(ts, transaction) {

		let s = new SARIMA();

		try {

			s.fit(this.#diffTimeSeries(ts, transaction));

			this.#integrateTimeSeries(s.predict(this.#forwardKeys().length), transaction);

		} catch(error) {}
	}

	#diffTimeSeries(ts, transaction) {

		if(!this.#blocks[this.#blockKeys().at(-1)][transaction]) return ts;

		for(let i = ts.length - 1; i > 0; i--) ts[i] = ts[i] == 0 || ts[i - 1] == 0 ? 0 : (ts[i] = (ts[i] < ts[i - 1] ? -ts[i - 1]/ts[i] : ts[i]/ts[i - 1]) - 1);

		if(ts.length > 0) ts.shift();

		return ts;
	}

	#integrateTimeSeries(ts, transaction) {

		let d = this.#blocks[this.#blockKeys().at(-1)][transaction] > 0;
		let keys = this.#forwardKeys();

		for(let i = 0, m = null, x = this.#blocks[this.#blockKeys().at(-1)][transaction]; i < ts.length && i < keys.length; x = m ? this.#forward[keys[i]][transaction] : (transaction == 'Supply' ? Math.max(x, d ? x*(ts[i] < 0 ? 1/(1 + -ts[i]) : 1 + ts[i]) : ts[i]) : Math.max(0, d ? x*(ts[i] < 0 ? 1/(1 + -ts[i]) : 1 + ts[i]) : ts[i])), i++) {

			m = document.getElementById('Valuation-Table-' + transaction + '-' + keys[i]).getAttribute('source') == 'model';

			if(m) this.#forward[keys[i]][transaction] = transaction == 'Supply' ? Math.max(x, d ? x*(ts[i] < 0 ? 1/(1 + -ts[i]) : 1 + ts[i]) : ts[i]) : Math.max(0, d ? x*(ts[i] < 0 ? 1/(1 + -ts[i]) : 1 + ts[i]) : ts[i]);
		}
	}



 	display(menu, visible = true) {

		switch(menu) {

			case 'Valuation':

				Ghost.possess(document.getElementById('Valuation'));
				Ghost.visible(document.getElementById('Valuation-Loading'), !visible);
				Ghost.visible(document.getElementById('Valuation-Content'), visible);
				Ghost.resize(document.getElementById('Valuation'));
			break;
			case 'Table':

				Ghost.possess(document.getElementById('Valuation'));
				Ghost.visible(document.getElementById('Valuation-Table'), visible);
				Ghost.resize(document.getElementById('Valuation'));
			break;
			case 'Lock': Ghost.possess(document.getElementById('Valuation')); break;
			case 'Unlock': Ghost.resize(document.getElementById('Valuation')); break;
			default: break;
		}
	}
}