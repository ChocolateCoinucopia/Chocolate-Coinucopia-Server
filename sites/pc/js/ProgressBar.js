// ProgressBar.js



class ProgressBar {
	

	#name;
	#max;

	constructor(name) {

		this.#name = name;
		this.#max = 100;
	}



	update() {

		this.set(this.#progress()/100*this.#max);
	}

	set(x) {

		document.getElementById(this.#name).style.width = x + '%';
	}

	reset() {

		this.set(0);
	}

	target(x) {

		this.#max = x.f();
	}

	addTarget(x) {

		this.#max += x.f();
	}

	add(x) {

		this.set(Math.min(100, this.#progress() + x.f()/Math.max(1, this.#max)*100));
	}

	subtract(x) {

		this.set(Math.max(0, this.#progress() - x.f()/Math.max(1, this.#max)*100));
	}



	#progress() {

		let progress = document.getElementById(this.#name).style.width.f();

		return isNaN(progress) ? 0 : progress;
	}
}