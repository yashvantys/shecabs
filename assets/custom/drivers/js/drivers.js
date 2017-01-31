var pathVariable = Shecabs.base_url + "drivers";
var Drivers = function() {
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