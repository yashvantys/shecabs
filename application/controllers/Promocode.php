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
		$this->add_js_functions ( array ('Promocode.home' => array ()) );
	
		$this->data['promocodelist'] = $response = $this->promocode_model->getPromocodeList ();
		
		//print_r($this->data);
	
		$this->template->write_view ( 'content', 'promocode/list', $this->data );
	
		$this->template->render ();
	
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