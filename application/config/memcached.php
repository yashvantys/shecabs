<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| Memcached settings
| -------------------------------------------------------------------------
| Your Memcached servers can be specified below.
|
|	See: http://codeigniter.com/user_guide/libraries/caching.html#memcached
|
*/
$config = array(
	'default' => array(
		'hostname' => 'prod-cache1.ybjx1v.cfg.usw2.cache.amazonaws.com',
		'port'     => '11211',
		'weight'   => '1',
	),
);
