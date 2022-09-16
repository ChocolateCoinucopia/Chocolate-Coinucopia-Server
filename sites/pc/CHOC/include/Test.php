<?php

echo <<< orders
<h1>Open Orders</h1>
<article id="OpenOrders-Loading" class="f20">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Loading</p>
        </span>
    </div>
</article>
<article id="OpenOrders" style="display: none;">
    <div id="OpenOrders-Panel">
        <div class="mt-2 center">
            <span class="block s-mw-10 va-top left">
                <div>
                    <span>
                        <label class="pl-52 f20">Order:&nbsp;</label>
                        <select id="OpenOrders-Panel-Order" class="form-control input-lg modest numeric" name="order">
                            <option value="Any" selected>Any</option>
                            <option value="BUY">BUY</option>
                            <option value="SELL">SELL</option>
                        </select>
                    </span>
                </div>
            </span>
            <span class="block s-mw-10 va-top left">
                <div>
                    <span>
                        <label class="f20">Base:&nbsp;</label>
                        <select id="OpenOrders-Panel-Base" class="form-control input-lg modest numeric" name="base">
                            <option value="Any" selected>Any</option>
                            <option value="CHOC">CHOC</option>
                            <option value="CC">CC</option>
                        </select>
                    </span>
                </div>
            </span>
            <span class="block s-mw-10 va-top left">
                <div>
                    <span>
                        <label class="f20">Quote:&nbsp;</label>
                        <select id="OpenOrders-Panel-Quote" class="form-control input-lg modest numeric" name="quote">
                            <option value="Any" selected>Any</option>
                            <option value="ETH">ETH</option>
                            <option value="CC">CC</option>
                        </select>
                    </span>
                </div>
            </span>
        </div>
    </div>
    <div class="flex m-b10">
        <span>
            <table>
                <thead class="sticky">
                    <tr id="OpenOrders-Headers">
                        <th class="pw-10">
                            <a><h3>Placed</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Order</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Base</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Quote</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Quantity</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Limit</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Fulfilled</h3></a>
                        </th>
                        <th class="pw-10">
                            <a><h3>Cancel</h3></a>
                        </th>
                    </tr>
                </thead>
                <tbody id="OpenOrders-Orders" class="numeric">
                </body>
            </table>
        </span>
    </div>
</article>
orders;
?>