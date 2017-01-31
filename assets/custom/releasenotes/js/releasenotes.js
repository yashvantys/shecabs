CKEDITOR.replace( 'resource_value',{
	autoParagraph : false
});
var Notes = function() {
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
			
			$('#datetimepicker1').on("click", function(){
				$('#datetimepicker1').datetimepicker();
			});
			
			$('#datetimepicker2').on("click", function(){
				$('#datetimepicker2').datetimepicker();
			});
			
		
		}
					
	}
}();

function saveReleasenote()
{
	 var eurl;
	 var resource_value;
	 var resouce_key;
	 var resource_id;
	 resource_value = CKEDITOR.instances['resource_value'].getData();
	 resouce_key =  $('[name="resourcekey"]').val(); 
	 resource_id =  $('[name="resourceid"]').val(); 
	 sdatetime = $('[name="datetimepicker1"]').val();
	 edatetime = $('[name="datetimepicker2"]').val();
	 
	 if(resource_value == '')
	 {
		 $('#customm_test').addClass('alert alert-error').html('Please enter release notes');
		 return false;
	 }
	 else if(sdatetime == '')
	 {
		 $('#customm_test').addClass('alert alert-error').html('Please select start datetime');
		 return false;
	 }
	 else if(edatetime == '')
	 {
		 $('#customm_test').addClass('alert alert-error').html('Please select end datetime');
		 return false;
	 }
	 else 
	 {
		//alert(resource_value);
		Custom.hideMessages();
	    $('#survey').css('border', '');
	    $('#type').css('border', '');
	    $('#customm_test').removeClass('alert alert-error').html('');
		    
		 eurl = SurveyView.base_url + "notes/updateReleasenote";
			
		 $.ajax({
		  url      : eurl,
		  type     : "POST",
		  datatype : "json",
		  data     : 
		  {
			  resourcevalue  : resource_value,
			  resoucekey : resouce_key,
			  resourceid : resource_id,
			  startdatetime : sdatetime,
			  enddatetime : edatetime
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#NotesResults').addClass('alert alert-success').html("Release Notes updated successfully") ;
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
		
		});
		 
	 }
	 
}