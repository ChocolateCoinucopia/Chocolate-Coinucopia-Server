// AddressBook.js



class AddressBook {


	#providers = {
		'1': 'Mainnet',
		'4': 'Rinkeby',
		'42': 'Kovan'
	};
	#coins = {
		'CHOC': 'Chocolate Coin',
		'CC': 'Chocolate Coin 2.0'
	};

	constructor() {

		this.#prepareEventListeners();
		this.#build();
		this.#reveal();
	}



	#prepareEventListeners() {

		document.getElementById('AddressBook-Network').addEventListener('change', this.#updateNetwork.bind(this));
		document.getElementById('AddressBook-Network').addEventListener('keyup', this.#updateNetwork.bind(this));
		document.getElementById('AddressBook-Coin').addEventListener('change', this.#updateAddress.bind(this));
		document.getElementById('AddressBook-Coin').addEventListener('keyup', this.#updateAddress.bind(this));
	}

	#updateNetwork(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			this.rebuild();
		}
	}

	#updateAddress(e) {

		if(e.type === 'change' || e.type === 'keyup' && e.key ==='Enter') {

			this.refreshAddress();
		}
	}



	#build() {

		let e = document.getElementById('AddressBook-Network');
		let networks = Object.keys(window.keyRing);

		e.replaceChildren();

		for(let i in networks) {

			e.appendChild(this.#generateOption(this.#providers[networks[i]] ? this.#providers[networks[i]] : networks[i], networks[i]));

			if(networks[i] == this.#getNetwork()) e.options.selectedIndex = i;
		}

		this.rebuild();
	}

	rebuild() {

		let e = document.getElementById('AddressBook-Coin');
		let coins = Object.keys(window.keyRing[this.#getNetwork()]);

		e.replaceChildren();

		for(let i in coins) e.appendChild(this.#generateOption(this.#coins[coins[i]] ? this.#coins[coins[i]] + ' (' + coins[i] + ')' : coins[i], coins[i]));

		e.options.selectedIndex = 0;

		this.refreshAddress();
	}

	refreshAddress() {

		document.getElementById('AddressBook-Contract').innerText = window.keyRing[document.getElementById('AddressBook-Network').value][document.getElementById('AddressBook-Coin').value].Coin.Address;
	}

	#generateOption(text, value) {

		let e = document.createElement('OPTION');

		e.innerText = text;
		e.value = value;

		return e;
	}



	#reveal() {

		Ghost.open(document.getElementById('AddressBook'));
	}



	#getNetwork() {

		return window.web3 ? window.web3.currentProvider.networkVersion : '1';
	}
}
