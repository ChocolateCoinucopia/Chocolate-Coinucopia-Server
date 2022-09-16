<?php

require_once '/var/www/sites/mobile/CHOC/include/Domain.php';

echo <<< analysis
<section class="WC3" scroll="Lock">
    <div>
        <button type="button" class="btn btn-primary btn-lg float-right add" onclick="location.href='{$ROOT_PAGE}/Chart'">&plus;</button>
        <h1 class="pis-50">Price Chart</h1>
    </div>
    <article id="TimeSeriesChart">
        <iframe class="view" src="/Chart" title="Chocolate Chart"></iframe>
    </article>
</section>
analysis;
?>