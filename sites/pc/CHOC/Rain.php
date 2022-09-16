<?php

echo <<< html
<!DOCTYPE html>


<html lang="en">
  <head>
    <title>Pennies From Heaven</title>
    <meta name="description" content="Pennies From Heaven">
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
echo <<< html
        <div id="content" class="text-center">
        </div>
      </div>
    </div>
html;
    require_once '/var/www/sites/pc/CHOC/include/Footer.php';
    require_once '/var/www/sites/pc/CHOC/include/JS.php';
echo <<< html
  </body>
</html>
html;
?>