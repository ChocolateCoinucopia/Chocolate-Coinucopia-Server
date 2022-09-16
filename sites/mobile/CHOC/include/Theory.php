<?php

echo <<< theory
<section id="Theory" class="WC1">
  <div>
    <button id="Theory-Maximize" type="button" class="btn btn-primary btn-lg float-right add" onclick="maximize(this);">&plus;</button>
    <button id="Theory-Minimize" type="button" class="btn btn-primary btn-lg float-right minimize" onclick="minimize(this);" style="display: none;">&minus;</button>
    <h1 class="pis-50">Where Do Chocolate Coins Get Their Value?</h1>
  </div>
  <br>
  <article id="Theory-Content" style="display: none;">
    <p class="mw-10 justify">The Chocolate Coin business model relies on two assumptions:</p>
    <ol>
      <li>
        <p class="mw-10 justify">
          The parties on each side of a transaction benefit from the transaction.
        </p>
      </li>
      <li>
        <p class="mw-10 justify">
          The value of the spending party's Ether burned to perform a transaction is exclusively attributable to the blockchain's recordkeeping process, and not to the process of transfering value.
        </p>
      </li>
    </ol>
    <br>
    <p class="mw-10 justify">
      The first assumption is relatively intuitive, and a fundamental economic principle - no rational individual takes part in a transaction that leaves them worse off than before it occurred. The second principle is more nuanced, but just as important.
    </p>
    <br>
    <p class="mw-10 justify">
      The value provided by each Ethereum node that processes and stores transactions on the block chain is strictly attributable to its storage on the blockchain, and not to the transfer of wealth. A simple method of proving this assumption is to juxtapose the official Ethereum blockchain (i.e., the Mainnet) with a test network (e.g., the Rinkeby test network). 
    </p>
    <br>
    <p class="mw-10 justify">
      Both the Mainnet and Rinkeby networks record transactions using the same process. The only difference between the two is that the Rinkeby network is setup to ignore other nodes, so that it can create a financially viable microcosm of the Mainnet without its unwieldy block mining difficulty level - zero redundancy, a centralized network. In every other respect (including the processing of transactions), the two networks are the same. Yet, this disparity (the Mainnet's blockchain vs. the Rinkeby blockchain) is the reason Ether is valued at thousands of US dollars, while Rinkeby Ether is available free to anyone who wants it.
    </p>
    <br>
    <p class="mw-10 justify">
      Consider a fundamental component of the Ethereum transaction: &quot;gas.&quot; Gas is a term used to quantify the stored data of the recordkeeping process in standard, measurable units. It is an unavoidable component of every transaction, and is paid for with Ether. In every transaction, an amount of Ether is transferred, and an additional amount of Ether is "burned" to cover the cost of recording the transaction. This burned Ether ceases to exist. Its value, however, is perserved in the overall value of the coins, increasing their individual value: Ether deflation. All the Ether coins receive a minor boost in their value equal to the transaction's burned Ether. The majority of this value is apportioned away from the spender, and to the general Ethereum community. In this way, the system disincentizes Ether spenders for every transaction they make.
    </p>
    <br>
    <p class="mw-10 justify">
      This dilemma of local deflation is what Chocolate Coins are designed to solve. Chocolate Coins are designed with an inflation algorithm that rewards the spender with more coins for every transaction made. The value of these new Chocolate Coins produced is equal to the amount of Ether burned, preserving the spender's wealth. To explain how this works in more detail, consider a transaction where an individual sends money to theirself.
    </p>
    <br>
    <p class="mw-10 justify">
      When a circular transaction is processed entirely in Ether, the transacting account is left in exactly the same position it was in before, minus some burned Ether. Nothing else changes in this scenario, and there is no value (perhaps even a negative value) in recording the transaction. No rational person would make this transaction because it would leave them worse off than before. However, when Chocolate Coins are introduced into the process the equilibrium is altered. When one transfers an amount of Chocolate Coins to theirself (a process referred to as "conching"), they end up with slightly less Ether and some Chocolate Coins. The only variables of this accounting equation are the supply and value of Ether, and the supply and value of chocolate; four factors that still find an equilibrium.
    </p>
    <br>
    <p class="mw-10 justify">
      By increasing the dimensionality of this value equation (with another coin), there is, now, a range of equilibriums that will resolve it. Any value from the burned Ether that is not reabsorbed into the Ether coin's market capitalization is left to the new batch of Chocolate Coins. Keeping in mind the first assumption, an exchange of Chocolate Coins would require that both parties in the transaction receive some amount of value. Because one of those parties is the receiver of the Chocolate Coins, the Chocolate Coins must have a value greater than zero. For this reason, the equation for the value of the new Chocolate Coins is bounded between 0 and the entire value of the burned Ether:
    </p>
    <br>
    <img class="CHOCTXN" src="/images/PriceRange.png" alt="0 ≤ CHOC ≤ (Gas Burned)x(Gas Price in Ether)">
    <br>
    <br>
    <br>
    <p class="mw-10 justify">
      The obvious counterpoint to this formula is that it relies on the assumption that the transaction was made by a rational actor. In this two-coin transaction, the entirety of the burned value can be preserved by the Ether coin's market capitalization, if the transacting individual is irrational. One could also argue that, given the idiosyncratic nature of each transaction (and transactor), the process of apportioning value between the two coins is arbitrary, at best; impossible otherwise. However, when one considers the transactions that are not being made due to Ether gas fee that would be eliminated by chocolate, a method of discretely allotting value presents itself.
    </p>
    <br>
    <p class="mw-10 justify">
      Any transaction that occurs with chocolate that would not have occurred with Ether because of the gas fee represents an opportunity cost that Chocolate Coins eliminate - a measurable and assignable value. Keeping that in mind, one must also recognize that, because spending Chocolate Coins requires the additional transaction step of converting Ether to chocolate, it is a higher energy process than transacting in Ether directly. This means that Chocolate Coin transactions are not a natural state of the Ethereum financial system, unless they provide value to their transactors. Combining these two considerations, one can assert that Chocolate Coins are (much like Ether) a self-validating asset that have value because they are exchanged. Essentially, all transactions that occur in chocolate, rather than Ether, are done because they are more valuable than transacting in Ether, and, therefore, prove that the value of the burned Ether coins has been relocated to the Chocolate Coins, making them a delta token.
    </p>
    <br>
    <p class="mw-10 justify">
      Delta Tokens (a.k.a., "Derivative Tokens," "dTokens," "dt's", etc.) are crypto tokens that derive their value from the exchange costs of another token. In the case of Chocolate Coins, they derive their value from the gas fee burned in their exchange.
    </p>
  </article>
</section>
theory;
?>