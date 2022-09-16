// SARIMA.js



class SARIMA {

  #x;
  #variables;
  #coefficients;
  #method;
  #seasons;
  #base;


  constructor() {

    this.#reset();
  }



  predict(n = 1) {

    n = Math.max(1, Math.round(n));

    switch(this.#method) {

      case 'M': return this.#predictMean(n);
      case 'YW': return this.#predictYW(n);
      case 'OLS': return this.#predictOLS(n);
      default: break;
    }
  }

  fit(x, p = null, seasons = null, d = null, method = 'YW') {

    this.#reset();

    this.#method = method;

    this.#x = this.diff(this.seasonalize(MISC.clone(x).reverse(), seasons), d);

    switch(this.#method) {

      case 'M': this.#fitMean(this.#x); break;
      case 'YW': this.#fitYW(this.#x, p); break;
      case 'OLS': this.#fitOLS(this.#x, p); break;
      default: break;
    }
  }



  seasonalize(x, n = null) {

    let e, subsets, mean;
    let seasons = 1, entropy = Infinity;
    let max = this.n(x);

    if(Math.round(n) >= 1) seasons = Math.min(Math.round(n), x.length);
    else {

      for(let i = 1; i <= max; i++) {

        e = 0;
        subsets = (new Array(i)).fill([]);

        subsets.forEach((_, j) => subsets[j] = x.filter((element, index) => index%i === j));
        subsets.forEach(a => e += 2*a.length*this.#dev(a));

        if(e < entropy) {

          entropy = e;
          seasons = i;
        }
      }
    }

    mean = this.#nonZero(this.#mean(x));
    this.#seasons = (new Array(seasons)).fill(1);

    this.#seasons.forEach((_, i) => this.#seasons[i] = this.#nonZero(this.#mean(x.filter((element, index) => index%seasons === i)))/mean);

    return x.map((a, i) => a /= this.#seasons[i%this.#seasons.length]);
  }

  deseasonalize(x, forward = true, shift = 0) {

    return x.map((a, i) => a *= this.#seasons[forward ? this.#seasons.length - ((i + shift)%this.#seasons.length + 1) : (i + shift)%this.#seasons.length]);
  }



  diff(x, d = 1) {

    this.#base = [];

    if(d === 0) return x;
    else if(!d) {

      while(!this.#stationary(x)) {

        this.#base.unshift(x[0]);

        for(let j = 0; j < x.length - 1; j++) x[j] -= x[j + 1];

        x.pop();
      }
    }
    else {

      d = Math.abs(Math.round(d));

      for(let i = 0; i < d; i++) {

        this.#base.unshift(x[0]);

        for(let j = 0; j < x.length - 1; j++) x[j] -= x[j + 1];

        x.pop();
      }
    }
    
    return x;
  }

  integrate(x, forward = true) {

    if(this.#base.length == 0) return x;

    let b = MISC.clone(this.#base);

    if(forward) x.forEach((a, i) => {

      x[i] += this.#sum(b);

      b.forEach((_, j) => b[j] = a + this.#sum(b.slice(0, j + 1)));
    });
  else x.forEach((a, i) => {

      x[i] = b.at(-1);

      for(let j = b.length - 1; j > 0; j--) b[j] -= b[j - 1];

      b[0] -= a;
    });

    return x;
  }



  #predictMean(n = 1) {

    return this.deseasonalize(this.integrate((new Array(n)).fill(this.#coefficients[0])));
  }

  #predictYW(n = 1) {

    if(!this.#coefficients || this.#coefficients.length == 0) return this.deseasonalize(this.integrate((new Array(n)).fill(this.#x[0])));

    let x = this.#crop(this.#x);

    for(let i = 0; i < n; i++) x.unshift(math.multiply(this.#coefficients, this.#variables.map(a => x[a - 1])));

    return this.deseasonalize(this.integrate(this.#crop(x, n).reverse()));
  }

  #predictOLS(n = 1) {

    if(!this.#coefficients || this.#coefficients.length == 0) return this.deseasonalize(this.integrate((new Array(n)).fill(this.#x[0])));

    let x = this.#crop(this.#x);

    for(let i = 0; i < n; i++) x.unshift(math.multiply(this.#coefficients, [1, ...this.#variables.map(a => x[a - 1])]));

    return this.deseasonalize(this.integrate(this.#crop(x, n).reverse()));
  }



  #fitMean(x) {

    this.#variables = [0];
    this.#coefficients = [this.#mean(x)];
  }

  #fitYW(x, p = null) {

    this.#variables = p && p.length > 0 ? p : this.#selectVariables(x);

    if(this.#variables.length > 0) this.#coefficients = this.#fitCoefficientsYW(x);
  }

  #fitOLS(x, p = null) {

    this.#variables = p && p.length > 0 ? p : this.#selectVariables(x);

    if(this.#variables.length > 0) this.#coefficients = this.#fitCoefficientsOLS(x);
  }



  #selectVariables(x) {

    let v = [];
    let max = this.#pacfMax(x, this.n(x));
    let r = this.r(x, Math.min(this.n(x), max));
    let pacf = this.pacf(x, Math.min(this.n(x), max));

    pacf.forEach((c, i) => { if(Math.abs(c) >= r) v.push(i + 1); });

    return this.#refineVariables(x, v);
  }



  #fitCoefficientsYW(x, v = null) {

    v = v && v.length > 0 ? v : this.#variables;

    if(!v || v.length == 0) return [];

    let t = Math.max(...v);
    let a = (new Array(v.length)).fill(0);
    let b = (new Array(v.length)).fill().map(() => (new Array(v.length)).fill(1));
    
    a.forEach((_, i) => a[i] = this.#cor(x.slice(0, x.length - t), x.slice(v[i], x.length - (t - v[i]))));
    b.forEach((c, i) => c.forEach((_, j) => b[i][j] = this.#cor(x.slice(0, x.length - t), x.slice(Math.abs(v[j] - v[i]), x.length - (t - Math.abs(v[j] - v[i]))))));

    return this.#coefficientsYW(b, a);
  }

  #fitCoefficientsOLS(x, v = null) {

    v = v && v.length > 0 ? v : this.#variables;

    if(!v || v.length == 0) return [];

    let t = Math.max(...v);
    let a = x.slice(0, x.length - t);
    let b = [(new Array(x.length - t)).fill(1), ...(new Array(v.length)).fill().map((_, i) => (x.slice(v[i], x.length - (t - v[i]))))];

    return this.#coefficientsOLS(b, a);
  }



  n(x) {

    return Math.min(Math.ceil(x.length/2), 10*Math.ceil(Math.log10(x.length)));
  }

  r(x, n = 0) {

    return x.length < 4 ? 1 : (Math.E**(2*1.96/Math.sqrt((x.length - n) - 3)) - 1)/(Math.E**(2*1.96/Math.sqrt((x.length - n) - 3)) + 1);
  }



  acf(x, n = null) {

    n = n == null ? this.n(x) : n;

    return (new Array(n)).fill().map((_, i) => this.#cor(x.slice(0, x.length - n), x.slice(i + 1, x.length - (n - (i + 1)))));
  }

  pacf(x, n = null) {

    n = n == null ? this.n(x) : n;

    return (new Array(n)).fill().map((_, i) => this.#pacfMin(x, (new Array(i + 1)).fill().map((_, j) => j + 1)));
  }



  coefficients() {

    let x = {};

    if(this.#variables && this.#variables.length > 0) (this.#method == 'OLS' ? [0, ...this.#variables] : this.#variables).forEach((p, i) => x[p] = this.#coefficients[i]);

    return x;
  }

  seasons() {

    let x = {};

    if(this.#seasons && this.#seasons.length > 0) MISC.clone(this.#seasons).reverse().forEach((s, i) => x[i + 1] = s);

    return x;
  }

  deltas() {

    let x = {};

    if(this.#base && this.#base.length > 0) MISC.clone(this.#base).reverse().forEach((b, i) => x[i + 1] = b);

    return x;
  }



  #pacfMin(x, v) {

    let yw = null, ols = null;

    try { yw = this.#fitCoefficientsYW(x, v).at(-1); } catch(error) {}
    try { ols = this.#fitCoefficientsOLS(x, v).at(-1); } catch(error) {}

    return yw == null && ols == null ? 0 : (yw == null ? ols : (ols == null ? yw : Math.min(yw, ols)));
  }

  #pacfMax(x, n = null) {

    n = n == null ? this.n(x) : n;

    let c = [];

    try { c = (new Array(n)).fill().map((_, i) => this.#fitCoefficientsYW(x, (new Array(i + 1)).fill().map((_, j) => j + 1)).at(-1)); } catch(error) {}

    for(let i in c) {

      if(c[i] > 1) return i.i() + 1;
    }

    return Infinity;
  }



  #stationary(x, n = 10, m = 100, rate = 0.9) {

    for(let i = 0; i < x.length; i += Math.max(50, Math.ceil(x.length/n))) {

      if(this.#trending(x.slice(i, (x.length - i)/Math.max(50, Math.ceil(x.length/n)) < 2 ? Infinity : Math.max(50, Math.ceil(x.length/n))), m, rate)) return false;
    }

    return true;
  }

  #trending(x, n = 100, rate = 0.9) {

    let sample;
    let c = [];
    let ones = (new Array(Math.floor(x.length*rate))).fill(1);
    let t = (new Array(x.length)).fill().map((_, i) => i + 1);

    for(let i = 0; i < n; i++) {

      sample = this.sample(t, rate);

      c.push(this.#coefficientsOLS([ones, sample], sample.map(a => x[x.length - a]))[1]);
    }

    return Math.abs(this.#mean(c)/(this.#dev(c)/Math.sqrt(n - 1 - (2 - 1)))) > 5;
  }



  #refineVariables(x, v) {

    if(!v || v.length == 0) return [];

    let p = [];
    let r = this.r(x, v.length);
    let c = this.#fitCoefficientsYW(x, v); 

    c.forEach((c, i) => { if(Math.abs(c) >= r) p.push(v[i]); });

    return p.length < v.length ? this.#refineVariables(x, p) : p;
  }



  sample(x, rate = .9) {

    return MISC.clone(x).sort(() => Math.random() - 0.5).slice(0, x.length*rate);
  }



  #coefficientsYW(x, y) {

    return math.multiply(math.inv(x), y);
  }

  #coefficientsOLS(x, y) {

    return math.multiply(math.multiply(math.inv(math.multiply(x, math.transpose(x))), x), y);
  }



  #sum(x) {

    return x.reduce((a, b) => a + b);
  }

  #mean(x) {

    return this.#sum(x)/x.length;
  }

  #var(x) {

    let m = this.#mean(x);

    return this.#sum(x.map(a => (a - m)**2))/(x.length - 1);
  }

  #dev(x) {

    return Math.sqrt(this.#var(x));
  }

  #cov(x, y) {

    let m = this.#mean(x);
    let n = this.#mean(y);

    return this.#sum(x.map((a, i) => (a - m)*(y[i] - n)))/(x.length - 1);
  }

  #cor(x, y) {

    return this.#cov(x, y)/(this.#dev(x)*this.#dev(y));
  }



  #crop(x, n = null) {

    n = n || Math.max(...this.#variables);

    return MISC.clone(x.slice(0, n));
  }

  #nonZero(x, y = 1) {

    return x == 0 ? y : x;
  }



  #reset() {

    this.#x = [];
    this.#variables = [];
    this.#coefficients = [];
    this.#method = 'YW';
    this.#seasons = [1];
    this.#base = [];
  }
}