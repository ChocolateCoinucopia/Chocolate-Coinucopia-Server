// Chart.js



class Chart {

  chart;
  #name;


  constructor(name) {

    this.chart = {};
    this.#name = name;

    MISC.prototypes();
  }



  generate(coins = null, labels = null, units = null, colors = null, theme = null) {
    
    this.#generatePrimaryChart(coins, labels, units, colors, theme);
  }

  refresh() {

    this.#refreshPrimaryChart();
  }

  add(coin = null, label = null, units = null, color = null) {

    if(coin) {

      if(!this.chart.Chart) this.generate([coin], [label], [units], [color]);
      else {

        this.chart.Parameters.Data.push(coin);
        this.chart.Parameters.Labels.push(label);
        this.chart.Parameters.Units.push(units);
        this.chart.Parameters.Colors.push(color);
        this.chart.Parameters.Track.push(true);

        this.refresh();
      }
    }
  }

  remove(index = 0) {

    if(this.chart.Parameters.Data[index]) {

      this.chart.Parameters.Data.splice(index, 1);
      
      if(this.chart.Parameters.Labels[index]) this.chart.Parameters.Labels.splice(index, 1);
      if(this.chart.Parameters.Units[index]) this.chart.Parameters.Units.splice(index, 1);
      if(this.chart.Parameters.Colors[index]) this.chart.Parameters.Colors.splice(index, 1);
      if(!this.#isNA(this.chart.Parameters.Track[index])) this.chart.Parameters.Track.splice(index, 1);

      this.refresh();
    }
  }

  setTheme(theme = null) {

    this.chart.Parameters.Theme = theme;

    this.refresh();
  }

  save() {

    let a = document.createElement('A');

    a.style.display = 'none';
    a.download = 'Chocolate Coin Price Chart (' + Date.now() + ').png';

    if(this.chart.Interface) {
  
      this.chart.Chart.Context.drawImage(this.chart.Interface.Canvas, 0, 0);

      a.href = this.chart.Chart.Canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

      document.body.appendChild(a);

      a.click();
      a.remove();

      this.draw();
    }
    else if(this.chart.Chart) {

      a.href = this.chart.Chart.Canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

      document.body.appendChild(a);

      a.click();
      a.remove();
    }
  }



  #generatePrimaryChart(coins, labels, units, colors, theme) {
    
    this.chart = {};

    this.chart['Parameters'] = this.#setParameters(coins, labels, units, colors, theme);

    this.chart['Chart'] = this.#generatePrimaryDisplay();
    this.chart['Interface'] = this.#generatePrimaryInterface();
    
    this.#refreshPrimaryChart();
  }

  #refreshPrimaryChart() {

    this.align(true);
    
    this.chart['Theme'] = this.#generatePrimaryTheme();
    this.chart['Primary'] = this.#generatePrimaryStatus();
    this.chart['Coins'] = this.#generatePrimaryCoins();
    this.chart['Horizon'] = this.#generatePrimaryHorizon();
    this.chart['M'] = this.#generatePrimaryM();
    this.chart['Limits'] = this.#generatePrimaryLimits();
    this.chart['Frame'] = this.#generatePrimaryFrame();
    this.chart['Girth'] = this.#generatePrimaryGirth();
    this.chart['Legend'] = this.#generatePrimaryLegend();
    this.chart['Grid'] = this.#generatePrimaryGrid();
    this.chart['Secondary'] = this.#generateSecondaryCharts();

    this.draw();
  }

  #setParameters(coins, labels, units, colors, theme) {

    return {'Data': coins, 'Labels': labels, 'Units': units, 'Colors': colors, 'Theme': theme, 'Track': new Array(coins.length).fill(true)};
  }

  #generatePrimaryDisplay() {

    this.chart['Chart'] = {};

    this.chart['Chart']['Canvas'] = document.getElementById(this.#name);
    this.chart['Chart']['Context'] = this.chart['Chart']['Canvas'].getContext('2d');

    return this.chart['Chart'];
  }

  #generatePrimaryInterface() {

    if(!document.getElementById(this.#name + '-Interface')) return null;

    this.chart['Interface'] = {};

    this.chart['Interface']['Canvas'] = document.getElementById(this.#name + '-Interface');
    this.chart['Interface']['Context'] = this.chart.Interface.Canvas.getContext('2d');
    this.chart['Interface']['Mouse'] = {x: 0, y: 0, Active: false, Focus: null};
    this.chart['Interface']['GUI'] = {x: 0, Lock: false, Marks: []};

    this.chart['Interface']['Canvas'].width = this.chart.Chart.Canvas.width;
    this.chart['Interface']['Canvas'].height = this.chart.Chart.Canvas.height;

    this.#generateGUIEventListeners();

    return this.chart['Interface'];
  }

  #generatePrimaryTheme() {

    let standard = {'Text': '#5C2105', 'Grid': '#5C2105', 'Background': 'rgba(255, 255, 255, 0)'};

    if(this.chart.Parameters.Theme) for(let i in standard) standard[i] = this.chart.Parameters.Theme[i] ? this.chart.Parameters.Theme[i] : standard[i];

    return standard;
  }

  #generatePrimaryStatus() {

    return true;
  }

  #generatePrimaryCoins() {

    let indices = this.#selectPrimaryIndices();
    let sides = this.#clusterAxes(indices);
    let single = !this.#isDoubleAxis(sides);

    this.chart['Coins'] = [];

    for(let i in indices) this.chart['Coins'].push({Data: this.chart.Parameters.Data[indices[i]], Label: this.chart.Parameters.Labels[indices[i]] ? this.chart.Parameters.Labels[indices[i]] : 'Line ' + indices[i], Units: this.chart.Parameters.Units[indices[i]] ? this.chart.Parameters.Units[indices[i]] : "", Color: this.chart.Parameters.Colors[indices[i]] ? this.chart.Parameters.Colors[indices[i]] : this.randomColor(), Index: 0, Axis: sides[indices[i]], Side: single ? 'R' : sides[indices[i]], Track: this.chart.Parameters.Track[indices[i]], P: indices[i]});

    return this.chart['Coins'];
  }

  #generatePrimaryHorizon() {

    let minH = Infinity, maxH = -Infinity;
    
    for(let i in this.chart.Parameters.Data) this.chart.Parameters.Data[i].forEach((c) => { 

      minH = Math.min(minH, c.x);
      maxH = Math.max(maxH, c.x);
    });

    minH = !isNaN(minH) && isFinite(minH) ? moment(minH).startOf('day').valueOf() : moment('1-1-2022').startOf('day').valueOf();
    maxH = !isNaN(maxH) && isFinite(maxH) ? moment(maxH).add(1, 'day').startOf('day').valueOf() : moment().add(1, 'day').startOf('day').valueOf();

    this.chart.Horizon = {'Min': minH, 'Max': maxH};

    return this.chart['Horizon'];
  }

  #generatePrimaryM() {
    
    return this.chart.Chart.Canvas.width/this.#scaleX(this.chart);
  }

  #generatePrimaryLimits(labels, units) {

    let minL = Infinity, maxL = -Infinity;
    let minR = Infinity, maxR = -Infinity;
    
    for(let i in this.chart.Coins) {
      
      if(this.chart.Coins[i].Axis == 'L') {

        this.chart.Coins[i].Data.forEach((c) => minL = Math.min(minL, c.y));
        this.chart.Coins[i].Data.forEach((c) => maxL = Math.max(maxL, c.y));
      }
      else if(this.chart.Coins[i].Axis == 'R') {

        this.chart.Coins[i].Data.forEach((c) => minR = Math.min(minR, c.y));
        this.chart.Coins[i].Data.forEach((c) => maxR = Math.max(maxR, c.y));
      }
    }

    this.chart['Limits'] = {L: {
                              Min: !isNaN(minL) && isFinite(minL) ? Math.max(maxL == minL ? 0.95*minL : minL - 0.05*(maxL -  minL), 0) : null, 
                              Max: !isNaN(maxL) && isFinite(maxL) ? (maxL == minL ? 1.05*maxL : maxL + 0.05*(maxL -  minL)) : null
                            }, 
                            R: { 
                              Min: !isNaN(minR) && isFinite(minR) ? Math.max(maxR == minR ? 0.95*minR : minR - 0.05*(maxR - minR), 0) : null, 
                              Max: !isNaN(maxR) && isFinite(maxR) ? (maxR == minR ? 1.05*maxR : maxR + 0.05*(maxR - minR)) : null
                            }
                           };

    return this.chart['Limits'];
  }

  #generatePrimaryFrame() {
    
    this.chart['Frame'] = {};
    
    this.chart.Frame['w'] = Math.round(0.8*this.chart.Chart.Canvas.width);
    this.chart.Frame['h'] = Math.round(0.8*this.chart.Chart.Canvas.height);
    this.chart.Frame['x'] = Math.round(0.1*this.chart.Chart.Canvas.width);
    this.chart.Frame['y'] = Math.round(0.1*this.chart.Chart.Canvas.height);
    this.chart.Frame['Padding'] = {'x': this.chart.Frame.x, 'y': this.chart.Frame.y};

    return this.chart['Frame'];
  }

  #generatePrimaryGirth() {
    
    return Math.ceil(1 + 0.001*this.chart.Frame.w);
  }

  #generatePrimaryLegend() {

    let legend = [], row = [];
    let n, x, y, space = Math.round(0.8*this.chart.Frame.Padding.y*(this.chart.Coins.length - 1));

    this.chart.Chart.Context.font = Math.round(0.32*this.chart.Frame.Padding.y) + 'px bree';

    for(let i in this.chart.Coins) space += Math.round(0.3*this.chart.Frame.Padding.y) + this.chart.Chart.Context.measureText(' ' + this.chart.Coins[i].Label + ' ' + this.#getDot(this.chart, i) + ' ⨂').width;

    y = space > this.chart.Frame.w ? this.chart.Frame.y - Math.round(3*this.chart.Frame.Padding.y/4) : this.chart.Frame.y - Math.round(this.chart.Frame.Padding.y/4);

    for(let i = 0; i < this.chart.Coins.length; y += Math.round(this.chart.Frame.Padding.y/2), this.chart.Frame.y += legend.length > 2 ? Math.round(0.5*this.chart.Frame.Padding.y) : 0) {

      n = 0;
      space = 0;
      row = [];

      this.chart.Chart.Context.font = Math.round(0.32*this.chart.Frame.Padding.y) + 'px bree';

      for(let j = i; j < this.chart.Coins.length && (j == i || space + Math.round(0.3*this.chart.Frame.Padding.y) + this.chart.Chart.Context.measureText(' ' + this.chart.Coins[j].Label + ' ' + this.#getDot(this.chart, j) + ' ⨂').width + (space == 0 ? 0 : Math.round(0.8*this.chart.Frame.Padding.y)) <= this.chart.Frame.w); n++, space += Math.round(0.3*this.chart.Frame.Padding.y) + this.chart.Chart.Context.measureText(' ' + this.chart.Coins[j].Label + ' ' + this.#getDot(this.chart, j++) + ' ⨂').width + (space == 0 ? 0 : Math.round(0.8*this.chart.Frame.Padding.y))) {}
      
      x = this.chart.Frame.x + (this.chart.Frame.w - space)/2;

      for(let j = i; i < j + n; x += Math.round(0.8*this.chart.Frame.Padding.y) + Math.round(0.3*this.chart.Frame.Padding.y) + this.chart.Chart.Context.measureText(' ' + this.chart.Coins[i].Label + ' ' + this.#getDot(this.chart, i++) + ' ⨂').width) {

        row.push({Marker: {
                    x: x + Math.round(0.15*this.chart.Frame.Padding.y), 
                    y: y,
                    r: Math.round(0.15*this.chart.Frame.Padding.y)
                  }, 
                  Label: {
                    x: x + Math.round(0.3*this.chart.Frame.Padding.y), 
                    y: y
                  },
                  Dot: {
                    x: x + Math.round(0.3*this.chart.Frame.Padding.y) + this.chart.Chart.Context.measureText(' ' + this.chart.Coins[i].Label + ' ').width + this.chart.Chart.Context.measureText(this.#getDot(this.chart, i)).width/2,
                    y: y,
                    r: this.chart.Chart.Context.measureText('⨂').width/2
                  },
                  X: {
                    x: x + Math.round(0.3*this.chart.Frame.Padding.y) + this.chart.Chart.Context.measureText(' ' + this.chart.Coins[i].Label + ' ' + this.#getDot(this.chart, i) + ' ').width + this.chart.Chart.Context.measureText('⨂').width/2,
                    y: y,
                    r: this.chart.Chart.Context.measureText('⨂').width/2
                  },
                  C: i
                });
      }

      legend.push(MISC.clone(row));

      if(legend.length > 2) this.#extendChart(Math.round(0.5*this.chart.Frame.Padding.y));
    }

    return legend;
  }

  #generatePrimaryGrid() {
    
    this.chart['Grid'] = {};
    
    return {x: this.#generatePrimaryGridX(), y: {L: this.#generatePrimaryGridY('L', this.#selectPrimaryUnits('L')), R: this.#generatePrimaryGridY('R', this.#selectPrimaryUnits('R'))}};
  }



  #generatePrimaryGridX() {
    
    let h = Math.ceil(this.#scaleX(this.chart)/(24*60*60*1000));

    if(h <= 2) return this.#generatePrimaryGridXHours();
    else if(h <= 14) return this.#generatePrimaryGridXDays();
    else if(h <= 90) return this.#generatePrimaryGridXWeeks();
    else if(h <= 365) return this.#generatePrimaryGridXMonths();
    else if(h <= 730) return this.#generatePrimaryGridXQuarters();
    else return this.#generatePrimaryGridXYears();
  }

  #generatePrimaryGridY(y, units) {

    if(this.#isNA(this.chart.Limits[y].Min) || this.#isNA(this.chart.Limits[y].Max)) return null;
    
    let precision;
    let min, max, m = 10**Math.round(Math.log10(this.chart.Limits[y].Max - this.chart.Limits[y].Min) - 2);
    let increment = [10, 20, 25, 50];
    
      for(let i in increment) {
        
        min = ((this.chart.Limits[y].Min + ((m*increment[i]) - this.chart.Limits[y].Min%(m*increment[i]))).toFixed(Math.max(0, -Math.log10(m)))).f();
        max = ((this.chart.Limits[y].Max - this.chart.Limits[y].Max%(m*increment[i])).toFixed(Math.max(0, -Math.log10(m)))).f();
        
        if((max - min)/(m*increment[i]) <= 10) {

          m = ((m*increment[i]).toFixed(Math.min(18, Math.max(0, 2 - Math.ceil(Math.log10(m*increment[i])))))).f();
          precision = MISC.getPrecision(min, m);

          return {Ticks: this.#generateGridYIncrements(min, this.chart.Limits[y].Max, m, units, precision), Precision: precision};
        }
      }

    return null;
  }

  #generatePrimaryGridXHours() {

    let s = Math.ceil((this.chart.Horizon.Max - this.chart.Horizon.Min)/(6*60*60*1000));
    let grid = [];
    
    for(let i = this.chart.Horizon.Min; i <= this.chart.Horizon.Max; i = moment(i).add(s, 'hour').valueOf()) grid.push({x: i, Label: moment(i).format('h:mm a')});
    
    return grid;
  }

  #generatePrimaryGridXDays() {
    
    let s = Math.ceil((this.chart.Horizon.Max - this.chart.Horizon.Min)/(7*24*60*60*1000));
    let grid = [];
    
    for(let i = this.chart.Horizon.Min; i <= this.chart.Horizon.Max; i = moment(i).add(s, 'day').valueOf()) grid.push({x: i, Label: moment(i).format('MMM D')});
    
    return grid;
  }

  #generatePrimaryGridXWeeks() {
    
    let s = Math.ceil((this.chart.Horizon.Max - this.chart.Horizon.Min)/(6*7*24*60*60*1000));
    let grid = [];
    
    for(let i = this.chart.Horizon.Min == moment(this.chart.Horizon.Min).startOf('week') ? this.chart.Horizon.Min : moment(this.chart.Horizon.Min).add(1, 'week').startOf('week').valueOf(); i <= this.chart.Horizon.Max; i = moment(i).add(s, 'week').valueOf()) grid.push({x: i, Label: moment(i).format('MMM D')});
    
    return grid;
  }

  #generatePrimaryGridXMonths() {
    
    let s = Math.ceil((this.chart.Horizon.Max - this.chart.Horizon.Min)/(26*7*24*60*60*1000));
    let grid = [];
    
    for(let i = this.chart.Horizon.Min == moment(this.chart.Horizon.Min).startOf('month') ? this.chart.Horizon.Min : moment(this.chart.Horizon.Min).add(1, 'month').startOf('month').valueOf(); i <= this.chart.Horizon.Max; i = moment(i).add(s, 'month').valueOf()) grid.push({x: i, Label: moment(i).format('MMM D')});
    
    return grid;
  }

  #generatePrimaryGridXQuarters() {
    
    let grid = [];
    
    for(let i = this.chart.Horizon.Min == moment(this.chart.Horizon.Min).startOf('quarter') ? this.chart.Horizon.Min : moment(this.chart.Horizon.Min).add(1, 'quarter').startOf('quarter').valueOf(); i <= this.chart.Horizon.Max; i = moment(i).add(1, 'quarter').valueOf()) grid.push({x: i, Label: moment(i).format('[Q]Q YYYY')});
    
    return grid;
  }

  #generatePrimaryGridXYears() {
    
    let s = Math.ceil((this.chart.Horizon.Max - this.chart.Horizon.Min)/(365*24*60*60*1000)/12);
    let grid = [];
    
    for(let i = this.chart.Horizon.Min == moment(this.chart.Horizon.Min).startOf('year') ? this.chart.Horizon.Min : moment(this.chart.Horizon.Min).add(1, 'year').startOf('year').valueOf(); i <= this.chart.Horizon.Max; i = moment(i).add(s, 'year').valueOf()) grid.push({x: i, Label: moment(i).format('YYYY')});
    
    return grid;
  }

  #generateGridYIncrements(min, max, increment, units, precision) {

    let grid = [];

    min = min.toFixed(18).weiBN();
    max = max.toFixed(18).weiBN();
    increment = increment.toFixed(18).weiBN();
    
    for(let i = min; i.lte(max); i = i.add(increment)) grid.push({y: i.eth().f(), Label: i.coin(units, precision)});
    
    return grid;
  }



  #generateSecondaryCharts() {

    this.chart['Secondary'] = [];

    for(let i in this.chart.Parameters.Data) {

      if(this.#isSecondary(this.chart.Parameters.Labels[i])) this.chart['Secondary'].push(this.#generateSecondaryChart(i));
    }
   
    return this.chart['Secondary'];
  }

  #generateSecondaryChart(index) {
    
    var secondary = {};

    secondary['Chart'] = this.#generateSecondaryDisplay(secondary);
    secondary['Interface'] = this.#generateSecondaryInterface(secondary);
    secondary['Theme'] = this.#generateSecondaryTheme(secondary);
    secondary['Primary'] = this.#generateSecondaryStatus(secondary);
    secondary['Coins'] = this.#generateSecondaryCoin(secondary, index);
    secondary['Horizon'] = this.#generateSecondaryHorizon(secondary);
    secondary['M'] = this.#generateSecondaryM(secondary);
    secondary['Limits'] = this.#generateSecondaryLimits(secondary);
    secondary['Frame'] = this.#generateSecondaryFrame(secondary);
    secondary['Girth'] = this.#generateSecondaryGirth(secondary);
    secondary['Legend'] = this.#generateSecondaryLegend(secondary);
    secondary['Grid'] = this.#generateSecondaryGrid(secondary);

    return secondary;
  }

  #generateSecondaryDisplay(secondary) {

    return this.chart.Chart;
  }

  #generateSecondaryInterface(secondary) {

    return this.chart.Interface;
  }

  #generateSecondaryTheme(secondary) {

    return this.chart.Theme;
  }

  #generateSecondaryStatus(secondary) {

    return false;
  }

  #generateSecondaryCoin(secondary, index) {

    return [{Data: this.chart.Parameters.Data[index], Label: this.chart.Parameters.Labels[index], Units: this.chart.Parameters.Units[index] ? this.chart.Parameters.Units[index] : "", Color: this.chart.Parameters.Colors[index] ? this.chart.Parameters.Colors[index] : this.randomColor(), Index: 0, Axis: 'L', Side: 'R', Track: this.chart.Parameters.Track[index], P: index}];
  }

  #generateSecondaryHorizon(secondary) {

    return this.chart.Horizon;
  }

  #generateSecondaryM(secondary) {

    return this.chart.M;
  }

  #generateSecondaryLimits(secondary) {

    let min = Infinity, max = -Infinity;

    secondary.Coins[0].Data.forEach((c) => min = Math.min(min, c.y));
    secondary.Coins[0].Data.forEach((c) => max = Math.max(max, c.y));

    return {L: {
              Min: !isNaN(min) && isFinite(min) ? Math.max(min - 0.05*(max - min), 0) : null,
              Max: !isNaN(max) && isFinite(max) ? max + 0.05*(max - min) : null
            },
            R: null
           };
  }

  #generateSecondaryFrame(secondary) {

    var frame = {};

    if(this.chart.Coins.length == 0 && this.chart.Secondary.length == 0) {
    
      frame['w'] = this.chart.Frame.w;
      frame['h'] = this.chart.Parameters.Data.length == 1 ? this.chart.Frame.h : Math.round(0.5*this.chart.Frame.h);
      frame['x'] = this.chart.Frame.x;
      frame['y'] = this.chart.Frame.y;
      frame['Padding'] = this.chart.Frame.Padding;
    }
    else if(this.chart.Coins.length == 0 && this.chart.Secondary.length == 1) {

      frame['w'] = this.chart.Frame.w;
      frame['h'] = Math.round(0.5*this.chart.Frame.h);
      frame['x'] = this.chart.Frame.x;
      frame['y'] = this.chart.Secondary[0].Frame.y + this.chart.Secondary[0].Frame.h + 2*this.chart.Secondary[0].Frame.Padding.y;
      frame['Padding'] = this.chart.Frame.Padding;

      this.#extendChart(2*frame.Padding.y);
    }
    else {

      frame['w'] = this.chart.Frame.w;
      frame['h'] = Math.round(0.5*this.chart.Frame.h);
      frame['x'] = this.chart.Frame.x;
      frame['y'] = this.chart.Chart.Canvas.height + this.chart.Frame.Padding.y;
      frame['Padding'] = this.chart.Frame.Padding;

      this.#extendChart(2*frame.Padding.y + frame.h);
    }
    
    return frame;
  }

  #generateSecondaryGirth(secondary) {

    return this.chart.Girth;
  }

  #generateSecondaryLegend(secondary) {

    let x, y = secondary.Frame.y - Math.round(secondary.Frame.Padding.y/4);

    secondary.Chart.Context.font = Math.round(0.32*secondary.Frame.Padding.y) + 'px bree';

    x = secondary.Frame.x + (secondary.Frame.w - (Math.round(0.3*secondary.Frame.Padding.y) + secondary.Chart.Context.measureText(' ' + secondary.Coins[0].Label + ' ' + this.#getDot(secondary, 0) + ' ⨂').width))/2;

    return [[{Marker: {
                x: x + Math.round(0.15*secondary.Frame.Padding.y), 
                y: y,
                r: Math.round(0.15*secondary.Frame.Padding.y)
              }, 
              Label: {
                x: x + Math.round(0.3*secondary.Frame.Padding.y), 
                y: y
              },
              Dot: {
                x: x + Math.round(0.3*secondary.Frame.Padding.y) + secondary.Chart.Context.measureText(' ' + secondary.Coins[0].Label + ' ').width + secondary.Chart.Context.measureText(this.#getDot(secondary, 0)).width/2,
                y: y,
                r: secondary.Chart.Context.measureText(this.#getDot(secondary, 0)).width/2
              },
              X: {
                x: x + Math.round(0.3*secondary.Frame.Padding.y) + secondary.Chart.Context.measureText(' ' + secondary.Coins[0].Label + ' ' + this.#getDot(secondary, 0) + ' ').width + secondary.Chart.Context.measureText('⨂').width/2,
                y: y,
                r: secondary.Chart.Context.measureText('⨂').width/2
              },
              C: 0
            }]];
  }

  #generateSecondaryGrid(secondary) {

    return {x: this.chart.Grid.x, y: {L: this.#generateSecondaryGridY(secondary), R: null}};
  }



  #generateSecondaryGridY(secondary) {

    if(this.#isNA(secondary.Limits.L.Min) || this.#isNA(secondary.Limits.L.Max)) return null;
    
    let precision;
    let ticks = this.chart.Frame.h == secondary.Frame.h ? 10 : 5;
    let min, max, m = 10**Math.round(Math.log10(secondary.Limits.L.Max - secondary.Limits.L.Min) - 2);
    let increment = [10, 20, 25, 50];
    
    for(let i in increment) {
      
      min = ((secondary.Limits.L.Min + ((m*increment[i]) - secondary.Limits.L.Min%(m*increment[i]))).toFixed(Math.max(0, -Math.log10(m)))).f();
      max = ((secondary.Limits.L.Max - secondary.Limits.L.Max%(m*increment[i])).toFixed(Math.max(0, -Math.log10(m)))).f();
      
      if((max - min)/(m*increment[i]) <= ticks) {

        m = ((m*increment[i]).toFixed(Math.min(18, Math.max(0, 2 - Math.ceil(Math.log10(m*increment[i])))))).f();
        precision = MISC.getPrecision(min, m);

        return {Ticks: this.#generateGridYIncrements(min, secondary.Limits.L.Max, m, secondary.Coins[0].Units, precision), Precision: precision};
      }
    }

    return null;
  }



  draw() {

    this.clear();
    this.#drawChart(this.chart);

    for(let i in this.chart.Secondary) this.#drawChart(this.chart.Secondary[i]);
  }

  clear() {
    
   this.chart.Chart.Context.clearRect(0, 0, this.chart.Chart.Canvas.width, this.chart.Chart.Canvas.height);
  }

  #drawChart(chart) {

    if(chart.Coins.length == 0) return 0;
    
    this.#drawGrid(chart);
    this.#drawFrame(chart);
    this.#drawLegend(chart);
    this.#drawLines(chart);
  }

  #drawGrid(chart) {
    
    for(let i in chart.Grid.x) this.#drawGridX(chart, i);
    if(chart.Grid.y.L) for(let i in chart.Grid.y.L.Ticks) this.#drawGridY(chart, i, 'L');
    if(chart.Grid.y.R) for(let i in chart.Grid.y.R.Ticks) this.#drawGridY(chart, i, 'R');
  }

  #drawFrame(chart) {
    
    chart.Chart.Context.strokeStyle = chart.Theme.Grid;
    chart.Chart.Context.lineWidth = chart.Girth;
    
    chart.Chart.Context.beginPath();
    chart.Chart.Context.moveTo(chart.Frame.x - chart.Chart.Context.lineWidth, chart.Frame.y - chart.Chart.Context.lineWidth);
    chart.Chart.Context.lineTo(chart.Frame.x - chart.Chart.Context.lineWidth, chart.Frame.y + chart.Frame.h + chart.Chart.Context.lineWidth);
    chart.Chart.Context.lineTo(chart.Frame.x + chart.Frame.w + chart.Chart.Context.lineWidth, chart.Frame.y + chart.Frame.h + chart.Chart.Context.lineWidth);
    chart.Chart.Context.lineTo(chart.Frame.x + chart.Frame.w + chart.Chart.Context.lineWidth, chart.Frame.y - chart.Chart.Context.lineWidth);
    chart.Chart.Context.lineTo(chart.Frame.x - 1.5*chart.Chart.Context.lineWidth, chart.Frame.y - chart.Chart.Context.lineWidth);
    chart.Chart.Context.stroke();
  }

  #drawLegend(chart) {

    chart.Chart.Context.strokeStyle = chart.Theme.Grid;
    chart.Chart.Context.lineWidth = Math.max(1, chart.Girth/2);
    chart.Chart.Context.font = Math.round(0.32*chart.Frame.Padding.y) + 'px bree';
    chart.Chart.Context.textBaseline = 'middle';
    chart.Chart.Context.textAlign = 'left';

    for(let i = 0, j = 0; j < chart.Legend.length; j++) {
      for(let k = 0; k < chart.Legend[j].length; i++, k++) {

        chart.Chart.Context.fillStyle = chart.Coins[i].Color;

        chart.Chart.Context.beginPath();
        chart.Chart.Context.arc(chart.Legend[j][k].Marker.x, chart.Legend[j][k].Marker.y, Math.round(0.15*chart.Frame.Padding.y), 0, 2*Math.PI);
        chart.Chart.Context.fill();
        chart.Chart.Context.stroke();

        chart.Chart.Context.fillStyle = chart.Theme.Grid;

        chart.Chart.Context.fillText(' ' + chart.Coins[i].Label + ' ' + this.#getDot(chart, i) + ' ⨂', chart.Legend[j][k].Label.x, chart.Legend[j][k].Label.y);
      }
    }
  }

  #drawLines(chart) {
    
    for(let i in chart.Coins) {
      
      if(this.#isSecondary(chart.Coins[i].Label)) this.#drawHistogram(chart, i);
      else this.#drawLine(chart, i);
    }
  }

  #drawGridX(chart, index) {
    
    chart.Chart.Context.strokeStyle = chart.Theme.Grid;
    chart.Chart.Context.lineWidth = chart.Girth;
    
    chart.Chart.Context.beginPath();
    chart.Chart.Context.moveTo(this.#getX(chart, chart.Grid.x[index].x), chart.Frame.y - 0.5*chart.Chart.Context.lineWidth);
    chart.Chart.Context.lineTo(this.#getX(chart, chart.Grid.x[index].x), chart.Frame.y + chart.Frame.h + 0.5*chart.Chart.Context.lineWidth);
    chart.Chart.Context.stroke();
    
    chart.Chart.Context.fillStyle = chart.Theme.Text;
    chart.Chart.Context.font = this.#gridXFont(chart) + 'px bree';
    chart.Chart.Context.textAlign = 'center'; 
    chart.Chart.Context.textBaseline = 'top';
    chart.Chart.Context.fillText(chart.Grid.x[index].Label, this.#getX(chart, chart.Grid.x[index].x), Math.round(chart.Frame.y + chart.Frame.h + 0.05*chart.Frame.Padding.y));
  }

  #drawGridY(chart, index, side = 'L') {

    if(!chart.Grid.y[side]) return false;

    let x, w;
    
    chart.Chart.Context.strokeStyle = chart.Theme.Grid;
    chart.Chart.Context.lineWidth = chart.Girth;

    x = side == 'R' ? chart.Frame.x + chart.Frame.w + 0.5*chart.Chart.Context.lineWidth : chart.Frame.x - 0.5*chart.Chart.Context.lineWidth;
    w = side == 'R' ? -0.01*chart.Frame.w : 0.01*chart.Frame.w;

    chart.Chart.Context.beginPath();
    chart.Chart.Context.moveTo(x, this.#getY(chart, chart.Grid.y[side].Ticks[index].y, side));
    chart.Chart.Context.lineTo(x + w, this.#getY(chart, chart.Grid.y[side].Ticks[index].y, side));
    chart.Chart.Context.stroke();
    
    chart.Chart.Context.fillStyle = chart.Theme.Text;
    chart.Chart.Context.font = Math.round(0.2*chart.Frame.Padding.x) + 'px bree';
    chart.Chart.Context.font = Math.round(0.2*chart.Frame.Padding.x*Math.min(1, 0.85*chart.Frame.Padding.x/chart.Chart.Context.measureText(chart.Grid.y[side].Ticks[index].Label).width)) + 'px bree';
    chart.Chart.Context.textBaseline = 'middle';
    chart.Chart.Context.textAlign = side == 'L' ? 'right' : 'left'; 
    chart.Chart.Context.fillText(chart.Grid.y[side].Ticks[index].Label, Math.round(side == 'L' ? chart.Frame.x - 0.05*chart.Frame.Padding.x : chart.Frame.x + chart.Frame.w + 0.05*chart.Frame.Padding.x), this.#getY(chart, chart.Grid.y[side].Ticks[index].y, side));
  }

  #drawLine(chart, index) {

    if(chart.Coins[index].Data.length == 0) return true;
    
    chart.Chart.Context.strokeStyle = chart.Coins[index].Color
    chart.Chart.Context.lineWidth = chart.Girth;
    
    chart.Chart.Context.beginPath();
    chart.Chart.Context.moveTo(this.#getX(chart, chart.Coins[index].Data[0].x), this.#getY(chart, chart.Coins[index].Data[0].y, chart.Coins[index].Axis));
    
    for(let i = 1; i < chart.Coins[index].Data.length; i++) chart.Chart.Context.lineTo(this.#getX(chart, chart.Coins[index].Data[i].x), this.#getY(chart, chart.Coins[index].Data[i].y, chart.Coins[index].Axis));
    
    chart.Chart.Context.stroke();
  }

  #drawHistogram(chart, index) {

    if(chart.Coins[index].Data.length == 0) return true;
    
    let x0, x1, y0, y1;
    let yy = this.#isMACD(chart.Coins[index].Label) ? this.#getY(chart, chart.Limits.L.Min > 100 ? chart.Limits.L.Min : (chart.Limits.L.Max < 100 ? chart.Limits.L.Max : 100), chart.Coins[index].Axis) : this.#getY(chart, chart.Limits[chart.Coins[index].Axis].Min, chart.Coins[index].Axis) - chart.Girth;
      
    chart.Chart.Context.strokeStyle = chart.Coins[index].Color;

    if(chart.Coins[index].Data.length > 0) {

      x1 = this.#getX(chart, chart.Coins[index].Data[0].x);
      y1 = this.#getY(chart, chart.Coins[index].Data[0].y, chart.Coins[index].Axis);
    
      this.#drawHistogramBar(chart, x1, yy, y1);
    }

    for(let i = 1; i < chart.Coins[index].Data.length; i++) {

      x0 = x1;
      y0 = y1;
        
      x1 = this.#getX(chart, chart.Coins[index].Data[i].x);
      y1 = this.#getY(chart, chart.Coins[index].Data[i].y, chart.Coins[index].Axis);

      if(x0 == x1) {
        if(y1 > y0) this.#drawHistogramBar(chart, x1, y0, y1);
        else continue;
      }
      else for(let x = Math.min(x0 + 1, x1), y = x0 == x1 ? y1 : y0 + (y1 - y0)*(x - x0)/(x1 - x0); x <= x1; x = x < x1 ? Math.min(x + 1, x1) : x + chart.M, y = x0 == x1 ? y1 : y0 + (y1 - y0)*(x - x0)/(x1 - x0)) this.#drawHistogramBar(chart, x, yy, y);
    }
  }

  #gridXFont(chart) {

    let width = 0;

    chart.Chart.Context.font = Math.round(0.4*chart.Frame.Padding.y) + 'px bree';

    for(let i in chart.Grid.x) width += chart.Chart.Context.measureText(chart.Grid.x[i].Label).width;

    return Math.min(0.4*chart.Frame.Padding.y*Math.min(1, chart.Frame.w/(1.2*width), 0.85*2*this.#getX(chart, chart.Grid.x[0].x)/chart.Chart.Context.measureText(chart.Grid.x[0].Label).width, 0.85*2*(chart.Frame.w + 2*chart.Frame.Padding.x - this.#getX(chart, chart.Grid.x[0].x))/chart.Chart.Context.measureText(chart.Grid.x[chart.Grid.x.length - 1].Label).width));
  }

  #drawHistogramBar(chart, x, y0, y1) {

    chart.Chart.Context.lineWidth = 1;
      
    chart.Chart.Context.beginPath();
    chart.Chart.Context.moveTo(x, y0);
    chart.Chart.Context.lineTo(x, y1);
    chart.Chart.Context.stroke();
  }

  #lineLastPrice(chart, index) {
    
    return chart.Coins[index].Data.length > 0 ? chart.Coins[index].Data[chart.Coins[index].Data.length - 1].y : null;
  }

  #histogramLineDisplacer(chart, x) {
    
    return Math.ceil(-Math.min(0, chart.M*(this.#scaleX(chart) - 1 - (x - chart.Frame.x) - 1/4) + 0.5) - Math.max(0, chart.M*(0.25 - (x - chart.Frame.x))));
  }



  #generateGUIEventListeners() {

    window.addEventListener('resize', this.realign.bind(this));
    
    this.chart.Interface.Canvas.addEventListener('mousemove', this.#mouseMoveHandler.bind(this));
    this.chart.Interface.Canvas.addEventListener('mouseenter', this.#mouseEnterHandler.bind(this));
    this.chart.Interface.Canvas.addEventListener('mouseout', this.#mouseOutHandler.bind(this));
    this.chart.Interface.Canvas.addEventListener('mousedown', this.#mouseDownHandler.bind(this));
    this.chart.Interface.Canvas.addEventListener('mouseup', this.#mouseUpHandler.bind(this));
    this.chart.Interface.Canvas.addEventListener('dblclick', this.#dblClickHandler.bind(this));
  }

  #mouseMoveHandler(e) {
    
    this.chart.Interface.Mouse.x = Math.round(e.x*(this.chart.Interface.Canvas.width/this.chart.Interface.Canvas.clientWidth));
    this.chart.Interface.Mouse.y = Math.round((e.y + window.scrollY - document.getElementById(this.#name + '-Panel').clientHeight)*(this.chart.Interface.Canvas.height/this.chart.Interface.Canvas.clientHeight));
    
    if(this.chart.Interface.Mouse.Focus == null) this.chart.Interface.Mouse.Focus = e.y > document.getElementById('Chart-Panel').getBoundingClientRect().y + document.getElementById('Chart-Panel').getBoundingClientRect().height;

    this.#updateLatestMark();
    this.#drawInterface();

    this.#checkIconsHover();
  }

  #mouseEnterHandler(e) {

    this.chart.Interface.Mouse.Focus = true;
    
    this.#drawInterface();
  }

  #mouseOutHandler(e) {

    this.chart.Interface.Mouse.Focus = false;
    this.chart.Interface.Mouse.Active = false;
    
    this.#drawInterface();
  }

  #mouseDownHandler(e) {

    let type = 'Line';
    let color = document.getElementById(this.#name + '-Panel-Pen').value;
    
    this.chart.Interface.Mouse.Active = true;
    
    this.#generateNewMark(type, color);
  }

  #mouseUpHandler(e) {
    
    this.chart.Interface.Mouse.Active = false;

    this.#checkIconsFire();
  }

  #dblClickHandler(e) {

    this.chart.Interface.GUI.Lock = !this.chart.Interface.GUI.Lock;
    this.chart.Interface.Mouse.Active = false;
    
    this.#mouseMoveHandler(e);
  }

  undo(e) {
    
    if(this.chart.Interface.GUI.Marks.length > 0) this.chart.Interface.GUI.Marks.pop();
    
    this.#drawInterface();
  }

  clean() {
    
    this.chart.Interface.GUI.Marks = [];
    
    this.#drawInterface();
  }

  #drawInterface() {

    if(!this.chart.Interface) return false;
    
    this.#clearInterface();
    
    if(this.chart.Interface.Mouse.Focus || this.chart.Interface.GUI.Lock) this.#drawDetails();
    
    this.#drawMarks();
  }

  #clearInterface() {
    
   this.chart.Interface.Context.clearRect(0, 0, this.chart.Interface.Canvas.width, this.chart.Interface.Canvas.height);
  }

  #drawDetails() {

    this.chart = this.#drawDetail(this.chart);
    
    for(let i in this.chart.Secondary) this.chart.Secondary[i] = this.#drawDetail(this.chart.Secondary[i]);
  }

  #drawMarks() {
    
    for(let i in this.chart.Interface.GUI.Marks) i = this.#drawMark(i);
  }

  #generateNewMark(type, color) {

    switch(type) {
      
      case 'Line': this.#generateMark(type, [{x: this.chart.Interface.Mouse.x, y: this.chart.Interface.Mouse.y},{x: this.chart.Interface.Mouse.x, y: this.chart.Interface.Mouse.y}], color); break;
      default: break;
    }
  }

  #generateMark(type, data, color) {

    this.chart.Interface.GUI.Marks.push({Type: type, Data: data, Color: color});
  }

  #editMark(index, type, data, color) {

    this.#editMarkType(index, type);
    this.#editMarkData(index, data);
    this.#editMarkColor(index, color);
  }

  #editMarkType(index, type) {

    this.chart.Interface.GUI.Marks[index].Type = type;
  }

  #editMarkData(index, data) {

    this.chart.Interface.GUI.Marks[index].Data = data;
  }

  #editMarkColor(index, color) {

    this.chart.Interface.GUI.Marks[index].Color = color;
  }

  #updateLatestMark() {

    if(this.chart.Interface.Mouse.Active) {
      
      switch(this.chart.Interface.GUI.Marks[this.chart.Interface.GUI.Marks.length - 1].Type) {
      
        case 'Line': this.#moveLatestLine(this.chart.Interface.Mouse.x, this.chart.Interface.Mouse.y);
          break;
        default: break;
      }
    }
  }

  #moveLatestLine(x, y) {

    this.chart.Interface.GUI.Marks[this.chart.Interface.GUI.Marks.length - 1].Data[1] = {x: x, y: y};
  }

  #checkIconsFire() {

    this.#checkLegendMarkerIconsFire();
    this.#checkLegendDotIconsFire();
    this.#checkLegendRemoveIconsFire();
  }

  #checkIconsHover() {

    this.chart.Interface.Canvas.style.cursor = this.#withinLegendMarkerTarget() || this.#withinLegendDotTarget() || this.#withinLegendRemoveTarget() ? 'pointer' : 'auto';
  }

  #checkLegendMarkerIconsFire() {

    let m = this.#withinLegendMarkerTarget();

    if(m) {

      if(m.Secondary) {

        this.chart.Secondary[m.Secondary].Coins[m.Index].Color = document.getElementById(this.#name + '-Panel-Color').value;

        if(this.chart.Parameters.Colors[this.chart.Secondary[m.Secondary].Coins[m.Index].P]) this.chart.Parameters.Colors[this.chart.Secondary[m.Secondary].Coins[m.Index].P] = this.chart.Secondary[m.Secondary].Coins[m.Index].Color;
      }
      else {

        this.chart.Coins[m.Index].Color = document.getElementById(this.#name + '-Panel-Color').value;

        if(this.chart.Parameters.Colors[this.chart.Coins[m.Index].P]) this.chart.Parameters.Colors[this.chart.Coins[m.Index].P] = this.chart.Coins[m.Index].Color;
      }

      this.draw(this.#name);
    }
  }

  #checkLegendDotIconsFire() {

    let d = this.#withinLegendDotTarget();

    if(d) {

      if(d.Secondary) {

        this.chart.Secondary[d.Secondary].Coins[d.Index].Track = !this.chart.Secondary[d.Secondary].Coins[d.Index].Track;

        if(!this.#isNA(this.chart.Parameters.Track[this.chart.Secondary[d.Secondary].Coins[d.Index].P])) this.chart.Parameters.Track[this.chart.Secondary[d.Secondary].Coins[d.Index].P] = this.chart.Secondary[d.Secondary].Coins[d.Index].Track;
      }
      else {

        this.chart.Coins[d.Index].Track = !this.chart.Coins[d.Index].Track;

        if(!this.#isNA(this.chart.Parameters.Track[this.chart.Coins[d.Index].P])) this.chart.Parameters.Track[this.chart.Coins[d.Index].P] = this.chart.Coins[d.Index].Track;
      }

      this.draw(d.Chart);
      this.#drawInterface(d.Chart);
    }
  }

  #checkLegendRemoveIconsFire() {

    let x = this.#withinLegendRemoveTarget();

    if(x) this.remove(x.Index);
  }

  #withinLegendMarkerTarget() {

    for(let i in this.chart.Legend) {
      for(let j in this.chart.Legend[i]) {

        if(((this.chart.Interface.Mouse.x - this.chart.Legend[i][j].Marker.x)/this.chart.Legend[i][j].Marker.r)**2 + ((this.chart.Interface.Mouse.y - this.chart.Legend[i][j].Marker.y)/this.chart.Legend[i][j].Marker.r)**2 <= 1) return {Secondary: null, Index: this.chart.Legend[i][j].C};
      }
    }

    for(let i in this.chart.Secondary) {
      for(let j in this.chart.Secondary[i].Legend) {
        for(let k in this.chart.Secondary[i].Legend[j]) {

          if(((this.chart.Interface.Mouse.x - this.chart.Secondary[i].Legend[j][k].Marker.x)/this.chart.Secondary[i].Legend[j][k].Marker.r)**2 + ((this.chart.Interface.Mouse.y - this.chart.Secondary[i].Legend[j][k].Marker.y)/this.chart.Secondary[i].Legend[j][k].Marker.r)**2 <= 1) return {Secondary: i, Index: this.chart.Secondary[i].Legend[j][k].C};
        }
      }
    }

    return false;
  }

  #withinLegendDotTarget() {

    for(let i in this.chart.Legend) {
      for(let j in this.chart.Legend[i]) {

        if(((this.chart.Interface.Mouse.x - this.chart.Legend[i][j].Dot.x)/this.chart.Legend[i][j].Dot.r)**2 + ((this.chart.Interface.Mouse.y - this.chart.Legend[i][j].Dot.y)/this.chart.Legend[i][j].Dot.r)**2 <= 1) return {Secondary: null, Index: this.chart.Legend[i][j].C};
      }
    }

    for(let i in this.chart.Secondary) {
      for(let j in this.chart.Secondary[i].Legend) {
        for(let k in this.chart.Secondary[i].Legend[j]) {

          if(((this.chart.Interface.Mouse.x - this.chart.Secondary[i].Legend[j][k].Dot.x)/this.chart.Secondary[i].Legend[j][k].Dot.r)**2 + ((this.chart.Interface.Mouse.y - this.chart.Secondary[i].Legend[j][k].Dot.y)/this.chart.Secondary[i].Legend[j][k].Dot.r)**2 <= 1) return {Secondary: i, Index: this.chart.Secondary[i].Legend[j][k].C};
        }
      }
    }

    return false;
  }

  #withinLegendRemoveTarget() {

    for(let i in this.chart.Legend) {
      for(let j in this.chart.Legend[i]) {

        if(((this.chart.Interface.Mouse.x - this.chart.Legend[i][j].X.x)/this.chart.Legend[i][j].X.r)**2 + ((this.chart.Interface.Mouse.y - this.chart.Legend[i][j].X.y)/this.chart.Legend[i][j].X.r)**2 <= 1) return {Index: this.chart.Coins[this.chart.Legend[i][j].C].P};
      }
    }

    for(let i in this.chart.Secondary) {
      for(let j in this.chart.Secondary[i].Legend) {
        for(let k in this.chart.Secondary[i].Legend[j]) {

          if(((this.chart.Interface.Mouse.x - this.chart.Secondary[i].Legend[j][k].X.x)/this.chart.Secondary[i].Legend[j][k].X.r)**2 + ((this.chart.Interface.Mouse.y - this.chart.Secondary[i].Legend[j][k].X.y)/this.chart.Secondary[i].Legend[j][k].X.r)**2 <= 1) return {Index: this.chart.Secondary[i].Coins[this.chart.Secondary[i].Legend[j][k].C].P};
        }
      }
    }

    return false;
  }



  #drawDetail(chart) {

    if(chart.Coins.length == 0) return chart;

    let x;
   
    if(!chart.Interface.GUI.Lock) chart.Interface.GUI.x = chart.Interface.Mouse.x;
    
    x = this.#getXInverse(chart, chart.Interface.GUI.x);

    chart.Interface.Context.strokeStyle = chart.Theme.Text;
    chart.Interface.Context.lineWidth = chart.Girth;
    
    chart.Interface.Context.beginPath();
    chart.Interface.Context.moveTo(this.#frameBoundX(chart, chart.Interface.GUI.x), chart.Frame.y);
    chart.Interface.Context.lineTo(this.#frameBoundX(chart, chart.Interface.GUI.x), chart.Frame.y + chart.Frame.h);
    chart.Interface.Context.stroke();
    
    chart.Interface.Context.fillStyle = chart.Theme.Text;
    chart.Interface.Context.font = Math.round(0.4*chart.Frame.Padding.y) + 'px bree';
    chart.Interface.Context.textAlign = 'center';
    chart.Interface.Context.textBaseline = 'bottom';
    chart.Interface.Context.fillText(moment(x).format('h:mm:ss a, MMMM D, YYYY'),  this.#detailBoundX(chart, moment(x).format('h:mm:ss a, MMMM D, YYYY')), Math.round(chart.Frame.y + chart.Frame.h + 0.95*chart.Frame.Padding.y));
    
    for(let i in chart.Coins) {
      
      if(chart.Coins[i].Track) chart = this.#drawDetailY(chart, i, x);
    }

    return chart;
  }

  #drawDetailY(chart, index, x) {

    let y;
    
    chart = this.#updateDisplayIndex(chart, index, x);

    y = this.#getY(chart, chart.Coins[index].Data[chart.Coins[index].Index].y, chart.Coins[index].Axis);
    
    chart.Interface.Context.strokeStyle = chart.Coins[index].Color;
    chart.Interface.Context.lineWidth = chart.Girth
    
    chart.Interface.Context.beginPath();
    chart.Interface.Context.moveTo(chart.Frame.x, y);
    chart.Interface.Context.lineTo(chart.Frame.x + chart.Frame.w, y);
    chart.Interface.Context.stroke();
    
    chart.Interface.Context.fillStyle = chart.Coins[index].Color;
    chart.Interface.Context.font = Math.round(0.2*chart.Frame.Padding.x) + 'px bree';
    chart.Interface.Context.font = Math.round(0.2*chart.Frame.Padding.x*Math.min(1, 0.85*chart.Frame.Padding.x/chart.Interface.Context.measureText(chart.Coins[index].Data[chart.Coins[index].Index].y.toFixed(18).wei().coin(chart.Coins[index].Units, chart.Grid.y[chart.Coins[index].Axis].Precision)).width)) + 'px bree';
    chart.Interface.Context.textAlign = chart.Coins[index].Side == 'L' ? 'right' : 'left'; 
    chart.Interface.Context.textBaseline = 'middle';
    chart.Interface.Context.fillText(chart.Coins[index].Data[chart.Coins[index].Index].y.toFixed(18).wei().coin(chart.Coins[index].Units, chart.Grid.y[chart.Coins[index].Axis].Precision), chart.Coins[index].Side == 'L' ? Math.round(0.95*chart.Frame.x) : Math.round(1.05*chart.Frame.x) + chart.Frame.w, y);

    return chart;
  }

  #detailBoundX(chart, x) {

    return this.#frameBoundX(chart, chart.Interface.GUI.x, Math.max(0, chart.Interface.Context.measureText(x).width/2 - 0.85*chart.Frame.Padding.x));
  }

  #updateDisplayIndex(chart, index, x) {

    let increment = x >= chart.Coins[index].Data[chart.Coins[index].Index].x ? 1 : -1;

    for(let i = chart.Coins[index].Index; i >= 0 && i < chart.Coins[index].Data.length && increment*(chart.Coins[index].Data[Math.min(increment > 0 ? i : i + 1, chart.Coins[index].Data.length - 1)].x - x) < 0; i += increment) chart.Coins[index].Index = i;

    return chart;
  }



  #drawMark(index) {
    
    switch(this.chart.Interface.GUI.Marks[index].Type) {
      
      case 'Line': return this.#drawMarkLine(index); break;
      default: break;
    }

    return index;
  }

  #drawMarkLine(index) {
    
    if(!this.chart.Interface.Mouse.Active && (Math.sqrt((this.chart.Interface.GUI.Marks[index].Data[1].x - this.chart.Interface.GUI.Marks[index].Data[0].x)**2 + (this.chart.Interface.GUI.Marks[index].Data[1].y - this.chart.Interface.GUI.Marks[index].Data[0].y)**2) < 3)) {
      
      this.chart.Interface.GUI.Marks.splice(index, 1);
      return --index;
    }
    
    this.chart.Interface.Context.strokeStyle = this.chart.Interface.GUI.Marks[index].Color;
    this.chart.Interface.Context.lineWidth = this.chart.Girth;
    
    this.chart.Interface.Context.beginPath();
    this.chart.Interface.Context.moveTo(this.chart.Interface.GUI.Marks[index].Data[0].x, this.chart.Interface.GUI.Marks[index].Data[0].y);
    this.chart.Interface.Context.lineTo(this.chart.Interface.GUI.Marks[index].Data[1].x, this.chart.Interface.GUI.Marks[index].Data[1].y);
    this.chart.Interface.Context.stroke();
    
    return index;
  }

  

  #clusterAxes(indices) {

    if(!indices || indices.length == 0) return null;
    if(indices.length == 1) return {[indices[0]]: 'L'};

    let single = 0, double = {'L': 0, 'R': 0};
    let sides = {}
    let means = this.#generateMeans(indices);
    let mm, m = this.#singleMean(indices);

    for(let i in indices) sides[indices[i]] = i%2 == 0 ? ['L', 'R'] : ['R', 'L'];

    while(!this.#sameNewSides(indices, sides)) {

      mm = this.#doubleMean(indices, sides);
      sides = this.#pickNewSides(indices, sides, means, mm);
    }

    return this.#pickFinalSides(indices, sides, means, m, mm);
  }

  #generateMeans(indices) {

    let sum, means = {};

    for(let i in indices) {

      sum = 0;

      this.chart.Parameters.Data[indices[i]].forEach(c => sum += c.y);

      means[indices[i]] = sum/Math.max(this.chart.Parameters.Data[indices[i]].length, 1);
    }

    return means;
  }

  #singleMean(indices) {

    let sum, s = 0;

    for(let i in indices) {

      sum = 0;

      this.chart.Parameters.Data[indices[i]].forEach(c => sum += c.y);

      s += sum/Math.max(this.chart.Parameters.Data[indices[i]].length, 1);
    }

    return s/indices.length;
  }

  #doubleMean(indices, sides) {

    let sum, s = {'L': 0, 'R': 0}, count = {'L': 0, 'R': 0};

    for(let i in indices) {

      sum = 0;

      this.chart.Parameters.Data[indices[i]].forEach(c => sum += c.y);

      s[sides[indices[i]][0]] += sum/Math.max(this.chart.Parameters.Data[indices[i]].length, 1);
      count[sides[indices[i]][0]]++;
    }

    return {'L': s.L/Math.max(count.L, 1), 'R': s.R/Math.max(count.R, 1)};
  }

  #pickNewSides(indices, sides, means, centroids) {

    for(let i in indices) {

      sides[indices[i]][1] = sides[indices[i]][0];
      sides[indices[i]][0] = Math.abs(means[indices[i]] - centroids.L) > Math.abs(means[indices[i]] - centroids.R) ? 'R' : 'L';
    }

    return sides;
  }

  #sameNewSides(indices, sides) {

    for(let i in indices) {

      if(sides[indices[i]][0] != sides[indices[i]][1]) return false;
    }

    return true;
  }

  #pickFinalSides(indices, sides, means, mean, centroids) {

    let single = this.#singleLoss(indices, mean);
    let double = this.#doubleLoss(indices, sides, centroids);

    if(single > 2*(double.L + double.R)) for(let i in indices) sides[indices[i]] = sides[indices[i]][0];
    else for(let i in indices) sides[indices[i]] = 'L';

    return sides;
  }

  #singleLoss(indices, mean) {

    let se, mse = 0;

    for(let i in indices) {

      se = 0;

      this.chart.Parameters.Data[indices[i]].forEach(c => se += (c.y - mean)**2);

      mse += se/Math.max(this.chart.Parameters.Data[indices[i]].length, 1);
    }

    return mse/indices.length;
  }

  #doubleLoss(indices, sides, centroids) {

    let se, mse = {'L': 0, 'R': 0}, count = {'L': 0, 'R': 0};

    for(let i in indices) {

      se = 0;

      this.chart.Parameters.Data[indices[i]].forEach(c => se += (c.y - centroids[sides[indices[i]][0]])**2);

      mse[sides[indices[i]][0]] += se/Math.max(this.chart.Parameters.Data[indices[i]].length, 1);
      count[sides[indices[i]][0]]++;
    }

    return {'L': mse.L/Math.max(count.L, 1), 'R': mse.R/Math.max(count.R, 1)};
  }



  #isPrimaryChart() {
    
    return this.chart['Frame']['h'] == Math.round(0.5*this.chart['Frame']['w']);
  }

  #isPrice(label) {

    label = label ? label.toUpperCase() : false;

    return label && label.includes('-PRICE');
  }

  #isVolume(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-VOLUME(');
  }

  #isMACD(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-MACD(');
  }

  #isRSI(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-RSI(');
  }

  #isMktCap(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-MKTCAP');
  }

  #isSupply(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-SUPPLY');
  }

  #isConche(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-CONCHE(');
  }

  #isBurn(label) {

    label = label ? label.toUpperCase() : false;
    
    return label && label.includes('-BURN(');
  }

  #isNA(x) {

    return x == null || x == undefined || isNaN(x) || !isFinite(x);
  }

  #isSecondary(label) {

    label = label ? label.toUpperCase(): false;

    return label && (label.includes('-VOLUME(') || label.includes('-MACD(') || label.includes('-RSI(') || label.includes('-MKTCAP') || label.includes('-SUPPLY') || label.includes('-CONCHE(') || label.includes('-BURN(')) || label.includes('-TRANSFER(') || label.includes('-TRANSFERFROM(') || label.includes('-SOLD');
  }

  #isPrimaryIndicator(label) {

    label = label ? label.toUpperCase(): false;

    return label && (label.includes('-MA(') || label.includes('-EMA(') || label.includes('-ENVELOPE('));
  }

  #isDoubleAxis(sides) {

    if(sides == null) return false;

    for(let i in sides) {

      if(sides[i] == 'R') return true;
    }

    return false;
  }



  #getDot(chart, index) {

    return chart.Coins[index].Track ? '⨁' : '⨀';
  }

  #getXY(chart, x, y, yAxis = 'Price') {

    return {'x': this.#getX(chart, x), 'y': this.#getY(chart, y, yAxis)};
  }

  #getX(chart, x) {

    return chart.Frame.x + Math.round((x - chart.Horizon.Min)/this.#scaleX(chart)*chart.Frame.w);
  }

  #getY(chart, y, yAxis = 'L') {

    return chart.Frame.y + Math.round(chart.Frame.h*(1 - (y - chart.Limits[yAxis].Min)/this.#scaleY(chart, yAxis)));
  }

  #getXYInverse(chart, x, y, yAxis = 'L') {

    return {'x': this.#getXInverse(chart, x), 'y': this.#getYInverse(chart, y, yAxis)};
  }

  #getXInverse(chart, x) {

    return chart.Horizon.Min + Math.round(Math.min(chart.Frame.w, Math.max(0, x - chart.Frame.x))/chart.Frame.w*this.#scaleX(chart));
  }

  #getYInverse(chart, y, yAxis = 'L') {

    return chart.Limits[yAxis].Min + Math.round(this.#scaleY(chart, yAxis)*(1 - Math.min(chart.Frame.h, Max(0, y - chart.Frame.y))/chart.Frame.h));
  }

  

 #scaleX(chart) {

    return chart.Horizon.Max - chart.Horizon.Min;
  }

  #scaleY(chart, y) {

    return chart.Limits[y].Max - chart.Limits[y].Min;
  }



  #frameBoundX(chart, x, buffer = 0) {

    return Math.max(chart.Frame.x + buffer, Math.min(x, chart.Frame.x + chart.Frame.w - buffer));
  }

  #frameBoundY(chart, y, buffer = 0) {

    return Math.max(chart.Frame.y + buffer, Math.min(y, chart.Frame.y + chart.Frame.h - buffer));
  }

  

  #includes(label, string) {

    label = label ? label.toUpperCase() : false;
    string = string ? string.toUpperCase() : false

    return label && string && label.includes(string);
  }



  randomKey() {

    return (Math.random()*0xFFFFFF<<0).toString(16) + (Math.random()*0xFFFFFF<<0).toString(16);
  }

  randomColor() {

    return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
  }



  #selectPrimaryIndices() {

    let indices = [];

    for(let i in this.chart.Parameters.Data) {

      if(!this.#isSecondary(this.chart.Parameters.Labels[i])) indices.push(i);
    }

    return indices;
  }

  #selectPrimaryUnits(side) {

    let coins = {};

    for(let i in this.chart.Coins) {

      if(this.chart.Coins[i].Axis == side) coins[this.chart.Coins[i].Units] = true;
    }

    if(Object.keys(coins).length > 1) return 'Coin';

    return Object.keys(coins)[0];
  }



  realign(e) {

    this.align();
    this.draw();
  }

  align(reset = false) {

    let p = document.getElementById(this.#name + '-Panel');

    this.chart.Chart.Canvas.width = reset ? window.innerWidth : this.chart.Chart.Canvas.clientWidth;
    this.chart.Chart.Canvas.height = reset ? window.innerHeight - (p ? p.getBoundingClientRect().y + p.getBoundingClientRect().height : 0) : this.chart.Chart.Canvas.clientHeight;

    this.chart.Chart.Canvas.style.top = (window.scrollY + (p ? p.getBoundingClientRect().y + p.getBoundingClientRect().height : 0)) + 'px';
    this.chart.Chart.Canvas.style.width = this.chart.Chart.Canvas.width + 'px';
    this.chart.Chart.Canvas.style.height = this.chart.Chart.Canvas.height + 'px';

    if(this.chart.Interface) {

      this.chart.Interface.Canvas.width = this.chart.Chart.Canvas.width;
      this.chart.Interface.Canvas.height = this.chart.Chart.Canvas.height;

      this.chart.Interface.Canvas.style.top = this.chart.Chart.Canvas.style.top;
      this.chart.Interface.Canvas.style.width = this.chart.Chart.Canvas.style.width;
      this.chart.Interface.Canvas.style.height = this.chart.Chart.Canvas.style.height;
    }

    document.body.style.backgroundSize = '100% ' + ((p ? p.getBoundingClientRect().y + p.getBoundingClientRect().height : 0) + this.chart.Chart.Canvas.height) + 'px';
  }

  #extendChart(h) {

    let p = document.getElementById(this.#name + '-Panel');

    this.chart.Chart.Canvas.height += h;
    this.chart.Chart.Canvas.style.height = this.chart.Chart.Canvas.height + 'px';

    if(this.chart.Interface) {

      this.chart.Interface.Canvas.height = this.chart.Chart.Canvas.height;
      this.chart.Interface.Canvas.style.height = this.chart.Chart.Canvas.style.height;
    }

    document.body.style.backgroundSize = '100% ' + ((p ? p.getBoundingClientRect().y + p.getBoundingClientRect().height : 0) + this.chart.Chart.Canvas.height) + 'px';
  }
}
