function showerrorfilepath(filename){
	$('#showhistoryerrorFilePath').html(filename).show();
}

function showprocessedFilePath(filename){
	$('#showhistoryprocessedFilePath').html(filename).show();
}

var Synclog = function() {
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
				
				
			
				/*========Loading Datatable onload with default values==========*/
	  			displayDataTable();
	  			/*========End of loading Datatable onload with default values====*/
	  			
	  			$('#client').change(function( event )
						{
							$('#dropdownclient').toggleClass('hidden');
							var clientId = $('#client').val();
							displayDataTable();
						});
	  			
	  			/*===============Calendar to be displayed on textbox when click of Calendar icon=======================*/ 
	  		    $('.input-group').find('.start_time').on('click', function(){
	  		        $('#start_time').trigger('focus');
	  		    });
	  		    
	  		    $('.input-group').find('.end_time').on('click', function(){
	  		        $('#end_time').trigger('focus');
	  		    });
	  		     /*===============Calendar to be displayed on textbox when click of Calendar icon===========*/
				
			
			function displayDataTable()
			{
						
			$('.synclogs').dataTable(
							
					{
						
								serverSide : true,
								bLengthChange : false,
								bProcessing : false,
								bDestroy: true,
								searching: false,
								bDeferRender:true,
								iDisplayLength : 100,
								"language": {
								      "emptyTable": "No data available in Syncronize logs"
								    },
								
								ajax : {
									url : SurveyView.base_url
											+ "synclog/list-ajax",
									type : 'POST',
									dataType : 'json',
									data: {
									      data:  JSON.stringify($('#client-filter-form').serializeObject())
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
									"mData" : "exportJobId",
									"orderable": true,
									"sWidth": "50%"
								},
																
								{
									"mData" : "physicianName",
									"orderable": true,
									"sWidth": "50%"
								},
								{
									"mData" : "errorCode",
									"orderable": true,
									"sWidth": "70%"
								},
								
								{
									"mData" : "errorMsg",
									"orderable": true,
									"sWidth": "19%"
								}
								
								
								]
								
								
							});
			
			}
		
		}
					
		}
}();