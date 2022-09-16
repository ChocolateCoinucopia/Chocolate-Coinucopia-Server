<?php

echo <<< html
<!DOCTYPE html>


<html lang="en">
  <head>
    <title>Open Orders</title>
    <meta name="description" content="Active Coin Trade Orders">
html;
      require_once '/var/www/sites/pc/CHOC/include/Head.php';
echo <<< html
  </head>
  <body>
html;
    require_once '/var/www/sites/pc/CHOC/include/Background.php';
echo <<< html
    <div id="Shell" class="container">
      <div class="row">
html;
        require_once '/var/www/sites/pc/CHOC/include/Header.php';
        require_once '/var/www/sites/pc/CHOC/include/Nav.php';
echo <<< html
        <div id="content" class="text-center">
html;
          require_once '/var/www/sites/pc/CHOC/include/Navigation.php';
          require_once '/var/www/sites/pc/CHOC/include/ActiveOrders.php';
echo <<< html
        </div>
      </div>
    </div>
html;
    require_once '/var/www/sites/pc/CHOC/include/Footer.php';
    require_once '/var/www/sites/pc/CHOC/include/JS.php';
echo <<< html
    <script src="/js/Broker.js"></script>
    <script src="/js/etc/moment.js"></script>
    <script src="/js/ProgressBar.js"></script>
    <script src="/js/Wallet.js"></script>
    <script src="/js/OpenOrders.js"></script>
    <script src="/js/Orders.js"></script>
  </body>
</html>
html;
?>