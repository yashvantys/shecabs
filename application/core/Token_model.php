<?php

if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class Token_model extends Service_Model {
	function __construct() {
		parent::__construct ();
		// For create access token url
		$this->createAccessTokenUrl = 'admin/service/v1/token/create?';
		
		// appId
		$this->appId = '030604523870516';// '632688107090756';
		
		// appSecret
		$this->appSecret = 'c45c1131-5662-46be-a7b7-ebd0b2f0091e';// '2ffe8173-8e70-49dd-b861-86b60533b86d';
		
		// check access token is set or not
// 		$this->checkAccessToken ();
	}
	
	/**
	 * Function createAccessToken allows to create access for using the PSI API.
	 *
	 * @param JModelLegacy $model
	 *        	The data model object.
	 * @param array $validData
	 *        	The validated data.
	 *        	
	 * @return access token response
	 *        
	 */
	function createAccessToken() {
		$param = array ();
		$data = array ();
		
		$param [] = $this->config->item ( 'super_user' );
		;
		$param [] = $this->createAccessTokenUrl;
		
		$data ['appId'] = $this->appId;
		$data ['appSecret'] = $this->appSecret;
		
		$response = $this->service->post ( $this->createAccessTokenUrl, array (), $param, $data );
		
		if (isset ( $response->status->code ) && $response->status->code == 200) {
			// set access token in session
			$this->session->set_userdata ( 'accessToken', $response->accessToken );
			// set expires time in session
			$this->session->set_userdata ( 'expiresIn', $response->expiresIn );
		}
		
		return $response;
	}
	
	/**
	 *
	 * Function checkAccessToken used for check the token is expired or not in PSI API.
	 *
	 * @return accessToken;
	 *
	 */
	function checkAccessToken() {
		if ($this->session->userdata ( 'accessToken' ) && strtotime ( $this->session->userdata ( 'expiresIn' ) ) > time ()) {
			return true;
		} else {
			$this->createAccessToken ();
		}
	}
}