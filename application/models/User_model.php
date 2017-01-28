<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class User_model extends Service_Model {
	
	
	public static $SERVICE_AUTHENTICATION = 'user/login';
	public static $SERVICE_USER_LIST = 'user/list';
	
	
		
	public function __construct() {
		parent::__construct ();
	}
	
	
	/**
	 * Function to return permission for module
	 *
	 * @param unknown $client
	 * @param unknown $email
	 * @param unknown $module
	 * @param unknown $permission
	 * @return <array>
	 */
	public function hasPermission($permission,$data) {
		// get the user permissions
		$userId = $this->session->userdata['userId'];
		$cached_object = $this->config->item ( 'user_permissions' );
		
		if (empty ( $cached_object [$userId] )) {
			
				$cached_object [$userId] = $data;
				$this->config->set_item ( "user_permissions", $cached_object );
			
		}
		
		if (! empty ( $cached_object [$userId] )) {
			
			
			if (in_array($permission,$data)) {
				
				return true;
			}
		}
		return false;
	}
	
		
	/**
	 * Function to return user permission
	 *
	 * @param unknown $client
	 * @param unknown $email
	 * @return <array>
	 */
	public function getUserPermissions() {
		$permissions = array ();
		$permissionArray = array();
		$clientsArray = array();
		$url = "{$this::$SERVICE_SECURITY_ROLES_PERMISSION}";
		$data = $this->service->get ( $url, array ( ) );
		//echo "<pre>";
		//print_r($data->result->uniqueIdForAuditLog);echo "</pre>";exit;
		
				
		if (isset ( $data->statusCode ) && $data->statusCode == 200) {
			
			$permissions['uniqueIdForAuditLog'] = $data->result->uniqueIdForAuditLog;
			$permissions['email'] = $data->result->email;
			// New Permissions
			foreach($data->result->permissions as $key =>$permissionVals){
				$permissionArray[] = $permissionVals->permission;
			}
			
			
						
			foreach($data->result->clients as $key =>$clientVals){
				$clientsArray[] = $clientVals->id;
			}
			
						
			if(empty($this->session->userdata('name')))
			{
		
				$this->session->set_userdata ( array (
						
						"name" => $data->result->loggedInUserName,
						"role" => $data->result->role,
						"userId" =>$data->result->id,
						'uemail'=>$data->result->email,
						'permissions'=>$permissionArray,
						'clients'=>$clientsArray,
						'userlogs'=>$permissions
						
						
				) );
			}
			
					
			
		}
		
	}
	
	/**
	 * Function to return user info
	 *
	 * @param unknown $client        	
	 * @param unknown $email        	
	 * @return <array>
	 */
	
		
	public function getUserInfo($client_id, $email) {
		$data = $this->service->get ( "{$client_id}{$this::$SERVICE_USER_INFORMATION}", array (
				"email" => $email 
		), array (
				"email" => $email 
		) );
		$user_info = "";
		if ($data->status->message == 'Success' && $data->status->code == '200') {
			$user_info = $data->userInfo;
		} else {
			$user_info = "";
		}
		return $user_info;
	}
	
	/**
	 * Function to return user role
	 *
	 * @param unknown $client
	 * @param unknown $email
	 * @return <array>
	 */
	
	
	public function isAdmin($client_id, $email) {
		$user_info = $this->user_model->getUserInfo ( $client_id, $email );
		if (! empty ( $user_info->subscription->roleId ) && $user_info->subscription->roleId == $this::$ADMINISTRATOR) {
			return true;
		}
		return false;
	}
	
	/**
	 * Method Name:  getDataFromServer
	 * Parameters:  ServerUri,  Parameter Array(Note: Number of Parameters can be changed in future).
	 * Return Type:  JSON
	 *
	 * Description:  This method will connect to Server and returns the response as JSON.
	 * Incase,  if an error occurred, while sending the request or in case of any error response.
	 * The reason for not handling the exception here is that this exception has been handled for
	 * GET requests in (/surveyview/applications/libraries/Service.php).
	 *
	 * */
	private function getDataFromServer($serverUri, $paramArray = array())
	{
		//Array(s) declaration for further use.
		$data = array();
	
		//Getting the Location(s) List information of a Source from Server.
		$data = $this->service->post ( $serverUri );
	
		return $data;
	}
	
	/**
	 * Method Name:  getDataFromServer
	 * Parameters:  ServerUri,  Parameter Array(Note: Number of Parameters can be changed in future).
	 * Return Type:  JSON
	 *
	 * Description:  This method will connect to Server and returns the response as JSON.
	 * Incase,  if an error occurred, while sending the request or in case of any error response.
	 * The reason for not handling the exception here is that this exception has been handled for
	 * GET requests in (/surveyview/applications/libraries/Service.php).
	 *
	 * */
	private function postDatatoServer($serverUri , $paramArray = array())
	{
		//Array(s) declaration for further use.
		$data = array();
		
		//Getting the Location(s) List information of a Source from Server.
		$data = $this->service->post ( $serverUri , array (	'content-type' => 'application/x-www-form-urlencoded' ),  array(), $paramArray, true, array());
		
		return $data;
	}
	
	/**
	 * Function to return login user authenticate
	 *
	 * @param unknown $user_name
	 * @param unknown $password
	 * @return <array>
	 */
			
	public function authenticate($user_name, $password, $login_as = null, $remember = false, $options = array()) {
		//parameters for generate the token access 
		
		$sessionarray= array();
		/*$params = array (
				//"grant_type" => "password",
				//"app_id" => "000872847339726",
				//"app_secret" => "surveyapp123",
				"email" => $user_name,
				"password" => $password
				//"appId" => $this->getAppId (),
				//"appSecret" => $this->getAppSecret (),
		);*/
		
		$params = array (
				'email' => $user_name,
				'password' => $password 
		);
		// $service_url = "{$this::$SERVICE_FTP_ACCESS_DELETE}{$ftp_id}";
		$service_url = "{$this::$SERVICE_AUTHENTICATION}";
		
		return $this->service->post ( $service_url, array (
				'content-type' => 'application/json' 
		), array (), json_encode ( $params ) );
		
		// Service url to remove the %s specified in the content
		//$service_url = sprintf($this::$SERVICE_AUTHENTICATION, $params);
		
		//print_r($params);exit;
		
		//Post the authentication parameters information to the Server.
		//$data = $this->postDataToServer($service_url,json_encode($params));
		
		//print_r($data);exit;
				
		/*if (! empty ( $data['access_token'] )) {
			// For Session Regeneration
			$this->session->sess_regenerate(TRUE);
			// For success case
			$this->session->set_userdata ( array (
					"email" => ! empty ( $login_as ) ? $login_as : $user_name,
					//"name" => $user_name,
					"accessToken" => $data['access_token'],
					"logged_in" => true
			) );
			
			
			$sessionemail = $this->session->userdata('email');
			$sessionaccessToken = $this->session->userdata('accessToken');
			$sessionlogged_in = $this->session->userdata('logged_in');
			
			
			$this->getUserPermissions();
			if (! empty ( $remember )) {
				// Nothing needed now
			}
			
			// Settings Cookie for all platforms
			$this->load->library ( "crypt" );
			$value = json_encode ( array (
					"accessToken" => $data['access_token'],
					"ip" => $this->input->ip_address (),
					"browser" => getUserAgent ()->agent
			) );
			
			$key = "1234567891234567";
			$encrypted = $this->crypt->encrypt ( $value, $key );
			$this->input->set_cookie ( 'survey-user', $encrypted, 86500 );
			// End of common cookie
			
			// Previous URL remembering part
			$previous_url = $this->session->userdata ( 'previous_url' );
			$this->session->set_flashdata ( 'messages', null );
			
			redirect ( base_url ( "survey/acknowledge" ), 'location' );
			
			// Need to get this data from service
			$resultData['status']['message'] = 'success';
			$resultData['status']['code'] = 200;
			return $resultData;
		} else {
			// For Errors case
			$resultData['status']['message'] = isset($data['error_description'])?$data['error_description']:
					'There is problem with Login, please contact Administrator';
			$resultData['status']['code'] = 401;
			return $resultData;
		}*/
	}
	
	/**
	 * Method Name:  getUsersList
	 * Parameteres:  clientid
	 * Return Type:  array
	 *
	 * Description:  This method is used to get users list.
	 *
	 * */
	
	public function getUsersList(){
		$result = array ();
	
		
		$service_url = "{$this::$SERVICE_USER_LIST}";
	
	
			$data = $this->service->get ( $service_url, array (
			), array () );
	
			
						 
			if ($data->code == 200) {
				$result = $data;
			}
	
	
			return $result;
	
	
	}
	
	
	/**
	 * Function reset password
	 *
	 * @param unknown $email
	 * @return <array>
	 */
	
	public function forgetPassword($params) {
		
		return $data = $this->service->post ( "admin{$this::$SERVICE_AUTHENTICATION_RESET_PASSWORD}", array (
				'content-type' => 'application/x-www-form-urlencoded' 
		), array (), array (
				"userName" => $params ['email'] 
		) );
	}
	
	/**
	 * Function reset validate key 
	 *
	 * @param unknown $user
	 * @param unknown $key
	 * @return <array>
	 */
	public function resetValidateUserKey($user, $key) {
		return $data = $this->service->post ( "admin{$this::$SERVICE_AUTHENTICATION_RESET_VALIDATE}", array (
				'content-type' => 'application/x-www-form-urlencoded' 
		), array (), array (
				"userName" => $user,
				"key" => $key 
		) );
	}
	/**
	 * Function user validate key
	 *
	 * @param unknown $user
	 * @param unknown $key
	 * @return <array>
	 */
	public function validateUserKey($user, $key) {
		return $data = $this->service->post ( "admin{$this::$SERVICE_AUTHENTICATION_VALIDATE_USER}", array (
				'content-type' => 'application/x-www-form-urlencoded' 
		), array (), array (
				"userName" => $user,
				"key" => $key 
		) );
	}
	
	/**
	 * Function change password
	 *
	 * @param user hash
	 * @param user key
	 * @param password
	 * @return <array>
	 */
	public function changePassword($params) {
		return $this->service->post ( "admin{$this::$SERVICE_AUTHENTICATION_CHANGE_PASSWORD}", array (
				'content-type' => 'application/x-www-form-urlencoded' 
		), array (), array (
				"userName" => $params ['user_hash'],
				"key" => $params ['user_key'],
				"passcode" => $params ['password'] 
		) );
	}
	
	/**
	 * Function return userinfo 
	 *
	 * @param $client_id
	 * @param $email
	 * @return <array>
	 */
		
	public function fetchUserInfoByEmail($client_id, $email) {
		return $this->service->get ( "{$client_id}{$this::$SERVICE_VERIFY_USER}", array (), array (
				"userName" => $email 
		) );
	}
	
	
	/**
	 * new user signup form 
	 *
	 * @param $client_id
	 * ReturnType:  String
	 * Description:  This method is used to generate a form for user signup and returns the prepared form as String. 	
	 */
		
	public function signUpForm($client_id) {
	
		$this->load->helper ( 'form' );
		$this->load->library ( 'form_builder' );
		$form_html = $this->form_builder->open_form ( array (
				'action' => base_url ( "affiliated/{$client_id}/sign-up-submit" ),
				'autocomplete' => 'off',
				'id' => 'signupForm'
	
						) );
		$redirectUrl = "";
		$form = array ();
		$form [] = array (
				'type' => 'hidden',
				'name' => 'client_id',
				'id'=>'client_id',
				'value' => $client_id
		);
	
		$form [] = array (
				'name' => 'first_name',
				'label' => 'First Name',
				'id'=>'first_name',
				'required' => true,
				'class' => 'firstname',
				'block_class' => 'col-md-12',
				'autocomplete' => 'off'
		);
		$form [] = array (
				'name' => 'last_name',
				'label' => 'Last Name',
				'id'=>'last_name',
				'class' => 'lastname',
				'required' => true,
				'block_class' => 'col-md-12',
				'autocomplete' => 'off'
		);
	
		$form [] = array (
				'type' => 'email',
				'name' => 'email',
				'id'=>'email',
				'class' => 'email',
				'label' => 'Email',
				'required' => true,
				'block_class' => 'col-md-12',
				'autocomplete' => 'off'
		);
		$form [] = array (
				'type' => 'email',
				'id'=>'confirm_email',
				'name' => 'confirm_email',
				'class' => 'confirm-email',
				'label' => 'Confirm Email',
				'required' => true,
				'block_class' => 'col-md-12',
				'autocomplete' => 'off'
		);
	
		$form [] = array (
				'name' => 'phone',
				'id' => 'phone',
				'label' => 'Telephone',
				'required' => true,
				'block_class' => 'col-md-12',
				'autocomplete' => 'off'
		);
	
		$form [] = array (
				'type' => 'password',
				'id' => 'password_strength',
				'name' => 'passcode',
				'block_class' => 'col-md-8 col-sm-8',
				'required' => true,
				'class' => 'password',
				'label' => "Password",
				'value' => '',
				'title' => '',
				'autocomplete' => 'off'
		);
	
		$form [] = array (
				'type' => 'password',
				'id' => 'cpass',
				'name' => 'cpass',
				'block_class' => 'col-md-8 col-sm-8',
				'required' => true,
				'class' => 'password',
				'label' => "Confirm Password",
				'value' => '',
				'title' => '',
				"help" => "Password must be at least 8 characters in length.<br/>
Password must contain at least one upper case alphabet, one lower case alphabet, and one numeric character.",
				'autocomplete' => 'off'
		);
	
		$form[] = array(
				'type' => 'checkbox',
				'id' => 'signup_terms_conditions',
				'name' => 'signup_terms_conditions',
				'class' => 'signup_terms_conditions',
				'label' => '',
				'block_class' => 'col-md-12',
				'options' => array(
						"1" => "By creating an account, you agree to the <a data-target='#terms_condition_modal' data-toggle='modal'>Terms & Conditions</a> of our site."
				)
		);
	
		$redirectUrl = base_url ( "user/login" ) ;
		$form[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-12"><div class="row"><div class="col-md-6"><button type="submit"  class="btn orange affiliated_create_account" id="affiliated_create_account" value="Cancel" name="Create Account"> Create Account</button></div><div class="col-md-6"><a type="button" href="'.$redirectUrl.'" block_class="col-md-4" class="default btn grey pull-right" value="Cancel" name="cancel">Cancel</a></div></div></div>'
		);
		$form[] = array(
				'type' => 'html',
				'html' => '</div>'
	
		);
		$form_html .= $this->form_builder->build_form_horizontal ( $form );
		$form_html .= $this->form_builder->close_form ();
		return $form_html;
	}
	

	
	
	
	
	

	
}