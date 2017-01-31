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
        
        loadForgetPassword:function() {
        	$('.forget-form').show();
			$('input[name="email"]').focus();
			jQuery('.forget-form').validate({
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
        
		loadLogin:function(str,sdtime,edtime) { 
			//alert(str);
			var sdtime;
			var edtime;
			
			var offset = -4.0;
			var clientDate = new Date();
			
			
			var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
			var serverDate = new Date(utc + (3600000*offset));
			
			
			var then = (serverDate.getMonth()+1)+'/'+serverDate.getDate()+'/'+serverDate.getFullYear();
			      then += ' '+serverDate.getHours()+':'+serverDate.getMinutes()+':'+serverDate.getSeconds();
			
			
			var spacedate = sdtime.split(' ');
            var dashdiv = spacedate[0].split('-');
            var colondiv = spacedate[1].split(':');
            
            var totalUDTfinaldate = dashdiv[1]+'/'+dashdiv[2]+'/'+dashdiv[0]+' '+colondiv[0]+':'+colondiv[1]+':'+colondiv[2];
            var StartGMTFormatd = new Date(totalUDTfinaldate);
            
            var spaceenddate = edtime.split(' ');
            var dashenddiv = spaceenddate[0].split('-');
            var colonenddiv = spaceenddate[1].split(':');
            
            var totalUDTEndfinaldate = dashenddiv[1]+'/'+dashenddiv[2]+'/'+dashenddiv[0]+' '+colonenddiv[0]+':'+colonenddiv[1]+':'+colonenddiv[2];
			
            var EndGMTFormatd = new Date(totalUDTEndfinaldate);
			var difference = Date.parse(EndGMTFormatd) - Date.parse(then);
			//alert(difference);
			
			
			if(dateCheck(StartGMTFormatd,EndGMTFormatd,then))
			{   //alert("Availed"); 
				//str +='<button data-dismiss="alert"  class="close close-error" type="button" >×</button>';
				str +='<div class="neclose"><a href="#" class="close" data-dismiss="alert">×</a><div>';
				if (difference > 2147483647 )
					difference = 2147483647;
				//alert("difference is: "+difference);
				$('#release').addClass('alert alert-valerror').html(str).fadeIn().delay(difference).fadeOut();
			}
			else
			{
				//alert("Not Availed");
			}
			
			function dateCheck(from,to,check) 
			{
				
				var fDate,lDate,cDate;
			    fDate = Date.parse(from);
				lDate = Date.parse(to);
				cDate = Date.parse(check);
			   // alert("current"+cDate);alert("from"+fDate);alert("to"+lDate);
			    if((cDate <= lDate)  && (cDate >= fDate)) 
			    {
			        return true;
			    }
			    return false;
			}

			//var resultInMinutes = Math.round(difference / 60000);
			//var resultsecond = Math.round(resultInMinutes * 60000);
			//var diff = Math.round(resultsecond * 6000);
			
			 //alert(difference);
			/*var a = new Date("2016 06 08 14:02:30"),
			    b = new Date("2016 06 08 14:42:32");

			var diff = b + "\n" + a + "\n" + "Difference: " + ((+b - +a)/1000)
			alert(diff);*/

			
			//$('#release').addClass('valerror').html(str) ;
			//str +='<button data-dismiss="alert" class="close" type="button" style="margin-top:-20px;">×</button>';
			//$('#release').addClass('alert alert-valerror').html(str).fadeIn().delay(difference).fadeOut();
			//$('#release').addClass('valerror').html(str);
			
			//return false;
			$('input[name="username"]').focus(); 
			$('.login-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				cache: false,
				//data-ajax:false, 
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
					error.insertAfter(element.closest('.input-group'));
				},
	
				submitHandler: function (form) {
					Custom.showLoader('.content,.main-content');
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
