<?php

echo <<< html
<!DOCTYPE html>


<html lang="en">
  <head>
    <title>Information</title>
    <meta name="description" content="Chocolate Coin Information">
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
            require_once '/var/www/sites/mobile/CHOC/include/MetaMask.php';
            require_once '/var/www/sites/mobile/CHOC/include/Theory.php';
            require_once '/var/www/sites/mobile/CHOC/include/Valuation.php';
            require_once '/var/www/sites/mobile/CHOC/include/ERC20.php';
            require_once '/var/www/sites/mobile/CHOC/include/DEX.php';
            require_once '/var/www/sites/mobile/CHOC/include/Server.php';
echo <<< html
        </div>
      </div>
    </div>
html;
    require_once '/var/www/sites/mobile/CHOC/include/Footer.php';
    require_once '/var/www/sites/mobile/CHOC/include/JS.php';
echo <<< html
    <script src="/js/Information.js"></script>
  </body>
</html>
html;
?>
