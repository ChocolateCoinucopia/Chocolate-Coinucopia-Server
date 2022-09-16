<?php

echo <<< wallet
<h1>Coin Wallet</h1>
<article id="Wallet-Loading" class="f20">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Loading</p>
        </span>
    </div>
</article>
<article id="Wallet-Account" style="display: none;">
    <div class="flex m-b10">
        <span>
            <table>
                <thead class="sticky">
                    <tr id="Wallet-Headers">
                        <th class="pw-25">
                            <a><h3>Ticker</h3></a>
                        </th>
                        <th class="pw-25">
                            <a><h3>Name</h3></a>
                        </th>
                        <th class="pw-25">
                            <a><h3>Balance</h3></a>
                        </th>
                        <th class="pw-25">
                            <a><h3>Broker Approval</h3></a>
                        </th>
                    </tr>
                </thead>
                <tbody id="Wallet-Coins" class="numeric">
                </body>
            </table>
        </span>
    </div>
</article>
wallet;
?>