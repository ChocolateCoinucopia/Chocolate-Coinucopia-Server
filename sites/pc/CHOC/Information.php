<?php

echo <<< html
<!DOCTYPE html>


<html lang="en">
  <head>
    <title>Information</title>
    <meta name="description" content="Chocolate Coin Information">
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
            require_once '/var/www/sites/pc/CHOC/include/MetaMask.php';
            require_once '/var/www/sites/pc/CHOC/include/Theory.php';
            require_once '/var/www/sites/pc/CHOC/include/Valuation.php';
            require_once '/var/www/sites/pc/CHOC/include/ERC20.php';
            require_once '/var/www/sites/pc/CHOC/include/DEX.php';
            require_once '/var/www/sites/pc/CHOC/include/Server.php';
echo <<< html
        </div>
      </div>
    </div>
html;
    require_once '/var/www/sites/pc/CHOC/include/Footer.php';
    require_once '/var/www/sites/pc/CHOC/include/JS.php';
echo <<< html
    <script src="/js/Information.js"></script>
  </body>
</html>
html;
?>
