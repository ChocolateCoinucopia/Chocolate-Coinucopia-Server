<?php

echo <<< orderbook
<h1>Candy Shop Order Book</h1>
<article id="Exchange-Loading" class="f20">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Loading</p>
        </span>
    </div>
</article>
<article id="Exchange-OrderBook" style="display: none;">
    <div id="Exchange-Panel" class="relative">
        <div class="status">
            <div id="Exchange-Progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
            </div>
        </div>
        <div class="mt-2 relative z-1 center">
            <span>
                <span class="float-left left">
                    <label class="f20">Last Price:&nbsp;<span id="Update-Price" class="numeric f20"></span></label><br>
                    <p>Last Updated:&nbsp;<span id="Update-Time" class="numeric"></span></p>
                </span>
                <span class="float-right">
                    <button id="Order-Open" class="btn btn-primary btn-lg f20" type="button">Trade</button>
                </span>
                <span>
                    <span class="block s-mw-10">
                        <div class="left">
                            <span>
                                <label class="pl-11 f20">Base:&nbsp;</label>
                                <select id="Exchange-Base" class="form-control input-lg modest numeric" name="base">
                                    <option value="CC" selected>CC</option>
                                    <option value="CHOC">CHOC</option>
                                </select>
                            </span>
                        </div>
                        <div class="left">
                            <span>
                                <label class="f20">Quote:&nbsp;</label>
                                <select id="Exchange-Quote" class="form-control input-lg modest numeric" name="quote">
                                    <option value="ETH" selected>ETH</option>
                                    <option value="CHOC">CHOC</option>
                                </select>
                            </span>
                        </div>
                    </span>
                    <span class="block s-mw-10">
                        <div class="left">
                            <span>
                                <label class="f20">Minimum&nbsp;Quantity:&nbsp;</label>
                                <input id="Exchange-Min-Quantity" class="form-control input-lg w-w-150 right numeric flex" type="number" name="quantity" min="0" pattern="[0-9]+([\.,][0-9]+)?" placeholder="# of CC">
                            </span>
                        </div>
                        <div class="left">
                            <span>
                                <label class="pl-15_5 f20">Maximum&nbsp;Orders:&nbsp;</label>
                                <select id="Exchange-Max-Orders" class="form-control input-lg modest numeric" name="orders">
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </span>
                        </div>
                    </span>
                </span>
            </span>
        </div>
    </div>
    <div class="flex m-b10">
        <span>
            <table>
                <thead class="sticky">
                    <tr>
                        <th class="quadruple pw-2" colspan="4">
                            <a><h2>Bid</h2></a>
                        </th>
                    </tr>
                    <tr>
                        <th class="double pw-2" colspan="2">
                            <a><h3>Order</h3></a>
                        </th>
                        <th class="double pw-2" colspan="2">
                            <a><h3>Offer</h3></a>
                        </th>
                    </tr>
                    <tr>
                        <th class="single pw-2">
                            <a><h4>Quantity</h4></a>
                        </th>
                        <th class="single pw-2">
                            <a><h4>Price</h4></a>
                        </th>
                        <th class="single pw-2">
                            <a><h4>Quantity</h4></a>
                        </th>
                        <th class="single pw-2">
                            <a><h4>Accept</h4></a>
                        </th>
                    </tr>
                </thead>
                <tbody id="Exchange-Bid" class="numeric">
                </body>
            </table>
        </span>
        <span class="vr50"></span>
        <span>
            <table>
                <thead class="sticky">
                    <tr>
                        <th class="quadruple pw-2" colspan="4">
                            <a><h2>ASK</h2></a>
                        </th>
                    </tr>
                    <tr>
                        <th class="double pw-2" colspan="2">
                            <a><h3>Order</h3></a>
                        </th>
                        <th class="double pw-2" colspan="2">
                            <a><h3>Offer</h3></a>
                        </th>
                    </tr>
                    <tr>
                        <th class="single pw-2">
                            <a><h4>Quantity</h4></a>
                        </th>
                        <th class="single pw-2">
                            <a><h4>Price</h4></a>
                        </th>
                        <th class="single pw-2">
                            <a><h4>Quantity</h4></a>
                        </th>
                        <th class="single pw-2">
                            <a><h4>Accept</h4></a>
                        </th>
                    </tr>
                </thead>
                <tbody id="Exchange-Ask" class="numeric">
                </body>
            </table>
        </span>
    </div>
</article>
orderbook;
?>