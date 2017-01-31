var User = function () {
	return {
        //main function to initiate the module
        init: function () {
			$.validator.addMethod("passwordValidate", function(value, element) {
                var validated = false;
                var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
                if (regex.test(value)) {
                    validated = true;
                }
                return validated;
            }, "Must contain at least one upper-case letter and one number");
        },
		loadLogin:function() {
			$('input[name="username"]').focus();
			$('.login-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				rules: {
					username: {
						required: true
					},
					password: {
						required: true
					},
					login_as: {
						required: true
					},
					remember: {
						required: false
					}
				},
	
				messages: {
					username: {
						required: "Username is required."
					},
					password: {
						required: "Password is required."
					}
				},
	
				invalidHandler: function (event, validator) { //display error alert on form submit   
					$('.alert-danger', $('.login-form')).show();
				},
	
				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.form-group').addClass('has-error'); // set error class to the control group
				},
	
				success: function (label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
				},
	
				errorPlacement: function (error, element) {
					error.insertAfter(element.closest('.input-icon'));
				},
	
				submitHandler: function (form) {
					Custom.showLoader('.content,.login-content');
					form.submit();
				}
			});
	
			$('.login-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.login-form').validate().form()) {
						$('.login-form').submit();
					}
					return false;
				}
			});
		},
		loadForgetPassword:function () {
			$('.forget-form').show();
			$('input[name="email"]').focus();
			$('.forget-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",
				rules: {
					email: {
						required: true,
						email: true
					}
				},
	
				messages: {
					email: {
						required: "Email is required."
					}
				},
	
				invalidHandler: function (event, validator) { //display error alert on form submit   
	
				},
	
				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.form-group').addClass('has-error'); // set error class to the control group
				},
	
				success: function (label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
				},
	
				errorPlacement: function (error, element) {
					error.insertAfter(element.closest('.input-icon'));
				},
	
				submitHandler: function (form) {
					Custom.showLoader('.content,.login-content');
					form.submit();
				}
			});
	
			$('.forget-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.forget-form').validate().form()) {
						$('.forget-form').submit();
					}
					return false;
				}
			});
		},
		loadSignUp:function () {
			$('.register-form').show();
			$('input[name="fullname"]').focus();
			function format(state) {
				if (!state.id) return state.text; // optgroup
				return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
			}
			
			$('.register-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",
				rules: {
					fullname: {
						required: true
					},
					email: {
						required: true,
						email: true
					},
					password: {
						required: true,
                        minlength: 6,
                        maxlength: 20,
						passwordValidate: true
					},
					rpassword: {
						equalTo: "#register_password"
					}
				},
		
				messages: { // custom messages for radio buttons and checkboxes
					tnc: {
						required: "Please accept TNC first."
					}
				},
		
				invalidHandler: function (event, validator) { //display error alert on form submit   
		
				},
		
				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.form-group').addClass('has-error'); // set error class to the control group
				},
		
				success: function (label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
				},
		
				errorPlacement: function (error, element) {
					if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
						error.insertAfter($('#register_tnc_error'));
					} else if (element.closest('.input-icon').size() === 1) {
						error.insertAfter(element.closest('.input-icon'));
					} else {
						error.insertAfter(element);
					}
				},
		
				submitHandler: function (form) {
					Custom.showLoader('.content,.login-content');
					form.submit();
				}
			});
			
			$('.register-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.register-form').validate().form()) {
						$('.register-form').submit();
					}
					return false;
				}
			});
		},
		loadChangePassword:function () {
			$('input[name="password"]').focus();
			$('.reset-password-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",
				rules: {
					password: {
						required: true,
                        minlength: 6,
                        maxlength: 20,
						passwordValidate: true
					},
					rpassword: {
						equalTo: "#reset_password"
					}
				},
				messages: {
					password: {
						required: "Password is required.",
						minlength: "Password must have 6 letters.",
						maxlength: "Password length should not be more than 20."
					}
				},
				invalidHandler: function (event, validator) { //display error alert on form submit   
		
				},
				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.form-group').addClass('has-error'); // set error class to the control group
				},
				success: function (label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
				},
				errorPlacement: function (error, element) {
					if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
						error.insertAfter($('#register_tnc_error'));
					} else if (element.closest('.input-icon').size() === 1) {
						error.insertAfter(element.closest('.input-icon'));
					} else {
						error.insertAfter(element);
					}
				},
				submitHandler: function (form) {
					Custom.showLoader('.content,.login-content');
					form.submit();
				}
			});
			
			$('.reset-password-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.reset-password-form').validate().form()) {
						$('.reset-password-form').submit();
					}
					return false;
				}
			});
		}
	};
}();
