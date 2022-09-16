<?php

echo <<< MetaMask
<section id="MetaMask" class="WC1">
  <div>
    <button id="MetaMask-Maximize" type="button" class="btn btn-primary btn-lg float-right add" onclick="maximize(this);">&plus;</button>
    <button id="MetaMask-Minimize" type="button" class="btn btn-primary btn-lg float-right minimize" onclick="minimize(this);" style="display: none;">&minus;</button>
    <h1 class="pis-50">What Wallets are Compatible with Chocolate Coinucopia?</h1>
  </div>
  <br>
  <article id="MetaMask-Content" style="display: none;">
    <p class="s-mw-10 justify">
      Chocolate Coinucopia requires a wallet that can interface with Web3 tools in order to take full advantage of everything the site has to offer. Chocolate Coinucopia does not provide centralization in any form. This includes account ownership. Users own their accounts on their local systems, and may interface with the Chocolate Coin platform at their discretion without discrimination or authoritative oversight.
    </p>
    <br>
    <p class="s-mw-10 justify">
      One popular wallet compatible with the environment is <a href="https://metamask.io/">MetaMask</a>. It is available as a browser extension and mobile application, and can make full use of Chocolate Coinucopia's applications. For those interested, the following video provides an installation and use walkthrough:
    </p>
    <br>
    <iframe class="standard" src="https://www.youtube-nocookie.com/embed/Af_lQ1zUnoM" title="MetaMask Installation Guide" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </article>
</section>
MetaMask;
?>