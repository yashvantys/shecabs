var Reports = function() {
	return {
		home : function() {
			
			
			var physicianGroupKey = "0|All Allowed Providers||Physician Group";
			var physicianGroupValue = "All Allowed Providers";
			
			var locationGroupKey = "0|All Allowed Sites||Locations";
			var locationGroupValue = "All Allowed Sites";
			
			var displayInfo = null;
			
			$.fn.serializeObject = function()
			{
			    var o = {};
			    var a = this.serializeArray();
			    $.each(a, function() {
			        if (o[this.name] !== undefined) {
			            if (!o[this.name].push) {
			                o[this.name] = [o[this.name]];
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
				
				/*===============Calendar to be displayed on textbox when click of Calendar icon=======================*/ 
	  		    $('.input-group').find('.start_date').on('click', function(){
	  		    	$('#start_date').trigger('focus');
	  		    });
	  		    
	  		    $('.input-group').find('.end_date').on('click', function(){
	  		        $('#end_date').trigger('focus');
	  		    });
				$('.input-group').find('.estart_date').on('click', function(){
					$('#estart_date').trigger('focus');
				});
				
				$('.input-group').find('.eend_date').on('click', function(){
					$('#eend_date').trigger('focus');
				});
				$('.input-group').find('.rstart_date').on('click', function(){
					$('#rstart_date').trigger('focus');
				});
				$('.input-group').find('.rend_date').on('click', function(){
					$('#rend_date').trigger('focus');
				});
				$('.input-group').find('.apl_start_date').on('click', function(){
				    $('#apl_start_date').trigger('focus');
				});

				$('.input-group').find('.apl_end_date').on('click', function(){
				    $('#apl_end_date').trigger('focus');
				});
	  		     /*===============Calendar to be displayed on textbox when click of Calendar icon===========*/
				
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
				
	  		  $('#location').select2({
					/*initSelection: function(element, callback) {
						callback({id: 1, text: 'default selection with id 1' });
					},*/
				    minimumInputLength:3,
				    placeholder: 'Select Physician Group',
				    /*placeholder: {
				    	id: "0|All Allowed Physicians||Physician Group",
				    	text: "All Allowed Physicians"
				    },*/
				    multiple: false,
				    allowClear: false,
				    ajax: {
				    	url:  function (params)
				    	{
				    		var clientName = null;
							if($('input:hidden').filter('[name="client"]') && $("#client").val() === undefined)
							{
								clientName = $('input:hidden').filter('[name="client"]').val();
							}
							else
							{
								clientName = $('#client').val();
							}
							
				    		
				    		return SurveyView.base_url+ "survey/"+clientName+"/getPhysicianGroupBasedOnSearchStr/"+params.term;
				    	},
				    	data : function(){
							return {"displayInfo": displayInfo}
						},
				      dataType: 'json',
				      type: 'POST',
				      quietMillis: 250,
				      processResults: function (data, params) {
				          // parse the results into the format expected by Select2
				          // since we are using custom formatting functions we do not need to
				          // alter the remote JSON data, except to indicate that infinite
				          // scrolling can be used
				          return {
				            results: data.physicianGroup
				            
				          };
				      }
				    }
				  });
	  		  /*========================= Date Range Onchange event Start ======*/
	  		  
		  		var start_date = $("#start_date");
				var end_date = $("#end_date");
				var dateRange = $("#date_range");	
				
				
				
				/* On Manual selection of date from Start and End Date calendar.
				 * The value of  Date Range dropdown must be changed to Custom.
				 * */
				start_date.datepicker().on("hide", function(e){
					dateRange.val('custom').trigger("change");
				});
				
				end_date.datepicker().on("hide", function(e){
					dateRange.val('custom').trigger("change");
				});
			  		
	  		  	dateRange.on('change', function(e){
	  			var date_range = dateRange.val();
	  			if(date_range !='custom')
	  			{
	  				$.ajax({
						url:  SurveyView.base_url+ "reports/"+$(this).val()+"/getfilterdates",
						type: 'GET',
						dataType:  'text',
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						success: function(data, textMessage, jqXHR)
						{	
							var obj = jQuery.parseJSON(data);
							/*========Filling the start date and end date Dropdown=======*/
							start_date.datepicker("setDate", new Date(obj.start_date));
							end_date.datepicker("setDate",  new Date(obj.end_date));
							
							/*==============End==========*/
						},
						error: function(data, textMessage, jqXHR)
						{
							Custom
							.showMessages(
									"error",
									"An error occurred",
									[ "Sorry, there is an error processing your request. Please try again later" ]);
						}
	  				});
	  			}
	  			
	  		});
	  			  		
			
	  		  
	  		 /*========================= Date Range Onchange event End ======*/
	  		  
	  		  /*=========================Client onChange event start=================*/	
	  		
				
				$('#client').select2();
	  			$('#client').on('change', function(e){
	  				var sourceProduct = $('input:radio[name=sourceProduct]:checked').val();
					if ( sourceProduct === undefined )
						sourceProduct = $('input:hidden').filter("[name='sourceProduct']").val();
	  				
	  				$.ajax({
						//url:  SurveyView.base_url+ "reports/"+$(this).val()+"/getSourceList",
	  					url : SurveyView.base_url
						+ "survey/"+$(this).val()+"/getSourceList/"
						+ sourceProduct,
						type: 'GET',
						dataType:  'text',
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						success: function(data, textMessage, jqXHR)
						{	
							
							var obj = jQuery.parseJSON(data);
							
														
							if($('input:radio[name=display]:checked').val() === 'sites')
				  			{
								selectPhysicianGroupDefaultOptionsByRemovingExisting(locationGroupKey, locationGroupValue);
				  			}
							else
							{
								selectPhysicianGroupDefaultOptionsByRemovingExisting(physicianGroupKey, physicianGroupValue);
							}
							sourceDropDownRelatedChanges(obj);
							reviewByDropDownRelatedChanges(obj);
							editedByDropDownRelatedChanges(obj);
							appealedDropDownRelatedChanges(obj);
							
													
							/*=========End=========*/
						},
						error: function(data, textMessage, jqXHR)
						{
							Custom
							.showMessages(
									"error",
									"An error occurred",
									[ "Sorry, there is an error processing your request. Please try again later" ]);
						}
					});
					
				});
			/*=========================Client onChange event end=================*/	
	  			
	  			
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
	  			
	  			/*===================Refreshed DropDown OnChange Event starts==================================*/
	  			
	  			$('#published').select2();
	  			$('#published').on('change', function(e){
	  				var selRefreshVal = $(this).val();
	  				var refreshDepDivs = $("div.refreshedDepDiv");
	  				
	  				refreshDepDivs.show();
	  				
	  				if(selRefreshVal === "1")// 1 => Live(Production), 0 => Staging
	  				{
	  					refreshDepDivs.hide();
	  					$('#status').select2();
	  					$("#status.select2").find("option[value='open']").prop('disabled', 'disabled');
	  					hideCommentsPanel('#pendingCommentsPanel', '.pending-list');
	  				}
	  				else if($('#status.select2').find("option[value='open']").attr('disabled'))
	  				{
	  					$('#status').select2();
	  					$("#status.select2").find("option[value='open']").removeAttr('disabled');
	  					showCommentsPanel('#pendingCommentsPanel');
	  					generatePendingCommentsTable();
	  				}
	  				
	  				
	  			});
	  			
	  			/*===================Refreshed DropDown Onchange Event Ends====================================*/
	  			
	  			
	  			/*=============================Source Product Radio Button on Change starts==============================================*/
	  			var sourceProductRadioBtn = $('input:radio[name=sourceProduct]');
	  			
	  			sourceProductRadioBtn.on("change", function(event)
				      	{
							sourceProductLabel = $(this).attr("label");
							sourceProduct = $(this).val();
							
							var srcPrdDepDivs = $('div.srcPrdDepDiv');
							
							srcPrdDepDivs.show();							
							if(sourceProductLabel === "BHA")
							{
								srcPrdDepDivs.hide();
							}
								
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
	  			
	  			/*=============================Source Product Radio Button on Change ends==============================================*/
	  			
	  			
	  			
	  			if($('input:radio[name=display]:checked').val() === 'sites')
	  			{
	  				//Changing the text of Label based on the selection of Display Info.
					$('label[for=location]').html("Site");
	  			}
	  			
	  			$('input:radio[name=display]').on("change", function(event)
				      	{
	  						displayInfo = $('input:radio[name=display]:checked').val();
							if(displayInfo === "sites")
							{
								modificationsRequiredForLocations();
							}
							else
							{
								modificationsRequiredForProviders();
							}
						});
	  			
	  			function modificationsRequiredForLocations()
				{
	  				// Selecting Default option of Physician Group in Physician Group Dropdown.
					// Removing all options related to previous client.
					selectPhysicianGroupDefaultOptionsByRemovingExisting(locationGroupKey, locationGroupValue);
					
					var siteText = "Site";
					var siteIdText = "SiteId";
					
					//Changing the text of Label based on the selection of Display Info.
					$('label[for=location]').html("Sites");
					
					$('table.ratingsTable tr:eq(2) th:eq(0)').text(siteText);
					$('table.ratingsTable tr:eq(2) th:eq(1)').text(siteIdText);
					$('table.ratingsTable tbody').empty();
					
					$('table.approved-list tr:eq(0) th:eq(0)').text(siteText);
					$('table.approved-list tr:eq(0) th:eq(1)').text(siteIdText);
					$('table.approved-list tbody').empty();
					
					$('table.pending-list tr:eq(0) th:eq(0)').text(siteText);
					$('table.pending-list tr:eq(0) th:eq(1)').text(siteIdText);
					$('table.pending-list tbody').empty();
					
					$('table.rejected-list tr:eq(0) th:eq(0)').text(siteText);
					$('table.rejected-list tr:eq(0) th:eq(1)').text(siteIdText);
					$('table.rejected-list tbody').empty();
					
					$('table.appealed-list tr:eq(0) th:eq(0)').text(siteText);
					$('table.appealed-list tr:eq(0) th:eq(1)').text(siteIdText);
					$('table.appealed-listtbody').empty();
					
					//Displaying the report data for selected form value(s).
					generateReportsUI();					
				}
				
				function modificationsRequiredForProviders()
				{
					// Selecting Default option of Physician Group in Physician Group Dropdown.
					// Removing all options related to previous client.
					selectPhysicianGroupDefaultOptionsByRemovingExisting(physicianGroupKey, physicianGroupValue);
					
					var providerText = "Provider";
					var npiText = "NPI";
					
					//Default text of label.
					$('label[for=location]').html("Provider Group");
					
					$('table.ratingsTable tr:eq(2) th:eq(0)').text(providerText);
					$('table.ratingsTable tr:eq(2) th:eq(1)').text(npiText);
					$('table.ratingsTable tbody').empty();
					
					$('table.approved-list tr:eq(0) th:eq(0)').text(providerText);
					$('table.approved-list tr:eq(0) th:eq(1)').text(npiText);
					$('table.approved-list tbody').empty();
					
					$('table.pending-list tr:eq(0) th:eq(0)').text(providerText);
					$('table.pending-list tr:eq(0) th:eq(1)').text(npiText);
					$('table.pending-list tbody').empty();
					
					$('table.rejected-list tr:eq(0) th:eq(0)').text(providerText);
					$('table.rejected-list tr:eq(0) th:eq(1)').text(npiText);
					$('table.rejected-list tbody').empty();
					
					$('table.appealed-list tr:eq(0) th:eq(0)').text(providerText);
					$('table.appealed-list tr:eq(0) th:eq(1)').text(npiText);
					$('table.appealed-list tbody').empty();
					
					//Displaying the report data for selected form value(s).
					generateReportsUI();
				}
				
				
						
				function selectPhysicianGroupDefaultOptionsByRemovingExisting(key, value)
				{
					// Selecting Default option of Physician Group in Physician Group Dropdown.
					// Removing all options related to previous client.
					$("#location option").remove();
					
					// Adding the default option to PhysicianGroup dropdown.
					$('#location').append($(
									'<option>',
									{
										value : key,
										text : value
									}));
					
					// Selecting the default option in Physician Group Dropdown.
					$('#location')
							.val(
									key)
							.trigger("change");
				}
				
				function generateHorChart(dSource)
				{
					$('#alltrailingContainer').insertFusionCharts({
	  					//"type": "mscombi2d",
	  					"type": "msstackedcolumn2dlinedy",
	  			        "renderAt": "alltrailingContainer",
	  			        "width": "100%",
	  			        "height": "500",
	  			        "dataFormat": "json",
	  			        "dataSource":dSource['horizontalChartData']
	  				});
				}
				
				function generateChart(dSource)
  				{
					
	  				$('#surveyCommentsContainer').insertFusionCharts({
	  					"type": "doughnut2D",
	  			        "renderAt": "surveyCommentsContainer",
	  			        "width": "400",
	  			        "height": "400",
	  			        "dataFormat": "json",
	  			        "dataSource":dSource["surveyWithAndWithOutRatings"],
	  			        "events":{
	  		            //Listen to chartrolloverevent to show total revenue text block
		  		            "dataplotrollover" : function(evtObj, argObj){
		  		            	annotations = evtObj && evtObj.sender.annotations;
		  		            	annotations && annotations.update("high-star", {
		  		                    "fillcolor": "#f660c5",
		  		                });
		  		            },
		  		            "dataplotrollout" : function(evtObj, argObj){
		  		            	annotations = evtObj && evtObj.sender.annotations;
		  		            	annotations && annotations.update("high-star", {
		  		                    "fillcolor": "#ffffff",
		  		                });
		  		            }
	  			        }
	  				});
	  				
	  				$('#commentsContainer').insertFusionCharts({
	  					"type": "doughnut2D",
	  			        "renderAt": "commentsContainer",
	  			        "width": "400",
	  			        "height": "400",
	  			        "dataFormat": "json",
	  			        "dataSource":dSource["approvedRejectedAndPendingComments"],
	  			        "events":{
		  		            //Listen to chartrolloverevent to show total revenue text block
			  		            "dataplotrollover" : function(evtObj, argObj){
			  		            	annotations = evtObj && evtObj.sender.annotations;
			  		            	annotations && annotations.update("high-star", {
			  		                    "fillcolor": "#f660c5",
			  		                });
			  		            },
			  		            "dataplotrollout" : function(evtObj, argObj){
			  		            	annotations = evtObj && evtObj.sender.annotations;
			  		            	annotations && annotations.update("high-star", {
			  		                    "fillcolor": "#ffffff",
			  		                });
			  		            }
		  			        }
	  				});
	  				
	  				
	  				
	  				$('#approvedCommentsContainer').insertFusionCharts({
	  					"type": "doughnut2D",
	  			        "renderAt": "approvedCommentsContainer",
	  			        "width": "400",
	  			        "height": "400",
	  			        "dataFormat": "json",
	  			        "dataSource":dSource["editedAndNonEditedApprovedComments"],
	  			      "events":{
		  		            //Listen to chartrolloverevent to show total revenue text block
			  		            "dataplotrollover" : function(evtObj, argObj){
			  		            	annotations = evtObj && evtObj.sender.annotations;
			  		            	annotations && annotations.update("high-star", {
			  		                    "fillcolor": "#f660c5",
			  		                });
			  		            },
			  		            "dataplotrollout" : function(evtObj, argObj){
			  		            	annotations = evtObj && evtObj.sender.annotations;
			  		            	annotations && annotations.update("high-star", {
			  		                    "fillcolor": "#ffffff",
			  		                });
			  		            }
		  			        }    
	  				});
	  				
	  				
	  				$('#appealedCommentsContainer').insertFusionCharts({
	  					"type": "doughnut2D",
	  			        "renderAt": "appealedCommentsContainer",
	  			        "width": "400",
	  			        "height": "400",
	  			        "dataFormat": "json",
	  			        "dataSource":dSource["appealedComments"],
	  			      "events":{
		  		            //Listen to chartrolloverevent to show total revenue text block
			  		            "dataplotrollover" : function(evtObj, argObj){
			  		            	annotations = evtObj && evtObj.sender.annotations;
			  		            	annotations && annotations.update("high-star", {
			  		                    "fillcolor": "#f660c5",
			  		                });
			  		            },
			  		            "dataplotrollout" : function(evtObj, argObj){
			  		            	annotations = evtObj && evtObj.sender.annotations;
			  		            	annotations && annotations.update("high-star", {
			  		                    "fillcolor": "#ffffff",
			  		                });
			  		            }
		  			        }    
	  				});
	  			}
	  			
				$("body").on("click", "#report_filter", function(e){
					
					//Displaying the report data for selected form value(s).
					generateReportsUI();
	  				
	  			});
				
				//Display Report data with default Report Form values.
				//generateReportsUI();
				
				$("body").on("click", "#export_report_filter", function(e){
					
					generateExcelReportInsert();
	  				
	  			});
				
				function generateExcelReportInsert()
	  			{
	  				$.ajax({
						url:  SurveyView.base_url+ "reports/ReportInsertData",
						type: 'POST',
						dataType:  'json',
						data: {
							formData: JSON.stringify($('#report-filter-form').serializeObject())
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						success: function(data)
						{	
							$('#ajaxResults_new').addClass('alert alert-'+data.responseStatus+'').html(data.responseMesage);
							setTimeout(function() {
				      		$('#ajaxResults_new').removeClass('alert alert-'+data.responseStatus+'').html('');
				      		}, 5000);
							
						},
						error: function(data)
						{
							Custom
							.showMessages(
									"error",
									"An error occurred",
									[ "Sorry, there is an error processing your request. Please try again later" ]);
						}
					});
	  			}
				
				function hideCommentsPanel(panelId, dataTableClass)
				{
					$(panelId).hide("slow", function(){
						//Overwriting the existing datatable with empty datatable.
						$(dataTableClass).dataTable({
							data: [],
							bDestroy: true,
						});
					});
				}
				
				function generateAppealCommentsTableBasedOnAppealBy()
				{
					var appealVal = $('#appealby').val();
					
					if(appealVal === "-1")
					{
						hideCommentsPanel('#appealedCommentsPanel', '.appealed-list');
					}
					else
					{
						generateAppealCommentsTable();
					}
				}
								
				
				function showCommentsPanel(panelId)
				{
					$(panelId).show();
				}
				
				function generateReportsUI()
				{
					generateRatingsInfoTable();
					
					var statusVal = $('#status').val();
					var publishedVal = $('#published').val();
					switch(statusVal)
					{
						case 'approved':  	hideCommentsPanel('#pendingCommentsPanel', '.pending-list');
											hideCommentsPanel('#rejectedCommentsPanel', '.rejected-list');
											showCommentsPanel('#approvedCommentsPanel');
											showCommentsPanel('#appealedCommentsPanel');
											generateApprovedCommentsTable();
											generateAppealCommentsTableBasedOnAppealBy();
											break;
						case 'open': 		hideCommentsPanel('#approvedCommentsPanel', '.approved-list');
											hideCommentsPanel('#rejectedCommentsPanel', '.rejected-list');
											hideCommentsPanel('#appealedCommentsPanel', '.appealed-list');
											showCommentsPanel('#pendingCommentsPanel');
											generatePendingCommentsTable();
										
											break;
						case 'rejected':	hideCommentsPanel('#pendingCommentsPanel', '.pending-list');
											hideCommentsPanel('#approvedCommentsPanel', '.approved-list');
											showCommentsPanel('#rejectedCommentsPanel');
											showCommentsPanel('#appealedCommentsPanel');
											generateRejectedCommentsTable();
											generateAppealCommentsTableBasedOnAppealBy();
											break;
						default:			showCommentsPanel('#approvedCommentsPanel');
											showCommentsPanel('#rejectedCommentsPanel');
											showCommentsPanel('#appealedCommentsPanel');
											generateApprovedCommentsTable();
											generateRejectedCommentsTable();
											generateAppealCommentsTableBasedOnAppealBy();
											if(publishedVal == '0')  //Pending Comments panel should be displayed only in Staged Option of Published.
											{
												showCommentsPanel('#pendingCommentsPanel');
												generatePendingCommentsTable();
											}
																						
											break;
					}
				}
	  			
	  			
	  			/*function generateDynamicCharts()
	  			{
	  				$.ajax({
						url:  SurveyView.base_url+ "reports/getCommentsReportChartData",
						type: 'POST',
						dataType:  'text',
						data: {
							formData: JSON.stringify($('#report-filter-form').serializeObject())
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						success: function(data, textMessage, jqXHR)
						{	
							generateChart($.parseJSON(data));	
							
							generateHorChart($.parseJSON(data));
						},
						error: function(data, textMessage, jqXHR)
						{
							Custom
							.showMessages(
									"error",
									"An error occurred",
									[ "Sorry, there is an error processing your request. Please try again later" ]);
						}
					});
	  			}*/
				
				function generateDynamicCharts(data)
	  			{
	  				generateChart(data);	
					generateHorChart(data);
	  			}
	  			
	  			function generateRatingsInfoTable()
	  			{
	  				$('.ratingsTable').dataTable(

							{
								bAutoWidth : false,

								/* The below parameter is for Pagination. */
								serverSide : true,

								bLengthChange : false,
								
								aaSorting : [],  //Temporary fix for allocating sorting for first column in the table.
								
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
								iDisplayLength : 20,
								
								/*
								 * If there is no data to display in table
								 * then below message will be displayed.
								 */
								language : {
									"emptyTable": "No data available to display"
								},
								
								sAjaxDataProp: "data.responseData",

								/*
								 * Ajax request to get data, which is to be
								 * displayed in datatable.
								 */
								ajax : {
									url : SurveyView.base_url
											+ "reports/getRatingsReport",
									type : 'POST',
									dataType : 'json',
									data : {
										formData : JSON.stringify($('#report-filter-form').serializeObject())
									},
									
									 /*success: function(data, textMessage,
									 jqXHR) {
									 alert(data+textMessage+jqXHR); },
									*/
									beforeSend : function() {
										Custom.showLoaderCustomize(".ratingsTableDiv");
									},
									complete : function() {
										Custom.hideLoader(".ratingsTableDiv");
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
									"mData" : "physician",
									"Physician" : "physician",
									"sClass" : "text-left",
									"orderable" : false
									
								}, {
									"mData" : "npi",
									"sClass" : "text-left",
									"orderable" : false
									
								}, {
									"mData" : "overallrating",
									"Overall Rating" : "overallrating",
									"orderable" : false,
									"sClass" : "text-center"
								}, {
									"mData" : "totalSuveryCount",
									"sClass" : "text-left",
									"orderable" : false
									
								}, {
									"mData" : "rating",
									"Rating" : "rating",
									"sClass" : "text-left",
									"orderable" : false
								}, {
									"mData" : "norating",
									"NoRating" : "norating",
									"orderable" : false
								}, {
									"mData" : "totalCommentsCount",
									"sClass" : "text-left",
									"orderable" : false
									
								}, {
									"mData" : "approved",
									"Approved" : "approved",
									"orderable" : false
								}, {
									"mData" : "rejected",
									"Rejected" : "rejected",
									"orderable" : false
								},
								{
									"mData" : "pending",
									"Pending" : "pending",
									"orderable" : false
								}, {
									"mData" : "edited",
									"Edited" : "edited",
									"orderable" : false
								}, {
									"mData" : "notedited",
									"Not Edited" : "notedited",
									"orderable" : false
								}, {
									"mData" : "totalAppealsCount",
									"orderable" : false
								}, {
									"mData" : "approvedAppealCount",
									"orderable" : false
								}, {
									"mData" : "rejectedAppealCount",
									"orderable" : false
								}, {
									"mData" : "pendingAppealCount",
									"orderable" : false
								}
								
								],
								"drawCallback": function(settings){
									//Display "All Provdiers/Sites:  total in Ratings Report table header."
									//$('#providersTotal').html(settings.json.providersTotal);
									
									generateDynamicCharts(settings.json.data.chartData);
									
									//Getting the value of ShowRatings from ajax data source.
									var ratingsDisplay = false;
									var responseData = [];
									ratingsDisplay = settings.json.data.ShowRatings;
									responseData = settings.json.data.responseData;
									
									if(ratingsDisplay === false)
									{
										
										$('table.ratingsTable thead').find(" tr th.toggleRatingParentHeader").hide();
										$('table.ratingsTable thead').find("tr th.toggleRatingHeader").each(function(){
											$('table.ratingsTable tbody').find('td:nth-child('+($(this).index() + 1)+')').remove();
											$(this).hide();
										});
																				
									}
									else if(ratingsDisplay === true)
									{
										$('table.ratingsTable thead').find("tr th.toggleRatingParentHeader").show();
										$('table.ratingsTable thead').find("tr th.toggleRatingHeader").show();
										
									}
									
								}

							});
	  			}
	  			
	  			function generateApprovedCommentsTable()
	  			{
	  				$('.approved-list').dataTable(
							{
												serverSide : true,
												bLengthChange : false,
												bAutoWidth : false,
												bProcessing : false,
												searching: false,
												bDestroy: true,
												iDisplayLength : 20,
												aaSorting : [],
												"language": {
													"emptyTable": "No data available to display",
												      "loadingRecords": "Loading..."
												    },
												sAjaxDataProp:  "data.responseData",
												ajax : {
													url : SurveyView.base_url
															+ "reports/approved/commentsList", 
													type : 'POST',
												dataType : 'json',
												data: {
													physicianFilter:  JSON.stringify($('#report-filter-form').serializeObject())
												},
												
												beforeSend: function(){
													Custom.showLoaderCustomize(".approvedCommentsDiv");
												},
												complete: function(){
													Custom.hideLoader(".approvedCommentsDiv");
												},
												error : function() {
													Custom
															.showMessages(
																	"error",
																	"An error occurred",
																	[ "Sorry, there is an error processing your request. Please try again later" ]);
												}
											},
										       "rowCallback": function( row, data, index ) {
										        var ddoc = data.document_id;
										        var docG = data.documentGroup;
										                 if(docG == 0){
										                     $(row).removeClass('myodd myeven');
										                     $(row).addClass('myodd');
										                 }else if(docG == 1){
										                     $(row).removeClass('myodd myeven');
										                      $(row).addClass('myeven');
										                 }
										               },
											aoColumns : [
															{
																"mData" : "physician",
																"physician" : "Physician",
																// "sWidth": "25%",
																 "orderable": false
															},{
																"mData" : "npi",
																// "sWidth": "25%",
																 "orderable": false
															},
												            {
												             "mData" : "response",
												             "sClass" : "content-top-new",
												             "mRender" : function(data, type, full) {
												            	 
												            	 	var html = ''+data;
																	return html;
																},
																//"sWidth" : "35%",
																 "orderable": false
												            },
												            {
																"mData" : "overallrating",
																"Overall Rating" : "overallrating",
																//"sWidth": "19%",
																"orderable" : false,
																"sClass" : "text-center"
															},
												            {
													             "mData" : "surveyDate",
													             "Date" : "Date",
													             "mRender" : function(data, type, full) {
															          var html = '<table><tr><td style="border: 0px solid #eff3f8;padding-top:0px" align="top">'+full.surveyDate+'</td></tr></table>'; 
														              return html;
														             },
														         //"sWidth": "14%",
														         "sClass" : "content-top-new",
													             "orderable": false
													        },
													        {
													             "mData" : "lastApprovalTime",
													             "Date" : "Date",
													             "sWidth": "14%",
													             "orderable": false
													        },
													        {
													             "mData" : "lastRefreshedTime",
													             "Date" : "Date",
													             "sWidth": "14%",
													             "orderable": false
													        }
														 ],
															"fnDrawCallback": function(settings){
																
																//Getting the value of ShowRatings from ajax data source.
																var ratingsDisplay = false;
																var responseData = [];
																var commentsModifiedTime = false;
																
																ratingsDisplay = settings.json.data.ShowRatings;
																responseData = settings.json.data.responseData;
																commentsModifiedTime = settings.json.data.showCmtsModTime;
																
																$('table.approved-list thead').find("tr th").each(function(){
																		if(ratingsDisplay === false && $(this).text() === "Overall Rating")
																		{
																			$('table.approved-list tbody').find('td:nth-child('+($(this).index() + 1)+')').hide();
																			$(this).hide();
																		}
																		if(commentsModifiedTime === false && ($(this).text() === "Last Approval time" || $(this).text() === "Last Published time"))
																		{
																			$('table.approved-list tbody').find('td:nth-child('+($(this).index()+1)+')').hide();
																			$(this).hide();
																		}
																																				
																		if(ratingsDisplay === true)
																		{
																			if($(this).text() === "Overall Rating")
																			{
																				$(this).show();
																			}
																		}
																		if(commentsModifiedTime === true)
																		{
																			if($(this).text() === "Last Approval time" || $(this).text() === "Last Published time")
																			{
																				$(this).show();
																			}
																		}
																});
																
																
															}
										});
	  			}
	  			
	  			function generateRejectedCommentsTable()
	  			{
	  				$('.rejected-list').dataTable(
							{
												serverSide : true,
												bLengthChange : false,
												bAutoWidth : false,
												bProcessing : false,
												searching: false,
												bDestroy: true,
												iDisplayLength : 20,
												aaSorting : [],
												"language": {
													"emptyTable": "No data available to display",
												      "loadingRecords": "Loading..."
												    },
												sAjaxDataProp:  "data.responseData",
												ajax : {
													url : SurveyView.base_url
															+ "reports/rejected/commentsList",
													type : 'POST',
												dataType : 'json',
												data: {
													physicianFilter:  JSON.stringify($('#report-filter-form').serializeObject())
												},
												
												beforeSend: function(){
													Custom.showLoaderCustomize(".rejectedCommentsDiv");
												},
												complete: function(){
													Custom.hideLoader(".rejectedCommentsDiv");
												},
												error : function() {
													Custom
															.showMessages(
																	"error",
																	"An error occurred",
																	[ "Sorry, there is an error processing your request. Please try again later" ]);
												}
											},
										       "rowCallback": function( row, data, index ) {
										        var ddoc = data.document_id;
										        var docG = data.documentGroup;
										                 if(docG == 0){
										                     $(row).removeClass('myodd myeven');
										                     $(row).addClass('myodd');
										                 }else if(docG == 1){
										                     $(row).removeClass('myodd myeven');
										                      $(row).addClass('myeven');
										                 }
										               },
											aoColumns : [
															{
																"mData" : "physician",
																"physician" : "Physician",
																// "sWidth": "25%",
																 "orderable": false
															},{
																"mData" : "npi",
																// "sWidth": "25%",
																 "orderable": false
															},
												            {
												             "mData" : "response",
												             "sClass" : "content-top-new",
												             "mRender" : function(data, type, full) {
												            	 
												            	 	//$('.survey-testimonial').attr('data-qinfo', JSON.stringify(full.questionsInfo));
												            	 	var html = ''+data;
																	return html;
																},
																//"sWidth" : "35%",
																 "orderable": false
												            },
												            {
																"mData" : "overallrating",
																"Overall Rating" : "overallrating",
																//"sWidth": "19%",
																"orderable" : false,
																"sClass" : "text-center"
															},
												            {
													             "mData" : "surveyDate",
													             "Date" : "Date",
													             "mRender" : function(data, type, full) {
															          var html = '<table><tr><td style="border: 0px solid #eff3f8;padding-top:0px" align="top">'+full.surveyDate+'</td></tr></table>'; 
														              return html;
														             },
														        // "sWidth": "14%",
														         "sClass" : "content-top-new",
													             "orderable": false
													        },
													        {
													             "mData" : "lastRejectedTime",
													             "Date" : "Date",
													             "sWidth": "14%",
													             "orderable": false
													        },
													        {
													             "mData" : "lastRefreshedTime",
													             "Date" : "Date",
													             "sWidth": "14%",
													             "orderable": false
													        }
														 ],
															"fnDrawCallback": function(settings){
																var ratingsDisplay = false;
																var responseData = [];
																var commentsModifiedTime = false;
																
																ratingsDisplay = settings.json.data.ShowRatings;
																responseData = settings.json.data.responseData;
																commentsModifiedTime = settings.json.data.showCmtsModTime;
																
																$('table.rejected-list thead').find("tr th").each(function(){
																	if(ratingsDisplay === false && $(this).text() === "Overall Rating")
																	{
																		$('table.rejected-list tbody').find('td:nth-child('+($(this).index() + 1)+')').hide();
																		$(this).hide();
																	}
																	if(commentsModifiedTime === false && ($(this).text() === "Last Rejected time" || $(this).text() === "Last Published time"))
																	{
																		$('table.rejected-list tbody').find('td:nth-child('+($(this).index()+1)+')').hide();
																		$(this).hide();
																	}
																																			
																	if(ratingsDisplay === true)
																	{
																		if($(this).text() === "Overall Rating")
																		{
																			$(this).show();
																		}
																	}
																	if(commentsModifiedTime === true)
																	{
																		if($(this).text() === "Last Rejected time" || $(this).text() === "Last Published time")
																		{
																			$(this).show();
																		}
																	}
																});
															}
										});
	  			}
	  			
	  			function generatePendingCommentsTable()
	  			{
	  				$('.pending-list').dataTable(
							{
												serverSide : true,
												bLengthChange : false,
												bAutoWidth : false,
												bProcessing : false,
												searching: false,
												bDestroy: true,
												iDisplayLength : 20,
												aaSorting : [],
												"language": {
												      "emptyTable": "No data available to display",
												      "loadingRecords": "Loading..."
												    },
												sAjaxDataProp:  "data.responseData",
												ajax : {
													url : SurveyView.base_url
															+ "reports/pending/commentsList",
													type : 'POST',
												dataType : 'json',
												data: {
													physicianFilter:  JSON.stringify($('#report-filter-form').serializeObject())
												},
												
												beforeSend: function(){
													Custom.showLoaderCustomize(".pendingCommentsDiv");
												},
												complete: function(){
													Custom.hideLoader(".pendingCommentsDiv");
												},
												error : function() {
													Custom
															.showMessages(
																	"error",
																	"An error occurred",
																	[ "Sorry, there is an error processing your request. Please try again later" ]);
												}
											},
										       "rowCallback": function( row, data, index ) {
										        var ddoc = data.document_id;
										        var docG = data.documentGroup;
										                 if(docG == 0){
										                     $(row).removeClass('myodd myeven');
										                     $(row).addClass('myodd');
										                 }else if(docG == 1){
										                     $(row).removeClass('myodd myeven');
										                      $(row).addClass('myeven');
										                 }
										               },
											aoColumns : [
															{
																"mData" : "physician",
																"physician" : "Physician",
																// "sWidth": "25%",
																 "orderable": false
															},
															{
																"mData" : "npi",
																// "sWidth": "25%",
																 "orderable": false
															},
												            {
												             "mData" : "response",
												             "sClass" : "content-top-new",
												             "mRender" : function(data, type, full) {
												            	 
												            	 	//$('.survey-testimonial').attr('data-qinfo', JSON.stringify(full.questionsInfo));
												            	 	var html = ''+data;
																	return html;
																},
																//"sWidth" : "35%",
																 "orderable": false
												            },
												            {
																"mData" : "overallrating",
																"Overall Rating" : "overallrating",
																//"sWidth": "19%",
																"orderable" : false,
																"sClass" : "text-center"
															},
												            {
													             "mData" : "surveyDate",
													             "Date" : "Date",
													             "mRender" : function(data, type, full) {
															          var html = '<table><tr><td style="border: 0px solid #eff3f8;padding-top:0px" align="top">'+full.surveyDate+'</td></tr></table>'; 
														              return html;
														             },
														         //"sWidth": "14%",
														         "sClass" : "content-top-new",
													             "orderable": false
													            }
														 ],
															"fnDrawCallback": function(settings){
																var ratingsDisplay = false;
																var responseData = [];
																ratingsDisplay = settings.json.data.ShowRatings;
																responseData = settings.json.data.responseData;
																
																															
																if(ratingsDisplay === false)
																{
																	$('table.pending-list thead').find("tr th").each(function(){
																		if($(this).text() === "Overall Rating")
																		{
																			$('table.pending-list tbody').find('td:nth-child('+($(this).index() + 1)+')').remove();
																			$(this).hide();
																		}
																	});
																																	
																}
																else
																{
																	$('table.pending-list thead').find("tr th").each(function(){
																		if($(this).text() === "Overall Rating")
																		{
																			$(this).show();
																		}
																		
																	});
																}
															}
										});
	  			}
	  			
	  			function generateAppealCommentsTable()
	  			{
	  				$('.appealed-list').dataTable(
							{
												serverSide : true,
												bLengthChange : false,
												bAutoWidth : false,
												bProcessing : false,
												searching: false,
												bDestroy: true,
												iDisplayLength : 20,
												aaSorting : [],
												"language": {
												      "emptyTable": "No data available to display",
												      "loadingRecords": "Loading..."
												    },
												sAjaxDataProp:  "data.responseData",
												ajax : {
													url : SurveyView.base_url
															+ "reports/appealed/commentsList",
													type : 'POST',
												dataType : 'json',
												data: {
													physicianFilter:  JSON.stringify($('#report-filter-form').serializeObject())
												},
												
												beforeSend: function(){
													Custom.showLoaderCustomize(".pendingCommentsDiv");
												},
												complete: function(){
													Custom.hideLoader(".pendingCommentsDiv");
												},
												error : function() {
													Custom
															.showMessages(
																	"error",
																	"An error occurred",
																	[ "Sorry, there is an error processing your request. Please try again later" ]);
												}
											},
										       "rowCallback": function( row, data, index ) {
										        var ddoc = data.document_id;
										        var docG = data.documentGroup;
										                 if(docG == 0){
										                     $(row).removeClass('myodd myeven');
										                     $(row).addClass('myodd');
										                 }else if(docG == 1){
										                     $(row).removeClass('myodd myeven');
										                      $(row).addClass('myeven');
										                 }
										               },
											aoColumns : [
															{
																"mData" : "physician",
																"physician" : "Physician",
																// "sWidth": "25%",
																 "orderable": false
															},
															{
																"mData" : "npi",
																// "sWidth": "25%",
																 "orderable": false
															},
												            {
												             "mData" : "response",
												             "sClass" : "content-top-new",
												             "mRender" : function(data, type, full) {
												            	 
												            	 	//$('.survey-testimonial').attr('data-qinfo', JSON.stringify(full.questionsInfo));
												            	 	var html = ''+data;
																	return html;
																},
																//"sWidth" : "35%",
																 "orderable": false
												            },
												            {
																"mData" : "overallrating",
																"Overall Rating" : "overallrating",
																//"sWidth": "19%",
																"orderable" : false,
																"sClass" : "text-center"
															},
												            {
													             "mData" : "surveyDate",
													             "Date" : "Date",
													             "mRender" : function(data, type, full) {
															          var html = '<table><tr><td style="border: 0px solid #eff3f8;padding-top:0px" align="top">'+full.surveyDate+'</td></tr></table>'; 
														              return html;
														             },
														         //"sWidth": "14%",
														         "sClass" : "content-top-new",
													             "orderable": false
													        },
													        {
													             "mData" : "appealedTime",
													             "Date" : "Date",
													             "sClass" : "content-top-new",
													             "orderable": false
													        },
													        {
													             "mData" : "appealedStatus",
													              //"sWidth": "14%",
														         "sClass" : "content-top-new",
													             "orderable": false
													            }
													        
															
														 ],
															"fnDrawCallback": function(settings){
																var ratingsDisplay = false;
																var responseData = [];
																ratingsDisplay = settings.json.data.ShowRatings;
																responseData = settings.json.data.responseData;
																
																															
																if(ratingsDisplay === false)
																{
																	$('table.appealed-list thead').find("tr th").each(function(){
																		if($(this).text() === "Overall Rating")
																		{
																			$('table.appealed-list tbody').find('td:nth-child('+($(this).index() + 1)+')').remove();
																			$(this).hide();
																		}
																	});
																																		
																}
																else
																{
																	$('table.appealed-list thead').find("tr th").each(function(){
																		if($(this).text() === "Overall Rating")
																		{
																			$(this).show();
																		}
																		
																	});
																}
															}
										});
	  			}
	  			
	  				  			
		}
					
		}
}();
