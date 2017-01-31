<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Drivers_Model extends CI_Model {
	public static $SERVICE_DRIVER_LIST = 'driver/list';
	public static $SERVICE_DRIVER_REGISTRATION = 'driver/registration';
	public static $SERVICE_DRIVER_ACTIVE = 'driver/driverStatus';
	
	
	/**
	 * Method Name:  getDriverList
	 * Parameteres:  
	 * Return Type:  array
	 *
	 * Description:  This method is used to get drivers list.
	 *
	 * */
	
	public function getDriverList(){
		$result = array ();
	
	
		$service_url = "{$this::$SERVICE_DRIVER_LIST}";
	
	
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
	 * Description: This method is used to update ftp configuration and return status.
	 */
	public function saveUpdateDetails($data) {
		return $this->service->post ( $this::$SERVICE_DRIVER_REGISTRATION, array (
				'content-type' => 'application/json' 
		), array (), json_encode ( $data ) );
	}
	
	/**
	 * Method Name: Active/inactive
	 * Parameters: array
	 * ReturnType: String
	 *
	 * Description: This method is used to enable/disable drivers and return status.
	 */
	public function activedrivers($driverid) {
		$params = array (
				'driverId ' => $driverid
				
		);
		// $service_url = "{$this::$SERVICE_FTP_ACCESS_DELETE}{$ftp_id}";
		$service_url = "{$this::$SERVICE_DRIVER_ACTIVE}";
		
		return $this->service->post ( $service_url, array (
				'content-type' => 'application/json'
		), array (), json_encode ( $params ) );
	}
}