<?php

echo <<< valuation
<h1>Chocolate Coin Valuation</h1>
<article id="Valuation-Loading" class="f20">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Loading</p>
        </span>
    </div>
</article>
<article id="Valuation-Content" style="display: none;">
    <div id="Valuation-Panel" class="relative">
        <div class="status">
            <div id="Valuation-Progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
            </div>
        </div>
        <div class="mt-2 relative z-1 center">
            <span class="block s-mw-10 va-top left">
                <div>
                    <span>
                        <label class="pl-43 f20">Coin:&nbsp;</label>
                        <select id="Valuation-Panel-Coin" class="form-control input-lg modest numeric" name="coin">
                            <option value="CHOC" selected>CHOC</option>
                            <option value="CC">CC</option>
                        </select>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="f20">Group&nbsp;By:&nbsp;</label>
                        <select id="Valuation-Panel-Group" class="form-control input-lg modest numeric" name="group">
                            <option value="Day">Day</option>
                            <option value="Week">Week</option>
                            <option value="Month" selected>Month</option>
                            <option value="Quarter">Quarter</option>
                            <option value="Year">Year</option>
                        </select>
                    </span>
                </div>
            </span>
            <span class="block s-mw-10 va-top left">
                <div>
                    <span>
                        <label class="f20">From:&nbsp;</label>
                        <input id="Valuation-Panel-From" class="form-control input-lg flex numeric" type="date" name="from" min="2022-03-01" max="
valuation;
                            echo date('Y-m-d').'" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="mm/dd/YYYY" value="'.date('Y-m-d', strtotime('-6 months')).'">';
echo <<< valuation
                    </span>
                </div>
                <div>
                    <span>
                        <label class="pl-25_5 f20">To:&nbsp;</label>
                        <input id="Valuation-Panel-To" class="form-control input-lg flex numeric" type="date" name="to" min="2022-03-01" max="
valuation;
                            echo date('Y-m-d').'" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="mm/dd/YYYY" value="'.date('Y-m-d').'">';
echo <<< valuation
                    </span>
                </div>
            </span>
            <span class="block s-mw-10 va-top left">
                <div class="left">
                    <span>
                        <label class="pl-59_5 f20">Predict:&nbsp;</label>
                        <input id="Valuation-Panel-Predict" class="form-control input-lg w-w-90 right numeric flex" type="number" name="predict" min="1" pattern="[0-9]+([\.,][0-9]+)?" placeholder="5" value="6">
                    </span>
                </div>
                 <div class="left">
                    <span>
                        <label class="f20">Discount&nbsp;Rate:&nbsp;</label>
                        <input id="Valuation-Panel-Discount" class="form-control input-lg w-w-90 right numeric flex" type="number" name="discount" min="0" pattern="[0-9]+([\.,][0-9]+)?" placeholder="0.1" value="0.1">
                    </span>
                </div>
            </span>
        </div>
    </div>
    <div id="Valuation-Table" class="m-b10 overflow" style="display: none;">
        <span>
            <table>
                <thead id="Valuation-Table-Head" class="sticky">
                    <tr id="Valuation-Headers">
                        <th class="pw-10"></th>
                        <th class="pw-10"></th>
                </thead>
                <tbody id="Valuation-Table-Body" class="numeric">
                    <tr>
                        <td>
                            <select id="Valuation-Table-Transfer" class="form-control input-lg mb-2_5 modest numeric" name="transfer">
                                <option value="Custom">Manual</option>
                                <option value="Average">Average</option>
                                <option value="Cyclical">Cyclical</option>
                                <option value="Regression">Regression</option>
                                <option value="SARIMA" selected>SARIMA</option>
                            </select>
                        </td>
                        <th class="sticky pw-10" target="Transfer">
                            <a><h3 class="mt-0 mb-2_5">Transfer</h3></a>
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <select id="Valuation-Table-TransferFrom" class="form-control input-lg mb-2_5 modest numeric" name="transferFrom">
                                <option value="Custom">Manual</option>
                                <option value="Average">Average</option>
                                <option value="Cyclical">Cyclical</option>
                                <option value="Regression">Regression</option>
                                <option value="SARIMA" selected>SARIMA</option>
                            </select>
                        </td>
                        <th class="sticky pw-10" target="TransferFrom">
                            <a><h3 class="mt-0 mb-2_5">Proxy&nbsp;Transfer</h3></a>
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <select id="Valuation-Table-Trade" class="form-control input-lg mb-2_5 modest numeric" name="trade">
                                <option value="Custom">Manual</option>
                                <option value="Average">Average</option>
                                <option value="Cyclical">Cyclical</option>
                                <option value="Regression">Regression</option>
                                <option value="SARIMA" selected>SARIMA</option>
                            </select>
                        </td>
                        <th class="sticky pw-10" target="Trade">
                            <a><h3 class="mt-0 mb-2_5">Trade</h3></a>
                        </th>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td></td>
                        <th class="sticky pw-10" target="Total">
                            <a><h3 class="mt-0 mb-2_5">Total</h3></a>
                        </th>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td>
                            <select id="Valuation-Table-Supply" class="form-control input-lg mb-2_5 modest numeric" name="supply">
                                <option value="Custom">Manual</option>
                                <option value="Average">Average</option>
                                <option value="Cyclical">Cyclical</option>
                                <option value="Regression">Regression</option>
                                <option value="SARIMA" selected>SARIMA</option>
                            </select>
                        </td>
                        <th class="sticky pw-10" target="Supply">
                            <a><h3 class="mt-0 mb-2_5">Supply</h3></a>
                        </th>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td></td>
                        <th class="sticky pw-10" target="Growth">
                            <a><h3 class="mt-0 mb-2_5">Growth</h3></a>
                        </th>
                    </tr>
                    <tr>
                        <td></td>
                        <th class="sticky pw-10" target="Discount">
                            <a><h3 class="mt-0 mb-2_5">Discount</h3></a>
                        </th>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td></td>
                        <th class="sticky pw-10" target="PV">
                            <a><h3 class="mt-0 mb-2_5">Present&nbsp;Value</h3></a>
                        </th>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td></td>
                        <th class="sticky pw-10" target="Estimate">
                            <a><h3 class="mt-0 mb-2_5">Estimated&nbsp;Price</h3></a>
                        </th>
                        <td id="Valuation-Price"><a>0</a></td>
                    </tr>
                </body>
            </table>
        </span>
    </div>
</article>
valuation;
?>
