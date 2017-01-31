var Payment = function() {
    return {
        checkout: function(paymentId) {



            var currentType = "misc";
            var logoSpan = $(".crd-num-wrp");
            var ccObj = $(".credit-card");
            var ccValidation = null;
            var billingWrapper = $(".billing-wrapper");
            var paymentOrderCardLogo = $(".crd-num-wrp-confirm");
            $(".credit-card").validateCreditCard(function(result) {
                var me = $(this);
                ccValidation = result;
                if (result.card_type != null && currentType != result.card_type.name) {
                	logoSpan.removeClass(currentType).addClass(result.card_type.name);
                	paymentOrderCardLogo.removeClass(currentType).addClass(result.card_type.name);
                    console.log(result);
                    currentType = result.card_type.name;
                }
            });
            $(".only-number").keypress(
                function(e) {
                    // if the letter is not digit then display error and
                    // don't type anything
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        // display error message
                        return false;
                    }
                });
            $(".only-alpha").keypress(
                    function(e) {
                    	var regex = new RegExp("^[a-zA-Z\b]+$");
                        var key = e.which || e.keyCode;
                        keychar = String.fromCharCode(key);
                       	if(!regex.test(keychar)){
                        	if (!(key == 46 || key == 32 || key == 8 || (key >= 35 && key <= 40))) {
                        		e.preventDefault();
                                return false;
                        	}
                        }
                    });
            $(".auto-renew").on("change", function(e){
            	var me = $(this);
            	if(me.is(":checked")) {
            		billingWrapper.removeClass("hidden");
            	} else {
            		billingWrapper.addClass("hidden");
            	}
            });

            $.validator.addMethod("ccValidator", function(value, element) {
                var validated = false;
                if (ccValidation != null && ccValidation.valid && ccValidation.length_valid && ccValidation.luhn_valid) {
                    validated = true;
                }
                return validated;
            }, "Please enter a valid card number");
            
            $.validator.addMethod("zipcodeValidator", function(value, element) {
            	return this.optional(element) || !!value.trim().match(/^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/)
            }, "Please enter a valid zipcode");
            
            $.validator.addMethod("cityValidator", function(value, element) {
            	return this.optional(element) || /^[a-z ]+$/i.test(value)
            }, "Please enter a valid city");
            
            $.validator.addMethod("termsValidator", function(value, element) {
        		$('#payment_terms_conditions_error').remove();
        		if(value != "on"){
        			$('.checkbox-list').append('<label id="payment_terms_conditions_error" class="error" for="payment_terms_conditions" style="display: inline-block;">You accept our Terms & Conditions.</label>');
        			return false;
        		}
                return true;
            }, "");

            var today = new Date();
            var thisYear = today.getFullYear().toString().substr(2, 2);
            var ccForm = $("#checkout-process");
            ccForm.validate({
                rules: {
                    ccnum: {
                        required: true,
                        digits: true,
                        maxlength: 19,
                        creditcard: true,
                        //ccValidator: true
                    },
                    expmonth: {
                        required: true,
                        digits: true,
                        minlength: 2,
                        maxlength: 2,
                        max: 12,
                        min: 01
                    },
                    expyear: {
                        required: true,
                        digits: true,
                        minlength: 2,
                        maxlength: 2,
                        min: thisYear
                    },
                    cvvno: {
                        required: true,
                        digits: true,
                        minlength: 3,
                        maxlength: 3
                    },
                    ccname: {
                    	required:true,
                    	maxlength: 30
                    },
                    billaddress : {
                    	required: true,
                    	maxlength: 19
                    },
                    city : {
                    	required: true,
                    	maxlength: 19,
                    	cityValidator: true
                    },
                    state : {
                    	required: true,
                    	maxlength: 19
                    },
                    zip : {
                    	required: true,
                    	zipcodeValidator: true
                    },
                    payment_terms_conditions: {
                    	termsValidator: true
                    }
                },
                messages: {
                    ccnum: {
                        required: 'Card number cannot be blank',
                        digits: 'Please enter a valid credit card number'
                    },
                    expmonth: {
                        required: 'Expiry month cannot be blank',
                        digits: 'Please enter a valid expiry month',
                        minlength: 'Please enter a valid expiry month',
                        maxlength: 'Please enter a valid expiry month',
                        max: 'Please enter a valid expiry month',
                        min: 'Please enter a valid expiry month'
                    },
                    expyear: {
                        required: 'Expiry year cannot be blank',
                        digits: 'Please enter a valid expiry month',
                        minlength: 'Please enter a valid expiry month',
                        maxlength: 'Please enter a valid expiry month',
                        min: 'Year cannot be less than current year'
                    },
                    cvvno: {
                        required: 'CVV cannot be blank',
                        digits: 'Please enter a valid CVV',
                        minlength: 'CVV should be 3 digits',
                        maxlength: 'CVV should be 3 digits'
                    },
                    ccname: {
                        required: 'Name cannot be blank'
                    },
                    billaddress: {
                    	required: "Billing Address 1 cannot be blank",
                    	maxlength: "Billing Address 1 shouldn't be more than 19 characters"
                    },
                    billaddress2: {
                    	maxlength: "Billing Address 2 shouldn't be more than 19 characters"
                    },
                    city: {
                    	required: "City cannot be blank",
                    	maxlength: "City shouldn't be more than 19 characters"
                    },
                    state: {
                    	required: "State cannot be blank",
                    	maxlength: "State shouldn't be more than 19 characters"
                    },
                    zip : {
                    	required: "Zip cannot be blank",
                    	maxlength: "Zip should be either 5 or 9 digits"
                    },
                    payment_terms_conditions: "You accept our Terms & Conditions."
                },
                submitHandler: function(form) {
                    form.submit();

                    /*var errors = [];
                    var validated = true;
                    var form = $(this);
                    $.ajax({
                        url: SocialView.base_url + "checkout/process-payment",
                        method: "POST",
                        beforeSend: function(xhr) {
                            Custom.showLoader();
                        },
                        data: ccForm.serialize()
                    }).done(function(data) {

                        if (data.status.code == 200) {
                            if (data.payment.id != undefined) {
                                Custom.showLoader();
                                window.location = data.status.redirectUrl;
                            }

                        } else {
                            Custom.showMessages("error", "Payment failed!", [data.status.message]);
                        }

                    }).fail(function() {

                    }).always(function() {
                        Custom.hideLoader();
                    });
                    return false;*/
                }
            });
            $("#checkout-process").submit(function(e) {
                e.preventDefault();
                console.log("submit process");
                return false;
            })


        },
        checkoutConfirm : function() {
        	$('.checkout-confirm-button').click(function(e){
        		Custom.showLoader();
        	});
        }
    }
}();