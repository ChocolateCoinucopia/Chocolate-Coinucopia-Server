// MISC.js



class MISC {

	

	constructor() {}



	static async prototypes() {

		await Promise.all([MISC.prototypesBoolean(), MISC.prototypesString(), MISC.prototypesNumber(), MISC.prototypesBN()]);
	}

	static prototypesBoolean() {

		Boolean.prototype.wei = function(base = 'ether') { return MISC.wei(this ? '1' : '0', base); }
		Boolean.prototype.eth = function(base = 'ether') { return MISC.eth(this ? '1' : '0', base); }
		Boolean.prototype.BN = function() { return MISC.BN(this ? '1' : '0'); }
		Boolean.prototype.weiBN = function(base = 'ether') { return MISC.weiBN(this ? '1' : '0', base); }
		Boolean.prototype.format = function() { return MISC.formatNumber(this ? '1' : '0'); }
		Boolean.prototype.clean = function() { return MISC.cleanNumber(this ? '1' : '0'); }
		Boolean.prototype.coin = function(coin='ETH', precision = 0) { return MISC.formatCoin(this ? '1' : '0', coin, precision); }
		Boolean.prototype.base = function(coin = 'ETH') { return MISC.baseCoin(this ? '1' : '0', coin); }
		Boolean.prototype.short = function(precision = 0) { return MISC.scaleEth(this ? '1' : '0', precision); }
		Boolean.prototype.digits = function() { return MISC.countUnits(this ? '1' : '0'); }
		Boolean.prototype.E = function() { return MISC.scale(this ? '1' : '0'); }
		Boolean.prototype.EE = function() { return MISC.scaley(this ? '1' : '0'); }
		Boolean.prototype.n = function() { return MISC.rescale(this ? '1' : '0'); }
		Boolean.prototype.d = function() { return MISC.scaleE(this ? '1' : '0'); }
		Boolean.prototype.D = function(x) { return MISC.descale(this ? '1' : '0', x); }
		Boolean.prototype.mBN = function(x) { return MISC.multiply(this ? '1' : '0', x); }
		Boolean.prototype.dBN = function(x) { return MISC.divide(this ? '1' : '0', x); }
		Boolean.prototype.mWei = function(x) { return MISC.multipleWei(this ? '1' : '0', x); }
		Boolean.prototype.dWei = function(x) { return MISC.divideWei(this ? '1' : '0', x); }
		Boolean.prototype.s = function() { return this.toString(); }
		Boolean.prototype.i = function() { return parseInt(this ? '1' : '0'); }
		Boolean.prototype.f = function() { return parseFloat(this ? '1' : '0'); }
		Boolean.prototype.e = function() { return parseFloat(this ? '1' : '0').toExponential().replace('e', 'E'); }
	}

	static prototypesString() {

		String.prototype.wei = function(base = 'ether') { return MISC.wei(this, base); }
		String.prototype.eth = function(base = 'ether') { return MISC.eth(this, base); }
		String.prototype.BN = function() { return MISC.BN(this); }
		String.prototype.weiBN = function(base = 'ether') { return MISC.weiBN(this, base); }
		String.prototype.ascii = function() { return MISC.ascii(this); }
		String.prototype.hex = function() { return MISC.hex(this); }
		String.prototype.format = function() { return MISC.formatNumber(this); }
		String.prototype.clean = function() { return MISC.cleanNumber(this); }
		String.prototype.coin = function(coin='ETH', precision = 0) { return MISC.formatCoin(this, coin, precision); }
		String.prototype.base = function(coin = 'ETH') { return MISC.baseCoin(this, coin); }
		String.prototype.short = function(precision = 0) { return MISC.scaleEth(this, precision); }
		String.prototype.digits = function() { return MISC.countUnits(this); }
		String.prototype.E = function() { return MISC.scale(this); }
		String.prototype.EE = function() { return MISC.scaley(this); }
		String.prototype.n = function() { return MISC.rescale(this); }
		String.prototype.d = function() { return MISC.scaleE(this); }
		String.prototype.D = function(x) { return MISC.descale(this, x); }
		String.prototype.mBN = function(x) { return MISC.multiply(this, x); }
		String.prototype.dBN = function(x) { return MISC.divide(this, x); }
		String.prototype.mWei = function(x) { return MISC.multipleWei(this, x); }
		String.prototype.dWei = function(x) { return MISC.divideWei(this, x); }
		String.prototype.s = function() { return this.toString(); }
		String.prototype.i = function() { return parseInt(this); }
		String.prototype.f = function() { return parseFloat(this); }
		String.prototype.e = function() { return parseFloat(this).toExponential().replace('e', 'E'); }
	}

	static prototypesNumber() {

		Number.prototype.wei = function(base = 'ether') { return MISC.wei(this.toFixed(18), base); }
		Number.prototype.eth = function(base = 'ether') { return MISC.eth(this.toString(), base); }
		Number.prototype.BN = function() { return MISC.BN(this.toString()); }
		Number.prototype.weiBN = function(base = 'ether') { return MISC.weiBN(this.toFixed(18), base); }
		Number.prototype.format = function() { return MISC.formatNumber(this); }
		Number.prototype.clean = function() { return MISC.cleanNumber(this); }
		Number.prototype.coin = function(coin='ETH', precision = 0) { return MISC.formatCoin(this, coin, precision); }
		Number.prototype.base = function(coin = 'ETH') { return MISC.baseCoin(this, coin); }
		Number.prototype.short = function(precision = 0) { return MISC.scaleEth(this, precision); }
		Number.prototype.digits = function() { return MISC.countUnits(this); }
		Number.prototype.E = function() { return MISC.scale(this); }
		Number.prototype.EE = function() { return MISC.scaley(this); }
		Number.prototype.n = function() { return MISC.rescale(this); }
		Number.prototype.d = function() { return MISC.scaleE(this); }
		Number.prototype.D = function(x) { return MISC.descale(this, x); }
		Number.prototype.mBN = function(x) { return MISC.multiply(this, x); }
		Number.prototype.dBN = function(x) { return MISC.divide(this, x); }
		Number.prototype.mWei = function(x) { return MISC.multipleWei(this, x); }
		Number.prototype.dWei = function(x) { return MISC.divideWei(this, x); }
		Number.prototype.s = function() { return this.toString(); }
		Number.prototype.i = function() { return parseInt(this); }
		Number.prototype.f = function() { return parseFloat(this); }
		Number.prototype.e = function() { return this.toExponential().replace('e', 'E'); }
	}

	static prototypesBN() {

		window.web3.utils.BN.prototype.wei = function(base = 'ether') { return MISC.wei(this.toString(), base); }
		window.web3.utils.BN.prototype.eth = function(base = 'ether') { return MISC.eth(this.toString(), base); }
		window.web3.utils.BN.prototype.BN = function() { return MISC.BN(this.toString()); }
		window.web3.utils.BN.prototype.weiBN = function(base = 'ether') { return MISC.weiBN(this.toString(), base); }
		window.web3.utils.BN.prototype.format = function() { return MISC.formatNumber(this); }
		window.web3.utils.BN.prototype.clean = function() { return MISC.cleanNumber(this); }
		window.web3.utils.BN.prototype.coin = function(coin='ETH', precision = 0) { return MISC.formatCoin(this, coin, precision); }
		window.web3.utils.BN.prototype.base = function(coin = 'ETH') { return MISC.baseCoin(this, coin); }
		window.web3.utils.BN.prototype.short = function(precision = 0) { return MISC.scaleEth(this, precision); }
		window.web3.utils.BN.prototype.digits = function() { return MISC.countUnits(this); }
		window.web3.utils.BN.prototype.E = function() { return MISC.scale(this); }
		window.web3.utils.BN.prototype.EE = function() { return MISC.scaley(this); }
		window.web3.utils.BN.prototype.n = function() { return MISC.rescale(this); }
		window.web3.utils.BN.prototype.d = function() { return MISC.scaleE(this); }
		window.web3.utils.BN.prototype.D = function(x) { return MISC.descale(this, x); }
		window.web3.utils.BN.prototype.mBN = function(x) { return MISC.multiply(this, x); }
		window.web3.utils.BN.prototype.dBN = function(x) { return MISC.divide(this, x); }
		window.web3.utils.BN.prototype.mWei = function(x) { return MISC.multipleWei(this, x); }
		window.web3.utils.BN.prototype.dWei = function(x) { return MISC.divideWei(this, x); }
		window.web3.utils.BN.prototype.s = function() { return this.toString(); }
		window.web3.utils.BN.prototype.i = function() { return parseInt(this.toString()); }
		window.web3.utils.BN.prototype.f = function() { return parseFloat(this.toString()); }
		window.web3.utils.BN.prototype.e = function() { return parseFloat(this.toString()).toExponential().replace('e', 'E'); }
	}



	static wei(x, base = 'ether') {

		return window.web3.utils.toWei(x, base);
	}

	static eth(x, base = 'ether') {

		return window.web3.utils.fromWei(x, base);
	}

	static BN(x) {

		return window.web3.utils.toBN(x);
	}

	static weiBN(x, base = 'ether') {

		return MISC.BN(MISC.wei(x, base));
	}

	static ascii(x) {

	  return window.web3.utils.hexToAscii(x.replace(/0*$/g, ""));
	}

	static hex(x) {

		return window.web3.utils.asciiToHex(x);
	}

	static getPrecision(x, y) {

		x = MISC.countUnits(x);
		y = MISC.countUnits(y);

		return Math.min(18, Math.max(0, (x.L == 0 ? y.R - x.R : (y.L > 0 ? x.R - y.R : x.L + y.R)) - 1));
	}

	static countUnits(x) {

		x = MISC.cleanNumber(x);

		return {L: x.split('.')[0] == 0 ? 0 : x.split('.')[0].length, R: x.includes('.') ? x.split('.')[1].length : 0};
	}

	static cleanNumber(x) {

	  let sign = "", y = "", e = 0;

	  x = MISC.formatNumber(x).replace(/\,/g, "");

	  if(x.includes('E') && x.split('E').length == 2) {

	    if(x[0] == '-' || x[0] == '+') {

	      sign = x[0] == '-' ? '-' : "";
	      x = x.substring(1);
	    }

	    [x, e] = x.split('E');

	    if(x.includes('.') && x.split('.').length == 2) [x, y] = x.split('.');

	    for(let i = 0; i < Math.min(100, Math.abs(Math.floor(e))); i++) {

	      if(e > 0) {

	        if(y.length) {

	          x += y[0];
	          y = y.substring(1);
	        }
	        else x += '0';
	      }
	      if(e < 0) {

	        if(x.length) {

	          y = x[x.length - 1] + y;
	          x = x.substring(0, x.length - 1);
	        }
	        else y = '0' + y;
	      }
	    }

	    y = y > 0 ? '.' + y : "";
	    x = x > 0 ? sign + x + y : sign + '0' + y;
	  }

	  return x;
	}

	static formatNumber(x) {

	  let sign = "", e = "";
	  x = x.toString().toUpperCase();

	  if(x[0] == '-' || x[0] == '+') {

	    sign = x[0] == '-' ? '-' : "";
	    x = x.substring(1);
	  }

	  if(x.includes('E') && x.split('E').length == 2) {

	    [x, e] = x.split('E');

	    e = MISC.cleanNumber(e) == 0 ? "" : 'E' + MISC.formatNumber(e);
	  }

	  return sign + (('0' + x).replace(/^0*(?=\d+)/g, "").split('.').length == 2 ? (('0' + x).replace(/^0*(?=\d+)/g, "").split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + ('0' + x).replace(/^0*(?=\d+)/g, "").split('.')[1].replace(/0*$/g, "")).replace(/\.$/g, "") : ('0' + x).replace(/^0*(?=\d+)/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + e;
	}

	static formatCoin(x, coin='ETH', precision = 0) {

	  let quantity = MISC.scaleEth(x, precision);
	  let atom = 'wei';

	  switch(coin) {

	    case 'CHOC': atom = quantity == 1 ? 'bean' : 'beans'; break;
	    case 'CC': atom = 'bb'; break;
	    case 'Coin': 

	    	coin = quantity == 1 ? 'Coin' : 'Coins';
	    	atom = quantity == 1 ? 'atom' : 'atoms';
	  	break;
	  	case "":
	  	case '%': return quantity + coin;
	    default: break;
	  }

	  return quantity + ' ' + MISC.baseEth(x).replace('ether', coin).replace('wei', atom);
	}

	static baseCoin(x, coin='ETH') {

		let quantity = MISC.scaleEth(x, precision);
		let atom = 'wei';

		switch(coin) {

			case 'CHOC': atom = quantity == 1 ? 'bean' : 'beans'; break;
			case 'CC': atom = 'bb'; break;
			case 'Coin': 

				coin = quantity == 1 ? 'Coin' : 'Coins';
				atom = quantity == 1 ? 'atom' : 'atoms';
				break;
				case "":
				case '%': return coin;
			default: break;
	  	}

	  	return MISC.baseEth(x).replace('ether', coin).replace('wei', atom);
	}

	static baseEth(x) {

	  switch(Math.max(0, x.toString().length)) {

	    case 0: 
	    case 1: 
	    case 2: 
	    case 3: return 'wei';
	    case 4: 
	    case 5: 
	    case 6: return 'kwei';
	    case 7: 
	    case 8: 
	    case 9: return 'mwei';
	    case 10: 
	    case 11: 
	    case 12: return 'gwei';
	    case 13: 
	    case 14: 
	    case 15: return 'microether';
	    case 16: 
	    case 17: 
	    case 18: return 'milliether';
	    case 19: 
	    case 20: 
	    case 21: return 'ether';
	    case 22:
	    case 23:
	    case 24: return 'kether';
	    case 25: 
	    case 26:
	    case 27: return 'mether';
	    case 28:
	    case 29:
	    case 30: return 'gether';
	    case 31:
	    case 32:
	    case 33: return 'tether';
	    default: break;
	  }

	  return 'wei';
	}

	static scaleEth(x, precision = 0) {

	x = MISC.cleanNumber(x);

	let base = MISC.baseEth(x);
	let p = Math.max(precision, 3 - MISC.countUnits(window.web3.utils.fromWei(x, base)).L);
	let n, d = window.web3.utils.toBN(window.web3.utils.toWei('1', base)).div(window.web3.utils.toBN(MISC.scaley(p + 1)));

	if(d.gt(window.web3.utils.toBN('0'))) {

		n = window.web3.utils.toBN(x).div(d);

		x = n.toString()[n.toString().length - 1] >= 5 ? n.add(window.web3.utils.toBN('10')).div(window.web3.utils.toBN('10')).mul(window.web3.utils.toBN('10')).mul(d) : n.div(window.web3.utils.toBN('10')).mul(window.web3.utils.toBN('10')).mul(d);
	}

	x = window.web3.utils.fromWei(x.toString(), base);

	if(Math.max(precision, 3 - x.split('.')[0].length) > 0) {

  	x += x.includes('.') ? "" : '.';

  	while(x.split('.')[1].length < Math.max(precision, 3 - x.split('.')[0].length)) x += '0';
  }

  return x.includes('.') && Math.max(precision, 3 - x.split('.')[0].length) ? x.split('.')[0] + '.' + x.split('.')[1].substring(0, Math.max(precision, 3 - x.split('.')[0].length)) : x;
}

	static scale(x) {

	  return MISC.countUnits(x).R;
	}

	static scaleE(x) {

	  return MISC.BN(10**MISC.scale(x)).toString();
	}

	static scaley(x) {

	  return MISC.BN(10**x).toString();
	}

	static rescale(x) {

	  return MISC.eth(MISC.weiBN(MISC.cleanNumber(x)).mul(MISC.BN(MISC.scaleE(x))).toString());
	}

	static descale(x, y) {

	  return MISC.eth(MISC.weiBN(MISC.cleanNumber(x)).div(MISC.BN(MISC.scaley(MISC.cleanNumber(y)))).toString());
	}

	static multiply(x, y) {

	  return MISC.BN(MISC.cleanNumber(x)).mul(MISC.BN(MISC.rescale(y))).div(MISC.BN(MISC.scaleE(y))).toString();
	}

	static divide(x, y) {

	  return MISC.BN(MISC.cleanNumber(x)).mul(MISC.BN(MISC.scaleE(y))).div(MISC.BN(MISC.rescale(y))).toString();
	}

	static multipleWei(x, y) {

	  return MISC.eth(MISC.weiBN(MISC.cleanNumber(x)).mul(MISC.BN(MISC.rescale(y))).div(MISC.BN(MISC.scaleE(y))).toString());
	}

	static divideWei(x, y) {

	  return MISC.eth(MISC.weiBN(MISC.cleanNumber(x)).mul(MISC.BN(MISC.scaleE(y))).div(MISC.BN(MISC.rescale(y))).toString());
	}

	static rebaseCoin(x, units) {

	  x = MISC.eth(MISC.wei(x.toFixed(18)), units);

	  return parseFloat(x).toFixed(Math.max(0, 3 - x.split('.')[0].length)).toLocaleString()
	}

	static minBlock(coins = null) {

		let min = Infinity;

		coins = coins || Object.keys(window.keyRing[window.web3.currentProvider.networkVersion]);

		coins.forEach(c => min = Math.min(min, window.keyRing[window.web3.currentProvider.networkVersion][c].Coin ? window.keyRing[window.web3.currentProvider.networkVersion][c].Coin.Block : Infinity, window.keyRing[window.web3.currentProvider.networkVersion][c].ICO ? window.keyRing[window.web3.currentProvider.networkVersion][c].ICO.Block : Infinity, window.keyRing[window.web3.currentProvider.networkVersion][c].DEX ? window.keyRing[window.web3.currentProvider.networkVersion][c].DEX.Block : Infinity));

	  	return !isNaN(min) || isFinite(min) ? min : 0;
	}

	static isInverted(base12, quote12, base21, quote21, hex = false) {

		base21 = hex ? MISC.ascii(base21) : base21;
		quote21 = hex ? MISC.ascii(quote21) : quote21;

		return base12 == quote21 && quote12 == base21;
	}

	static invertOrderEvent(event) {

		let base = event.returnValues._base;
		let limit = event.returnValues._limit;
		let e = event.returnValues._E;

		event.returnValues._order = MISC.invertOrder(event.returnValues._order);
		event.returnValues._base = event.returnValues._quote;
		event.returnValues._quote = base;
		event.returnValues._quantity = MISC.invertQuantity(event.returnValues._quantity, limit, e);
		event.returnValues._fulfilled = MISC.invertQuantity(event.returnValues._fulfilled, limit, e);
		event.returnValues._limit = MISC.invertLimit(limit, e);
		event.returnValues._E = MISC.invertScale(limit, e);
		event.returnValues._inverse = !event.returnValues._inverse;

		return event;
	}

	static invertTradeEvent(event) {

		let base = event.returnValues._base;
		let limit = event.returnValues._price;
		let e = event.returnValues._E;

		event.returnValues._order = MISC.invertOrder(event.returnValues._order);
		event.returnValues._base = event.returnValues._quote;
		event.returnValues._quote = base;
		event.returnValues._quantity = MISC.invertQuantity(event.returnValues._quantity, limit, e);
		event.returnValues._price = MISC.invertLimit(limit, e);
		event.returnValues._E = MISC.invertScale(limit, e);
		event.returnValues._inverse = !event.returnValues._inverse;

		return event;
	}

	static invertOrder(order) {

		switch(MISC.ascii(order)) {

			case 'BUY': return MISC.hex('SELL');
			case 'SELL': return MISC.hex('BUY');
			default: break;
		}

		return 'ERROR';
	}

	static invertQuantity(quantity, limit, e) {

		return MISC.BN(quantity).mul(MISC.BN(limit)).div(MISC.BN(MISC.scaley(e))).toString();
	}

	static invertLimit(limit, e) {

		return MISC.rescale(MISC.eth(MISC.weiBN(MISC.scaley(e)).div(MISC.BN(limit)).toString()));
	}

	static invertScale(limit, e) {

		return MISC.scale(MISC.eth(MISC.weiBN(MISC.scaley(e)).div(MISC.BN(limit)).toString()));
	}

	static clone(item) {

		return JSON.parse(JSON.stringify(item));
	}

	static randomKey() {

		return (Math.random()*0xFFFFFF<<0).toString(16) + (Math.random()*0xFFFFFF<<0).toString(16);
	}

	static swap(dictionary) {

	  return Object.fromEntries(Object.entries(dictionary).map(a => a.reverse()));
	}

	static copy(e) {

		let r = document.createRange();

		r.selectNode(e);

		window.getSelection().removeAllRanges();
		window.getSelection().addRange(r);

		document.execCommand('copy');

		window.getSelection().removeAllRanges();

		return true;
	}

	static missingMetaMaskError() {

		alert("This web page requires that the browser have the MetaMask extension for it to access all of the site's content.");
	}

	static loadContractError() {

		alert('An error occurred while attempting to load the coin contracts.');
	}

	static approveError() {

		alert('An error occurred while attempting to approve your transaction.');
	}

	static orderError() {

		alert('An error occurred while attempting to submit your transaction.');
	}
}
