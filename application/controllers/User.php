<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class User extends SV_Controller {
	
	
	public function __construct() {
		parent::__construct ();
		$this->data = array ();
		$this->load->model ( "user_model" );
		$this->load->library('session');
		
		
		
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey Authenticate 
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Authenticate path.
	 |
	 */
	public function authenticate($client_id, $module, $sub_module = null) {
		
		$session_id = $this->input->get ( "sessionId" );
		$user = $this->user_model->validateFromCMSSessionID ( $session_id );
		if (empty ( $user )) {
			// That means this user is not authenticated. Just return them to somewhere else
		} else {
			
			$this->session->set_userdata ( array (
					"email" => $user ['email'],
					"name" => $user ['name'],
					"session_id" => $session_id,
					"logged_in" => true 
			) );
			
			$previous_url = $this->session->flashdata ( 'previous_url' );
			if (! empty ( $previous_url )) {
				redirect ( $previous_url, 'location' );
			} else {
				if (! in_array ( $client_id, array (
						"admin",
						"ng" 
				) )) {
					redirect ( base_url ( "redirect/module/{$client_id}/{$module}" . (! empty ( $sub_module ) ? "/{$sub_module}" : "") ), 'location' );
				}
			}
		}
		redirect ( base_url ( "survey/home" ), 'location' );
	}
	
	
	
	public function index(){
		if (! empty ( $this->session->userdata ( 'logged_in' ) )) {
		
			redirect ( base_url ( "user/dashboard" ), 'location' );
		}
	   $this->data = array();
	
		$this->template->write_view ( 'content', 'user/login', $this->data );
		
		$this->template->render ();
				
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey Login
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Login path.
	 |
	 */
	public function login($mode = null) {
		
		$data = array();
		$loginContent = array();
		$resultData = array();
		$ClientData = array();
		$session_id = $this->input->get ( "sessionId" );
		$username = $this->input->post ( "username" ,TRUE);
		$password = $this->input->post ( "password" ,TRUE);
		
		
				
		// Login check
		if (! empty ( $this->session->userdata ( 'logged_in' ) )) {
		
			redirect ( base_url ( "user/dashboard" ), 'location' );
		}
		else {
			
			$response = $this->user_model->authenticate($username,$password);
			
							
		if (isset ( $response ) && $response->message == 'Success' && $response->code == 200 ) {
			
			//print_r($response);exit;
			$login_as = $response->result->email;
			$userId = $response->result->id;
			$name = $response->result->firstName." ".$response->result->lastName;
			
			//print_r($name);exit;
			$this->session->set_userdata ( array (
						"email" => ! empty ( $login_as ) ? $login_as : $login_as,
						"uname" => $name,
						"logged_in" => true,
						'userId'=> $userId
						
				) );
			redirect ( base_url ( "user/dashboard" ), 'location' );
		
				
					
			}else{
				$this->session->sess_destroy ();
				redirect ( base_url ( "user/index" ), 'location' );
			}
		}
	}
	
	public function dashboard(){
		if (! empty ( $this->session->userdata ( 'logged_in' ) )) {
		
			//redirect ( base_url ( "user/dashboard" ), 'location' );
		}
		$this->data = array();
		
		
		
		$this->template->write_view ( 'content', 'user/dashboard', $this->data );
		
		$this->template->render ();
	}
	
	
	
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey Login affiliated
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Login affiliated token path.
	 |
	 */
	public function login_affiliated($token) {
		$data = json_decode ( base64url_decode ( $token ), true );
		$this->session->set_userdata ( 'affiliatedToken', $token );
		redirect ( 'affiliated/' . $data ['clientId'] . '/home/' . $data ['token'], 'location' );
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey affiliated home
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey affiliated home path.
	 |
	 */
	public function affiliated_home() {
		if (empty ( $this->session->userdata ( 'affiliatedToken' ) )) {
			show_404 ();
		}
		// Login check
		$this->data ['logged_in'] = false;
		if (! empty ( $this->session->userdata ( 'logged_in' ) )) {
			$this->data ['logged_in'] = true;
		}
		$this->data ['affiliated_token'] = json_decode ( base64url_decode ( $this->session->userdata ( 'affiliatedToken' ) ), true );
		$this->template->write_view ( 'content', 'user/affiliated-home', $this->data );
		$this->template->render ();
	}
	
		
	/*
	 |--------------------------------------------------------------------------
	 | Survey Reset Password
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Reset Password path.
	 |
	 */
	public function reset_password_info($code) {
		$this->data ['userName'] = base64url_decode ( $code );
		$this->template->write_view ( 'content', 'user/reset-password-info', $this->data );
		$this->template->render ();
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey Reset ValidateUserKey
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Reset ValidateUserKey path.
	 |
	 */
	public function reset($user, $key) {
		// Login check
		if (! empty ( $this->session->userdata ( 'logged_in' ) )) {
			redirect ( base_url ( "survey/home" ), 'location' );
		}
		// Js
		$this->add_js_functions ( array (
				'User.loadChangePassword' => array () 
		) );
		$data = $this->user_model->resetValidateUserKey ( $user, $key );
		if (! empty ( $data->status->code ) && $data->status->code == 200) {
			$this->data ['reset_validate_status'] = true;
		} else {
			$this->data ['reset_validate_status'] = false;
		}
		if ($this->input->post ()) {
			$this->load->library ( 'form_validation' );
			$this->form_validation->set_rules ( 'password', 'Password', 'trim|required|xss_clean' );
			if ($this->form_validation->run () == TRUE) {
				$data = $this->user_model->changePassword ( $this->input->post () );
				if (! empty ( $data->status->code ) && $data->status->code == "200") {
					$this->set_message ( "Successfully changed your password.", 'success', false );
					redirect ( base_url ( "user/login" ), 'location' );
				} else {
					$this->set_message ( (! empty ( $data->status->message ) ? $data->status->message : "Something went wrong. Please try again later!"), 'error', false );
				}
			} else {
				$this->set_message ( validation_errors (), 'error' );
			}
		}
		$this->data ['user_hash'] = $user;
		$this->data ['user_key'] = $key;
		$this->template->write_view ( 'content', 'user/reset-password', $this->data );
		$this->template->render ();
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey Account Activate
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Account Activate path.
	 |
	 */
	public function activate($user, $key) {
		// Login check
		if (! empty ( $this->session->userdata ( 'logged_in' ) )) {
			redirect ( base_url ( "survey/home" ), 'location' );
		}
		// Js
		$this->add_js_functions ( array (
				'User.loadChangePassword' => array () 
		) );
		$data = $this->user_model->validateUserKey ( $user, $key );
		if (! empty ( $data->status->code ) && $data->status->code == 200) {
			$this->data ['reset_validate_status'] = true;
		} else {
			$this->data ['reset_validate_status'] = false;
		}
		if ($this->input->post ()) {
			$this->load->library ( 'form_validation' );
			$this->form_validation->set_rules ( 'password', 'Password', 'trim|required|xss_clean' );
			if ($this->form_validation->run () == TRUE) {
				$data = $this->user_model->changePassword ( $this->input->post () );
				if (! empty ( $data->status->code ) && $data->status->code == "200") {
					$this->set_message ( "Successfully changed your password.", 'success', false );
					redirect ( base_url ( "user/login" ), 'location' );
				} else {
					$this->set_message ( (! empty ( $data->status->message ) ? $data->status->message : "Something went wrong. Please try again later!"), 'error', false );
				}
			} else {
				$this->set_message ( validation_errors (), 'error' );
			}
		}
		$this->data ['user_hash'] = $user;
		$this->data ['user_key'] = $key;
		$this->template->write_view ( 'content', 'user/reset-password', $this->data );
		$this->template->render ();
	}
	
	
	/*
	 |--------------------------------------------------------------------------
	 | Survey Account (Individual/Multiple)
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Logout path.
	 |
	 */
	public function sign_up($client_id) {
		
	/*	if ($type == 'individual') {
			$this->data ['title'] = 'Individual Physician Sign Up';
			$this->template->write ( 'page_title',  $this->data ['title']);
		} else {
			$this->data ['title'] = 'Administrator Sign Up of Multiple Physicians';
			$this->template->write ( 'page_title', $this->data ['title'] );
		}*/
			
		$this->data ['form'] = $this->user_model->signUpForm ( $client_id  );
		//$this->data['type'] = $type;
		$this->template->write_view ( 'content', 'survey/sign-up', $this->data );
		$this->template->render ();
	}
	/*
	 |--------------------------------------------------------------------------
	 | Survey Logout
	 |--------------------------------------------------------------------------
	 |
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Survey Logout path.
	 |
	 */
	public function logout() {
						
		$this->session->sess_destroy ();
		
		redirect ( base_url ( "user/index" ), 'location' );
			
		
				
		
	}
	public function keep_alive() {
		$json = array ();
		$json ["email"] = $this->session->userdata ['email'];
		print json_output ( $json );
	}
	
	public function error() {
		
		$sanitizedUrl = null;
		$validatedUrl = null;
		
		$reasonfornoaccess = $this->security->xss_clean($this->input->get ( "reasonfornoaccess" ,true));
		
		$sso_username = $this->input->get ( "username" ,true);
		$sso_rejectreason = $this->input->get ( "rejectreason" ,true);
		
				
		if ( ! empty($_SERVER['HTTPS']))
			$sslVal = 'https';
			else
				$sslVal = 'http';
					
		
		$this->session->set_userdata ( array (
				"sso_uname" => $sso_username,
				"sso_rejectreason" => $sso_rejectreason,
				'reasonfornoaccess'=> $reasonfornoaccess
		) );
		
		
		
		\Stormpath\Client::$apiKeyProperties = "apiKey.id=".$this->config->item('stormpath_apiKey_id')."\napiKey.secret=".$this->config->item('stormpath_apiKey_secret');
		//$client = Stormpath\Client::getInstance();
		$application = Stormpath\Resource\Application::get($this->config->item('stormpath_application_api'));
			
				
		$url = $application->createIdSiteUrl(['logout'=>true,'callbackUri'=>$this->config->item('stormpathcallback_logouturl_notapproved'),'state'=>array('origDomain'=>$sslVal.'://'.$_SERVER['HTTP_HOST'],'Authorization' =>  $this->session->userdata ('accessToken'),'email' => $this->session->userdata ('email'))]);
		
		//Validating and Sanitizing the URL
		$sanitizedUrl = filter_var($url, FILTER_SANITIZE_URL);
		if(!empty($sanitizedUrl))
		{
			$validatedUrl = filter_var($sanitizedUrl, FILTER_VALIDATE_URL);
			if(!empty($validatedUrl))
			{
				redirect($validatedUrl, 'location');
			}
		}
					
	
	}
	
   public function noaccess() {
   	  
		$returnArr = $this->user_model->setVendorData();
		$this->data ['message'] = 'Invalid user';
		$this->template->write_view ( 'content', 'user/error', $this->data );
		$this->template->render ();
	
	}
	
	public function verify() {
		$verification = $this->input->get ( "reasonfornoaccess" ,true);
		if($verification == 'VERIFICATIONSUCCESS'){
			$returnArr = $this->user_model->setVendorData();
			$this->data ['message'] = 'Invalid user';
			$this->template->write_view ( 'content', 'user/verify', $this->data );
			$this->template->render ();
		}else{
			redirect ( base_url ( "user/index" ), 'location' );
		}
	}
	
	
}
