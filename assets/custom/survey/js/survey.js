var Survey = function() {

	return {
		home : function(flag) {
			
			var physicianGroup = $("#physicianGroup");
			var physicianGroupKey = "0|All Allowed Providers||Physician Group";
			var physicianGroupValue = "All Allowed Providers";
			
			var locationGroupKey = "0|All Allowed Sites||Locations";
			var locationGroupValue = "All Allowed Sites";
			
			//The default First and Second column names of datatable was Physician and NPI.
			//The names of these columns will be changed (Physician/Location) onchange of Display Radio button.
			var dataTableFirstColumn = "Physician";
			var dataTableSecondColumn = "NPI";
			

			$.fn.serializeObject = function() {
				var o = {};
				var a = this.serializeArray();
				$.each(a, function() {
					if (o[this.name] !== undefined) {
						if (!o[this.name].push) {
							o[this.name] = [ o[this.name] ];
						}
						o[this.name].push(this.value || '');
					} else {
						o[this.name] = this.value || '';
					}
				});
				return o;
			};

			$.fn.reset = function(fn) {
				return fn ? this.bind("reset", fn) : this.trigger("reset");
			};

			/*
			 * ====================Physician Group Tree View dropdown======================
			 */
			var selArray = new Array();
			
			//Physician Group Tree view method.
			function displayPGTreeView(clientName, displayInfo, defaultOptionKey)
			{
				// To make "All Allowed Physicians/Locations" selected by default.
				selArray[0] = defaultOptionKey;
				
				$('#gtreetable').gtreetable({
					
	  			'source': function (id, level) {
	  				return {
		       		type: 'POST',
		       		url:  SurveyView.base_url+ "survey/getTreeViewData",
		       		dataType: 'json',
		       		data:{
		       			id: id,
		       			clientName: clientName,
		       			level: level,
		       			displayInfo: displayInfo
		       		},
		       		error: function(XMLHttpRequest) {
		       			Custom
						.showMessages(
								"error",
								"An error occurred",
								[ "Sorry, there is an error processing your request. Please try again later" ]);
		       					}
		      				}
	    			},
	    			'selectLimit': -1,
	    			'cache': 1,
	    			'readonly': true,
	    			onSelect: function(node){
	    				
	    				/*
	    				 * Onselect an option in Tree View,  corresponding 
	    				 * option has to be highlighted from select2 physician group dropdown.
	    				 * */
	 					physicianGroup.append($('<option>', { 
	 				           value: node.ddid,
	 				           text : node.name
	 				    }));
	 					
	 					//Adding already selected values from physicianGroup/location dropdown to selArray.
	 					$.each($('#physicianGroup option:selected'), function(){
	    					selArray.push($(this).val());
	    				});
	 					
	 					//Adding the selected value from TreeView to selArray, which is used for PhysicianGroup/location select2 dropdown.
	 					selArray.push(node.ddid);
	 					
	 					physicianGroup.val(null).trigger("change");
	 					physicianGroup.val(selArray).trigger("change");
	    			},
	    			onUnselect: function(node){
	    				/*
	    				 * OnUnselect an option in Tree View,  corresponding 
	    				 * option has to be de-selected from select2 physician group dropdown.
	    				 * */
	    				$("#physicianGroup option[value='"+node.ddid+"'").remove();
	    				
	    				//Removing the selected value from selArray, which is used for PhysicianGroup select2 dropdown.
			        	 selArray.splice(selArray.indexOf(node.ddid), 1);
			        	 
			        	 physicianGroup.val(null).trigger("change");
			        	 physicianGroup.val(selArray).trigger("change");
	    			}
				});
				
				
				
			}

			// Dynamic change in treeview dropdown when an option is unselected
			// in Physician Group dropdown.

			physicianGroup
					.on(
							"select2:unselect",
							function(event) {
								// Removing the value from Physician Group
								// Dropdown
								$(
										"#physicianGroup option[value='"
												+ event.params.data.id + "'")
										.remove();

								// Removing the value from the Array which is
								// used to select values in PhysicianGroup
								// Dropdown.
								selArray.splice(selArray
										.indexOf(event.params.data.id), 1);

								// Making the option unselected in Physician
								// Group Tree view.
								var pgTreeViewId = null;
								pgTreeViewId = getPGTreeViewIdFromPGDDId(event.params.data.id);
								$("table").find(
										"[data-id='" + pgTreeViewId + "']")
										.removeClass("node-selected");

							})

			// The below code is used to display Physician Group TreeView under
			// Physician Group Select2 dropdown.
			$('#pgtreeviewdropdown').position({
				my : "center bottom-20",
				of : $("#physicianGroup")
			});

			// The below code is used to make Physician Group TreeView dropdown
			// draggable.
			$('#pgtreeviewdropdown').draggable({
				handle: ".modal-header"
			});

			//Displaying the Physician Group tree view dropdown onclicking on Physician Group input group addon.
	        //by traversing the addon which was before physician group dropdown
			physicianGroup.prev().on("click", function(event)
	      	{
				var clientName = null;
				var displayInfo = null;
				var defaultOptionKey = physicianGroupKey;
				
				//Making the table empty if it was already created.
				$("#gtreetable").empty();
				
				//Display the Modal popup.
	      		$('#pgtreeviewdropdown').modal('show');
	      		
	      		//Preventing background scroll when modal popup.
	      		$('body').css('overflow', 'hidden');
				$('body').css('position', 'fixed');
	      		
	      		//Getting the ClientInfo.
				//Getting the ClientInfo.
				if($('input:hidden').filter("[name='client']") && $("#client").val() === undefined)
				{
					clientName = $('input:hidden').filter("[name='client']").val();
				}
				else
				{
					clientName = $('#client').val();
				}
				
				displayInfo = $('input:radio[name=display]:checked').val();
				
				if(displayInfo === "sites")
				{
					defaultOptionKey = locationGroupKey;
				}
				
				
				//Getting the Tree View Physician Data.
	      		displayPGTreeView(clientName, displayInfo, defaultOptionKey);
	      		
	      		
	      	});
			
			/*
			 * Making the Physician Group Tree View table empty on closing
			 * Physician Group Tree View Modal popup.
			 */
			$('#pgtreeviewdropdown').on('hidden.bs.modal', function(event) {

				// Undoing the action that was done while opening the popup.
				// Making the body works asusual.
				$('body').css('overflow', '');
				$('body').css('position', '');

				$("#gtreetable").empty();
			});

			function getPGTreeViewIdFromPGDDId(pgddId) {
				var pgTreeViewId = null;
				if (pgddId !== null) {
					var pgidArray = pgddId.split("|");
					pgTreeViewId = pgidArray[0];
				}
				return pgTreeViewId;
			}
			
			/*
			 * ====================End of Physician Group Tree View dropdown======================
			 */
			
			/*===============================Display/Product radio button onchange event====================*/
			//The below globalDisplayInfo variable is used in getting remote data for PhysicianGroup/Locations
			//dropdown.
			
			var globalDisplayInfo = "Providers";
			$.validator.messages.required = "Provider is required";
			$('input:radio[name=display]').on("change", function(event)
			      	{
				
						var clientName = null;
						var displayInfo = null;
											
						displayInfo = $('input:radio[name=display]:checked').val();
						globalDisplayInfo = displayInfo;			
						if(displayInfo === "sites")
						{
							modificationsRequiredForLocations(false);
						}
						else
						{
							modificationsRequiredForProviders();
						}
						
						//Closing the Physician Group Tree View Modal popup incase it is opened.
						$('#pgtreeviewdropdown').modal('hide');
						selArray = [];
						selArray[0] = physicianGroupKey;
			      		
			      		
			      	});
			
			if($('input:radio[name=display]:checked').val() === 'sites')
			{
				modificationsRequiredForLocations(true);
			}
			
			
					$('input:radio[name=sourceProduct]').on("change", function(event)
			      	{
						displayInfo = $('input:radio[name=display]:checked').val();
						globalDisplayInfo = displayInfo;
						sourceProduct = $('input:radio[name=sourceProduct]:checked').val();
							
						$.ajax({
							url : SurveyView.base_url
									+ "survey/clientsList/"
									+ sourceProduct,
							type : 'GET',
							dataType : 'text',
							beforeSend : function() {
								Custom.showLoader();
							},
							complete : function() {
								Custom.hideLoader();
							},
							success : function(data,
									textMessage, jqXHR) {
								
								var obj = jQuery.parseJSON(data);
								
								var client = $("#client");
								
								client.html("");
								
								client.select2({
									allowClear : false,
									closeOnSelect: true
								});
								
								var selectedClient = null;
								
								$.each(obj,function(idx, item) {
											// Getting the id of the first Source in the dropdown.
											if (idx == 0) {
												selectedClient = item.id;
											}

											$('#client').append($('<option>', 
												{
													value : item.id,
													text : item.text
												})
											);
								});
								
								client.val(selectedClient).trigger("change");

							},
							error : function(data, textMessage,
									jqXHR) {
								Custom
										.showMessages(
												"error",
												"An error occurred",
												[ "Sorry, there is an error processing your request. Please try again later" ]);
							}
						});
			      		
			      	});
			
			/*==================================End of radio button onchange event==================*/
			
			function modificationsRequiredForLocations(onload)
			{
				var siteText = "Site";
				var sitesText = "Sites";
				
				if(onload === false)
				{
					// Selecting Default option of Physician Group in Physician Group Dropdown.
					// Removing all options related to previous client.
					selectPhysicianGroupDefaultOptionsByRemovingExisting(locationGroupKey, locationGroupValue);
					
					//As mentioned initially,  the names of First and second column will be changed based on
					//display radio button.
					dataTableFirstColumn = "Location";
					dataTableSecondColumn = "SiteID";
					
					//Call Datatable for selectedGroup.
					displayDataTable();
					
					surveyFormValidator.resetForm();
					$('#survey-filter-form').find(".has-error").removeClass("has-error");
				}
				
				
				//Changing the first and second table header column title based on displayInfo selection.
				//Selecting table first row using tr:eq(0).
				//Selecting columns of selected row using th:eq(0).
				$('table.physiciansList tr:eq(0) th:eq(0)').text(siteText);
				$('table.physiciansList tr:eq(0) th:eq(1)').text("SiteID");
				$('table.physiciansList tbody').empty();
								
				
				//Changing the text of Label based on the selection of Display Info.
				$('label[for=physicianGroup]').html(sitesText);
				
				//Changing the title of Modal based on the selection of Display Info.
				$('h4.modal-title').html(sitesText);
				
				$.validator.messages.required = siteText+" is required";
	
			}
			
			function modificationsRequiredForProviders()
			{
				// Selecting Default option of Physician Group in Physician Group Dropdown.
				// Removing all options related to previous client.
				selectPhysicianGroupDefaultOptionsByRemovingExisting(physicianGroupKey, physicianGroupValue);
				
				var providerText = "Provider";
				var providerGroupText = "Provider Group";
				
				
				//As mentioned initially,  the names of First and second column will be changed based on
				//display radio button.
				dataTableFirstColumn = "Physician";
				dataTableSecondColumn = "NPI";
								
				//Call Datatable for selectedGroup.
				displayDataTable();
				
				//Default table header titles.
				//Selecting table first row using tr:eq(0).
				//Selecting columns of selected row using th:eq(0).
				$('table.physiciansList tr:eq(0) th:eq(0)').text(providerText);
				$('table.physiciansList tr:eq(0) th:eq(1)').text("NPI");
				$('table.physiciansList tbody').empty();
				
			
				
				//Default text of label.
				$('label[for=physicianGroup]').html(providerGroupText);
				
				//Default Modal title.
				$('h4.modal-title').html(providerGroupText);
				
				surveyFormValidator.resetForm();
				$('#survey-filter-form').find(".has-error").removeClass("has-error");
				$.validator.messages.required = providerGroupText+" is required";
			}
					
			function selectPhysicianGroupDefaultOptionsByRemovingExisting(key, value)
			{
				// Selecting Default option of Physician Group in Physician Group Dropdown.
				// Removing all options related to previous client.
				$("#physicianGroup option").remove();
				
				// Adding the default option to PhysicianGroup dropdown.
				physicianGroup.append($(
								'<option>',
								{
									value : key,
									text : value
								}));
				
				// Selecting the default option in Physician Group Dropdown.
				physicianGroup
						.val(
								key)
						.trigger("change");
			}
			
			function appealedDropDownRelatedChanges(obj)
  			{
  				var appealBy = $('#appealby');
  				var defaultAppealOption = "-1";

  				//Getting and populating Appealed dropdown by getting Appealed users list for selected client.
  				//Clearing already existed appealed list.
  				appealBy.empty();
  				
  				//Initializing select2 appeal dropdown.
  				appealBy.select2({
					allowClear : false,
					closeOnSelect: true
				});
  				
  				//Appending the default options of Appealed dropdown.
				appealBy.append("<option value='-1'>None</option><option value='0'>All</option>");
				
				//Appending the appealed users list of selected client to Appealed dropdown,
				$.each(obj.appealedby,function(idx,	item) {
					appealBy.append(item.option);
				});
				
				//Selecting the default option of Appealed dropdown.
				appealBy.val(defaultAppealOption).trigger("change");
  			}
			
			function reviewByDropDownRelatedChanges(obj)
  			{
  				//Getting and populating Review dropdown by getting based on Client and Source Product.
  				var reviewby = $("#reviewby");
  				var selectedReviewby = -1;
  				
  				//Clearing already ReviewBy Options.
  				reviewby.empty();
  				
  				//Initializing select2 for ReviewBy dropdown.
				reviewby.select2({
					allowClear : false,
					closeOnSelect: true
				});
				
				//Appending the default options of ReviewBy dropdown.
				$("<option value='-1'>All</option>").appendTo("#reviewby");
				
				//Appending the Reviewed users list of selected client and selected source product to ReviewBy dropdown,
				$.each(obj.editedby, function(idx, item) 
				{
					reviewby.append($('<option>',{
						value : item.Uid,
						text : item.uname
					}));

				});
				
				//Selecting the default option of ReviewBy dropdown.
				reviewby.val(selectedReviewby).trigger("change");
					  				
  			}
  			
  			function sourceDropDownRelatedChanges(obj)
  			{
  				//Getting and populating Source dropdown by getting based on Client and Source Product.
  				var source = $("#source");
  				var selectedSource = null;
  				
  				//Clearing already existed Source Options.
  				source.empty();
  				
  				//Initializing select2 for Source dropdown.
  				source.select2({
					placeholder: 'Select Source',
					allowClear : true,
					closeOnSelect: true
				});
  				
  				//Appending the Sources list of selected client and source product to Source dropdown
  				$.each(obj.source, 	function(idx, item) 
  				{
							// Getting the id of the first Source in the dropdown.
							if (idx == 0) {
								selectedSource = item.id;
							}

							source.append($('<option>',{
								value : item.id,
								text : item.text
							}));
				});
  				
  				//Selecting the default option of Source dropdown.
  				source.val(selectedSource).trigger("change");
			  				
  			}
  			
  			function editedByDropDownRelatedChanges(obj)
  			{
  				//Getting and populating EditedBy dropdown by getting based on Client and Source Product.
  				
  				var editedby = $("#editedby");
  				var selectedEditedby = -1;

  				//Clearing already existed EditedBy Options.
  				editedby.empty();
  				
  				//Initializing select2 for EditedBy dropdown.
  				editedby.select2({
					allowClear : false,
					closeOnSelect: true
				});
  				
  				//Appending the default options of EditedBy dropdown.  				
				$("<option value='-1'>All</option>").appendTo("#editedby");
				
				//Appending the Edited users list of selected client and source product to EditedBy dropdown,
				$.each(obj.editedby, function(idx, item) 
				{
					editedby.append($('<option>',{
						value : item.Uid,
						text : item.uname
					}));

				});
				
				//Selecting the default option of EditedBy dropdown.
				editedby.val(selectedEditedby).trigger("change");
  				
  			}

			
			/*
			 * ========================Dropdowns in Comment Review screen=========================
			 */
			
			$("#client").select2({
				allowClear : false,
				closeOnSelect: true
			});

			$("#source").select2({
				placeholder: 'Select Source',
				allowClear : true,
				closeOnSelect: true
			});
			
			$("#warning").select2({
				allowClear : false,
				closeOnSelect: true
			});

			$("#status").select2({
				allowClear : false,
				closeOnSelect: true
			});
			$("#editedreason").select2({
				allowClear : false,
				closeOnSelect: true
			});
			$("#editedby").select2({
				allowClear : false,
				closeOnSelect: true
			});
			$("#rejectreason").select2({
				allowClear : false,
				closeOnSelect: true
			});
			$("#reviewby").select2({
				allowClear : false,
				closeOnSelect: true
			});
			
			$("#appealby").select2({
				allowClear : false,
				closeOnSelect: true
			});
			
			$('#noOfRatingsFilter').select2({
				allowClear: false,
				closeOnSelect: true
			});
			
			$('#ratingsFilterVal').select2({
				allowClear: false,
				closeOnSelect: true
			});
			
			

			/*
			 * ========================End of Comment Review screen===============================
			 */

			/*
			 * ===============Calendar to be displayed on textbox when click of
			 * Calendar icon=======================
			 */
			$('.input-group').find('.start_date').on('click', function() {
				$('#start_date').trigger('focus');
			});

			$('.input-group').find('.end_date').on('click', function() {
				$('#end_date').trigger('focus');
			});

			$('.input-group').find('.estart_date').on('click', function() {
				$('#estart_date').trigger('focus');
			});

			$('.input-group').find('.eend_date').on('click', function() {
				$('#eend_date').trigger('focus');
			});
			$('.input-group').find('.rstart_date').on('click', function() {
				$('#rstart_date').trigger('focus');
			});

			$('.input-group').find('.rend_date').on('click', function() {
				$('#rend_date').trigger('focus');
			});
			$('.input-group').find('.apl_start_date').on('click', function() {
				$('#apl_start_date').trigger('focus');
			});

			$('.input-group').find('.apl_end_date').on('click', function() {
				$('#apl_end_date').trigger('focus');
			});
			/*
			 * ===============Calendar to be displayed on textbox when click of Calendar icon====================
			 */

			/*
			 * ===========================Physician Group Dropdown loading remote data======================================
			 */
			$('#physicianGroup').select2(
					{

						minimumInputLength : 3,
						placeholder: "Select an Option",
						multiple : true,
						allowClear : true,
						size: 8,
						ajax : {
							url : function(params) {
								var clientName = null;
								
								
								if ($('input:hidden').filter("[name='client']")
										&& $("#client").val() === undefined) {
									clientName = $('input:hidden').filter("[name='client']").val();
								} else {
									clientName = $('#client').val();
								}
																
								return SurveyView.base_url + "survey/"
										+ clientName
										+ "/getPhysicianGroupBasedOnSearchStr/"
										+ params.term;
							},
							data : function(){
								return {"displayInfo": globalDisplayInfo}
							},
							dataType : 'JSON',
							type: 'POST',
							delay : 250,
							cache : true,
							processResults : function(data, params) {
								// parse the results into the format expected by
								// Select2
								// since we are using custom formatting
								// functions we do not need to
								// alter the remote JSON data, except to
								// indicate that infinite
								// scrolling can be used
								return {
									results : data.physicianGroup

								};
							}
						}
					});

			/*
			 * ===========================End of Physician Group loading remotedata=====================================
			 */
			
			/*=====================Ratings DropDown Onchange event===================================*/
			var noOfRatingsFilter = $('#noOfRatingsFilter');
		
			$('div.rcontrol').find('#select2-ratingsFilterVal-container').parent().hide();			
			noOfRatingsFilter.on('change', function(){
				
				if(noOfRatingsFilter.val() === '0')
				{
					$('div.rcontrol').find('#select2-ratingsFilterVal-container').parent().hide();
				}
				else
				{
					$('div.rcontrol').find('#select2-ratingsFilterVal-container').parent().show();
				}
			});
			
			/*=====================End of Ratings DropDown Onchange event===================================*/

			/*
			 * =========================Client onChange event start=======================
			 */
			$('#client').select2();
			$('#client')
					.on(
							'change',
							function(e) {
								var sourceProduct = $('input:radio[name=sourceProduct]:checked').val();
								if ( sourceProduct === undefined )
									sourceProduct = $('input:hidden').filter("[name='sourceProduct']").val();
								$
										.ajax({
											url : SurveyView.base_url
													+ "survey/"+$(this).val()+"/getSourceList/"
													+ sourceProduct,
											type : 'GET',
											dataType : 'text',
											beforeSend : function() {
												Custom.showLoader();
											},
											complete : function() {
												Custom.hideLoader();
											},
											success : function(data,
													textMessage, jqXHR) {
												var obj = jQuery
														.parseJSON(data);

												// Selecting Default option of Physician Group in Physician Group Dropdown.
												// Removing all options related to previous client.
												if(globalDisplayInfo === 'sites')
												{
													selectPhysicianGroupDefaultOptionsByRemovingExisting(locationGroupKey, locationGroupValue);
												}
												else
												{
													selectPhysicianGroupDefaultOptionsByRemovingExisting(physicianGroupKey, physicianGroupValue);
												}
												

												// Closing the Physician Group
												// Tree View Modal popup incase
												// it is opened.
												$('#pgtreeviewdropdown').modal(
														'hide');
												selArray = [];
												selArray[0] = physicianGroupKey;
												
												
												//Calling method for Appealed dropdown related changes.
												sourceDropDownRelatedChanges(obj);
												reviewByDropDownRelatedChanges(obj);
												editedByDropDownRelatedChanges(obj);
												appealedDropDownRelatedChanges(obj);

											},
											error : function(data, textMessage,
													jqXHR) {
												Custom
														.showMessages(
																"error",
																"An error occurred",
																[ "Sorry, there is an error processing your request. Please try again later" ]);
											}
										});

							});
			/*
			 * =========================Client onChange event end=================
			 */

			/* =========================Form Validation starts================= */
			/*$.validator.addMethod('clientValidation', function(value, element) {
				return value != 0;
			})

			$.validator.addMethod('sourceValidation', function(value, element, params) {
				console.log(params);
				return false;
			})

			$.validator.addMethod('physicianGroupValidation', function(value, element) {
				return false;
			}, "Test Message")*/
			
			$.validator.addMethod('dateRangeValidation', function(value,
					element) {
				return value.length > 0;
			}, "Date Range is required")

			/*
			 * $.validator.addMethod("greaterThan", function(value, element,
			 * params) {
			 * 
			 * if (!/Invalid|NaN/.test(new Date(value))) { return new
			 * Date(value) > new Date($(params).val()); }
			 * 
			 * return isNaN(value) && isNaN($(params).val()) || (Number(value) >
			 * Number($(params).val())); },'Must be greater than {0}.')
			 */

			var surveyFormValidator = $('#survey-filter-form')
					.validate(
							{
								errorElement : 'span',
								errorClass : 'help-block',
								onfocusout: function(){								
								},
								groups : {
									names : "start_date end_date"
								},
								rules : {
									client : {
										required : true
									},
									source : {
										required : true
									},
									physicianGroup : {
										required : true
									},
									start_date : {
										date : true,
										require_from_group : {
											params : [ 1, ".send" ],
											depends : function(element) {
												// alert("End Date:
												// "+$('#end_date').val());
												return $('#end_date').val() == "";
											}
										}
									},
									end_date : {
										date : true,
										require_from_group : {
											params : [ 1, ".send" ],
											depends : function(element) {
												// alert("Start Date:
												// "+$('#start_date').val());
												return $('#start_date').val() == "";
											}
										}
									}

								},

								messages : {
									/*client : 'Client is required',*/
									source : 'Source is required',
									start_date : 'Start Date and End Date is required',
									end_date : 'Start Date and End Date is required'
									//physicianGroup: $.validator.messages.required	
								},
								invalidHandler : function(event, validator) {
									$('.alert-danger', $('#survey-filter-form'))
											.show();
								},

								highlight : function(element) { // hightlight
																// error inputs
									$(element).closest('.form-group').addClass(
											'has-error'); // set error class
															// to the control
															// group
								},
								
								success : function(label) {
									label.closest('.form-group').removeClass(
											'has-error');
									label.remove();
									
								},

								errorPlacement : function(error, element) {
									if(element.attr("name") === "source")
									{
										error.insertAfter(element.closest('.select2').next());
									}
									else
									{
										error.insertAfter(element.closest('.input-group'));
									
									}
								},

								submitHandler : function(form) {
									if ($("div.identifydiv").children()
											.hasClass('has-error')) {
										$("div.identifydiv").children()
												.removeClass('has-error');
									}

									return false;

								}
							});
			/* =========================Form Validation ends================= */

			/* ========Loading Datatable onload with default values========== */
			
			displayDataTable();
			
			/* ========End of loading Datatable onload with default values==== */

			/* =========================Datatable display part================= */
			/*
			 * OnClick of the Filter button, initially the form will be
			 * validated. In the validated method we are not submitting the
			 * form.
			 * 
			 * The valid() method need to be called to
			 * check whether form validation has been successfull or not.
			 * 
			 * valid() method returns true on successfull form submission and
			 * false if it is not successfull.
			 * 
			 * So based on the return value of valid() method the datatable will
			 * be displayed.
			 */
			$('#survey_filter').click(function(event) {
				if ($("#survey-filter-form").valid()) {
					displayDataTable();
				}
			});

			$('#survey_filter_back').click(function(event) {
				displayDataTable();
			});

			function displayDataTable() {
				//alert("Entered into display datatable");
				//alert(JSON.stringify($('#survey-filter-form').serializeObject()));
				var phyGrpDataTable = $('.physiciansList')
						.dataTable(

								{
									bAutoWidth : false,

									/* The below parameter is for Pagination. */
									serverSide : true,

									bLengthChange : false,

									/*
									 * To display processing image in the
									 * datatable.
									 */
									bProcessing : false,

									/*
									 * As we are populating the datatable via
									 * Ajax. In such case, to reninitialize the
									 * datatable, already existed table must be
									 * destroyed. Below parameter will destroy
									 * already existed datatable.
									 */
									bDestroy : true,

									/*
									 * Search box for datatable, if set to false
									 * then search box will not be displayed
									 */
									searching : false,

									/* No of records to be displayed at a time. */
									iDisplayLength : 50,

									/*
									 * If there is no data to display in table
									 * then below message will be displayed.
									 */
									language : {
										"emptyTable" : "No records available to display"
									},
									
									sAjaxDataProp: "data.responseData",

									/*
									 * Ajax request to get data, which is to be
									 * displayed in datatable.
									 */
									ajax : {
										url : SurveyView.base_url
												+ "survey/list-ajax",
										type : 'POST',
										dataType : 'json',
										data : {
											data : JSON.stringify($(
													'#survey-filter-form')
													.serializeObject())
										},
										/*
										 * success: function(data, textMessage,
										 * jqXHR) {
										 * alert(data+textMessage+jqXHR); },
										 */
										beforeSend : function() {
											Custom.showLoader();
										},
										complete : function() {
											Custom.hideLoader();
										},
										error : function() {

											Custom
													.showMessages(
															"error",
															"An error occurred",
															[ "Sorry, there is an error processing your request. Please try again later" ]);
										}
									},

									aoColumns : [ {
										"mData" : "Physician",
										"sClass" : "text-left",
										"orderable" : true
									}, {
										"mData" : "NPI",
										"NPI" : "NPI",
										"orderable" : true
									}, {
										"mData" : "Rating",
										"Rating" : "Rating",
										"sClass" : "text-left",
										"orderable" : true
									}, {
										"mData" : "SurveyCount",
										"SurveyCount" : "Survey",
										"orderable" : true
									}, {
										"mData" : "RatingCount",
										"RatingCount" : "Rating",
										"orderable" : true
									}, {
										"mData" : "TestimonialCount",
										"TestimonialCount" : "Testimonial",
										"orderable" : true
									},
									/*
									 * { "mData" : "WithPHI", "WithPHI" : "PHI",
									 * "orderable": true }, { "mData" :
									 * "WithProfanity", "WithProfanity" :
									 * "Profanity", "orderable": true },
									 */
									{
										"mData" : "Edited",
										"Edited" : "Edited",
										"orderable" : true
									}, {
										"mData" : "Approved",
										"Approved" : "Approved",
										"orderable" : true
									}, {
										"mData" : "Rejected",
										"Rejected" : "Rejected",
										"orderable" : true
									},

									{
										"mData" : "NotReviewed",
										"NotReviewed" : "NotReviewed",
										"orderable" : true
									} ],
									"fnPreDrawCallback" : function(settings){
										//The names of First and second column will be changed based on
										//display radio button(Providers/Location).
										settings.aoColumns[0].mData = dataTableFirstColumn;
										settings.aoColumns[1].mData = dataTableSecondColumn;
									},
									"drawCallback": function(settings){
										
										//Getting the value of ShowRatings from ajax data source.
										var ratingsDisplay = false;
										ratingsDisplay = settings.json.data.ShowRatings;
										
										if(ratingsDisplay === false)
										{
											$('table.physiciansList thead').find("tr th").each(function(){
												if($(this).text() === "Rating" || $(this).text() === "Ratings")
												{
													$(this).hide();
												}
											});
											$('table.physiciansList tbody').find("tr td:nth-child(3)").each(function(){$(this).remove()});
											$('table.physiciansList tbody').find("tr td:nth-child(4)").each(function(){$(this).remove()});
										}
										else if(ratingsDisplay === true)
										{
											$('table.physiciansList thead').find("tr th").each(function(){
												if($(this).text() === "Rating" || $(this).text() === "Ratings")
												{
													$(this).show();
												}
											});
										}
										
									}

								});
				
				
			}
			
			
			/*
			 * =========================Datatable display part ends=================
			 */
		}
	}
}();