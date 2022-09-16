// Broker.js



class Broker {


	static contracts = {};

	constructor() {}



	static async activateCoins(...coins) {

		let batch = [];

		[...new Set(coins)].forEach(async (coin) => { if(coin != 'ETH' && (!Broker.contracts[coin] || !Broker.contracts[coin].Coin || !Broker.contracts[coin].ICO || !Broker.contracts[coin].DEX)) batch.push(Broker.prepareContracts(coin)); });

		await Promise.all(batch);

		return true;
	}

	static async activateCoinsLite(...coins) {

		let batch = [];

		[...new Set(coins)].forEach(async (coin) => { if(coin != 'ETH' && (!Broker.contracts[coin] || !Broker.contracts[coin].Coin)) batch.push(Broker.prepareContract(coin)); });

		await Promise.all(batch);

		return true;
	}

	static async prepareContracts(coin) {

		await Promise.all([Broker.prepareContract(coin, 'Coin'), Broker.prepareContract(coin, 'ICO'), Broker.prepareContract(coin, 'DEX')]);
	}

	static async prepareContract(coin, contract = 'Coin') {

		if((!Broker.contracts[coin] || !Broker.contracts[coin][contract]) && window.keyRing && window.keyRing[window.web3.currentProvider.networkVersion][coin] && window.keyRing[window.web3.currentProvider.networkVersion][coin][contract]) {

			Broker.contracts[coin] = Broker.contracts[coin] || {};

			await fetch(window.keyRing[window.web3.currentProvider.networkVersion][coin][contract].Directory).then(response => response.json()).then(code => {

				Broker.contracts[coin][contract] = new window.web3.eth.Contract(code.abi, window.keyRing[window.web3.currentProvider.networkVersion][coin][contract].Address);
			});
		}
	}



	static async approve(coin, address, quantity) {

		if(await Broker.activateCoinsLite(coin)) {

			return await Broker.contracts[coin].Coin.methods.approve(address, quantity).send({ 
	      		from: window.account,
	        	value: 0,
	        	gasLimit: 100000
    		});
		}

	  	throw TypeError('Approval Failed!');
	}

	static async transfer(coin, address, quantity) {

		if(await Broker.activateCoinsLite(coin)) {

			return await Broker.contracts[coin].Coin.methods.transfer(address, quantity).send({ 
	      		from: window.account,
	        	value: 0,
	        	gasLimit: 125000
    		});
		}

	  	throw TypeError('Transfer Failed!');
	}

	static async share(coin, address, quantity) {

		if(await Broker.activateCoinsLite(coin)) {

			return await Broker.contracts[coin].Coin.methods.share(address, quantity).send({ 
	      		from: window.account,
	        	value: 0,
	        	gasLimit: 125000
    		});
		}

	  	throw TypeError('Transfer Failed!');
	}

	static async transferFrom(coin, fromAddress, toAddress, quantity) {

		if(await Broker.activateCoinsLite(coin)) {

			return await Broker.contracts[coin].Coin.methods.transferFrom(fromAddress, toAddress, quantity).send({ 
	      		from: window.account,
	        	value: 0,
	        	gasLimit: 150000
    		});
		}

	  	throw TypeError('Proxy Transfer Failed!');
	}

	static async buy(coin, amount) {

	  if(await Broker.activateCoins(coin)) {

	    await Broker.contracts[coin].ICO.methods.buyCoins(amount).send(
	      { from: window.account,
	      	value: amount.BN().div(('1').weiBN().div((await Broker.contracts[coin].ICO.methods.CoinPrice().call()).BN())).s(),
	      gasLimit: 150000 });

	    return true;
	  }

	  throw TypeError('Purchase Failed!');
	}

	static async placeOrder(ticket) {

		ticket = ticket._inverse ? Broker.invertOrderTicket(ticket) : ticket;

		let dex = await Broker.dex(ticket._base, ticket._quote, true);

		if(await Broker.activateCoins(ticket._base, ticket._quote, dex) && await Broker.#approveTicket(ticket)) {

			return await Broker.contracts[dex].DEX.methods.placeOrder(
			    ticket._ID, 
			    ticket._order, 
			    ticket._base, 
			    ticket._quantity, 
			    ticket._quote,  
			    ticket._limit, 
			    ticket._E).send({ 
			    	from: window.account,
			      	value: Broker.#eth(ticket),
			      	gasLimit: 350000 
			    });
		}

		throw TypeError('Order Failed!');
	}

	static async acceptOffer(ticket, quantity = null) {

		quantity = quantity && ticket._inverse ? MISC.invertQuantity(quantity, ticket._limit, ticket._E) : quantity;
		ticket = ticket._inverse ? Broker.invertOrderTicket(ticket) : ticket;
		quantity = quantity == null || quantity.BN().gt(ticket._quantity.BN().sub(ticket._fulfilled.BN())) ? ticket._quantity.BN().sub(ticket._fulfilled.BN()).s() : quantity;

		let dex = await Broker.dex(ticket._base, ticket._quote, true);

		if(await Broker.activateCoins(ticket._base, ticket._quote, dex) && await Broker.#approveTicket(ticket, quantity, true)) {

			return await Broker.contracts[dex].DEX.methods.acceptOffer(
		    	ticket._address, 
		    	ticket._ID, 
		    	quantity).send({ 
		      		from: window.account,
		        	value: Broker.#eth(ticket, quantity, true),
		        	gasLimit: 350000
		    	});
		}

		throw TypeError('Trade Failed!');
	}

	static async cancelOrder(coin, ID) {

		if(await Broker.activateCoins(coin)) {

			return await Broker.contracts[coin].DEX.methods.cancelOrder(ID).send({
					from: window.account,
					value: '0',
					gasLimit: 150000
				});
		}

		throw TypeError('Order Cancellation Failed!');
	}

	static async cancelOrderTicket(ticket) {

		let dex = await Broker.dex(ticket._base, ticket._quote, true);

		if(ticket._address.toLowerCase() == window.account.toLowerCase() && await Broker.activateCoins(dex)) {

			return await Broker.contracts[dex].DEX.methods.cancelOrder(ticket._ID).send({
					from: window.account,
					value: '0',
					gasLimit: 150000
				});
		}

		throw TypeError('Order Cancellation Failed!');
	}



	static async #approveTicket(ticket, quantity, counterparty = false) {

		let dex = await Broker.dex(ticket._base, ticket._quote, true);
		let deposit = await Broker.#deposit(ticket, quantity, counterparty);

		if(deposit.Coin && (await Broker.contracts[deposit.Coin].Coin.methods.allowance(window.account, await Broker.contracts[dex].DEX._address).call()).BN().lt(deposit.Quantity.BN())) return await Broker.approve(deposit.Coin, await Broker.contracts[dex].DEX._address, deposit.Quantity);

		return true;
	}

	static ticket(order, base, quote, quantity, limit, key = window.web3.utils.randomHex(32), fulfilled = 0) {

		return {_address: window.account,
				_ID: key,
				_order: order.toUpperCase().hex(),
				_base: base.toUpperCase().hex(),
				_quantity: quantity.clean().wei(),
				_quote: quote.toUpperCase().hex(),
				_limit: limit.n(),
				_E: limit.E(),
				_fulfilled: fulfilled,
				_active: true
			   };
	}

	static invertOrderTicket(ticket) {

		ticket = MISC.clone(ticket);

		let base = ticket._base;
		let limit = ticket._limit;
		let e = ticket._E;

		ticket._order = MISC.invertOrder(ticket._order);
		ticket._base = ticket._quote;
		ticket._quote = base;
		ticket._quantity = MISC.invertQuantity(ticket._quantity, limit, e);
		ticket._fulfilled = MISC.invertQuantity(ticket._fulfilled, limit, e);
		ticket._limit = MISC.invertLimit(limit, e);
		ticket._E = MISC.invertScale(limit, e);
		ticket._inverse = !ticket._inverse;

		return ticket;
	}

	static invertTradeTicket(ticket) {

		ticket = MISC.clone(ticket);

		let base = ticket._base;
		let limit = ticket._price;
		let e = ticket._E;

		ticket._order = MISC.invertOrder(ticket._order);
		ticket._base = ticket._quote;
		ticket._quote = base;
		ticket._quantity = MISC.invertQuantity(ticket._quantity, limit, e);
		ticket._price = MISC.invertLimit(limit, e);
		ticket._E = MISC.invertScale(limit, e);
		ticket._inverse = !ticket._inverse;

		return ticket;
	}

	static #eth(ticket, quantity = null, counterparty = false) {

		quantity = quantity == null ? ticket._quantity.BN().sub(ticket._fulfilled.BN()).s() : quantity;

		if(counterparty) {

			if(ticket._order.ascii() == 'BUY' && ticket._base.ascii() == 'ETH') return quantity.clean();
			else if (ticket._order.ascii() == 'SELL' && ticket._quote.ascii() == 'ETH') return quantity.clean().BN().mul(ticket._limit.BN()).div(ticket._E.EE().BN()).s();
		}
		else {

			if(ticket._order.ascii() == 'BUY' && ticket._quote.ascii() == 'ETH') return quantity.clean().BN().mul(ticket._limit.BN()).div(ticket._E.EE().BN()).s();
			else if (ticket._order.ascii() == 'SELL' && ticket._base.ascii() == 'ETH') return quantity.clean();
		}
		
		return '0';
	}

	static #deposit(ticket, quantity = null, counterparty = false) {

		quantity = quantity == null ? ticket._quantity.BN().sub(ticket._fulfilled.BN()).s() : quantity;

		if(counterparty) {

			if(ticket._order.ascii() == 'BUY' && ticket._base.ascii() != 'ETH') return {Coin: ticket._base.ascii(), Quantity: quantity.clean()};
			else if (ticket._order.ascii() == 'SELL' && ticket._quote.ascii() != 'ETH') return {Coin: ticket._quote.ascii(), Quantity: quantity.clean().BN().mul(ticket._limit.BN()).div(ticket._E.EE().BN()).s()};
		}
		else {

			if(ticket._order.ascii() == 'BUY' && ticket._quote.ascii() != 'ETH') return {Coin: ticket._quote.ascii(), Quantity: quantity.clean().BN().mul(ticket._limit.BN()).div(ticket._E.EE().BN()).s()};
			else if (ticket._order.ascii() == 'SELL' && ticket._base.ascii() != 'ETH') return {Coin: ticket._base.ascii(), Quantity: quantity.clean()};
		}
		
		return {Coin: null, Quantity: '0'};
	}

	static coins() {

		if(window.keyRing && window.web3) {

			return Object.keys(window.keyRing[window.web3.currentProvider.networkVersion]);
		}

		throw TypeError('Failed to Locate Coins!');
	}

	static quotes(base) {

		let quotes = [];

		if(window.keyRing && window.web3) {

			for(let coin in window.keyRing[window.web3.currentProvider.networkVersion]) {

				if(window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX && window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Coins.includes(base)) quotes.push(...MISC.clone(window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Coins.filter(c => c != base)).reverse());
			}
		}

	  return [...new Set(quotes)];
	}

	static dex(base, quote, hex = false) {

		base = hex ? base.ascii() : base;
		quote = hex ? quote.ascii() : quote;

		if(window.keyRing && window.web3) {

			for(let coin in window.keyRing[window.web3.currentProvider.networkVersion]) {

				if(window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX && window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Coins.includes(base) && window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Coins.includes(quote)) return coin;
			}
		}

		return null;
	}
}
