var pathVariable = SurveyView.base_url + "datafeed";
function Datafeedscrollhidden()
{
	$('body').css('overflow','hidden');
	$('body').css('position','fixed');
}

function Datafeedscrollshow()
{
	$('body').css('overflow-y','scroll');
	$('body').css('position','relative');
}


function AddDatafeedPopup()
{
  var url;
  //client_id =  $('[name="client_id"]').val();
 
  $('#Datafeedpopup').modal('show'); 
   
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
  
     url = SurveyView.base_url + "datafeed/adddatafeed";
     
     // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#adddatafeed-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
			$('#showdatafeed').html(data.adddatafeed);
			Datafeedscrollhidden();
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
  
}


function AddDatafeedftpPopup()
{
  var url;
  //client_id =  $('[name="client_id"]').val();
 
  $('#Datafeedftppopup').modal('show'); 
   
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#error-feedftp').removeClass('alert alert-error').html('');
  
     url = SurveyView.base_url + "datafeed/adddatafeedftp";
     
     // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#adddatafeedftp-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
			$('#showdatafeedftp').html(data.adddatafeedftp);
			$("#datamodel").select2({});
			$('#datafeedtype').select2({});
			$('#datamodelfile').select2({});
			
			Datafeedscrollhidden();
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
  
}

function AddDatafeedfilePopup()
{
  var url;
  //client_id =  $('[name="client_id"]').val();
 
  $('#Datafeedfilepopup').modal('show'); 
   
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
  
     url = SurveyView.base_url + "datafeed/adddatafeedfile";
     
     // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#adddatafeedfile-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
			$('#showdatafeedfile').html(data.adddatafeedfile);
			$("#datamodelfile").select2({});
			Datafeedscrollhidden();
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
  
}
var Datafeed = function() {
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
								displayDataTable();
							
						});
	  		
			function displayDataTable(clientId)
			{
						
			$('.datafeed-list').dataTable(
							
					{
						
								serverSide : true,
								bLengthChange : false,
								bProcessing : false,
								bDestroy: true,
								searching: true,
								aaSorting : [[5, 'desc']],
								iDisplayLength : 50,
								"language": {
								      "emptyTable": "No data available in data feed list"
								    },
								
								ajax : {
									url : SurveyView.base_url
											+ "datafeed/list-ajax",
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
									"mData" : "feedid",
									"sWidth": "20%",
									"orderable": false
								},
								{
									"mData" : "model",
									"sWidth": "20%",
									"orderable": false
								},
								{
									"mData" : "source",
									"sWidth": "10%",
									"orderable": false
								},
								{
									"mData" : "owner",
									"sWidth": "10%",
									"orderable": false,
									 "sClass": "size_class"
								},
								{
									"mData" : "updated",
									"orderable": true,
									"sWidth": "20%",
									"sClass": "size_class"
								
								},
								{
									"mData" : "errors",
									"orderable": false,
									"sWidth": "10%",
									"sClass": "size_class"
								},
								{
									//"mData" : "id",
									"mRender" : function(data, type, full) {
										var html='';
										
										    if(full.feedtype == 1)
												html += '<a title="Edit"  datafeed-id="'+ full.id +'" class="edit-datafeed" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-edit"></i> Edit</a>';
												
												html += '<a title="Delete" datafeed-id="'+ full.id +'"  class="delete-datafeed" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-trash"></i> Delete</a>';
												
										
										return html;
										},
										 "orderable": false,
										 "sWidth": "10%"
									}		
								
								
								]
								
								
							});
			
			}
			
			
			// delete datafeed
			
			$("body").on("click", ".delete-datafeed", function(e){
				//Datafeedscrollhidden();
				var me = $(this);
				var feedId = me.attr("datafeed-id");
				bootbox.confirm("Are you sure to delete this record?", function(result) {
					if(result){
						  var url = pathVariable + "/"+me.attr("datafeed-id")+"/delete/";
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  datafeedId : me.attr("datafeed-id"),
								 
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							    if(json['status'].statusCode == 200) {
							    	 $('#ajaxResults').addClass('alert alert-success').html('Data feed record deleted successfully!') ;
							    	 me.parents("tr").remove();
							    	 setTimeout(function() {
							       			$('#ajaxResults').removeClass('alert alert-success').html('');
							       			}, 2000);
							    	 Datafeedscrollshow();
							    	 var table = $('#datafeed-list').DataTable();
								  		table.ajax.reload(null, false);
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  
							  }
						  });
					}
				});
			});
			
		// edit datafeed
			$("body").on("click", ".edit-datafeed", function(e){
				var me = $(this);
				$('#Datafeedupdate').modal('show'); 
			    Custom.hideMessages();
			    url = SurveyView.base_url + "datafeed/updateftpfeed";
			     
			     // ajax adding data to database
			      $.ajax({
			        url : url,
			        type: "POST",
			        data : {
						  datafeedId : me.attr("datafeed-id"),
						 
					  },
			        dataType: "JSON",
			        success: function(data)
			        {
			        	$('#showupdatedatafeed').html(data.updateftpfeed);
			        	$("#datamodeledit").select2({});
			        	
			        	$('.modal .modal-body').css('overflow', 'hidden');
						
			        	Datafeedscrollhidden();
			        },
			        error: function ()
			        {
			          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
			        }
			    });						
			});
			
			function savedatafeed(){
				
				$('#error-feedftp').removeClass('alert alert-error').html('');
				 url = pathVariable	+ "/savefeedftp";
				 var formData = new FormData($('#adddatafeed-form')[0]);
				// formData.append('file', $('input[type=file]')[0].files[0]);
				 //formData.append('postdata',$('#adddatafeed-form').serialize());
				 
				 $.ajax({
				        url : url,
				        type: "POST",
				        processData: false,
				        contentType: false,
				        data: formData,		        	
				        dataType: "JSON",
				      
				        success: function(data)
				        {
				           // if success close modal and reload ajax table
				           $('#Datafeedftppopup').modal('hide');
				           Datafeedscrollshow();
				           var table = $('#datafeed-list').DataTable();
			               table.ajax.reload(null, false);
				           data.statusText="Data Feed Added successfully";
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
			}
			
			//add datafeed file/ftp
			$("body").on("click", "#datafeed_form", function(e){
				pattern="^.+\.(xlsx|xls|csv)$";
				var url;
		      	Custom.hideMessages();
		      	var alertValidation = "";
		      	
		      	$('#feedname').css('border', '');
		      	$('#datamodel').css('border', '');
		      	$('#serverpath').css('border', '');
		      	$('#filepath').css('border', '');
		      	$('#filenamepattern').css('border', '');
		      	$('#ftpusername').css('border', '');
		      	$('#ftppassword').css('border', '');
		      	var feedtype =  $('input:radio[name=feedtype]:checked').val();
		      	if($('#feedname').val().trim() == '' ||  $('#feedname').val().trim().length == 0){
	      			 $('#error-feedftp').addClass('alert alert-error').html('Feed name is required') ;
		             e.preventDefault(); 
		             $('#feedname').css('border', '1px solid red');
		      	}else if(feedtype == 'undefined' || feedtype =='' || feedtype == null){
		      		$('#error-feedftp').addClass('alert alert-error').html('Select feed type') ;
		      		$('.show_feedtype_msg').addClass('has-error');
					e.preventDefault(); 
		      	}else if(feedtype == 'FTP'){
		      		 $('.show_feedtype_msg').removeClass('has-error');
		      		if ($('#serverpath').val().trim() == '' ||  $('#serverpath').val().trim().length == 0) {
				         $('#error-feedftp').addClass('alert alert-error').html('Server path is required') ;
			             e.preventDefault(); 
			             $('#serverpath').css('border', '1px solid red');
			      	}else if ($('#filepath').val().trim() == '' ||  $('#filepath').val().trim().length == 0) {
				         $('#error-feedftp').addClass('alert alert-error').html('File path is required') ;
			             e.preventDefault(); 
			             $('#filepath').css('border', '1px solid red');
			      	}else if ($('#filenamepattern').val().trim() == '' ||  $('#filenamepattern').val().trim().length == 0) {
				         $('#error-feedftp').addClass('alert alert-error').html('File pattern is required') ;
			             e.preventDefault(); 
			             $('#filenamepattern').css('border', '1px solid red');
			      	}else if ($('#filenamepattern').val().toLowerCase().lastIndexOf(".csv") == -1 &&  $('#filenamepattern').val().toLowerCase().lastIndexOf(".xlsx") == -1 &&  $('#filenamepattern').val().toLowerCase().lastIndexOf(".xls") == -1) {
				         $('#error-feedftp').addClass('alert alert-error').html('File should be in XLSX or CSV format') ;
			             e.preventDefault(); 
			             $('#filenamepattern').css('border', '1px solid red');
			      	}else if ($('#ftpusername').val().trim() == '' &&  $('#ftpusername').val().trim().length == 0) {
				         $('#error-feedftp').addClass('alert alert-error').html('Login name is required') ;
			             e.preventDefault(); 
			             $('#ftpusername').css('border', '1px solid red');
			      	}else if ($('#ftppassword').val().trim() == '' ||  $('#ftppassword').val().trim().length == 0) {
				         $('#error-feedftp').addClass('alert alert-error').html('Password is required') ;
			             e.preventDefault(); 
			             $('#ftppassword').css('border', '1px solid red');
			      	}else{
			      		$('#error-feedftp').removeClass('alert alert-error').html('') ;
			      		savedatafeed();
			      	}
		      	}else if(feedtype == 'File'){
		      		   $('#error-feedftp').removeClass('alert alert-error').html('') ;
		      		    savedatafeed();
		      		
		      	}
		      	
			});
			
			
			function updateDataModelFTPfeed(){
				
				$('#error-feedftp').removeClass('alert alert-error').html('');
				 url = pathVariable	+ "/ftpdatamodelupdate";
				 
				 $.ajax({
				        url : url,
				        type: "POST",
				        data: $('#updatefeedftp-form').serialize(),
				        dataType: "JSON",
				        success: function(data)
				        {
				           // if success close modal and reload ajax table
				           $('#Datafeedupdate').modal('hide');
				           Datafeedscrollshow();
				           var table = $('#datafeed-list').DataTable();
			               table.ajax.reload(null, false);
				           data.statusText="Data Feed FTP updated successfully";
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
			}
			
			// update FTP feed
			$("body").on("click", "#datafeedupdate_form", function(e){
				pattern="^.+\.(xlsx|xls|csv)$";
				var url;
		      	Custom.hideMessages();
		      	var alertValidation = "";
				$('#feednames').css('border', '');
		      	$('#datamodel').css('border', '');
		      	$('#serverpaths').css('border', '');
		      	$('#filepaths').css('border', '');
		      	$('#filenamepatterns').css('border', '');
		      	$('#loginnames').css('border', '');
		      //	$('#password').css('border', '');
		    				
		      	if ($('#feednames').val().trim() == '' ||  $('#feednames').val().trim().length == 0) {
			         $('#error-edit-feed').addClass('alert alert-error').html('Feed name is required') ;
		             e.preventDefault(); 
		             $('#feednames').css('border', '1px solid red');
		      	}else if ($('#serverpaths').val().trim() == '' ||  $('#serverpaths').val().trim().length == 0) {
			         $('#error-edit-feed').addClass('alert alert-error').html('Server path is required') ;
		             e.preventDefault(); 
		             $('#serverpaths').css('border', '1px solid red');
		      	}else if ($('#filepaths').val().trim() == '' ||  $('#filepaths').val().trim().length == 0) {
			         $('#error-edit-feed').addClass('alert alert-error').html('File path is required') ;
		             e.preventDefault(); 
		             $('#filepaths').css('border', '1px solid red');
		      	}else if ($('#filenamepatterns').val().trim() == '' ||  $('#filenamepatterns').val().trim().length == 0) {
			         $('#error-edit-feed').addClass('alert alert-error').html('File pattern is required') ;
		             e.preventDefault(); 
		             $('#filenamepatterns').css('border', '1px solid red');
		      	}else if ($('#filenamepatterns').val().toLowerCase().lastIndexOf(".csv") == -1 &&  $('#filenamepatterns').val().toLowerCase().lastIndexOf(".xlsx") == -1 &&  $('#filenamepattern').val().toLowerCase().lastIndexOf(".xls") == -1) {
			         $('#error-edit-feed').addClass('alert alert-error').html('File should be in XLSX or CSV format') ;
		             e.preventDefault(); 
		             $('#filenamepatterns').css('border', '1px solid red');
		      	}else if ($('#loginnames').val().trim() == '' &&  $('#loginnames').val().trim().length == 0) {
			         $('#error-edit-feed').addClass('alert alert-error').html('Login name is required') ;
		             e.preventDefault(); 
		             $('#loginnames').css('border', '1px solid red');
		      	/*}else if ($('#password').val().trim() == '' ||  $('#password').val().trim().length == 0) {
			         $('#error-edit-feed').addClass('alert alert-error').html('Password is required') ;
		             e.preventDefault(); 
		             $('#password').css('border', '1px solid red');*/
		      	}else{
		      		$('#error-edit-feed').removeClass('alert alert-error').html('') ;
		      		updateDataModelFTPfeed();
		      		
		      	}
				
			});
			
			
		
			$("body").on("click", "#feedtype", function(e){
				var feedtype =  $('input:radio[name=feedtype]:checked').val();
				$('#error-feedftp').removeClass('alert alert-error').html('') ;
				$('#feedname').css('border', '');
				if(feedtype == 'File'){
					 $('#file_form_show').css("display","block");
					 $('#ftp_form_show').css("display","none");
				}
				if(feedtype == 'FTP'){
					 $('#file_form_show').css("display","none");
					 $('#ftp_form_show').css("display","block");
					 
				}	
			});
			
			
	
			$("body").on("click", "#cancel_datafeed,#cancel_editftp,#cancel_updateftp,.close,.btn-default", function(e){
				$('#error-feedftp').removeClass('alert alert-error').html('');
				$('#error-edit-feed').removeClass('alert alert-error').html('');
				
				Datafeedscrollshow();
					
			});
			
		
		},
		
		ftpconfig : function(clientId) {
			
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
				
				$("#clients").select2({
			        allowClear: false,
			        closeOnSelect: true,
				    placeholder: ''
			   });
			
			/*========Loading Datatable onload with default values==========*/
  			displayDataTableftp(clientId);
  			/*========End of loading Datatable onload with default values====*/
  			
           // onchange client
  			
  			$('#clients').change(function( event )
					{
							var clientId = $('#clients').val();
							displayDataTableftp();
						
					});
  			
  		  		
		function displayDataTableftp(clientId)
		{
					
		$('.datafeedftp-list').dataTable(
						
				{
					
							serverSide : true,
							bLengthChange : false,
							bProcessing : false,
							bDestroy: true,
							searching: true,
							aaSorting : [[7, 'desc']],
							iDisplayLength : 100,
							"language": {
							      "emptyTable": "No data available in File List"
							    },
							
							ajax : {
								url : SurveyView.base_url
										+ "datafeed/list-ajaxftp",
								type : 'POST',
								dataType : 'json',
								data: {
									clientId:  clientId
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
								"mData" : "feedid",
								"sWidth": "10%",
								"orderable": true
							},
							{
								"mData" : "fileName",
								"sWidth": "10%",
								"orderable": true
							},
							{
								"mData" : "file",
								"sWidth": "10%",
								"orderable": false
							},
							{
								"mData" : "model",
								"sWidth": "10%",
								"orderable": true
							},
							{
								"mData" : "source",
								"sWidth": "8%",
								"orderable": false
							},
							{
								"mData" : "owner",
								"sWidth": "10%",
								"orderable": false,
								 "sClass": "size_class"
							},
							{
								"mData" : "updated",
								"orderable": false,
								"sWidth": "12%",
								"sClass": "size_class"
							},
							{
								"mData" : "successCount",
								"orderable": false,
								"sWidth": "8%",
								"sClass": "size_class"
							},
							{
								"mData" : "errors",
								"orderable": false,
								"sWidth": "8%",
								"sClass": "size_class"
							},
							{
								"mData" : "status",
								"orderable": true,
								"sWidth": "8%",
								"sClass": "size_class"
							}
							
							/*{
								//"mData" : "id",
								"mRender" : function(data, type, full) {
									var html;
									
											html = '<a title="Edit"  datafeed-id="'+ full.id +'" class="edit-datafeed" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-edit"></i> Edit</a>';
											html += '<a title="Delete" datafeed-id="'+ full.id +'"  class="delete-datafeed" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-trash"></i> Delete</a>';
											
									
									return html;
									},
									 "orderable": false,
									 "sWidth": "10%"
								}*/		
							
							
							]
							
							
						});
		
		}
		}
			
					
		}
}();



