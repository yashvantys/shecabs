<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
/**
 * bfountain library to setup standard js or css libraries.
 * This returns the respective include files as a set of array.
 * Enable the libraries in required pages.
 * -return array of js and css for each library. return blank array to skip.
 */
class Assets {
	protected $CI;
	public function __construct($config = array()) {
		$this->CI = & get_instance ();
	}
	public function get_asset_url() {
		return asset_url ();
	}
	public function get_select2() {
		$css = array (
				'global/plugins/bootstrap/css/select2.css' 
		);
		$js = array (
				'global/plugins/bootstrap/js/select2.min.js' 
		);
		$init = array (
				'Custom.init_select2' => array () 
		);
		return array (
				'css' => $css,
				'js' => $js,
				'init' => $init 
		);
	}
	
	public function get_select1() {
		$css = array (
				'global/plugins/bootstrap/css/select2old.css'
		);
		$js = array (
				'global/plugins/bootstrap/js/select2old.min.js'
		);
		$init = array (
				'Custom.init_select2' => array ()
		);
		return array (
				'css' => $css,
				'js' => $js,
				'init' => $init
		);
	}
	
	public function get_slimscroll() {
		return array (
			'js' => 'global/plugins/jquery/jquery.slimscroll.min.js'	
		);
		
	}
	
public function get_date() {
		$css = array (
				'global/plugins/bootstrap/css/datepicker.css',
				'global/plugins/bootstrap/css/bootstrap-timepicker.min.css'
		);
		$js = array (
				'global/plugins/bootstrap/js/bootstrap-datepicker.min.js',
				'global/plugins/bootstrap/js/bootstrap-timepicker.min.js'
				 
		);
		$init = array (
				'Custom.init_datepicker' => array () 
		);
		return array (
				'css' => $css,
				'js' => $js,
				'init' => $init 
		);
	}
	
	public function get_datetime() {
		$css = array (
				'global/plugins/bootstrap/css/bootstrap-datetimepicker.css'
		);
		$js = array (
				'global/plugins/bootstrap/js/moment.js',
				'global/plugins/bootstrap/js/bootstrap-datetimepicker.min.js'
			
		);
		$init = array (
				'Custom.init_datetimepicker' => array ()
		);
		return array (
				'css' => $css,
				'js' => $js,
				'init' => $init
		);
	}
	
	public function get_custom() {
		$js = array (
				'scripts/custom.js' 
		);
		return array (
				'js' => $js 
		);
	}
	
	public function get_login_notification() {
		$js = array (
				'global/plugins/bootstrap/js/ui-bootstrap-growl.min.js',
				'global/plugins/bootstrap/js/jquery.bootstrap-growl.min.js'
		);
		return array (
				'js' => $js
		);
	}
	
	
	
	public function get_ftpaccess() {
		$path = "custom/ftpaccess";
		return array (
				'title' => 'FTP Access Assets',
				'js' => array (
						$path . '/js/ftpaccess.js'
				),
				'css' => array (
						$path . '/css/ftpaccess.css'
				)
		);
	}
	
	public function get_acknowledge() {
		$path = "custom/survey";
		return array (
				'title' => 'survey Access Assets',
				'js' => array (
						$path . '/js/acknowledge.js'
				),
				
				'css' => array (
						$path . '/css/survey.css'
				)
		);
	}
	
	public function get_datamodel() {
		$path = "custom/datamodel";
		return array (
				'title' => 'Data model',
				'js' => array (
						$path . '/js/datamodel.js'
				),
	
				'css' => array (
						$path . '/css/datamodel.css'
				)
		);
	}
	
	public function get_datafeed() {
		$path = "custom/datafeed";
		return array (
				'title' => 'Data Feed',
				'js' => array (
						$path . '/js/datafeed.js'
				),
	
				'css' => array (
						$path . '/css/datafeed.css'
				)
		);
	}
	
	public function get_history() {
		$path = "custom/history";
		return array (
				'title' => 'Import History Assets',
				'js' => array (
						$path . '/js/history.js'
				),
				'css' => array (
						$path . '/css/history.css'
				)
		);
	}
	
	public function get_reportshistory() {
		$path = "custom/reportshistory";
		return array (
				'title' => 'Reportshistory Assets',
	
				'js' => array (
						$path . '/js/reportshistory.js'
						//$path . '/js/jquery.json-viewer.js'
				),
				'css' => array (
						$path . '/css/reports.css'
						//$path . '/css/jquery.json-viewer.css'
				)
		);
	}
	
	
	public function get_synclog() {
		$path = "custom/synclog";
		return array (
				'title' => 'syncronize logs Assets',
				'js' => array (
						$path . '/js/synclog.js'
				),
				'css' => array (
						$path . '/css/synclog.css'
				)
		);
	}
	
	
	public function get_survey() {
		$css = array (
				'custom/survey/css/survey.css',
				'custom/survey/slide/css/jquerysctipttop.css',
				'custom/survey/slide/dist/candlestick.min.css'
		);
		$js = array (
				'custom/survey/js/survey.js',
				'custom/survey/js/physician.js'/*,
				'custom/survey/slide/js/jquery-1.11.3.min.js'*/,
				'custom/survey/slide/dist/candlestick.min.js',
				'custom/survey/cssselector/css_browser_selector.js'
		);
		$init = array (
				
		);
		return array (
				'css' => $css,
				'js' => $js,
				'init' => $init
		);
	}
	
	public function get_multiselect() {
		return array (
				"js" => array (
						"libraries/multi-select/bootstrap-multiselect.js",
				),
				"css" => array (
						"libraries/multi-select/bootstrap-multiselect.css",
				)
		);
	}
	
	public function get_reports_multiselect() {
		return array (
				"js" => array (
						"libraries/multi-select/bootstrap-multiselect.js",
						"libraries/multi-select/multi-select-custom.js"
				),
				"css" => array (
						"libraries/multi-select/bootstrap-multiselect.css",
						"libraries/multi-select/custom-multi-select.css"
				)
		);
	}
	public function get_api() {
		$path = "custom/api";
		return array (
				'title' => 'Api Library',
				'js' => array (
						'embed/js/bfSocial.js',
						$path . '/js/api.js' 
				),
				'css' => array (
						"css/custom/api.css",
						$path . '/css/apicustom.css'
				) ,
				'init' => array (
						 
				) 
		);
	}
	
	public function get_lazy_load() {
		return array (
				"js" => array (
						"libraries/lazy_load/jquery.lazyload.js" 
				) 
		);
	}
	
	public function get_fusioncharts() {
		return array (
				"js" => array (
						"libraries/fusioncharts/fusioncharts.js",
						"libraries/fusioncharts/fusioncharts.charts.js",
						"libraries/fusioncharts/fusioncharts.powercharts.js",
						"libraries/fusioncharts/fusioncharts.jqueryplugin.js",
						"libraries/fusioncharts/themes/fusioncharts.theme.zune.js"
				) 
		);
	}
	
	public function get_jasperreports() {
		return array (
				"js" => array (
						"global/plugins/jasperreports/visualize.js"
					)
		);
	}		
	
	public function get_jqgrid() {
		return array (
				"js" => array (
						"global/plugins/jquery.jqGrid.min.js"
				),
				"css" => array (
						"global/css/ui.jqgrid.css",
						"global/css/ui.jqgrid-bootstarp.css"
				) 
		);
	}
	
	public function get_datatables() {
		return array (
				"js" => array (
						"global/plugins/datatables/media/js/jquery.dataTables.min.js",
						"global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"
				),
				"css" => array (
						"global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"
				)
		);
	}
	
	public function get_angularjs() {
		return array (
				"js" => array (
						
						/*"global/plugins/angularjs/angular.min.js",*/
						"global/plugins/angularjs/angular.js"
						/*"global/plugins/angularjs/angular-route.min.js"*/
						
				)
				
		);
	}
	
	public function get_bootstrap_editable() {
		return array (
				"js" => array (
						"global/plugins/bootstrap/js/bootstrap-editable.min.js" 
				),
				"css" => array (
						"global/plugins/bootstrap/css/bootstrap-editable.css"
				)
		);
	}
	
	public function get_bootstrap_file_upload() {
		return array (
				"js" => array (
						"global/plugins/bootstrap/js/bootstrap-fileupload.js"
				),
				"css" => array (
						"global/plugins/bootstrap/css/bootstrap-fileupload.css"
				)
		);
	}
	
	public function get_bootstrap_toggle() {
		return array (
				"js" => array (
						"global/plugins/bootstrap/js/bootstrap-toggle.js"
				),
				"css" => array (
						"global/plugins/bootstrap/css/bootstrap-toggle.css"
				)
		);
	}
	
	public function get_datatables_resize(){
		return array (
				"js" => array (
						"global/plugins/datatables/media/js/ColReorderWithResize.js"
				) 
		);
	}
	
	public function get_email_campaign() {
		$path = "custom/email-campaign";
		return array (
				'title' => 'Campaign Library',
				'website' => 'http://pylit.in',
				'js' => array (
						'scripts/jquery.tinysort.js',
						$path . '/js/jquery-ui-timepicker-addon.js',
						$path . '/js/email-campaign.js' 
				),
				
				// 'version' => '1.0',
				'css' => array (
						$path . '/css/jquery-ui-timepicker-addon.css',
						$path . '/css/email-campaign.css' 
				) 
		);
	}
	public function get_support() {
		$path = "custom/support";
		return array (
				'title' => 'Campaign Library',
				'website' => 'http://pylit.in',
				'js' => array (
						'scripts/jquery.tinysort.js',
						$path . '/js/jquery-ui-timepicker-addon.js',
						$path . '/js/support.js'
				),
	
				// 'version' => '1.0',
				'css' => array (
						$path . '/css/jquery-ui-timepicker-addon.css',
						$path . '/css/support.css'
				)
		);
	}
	public function get_announcement() {
		$path = "custom/announcement";
		return array (
				'title' => 'Campaign Library',
				'website' => 'http://pylit.in',
				'js' => array (
						'scripts/jquery.tinysort.js',
						$path . '/js/jquery-ui-timepicker-addon.js',
						$path . '/js/announcement.js'
				),
	
				// 'version' => '1.0',
				'css' => array (
						$path . '/css/jquery-ui-timepicker-addon.css',
						$path . '/css/support.css'
				)
		);
	}
	public function get_super_campaign() {
		$path = "custom/super-campaign";
		return array (
				'title' => 'Super Campaign Library',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/super-campaign.js' 
				),
				'css' => array (
						$path . '/css/super-campaign.css' 
				) 
		);
	}
	public function get_email_template() {
		$path = "custom/email-template";
		return array (
				'title' => 'Email Template Library',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/email-template.js' 
				),
				
				// 'version' => '1.0',
				'css' => array (
						$path . '/css/email-template.css' 
				) 
		);
	}
	public function get_support_template() {
		$path = "custom/support-template";
		return array (
				'title' => 'Support Template Library',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/support-template.js'
				),
	
				// 'version' => '1.0',
				'css' => array (
						$path . '/css/email-template.css'
				)
		);
	}
	public function get_psi() {
		$path = "custom/psi";
		return array (
				'title' => 'PSI Library',
				'website' => 'http://xtreemsolutions.com',
				'js' => array (
						$path . '/js/psi.js' 
				),
				
				// 'version' => '1.0',
				'css' => array (
						$path . '/css/psi.css' 
				) 
		);
	}
	public function get_tinymce() {
		$path = "libraries/tinymce";
		return array (
				'title' => 'TinyMCE Library',
				'website' => 'http://www.tinymce.com/',
				'js' => array (
						$path . '/tinymce.min.js' 
				),
				'css' => array () 
		);
	}
	public function get_fullcalendar() {
		$path = "custom/fullcalendar";
		return array (
				'title' => 'FullCalendar',
				'website' => 'http://arshaw.com/fullcalendar',
				'js' => array (
						$path . '/fullcalendar.min.js',
						$path . '/gcal.js',
						$path . '/date.js' 
				),
				'version' => '1.2',
				'css' => array (
						$path . '/fullcalendar.css' 
				) 
		);
	}
	public function get_wordcloud() {
		return array (
				"js" => array (
						"libraries/tagcloud/hcahps.js",
						"libraries/tagcloud/tagcloud.jquery.js" 
				) 
		);
	}
	
	public function get_administration() {
		$path = "custom/admin";
		return array (
				'title' => 'Administration Assets',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/admin.js'
				),
				'css' => array (
						$path . '/css/admin.css'
				)
		);
	}
	
	public function get_users() {
		$path = "custom/users";
		return array (
				'title' => 'User Mangement Assets',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/users.js'
						
				),
				'css' => array (
						$path . '/css/users.css'
						
				)
		);
	}
	
	public function get_clientcat() {
		$path = "custom/vendor";
		return array (
				'title' => 'vendor Mangement Assets',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/clientcat.js'
				),
				'css' => array (
						$path . '/css/clientcat.css'
				)
		);
	}
	///////////Release Notes/////////////
	public function get_releasenotes() {
		$path = "custom/releasenotes";
		return array (
				'title' => 'Release Notes Assets',
				//'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/releasenotes.js'
				),
				'css' => array (
						$path . '/css/releasenotes.css'
				)
		);
	}
	public function get_verification() {
		$path = "custom/verification";
		return array (
				'title' => 'Verification Assets',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/verification.js'
				),
				'css' => array (
						$path . '/css/verification.css'
				)
		);
	}
	public function get_affiliated() {
		$path = "custom/affiliated";
		return array (
				'title' => 'Affiliated Assets',
				'website' => 'http://grapesme.com',
				'js' => array (
						$path . '/js/affiliated.js'
				),
				'css' => array (
						$path . '/css/affiliated.css'
				)
		);
	}
	
	public function get_sumoselect() {
		return array (
				"js" => array (
						"libraries/sumoselect/jquery.sumoselect.js",
				),
				"css" => array (
						"libraries/sumoselect/sumoselect.css",
				)
		);
	}
	
	public function get_management_reports() {
		$path = "custom/management";
		return array (
				'title' => 'Management Reports Assets',
				'website' => 'http://grapesme.com',
				'js' => array (
						$path . '/js/reports.js'
				),
				'css' => array (
						$path . '/css/reports.css'
				)
		);
	}
	
	public function get_reports() {
		$path = "custom/reports";
		return array (
				'title' => 'Reports Assets',
				
				'js' => array (
						$path . '/js/reports.js'
				),
				'css' => array (
						$path . '/css/reports.css'
				)
		);
	}
	
	
	public function get_entity() {
		$path = "custom/entity";
		return array (
				'title' => 'Entity Assets',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/entity.js'
				)
		);
	}
	public function get_datatables_buttons(){
		return array (
				"js" => array (
						"global/plugins/datatables/media/js/table-datatables-buttons.min.js",
						"global/plugins/datatables/media/js/buttons.bootstrap.min.js"
				),
				"css" => array(
						"global/plugins/datatables/media/css/buttons.dataTables.min.css"
				)
		);
	}
	public function get_payment() {
		$path = "custom/payment";
		return array (
				"title" => "Payment Assets",
				"website" => "http://pylit.in",
				"js" => array (
						"global/plugins/jquery-validation/js/jquery.validate.js",
						$path ."/js/jquery.creditCardValidator.js",
						$path . "/js/payment.js" 
				),
				"css" => array (
						$path . "/css/payment.css" 
				) 
		);
	}

	public function get_loadalerts() {
		$path = "custom/loadalerts";
		return array (
				'title' => 'Load Alerts',
				'website' => 'http://pylit.in',
				'js' => array (
						$path . '/js/loadalerts.js'
				),
				'css' => array ()
		);
	}		

	public function get_maskedinput() {
		return array (
				"js" => array (
						"global/plugins/jquery-maskedinput/jquery.maskedinput.min.js"
				)
		);
	}
	
	public function get_order() {
		$path = "custom/order";
		return array (
				'title' => 'Order Assets',
				'website' => 'http://grapesme.com',
				'js' => array (
						$path . '/js/order.js'
				),
				'css' => array (
						$path . '/css/order.css'
				)
		);
	}
	public function get_passwordstrength() {
		$path = "custom/passwordstrength";
		return array (
				'title' => 'Password Strength Assets',
				'website' => 'http://grapesme.com',
				'js' => array (
						$path . '/js/pwstrength-bootstrap.min.js',
						$path . '/js/password.strength.js',
				),
				'css' => array (
						$path . '/css/password-custom.css'
				)
		);
	}
	public function get_validations() {
		return array (
				"js" => array (
						"global/plugins/jquery-validation/js/jquery.validate.js",
						"global/plugins/jquery-validation/js/additional-methods.min.js",
				)
				/*"css" => array (
				 "global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"
				)*/
		);
	}
	public function get_blockUI() {
		return array (
				"js" => array (
						"custom/survey/js/blockUI.js",
				)
				/*"css" => array (
				 "global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"
				)*/
		);
	}
	
	public function get_treeview() {
		return array (
				"js" => array (
						"global/plugins/treeview/js/bootstrap-gtreetable.js",
				),
				"css" => array (
						"global/plugins/treeview/css/bootstrap-gtreetable.css"
				)
		);
	}
	
	public function get_ckeditor() {
		return array (
				"js" => array (
						"global/plugins/ckeditor/ckeditor.js",
				),
				"css" => array ( ) 
		);
	}
	
	public function get_emailcampaign() {
		$path = "custom/email-campaign";
		return array (
				'title' => 'Email Campaign Assets',
				'js' => array (
						$path . '/js/email.js'
				),
				'css' => array (
						$path . '/css/email.css'
				)
		);
	}
	
	public function get_survey_essentials() {
		$survey_path = "custom/surveyapp";
		return array (
				'title' => 'Survey Library',
				'website' => 'http://pylit.in',
				'js' => array (
						$survey_path . '/js/jquery.ui.touch-punch.min.js',
						$survey_path . '/js/jquery.jqtransform.js',
						$survey_path . '/js/selectToUISlider.jQuery.js',
						$survey_path . "/js/jquery.validate.js",
						$survey_path . "/js/additional-methods.js",
						$survey_path . '/js/surveyapp.js'
				),
				'version' => '2.21',
				'css' => array (
						$survey_path . '/css/skins/all.css',
						$survey_path . '/css/jqtransform.css',
						$survey_path . '/css/ui.slider.extras.css',
						$survey_path . '/css/survey.css'
				),
				'dependencies' => array (
						array (
								'system',
								'jquery.form'
						),
						array (
								'system',
								'ui.slider'
						),
						array (
								'system',
								'ui.widget'
						),
						array (
								'system',
								'ui.button'
						),
						array (
								'system',
								'ui.position'
						),
						array (
								'system',
								'ui.autocomplete'
						),
						array (
								'survey',
								'jquery.validation'
						),
						array (
								'survey',
								'jquery.chosen_input'
						)
				)
		);
	}
	
	
	
}
