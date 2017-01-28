<?php
class Authentication_Controller extends SV_Controller {
	public function __construct() {
		parent::__construct ();
		
		if (! empty ( $this->session->userdata ['logged_in'] )) {
			$this->email = $this->session->userdata ['email'];
			$this->load->vars ( array (
					'logged_in' => true,
					'email' => $this->email 
			) );
			$this->logged_in = true;
		} else {
			$query_params = array ();
			// FIXME Don't redirect the ajax requests coming out from reports section.
			if ($this->uri->segment ( 1 ) == "reports" && $this->uri->segment ( 3 ) == "dom_request") {
			} else {
				if ($this->input->is_ajax_request ()) {
					http_response_code ( 401 );
					exit ( 'sessionTimeOut' );
				}
				
				// Java session timeout checking
				if (! empty ( $this->input->get ( "sessionTimeout" ) )) {
					exit ( '<script type="text/javascript">window.top.location.href ="' . current_url ( false ) . '";</script>' );
				}
				// Save the current url for redirection after logging in
				if (! empty ( $this->uri->segment ( 1 ) )) {
					$this->session->set_userdata ( 'previous_url', current_url () );
				}
				if ($this->uri->segment ( 1 ) == "affiliated" && $this->uri->segment ( 3 ) == "upload") {
					$this->session->set_userdata ( 'affiliatedToken', base64url_encode ( json_encode ( array (
							"clientId" => $this->uri->segment ( 2 ),
							"token" => $this->uri->segment ( 4 ) 
					) ) ) );
					redirect ( 'affiliated/' . $this->uri->segment ( 2 ) . '/home/' . $this->uri->segment ( 4 ), 'location' );
				}
				redirect ( 'user/login', 'location' );
			}
		}
	}
}
