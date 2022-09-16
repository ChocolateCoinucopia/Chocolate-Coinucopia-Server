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
echo <<< html
        </div>
      </div>
    </div>
html;
    require_once '/var/www/sites/pc/CHOC/include/Footer.php';
    require_once '/var/www/sites/pc/CHOC/include/JS.php';
echo <<< html
    <script src="/js/etc/math.js"></script>
    <script src="/js/Test.js"></script>
  </body>
</html>
html;
?>