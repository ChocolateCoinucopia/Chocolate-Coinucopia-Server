<?php

echo <<< Server
<section id="Server" class="WC1">
  <div>
    <button id="Server-Maximize" type="button" class="btn btn-primary btn-lg float-right add" onclick="maximize(this);">&plus;</button>
    <button id="Server-Minimize" type="button" class="btn btn-primary btn-lg float-right minimize" onclick="minimize(this);" style="display: none;">&minus;</button>
    <h1 class="pis-50">What is a Chocolate Node?</h1>
  </div>
  <br>
  <article id="Server-Content" style="display: none;">
    <p class="s-mw-10 justify">
      Chocolate coins exist on the Ethereum blockchain, and, like most ERC20 coins, enjoy all the decentralized benefits the environment provides. However, the decentralization of the Ethereum network only extends so far as the database that holds the information about the coins, and processes their transactions. Beyond this scope, many coins rely on centralized systems to interact with the Ethereum network (e.g., centralized exchanges with custodial accounts). These centralized components make up a considerable portion of Ethereum's financial system, and are vulnerable to exploitation. Centralized exchanges can be hacked, and their coins looted; their independence can be undermined by government organizations; members of the exchange can access the contents of custodial wallets without the consent of the owner. They are incongruous with the spirit of decentralized finance.
    </p>
    <br>
    <p class="s-mw-10 justify">
      The Chocolate network is systematically decentralized. Unlike most coins, Chocolate Coins have no special founder permissions; no backdoors for administrators. Coin and wallet information is securely stored on the Ethereum blockchain. The financial platform, the graphical user interface (GUI), is open-source, and supplied by a network of independent servers. Network users (chocolatiers) privately own their wallets, and interact directly with the Ethereum blockchain using the GUI supplied from a server of their choice.
    </p>
    <br>
    <a href="https://github.com/ChocolateCoinucopia/Chocolate-Coinucopia-Server">
      <img class="full" src="/images/ChocolateNetwork.png" alt="The entire network is decentralized from blockchain to server to wallet.">
    </a>
    <br>
    <br>
    <br>
    <p class="s-mw-10 justify">
      The Chocolate financial system can be depicted by three rings of delicious independence:
    </p>
    <ul>
      <li>
        <p class="s-mw-10 justify">
          <b>The Ethereum Network &minus; </b>The Ethereum network is the database that holds and maintains all coin and wallet information. It securely processes the signed data (i.e., coin transactions) from wallet owners across its vast network of Ethereum nodes. This unhackable network serves as the back-end of the Chocolate financial system from which all chocolatiers interact with directly.
        </p>
      <li>
        <p class="s-mw-10 justify">
          <b>The Chocolate Server Network &minus; </b>Chocolatiers can interact with the Ethereum network through the command line interface (CLI) of an Ethereum node, or they may use a web3 capable browser (e.g., a web browser with a MetaMask extension) to interact with the Ethereum network visually. A decentralized network of servers (Chocolate nodes) hold the open-source GUI code that a chocolatier's browser uses to access the Ethereum blockchain. Each Chocolate node has its own URL and SSL certificates. These servers provide the front-end code only, and do not play a role in the chocolatier's interaction with the Ethereum network. Chocolatiers use the code from a Chocolate node to connect their browser directly with the Ethereum network and its database. Once connected, their browsers request data from the Ethereum nodes to populate pages, and send data for any transactions made by the chocolatier.
        </p>
      </li>
      <li>
        <p class="s-mw-10 justify">
          <b>The Chocolatiers &minus; </b>Chocolatiers are the users of the Chocolate network. They privately own their Ethereum wallets and their Chocolate Coins. When they purchase coins from the initial coin offering (ICO) or place a trade on the decentralized exchange (DEX), they interact directly with smart contracts on the Ethereum network. These smart contracts accomplish the same roles of a centralized brokerage without exposing chocolatiers to the risks and fees involved with centralized financial systems. All transactions (transfers, trades, etc.) are free of any fees or costs, and the ether burned to use the Ethereum network is recycled back into the value of the Chocolate Coins.
        </p>
      </li>
    </ul>
    <br>
    <p class="s-mw-10 justify">
      For those interested in hosting their own Chocolate node, the code is available on <a href="https://github.com/ChocolateCoinucopia/Chocolate-Coinucopia-Server">GitHub</a>. Please, click on the diagram of the Chocolate financial system above for more information.
    </p>
  </article>
</section>
Server;
?>