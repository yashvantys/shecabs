<?php 
function get_service_url($var,$params){
	return $var.'?'. http_build_query($params);
}

function anchor($uri = '', $title = '', $attributes = '')
{
	$title = (string) $title;

	$site_url = is_array($uri)
	? base_url($uri)
	: preg_match('#^(\w+:)?//#i', $uri) ? $uri : base_url($uri);

	if ($title === '')
	{
		$title = $site_url;
	}

	if ($attributes !== '')
	{
		$attributes = _stringify_attributes($attributes);
	}

	return '<a href="'.$site_url.'"'.$attributes.'>'.$title.'</a>';
}