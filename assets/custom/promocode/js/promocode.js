var pathVariable = Shecabs.base_url + "drivers";
var Promocode = function() {
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
			
                               displayDataTable();
									
						function displayDataTable()
						{
                                                    							
							$('.promocode-list').dataTable(
							
							{
								serverSide : false,
								bLengthChange : false,
								bProcessing : false,
								searching: false,
								destroy: true,
								responsive: true,
								iDisplayLength : 50,
															"language": {
								      "emptyTable": "No data available in Drivers"
								    },
								
									ajax : {
										url : Shecabs.base_url
												+ "promocode/list-ajax",
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
                                                                                "mData" : "code",
                                                                                "sWidth": "15%",
                                                                                "orderable": true

                                                                        },
                                                                        {
                                                                                "mData" : "calculation",
                                                                                "sWidth": "15%",
                                                                                "orderable": true

                                                                        },
                                                                        {
                                                                                "mData" : "discount",
                                                                                "sWidth": "10%",
                                                                                "orderable": true

                                                                        },
                                                                        {
                                                                                "mData" : "count",
                                                                                "sWidth": "10%",
                                                                                "orderable": true

                                                                        },
                                                                         {
                                                                                "mData" : "minCostValue",
                                                                                "sWidth": "10%",
                                                                                "orderable": true

                                                                        },
                                                                        {
                                                                                "mData" : "startTimeVal",
                                                                                "sWidth": "10%",
                                                                                "orderable": true

                                                                        },
                                                                        {
                                                                                "mData" : "endTimeVal",
                                                                                "sWidth": "10%",
                                                                                "orderable": true

                                                                        },
                                                                        {
									//"mData" : "id",
									"mRender" : function(data, type, full) {
										var html='';
										
												html = '<a title="Edit"  datamodel-id="'+ full.id +'" class="edit-datamodel" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-sort gl-2x active-users"></i> Active</a>';
												//html += '<a title="Delete" datamodel-id="'+ full.id +'"  class="delete-datamodel" data-backdrop="static" data-keyboard="false"><i class="glyphicon glyphicon-trash"></i> Delete</a>';
												
										
										return html;
										},
										 "orderable": false,
										 "sWidth": "10%"
									}	

									],
									
									
									
								});
							}
                        
                        
			   
				// delete datamodel
				
				$("body").on("click", ".active-drivers", function(e){
					
					var me = $(this);
					var driverid = me.attr("driver-id");
					//alert(driverid);
					bootbox.confirm("Are you sure to Active/Inactive this Driver?", function(result) {
						if(result){
							  var url = pathVariable + "/"+me.attr("driver-id")+"/delete/";
							  $.ajax({
								  url : url,
								  type : "POST",
								  data : {
									  driverid : me.attr("driver-id"),
									 
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
									
						
			
			
	 
		}
					
	}
}();