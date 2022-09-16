<?php

echo <<< order
<div>
    <button id="Order-Exit" class="btn btn-primary btn-lg float-right exit" type="button">&#10006;</button>
    <h1 class="pis-50">Trade Order</h1>
</div>
<article id="Order-Loading" class="f20">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Loading</p>
        </span>
    </div>
</article>
<article id="Order-Processing" class="f20"  style="display: none;">
    <div class="Loading-Notification">
        <span class="flex">
            <img class="Loading" src="/images/ChocolateCoin.png" alt="">
            <p class="Loading f20">Processing</p>
        </span>
    </div>
</article>
<article id="Order-Chocolate-Coins" class="f20">
    <form>
        <div id="Order-Ticket" style="display: none;">
            <div class="left overflow numeric">
                <div class="m-b10 nowrap">
                    <span>
                        <label>Order:&nbsp;</label>
                        <select id="Order-Order" class="form-control input-lg modest" name="order">
                            <option value="BUY" selected>BUY</option>
                            <option value="SELL">SELL</option>
                        </select>
                        &nbsp;
                        <select id="Order-Base" class="form-control input-lg modest" name="base">
                            <option value="CC" selected>CC</option>
                            <option value="CHOC">CHOC</option>
                        </select>
                        &nbsp;
                        <label id="Order-Predicate">with</label>
                        &nbsp;
                        <select id="Order-Quote" class="form-control input-lg modest" name="quote">
                            <option value="ETH" selected>ETH</option>
                            <option value="CHOC">CHOC</option>
                        </select>
                    </span>
                </div>
                <div class="m-b10 nowrap">
                    <span>
                        <label>Quantity:&nbsp;</label>
                        <input id="Order-Quantity" class="form-control input-lg right flex" type="number" name="quantity" min="0" pattern="[0-9]+([\.,][0-9]+)?" placeholder="# of CC">
                    </span>
                </div>
                <div class="m-b10 nowrap">
                    <span>
                        <label>Exchange&nbsp;Price:&nbsp;</label>
                    </span>
                    <span>
                        <input id="Order-Limit" class="form-control input-lg right flex" type="number" name="price" min="0" pattern="[0-9]+([\.,][0-9]+)?" placeholder="# of ETH">
                    </span>
                    <span>
                        <label id="Order-Quote-Base">&nbsp;ETH&nbsp;per&nbsp;CC</label>
                    </span>
                </div>
            </div>
            <div class="m-b10">
                <span>
                    <button id="Order-Reset-1" class="btn btn-primary btn-lg gold f20" type="button" name="reset"">Reset</button>
                </span>
                <span>
                    <button id="Order-Prepare" class="btn btn-primary btn-lg f20" type="button" name="review">Review Order</button>
                </span>
            </div>
        </div>
        <div id="Order-Confirm" style="display: none;">
            <div>
                <p class="Order-Confirmation numeric"></p>
            </div>
            <div class="m-b10">
                <span>
                    <button id="Order-Edit-1" class="btn btn-primary btn-lg gold f20" type="button" name="edit">Edit Order</button>
                </span>
                <span>
                    <button id="Order-Send" class="btn btn-primary btn-lg f20" type="button" name="confirm">Confirm Order</button>
                </span>
            </div>
        </div>
        <div id="Order-Confirmed" style="display: none;">
            <div>
                <p class="f30 green underline">Order Confirmed!</p>
                <p class="Order-Confirmation numeric"></p>
            </div>
            <div class="m-b10">
                <span>
                    <button id="Order-Reset-2" class="btn btn-primary btn-lg f20" type="button" name="edit">New Order</button>
                </span>
            </div>
        </div>
        <div id="Order-Rejected" style="display: none;">
            <div>
                <p class="f30 red underline">Order Rejected!</p>
                <p class="Order-Confirmation numeric"></p>
            </div>
            <div class="m-b10">
                <span>
                    <button id="Order-Edit-2" class="btn btn-primary btn-lg gold f20" type="button" name="edit">Edit Order</button>
                </span>
            </div>
        </div>
    </form>
</article>
order;
?>