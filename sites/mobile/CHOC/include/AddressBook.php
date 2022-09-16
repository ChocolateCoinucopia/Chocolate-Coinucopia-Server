<?php

echo <<< address
<h1>Coin Address Book</h1>
<br>
<article class="numeric">
    <div class="left">
        <div>
            <span>
                <label>Network:&nbsp;</label>
                <select id="AddressBook-Network" class="form-control input-lg modest" name="network">
                    <option value="1" selected>Mainnet</option>
                    <option value="4">Rinkeby</option>
                    <option value="42">Kovan</option>
                </select>
            </span>
        </div>
        <div>
            <span>
                <label>Coin:&nbsp;</label>
                <select id="AddressBook-Coin" class="form-control input-lg modest" name="coin">
                    <option value="CHOC" selected>Chocolate Coin (CHOC)</option>
                    <option value="CC">Chocolate Coin 2.0 (CC)</option>
                </select>
            </span>
        </div>
        <div>
            <span class="nowrap">
                <label>Smart&nbsp;Contract:&nbsp;</label>
                <a id="AddressBook-Contract" onclick="MISC.copy(this); return false;"></a>
            </span>
        </div>
    </div>
</article>
address;
?>