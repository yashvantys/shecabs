<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );

require_once APPPATH.'third_party/aws/aws-autoloader.php';
use Aws\S3\S3Client;
class Aws_sdk_upload {
	public $ci, $s3Client, $s3bucket;
	public function __construct() {
		$this->ci = & get_instance ();
		$this->s3Client = S3Client::factory ( array (
				'credentials' => array (
						'key' => $this->ci->config->item ( "aws_access_key_upload" ),
						'secret' => $this->ci->config->item ( "aws_secret_key_upload" ) 
				) 
		) );
		$this->s3bucket = $this->ci->config->item("aws_s3_bucket");
	}
	public function __call($name, $arguments = null) {
		if (! property_exists ( $this, $name )) {
			return call_user_func_array ( array (
					$this->s3Client,
					$name 
			), $arguments );
		}
	}
	/**
	 * Wrapper of putObject with duplicate check.
	 * If the file exists in bucket, it appends a unix timestamp to filename.
	 *
	 * @param  array  $params same as putObject
	 * @return result
	 */
	public function saveObject($params=array())
	{
		if($this->doesObjectExist($params['Bucket'],$params['Key'])){
			$path = pathinfo($params['Key']);
			$params['Key'] = $path['dirname'].'/'.$path['filename'].'-'.date('U').'.'.$path['extension'];
		}
		return $this->putObject($params);
	}
	/**
	 * Wrapper for best practices in putting an object.
	 * 
	 * @param array $params:
	 *        	Prefix, SourceFile, Key (filename)
	 * @return string URL of the uploaded object in s3
	 */
	public function saveObjectInBucket($params = array(), $type = null) {
		$error = null;
		// Create bucket
		try {
			$this->createBucket ( array (
					'Bucket' => $this->s3bucket
			) );
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong creating bucket for your file.");
			throw new Exception ( "Something went wrong creating bucket for your file.\n" . $e );
		}
		// Poll the bucket until it is accessible
		try {
			$this->waitUntil ( 'BucketExists', array (
					'Bucket' => $this->s3bucket 
			) );
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong waiting for the bucket for your file.");
			throw new Exception ( "Something went wrong waiting for the bucket for your file.\n" . $e );
		}
		// Upload an object
		$file_key = $params ['Prefix'] . '/' . $params ['Key'];
		$path = pathinfo ( $file_key );
		$extension = $path ['extension'];
		$mimes = new Guzzle\Http\Mimetypes ();
		$mimetype = $mimes->fromExtension ( $extension );
		try {
			//echo $params ['Uri'];die;
			if($type == 'ExternalFile'){
				$aws_object = $this->putObject ( array (
						'Bucket' => $this->s3bucket,
						'Key' => $file_key,
						'ACL' => 'public-read',
						'Body' => file_get_contents($params ['Uri']),
						'ContentType' => $mimetype
				) )->toArray ();
			}else{
				$aws_object = $this->saveObject ( array (
						'Bucket' => $this->s3bucket,
						'Key' => $file_key,
						'ACL' => 'public-read',
						'SourceFile' => $params ['SourceFile'],
						'ContentType' => $mimetype 
				) )->toArray ();
			}
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong saving your file.");
			throw new Exception ( "Something went wrong saving your file.\n" . $e );
		}
		// We can poll the object until it is accessible
		try {
			$this->waitUntil ( 'ObjectExists', array (
					'Bucket' => $this->s3bucket,
					'Key' => $file_key 
			) );
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong polling your file.");
			throw new Exception ( "Something went wrong polling your file.\n" . $e );
		}
		// Return result
		return $aws_object ['ObjectURL'];
	}

	public function saveObjectInBucket1($params = array(), $type = null) {
		$error = null;
		// Create bucket
		try {
			$this->createBucket ( array (
					'Bucket' => $this->s3bucket
			) );
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong creating bucket for your file.");
			throw new Exception ( "Something went wrong creating bucket for your file.\n" . $e );
		}
		// Poll the bucket until it is accessible
		try {
			$this->waitUntil ( 'BucketExists', array (
					'Bucket' => $this->s3bucket 
			) );
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong waiting for the bucket for your file.");
			throw new Exception ( "Something went wrong waiting for the bucket for your file.\n" . $e );
		}
		// Upload an object
		$file_key = $params ['Prefix'] . '/' . $params ['Key'];
		$path = pathinfo ( $file_key );
		$extension = $path ['extension'];
		$mimes = new Guzzle\Http\Mimetypes ();
		$mimetype = $mimes->fromExtension ( $extension );
		try {
			
			$post_data	=	array('width'=>$params ['width'],'height'=>$params ['height'],'chart_data'=>$params ['chart_data']);
			if($type == 'ExternalFile'){
				$aws_object = $this->putObject ( array (
						'Bucket' => $this->s3bucket,
						'Key' => $file_key,
						'ACL' => 'public-read',
						'Body' => $this->request_curl($params ['Uri'],$post_data),
						'ContentType' => $mimetype
				) )->toArray ();
			}else{
				$aws_object = $this->saveObject ( array (
						'Bucket' => $this->s3bucket,
						'Key' => $file_key,
						'ACL' => 'public-read',
						'SourceFile' => $params ['SourceFile'],
						'ContentType' => $mimetype 
				) )->toArray ();
			}
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong saving your file.");
			throw new Exception ( "Something went wrong saving your file.\n" . $e );
		}
		// We can poll the object until it is accessible
		try {
			$this->waitUntil ( 'ObjectExists', array (
					'Bucket' => $this->s3bucket,
					'Key' => $file_key 
			) );
		} catch ( Exception $e ) {
			log_message('error', "Something went wrong polling your file.");
			throw new Exception ( "Something went wrong polling your file.\n" . $e );
		}
		// Return result
		return $aws_object ['ObjectURL'];
	}

	function request_curl($url=null,$post_data=array()){
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_NOBODY, false);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.7.12) Gecko/20050915 Firefox/1.0.7");
		
		if(!empty($post_data)){
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
			curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
		}
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		// curl_setopt($ch, CURLOPT_REFERER, $_SERVER['REQUEST_URI']);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);
		// curl_setopt($ch, CURLOPT_POST, 1);
		$html	=	curl_exec($ch);
		curl_close($ch);
		return $html;
	}
}
