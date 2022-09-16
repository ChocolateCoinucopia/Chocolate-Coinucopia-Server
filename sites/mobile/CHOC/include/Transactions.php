<?php

echo <<< history
<h1>Transaction History</h1>
<article id="History-Loading" class="f20">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Loading</p>
        </span>
    </div>
</article>
<article id="History-Content" style="display: none;">
    <div id="History-Panel" class="relative">
        <div class="status">
            <div id="History-Progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
            </div>
        </div>
        <div class="mt-2 relative z-1 nowrap overflow center">
            <span class="block va-top left">
                <div>
                    <span>
                        <label>Transaction:&nbsp;</label>
                        <select id="History-Panel-Transaction" class="form-control input-lg modest numeric" name="transaction">
                            <option value="Any" selected>Any</option>
                            <option value="Trade">Trade</option>
                            <option value="Transfer">Transfer</option>
                            <option value="TransferFrom">Proxy Transfer</option>
                            <option value="ICO">ICO Sale</option>
                            <option value="Conche">Conche</option>
                        </select>
                    </span>
                </div>
                <div>
                    <span id="History-Panel-Offer">
                        <label class="pl-47_5">Order:&nbsp;</label>
                        <select id="History-Panel-Order" class="form-control input-lg modest numeric" name="order">
                            <option value="Any" selected>Any</option>
                            <option value="BUY">BUY</option>
                            <option value="SELL">SELL</option>
                            <option value="SEND">SEND</option>
                            <option value="RECEIVE">RECEIVE</option>
                        </select>
                    </span>
                </div>
            </span>
            <span class="block s-ml-10 va-top left">
                <div>
                    <span>
                        <label id="History-Panel-Coin" class="pl-11_5">Coin:&nbsp;</label>
                        <select id="History-Panel-Base" class="form-control input-lg modest numeric" name="base">
                            <option value="Any" selected>Any</option>
                            <option value="CHOC">CHOC</option>
                            <option value="CC">CC</option>
                        </select>
                    </span>
                </div>
                <div>
                    <span id="History-Panel-Units">
                        <label>Quote:&nbsp;</label>
                        <select id="History-Panel-Quote" class="form-control input-lg modest numeric" name="quote">
                            <option value="Any" selected>Any</option>
                            <option value="ETH">ETH</option>
                            <option value="CC">CC</option>
                        </select>
                    </span>
                </div>
            </span>
            <span class="block s-ml-10 va-top left">
                <div>
                    <span>
                        <label>From:&nbsp;</label>
                        <input id="History-Panel-From" class="form-control input-lg flex numeric" type="date" name="from" min="2022-03-01" max="
history;
                            echo date('Y-m-d').'" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="mm/dd/YYYY" value="'.date('Y-m-d', strtotime('-1 months')).'">';
echo <<< history
                    </span>
                </div>
                <div>
                    <span>
                        <label class="pl-23">To:&nbsp;</label>
                        <input id="History-Panel-To" class="form-control input-lg flex numeric" type="date" name="to" min="2022-03-01" max="
history;
                            echo date('Y-m-d').'" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="mm/dd/YYYY" value="'.date('Y-m-d').'">';
echo <<< history
                    </span>
                </div>
            </span>
        </div>
    </div>
    <div class="m-b10 nowrap overflow">
        <span>
            <table>
                <thead class="sticky">
                    <tr id="History-Headers">
                        <th class="pw-10">
                            <a><h3 key="Confirmed">Confirmed</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3 key="Transaction">Transaction</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3 key="Order">Order</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3 id="History-Panel-Header" key="Base">Coin</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3 key="Quantity">Quantity</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3 key="Quote">Quote</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3 key="Price">Price</h3></a>
                        </th>
                    </tr>
                </thead>
                <tbody id="History-Transactions" class="numeric">
                </body>
            </table>
        </span>
    </div>
</article>
history;
?>