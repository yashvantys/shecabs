<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );

if (! function_exists ( 'asset_url()' )) {
	function asset_url() {
		return base_url () . 'assets/';
	}
}

if (! function_exists ( 'survey_app_url' )) {
	function survey_app_url() {
		$CI = & get_instance ();
		return $CI->config->item ( 'survey_app_base_url' );
	}
}

if (! function_exists ( 'get_client_id' )) {
	function get_client_id() {
		$CI = & get_instance ();
		return ! empty ( $CI->getClientId() ) ? $CI->getClientId() : '';
	}
}

if (! function_exists ( 'is_admin' )) {
	function is_admin() {
		$CI = & get_instance ();
		if (! empty ( $CI->isAdmin () )) {
			return true;
		}
		return false;
	}
}

if (! function_exists ( 'order_count' )) {
	function order_count($email) {
		$CI = & get_instance ();
		return $CI->orderCount ( $email );
	}
}

/* custom code by bfountain */
function compass_url($path='') {
	$CI = & get_instance ();
	$base = $CI->config->item ( 'compass_base_url' );
	return $base.$path;
}
function get_cache($datasource, $objname = '') {
	$CI = &get_instance ();
	$key = $CI->config->item ( 'username' ) . "-" . $objname . "-" . $datasource;
	$retval = $CI->cache->get ( $key );
	return $retval;
}
function set_cache($datasource, $objname = '', $obj) {
	$CI = &get_instance ();
	$key = $CI->config->item ( 'username' ) . "-" . $objname . "-" . $datasource;
	$retval = $CI->cache->write ( $obj, $key );
}

function clear_usercache() {
	$CI = &get_instance ();
	$CI->cache->delete_group ( $CI->config->item ( 'username' ) . "-" );
}
function add_chr($chrval, $inrval) {
	$ascii = ord ( $chrval );
	return chr ( $ascii + $inrval );
}

/**
 * String manipulations
 */

function str_starts_with($haystack, $needle) {
	// search backwards starting from haystack length characters from the end
	return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}
function str_ends_with($haystack, $needle) {
	// search forward starting from end minus needle length characters
	return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}

/**
 * A function to encode parameters to pass through URL
 *
 * @param unknown $string        	
 * @return string
 */
function base64url_encode($data) {
	return rtrim ( strtr ( base64_encode ( $data ), '+/', '-_' ), '=' );
}
/**
 * A function to decode parameters to passed through URL
 *
 * @param unknown $string        	
 * @return string
 */
function base64url_decode($data) {
	return base64_decode ( str_pad ( strtr ( $data, '-_', '+/' ), strlen ( $data ) % 4, '=', STR_PAD_RIGHT ) );
}

/**
 * Returns the url of a client Logo
 *
 * @param unknown $client_id        	
 */
function compass_client_logo($client_id) {
	$CI = &get_instance ();
	$compass_base_url = $CI->config->item ( "compass_base_url" );
	$url = "{$compass_base_url}/logo/datasource/{$client_id}.png";
	return $url;
}

/**
 * To return json output
 *
 * @param array $output        	
 */
function json_output($output) {
	$CI = &get_instance ();
	$CI->output->set_content_type ( 'application/json' )->set_output ( json_encode ( $output ) );
}
function ci_set_message($message, $type = 'info', $repeat = true) {
	$CI = &get_instance ();
	$messages = $CI->session->flashdata ( 'messages' );
	if (! isset ( $messages [$type] )) {
		$messages [$type] = array ();
	}
	
	if ($repeat || ! in_array ( $message, $messages [$type] )) {
		$messages [$type] [] = $message;
	}
	$CI->session->set_flashdata ( 'messages', $messages );
	// Messages not set when DB connection fails.
	return isset ( $_SESSION ['messages'] ) ? $_SESSION ['messages'] : NULL;
}
function startsWith($haystack, $needle) {
	return $needle === "" || strpos ( $haystack, $needle ) === 0;
}
function endsWith($haystack, $needle) {
	return $needle === "" || substr ( $haystack, - strlen ( $needle ) ) === $needle;
}

/**
 * Debug function
 */
function dpm($input, $name = NULL, $type = 'status') {
	$trace = debug_backtrace ();
	$caller = $trace [1];
	$call_func = " {$caller['function']}";
	if (isset ( $caller ['class'] ))
		$call_func = "{$caller['class']}.$call_func";
	$export = kprint_r ( $input, TRUE, $name, $call_func );
	ci_set_message ( $export, $type );
}
function kprint_r($input, $return = FALSE, $name = NULL, $call_func, $function = 'print_r') {
	// We do not want to krumo() strings and integers and such
	return dprint_r ( $input, $return, $name, $function, $call_func );
}




/**
 * Encodes special characters in a plain-text string for display as HTML.
 *
 * Also validates strings as UTF-8 to prevent cross site scripting attacks on
 * Internet Explorer 6.
 *
 * @param $text The
 *        	text to be checked or processed.
 *        	
 * @return An HTML safe version of $text, or an empty string if $text is not
 *         valid UTF-8.
 *        
 */
function check_plain($text) {
	return htmlspecialchars ( $text, ENT_QUOTES, 'UTF-8' );
}
function compass_avatar_get_address($client_id, $avatar_id) {
}

/**
 * Remove all emojis from string so that it won't fail writing to DB
 *
 * @param unknown $text        	
 * @return mixed
 */
function removeEmoji($text) {
	$clean_text = "";
	
	// Match Emoticons
	$regexEmoticons = '/[\x{1F600}-\x{1F64F}]/u';
	$clean_text = preg_replace ( $regexEmoticons, '', $text );
	
	// Match Miscellaneous Symbols and Pictographs
	$regexSymbols = '/[\x{1F300}-\x{1F5FF}]/u';
	$clean_text = preg_replace ( $regexSymbols, '', $clean_text );
	
	// Match Transport And Map Symbols
	$regexTransport = '/[\x{1F680}-\x{1F6FF}]/u';
	$clean_text = preg_replace ( $regexTransport, '', $clean_text );
	
	// Match Miscellaneous Symbols
	$regexMisc = '/[\x{2600}-\x{26FF}]/u';
	$clean_text = preg_replace ( $regexMisc, '', $clean_text );
	
	// Match Dingbats
	$regexDingbats = '/[\x{2700}-\x{27BF}]/u';
	$clean_text = preg_replace ( $regexDingbats, '', $clean_text );
	
	return $clean_text;
}
function &ci_static($name, $default_value = NULL, $reset = FALSE) {
	static $data = array (), $default = array ();
	// First check if dealing with a previously defined static variable.
	if (isset ( $data [$name] ) || array_key_exists ( $name, $data )) {
		// Non-NULL $name and both $data[$name] and $default[$name] statics exist.
		if ($reset) {
			// Reset pre-existing static variable to its default value.
			$data [$name] = $default [$name];
		}
		return $data [$name];
	}
	// Neither $data[$name] nor $default[$name] static variables exist.
	if (isset ( $name )) {
		if ($reset) {
			// Reset was called before a default is set and yet a variable must be
			// returned.
			return $data;
		}
		// First call with new non-NULL $name. Initialize a new static variable.
		$default [$name] = $data [$name] = $default_value;
		return $data [$name];
	}
	// Reset all: ($name == NULL). This needs to be done one at a time so that
	// references returned by earlier invocations of  also get
	// reset.
	foreach ( $default as $name => $value ) {
		$data [$name] = $value;
	}
	// As the function returns a reference, the return should always be a
	// variable.
	return $data;
}
function stringToCssClass($className) {
	return preg_replace ( '/\W+/', '', strtolower ( strip_tags ( $className ) ) );
}

function datetoISO8601($date_string) {
	$date = new DateTime ( $date_string );
	$date->setTimezone ( new DateTimeZone ( "UTC" ) );
	return $date->format ( 'Y-m-d\TH:i:s\Z' );
}
function time_since_text($from_date, $to_date = null) {
	$time_since = '--';
	
	$from_time = strtotime ( $from_date );
	$now = ($to_date != null) ? strtotime ( $to_date ) : strtotime ( date ( "Y:m:d H:i:s" ) );
	$time_diff = ($now - $from_time);
	
	if ($time_diff < 60) {
		$time_since = "few seconds";
	}
	if (($time_diff > (60)) && ($time_diff < (60 * 60))) {
		$time_since = round ( $time_diff / (60) );
		$time_since = ($time_since == 1) ? $time_since . " minute" : $time_since . " minutes";
	}
	if (($time_diff > (60 * 60)) && ($time_diff < (60 * 60 * 24))) {
		$time_since = round ( $time_diff / (60 * 60) );
		$time_since = ($time_since == 1) ? $time_since . " hour" : $time_since . " hours";
	}
	if ($time_diff >= (60 * 60 * 24)) {
		$time_since = round ( $time_diff / (60 * 60 * 24) );
		$time_since = ($time_since == 1) ? $time_since . " day" : $time_since . " days";
	}
	return $time_since;
}
/**
 * Common chart building method
 */
function build_chart($data, $chart_id, $swf_id, $width, $height, $more_options = array()) {
	$width = '100%';
	$chart_url = asset_url () . "libraries/fusioncharts/charts/" . $swf_id . ".swf";
	$rand = rand ( 1111, 9999 );
	$chart_id .= "_$rand";
	// Chart mode Flash ( flash ) or Javascript ( js )
	$mode = 'js';
	$error_message = "No data to display!";
	if (isset ( $more_options ['error_message'] ) && $more_options ['error_message'] != "") {
		$error_message = $more_options ['error_message'];
	}
	$class = (isset ( $more_options ['classes'] )) ? $more_options ['classes'] : '';
	if ($mode == 'flash') {
		$render_mode = '';
	} else if ($mode == 'js') {
		$render_mode = 'FusionCharts.setCurrentRenderer("javascript");';
	}
	$output = '<div class="row ' . $class . '"><div class="col-lg-12 col-md-12 col-sm-12"><div class="col-centered white-background">
			<div id="' . $chart_id . '"></div>
			<script type="text/javascript">
			  ' . $render_mode . '
			  var width = window.outerWidth;
			  var myChart = new FusionCharts( "' . $chart_url . '", "myChartId_' . $rand . '", "' . $width . '", "' . $height . '" );
			  myChart.setJSONData(' . $data . ');
			  myChart.configure("ChartNoDataText", "' . $error_message . '");
			  myChart.render("' . $chart_id . '");
			</script></div></div></div>';
	if (isset ( $more_options ['print_chart'] ) && $more_options ['print_chart'] == true && $more_options ['print_width'] > 0) {
		$output .= '<div class="row hide-screen-show-print"><div class="col-lg-12 col-md-12 col-sm-12"><div class="col-centered white-background">
			<div id="' . $chart_id . '_print"></div>
			<script type="text/javascript">
			  ' . $render_mode . '
			  var width = window.outerWidth;
			  var myChart = new FusionCharts( "' . $chart_url . '", "myChartId_' . ($rand + 1) . '", "' . $more_options ['print_width'] . '", "' . $height . '" );
			  myChart.setJSONData(' . $data . ');
			  myChart.configure("ChartNoDataText", "' . $error_message . '");
			  myChart.render("' . $chart_id . '_print");
			</script></div></div></div>';
	}
	return $output;
}

/**
 * Excel export helper module
 */
/**
 * Download data as excel
 * Second param accepts renderer method for the excel, array of object and function name.
 */
function getExcelReport($file_name='',$renderer=array(),$params=array()) {

	// Date for US - EST
	date_default_timezone_set('America/New_York');
	// Static variable for PHPExcel Obj
	$objPHPExcel = &ci_static('report_excel_object');
	$format = "xlsx";
	$writerType = 'Excel2007';// 'Excel5';
	$objPHPExcel = new PHPExcel ();
	// Template selection
	$reportTemplate = FCPATH . "assets/custom/reports/excel_templates/$file_name.$format";

	// Loading tempalte
	$objReader = PHPExcel_IOFactory::createReader($writerType);
	if(!empty($file_name) && file_exists($reportTemplate)){
		$objPHPExcel = $objReader->load($reportTemplate);
	} else{
		$objPHPExcel = new PHPExcel ();
		$objPHPExcel->setActiveSheetIndex ( 0 );
	}

	// Custom Variables
	$objPHPExcel->custom = new StdClass;
	$objPHPExcel->custom->sheetNumber = 0;
	$CI = &get_instance();
	if(!empty($renderer)){
		$CI->load->model(get_class($renderer[0]));
		call_user_func ( $renderer,$params ); 
	}
	

	// Object Restarting
	ob_clean();ob_start();

	header ( 'Cache-Control: private' );
	header ( 'Cache-Control: no-store' );
	header ( 'Expires: 0' );
	header ( 'Pragma: cache' );
	header ( 'Content-Type: application/vnd.ms-excel' );
	header ( 'Content-Disposition: attachment;filename="' . ucfirst($file_name) . '-' . date ( "Y-m-d H:i:s" ) . '.' . $format . '"' );
	header ( 'Cache-Control: max-age=0' );

	$objWriter = PHPExcel_IOFactory::createWriter ( $objPHPExcel, $writerType );
	$objWriter->setPreCalculateFormulas(true);
	$objWriter->save ( 'php://output' ); 
}

/**
 * HootSuite chart building method
 */
function build_hootsuite_chart($data, $chart_id, $swf_id, $width, $height, $more_options = array()) {
	$width = '100%';
	$chart_url = asset_url () . "libraries/fusioncharts/charts/" . $swf_id . ".swf";
	$rand = rand ( 1111, 9999 );
	$chart_id .= "_$rand";
	// Chart mode Flash ( flash ) or Javascript ( js )
	$mode = 'js';
	$error_message = "No data to display!";
	if (isset ( $more_options ['error_message'] ) && $more_options ['error_message'] != "") {
		$error_message = $more_options ['error_message'];
	}
	$class = (isset ( $more_options ['classes'] )) ? $more_options ['classes'] : '';
	if ($mode == 'flash') {
		$render_mode = '';
	} else if ($mode == 'js') {
		$render_mode = 'FusionCharts.setCurrentRenderer("javascript");';
	}
	$width ='100%';
	$classItem ="";
	$classItemStyle ="";
	if(isset($more_options['benchmark']) && $more_options['benchmark']==true){
// 		$classItem = 'style="border-bottom:1px solid !important;"';
		$classItemStyle = 'style="margin-top:1px !important; margin-left:2px !important;"';
	}
	$output = '<div class="row ' . $class . '" '.$classItemStyle.' ><div class="" '.$classItem.'><div class="col-centered white-background" style="box-shadow:none !important;">
			<div id="' . $chart_id . '"></div>
			<script type="text/javascript">
			  ' . $render_mode . '
			  var width = window.outerWidth;
			  var myChart = new FusionCharts( "' . $chart_url . '", "myChartId_' . $rand . '", "' . $width . '", "' . $height . '" );
			  myChart.setJSONData(' . $data . ');
			  myChart.configure("ChartNoDataText", "' . $error_message . '");
			  myChart.render("' . $chart_id . '");
			</script></div></div></div>';
	if (isset ( $more_options ['print_chart'] ) && $more_options ['print_chart'] == true && $more_options ['print_width'] > 0) {
		$output .= '<div class="row hide-screen-show-print"><div class=""><div class="col-centered white-background">
			<div id="' . $chart_id . '_print"></div>
			<script type="text/javascript">
			  ' . $render_mode . '
			  var width = window.outerWidth;
			  var myChart = new FusionCharts( "' . $chart_url . '", "myChartId_' . ($rand + 1) . '", "' . $more_options ['print_width'] . '", "' . $height . '" );
			  myChart.setJSONData(' . $data . ');
			  myChart.configure("ChartNoDataText", "' . $error_message . '");
			  myChart.render("' . $chart_id . '_print");
			</script></div></div></div>';
	}
	return $output;
}

function get_col_letter($num){
    $comp=0;    
    $pre='';
    $letters=array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
    
    //if the number is greater than 26, calculate to get the next letters
    if($num > 26){
        //divide the number by 26 and get rid of the decimal
        $comp=floor($num/26);
        
        //add the letter to the end of the result and return it
    if($comp!=0)
        // don't subtract 1 if the comparative variable is greater than 0
        return get_col_letter($comp).$letters[($num-$comp*26)];
    else
            return get_col_letter($comp).$letters[($num-$comp*26)-1];
    }
    else
    //return the letter
        return $letters[($num-1)];
}
function recursive_sort($array, $child) {
	usort ( $array, function ($a, $b) {
		return $a ['rank'] - $b ['rank'];
	} );
	foreach ( $array as $key => $value ) {
		if (isset ( $value [$child] ) && ! empty ( $value [$child] ) && is_array ( $value [$child] )) {
			$array [$key] [$child] = recursive_sort ( $value [$child], $child );
		}
	}
	return $array;
}
function getUserAgent() {
	$CI = &get_instance ();
	$CI->load->library('user_agent');

	$userAgent = new stdClass();

	if ($CI->agent->is_browser())
	{
		$agent = $CI->agent->browser();
	}
	elseif ($CI->agent->is_robot())
	{
		$agent = $CI->agent->robot();
	}
	elseif ($CI->agent->is_mobile())
	{
		$agent = $CI->agent->mobile();
	}
	else
	{
		$agent = 'Unidentified User Agent';
	}

	$userAgent->agent = $agent;
	$userAgent->version = $CI->agent->version();
	$userAgent->platform = $CI->agent->platform();

	return $userAgent;
}
