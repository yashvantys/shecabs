<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Users extends Authentication_Controller {
	
	public function __construct() {
		parent::__construct ();
		// Loading required Libraries, Models
		$this->load->model ( "users_model" );
		$this->add_library ( "users" );
		$this->load->library ( "aws_sdk" );
		$baseDomain = $this->config->item ( "base_url" );
		$loginlink = $baseDomain.'/user/index';
		$this->add_library ( "datetime" );
		
	}
	
	/**
	 |--------------------------------------------------------------------------
	 | Users Management Form Filter for Grid
	 |--------------------------------------------------------------------------
	 | Method Name:  index.
	 | Parameters:  null
	 | Return Type:  null
	 | Description:  This is the default method of this controller and it will be called if no methods
	 | are passed.  As a default method,  this method is used to display user management screen.
	 |
	 */
	
	public function index(){
		
		$manageUsers = false;
		if ($this->user_model->hasPermission ('PERM_USER_MANAGEMENT',$this->session->userdata['permissions'])){
			$manageUsers = true;
		}
		
		if($manageUsers) {
			$this->template->write ( 'page_title', 'User Management' );
			$this->add_library ( "users" );
			$this->add_library ( "datatables" );
			$this->add_library ( "select2" );
			$this->add_library ( "blockUI" );
			
			$this->add_js_functions ( array ('Users.home' => array ()) );
						
			$this->data = array ();
			
			$this->data ['searchform'] = $this->users_model->ClientDropdownForm ();
			$this->data ['manageUsers'] = $manageUsers;
			
			$this->data ['adduserform'] = $this->users_model->newUserAddForm();
			$this->data ['form'] = $this->users_model->UserAddForm ( );
			
			
			$this->template->write_view ( 'content', 'users/home', $this->data );
			$this->template->render ();
		} else
			$this->template->write_view ( 'content', 'Sorry, you don\'t have access to Load Users module. Please contact the administrator.' );
	}
	
	/**
	 |--------------------------------------------------------------------------
	 | Users Management list Page
	 |--------------------------------------------------------------------------
	 | Method Name:  list_ajax
	 | Parameters:  null
	 | Return Type:  null
	 | Description:  This is the default method of this controller and it will be called if no methods
	 | are passed.  As a default method,  this method is used to display Users Management screen.
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
		
				
		$manageUsers = false;
		if ($this->user_model->hasPermission ('PERM_USER_MANAGEMENT',$this->session->userdata['permissions'])){
			$manageUsers = true;
		}
		
		$postDataArray = $this->input->post();
		$clientId = json_decode($postDataArray['data'],true);
			
		$userId =$this->session->userdata['userId'];
		if(!empty($clientId)){
			$client_id = $clientId['clientsdrop'];
		}else{
			$client_id ='';
		}
				
		$response = $this->users_model->getUsersList ( $this->input->post(null,true), $this->getEmail (), $start, $limit, $sort_column, $direction, $search );
		//echo "<pre>";
		//print_r($response);	
		//echo "</pre>";exit;
		if (! empty ( $response )) {
				$i=1;
					foreach ( $response->result as $userlist ) {
						$uClients ='';
						$userClients='';
						$reasons = $userlist->rejectReason;
						if($reasons == 'Other')
							$reasonText = $userlist->rejectReasonOthers;
						else 
							$reasonText = $reasons;
						
						$userClients = @$userlist->assignedClients;
						if(!empty($userClients)){
							$uClients = implode(', ',$userClients);
						}
																			
						$data [] = array (
						"DT_RowId" => 'row_'.$i,
						"email" => $userlist->email,
						"id" => $userlist->id,
						"name" => ucwords($userlist->userName),
						"role" => $userlist->role,
						'userRole'=>$manageUsers,
						"clientid"=>$client_id,
						'currentUser'=>$userId,
						'Clientstatus'=>$userlist->activeClient,
						'accountstatus'=>$userlist->stormpathStatus,
						'clients'=>'',
						'firstName'=>$userlist->firstName,
						'lastName'=>$userlist->lastName,
						'reason'=>$reasonText,
						'clientlist'=>$userlist->clients,
						'Clientreg'=>@$userlist->clientList[0]->id."|".@$userlist->clientList[0]->clientId,
						'assignedClients'=>$uClients,
						'reportScheduled'=>$userlist->reportScheduled
						
						
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
	
	/*
	 |--------------------------------------------------------------------------
	 | Users Management Delete
	 |--------------------------------------------------------------------------
	 | Method Name:  delete.
	 | Parameters:  id
	 | Return Type:  json data
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the users management active/inactive.
	 |
	 */
	
function delete() {
	$baseDomain = $this->config->item ( "base_url" );
	$loginlink = $baseDomain.'/user/index';
	$emailSend = $this->config->item ( "email_send" );
	
			
		if ($this->input->post ()) {
			$clients= $this->input->post ( 'clientId' ,TRUE);
			$activestatus = $this->input->post ( 'status' ,TRUE);
			$emailto = $this->input->post ( 'user_email' ,TRUE);
			$firstName = $this->input->post ( 'firstName' ,TRUE);
			$lastName = $this->input->post ( 'lastName' ,TRUE);
			$UserClients = $this->input->post ( 'UserClients' ,TRUE);
			$adminEmail = $this->session->userdata ( 'email');
			$adminName = $this->session->userdata('name');
			
		
			
			if($firstName)
			  $uName = 'Hi '. ucfirst($firstName);
			else 
				$uName = 'Hi';
			
				
			if(!empty($clients)){
				$UserClients = array($clients);
				$inactive = 0;
			}else {
				$UserClients = array();
				$inactive = 1;
			}
			
				
			
				
									
			if($activestatus == 1){ // activating user
				$flag = 1;
				$active = true;
				
			}else{// inactivating user
				$flag = 2;
				$active = false;
			}
			
			$useremails = array();
			$site_name = $this->getUserVendor($emailto);
			
						
			$clientEmails = $this->getClientAdminEmails($UserClients,$emailto,$inactive);
			
			
						
			
			if(!empty($clientEmails)){
				$client_adminEmails = explode(",",$clientEmails);
				foreach($client_adminEmails as $sendemails) //loop over values
				{
					// all client admin emails
					$useremails[]= $sendemails;
				}
			
			}
			
			
			
			
						
			if($flag == 1){
				$subject = 'Account Activated';
				$subject_admin = 'User Account Activated';
				$html_message ='<p>'.$uName.',</p>
							<p>Your account is now active.  Please login to '.$site_name.'&nbsp;to start using the system.</p>
							<p></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
							<p>If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
				
				$html_message_admin ='<p>Hi,</p>
						    <p>We thought you would like to know that a user account was activated for '.$site_name.'.</p>
						    <p>Activated user is <b>'.$firstName.' '.$lastName.'</b></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
						    <p>No action is required from you unless you believe this is an error. If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
			}else {
				$subject = 'Account Inactivated';
				$subject_admin = 'User Account Inactivated';
				$html_message ='<p>'.$uName.',</p>
							<p>Your login to '.$site_name.'&nbsp;has been suspended.</p>
							<p></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
							<p>If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
				$html_message_admin ='<p>Hi,</p>
						    <p>We thought you would like to know that a user account was inactivated for '.$site_name.'.</p>
						    <p>Inactivated user is <b>'.$firstName.' '.$lastName.'</b></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
						    <p>No action is required from you unless you believe this is an error. If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
			}
			
						
			if(!empty($clients))
				$clients = array($clients);
			else 
				$clients = array();
			
				
			$result = $this->users_model->deleteUsers ( $this->input->post ( 'user_id' ,TRUE) ,$this->input->post ( 'user_email' ,TRUE),$active,$clients);
			
			
			
			if (isset ( $result->statusCode ) && $result->statusCode == 200) {
				// send email to user
				if($emailSend){
					$this->aws_sdk->sendEmail(array($emailto),array(),$subject,$html_message);
					// send email to client Admin
					if(count($useremails)>0)
						$this->aws_sdk->sendEmail(array(),$useremails,$subject_admin,$html_message_admin);
				}
			
			}
			print json_output ( $result );
			
		} else {
			print json_output ( array (
					"status" => array (
							"code" => 401
					)
			) );
		}
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | User Delete
	 |--------------------------------------------------------------------------
	 | Method Name:  deleteUser.
	 | Parameters:  id
	 | Return Type:  json data
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the users management delete.
	 |
	 */
	function deleteUser() {
	
		if ($this->input->post ()) {
			$deluserDb = $this->input->post ( 'usr_del_db' ,TRUE);
			$result = $this->users_model->deleteSPUsers ( $this->input->post ( 'user_email' ,TRUE),$this->input->post ( 'user_id' ,TRUE),$deluserDb);
					
			print json_output ( $result );
		} else {
			print json_output ( array (
					"status" => array (
							"code" => 401
					)
			) );
		}
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Users Management edit info
	 |--------------------------------------------------------------------------
	 | Method Name:  ajax_edit.
	 | Parameters:  id
	 | Return Type:  json data
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Users Management edit.
	 |
	 */
	
	public function ajax_edit()
	{
		//$result = array();
		
		$clientArray = array();
		$email = $this->input->post ( 'email' ,TRUE);
		$id = $this->input->post ( 'id' ,TRUE);
		$firstname = $this->input->post ( 'firstname' ,TRUE);
		$lastname = $this->input->post ( 'lastname' ,TRUE);
		$status = $this->input->post ( 'status' ,TRUE);
		$clientId = $this->input->post ( 'clientList' ,TRUE);
		$clientsVal = @explode('|',$clientId);
		
		$clientArray['clientId'] = @$clientsVal[1];
		$clientArray['id'] = @$clientsVal[0];
		
		if(isset($id) && $id !=0){
			$data = $this->users_model->getDetails($email);
			//print_r($data);
		}else{
			
			$result['result'] = array('firstName'=>$firstname,'lastName'=>$lastname,'email'=>$email,'status'=>$status,'clientList'=>array(),'roleId'=>'');
			$result['statusCode'] = '200';
			$result['statusText'] = 'Success';
			$data = (object) $result;
		}
		//$data = $this->users_model->getDetails($email);
		
		//print_r($data);
		print json_output ( $data );
	
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Users Management add
	 |--------------------------------------------------------------------------
	 | Method Name:  add.
	 | Parameters:  email,clients,role,password,firstName,lastName
	 | Return Type:  json data
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Users Management add.
	 |
	 */
	
	public function add() {
		$baseDomain = $this->config->item ( "base_url" );
		$loginlink = $baseDomain.'/user/index';
		$adminEmail = $this->session->userdata ( 'email');
		$adminName = $this->session->userdata('name');
		$emailSend = $this->config->item ( "email_send" );
		$productId='';
		$productarr=array();
		if ($this->input->post ()) {
			
											
			$postData = array ();
			$role = trim($this->input->post ( 'roleadd' ,TRUE));
			
			if($role == 1 || $role == 2 || $role == 3){
				$clients = $this->users_model->getClients();
					if (isset ( $clients->statusCode ) && $clients->statusCode == 200) {
						if ( !empty($clients->result))
							foreach($clients->result as $client) {
								if(!empty($client)){
									$clientsdata[] = $client->id;
									
								}
							}
						}
				
				$postData ['clients'] = $clientsdata;
			}else if($role == 8 || $role == 9){	
				$productarr = $this->users_model->getSourceProductsOfUser();
				if(!empty($productarr['pidBHA'])){
				$productId = $productarr['pidBHA'];
				$clients = $this->users_model->getClients($productId);
				if (isset ( $clients->statusCode ) && $clients->statusCode == 200) {
					if ( !empty($clients->result))
						foreach($clients->result as $client) {
							if(!empty($client)){
								$clientsdata[] = $client->id;
									
							}
						}
				}
				}else{
					$clientsdata[] = '';
				}
				
				$postData ['clients'] = $clientsdata;
				
			}else{ 
					$client_default  = explode('|',$this->input->post ( 'clientnew' ,TRUE));
					$postData ['clientList'][0]['clientId'] = $client_default[1];
					$postData ['clientList'][0]['avatars'] = $this->input->post ( 'avatars' ,TRUE);
					
			
			$dynamicData = $this->input->post ( 'addSectionCountnew' ,TRUE);
			$clientsDynamic = array();
			$avatarDynamic = array();
			$j=1;
			$client_default_new = array();
			$dynamicClientId = array();
			for($i=1;$i<=$dynamicData;$i++){
								
				if($this->input->post ( 'client'.$i ,TRUE)) {
					
					
					$client_default_new[$j]  = explode('|',$this->input->post ( 'client'.$i ,TRUE));
					$dynamicClientId[] = $client_default_new[$j][0];
					
					$postData ['clientList'][$j]['clientId'] = $client_default_new[$j][1];
					$postData['clientList'][$j]['avatars'] = $this->input->post ( 'avatar'.$i ,TRUE); 
					
					++$j;
				}
				
								
			}
							
			
			$clientVal = array_merge(array(@$client_default[0]),@$dynamicClientId);
			$postData ['clients'] = @$clientVal;
			
			}
				
			$permissions = $this->input->post ( 'chk_permission' ,TRUE);
			$client_permission = $this->input->post ( 'chk_permission_client' ,TRUE);
						
			if($role == 8 || $role == 9){
				$postData ['permissions'] =  array();
			}else if($role == 1 || $role == 2 || $role == 3 || $role == 4){
				if(!empty($permissions) && !empty($client_permission))
						$postData ['permissions'] =  array_merge(@$permissions,@$client_permission);
					else if(!empty($permissions) && empty($client_permission))
						$postData ['permissions'] =  @$permissions;
					else if(empty($permissions) && !empty($client_permission))
						$postData ['permissions'] =  @$client_permission;
					else if(empty($permissions) && empty($client_permission))
						$postData ['permissions'] =  array();
			}else if($role == 5 || $role == 6 || $role == 7){
				if(!empty($permissions))
						$postData ['permissions'] =  @$permissions;
					else
						$postData ['permissions'] =  array();
			}
			
			$postData ['email'] = trim($this->input->post ( 'emails' ,TRUE));
			$postData ['roleId'] = trim($this->input->post ( 'roleadd' ,TRUE));
			$postData ['password'] = trim($this->input->post ( 'passwords' ,TRUE));
			$postData ['firstName'] = trim($this->input->post ( 'firstnames' ,TRUE));
			$postData ['lastName'] = trim($this->input->post ( 'lastnames' ,TRUE));
			$postData ['passwordRequired'] = true;
			$bf_product = $this->input->post ( 'chk_products_add' ,TRUE);
			
			
			$productcount = $this->input->post ( 'productcount' ,TRUE);
			$productId = $this->input->post ( 'productId' ,TRUE);
			$levelproduct = @explode(',',$productId);
			
						
			
			
			if($productcount > 1){
				if($role == 8 || $role == 9){
					$first = $levelproduct[0];
					$second = $levelproduct[1];
					if($first > $second)
						$bhaproduct = $first;
					else 
						$bhaproduct = $second;
					
					$postData ['products'] = array($bhaproduct);
				}else{
				    $postData ['products'] = $bf_product;
				}
			}else{
				
				$postData ['products'] = array($productId);
				
			}
			
																											
			$savedUserDetail = $this->users_model->saveUserDetails ($postData);
			
								
			$useremails = array();
				
			if (isset ( $savedUserDetail ) && $savedUserDetail->statusText == 'Success' &&
					$savedUserDetail->statusCode == 200 ) {
						$site_name = $this->getUserVendor($postData ['email']);
						
						$clientEmails = $this->getClientAdminEmails($postData ['clients'],$postData ['email'],0);
						// send email to client admin
						$html_message_other ='<p>Hi,</p>
										<p>A new account has been registered for '.$site_name.'.<p>
										<p>Registered user is <b>'.$postData ['firstName'].' '.$postData ['lastName'].'</b></p>
										<p><a href="'.$loginlink.'">Go to login page</a></p>
										<p>If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
										<br>
										- '.$site_name.' Team';
						if(!empty($clientEmails)){
							$client_adminEmails = explode(",",$clientEmails);
							foreach($client_adminEmails as $sendemails) //loop over values
							{
								// send email to user
								$useremails[]= $sendemails;
							}
								
						}
						
							if($emailSend){
									if(count($useremails)>0)
										$this->aws_sdk->sendEmail(array(),$useremails,'New Registration for '.$site_name.'',$html_message_other);
							}				
						print json_output ( $savedUserDetail );
	
					}else{
						$this->set_message ( $savedUserDetail->statusText, 'error' );
						$result ['error'] = $savedUserDetail->statusText;//"Sorry, there is an error processing your request. Please try again later";
						$this->session->set_flashdata('error', 'There is an unexpected error');
						print json_output ( $result );
					}
					
		}
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Users Management Edit
	 |--------------------------------------------------------------------------
	 | Method Name:  edit.
	 | Parameters:  email,clients,role,password,firstName,lastName
	 | Return Type:  json data
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Users Management edit.
	 |
	 */
	
	function edit() {
		$adminEmail = $this->session->userdata ( 'email');
		$adminName = $this->session->userdata('name');
		$baseDomain = $this->config->item ( "base_url" );
		$loginlink = $baseDomain.'/user/index';
		$emailSend = $this->config->item ( "email_send" );
		if ($this->input->post ()) {
			
					
			$postData = array ();
			$clientsdata = array();
			$clientsessiondata = array();
			$previousclients = array();
			$role = trim($this->input->post ( 'role' ,TRUE));
			$flag = $this->input->post ( 'flag' ,TRUE);
						
			if ( !empty($this->session->userdata['clients'])){
					foreach($this->session->userdata['clients'] as $client) {
						if(!empty($client))
							$clientsessiondata[] = $client;
					}
			}
			
			if($flag != 1){			
						
			if($role == 1 || $role == 2 || $role == 3){
				$clients = $this->users_model->getClients();
					if (isset ( $clients->statusCode ) && $clients->statusCode == 200) {
						if ( !empty($clients->result))
							foreach($clients->result as $client) {
								if(!empty($client))
									$clientsdata[] = $client->id;
							}
						}
				
					$postData ['clients'] = $clientsdata;
			}else if($role == 8 || $role == 9){
				$productarr = $this->users_model->getSourceProductsOfUser();
				if(!empty($productarr['pidBHA'])){
					$productId = $productarr['pidBHA'];
					$clients = $this->users_model->getClients($productId);
					if (isset ( $clients->statusCode ) && $clients->statusCode == 200) {
						if ( !empty($clients->result))
							foreach($clients->result as $client) {
								if(!empty($client)){
									$clientsdata[] = $client->id;
										
								}
							}
					}
				}else{
					$clientsdata[] = '';
				}
				
				$postData ['clients'] = $clientsdata;
			}else{
					$client_default  = explode('|',$this->input->post ( 'client' ,TRUE));
					if($client_default){
						if(@$client_default[1]){
							$postData ['clientList'][0]['clientId'] = @$client_default[1];
							$postData ['clientList'][0]['avatars'] = $this->input->post ( 'avatars' ,TRUE);
						}
					}	
					
				$dynamicData = $this->input->post ( 'addSectionCount' ,TRUE);
				$clientsDynamic = array();
				$avatarDynamic = array();
				$j=1;
				$client_default_new = array();
				$dynamicClientId = array();
				for($i=1;$i<=$dynamicData;$i++){
				
					if($this->input->post ( 'client'.$i ,TRUE)) {
													
						$client_default_new[$j]  = explode('|',$this->input->post ( 'client'.$i ,TRUE));
						$dynamicClientId[] = $client_default_new[$j][0];
							
						if($client_default_new[$j]){
							$postData ['clientList'][$j]['clientId'] = $client_default_new[$j][1];
							$postData['clientList'][$j]['avatars'] = $this->input->post ( 'avatar'.$i ,TRUE);
						}	
						++$j;
					}
				
				
				}
				
				$clientVal = array_merge(array(@$client_default[0]),@$dynamicClientId);
			    $postData ['clients'] = @$clientVal;
				
		   }
		   
		   $postData ['roleId'] = trim($this->input->post ( 'role' ,TRUE));
		}else{
			$postData ['roleId']= $this->session->userdata['role'];
			$postData ['clients'] = $clientsessiondata;
		}
						
			$postData ['id'] = $this->input->post ( 'usersid' ,TRUE);
			$postData ['email'] = trim($this->input->post ( 'email' ,TRUE));
			$permissions = $this->input->post ( 'chk_permission' ,TRUE);
			$client_permission = $this->input->post ( 'chk_permission_client' ,TRUE);
			if($role == 8 || $role == 9){
				$postData ['permissions'] =  array();
			}else if($role == 1 || $role == 2 || $role == 3 || $role == 4){
					if(!empty($permissions) && !empty($client_permission))
						$postData ['permissions'] =  array_merge(@$permissions,@$client_permission);
					else if(!empty($permissions) && empty($client_permission))
						$postData ['permissions'] =  @$permissions;
					else if(empty($permissions) && !empty($client_permission))
						$postData ['permissions'] =  @$client_permission;
					else if(empty($permissions) && empty($client_permission))
						$postData ['permissions'] =  array();
			}else if($role == 5 || $role == 6 || $role == 7){
					if(!empty($permissions))
						$postData ['permissions'] =  @$permissions;
					else 
						$postData ['permissions'] =  array();
			}
			
			$postData ['firstName'] = trim($this->input->post ( 'firstname' ,TRUE));
			$postData ['lastName'] = trim($this->input->post ( 'lastname' ,TRUE));
			$newpass = trim($this->input->post ( 'newpassword' ,TRUE));
			
			$fullname = trim($this->input->post ( 'firstname' ,TRUE))." ".trim($this->input->post ( 'lastname' ,TRUE));
			
			if(!empty(trim($newpass)))
				$postData ['password'] = $this->input->post ( 'newpassword' ,TRUE);
			
			
			$rolesId = trim($this->input->post ( 'rolesId' ,TRUE));
			
			$status = trim($this->input->post ( 'reasonstatus' ,TRUE));
							
			if($rolesId != 0)
				$postData ['roleId'] = $rolesId;
			
			$postData ['passwordRequired'] = false;
			
			
			$flag = $this->input->post ( 'flag' ,TRUE);
			
			$previousclients = @explode(',',$_POST['previousclients']);
			
			$uniqueClients = array();
			$client_adminEmails=array();
			
			if(!empty($previousclients[0]))									
				$uniqueClients = array_diff( $postData ['clients'], $previousclients ) ;
			
			
						
			if($uniqueClients)
				$clientEmails = $this->getClientAdminEmails($uniqueClients,$postData ['email'],0);
			
				if(!empty($clientEmails)){
					$client_adminEmails = explode(",",$clientEmails);
					
				}
				
				
				$bf_product = $this->input->post ( 'chk_products' ,TRUE);
				$productcount = $this->input->post ( 'productcount' ,TRUE);
				$productId = $this->input->post ( 'productId' ,TRUE);
				$levelproduct = @explode(',', $productId);
					
			
			
			if($status != 'reject'){
				if($productcount > 1){
					if($role == 8 || $role == 9){
						$first = $levelproduct[0];
						$second = $levelproduct[1];
							if($first > $second)
								$bhaproduct = $first;
							else
								$bhaproduct = $second;
									
						$postData ['products'] = array($bhaproduct);
						
						//$postData ['products'] = array(2);
						
					}else{ 
						$postData ['products'] = $bf_product;
					}
				}else{
					
					 $postData ['products'] = array($productId);
					
				}
				
			}
		
								
						
			if($postData['id'] != 0){
				$savedUserDetail = $this->users_model->updateUserDetails ($postData);
			
			}else{ 
				
				if($status == 'reject'){
					$postData ['reasons'] = $this->input->post ( 'reasons' ,TRUE);
					$postData ['reason_text'] = $this->input->post ( 'reason_text' ,TRUE);
					$savedUserDetail = $this->users_model->rejectUsers($postData);
				}else{
					
					$savedUserDetail = $this->users_model->saveUserDetails ($postData);
				}
			}
			
							
			if (isset ( $savedUserDetail ) && $savedUserDetail->statusText == 'Success' &&
					$savedUserDetail->statusCode == 200 ) {
						// call service to get client_admin emails
																			
						$site_name = $this->getUserVendor($postData ['email']);
						if($status == 'approve'){
						
							$html_message ='<p>Hi '.ucfirst($postData ['firstName']).',</p>
							<p>Your account is now active.  Please login to '.$site_name.' to start using the system.</p>
							<p></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
							<p>If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
						
							// send email to user
							if($emailSend){
								$this->aws_sdk->sendEmail(array($postData ['email']),array(),'Account Activated',$html_message);
							}					
					
							// send email to client admin
							$html_message_other ='<p>Hi,</p>
										<p>We thought you would like to know that a user account was approved for '.$site_name.'.</p>
										<p>Approved user is <b>'.$postData ['firstName'].' '.$postData ['lastName'].'</b></p>
							    		<p><a href="'.$loginlink.'">Go to login page</a></p>
										<p>No action is required from you unless you believe this is an error. If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
										<br>
										- '.$site_name.' Team';
							$adminemails = array();
							foreach($client_adminEmails as $sendemails) //loop over values
							{
								// send email to user
								$adminemails[]= $sendemails;
							}
								if($emailSend){
									if(count($adminemails)>0)
										$this->aws_sdk->sendEmail(array(),$adminemails,'User Account Approved',$html_message_other);
								}
							
						
						}
												
						
						if($status == 'reject'){
							$clientEmails_reject = $this->getClientAdminEmails('',$postData ['email'],0);
							$html_message ='<p>Hi '.ucfirst($postData ['firstName']).',</p>
							<p>We were unable to confirm your registration information.</p>
							<p></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
							<p>If you believe this is in error, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
							
							$html_message_admin ='<p>Hi,</p>
												  <p>We thought you would like to know that a user account was rejected for '.$site_name.'.</p>
												  <p>Rejected user is <b>'.$postData ['firstName'].' '.$postData ['lastName'].'</b></p>
							    				  <p><a href="'.$loginlink.'">Go to login page</a></p>
												  <p>No action is required from you unless you believe this is an error. If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
												  <br>
									- '.$site_name.' Team';
							// send email to user	
							if($emailSend){
								$this->aws_sdk->sendEmail(array($postData ['email']),array(),'User Account Rejected',$html_message);
							}
							// send email to Admin
							$rejectedadminemails = array();
							if(!empty($clientEmails_reject)){
								$client_adminEmailsReject = explode(",",$clientEmails_reject);
								foreach($client_adminEmailsReject as $sendemails) //loop over values
								{
									// send email to user
									$rejectedadminemails[]= $sendemails;
								}
								
								if($emailSend){
									if(count($rejectedadminemails)>0)
										$this->aws_sdk->sendEmail(array(),$rejectedadminemails,'User Account Rejected',$html_message_admin);
								}
							}
							
							
						}
						if($status == 'edit'){
							
							$html_message_admin ='<p>Hi,</p>
							<p>We thought you would like to know that a user account was approved for '.$site_name.'.</p>
							<p>Approved user is <b>'.$postData ['firstName'].' '.$postData ['lastName'].'</b></p>
							<p><a href="'.$loginlink.'">Go to login page</a></p>
							<p>If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
							<br />
							- '.$site_name.' Team';
							// send email to user
							 //$this->aws_sdk->sendEmail(array($postData ['email']),'','Account Activated',$html_message_admin);
							// send email to Clients Admin
							
							if(!empty($clientEmails)){
								
								$html_message ='<p>Hi '.ucfirst($postData ['firstName']).',</p>
								<p>Your account is now active.  Please login to '.$site_name.' to start using the system.<p>
								<p></p>
							    <p><a href="'.$loginlink.'">Go to login page</a></p>
								<p>If you have any questions or concerns, please reach out to us at 844-225-8155 or <a href="mailto:support@binaryfountain.com">support@binaryfountain.com</a></p>
								<br />
								- '.$site_name.' Team';
								
								// send email to user
								if($emailSend){
									//$this->aws_sdk->sendEmail(array($postData ['email']),array(),'Account Activated',$html_message);
								}
								$client_adminEmails = explode(",",$clientEmails);
								$userupdateemails = array();
								foreach($client_adminEmails as $sendemails) //loop over values
								{
									// send email to user
									$userupdateemails[]= $sendemails;
								}
								if($emailSend){
									if(count($userupdateemails)>0)
										$this->aws_sdk->sendEmail(array(),$userupdateemails,'User Account Activated',$html_message_admin);
								}
							}
							
						}
						
						print json_output ( $savedUserDetail );
	
					}else{
						$this->set_message ( $savedUserDetail->statusText, 'error' );
						$result ['error'] = $savedUserDetail->statusText;//"Sorry, there is an error processing your request. Please try again later";
						print json_output ( $result );
					}
						
		}
	
	}
	
	/*
	 |--------------------------------------------------------------------------
	 | Users Management View
	 |--------------------------------------------------------------------------
	 | Method Name:  view.
	 | Parameters:  null
	 | Return Type:  json data
	 | Typically, it will be within your application path.
	 | Also, writing permission is required within the Users Management view.
	 |
	 */
	function view() {
		$userId = $this->session->userdata['uemail'];
		$this->template->write ( 'page_title', 'User Management' );
		$this->add_library ( "users" );
		$this->add_library ( "datatables" );
		$this->add_library ( "select2" );
			
		$this->add_js_functions ( array (
				'Users.home' => array (
							
				)
		) );
		
		$this->data = array();
		$users = $this->users_model->getDetails($userId);
		
		if (isset ( $users ) && $users->statusText == 'Success' &&
				$users->statusCode == 200 ) {
									
					$this->data['role'] = $users->result->role;
					$this->data['firstName'] = $users->result->firstName;
					$this->data['lastName'] = $users->result->lastName;
					$this->data['email'] = $users->result->email;
					$this->data['roleId'] = $users->result->roleId;
					$this->data['id'] = $users->result->id;
					
				}
		
		$this->data ['form'] = $this->users_model->UserAddForm ( );
		$this->template->write_view ( 'content', 'users/view', $this->data );
		$this->template->render ();
	}
	
	/**
	 * To get Avatar drop down list
	 */
	
	public function getAvatarlist($clientId)
	{
		$avatarGroupsArray = array();
		$withAjax = true;
		$avatarGroupsArray = $this->users_model->getAvatar($clientId , $withAjax);
		echo json_encode($avatarGroupsArray);
		
	}
	
	public function getClientsAjax($clientId){
		$ClientArray = $this->users_model->getClientsAjax($clientId);
		echo json_encode($ClientArray);
	}
	
	
	public function getUserVendor($userid){
		return $this->users_model->getUserVendor($userid);
	}
	
	public function getClientAdminEmails($clients,$email,$active){
		return $this->users_model->getClientAdminEmails($clients,$email,$active);
	}
	
	public function profileupdate() {
		
		$formData = $this->input->post();
		$postData = array ();
		$postData['firstName'] = trim($this->input->post ( 'firstname' ,TRUE));
		$postData['lastName'] = trim($this->input->post ( 'lastname' ,TRUE));
		$postData['email'] = trim($this->input->post ( 'email' ,TRUE));
		$postData['roleId'] = trim($this->input->post ( 'rolesId' ,TRUE));
		
		$fullname = trim($this->input->post ( 'firstname' ,TRUE))." ".trim($this->input->post ( 'lastname' ,TRUE));
		$savedUserDetail = $this->users_model->updateUserProfile ($postData);
		
		
		if (isset ( $savedUserDetail ) && $savedUserDetail->statusText == 'Success' &&
				$savedUserDetail->statusCode == 200 ) {
					$this->session->set_userdata('name', $fullname);
					print json_output ( $savedUserDetail );
				}
		
	}
	
	public function selfprofile_edit()
	{
		$this->add_library ( "select2" );
		$email = $this->input->post ( 'email' ,TRUE);
		
		$getdata = $this->users_model->getDetails($email);
		$this->data = array ();
		$this->data ['profilepopup'] = $this->users_model->selfProfile($getdata);
					
		print json_output ( $this->data );
	
	}
	
	
	public function user_add()
	{
			
		$clientId = $this->input->post ( 'id' ,TRUE);
		$this->add_library ( "users" );
		$this->add_library ( "datatables" );
		$this->add_library ( "select2" );
		$this->add_library ( "blockUI" );
		$this->data = array ();
		//$this->data ['useraddpopup'] = $this->users_model->newuseraddForm($clientId);
						
		print json_output ( $this->data );
	
	}
	
	public function schedule(){
		
		$formData = $this->input->post();
		$user_id = $this->input->post ( 'user_id' ,TRUE);
		$user_email = $this->input->post ( 'user_email' ,TRUE);
		$this->add_library ( "datetime" );
		$this->template->write ( 'page_title', 'Schedule Report' );
			
		$this->data = array ();
		//$scheduleArray = $this->users_model->getUserSchedule($user_id);
			
		
		$this->data ['scheduleform'] = $this->users_model->getReportScheduleForm($user_id,$user_email);
		/*
		 * Sending the data to View Part for final display.
		 * */
		
		print json_output ( $this->data );
	}
	
	public function reportschedule(){
		
		$postData = array();
		if ($this->input->post ()) {
			$postData['reportConfigId'] = $this->input->post ( 'report_type' ,TRUE);
			$postData['clientId'] = $this->input->post ( 'clientsreport' ,TRUE);
			$jobId = $this->input->post ( 'jobId' ,TRUE);
			
			$postData['userId'] = $this->input->post ( 'userId' ,TRUE);
			$postData['id'] = $jobId;
			$frequency = $this->input->post ( 'schedule_frequency' ,TRUE );
			$time = (strlen ( $this->input->post ( 'endDate' ) ) == 4) ? "0" . $this->input->post ( 'endDate' ) . ":00" : $this->input->post ( 'endDate' ) . ":00";
			$default_zone = date_default_timezone_get ();
			date_default_timezone_set ( "UTC" );
			//$postData ['time'] = date ( "H:i:s", strtotime ( $time ) );
			$time = date ( "H:i", strtotime ( $time ) );
			date_default_timezone_set ( $default_zone );
			if ($frequency == "w") {
				$postData ['dayOfWeek'] = $this->input->post ( 'schedule_day_of_week' ,TRUE);
			} else if ($frequency == "m" || $frequency == "q" || $frequency == "y") {
				$postData ['dayOfMonth'] = $this->input->post ( 'schedule_day_of_month',TRUE );
			}
			//$postData ['nextRunDate'] = date ( "d-m-Y H:i:s" );
			$postData ['jasperJobId']= 0;
			$jasperJobId = $this->input->post ( 'jasperJobId',TRUE );
			if($jasperJobId)
				$postData ['jasperJobId']= $jasperJobId;
			if ($frequency == "d") {
				$postData ['dataPeriod'] = 0;
			}
			//$postData ['schedule_frequency'] = $frequency;
			
			$postData ['jobSchedulerConfig'] = array('time'=>$time,'day'=>$this->input->post ( 'schedule_day_of_month' ,TRUE),'frequencyType'=>'Monthly');
	
			$postData ['vendorName'] = $this->session->userdata ( 'logintitle' );
			
			$domain_var= $this->config->item('prefix_domain');
			// get the actual vendor
			$actVendor = '';
			$actVendor = $this->user_model->getActualVendor();
			
			
			
			if ( !empty($actVendor))
				if ( $domain_var!= $actVendor)
					$domain_var = $actVendor;
			
			
			$postData ['vendorKey'] = $domain_var;
			
																				
			$savedUserscheduleDetail = $this->users_model->saveUserSchedule ($postData, $jobId);
			
					
				if (isset ( $savedUserscheduleDetail ) && $savedUserscheduleDetail->statusText == 'Success' &&
						$savedUserscheduleDetail->statusCode == 200 ) {
							
						print json_output ( $savedUserscheduleDetail );
							
				}else{
						$this->set_message ( $savedUserscheduleDetail->statusText, 'error' );
						$result ['error'] = $savedUserscheduleDetail->statusText;//"Sorry, there is an error processing your request. Please try again later";
						$this->session->set_flashdata('error', 'There is an unexpected error');
						print json_output ( $result );
				}
			
		}
		
		
	}
	
	public function deleteschedule(){
	
	if ($this->input->post ()) {
				$result = $this->users_model->deleteUserschedule ( $this->input->post ( 'jobid' ,TRUE));
				print json_output ( $result );
		} else {
			print json_output ( array (
					"status" => array (
							"code" => 401
					)
			) );
		}
	}
	
	public function getschedule(){
	
		if ($this->input->post ()) {
			$result = $this->users_model->getUserSchedule ( $this->input->post ( 'userId' ,TRUE),$this->input->post ( 'clientId' ,TRUE),$this->input->post ( 'Reporttype' ,TRUE));
					
			print json_output ( $result );
		} else {
			print json_output ( array (
					"status" => array (
							"code" => 401
					)
			) );
		}
	}
	
	
	
	
}
