<?php

echo <<< valuation
<section id="Valuation" class="WC1">
  <div>
    <button id="Valuation-Maximize" type="button" class="btn btn-primary btn-lg float-right add" onclick="maximize(this);">&plus;</button>
    <button id="Valuation-Minimize" type="button" class="btn btn-primary btn-lg float-right minimize" onclick="minimize(this);" style="display: none;">&minus;</button>
    <h1 class="pis-50">How are Chocolate Coins Valued?</h1>
  </div>
  <br>
  <article id="Valuation-Content" style="display: none;">
    <p class="s-mw-10 justify">
      As delta tokens, Chocolate Coins are valued by the Ether they recycle. This is done using a transaction-based, proof-of-stake algorithm that requires two considerations before new Chocolate Coins can be created:
    </p>
    <ol>
      <li>
        <p class="s-mw-10 justify">
          <b>Proof of Chocolate &minus; </b>"Conching" (i.e., the process of creating new Chocolate Coins) requires that a party is actively involved in the exchange of Chocolate Coins on the blockchain. When Chocolate Coins are transferred (by any means, to any party), the size of the transfer is aggregated with past transfers in the coin's ledger until the total reaches or exceeds the amount of one Chocolate Bar - a unique quantity for each coin version. Once that amount is reached, the coin's algorithm issues a reward to the spender that is directly proportional to the type of transfer and price of gas. Afterwards, the  party's ledger value is reset to zero, and can begin accumulating, again.
        </p>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>Ether to Burn and Recycle &minus; </b>Because Chocolate Coins must each have an underlying value, their worth is derived from the amount of Ether they recycle. During the transfer process, Ether is burned (as in any interaction with the Ethereum blockchain). However, in the case of Chocolate Coins, the reward algorithm has been paired with the destruction of Ether, so that the value of the new Chocolate Coins produced is equivalent to the Ether that was destroyed. Where, with other coins, the value of the burned Ether is returned to the market capitalization of the Ether currency, with Chocolate Coins, the value is transferred to the Chocolate Coin currency's market capitalization. This process establishes a "gold standard" for Chocolate Coins to be valued in Ether. 
        </p>
      </li>
    </ol>
    <br>
    <img class="CHOCTXN" src="/images/CHOCTXN.png" alt="The coin pairing preserves the value of your ETH.">
    <br>
    <br>
    <br>
    <p class="s-mw-10 justify">
      This gold standard approach allows the intrinsic value of all Chocolate Coins to be measured using the following formula:
    </p>
    <br>
    <img class="PriceFormula" src="/images/PriceFormulaBasic.png" alt="Price equals initial captial plus ETH recycled over the number of coins in circulation.">
    <br>
    <br>
    <div>
      <div>
          <h4 class="numeric">(Price)</h4>
          <p class="s-mw-10 justify">
              The value of each coin.
          </p>
      </div>
      <div>
          <h4 class="numeric">(Equity Capital)</h4>
          <p class="s-mw-10 justify">
              The initial value of the coins in circulation.
          </p>
      </div>
      <div>
          <h4 class="numeric">(ETH Recycled)</h4>
          <p class="s-mw-10 justify">
              The amount of Ether recycled since the coins' creation.
          </p>
      </div>
      <div>
          <h4 class="numeric">(Supply)<sub>t</sub></h4>
          <p class="s-mw-10 justify">
              The number of Chocolate Coins in circulation.
          </p>
      </div>
    </div>
    <br>
    <br>
    <p class="s-mw-10 justify">
      Using this formula, one can measure the impact of conching on both Ether and Chocolate Coins. Because the value of a new Chocolate Coin is designed to be worth more than a coin from the initial supply, the price of each Chocolate Coin increases. Contemporaneously, the price of Ether is unaffected. While Ether coin holders no longer benefit from deflation, they do not suffer any negative impacts from conching.
    </p>
    <br>
    <img class="CHOCImpact" src="/images/DeltaImpact.png" alt="ETH is unharmed during conching.">
    <br>
    <br>
    <br>
    <p class="s-mw-10 justify">
      Another aspect of conching to consider is the relationship between the Chocolate Coin's potential for growth and an individual's preservation of wealth. Chocolate Coins are designed to increase in value with every transaction. In order to do this, there must be a disparity between the price of the initial supply of coins and the price of new coins produced. This difference is what allows chocolate coins to see an immense rise in value after an initial coin offering, but it also allows Chocolate Coins to achieve price stability as they develop.
    </p>
    <br>
    <p class="s-mw-10 justify">
      Early in Chocolate Coins' existence, the gap between the initial price and terminal (a.k.a., "spot") price is at its largest. The majority of recycled Ether is redistributed throughout the suppply of coins, and coin holders as a whole benefit from the gains. However, as the porportion of new coins, tethered to the Ether gold standard, overtakes the less valuable initial supply, the share of recycled Ether that is redistributed to throughout the Chocolate Coin supply diminishes. The value of each Chocolate Coin asymptotically approaches the spot price. When the current price nears the spot price, Chocolate Coin spenders keep the majority of their recycled Ether in their newly minted Chocolate Coin rewards, and the coin's price stabilizes.
    </p>
    <br>
    <img class="CCGrowthExample" src="/images/CC-ETH-Price-Example.png" alt="Exonential growth converges to price stability.">
    <br>
    <br>
    <br>
    <p class="s-mw-10 justify">
      Because a portion of the value of the recycled Ether is always disseminated equally throughout the supply of existing Chocolate Coins, each gain in a coin's value is likable to a dividend payment, and can be measured using the same formulae. This allows one to consider discounted future gains from recycled Ether in the same way one would include expected dividend payments when valuing a security. When the initial value is set to zero, the formula becomes:
    </p>
    <br>
    <img class="PriceFormula" src="/images/PriceFormula.png" alt="Price includes discounted future Ether divided by future coin supply.">
    <br>
    <br>
    <div>
      <div>
          <h4 class="numeric">(ETH Recycled)<sub>0</sub></h4>
          <p class="s-mw-10 justify">
              The amount of Ether that has already been recycled.
          </p>
      </div>
      <div>
          <h4 class="numeric">(Supply)<sub>0</sub></h4>
          <p class="s-mw-10 justify">
              The number of Chocolate Coins currently in circulation.
          </p>
      </div>
      <div>
          <h4 class="numeric">(ETH Recycled)<sub>t</sub></h4>
          <p class="s-mw-10 justify">
              The amount of Ether recycled in the future at time "t."
          </p>
      </div>
      <div>
          <h4 class="numeric">(Supply)<sub>t</sub></h4>
          <p class="s-mw-10 justify">
              The number of Chocolate Coins in circulation in the future at time "t."
          </p>
      </div>
      <div>
          <h4 class="numeric">R<sub>t</sub></h4>
          <p class="s-mw-10 justify">
              The discount rate for time "t."
          </p>
      </div>
    </div>
  </article>
</section>
valuation;
?>