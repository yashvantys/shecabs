var Users = function() {
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
                                                    							
							$('.users-list').dataTable(
							
							{
								serverSide : false,
								bLengthChange : false,
								bProcessing : false,
								searching: false,
								destroy: true,
								responsive: true,
								iDisplayLength : 50,
															"language": {
								      "emptyTable": "No data available in Users"
								    },
								
									ajax : {
										url : Shecabs.base_url
												+ "users/list-ajax",
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
	"mData" : "email",
	"sWidth": "25%",
	"orderable": true
	
},
{
	"mData" : "name",
	"sWidth": "25%",
	"orderable": true
	
},
{
	"mData" : "dob",
	"sWidth": "10%",
	"orderable": true
	
},
{
	"mData" : "mobileNo",
	"sWidth": "20%",
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
			
			
	 
		}
					
	}
}();