<?php

echo <<< DEX
<section id="DEX" class="WC1">
  <div>
    <button id="DEX-Maximize" type="button" class="btn btn-primary btn-lg float-right add" onclick="maximize(this);">&plus;</button>
    <button id="DEX-Minimize" type="button" class="btn btn-primary btn-lg float-right minimize" onclick="minimize(this);" style="display: none;">&minus;</button>
    <h1 class="pis-50">What is the Decentralized Exchange?</h1>
  </div>
  <br>
  <article id="DEX-Content" style="display: none;">
    <p class="s-mw-10 justify">
      Chocolate Coins are built on the ERC20+ standard. This standard makes them compatible with all ERC20 systems, as well as fully decentralized systems. These fully decentralized system include the decentralized exchange (a.k.a., the "DEX" or the "Candy Shop"). The DEX operates as a broker in P2P coin trades. From a trader's perspective, using the DEX is similar to using any other exchange, with the exception that the order book offers level III access.
    </p>
    <br>
    <p class="s-mw-10 justify">
      The life cycle of a trade transitions over the following trajectory:
    </p>
    <ol>
      <li>
        <p class="s-mw-10 justify">
          <b>Approving the Broker (Traders #1 & #2) &minus; </b>The DEX is not authorized to act on the behalf of traders without their approval. For the DEX to be able to process an account's (wallet's) trades, that account must, first, approve the broker access to funds that will be involved in trading. This can be done for each trade, or once for all future trades. In addition, at any time, an account can revoke the DEX's approval, as well.
        </p>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>Placing an Order (Trader #1) &minus; </b>Once a trader decides to place an order, they initiate an offer either via an GUI-based Chocolate Coin node (like this website) or via a CLI-based node on the Ethereum network. This process involves sharing some basic information:
           about the type of order (e.g., "<span class="numeric">BUY/SELL</span>"), coins to be traded (e.g., <span class="numeric">CHOC</span> for <span class="numeric">CC</span>), trading price, and primary key for identification amongst the traders outstanding orders.
        </p>
        <ul class="bullet">
          <li>
            <p class="s-mw-10 justify">
              A unique order ID &minus; to identify this amongst any other outstanding orders by the trader.
            </p>
          </li>
          <li>
            <p class="s-mw-10 justify">
              The order type (i.e.,  "<span class="numeric">BUY</span>" or "<span class="numeric">SELL</span>").
            </p>
          </li>
          <li>
            <p class="s-mw-10 justify">
              The coins to be exchanged (e.g., "Base: <span class="numeric">CC</span>," "Quote: <span class="numeric">CHOC</span>").
            </p>
          </li>
          <li>
            <p class="s-mw-10 justify">
              The exchange rate (e.g., "<span class="numeric">100,000,000 CHOC/CC</span>").
            </p>
          </li>
        </ul>
        <br>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>Funding the Order (Broker) &minus; </b>Once the information has been filled out, the trader submits the order to the DEX. The Dex reads the order, and calculates the funds required for Trader #1 to complete their side of the agreement. Assuming the funds have been approved, and are available, the DEX will move that amount into its own wallet in preparation of the trade. There are three considerations to be aware of with this process:
        </p>
        <ul class="bullet">
          <li>
            <p class="s-mw-10 justify">
              Funding in Ether should be provided in the "value" parameter within the original order method sent out to the broker.
            </p>
          </li>
          <li>
            <p class="s-mw-10 justify">
              The broker will not take any more coins than required to fulfill the order. Any Ether surplus will be returned to the sender.
            </p>
          </li>
          <li>
            <p class="s-mw-10 justify">
              The order can be cancelled at any time, but only by the account/wallet that placed it originally.
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>Posting the Order (Broker) &minus; </b>Once the DEX confirms the order details as a transaction it can complete, and receives funding, it broadcasts the order to all nodes on the Ethereum blockchain. Any interface listening for orders will receive the information, and share it with other traders. This is the phase where an order will show up in the Candy Shop Order Book, if it meets the filter criteria.
        </p>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>Accepting the Offer (Trader #2) &minus; </b>With the order visible to other traders, looking to deal in the same coins, it waits to be accepted by a counterparty. A counterparty can accept all or a portion of the outstanding order, but only at the price posted. When a counterparty accepts the offer, the DEX checks their fund manangement approval status and ability to pay. If these conditions are met, the DEX will process the order.
        </p>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>Clearing the Trade (Broker) &minus; </b>Trades are cleared in a matter of seconds at the same speed as any blockchain transaction. First, the DEX moves the funds of the trader accepting the offer (trader #2) to the trader who placed the order (trader #1), returning any excess to the sender (trader #2). Once, the DEX confirms the funds have been transfered, it releases the proportionate amount of funds from its wallet to the trader accepting the order (trader #2).
        </p>
      </li>
    </ol>
    <br>
    <img class="full" src="/images/DEX.png" alt="Coins can be exchanged safely with a smart contract broker.">
    <br>
    <br>
    <br>
    <p class="s-mw-10 justify">
      The information from these trades is stored in the event logs on the blockchain. This allows analysts and traders to follow trading activity and pricing trends (like with any security), so that participants can operate in an efficient market.
    </p>
  </article>
</section>
DEX;
?>