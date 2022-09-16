// ChartPalette.js



class ChartPalette {
	
	#name;
	#chart;


	constructor(name, chart) {

		this.#name = name;
		this.#chart = chart;

		this.#build();
	}



	#build() {

		this.#prepareEventListeners();
	}



	#prepareEventListeners() {

		document.getElementById(this.#name + '-Palette-Draw').addEventListener('click', this.#draw.bind(this));
		document.getElementById(this.#name + '-Palette-Move').addEventListener('click', this.#move.bind(this));
		document.getElementById(this.#name + '-Palette-Undo').addEventListener('click', this.#undo.bind(this));
		document.getElementById(this.#name + '-Palette-Save').addEventListener('click', this.#capture.bind(this));
		document.getElementById(this.#name + '-Palette-Graph').addEventListener('click', this.#plot.bind(this));
	}

	async #draw() {

		this.#visible(document.getElementById(this.#name + '-Palette-Draw'), false);
		this.#visible(document.getElementById(this.#name + '-Palette-Move'), true);

		this.#chart.doodle();
	}

	async #move() {

		this.#visible(document.getElementById(this.#name + '-Palette-Move'), false);
		this.#visible(document.getElementById(this.#name + '-Palette-Draw'), true);

		this.#chart.move();
	}

	async #undo() {

		this.#chart.undo();
	}

	async #capture() {

		if(this.#chart.chart.Chart) {

			this.#visible(document.getElementById(this.#name + '-Palette-Save'), false);
			this.#visible(document.getElementById(this.#name + '-Palette-Graph'), true);
	    
	    	this.#chart.save();
    	}
  	}

  	async #plot() {

		this.#visible(document.getElementById(this.#name + '-Palette-Graph'), false);
		this.#visible(document.getElementById(this.#name + '-Palette-Save'), true);
    
    	this.#chart.plot();
  	}



	#visible(e, visible = true) {

		e.style.display = visible ? "" : 'none';
	}
}