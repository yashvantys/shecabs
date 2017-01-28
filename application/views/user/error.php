<div id="release"></div>
<div class="row">
<div class="col-md-4"></div>
	<div class="col-md-6 col-center-login">

			<div class="portlet light bordered" style="max-width: 530px">
				<!-- <div class="portlet-title">
					<div class="caption">
						<span class="caption-subject bold uppercase">Error Page</span>
					</div>
				</div> -->
				<div class="portlet-body table-responsive">
				<div class="row portlet-body error_message col-md-12">
				
					<?php 
							
					if(trim($this->session->userdata ( 'logintitle' )))
						$title = trim($this->session->userdata ( 'logintitle' ));
					else 
						$title = 'BinaryFountain';
					
					if($this->session->userdata('reasonfornoaccess') == 'NOTAPPROVED'){
					?>
					
					<p>We are in the process of activating your account. You will receive a confirmation email shortly. If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
					<br>
					<p>- <?php echo trim($title);?> Team</p>
					<?php }else if($this->session->userdata('reasonfornoaccess') == 'INACTIVE'){
					     
						?>
						<p>Your login to <?php echo trim($title);?> has been suspended.  If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
					<br>
					<p>- <?php echo trim($title);?> Team</p>
					<?php }else if($this->session->userdata('reasonfornoaccess') == 'REJECTED'){?>
						<p>We were unable to confirm your registration information.  If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
					<br>
					<p>- <?php echo trim($title);?> Team</p>
					<?php }else if($this->session->userdata('reasonfornoaccess') == 'TOKENEXPIRED'){?>
				      <p>The page you are looking for is no longer available or has timed out. Please <a href="<?php echo base_url('user/index');?>">click here</a> to go to the home page. If the error persists, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
				     <br>
					<p>- <?php echo trim($title);?> Team</p>
				     <?php }else if($this->session->userdata('reasonfornoaccess') == 'STORMPATHERROR'){?>
				      <p>Sorry for inconvenience. If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
				     <br>
					<p>- <?php echo trim($title);?> Team</p>
				     <?php }else if($this->session->userdata('reasonfornoaccess') == 'VERIFICATIONERROR'){?>
				     <p><span class="">Sorry, there was an error while verifying your account</span></p>
				     <p><span>Please try again by clicking on the verification link that was sent to your email address.</span></p>
				     <p><span>If you continue to have problems you may need to </span><a href="<?php echo base_url('user/index');?>">register</a><span> again.</span>
				     <p>Sorry for inconvenience. If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
				     <br>
					<p>- <?php echo trim($title);?> Team</p>
				     <?php }else{?>
				     	<p>Sorry for inconvenience. If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
				     <br>
					<p>- <?php echo trim($title);?> Team</p>
				     <?php 
					}
					
					$this->session->sess_destroy ('reasonfornoaccess');
					
					?>
					</div>
				
				</div>
				</div></div>

	<div class="col-md-2"></div>
</div>

