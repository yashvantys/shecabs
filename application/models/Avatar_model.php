<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class Avatar_model extends Service_Model {
	public static $SERVICE_AVATARS = "/service/avatar/id_%s";
	public static $SERVICE_HIERARCHY = "/service/avatar/hierarchy";
	public static $SERVICE_AVARTAR_TYPES = "/service/sentiment/avatarTypes/list";
	public static $SERVICE_AVATAR_LIVE_SEARCH = '/service/avatar/live-search';
	function __construct() {
		parent::__construct ();
	}
	
	/**
	 * Returns the top entity accessible by the user for that client
	 *
	 * @param
	 *        	$client
	 * @param $email If
	 *        	email is null, it will take the current user's email id
	 */
	public function getTopAvatar($client_id, $email = null) {
		$avatar_id = null;
		if (empty ( $email )) {
			$email = $this->super_user;
		}
		$cache_key = "user-{$email}-{$client_id}-top-avatar";
		
		if (! $avatar_id = $this->cache->get ( $cache_key )) {
			
			$endpoint = "/service/avatar/topavatar";
			$data = $this->service->get ( "{$client_id}{$endpoint}", array (
					"email" => $email 
			) );
			if ($data->StatusCode == 200 && ! empty ( $data->avatarID )) {
				$avatar_id = $data->avatarID;
				$this->cache->save ( $cache_key, $avatar_id, Service_Model::$CACHE_EXPIRY_TIME );
			}
		}
		return $avatar_id;
	}
	public function getFilteredAvatars($client_id, $filter_avatar_id = 0, $email, $types = array()) {
		$avatars = array ();
		$all_avatars = array ();
		$cache_key = "avatar-list-{$email}-{$client_id}-{$filter_avatar_id}";
		if (! $all_avatars = $this->cache->get ( $cache_key )) {
			$service_url = sprintf ( $this::$SERVICE_AVATARS, $filter_avatar_id );
			$query_params = array ();
			$data = $this->service->get ( "{$client_id}{$service_url}", array (
					"email" => $email 
			), $query_params );
			if ($data->StatusCode == 200 && ! empty ( $data->avatars )) {
				$all_avatars = $data->avatars;
				$this->cache->save ( $cache_key, $data->avatars, Service_Model::$CACHE_EXPIRY_TIME );
			}
		}
		if (! empty ( $all_avatars )) {
			foreach ( $all_avatars as $avatar ) {
				if (empty ( $types ) || in_array ( $avatar->type, $types )) {
					$avatars [] = $avatar;
				}
			}
		}
		return $avatars;
	}
	public function getAvatarsLive($client_id, $email, $params = array()) {
		$avatars = array ();
		$result = $this->service->get ( "{$client_id}{$this::$SERVICE_AVATAR_LIVE_SEARCH}", array (
				"email" => $email 
		), $params );
		if (! empty ( $result->status->code ) && $result->status->code == 200 && ! empty ( $result->avatars )) {
			
			$avatars = $result->avatars;
		}
		return $avatars;
	}
	public function getFilteredEntities($client_id, $filter_avatar_id = 0, $email, $types = array()) {
		$entities = array ();
		
		$avatars = $this->getFilteredAvatars ( $client_id, $filter_avatar_id, $email, $types );
		
		if (! empty ( $avatars )) {
			foreach ( $avatars as $avatar ) {
				if ($avatar->type == "Physician") {
					if (! empty ( $avatar->person )) {
						$entities [] = $avatar->person;
					}
				} else {
					if (! empty ( $avatar->location )) {
						$entities [] = $avatar->location;
					}
				}
			}
		}
		return $entities;
	}
	
	/**
	 * Returns the details of give avatar
	 *
	 * @param unknown $client_id        	
	 * @param unknown $avatar_id        	
	 * @return Ambigous <multitype:, StdClass>
	 */
	public function getDetails($client_id, $avatar_id) {
		$result = array ();
		
		if (! empty ( $avatar_id )) {
			$cache_key = "avatar-info-{$client_id}-{$avatar_id}";
			if (! $result = $this->cache->get ( $cache_key )) {
				
				$endpoint = "/service/avatar/details/{$avatar_id}";
				$data = $this->service->get ( "{$client_id}{$endpoint}", array (
						"email" => $this->super_user 
				) );
				
				if (isset ( $data->status->code ) && $data->status->code == 200 && ! empty ( $data->data )) {
					$avatar = ( object ) $data->data;
					if (! empty ( $avatar )) {
						$result = ( object ) array (
								'ID' => @$avatar->id,
								'NAME' => @$avatar->name,
								'TYPE' => @$avatar->type,
								'CODE' => @$avatar->code,
								'PARENT_ID' => @$avatar->parentId,
								'LOCATION' => @$avatar->location,
								'PERSON' => @$avatar->person,
								"ADDRESS1" => @$avatar->address1,
								"ADDRESSE" => @$avatar->addresse,
								"CITY" => @$avatar->city,
								"STATE" => @$avatar->state,
								"ZIP" => @$avatar->zip,
								"COUNTY" => @$avatar->county,
								"COUNTRY" => @$avatar->country,
								"LONGITUDE" => @$avatar->longitude,
								"LATITUDE" => @$avatar->latitude,
								"EMAIL" => @$avatar->email,
								"PHONE" => @$avatar->phone,
								"WEBSITE" => @$avatar->website,
								"WORKING_HOURS" => @$avatar->working_hours,
								"SENIORITY" => @$avatar->seniority,
								"DEGREE" => @$avatar->degree,
								"SPECIALITY" => @$avatar->speciality 
						);
						$this->cache->save ( $cache_key, $result, Service_Model::$CACHE_EXPIRY_TIME );
					}
				}
			}
		}
		return $result;
	}
	public function getHTMLAddress($client_id, $avatar_id, $mode) {
		$avatar_address = '';
		if ($mode == 'mail') {
			$avatar_details = $this->getDetails ( $client_id, $avatar_id );
			$avatar_address = '';
			$avatar_address .= '<table style="border:0;" width="100%">';
			if (! empty ( $avatar_details->NAME )) {
				$avatar_address .= '<tr>';
				$avatar_address .= '<td style="text-align: right; font-weight: bold; font-size: 12px;">';
				$avatar_address .= $avatar_details->NAME;
				$avatar_address .= '</td style="text-align: right;">';
				$avatar_address .= '</tr>';
			}
			if (! empty ( $avatar_details->ADDRESS1 )) {
				$avatar_address .= '<tr>';
				$avatar_address .= '<td style="color: #8C8C8C; text-align: right;font-size: 12px;">';
				$avatar_address .= $avatar_details->ADDRESS1;
				$avatar_address .= '</td>';
				$avatar_address .= '</tr>';
			}
			if (! empty ( $avatar_details->CITY ) || ! empty ( $avatar_details->STATE ) || ! empty ( $avatar_details->ZIP )) {
				$avatar_address .= '<tr>';
				$avatar_address .= '<td style="color: #8C8C8C; text-align: right;font-size: 12px;">';
				if (! empty ( $avatar_details->CITY )) {
					$avatar_address .= $avatar_details->CITY . ' ';
				}
				if (! empty ( $avatar_details->STATE )) {
					$avatar_address .= $avatar_details->STATE . ' ';
				}
				if (! empty ( $avatar_details->ZIP )) {
					$avatar_address .= $avatar_details->ZIP;
				}
				$avatar_address .= '</td>';
				$avatar_address .= '</tr>';
			}
			if (! empty ( $avatar_details->PHONE )) {
				$avatar_address .= '<tr>';
				$avatar_address .= '<td style="color: #FFB76D; text-align: right; display:table-cell; vertical-align: middle;font-size: 12px;">';
				$avatar_address .= "<img  align=\"middle\" style=\"vertical-align: middle;\" src=\"" . site_url ( "/sites/all/modules/custom/reports/css/images/tele.png" ) . "\">" . $avatar_details->PHONE;
				$avatar_address .= '</td>';
				$avatar_address .= '</tr>';
			}
			$avatar_address .= '</table>';
		}
		
		return $avatar_address;
	}
	public function getRecursiveChildren($client_id, $email = null, $types = array()) {
		$avatars = array ();
		if ($email == null) {
			$email = $this->super_user;
		}
		$data = $this->service->get ( "{$client_id}{$this::$SERVICE_HIERARCHY}", array (
				"email" => $email 
		), array (
				"type" => $types 
		) );
		
		if (! empty ( $data->status->code ) && $data->status->code == 200) {
			
			$avatars = $data->avatars;
		}
		return $avatars;
	}
	public function getAvatarTypes($client_id, $email) {
		$avatar_Type_list = array ();
		$endpoint = "/service/sentiment/avatarTypes/list";
		$data = $this->service->get ( "{$client_id}{$this::$SERVICE_AVARTAR_TYPES}", array (
				"email" => $email 
		), array (), true );
		if ($data ['status'] ['code'] == 200 && ! empty ( $data ['status'] ['code'] )) {
			$avatar_Type_list = $data ['Avatars'];
		}
		return $avatar_Type_list;
	}
	public function getAvatarbyEntityCode($client_id, $entity_code) {
		$avatar = array ();
		$endpoint = "/service/avatar/avatar-from-entity-code";
		
		$data = $this->service->get ( "{$client_id}{$endpoint}", array (
				"email" => $this->super_user 
		), array (
				"entityCode" => $entity_code 
		), true );
		if ($data ['status'] ['code'] == 200 && ! empty ( $data ['status'] ['code'] )) {
			$avatar = $data ['avatar'];
		}
		return $avatar;
	}
}