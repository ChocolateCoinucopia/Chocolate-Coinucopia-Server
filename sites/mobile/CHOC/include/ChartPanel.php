<?php

echo <<< chart
<div id="Chart-Panel" class="relative">
	<div class="status">
        <div id="Chart-Progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
        </div>
    </div>
  	<div class="relative mt-2 z-1 pw-5 nowrap overflow center">
  		<span class="block va-top left">
    		<div>
      			<span>
		            <label class="pl-10">Coin:&nbsp;</label>
		            <select id="Chart-Panel-Base" class="form-control input-lg modest numeric" name="base">
		                  <option value="CHOC" selected>CHOC</option>
		                  <option value="CC">CC</option>
		              </select>
        		</span>
      		</div>
      		<div>
        		<span>
          			<label>Curve:&nbsp;</label>
		            <select id="Chart-Panel-Curve" class="form-control input-lg modest numeric" name="curve">
		                  <option value="Price" selected>Price</option>
		                  <option value="MktCap">Market Cap.</option>
		                  <option value="Volume">Volume</option>
		                  <option value="MA">MA</option>
		                  <option value="EMA">EMA</option>
		                  <option value="MACD">MACD</option>
		                  <option value="RSI">RSI</option>
		                  <option value="Envelope">Envelope</option>
		                  <option value="Conche">Conche</option>
		                  <option value="Supply">Supply</option>
		                  <option value="Burn">Burn</option>
		            </select>
    			</span>
      		</div>
		</span>
    	<span id="Chart-Panel-Params" class="block s-ml-10 va-top left" style="display: none;">
    		<div id="Chart-Panel-Params1" style="display: none;">
      			<span>
		            <label>Days:&nbsp;</label>
		            <input id="Chart-Panel-Param1" class="form-control input-lg right flex w-125 numeric" type="number" name="param1" min="1" step="1" pattern="[0-9]+([,][0-9]+)?" placeholder="# of Days">
        		</span>
      		</div>
      		<div id="Chart-Panel-Params2" style="display: none;">
        		<span>
          			<label>Days:&nbsp;</label>
    				<input id="Chart-Panel-Param2" class="form-control input-lg right flex w-125 numeric" type="number" name="param2" min="1" step="1" pattern="[0-9]+([,][0-9]+)?" placeholder="# of Days">
        		</span>
      		</div>
		</span>
    	<span class="block s-ml-10 va-top left">
    		<div>
      			<span>
		            <label>From:&nbsp;</label>
		            <input id="Chart-Panel-From" class="form-control input-lg flex numeric" type="date" name="from" min="2022-03-01" max="
chart;
          				echo date('Y-m-d').'" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="mm/dd/YYYY" value="'.date('Y-m-d', strtotime('-1 months')).'">';
echo <<< chart
        		</span>
      		</div>
      		<div>
        		<span>
          			<label class="pl-23">To:&nbsp;</label>
        			<input id="Chart-Panel-To" class="form-control input-lg flex numeric" type="date" name="to" min="2022-03-01" max="
chart;
          				echo date('Y-m-d').'" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="mm/dd/YYYY" value="'.date('Y-m-d').'">';
echo <<< chart
        		</span>
      		</div>
		</span>
        <span class="block s-ml-10 va-top left">
        	<div>
          		<span>
		            <label>Transaction:&nbsp;</label>
		            <select id="Chart-Panel-Transaction" class="form-control input-lg modest numeric" name="transaction">
		                  <option value="Trade" selected>Trade</option>
		                  <option value="Transfer">Transfer</option>
		                  <option value="TransferFrom">Transfer From</option>
		                  <option value="Sell">ICO Sale</option>
		                  <option value="Conche">Conche</option>
		            </select>
            	</span>
          	</div>
          	<div>
        		<span>
          			<label class="pl-47_5">Quote:&nbsp;</label>
		            <select id="Chart-Panel-Quote" class="form-control input-lg modest numeric" name="quote">
		                  <option value="ETH" selected>ETH</option>
		                  <option value="CC">CC</option>
		            </select>
        		</span>
      		</div>
    	</span>
    	<span class="block s-ml-10 va-top">
      		<div>
        		<span>
					<button id="Chart-Panel-Add" type="button" class="btn btn-primary btn-lg big f20" style="display: none;">&plus;</button>
					<img id="Chart-Panel-Coin" class="Big" src="/images/ChocolateCoin.png" alt="Loading...">
        		</span>
      		</div>
   		</span>
  	</div>
</div>
chart;
?>