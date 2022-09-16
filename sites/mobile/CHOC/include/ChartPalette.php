<?php

echo <<< chart
<div id="Chart-Palette" class="DC2">
  	<div class="mt-2 relative z-1 nowrap overflow center">
  		<span class="block va-top">
      		<div>
        		<span>
          			<label>Curve:&nbsp;</label>
        			<input id="Chart-Palette-Color" class="form-control input-lg w-29-46 color" type="color" name="line" placeholder="Color" value="#d2691e">
        		</span>
      		</div>
    	</span>
    	<span class="block ml-5 va-top">
      		<div>
        		<span>
          			<label>Pen:&nbsp;</label>
        			<input id="Chart-Palette-Pen" class="form-control input-lg w-29-46 color" type="color" name="pen" placeholder="Color" value="#FFD700">
        		</span>
      		</div>
    	</span>
    	<span class="block ml-5 va-top">
      		<div>
        		<span>
          			<button id="Chart-Palette-Draw" type="button" class="btn btn-primary btn-lg regular mt-2 va-top f15">&#9997;</button>
          			<button id="Chart-Palette-Move" type="button" class="btn btn-primary btn-lg regular mt-2 va-top f15" style="display: none;">&#128070;</button>
        		</span>
      		</div>
    	</span>
    	<span class="block ml-5 va-top">
      		<div>
        		<span>
          			<button id="Chart-Palette-Undo" type="button" class="btn btn-primary btn-lg gold regular mt-2 pt-0 pb-0 va-top f15"><b>&#8634;</b></button>
        		</span>
      		</div>
    	</span>
    	<span class="block ml-5 va-top">
      		<div>
        		<span>
          			<button id="Chart-Palette-Save" type="button" class="btn btn-primary btn-lg regular mt-2 va-top f12-30">&#128248;</button>
          			<button id="Chart-Palette-Graph" type="button" class="btn btn-primary btn-lg regular mt-2 va-top f12-30" style="display: none;">&#128200;</button>
        		</span>
      		</div>
    	</span>
  	</div>
</div>
chart;
?>