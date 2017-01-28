<?php
function get_date_range_service_value($data_value) {
	
	$service_value = "monthly";
	$options = array (
			'custom' => 'custom',
			'past_1' => 'custom',
			'this_7' => 'weekly',
			'this_30' => 'monthly',
			'this_90' => 'quarterly',
			'this_365' => 'yearly',
			'last_7' => 'weekly',
			'last_14' => 'custom',
			'last_21' => 'custom',
			'last_30' => 'monthly',
			'last_60' => 'custom',
			'last_90' => 'quarterly',
			'last_91' => 'quarterly',
			'last_180' => 'custom',
			'last_365' => 'yearly',
			'past_7' => 'custom',
			'past_30' => 'custom',
			'past_60' => 'custom',
			'past_90' => 'custom',
			'past_365' => 'custom',
			'past_730' => 'custom'
	);
	
	if(isset($options[$data_value])){
		$service_value = $options[$data_value];
	}
	
	return $service_value;
}

function get_filter_dates_result($date_value){
	
	
	$result = '';
	$dateFormat = "m/d/Y";
	$monthFormat = "m";
	$yearFormat = "Y";
	
		$custom_start_date = date($dateFormat);
		$custom_end_date = date($dateFormat);
	
	
	if ($date_value != null) {
		$split = explode("_", $date_value);
		$type = $split[0];
		if(!empty($split[1])){
			$days = $split[1];
		}else if ($custom_start_date != null && $custom_end_date !== null) {
			$diff = date_diff(date_create($custom_start_date), date_create($custom_end_date));
			$days = $diff->days;
		}

	/*if ($date_value != null) {
		$split = explode("_", $date_value);
		$type = $split[0];
		if(isset($split[1]))
			$days = $split[1];*/

		switch ($type) {
			
			case "custom":
				$days_value = $days + 1;
				$start_date = date($dateFormat, strtotime("-$days_value days", strtotime($custom_start_date)));
				$end_date = date($dateFormat, strtotime("-1 day", strtotime($custom_start_date)));
				$result = $start_date.'_'.$end_date;
			
				break;
			
			case "past":

				$start_date = date($dateFormat, strtotime("-$days days"));
				$end_date = date($dateFormat);
				$result = $start_date.'_'.$end_date;

				break;
			case "last":
				if($days == 7){
					$start_date = date($dateFormat, strtotime("monday last week"));
					$end_date = date($dateFormat, strtotime("sunday last week"));
					$result = $start_date.'_'.$end_date;
				}if($days == 14){
					$start_date = date($dateFormat, strtotime("monday this week", strtotime("-14 days")));
					$end_date = date($dateFormat, strtotime("sunday this week", strtotime("-7 days")));
					$result = $start_date.'_'.$end_date;
				}if($days == 21){
					$start_date = date($dateFormat, strtotime("monday this week", strtotime("-21 days")));
					$end_date = date($dateFormat, strtotime("sunday this week", strtotime("-7 days")));
					$result = $start_date.'_'.$end_date;
				}else if($days == 30){
					$start_date = date($dateFormat, strtotime('first day of last month'));
					$end_date = date($dateFormat, strtotime('last day of last month'));
					$result = $start_date.'_'.$end_date;
				}else if($days == 60){
					$start_date = date($dateFormat, mktime(0, 0, 0, date($monthFormat, strtotime("-2 month")), 1, date($yearFormat,strtotime("-2 month"))));
					$end_date = date($dateFormat, mktime(-1, 0, 0, date($monthFormat), 1, date($yearFormat)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 91){ // 91 is for 3 months
					$start_date = date($dateFormat, mktime(0, 0, 0, date($monthFormat, strtotime("-3 month")), 1, date($yearFormat,strtotime("-3 month"))));
					$end_date = date($dateFormat, mktime(-1, 0, 0, date($monthFormat), 1, date($yearFormat)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 90){ // 90 is for Quater
					$current_quarter = ceil ( date ( $monthFormat,  time() ) / 3 );
					if($current_quarter == 4){
						$result = '07/01/'.date($yearFormat).'_09/30/'.date($yearFormat);
					}else if($current_quarter == 3){
						$result = '04/01/'.date($yearFormat).'_06/30/'.date($yearFormat);
					}else if($current_quarter == 2){
						$result = '01/01/'.date($yearFormat).'_03/31/'.date($yearFormat);
					}else if($current_quarter == 1){
						$result = '10/01/'.date($yearFormat,strtotime('-1 year')).'_12/31/'.date($yearFormat, strtotime('-1 year'));
					}
				}else if($days == 180){ // 180 is for Two Quaters
					$current_quarter = ceil ( date ( $monthFormat,  time() ) / 3 );
					if($current_quarter == 4){
						$result = '04/01/'.date($yearFormat).'_09/30/'.date($yearFormat);
					}else if($current_quarter == 3){
						$result = '01/01/'.date($yearFormat).'_06/30/'.date($yearFormat);
					}else if($current_quarter == 2){
						$result = '10/01/'.date($yearFormat,strtotime('-1 year')).'_03/31/'.date($yearFormat);
					}else if($current_quarter == 1){
						$result = '07/01/'.date($yearFormat,strtotime('-1 year')).'_12/31/'.date($yearFormat, strtotime('-1 year'));
					}
				}else if($days == 365){
					$result = '01/01/'.date($yearFormat,strtotime('-1 year')).'_12/31/'.date($yearFormat, strtotime('-1 year'));
				}else if($days == 730){
					$result = '01/01/'.date($yearFormat,strtotime('-2 year')).'_12/31/'.date($yearFormat, strtotime('-1 year'));
				}

				break;
			case "this":
				$end_date = date($dateFormat);
				if($days == 7){
					$start_date = date($dateFormat, strtotime("monday this week"));
					$result = $start_date.'_'.$end_date;
				}else if($days == 30){
					$start_date = date($dateFormat, mktime(0, 0, 0, date($monthFormat, time()), 1, date($yearFormat,time())));
					$result = $start_date.'_'.$end_date;
				}else if($days == 90){
					$current_quarter = ceil ( date ( $monthFormat,  time() ) / 3 );
					if($current_quarter == 4){
						$result = '10/01/'.date($yearFormat).'_'.$end_date;
					}else if($current_quarter == 3){
						$result = '07/01/'.date($yearFormat).'_'.$end_date;
					}else if($current_quarter == 2){
						$result = '04/01/'.date($yearFormat).'_'.$end_date;
					}else if($current_quarter == 1){
						$result = '01/01/'.date($yearFormat).'_'.$end_date;
					}
				}else if($days == 365){
					$result = '01/01/'.date($yearFormat).'_'.$end_date;
				}

				break;
		}
	}
	
	return $result;
}

function get_filter_compared_dates($date_value = null, $custom_start_date = null, $custom_end_date = null) {
	$result = '';
	$dateFormat = "m/d/y";
	$monthFormat = "m";
	$yearFormat = "y";
	
	if($custom_start_date == null){
		$custom_start_date = date($dateFormat);
	}
	
	if ($date_value != null) {
		$split = explode("_", $date_value);
		$type = $split[0];
		if(!empty($split[1])){
			$days = $split[1];
		}else if ($custom_start_date != null && $custom_end_date !== null) {
			$diff = date_diff(date_create($custom_start_date), date_create($custom_end_date));
			$days = $diff->days;
		}
		switch ($type) {
			case "custom":
				$days_value = $days + 1;
				$start_date = date($dateFormat, strtotime("-$days_value days", strtotime($custom_start_date)));
				$end_date = date($dateFormat, strtotime("-1 day", strtotime($custom_start_date)));
				$result = $start_date.'_'.$end_date;

				break;
			case "past":
				$days_value = $days + 1;
				$start_date = date($dateFormat, strtotime("-$days_value days", strtotime($custom_start_date)));
				$end_date = date($dateFormat, strtotime("-1 day", strtotime($custom_start_date)));
				$result = $start_date.'_'.$end_date;

				break;
			case "last":
				if($days == 7){
					$start_date = date($dateFormat, strtotime("monday last week", strtotime($custom_start_date)));
					$end_date = date($dateFormat, strtotime("sunday last week", strtotime($custom_start_date)));
					$result = $start_date.'_'.$end_date;
				}if($days == 14){
					$start_date = date($dateFormat, strtotime("monday this week", strtotime("-14 days", strtotime($custom_start_date))));
					$end_date = date($dateFormat, strtotime("sunday this week", strtotime("-7 days", strtotime($custom_start_date))));
					$result = $start_date.'_'.$end_date;
				}if($days == 21){
					$start_date = date($dateFormat, strtotime("monday this week", strtotime("-21 days", strtotime($custom_start_date))));
					$end_date = date($dateFormat, strtotime("sunday this week", strtotime("-7 days", strtotime($custom_start_date))));
					$result = $start_date.'_'.$end_date;
				}else if($days == 30){
					$start_date = date($dateFormat, strtotime('first day of last month', strtotime($custom_start_date)));
					$end_date = date($dateFormat, strtotime('last day of last month', strtotime($custom_start_date)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 60){
					$start_date = date($dateFormat, mktime(0, 0, 0, date($monthFormat, strtotime("-2 month", strtotime($custom_start_date))), 1, date($yearFormat,strtotime("-2 month", strtotime($custom_start_date)))));
					$end_date = date($dateFormat, mktime(-1, 0, 0, date($monthFormat), 1, date($yearFormat)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 91){ // 91 is for 3 months
					$start_date = date($dateFormat, mktime(0, 0, 0, date($monthFormat, strtotime("-3 month", strtotime($custom_start_date))), 1, date($yearFormat,strtotime("-3 month", strtotime($custom_start_date)))));
					$end_date = date($dateFormat, mktime(-1, 0, 0, date($monthFormat), 1, date($yearFormat)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 90){ // 90 is for Quater
					$current_quarter = ceil ( date ( $monthFormat,  strtotime($custom_start_date) ) / 3 );
					if($current_quarter == 4){
						$result = '07/01/'.date($yearFormat).'_09/30/'.date($yearFormat);
					}else if($current_quarter == 3){
						$result = '04/01/'.date($yearFormat).'_06/30/'.date($yearFormat);
					}else if($current_quarter == 2){
						$result = '01/01/'.date($yearFormat).'_03/31/'.date($yearFormat);
					}else if($current_quarter == 1){
						$result = '10/01/'.date($yearFormat,strtotime('-1 year', strtotime($custom_start_date))).'_12/31/'.date($yearFormat, strtotime('-1 year', strtotime($custom_start_date)));
					}
				}else if($days == 180){ // 180 is for Two Quaters
					$current_quarter = ceil ( date ( $monthFormat, strtotime($custom_start_date) ) / 3 );
					if($current_quarter == 4){
						$result = '04/01/'.date($yearFormat).'_09/30/'.date($yearFormat);
					}else if($current_quarter == 3){
						$result = '01/01/'.date($yearFormat).'_06/30/'.date($yearFormat);
					}else if($current_quarter == 2){
						$result = '10/01/'.date($yearFormat,strtotime('-1 year')).'_03/31/'.date($yearFormat);
					}else if($current_quarter == 1){
						$result = '07/01/'.date($yearFormat,strtotime('-1 year')).'_12/31/'.date($yearFormat, strtotime('-1 year', strtotime($custom_start_date)));
					}
				}else if($days == 365){
					$result = '01/01/'.date($yearFormat,strtotime('-1 year', strtotime($custom_start_date))).'_12/31/'.date($yearFormat, strtotime('-1 year', strtotime($custom_start_date)));
				}else if($days == 730){
					$result = '01/01/'.date($yearFormat,strtotime('-2 year', strtotime($custom_start_date))).'_12/31/'.date($yearFormat, strtotime('-1 year', strtotime($custom_start_date)));
				}

				break;
			case "this":
				$end_date = date($dateFormat);
				if($days == 7){
					$start_date = date($dateFormat, strtotime("monday last week", strtotime($custom_start_date)));
					$end_date = date($dateFormat, strtotime("sunday last week", strtotime($custom_start_date)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 30){
					$start_date = date($dateFormat, strtotime('first day of last month', strtotime($custom_start_date)));
					$end_date = date($dateFormat, strtotime('last day of last month', strtotime($custom_start_date)));
					$result = $start_date.'_'.$end_date;
				}else if($days == 90){
					$current_quarter = ceil ( date ( $monthFormat,  strtotime($custom_start_date) ) / 3 );
					if($current_quarter == 4){
						$result = '07/01/'.date($yearFormat).'_09/30/'.date($yearFormat);
					}else if($current_quarter == 3){
						$result = '04/01/'.date($yearFormat).'_06/30/'.date($yearFormat);
					}else if($current_quarter == 2){
						$result = '01/01/'.date($yearFormat).'_03/31/'.date($yearFormat);
					}else if($current_quarter == 1){
						$result = '10/01/'.date($yearFormat,strtotime('-1 year', strtotime($custom_start_date))).'_12/31/'.date($yearFormat, strtotime('-1 year', strtotime($custom_start_date)));
					}
				}else if($days == 365){
					$result = '01/01/'.date($yearFormat,strtotime('-1 year', strtotime($custom_start_date))).'_12/31/'.date($yearFormat, strtotime('-1 year', strtotime($custom_start_date)));
				}
					
				break;
		}
	}
	
	return $result;
}

function get_quarter_dates($start_date, $end_date, $count) {
	$quarters = array();
	$monthFormat = "n";
	$yearFormat = "y";

	$start_month = date($monthFormat, strtotime($start_date));
	$start_quarter = ($start_month < 4) ? 1 : (($start_month > 3 && $start_month < 7) ? 2 : (($start_month > 6 && $start_month < 10) ? 3 : 4));
	$start_year = date($yearFormat, strtotime($start_date));

	$end_month = date($monthFormat, strtotime($end_date));
	$end_quarter = ($end_month < 4) ? 1 : (($end_month > 3 && $end_month < 7) ? 2 : (($end_month > 6 && $end_month < 10) ? 3 : 4));
	$end_year = date($yearFormat, strtotime($end_date));

	$latest_month = date($monthFormat, strtotime($end_date));

	for($year = $start_year; $year <= $end_year; $year++){
		for($quarter = 1; $quarter <= 4; $quarter++){
			if(!(($year == $start_year && $quarter < $start_quarter) || ($year == $end_year && $quarter > $end_quarter))){
				$quarters[] = $year . "-" . $quarter;
			}
		}
	}

	$quarters = array_slice($quarters, -$count, $count);

	return $quarters;
}




