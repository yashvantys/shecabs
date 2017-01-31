var pathVariable = SurveyView.base_url + "datamodel";
function Datamodelscrollhidden()
{
	$('body').css('overflow','hidden');
	$('body').css('position','fixed');
}

function Datamodelscrollshow()
{
	$('body').css('overflow-y','scroll');
	$('body').css('position','relative');
}

function AddDatamodelPopup(clientId)
{
	  var url;
	  var clientId = clientId;//$('#clients').val();
	 
	  Custom.hideMessages();
	  $('#survey').css('border', '');
	  $('#type').css('border', '');
	  $('#ajaxResults').removeClass('alert alert-error').html('');
	  $('#modelvalerror').removeClass('alert alert-error').html('');
	  $('.clients_cls').css('color', '');
	 
	 /* if(clientId == '0'){
		  $('.clients_cls').css('color', '#ff0000');
		  $('#ajaxResults').addClass('alert alert-error').html('Please select client') ;
	  }else{*/
		  $('#Datamodelpopup').modal('show'); 
		   url = SurveyView.base_url + "datamodel/"+ clientId +"/adddatamodel";
	     
		     // ajax adding data to database
			      $.ajax({
			        url : url,
			        type: "POST",
			        data: {
			        	ClientId: clientId
			        },
			        dataType: "JSON",
			        success: function(data)
			        {
			        	$('#showdatamodel').html(data.adddatamodel);
			        	
			        	//$('#thirdselectdatamodel').css('display','none');
			        	$('.modal .modal-body').css('overflow', 'hidden');
						$('#page1_previous').css('display','none');
						$('#sheet_selection').css('display','none');
						$('#page1_previous').css('display','none');
						Datamodelscrollhidden();
			        },
			        error: function ()
			        {
			          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
			        }
			    });
		 // } 
  
}

var Datamodel = function() {
	return {
		home : function(clientId) {
			
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
				
				$("#status").select2({
			        allowClear: true,
			        closeOnSelect: true,
				    placeholder: ''
			   });
				
				$("#modifiedtime").select2({
			        allowClear: false,
			        closeOnSelect: true,
				    placeholder: ''
			   });
				
				$("#clients").select2({
			        allowClear: false,
			        closeOnSelect: true,
				    placeholder: ''
			   });
				
								
			
				/*========Loading Datatable onload with default values==========*/
	  			displayDataTable(clientId);
	  			/*========End of loading Datatable onload with default values====*/
	  		
            // onchange client
	  			
	  			$('#clients').change(function( event )
						{
								var clientId = $('#clients').val();
								 $('.clients_cls').css('color', '');
								$('#ajaxResults').removeClass('alert alert-error').html('');
								displayDataTable();
							
						});
	  		
			function displayDataTable(clientId)
			{
						
			$('.datamodel-list').dataTable(
							
					{
						
								serverSide : false,
								bLengthChange : false,
								bProcessing : false,
								bDestroy: true,
								searching: true,
								iDisplayLength : 100,
								"language": {
								      "emptyTable": "No data available in datamodel"
								    },
								
								ajax : {
									url : SurveyView.base_url
											+ "datamodel/list-ajax",
									type : 'POST',
									dataType : 'json',
									data: {
									      ClientId:  clientId
									  },
									beforeSend: function(){
								           Custom.showLoader();
								          },
								          complete: function(){
								           Custom.hideLoader();
								          },
									error : function() {
										Custom.showMessages(
														"error",
														"An error occurred",
														[ "Sorry, there is an error processing your request. Please try again later" ]);
									}
								},
								
								aoColumns : [
																
								{
									"mData" : "name",
									"sWidth": "20%",
									"orderable": true
								},
																
								{
									"mData" : "description",
									"sWidth": "25%",
									"orderable": false
								},
								{
									"mData" : "sheetName",
									"sWidth": "10%",
									"orderable": true
								},
								/*{
									"mData" : "clientName",
									"sWidth": "10%",
									"orderable": true
								},*/
								{
									"mData" : "owner",
									"sWidth": "10%",
									"orderable": false,
									 "sClass": "size_class"
								},
								
								{
									"mData" : "modified",
									"orderable": true,
									"sWidth": "15%",
									"sClass": "size_class"
								},
								{
									//"mData" : "id",
									"mRender" : function(data, type, full) {
										var html='';
										
												//html = '<a title="Edit"  datamodel-id="'+ full.id +'" class="edit-datamodel" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-edit"></i> Edit</a>';
												html += '<a title="Delete" datamodel-id="'+ full.id +'"  class="delete-datamodel" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-trash"></i> Delete</a>';
												
										
										return html;
										},
										 "orderable": false,
										 "sWidth": "10%"
									}						
								
								
								]
								
								
							});
			
			}
			
			$("body").on("click", "#next_select", function(e)
			{

				 var modelname = $('[name="name"]').val().trim();
				 var modeldescription = $('[name="description"]').val().trim();
				 var modelfileupload = $('[name="file_upload"]').val().trim();
				 $('#file_upload').css('border', '');
				 $('#modelvalerror').removeClass('alert alert-error').html('');
				 
				  if($('#name').val() =='')
				  {
				  	   $('#modelvalerror').addClass('alert alert-error').html('Please enter model name') ;
						return false;
				  }	
				  
				  else if($('#description').val() ==''){
					  $('#modelvalerror').addClass('alert alert-error').html('Please enter model description') ;
						return false;
				  }
				  else if($('#file_upload').val() ==''){
					  $('#modelvalerror').addClass('alert alert-error').html('Please select file') ;
			             e.preventDefault(); 
			             $('#file_upload').css('border', '1px solid red');
				  }else if ($('#file_upload').val().toLowerCase().lastIndexOf(".csv") == -1 &&  $('#file_upload').val().toLowerCase().lastIndexOf(".xlsx") == -1 &&  $('#file_upload').val().toLowerCase().lastIndexOf(".xls") == -1) {
				         $('#modelvalerror').addClass('alert alert-error').html('File should be in XLSX or CSV format') ;
			             e.preventDefault(); 
			             $('#file_upload').css('border', '1px solid red');
				  }else if($('#name').val() !='')
				  {	
					  
					  $.ajax ( {
						url : SurveyView.base_url
							+ "datamodel/checkModelExists",
						type : 'POST',
						dataType : 'text',
						data: {
						      ClientId:  clientId,
						      dataModelName : $('#name').val()
						},
						success: function(data) {
							if(data) {
								$('#modelvalerror').addClass('alert alert-error').html('The name already exists, enter different name') ;
								return false;
							} else {
								$('#modelvalerror').removeClass('alert alert-error').html('');
								$('#form_names').css('display','none');
								$('#sheet_selection').css('display','block');
								//$('#page1_cancel').css('display','none');
								//$('#page1_previous').css('display','none');
								//$('#secondDatamodelpopup').modal('show'); 
								$('.modal .modal-body').css('max-height', '200px');
								$('.modal .modal-body').css('overflow', 'hidden');
								//url = SurveyView.base_url + "datamodel/select-sheet/1/sheet";
								var formData = new FormData($('#adddatamodel-form')[0]);
								url = SurveyView.base_url + "datamodel/sheetselection";
								
							     
							     // ajax adding data to database
							      $.ajax({
							        url : url,
							        type: "POST",
							        processData: false,
							        contentType: false,
							        data: formData,		        	
							        dataType: "JSON",
							        success: function(data)
							        {
							        	$('#secondselectdatamodel').html(data.select_sheet_form);
							        	$('#secondselectdatamodel').css('display','block');
							        	 $("#chk_sheet_0").attr("checked", true);
					             		 //$("#chk_sheet_0" > span").addClass ( 'checked' );
							        	
							        	
							        	$('#ackrejclose').css('display','none');
										$('#page1_previous').css('display','block');
										$('#form_names').css('display','none');
										$('.page1_buttons').css('display','none');
										Datamodelscrollhidden();
										
										setTimeout(function() {
							       			$('#ajaxResults').removeClass('alert alert-success').html('');
							       			}, 2000);
							        },
							        error: function ()
							        {
							          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
							        }
							    });
							}
								
						},
						error: function ()
				        {
				          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				        }
						
					  });
				  }		
				});
					
					$("body").on("click", "#page1_previous", function(e)
					{
						$('.modal .modal-body').css('max-height', '500px');
						$('.modal .modal-body').css('overflow', 'hidden');
						$('#ackrejclose').css('display','block');
						$('#secondDatamodelpopup').modal('hide');
						$('#form_names').css('display','block');
						
						$('#select-sheet-form').css('display','none');
						
						$('.page1_buttons').css('display','block');
						
						
						return false;
					});
					
					
					
					$("body").on("click", "#next1_select", function(e)
					{
						/*$('#form_names').css('display','none');*/
						$('#sheet_selection').css('display','none');
						$('#next1_select').css('display','none');
						$('#page1_previous').css('display','none');
						$('#secondselectdatamodel').css('display','none'); 
						$('#ackrejclose').css('display','block');
						$('.modal .modal-body').css('max-height', '900px');
						var formData = new FormData($('#select-sheet-form')[0]);
						
						//url = SurveyView.base_url + "datamodel/map-columns/2/5";
						url = SurveyView.base_url + "datamodel/mapheadercolumns";
					     
					     // ajax adding data to database
					      $.ajax({
					        url : url,
					        type: "POST",
					        processData: false,
					        contentType: false,
					        data: formData,		        	
					        dataType: "JSON",
					       
					        success: function(data)
					        {
					        	//alert(data.select_column_form);
					        	 
					        	$('#thirdselectdatamodel').html(data.select_column_form);
					        	$('#thirdselectdatamodel').css('display','block');
					        	$('#column_clientid').select2({});
								$('#column_clientname').select2({});
								$('#column_patientlastname').select2({});
								$('#column_email').select2({});
								$('#column_firstname').select2({});
								$('#column_middlename').select2({});
								$('#column_lastname').select2({});
								$('#column_name').select2({});
								$('#column_npi').select2({});
								$('#column_gender').select2({});
								$('#column_phone').select2({});
								$('#column_serviceline').select2({});
								$('#column_physician').select2({});
								$('#column_medicalrecordno').select2({});
								$('#column_visitdate').select2({});
								$('#column_location').select2({});
								$('#column_age').select2({});
								$('#column_race').select2({});
								$('#column_person').select2({});
								$('#column_lastsurveysendtime').select2({});
								 $("#header-record").attr("checked", true);
								 $("#header-record").attr("disabled", true);
								 
								
								Datamodelscrollhidden();
					        },
					        error: function ()
					        {
					          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
					        }
					    });
						
						
					});
					
					// save data model mapping
					$("body").on("click","#save_headers",function(e)
						{	
						url = SurveyView.base_url + "datamodel/savemapping";
							 
						 $.ajax({
						        url : url,
						        type: "POST",
						        data: $('#select-column-form').serialize(),
						        dataType: "JSON",
						        success: function(data)
						        {
						        	$('#Datamodelpopup').modal('hide');
						        	 Datamodelscrollshow();
							           var table = $('.datamodel-list').DataTable();
						               table.ajax.reload(null, false);
							           data.statusText="Data Model created successfully";
							          // $('#error-edit-feed').removeClass('alert alert-success').html('');
							           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
							           setTimeout(function() {
							       			$('#ajaxResults').removeClass('alert alert-success').html('');
							       			
							       			}, 2000);
						        },
						        error: function ()
						        {
						          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
						        }
						    });
					
					   });
					
					
					// previous sheet selection page
					$("body").on("click", "#page2_previous", function(e)
							{
						$('#sheet_selection').css('display','block');
						//$('#page1_cancel').css('display','none');
						//$('#page1_previous').css('display','none');
						//$('#secondDatamodelpopup').modal('show'); 
						$('.modal .modal-body').css('max-height', '200px');
						$('.modal .modal-body').css('overflow', 'hidden');
						//url = SurveyView.base_url + "datamodel/select-sheet/1/sheet";
						var formData = new FormData($('#select-column-form')[0]);
						url = SurveyView.base_url + "datamodel/sheetselection";
						
					     
					     // ajax adding data to database
					      $.ajax({
					        url : url,
					        type: "POST",
					        processData: false,
					        contentType: false,
					        data: formData,		        	
					        dataType: "JSON",
					        success: function(data)
					        {
					        	$('#secondselectdatamodel').html(data.select_sheet_form);
					        	
					        	 $("#chk_sheet_0").attr("checked", true);
					        	 $('#secondselectdatamodel').css('display','block');
					        	 $('#thirdselectdatamodel').css('display','none');
					        	 
					        	
					        	$('#ackrejclose').css('display','none');
								$('#page1_previous').css('display','block');
								$('#form_names').css('display','none');
								$('.page1_buttons').css('display','none');
								Datamodelscrollhidden();
								
								setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-success').html('');
					       			}, 2000);
					        },
					        error: function ()
					        {
					          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
					        }
					    });
						
			   	
						
							});
					
					
					
					// delete datamodel
					
					$("body").on("click", ".delete-datamodel", function(e){
						Datamodelscrollhidden();
						var me = $(this);
						var modelId = me.attr("datamodel-id");
						bootbox.confirm("Are you sure to delete this record?", function(result) {
							if(result){
								  var url = pathVariable + "/"+me.attr("datamodel-id")+"/delete/";
								  $.ajax({
									  url : url,
									  type : "POST",
									  data : {
										  datamodelId : me.attr("datamodel-id"),
										 
									  },
									  beforeSend: function(){
											Custom.showLoader();
										},
										complete: function(){
											Custom.hideLoader();
										},
								  }).done(function(message){
									      if( message == '') {
									    	  $('#ajaxResults').addClass('alert alert-success').html('Data model record deleted successfully!') ;
									    	  me.parents("tr").remove();
										      setTimeout(function() {
										       			$('#ajaxResults').removeClass('alert alert-success').html('');
										       			}, 2000);
									       } else {
									    		 $('#ajaxResults').addClass('alert alert-error').html('This model associated with the feeds '+message+
									    				 '. Please delete that before deleting this data model.');
									       }	 
										     Datamodelscrollshow();
										     var table = $('#datamodel-list').DataTable();
											  		table.ajax.reload(null, false);
								  });
							}
						});
					});
					
				// edit datamodel
					$("body").on("click", ".edit-datamodel", function(e){
						var me = $(this);
						$('#Datamodelpopup').modal('show'); 
						  
						   
					    Custom.hideMessages();
					    $('#survey').css('border', '');
					    $('#type').css('border', '');
					    $('#reason_error').removeClass('alert alert-error').html('');
					  
					     url = SurveyView.base_url + "datamodel/adddatamodel";
					     
					     // ajax adding data to database
					      $.ajax({
					        url : url,
					        type: "POST",
					        data : {
								  datamodelId : me.attr("datamodel-id"),
								 
							  },
					        dataType: "JSON",
					        success: function(data)
					        {
					        	$('#showdatamodel').html(data.adddatamodel);
					        	$('.modal .modal-body').css('overflow', 'hidden');
								$('#page1_previous').css('display','none');
								$('#sheet_selection').css('display','none');
								$('#page1_previous').css('display','none');
								Datamodelscrollhidden();
					        },
					        error: function ()
					        {
					          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
					        }
					    });						
					});
					
			
					$("body").on("click", "#page1_cancel,.close,.btn-default", function(e){
						Datamodelscrollshow();
						$('#thirdselectdatamodel').html('');
							
					});
		}
					
		}
}();