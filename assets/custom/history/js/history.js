function showerrorfilepath(filename){
	$('#showhistoryerrorFilePath').html(filename).show();
}

function showprocessedFilePath(filename){
	$('#showhistoryprocessedFilePath').html(filename).show();
}

var History = function() {
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
				
				$("#status").select2({
			        allowClear: true,
			        closeOnSelect: true,
				    placeholder: ''
			   });
			
				/*========Loading Datatable onload with default values==========*/
	  			displayDataTable();
	  			/*========End of loading Datatable onload with default values====*/
	  			
	  			/*===============Calendar to be displayed on textbox when click of Calendar icon=======================*/ 
	  		    $('.input-group').find('.start_time').on('click', function(){
	  		        $('#start_time').trigger('focus');
	  		    });
	  		    
	  		    $('.input-group').find('.end_time').on('click', function(){
	  		        $('#end_time').trigger('focus');
	  		    });
	  		     /*===============Calendar to be displayed on textbox when click of Calendar icon===========*/
				
			$('#history_filter').click(function( event )
					{
						
							displayDataTable();
						
					});
			function displayDataTable()
			{
						
			$('.importhistory').dataTable(
							
					{
						
								serverSide : false,
								bLengthChange : false,
								bProcessing : false,
								bDestroy: true,
								searching: false,
								iDisplayLength : 100,
								"language": {
								      "emptyTable": "No data available in import history"
								    },
								
								ajax : {
									url : SurveyView.base_url
											+ "history/list-ajax",
									type : 'POST',
									dataType : 'json',
									data: {
									      data:  JSON.stringify($('#history-filter-form').serializeObject())
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
									"mData" : "file_name",
									"orderable": true
								},
																
								{
									"mData" : "path",
									"orderable": true
								},
								{
									"mData" : "remoteFileSize",
									"orderable": true,
									 "sClass": "size_class"
								},
								
								{
									"mData" : "imported_file_size",
									"orderable": true,
									"sClass": "size_class"
								},
								
								{
									"mData" : "date",
									"orderable": false
								},
								
								{
									"mData" : "status",
									"orderable": false
								},
								{
									"mData" : "process_status",
									"orderable": false
								},
								{
									"mData" : "total_records",
									"orderable": false
								},
								{
									"mData" : "processedRecords",
									"orderable": false
								},
								{
									"mData" : "failedRecords",
									"orderable": false
								},
								{
									"mData" : "processStartTime",
									"orderable": false
								},
								{
									"mData" : "processEndTime",
									"orderable": false
								},
								{
									"mData" : "errorFilePath",
									 "mRender" : function(data, type, full) {
						             if(full.errorFilePath !=null && full.errorFilePath !='')
						            {
						              	 var html = '<a href="#historyerrorFilePath" data-toggle="modal"  data-backdrop="static" data-keyboard="false" onclick="showerrorfilepath(\'' + full.errorFilePath + '\')">Show</a>';
						              	 
						            }else{
						            	var html = '';
						            }
						             $('#host').html("<b>Host:</b> "+full.host).show();
						             $('#remote').html("<b>Remote Location:</b> "+full.remote_location).show();
						              
						              return html;
						             },
									"orderable": false
								},
								{
									"mData" : "processedFilePath",
									"mRender" : function(data, type, full) {
							             if(full.processedFilePath !=null && full.processedFilePath !='')
							            {
							            	var html = '<a href="#historyprocessedFilePath" data-toggle="modal"  data-backdrop="static" data-keyboard="false" onclick="showprocessedFilePath(\'' + full.processedFilePath + '\')">Show</a>';
							              	 
							            }else{
							            	var html = '';
							            }
							            	 
							              
							              return html;
							             },
									"orderable": false
								}
								
								
								]
								
								
							});
			
			}
		
		}
					
		}
}();