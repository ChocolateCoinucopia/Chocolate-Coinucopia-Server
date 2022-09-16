// Background.js



class Pennies {


	#interval;
	#flip;
	#background;
	#candyland;
	#gallery;

	constructor() {

		this.#interval = 500;
		this.#flip = 1*(1000/this.#interval);
		this.#background = document.getElementById('Background');
		this.#candyland = document.getElementById('CandyLand');
		this.#gallery = 21;

		this.#build();
	}



	#build() {

		this.#prepareEventListeners();
		this.#penniesFromHeaven();
	}



	#prepareEventListeners() {

		document.body.addEventListener('mouseup', this.#clickPassThrough.bind(this));
	}

	async #clickPassThrough(e) {

		if(!this.#withinEmptySpace(e)) return false;

		let coin = document.getElementsByClassName('cc');

		if(coin.length > 0) {

			for(let i = 0; i < coin.length; i++) {

				if(this.#withinCoin(e, coin[i])) coin[i].click();
			}
		}
	}



	#penniesFromHeaven() {
	
		setInterval(this.#juggle.bind(this), this.#interval);
	}

	async #juggle() {

		this.#tossCoin(); 
		this.#flipcoin();
	}

	async #tossCoin() {

		if(document.getElementsByClassName('cc').length < 50 && this.#randomInt(this.#flip) === 0) {

			let coinSeed = 10 + this.#randomInt(21);
			let c = document.createElement('IMG');

			c.className = 'cc s' + (30*(1 + coinSeed%10)) + ' pennies-from-heaven-' + (this.#randomInt() == 1 ? 'reverse-':"") + coinSeed;
			c.src = '/images/ChocolateCoin.png';
			c.style.position = 'absolute';
			c.style.left = Math.floor(Math.random()*(window.innerWidth + 30*(1 + coinSeed%10)) - 30*(1 + coinSeed%10)) + 'px';

			c.addEventListener('click', this.#swap.bind(this, c));

			this.#background.appendChild(c);
		}
	}

	async #flipcoin() {

		let coin = document.getElementsByClassName('cc');

		if(coin.length > 0) {

			for(let i = 0; i < coin.length; i++) {

				if(coin[i].y - 100 > this.#candyland.y) coin[i--].remove();
			}
		}
	}



	#swap(e) {

		e.src = '/images/gallery/Gallery' + this.#randomInt(this.#gallery) + '.png';
	}



	#randomInt(scale = 2) { 

		return Math.floor(Math.random()*scale);
	}

	#withinEmptySpace(e) {

		let target = document.elementFromPoint(e.x, e.y);

		return target && (target.tagName === 'BODY' || target.tagName === 'NAV' || target.id === 'content');
	}

	#withinCoin(e, coin) { 

		return ((e.x - (coin.x + coin.clientWidth/2))/(coin.clientWidth/2))**2 + ((e.y - (coin.y + coin.clientHeight/2))/(coin.clientHeight/2))**2 <= 1; 
	}
}



class Ghost {


	static #active = {};

	constructor() {}



	static async open(e, focus = false) {

		if(Ghost.#active[Ghost.#key(e)] !== undefined) {

			Ghost.#active[Ghost.#key(e)].Height = null;
			Ghost.#active[Ghost.#key(e)].Direction = 'Grow';

			return true;
		}

		e.style.minHeight = '0px';
		e.style.maxHeight = e.style.display == "" ? e.clientHeight + 'px' : '0px';
		e.style.display = "";

		Ghost.#specter(e, 'Grow', focus);
		Ghost.#grow(e);
	}

	static async close(e, focus = false) {

		if(Ghost.#active[Ghost.#key(e)] !== undefined) {

			Ghost.#active[Ghost.#key(e)].Height = null;
			Ghost.#active[Ghost.#key(e)].Direction = 'Shrink';

			e.style.minHeight = '0px';

			return true;
		}

		e.style.minHeight = '0px';
		e.style.maxHeight = e.clientHeight + 'px'

		Ghost.#specter(e, 'Shrink', focus);
		Ghost.#shrink(e);
	}

	static async resize(e, focus = false) {

		Ghost.possess(e);

		if(Ghost.#active[Ghost.#key(e)] !== undefined) {

			Ghost.#active[Ghost.#key(e)].Height = null;
			Ghost.#active[Ghost.#key(e)].Direction = 'Resize';

			return true;
		}

		Ghost.#specter(e, 'Resize', focus);
		Ghost.#transition(e);
	}

	static toggle(e) {

		e.style.display = e.style.display != "" ? Ghost.visible(e, true) : Ghost.visible(e, false);

		return true;
	}

	static visible(e, visible = true) {

		e.style.display = visible ? "" : 'none';

		return true;
	}

	static possess(e) {

		e.style.minHeight = e.clientHeight + 'px'
		e.style.maxHeight = e.clientHeight + 'px'

		return true;
	}



	static #key(e) {

		return e.getAttribute('ghost');
	}

	static #specter(e, direction, focus = false) {

		e.setAttribute('ghost', MISC.randomKey());

		Ghost.#active[Ghost.#key(e)] =  {
				Direction: direction, 
				Height: e.clientHeight,
				Delta: Math.max(10, Math.min(20, 10*window.innerWidth/1500)),
				Focus: focus
		};
	}

	static #haunt(e) {

		switch(Ghost.#active[Ghost.#key(e)].Direction) {

			case 'Grow': Ghost.#grow(e); break;
			case 'Shrink': Ghost.#shrink(e); break;
			case 'Resize': Ghost.#transition(e); break;
			default: break;
		}
	}

	static #grow(e) {

		e.style.maxHeight = (e.clientHeight + Ghost.#increment(e)) + 'px';

		if(Ghost.#active[Ghost.#key(e)].Focus) e.scrollIntoView();
		if(Ghost.#active[Ghost.#key(e)].Direction == 'Grow' && e.clientHeight == Ghost.#active[Ghost.#key(e)].Height) return Ghost.#boo(e);

		Ghost.#active[Ghost.#key(e)].Height = e.clientHeight;

		window.setTimeout(Ghost.#haunt, 1, e);
	}

	static #shrink(e) {

		e.style.maxHeight = (e.clientHeight - Ghost.#increment(e)) + 'px';

		if(Ghost.#active[Ghost.#key(e)].Focus) e.scrollIntoView();
		if(Ghost.#active[Ghost.#key(e)].Direction == 'Shrink' && e.clientHeight == Ghost.#active[Ghost.#key(e)].Height) return Ghost.#vanish(e);

		Ghost.#active[Ghost.#key(e)].Height = e.clientHeight;

		window.setTimeout(Ghost.#haunt, 1, e);
	}

	static #transition(e) {

		Ghost.#increment(e);

		e.style.minHeight = (e.clientHeight - Ghost.#active[Ghost.#key(e)].Delta) + 'px';
		e.style.maxHeight = (e.clientHeight + Ghost.#active[Ghost.#key(e)].Delta) + 'px';

		if(Ghost.#active[Ghost.#key(e)].Focus) e.scrollIntoView();
		if(Ghost.#active[Ghost.#key(e)].Direction == 'Resize' && e.clientHeight == Ghost.#active[Ghost.#key(e)].Height) return Ghost.#boo(e);

		Ghost.#active[Ghost.#key(e)].Height = e.clientHeight;

		window.setTimeout(Ghost.#haunt, 1, e);
	}

	static #boo(e) {

		delete Ghost.#active[Ghost.#key(e)];

		e.style.minHeight = "";
		e.style.maxHeight = "";

		e.removeAttribute('ghost');

		return true;
	}

	static #vanish(e) {

		e.style.display = 'none';
		e.style.minHeight = "";
		e.style.maxHeight = "";

		e.removeAttribute('ghost');

		delete Ghost.#active[Ghost.#key(e)];

		return true;
	}

	static #increment(e) {

		Ghost.#active[Ghost.#key(e)].Delta = 0.9*Ghost.#active[Ghost.#key(e)].Delta + 0.1*Math.max(10, Math.min(20, 10*window.innerWidth/1500), 0.05*e.clientHeight);

		return Ghost.#active[Ghost.#key(e)].Delta;
	}
}



class ScrollMaster {


	constructor() {

		this.e = null;
		this.x = 0;
		this.y = 0;
		this.stabilizer = this.stabilize.bind(this);

		this.#prepareEventListeners();
	}

	#prepareEventListeners() {

		let sections = document.getElementsByTagName('SECTION');

		for(let i = 0; i < sections.length; i++) this.#addEventListeners(sections[i]);
	}

	#addEventListeners(section) {

		section.addEventListener('mouseenter', this.#mouseEnterHandler.bind(this));
		section.addEventListener('mouseleave', this.#mouseLeaveHandler.bind(this));
	}

	#mouseEnterHandler(e) {

		this.e = e;
		this.x = window.pageXOffset;
		this.y = window.pageYOffset;

		window.addEventListener('scroll', this.stabilizer);
	}

	#mouseLeaveHandler(e) {

		window.removeEventListener('scroll', this.stabilizer);
	}

	stabilize() {

		let content = 0;

		for(let i = 0; i < this.e.srcElement.childElementCount; i++) content += this.e.srcElement.children[i].scrollHeight;

		if(window.innerWidth >= 1050 && (this.e.srcElement.getAttribute('scroll') == 'Lock' || this.e.srcElement.clientHeight < content)) window.scrollTo(this.x, this.y);
	}
}



class Navigation {


	#active;
	#root;
	#nav;
	#uri;

	constructor() {

		this.#active = false;
		this.#root = 'https://www.chocolatecoinucopia.com';
		this.#nav = {
			'Home': ['Coin Wallet'],
			'Information': [],
			'Analysis': ['Price Chart', 'Valuation'],
			'Buy': ['Chocolate Coin (CHOC)', 'Chocolate Coin 2.0 (CC)'],
			'Exchange': ['Trade', 'Open Orders', 'Trade History']
		};
		this.#uri = {
			'Home>>>Coin Wallet': 'Wallet',
			'Analysis>>>Price Chart': 'Chart',
			'Analysis>>>Valuation': 'Valuation',
			'Buy>>>Chocolate Coin (CHOC)': 'Buy/CHOC',
			'Buy>>>Chocolate Coin 2.0 (CC)': 'Buy/CC',
			'Exchange>>>Trade': 'Exchange',
			'Exchange>>>Open Orders': 'Orders',
			'Exchange>>>Trade History': 'History'
		};

		this.#prepareEventListeners();
	}

	#prepareEventListeners() {

		let keys = Object.keys(this.#nav);
		let sections = document.getElementsByTagName('SECTION');

		window.addEventListener('mousemove', this.#mouseMoveHandler.bind(this));

		if(document.getElementById('Navigation')) document.getElementById('Navigation').addEventListener('mouseleave', this.#mouseLeaveHandler.bind(this));
		if(document.getElementById('ChocolateCoinucopia')) document.getElementById('ChocolateCoinucopia').addEventListener('mouseenter', this.#mouseEnterHandler.bind(this, 'ChocolateCoinucopia'));

		for(let i = 1; i < sections.length; i++) sections[i].addEventListener('mouseenter', this.#mouseLeaveHandler.bind(this));
		for(let i in keys) {

			if(document.getElementById('Nav-' + keys[i])) document.getElementById('Nav-' + keys[i]).addEventListener('mouseenter', this.#mouseEnterHandler.bind(this, keys[i]));
		}
	}

	#mouseMoveHandler(e) {

		this.#active = this.#active || this.#free(e);
	}

	#mouseEnterHandler(key) {

		if(this.#active && this.#nav[key] && this.#nav[key].length) this.#update(key);
		else this.#mouseLeaveHandler();
	}

	#mouseLeaveHandler() {

		if(document.getElementById('Navigation')) Ghost.close(document.getElementById('Navigation'));
	}



	#free(e) {

		let n = document.elementFromPoint(e.x, e.y);
		
		return n.id ? (n.id.substring(0, 4) == 'Nav-' ? false : true) : true;
	}

	#update(key) {

		let menu = document.getElementById('Navigation-Menu');

		menu.replaceChildren();

		for(let i in this.#nav[key]) menu.appendChild(this.#span(key, this.#nav[key][i]));

		Ghost.open(document.getElementById('Navigation'));
	}

	#span(key, value) {

		let s = document.createElement('SPAN');

		s.className = 'block mw-25 nowrap';

		s.appendChild(this.#link(key, value));

		return s;
	}

	#link(key, value) {

		let a = document.createElement('A');

		a.href = this.#root + '/' + this.#uri[key + '>>>' + value];

		a.appendChild(this.#header(value));

		return a;
	}

	#header(text) {

		let h = document.createElement('H1');

		h.innerText = text;

		return h;
	}
}



Promise.all([new Navigation(), new Pennies()]);