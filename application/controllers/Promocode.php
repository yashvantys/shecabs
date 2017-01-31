<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Promocode extends Authentication_Controller {
	
	
	public function __construct() {
		parent::__construct ();
		$this->data = array ();
		$this->load->model ( "promocode_model" );
	
	}
	
	public function promocodelist(){
	
		$this->data = array();
		$this->add_library ( "promocode" );
                $this->add_library ( "datatables" );
		$this->add_js_functions ( array ('Promocode.home' => array ()) );
	
		//$this->data['promocodelist'] = $response = $this->promocode_model->getPromocodeList ();
		
		//print_r($this->data);
	
		$this->template->write_view ( 'content', 'promocode/list', $this->data );
	
		$this->template->render ();
	
	}
        
        
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
		
				
		
				
		$response = $this->promocode_model->getPromocodeList ( );
		
		if (! empty ( $response )) {
				$i=1;
					foreach ( $response->result as $promolist ) {
						
																									
						$data [] = array (
						"DT_RowId" => 'row_'.$i,
						"code" => $promolist->code,
						"id" => $promolist->id,
						"calculation" => $promolist->calculation,
                                                "discount" => $promolist->discount,
                                                "count" => $promolist->count,
                                                "minCostValue" => $promolist->minCostValue,
                                                "startTimeVal" => $promolist->startTimeVal,
                                                "endTimeVal" => $promolist->endTimeVal
                                                    
                                                    
                                                    
						
						
						
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
			$postData['code'] = $this->input->post ( "code" ,TRUE);
			$postData['calculation'] = $this->input->post ( "calculation" ,TRUE);
			$postData['discount'] = $this->input->post ( "discount" ,TRUE);
			$postData['count'] = $this->input->post ( "count" ,TRUE);
			$postData['minCostValue'] = $this->input->post ( "minCostValue" ,TRUE);
			$postData['startTime'] = $this->input->post ( "startTime" ,TRUE);
			$postData['endTime'] = $this->input->post ( "endTime" ,TRUE);
			
				
			$savedDetail = $this->promocode_model->saveUpdateDetails ($postData);
	
				
			if (isset ( $savedDetail ) && $savedDetail->message == 'Success' &&
					$savedDetail->code == 200 ) {
	
						redirect ( base_url ( "promocode/list" ), 'location' );
	
					}
		}
	
	
	}
	
}