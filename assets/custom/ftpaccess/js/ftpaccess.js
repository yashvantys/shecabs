var pathVariable = SurveyView.base_url + "client";

function checkEmail(email) {
	var regExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	
    return regExp.test(email);
}


function datepick(product){
	
	$('.input-group').find('.start_date_'+product).on('click', function() {
		$('#start_date_'+product).trigger('focus');
	});
	 $('#start_date_'+product).datepicker({
         format: "mm/dd/yy"
     });  
}

function changerefresh(product){
	var date = new Date();
	var datestring = ("0" + (date.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + date.getDate().toString()).substr(-2)  + "/" + (date.getFullYear().toString()).substr(2);
	var displayInfo = null;
	displayInfo = $('input:radio[name=chk_refresh_'+product+']:checked').val();
	if(displayInfo == 5)
	{
		$('.show_start_date_'+product).css('display','block');
		$('.show_reference_recurrence_'+product).css('display','block');
		$('#start_date_'+product).datepicker({
	         format: "mm/dd/yy"
	     });
	}
	else
	{
		$('#start_date_'+product).val(datestring).trigger("change");
		$('input:radio[name=chk_intervals_'+product+']').attr("checked", false);
		$('.show_start_date_'+product).css('display','none');
		$('.show_reference_recurrence_'+product).css('display','none');
		$('#start_date_'+product).datepicker({
	         format: "mm/dd/yy"
	     });
			
	}
	
}

function send_reglink(links,clientId,vendor){
		
	//$('#signupurl_form-form')[0].reset(); // reset form on modals
	$( "#errorregister" ).removeClass( 'alert alert-error' ).html('');
	$('#signupurl_form').modal('show'); // show bootstrap modal
	$('.modal-title').html('<b>Generate Link</b>'); // Set Title to Bootstrap modal title
	
	var eurl = pathVariable+"/sendreglink";
	 
	 $.ajax({
		  url : eurl,
		  type : "POST",
		  datatype : "json",
		  beforeSend: function(){
				Custom.showLoaderCustomize(".defaultprogress");
				
			},
			complete: function(){
				Custom.hideLoader(".defaultprogress");
			},
		  data : 
		  {
			  pararms : links,
			  clientId : clientId,
			  vendor : vendor
			  			  
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#showregform').html(data.regform);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
}

function manual_refresh(id){
	//$('#manualrefresh_form')[0].reset(); // reset form on modals
	$('#manualrefresh_form').modal('show'); // show bootstrap modal
	//$('.modal-title').text('Manual Refresh for BSR'); // Set Title to Bootstrap modal title
	
	var eurl = pathVariable+"/manualrefresh";
	 
	 $.ajax({
		  url : eurl,
		  type : "POST",
		  datatype : "json",
		  data : 
		  {
			  clientsourceid : id
			  			  
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#manualrefreshform').html(data.manualrefreshform);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
	
}


function addapplication(id){
	var link_second = $('[name="application_link"]').val();//$('#application_link').val();
	var link_first = $('[name="application_link_old"]').val();//$('#application_link_old').val();
	var link_third = $('[name="application_link_nextgen"]').val();//$('#application_link').val();
	
	
	
	if(id == 2){
		$('#links').val();
		$('[name="links"]').val(link_second)
	}else if(id == 3){
		$('#links').val();
		$('[name="links"]').val(link_third)
	}else{
		
		$('#links').val();
		$('[name="links"]').val(link_first)
		
	}
}



function view_clientsource(id,clientid,vendorType,clients,clientval)
{
	
      $.ajax({
          url : pathVariable+ "/ajax-view/"+ id,
          type: "POST",
          data : 
		  {
        	  clientid : clientid,
        	  clientval: clientval
        	 				  
		  },
          dataType: "JSON",
          success: function(data)
          {
        	    
        	  $('#clientview').html(data.clientview);
        	  $('.ftp_title').show('');
        	                  
              $('#modalview_form').modal('show'); // show bootstrap modal when complete loaded
              $('.modal-title').html('<b>View Client Config</b>'); // Set title to Bootstrap modal title
              Testinomialscrollhidden();
             
              
          },
          error: function ()
          {
        	  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
          }
      });
	
}

function manage_config(clientsourceId){
	$( "#error-bubble" ).removeClass( 'alert alert-error' ).html('');
	$( "#ajaxResults" ).removeClass( 'alert alert-success' ).html('');
	$('#managerefresh_form').modal('show'); // show bootstrap modal
	$('.modal-title').text('Manage Publishing'); 
	   $("#manageconfig-form").reset();
      $.ajax({
          url : pathVariable+ "/manageconfig/",
          type: "POST",
          data : 
		  {
        	 clientsourceId : clientsourceId
        	         	 				  
		  },
          dataType: "JSON",
          beforeSend: function(){
				Custom.showLoaderCustomize(".defaultprogress");
				
			},
			complete: function(){
				Custom.hideLoader(".defaultprogress");
			},
			success: function(data, statusMsg, jqXHR)
			  {
				  $('#managerefreshform').html(data.managerefreshform);
				  Testinomialscrollhidden();
			  },
			  error : function(data, statusMsg, jqXHR) 
			  {
				  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
			  }
      });
}


function edit_clientsource(id,clientid,vendorType,clients,clientval)
    {
		$( "#error-bubble" ).removeClass( 'alert alert-error' ).html('');
		$( "#ajaxResults" ).removeClass( 'alert alert-success' ).html('');
		  save_method = 'update';
		  
		   // $('#ftpaccess-form')[0].reset(); // reset form on modals
	      $("#ftpaccess-form").reset();
	      $.ajax({
	          url : pathVariable+ "/ajax-edit/"+ id,
	          type: "POST",
	          data : 
			  {
	        	  clientid : clientid,
	        	  clientval: clientval
	        	 				  
			  },
	          dataType: "JSON",
	          beforeSend: function(){
					Custom.showLoaderCustomize(".defaultprogress");
					
				},
				complete: function(){
					Custom.hideLoader(".defaultprogress");
				},
	          success: function(data)
	          {
	        	    
	        	    $('#ftpupdate').html(data.ftpupdate);
	        	    $('.ftp_title').show('');
	        	   	$('#clientsoption').attr('disabled',true);
	               	$('#accordion').css("display","block");
	               	$('.passwords').hide('');
             		$('.newpasswords').show('');
             		$('.client_select_add').hide('');
             		if(vendorType =='pressganey')
             			$('#vendor_msg').html('Note: Editing the PG FTP configuration will affect all PG clients.');
             		else
             			$('#vendor_msg').html('');
	              
	              
	              $('#modal_form').modal('show'); // show bootstrap modal when complete loaded
	              $('.modal-title').html('<b>Client</b>').append(' - ').append(clients); // Set title to Bootstrap modal title
	              Testinomialscrollhidden();
	             
	              
	          },
	          error: function ()
	          {
	        	  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
	          }
	      });
    }

	 function add_ftpaccess()
	    {
	     
			 	$( "#error-bubble" ).removeClass( 'alert alert-error' ).html('');
			 	$( "#ajaxResults" ).removeClass( 'alert alert-success' ).html('');
			 	$('#clientsoption').css('border', '');
			 	$('#remoteurl').css('border', '');
				$('#username').css('border', '');
				$('#password').css('border', '');
				$('#folder').css('border', '');
				$('#newpassword').css('border', '');
				save_method = 'add';
				$('#ftpaccess-form')[0].reset(); // reset form on modals
				 $("#ftpaccess-form").reset();
				$('#modal_form').modal('show'); // show bootstrap modal
				$('.modal-title').text('Add FTP Configuration'); // Set Title to Bootstrap modal title
				 $('.ftp_title').hide('');
				$('#clientsoptionadd').val(0).trigger("change");
				$("#clientsoption").removeAttr("disabled",false);
				$('.newpasswords').hide('');
				$('.passwords').show('');
				$('.client_select_update').hide('');
				$('.client_select_add').show('');
				
					
				Testinomialscrollhidden();
			
	    }
	 
	 function Testinomialscrollhidden()
		{
			$('body').css('overflow','hidden');
			$('body').css('position','fixed');
		}	    		

		function Testinomialscrollshow()
		{
			$('body').css('overflow-y','scroll');
			$('body').css('position','relative');
		}
	
var Ftpaccess = function() {
	return {
		home : function() {
			
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
			$("#client").select2({
			     allowClear: false,
			     closeOnSelect: true,
			     placeholder: ''
			});
			
			$("#clientsoption").select2({
			     allowClear: false,
			     closeOnSelect: true,
			     placeholder: ''
			});
			
			$("#clientsoptionadd").select2({
			     allowClear: false,
			     closeOnSelect: true,
			     placeholder: ''
			});
			$('.input-group').find('.start_date_BHA').on('click', function() {
				$('#start_date_BHA').trigger('focus');
			});
			
			$('.input-group').find('.start_date_BSR').on('click', function() {
				$('#start_date_BSR').trigger('focus');
			});
			
		
			// 
			$('input:radio[name=chk_refresh]').on("click", function(event)
	      	{
				
				var displayInfo = null;
				displayInfo = $('input:radio[name=chk_refresh]:checked').val();
				//alert(displayInfo);
				if(displayInfo == 5)
				{
					$('.show_auto_refresh').css('display','block');
					$('.show_start_date').css('display','block');
					$('.show_reference_recurrence').css('display','block');
				}
				else
				{
					
					$('.show_auto_refresh').css('display','none');
					$('.show_start_date').css('display','none');
					$('.show_reference_recurrence').css('display','none');
					
					
				}
	      		
	      	});
			
											
			displayDataTable();
			
			$('#client').change(function( event )
					{
						$('#dropdownclient').toggleClass('hidden');
						var clientId = $('#client').val();
						displayDataTable();
					});
						
						function displayDataTable()
						{
							var manageClientPerm = $('[name="manageClientConfig"]').val();
														
						table = $('.ftp-list').dataTable(
							
								{
						
									serverSide : false,
									bLengthChange : false,
									bProcessing : false,
									searching: false,
									//responsive: true,
									iDisplayLength : 10,
									bDestroy: true,
									"language": {
									      "emptyTable": "No data available in client source"
									    },
									
									ajax : {
										url : pathVariable
												+ "/list-ajax/",
										type : 'POST',
										dataType : 'json',
										 beforeSend: function(){
												Custom.showLoaderCustomize(".defaultprogress");
												
											},
											complete: function(){
												Custom.hideLoader(".defaultprogress");
											},
										data: {
										      data:  JSON.stringify($('#client-filter-form').serializeObject())
										  },
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
										"mData" : "survey",
										"sWidth": "5%",
										"orderable": true
										
									},
									{
										"mData" : "pgClientId",
										"sWidth": "15%",
										"orderable": true
										
									},
									{
										"mData" : "overallRatingQuestions",
										"sWidth": "10%",
										"orderable": true
										
									},
									{
										"mData" : "rating1Questions",
										"sWidth": "10%",
										"orderable": false
										
									},
									{
										"mData" : "rating2Questions",
										"sWidth": "10%",
										"orderable": false
										
									},
									{
										"mData" : "rating3Questions",
										"sWidth": "9%",
										"orderable": false
										
									},
									{
										"mData" : "rating4Questions",
										"sWidth": "8%",
										"orderable": false
										
									},
									{
										"mData" : "rating5Questions",
										"sWidth": "8%",
										"orderable": false
										
									},
									{
										"mData" : "rating6Questions",
										"sWidth": "8%",
										"orderable": false
										
									}
									,
									{
										"mRender" : function(data, type, full) {
											var html ='';
											if(full.manageClientConfig == true){
												if(full.clientProductName != null && full.clientProductName.length>0){
													$.each(full.clientProductName, function( ids, items ) {
														if(items.refreshFrequencyId == 6)
															html += '<button class="btn btn-popup-blue refresh-btn" data-backdrop="static" data-keyboard="false" onclick="manual_refresh(\'' + items.id + '\')">'+ items.name+'</button>';
														else
															html += '';
													});
											   }
												
												
											 }
												return html;
											},
										"orderable": true,
										"sWidth": "5%"
																		
									},
									{
										//"mData" : "id",
										"mRender" : function(data, type, full) {
											var html='';
											if(full.manageClientConfig == true){
												if(full.clientProductName != null && full.clientProductName.length>0){
													html += '<a title="Manage Config"  class="edit-ftpaccess" data-backdrop="static" data-keyboard="false" onclick="manage_config('+ full.id +')"><i class="icon-settings"></i> Manage Publishing</a>';
												}
											}else{
												html='';
											}
											return html;
											},
											 "orderable": true,
											 "sWidth": "10%"
									}
									
																		
									
									],
									 "drawCallback": function(settings){
										//Hidding column .
																												
										if(manageClientPerm == '' ||  manageClientPerm == null )
										{
											
											$('table.ftp-list thead').find("tr th").each(function(){
												if($(this).text() == "Refresh")
												{
													$(this).hide();
												}
												
												if($(this).text() == "Manage Refresh")
												{
													$(this).hide();
												}
											});
											$('table.ftp-list tbody').find("tr td:nth-child(9)").each(function(){$(this).remove()});
											$('table.ftp-list tbody').find("tr td:nth-child(10)").each(function(){$(this).remove()});
										}
										else if(manageClientPerm == 1)
										{
											
											$('table.ftp-list thead').find("tr th").each(function(){
												if($(this).text() == "Refresh" && $(this).text() == "Manage Refresh")
												{
													$(this).show();
												}
											});
										}
										
									}
								
								
							});
						}
					
			
			/********************* FTP Config Data table *******/
		
						
						table = $('.ftp-config').dataTable(
							
								{
						
									serverSide : false,
									bLengthChange : false,
									bProcessing : false,
									searching: false,
									iDisplayLength : 50,
									//responsive: true,
									bDestroy: true,
									aaSorting : [],
									"language": {
									      "emptyTable": "No data available in ftp configuration"
									    },
									
									ajax : {
										url : pathVariable
												+ "/ftplist-ajax/",
										type : 'POST',
										dataType : 'json',
										 beforeSend: function(){
												Custom.showLoaderCustomize(".defaultprogress");
												
											},
											complete: function(){
												Custom.hideLoader(".defaultprogress");
											},
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
										"mData" : "clients",
										"orderable": true
									},
									
									{
										"mData" : "signupurl",
										"mRender" : function(data, type, full) {
											var html;
											html = '<a title="Registration Link"  class="edit-ftpaccess" data-backdrop="static" data-keyboard="false" onclick="send_reglink(\'' + full.signupurl + '\',\'' + full.clientId + '\',\'' + full.vendor + '\')"><i class="glyphicon glyphicon-link"></i> Registration Link</a>';
											
											return html;
											},
											 "orderable": false,
											 "sWidth": "12%"
										},
																		
									
									{
										//"mData" : "id",
										"mRender" : function(data, type, full) {
											var html;
											//alert(full.vendorType);
											if (full.id != "") {
												//if(full.manageClientConfigWftp == true){
													html = '<a title="Edit"  class="edit-ftpaccess" data-backdrop="static" data-keyboard="false" onclick="edit_clientsource('+ full.id +',\'' + full.clientId + '\',\'' + full.vendorType + '\',\'' + full.clients +'\','+ full.clientval +')"><i class="fa fa-pencil-square-o fa-2x"></i>Edit</a>';
												
													if(full.vendorType !='pressganey'){
														if(full.ftpstatus == true)
															html += '<a href="#" ftpaccess-id="' + full.id + '"   status-id="false" title="InActive" class="editor_remove delete-ftpaccess" style="margin-left:8px;"><i class="glyphicon glyphicon-sort gl-2x active-users"></i>InActive</a>';
														else
															html += '<a href="#" ftpaccess-id="' + full.id + '"  status-id="true" title="Active" class="editor_remove delete-ftpaccess " style="margin-left:8px;"><i class="glyphicon glyphicon-sort gl-2x inactive"></i>Active</a>';
												
													}
												 /* }else{
													  html = '<a title="View"  class="edit-ftpaccess" data-backdrop="static" data-keyboard="false" onclick="view_clientsource('+ full.id +',\'' + full.clientId + '\',\'' + full.vendorType + '\',\'' + full.clients +'\','+ full.clientval +')"><i class="fa fa-plus-square-o"></i> View</a>';
												  }*/
											}
											return html;
											},
											 "orderable": true,
											 "sWidth": "12%"
										}									
									
									]
								
								
							});
						
			
					
			$("#body").on("click", "#cancel_form", function(e){
				$('#clientsoption').css('border', '');
				$('#clientsoptionadd').css('border', '');
				
				$('#remoteurl').css('border', '');
				$('#username').css('border', '');
				$('#password').css('border', '');
				$('#folder').css('border', '');
				$('#remoteurl').val('');
				$('#username').val('');
				$('#password').val('');
				$('#folder').val('');
				$('#newpassword').css('border', '');
				$('#vendor_msg').html('');
				$('#error-bubble').removeClass('alert alert-error').html('')
				
			});
			
			
			$("body").on("click", ".registration_form", function(e){
				var url;
		      	Custom.hideMessages();
		      	var alertValidation = "";
		      	$('#email').css('border', '');
		      	var emailvalidation = false;
		      	
		      	var emailExp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
				var emails = $('#email').val().trim().replace(/\s/g, "");
				var emailArray = emails.split(",");
				for(i = 0; i <= (emailArray.length - 1); i++){
										
						if(checkEmail(emailArray[i]) == true){
							$('#email').css('border', '');
						}else{
							  emailvalidation = true;
							  $('#errorregister').addClass('alert alert-error').html('Email is invalid') ;
						      e.preventDefault(); 
						      $('#email').css('border', '1px solid red');
						}
				  }
				
					if ($('#email').val().trim() == '' ||  $('#email').val().trim().length == 0) {
				         $('#errorregister').addClass('alert alert-error').html('Please enter a email') ;
			             e.preventDefault(); 
			             $('#email').css('border', '1px solid red');
					}
				
											
				if(!emailvalidation){
					$('#errorregister').removeClass('alert alert-error').html('');
					$('#email').css('border', '');
					url = pathVariable
					+ "/sendRegistrationEmail";
					
					$.ajax({
			              method: "POST",
			              beforeSend: function(xhr) {
			                  //Custom.showLoader();
			            	  $('.showhidecontentadd').css("display","none");
			            	  Custom.showLoaderCustomize("#ajaxloader");
			              },
						complete: function(){
							$('.showhidecontentadd').css("display","block");
								Custom.hideLoader("#ajaxloader");
							},
			              url: url,
			              data: $('#registration-form').serialize(),
			              dataType: "JSON"
			              
			          })
			          .done(function(json) {
			        	  
			               	  $('#signupurl_form').modal('hide');
			               	  $('#signupurl_form').find('#registration-form')[0].reset();
			               	  $('#registration-form')[0].reset();
			               	  $("#registration-form").reset();
			               	  $('#email').val();
			                    Testinomialscrollshow();
				              $('#ajaxResults').addClass('alert alert-success').html('Email sent sucessfully') ;
				               setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-success').html('');
					       			}, 2000);
				               $( "#ajaxResults" ).removeClass( 'alert-error' );
			           

			          }).fail(function() {
			             
			        	  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
			        	  setTimeout(function() {
				       			$('#ajaxResults').removeClass('alert alert-error').html('');
				       			}, 2000);
			          }).always(function() {
			              Custom.hideLoader();

			          });
				}
				
			});
			
			// manual refresh
			
			$("body").on("click", ".manualrefresh_form", function(e){
				
				var clientid = $('[name="clientid"]').val();
				url = pathVariable
				+ "/refreshproduct";
				
				$.ajax({
		              method: "POST",
		              beforeSend: function(xhr) {
		            	  $('.manualrefreshform').css("display","none");
		            	  Custom.showLoaderCustomize("#ajaxloaderrefresh");
		                 
		              },
		              complete: function(){
							$('.manualrefreshform').css("display","block");
								Custom.hideLoader("#ajaxloaderrefresh");
							},
		              url: url,
		              data: $('#manualrefresh-form').serialize(),
		              dataType: "JSON"
		              
		          })
		          .done(function(json) {
		        	  
		              if (json.result) {
		                  //that means they are updated successfully!
		            	 
		                   Custom.showMessages("success", json.result, [""]);
		                   $('#manualrefresh_form').modal('hide');
		                   var table = $('#tableconfig').DataTable();
			               table.ajax.reload();
			               
			               Testinomialscrollshow();
			               $('#ajaxResults').addClass('alert alert-success').html(json.result) ;
			               setTimeout(function() {
				       			$('#ajaxResults').removeClass('alert alert-success').html('');
				       			}, 2000);
			               $( "#ajaxResults" ).removeClass( 'alert-error' );
		                 
		                 
		              } else {
		            	  $('#manualrefresh_form').modal('hide');
		            	  $('#ajaxResults').addClass('alert alert-error').html(json.error) ;
		            	  setTimeout(function() {
				       			$('#ajaxResults').removeClass('alert alert-error').html('');
				       			}, 2000);
		            	 
		               
		              }
	
		          }).fail(function() {
		             
		        	  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
		        	  setTimeout(function() {
			       			$('#ajaxResults').removeClass('alert alert-error').html('');
			       			}, 2000);
		          }).always(function() {
		              Custom.hideLoader();
	
		          });
				
				
				
			});
			
			
			
			$("body").on("click", ".update_frequencyform", function(e){
				
				var url;
		      	Custom.hideMessages();
		      	var alertValidation = "";
		      	$('#chk_refresh').css('border', '');
				$('#start').css('border', '');
				var dynamicvalidation = false;
				var refresh_btn = $('input:radio[name=chk_refresh]:checked').val();
				var start_date = $('#start_date').val();
				var intervals = $('input:radio[name=chk_intervals]:checked').val();
				
				var products = $('[name="productval"]').val();
				 var productRes = products.split(",");
				 
				 //alert(productRes);
				// dynamic validation
				 $.each(productRes, function (idx,item) {
					  
					 	var refresh_btn = $('input:radio[name=chk_refresh_'+ item +']:checked').val();
					 	
						var start_date =  $('#start_date_'+ item +'').val();
						  //alert(start_date);
						var intervals =   $('input:radio[name=chk_intervals_'+ item +']:checked').val();
						if(refresh_btn == 5 && (start_date =='' || start_date == null)){
								$('#errorrefresh').addClass('alert alert-error').html('Start date is required') ;
								e.preventDefault();
								$('.show_start_date').addClass('has-error');
								$('#start_date_'+ item +'').css('border', '1px solid red');
								dynamicvalidation = true;
						}else if(refresh_btn == 5 && (intervals =='' || intervals == null)){
								  $('#errorrefresh').addClass('alert alert-error').html('Set refresh recurrence is required') ;
								  e.preventDefault();
								  $('.show_reference_recurrence_'+ item +'').addClass('has-error');
								  $('#chk_intervals_'+ item +'').css('border', '1px solid red');
						          dynamicvalidation = true;
						}else{
							
							// $('#error-bubble').removeClass('alert alert-error').html('');
							 $('#start_date_'+ item +'').css('border', '');
							 $('.show_reference_recurrence_'+ item +'').removeClass('has-error');
							 $('#chk_intervals_'+ item +'').css('border', '');
														
		    	  		  }
					
				    });
				 
				 //alert(dynamicvalidation);return false;
				 
				 if(!dynamicvalidation){
						$('#errorrefresh').removeClass('alert alert-error').html('');
						
						   url = pathVariable
							+ "/updatefrequency";
					     
					      
					      $.ajax({
				              method: "POST",
				              
				              url: url,
				              data: $('#manageconfig-form').serialize(),
				              dataType: "JSON",
				              beforeSend: function(){
				            	  $('.managerefreshform').css("display","none");
				            	  Custom.showLoaderCustomize("#ajaxloaderrefreshform");
									
								},
							  complete: function(){
								  $('.managerefreshform').css("display","block");
									Custom.hideLoader("#ajaxloaderrefreshform");
								},
				              
				          })
				          .done(function(json) {
				        	  
				              if (json.result) {
				                  //that means they are updated successfully!
				            	 
				                   Custom.showMessages("success", json.result, [""]);
				                   $('#managerefresh_form').modal('hide');
				                   $("#managerefresh_form").reset();
				                   var table = $('#tableftp').DataTable();
					               table.ajax.reload();
					               Testinomialscrollshow();
					               $('#ajaxResults').addClass('alert alert-success').html(json.result) ;
					               setTimeout(function() {
						       			$('#ajaxResults').removeClass('alert alert-success').html('');
						       			}, 2000);
					               $( "#ajaxResults" ).removeClass( 'alert-error' );
				                 
				                 
				              } else {
				            	  $('#modal_form').modal('hide');
				            	  $('#ajaxResults').addClass('alert alert-error').html(json.error) ;
				            	  setTimeout(function() {
						       			$('#ajaxResults').removeClass('alert alert-error').html('');
						       			}, 2000);
				            	 
				               
				              }
			
				          }).fail(function() {
				             
				        	  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
				        	  setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-error').html('');
					       			}, 2000);
				          }).always(function() {
				              Custom.hideLoader();
			
				          });
						
				 }
				
				
			});
			
			
			$("body").on("click", ".ftp_accessform", function(e){
				
				var url;
		      	Custom.hideMessages();
		      	var alertValidation = "";
		      	$('#clientsoption').css('border', '');
		      	$('#clientsoptionadd').css('border', '');
		      	$('#remoteurl').css('border', '');
				$('#username').css('border', '');
				$('#password').css('border', '');
				$('#folder').css('border', '');
				$('#newpassword').css('border', '');
				//$('#chk_refresh').css('border', '');
				//$('#start').css('border', '');
				var dynamicvalidation = false;
				//var refresh_btn = $('input:radio[name=chk_refresh]:checked').val();
				//var start_date = $('#start_date').val();
				//var intervals = $('input:radio[name=chk_intervals]:checked').val();
				
				//var products = $('[name="productval"]').val();
				// var productRes = products.split(",");
				// dynamic validation
				/* $.each(productRes, function (idx,item) {
					
					 	var refresh_btn = $('input:radio[name=chk_refresh_'+ item +']:checked').val();
						var start_date =  $('#start_date_'+ item +'').val();
						var intervals =   $('input:radio[name=chk_intervals_'+ item +']:checked').val();
						if(refresh_btn == 5 && (start_date =='' || start_date == null)){
								$('#error-bubble').addClass('alert alert-error').html('Start date is required') ;
								e.preventDefault();
								$('.show_start_date').addClass('has-error');
								$('#start_date_'+ item +'').css('border', '1px solid red');
								dynamicvalidation = true;
						}else if(refresh_btn == 5 && (intervals =='' || intervals == null)){
								  $('#error-bubble').addClass('alert alert-error').html('Set refresh recurrence is required') ;
								  e.preventDefault();
								  $('.show_reference_recurrence_'+ item +'').addClass('has-error');
								  $('#chk_intervals_'+ item +'').css('border', '1px solid red');
						          dynamicvalidation = true;
						}else{
							
							// $('#error-bubble').removeClass('alert alert-error').html('');
							 $('#start_date_'+ item +'').css('border', '');
							 $('.show_reference_recurrence_'+ item +'').removeClass('has-error');
							 $('#chk_intervals_'+ item +'').css('border', '');
														
		    	  		  }
					
				});*/
			
					
				if($('#remoteurl').val() == '' && $('#username').val() == '' && $('#password').val() == ''  && $('#folder').val() == ''){
					if(($('#clientsoptionadd').val() == 0 || $('#clientsoptionadd').val() == '' || $('#clientsoptionadd').val() == null) && save_method == 'add'){
						alertValidation += "\n\r\Client is required<br />";
					}
										
					alertValidation += "\n\r\Remote url is required<br />";
					alertValidation += "\n\r\User name is required<br />";
					alertValidation += "\n\r\Password is required<br />";
					
					alertValidation += "\n\r\Folder is required<br />";
					$('#error-bubble').addClass('alert alert-error').html(alertValidation) ;
					e.preventDefault(); 
				}else if (($('#clientsoptionadd').val() == 0 || $('#clientsoptionadd').val() == '' || $('#clientsoptionadd').val() == null) && save_method == 'add') {
			         $('#error-bubble').addClass('alert alert-error').html('Client is required') ;
		             e.preventDefault(); 
		             $('#clientsoptionadd').css('border', '1px solid red');	
				}else if ($('#clientsoption').val() == 0 && save_method == 'update') {
			         $('#error-bubble').addClass('alert alert-error').html('Client is required') ;
		             e.preventDefault(); 
		             $('#clientsoption').css('border', '1px solid red');				
			   }else if ($('#remoteurl').val().trim() == '' ||  $('#remoteurl').val().trim().length == 0) {
				         $('#error-bubble').addClass('alert alert-error').html('Remote url is required') ;
			             e.preventDefault(); 
			             $('#remoteurl').css('border', '1px solid red');
			   }else if ($('#username').val().trim() == '' || $('#username').val().trim().length == 0) {
			         $('#error-bubble').addClass('alert alert-error').html('User name is required') ;
		             e.preventDefault(); 
		             $('#username').css('border', '1px solid red');	
			   
			   }else if ($('#folder').val().trim() == '' ||  $('#folder').val().trim().length == 0) {
			         $('#error-bubble').addClass('alert alert-error').html('Folder is required') ;
		             e.preventDefault(); 
		             $('#folder').css('border', '1px solid red');
			   
			   }else{
				  
				   
				   	$('#error-bubble').removeClass('alert alert-error').html('');
				   	
				
				      if(save_method == 'add') 
				      {
				          url = pathVariable
							+ "/add";
				      }
				      else
				      {
				        url = pathVariable
						+ "/edit";
				      }
				      
				      $.ajax({
			              method: "POST",
			              
			              url: url,
			              data: $('#ftpaccess-form').serialize(),
			              dataType: "JSON",
			              beforeSend: function(){
								Custom.showLoaderCustomize(".ajaxResults");
								
							},
						  complete: function(){
								Custom.hideLoader(".ajaxResults");
							},
			              
			          })
			          .done(function(json) {
			        	  
			              if (json.result) {
			                  //that means they are updated successfully!
			            	 
			                   Custom.showMessages("success", json.result, [""]);
			                  // $('#modal_form').modal('destroy');
			                  // $('#modal_form').html('');
			                   $('#modal_form').modal('hide');
			                   $("#modal_form").reset();
			                   var table = $('#tableconfig').DataTable();
				               table.ajax.reload();
				               if(save_method == 'add'){
					               location.reload(pathVariable
											+ "/config");
			              		}
				               Testinomialscrollshow();
				               $('#ajaxResults').addClass('alert alert-success').html(json.result) ;
				               setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-success').html('');
					       			}, 2000);
				               $( "#ajaxResults" ).removeClass( 'alert-error' );
			                 
			                 
			              } else {
			            	  $('#modal_form').modal('hide');
			            	  $('#ajaxResults').addClass('alert alert-error').html(json.error) ;
			            	  setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-error').html('');
					       			}, 2000);
			            	 
			               
			              }
		
			          }).fail(function() {
			             
			        	  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
			        	  setTimeout(function() {
				       			$('#ajaxResults').removeClass('alert alert-error').html('');
				       			}, 2000);
			          }).always(function() {
			              Custom.hideLoader();
		
			          });
					
			   }
				
			});
			
			$("body").on("click", ".cancel_form", function(e){
				Testinomialscrollshow();
				$('#vendor_msg').html('');
				$('#email').val('');
				$('#username').val('');
				$('#folder').val('');
				$('#username').css('border', '');
				$('#folder').css('border', '');
				$('#email').css('border', '');
				$('#remoteurl').css('border', '');
				$('#newpassword').css('border', '');
				$('#remoteurl').val('');
				$('#newpassword').val('');
				
				$('#refresh_div').removeClass('has-error');
				$('.show_start_date').removeClass('has-error');
				$('#intervals').removeClass('has-error');
				$("#registration-form").reset();
				$( "#errorregister" ).removeClass( 'alert alert-error' ).html('');
				$("#uniform-chk_refresh > span").removeClass ( 'checked' );
				$("#uniform-chk_intervals > span").removeClass ( 'checked' );
				$( "#errorrefresh" ).removeClass( 'alert alert-error' ).html('');
				
			});
			
			$("body").on("click", ".close", function(e){
				Testinomialscrollshow();
				$('#vendor_msg').html('');
				$('#email').val('');
				$('#username').val('');
				$('#folder').val('');
				$('#username').css('border', '');
				$('#folder').css('border', '');
				$('#email').css('border', '');
				$('#remoteurl').css('border', '');
				$('#newpassword').css('border', '');
				$('#remoteurl').val('');
				$('#newpassword').val('');
				
				$('#refresh_div').removeClass('has-error');
				$('.show_start_date').removeClass('has-error');
				$('#intervals').removeClass('has-error');
				$("#registration-form").reset();
				$( "#errorregister" ).removeClass( 'alert alert-error' ).html('');
				$("#uniform-chk_refresh > span").removeClass ( 'checked' );
				$("#uniform-chk_intervals > span").removeClass ( 'checked' );
				$( "#errorrefresh" ).removeClass( 'alert alert-error' ).html('');
				
			});
			
			// Delete FTP config

			$("body").on("click", ".delete-ftpaccess", function(e){
				e.preventDefault();
				var me = $(this);
				var status='';
				var msg='';
				status = me.attr("status-id");
				if(status == "true")
					msg='activate';
				else
					msg='inactivate';
				
				bootbox.confirm("Are you sure to "+ msg +" this ftp config?", function(result) {
					if(result){
						  var url = pathVariable + "/"+me.attr("ftpaccess-id")+"/delete/";
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  ftp_id : me.attr("ftpaccess-id"),
								  status : me.attr("status-id"),
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							    if(json['statusCode'] == 200) {
							    	 $('#ajaxResults').addClass('alert alert-success').html('FTP config status changed successfully!') ;
							    	 //me.parents("tr").remove();
							    	 setTimeout(function() {
							       			$('#ajaxResults').removeClass('alert alert-success').html('');
							       			}, 2000);
							    	 var table = $('#tableconfig').DataTable();
								  		table.ajax.reload();
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  
							  }
						  });
					}
					}); 
			});
			
						
					 
		}
					
		}
}();