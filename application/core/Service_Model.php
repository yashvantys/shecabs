<?php
class Service_Model extends CI_Model {
	protected $super_user;
	public static $CACHE_EXPIRY_TIME = 1800;
	public static $FORM_INDENT_CLASS = " padding-left-30 ";
	public $app_id, $app_secret;
	public function __construct() {
		parent::__construct ();
		$this->super_user = $this->config->item ( 'super_user' );
		$this->app_id = $this->config->item("bf_app_id");
		$this->app_secret = $this->config->item("bf_app_secret");
	}
	
	public function getAppId() {
		return $this->app_id;
	}
	public function getAppSecret() {
		return $this->app_secret;
	}
	
	/**
	 * To send email of reports through compass
	 *
	 * @param $client -
	 *        	Name of the client
	 * @param $avatar_id -
	 *        	ID of avatar
	 * @param $report_type -
	 *        	Report type
	 */
	public function sendEmail($subject, $content, $sender_mail, $receiver_email, $client_id, $rid, $for = '', $attachments = array(), $send_now = true) {
		$date = date('Y-m-d H:i:s' );
		$notification_id = 0;
		$post_data = array (
				'parentId' => 0,
				'type' => 'reports',
				'fromEmail' => $sender_mail,
				'fromDatasource' => $client_id,
				'fromMenu' => 'NA',
				'fromPage' => 'NA',
				'fromWidget' => 'NA',
				'subject' => $subject,
				'message' => $content,
				'contactEmail' => $receiver_email,
				'sendImmediately' => $send_now,
				'attachments' => $attachments 
		);
		
		$json = json_encode ( $post_data );
		
		$endpoint = "{$client_id}/service/notification/create";
		$data = $this->service->post ( $endpoint, array (
				"email" => $sender_mail, "content-type" => "application/json"  
		), array (), $json );
		if ($data->status->code == 200) {
			$notification_id = $data->data->notificationId;
		}
		return $notification_id;
	}
	public function createRedirectLink($sensor_id, $notification_id, $to_email, $redirect_url, $campaign, $action) {
		$params = array (
				"sensorId" => $sensor_id,
				"notificationId" => $notification_id,
				"contactEmail" => $to_email,
				"campaign" => $campaign,
				"action" => $action,
				"redirectUrl" => $redirect_url 
		);
		$data = http_build_query ( $params );
		$service_endpoint = "admin/service/security/redirect-link/create";
		$data = $this->service->post ( $service_endpoint, array (
				"email" => $this->super_user 
		), array (), $params );
	}
	
	public function build_data($params) {
		$query = http_build_query ( $params, null, '&' );
		$param_string = preg_replace ( '/%5B(?:[0-9]|[1-9][0-9]+)%5D=/', '=', $query );
		return $param_string;
	}
	
	public function getTaskLogURL($task_id){
		$compass_base_url = $this->config->item("compass_base_url");
		$url = $compass_base_url."GetTaskLog?id={$task_id}";
		return $url;
	}
}
