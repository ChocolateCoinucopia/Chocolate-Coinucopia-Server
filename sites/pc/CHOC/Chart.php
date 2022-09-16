<?php

echo <<< html
<!DOCTYPE html>


<html lang="en">
  <head>
    <title>Chart</title>
    <meta name="description" content="Chocolate Coin Performance Chart">
    <meta charset="utf-8">
    <meta name="keywords" content="Chocolate Coin Candy Man ICO Initial Coin Offering Description Explained dToken Delta Token Conching Ethereum Sale Free Money Golden Ticket Crypto Currency Digital Food Coinucopia Buy">
    <meta name="author" content="Candy Man">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" type="/image/png" href="/images/ChocolateCoin.png">
    <link href="/css/Fonts.css" rel="stylesheet">
    <link href="/css/etc/bootstrap.min.css" rel="stylesheet">
    <link href="/css/Addendum.css" rel="stylesheet">

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3L9S26JQM2"></script>
    <script src="/js/etc/GoogleTracking.js"></script>
  </head>
  <body class="WC1">
html;
    require_once '/var/www/sites/pc/CHOC/include/ChartPanel.php';
echo <<< html
    <div>
        <canvas id="Chart" width="1000" height="600"></canvas>
        <canvas id="Chart-Interface" width="1000" height="600"></canvas>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="/js/etc/web3.js"></script>
    <script src="/js/etc/bootstrap.min.js"></script>
    <script src="/js/MISC.js"></script>
    <script src="/js/Broker.js"></script>
    <script src="/js/etc/moment.js"></script>
    <script src="/js/ProgressBar.js"></script>
    <script src="/js/Chart.js"></script>
    <script src="/js/ChartPanel.js"></script>
    <script src="/js/PriceChart.js"></script>
  </body>
</html>
html;
?>