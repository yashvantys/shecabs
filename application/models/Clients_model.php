<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
	class Clients_model extends Service_Model {
		public static $SERVICE_CLIENT_LIST = "/service/client/clientlist";
		public static $SERVICE_INDUSTRY_LIST = "/service/industry/list";
		public static $SERVICE_CLIENT_DETAILS = "/service/client/clientdetails/";
		public static $SERVICE_SOURCE_LISTFORALERTS ="/service/source/listForAlerts";
		public static $SERVICE_SAVE_CLIENT ="/service/client/create";
		public static $SERVICE_UPDATE_CLIENT ="/service/client/update/";
		public static $SERVICE_SOURCE_LIST ="/service/source/listForClients";
		public static $SERVICE_CONTACT_LIST ="/service/user/bfountainusers";
		
		
		public function __construct() {
			parent::__construct ();
		}
		
		public function getClientList($email, $start = 0, $limit = 100, $sort_column, $direction, $search) {
			$result = array ();
			$service_url = "{$this::$SERVICE_CLIENT_LIST}";
			
			$data = $this->service->get ( $service_url, array (
					"email" =>$email
			), array (
					"start" => $start,
					"limit" => $limit,
					"sortColumn" => $sort_column,
					"direction" => $direction,
					"search" => $search
			) );
			
			if ($data->status->code == 200) {
				$result = $data;
			}
		
			return $result;
		}
		
		public  function getClientInfo($client_id,$email){
		
			$clientInfo = array ();
			$data = $this->service->get ( "{$this::$SERVICE_CLIENT_DETAILS}{$client_id}", array (
					"email" => $email
			), array (
					"email" => $email
			) );
			
		
			
						
			if ($data->status->message == 'success' && $data->status->code == '200') {
				$clientInfo = $data;
			} 
			
			return $clientInfo;
		}
		
	public function saveClient($data, $email) {
		return $this->service->post ( "{$this::$SERVICE_SAVE_CLIENT}", array (
				"email" => $email,
				'content-type' => 'application/json' 
		), array (), json_encode ( $data ), false, array (
				'postToTask' => true 
		) );
	}
		
		public  function updateClient($data, $email ,$client_id){
			return $this->service->post ( "{$this::$SERVICE_UPDATE_CLIENT}{$client_id}", array (
					"email" => $email,
					'content-type' => 'application/json'
			), array (), json_encode ( $data ) );
			
		}
		
		
		public function addMainForm($userEmail, $clientData = null, $savePage = true, $isNewClient = true,$client_id, $returndata = null ){
			$this->load->helper ( 'form' );
			$this->load->library ( 'form_builder' );
			$url='';
			if($savePage == true)
				$url = 'client/edit/'.$client_id;
			else
				$url = 'client/add';
			$form_items = array ();
			$form = $this->form_builder->open_form ( array (
					'action' => base_url ( $url ),
					'id' => 'main-form',
					
					'class' => 'upload-file-form',
					'enctype' => 'multipart/form-data'
			) );
			
			$form = $form . $this->form_builder->build_form_horizontal ( $form_items );
			
			return $form;
			
		}
		public function addClientForm($userEmail, $clientData = null, $savePage = true, $isNewClient = true,$client_id, $returndata = null, $partners = array() ) {
			$this->load->helper ( 'form' );
			$this->load->library ( 'form_builder' );
			
			//var_dump($clientData);
			
			if($savePage == true){
				$readonly ="readonly";
			}
			
			$form_items = array ();
			$date_items[] = array();
			
			
			// Date 
			$pre_start_date = date('m/d/Y');//, mktime(0, 0, 0, $currentMonth, 1, $currentYear));
			$pre_end_date = date ( "m/d/Y" );
			
			
			// industry list
			
			$industries = array ();
			$service_url = "admin{$this::$SERVICE_INDUSTRY_LIST}";
			$data = $this->service->get ( $service_url, array (
					"email" => $this->super_user
			) );
			//var_dump($data);
			if (isset ( $data->status ) && $data->status->code == 200) {
				foreach($data->industries as $industry) {
					if($industry->type == 'SV')
						$industries[$industry->id] = $industry->name;
				}
			}
			
		
			
			//print_r($clientData);exit;
			$clientId = '';
			if (!empty($clientData) && @$clientData->data->id != null) {
				$clientId = $clientData->data->id;
			}
			
			$name = '';
			if (!empty($clientData) && @$clientData->data->name != null) {
				$name = $clientData->data->name;
			}
			
			$type = '';
			if (!empty($clientData) && @$clientData->data->type != null) {
				$type = $clientData->data->type;
			}
			$connector='';
			if (!empty($clientData) && @$clientData->data->connector != null) {
				$connector = $clientData->data->connector;
			}
			$industryId ='';
			if (!empty($clientData) && @$clientData->data->industryId != null) {
				$industryId = $clientData->data->industryId;
			}
			
			$fyStartDate ='';
			if (!empty($clientData) && @$clientData->data->fyStartDate != null) {
				$fyStartDate = date('m',strtotime($clientData->data->fyStartDate));
			}
			
			
						
			$referralReports='';
			$solicitedFeedback='';
			$testimonialSolicitation='';
			$emailFeedback='';
			$publishTestimonials='';
			$hcahps='';
			$collaboration='';
			//print_r($returndata);
			
			if(isset($returndata) && !empty($returndata->data))
			{
				
				$clientId = $returndata->data->id;
				$name = $returndata->data->name;
				$type = $returndata->data->type;
				$industryId = $returndata->data->industryId;
				$default_value = date('m/d/Y',strtotime($returndata->data->dashboardRefresh));
				$fyStartDate = date('m',strtotime($returndata->data->fyStartDate));
				$referralReports = $returndata->data->referralReports;
				$solicitedFeedback = $returndata->data->solicitedFeedback;
				$testimonialSolicitation = $returndata->data->testimonialSolicitation;
				$emailFeedback = $returndata->data->emailFeedback;
				$publishTestimonials = $returndata->data->publishTestimonials;
				$hcahps = $returndata->data->hcahps;
				$collaboration = $returndata->data->collaboration;
				
				
				
				
			}
			
			//var_dump($returndata);
			//var_dump($collaboration."yash");
			if($savePage == true){	
			$form_items [] = array (
					'type' => 'input',
					'id' => 'client',
					'name' => 'client',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => true,
					'class' => 'select2 alert-type',
					'label' => "Client (No leading /)",
					'title' => "Client (No leading /)",
					'help' => "Please provide client",
					'value' => $clientId,
					'readonly'=>$readonly,
					'maxlength' => 255
				
			);
			}else{
				
				$form_items [] = array (
						'type' => 'input',
						'id' => 'client',
						'name' => 'client',
						'block_class' => 'col-md-6 col-sm-6',
						'required' => true,
						'class' => 'select2 alert-type',
						'label' => "Client (No leading /)",
						'title' => "Client (No leading /)",
						'help' => "Please provide client",
						'value' => $clientId,
						'maxlength' => 255
				
				);
			}
			
			$typeOptions = array('P' => 'Prospect','L'=>'Lead','C'=>'Customer');
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'client_type',
					'name' => 'client_type',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => true,
					'class' => 'select2-multiple avatars client_type',
					'label' => "Client Type",
					'placeholder' => '',
					'selected' => $type,
					'title' => "",
					'options' => $typeOptions
			);
			$live ="";
			 if(!empty($clientData) && (@$clientData->data->is_live == 1)){
				$live = 'checked';
			}
				
			$liveOption = array('1'=>"Live");
				
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'live',
					'name' => 'is_live',
					'block_class' => 'col-md-6 col-sm-6',
					'label' => '',
					'class' => 'filter-live-check',
					'checked' => $live,
					'required' => false,
					'options' =>  $liveOption
			
			);
			
			$form_items [] = array (
					'type' => 'input_html',
					'id' => 'name',
					'name' => 'name',
					'block_class' => 'col-md-8 col-sm-8',
					'required' => true,
					'class' => 'select2 alert-type',
					'label' => "Client Name",
					'title' => "Client Name",
					'help' => "Please provide client name",
					'value' => $name,
					'maxlength' => 255
			);
			
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'indus_type',
					'name' => 'indus_type',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => true,
					'class' => 'select2-multiple avatars',
					'label' => "Industry Name",
					'placeholder' => '',
					'selected' => $industryId,
					'title' => "",
					'options' => $industries
			);
			
			$dbOptions = array('Default' => 'Default');
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'db_conn',
					'name' => 'db_conn',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => false,
					'class' => 'select2-multiple avatars',
					'label' => "DB Connector",
					'placeholder' => '',
					'selected' => $connector,
					'title' => "",
					'options' => $dbOptions
			);
			
			$partner_options = array ('' => '');
			if (!empty($partners)) {
				foreach ($partners as $v) {
					$partner_options[$v->id] = $v->name;
				}
			}
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'partner',
					'name' => 'partner',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => false,
					'class' => 'select2 partner',
					'label' => "Partner",
					'placeholder' => '',
					'selected' => !empty($clientData->data->partner->id) ? $clientData->data->partner->id : '',
					'title' => "",
					'options' => $partner_options
			);
			
			$date = new DateTime('2000-01-01');
			//echo $date->format('Y-m-d H:i:sP') . "\n";
			
			$default_value = $date->format('m/d/Y');//'2000-01-01';//date('m/d/Y');//$pre_start_date;
			if (!empty($clientData) && @$clientData->data->dashboardRefresh != null) {
				$default_value = date('m/d/Y',strtotime($clientData->data->dashboardRefresh));
			}else if(@$returndata->data->dashboardRefresh != null){
				$default_value = date('m/d/Y',strtotime($returndata->data->dashboardRefresh));
			}
			
			
			$form_items[] = array(
					'type' => 'html',
					'html' => '<div class="col-md-6 input-daterange"><div class="row">'
			
			);
			$form_items[] = array(
					'id' => 'start_date',
					'name' => 'start_date',
					'block_class' => 'col-md-6 dt_cal',
					'class' => 'select2-multiple avatars filter-start-date ',
					'label' => 'Last Refresh',
					'rule' =>'required',
					'value' => $default_value,
					'readonly' => 'readonly'
			);
			
			$form_items[] = array(
					'type' => 'html',
					'html' => '</div></div>'
			
			);
			
			$fyOptions = array('1' => 'January','2'=>'February','3'=>'March','4'=>'April','5'=>'May','6'=>'June','7'=>'July','8'=>'August','9'=>'September','10'=>'October','11'=>'November','12'=>'December');
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'fy_year',
					'name' => 'fy_year',
					'block_class' => 'col-md-6',
					'required' => false,
					'class' => 'select2-multiple avatars',
					'label' => "Start of Fiscal Year",
					'placeholder' => '',
					'selected' => $fyStartDate,
					'title' => "",
					'options' => $fyOptions
			);
			
			
			
			
			if (!empty($clientData) && @$clientData->data->referralReports != null) {
				$referralReports = 'checked';
			}else if(!empty($returndata) && @$returndata->data->referralReports == 'true'){
				$referralReports = 'checked';
			}
			
			
			if($client_id =='')
				$solicitedFeedback='checked';
			if (!empty($clientData) && @$clientData->data->solicitedFeedback != null) {
				$solicitedFeedback =  'checked';
			}else if(!empty($returndata) && @$returndata->data->solicitedFeedback == 'true'){
				$solicitedFeedback = 'checked';
			}
			
		
			
			
			if (!empty($clientData) && @$clientData->data->testimonialSolicitation != null) {
				$testimonialSolicitation = 'checked';
			}else if(!empty($returndata) && @$returndata->data->testimonialSolicitation == 'true'){
				$testimonialSolicitation = 'checked';
			}
			
			
			if (!empty($clientData) && @$clientData->data->emailFeedback != null) {
				$emailFeedback = 'checked';
			}else if(!empty($returndata) && @$returndata->data->emailFeedback == 'true'){
				$emailFeedback = 'checked';
			}
			
			if (!empty($clientData) && @$clientData->data->publishTestimonials != null) {
				$publishTestimonials = 'checked';
			}else if(!empty($returndata) && @$returndata->data->publishTestimonials == 'true'){
				$publishTestimonials = 'checked';
			}
			
			
			if (!empty($clientData) && @$clientData->data->hcahps != null) {
				$hcahps = 'checked';
			}else if(!empty($returndata) && @$returndata->data->hcahps == 'true'){
				//echo "yash1";
				$hcahps = 'checked';
			}
			
			
			
			if (!empty($clientData) && @$clientData->data->collaboration != null) {
				$collaboration = 'checked';
			}else if(!empty($returndata) && @$returndata->data->collaboration == 'true'){
				$collaboration = 'checked';
			}
			
			//var_dump($clientData);
						
			$cmtstr = array('1'=>"Enable solicited feedback");
						
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'solicitedFeedback',
					'name' => 'solicitedFeedback',
					'block_class' => 'col-md-6 first_chk',
					'class' => 'filter-comments-check ',
					'label' => 'Supported Features',
					'checked' => $solicitedFeedback,
					'required' => false,
					'options' =>  $cmtstr
					
			);
			
			$adrstr = array('1'=>"HCAHPS");
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'add_scopes',
					'name' => 'add_scopes',
					'block_class' => 'col-md-6',
					'class' => 'filter-comments-check ',
					'label' => 'Additional Scopes',
					'checked' => $hcahps,
					'options' =>  $adrstr
			
			);
			$reportstr = array('1'=>"Enable reports to referral physicians");
			
			$date = new DateTime('2000-01-01');
			//echo $date->format('Y-m-d H:i:sP') . "\n";
				
			$default_date = $date->format('m/d/Y');//'2000-01-01';//date('m/d/Y');//$pre_start_date;
			if (!empty($clientData) && @$clientData->data->contractStartDate != null) {
				$default_date = date('m/d/Y',strtotime($clientData->data->contractStartDate));
			}
				
				
			$form_items[] = array(
					'type' => 'html',
					'html' => '<div class="col-md-12 input-daterange"><div class="row">'
		
			);
			$form_items[] = array(
					'id' => 'contract-start-date',
					'name' => 'contractStartDate',
					'block_class' => 'col-md-4 dt_cal',
					'class' => 'select2-multiple contract-start-date ',
					'label' => 'Contract Start Date',
					'rule' =>'required',
					'value' => $default_date,
					'readonly' => 'readonly'
			);
			$form_items[] = array(
					'type' => 'html',
					'html' => '</div></div>'
			
			);
			$selected_parent = "";
			if (!empty($clientData) && @$clientData->data->parentAccount != null) {
				$selected_parent = $clientData->data->parentAccount;
			}
			
			$this->load->model ( "client_model" );
			$clients = array (
					"" => "Select Client"
			);
			$clients += $this->client_model->getList ();
			
			
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'parent',
					'name' => 'parentAccount',
					'block_class' => 'col-md-6',
					'class' => 'select2-multiple avatars',
					'label' => "Select Parent Client",
					'placeholder' => '',
					'selected' => $selected_parent,
					'title' => "",
					'options' => $clients
			);
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'referralReports',
					'name' => 'referralReports',
					'block_class' => 'col-md-12 chk_new',
					'label' => '',
					'class' => 'filter-comments-check ',
					'checked' => $referralReports,
					'required' => false,
					'options' =>  $reportstr
						
			);
			
			$teststr = array('1'=>"Enable testimonial solicitation through email");
				
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'testimonialSolicitation',
					'name' => 'testimonialSolicitation',
					'block_class' => 'col-md-8 chk_new',
					'label' => '',
					'class' => 'filter-comments-check ',
					'checked' => $testimonialSolicitation,
					'required' => false,
					'options' =>  $teststr
			
			);
			
			$emailstr = array('1'=>"Enable feedback solicitation through email");
			
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'emailFeedback',
					'name' => 'emailFeedback',
					'block_class' => 'col-md-8 chk_new',
					'label' => '',
					'class' => 'filter-comments-check ',
					'checked' => $emailFeedback,
					'required' => false,
					'options' =>  $emailstr
						
			);
			
			$pubstr = array('1'=>"Enable publishing of customer testimonials");
				
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'publishTestimonials',
					'name' => 'publishTestimonials',
					'block_class' => 'col-md-8 chk_new',
					'label' => '',
					'class' => 'filter-comments-check ',
					'checked' => $publishTestimonials,
					'required' => false,
					'options' =>  $pubstr
			
			);
			
			

			$colstr = array('1'=>"Enable Collaboration");
				
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'collaboration',
					'name' => 'collaboration',
					'block_class' => 'col-md-8 chk_new',
					'label' => '',
					'class' => 'filter-comments-check ',
					'checked' => $collaboration,
					'required' => false,
					'options' =>  $colstr
			
			);
			
			$form_items [] = array (
					'type' => 'hidden',
					'id' => 'clienttabs',
					'name' => 'clienttab',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => false,
					'class' => 'select2 alert-type alert_text'
					
			
			);
			
			
			
			/*$form_items [] = array (
					'type' => 'button',
					'id' => 'manual-fill-submit',
					'name' => 'submit',
					'class' => 'manual-fill-button pull-left client_button',
					'label' => 'Save',
					'block_class' => 'clear col-md-7 col-sm-7 new_sub'
			);
			*/
// 		/	echo "<pre>"; print_r($form_items); die;
			$form = $this->form_builder->build_form_horizontal ( $form_items );
			
			//$form .= $this->form_builder->close_form ();
			return $form;
			
		}
		
		public function addClientSetupForm($userEmail, $clientData = null, $savePage = true, $isNewClient = true,$client_id , $returndata = null){
			$this->load->helper ( 'form' );
			$this->load->library ( 'form_builder' );
			
			
			
			
			// contact list
			
			$contacts = array ();
			$service_url = "admin{$this::$SERVICE_CONTACT_LIST}";
			$data = $this->service->get ( $service_url, array (
					"email" => $this->super_user
			) );
			
			//var_dump($data);
			if (isset ( $data->status ) && $data->status->code == 200) {
				foreach($data->contactaccountmanagers as $contact) {
						$contacts[$contact->email] = $contact->name." (".$contact->email.")";
				}
			}
						
			if(empty($client_id)){
				$contact_email_title = 'Binary Fountain Support';
				$contact_email = 'admin@bfountain.com';
				$outgoingEmail_title = 'Binary Fountain Support';
				$outgoingEmail = 'no-reply@binaryfountain.com';
				$fromEmailAlert_title = 'Binary Fountain Support';
				$fromEmailAlert = 'no-reply@binaryfountain.com';
				$collaborationFromEmail_title='Binary Fountain Support';
				$collaborationFromEmail='no-reply@binaryfountain.com';
				$contactAccountManagerEmail='admin@bfountain.com';
				$accountManagerEmail='admin@bfountain.com';
			}else{
				$contact_email_title = '';
				$contact_email = '';
				$outgoingEmail_title = '';
				$outgoingEmail = '';
				$fromEmailAlert_title = '';
				$fromEmailAlert = '';
				$collaborationFromEmail_title = '';
				$collaborationFromEmail= '';
				$contactAccountManagerEmail='';
				$accountManagerEmail='';
			}
			/*echo "<pre>Client data";
			print_r($clientData);
			echo "</pre>";
			//exit;
			
			echo "<pre>Return data";
			print_r($returndata);
			echo "</pre>";*/
			//exit;
			
			
			if (!empty($clientData) && @$clientData->data->contactEmail != null) {
				$tempArr = array();
				$tempArr = explode('<', $clientData->data->contactEmail);
				$finalArr = array();
				if (isset($tempArr[0]) && isset($tempArr[1])){
					//$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$contact_email_title = $tempArr[0];
					$contact_email = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$contact_email_title = '';
					$contact_email = $tempArr[0];
				}
			}else if(!empty($returndata) && @$returndata->data->contactEmail != null){
				$tempArr = array();
				$tempArr = explode('<', $returndata->data->contactEmail);
				$finalArr = array();
				if (isset($tempArr[0]) && isset($tempArr[1])){
					//$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$contact_email_title = $tempArr[0];
					$contact_email = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$contact_email_title = '';
					$contact_email = $tempArr[0];
				}
				//$contact_email = $returndata->data->contactEmail;
			}
			
			
			
			if (!empty($clientData) && @$clientData->data->outgoingEmail != null) {
				$tempArr = array();
				$tempArr = explode('<', $clientData->data->outgoingEmail);
				if (isset($tempArr[0]) && isset($tempArr[1])){
					$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$outgoingEmail_title = $tempArr[0];
					$outgoingEmail = isset($finalArr[0])?$finalArr[0]:'';
				} else {	
					$outgoingEmail_title = '';
					$outgoingEmail = $tempArr[0];
				}
			}else if(!empty($returndata) && @$returndata->data->outgoingEmail != null){
				$tempArr = array();
				$tempArr = explode('<', $returndata->data->outgoingEmail);
				if (isset($tempArr[0]) && isset($tempArr[1])){
					$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$outgoingEmail_title = $tempArr[0];
					$outgoingEmail = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$outgoingEmail_title = '';
					$outgoingEmail = $tempArr[0];
				}
				//$outgoingEmail = $returndata->data->outgoingEmail;
			}
			
			
			if (!empty($clientData) && @$clientData->data->fromEmailAlert != null) {
				$tempArr = array();
				$tempArr = explode('<', $clientData->data->fromEmailAlert);
				if (isset($tempArr[0]) && isset($tempArr[1])){
					$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$fromEmailAlert_title = $tempArr[0];
					$fromEmailAlert = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$fromEmailAlert_title = '';
					$fromEmailAlert = $tempArr[0];
				}	
			}else if(!empty($returndata) && @$returndata->data->fromEmailAlert != null){
				$tempArr = array();
				$tempArr = explode('<', $returndata->data->fromEmailAlert);
				if (isset($tempArr[0]) && isset($tempArr[1])){
					$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$fromEmailAlert_title = $tempArr[0];
					$fromEmailAlert = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$fromEmailAlert_title = '';
					$fromEmailAlert = $tempArr[0];
				}
				//$fromEmailAlert = $returndata->data->fromEmailAlert;
			}
			
			
			if (!empty($clientData) && @$clientData->data->collaborationFromEmail != null) {
				$tempArr = array();
				$tempArr = explode('<', $clientData->data->collaborationFromEmail);
				/*echo "<pre>temp arr";
				print_r($tempArr);
				 echo '</pre>';
				 exit;*/
				if (isset($tempArr[0]) && isset($tempArr[1])){
					$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$collaborationFromEmail_title = $tempArr[0];
					$collaborationFromEmail = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$collaborationFromEmail_title = '';
					$collaborationFromEmail = $tempArr[0];
				}	
				
			}else if(!empty($returndata) && @$returndata->data->collaborationFromEmail != null){
				$tempArr = array();
				$tempArr = explode('<', $returndata->data->collaborationFromEmail);
				/*echo "<pre>temp arr";
				 print_r($tempArr);
				 echo '</pre>';
				exit;*/
				if (isset($tempArr[0]) && isset($tempArr[1])){
					$finalArr = array();
					$finalArr = explode('>', $tempArr[1]);
					$collaborationFromEmail_title = $tempArr[0];
					$collaborationFromEmail = isset($finalArr[0])?$finalArr[0]:'';
				} else {
					$collaborationFromEmail_title = '';
					$collaborationFromEmail = $tempArr[0];
				}
				//$collaborationFromEmail = $returndata->data->collaborationFromEmail;
			}
			
			
			if (!empty($clientData) && @$clientData->data->contactAccountManagerEmail != null) {
				$contactAccountManagerEmail = $clientData->data->contactAccountManagerEmail;
			}else if(!empty($returndata) && @$returndata->data->contactAccountManagerEmail != null){
				$contactAccountManagerEmail = $returndata->data->contactAccountManagerEmail;
			}
			
			if (!empty($clientData) && @$clientData->data->accountManagerEmail != null) {
				$accountManagerEmail = $clientData->data->accountManagerEmail;
			}else if(!empty($returndata) && @$returndata->data->accountManagerEmail != null){
				$accountManagerEmail = $returndata->data->accountManagerEmail;
			}
			
			
			
			
			$form_items = array ();
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'contact_email_title',
					'name' => 'contact_email_title',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2 alert-type',
					'label' => "Contact Email Title",
					'title' => "Contact Email Title",
					'value' => $contact_email_title,
					'maxlength' => 255
			);
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'contact_email',
					'name' => 'contact_email',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => true,
					'class' => 'select2 alert-type',
					'label' => "Contact Email",
					'title' => "Contact Email",
					'value' => $contact_email,
					'maxlength' => 255
			);
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'outgoing_email_title',
					'name' => 'outgoing_email_title',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2 alert-type',
					'label' => "Reports From Email Title",
					'title' => "Reports From Email Title",
					'html_escape' => 'false',
					'value' => html_entity_decode($outgoingEmail_title),
					'maxlength' => 255
			);
			$form_items [] = array (
					'type' => 'input',
					'id' => 'outgoing_email',
					'name' => 'outgoing_email',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => true,
					'class' => 'select2 alert-type',
					'label' => "Reports From Email",
					'title' => "Reports From Email",
					'value' => $outgoingEmail,
					'maxlength' => 255
			);
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'from_email_alert_title',
					'name' => 'from_email_alert_title',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2 alert-type',
					'label' => "Alerts From Email Title",
					'title' => "Alerts From Email Title",
					'value' => $fromEmailAlert_title,
					'maxlength' => 255
			);
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'from_email_alert',
					'name' => 'from_email_alert',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => true,
					'class' => 'select2 alert-type',
					'label' => "Alerts From Email",
					'title' => "Alerts From Email",
					'value' => $fromEmailAlert,
					'maxlength' => 255
			);
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'collaboration_from_email_title',
					'name' => 'collaboration_from_email_title',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2 alert-type',
					'label' => "Collaboration From Email Title",
					'title' => "Collaboration From Email Title",
					'value' => $collaborationFromEmail_title,
					'maxlength' => 255
			);
			
				$form_items [] = array (
					'type' => 'input',
					'id' => 'collaboration_from_email',
					'name' => 'collaboration_from_email',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2 alert-type',
					'label' => "Collaboration From Email",
					'title' => "Collaboration From Email",
					'value' => $collaborationFromEmail,
					'maxlength' => 255
			);
		
				
			/*
			$form_items [] = array (
					'type' => 'input',
					'id' => 'contact_account_manager_email',
					'name' => 'contact_account_manager_email',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2 alert-type',
					'label' => "Contact Account Manager Email",
					'title' => "Contact Account Manager Email",
					'value' => $contactAccountManagerEmail,
					'maxlength' => 255
			);*/
				
				
				$form_items [] = array (
						'type' => 'dropdown',
						'id' => 'contact_account_manager_email',
						'name' => 'contact_account_manager_email',
						'block_class' => 'col-md-6 col-sm-6',
						'required' => false,
						'class' => 'select2-multiple avatars',
						'label' => "Contact Account Manager Email",
						'placeholder' => '',
						'selected' => $contactAccountManagerEmail,
						'title' => "",
						'options' => $contacts
				);
				
				$form_items [] = array (
						'type' => 'dropdown',
						'id' => 'accountManagerEmail',
						'name' => 'accountManagerEmail',
						'block_class' => 'col-md-6 col-sm-6',
						'required' => false,
						'class' => 'select2-multiple avatars',
						'label' => "Account Manager Email",
						'placeholder' => '',
						'selected' => $accountManagerEmail,
						'title' => "",
						'options' => $contacts
				);
		
			
			$form_items [] = array (
					'type' => 'upload',
					'id' => 'logo_filename',
					'name' => 'logo_filename',
					'class' => '',
					'label' => 'Logo File',
					'block_class' => 'col-md-12',
					'help' => 'Should be in png, jpeg, gif and bmp format'
			);
			
			$form_items [] = array (
					'type' => 'hidden',
					'id' => 'setuptabs',
					'name' => 'setuptab',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => false,
					'class' => 'select2 alert-type alert_text'
					
						
			);
			
			/*$form_items [] = array (
					'type' => 'upload',
					'id' => 'client_data_file',
					'name' => 'client_data_file',
					'required' => false,
					'class' => '',
					'label' => 'Client Data File',
					'block_class' => 'col-md-12'
					
			);*/
			
			
			/*$form_items [] = array (
					'type' => 'button',
					'id' => 'setupbutton',
					'name' => 'submit',
					'class' => 'setupbutton manual-fill-button pull-left',
					'label' => 'Save',
					'block_class' => 'clear col-md-7 col-sm-7'
			);*/
			$form =  $this->form_builder->build_form_horizontal ( $form_items );
			//$form .= $this->form_builder->close_form ();
			return $form;
		}
		
		public function addClientConfigurationForm($userEmail, $clientData = null, $savePage = true, $isNewClient = true,$client_id, $returndata = null){
			$this->load->helper ( 'form' );
			$this->load->library ( 'form_builder' );
		
			//var_dump($clientData);
			//exit;
			
			$form_items = array ();
			
			
			
			
			$disableAuthorPosts='';
			if(isset($sourcesSelect) && count($sourcesSelect)>0){
				$disableAuthorPosts = 'checked';
			}
			if (!empty($clientData) && @$clientData->data->disableAuthorPosts != null) {
				$disableAuthorPosts = 'checked';
			}else if(!empty($returndata) && @$returndata->data->disableAuthorPosts == 'true'){
				$disableAuthorPosts = 'checked';
			}
			
			
			//var_dump($disableAuthorPosts);
			$authorstr = array('1'=>"Disable author posts in content feed widget");
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'disableAuthorPosts',
					'name' => 'disableAuthorPosts',
					'block_class' => 'col-md-12',
					'class' => 'filter-comments-check ',
					'label' => '',
					'checked' => $disableAuthorPosts,
					'options' =>  $authorstr
			
			);
			
			// source list
			//$sourcesList = array ();
			$sourcesSelect = array();
				
			$service_url = "admin{$this::$SERVICE_SOURCE_LIST}";
			
			$sourcesList = array (
					"100000" => "All Sources"
			);
			
			$data = $this->service->get ( $service_url, array (
					"email" => $this->super_user
			) );
			if (isset ( $data->StatusCode ) && $data->StatusCode == 200) {
				foreach($data->sources as $source) {
					$sourcesList[$source->id] = $source->name;
				}
			}
				
			if (isset ( $clientData->data->sources )) {
				$sub_sources = explode(',', $clientData->data->sources);
					if (!empty($sub_sources)){
					foreach ($sub_sources as $source) {
						$sourcesSelect[] = $source;
					}
				}
			}else if(@$returndata->data->sources){
					$sub_sources = explode(',', $returndata->data->sources);
					if (!empty($sub_sources)){
					foreach ($sub_sources as $source) {
						$sourcesSelect[] = $source;
					}
				}
			}
			
			
				
			if($disableAuthorPosts == 'checked' ){
			$form_items [] = array (
					'type' => 'dropdown',
					'id' => 'sources',
					'name' => 'sources[]',
					'block_class' => 'col-md-6 col-sm-6',
					'class' => 'select2-multiple avatars',
					'label' => "",
					'placeholder' => 'Select Sources',
					'selected' => 'Select Sources',
					'selected' => $sourcesSelect,
					'multiple' => 'multiple',
					'title' => "",
					'options' => $sourcesList
					
			);
			}else{
				$form_items [] = array (
						'type' => 'dropdown',
						'id' => 'sources',
						'name' => 'sources[]',
						'block_class' => 'col-md-6 col-sm-6',
						'class' => 'select2-multiple avatars',
						'label' => "",
						'placeholder' => 'Select Sources',
						'selected' => 'Select Sources',
						'selected' => $sourcesSelect,
						'multiple' => 'multiple',
						'title' => "",
						'options' => $sourcesList,
						'disabled'=>"disabled"
						
				);
			}
			
			
			$engagementDraftEmail='';
			if (!empty($clientData) && @$clientData->data->engagementDraftEmail != null) {
				$engagementDraftEmail = 'checked';
			}else if(!empty($returndata) && @$returndata->data->engagementDraftEmail == 'true'){
				$engagementDraftEmail = 'checked';
			}
			
			$notifystr = array('1'=>"Notify draft engagements");
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'engagementDraftEmail',
					'name' => 'engagementDraftEmail',
					'block_class' => 'col-md-12',
					'class' => 'filter-comments-check ',
					'label' => '',
					'checked' => $engagementDraftEmail,
					'options' =>  $notifystr
						
			);
			
			$engagement_email='';
			if($client_id =='')
				$engagement_email='checked';
			if (!empty($clientData) && @$clientData->data->engagement_email != null) {
				$engagement_email = 'checked';
			}else if(!empty($returndata) && @$returndata->data->engagement_email == 'true'){
				$engagement_email = 'checked';
			}
			
			$engagementstr = array('1'=>"Send Engagement Email to the Survey Respondent");
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'engagement_email',
					'name' => 'engagement_email',
					'block_class' => 'col-md-12',
					'class' => 'filter-comments-check ',
					'label' => '',
					'checked' => $engagement_email,
					'options' =>  $engagementstr
						
			);
			
			$dataWithoutCommentForEngagementReport='';
			if (!empty($clientData) && @$clientData->data->dataWithoutCommentForEngagementReport != null) {
				$dataWithoutCommentForEngagementReport = 'checked';
			}else if(!empty($returndata) && @$returndata->data->dataWithoutCommentForEngagementReport == 'true'){
				$dataWithoutCommentForEngagementReport = 'checked';
			}
			
			$surveystr = array('1'=>"Exclude survey responses without comments in reports");
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'dataWithoutCommentForEngagementReport',
					'name' => 'dataWithoutCommentForEngagementReport',
					'block_class' => 'col-md-12',
					'class' => 'filter-comments-check ',
					'label' => '',
					'checked' => $dataWithoutCommentForEngagementReport,
					'options' =>  $surveystr
						
			);

			$excludeAuthorPostsInAlerts='';
			if (!empty($clientData) && @$clientData->data->excludeAuthorPostsInAlerts != null) {
				$excludeAuthorPostsInAlerts = 'checked';
			}else if(!empty($returndata) && @$returndata->data->excludeAuthorPostsInAlerts == 'true'){
				$excludeAuthorPostsInAlerts = 'checked';
			}
				
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'excludeAuthorPostsInAlerts',
					'name' => 'excludeAuthorPostsInAlerts',
					'block_class' => 'col-md-12',
					'class' => 'filter-comments-check ',
					'label' => '',
					'checked' => $excludeAuthorPostsInAlerts,
					'options' =>  array('1'=>"Exclude Author Posts in Alert")
			);

			$enableSecureSurvey='';
			if (!empty($clientData) && @$clientData->data->enableSecureSurvey != null) {
				$enableSecureSurvey = 'checked';
			}else if(!empty($returndata) && @$returndata->data->enableSecureSurvey == 'true'){
				$enableSecureSurvey = 'checked';
			}
			
			$form_items [] = array (
					'type' => 'checkbox',
					'id' => 'enableSecureSurvey',
					'name' => 'enableSecureSurvey',
					'block_class' => 'col-md-12',
					'class' => 'filter-comments-check ',
					'label' => '',
					'checked' => $enableSecureSurvey,
					'options' =>  array('1'=>"Enable Secure Survey")
			);
				
			$alert_days='7';
			if (!empty($clientData) && @$clientData->data->alert_days != null) {
				$alert_days = $clientData->data->alert_days;
			}else if(!empty($returndata) && @$returndata->data->alert_days != null){
				$alert_days = $returndata->data->alert_days;
			}
			
			$form_items [] = array (
					'type' => 'input',
					'id' => 'alert_days',
					'name' => 'alert_days',
					'block_class' => 'col-md-8 col-sm-8',
					'class' => 'select2 alert-type alert_text',
					'label' => "Number of days document alert need to check",
					'title' => "Number of days document alert need to check",
					'value' => $alert_days,
					'maxlength' => 3
			);
			
			$form_items [] = array (
					'type' => 'hidden',
					'id' => 'configtabs',
					'name' => 'configtab',
					'block_class' => 'col-md-6 col-sm-6',
					'required' => false,
					'class' => 'select2 alert-type alert_text'
					
					
			);
			
			
			
			
			/*$form_items [] = array (
					'type' => 'button',
					'id' => 'configbutton',
					'name' => 'submit',
					'class' => 'configbutton manual-fill-button pull-left',
					'label' => 'Save',
					'block_class' => 'clear col-md-7 col-sm-7'
			);*/
				
			$form = $this->form_builder->build_form_horizontal ( $form_items );
			//$form .= $this->form_builder->close_form ();
			return $form;
			
		}
		
		
		public function clientMainClose($userEmail, $clientData = null, $savePage = true, $isNewClient = true,$client_id, $returndata = null ){
			$this->load->helper ( 'form' );
			$this->load->library ( 'form_builder' );
			
			//var_dump($clientData);
			//exit;
				
			$form_items = array ();
			$form_items [] = array (
					'type' => 'submit',
					'id' => 'manual-fill-submit',
					'name' => 'submit',
					'class' => 'manual-fill-button pull-left',
					'label' => 'Save',
					'block_class' => 'clear col-md-7 col-sm-7 new_sub'
			);
			$form = $this->form_builder->build_form_horizontal ( $form_items );
			$form .= $this->form_builder->close_form ();
			return $form;
		}
		
		public function getUploadedLogoPath() {
			// Logo related things
			$config ['upload_path'] = '/tmp';
			$config ['allowed_types'] = 'png|jpeg|jpg|gif|bmp';
			$config ['max_size'] = '20480';
			$this->load->library ( 'upload', $config );
			
			
			if ($this->upload->do_upload ( "logo_filename" )) {
				//echo "in do upload";
				//exit;
				$upload_data = $this->upload->data ();
				$this->load->library ( "aws_sdk" );
				$file_name = "file-" . mt_rand () . "-" . microtime () . $upload_data ['file_ext'];
				$aws_url = "";
				try {
					$aws_url = $this->aws_sdk->saveObjectInBucket ( array (
							'Prefix' => 'client-logo-upload',
							'Key' => $file_name,
							'SourceFile' => $upload_data ['full_path']
					) );
				} catch ( Exception $e ) {
					log_message ( 'error', $e->getMessage () );
				}
				//echo "aws url is...".$aws_url;
				//exit;
				if (! empty ( $aws_url ))  
					return $aws_url;
				else 
					return FALSE;
			} else {
				//echo "in else";
				//echo "in wrong file upload";
				return FALSE;
				//echo  $this->upload->display_errors ();
				//exit;
			}	
		}
		public function getPartners() {
			$partners = array();
			$cache_key = "partners-list";
			if (! $partners = $this->cache->get ( $cache_key )) {
				$data = $this->service->get ( "admin/service/partner/list", array (
						"email" => $this->super_user
				) );
				if ($data->status->code == 200 && ! empty ( $data->partners )) {
					$partners = $data->partners;
					$this->cache->save ( $cache_key, $partners, Service_Model::$CACHE_EXPIRY_TIME );
				}
			}
			return $partners;
		}
	}
