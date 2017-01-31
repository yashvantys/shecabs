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
                $this->add_library ( "datatables" );
		$this->add_js_functions ( array ('Drivers.home' => array ()) );
		
		//$this->data['driverslist'] = $response = $this->drivers_model->getDriverList ();
	
		$this->template->write_view ( 'content', 'drivers/list', $this->data );
	
		$this->template->render ();
	
	}
        
        
        /**
	 |--------------------------------------------------------------------------
	 | Drivers Management list Page
	 |--------------------------------------------------------------------------
	 | Method Name:  list_ajax
	 | Parameters:  null
	 | Return Type:  null
	 | Description:  This is the default method of this controller and it will be called if no methods
	 | are passed.  As a default method,  this method is used to display Driver Management screen.
	 |
	 */
	
	public function list_ajax(){
		$result = array ();
		
		// get values from POST
		$start = $this->input->post ( "start" ,TRUE);
		$limit = $this->input->post ( "length" ,TRUE );
		$sort_column_index = $this->input->post ( "order" ,TRUE )[0]['column'];
		$sort_column = $this->input->post ( "columns",TRUE )[$sort_column_index]['data'];
		$direction = $this->input->post ( "order" ,TRUE)[0]['dir'];
		$search = $this->input->post ( "search" ,TRUE)['value'];
		$result ['draw'] = $this->input->post ( "draw" ,TRUE);
		$data = array ();
		
				
		
				
		$response = $this->drivers_model->getDriverList ( );
		
		if (! empty ( $response )) {
				$i=1;
					foreach ( $response->result as $driverlist ) {
						
																									
						$data [] = array (
						"DT_RowId" => 'row_'.$i,
						"email" => $driverlist->email,
						"id" => $driverlist->id,
						"name" => ucwords($driverlist->firstName." ".$driverlist->lastName),
                                                "dob" => $driverlist->dob,
                                                "mobileNo" => $driverlist->mobileNo,
                                                "vehicleNo" => $driverlist->vehicleNo
                                                    
                                                    
                                                    
						
						
						
				);
				$i++;		
			}
			
			//print_r($data);
			$result ['data'] = $data;
		} else {
			$result ['error'] = "There is an unexpected error";
		}
	
		print json_output ( $result );
	
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