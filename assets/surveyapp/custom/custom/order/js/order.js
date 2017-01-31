var Order = function() {
    return {
        view: function() {
        	var columns = [{
                
            }, {
            	sDefaultContent: "n/a"
            }, {
            	sDefaultContent: "n/a"
            }, {
            	sDefaultContent: "n/a"
            }, {
            	sDefaultContent: "n/a"
            }];
        	var table = $('.order').DataTable({
        		dom: '<"standard-title"<"caption">>T<"clear">lrtp',
        		serverSide: false,
                bLengthChange: false,
                bProcessing: true,
                ordering: false,
                iDisplayLength: 100,
                caption: 'Hello',
                columns: columns
        	});
        	$(".current-order-portlet .caption").html('Current Physicians');
        	
        	$(".select-all").on("click", function(e) {
        		if ($('.select-all').is(':checked')) {
	            	$('.order tbody input[type="checkbox"]:not(:checked)').trigger('click');
	            } else {
	            	$('.order tbody input[type="checkbox"]').trigger('click');
	            }
	        });
        	
        	$(".entry").on("click", function(e) {
        		var me = $(this);
        		var index = me.attr('index');
        		if (me.is(':checked')) {
        			$('.order tbody input:checkbox:not(.index-'+index+')').attr('disabled', 'disabled');
        		}else{
        			if ($(".order tbody input:checkbox:checked").length == 0){
        				$('.order tbody input:checkbox:not(.index-'+index+')').removeAttr('disabled');
        			}
        		}
	        });
        	
        	$('.edit-physician').live("click", function(e) {
                e.preventDefault();
                row = $(this).closest('tr');
                firstname = row.find('.firstname').val();
                lastname = row.find('.lastname').val();
                email = row.find('.email').val();
                cartid = row.find('.cart-id').val();
                npi = row.find('td.npi').text();
                var html="<div class='popup-validation col-md-12'></div>" +
                		"<div class='row edit-physician-portlet'>" +
			                "<div class='col-md-12 line form-group'><div class='col-md-4'><label>First Name</label><span class='required' aria-required='true'>*</span></div><div class='col-md-8'><input type='text' name='new-firstname' class='new-firstname' value='"+firstname+"'></div></div>" +
			        		"<div class='col-md-12 line form-group'><div class='col-md-4'><label>Last Name</label><span class='required' aria-required='true'>*</span></div><div class='col-md-8'><input type='text' name='new-lastname' class='new-lastname' value='"+lastname+"'></div></div>" +
			        		"<div class='col-md-12'>" +
				        		"<div class='col-md-8'>" +
				        			"<div class='row'>" +
				        				"<div class='col-md-6 line'>NPI</div><div class='col-md-6 line'>"+npi+"</div>" +
				        				"<div class='col-md-6 line'>Email</div><div class='col-md-6 line'>"+email+"</div>" +
			        				"</div>" +
			    				"</div>" +
				        		"<div class='col-md-4 line'><i>NPI and Email cannot be changed as they are used for login and identification purposes</i></div>" +
			        		"</div>" +
			        	"</div>" +
			        	"<div class='row'>" +
			        		"<div class='col-md-12 line'>" +
			        			"<input type='button' class='btn btn-primary update-physician-information' value='Save Changes'>" +
			        		"<div>" +
			        	"</div>";
                var box = bootbox.dialog({
    				message : html,
    				title : "Edit Physician Information",
    				backdrop: 'static',
    			    keyboard: false,
    			    onEscape: function() {
    			    	box.modal('hide');
    			    }
    			});
                $('.update-physician-information').click(function(e){
                	var newFirstname = $('.new-firstname').val();
                	var newLastname = $('.new-lastname').val();
                	var errorMessages = new Array();
                	if(newFirstname == ""){
                		errorMessages.push("Please enter First Name");
                	}
                	if(newLastname == ""){
                		errorMessages.push("Please enter Last Name");
                	}
                	if(errorMessages.length > 0){
                        Custom.showMessages("error", "Validation Error", errorMessages,'.popup-validation');
                		return false;
                	}
                	var url = SocialView.base_url + "my-accounts/edit-physician";
    				$.ajax({
                        url: url,
                        type: "POST",
                        data: {
                        	firstName: newFirstname,
                        	lastName: newLastname,
                        	cartId: cartid
                        },
                        beforeSend: function() {
                            Custom.showLoader('.modal-body');
                        },
                        complete: function() {
                            Custom.hideLoader('.modal-body');
                        },
                    }).done(function(json) {
                        if (json['status']) {
                            if (json['status']['code'] == 200) {
                            	Custom.showMessages("success", "Update Successful", ["Physician information has been successfully updated."],'.page-bar',100);
                            	box.modal('hide');
                            	row.find('.firstname').val(newFirstname);
                            	row.find('.lastName').val(newLastname);
                            	row.find('td.fullname').text(newFirstname+' '+newLastname);
                            } else {
                                if (json['status']['message']) {
                                    alert(json['status']['message']);
                                    return false;
                                }
                            }
                        }
                    }).fail(function() {}).always(function() {});
                });
        	});
            
        	$(".unsubscribe-physicians").live("click", function(e) {
                e.preventDefault();
                if ($(".order input:checkbox:checked").length == 0) {
                    bootbox.alert("Please select physicians!");
                    return false;
                }
                var index = 0;
                $.each($(".order tbody input:checkbox:checked"), function() {
                	index = $(this).attr('index');
                });
                var days = 0;
                var noOfDays = $('.parent-'+index+' .date' ).attr('data');
                var orderId = $('.parent-'+index+' .order-id' ).val();
                if(typeof noOfDays != "undefined"){
                	days = noOfDays;
                }
                if(days < 30){
                	var message = $('.unsubscribe-with-refund').html();
                	message = message.replace("[order-num]", orderId);
                }else{
                	var message = $('.unsubscribe-without-refund').html();
                	message = message.replace("[order-num]", orderId);
                }
                Custom.showConfirm(message,"Confirm","OK","Cancel"
            			,function(result){
            		if(result){
            			if(result){
                    	}
            		}
                });
            });
        	
        }
    };
}();
