var Client = function() {
	return {
		home : function() {

			$('.client-list')
					.dataTable(
							{
								serverSide : true,
								bLengthChange : false,
								bProcessing : true,
								searching: true,
								iDisplayLength : 20,
								
								ajax : {
									url : SocialView.base_url
											+ "client/list-ajax",
									type : 'POST',
									dataType : 'json',
									error : function() {
										Custom
												.showMessages(
														"error",
														"An error occurred",
														[ "Sorry, there is an error processing your request. Please try again later" ]);
									}
								},
								
								aoColumns : [
												{
													"mData" : "ID",
													"orderable": true
												},
												{
													"mData" : "name",
													"name" : "NAME",
													"orderable": false
												},
																							
												{
													"mData" : "clientId,bhaLink,bsrLink",
													
													"mRender" : function(data, type,
															full) {
														
															var html = "";
														    if (data != "") {
														    	var html;
														    	if (full.editAccess) {
														    		html = '<a href="'
														    			+ SocialView.base_url
														    			+ "client/edit/"
														    			+ full.clientId + ""
														    			+ '" class="btn default" style="margin-bottom: 5px;">Edit</a>';
														    	}
														    	if (full.manageUsers)
														    		html += '<a href="'
														    			+ SocialView.base_url
														    			+ "users/" + full.clientId 
														    			+ '" class="btn default"  style="margin-bottom: 5px;">Users</a>';
														    	if (full.manageBHA) 	
														    		html += '<a href="' + full.bhaLink +'" class="btn default"  style="margin-bottom: 5px;">'+full.bhaText+'</a>';
														    	if (full.manageBSR)
														    		html += '<a href="' + full.bsrLink +'" class="btn default"  style="margin-bottom: 5px;" >BSR</a>';
														    	if (full.managePSI)
														    		html += '<a href="' + SocialView.base_url + 'psi/'+ full.clientId +'" class="btn default"  style="margin-bottom: 5px;" >PSI</a>';
														    	}
														return html;
													},
													 "orderable": false
												}
											 ]
								
							});
		},
		add: function(isEdit) {
			var lower = /[a-z]/;
			var upper = /[A-Z]/;
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			$('#sources').css('border', '');
			$('#disableAuthorPosts').on('click', function() {
				if ($(this).is(":checked")) {
	                $("#sources").removeAttr("disabled");
	            } else {
	                $("#sources").attr("disabled", "disabled");
	            }
				
				
			});
			//alert(SocialView.compass_base_url );
			var alphaExp = /^[a-zA-Z]+$/;
			var alphaExpSpace = /^[a-zA-Z ]+$/;
			var numbers = /^[0-9]+$/;
			var emailExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		    
			$('input[type="submit"]').click(function(event) {
				
				
				var client = $('#client').val();
				var chk = $('#disableAuthorPosts:checked').val();
				var sour = $("#sources").val();
				
				//alert(chk);
				Custom.hideMessages();
				$('#client').css('border', '');
	            $('#client_type').css('border', '');
	            $('#name').css('border', '');
	            $('#contact_email').css('border', '');
	            $('#outgoing_email').css('border', '');
	            $('#from_email_alert').css('border', '');
	            $('#collaboration_from_email').css('border', '');
	            $('#contact_account_manager_email').css('border', '');
	            $('#sources').css('border', '');
	            $('#alert_days').css('border', '');
	            $('#contact_email_title').css('border', '');
	            $('#outgoing_email_title').css('border', '');
	            $('#from_email_alert_title').css('border', '');
	            $('#collaboration_from_email_title').css('border', '');
	            $('#logo_filename').css('border', '');
	            
	            
	            var cMail = $('#contact_email').val().trim();
	            var rfMail = $('#outgoing_email').val().trim();
	            var afMail = $('#from_email_alert').val().trim();
	            var cfMail = $('#collaboration_from_email').val().trim();
	            
				if ($('#client').val() == '' || $('#client').val().trim().length == 0) {
					if (!isEdit) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Client is required" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#client').css('border', '1px solid red');
					}
				} else if(!$('#client').val().match(alphaExp)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Client is not valid" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#client').css('border', '1px solid red');
				}else if ($('#client').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Client length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#client').css('border', '1px solid red');
				}else if ($('#name').val() == '' || $('#name').val().trim().length == 0) {
				
					
						Custom
						.showMessages(
								"error",
								"",
								[ "Client name is required" ]);
			            // Prevent form submission
			            event.preventDefault();
					
			            $('#name').css('border', '1px solid red');
				}/*else if(!$('#name').val().match(alphaExpSpace)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Client name is not valid" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#name').css('border', '1px solid red');
				}else if ($('#name').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Client Name length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#name').css('border', '1px solid red');    
				}*/else if ($('#contact_email').val() == '' || $('#contact_email').val().trim().length == 0 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Contact Email is required" ]);
		            // Prevent form submission
		            event.preventDefault();
				
		            $('#contact_email').css('border', '1px solid red');
				}else if ($('#outgoing_email').val() == '' || $('#outgoing_email').val().trim().length == 0 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Reports From Email is required" ]);
		            // Prevent form submission
		            event.preventDefault();
				
		            $('#outgoing_email').css('border', '1px solid red');
				}else if ($('#from_email_alert').val() == '' || $('#from_email_alert').val().trim().length == 0 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Alerts From Email is required" ]);
		            // Prevent form submission
		            event.preventDefault();
				
		            $('#from_email_alert').css('border', '1px solid red');    
				}else if($('#contact_email_title').val().trim().length>0 && 
						!$('#contact_email_title').val().trim().match(alphaExpSpace)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Alphabets only Title Field" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#contact_email_title').css('border', '1px solid red');
				}else if ($('#contact_email_title').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Contact Email Title length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#contact_email_title').css('border', '1px solid red');
		            
		            
		            var cMail = $('#contact_email').val().trim();
		            var rfMail = $('#outgoing_email').val().trim();
		            var afMail = $('#from_email_alert').val().trim();
		            var cfMail = $('#collaboration_from_email').val().trim();
				}else if (!emailExp.test(cMail)) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Invalid Email id" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#contact_email').css('border', '1px solid red');
				}else if($('#outgoing_email_title').val().trim().length>0 && 
						!$('#outgoing_email_title').val().trim().match(alphaExpSpace)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Alphabets only Title Field" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#outgoing_email_title').css('border', '1px solid red');
				} else if ($('#outgoing_email_title').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Reports From Email Title length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#outgoing_email_title').css('border', '1px solid red');
				} else if (!emailExp.test(rfMail)) {
						Custom
						.showMessages(
								"error",
								"",
								[ "Invalid Email id" ]);
			            // Prevent form submission
			            event.preventDefault();
			            $('#outgoing_email').css('border', '1px solid red');    
				} else if($('#from_email_alert_title').val().trim().length>0 && 
						!$('#from_email_alert_title').val().trim().match(alphaExpSpace)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Alphabets only Title Field" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#from_email_alert_title').css('border', '1px solid red');
				}else if ($('#from_email_alert_title').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Alerts From Email Title length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#from_email_alert_title').css('border', '1px solid red');
				} else if (!emailExp.test(afMail)) {
						Custom
						.showMessages(
								"error",
								"",
								[ "Invalid Email id" ]);
			            // Prevent form submission
			            event.preventDefault();
			            $('#from_email_alert').css('border', '1px solid red');    
				}else if($('#collaboration_from_email_title').val().trim().length>0 && 
						!$('#collaboration_from_email_title').val().trim().match(alphaExpSpace)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Alphabets only Title Field" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#collaboration_from_email_title').css('border', '1px solid red');
				}else if ($('#collaboration_from_email_title').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Collaboration From Email Title length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#collaboration_from_email_title').css('border', '1px solid red');
				} else if ($('#collaboration_from_email').val().trim().length>0 && !emailExp.test(cfMail)) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Invalid Email id" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#collaboration_from_email').css('border', '1px solid red');    
				}else if( $('#logo_filename').val() !='' && !(/\.(gif|jpg|jpeg|bmp|png)$/i).test( $('#logo_filename').val() )) {
					    // ... block upload
						Custom
						.showMessages(
								"error",
								"",
								[ "Logo file format is not valid, input formats like png, jpeg, gif or bmp " ]);
			            // Prevent form submission
			            event.preventDefault();			
			            $('#logo_filename').css('border', '1px solid red');
						
						
					}else if (chk !='' && chk =='on' && (sour == '' || sour == null)){
						
							Custom
							.showMessages(
									"error",
									"",
									[ "Please select source" ]);
				            // Prevent form submission
				            event.preventDefault();			
				            $('#sources').css('border', '1px solid red');
							
						
					
					}else if($('#alert_days').val() != '' && isNaN($('#alert_days').val())){
						Custom
						.showMessages(
								"error",
								"",
								[ "Please provide numeric values only" ]);
			            // Prevent form submission
			            event.preventDefault();			
			            $('#alert_days').css('border', '1px solid red');
					}
			});
			
			
			
		},
		edit: function(isEdit) {
			var lower = /[a-z]/;
			var upper = /[A-Z]/;
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			$('#disableAuthorPosts').on('click', function() {
				if ($(this).is(":checked")) {
	                $("#sources").removeAttr("disabled");
	            } else {
	            	
	                $("#sources").attr("disabled", "disabled");
	                              
	                
	            }
				
				
			});
			
			$('#clienttab').on('click', function() {
				$("#clienttabs").val('clienttab');
				$("#setuptabs").val('');
				$("#configtabs").val('');
								
			});
			$('#setuptab').on('click', function() {
				
				$("#setuptabs").val('setuptab');
				$("#configtabs").val('');
				$("#clienttabs").val('');
								
			});
			$('#configtab').on('click', function() {
				$("#configtabs").val('configtab');
				$("#clienttabs").val('');
				$("#setuptabs").val('');
								
			});
			
			
			var alphaExp = /^[a-zA-Z]+$/;
			var alphaExpSpace = /^[a-zA-Z ]+$/;
			var numericExpression = /^[0-9]+$/;
			var emailExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
			$('input[type="submit"]').click(function(event) {
				
				
				var client = $('#client').val();
				var chk = $('#disableAuthorPosts:checked').val();
				var sour = $("#sources").val();
				
				//alert(chk);
				Custom.hideMessages();
				$('#client').css('border', '');
	            $('#client_type').css('border', '');
	            $('#name').css('border', '');
	            $('#contact_email').css('border', '');
	            $('#outgoing_email').css('border', '');
	            $('#from_email_alert').css('border', '');
	            $('#collaboration_from_email').css('border', '');
	            $('#contact_account_manager_email').css('border', '');
	            $('#sources').css('border', '');
	            $('#alert_days').css('border', '');
	            $('#contact_email_title').css('border', '');
	            $('#outgoing_email_title').css('border', '');
	            $('#from_email_alert_title').css('border', '');
	            $('#collaboration_from_email_title').css('border', '');
	            $('#logo_filename').css('border', '');
	            
	            
	            var cMail = $('#contact_email').val().trim();
	            var rfMail = $('#outgoing_email').val().trim();
	            var afMail = $('#from_email_alert').val().trim();
	            var cfMail = $('#collaboration_from_email').val().trim();
	            
	            
				if ($('#client').val() == '' || $('#client').val().trim().length == 0) {
					if (!isEdit) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Client is required" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#client').css('border', '1px solid red');
					}
				} else if(!$('#client').val().match(alphaExp)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Client is not valid" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#client').css('border', '1px solid red');
				}else if ($('#name').val() == '' || $('#name').val().trim().length == 0) {
				
					
						Custom
						.showMessages(
								"error",
								"",
								[ "Client name is required" ]);
			            // Prevent form submission
			            event.preventDefault();
					
			            $('#name').css('border', '1px solid red');
				}/*else if(!$('#name').val().match(alphaExpSpace)){
					Custom
					.showMessages(
							"error",
							"",
							[ "Client name is not valid" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#name').css('border', '1px solid red');
				}else if ($('#name').val().trim().length > 32 ) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Client Name length not exceeds 32 characters" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#name').css('border', '1px solid red');    
				}*/ else if ($('#contact_email').val() == '' || $('#contact_email').val().trim().length == 0 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Contact Email is required" ]);
				            // Prevent form submission
				            event.preventDefault();
						
				            $('#contact_email').css('border', '1px solid red');
						}else if ($('#outgoing_email').val() == '' || $('#outgoing_email').val().trim().length == 0 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Reports From Email is required" ]);
				            // Prevent form submission
				            event.preventDefault();
						
				            $('#outgoing_email').css('border', '1px solid red');
						}else if ($('#from_email_alert').val() == '' || $('#from_email_alert').val().trim().length == 0 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Alerts From Email is required" ]);
				            // Prevent form submission
				            event.preventDefault();
						
				            $('#from_email_alert').css('border', '1px solid red');    
						}else if($('#contact_email_title').val().trim().length>0 &&
								!$('#contact_email_title').val().trim().match(alphaExpSpace)){
							Custom
							.showMessages(
									"error",
									"",
									[ "Alphabets only Title Field" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#contact_email_title').css('border', '1px solid red');
						}else if ($('#contact_email_title').val().trim().length > 32 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Contact Email Title length not exceeds 32 characters" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#contact_email_title').css('border', '1px solid red');
				            
				            
				            var cMail = $('#contact_email').val().trim();
				            var rfMail = $('#outgoing_email').val().trim();
				            var afMail = $('#from_email_alert').val().trim();
				            var cfMail = $('#collaboration_from_email').val().trim();
						}else if (!emailExp.test(cMail)) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Invalid Email id" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#contact_email').css('border', '1px solid red');
						}else if($('#outgoing_email_title').val().trim().length>0 && 
								!$('#outgoing_email_title').val().trim().match(alphaExpSpace)){
							Custom
							.showMessages(
									"error",
									"",
									[ "Alphabets only Title Field" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#outgoing_email_title').css('border', '1px solid red');
						} else if ($('#outgoing_email_title').val().trim().length > 32 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Reports From Email Title length not exceeds 32 characters" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#outgoing_email_title').css('border', '1px solid red');
						} else if (!emailExp.test(rfMail)) {
								Custom
								.showMessages(
										"error",
										"",
										[ "Invalid Email id" ]);
					            // Prevent form submission
					            event.preventDefault();
					            $('#outgoing_email').css('border', '1px solid red');    
						} else if($('#from_email_alert_title').val().trim().length>0 && 
								!$('#from_email_alert_title').val().trim().match(alphaExpSpace)){
							Custom
							.showMessages(
									"error",
									"",
									[ "Alphabets only Title Field" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#from_email_alert_title').css('border', '1px solid red');
						}else if ($('#from_email_alert_title').val().trim().length > 32 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Alerts From Email Title length not exceeds 32 characters" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#from_email_alert_title').css('border', '1px solid red');
						} else if (!emailExp.test(afMail)) {
								Custom
								.showMessages(
										"error",
										"",
										[ "Invalid Email id" ]);
					            // Prevent form submission
					            event.preventDefault();
					            $('#from_email_alert').css('border', '1px solid red');    
						}else if($('#collaboration_from_email_title').val().trim().length>0 && 
								!$('#collaboration_from_email_title').val().trim().match(alphaExpSpace)){
							Custom
							.showMessages(
									"error",
									"",
									[ "Alphabets only Title Field" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#collaboration_from_email_title').css('border', '1px solid red');
						}else if ($('#collaboration_from_email_title').val().trim().length > 32 ) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Collaboration From Email Title length not exceeds 32 characters" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#collaboration_from_email_title').css('border', '1px solid red');
						} else if ($('#collaboration_from_email').val().trim().length>0 && 
								!emailExp.test(cfMail)) {
							Custom
							.showMessages(
									"error",
									"",
									[ "Invalid Email id" ]);
				            // Prevent form submission
				            event.preventDefault();
				            $('#collaboration_from_email').css('border', '1px solid red');    
				} else if($('#logo_filename').val() !='' && !(/\.(gif|jpg|jpeg|bmp|png)$/i).test( $('#logo_filename').val() )) {
					    // ... block upload
						Custom
						.showMessages(
								"error",
								"",
								[ "Logo file format is not valid, input formats like png, jpeg, gif or bmp " ]);
			            // Prevent form submission
			            event.preventDefault();			
			            $('#logo_filename').css('border', '1px solid red');
					
					}else if (chk !='' && chk =='on' && (sour == '' || sour == null)){
						
							Custom
							.showMessages(
									"error",
									"",
									[ "Please select source" ]);
				            // Prevent form submission
				            event.preventDefault();			
				            $('#sources').css('border', '1px solid red');
							
						
					}else if($('#alert_days').val() != '' && isNaN($('#alert_days').val())){
						Custom
						.showMessages(
								"error",
								"",
								[ "Please provide numeric values only" ]);
			            // Prevent form submission
			            event.preventDefault();			
			            $('#alert_days').css('border', '1px solid red');
					}
			});
			
			
		}
	}
}();
