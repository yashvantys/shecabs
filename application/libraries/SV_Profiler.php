<?php
class SV_Profiler extends CI_Profiler {
	function __construct($config = array()) {
		$this->_available_sections [] = "service_call";
		parent::__construct ( $config );
	}
	
	/**
	 * Compile config information
	 *
	 * Lists developer config variables
	 *
	 * @return string
	 */
	function _compile_service_call() {
		$output = "\n\n" . '<fieldset id="ci_profiler_config" style="border:1px solid #000;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee;">' . "\n" . '<legend style="color:#000;">&nbsp;&nbsp;Service Calls&nbsp;&nbsp;(<span style="cursor: pointer;" onclick="var s=document.getElementById(\'ci_profiler_service_table\').style;s.display=s.display==\'none\'?\'\':\'none\';this.innerHTML=this.innerHTML==\'' . $this->CI->lang->line ( 'profiler_section_show' ) . '\'?\'' . $this->CI->lang->line ( 'profiler_section_hide' ) . '\':\'' . $this->CI->lang->line ( 'profiler_section_show' ) . '\';">' . $this->CI->lang->line ( 'profiler_section_show' ) . "</span>)</legend>\n\n\n" . '<table style="width:100%;display:none;" id="ci_profiler_service_table">' . "\n";
		if (! empty ( $this->CI->config->item ( 'service_calls' ) )) {
			foreach ( $this->CI->config->item ( 'service_calls' ) as $service ) {
				if (is_array ( $service ) or is_object ( $service )) {
					$service = print_r ( $service, TRUE );
				}
				
				$output .= '<tr><td style="padding:5px;vertical-align:top;color:#900;background-color:#ddd;">' . $service . "</td></tr>\n";
			}
		}
		
		return $output . "</table>\n</fieldset>";
	}
	
	/**
	 * Compile config information
	 *
	 * Lists developer config variables
	 *
	 * @return string
	 */
	protected function _compile_config() {
		$output = "\n\n" . '<fieldset id="ci_profiler_config" style="border:1px solid #000;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee;">' . "\n" . '<legend style="color:#000;">&nbsp;&nbsp;' . $this->CI->lang->line ( 'profiler_config' ) . '&nbsp;&nbsp;(<span style="cursor: pointer;" onclick="var s=document.getElementById(\'ci_profiler_config_table\').style;s.display=s.display==\'none\'?\'\':\'none\';this.innerHTML=this.innerHTML==\'' . $this->CI->lang->line ( 'profiler_section_show' ) . '\'?\'' . $this->CI->lang->line ( 'profiler_section_hide' ) . '\':\'' . $this->CI->lang->line ( 'profiler_section_show' ) . '\';">' . $this->CI->lang->line ( 'profiler_section_show' ) . "</span>)</legend>\n\n\n" . '<table style="width:100%;display:none;" id="ci_profiler_config_table">' . "\n";
		
		foreach ( $this->CI->config->config as $config => $val ) {
			if ($config != "service_calls") {
				
				if (is_array ( $val ) or is_object ( $val )) {
					$val = print_r ( $val, TRUE );
				}
				
				$output .= '<tr><td style="padding:5px;vertical-align:top;color:#900;background-color:#ddd;">' . $config . '&nbsp;&nbsp;</td><td style="padding:5px;color:#000;background-color:#ddd;">' . htmlspecialchars ( $val ) . "</td></tr>\n";
			}
		}
		
		return $output . "</table>\n</fieldset>";
	}
	function run() {
		$output = parent::run ();
		return $output;
	}
}