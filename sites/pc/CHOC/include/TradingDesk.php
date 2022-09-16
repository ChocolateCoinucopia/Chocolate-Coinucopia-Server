<?php

echo <<< exchange
<section id="Wallet" class="WC3">
exchange;
    require_once '/var/www/sites/pc/CHOC/include/Wallet.php';
echo <<< exchange
</section>
<section id="Order" class="WC2" style="display: none;">
exchange;
    require_once '/var/www/sites/pc/CHOC/include/Order.php';
echo <<< exchange
</section>
<section id="Exchange" class="WC1">
exchange;
    require_once '/var/www/sites/pc/CHOC/include/OrderBook.php';
echo <<< exchange
</section>
exchange;
?>