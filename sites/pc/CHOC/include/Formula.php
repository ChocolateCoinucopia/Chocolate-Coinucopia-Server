<?php

echo <<< formula
<article class="Long">
    <h1>Chocolate Coin's Value Can Be Directly Measured in ETH</h1>
    <br>
    <div>
        <img class="PriceFormula" src="/images/PriceFormula.png" alt="Price includes discounted future Ether divided by future coin supply.">
        <br>
        <br>
        <div class="flex">
          <span class="grid">
              <h4 class="numeric">(ETH Recycled)<sub>0</sub></h4>
              <p class="s-mw-10 justify">
                  The amount of Ether that has already been recycled.
              </p>
          </span>
          <div class="vr25"></div>
          <span class="grid">
              <h4 class="numeric">(Supply)<sub>0</sub></h4>
              <p class="s-mw-10 justify">
                  The number of Chocolate Coins currently in circulation.
              </p>
          </span>
          <div class="vr25"></div>
          <span class="grid">
              <h4 class="numeric">(ETH Recycled)<sub>t</sub></h4>
              <p class="s-mw-10 justify">
                  The amount of Ether recycled in the future at time "t."
              </p>
          </span>
          <div class="vr25"></div>
          <span class="grid">
              <h4 class="numeric">(Supply)<sub>t</sub></h4>
              <p class="s-mw-10 justify">
                  The number of Chocolate Coins in circulation in the future at time "t."
              </p>
          </span>
          <div class="vr25"></div>
          <span class="grid">
              <h4 class="numeric">R<sub>t</sub></h4>
              <p class="s-mw-10 justify">
                  The discount rate for time "t."
              </p>
          </span>
        </div>
    </div>
</article>
formula;
?>