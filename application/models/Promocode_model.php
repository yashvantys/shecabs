<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Promocode_Model extends CI_Model {
	public static $SERVICE_PROMOCODE_LIST = '/promocode/list';
	public static $SERVICE_PROMOCODE_CREATE = '/promocode/create';
	
		
	
	
	/**
	 * Method Name:  getPromocodeList
	 * Parameteres:
	 * Return Type:  array
	 *
	 * Description:  This method is used to get drivers list.
	 *
	 * */
	
	public function getPromocodeList(){
		$result = array ();
	
	
		$service_url = "{$this::$SERVICE_PROMOCODE_LIST}";
	
	
		$data = $this->service->get ( $service_url, array (
		), array () );
	
			
			
		if ($data->code == 200) {
			$result = $data;
		}
	
	
		//print_r($result);
	
		return $result;
	
	
	}
	
	/**
	 * Method Name: saveUpdateDetails
	 * Parameters: array
	 * ReturnType: String
	 *
	 * Description: This method is used to create promocode and return status.
	 */
	public function saveUpdateDetails($data) {
		return $this->service->post ( $this::$SERVICE_PROMOCODE_CREATE, array (
				'content-type' => 'application/json'
		), array (), json_encode ( $data ) );
	}
	
}