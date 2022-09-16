<?php

require_once '/var/www/sites/pc/CHOC/include/Domain.php';

echo <<< nav
<nav>
  <span>
    <a href="{$ROOT_PAGE}">
      <img id="Nav-Home" class="Main-Nav" src="/images/Home.png" alt="Home Button">
    </a>
  </span>
  <span>
    <a href="{$ROOT_PAGE}/Information">
      <img id="Nav-Information" class="Main-Nav" src="/images/Information.png" alt="Process Button">
    </a>
  </span>
  <span>
    <a href="{$ROOT_PAGE}/Analysis">
      <img id="Nav-Analysis" class="Main-Nav" src="/images/Analysis.png" alt="Analysis Button">
    </a>
  </span>
  <span>
    <a href="{$ROOT_PAGE}/Buy">
      <img id="Nav-Buy" class="Main-Nav" src="/images/Buy.png" alt="Buy Button">
    </a>
  </span>
  <span>
    <a href="{$ROOT_PAGE}/Exchange">
      <img id="Nav-Exchange" class="Main-Nav" src="/images/Exchange.png" alt="News Button">
    </a>
  </span>
</nav>
nav;
?>