<?php

echo <<< html
<!DOCTYPE html>


<html lang="en">
  <head>
    <title>Open Orders</title>
    <meta name="description" content="Active Coin Trade Orders">
html;
      require_once '/var/www/sites/mobile/CHOC/include/Head.php';
echo <<< html
  </head>
  <body>
html;
    require_once '/var/www/sites/mobile/CHOC/include/Background.php';
echo <<< html
    <div id="Shell" class="container">
      <div class="row">
html;
        require_once '/var/www/sites/mobile/CHOC/include/Header.php';
        require_once '/var/www/sites/mobile/CHOC/include/Nav.php';
echo <<< html
        <div id="content" class="text-center">
html;
          require_once '/var/www/sites/mobile/CHOC/include/Navigation.php';
          require_once '/var/www/sites/mobile/CHOC/include/Trades.php';
echo <<< html
        </div>
      </div>
    </div>
html;
    require_once '/var/www/sites/mobile/CHOC/include/Footer.php';
    require_once '/var/www/sites/mobile/CHOC/include/JS.php';
echo <<< html
    <script src="/js/Broker.js"></script>
    <script src="/js/etc/moment.js"></script>
    <script src="/js/ProgressBar.js"></script>
    <script src="/js/Transactions.js"></script>
    <script src="/js/History.js"></script>
  </body>
</html>
html;
?>