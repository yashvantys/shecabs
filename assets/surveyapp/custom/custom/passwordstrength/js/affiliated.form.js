var AffiliatedForm = function () {
	
	 return {
	        //main function to initiate the module 
		 init: function() {
			 
				var initialized = false;
				//To make phone filed as per US phone number format
			    $("#phone").mask("(999) 999-9999");
			    $("#phone_number").mask("(999) 999-9999");
				}
	    };
	

}();