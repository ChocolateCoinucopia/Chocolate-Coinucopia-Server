// Syndicate.js



class Syndicate {

	coin;
	coinPrice;
	coinsSold;
	coinsAvailable;
	bar;
	#active;
	#txn;
	#gasRequests;
	#collections;
	#threads;


	constructor(coin, threads = 100) {

		this.coin = coin;
		this.coinPrice = 0;
	    this.coinsSold = 0; 
	    this.coinsAvailable = 1;
	    this.bar = 1;
	    this.#active = false;
	    this.#txn = {};
	    this.#gasRequests = [];
	    this.#collections = 0;
	    this.#threads = threads;
		
	    this.display("", false);

	    this.#prepareEventListeners();
	    this.#prepareContracts();
	}



	#prepareEventListeners() {
		
		document.getElementById('ICO-' + this.coin + '-Buy').addEventListener('click', this.buyCoins.bind(this));
		document.getElementById('ICO-' + this.coin + '-Coins').addEventListener('keyup', this.#clickBuyCoins.bind(this));
	}

	#clickBuyCoins(e) {

	  	if(e.type === 'keyup' && e.key ==='Enter') this.buyCoins();
	}



	async #prepareContracts() {

		if(await Broker.activateCoins(this.coin)) {

			Promise.all([this.#updateTransferFrom(), this.#updateTransferTo(), this.#updateSell()]);
	        Promise.all([this.#collectEvents(), this.#coinEventListener('Coin', 'TransferDetails'), this.#coinEventListener('Coin', 'Conche'), this.#coinEventListener('ICO', 'Sell'), this.#coinEventListener('DEX', 'Order'), this.#coinEventListener('DEX', 'Trade')]);

		    window.web3.eth.subscribe('newBlockHeaders').on('data', event => this.renderSpecifications());
		}
	}

	async #updateTransferFrom() {

	  Broker.contracts[this.coin].Coin.events.Transfer({
	      filter: {'_from': window.account},
	      fromBlock: 'latest'
	    }).on('data', event => this.refresh());
	}

	async #updateTransferTo() {

	  Broker.contracts[this.coin].Coin.events.Transfer({
	      filter: {'_to': window.account},
	      fromBlock: 'latest'
	    }).on('data', event => this.refresh());
	}

	async #updateSell() {

	  Broker.contracts[this.coin].ICO.events.Sell({
	      fromBlock: 'latest'
	    }).on('data', event => this.refresh());
	}

	async #collectEvents() {

	  this.#gasRequests = [];
	  this.bar = (await Broker.contracts[this.coin].Coin.methods.bar().call()).weiBN(); 
	  this.#txn = {	'TransferDetails': {
	                'Transfer': {
	                  'Sum': (0).BN(), 
	                  'Cap': (0).BN(), 
	                  'Count': 0
	                },
	                'TransferFrom': {
	                  'Sum': (0).BN(), 
	                  'Cap': (0).BN(), 
	                  'Count': 0
	                },
	                'Trade': {
	                  'Sum': (0).BN(), 
	                  'Cap': (0).BN(), 
	                  'Count': 0
	                }
	              },
	              'Conche': {
	                'Transfer': {
	                  'Sum': (0).BN(), 
	                  'Count': 0
	                },
	                'TransferFrom': {
	                  'Sum': (0).BN(), 
	                  'Count': 0
	                },
	                'Trade': {
	                  'Sum': (0).BN(), 
	                  'Count': 0
	                }
	              },
	              'Gas': {
	                'Transfer': {
	                  'Sum': (0).BN(), 
	                  'Count': 0
	                },
	                'TransferFrom': {
	                  'Sum': (0).BN(), 
	                  'Count': 0
	                },
	                'Trade': {
	                  'Sum': (0).BN(), 
	                  'Count': 0
	                }
	              }
	            };
	  this.#active = true;

	  this.render();

	  Promise.all([this.#sumEvents('Coin', 'TransferDetails'), this.#sumEvents('Coin', 'Conche'), this.#sumEvents('ICO', 'Sell'), this.#sumEvents('DEX', 'Order'), this.#sumEvents('DEX', 'Trade')]);
	}

	async #sumEvents(contract, eventType) {

	  let batchSize = 100;
	  let block = (await window.web3.eth.getBlock('latest')).number;

	  for(let i = 0; i < this.#threads; i++) this.#sumEventsBatch(contract, eventType, block - i*batchSize, batchSize);
	}

	async #sumEventsBatch(contract, eventType, index, size) {

	  if(index < window.keyRing[window.web3.currentProvider.networkVersion][this.coin][contract].Block) return true;

	  await Broker.contracts[this.coin][contract].getPastEvents(eventType, {
	      fromBlock: Math.max(index - (size - 1), window.keyRing[window.web3.currentProvider.networkVersion][this.coin][contract].Block),
	      toBlock: index
	  }).then(async (events) => {

	    let batch = [];

	    for(let i in events) batch.push(this.#appendEvent(eventType, events[i]));

	    await Promise.all(batch);
	      
	  }).catch(error => console.error(error));

	  return this.#sumEventsBatch(contract, eventType, index - size*this.#threads, size);
	}

	async #appendEvent(eventType, event) {

	  let t, quantity;

	  if(eventType == 'TransferDetails' || eventType == 'Conche') {

	    t = event.returnValues._transaction.ascii();
	    quantity = event.returnValues._value.BN();

	    if(t == 'TRADE') {

	      this.#txn[eventType].Trade.Sum = this.#txn[eventType].Trade.Sum.add(quantity);
	      this.#txn[eventType].Trade.Count++;

	      if(eventType == 'TransferDetails') this.#txn[eventType].Trade.Cap = this.#txn[eventType].Trade.Cap.add(quantity.lte(this.bar) ? quantity : this.bar);
	    }
	    else if(t == 'TRANSFER' || t == 'SHARE') {

	      this.#txn[eventType].Transfer.Sum = this.#txn[eventType].Transfer.Sum.add(quantity);
	      this.#txn[eventType].Transfer.Count++;

	      if(eventType == 'TransferDetails') this.#txn[eventType].Transfer.Cap = this.#txn[eventType].Transfer.Cap.add(quantity.lte(this.bar) ? quantity : this.bar);
	      if(event.returnValues._from != window.keyRing[window.web3.currentProvider.networkVersion][this.coin].ICO.Address) this.#collectGasEvent('Transfer', event);
	    }
	    else if(t == 'TRANSFERFROM') {

	      this.#txn[eventType].TransferFrom.Sum = this.#txn[eventType].TransferFrom.Sum.add(quantity);
	      this.#txn[eventType].TransferFrom.Count++;

	      if(eventType == 'TransferDetails') this.#txn[eventType].TransferFrom.Cap = this.#txn[eventType].TransferFrom.Cap.add(quantity.lte(this.bar) ? quantity : this.bar);

	      this.#collectGasEvent('TransferFrom', event);
	    }
	  }
	  else if(eventType == 'Sell') this.#collectGasEvent('Transfer', event);
	  else if(event.returnValues._base.ascii() == this.coin || event.returnValues._quote.ascii() == this.coin) {

	    if(eventType == 'Trade' || eventType == 'Order' && event.returnValues._fulfilled == 0 && event.returnValues._active) this.#collectGasEvent('Trade', event);
	  }
	}

	async #collectGasEvent(txnType, event) {

	  this.#gasRequests.push({'Transaction': event.transactionHash, 'Type': txnType});

	  this.#collectGasEventBatch();
	}

	async #collectGasEventBatch() {

		if(this.#gasRequests.length == 0 || this.#collections >= this.#threads) return true;

		let batch = [];

		while(this.#gasRequests.length > 0 && this.#collections++ < this.#threads) batch.push(this.#appendGasEvent(this.#gasRequests.shift()));

		await Promise.all(batch);

		this.#collectGasEventBatch();
	}

	async #appendGasEvent(gasRequest) {

		let gas = await (await window.web3.eth.getTransactionReceipt(gasRequest.Transaction)).gasUsed.BN();

		this.#txn.Gas[gasRequest.Type].Sum = this.#txn.Gas[gasRequest.Type].Sum.add(gas);
		this.#txn.Gas[gasRequest.Type].Count++;

		this.#collections--;
	}

	async #coinEventListener(contract, eventType) {

	  	Broker.contracts[this.coin][contract].events[eventType]({
	        fromBlock: 'latest'
	    }).on('data', event => this.#appendEvent(eventType, event));
	}



	async refresh() {

		if(await Broker.activateCoins(this.coin)) {

			this.coinsSold = (await Broker.contracts[this.coin].ICO.methods.CoinsSold().call()).eth();
			this.coinsAvailable = this.coinsSold.weiBN().add((await Broker.contracts[this.coin].Coin.methods.balanceOf(await Broker.contracts[this.coin].ICO._address).call()).BN()).eth();

			document.getElementById('ICO-' + this.coin + '-Balance').innerText = (await Broker.contracts[this.coin].Coin.methods.balanceOf(window.account).call()).eth().format();
			document.getElementById('ICO-' + this.coin + '-Coins-Sold').innerText = this.coinsSold.format();
			document.getElementById('ICO-' + this.coin + '-Coins-Available').innerText = this.coinsAvailable.format();
			document.getElementById('ICO-' + this.coin + '-Progress').style.width = ((Math.ceil(this.coinsSold)/this.coinsAvailable)*100) + '%';
		}
	}



	async render(menu = "") {

		if(!this.#active) return true;

		this.display(menu, false);

		if(window.account) document.getElementById('ICO-' + this.coin + '-Account-Address').innerText = window.account;

		if(await Broker.activateCoins(this.coin)) {

			this.coinPrice = (await Broker.contracts[this.coin].ICO.methods.CoinPrice().call()).eth();
			this.coinsSold = (await Broker.contracts[this.coin].ICO.methods.CoinsSold().call()).eth();

			document.getElementById('ICO-' + this.coin + '-Sale').innerText = this.coinPrice.wei().coin();
			document.getElementById('ICO-' + this.coin + '-Ratio').innerText = Math.round(1/this.coinPrice).format();
			document.getElementById('ICO-' + this.coin + '-Coins-Sold').innerText = this.coinsSold.format();

			this.coinsAvailable = this.coinsSold.weiBN().add((await Broker.contracts[this.coin].Coin.methods.balanceOf(await Broker.contracts[this.coin].ICO._address).call()).BN()).eth();

			document.getElementById('ICO-' + this.coin + '-Coins-Available').innerText = this.coinsAvailable.format();
			document.getElementById('ICO-' + this.coin + '-Balance').innerText = (await Broker.contracts[this.coin].Coin.methods.balanceOf(window.account).call()).eth().format();
			document.getElementById('ICO-' + this.coin + '-Progress').style.width = ((Math.ceil(this.coinsSold)/this.coinsAvailable)*100) + '%';
			document.getElementById('ICO-' + this.coin + '-Contract').innerText = await Broker.contracts[this.coin].Coin._address;
			document.getElementById('ICO-' + this.coin + '-Standard').innerText = await Broker.contracts[this.coin].Coin.methods.standard().call();
			document.getElementById('ICO-' + this.coin + '-Bar').innerText = (await Broker.contracts[this.coin].Coin.methods.bar().call()).format();

			this.renderSpecifications();

			this.display(menu, true);
	    }
	}

	async renderSpecifications() {

		if(this.#active && await Broker.activateCoins(this.coin)) {

			let price;
			let one = (1).weiBN();
			let hundred = (100).BN();
			let gas = this.#averageGas();
			let gasPrice = (await window.web3.eth.getBlock('pending')).baseFeePerGas.BN();
			let sugar = (await Broker.contracts[this.coin].Coin.methods.sugar().call()).BN();
			let cacao = (await Broker.contracts[this.coin].Coin.methods.cacao().call()).BN();
			let bar = (await Broker.contracts[this.coin].Coin.methods.bar().call()).BN();
			let avgTxnCap = this.#averageTransactionSizeCapped();

			for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-Gas-Used').innerText = gas[i].format();
			for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-Gas-Price').innerText = gasPrice.coin();
			for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-ETH-Burned').innerText = gasPrice.mul(gas[i]).coin();
			for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-Cacao').innerText = (i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(hundred).s().eth().format() : gasPrice.mul(cacao).mul(sugar).mul(hundred).s().eth().format()) + ' %';
			for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-Avg-Reward').innerText = i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(avgTxnCap[i]).div(one).coin(this.coin) : gasPrice.mul(cacao).mul(sugar).mul(avgTxnCap[i]).div(one).coin(this.coin);
			for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-Avg-ETH').innerText = avgTxnCap[i] == 0 ? '0' : gasPrice.mul(gas[i]).mul(one).div(i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(avgTxnCap[i]).div(one) : gasPrice.mul(cacao).mul(sugar).mul(avgTxnCap[i]).div(one)).coin();
			if(bar != 1) for(let i in gas) document.getElementById('ICO-' + this.coin + '-' + i + '-Avg-Bar').innerText = avgTxnCap[i] == 0 ? '0' : gasPrice.mul(gas[i]).mul(one).mul(bar).div(i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(avgTxnCap[i]).div(one) : gasPrice.mul(cacao).mul(sugar).mul(avgTxnCap[i]).div(one)).coin();

			for(let i in gas) price = gas[i] == 0 || avgTxnCap[i] == 0 ? price : (price ? (price.lt(gasPrice.mul(gas[i]).mul(one).div(i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(avgTxnCap[i]).div(one) : gasPrice.mul(cacao).mul(sugar).mul(avgTxnCap[i]).div(one))) ? price : gasPrice.mul(gas[i]).mul(one).div(i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(avgTxnCap[i]).div(one) : gasPrice.mul(cacao).mul(sugar).mul(avgTxnCap[i]).div(one))) : gasPrice.mul(gas[i]).mul(one).div(i != 'Trade' ? gasPrice.mul(cacao).div(sugar).mul(avgTxnCap[i]).div(one) : gasPrice.mul(cacao).mul(sugar).mul(avgTxnCap[i]).div(one)));

			document.getElementById('ICO-' + this.coin + '-Price').innerText = price ? price.coin() : "";
		}
	}

	#averageGas() {

	  	return {'Transfer': this.#txn['Gas'].Transfer.Sum.div(Math.max(1, this.#txn['Gas'].Transfer.Count).BN()), 
		          'TransferFrom': this.#txn['Gas'].TransferFrom.Sum.div(Math.max(1, this.#txn['Gas'].TransferFrom.Count).BN()), 
		          'Trade': this.#txn['Gas'].Trade.Sum.div(Math.max(1, this.#txn['Gas'].Trade.Count).BN())
		        };
		}

	#averageReward() {

	  	return {'Transfer': this.#txn['Conche'].Transfer.Sum.div(Math.max(1, this.#txn['TransferDetails'].Transfer.Count).BN()), 
		          'TransferFrom': this.#txn['Conche'].TransferFrom.Sum.div(Math.max(1, this.#txn['TransferDetails'].TransferFrom.Count).BN()), 
		          'Trade': this.#txn['Conche'].Trade.Sum.div(Math.max(1, this.#txn['TransferDetails'].Trade.Count).BN())
		        };
	}

	#averageTransactionSize() {

	  	return {'Transfer': this.#txn['TransferDetails'].Transfer.Sum.div(Math.max(1, this.#txn['TransferDetails'].Transfer.Count).BN()), 
		          'TransferFrom': this.#txn['TransferDetails'].TransferFrom.Sum.div(Math.max(1, this.#txn['TransferDetails'].TransferFrom.Count).BN()), 
		          'Trade': this.#txn['TransferDetails'].Trade.Sum.div(Math.max(1, this.#txn['TransferDetails'].Trade.Count).BN())
		        };
	}

	#averageTransactionSizeCapped() {

	  	return {'Transfer': this.#txn['TransferDetails'].Transfer.Cap.div(Math.max(1, this.#txn['TransferDetails'].Transfer.Count).BN()), 
		          'TransferFrom': this.#txn['TransferDetails'].TransferFrom.Cap.div(Math.max(1, this.#txn['TransferDetails'].TransferFrom.Count).BN()), 
		          'Trade': this.#txn['TransferDetails'].Trade.Cap.div(Math.max(1, this.#txn['TransferDetails'].Trade.Count).BN())
		        };
	}



	async buyCoins() {

		this.display('Buy', false);

		Broker.buy(this.coin, document.getElementById('ICO-' + this.coin + '-Coins').value.clean().wei()).then(success => this.render('Purchased')).catch(error => this.render('Rejected'));
	}



	display(menu, visible = true) {

	  switch(menu) {

	    case "":

	    	Ghost.possess(document.getElementById('ICO-' + this.coin));
	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Processing'), false);
	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Loading'), !visible);
	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Menu'), visible);
	    	Ghost.resize(document.getElementById('ICO-' + this.coin));
	    break;
	    case 'Purchased':
	    case 'Rejected':

	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Purchased'), menu == 'Purchased');
	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Rejected'), menu == 'Rejected');

	    case 'Buy':

	    	Ghost.possess(document.getElementById('ICO-' + this.coin));
	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Processing'), !visible);
	    	Ghost.visible(document.getElementById('ICO-' + this.coin + '-Menu'), visible);
	    	Ghost.resize(document.getElementById('ICO-' + this.coin));
	    break;
	    default: break;
	  }
	}
}