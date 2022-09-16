<?php

echo <<< address
<h1>Coin Address Book</h1>
<br>
<article class="numeric">
    <div class="pis-200 left">
        <div class="m-b10">
            <span>
                <label class="f20">Network:&nbsp;</label>
                <select id="AddressBook-Network" class="form-control input-lg modest" name="network">
                    <option value="1" selected>Mainnet</option>
                    <option value="4">Rinkeby</option>
                    <option value="42">Kovan</option>
                </select>
            </span>
            <span class="pl-25">
                <label class="f20">Coin:&nbsp;</label>
                <select id="AddressBook-Coin" class="form-control input-lg modest" name="coin">
                    <option value="CHOC" selected>Chocolate Coin (CHOC)</option>
                    <option value="CC">Chocolate Coin 2.0 (CC)</option>
                </select>
            </span>
        </div>
        <div>
            <span>
                <label class="f20">Smart&nbsp;Contract:&nbsp;</label>
                <a id="AddressBook-Contract" class="f20" onclick="MISC.copy(this); return false;">0x96AB5615E26Dd8Cc354fC2Cb107862E77D8a4244</a>
            </span>
        </div>
    </div>
</article>
address;
?>