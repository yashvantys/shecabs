var Report = function () { 
	return{
		init:function(client_id,report_id,encoded_filter){
		},
		
		// Validate Report configuraiton filter
		loadFilter:function(){
			if ($('select.filter-physician-list').hasClass('detailed-psi-report')){
				findPhysicianLists();
			}
			
			// onload checking for ctl subtask report status
			if ($('select.filter-status-type-ctl').hasClass('subtask-ctl-report')) {
				var selected_task_type = $("select.filter-status-type-ctl").val();
				if (selected_task_type == 'open') {
					$("select.category_multiple").select2("close").parent().hide();
				} else {
					$("select.category_multiple").select2("close").parent().show();
				}
			}
			//validate pre filled serviceline and load removed servicelines
			if ($('select#service_line').hasClass('filter-location-list')){
				if($("#service_line").val()){
					onServicelineChange();
				}
			}
			
			//validate pre filled speciality and load removed specialities
			if ($('select#specialty').hasClass('filter-location-list')){
				if($("#specialty").val()){
					findLocationEntitiesonLoad();
				}
			}
			// Datepicker
            $(".report-filter-date").datepicker({
                orientation: "left",  
                autoclose: true
            }).on("changeDate", setCustomDateRange);
			
			function setCustomDateRange() {
				$("select.filter-date-range").select2("val", "custom");
			}
			
			// Date range change in filter
			if ($("select.filter-date-range").length) {
				$("select.filter-date-range").on("change", function(){
					if($("select.filter-date-range").val() != "custom"){
						Custom.showLoader();
						$.ajax({
							url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/get_filter_dates/' + $("select.filter-date-range").val(),
						}).fail(function() {
							var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
							Custom.showMessages('error', 'Error!', errors);
						}).done(function(data) {
							if (data.status == 200) {
								$(".filter-start-date").datepicker("update", data.start_date);
								$(".filter-end-date").datepicker("update", data.end_date);;
							}
						}).complete(function() {
							Custom.hideLoader();
						});
					}
				});
			}
			
			
			
			
			// Datepicker range setting
			$('.filter-start-date').on('change', function(selected){
		        /*startDate = new Date(selected.date.valueOf());
		        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
		        $('.filter-end-date').datepicker('setStartDate', startDate);*/
		    }); 
			// specialty based location listing
			$("select.filter-location-list").on("change", function(e) {
				findLocationEntities();
			});
			$("select.hospital-division-monthly-report").on("change", function(e) {
				Custom.hideMessages();
			});
			// hide error message
			$("select.filter-avatar-id").on("change", function(e) {
				Custom.hideMessages();
			});
			
			$("input.check-sentiments").on("click", function(e) {
				Custom.hideMessages();
			});
			
			// ctl subtask report category toggle wrt to action
				var selected_task_type =$("select.filter-status-type-ctl").val();
				$("select.filter-status-type-ctl").on("click",function(e){
					var selected_task_type =$("select.filter-status-type-ctl").val();
					if (selected_task_type == 'open'){
						$("select.category_multiple").select2("close").parent().hide();
					}else{
						$("select.category_multiple").select2("close").parent().show();
					}
				});

			// Physician/Survey dropdown filling
			if ($("select.filter-avatar-id, input.filter-avatar-id").length && $("select.filter-person-entity").length) {
				
				if ($("select.filter-avatar-id, input.filter-avatar-id").val() != null && $("select.filter-avatar-id, input.filter-avatar-id").val() != "") {
					findPhysicianEntities();
				}
				
				$("select.filter-avatar-id").on("change", function(e) {
					Custom.hideMessages();
					findPhysicianEntities();
				});
				
				$("select.filter-person-entity").on("change", function(e) {
					Custom.hideMessages();
				});
			}else if ($("select.filter-avatar-id, input.filter-avatar-id").length && $("select.filter-survey-single").length && (! $("select.filter-survey-single").hasClass('pgts-report'))) {
				surveySingleUpdate();
				$("select.filter-avatar-id").on("change", function(e) {
					surveySingleUpdate();
				});
				
				surveyQuestionUpdate();
				$("select.filter-survey-single").on("change", function(e) {
					surveyQuestionUpdate();
				});
			}
			
			// Category Type listing
			if ($("#category_multiple").length >0) {
				$('#category_multiple').multiselect({
//					includeSelectAllOption: true,
//					onChange: function(option, checked, select) {
//					
//		            }
					
					buttonText: function(options, select) {
						var categorySelectText = " Check the categories";
						var selectedCategoriesItem = 0;
						var selectedCategoriesItemLength = 0;
						if($('#category_multiple_list').val() != ""){
							selectedCategoriesItem = $('#category_multiple_list').val().split(',');
							selectedCategoriesItemLength = selectedCategoriesItem.length;
		                }else{
		                	selectedCategoriesItem = $("#category_multiple_list_count").val();
		                	selectedCategoriesItemLength = selectedCategoriesItem;

		                }
						if(selectedCategoriesItemLength > 0){
							categorySelectText = selectedCategoriesItemLength+" categories selected";
							
						}else{
							categorySelectText = "Check the categories"
						}
		                return categorySelectText;
		            },
		            buttonTitle: function(options, select) {
		                var labels = [];
		                options.each(function () {
		                    labels.push($(this).text());
		                    
		                });
		               
		                return labels.join(' - ');
		            }
				});
				var childrens ='';
				
				$('ul.multiselect-container li input').each(function(i){
					
					var liId = parseInt($(this).attr('value'));
					var parentId="";
					
					if(liId){
						parentId = SocialViewCategoryParents["id_"+liId].parentId;
					}
					var parentArray = SocialViewCategoryParents["id_"+liId].parents;
					if(parentId == 0){
						childrens = $(this).attr('value');
						$(this).addClass('category');
						$(this).parent().css('font-weight','bold');
					}
					if(parseInt(parentId) == parseInt(childrens)){
						$(this).parent().css('font-weight','bold');
					}
//					$(this).addClass('category-item_'+parentId);
					
					$(this).addClass('category-parent_'+liId);
					$(this).addClass('category-all');
					$(this).attr('parentId',parentId);
					$(this).attr('selected',true);
					for (var i = 0; i < parentArray.length; i++) {
						if(parentArray[i] == 0){
							
						}else{
							$(this).addClass('category-reverse_'+parentArray[i]);
							if(parentId == liId ){
								$(this).parent().css('font-weight','bold');
							}
							
						}
						 
					    //Do something
					}
					var selectedCategories = [];
            		$('ul.multiselect-container li input[type=checkbox]:checked').each(function(){
            			selectedCategories.push($(this).val());
            			
            		});
            		selectedCategories.toString();
            		$("#category_multiple_list").val(selectedCategories);
            		$(".multiselect").closest(".btn-group").addClass("custom-ul-class");
            		$(".custom-ul-class").css("width","100%");
//            		$(".multiselect").css("width","100%","important;");
            		$(".multiselect").css("cssText", "width: 100% !important;");
//            		category-parent_4501 category-all category-reverse_4500
				});
				
				$(".category").on("click",function(){
					if($('.category-review-report').length == 0 && $('body .employee-category-report').length ==0 && $('.insights-listing-excel-report').length == 0 && $('.subtask-ctl-report').length == 0){
						if($(this).is(':checked')){
	              			$(".category-all").prop('checked', true);
	              			//$('option').prop("selected","selected")
	        			}else{
	            			$(".category-all").prop('checked', false);
	//            			$('option').prop("selected","")
	            			$("#category_multiple_list_count").val("");
	        			}
					}
        		});
				var nestedId = '';
				$(".category-all").on("click",function(){
					var parentId = $(this).attr('parentid');

            		var categoryId = $(this).attr('value');
            		
					if($('.category-review-report').length == 0 && $('body .employee-category-report').length ==0 && $('.insights-listing-excel-report').length == 0 && $('.subtask-ctl-report').length == 0){
						if($(this).is(':checked')){
							$(".category-parent_"+parentId).prop('checked', true);
							$(".category-reverse_"+categoryId).prop('checked', true);
						}
						else{
							$(".category-reverse_"+categoryId).prop('checked', false);
						}
					}
					
					if($('body .category-review-report').length >0 && parentId == 0){
						if($(this).is(':checked')== false){
							$(".category-reverse_"+categoryId).prop('checked', false);
						}
					}
            		var selectedCategories = [];
            		$('ul.multiselect-container li input[type=checkbox]:checked').each(function(){
            			selectedCategories.push($(this).val());
            			
            		});
            		selectedCategories.toString();
            		$("#category_multiple_list").val(selectedCategories);
            		
            		var categorySelectText = " Check the categories";
					var selectedCategoriesItem = 0;
					var selectedCategoriesItemLength = 0;
					if($('#category_multiple_list').val() !=""){
						selectedCategoriesItem = $('#category_multiple_list').val().split(',');
						selectedCategoriesItemLength = selectedCategoriesItem.length;
						$("#category_multiple_list_count").val(selectedCategoriesItemLength)
	                }else{
	                	$("#category_multiple_list_count").val(0)
	                	selectedCategoriesItem = $("#category_multiple_list_count").val();
	                	//selectedCategoriesItemLength = selectedCategoriesItem;
	                	selectedCategoriesItemLength = 0;

	                }
					
					
					if(selectedCategoriesItemLength > 0){
						categorySelectText = selectedCategoriesItemLength+" categories selected";
						
					}else{
						categorySelectText = "Check the categories"
					}
					
					$(".multiselect").text(categorySelectText)
            		
        		});
				
				
			}
			$(".check-all").on("click",function(){
				if($(this).prop("checked")) {
					$(".check-sentiments").parent('span').addClass("checked");
					$(".check-sentiments").prop('checked', true);
	            } else {
	            	$(".check-sentiments").parent('span').removeClass("checked");
	            	$(".check-sentiments").prop('checked', false);
	            }  
				 
			});
			$(".check-sentiments").on("click",function(){
				if($(this).prop("checked")) {
					if ($('.check-sentiments-each').parent('.checked').length == $('.check-sentiments-each').length) {
						$(".check-all").parent('span').addClass("checked");
						$(".check-all").prop('checked', true);
					}
				} else {
					$(".check-all").parent('span').removeClass("checked");
					$(".check-all").prop('checked', false);
				}  
				 
			});
			$(".insights_count").keypress(function (e) {
				var keyVal = false;
				var messages = [];
			     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			        //display error message
			        messages.push('Digits Only.');
					Custom.showMessages('error', 'Something went wrong!', messages);
			        return false;
			    }
			   });
			
			function findPhysicianEntities() {
				
				var me = $("select.filter-avatar-id, input.filter-avatar-id");
				var physicianEntity = $("select.filter-person-entity");
				var selectedLocationId = me.val();
				var physicianEntityId = physicianEntity.val();
				
				if (me.length && physicianEntity.length) {
					$.ajax({
						url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/get_filtered_entities',
						beforeSend: function(xhr) {
							Custom.showLoader();
						},
						type: "POST",
						data: {
							filter_avatar_id: selectedLocationId
						},
						timeout: 100000,
						error: function(error) {
							var messages = [];
							messages.push('Please try after sometime.');
							Custom.showMessages('error', 'Something went wrong!', messages);
							Custom.hideLoader();
						}
					}).done(function(data) {
						physicianEntity.find('option').remove().end();
						if (data.length > 0) {
							$(data).each(function() {
								if ($.inArray(this.val.toString(), physicianEntityId) >= 0) {
									physicianEntity.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
								}else if (physicianEntityId != null && physicianEntityId == this.val) {
									physicianEntity.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
								}else{
									physicianEntity.append($("<option>").attr('value', this.val).text(this.text));
								}
							});
						}
						physicianEntity.select2({allowClear : true});
						
						if (me.hasClass("monthly-survey-report") || me.hasClass("response-trends-by-question")
							|| me.hasClass("surveydetailed-psi-report-response-count-report")) {
							surveySingleUpdate();
							Custom.hideLoader();
						} else {
							Custom.hideLoader();
						}
					});
				}
			}

			function findPhysicianLists() {
				
				var data_client_id = $("select.filter-physician-list").attr("data-client-id");
				var physicianEntity = $("select.filter-physician-list");
				var physicianEntityId = physicianEntity.val();
				
				$.ajax({
					url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/get_filtered_physicians/1589',
					beforeSend: function(xhr) {
						Custom.showLoader();
					},
					type: "GET",
					timeout: 100000,
					error: function(error) {
						var messages = [];
						messages.push('Please try after sometime.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					}
				}).done(function(data) {
					physicianEntity.find('option').remove().end();
					if (data.length > 0) {
						$(data).each(function() {
							if (physicianEntityId != null && physicianEntityId == this.val) {
								physicianEntity.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
							}else{
								physicianEntity.append($("<option>").attr('value', this.val).text(this.text));
							}
						});
					}
					physicianEntity.select2({allowClear : true});
					Custom.hideLoader();
				});
			}
			
		
		
			
			function surveySingleUpdate() {
				var location = $("select.filter-avatar-id");
				var surveySingle = $("select.filter-survey-single");
				var surveySingleVal = surveySingle.val();
				var selectedLocationId = location.val();
				if(selectedLocationId=='')return;
				Custom.showLoader();
				
				$.ajax({
					url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/get_filtered_surveys/' + selectedLocationId,
					beforeSend: function(xhr) {
						Custom.showLoader();
					},
					type: "GET",
					timeout: 30000,
					error: function(error) {
						var messages = [];
						messages.push('Please try after sometime.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					}
				}).done(function(data) {
					surveySingle.find('option').remove().end();
					surveySingle.append($("<option>").attr('value', '').text(''));
					if (data.length > 0) {
						$(data).each(function() {
							if (surveySingleVal != null && surveySingleVal == this.val) {
								surveySingle.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
							} else {
								surveySingle.append($("<option>").attr('value', this.val).text(this.text));
							}
						});
					}
					$("select.filter-survey-single").select2({placeholder : ""});
					Custom.hideLoader();
				});
			}
			
			// location listing for specialty report
			
			function findLocationEntities() {
				var data_client_id = $("select.filter-action-type").attr("data-client-id");	
				var me = $("select.filter-action-type, input.filter-action-type");
				var selectLocation = $("select.filter-avatar-id");
				var selectSpecialty = $("select.filter-speciality-id")
//				var multipleSpecilatyList = $("select.filter-speciality-id").select2('val');
//				var multipleLocationList = $("select.filter-avatar-id").select2('val');
				var selectSpecialtyId = selectSpecialty.val();
				var selectLocationId = selectLocation.val();
				var selectedSpecialty = me.val();
					$.ajax({
						url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/getLocationList',
						data: {
							selectedSpecialty: selectedSpecialty,
							report_id:SocialView.report_id
						},
						beforeSend: function(xhr) {
							Custom.showLoader();
						},
						type: "GET",
						timeout: 100000,
						error: function(error) {
							var messages = [];
							messages.push('Please try after sometime.');
							Custom.showMessages('error', 'Something went wrong!', messages);
							Custom.hideLoader();
						}
					}).done(function(data) {
						
						selectLocation.find('option').remove().end();
						if (data.length > 0) {
							$(data).each(function(k,location) {
								if (selectLocationId != null && selectLocationId == this.val) {
									selectLocation.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
								}else{
									selectLocation.append($("<option>").attr('value', this.val).text(this.text));
								}
							});
						}
						selectLocation.select2({allowClear : true});
						Custom.hideLoader();
					});
					// remove selected specialty from the list
					$.ajax({
						url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/removeSpecialty',
						data: {
							selectedSpecialty: selectedSpecialty
						},
						beforeSend: function(xhr) {
							Custom.showLoader();
						},
						type: "GET",
						timeout: 100000,
						error: function(error) {
							var messages = [];
							messages.push('Please try after sometime.');
							Custom.showMessages('error', 'Something went wrong!', messages);
							Custom.hideLoader();
						}
					}).done(function(data) {
						selectSpecialty.find('option').remove().end();
						if (data.length > 0) {
							$(data).each(function(k,speciality) {
								if (selectSpecialtyId != null && selectSpecialtyId == this.val) {
									selectSpecialty.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
								}else{
									selectSpecialty.append($("<option>").attr('value', this.val).text(this.text));
								}
								
							});
						}
						selectSpecialty.select2({allowClear : true});
						Custom.hideLoader();
					});
				}
			
			// onload checking for specilaty compoarison report
			function findLocationEntitiesonLoad() {
				var data_client_id = $("select.filter-action-type").attr("data-client-id");	
				var me = $("select.filter-action-type, input.filter-action-type");
				var selectLocation = $("select.filter-avatar-id");
				var selectSpecialty = $("select.filter-speciality-id")
				var multipleSpecilatyList = $("select.filter-speciality-id").select2('val');
				var multipleLocationList = $("select.filter-avatar-id").select2('val');
				var selectSpecialtyId = selectSpecialty.val();
				var selectLocationId = selectLocation.val();
				var selectedSpecialty = me.val();
					$.ajax({
						url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/getLocationList',
						data: {
							selectedSpecialty: selectedSpecialty,
							report_id:SocialView.report_id
						},
						beforeSend: function(xhr) {
							Custom.showLoader();
						},
						type: "GET",
						timeout: 100000,
						error: function(error) {
							var messages = [];
							messages.push('Please try after sometime.');
							Custom.showMessages('error', 'Something went wrong!', messages);
							Custom.hideLoader();
						}
					}).done(function(data) {
						selectLocation.find('option').remove().end();
						if (data.length > 0) {
							$(data).each(function(k,location) {
								selectLocation.append($("<option>").attr('value', location.val).text(location.text));
							});
							$('select.filter-avatar-id option').each(function(){
								var selLoc = $(this).val();
								var selOption = $(this);
								$.each(multipleLocationList, function(i, item) {
									if(item == selLoc ){
										selOption.attr("selected",'selected');

									}
								});
							});
							
						}
						selectLocation.select2({allowClear : true});
						Custom.hideLoader();
					});
					// remove selected specialty from the list
					$.ajax({
						url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/removeSpecialty',
						data: {
							selectedSpecialty: selectedSpecialty
						},
						beforeSend: function(xhr) {
							Custom.showLoader();
						},
						type: "GET",
						timeout: 100000,
						error: function(error) {
							var messages = [];
							messages.push('Please try after sometime.');
							Custom.showMessages('error', 'Something went wrong!', messages);
							Custom.hideLoader();
						}
					}).done(function(data) {
						selectSpecialty.find('option').remove().end();
						if (data.length > 0) {
							$(data).each(function(k,speciality) {
								selectSpecialty.append($("<option>").attr('value', speciality.val).text(speciality.text));
							});
							$('select.filter-speciality-id option').each(function(){
								var selSpe = $(this).val();
								var selOption = $(this);
								$.each(multipleSpecilatyList, function(i, item) {
									if(item == selSpe ){
										selOption.attr("selected",'selected');

									}
								});
							});
							
						}
						selectSpecialty.select2({allowClear : true});
						Custom.hideLoader();
					});
				}
			
			
			
			// End of physician dropdown
			function surveyQuestionUpdate() {
				var location = $("select.filter-avatar-id");
				var surveySingle = $("select.filter-survey-single");
				var qtnList = $("select.survey_question_multiple");
				var qtnListVal =  qtnList.val();
				var surveySingleVal =  surveySingle.val();
				var selectedLocationId = location.val();
				var qtnVals = $("select.survey_question_multiple").val();
				if(surveySingleVal=='')return;
				
				Custom.showLoader();
				$.ajax({
					url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/get_questions/' + surveySingleVal,
					beforeSend: function(xhr) {
						
					},
					type: "GET",
					timeout: 30000,
					error: function(error) {
						var messages = [];
						messages.push('Please try after sometime.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					}
				}).done(function(data) {
					qtnList.find('option').remove().end();
					qtnList.append($("<option>").attr('value', '').text(''));
					if (data.length > 0) {
						$(data).each(function() {
							 if ( $.isArray(qtnListVal) && qtnListVal.length > 0  &&  qtnListVal.indexOf(this.val.toString())>=0) {
								qtnList.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
							 } else {
								qtnList.append($("<option>").attr('value', this.val).text(this.text));
							 }
						});
					}
					$("select.survey_question_multiple").select2({placeholder : ""});
					Custom.hideLoader();
				});
			}
			
			// Source Update
			if ($('select.filter-content-type').hasClass('driver-report') || $('select.filter-content-type').hasClass('positive-driver-report') || $('select.filter-content-type').hasClass('negative-driver-report')) {
				var content_type = $('select.filter-content-type');
				var source_type = $('select.filter-source-multiple');
				
				if (content_type.val() != null) {
					sourceUpdate(source_type.val());
				}
				
				if ($('select.filter-avatar-id').length) {
					$('select.filter-avatar-id').on('change', function() {
						if (content_type.val() == "100000" || content_type.val() == "100011") {
							sourceUpdate(source_type.val());
						}
					});
				}
				
				$('select.filter-content-type').on('change', function() {
					
					if (content_type.val() == "100000" || content_type.val() == "100011") {
						$('.filter-content-processed-type-wrapper').show();
					} else {
						$('.filter-content-processed-type-wrapper').hide();
					}
					
					if (content_type.val() != null) {
						sourceUpdate(source_type.val());
					}
				});
			}
			
			function sourceUpdate(source_type) {
				var sourceItem = $("select.filter-source-multiple");
				
				$.ajax({
					url: SocialView.base_url + "reports/" + SocialView.client_id + '/dom_request/get_filtered_sources/' + $("select.filter-content-type").val(),
					data: {
						avatar_id: $('select.filter-avatar-id').val()
					},
					beforeSend: function(xhr) {
						Custom.hideMessages();
						Custom.showLoader();
					},
					type: "POST",
					timeout: 30000,
					error: function(error) {
						var messages = [];
						messages.push('Please try after sometime.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					}
				}).done(function(data) {
					Custom.hideLoader();
					sourceItem.find('option').remove().end();
					if (data.length > 0) {
						$(data).each(function() {
							if (data.length == 1) {
								sourceItem.append($("<option>").attr('value', this.val).attr('selected', 'selected').text(this.text));
							} else {
								sourceItem.append($("<option>").attr('value', this.val).text(this.text));
							}
						});
						sourceItem.val(source_type);
						sourceItem.select2();
					} else {
						sourceItem.select2();
					}
				});
			}
			// End of sources
			
			// Generate/Download button click
            $(".filter-generate, .filter-download, .filter-save, .filter-schedule.validate, .filter-user-schedule, .filter-generate-email").live("click", function(e) {
                //e.preventDefault();
                var validated = true;
                var errors = [];
				
				Custom.hideMessages();
				
                // Serviceline Primary
                var serviceLine = $("select.filter-serviceline-list");
                if (serviceLine.hasClass('service-line-report') && (serviceLine.val() == "" || serviceLine.val() == 'undefined' || serviceLine.val() == undefined)) {
                	errors.push("Select Service Line");
                    validated = false;
                }  
				// Location
                var avatarSelect = $("select.filter-avatar-id");
                if (avatarSelect.length && (avatarSelect.val() == "" || avatarSelect.val() == null) && !avatarSelect.hasClass("survey-response-count-report")  && !avatarSelect.hasClass("ebh-division-survey-report")) {
                    if(avatarSelect.hasClass("insights-listing-excel-report")){
                    	errors.push("Select Location/Specialty");
                    }else{
                    	errors.push("Select Location");
                    }
                    validated = false;
                }
                
                // REGION
                if (avatarSelect.length && (avatarSelect.val() == "" || avatarSelect.val() == null) && avatarSelect.hasClass("ebh-division-survey-report")) {
                    errors.push("Select Region");
                    validated = false;
                }
				
				// Location group
				var locationGroupSelect = $('select.filter-location-group');
				if(locationGroupSelect.length && $('.filter-location-group option').length > 0 && locationGroupSelect.val() == ""){
					errors.push("Select Location");
                    validated = false;
				}
				
                // Person Entity
                var personSelect = $("select.filter-person-entity");
                if (personSelect.length && personSelect.select2('val').length == 0 ) {
                    if ( (($("select.filter-avatar-id").length && $(".filter-avatar-id").select2('val') != "") || ($("input.filter-avatar-id").length && $(".filter-avatar-id").val() != ""))
							&& !personSelect.hasClass("survey-response-count-report") && !personSelect.hasClass("review-testimonial-report")
							&& !personSelect.hasClass("physician-ranking-report") && !personSelect.hasClass("monthly-trends-report") && !personSelect.hasClass("response-trends-by-question") && !personSelect.hasClass("insights-listing-excel-report")
						) {
                        errors.push("Select Physician");
                        validated = false;
                    }
                }
                
                // Physician List
                var physicianList = $("select.filter-physician-list");
                if (physicianList.length && physicianList.select2('val') == "") {
                	errors.push("Select Physician");
                    validated = false;
                }
				
				// Survey
                var surveySelect = $("select.filter-survey-single");
                if (surveySelect.length && surveySelect.children().length > 1 && (surveySelect.val() == null || surveySelect.val() == "")) {
                    errors.push("Select a survey");
                    validated = false;
                }
                
				// CTL Threshold
                var ctlThreshold = $("input.ctl-threshold");
                if (ctlThreshold.length && (isNaN(ctlThreshold.val()) || ctlThreshold.val() == "")) {
                    errors.push("Enter valid PFS threshold");
                    validated = false;
                }else if (ctlThreshold.length && ( ctlThreshold.val() > 5 || ctlThreshold.val() < 0)) {
                    errors.push("Enter PFS threshold in between 0 and 5");
                    validated = false;
                }
                
             //  Threshold
                var Threshold = $("input.threshold");
                if (Threshold.length && (isNaN(Threshold.val()) || Threshold.val() == "")) {
                    errors.push("Enter valid PFS threshold");
                    validated = false;
                }else if (Threshold.length && ( Threshold.val() > 5 || Threshold.val() < 0)) {
                    errors.push("Enter PFS threshold in between 0 and 5");
                    validated = false;
                }
         
                // Questions
                var qtnSelect = $("select.survey_question_multiple");
                if (qtnSelect.length && qtnSelect.children().length > 1 && (qtnSelect.val() == null || qtnSelect.val() == "")) {
                    errors.push("Select a Question");
                    validated = false;
                }
                
             // Category check validation 
                if( (avatarSelect.hasClass("category-review-report")) ){
                	var selectedCategoryList = $("#category_multiple_list_count").val();
                	if(selectedCategoryList == "" || selectedCategoryList == 0){
                		errors.push("Select Category Types");
                		validated = false;
                	}

                }
				
                // Multiple Sources
                var sourceSelect = $('select.filter-source-multiple');
                if (sourceSelect.length && (sourceSelect.val() == null || sourceSelect.val() == '')
						&& (sourceSelect.hasClass('response-rate-report'))) {
                    errors.push("Select source(s)");
                    validated = false;
                }
                
                /*var sourceSelect = $('select.filter-source-multiple');
                if (sourceSelect.length && (sourceSelect.val() == null || sourceSelect.val() == '')
						&& (sourceSelect.hasClass('positive-driver-report') || sourceSelect.hasClass('negative-driver-report') || sourceSelect.hasClass('driver-report'))) {
                    errors.push("Select source(s)");
                    validated = false;
                }*/
                // Source selction in ctl sutask report
                var sourceSelect = $('select.filter-sources-multiple');
                if (sourceSelect.length && (sourceSelect.val() == null || sourceSelect.val() == '')
						&& (sourceSelect.hasClass('subtask-ctl-report'))) {
                    errors.push("Select source(s)");
                    validated = false;
                }
                // Save config title
                var saveTitle = $('.filter-save-title');
                if ($(this).hasClass('filter-save') && saveTitle.length && (saveTitle.val() == null || saveTitle.val() == "")) {
                    errors.push("Enter title to save the configuration");
                    validated = false;
                }
                
                // multiple sentiment check
                if($('.check-sentiments-each').length >0){
                	var selectSentimentType = $('.check-sentiments-each').parent('.checked').length;
                    if (selectSentimentType == 0){
                        errors.push("Select Sentiment type");
                        validated = false;
                    }
                }
                // category multple 
                if($('.filter-category-multiple').length >0){
                	var selectCategoryTypeItems = $('#category_multiple_list').val();
                	if ( (selectCategoryTypeItems =="" && $(".filter-category-multiple").hasClass("insights-listing-excel-report")) ||
                	     (selectCategoryTypeItems =="" && $(".filter-category-multiple").hasClass("employee-category-report")) ){
                        errors.push("Select Category");
                        validated = false;
                    }
                }
                // End of validation
                if (validated) {
					
					if ($(this).hasClass('filter-save')) {
						
						$("#draggable").modal('show');
						$('body').on("click",".save-configuration",function(){
							$("#draggable").modal('show');
							$('form#report-filter-form').submit();
						});
					}else if ($(this).hasClass('filter-schedule')) {
						
						$(this).removeClass('validate');
						
						$('.filter-schedule').click();
						return true;
					}else if ($(this).hasClass('filter-download')) {
						//Custom.showLoader();
						$('form#report-filter-form').submit();
						return true;
					} else if ($(this).hasClass('filter-user-schedule')) {
						$('form#report-filter-form').submit();
						return true;
					}else{
						Report.filterSubmit();
						return true;
					}
                } else {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                }
                return false;
            });
            
            // Register change event for serviceline select box
			$("#service_line").on("change",function(){
				Report.onServicelineChange();
			});
		},
		
		// Submit Report configuration filter
		filterSubmit:function(){
			$('form#report-filter-form').addClass('hidden');
			Custom.showLoader();
		},
		
		loadView:function(){
			//load report page onload
			$.ajax({
				url: $("#reports-wrapper").attr("data-url"),
				context: $("#reports-wrapper")
			}).fail(function() {
				$("#reports-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
			}).done(function(data) {
				$("#reports-wrapper").html(data);
				onReportLoad();
			}).complete(function() {
				Custom.hideLoader();
				Report.loadReportBlock();
			});
			//attach loadmore event
			$('.main-content').on("click",".report-block-load-more span >a",function(e){
				e.preventDefault();
				me=$(this);
				var url = me.attr("data-url");
				$.ajax({
					url: url,
					type: "GET",
					beforeSend: function(xhr) {
						me.hide();
						Metronic.blockUI({ target:me.parent() ,animate: true,overlayColor: 'none'});
					}
				}).done(function(data) {
					table=data.data;
					var parent = me.parents("tbody");
					Metronic.unblockUI(me.parent()); 
					me.parents("tr").remove();
					var rows = $(table).find("tbody").html();
					parent.append(rows);
				}).fail(function() {
					
				}).always(function() {
					//me.show();
					//hide_overlay();
				});
				return false;
			});
			
			$('.main-content').on('click', '.source-link', function (){
				$("html, body").animate({scrollTop: $('#' + $(this).attr('link')).offset().top - 60});
        	});
		},
		loadReportBlock : function () {
			if($('.lazy-loading-block').length > 0){
				Report.__loadBlock(0);
			}
		},
		__loadBlock : function(currentBlockPosition){
			if( $('.lazy-loading-block')[currentBlockPosition] != undefined) {
				var block = $('.lazy-loading-block')[currentBlockPosition];
				var me = $(block);
				var url = SocialView.base_url + 'public/report_ajax_block/' + SocialView.client_id + '/' + SocialView.report_id + '/' + me.attr("block-id") + '/' + me.attr('encoded');
				$.ajax({
					url: url,
					type: "GET",
					beforeSend: function(xhr) {
						Custom.showLoader('#' + me.attr('id'));
					}
				}).done(function(data) {
					me.html(data);
				}).complete(function(){
					Custom.hideLoader('#' + me.attr('id'));
					currentBlockPosition++;
					onReportLoad();
					Report.__loadBlock(currentBlockPosition);
				});
			}
		},
        // Function to Update Block using ajax
        blockRefresh : function(report_id,block, encoded, email) {
            var url = '';
            switch (block) {
                case "category_driver_chart_block":

                    // Defining which blocks have to update
                    var update_blocks = ["category_driver_chart_block", "top_key_words_block", "driver_trend_chart_block"];
                    if (report_id == "positive-driver-report") {
                        update_blocks.push("positive_comment_block");
                    } else if (report_id == "negative-driver-report") {
                        update_blocks.push("negative_comment_block");
                    } else if (report_id == "driver-report") {
                        update_blocks.push("comment_block");
                    }

                    var number_of_requerst = update_blocks.length;
                    for (var i = 0; i < update_blocks.length; i++) {
                    	//url = $('*[block-id="'+ update_blocks[i] +'"]').attr('data-url');
                    	
                        url = SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/ajax_refresh_block_data/0/'+
                        report_id +  "/"  + update_blocks[i] + "/"  + encoded ;
                        eletarget = $('*[block-id="category_driver_chart_block"]');
                        Metronic.blockUI({ target:eletarget ,animate: true, centerY:true});
                        $.ajax({
                            url: url,
                            type: "GET",
                            beforeSend: function(xhr) {
                                
                            },
                            timeout: 60000,
                            error: function(error) {
                                var messages = [];
								messages.push('Please try after sometime.');
								Custom.showMessages('error', 'Something went wrong!', messages);
                            }
                        }).done(function(data) {
                        	$('*[block-id="'+data.block+'"]').html(data.data);

                            switch (data.block) {
                                case "top_key_words_block":
                                    if ($("#wordcloud_positive").length) {
                                        positiveWordCloud();
                                    }
                                    if ($("#wordcloud_negative").length) {
                                        negativeWordCloud();
                                    }
                                    break;
                                case "positive_comment_block":
                                    if ($('.block-data-' + data.block).length) {
                                        $('.main-content').attr('style', 'min-height:auto');
                                    }
                                    break;
                                case "negative_comment_block":
                                    if ($('.block-data-' + data.block).length) {
                                        $('.main-content').attr('style', 'min-height:auto');
                                    }
                                    break;
                            }
							
                            number_of_requerst--;
                            if (number_of_requerst == 0) {
								Metronic.unblockUI(eletarget);
                            }
                            
                        }).fail(function() {
							
                        }).always(function() {
                            //hide_overlay();
                        });
                    }
                    break;
            }
        },
		
		loadShare:function(){
			
			
			var shareSubject = "";
			if($(".share_subject_value").val() !=""){
				shareSubject = $(".share_subject_value").val();
			}
			$("#share_subject").val(shareSubject);
			
			// Placeholder 
			$('input[type=text], textarea').placeholder();
			
			// Select2 for email share
            $(".select2-tags.share-emails").select2({
				placeholder: 'Enter valid email address',
                tags: [],
                tokenSeparators: [',', ' '],
                minimumResultsForSearch : Infinity,
				formatNoMatches: function(term) {
					return ""
				},
				createSearchChoice : function(term, data) {
					if ($(data).filter(function() {
						return this.text.localeCompare(term) === 0;
					}).length === 0) {
						if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(term)) {
							return {
								id : term,
								text : term
							};
						} else {
							return null;
						}
					}
				}
            });
			
			// Share submit function
			$('.share-report-btn').on('click', function(){
				Custom.hideMessages();
				
				var validated = true;
				var messages = [];
				
				var subject = $('#share_subject');
				var emails = $('#share_emails');
				
				if (subject.length && subject.val() == '') {
					validated = false;
					messages.push('Please give an email subject.');
				}if (emails.length && emails.val() == '') {
					validated = false;
					messages.push('Please enter valid email address.');
				}
				
				if (validated == true) {
					$.ajax({
						url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/share_email/' + SocialView.report_id + '/' + SocialView.encoded,
						data: {
							subject: subject.val(),
							emails: emails.val()
						},
						type: "POST",
						beforeSend: function(xhr) {
							Custom.showLoader();
						}
					}).done(function(data) {
						messages.push(data.message);
						Custom.showMessages(data.status, data.title, messages);
						emails.select2('val', '');
						Custom.hideLoader();
					}).fail(function() {
						messages.push('Please try again later.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					});
				}else{
					Custom.showMessages('error', 'Please check the following!', messages);
				}
				return false;
			});
		},
		
		loadSchedule:function(){
			
			var scheduleSubject = "";
			if($(".schedule_subject_value").val() !=""){
				scheduleSubject = $(".schedule_subject_value").val();
			}
			$("#schedule_subject").val(scheduleSubject);
			
			// Placeholder
			$('input[type=text], textarea').placeholder();
			
			// Select2 for email schedule
            $(".select2-tags.schedule-emails").select2({
                tags: [],
                tokenSeparators: [',', ' '],
                minimumResultsForSearch : Infinity,
				formatNoMatches: function(term) {
					return ""
				},
				createSearchChoice : function(term, data) {
					if ($(data).filter(function() {
						return this.text.localeCompare(term) === 0;
					}).length === 0) {
						if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(term)) {
							return {
								id : term,
								text : term
							};
						} else {
							return null;
						}
					}
				}
            });
			
			/* Scheduling dropdown hide/show feature */
			$('.schedule-day-of-week-block').hide();
			$("select#schedule_reporting_period > option").attr("disabled", "disabled");
			$("select#schedule_reporting_period > option[value='30']").removeAttr("disabled");
			$("select#schedule_reporting_period > option[value='60']").removeAttr("disabled");
			$("select#schedule_reporting_period > option[value='91']").removeAttr("disabled");
			$("select#schedule_reporting_period").select2();
			$('#schedule_frequency').on('change', function(e) {
				var frequency = $(this).val();
				
				if (frequency == "d") {
					$('.schedule-day-of-week-block').hide();
					$('.schedule-day-of-month-block').hide();
					$('.schedule-reporting-period-block').hide();
				} else if (frequency == "w") {
					$('.schedule-day-of-week-block').show();
					$('.schedule-day-of-month-block').hide();
					$("select#schedule_reporting_period > option").attr("disabled", "disabled");
					$("select#schedule_reporting_period > option").removeAttr("selected", "selected");
					$("select#schedule_reporting_period > option[value='7']").attr("selected", "selected");
					$("select#schedule_reporting_period > option[value='7']").removeAttr("disabled");
					$("select#schedule_reporting_period > option[value='14']").removeAttr("disabled");
					$("select#schedule_reporting_period > option[value='21']").removeAttr("disabled");
					$("select#schedule_reporting_period").select2();
					$('.schedule-reporting-period-block').show();
				} else if (frequency == "m") {
					$('.schedule-day-of-week-block').hide();
					$('.schedule-day-of-month-block').show();
					$("select#schedule_reporting_period > option").attr("disabled", "disabled");
					$("select#schedule_reporting_period > option").removeAttr("selected", "selected");
					$("select#schedule_reporting_period > option[value='30']").attr("selected", "selected");
					$("select#schedule_reporting_period > option[value='30']").removeAttr("disabled");
					$("select#schedule_reporting_period > option[value='60']").removeAttr("disabled");
					$("select#schedule_reporting_period > option[value='91']").removeAttr("disabled");
					$("select#schedule_reporting_period").select2();
					$('.schedule-reporting-period-block').show();
				} else if (frequency == "q") {
					$('.schedule-day-of-week-block').hide();
					$('.schedule-day-of-month-block').show();
					$("select#schedule_reporting_period > option").attr("disabled", "disabled");
					$("select#schedule_reporting_period > option").removeAttr("selected", "selected");
					$("select#schedule_reporting_period > option[value='90']").attr("selected", "selected");
					$("select#schedule_reporting_period > option[value='90']").removeAttr("disabled");
					$("select#schedule_reporting_period > option[value='180']").removeAttr("disabled");
					$("select#schedule_reporting_period").select2();
					$('.schedule-reporting-period-block').show();
				} else if (frequency == "y") {
					$('.schedule-day-of-week-block').hide();
					$('.schedule-day-of-month-block').show();
					$("select#schedule_reporting_period > option").attr("disabled", "disabled");
					$("select#schedule_reporting_period > option").removeAttr("selected", "selected");
					$("select#schedule_reporting_period > option[value='365']").attr("selected", "selected");
					$("select#schedule_reporting_period > option[value='365']").removeAttr("disabled");
					$("select#schedule_reporting_period").select2();
					$('.schedule-reporting-period-block').show();
				}
			});
			/* End */

			$('span#share_report').live('click', (function(e) {
				$('#email-send-notify').hide('slow');
				if ($('#monthly-survey-report-share').length) {
					$('#monthly-survey-report-share').toggle('slow');
				}
				if ($('#login-report-share').length) {
					$('#login-report-share').toggle('slow');
				}
			}));
			
			// Schedule submit function
			$('.schedule-report-btn').on('click', function(){
				Custom.hideMessages();
				
				var data = new Object;
				var temp_name = '';
				var validated = true;
				var messages = [];
				
				var formData = $('.report-schedule-form').serializeArray();
				$.each(formData, function(index, item){
					data[item.name] = item.value;
				});
				data['schedule_emails'] = $('#schedule_emails').val();
				
				
				if (typeof data.schedule_subject != 'undefined' && data.schedule_subject == "") {
					validated = false;
					messages.push('Please give an email subject.');
				}if (typeof data.schedule_emails != 'undefined' && data.schedule_emails == null) {
					validated = false;
					messages.push('Please enter valid email address.');
				}
				if (typeof data.schedule_emails != 'undefined' && data.schedule_emails == "") {
					validated = false;
					messages.push('Please enter valid email address.');
				}
				
				if (validated == true) {
					$.ajax({
						url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/schedule_email/' + SocialView.report_id + '/' + SocialView.encoded,
						data: data,
						type: "POST",
						beforeSend: function(xhr) {
							Custom.showLoader();
						}
					}).done(function(data) {
						messages.push(data.message);
						Custom.showMessages(data.status, data.title, messages);
						$('#schedule_emails').select2('val', '');
						$('#note').val('');
						Custom.hideLoader();
					}).fail(function() {
						messages.push('Please try again later.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					});
				}else{
					Custom.showMessages('error', 'Please check the following!', messages);
				}
				return false;
			});
		},
		scheduledReport:function(){
			$(".delete-scheduled-report").on("click",function(){
				var selectedReport = $(this).attr('rel');
				var url = SocialView.base_url + 'reports/' + SocialView.client_id + '/delete-schedule';
				$("#draggable").modal('show');
				$(".delete-schedule").on("click",function(){
					$('.delete-schedule').prop('disabled', true);
					Metronic.blockUI({
		                target: '#draggable',
		                overlayColor: 'none',
		                animate: true
		            });
//					$('#preview-overlay').show();
                            $.ajax({
                                url: url,
                                data: {
                                    schedule_id: selectedReport
                                },
                                type: "POST",
                                error: function(error) {
                                    window.location.reload();
                                }
                            }).done(function(data) {
                            	if(data.status=='success'){
                            		$(".status-msg-p").html('<span style="color:green">'+data.message+"</span>");
                            		setTimeout(function(){
                            			$('.delete-schedule').prop('disabled', false);
                            			$("#draggable").modal('hide');
                            			$(".status-msg-p").html('');
                            			
                            			}, 2000);
                            	}else{
                            		$(".status-msg-p").html('<span style="color:red">'+data.message+"</span>");
                            		setTimeout(function(){
                            			$('.delete-schedule').prop('disabled', false);
                            			$("#draggable").modal('hide');
                            			$(".status-msg-p").html('');
                            			
                            			}, 2000);
                            	}
                            	Custom.hideLoader();
                                window.location.reload();
                            });
                            return true;
				});
				
			});
			
			
			$(".delete-saved-report").on("click",function(){
				var selectedReport = $(this).attr('rel');
				var url = SocialView.base_url + 'reports/' + SocialView.client_id + '/delete-configuration';
				$("#draggable").modal('show');
				$('body').on("click",".delete-saved",function(){
					$('.delete-saved').prop('disabled', true);
//					$('#preview-overlay').show();
                            $.ajax({
                                url: url,
                                data: {
                                	saved_config_id: selectedReport
                                },
                                type: "POST",
                                error: function(error) {
                                    window.location.reload();
                                }
                            }).done(function(data) {
                            	if(data.status=='success'){
                            		$(".status-msg-p").html('<span style="color:green">'+data.message+"</span>");
                            		$("#draggable").modal('hide');
                            		setTimeout(function(){
                            			$('.delete-saved').prop('disabled', false);
                            			$("#draggable").modal('hide');
                            			$(".status-msg-p").html('');
                            			}, 2000);
                            	}else{
                            		$(".status-msg-p").html('<span style="color:red">'+data.message+"</span>");
                            		setTimeout(function(){
                            			$('.delete-saved').prop('disabled', false);
                            			$("#draggable").modal('hide');
                            			$(".status-msg-p").html('');
                            			}, 2000);
                            		}
                                window.location.reload();
                            });
                            return true;
				});
				
			});
			
		},
		// This function will generate an ajax request which will call the services for
		// creating the excel report
		exportExcel: function(url) {
			var messages       = [];
			var postData       = {};
			postData.excelReportPath = $('#exportExcelBtn').attr('excelReportPath');

			$.ajax({
                url        : url,
                data       : postData,
                type       : "POST",
                dataType   : 'json',
				beforeSend : function(xhr) {
					// Show the loading here
					Custom.showLoader('.page-content');
				}
			}).done(function(data) {
				if(data.status['code']==200) {
					messages.push('Report will be sent to your email soon!');
					Custom.showMessages('success', 'Report generation is in progress!', messages);
				} else {
					messages.push('Something went wrong. Please try again later!');
					Custom.showMessages('error', 'Report generation failed!', messages);
				}
				// Stop showing the loading
				Custom.hideLoader('.page-content');
			}).fail(function() {
				messages.push('Something went wrong. Please try again later!');
				Custom.showMessages('error', 'Report generation failed!', messages);
				// Stop showing the loading
				Custom.hideLoader('.page-content');
			});		
		},
		
		onServicelineChange: function() {
			var data_client_id      = $("select.filter-action-type").attr("data-client-id");	
			var me                  = $("select.filter-action-type, input.filter-action-type");
			var selectLocation      = $("select.filter-avatar-id");
			var selectServiceline   = $("select.filter-service-line-comparison-multiple")
 			var selectServicelineId = selectServiceline.val();
			var selectLocationId    = selectLocation.val();
			var selectedServiceline = me.val();
				$.ajax({
					url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/getServicelineLocationList',
					data: {
						selectedServiceline: selectedServiceline,
						report_id          : SocialView.report_id
					},
					beforeSend: function(xhr) {
						Custom.showLoader();
					},
					type: "GET",
					timeout: 500000,
					error: function(error) {
						var messages = [];
						messages.push('Please try after sometime.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					}
				}).done(function(data) {
					selectLocation.find('option').remove().end();
					if (data.length > 0) {
						$(data).each(function(k,location) {
							if (selectLocationId != null && selectLocationId == this.val) {
								selectLocation.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
							}else{
								selectLocation.append($("<option>").attr('value', this.val).text(this.text));
							}
						});
					}
					selectLocation.select2({allowClear : true});
					Custom.hideLoader();
				});
				// remove selected service from the list
				$.ajax({
					url: SocialView.base_url + 'reports/' + data_client_id + '/dom_request/removeServiceline',
					data: {
						selectedServiceline: selectedServiceline
					},
					beforeSend: function(xhr) {
						Custom.showLoader();
					},
					type: "GET",
					timeout: 100000,
					error: function(error) {
						var messages = [];
						messages.push('Please try after sometime.');
						Custom.showMessages('error', 'Something went wrong!', messages);
						Custom.hideLoader();
					}
				}).done(function(data) {
					selectServiceline.find('option').remove().end();
					if (data.length > 0) {
						$(data).each(function(k,speciality) {
							if (selectServicelineId != null && selectServicelineId == this.val) {
								selectServiceline.append($("<option selected='selected'>").attr('value', this.val).text(this.text));
							}else{
								selectServiceline.append($("<option>").attr('value', this.val).text(this.text));
							}
							
						});
					}
					selectServiceline.select2({allowClear : true});
					Custom.hideLoader();
				});
			}
		
	};
}();

//Function defenitions
function onReportLoad() {
	if ($("#wordcloud_negative").length) {
	    negativeWordCloud();
	}
	if ($("#wordcloud_positive").length) {
	    positiveWordCloud();
	}
	$(window).on('resize',function(){
		resize_tiles();
	});
	resize_tiles();
	
}

function resize_tiles()
{
	equal_cols($('.score-title'));
	equal_cols($('.dashboard-stat .more'));
	equal_cols($('.source-block-titles>.source-title p.title'));	
}



function equal_cols(el)
{
    var h = 0;
   
    if(el.length > 1){ 
    	 $(el).each(function(){
    	        $(this).css({'height':'auto'});
    	        if($(this).outerHeight() > h)
    	        {
    	        	h = $(this).outerHeight();
    	        }
    	 });
    	 
	    $(el).each(function(){
	        $(this).css({'height':h});
	    });
    }
}

function positiveWordCloud() {
    var settings_positive = {
        "size": {
            "grid": 1,
            "factor": .3,
            "normalize": true
        },
        "color": {
            "background": "rgb(255,255,255)",
            "start": "#b7dc00",
            "end": "#00dc00"
        },
        "options": {
            "color": "gradient",
            "printMultiplier": 1
        },
        "font": "Futura, Helvetica, sans-serif",
        "shape": "square"
    }
    $("#wordcloud_positive").awesomeCloud(settings_positive);
}


function negativeWordCloud() {
    // Static Word cloud
    var settings_negative = {
        "size": {
            "grid": 1,
            "factor": .3,
            "normalize": true
        },
        "color": {
            "background": "rgb(255,255,255)",
            "start": "#ff9200",
            "end": "#ff0000"
        },
        "options": {
            "color": "gradient",
            "printMultiplier": 1
        },
        "font": "Futura, Helvetica, sans-serif",
        "shape": "square"
    }
    $("#wordcloud_negative").awesomeCloud(settings_negative);
}



