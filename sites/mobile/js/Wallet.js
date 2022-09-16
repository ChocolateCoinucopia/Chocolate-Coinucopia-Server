// Wallet.js



class Wallet {


	constructor() {

		this.#prepareEventListeners();
    	this.#build();
	}



	async #prepareEventListeners() {

		let h = document.getElementById('Wallet-Headers').children;

		for(let i = 0; i < h.length; i++) h[i].firstElementChild.addEventListener('click', this.#rebuild.bind(this, h[i].firstElementChild.firstElementChild.innerText));
	}



	async #build() {

		this.display('Wallet', false);

		let coins = ['ETH'];
		let wallet = document.getElementById('Wallet-Coins');

		coins.push(...Object.keys(window.keyRing[window.web3.currentProvider.networkVersion]));

		wallet.replaceChildren();

		if(await Broker.activateCoinsLite(...coins)) coins.forEach(async (coin) => { this.#tableRow(coin).then(e => this.#buildTable(e)).then(success => this.display('Wallet', wallet.children.length == coins.length)); });
	}

	#rebuild(key = 'Ticker') {

		this.display('Wallet', false);

		let rows = [];
		let wallet = document.getElementById('Wallet-Coins');
		let reverse = this.#getDirection(key);

		for(let i = 0; i < wallet.children.length; i++) rows.push(wallet.children[i]);

		wallet.replaceChildren();

		rows.forEach(row => this.#buildTable(row, key, reverse));

		this.display('Wallet', true);
	}

	#buildTable(e, key = 'Ticker', reverse = false) {

		let wallet = document.getElementById('Wallet-Coins');
		let index = this.#getColumn(key);

		if(index != null) {

			for(let i = 0; i < wallet.children.length; i++) {

				if(this.#compareCells(e.children[index], wallet.children[i].children[index], reverse)) return wallet.insertBefore(e, wallet.children[i]);
			}
		}

		return wallet.appendChild(e);
	}

	async #tableRow(coin) {

		let row = document.createElement('TR');

		row.appendChild(await this.#tickerCell(coin));
		row.appendChild(await this.#nameCell(coin));
		row.appendChild(await this.#balanceCell(coin));
		row.appendChild(await this.#approvalCell(coin));

		return row;
	}

	async #tickerCell(coin) {

		let cell = document.createElement('TD');

		cell.id = 'Wallet-' + coin;
		cell.className = 'pw-10 right numeric';
		cell.innerText = coin;

		return cell;
	}

	async #nameCell(coin) {

		let cell = document.createElement('TD');

		cell.className = 'pw-10 nowrap left numeric';
		cell.innerText = coin == 'ETH' ? 'Ether' : (await Broker.contracts[coin].Coin.methods.name().call());

		return cell;
	}

	async #balanceCell(coin) {

		let cell = document.createElement('TD');

		cell.className = 'pw-10 numeric';
		cell.innerText = coin == 'ETH' ? (await window.web3.eth.getBalance(window.account)).eth().format() : (await Broker.contracts[coin].Coin.methods.balanceOf(window.account).call()).eth().format();

		this.#updateTransactions(coin);

		return cell;
	}

	async #approvalCell(coin) {

		let cell = document.createElement('TD');

		cell.className = 'pw-10';

		if(coin == 'ETH') cell.innerText = 'N/A';
		else {
		
			cell.appendChild(await this.#approvalCheckBox(coin));
			cell.appendChild(await this.#approvalProcessingDisplay());
		}

		return cell;
	}

	async #approvalCheckBox(coin) {

		let box = document.createElement('INPUT');

		box.className = 'Wallet';

		box.setAttribute('type', 'checkbox');

		box.checked = (await Broker.contracts[coin].Coin.methods.allowance(window.account, window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address).call()).BN().gt(('0').BN());

		box.addEventListener('change', Wallet.approve.bind(this, coin));

		this.#updateApproval(coin);

		return box;
	}

	async #approvalProcessingDisplay() {

		let img = document.createElement('IMG');

		img.className = 'Loading s30'
		img.src = '/images/ChocolateCoin.png';
		img.alt = "";
		img.style.display = "none";

		return img;
	}



	static async approve(coin) {

		this.display('Wallet-' +  coin, false);

		Broker.approve(coin, window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address, document.getElementById('Wallet-' + coin).nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.checked ? ('2').BN().pow(('256').BN()).sub(('1').BN()).s() : '0').then(success => this.#updateApprovalStatus(coin)).catch(error => this.#updateApprovalStatus(coin));
	}

	async #updateApprovalStatus(coin) {

		if(document.getElementById('Wallet-' + coin)) document.getElementById('Wallet-' + coin).nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.checked = (await Broker.contracts[coin].Coin.methods.allowance(window.account, window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address).call()).BN().gt(('0').BN());

		this.display('Wallet-' +  coin, true);
	}

	async #updateBalance(coin) {

		if(document.getElementById('Wallet-' + coin)) document.getElementById('Wallet-' + coin).nextElementSibling.nextElementSibling.innerText = coin == 'ETH' ? (await window.web3.eth.getBalance(window.account)).eth().format() : (await Broker.contracts[coin].Coin.methods.balanceOf(window.account).call()).eth().format();
	}

	async #updateTransactions(coin) {

		if(coin == 'ETH') this.#updateTransactionsEther();
		else {

			this.#updateTransferFrom(coin);
			this.#updateTransferTo(coin);
		}
	}

	async #updateTransactionsEther() {

		window.web3.eth.subscribe('logs').on('data', async (event) => this.#updateBalance('ETH'));
	}

	async #updateTransferFrom(coin) {

	  Broker.contracts[coin].Coin.events.Transfer({
	      filter: {'_from': window.account},
	      fromBlock: 'latest'
	    }).on('data', async (event) => {

	    	this.#updateBalance(coin);
	    	this.#updateApprovalStatus(coin);
    	});
	}

	async #updateTransferTo(coin) {

	  Broker.contracts[coin].Coin.events.Transfer({
	      filter: {'_to': window.account},
	      fromBlock: 'latest'
	    }).on('data', async (event) => this.#updateBalance(coin));
	}

	async #updateApproval(coin) {

	  Broker.contracts[coin].Coin.events.Approval({
	      filter: {'_owner': window.account, '_spender': window.keyRing[window.web3.currentProvider.networkVersion][coin].DEX.Address},
	      fromBlock: 'latest'
	    }).on('data', async (event) => this.#updateApprovalStatus(coin));
	}



	#getColumn(x) {

		let h = document.getElementById('Wallet-Headers').children;

		x = x.toLowerCase();

		for(let i = 0; i < h.length; i++) {

			if(x == h[i].firstElementChild.firstElementChild.innerText.toLowerCase()) return i;
		}

		return null;
	}

	#getDirection(x) {

		let rows = document.getElementById('Wallet-Coins').children;
		let index = this.#getColumn(x);

		for(let i = 1; i < rows.length; i++) {

			if(!this.#first(rows[0].children[index], rows[i].children[index])) return false;
		}

		return true;
	}

	#compareCells(a, b, reverse = false) {

		let e12, e21;

		a = a.firstElementChild ? a.firstElementChild.checked.f().s() : a.innerText;
		b = b.firstElementChild ? b.firstElementChild.checked.f().s() : b.innerText;

		e12 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? a.s() : a.clean().f();
		e21 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? b.s() : b.clean().f();

		return reverse ? e12 >= e21 : e12 < e21;
	}

	#first(a, b, reverse = false) {

		let e12, e21;

		a = a.firstElementChild ? a.firstElementChild.checked.f().s() : a.innerText;
		b = b.firstElementChild ? b.firstElementChild.checked.f().s() : b.innerText;

		e12 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? a.s() : a.clean().f();
		e21 = isNaN(a.replace(/,/g, "")) || isNaN(b.replace(/,/g, "")) ? b.s() : b.clean().f();

		return reverse ? e12 >= e21 : e12 <= e21;
	}

	display(menu, visible = true) {

		switch(menu) {

			case 'Wallet':

				Ghost.possess(document.getElementById('Wallet'));
				Ghost.visible(document.getElementById('Wallet-Loading'), !visible);
				Ghost.visible(document.getElementById('Wallet-Account'), visible);
				Ghost.resize(document.getElementById('Wallet'));
			break;
			case 'Lock': Ghost.possess(document.getElementById('Wallet')); break;
			case 'Unlock': Ghost.resize(document.getElementById('Wallet')); break;
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
