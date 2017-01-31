var Users = function() {
	return {
		home : function(clientId) {

			$('.users-list')
					.dataTable(
							{
								serverSide : true,
								bLengthChange : false,
								bProcessing : true,
								iDisplayLength : 100,
								ajax : {
									url : SocialView.base_url
											+ "users/" + clientId+ "/list-ajax",
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
											"mData" : "email"
										},
										{
											"mData" : "name",
											"name" : "Name"
										},
										{
											"mData" : "roleId"
										},
										{
											"mData" : "memberFor",
											 "orderable": false
										},
										{
											"mData" : "email_encoded",
											"mRender" : function(data, type,
													full) {

												var html = "";
												if (data != "") {
													var html = '<a href="'
															+ SocialView.base_url
															+ "users/" + clientId + "/view/"
															+ data + "/rule"
															+ '" class="btn default" style="margin-bottom: 5px;">Alerts</a>';
													
													html += '<a href="'
															+ SocialView.base_url
															+ "users/" + clientId + "/view/"
															+ data + "/report"
															+ '" class="btn default"  style="margin-bottom: 5px;">Reports</a>';
												}
												return html;
											},
											 "orderable": false
										}
									/*	{
											"mData" : "createdTime",
						                    "mRender": function(data, type, full) {
						                        if (data != null) {
						                            var d = new Date(data);
						                            return d.toLocaleString();
						                        }
						                        return "";
						                    }
										},
										{
											"mData" : "lastAccess",
						                    "mRender": function(data, type, full) {
						                        if (data != null) {
						                            var d = new Date(data);
						                            return d.toLocaleString();
						                        }
						                        return "";
						                    }
										},
										{
											"mData" : "email_encoded",
											"mRender" : function(data, type,
													full) {

												var html = "";
												if (data != "") {
													var html = '<a href="'
															+ SocialView.base_url
															+ "users/edit/"
															+ data
															+ '" class="btn default btn-xs blue"> <i class="fa fa-edit"></i> Edit</a>';
												}
												return html;
											},
											 "orderable": false
										},
										{
											"mData" : "email_encoded",
											"mRender" : function(data, type,
													full) {

												var html = "";
												if (data != "") {
													var html = '<a href="'
															+ SocialView.base_url
															+ "users/delete/"
															+ data
															+ '" class="btn default btn-xs blue"> <i class="fa fa-delete"></i> Edit</a>';
												}
												return html;
											},
											 "orderable": false
										}*/ ]
							});
		},
		view: function(clientId, encoded_email) {
			$('.userDetailTab').click(function() {
				Custom.hideMessages();
			});
			
			$('.user-role').click(function(e){
				e.preventDefault();
				var permissionContainer = $(".tree-menu").html();
				
				var dialog = bootbox.dialog({
    				message : permissionContainer,
    				title : "User Permissions",
    				id : "permission",
    				backdrop: 'static',
    			    keyboard: false,
    			    onEscape: function() {
    			    }
    			});
            	dialog.on("shown.bs.modal", function() {
            		$('.modal-body').find("#tree").attr("id","box-tree");
            		UITree.simple("#box-tree");
            	});
			});
			
			$(document).on('click', '.modal-backdrop', function (event) {
			    bootbox.hideAll()
			});
			
			$('#ruleTable').dataTable(
					{
						serverSide : false,
						bLengthChange : false,
						bProcessing : true,
						searching: false,
						iDisplayLength : 25,
						ajax : {
							url : SocialView.base_url
									+ "users/" + clientId+ "/ruleList/" + encoded_email,
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
						order: [[1, 'asc']],
						aoColumns : [
								{
									"mData" : "id",
									"mRender" : function(data, type, full) {
										var html = '<span><input style="margin-left:7px" type="checkbox" name="optionsRadios2"' +
										'id="check-box-each"' +
										'class="check-box-each check-box-alert-each delete-checkbox-' + data + '"' +
										'value="' + data + '" /></span>';
										
										return html;
									},
									"orderable": false
								},
								{
									"mData" : "alertType"
								},
								{
									"mData" : "ruleDescription"
								},
								{
									"mData" : "taskFlag"
								},
								{
									"mData" : "enableDelete",
									"mRender" : function(data, type, full) {
										var html = '';
										if (data.access) {
											html = '<a class=" checkbox1 btn default btn-sm delete-alert-user single"' +
											           'data-id="' + data.id + '"	client-id="' + clientId + '" href="javascript:;" >' +
											'<i class="fa fa-trash"></i> Delete</a>';
										}
										return html;
									},
									 "orderable": false
								}
								
								]
					});
			
			$('#reportTable').on( 'draw.dt', function () {
				$(".verification_method").bootstrapSwitch();
				$(".verification_method").on('switchChange.bootstrapSwitch', function (event, state) {
					event.stopImmediatePropagation();
					msg = "Are you sure want to switch this report to";
					if($(this).attr("editmode")){
						return;
					}
					sw = $(this);
					var ids = [sw.attr("data-attr")];
					if($(this).attr("checked")){
						
						bootbox.confirm( msg + " manual verification?", function(res){
							if(!res){
								sw.attr("editmode",true);
								sw.bootstrapSwitch('state', false);
								sw.removeAttr("editmode");
							} else{
								 	var ids = [sw.attr("data-attr")];
								 	ids.push(6056);
								 	
								 	verificationMethod(ids,"manual");
							} 
							});
				
					} else{
						bootbox.confirm( msg + " automatic verification?",function(res){ 
							if(!res){
								sw.attr("editmode",true);
								sw.bootstrapSwitch('state', true);
								sw.removeAttr("editmode");
								} else{
									 	verificationMethod(ids,"auto");
								} 
							
						});
					}
				});
				
				$(".paginate_button").filter(':not(.disabled)').on("click", "a", function() {
					if ($(".select-all-check").prop( "checked")) {
						$(".select-all-check").click();
					}
					if ($(".select-all-check1").prop( "checked")) {
						$(".select-all-check1").click();
					}
				});
			} );
			
			$('#reportTable')
			.dataTable(
					{
						serverSide : false,
						bLengthChange : false,
						bProcessing : true,
						searching: false,
						iDisplayLength : 25,
						ajax : {
							url : SocialView.base_url
									+ "users/" + clientId+ "/reportList/" + encoded_email,
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
						order: [[1, 'asc']],
						aoColumns : [
								{
									"mData" : "id",
									"mRender" : function(data, type, full) {
										var html = '<span><input style="margin-left:7px" type="checkbox" name="optionsRadios2"' +
										'id="check-box-each"' +
										'class="check-box-each1 check-box-alert-each delete-checkbox-' + data + '"' +
										'value="' + data + '" /></span>';
										
										return html;
									},
									 "orderable": false
								},
								{
									"mData" : "title"
								},
								{
									"mData" : "description"
								},
								{
									"mData" : "verificationMode",
									 "orderable": false
								},
								{
									"mData" : "enableDelete",
									"mRender" : function(data, type, full) {
										var html = '';
										if (data.access) {
											html = '<a class=" checkbox1 btn default btn-sm delete-scheduled-report-user single scheduled-report-"' +
										           'data-id="' + data.id + '"	client-id="' + clientId + '" href="javascript:;" data-id="' +  data.id + '" >' +
										'<i class="fa fa-trash"></i> Delete</a>';
										}
										return html;
									},
									 "orderable": false
								}
								
						 ]
					});
			
			$('#usageTable')
			.dataTable(
					{
						serverSide : false,
						bLengthChange : false,
						bProcessing : true,
						searching: false,
						iDisplayLength : 100,
						order: [
			                    [0, 'desc']
			                ],
						ajax : {
							url : SocialView.base_url
									+ "users/" + clientId+ "/usageHistory/" + encoded_email,
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
									"mData" : "loginTime",
									"type" : "num",
									"orderable": true,
									"mRender": function(data, type, full) {
				                        if (data != null) {
				                            var d = new Date(data);
				                            if (type == 'sort') {
				                                return d.getTime();
				                            } else {
			                            		return d.toLocaleString();
				                            }
				                        }
				                    }
								},
								{
									"mData" : "logoutTime",
									"orderable": true,
									"type" : "num",
									"mRender": function(data, type, full) {
				                        if (data != null) {
				                            var d = new Date(data);
				                            if (type == 'sort') {
				                                return d.getTime();
				                            } else {
			                            		return d.toLocaleString();
				                            }
				                        }
				                    }
								},
								{
									"mData" : "duration",
									"orderable": false
								}
								
						 ]
					});
		},
		verify: function() {
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			$('input[type="submit"]').click(function(event) {
				if ($('#mail').val()=='')return;
				if (!re.test($('#mail').val()))return;
				Custom.showLoader();
			});
		},
		add: function(isEdit, client_id, email) {
			var lower = /[a-z]/;
			var upper = /[A-Z]/;
			
			$('#userAlert').click(function() {
				window.location = SocialView.base_url + "users/" + client_id + "/view/" + email + "/rule";
			});
			
			$('#userReport').click(function() {
				window.location = SocialView.base_url + "users/" + client_id + "/view/" + email + "/report";
			});
			
			$('#userHistory').click(function() {
				window.location = SocialView.base_url + "users/" + client_id + "/view/" + email + "/history";
			});
			$("#sources").select2({
		            closeOnSelect: true
		    });
			
			$("#products").select2({
	            closeOnSelect: true
			});
			if (isEdit) {
				$('.password').removeAttr('required');
			}
			
			$("#phone").mask("(999) 999-9999");
			
			$('input[type="submit"]').click(function(event) {
				Custom.hideMessages();
				$('#name').css('border', '');
	            $('#passcode').css('border', '');
	            $('#cpass').css('border', '');
	            $('#phone').css('border', '');
	            $('#countryCode').css('border', '');
	            $("#phone").val($("#phone").mask()); 

				if ($('#name').val() == '' || $('#name').val().trim().length == 0) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Full name is required" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#name').css('border', '1px solid red');
				}  else if (!isEdit && $('#passcode').val() == '') {
						Custom
						.showMessages(
								"error",
								"",
								[ "Password is required" ]);
			            // Prevent form submission
			            event.preventDefault();
					
			            $('#passcode').css('border', '1px solid red');
		            	$('#cpass').css('border', '1px solid red');
				} else if(!isEdit && $('#passcode').val() != $('#cpass').val()) {
						Custom
						.showMessages(
								"error",
								"",
								[ "Password do not match" ]);
			            // Prevent form submission
			            event.preventDefault();
			            $('#passcode').css('border', '1px solid red');
			            $('#cpass').css('border', '1px solid red');
				} else if ( $('#countryCode').val() != '-1' && $('#phone').val().trim().length == 0 ) {
						Custom
						.showMessages(
							"error",
							"",
							[ "Please input phone number" ]);
				           // Prevent form submission
				           event.preventDefault();
				           $('#phone').css('border', '1px solid red');
				}else if ( $('#phone').val().trim().length != 0 && $('#countryCode').val() == '-1') {
					Custom
					.showMessages(
						"error",
						"",
						[ "Please select Country code" ]);
			           // Prevent form submission
			           event.preventDefault();
			           $('#countryCode').css('border', '1px solid red');
				}
			});
		},
		updateSurveyQuestion : function(surveyId, questions, options, indexVal) {
			
			  var url = SocialView.base_url + "users/" + SocialView.client_id + "/ajax-survey-questions";
			  $.ajax({
				  url : url,
				  type : "POST",
				  data : {
					  survey_id : surveyId
				  },
				  beforeSend: function(){
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
			  }).done(function(json){
				  if(typeof json == 'object') {
					 
					 var questionSelectBox = $("select#question"+indexVal);
					 questionSelectBox.empty();
					 questionSelectBox.append($("<option></option>")
						     .attr("value", "").text("Select a question"));
					 $.each(json, function(index, value){
						 questions[value.id]= value.title;
						 options[value.id]= value.options;
						 questionSelectBox.append($("<option></option>")
							     .attr("value", value.id).text(value.title));
					 });
					 questionSelectBox.select2();
					 questionSelectBox.parents(".after-survey").removeClass("hidden");
				  } else{
					  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				  }
			  });
		},
		updateQuestionOption: function(questionId, options, indexVal){
			
			var optionSelectBox = $("select#option"+indexVal);
			optionSelectBox.empty();
			optionSelectBox.append($("<option></option>")
				     .attr("value", "").text("Select an option"));
			 $.each(options[questionId], function(index, value){
				 optionSelectBox.append($("<option></option>")
					     .attr("value", value.id).text(value.name));
			 });
			 optionSelectBox.select2();
			 optionSelectBox.parents(".after-question").removeClass("hidden");
		},
		addRule : function () {
			$("select.select2").select2();
			index=0;
			//$("#survey").on("change", function(e){
			$('select[id^="survey"]').on("change", function(e){
				//var me = $(this);
				index = parseInt($(this).attr('id').slice('-1'));
				//alert("index inside select"+index);
				//var me = $(this);
				
				//var type = me.val();
				
				//var redirectURL = SocialView.base_url + 'rule/' + SocialView.client + '/add/' + type;
				var redirectURL = SocialView.base_url + 'users/' + SocialView.client_id + '/mapdata/';
				Custom.showLoader();
				/*email = getParameterByName("uid");
				
				if (email !== '') {
					redirectURL += "?uid=" + email;
				}
				window.location = redirectURL;*/
				//alert("in on change"+index);
				var me = $(this);
				var currentValue = me.val();
				questions = {};
				options = {};
				if(currentValue != "") {
					Users.updateSurveyQuestion(currentValue, questions, options, index);
				} else {
					$questionObj.empty().select2();
					$questionObj.parents(".after-survey").addClass("hidden");
					$optionObj.empty().select2();
					$optionObj.parents(".after-question").addClass("hidden");
				}
			});
			$('select[id^="question"]').on("change", function(e){
				var me = $(this);
				var currentValue = me.val();
				index = parseInt($(this).attr('id').slice('-1'));
				if(currentValue != "") {
					Custom.showLoader();
					Users.updateQuestionOption(currentValue, options, index);
					Custom.hideLoader();
				} else {
					$optionObj.empty().select2();
					$optionObj.parents(".after-question").addClass("hidden");
				}
			});
					
			$("#add-rule-form").on("submit", function(e){
				var validated = Collaboration.validateRuleDefinition();
				if (validated) {
					Custom.hideMessages();
					Custom.showLoader();
					return true;
				}
				return false;
			});
			$("#upload-file-form").on("submit", function(e) {
				Custom.showLoader();
	            return true;
	        });
		}
	};
}();
