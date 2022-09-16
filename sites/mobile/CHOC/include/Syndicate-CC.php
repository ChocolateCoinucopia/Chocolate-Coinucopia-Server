<?php

echo <<< ICO
<h1>Initial <mark>Chocolate Coin 2.0</mark> Offering!</h1>
<br>
<article id="ICO-CC-Loading" class="f20">
  <div class="Loading-Notification">
    <span class="flex">
        <img class="Loading" src="/images/ChocolateCoin.png" alt="">
        <p class="Loading f20">Loading</p>
    </span>
  </div>
</article>
<article id="ICO-CC-Processing" class="f20" style="display: none;">
  <div class="Loading-Notification">
    <span class="flex">
        <img class="Loading" src="/images/ChocolateCoin.png" alt="">
        <p class="Loading f20">Processing</p>
    </span>
  </div>
</article>
<article id="ICO-CC-Menu" class="numeric" style="display: none;">
  <div>
    <p class="nowrap overflow left">
      Token&nbsp;Name:&nbsp;"Chocolate&nbsp;Coin&nbsp;2.0"&nbsp;(CC)<br>
      Sale&nbsp;Price:&nbsp;<span id="ICO-CC-Sale"></span><br>
      Sale&nbsp;Price&nbsp;Ratio:&nbsp;<span id="ICO-CC-Ratio"></span>:1&nbsp;(CC:ETH)<br>
      Spot&nbsp;Price:&nbsp;<mark><span id="ICO-CC-Price"></span></mark>
    </p>
  </div>
  <br>
  <hr>
  <br>
  <div>
    <div>
        <p class="nowrap overflow left">
          Account:&nbsp;<a id="ICO-CC-Account-Address" onclick="MISC.copy(this); return false;"></a><br>
          Balance:&nbsp;<span id="ICO-CC-Balance"></span>&nbsp;CC
        </p>
    </div>
    <div>
      <div class="form-group">
        <div class="input-group nowrap">
          <input id="ICO-CC-Coins" class="form-control input-lg h-37-64 f20 right" type="number" name="quantity" value="1" min="0" step="any" pattern="[0-9]+([\.,][0-9]+)?*">
          <span class="input-group-btn">
            <button id="ICO-CC-Buy" class="btn btn-primary btn-lg courgette f20" type="button">Buy Coins</button>
          </span>
        </div>
      </div>
    </div>
    <div>
      <p id="ICO-CC-Purchased" class="f20 green courgette nowrap" style="display: none;">Purchase Successful!</p>
      <p id="ICO-CC-Rejected" class="f20 red courgette nowrap" style="display: none;">Purchase Failed!</p>
    </div>
  </div>
  <br>
  <div class="progress">
    <div id="ICO-CC-Progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
    </div>
  </div>
  <div>
    <span>
      <div class="fraction">
        <p id="ICO-CC-Coins-Sold" class="numerator f20"></p>
        <p id="ICO-CC-Coins-Available" class="denominator f20"></p>
      </div>
    </span>
    <span class="Units">
      <p class="f20">&nbsp;Coins&nbsp;Sold!</p>
    </span>
  </div>
  <br>
  <hr>
  <br>
  <div>
    <p class="s-mw-10 justify">
      Chocolate Coins are a new crypto currency on the Ethereum network that have intrinsic value, which can be directly measured in ether (ETH). This coin is an ETH-derivative token that uses ether to generate chocolaty rewards. The reward system's algorithm uses the spot burn rate of gas to reimburse the spender in CC for ETH lost in a transaction. These new Chocolate Coins can be exchanged back into ETH to create a virtuous circle for chocolatiers that cancels out the cost of spending Chocolate Coins.<br>
        <br>
        While the first generation of Chocolate Coin was designed for direct transfer transaction types and price stability, Chocolate Coin 2.0 is designed for trading on the Chocolate Coin Exchange (a.k.a., the Candy Shop). These coins are meant for investing, and offer double rewards for those that trade them at the Candy Shop. However, rewards for direct transfers (everyday spending) are half that of Chocolate Coin 1.0.<br>
        <br>
        Both Chocolate Coin versions can be traded at the Candy Shop for each other, as well as for ETH. The Candy Shop is a free, P2P exchange that exists on the Ethereum network for the unregulated exchange of chocolate. It's completely laissez faire. It has no owner, no means of interfering with others' orders, and all offers in the Candy Shop orderbook are pre-funded in full. Anyone can be an investor or a dealer, and all trades are brokered through the Candy Shop's algorithm for 100% safe trading.
    </p>
  </div>
  <br>
  <hr>
  <br>
  <div>
    <h2>Coin Specifications</h2>
    <div>
      <div class="overflow">
        <p class="nowrap left">Smart&nbsp;Contract:&nbsp;<a id="ICO-CC-Contract" class="nowrap" onclick="MISC.copy(this); return false;"></a></p>
        <p class="nowrap left">Coin&nbsp;Standard:&nbsp;<span id="ICO-CC-Standard" class="nowrap"></span></p>
        <p class="nowrap left">Networks:&nbsp;Mainnet,&nbsp;Rinkeby,&nbsp;&&nbsp;Kovan</p>
        <p class="nowrap left">Reward&nbsp;System:&nbsp;Proof-of-Stake&nbsp;(Transaction-Based)</p>
        <p class="nowrap left">Reward:&nbsp;CC</p>
        <p class="nowrap left">Payout @:&nbsp;<span id="ICO-CC-Bar" class="nowrap"></span>&nbsp;CC&nbsp;Spent&nbsp;(1&nbsp;Chocolate&nbsp;Bar)</p>
        <p class="nowrap left">Atomic Units:&nbsp;beans</p>
      </div>
      <br>
      <hr>
      <br>
      <div class="overflow">
        <h2><mark class="underline">Cashback Rewards<mark></h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th class="pw-10 bottom"><p>Direct<br>Transfers</p></th>
              <th class="pw-10 bottom"><p>Proxy<br>Transfers</p></th>
              <th class="pw-10 bottom"><p>P2P<br>Trades</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="pw-10"><p class="nowrap right">Gas per TXN (Average):
              <td class="pw-10"><p id="ICO-CC-Transfer-Gas-Used" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-TransferFrom-Gas-Used" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-Trade-Gas-Used" class="nowrap">0</p></td>
            </tr>
            <tr>
              <td class="pw-10"><p class="nowrap right">Burn Rate (Current Block):
              <td class="pw-10"><p id="ICO-CC-Transfer-Gas-Price" class="nowrap underline">0</p></td>
              <td class="pw-10"><p id="ICO-CC-TransferFrom-Gas-Price" class="nowrap underline">0</p></td>
              <td class="pw-10"><p id="ICO-CC-Trade-Gas-Price" class="nowrap underline">0</p></td>
            </tr>
            <tr>
              <td class="pw-10"><p class="nowrap right">ETH Burned per TXN:
              <td class="pw-10"><p id="ICO-CC-Transfer-ETH-Burned" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-TransferFrom-ETH-Burned" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-Trade-ETH-Burned" class="nowrap">0</p></td>
            </tr>
            <tr></tr>
            <tr>
              <td class="pw-10"><p class="nowrap right">Coin Reward Rate:
              <td class="pw-10"><p id="ICO-CC-Transfer-Cacao" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-TransferFrom-Cacao" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-Trade-Cacao" class="nowrap">0</p></td>
            </tr>
            <tr></tr>
            <tr>
              <td class="pw-10"><p class="nowrap right">CC Reward (Average):
              <td class="pw-10"><p id="ICO-CC-Transfer-Avg-Reward" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-TransferFrom-Avg-Reward" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-Trade-Avg-Reward" class="nowrap">0</p></td>
            </tr>
            <tr>
              <td class="pw-10"><p class="nowrap right">Estimated ETH per CC:
              <td class="pw-10"><p id="ICO-CC-Transfer-Avg-ETH" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-TransferFrom-Avg-ETH" class="nowrap">0</p></td>
              <td class="pw-10"><p id="ICO-CC-Trade-Avg-ETH" class="nowrap">0</p></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</article>
ICO;
?>