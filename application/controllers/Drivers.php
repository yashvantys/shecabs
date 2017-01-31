<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Drivers extends Authentication_Controller {
	
	
	public function __construct() {
		parent::__construct ();
		$this->data = array ();
		$this->load->model ( "drivers_model" );
		
		
		
	}
	
	public function driverslist(){
		
		$this->data = array();
		$this->add_library ( "drivers" );
		$this->add_js_functions ( array ('Drivers.home' => array ()) );
		
		$this->data['driverslist'] = $response = $this->drivers_model->getDriverList ();
	
		$this->template->write_view ( 'content', 'drivers/list', $this->data );
	
		$this->template->render ();
	
	}
	
	public function add(){
	
		$postData = array ();
		if ($this->input->post ()) {
			$postData['firstName'] = $this->input->post ( "firstname" ,TRUE);
			$postData['lastName'] = $this->input->post ( "lastname" ,TRUE);
			$postData['mobileNo'] = $this->input->post ( "mobile" ,TRUE);
			$postData['email'] = $this->input->post ( "email" ,TRUE);
			$postData['dob'] = $this->input->post ( "dob" ,TRUE);
			$postData['gender'] = $this->input->post ( "gender" ,TRUE);
			$postData['password'] = $this->input->post ( "password" ,TRUE);
			$postData['cabType'] = $this->input->post ( "cabtype" ,TRUE);
			$postData['vehicleNo'] = $this->input->post ( "vehicleNo" ,TRUE);
			$postData['licenseId'] = $this->input->post ( "licenseId" ,TRUE);
			$postData['location'] = $this->input->post ( "location" ,TRUE);
			$postData['status'] = 1;
			
			$savedDetail = $this->drivers_model->saveUpdateDetails ($postData);
				
							
			if (isset ( $savedDetail ) && $savedDetail->message == 'Success' &&
					$savedDetail->code == 200 ) {
						
						redirect ( base_url ( "drivers/list" ), 'location' );
						
					}
		}
		
	
	}
	
}