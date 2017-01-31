var PasswordJs = function () {
	
	 return {
	        //main function to initiate the module
		 init: function() {
				var initialized = false;
			    var input = $("#password_strength");

			    input.keydown(function () {
			        if (initialized === false) {
			            // set base options
			            input.pwstrength({
			                raisePower: 1.4,
			                minChar: 8,
			                verdicts: ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
			                scores: [17, 26, 40, 50, 60]
			            });

			            // add your own rule to calculate the password strength
			            input.pwstrength("addRule", "demoRule", function (options, word, score) {
			                return word.match(/[a-z].[0-9]/) && score;
			            }, 10, true);

			            // set as initialized 
			            initialized = true;
			        }
			    });
				}
	    };
	

}();