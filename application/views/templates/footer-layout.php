<div class="footer">
				<div class="footer-inner">
					<div class="footer-content">
						<span class="bigger-120">
							<span class="blue bolder">She Cabs</span>
							 &copy; <?php echo date('Y');?>
						</span>
					</div>
				</div>
			</div>

			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
				<i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
			</a>
		</div><!-- /.main-container -->

		<!-- basic scripts -->

		<!--[if !IE]> -->
		<script src="<?php  echo  asset_url()?>js/jquery-2.1.4.min.js"></script>

		<!-- <![endif]-->

		<!--[if IE]>
<script src="<?php  echo  asset_url()?>js/jquery-1.11.3.min.js"></script>
<![endif]-->
		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='<?php  echo  asset_url()?>js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="<?php  echo  asset_url()?>js/bootstrap.min.js"></script>

		<!-- page specific plugin scripts -->

		<!--[if lte IE 8]>
		  <script src="assets/js/excanvas.min.js"></script>
		<![endif]-->
		<script src="<?php  echo  asset_url()?>js/jquery-ui.custom.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/jquery.ui.touch-punch.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/jquery.easypiechart.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/jquery.sparkline.index.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/jquery.flot.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/jquery.flot.pie.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/jquery.flot.resize.min.js"></script>

		<!-- ace scripts -->
		<script src="<?php  echo  asset_url()?>js/ace-elements.min.js"></script>
		<script src="<?php  echo  asset_url()?>js/ace.min.js"></script>

		<!-- inline scripts related to this page -->
		
				<?php 
					//push global variables
					
					$settings = array("base_url" => base_url(), "asset_url" => asset_url() );
					
					if(isset($js_settings_vars) && !empty($js_settings_vars)){
						$settings = array_merge($settings, $js_settings_vars);
					}
				?>
				<script type="text/javascript">
				var Shecabs = <?php print json_encode(  $settings);?>;			
				</script>
		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='<?php  echo  asset_url()?>js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
        <?php 
					if(isset($javascript_files)):  
						foreach ($javascript_files as $file):?>
				<script type="text/javascript"
				src="<?php print asset_url(). $file ?>"></script> <?php print "\n"  ?>
				<?php 
						endforeach; 
					endif;
				?>
				<script type="text/javascript">
				jQuery(document).ready(function() {   
				   	Metronic.init(); // init metronic core components
					Layout.init(); // init current layout
					Custom.init();
					<?php 
						//push global function invokes;
						if(isset($js_functions)){
							
							foreach( $js_functions as $js_function){
				 				foreach( $js_function as $js_function_name => $params){
									$paramstr = implode(",", $params);
									echo("$js_function_name($paramstr);\n");
								}
							}
						}
					?>
				});
				</script>
		
	</body>
</html>