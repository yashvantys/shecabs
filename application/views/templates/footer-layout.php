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

		<!-- END FOOTER -->
			<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
				<?php 
					//push global variables
					$userdata = $this->session->userdata('uinfo');
					$settings = array("base_url" => base_url(), "asset_url" => asset_url(),"user"=>$userdata['userid'] );
					
					if(isset($js_settings_vars) && !empty($js_settings_vars)){
						$settings = array_merge($settings, $js_settings_vars);
					}
				?>
				<script type="text/javascript">
				var Shecabs = <?php print json_encode(  $settings);?>;			
				</script>

			<!-- BEGIN CORE PLUGINS -->
			<!--[if lt IE 9]>
				<script src="<?php  echo  asset_url()?>global/plugins/respond.min.js"></script>
				<script src="<?php  echo  asset_url()?>global/plugins/excanvas.min.js"></script> 
				<![endif]-->
			
			<?php ?> 
			<script src="<?php  echo  asset_url()?>custom/survey/slide/js/jquery-1.11.3.min.js"	type="text/javascript"></script>
			<!-- <script src="<?php  //echo  asset_url()?>global/plugins/jquery.min.js"	type="text/javascript"></script> -->
			<script
				src="<?php  echo  asset_url()?>global/plugins/jquery-migrate.min.js" type="text/javascript"></script> 
			<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
			<script
				src="<?php  echo  asset_url()?>global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/bootstrap/js/bootstrap.min.js"	type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/bootstrap/js/bootstrap-hover-dropdown.min.js"	type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/jquery/jquery.slimscroll.min.js"	type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
			<script
				src="<?php  echo  asset_url()?>global/plugins/bootstrap/js/bootstrap-switch.min.js"	type="text/javascript"></script> 
					
			
			<!-- END CORE PLUGINS -->
			<script src="<?php  echo  asset_url()?>global/scripts/metronic.js"	type="text/javascript"></script>
			<script src="<?php  echo  asset_url()?>admin/layout3/scripts/layout.js" type="text/javascript"></script>
			<!-- <script
				src="<?php  echo  asset_url()?>admin1/layout/scripts/layout.js"	type="text/javascript"></script> -->
				<?php ?> 
		
				
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
			<!-- END JAVASCRIPTS -->
			
			 <script>
   				 $('.toggle').click(function (event) {
				event.preventDefault();
				var target = $(this).attr('href');
				$(target).toggleClass('hidden show');
			}); 
////////////////////////////////slide////////////////////////////////////////////////////////
    			
///////////////////////////////////////toggle//////////////////////////////////////////////////////
   				$(document).on('click', '.panel-heading span.clickable', function(e){
   			        $(this).parents('.panel').find('.panel-collapse').collapse('toggle');
   			    })
   			    .on('show.bs.collapse', '.panel-collapse', function () {
   			        var $span = $(this).parents('.panel').find('.panel-heading span.clickable');
   			        $span.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
   			    })
   			    .on('hide.bs.collapse', '.panel-collapse', function () {
   			        var $span = $(this).parents('.panel').find('.panel-heading span.clickable');
   			        $span.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
   			    })
   			    
   			 				
    		</script>
		
	<!-- END CONTAINER -->
</body>
<!-- END BODY -->
</html>