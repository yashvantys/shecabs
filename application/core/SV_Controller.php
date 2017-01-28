<?php
class SV_Controller extends CI_Controller {
	
	public $asset_url;
	public $javascript_files = array ();
	public $css_files = array ();
	public $libraries = array ();
	protected $js_functions = array ();
	protected $email, $client, $industry_id, $page;
	protected $avatar_id = 0;
	protected $data = array ();
	public $logged_in = false;
	public $is_admin = false;
	public $sv_service_external_request = false;
	public $service_exception_status = false;
	
	public function __construct() {
		parent::__construct ();
		$this->asset_url = asset_url ();
		date_default_timezone_set ( 'UTC' );
		ini_set ( 'memory_limit', '-1' );
		
		$this->javascript_files = array ();
		
		$this->load->vars ( array (
				'javascript_files' => $this->javascript_files,
				"css_files" => $this->css_files,
				"js_functions" => $this->js_functions,
				"asset_url" => $this->asset_url,
				"libraries" => $this->libraries,
				"client_id" => &$this->client,
				"avatar_id" => &$this->avatar_id,
				'show_header' => true,
				'show_logo' => true,
				'show_title' =>true,
				"provider_code" => null,
				"logged_in" => false
				
		) );
		
		// This settings not working from here so change done in system/core/Cache.php protected vars
		
		$this->load->driver ( 'cache', array (
				'adapter' => 'memcached',
				'backup' => 'file',
				'key_prefix' => $this->config->item("memcache_key_prefix") 
		) );
		$this->load->model ( "user_model" );
		$this->load->model ( "client_model" );
		$this->load->model ( "avatar_model" );
		$this->add_library ( "custom" );
		$this->load->helper("theme_helper");
	}
	
	public function isLogin() {
		if (! empty ( $this->session->userdata ['logged_in'] )) {
			return true;
		}
		return false;
	}
	
	public function isAdmin() {
		if (! empty ( $this->session->userdata ['logged_in'] ) && $this->config->item ( 'super_user' ) == $this->session->userdata ['email']) {
			return true;
		}
		return false;
	}
	
	public function orderCount ( $email ) {
		//return $this->payment_model->getUserPaymentsCount ($email);
	}
	
	/**
	 * Load the modules which current logged in user has permission
	 */
	protected function __loadUserModules() {
		$user_modules = array ();
		
		if ($this->logged_in) {
			$this->breadcrumbs->pop("/");
			$this->breadcrumbs->push ( 'Home', 'home/'.$this->getClientId(), '<i class="fa fa-home"></i> ' );
			$available_modules = $this->config->item ( 'modules' );
			$sub_menus = $this->subMenu ();
			foreach ( $available_modules as $module ) {
				if (! empty ( $module ['clientFeatures'] )) {
					$client_config = $this->client_model->getClientConfig ( $this->client );
					foreach ( $module ['clientFeatures'] as $feature => $value ) {
						if (empty ( $client_config [$feature] ) || $client_config [$feature] != $value) {
							continue 2;
						}
					}
				}
				if (! empty ( $module ['permission'] ) && $this->user_model->hasPermission ( $this->client, $this->email, $module ['module'], $module ['permission'] )) {
					$menu = array ();
					if (! empty ( $sub_menus ['permission'] ) && $sub_menus ['permission'] == $module ['permission']) {
						// that means this page has some submenu.
						foreach ( $sub_menus ['menu'] as $menu_item ) {
							if (! empty ( $menu_item ['permission'] ) && ! $this->user_model->hasPermission ( $this->client, $this->email, $menu_item ['module'], $menu_item ['permission'] )) {
								continue;
							}
							$menu [] = $menu_item;
						}
					}
					$module ['sub_menu'] = $menu;
					
					$user_modules [] = $module;
				}else if (! empty ( $module ['permission'] ) &&  in_array( $module ['permission'], array("SupportPage"))){
					$user_modules [] = $module;
				}
			}
		}
		$this->load->vars ( array (
				'user_modules' => $user_modules 
		) );
	}
	
	protected function add_JS($path) {
		$javascript = $this->load->get_var ( 'javascript_files' );
		$javascript [] = $path;
		$this->load->vars ( array (
				"javascript_files" => $javascript 
		) );
	}
	protected function add_js_functions($initmethod) {
		$javascript = $this->load->get_var ( 'js_functions' );
		$javascript [] = $initmethod;
		$this->load->vars ( array (
				"js_functions" => $javascript 
		) );
	}
	protected function add_library($library) {
		/* add js and css as required */
		$this->load->library ( 'assets' );
		if (method_exists ( $this->assets, 'get_' . $library )) {
			$libdata = $this->assets->{'get_' . $library} ();
			
			$libs = $this->load->get_var ( 'libraries' );
			if (! array_search ( $library, $libs )) {
				$libs [] = $library;
			}
			$argument = "";
			if (! empty ( $libdata ['version'] )) {
				$argument .= "?v=" . $libdata ['version'];
			}
			
			if (! empty ( $libdata ['js'] )) {
				foreach ( $libdata ['js'] as $libjs ) {
					$this->add_JS ( "{$libjs}{$argument}" );
				}
			}
			
			if (! empty ( $libdata ['css'] )) {
				foreach ( $libdata ['css'] as $libcss ) {
					$this->add_CSS ( "{$libcss}{$argument}" );
				}
			}
			
			if (! empty ( $libdata ['init'] )) {
				$this->add_js_functions ( $libdata ['init'] );
			}
			
			$this->load->vars ( array (
					"libraries" => $libs 
			) );
		}
	}
	protected function showLoader() {
		$this->add_js_functions ( array (
				'Metronic.blockUI' => array (
						'{ target: \'.main-content\',animate: true,overlayColor: \'none\'}' 
				) 
		) );
		// for closing loader Metronic.unblockUI('.page-content'); must be called from page script
	}
	protected function add_CSS($path) {
		$javascript = $this->load->get_var ( 'css_files' );
		$javascript [] = $path;
		$this->load->vars ( array (
				"css_files" => $javascript 
		) );
	}
	public function getEmail() {
		return $this->email;
	}
	public function getSuperUser() {
		return $this->config->item ( 'super_user' );
	}
	/**
	 * Returns the current client ID
	 */
	public function getClientId() {
		return $this->client;
	}
	protected function setCLientId($client_id) {
		$this->client = $client_id;
		$client_details = $this->client_model->getDetails ( $client_id);
		$this->industry_id = $client_details['INDUSTRY_ID'];
		$this->load->vars ( array (
				'client_id' => $client_id,
				'industry_id' => $this->industry_id 
		) );
		// SET the Top avatar of this client too
		
		$top_avatar = $this->avatar_model->getTopAvatar ( $this->getClientId (), $this->getEmail () );
		$this->setAvatarId ( $top_avatar );
		$this->__loadUserModules ();
	}
	public function getAvatarId() {
		return $this->avatar_id;
	}
	protected function setAvatarId($avatar_id) {
		$this->avatar_id = $avatar_id;
		$this->load->vars ( array (
				'avatar_id' => $avatar_id 
		) );
		// Set the avatar details from here
		$this->load->model ( "avatar_model" );
		$avatar_details = $this->avatar_model->getDetails ( $this->getClientId (), $avatar_id );
		if (! empty ( $avatar_details )) {
			if (! empty ( $avatar_details->PERSON )) {
				$this->load->vars ( array (
						'client_avatar_details' => $avatar_details->PERSON 
				) );
			} else {
				
				$this->load->vars ( array (
						'client_avatar_details' => $avatar_details->LOCATION 
				) );
			}
		}
		// Brand avatar details
		$brand_avatar_id = $this->avatar_model->getTopAvatar ( $this->getClientId (), $this->getSuperUser() );
		$brand_avatar_details = $this->avatar_model->getDetails ( $this->getClientId (), $brand_avatar_id );
		if (! empty ( $brand_avatar_details )) {
			if (! empty ( $brand_avatar_details->PERSON )) {
				$this->load->vars ( array (
						'client_brand_avatar_details' => $brand_avatar_details->PERSON
				) );
			} else {
		
				$this->load->vars ( array (
						'client_brand_avatar_details' => $brand_avatar_details->LOCATION
				) );
			}
		}
	}
	/**
	 * A function to set client is exists in the url.
	 * If not found, then this function will throw show_404()
	 * If found it will set the top avatar too
	 *
	 * @param number $uri_segment
	 *        	Default value is 2
	 *        	
	 */
	protected function isExistsThenSetClient($uri_segment = 2) {
		
		
		if ($this->uri->segment ( $uri_segment )) {
		
			$client_details = $this->client_model->getDetails ( $this->uri->segment ( $uri_segment ) );
					
			if (! empty ( $client_details )) {
				$this->setCLientId ( $this->uri->segment ( $uri_segment ) );
			} else {
				return show_404 ();
			}
		} else {
			return show_404 ();
		}
	}
	
	/**
	 * A function to set the avatar id from URL.
	 * Call this function only after setting Client isExistsThenSetClient()
	 *
	 * @param number $uri_segment
	 *        	Default value is 3
	 */
	protected function isExistsThenSetAvatar($uri_segment = 3) {
		if ($this->uri->segment ( $uri_segment ) && ! empty ( $this->getClientId () )) {
			$this->load->model ( "avatar_model" );
			$avatar_details = $this->avatar_model->getDetails ( $this->getClientId (), $this->uri->segment ( $uri_segment ) );
			if (! empty ( $avatar_details )) {
				$this->setAvatarId ( $avatar_details->ID );
			}
		}
	}
	/**
	 * Sets a message which reflects the status of the performed operation.
	 *
	 * If the function is called with no arguments, this function returns all set
	 * messages without clearing them.
	 *
	 * @param $message The
	 *        	message to be displayed to the user. For consistency with other
	 *        	messages, it should begin with a capital letter and end with a period.
	 * @param $type The
	 *        	type of the message. One of the following values are possible:
	 *        	- 'success'
	 *        	- 'warning'
	 *        	- 'error'
	 *        	- 'info'
	 * @param $repeat If
	 *        	this is FALSE and the message is already set, then the message won't be repeated.
	 */
	public function set_message($message, $type = 'info', $repeat = true) {
		$messages = $this->session->flashdata ( 'messages' );
		if (! isset ( $messages [$type] )) {
			$messages [$type] = array ();
		}
		
		if ($repeat || ! in_array ( $message, $messages [$type] )) {
			$messages [$type] [] = $message;
		}
		$this->session->set_flashdata ( 'messages', $messages );
		// Messages not set when DB connection fails.
		return isset ( $_SESSION ['messages'] ) ? $_SESSION ['messages'] : NULL;
	}
	protected function subMenu() {
	}
}
