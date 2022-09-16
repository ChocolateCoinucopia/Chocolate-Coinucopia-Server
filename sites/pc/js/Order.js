// Order.js


class Order {


	#order;

	constructor(contracts) {

		this.#order = null;

		this.#prepareEventListeners();
	}



	async #prepareEventListeners() {

		document.getElementById('Order-Order').addEventListener('change', this.#loadOrder.bind(this));
		document.getElementById('Order-Order').addEventListener('keyup', this.#loadOrder.bind(this));
		document.getElementById('Order-Base').addEventListener('change', this.#loadBase.bind(this));
		document.getElementById('Order-Base').addEventListener('keyup', this.#loadBase.bind(this));
		document.getElementById('Order-Quote').addEventListener('change', this.#loadQuote.bind(this));
		document.getElementById('Order-Quote').addEventListener('keyup', this.#loadQuote.bind(this));

		document.getElementById('Order-Base').addEventListener('change', this.#rebuildQuote.bind(this));
		document.getElementById('Order-Base').addEventListener('keyup', this.#rebuildQuote.bind(this));

		if(document.getElementById('Order-Open')) document.getElementById('Order-Open').addEventListener('click', this.#loadOrderForm.bind(this));
		if(document.getElementById('Order-Exit')) document.getElementById('Order-Exit').addEventListener('click', this.#hideOrderForm.bind(this));
		
		document.getElementById('Order-Prepare').addEventListener('click', this.#reviewOrder.bind(this));
		document.getElementById('Order-Send').addEventListener('click', this.#confirmOrder.bind(this));
		document.getElementById('Order-Reset-1').addEventListener('click', this.#resetOrder.bind(this));
		document.getElementById('Order-Reset-2').addEventListener('click', this.#resetOrder.bind(this));
		document.getElementById('Order-Edit-1').addEventListener('click', this.#editOrder.bind(this));
		document.getElementById('Order-Edit-2').addEventListener('click', this.#editOrder.bind(this));
	}

	#loadOrder(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			document.getElementById('Order-Predicate').innerText = e.srcElement.value == 'BUY' ? 'with' : 'for';
		}
	}

	#loadBase(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			document.getElementById('Order-Quantity').placeholder = '# of ' + e.srcElement.value;
			document.getElementById('Order-Quote-Base').innerText = document.getElementById('Order-Quote').value + ' per ' + e.srcElement.value;
		}
	}

	#loadQuote(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			document.getElementById('Order-Limit').placeholder = '# of ' + e.srcElement.value;
			document.getElementById('Order-Quote-Base').innerText = e.srcElement.value + ' per ' + document.getElementById('Order-Base').value;
		}
	}

	#rebuildQuote(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			let quotes = Broker.quotes(e.srcElement.value);
			let quote = document.getElementById(e.srcElement.id.replace('Base', 'Quote'));

			quote.replaceChildren();

			for(let i in quotes) quote.appendChild(this.#generateOption(quotes[i], quotes[i]));

			quote.getElementsByTagName('OPTION')[0].selected = true;

			if(quote.id == 'Order-Quote') {

				document.getElementById('Order-Limit').placeholder = '# of ' + document.getElementById('Order-Quote').value;
				document.getElementById('Order-Quote-Base').innerText = document.getElementById('Order-Quote').value + ' per ' + document.getElementById('Order-Base').value;
			}
		}
	}

	#generateOption(coin) {

		let e = document.createElement('OPTION');

		e.innerText = coin;
		e.value = coin;

		return e;
	}

	async #loadOrderForm() {

		this.#order = null;

		document.getElementById('Order-Order').options[0].selected = true;
		document.getElementById('Order-Quantity').value = "";
		document.getElementById('Order-Predicate').innerText = 'with';
		document.getElementById('Order-Limit').value = "";

		this.display('Open');
	}

	async #hideOrderForm() {

		this.#order = null;

		this.display('Close');
	}

	async #resetOrder() {

		this.display('Trade Order', false);

		this.#order = null;

		document.getElementById('Order-Order').options[0].selected = true;
		document.getElementById('Order-Quantity').value = "";
		document.getElementById('Order-Predicate').innerText = 'with';
		document.getElementById('Order-Limit').value = "";

		this.display('Trade Order', true);
	}

	async #reviewOrder() {

		this.display('Trade Order', false);

		let e = document.getElementsByClassName('Order-Confirmation');

		for(let i = 0; i < e.length; i++) e[i].innerHTML = this.#getOrder(' ') + this.#getQuantity(' ') + this.#getBase(' ') + this.#getPredicate(' ') + this.#getQuote(' ') + this.#getLimit(' ') + this.#getRate('.') + '<br>' + this.#getDuration('.') + '<br>' + this.#getValue();

		this.display('Confirm Order', true);
	}

	#getOrder(suffix = "") {

		return document.getElementById('Order-Order').value + suffix;
	}

	#getQuantity(suffix = "") {

		return document.getElementById('Order-Quantity').value.format() + suffix;
	}

	#getBase(suffix = "") {

		return document.getElementById('Order-Base').value + suffix;
	}

	#getPredicate(suffix = "") {

		return document.getElementById('Order-Predicate').innerText + suffix;
	}

	#getQuote(suffix = "") {

		return document.getElementById('Order-Quote').value + suffix;
	}

	#getLimit(suffix = "") {

		return '@ LIMIT Price of ' + document.getElementById('Order-Limit').value.format() + suffix;
	}

	#getRate(suffix = "") {

		return this.#getQuote(' ') + 'per ' + this.#getBase("") + suffix;
	}

	#getDuration(suffix = "") {

		return 'Order is valid until canceled' + suffix;
	}

	#getValue(suffix = "") {

		let order = document.getElementById('Order-Order').value;
		let quantity = document.getElementById('Order-Quantity').value.clean();
		let quote = document.getElementById('Order-Quote').value;
		let limit = document.getElementById('Order-Limit').value.clean();

		switch(order) {

			case 'BUY': return 'Estimated Cost: ' + quantity.mWei(limit).format() + ' ' + quote + suffix;
			case 'SELL': return 'Estimated Proceeds: ' + quantity.mWei(limit).format() + ' ' + quote + suffix;
			default: break;
		}

		return "";
	}

	async #editOrder() {

		this.display('Confirm Order', false);
		this.display('Trade Order', true);
	}

	async #confirmOrder() {

		this.display('Order Confirmed', false);

		let ticket = await Broker.ticket(document.getElementById('Order-Order').value, 
										 document.getElementById('Order-Base').value, 
										 document.getElementById('Order-Quote').value, 
										 document.getElementById('Order-Quantity').value, 
										 document.getElementById('Order-Limit').value);

		this.#order = ticket._address + ticket._ID;

		Broker.placeOrder(ticket).then(success => { if(this.#activeOrder(ticket)) this.display('Order Confirmed', true); }).catch(error => { if(this.#activeOrder(ticket)) this.display('Order Rejected', true); });
	}



	#activeOrder(ticket) {

		return this.#order == ticket._address + ticket._ID;
	}



	display(menu, visible = true) {

		switch(menu) {

			case 'Trade Order':

				Ghost.possess(document.getElementById('Order'));
				Ghost.visible(document.getElementById('Order-Processing'), false);
				Ghost.visible(document.getElementById('Order-Confirmed'), false);
				Ghost.visible(document.getElementById('Order-Rejected'), false);
				Ghost.visible(document.getElementById('Order-Loading'), !visible);
				Ghost.visible(document.getElementById('Order-Ticket'), visible);
				Ghost.resize(document.getElementById('Order'));
			break;
			case 'Confirm Order':

				Ghost.possess(document.getElementById('Order'));
				Ghost.visible(document.getElementById('Order-Processing'), false);
				Ghost.visible(document.getElementById('Order-Confirmed'), false);
				Ghost.visible(document.getElementById('Order-Rejected'), false);
				Ghost.visible(document.getElementById('Order-Loading'), !visible);
				Ghost.visible(document.getElementById('Order-Confirm'), visible);
				Ghost.resize(document.getElementById('Order'));
			break;
			case 'Order Confirmed':

				Ghost.possess(document.getElementById('Order'));
				Ghost.visible(document.getElementById('Order-Confirm'), false);
				Ghost.visible(document.getElementById('Order-Rejected'), false);
				Ghost.visible(document.getElementById('Order-Loading'), false);
				Ghost.visible(document.getElementById('Order-Processing'), !visible);
				Ghost.visible(document.getElementById('Order-Confirmed'), visible);
				Ghost.resize(document.getElementById('Order'));
			break;
			case 'Order Rejected':

				Ghost.possess(document.getElementById('Order'));
				Ghost.visible(document.getElementById('Order-Confirm'), false);
				Ghost.visible(document.getElementById('Order-Confirmed'), false);
				Ghost.visible(document.getElementById('Order-Loading'), false);
				Ghost.visible(document.getElementById('Order-Processing'), !visible);
				Ghost.visible(document.getElementById('Order-Rejected'), visible);
				Ghost.resize(document.getElementById('Order'));
			break;
			case 'Order':

				Ghost.possess(document.getElementById('Order'));
				Ghost.visible(document.getElementById('Order-Confirm'), false);
				Ghost.visible(document.getElementById('Order-Rejected'), false);
				Ghost.visible(document.getElementById('Order-Confirmed'), false);
				Ghost.visible(document.getElementById('Order-Processing'), false);
				Ghost.visible(document.getElementById('Order-Loading'), !visible);
				Ghost.visible(document.getElementById('Order-Ticket'), visible);
				Ghost.visible(document.getElementById('Order'), visible);
			break;
			case 'Open': 

				Ghost.visible(document.getElementById('Order-Processing'), false);
				Ghost.visible(document.getElementById('Order-Confirmed'), false);
				Ghost.visible(document.getElementById('Order-Rejected'), false);
				Ghost.visible(document.getElementById('Order-Confirm'), false);
				Ghost.visible(document.getElementById('Order-Loading'), false);
				Ghost.visible(document.getElementById('Order-Ticket'), true);
				Ghost.open(document.getElementById('Order')); 
			break;
			case 'Close': Ghost.close(document.getElementById('Order')); break;
			default: break;
		}
	}
}