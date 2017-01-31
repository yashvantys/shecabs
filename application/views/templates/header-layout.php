<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title><?php echo $this->config->item('site_name'); ?></title>

		<meta name="description" content="overview &amp; stats" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

		<!-- bootstrap & fontawesome -->
		<link rel="stylesheet" href="<?php  echo  asset_url()?>css/bootstrap.min.css" />
		<link rel="stylesheet" href="<?php  echo  asset_url()?>font-awesome/4.5.0/css/font-awesome.min.css" />

		<!-- page specific plugin styles -->

		<!-- text fonts -->
		<link rel="stylesheet" href="<?php  echo  asset_url()?>css/fonts.googleapis.com.css" />

		<!-- ace styles -->
		<link rel="stylesheet" href="<?php  echo  asset_url()?>css/ace.min.css"/>

		<!--[if lte IE 9]>
			<link rel="stylesheet" href="<?php  echo  asset_url()?>css/ace-part2.min.css" class="ace-main-stylesheet" />
		<![endif]-->
		<link rel="stylesheet" href="<?php  echo  asset_url()?>css/ace-skins.min.css" />
		<link rel="stylesheet" href="<?php  echo  asset_url()?>css/ace-rtl.min.css" />
		<!-- Auto include of required css -->	
		<?php if(isset($css_files)):?>  
			<?php foreach ($css_files as $file):?>
				<?php if(!empty($file)):?>
					<link href="<?php print   asset_url().$file ?>" rel="stylesheet"
			type="text/css" /><?php print "\n"  ?>
				<?php endif;?>
			<?php endforeach; ?>
		<?php endif;?>

		<!--[if lte IE 9]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->
		<script src="<?php  echo  asset_url()?>js/ace-extra.min.js"></script>

		<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

		<!--[if lte IE 8]>
		<script src="assets/js/html5shiv.min.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
	</head>
	<?php
	
	$logged_in = $this->session->userdata ( 'logged_in' );
	//print_r($this->session->userdata ( ));
		
	$body_classes = "";
	  if($logged_in):
			$body_classes .= " no-skin";
		else:
			$body_classes .= " login-layout";
		endif;
	
	?>

	<body class="<?php echo $body_classes;?>">
	<?php if($logged_in):?>
		<div id="navbar" class="navbar navbar-default          ace-save-state">
			<div class="navbar-container ace-save-state" id="navbar-container">
				<button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar">
					<span class="sr-only">Toggle sidebar</span>

					<span class="icon-bar"></span>

					<span class="icon-bar"></span>

					<span class="icon-bar"></span>
				</button>

				<div class="navbar-header pull-left">
					<a href="<?php echo base_url();?>" class="navbar-brand">
						<small>
							<i class="fa fa-leaf"></i>
							<?php echo $this->config->item('site_name'); ?> Admin
						</small>
					</a>
				</div>

				<div class="navbar-buttons navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">
						<li class="light-blue dropdown-modal">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
								<img class="nav-user-photo" src="<?php  echo  asset_url()?>images/avatars/avatar2.png" alt="Jason's Photo" />
								<span class="user-info">
									<?php echo $this->session->userdata ( 'uname' );?>
								</span>

								<i class="ace-icon fa fa-caret-down"></i>
							</a>

							<ul class="user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li>
									<a href="#">
										<i class="ace-icon fa fa-user"></i>
										Profile
									</a>
								</li>

								<li class="divider"></li>

								<li>
									<a href="<?php echo base_url('user/logout');?>">
										<i class="ace-icon fa fa-power-off"></i>
										Logout
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div><!-- /.navbar-container -->
		</div>
<?php endif;?>
		<div class="main-container ace-save-state" id="main-container">
			<script type="text/javascript">
				try{ace.settings.loadState('main-container')}catch(e){}
			</script>
    <?php if($logged_in):?>
			<div id="sidebar" class="sidebar responsive ace-save-state">
				<script type="text/javascript">
					try{ace.settings.loadState('sidebar')}catch(e){}
				</script>

				<div class="sidebar-shortcuts" id="sidebar-shortcuts">
					<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
						<button class="btn btn-success">
							<i class="ace-icon fa fa-signal"></i>
						</button>

						<button class="btn btn-info">
							<i class="ace-icon fa fa-pencil"></i>
						</button>

						<button class="btn btn-warning">
							<i class="ace-icon fa fa-users"></i>
						</button>

						<button class="btn btn-danger">
							<i class="ace-icon fa fa-cogs"></i>
						</button>
					</div>

					<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
						<span class="btn btn-success"></span>

						<span class="btn btn-info"></span>

						<span class="btn btn-warning"></span>

						<span class="btn btn-danger"></span>
					</div>
				</div><!-- /.sidebar-shortcuts -->

				<ul class="nav nav-list">
					<li class="active">
						<a href="#">
							<i class="menu-icon fa fa-tachometer"></i>
							<span class="menu-text"> Dashboard </span>
						</a>

						<b class="arrow"></b>
					</li>

					<li class="">
					<a href="<?php echo base_url('users/list');?>">
					<i class="menu-icon fa fa-list-alt"></i>
					<span class="menu-text"> Users </span></a>
					<b class="arrow"></b>
					</li>
					<li class="">
					<a href="<?php echo base_url('drivers/list');?>">
					<i class="menu-icon fa fa-list"></i>
					<span class="menu-text"> Drivers </span></a>
					<b class="arrow"></b>
					</li>
					
					<li class="">
					<a href="<?php echo base_url('promocode/list');?>">
					<i class="menu-icon fa fa-list"></i>
					<span class="menu-text"> Promocode </span></a>
					<b class="arrow"></b>
					</li>
	
					
				</ul><!-- /.nav-list -->

				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i id="sidebar-toggle-icon" class="ace-icon fa fa-angle-double-left ace-save-state" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>
			</div><?php endif;?>
	