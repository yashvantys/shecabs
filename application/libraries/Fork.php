<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Fork Class
 *
 * Work with remote servers via cURL much easier than using the native PHP bindings.
 *
 * @package        	CodeIgniter
 * @subpackage    	Libraries
 * @category    	Libraries
 * @author        	Philip Sturgeon
 * @license         http://philsturgeon.co.uk/code/dbad-license
 * @link			http://philsturgeon.co.uk/code/codeigniter-curl
 */
class Fork
{
    private $_handles = array();
    private $_mh      = array();
 
    function __construct()
    {
        $this->_mh = curl_multi_init();
    }
 
    function add($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 36000); // 10 hours
        curl_multi_add_handle($this->_mh, $ch);
        $this->_handles[] = $ch;
        return $this;
    }
 
    function run()
    {
        $running=null;
        do {
            curl_multi_exec($this->_mh, $running);
            usleep (250000);
        } while ($running > 0);
        for($i=0; $i < count($this->_handles); $i++) {
            $out = curl_multi_getcontent($this->_handles[$i]);
            $data[$i] = json_decode($out);
            curl_multi_remove_handle($this->_mh, $this->_handles[$i]);
        }
        curl_multi_close($this->_mh);
        return $data;
    }
}