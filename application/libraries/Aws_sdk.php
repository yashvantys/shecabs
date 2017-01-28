<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );

require_once APPPATH.'third_party/aws/aws-autoloader.php';
use Aws\S3\S3Client;
use Aws\Ses\SesClient;
use Aws\Ses\Exception\MessageRejectedException;
class Aws_sdk {
	public $ci, $sesClient,$s3Client, $s3bucket;
	
	public function __construct() {
		$this->ci = & get_instance ();
		$this->sesClient = SesClient::factory ( array (
				'region' => 'us-west-2',
				'version' => 'latest',
				'tls' =>true,
				'credentials' => array (
						'key' => $this->ci->config->item ( "aws_access_key" ),
						'secret' => $this->ci->config->item ( "aws_secret_key" ) 
				) 
		) );
		
	}
	public function __call($name, $arguments = null) {
		if (! property_exists ( $this, $name )) {
			return call_user_func_array ( array (
					$this->sesClient,
					$name 
			), $arguments );
		}
	}
	// send email
	
	public function sendEmail($toAddress,$ccAddress,$subject,$body){
		
		
		$request = array();
		$request['Source'] = $this->ci->config->item ( "from_email_sso" );
		$request['Destination']['ToAddresses'] = $toAddress;
		//$request['Destination']['CcAddresses'] = array(CCADDRESS);
		$request['Destination']['BccAddresses'] = $ccAddress;
		
		
		$request['Message']['Subject']['Data'] = $subject;
		$request['Message']['Body']['Html']['Data'] = $body;
		
			
		try {
			 return $result = $this->sesClient->sendEmail($request);
			 //$messageId = $result->get('MessageId');
			 //echo("Email sent! Message ID: $messageId"."\n");

		} catch (Exception $e) {
			// echo("The email was not sent. Error message: ");
			 return $e->getMessage();
		}
	}
}
