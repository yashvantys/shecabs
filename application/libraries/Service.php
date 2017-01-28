<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class Service {
	/**
	 *
	 * @param string $service_path
	 *        	: remote path. server and protocol prefix not needed,it is used from config
	 * @param array $credentials
	 *        	: rest custom header for authentication
	 * @param array $params
	 *        	: get params as associative array
	 * @param boolean $json_array
	 *        	: force return value as array
	 * @return object/array formatted content based on content type
	 */
	public function get($service_path, $credentials = array(), $params = array(), $json_array = false) {
		$result = array ();
		$repeat_count = 0;
		
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config' );
		
			
		$CI->rest->initialize ( array (
				'server' => $server ['server'],
				//'http_user' => $server ['serverUser'],
				//'http_pass' => $server ['serverPass']
		) );
		
		if (!empty($credentials ['Access-Token'])) {
			$CI->rest->http_header ( 'Access-Token: ' . $credentials ['Access-Token'] );
			log_message ( "service", "GET: Set token in header as {$credentials ['Access-Token']}" );
		} else if (! empty ( $CI->session->userdata ['accessToken'] ) && empty($server ['serverAuth'] )) {
  			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
		
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
		if (! empty ( $credentials ['Authorization'] )) {
			$CI->rest->http_header ( 'Authorization: ' . $credentials ['Authorization'] );
		}
		
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 * 
		 * Added Date:  March 03 2016
		 * 
		 */
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			if(!empty($params) && is_array($params))
			{
				$params = $params + array('access_token' => $CI->session->userdata ['accessToken']);
			}
			else
			{
				$params = array('access_token' => $CI->session->userdata ['accessToken']);
			}
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
		
			
		
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
		$CI->rest->setJsonArray ( $json_array );
		
		$retry_count = 3;
		if(isset($credentials["retry"]) && $credentials["retry"] == false) {
			$retry_count = 1;
		}
		
		while ( $repeat_count < $retry_count ) {
			log_message ( "service", "GET: Start of $service_url : Repeat count = $repeat_count" );
			
			$result = $CI->rest->get ( $service_url, array () );
			
			if ($CI->rest->status () == 200) {
				break;
			}
			$repeat_count ++;
		}
		
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
		
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
		
		if($CI->rest->status () === 401)
		{
			redirect ( base_url ( "user/logout" ) );
		}
		else if ($CI->rest->status () != 200) {
			
			$CI->service_exception_status = true;
			if ($CI->sv_service_external_request) {
				throw new Exception ( "Internal Server Error", 404 );
			}
			
			log_message ( "error", "GET: Service error for - $service_url" );
			$CI->template->write ( 'page_error', 'Error accessing remote service.' );
			$CI->template->set_master_template ( "templates/page_500" );
		}
		
		log_message ( "service", "GET: End of $service_url" );
		return $result;
	}
	
	/**
	 *
	 * @param unknown $server
	 *        	array(
	 *        	'server' => $server ['server'],
	 *        	'http_user' => $server ['serverUser'],
	 *        	'http_pass' => $server ['serverPass'],
	 *        	'http_auth' => $server ['serverAuth']
	 *        	)
	 * @param unknown $uri        	
	 * @param unknown $headers
	 *        	as key value pairs
	 * @param unknown $params        	
	 * @param string $json_array        	
	 * @return unknown
	 */
	public function callExternalService($server = array(), $uri, $headers = array(), $params = array(), $json_array = false) {
		$result = array ();
		$CI = & get_instance ();
		
		$CI->rest->initialize ( $server );
		
		foreach ( $headers as $key => $value ) {
			$CI->rest->http_header ( "{$key}:{$value}" );
		}
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $uri, $params );
		} else {
			$service_url = $uri;
		}
		$CI->rest->setJsonArray ( $json_array );
		$result = $CI->rest->get ( $service_url, array () );
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
		
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
		if($CI->rest->status () === 401)
		{
			redirect ( base_url ( "user/logout" ) );
		}
		else if ($CI->rest->status () != 200) {
			$CI->template->write ( 'page_error', 'Error accessing remote service.' );
			$CI->template->set_master_template ( "templates/page_500" );
		}
		
		return $result;
	}
	
	/**
	 *
	 * @param unknown $server
	 *        	array(
	 *        	'server' => $server ['server'],
	 *        	'http_user' => $server ['serverUser'],
	 *        	'http_pass' => $server ['serverPass'],
	 *        	'http_auth' => $server ['serverAuth']
	 *        	)
	 * @param unknown $uri
	 * @param unknown $headers
	 *        	as key value pairs
	 * @param unknown $params
	 * @param string $json_array
	 * @return unknown
	 */
	public function postToExternalService($server = array(), $uri, $headers = array(), $params = array(), $post_data, $json_array = false) {
		$result = array ();
		
		$CI = & get_instance ();
		$authPlain = $CI->config->item ( 'authorizationplain' );
		
		$CI->rest->initialize ( $server );
		
		foreach ( $headers as $key => $value ) {
			$CI->rest->http_header ( "{$key}:{$value}" );
		}
		
		// Authorization
		if (! empty ( $headers ['authorization'] )) {
			$CI->rest->http_header ( 'Authorization: ' . $headers ['authorization'] );
		}
		
		// Content Type
		if (! empty ( $headers ['content-type'] )) {
			$CI->rest->http_header ( 'Content-Type: ' . $headers ['content-type'] );
			if ($headers ['content-type'] != 'application/x-www-form-urlencoded') {
				$CI->rest->http_header ( 'Content-Length: ' . strlen ( $post_data ) );
			}
		}
		
		// Query Params
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $uri, $params );
		} else {
			$service_url = $uri;
		}
		
		// Json status set
		$CI->rest->setJsonArray ( $json_array );
		
		log_message ( "service", "POST: Start of $service_url" );
		$result = $CI->rest->post ( $service_url, $post_data );
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
		
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
		
		log_message ( "service", json_encode ( $post_data ) );
		log_message ( "service", "POST: End of $service_url" );
		
		return $result;
	}
	
	function build_url($url, $params) {
		$query = http_build_query ( $params, null, '&' );
		$param_string = preg_replace ( '/%5B(?:[0-9]|[1-9][0-9]+)%5D=/', '=', $query );
		
		return $url . '?' . $param_string;
	}
	
	/**
	 *
	 * @param unknown $server
	 *        	array(
	 *        	'server' => $server ['server'],
	 *        	'http_user' => $server ['serverUser'],
	 *        	'http_pass' => $server ['serverPass'],
	 *        	'http_auth' => $server ['serverAuth']
	 *        	)
	 * @param unknown $uri
	 * @param unknown $headers
	 *        	as key value pairs
	 * @param unknown $params
	 * @param string $json_array
	 * @return unknown
	 */
	public function post($service_path, $credentials = array(), $params = array(), $post_data, $json_array = false, $options = array()) {
		$result = array ();
		
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config' );
		
		$CI->rest->initialize ( array (
				'server' => (empty($options['postToTask'])) ? $server ['server'] : $server ['task_server'],
				//'http_user' => $server ['serverUser'],
				//'http_pass' => $server ['serverPass'],
				//'http_auth' => $server ['serverAuth'] 
		) );
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "POST: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
		
		if (! empty ( $credentials ['content-type'] )) {
			$CI->rest->http_header ( 'Content-Type: ' . $credentials ['content-type'] );
			if ($credentials ['content-type'] != 'application/x-www-form-urlencoded') {
				$CI->rest->http_header ( 'Content-Length: ' . strlen ( $post_data ) );
			}
		}
		
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 *
		 * Added Date:  March 03 2016
		 *
		 */
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$params = array('access_token' => $CI->session->userdata ['accessToken']);
			
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
		
		
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
	//print_r($service_path);exit;
		
		$CI->rest->setJsonArray ( $json_array );
		log_message ( "service", "POST: Start of $service_url" );
		$result = $CI->rest->post ( $service_url, $post_data );
			
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
		
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
		
		log_message ( "service", json_encode ( $post_data ) );
		log_message ( "service", "POST: End of $service_url" );
		return $result;
	}
	
	public function postSurvey($service_path, $credentials = array(), $params = array(), $post_data, $json_array = false, $options = array()) {
		$result = array ();
	
				
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config_survey' );
				
		
		$CI->rest->initialize ( array (
				'server' => (empty($options['postToTask'])) ? $server ['server'] : $server ['task_server'],
				'http_user' => $server ['serverUser'],
				'http_pass' => $server ['serverPass'],
				//'http_auth' => $server ['serverAuth']
		) );
		
		
		// get access token
		
		$service_url_main = 'survey-compass/surveyoauth/token';
		
		$sessionarray= array();
		$params1 = array (
				"grant_type" => "password",
				"app_id" => $CI->config->item ('survey_app_id'),
				"app_secret" => $CI->config->item ('survey_app_secret'),
				"username" => $CI->config->item ('survey_username'),
				"password" => $CI->config->item ('survey_password')
				
		);
		
		// Service url to remove the %s specified in the content
		$service_url = sprintf($service_url_main, $params1);
		
				
		//Post the authentication parameters information to the Server.
		$data = $this->postDataToServer($service_url,$params1);
		
		
		if (! empty ( $data['access_token'] )) {
			// For Session Regeneration
			$CI->session->sess_regenerate(TRUE);
			// For success case
			$CI->session->set_userdata ( array (
					"accessToken" => $data['access_token'],
					
			) );
		}	
		
			
		
		
			
		
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "POST: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		
		
		
		/*if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
		*/
		
		//print_r($CI->session->userdata ['accessToken']);
		
							
		if (! empty ( $credentials ['content-type'] )) {
			$CI->rest->http_header ( 'Content-Type: ' . $credentials ['content-type'] );
			if ($credentials ['content-type'] != 'application/x-www-form-urlencoded') {
				$CI->rest->http_header ( 'Content-Length: ' . strlen ( $post_data ) );
			}
		}
		
	
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 *
		 * Added Date:  March 03 2016
		 *
		 */
		
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$params = array('access_token' => $CI->session->userdata ['accessToken']);
				
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
	
		
		
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
		$CI->rest->setJsonArray ( $json_array );
		log_message ( "service", "POST: Start of $service_url" );
		
		$result = $CI->rest->post ( $service_url, $post_data );
				
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
	
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
	
		log_message ( "service", json_encode ( $post_data ) );
		log_message ( "service", "POST: End of $service_url" );
		
		
		return $result;
	}
	
	public function postnew($service_path, $credentials = array(), $params = array(), $post_data, $json_array = false, $options = array()) {
		$result = array ();
	
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config_survey' );
	
		$CI->rest->initialize ( array (
				'server' => (empty($options['postToTask'])) ? $server ['server'] : $server ['task_server'],
				'http_user' => $server ['serverUser'],
				'http_pass' => $server ['serverPass'],
				//'http_auth' => $server ['serverAuth']
		) );
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "POST: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
	
		if (! empty ( $credentials ['content-type'] )) {
			$CI->rest->http_header ( 'Content-Type: ' . $credentials ['content-type'] );
			if ($credentials ['content-type'] != 'application/x-www-form-urlencoded') {
				$CI->rest->http_header ( 'Content-Length: ' . strlen ( $post_data ) );
			}
		}
	
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 *
		 * Added Date:  March 03 2016
		 *
		 */
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$params = array('access_token' => $CI->session->userdata ['accessToken']);
				
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
	
	
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
		$CI->rest->setJsonArray ( $json_array );
		log_message ( "service", "POST: Start of $service_url" );
		$result = $CI->rest->post ( $service_url, $post_data );
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
	
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
	
		log_message ( "service", json_encode ( $post_data ) );
		log_message ( "service", "POST: End of $service_url" );
		return $result;
	}
	
	
	private function postDatatoServer($serverUri , $paramArray = array())
	{
		//Array(s) declaration for further use.
		$data = array();
	
		//Getting the Location(s) List information of a Source from Server.
		$data = $this->postnew ( $serverUri , array (	'content-type' => 'application/x-www-form-urlencoded' ),  array(), $paramArray, true, array());
	
		return $data;
	}
	
	
	
	public function getexcel($service_path, $credentials = array(), $params = array(), $json_array = false) {
		$result = array ();
		$repeat_count = 0;
	
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config_excel' );
	
			
		$CI->rest->initialize ( array (
				'server' => $server ['server'],
				'http_user' => $server ['serverUser'],
				'http_pass' => $server ['serverPass']
		) );
	
		if (! empty ( $CI->session->userdata ['accessToken'] ) && empty($server ['serverAuth'] )) {
			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
		if (! empty ( $credentials ['Authorization'] )) {
			$CI->rest->http_header ( 'Authorization: ' . $credentials ['Authorization'] );
		}
	
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 *
		 * Added Date:  March 03 2016
		 *
		 */
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			if(!empty($params) && is_array($params))
			{
				$params = $params + array('access_token' => $CI->session->userdata ['accessToken']);
			}
			else
			{
				$params = array('access_token' => $CI->session->userdata ['accessToken']);
			}
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
	
			
	
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
		$CI->rest->setJsonArray ( $json_array );
	
		$retry_count = 3;
		if(isset($credentials["retry"]) && $credentials["retry"] == false) {
			$retry_count = 1;
		}
	
		while ( $repeat_count < $retry_count ) {
			log_message ( "service", "GET: Start of $service_url : Repeat count = $repeat_count" );
				
			$result = $CI->rest->get ( $service_url, array () );
				
			if ($CI->rest->status () == 200) {
				break;
			}
			$repeat_count ++;
		}
	
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
	
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
	
		if($CI->rest->status () === 401)
		{
			redirect ( base_url ( "user/logout" ) );
		}
		else if ($CI->rest->status () != 200) {
				
			$CI->service_exception_status = true;
			if ($CI->sv_service_external_request) {
				throw new Exception ( "Internal Server Error", 404 );
			}
				
			log_message ( "error", "GET: Service error for - $service_url" );
			$CI->template->write ( 'page_error', 'Error accessing remote service.' );
			$CI->template->set_master_template ( "templates/page_500" );
		}
	
		log_message ( "service", "GET: End of $service_url" );
		return $result;
	}
	
	public function getapi($service_path, $credentials = array(), $params = array(), $json_array = false) {
		$result = array ();
		$repeat_count = 0;
	
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config_api' );
	
			
		$CI->rest->initialize ( array (
				'server' => $server ['server'],
				'http_user' => $server ['serverUser'],
				'http_pass' => $server ['serverPass']
		) );
	
		if (!empty($credentials ['Access-Token'])) {
			$CI->rest->http_header ( 'Access-Token: ' . $credentials ['Access-Token'] );
			log_message ( "service", "GET: Set token in header as {$credentials ['Access-Token']}" );
		} else if (! empty ( $CI->session->userdata ['accessToken'] ) && empty($server ['serverAuth'] )) {
			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
	
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
		if (! empty ( $credentials ['Authorization'] )) {
			$CI->rest->http_header ( 'Authorization: ' . $credentials ['Authorization'] );
		}
	
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 *
		 * Added Date:  March 03 2016
		 *
		 */
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			if(!empty($params) && is_array($params))
			{
				$params = $params + array('access_token' => $CI->session->userdata ['accessToken']);
			}
			else
			{
				$params = array('access_token' => $CI->session->userdata ['accessToken']);
			}
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
	
			
	
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
		$CI->rest->setJsonArray ( $json_array );
	
		$retry_count = 3;
		if(isset($credentials["retry"]) && $credentials["retry"] == false) {
			$retry_count = 1;
		}
	
		while ( $repeat_count < $retry_count ) {
			log_message ( "service", "GET: Start of $service_url : Repeat count = $repeat_count" );
				
			$result = $CI->rest->get ( $service_url, array () );
				
			if ($CI->rest->status () == 200) {
				break;
			}
			$repeat_count ++;
		}
	
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
	
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
	
		if($CI->rest->status () === 401)
		{
			redirect ( base_url ( "user/logout" ) );
		}
		else if ($CI->rest->status () != 200) {
				
			$CI->service_exception_status = true;
			if ($CI->sv_service_external_request) {
				throw new Exception ( "Internal Server Error", 404 );
			}
				
			log_message ( "error", "GET: Service error for - $service_url" );
			$CI->template->write ( 'page_error', 'Error accessing remote service.' );
			$CI->template->set_master_template ( "templates/page_500" );
		}
	
		log_message ( "service", "GET: End of $service_url" );
		return $result;
	}
	
	/**
	 *
	 * @param unknown $server
	 *        	array(
	 *        	'server' => $server ['server'],
	 *        	'http_user' => $server ['serverUser'],
	 *        	'http_pass' => $server ['serverPass'],
	 *        	'http_auth' => $server ['serverAuth']
	 *        	)
	 * @param unknown $uri
	 * @param unknown $headers
	 *        	as key value pairs
	 * @param unknown $params
	 * @param string $json_array
	 * @return unknown
	 */
	public function postapi($service_path, $credentials = array(), $params = array(), $post_data, $json_array = false, $options = array()) {
		$result = array ();
	
		$CI = & get_instance ();
		//$authPlain = $CI->config->item ( 'authorizationplain' );
		$server = $CI->config->item ( 'service_config_api' );
	
		$CI->rest->initialize ( array (
				'server' => (empty($options['postToTask'])) ? $server ['server'] : $server ['task_server'],
				'http_user' => $server ['serverUser'],
				'http_pass' => $server ['serverPass'],
				//'http_auth' => $server ['serverAuth']
		) );
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$CI->rest->http_header ( 'accessToken: ' . $CI->session->userdata ['accessToken'] );
			log_message ( "service", "POST: Set token in header as {$CI->session->userdata ['accessToken']}" );
		} else {
			$CI->rest->http_header ( $server ['auth_plain'] );
		}
		if (! empty ( $credentials ['email'] )) {
			$CI->rest->http_header ( 'Email: ' . $credentials ['email'] );
		}
		if (! empty ( $credentials ['token'] )) {
			$CI->rest->http_header ( 'token: ' . $credentials ['token'] );
		}
	
		if (! empty ( $credentials ['content-type'] )) {
			$CI->rest->http_header ( 'Content-Type: ' . $credentials ['content-type'] );
			if ($credentials ['content-type'] != 'application/x-www-form-urlencoded') {
				$CI->rest->http_header ( 'Content-Length: ' . strlen ( $post_data ) );
			}
		}
	
		/*
		 * The Server expects access_token to be sent as a query string parameter.
		 * For that reason,  the accessToken from Session UserData is retrieved and assigned to Param array.
		 * The Param array is the parameter array, from which query string parameters will be prepared in build_url method.
		 *
		 * Added Date:  March 03 2016
		 *
		 */
		if (! empty ( $CI->session->userdata ['accessToken'] )) {
			$params = array('access_token' => $CI->session->userdata ['accessToken']);
				
			log_message ( "service", "GET: Set token in header as {$CI->session->userdata ['accessToken']}" );
		}
	
	
		if (! empty ( $params )) {
			$service_url = $this->build_url ( $service_path, $params );
		} else {
			$service_url = $service_path;
		}
		$CI->rest->setJsonArray ( $json_array );
		log_message ( "service", "POST: Start of $service_url" );
		$result = $CI->rest->post ( $service_url, $post_data );
		$CI->config->load ( 'profiler' );
		$service_debug = $CI->config->item ( 'services' );
	
		if (! empty ( $service_debug )) {
			$service_calls = $CI->config->item ( 'service_calls' );
			$service_calls [] = $CI->rest->debug ();
			$CI->config->set_item ( 'service_calls', $service_calls );
		}
	
		log_message ( "service", json_encode ( $post_data ) );
		log_message ( "service", "POST: End of $service_url" );
		return $result;
	}
	
}
?>