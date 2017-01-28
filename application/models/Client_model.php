<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class Client_model extends Service_Model {
	public static $SERVICE_CLIENT_DETAILS = "/service/client/view/%s";
	public static $SERVICE_CLIENT_LIST = "/service/client/list";
	public static $SERVICE_UNSUBSCRIBED_LIST = "/service/notification/unsubscribed/list";
	public static $SERVICE_ALL_CATEGORIES_LIST = "/service/category/all-categories";
	public static $SERVICE_SOURCE_LIST = "/service/source/list";
	public static $SERVICE_SOURCE_LIST_TYPE = "/service/source/listByType";
	public static $SERVICE_SOURCE_LIST_FOR_CLIENT = "/service/source/sourceListForClient";
	public static $SERVICE_SOURCE_AUTH_LIST = "/service/source/authenticatedList";
	public static $SERVICE_SOURCE_LISTFORALERTS = '/service/source/listForAlerts';
	public static $SERVICE_CONFIGURED_SOURCES = "/service/harvester/sources";
	public static $SERVICE_SURVEY_SOURCES = "/service/survey/list/all";
	public static $SERVICE_SECURITY_USER_LIST = "/service/security/user/list";
	public static $SERVICE_CATEGORY_TREE_LIST = "/service/category/tree/list";
	public function __construct() {
		parent::__construct ();
	}
	/**
	 * Returns details of a client
	 *
	 * @param
	 *        	$client
	 * @return array of client details
	 */
	public function getDetails($client_id) {
		$client_result = array ();
		if (! empty ( $client_id )) {
			
			$cache_key = "client-{$client_id}-details";
			
			if (! $client_result = $this->cache->get ( $cache_key )) {
				$endpoint = sprintf ( $this::$SERVICE_CLIENT_DETAILS, $client_id );
				$data = $this->service->get ( "{$client_id}{$endpoint}", array (
						"email" => $this->super_user 
				) );
				if (isset ( $data->status->code ) && $data->status->code == 200 && ! empty ( $data->client )) {
					$client = $data->client;
					$client_result = array (
							'ID' => $client->id,
							'INDUSTRY_ID' => $client->industryId,
							'DEFAULT_PRODUCT' => @$client->defaultProduct,
							'NAME' => $client->name,
							'TYPE' => $client->type,
							'CONTACT_EMAIL' => $client->contactEmail,
							'OUTGOING_EMAIL' => $client->outgoingEmail,
							'ACTIVE_FLAG' => $client->activeFlag,
							'CONFIG' => $client->config,
							'CONTACTS' => ( array ) @$client->contacts,
							'PARTNER' => @$client->partner
					);
					$this->cache->save ( $cache_key, $client_result, Service_Model::$CACHE_EXPIRY_TIME );
				}
			}
		}
		return $client_result;
	}
	public function getClientConfig($client_id){
		$client = $this->getDetails($client_id);
		$config = $client['CONFIG'];
		$xml_object = simplexml_load_string($config);
		$configs = (array) $xml_object;
		return $configs;
	}
	function getList($industry_id = null) {
		$clients = array ();
		$params = array ();
		if ($industry_id != null) {
			$params ['industryId'] = $industry_id;
		}
		$data = $this->service->get ( "admin{$this::$SERVICE_CLIENT_LIST}", array (
				"email" => $this->super_user 
		), $params );
		if ($data->status->code == 200 && ! empty ( $data->clients )) {
			foreach ( $data->clients as $client ) {
				$clients [$client->instanceCode] = $client->name;
			}
		}
		return $clients;
	}
	public function unsubscribedList($client) {
		$list = array ();
		
		$data = $this->service->get ( "{$client}{$this::$SERVICE_UNSUBSCRIBED_LIST}" );
		
		if ($data->status->code == 200 && ! empty ( $data->data )) {
			foreach ( $data->data as $row ) {
				$list [] = $row->email;
			}
		}
		return $list;
	}
	public function getCategoryList($client, $scope = 'default', $product = 'patient') {
		$categories = array ();
		
		// if ($cache = cache_get("compass_client_{$client}_category_list_{$scope}_{$product}")) {
		// $categories = $cache->data;
		// } else {
		
		$filters = array (
				'scope' => $scope,
				'product' => $product 
		);
		$data = $this->service->get ( "{$client}{$this::$SERVICE_ALL_CATEGORIES_LIST}", array (
				"email" => $this->super_user 
		), $filters );
		if ($data->status->code == 200 && ! empty ( $data->data )) {
			foreach ( $data->data as $row ) {
				if (isset ( $row->id ))
					$categories [$row->id] = array (
							'id' => $row->id,
							'name' => $row->name,
							'parentId' => $row->parentId 
					);
			}
		}
		// }
		return $categories;
	}
	public function getRolesList($client, $distinct = false, $condition = array()) {
		$roles = array ();
		
		$cache_key = "role-list-{$client}-{$distinct}-" . md5(json_encode($condition));
			
		if (! $roles = $this->cache->get ( $cache_key )) {
			if ($distinct) {
				$distinct = 'true';
			} else {
				$distinct = 'false';
			}
			$url = "/service/security/roles/list/distinct_$distinct";
			$data = $this->service->get ( "{$client}{$url}", array (
					"email" => $this->super_user 
			), $condition );
			if ($data->code == 200 && ! empty ( $data->data )) {
				foreach ( $data->data as $row ) {
					if (isset ( $row->id ))
						$roles [$row->id] = $row->id;
				}
			}
			$this->cache->save ( $cache_key, $roles, Service_Model::$CACHE_EXPIRY_TIME );
		}
		return $roles;
	}
	
	public function getSources($client, $all_required = FALSE) {
		$sources = array ();
		if ($all_required) {
			$sources [100000] = "All Sources";
		}
		
		$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_LIST}", array (
				"email" => $this->super_user 
		) );
		if ($data->StatusCode == 200 && ! empty ( $data->sources )) {
			foreach ( $data->sources as $row ) {
				if (isset ( $row->id ) && isset ( $row->name ))
					$sources [$row->id] = $row->name;
			}
		}
		
		return $sources;
	}
	
	public function getSourcesByType($client,$type, $all_required = FALSE) {
		$sources = array ();
		if ($all_required) {
			$sources [100000] = "All Sources";
		}
	
		$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_LIST_TYPE}/{$type}", array (
				"email" => $this->super_user
		) );
		if ($data->StatusCode == 200 && ! empty ( $data->sources )) {
			foreach ( $data->sources as $row ) {
				if (isset ( $row->id ) && isset ( $row->name ))
					$sources [$row->id] = $row->name;
			}
		}
	
		return $sources;
	}
	
	 
	
	public function getSourcesByParent($client, $params) {
		$sources = array ();
		$query_params ['parentId'] = $params;
	
		$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_AUTH_LIST}", array (
				"email" => $this->super_user
		), $query_params);
		if ($data->StatusCode == 200 && ! empty ( $data->sources )) {
			foreach ( $data->sources as $row ) {
				if (isset ( $row->id ) && isset ( $row->name ))
					$sources [$row->id] = $row->name;
			}
		}
	
		return $sources;
	}
	
	/**
	 * Returns all configured sources for a client
	 *
	 * @param unknown $client        	
	 * @param string $avatar_id        	
	 * @return array of sources
	 */
	public function getConfiguredSources($client, $avatar_id = NULL) {
		$sources = array ();
		$params = array ();
		if ($avatar_id != NULL) {
			$params ["avatarId"] = $avatar_id;
		}
		
		$data = $this->service->get ( "{$client}{$this::$SERVICE_CONFIGURED_SOURCES}", array (
				"email" => $this->super_user 
		), $params );
		if ($data->status->code == 200 && ! empty ( $data->sources )) {
			foreach ( $data->sources as $source ) {
				$sources [$source->id] = isset ( $source->name ) ? $source->name : "";
			}
		}
		
		return $sources;
	}
	public function getSubscribedClients($email) {
		$clients = array ();
		$params = array ();
		$data = $this->service->get ( "admin{$this::$SERVICE_CLIENT_LIST}", array (
				"email" => $email 
		), $params );
		if ($data->status->code == 200 && ! empty ( $data->clients )) {
			
			$clients = $data->clients;
		}
		return $clients;
	}
	public function getSourcesByContentType($client, $content_type = null, $email) {
		$sources = array ();
		$sources [] = array (
				"val" => "100000",
				"text" => " All" 
		); // Space is given to come All in the first.
		
		if (isset ( $_GET ['content_type'] ) || $content_type != null) {
			
			if ($content_type == null) {
				$content_type = $_GET ['content_type'];
			}
			$avatar_id = null;
			if (isset ( $_GET ["location_id"] ) && $_GET ["location_id"] != "") {
				$avatar_id = $_GET ["location_id"];
			}
			
			// Social sources
			if (in_array ( $content_type, array (
					"100000",
					"100001" 
			) )) {
				$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_AUTH_LIST}", array (
						"email" => $email 
				), array (
						"parentId" => "100001" 
				) );
				if (isset ( $data->sources )) {
					foreach ( $data->sources as $source ) {
						if ($source->id != "100000")
							$sources [] = array (
									"val" => $source->id,
									"text" => $source->name 
							);
					}
				}
			}
			
			// Surveys
			if (in_array ( $content_type, array (
					"100000",
					"100011" 
			) )) {
				$data = $this->service->get ( "{$client}{$this::$SERVICE_SURVEY_SOURCES}", array (
						"email" => $email 
				) );
				
				if ($data->StatusCode == 200 && ! empty ( $data->surveys )) {
					foreach ( $data->surveys as $survey ) {
						$sources [] = array (
								"val" => $survey->{"source-id"},
								"text" => $survey->name->en 
						);
					}
				}
			}
		}
		
		if (sizeof ( $sources ) < 3) {
			unset ( $sources [0] );
		}
		
		$keys = array_map ( function ($val) {
			return $val ['text'];
		}, $sources );
		array_multisort ( $keys, $sources );
		
		return $sources;
	}
	public function getSourcesForClient($client, $email) {
		$sources = array ();
		$cache_key = "client-{$email}-{$client}-sources-for-client";
		$sources = $this->cache->get ( $cache_key );
		if (empty ( $sources )) {
			$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_LIST_FOR_CLIENT}", array (
					"email" => $email 
			) );
			
			if ($data->StatusCode == 200 && ! empty ( $data->sources )) {
				foreach ( $data->sources as $source ) {
					$sources [$source->id] = @$source->name;
				}
				asort ( $sources );
			}
			$this->cache->save ( $cache_key, $sources, Service_Model::$CACHE_EXPIRY_TIME );
		}
		return $sources;
	}
	public function getSourcesForAlerts($client, $email) {
		$sources = array ();
		$cache_key = "client-{$email}-{$client}-sources-for-alerts";
		$sources = $this->cache->get ( $cache_key );
		if (empty ( $sources )) {
			$sources = array ();
			$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_LISTFORALERTS}", array (
					"email" => $email 
			) );
			
			if ($data->StatusCode == 200 && ! empty ( $data->sources )) {
				foreach ( $data->sources as $source ) {
					$sources [$source->id] = @$source->name;
				}
				asort ( $sources );
			}
			$this->cache->save ( $cache_key, $sources, Service_Model::$CACHE_EXPIRY_TIME );
		}
		return $sources;
	}
	public function getSourcesAuthenticatedList($client, $email) {
		$sources = array ();
		$cache_key = "client-{$email}-{$client}-sources-authenticated-list";
		$sources = $this->cache->get ( $cache_key );
		if (empty ( $sources )) {
			$data = $this->service->get ( "{$client}{$this::$SERVICE_SOURCE_AUTH_LIST}", array (
					"email" => $email 
			) );
			if ($data->StatusCode == 200 && ! empty ( $data->sources )) {
				$sources = $data->sources;
			}
			$this->cache->save ( $cache_key, $sources, Service_Model::$CACHE_EXPIRY_TIME );
		}
		return $sources;
	}
	public function getUsersList($client, $email, $task_id = '') {
		$users = $query_params = array ();
		$cache_key = "client-{$email}-{$client}-users-{$task_id}";
		$users = $this->cache->get ( $cache_key );
		if (empty ( $users )) {
			if (! empty ( $task_id )) {
				$query_params ['taskId'] = $task_id;
			}
			$data = $this->service->get ( "{$client}{$this::$SERVICE_SECURITY_USER_LIST}", array (
					"email" => $email 
			) );
			if (isset ( $data->status->code ) && $data->status->code == 200) {
				$users = $data->users;
			}
			$this->cache->save ( $cache_key, $users, Service_Model::$CACHE_EXPIRY_TIME );
		}
		return $users;
	}
	public function getCategories($client, $email) {
		$categories = array ();
		$cache_key = "client-{$email}-{$client}-categories";
		$categories = $this->cache->get ( $cache_key );
		if (empty ( $categories )) {
			$data = $this->service->get ( "{$client}{$this::$SERVICE_CATEGORY_TREE_LIST}", array (
					"email" => $email 
			), array (), true );
			if (isset ( $data ['status'] ['code'] ) && $data ['status'] ['code'] == 200 && ! empty ( $data ['categories'] )) {
				$categories = $data ['categories'];
			}
			$this->cache->save ( $cache_key, $categories, Service_Model::$CACHE_EXPIRY_TIME );
		}
		return $categories;
	}
}