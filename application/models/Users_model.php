<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Users_Model extends CI_Model {
	public static $SERVICE_USER_DELETE = 'survey-compass/services/user/delete/';
	public static $SERVICE_USER_LIST = 'survey-compass/services/user/list';
	public static $SERVICE_CLIENT_LIST ='survey-compass/services/client/list';
	public static $SERVICE_USER_ROLES ='survey-compass/services/user/roles';
	public static $SERVICE_USER_ADD ='survey-compass/services/user/add';
	public static $SERVICE_USER_DETAILS='survey-compass/services/user/info/';
	public static $SERVICE_USER_UPDATE='survey-compass/services/user/update';
	public static $SERVICE_USER_INACTIVE = 'survey-compass/services/user/updateactiveflag';
	public static $SERVICE_STORMPATH_USER_LIST = 'survey-compass/services/stormpath/user/list';
	public static $SERVICE_USER_REJECT ='survey-compass/services/stormpath/user/reject';
	public static $SERVICE_AVATAR_LIST ='survey-compass/services/client/getclientavatars/';
	public static $SERVICE_USER_STORMPATH_DELETE ='survey-compass/services/stormpath/user/delete';
	public static $SERVICE_USER_PERMISSION = 'survey-compass/services/permission/permissionsbylevel/';
	public static $SERVICE_USER_VENDOR = 'survey-compass/services/user/uservendor';
	public static $SERVICE_CLIENT_ADMIN_EMAILS = 'survey-compass/services/user/clientadmins';
	public static $SERVICE_SELF_PROFILE = 'survey-compass/services/user/selfprofileupdate';
	public static $SERVICE_PRODUCTS = 'survey-compass/services/product/productlist';
	public static $SERVICE_USER_SCHEDULE_DELETE ='survey-compass/services/user/deleteReportConfig';
	public static $SERVICE_USER_SCHEDULE_GET ='survey-compass/services/user/reportConfig';
	public static $SERVICE_USER_SCHEDULE_UPDATE ='survey-compass/services/user/updateReportConfig';
	public static $SERVICE_USER_SCHEDULE_CREATE ='survey-compass/services/user/createReportConfig';
	public static $SERVICE_USER_PRODUCTS = 'survey-compass/services/user/products';
	public static $SERVICE_USER_CLIENT_LIST = 'survey-compass/services/user/clients';
	public static $SERVICE_REPORT_TYPE_LIST ='survey-compass/services/user/reportConfig/list';
	
	
	
	
	/**
	 * Method Name:  getUsersList
	 * Parameteres:  clientid
	 * Return Type:  array
	 *
	 * Description:  This method is used to get users list.
	 *
	 * */
		
	public function getUsersList($postData, $email, $start = 0, $limit = 100, $sort_column, $direction, $search){
		$result = array ();
		
		$postDataArray = json_decode($postData['data'], true);
		
				
		isset($postDataArray['clientsdrop'])?$clientId = $postDataArray['clientsdrop']:$clientId = null;
		if($clientId == 0)
			$clientId ='';
		
		//$service_url = "{$this::$SERVICE_USER_LIST}";
		  $service_url = "{$this::$SERVICE_STORMPATH_USER_LIST}";
		
		
		$data = $this->service->get ( $service_url, array (
		), array ("start" => $start,
				"limit" => $limit,
				"sortColumn" => $sort_column,
				"direction" => $direction,
				"search" => $search,
				'clientId'=>$clientId
				
				
		) );
	
				
		   
		if ($data->statusCode == 200) {
			$result = $data;
		}
		
		
		return $result;
		
		
	}
	
	/**
	 * Method Name:  saveUserDetails
	 * Parameteres:  array
	 * Return Type:  string
	 *
	 * Description:  This method is used to save user information and return status.
	 *
	 * */
	
	public function saveUserDetails($data){
	
				
		return $this->service->post ( $this::$SERVICE_USER_ADD, array (
				'content-type' => 'application/json'
		), array (), json_encode ( $data ) );
	}
	
	/**
	 * Method Name:  updateUserDetails
	 * Parameteres:  array
	 * Return Type:  string
	 *
	 * Description:  This method is used to update user information and return status.
	 *
	 * */
	
	public function updateUserDetails($data){
		
		
		return $this->service->post ( $this::$SERVICE_USER_UPDATE, array (
				'content-type' => 'application/json'
		), array (), json_encode ( $data ) );
	}
	
	/**
	 * Method Name:  updateUserProfile
	 * Parameteres:  array
	 * Return Type:  string
	 *
	 * Description:  This method is used to update user information and return status.
	 *
	 * */
	
	public function updateUserProfile($data){
	
	
		return $this->service->post ( $this::$SERVICE_SELF_PROFILE, array (
				'content-type' => 'application/json'
		), array (), json_encode ( $data ) );
	}
	
	
	/**
	 * Method Name:  deleteUsers
	 * Parameteres:  userid
	 * Return Type:  string
	 *
	 * Description:  This method is used to delete user information and return status.
	 *
	 * */
	
	
	public function deleteUsers( $user_id,$email,$status,$clientId){
		
			if(!empty($clientId))
				$params = array('email'=>$email,'id'=>$user_id,'activeFlag'=>$status,'clients'=>$clientId);
			else 
				$params = array('email'=>$email,'id'=>$user_id,'activeFlag'=>$status);
		
				
		$service_url = "{$this::$SERVICE_USER_INACTIVE}";
		return $this->service->post ( $service_url, array (
				'content-type' => 'application/json'
		),  array(), json_encode ( $params ) );
		
	}
	
	/**
	 * Method Name:  deleteSPUsers
	 * Parameteres:  userid
	 * Return Type:  string
	 *
	 * Description:  This method is used to delete user information from stormpath and return status.
	 *
	 * */
	
	
	public function deleteSPUsers( $email,$userId,$deluserDb){
	            
		    if($deluserDb == 1){
		       	$params = array('id'=>$userId);
		    	$service_url_del = "{$this::$SERVICE_USER_DELETE}{$userId}";
		    	
		    	return $this->service->post ( $service_url_del, array (
		    			'content-type' => 'application/json'
		    	),  array(), json_encode ( $params ) );
		    	
		    }else{
		    	$params = array('email'=>$email);
		    	$service_url = "{$this::$SERVICE_USER_STORMPATH_DELETE}";
		    	return $this->service->post ( $service_url, array (
		    			'content-type' => 'application/json'
		    	),  array(), json_encode ( $params ) );
		    }
	
	}
	
	
	/**
	 * Method Name:  rejectUsers
	 * Parameteres:  userid
	 * Return Type:  string
	 *
	 * Description:  This method is used to reject user information and return status.
	 *
	 * */
	
	
	public function rejectUsers($data){
	
		  $params = array('email'=>$data['email'],'firstName'=>$data['firstName'],'lastName'=>$data['lastName'],'rejectReason'=>$data['reasons'],'rejectReasonOthers'=>$data['reason_text']);
		  $service_url = "{$this::$SERVICE_USER_REJECT}";
							
		return $this->service->post ( $service_url, array (
				'content-type' => 'application/json'
		),  array(), json_encode ( $params ) );
	
	}

	/**
	 * Method Name:  getDetails
	 * Parameteres:  userid
	 * Return Type:  array
	 *
	 * Description:  This method is used to get user information and return array.
	 *
	 * */
	
	public function getDetails($id){
		
		$service_url = "{$this::$SERVICE_USER_DETAILS}{$id}";
		return $this->service->get ( $service_url);
	}
	
	
	/**
	 * Method Name:  getAvatar
	 * Parameteres:  clientid
	 * Return Type:  array
	 *
	 * Description:  This method is used to get avatar information and return array.
	 *
	 * */
	
	public function getAvatar($client_id , $withAjax = false){
	
		$avatars = array ();
		
		$service_url = "{$this::$SERVICE_AVATAR_LIST}{$client_id}";
		$data = $this->service->get ( $service_url, array (), array () );
						
		if(!empty($data->statusCode) && $data->statusCode === 200)
		{
			$iterator = 0;
			foreach($data->result->avatars as $avatar)
			{
				if($withAjax)
				{
					$avatars[$iterator]['id'] = $avatar->id;
					$avatars[$iterator]['text'] = $avatar->name;
					$iterator++;
				}
				else
				{
					$avatars[$avatar->id] = $avatar->name;
				}
				
			}
		}
		
		
			
		return $avatars;
			
	}
	
	/**
	 * Method Name:  getPermission
	 * Parameteres:  2
	 * Return Type:  array
	 *
	 * Description:  This method is used to get permission information and return array.
	 *
	 * */
	
	public function getPermission($id,$checkedStyle=null){
	
			
		$service_url = "{$this::$SERVICE_USER_PERMISSION}{$id}";
		$data = $this->service->get ( $service_url, array (), array () );
		$html_ckeckBox = "";
		if(!empty($data->statusCode) && $data->statusCode === 200)
		{
			
			foreach($data->result as $permission)
			{
				
				/*$html_ckeckBox .= '<label class="radio-inline">
								   <input name="chk_permission[]" value="' . $permission->id . '"  id="chk_permission_'.$permission->id.'" label="'.$permission->name.'" type="radio">
								   '.$permission->name.'</label>';*/
				$html_ckeckBox .= '<input type="checkbox" id="chk_permission_'.$permission->id.'" name="chk_permission[]" value="' . $permission->id . '" class="check-permissions check-sentiments-each form-control"  />' . $permission->name . ' ';
				
				//checked="checked"
				//$html_ckeckBox .= '<input type="radio" id="chk_permission_'.$permission->id.'" name="chk_permission[]" value="' . $permission->id . '" class="radio-inline check-permissions check-sentiments-each form-control"  />' . $permission->name . ' ';
			}
		}
	
		return $html_ckeckBox;
	}
	
	/**
	 * Method Name:  getPermission
	 * Parameteres:  2
	 * Return Type:  array
	 *
	 * Description:  This method is used to get permission information and return array.
	 *
	 * */
	
	public function getPermissionClient($id,$checkedStyle=null){
	
			
		$service_url = "{$this::$SERVICE_USER_PERMISSION}{$id}";
		$data = $this->service->get ( $service_url, array (), array () );
		$html_ckeckBox = "";
		if(!empty($data->statusCode) && $data->statusCode === 200)
		{
				
			foreach($data->result as $permission)
			{
					
				/*$html_ckeckBox .= '<label class="radio-inline">
								   <input name="chk_permission_client[]" value="' . $permission->id . '"  id="chk_client_permission_'.$permission->id.'" label="'.$permission->name.'" type="radio">
								   '.$permission->name.'</label>';*/
				$html_ckeckBox .= '<input type="checkbox" id="chk_client_permission_'.$permission->id.'" name="chk_permission_client[]" value="' . $permission->id . '" class="check-permissions check-sentiments-each form-control"  />' . $permission->name . ' ';
				
				
			}
		}
	
		return $html_ckeckBox;
	}
	
	/**
	 * Method Name:  getProducts
	 * Parameteres:  
	 * Return Type:  array
	 *
	 * Description:  This method is used to get products information and return array.
	 *
	 * */
	
	public function getProducts(){
	
			
		$service_url = "{$this::$SERVICE_PRODUCTS}";
		$data = $this->service->get ( $service_url, array (), array () );
		$html_ckeckBox = "";
		$totalProduct = 0;
		//$productId = array();
		if(!empty($data->statusCode) && $data->statusCode === 200)
		{
			$totalProduct = count($data->result);
			foreach($data->result as $key => $products)
			{
				$productId[ $key] = $products->id;			
				$html_ckeckBox .= '<span id="products_'.$products->productName.'"><input type="checkbox" id="chk_productsadd_'.$products->productName.'" name="chk_products_add[]" value="' . $products->id . '" class="check-permissions check-sentiments-each form-control"  />' . $products->productName . '</span> ';
	
	
			}
			
			
		}
	
		return array($html_ckeckBox,$totalProduct,$productId);
	}
	
	/**
	 * Method Name:  getProductslist
	 * Parameteres:
	 * Return Type:  array
	 *
	 * Description:  This method is used to get products information and return array.
	 *
	 * */
	
	public function getProductslist(){
	
			
		$service_url = "{$this::$SERVICE_PRODUCTS}";
		$data = $this->service->get ( $service_url, array (), array () );
		$html_ckeckBox = "";
		$totalProduct = 0;
		//$productId = 0;
		if(!empty($data->statusCode) && $data->statusCode === 200)
		{
			$totalProduct = count($data->result);
			foreach($data->result as $key => $products)
			{
				$productId[ $key] = $products->id;
				$html_ckeckBox .= '<span id="productsedit_'.$products->productName.'"><input type="checkbox" id="chk_products_'.$products->productName.'" name="chk_products[]" value="' . $products->id . '" class="check-permissions check-sentiments-each form-control"  />' . $products->productName . '</span> ';
	
	
			}
		}
		//print_r($productId);
	
		return array($html_ckeckBox,$totalProduct,$productId);
	}
	
	
	
	/**
	 * Method Name:  getPermission
	 * Parameteres:  2
	 * Return Type:  array
	 *
	 * Description:  This method is used to get permission information and return array.
	 *
	 * */
	
	
	public function getPermissions($id, $selected = 0) {
		$service_url = null;
		$data = array ();
		//$resultArray = array ();
		$service_url = "{$this::$SERVICE_USER_PERMISSION}{$id}";
		$data = $this->service->get ( $service_url, array (), array () );
	
		if ($data->statusCode === 200 && isset ( $data->result ) && ! empty ( $data->result )) {
				
			$iterator = 0;
			foreach ( $data->result as $permission ) {
				if (! empty ( $permission )) {
						
					$resultArray [$iterator] ['id'] = $permission->id;
					$resultArray [$iterator] ['name'] = $permission->name;
					if ($selected == $permission->id)
						$resultArray [$iterator] ['checked'] = 'checked';
											
					$iterator ++;
				}
			}
			return $resultArray;
		}
	}
	
	
	/**
	 * Method Name:  ClientDropdownForm
	 * Parameteres:  null
	 * Return Type:  string
	 *
	 * Description:  This method is used generate client drop down and return string.
	 *
	 * */
	
	public function ClientDropdownForm(){
	
		$this->load->helper ( 'form' );
		$this->load->library ( 'form_builder' );
		
		//Required Array declaration
		$form_items = array ();
	
		$form = $this->form_builder->open_form ( array (
				'action' => '#',
				'id' => 'client-filter-form',
				'class' => 'form-horizontal seach_client_drop',
				'name' => 'client-filter-form'
		) );
	
	
		// client list
			
		$clients = array ();
		$service_url = "{$this::$SERVICE_CLIENT_LIST}";
		$data = $this->service->get ( $service_url );
			
	
		if (isset ( $data->statusCode ) && $data->statusCode == 200) {
			if ( !empty($data->result))
				foreach($data->result as $client) {
					if(!empty($client))
						$clients[$client->id] = $client->clientName;
				}
		}
	
		$role = $this->session->userdata['role'];
				
		if($role == 'CLIENT_ADMIN'){
			$defaultOptions = array();
		}else{
			$defaultOptions = array('0'=>'All');
		}
		
	
		//$defaultOptions = array('0'=>'Select Client');
		$optionsArray = ( $defaultOptions + $clients);
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'clientsdrop',
				'name' => 'clientsdrop',
				'class' => 'select2 client_select',
				'label' => "Client",
				'placeholder' => '',
				'selected' => '',
				'title' => "",
				'options' => $optionsArray
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'rolesession',
				'id' => 'rolesession',
				'value' => @$this->session->userdata('role')
		);
	
		//Form Preparation end point
	
		//Sorting the form_items array based on the key to make sure that form is displayed as prepared.
		ksort ( $form_items );
	
		//Preparing the SurveyFilter form by passing form_items array as parameter.
		//build_form_horizontal method returns form as string.
		$form = $form . $this->form_builder->build_form_horizontal ( $form_items );
	
		//Closing the form.
		$form .= $this->form_builder->close_form ();
	
		return $form;
	}
	
	/**
	 * Method Name:  UserAddForm
	 * Parameteres:  null
	 * Return Type:  string
	 *
	 * Description:  This method is used generate user form return string.
	 *
	 * */
	
	public function UserAddForm(){
		$this->load->helper ( 'form' );
		$this->load->library ( 'form_builder' );
	
		$url = 'users/add';
		//Required Array declaration
		$form_items = array ();
	
		$form = $this->form_builder->open_form ( array (
				'action' => '#',
				'id' => 'user-form',
				'class' => 'form-horizontal',
				'name' =>'user-form'
		) );
		
		// client list
			
		$clients = array ();
		$paramArray = array();
		$productId='';
		$productarr = $this->getSourceProductsOfUser();
		if(!empty($productarr['pidBSR']) ){
			$productId = $productarr['pidBSR'];
		}
		$client_service_url = "{$this::$SERVICE_CLIENT_LIST}";
		if(isset($productId) && !empty($productId))
		{
			$paramArray = array('productId' => $productId);
		}
		
		//Getting the Client(s) List information from Server.
		$data = $this->getDataFromServer($client_service_url, $paramArray);
		
		//$service_url = "{$this::$SERVICE_CLIENT_LIST}";
		//$data = $this->service->get ( $service_url );
		
		if (isset ( $data->statusCode ) && $data->statusCode == 200) {
			if ( !empty($data->result))
				foreach($data->result as $client) {
					if(!empty($client)){
						$clients[$client->id."|".$client->clientId] = $client->clientName;
						
					}
				}
		}
		
		//print_r($clients);
	
		$defaultOption = array('Select Client');
		
		$optionsArray = ( $clients);
		
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'rolesId',
				'name' => 'rolesId',
				'block_class' => 'col-md-6 col-sm-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		
		
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'usersid',
				'name' => 'usersid',
				'block_class' => 'col-md-6 col-sm-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
			);
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'clientId',
				'name' => 'clientId',
				'block_class' => 'col-md-6 col-sm-6 col-xs-10',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'previousclients',
				'name' => 'previousclients[]',
				'block_class' => 'col-md-6 col-sm-6 col-xs-10',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'flag',
				'name' => 'flag',
				'block_class' => 'col-md-6 col-sm-6 col-xs-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		// User Roles
		$Currentrole = $this->session->userdata['role'];
		
		
			
		$roles = array ();
		$service_url = "{$this::$SERVICE_USER_ROLES}";
		$role_data = $this->service->get ( $service_url );
		list($product_list,$totalproduct,$productId) = $this->getProductslist();
			
		if (isset ( $role_data->statusCode ) && $role_data->statusCode == 200) {
			if ( !empty($role_data->result))
					foreach($role_data->result as $key => $role) {
						if(!empty($role)){
							if($totalproduct >1){
								if($Currentrole == 'BF_SUPER_USER'){
									$roles[$role->id] = $role->roleName;
								}else if($Currentrole == 'BF_ADMIN'){
									if($role->roleName =='BF_SUPER_USER'){
										unset($role_data->result[$key]);
									}else{
										$roles[$role->id] = $role->roleName;
									}
									
								}else if($Currentrole == 'CLIENT_ADMIN'){
									if($role->roleName =='BF_SUPER_USER' || $role->roleName =='BF_ADMIN' || $role->roleName =='BF_EDITOR' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
										unset($role_data->result[$key]);
									}else{
										$roles[$role->id] = $role->roleName;
									}
								}else{
									$roles[$role->id] = $role->roleName;
								}
							}else{
								if($Currentrole == 'BF_SUPER_USER'){
								if($role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
										unset($role_data->result[$key]);
									}else{
										$roles[$role->id] = $role->roleName;
									}
								}else if($Currentrole == 'BF_ADMIN'){
									if($role->roleName =='BF_SUPER_USER' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
										unset($role_data->result[$key]);
									}else{
										$roles[$role->id] = $role->roleName;
									}
										
								}else if($Currentrole == 'CLIENT_ADMIN'){
									if($role->roleName =='BF_SUPER_USER' || $role->roleName =='BF_ADMIN' || $role->roleName =='BF_EDITOR' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
										unset($role_data->result[$key]);
									}else{
										$roles[$role->id] = $role->roleName;
									}
								}else{
									$roles[$role->id] = $role->roleName;
								}
							}
						}
			}
		}
		
		
		$roleOptions = array('1' => 'Super Admin');
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'role',
				'name' => 'role',
				'required' => true,
				'class' => 'select2 role_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10 role_drop_show',
				'label' => "Role",
				'placeholder' => '',
				'selected' => '',
				'title' => "",
				'options' => $roles
		);
		
		
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'client',
				'name' => 'client',
				'required' => true,
				'class' => 'select2 client_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10 client_drop_show',
				'label' => "Client",
				'options' => $optionsArray
		
		);
		
		
		// avatars
		//$arrayAvatar = $this->getAvatar('hca');
						
		$arrayAvatar = array('Select Avatar');
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'avatars',
				'name' => 'avatars[]',
				'required' => true,
				'class' => 'select2 avatar_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10 avatar_drop_show',
				'label_class' => 'col-md-4',
				'control_class' => 'col-md-8 initialAvatarProgress',
				'label' => "Avatar",
				'multiple' => 'multiple',
				'options' => $arrayAvatar
		
		);
		
		$form_items[] = array(
				'type' => 'html',
				'block_class' => 'clear col-md-2 col-sm-2',
				'html' => '<div class="clear col-md-2 col-sm-2 col-xs-2 add_more_fields ">
				           	<a title="Add Client" alt="Add Client" onClick="addClient();"><i class="fa fa-plus-circle fa-2x"></i></a>
							</div>'
				
		);
		
		/*$form_items[] = array(
				'type' => 'html',
				'html' => '<div id="dataTables_processing" class="col-md-12 col-sm-12 col-xs-12"></div>');*/
		
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="divider col-md-10 col-sm-10 col-xs-10 more_fields"></div>');
		
				
		$permissions = $this->getPermission(2);
		
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 permission_show"><div class="form-group "><label for="permission" class="col-md-4 control-label">Appeal Permission</label>
				<div class="col-md-8 col-sm-10 col-xs-12 chkbox_appeal">'.$permissions.'</div></div></div>');
	
		
		$permissions_client = $this->getPermissionClient(3);
		
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 permission_client_show"><div class="form-group "><label for="permission" class="col-md-4 control-label">Client Config Permission</label>
				<div class="col-md-8 col-sm-10 col-xs-12 chkbox_clientconfig">'.$permissions_client.'</div></div></div>');
		/*$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 addusertobha_show"><div class="form-group "><label for="bha" class="col-md-4 control-label"></label>
				<div class="col-md-8 col-sm-10 col-xs-12 chkbox_appeal"><input type="checkbox" id="chk_bha" name="chk_bha" value="1" class="check-permissions check-sentiments-each form-control"  />Add user to BHA?</div></div></div>');
				*/
		
		
		//print_r(implode(',',$productId));
		if($totalproduct >1){
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 products_show"><div class="form-group "><label for="products" class="col-md-4 control-label">Products</label>
				<div class="col-md-8 col-sm-10 col-xs-10 chkbox_clientconfig">'.$product_list.'</div></div></div>');
		}
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'productcount',
				'id'=>'productcount',
				'value'=> $totalproduct
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'productId',
				'id'=>'productId',
				'value'=> implode(',',$productId)
		
		);
		
		
		
		$form_items [] = array (
				'type' => 'input',
				'id' => 'firstname',
				'name' => 'firstname',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10',
				'required' => true,
				'class' => 'input-md',
				'label' => "First Name",
				'title' => "First Name",
				'value' =>'',
				'maxlength' => 255
		
		);
		
		$form_items [] = array (
				'type' => 'input',
				'id' => 'lastname',
				'name' => 'lastname',
				'block_class' => 'col-md-10 col-sm-10',
				'required' => true,
				'class' => 'input-md',
				'label' => "Last Name",
				'title' => "Last Name",
				'value' =>'',
				'maxlength' => 255
		
		);
		$form_items [] = array (
				'type' => 'input',
				'id' => 'email',
				'name' => 'email',
				'block_class' => 'col-md-10 col-sm-10',
				'required' => true,
				'class' => 'input-md',
				'validation' => true,
				'label' => "Email",
				'title' => "Email",
				'value' =>'',
				'maxlength' => 255
	
		);
	
	
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'reasonstatus',
		     	'id'=>'reasonstatus'
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'selected_avatars',
				'id'=>'selected_avatars'
		
		);
		
		
		
		$reasonOptions = array('Unknown/Unidentified user' => 'Unknown/Unidentified user','Client rejection'=>'Client rejection','Other'=>'Other');
		
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'reasons',
				'name' => 'reasons',
				'required' => true,
				'class' => 'select2 reason_drop_show',
				'block_class' => 'col-md-10 col-sm-10 reason_drop_show',
				'label' => "Reason for Rejection",
				'options' => $reasonOptions,
				'selected' => '',
		
		);
		
						
		$form_items [] = array (
				'type' => 'input',
				'id' => 'reason_text',
				'name' => 'reason_text',
				'block_class' => 'col-md-10 col-sm-10 reason_text_show',
				'required' => true,
				'class' => 'input-md reason_text_show',
				'label' => "Comment",
				'title' => "Comment",
				'value' =>'',
				'maxlength' => 255
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'addSectionCount',
				'id'=>'addSectionCount',
				'value'=> 1
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'firstAvatarservice',
				'id'=>'firstAvatarservice',
				'value'=> 0
		
		);
		
						
		$form_items[] = array(
				'type' => 'html',
				'block_class' => 'clear col-md-7 col-sm-7 new_sub',
				'html' => '<div class="clear col-md-7 col-sm-7 new_sub">
									<input type="button"  class="btn blue user_accessform" id="ftpadd_form" value="Submit" name="Save"/>
									<button class="btn blue" data-dismiss="modal" id="cancel_users">Cancel</button>
							</div>
							'
		);
		
		$form = $form . $this->form_builder->build_form_horizontal ( $form_items );
	
		//Closing the form.
		$form .= $this->form_builder->close_form ();
	
		return $form;
	}
	
	function getClients($productId = null){
		
		$clients = array ();
		$paramArray = array();
		if(isset($productId) && !empty($productId))
		{
			$paramArray = array('productId' => $productId);
		}
		$client_service_url = "{$this::$SERVICE_CLIENT_LIST}";
		//Getting the Client(s) List information from Server.
		return $this->getDataFromServer($client_service_url, $paramArray);
		
		
		
	}
	
	function getClientsAjax($clientId){
	
		$clients = array ();
		$service_url = "{$this::$SERVICE_CLIENT_LIST}";
		$data = $this->service->get ( $service_url );
		
		if (isset ( $data->statusCode ) && $data->statusCode == 200) {
			if ( !empty($data->result)){
				
				$iterator = 0;
				foreach($data->result as $client) {
					if(!empty($client)){
						
							$clients[$iterator]['id'] = $client->id."|".$client->clientId;
							$clients[$iterator]['text'] = $client->clientName;
							$iterator++;
						
					}
				}
		}
		}
		return $clients;
	
	}
	
				
	public function getUserVendor($userid){
		
		
		$params = array('email'=>$userid);
		$service_url = "{$this::$SERVICE_USER_VENDOR}";
		
		$data_vendor = $this->service->get ( $service_url, array (), $params );
		
		
			if ( !empty($data_vendor->result)){
					return trim($data_vendor->result);
				}else{
					return trim($this->session->userdata ( 'logintitle' ));
				}
		
	}
	
	public function getClientAdminEmails($clients,$email,$active){
	
	
		$params = array('clients'=>$clients,'email'=>$email,'inactive'=>$active);
		
		$service_url = "{$this::$SERVICE_CLIENT_ADMIN_EMAILS}";
	
		$data_clientEmails = $this->service->get ( $service_url, array (), $params );
		
		if ( !empty($data_clientEmails->result)){
			return trim($data_clientEmails->result);
		}
	
	}
	
	public function selfProfile($postData){
		$this->load->helper ( 'form' );
		$this->load->library ( 'form_builder' );
		
		//Required Array declaration
		$form_items = array ();
		
		$form = $this->form_builder->open_form ( array (
				'action' => '#',
				'id' => 'profileupdate-form',
				'class' => 'form-horizontal',
				'name' =>'profileupdate-form'
		) );
		
		
		// User Roles
		$Currentrole = $this->session->userdata['role'];
		$rolesdata = array ();
		$service_url = "{$this::$SERVICE_USER_ROLES}";
		$role_data = $this->service->get ( $service_url );
		
			
		if (isset ( $role_data->statusCode ) && $role_data->statusCode == 200) {
			if ( !empty($role_data->result))
				foreach($role_data->result as $key => $role) {
					if(!empty($role)){
						if($Currentrole == 'BF_SUPER_USER'){
							$rolesdata[$role->id] = $role->roleName;
						}else if($Currentrole == 'BF_ADMIN'){
							if($role->roleName =='BF_SUPER_USER'){
								unset($role_data->result[$key]);
							}else{
								$rolesdata[$role->id] = $role->roleName;
							}
		
						}else if($Currentrole == 'CLIENT_ADMIN'){
							if($role->roleName =='BF_SUPER_USER' || $role->roleName =='BF_ADMIN' || $role->roleName =='BF_EDITOR' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
								unset($role_data->result[$key]);
							}else{
								$rolesdata[$role->id] = $role->roleName;
							}
						}else{
							$rolesdata[$role->id] = $role->roleName;
						}
					}
				}
		}
		
		$roleOptions = array('1' => 'Super Admin');
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'role',
				'name' => 'role',
				'required' => true,
				'class' => 'select2 role_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10 role_drop_show',
				'label' => "Role",
				'placeholder' => '',
				'selected' => @$postData->result->roleId,
				'title' => "",
				'options' => $rolesdata
		);
		
		
		$form_items [] = array (
				'type' => 'input',
				'id' => 'firstname',
				'name' => 'firstname',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10',
				'required' => true,
				'class' => 'input-md',
				'label' => "First Name",
				'title' => "First Name",
				'value' =>@$postData->result->firstName,
				'maxlength' => 255
		
		);
		
		$form_items [] = array (
				'type' => 'input',
				'id' => 'lastname',
				'name' => 'lastname',
				'block_class' => 'col-md-10 col-sm-10',
				'required' => true,
				'class' => 'input-md',
				'label' => "Last Name",
				'title' => "Last Name",
				'value' =>@$postData->result->lastName,
				'maxlength' => 255
		
		);
		$form_items [] = array (
				'type' => 'input',
				'id' => 'email',
				'name' => 'email',
				'block_class' => 'col-md-10 col-sm-10',
				'required' => true,
				'class' => 'input-md',
				'validation' => true,
				'label' => "Email",
				'title' => "Email",
				'value' =>@$postData->result->email,
				'maxlength' => 255
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'id',
				'id'=>'id',
				'value'=> @$postData->result->id
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'rolesId',
				'id'=>'rolesId',
				'value'=> @$postData->result->roleId
		
		);
		
		
		
		$form_items[] = array(
				'type' => 'html',
				'block_class' => 'clear col-md-7 col-sm-7 profile_sub',
				'html' => '<div class="clear col-md-7 col-sm-7 profile_sub">
									<input type="button"  class="btn blue user_profileform" id="userself_form" value="Submit" name="Save"/>
									<button class="btn blue" data-dismiss="modal" id="cancel_updateusers">Cancel</button>
							</div>
							'
		);
		
		$form = $form . $this->form_builder->build_form_horizontal ( $form_items );
		
		//Closing the form.
		$form .= $this->form_builder->close_form ();
		
		return $form;
		
	}
	
	
	/**
	 * Method Name:  newUserAddForm
	 * Parameteres:  null
	 * Return Type:  string
	 *
	 * Description:  This method is used generate user form return string.
	 *
	 * */
	
	public function newUserAddForm(){
		$this->load->helper ( 'form' );
		$this->load->library ( 'form_builder' );
	
		$url = 'users/add';
		//Required Array declaration
		$form_items = array ();
	
		$form = $this->form_builder->open_form ( array (
				'action' => '#',
				'id' => 'useradd-form',
				'class' => 'form-horizontal',
				'name' =>'useradd-form'
		) );
		
		
	
	
		// client list
			
		$clients = array ();
		$paramArray = array();
		$productId='';
		$productarr = $this->getSourceProductsOfUser();
		if(!empty($productarr['pidBSR']) ){
			$productId = $productarr['pidBSR'];
		}
		
		$client_service_url = "{$this::$SERVICE_CLIENT_LIST}";
		if(isset($productId) && !empty($productId))
		{
			$paramArray = array('productId' => $productId);
		}
		
		//Getting the Client(s) List information from Server.
		$data = $this->getDataFromServer($client_service_url, $paramArray);
		
				
		if (isset ( $data->statusCode ) && $data->statusCode == 200) {
			if ( !empty($data->result))
				foreach($data->result as $client) {
					if(!empty($client)){
						$clients[$client->id."|".$client->clientId] = $client->clientName;
		
					}
				}
		}
		
				
		$defaultOption = array('Select Client');
		
		$optionsArray = ( $clients);
		
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'rolesId',
				'name' => 'rolesId',
				'block_class' => 'col-md-6 col-sm-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		
		
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'usersid',
				'name' => 'usersid',
				'block_class' => 'col-md-6 col-sm-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'clientId',
				'name' => 'clientId',
				'block_class' => 'col-md-6 col-sm-6 col-xs-10',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'previousclients',
				'name' => 'previousclients[]',
				'block_class' => 'col-md-6 col-sm-6 col-xs-10',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'flag',
				'name' => 'flag',
				'block_class' => 'col-md-6 col-sm-6 col-xs-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'id' => 'clientfirstval',
				'name' => 'clientfirstval',
				'block_class' => 'col-md-6 col-sm-6 col-xs-6',
				'required' => false,
				'class' => 'select2 alert-type alert_text'
		);
		
		// User Roles
		$Currentrole = $this->session->userdata['role'];
		list($products,$totalproduct,$productId) = $this->getProducts();
			
		$roles = array ();
		$service_url = "{$this::$SERVICE_USER_ROLES}";
		$role_data = $this->service->get ( $service_url );
		
			
		if (isset ( $role_data->statusCode ) && $role_data->statusCode == 200) {
			if ( !empty($role_data->result))
				foreach($role_data->result as $key => $role) {
					
					if(!empty($role)){
						if($totalproduct >1){
							if($Currentrole == 'BF_SUPER_USER'){
								$roles[$role->id] = $role->roleName;
							}else if($Currentrole == 'BF_ADMIN'){
								if($role->roleName =='BF_SUPER_USER'){
									unset($role_data->result[$key]);
								}else{
									$roles[$role->id] = $role->roleName;
								}
			
							}else if($Currentrole == 'CLIENT_ADMIN'){
								if($role->roleName =='BF_SUPER_USER' || $role->roleName =='BF_ADMIN' || $role->roleName =='BF_EDITOR' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
									unset($role_data->result[$key]);
								}else{
									$roles[$role->id] = $role->roleName;
								}
							}else{
								$roles[$role->id] = $role->roleName;
							}
						
						}else{
							
							if($Currentrole == 'BF_SUPER_USER'){
								if($role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
									unset($role_data->result[$key]);
								}else{
									$roles[$role->id] = $role->roleName;
								}
							}else if($Currentrole == 'BF_ADMIN'){
								if($role->roleName =='BF_SUPER_USER' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
									unset($role_data->result[$key]);
								}else{
									$roles[$role->id] = $role->roleName;
								}
									
							}else if($Currentrole == 'CLIENT_ADMIN'){
								if($role->roleName =='BF_SUPER_USER' || $role->roleName =='BF_ADMIN' || $role->roleName =='BF_EDITOR' || $role->roleName =='LEVEL_1_MANAGED_SERVICE' || $role->roleName =='LEVEL_2_MANAGED_SERVICE'){
									unset($role_data->result[$key]);
								}else{
									$roles[$role->id] = $role->roleName;
								}
							}else{
								$roles[$role->id] = $role->roleName;
							}
							
						}
						
					}
				}
		}
		
		
		$roleOptions = array('1' => 'Super Admin');
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'roleadd',
				'name' => 'roleadd',
				'required' => true,
				'class' => 'select2 rolenew_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10',
				'label' => "Role",
				'placeholder' => '',
				'selected' => '',
				'title' => "",
				'options' => $roles
		);
		
		
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'clientnew',
				'name' => 'clientnew',
				'required' => true,
				'class' => 'select2 clientnew_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10 clientnew_drop_show',
				'label' => "Client",
				'options' => $optionsArray
		
		);
		
			
		
		$arrayAvatar = array('Select Avatar');
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'avatarsnew',
				'name' => 'avatars[]',
				'required' => true,
				'class' => 'select2 avatarnew_drop_show',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10 avatarnew_drop_show',
				'label_class' => 'col-md-4',
				'control_class' => 'col-md-8 initialAvatarProgress',
				'label' => "Avatar",
				'multiple' => 'multiple',
				'options' => $arrayAvatar
		
		);
		
		$form_items[] = array(
				'type' => 'html',
				'block_class' => 'clear col-md-2 col-sm-2',
				'html' => '<div class="clear col-md-2 col-sm-2 col-xs-2 add_more_fields_new ">
				           	<a title="Add Client" alt="Add Client" onClick="addClients();"><i class="fa fa-plus-circle fa-2x"></i></a>
							</div>'
		
		);
		
		
		
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="divider col-md-10 col-sm-10 col-xs-10 more_fields_new" id="more_fields_new"></div>');
		
		
		$permissions_options = $this->getPermission(2);
		
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 permission_show_new"><div class="form-group "><label for="permission" class="col-md-4 control-label">Appeal Permission</label>
				<div class="col-md-8 col-sm-10 col-xs-12 chkbox_appeal">'.$permissions_options.'</div></div></div>');
		
		$permissions_client = $this->getPermissionClient(3);
		
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 permission_client_show_new"><div class="form-group "><label for="permission" class="col-md-4 control-label">Client Config Permission</label>
				<div class="col-md-8 col-sm-10 col-xs-10 chkbox_clientconfig">'.$permissions_client.'</div></div></div>');
		
	
		
		
		if($totalproduct>1){	
		$form_items[] = array(
				'type' => 'html',
				'html' => '<div class="col-md-10 col-sm-10 col-xs-10 products_show_new"><div class="form-group "><label for="products" class="col-md-4 control-label">Products</label>
				<div class="col-md-8 col-sm-10 col-xs-10 chkbox_clientconfig">'.$products.'</div></div></div>');
		}
		
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'productcount',
				'id'=>'productcount',
				'value'=> $totalproduct
		
		  );
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'productId',
				'id'=>'productId',
				'value'=> implode(',',$productId)
		
		);
		
		
		
		
		$form_items [] = array (
				'type' => 'input',
				'id' => 'firstnames',
				'name' => 'firstnames',
				'block_class' => 'col-md-10 col-sm-10 col-xs-10',
				'required' => true,
				'class' => 'input-md',
				'label' => "First Name",
				'title' => "First Name",
				'value' =>'',
				'maxlength' => 255
		
		);
		
		$form_items [] = array (
				'type' => 'input',
				'id' => 'lastnames',
				'name' => 'lastnames',
				'block_class' => 'col-md-10 col-sm-10',
				'required' => true,
				'class' => 'input-md',
				'label' => "Last Name",
				'title' => "Last Name",
				'value' =>'',
				'maxlength' => 255
		
		);
		$form_items [] = array (
				'type' => 'input',
				'id' => 'emails',
				'name' => 'emails',
				'block_class' => 'col-md-10 col-sm-10',
				'required' => true,
				'class' => 'input-md',
				'validation' => true,
				'label' => "Email",
				'title' => "Email",
				'value' =>'',
				'maxlength' => 255
		
		);
		
		$form_items [] = array (
				'type' => 'password',
				'id' => 'passwords',
				'name' => 'passwords',
				'block_class' => 'col-md-10 col-sm-10 passwords',
				'required' => true,
				'class' => 'input-md',
				'label' => "Password",
				'title' => "Password",
				'autocomplete'=>'off',
				'value' =>'',
				'maxlength' => 255
		
		);
		
				
		$form_items [] = array (
				'type' => 'password',
				'id' => 'confirmpasswords',
				'name' => 'confirmpasswords',
				'block_class' => 'col-md-10 col-sm-10 confirm_pass',
				'required' => true,
				'class' => 'input-md confirm_pass',
				'label' => "Confirm Password",
				'title' => "Confirm Password",
				'value' =>'',
				'maxlength' => 255
		
		);
					
				
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'addSectionCountnew',
				'id'=>'addSectionCountnew',
				'value'=> 1
		
		);
		
				
		
		$form_items[] = array(
				'type' => 'html',
				'block_class' => 'clear col-md-7 col-sm-7 new_sub_user',
				'html' => '<div class="clear col-md-7 col-sm-7 new_sub_user">
									<input type="button"  class="btn blue user_addform" id="useradd_form" value="Submit" name="Save"/>
									<button class="btn blue" data-dismiss="modal" id="cancel_addusers">Cancel</button>
							</div>
							'
		);
		
		$form = $form . $this->form_builder->build_form_horizontal ( $form_items );
		
		//Closing the form.
		$form .= $this->form_builder->close_form ();
		
		return $form;
	}
	
	public function getReportScheduleForm($user_id,$user_email) {
	
		// Dependencies
		$this->load->helper ( 'form' );
		$this->load->library ( 'form_builder' );
	
		$form_items = array ();
		$date_items [] = array ();
		
		// Form
		$form = $this->form_builder->open_form ( array (
				'action' => '',
				'id' => 'report-schedule-form',
				'class' => 'report-schedule-form',
				'name'=>'report-schedule-form'
		) );
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'userId',
				'id'=>'userId',
				'value'=> $user_id
		
		);
		
		//print_r($scheduleArray);
		$jobid = 0;
		$dayselected =1;
		$jobSchedulerConfig = array();
		$timeselected='';
		$frequencyType='Monthly';
		
		
		// client list
			
		$clientsval = array ();
		$paramArray = array();
		$reporttypeval = array();
		
		$clientservice_url = "{$this::$SERVICE_USER_CLIENT_LIST}";
		if(isset($user_id) && !empty($user_id))
		{
			$paramArray = array('userId' => $user_id);
		}
		
		//Getting the Client(s) List information from Server.
		$data = $this->getDataFromServer($clientservice_url, $paramArray);
		
		$clientsVal='';
		if (isset ( $data->statusCode ) && $data->statusCode == 200) {
			if ( !empty($data->result)){
				$clientsVal = $data->result;
				foreach($data->result as $client) {
					if(!empty($client)){
						$clientsval[$client->clientId] = $client->clientName;
		
					}
				}
			} 
		}
		
	
		$defaultOption = array(''=>'Select Client');
		
		$optionsClientArray = ( $defaultOption + $clientsval);
		
		$defaultfirst_client = '';//@$clientsVal[0]->clientId;
		
		
		// report type list
		
		$reporttypeservice_url = "{$this::$SERVICE_REPORT_TYPE_LIST}";
		
		//Getting the Report type from Server.
		$dataReport = $this->getDataFromServer($reporttypeservice_url);
		
		$reportsVal='';
		if (isset ( $dataReport->statusCode ) && $dataReport->statusCode == 200) {
			if ( !empty($dataReport->result)){
				$reportsVal = $dataReport->result;
				foreach($dataReport->result as $reports) {
					if(!empty($reports)){
						$reporttypeval[$reports->id] = $reports->jasperReportUILabel;
		
					}
				}
			}
		}
		
		$defaultfirst_report = 0;//@$reportsVal[0]->id;
		//echo $defaultfirst_client.$defaultfirst_report;
					
		$scheduleArray = $this->users_model->getUserSchedule($user_id,$defaultfirst_client,$defaultfirst_report);
		
		
		$getClientId='';
		$selectedReport='';
		$style="display:none;";
		if (isset ( $scheduleArray->statusCode ) && $scheduleArray->statusCode == 200) {
			$jobid = $scheduleArray->result->id;
			$jobSchedulerConfig = $scheduleArray->result->jobSchedulerConfig;
			$dayselected = $jobSchedulerConfig->day;
			$timeselected = $jobSchedulerConfig->time;
			$frequencyType = $jobSchedulerConfig->frequencyType;
			$getClientId = $scheduleArray->result->clientId;
			$style="display:block;";
			$selectedReport = $scheduleArray->result->reportConfigId;
		}
		
		
		//echo $selectedReport;
		
			
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'useremail',
				'id'=>'useremail',
				'value'=> $user_email
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'jasperJobId',
				'id'=>'jasperJobId'
				
		
		);
		
		$form_items [] = array (
				'type' => 'hidden',
				'name' => 'jobId',
				'id'=>'jobId',
				'value'=> $jobid
		
		);


		
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'clientsreport',
				'name' => 'clientsreport',
				'class' => 'select2 clientreport_drop_show schedule_cls',
				'block_class' => 'col-md-12 col-sm-12 col-xs-12 clientreport_drop_show schedule_cls',
				'label' => "Client:",
				'selected' => $getClientId,
				'options' => $optionsClientArray
		
		);
		$defaultreportOption = array(''=>'Select Report');
		$Reportoptions = ( $defaultreportOption + $reporttypeval);
		
		$form_items [] = array (
				'type' => 'dropdown',
				'id' => 'report_type',
				'name' => 'report_type',
				'class' => 'select2  schedule_cls',
				'block_class' => 'col-md-12 col-sm-12 col-xs-12 schedule_cls',
				'label' => "Report:",
				'selected' => $selectedReport,
				'options' => $Reportoptions
		
		);
		
			
		
		$selected_freq_daily ='';
		$selected_freq_year='';
		$selected_freq_quar='';
		$selected_freq_monthly='';
		$selected_freq_weekly='';
		
		if($frequencyType == 'Daily'){
			$selected_freq_daily = "selected='selected'";
		}else if ($frequencyType == 'Weekly'){
			$selected_freq_weekly = "selected='selected'";
		}else if ($frequencyType == 'Monthly'){
			$selected_freq_monthly = "selected='selected'";
		}else if ($frequencyType == 'Quarterly'){
			$selected_freq_quar = "selected='selected'";
		}else if ($frequencyType == 'Yearly'){
			$selected_freq_year = "selected='selected'";
		}
		
		
		$form_items [] = array (
				'type' => 'html',
				'html' => '<div class="col-md-12 col-sm-12 col-xs-12 schedule_cls">
				<div class="form-group">
				<label for="Reporting Frequency" class="col-md-4 control-label">Reporting Frequency:</label>
				<div class="col-md-8">
		          	<select name="schedule_frequency" id="schedule_frequency" class="bs-select form-control" onchange="schedulefre()" disabled="disabled">
		                     <option value="Daily" '. $selected_freq_daily .'>Daily</option>
							 <option value="Weekly" '. $selected_freq_weekly .'>Weekly</option>
							 <option value="Monthly" '. $selected_freq_monthly .'>Monthly</option>
							<option value="Quarterly" '. $selected_freq_quar .'>Quarterly</option>
							<option value="Yearly"  '. $selected_freq_year .'>Yearly</option>
					</select>
					</div>
				</div></div>'
		);
		
		
		
		$form_items [] = array (
				'type' => 'html',
				'html' => '<div class="col-md-12 col-sm-12 col-xs-12 schedule_cls" id="show_week" style="display:none;"><div class="form-group">
				<label for="schedule_day_of_month" class="col-md-4 control-label">Schedule Day of Week:</label>
				<div class="col-md-8">
					<select name="schedule_day_of_week" id="schedule_day_of_week" class="bs-select form-control">
		                     <option value="1">Sunday</option>
							 <option value="2" selected="selected">Monday</option>
							 <option value="3">Tuesday</option>
							<option value="4">Wednesday</option>
							<option value="5">Thursday</option>
							<option value="6">Friday</option>
							<option value="7">Saturday</option>						
					</select>
					</div>
				</div></div>'
		);
		
		
		
		$options = array ();
		$html ='';
		for($i = 1; $i < 32; $i ++) {
			$selected ='';
			if($i == $dayselected)
				$selected = "selected='selected'";
			
				//$html.= '<option value="'.$i.'"  '.$selected.'>'.$i.'</option>';//$i;
				$html.= '<option value="'.$i.'" >'.$i.'</option>';//$i;
		}
		$form_items [] = array (
				'type' => 'html',
				'html' => '<div class="col-md-12 col-sm-12 col-xs-12 schedule_cls" id="show_month">
				<div class="form-group">
				<label for="schedule_day_of_month" class="col-md-4 control-label">Schedule Day of Month:</label>
				<div class="col-md-8">
				       	<select name="schedule_day_of_month" id="schedule_day_of_month" class="bs-select form-control">
							'.$html.'
						</select>
					</div>
				</div></div>'
		);
		
		
		$orignaleddtime = '01:00'; // true//'1:00';//date('H:00');
		$form_items [] = array (
				'type' => 'html',
				'html' => '</div>'
		);
		//
		$form_items [] = array (
				'type' => 'html',
				'html' => '<div class="col-md-12 col-sm-12" onclick="timepick()">
				       <div class="form-group">
						<label class="col-md-4 control-label phy-label" for="Date Range">Schedule Time: <span class="span-red"></span></label>
		                <div class="col-md-3 input-group">
		                    <input type="text" class="form-control disabletxt"  id="datetimepicker2"  name="endDate" value="'.$orignaleddtime.'"  />
		            
				<span class="input-group-addon endDateAddon" >
		                        <span class="glyphicon glyphicon-calendar"></span>
		                    </span>
				            
		                </div>
				<div class="col-md-1 col-md-offset-7"><small>(EST)</small></div>
		            </div>
				</div></div>'
		
		);
		$form_items [] = array (
				'type' => 'html',
				'html' => '</div>'
		);
		
		
				
		$form_items [] = array (
				'type' => 'html',
				'block_class' => 'col-md-8 col-sm-8 col-xs-8 pull-right edit_report_schedule',
				'html' => '<div class="col-md-8 col-sm-8 col-xs-8 pull-right edit_report_schedule" style="'.$style.'">
									<input type="button"  class="btn blue schedule_form" value="Update" name="Save"/>
									<button class="btn blue delete_schedule_form" id="delete_schedule_form">Delete</button>
				                    <button class="btn blue cancel_schedule_form" data-dismiss="modal" id="cancel_schedule_form">Cancel</button>
							</div>'
		);
		
	
		
			$form_items [] = array (
					'type' => 'html',
					'block_class' => 'col-md-8 col-sm-8 col-xs-8 pull-right add_report_schedule',
					'html' => '<div class="col-md-8 col-sm-8 col-xs-8 pull-right add_report_schedule" style="display:none;">
									<input type="button"  class="btn blue schedule_form" value="Create" name="Save"/>
									<button class="btn blue cancel_schedule_form" data-dismiss="modal" id="cancel_schedule_form">Cancel</button>
							</div>'
			);
		
		$form = $form . $this->form_builder->build_form_horizontal ( $form_items );
		
		$form .= $this->form_builder->close_form ();
		return $form;
	}
	
	/**
	 * Method Name:  deleteUserschedule
	 * Parameteres:  userid
	 * Return Type:  string
	 *
	 * Description:  This method is used to delete user schedule information and return status.
	 *
	 * */
	
	
	public function deleteUserschedule( $id){
	   
		$params = array('id'=>$id);
		$service_url = "{$this::$SERVICE_USER_SCHEDULE_DELETE}";
		return $this->service->post ( $service_url, array (
				'content-type' => 'application/json'
		),  array(), json_encode ( $params ) );
	
	}
	
	/**
	 * Method Name:  getUserSchedule
	 * Parameteres:  userid
	 * Return Type:  array
	 *
	 * Description:  This method is used to get user schedule information and return array.
	 *
	 * */
	
	public function getUserSchedule($id,$clientId,$reporttype){
		
		$params = array('userId'=>$id,'clientId'=>$clientId,'reportConfigId'=>$reporttype);
		
		//print_r($params);
						
		$service_url = "{$this::$SERVICE_USER_SCHEDULE_GET}";
		
		return $this->service->get ( $service_url, array (), $params );
	
		
	}
	
	/**
	 * Method Name:  saveUserSchedule
	 * Parameteres:  array
	 * Return Type:  string
	 *
	 * Description:  This method is used to save user schedule information and return status.
	 *
	 * */
	
	public function saveUserSchedule($data,$jobId){
		
	    if($jobId > 0){
	    	
	    	return $this->service->post ( $this::$SERVICE_USER_SCHEDULE_UPDATE, array (
	    			'content-type' => 'application/json'
	    	), array (), json_encode ( $data ) );
	    	
	    }else{
		
			return $this->service->post ( $this::$SERVICE_USER_SCHEDULE_CREATE, array (
					'content-type' => 'application/json'
			), array (), json_encode ( $data ) );
	    }
	}
	
	public function getSourceProductsOfUser()
	{
		//Variable(s) declaration for further use.
		$userId = null;
		$paramArray = array();
		$resultData = array();
		$productListArray = array();
	
		if(!empty($this->session->userdata('userId')))
		{
			$userId = $this->session->userdata('userId');
		}
	
		$paramArray = array('userId' => $userId);
	
		//Preparing the service url to get User(s) Product List information.
		$user_product_service_url = $this::$SERVICE_USER_PRODUCTS;
	
		//Getting the Client(s) List information from Server.
		$resultData = $this->getDataFromServer($user_product_service_url, $paramArray);
	
		//Processing only on success.
		if(!empty($resultData->statusCode) && $resultData->statusCode === 200)
		{
			if(!empty($resultData->result))
			{
				
				foreach($resultData->result as $key => $productList)
				{
					if($productList->productName == 'BSR')
						$productListArray['pidBSR'] = $productList->id;
					else if($productList->productName == 'BHA')
							$productListArray['pidBHA'] = $productList->id;
					
				}
			}
		}
		return $productListArray;
	}
	
	/**
	 * Method Name:  getDataFromServer
	 * Parameters:  ServerUri,  Parameter Array(Note: Number of Parameters can be changed in future).
	 * Return Type:  JSON
	 *
	 * Description:  This method will connect to Server and returns the response as JSON.
	 * Incase,  if an error occurred, while sending the request or in case of any error response.
	 * The reason for not handling the exception here is that this exception has been handled for
	 * GET requests in (/surveyview/applications/libraries/Service.php).
	 *
	 * */
	private function getDataFromServer($serverUri, $paramArray = array())
	{
		//Array(s) declaration for further use.
		$data = array();
	
		//Getting the Location(s) List information of a Source from Server.
		$data = $this->service->get ( $serverUri, array(), $paramArray, false );
	
		return $data;
	}
		
	
}