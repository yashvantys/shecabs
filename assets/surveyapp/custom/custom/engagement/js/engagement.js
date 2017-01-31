var engagement = function() {
    return {
    	engagementMangement: function() {
    		var client = "";
    	
    		
       	 var columns = [
         {
        	 "data" : "clientName",
             "orderable": true,
         }, 
         {
        	 "data" : "retryCount",
             "orderable": true,
         },
         {
        	 "data" : "url",
             "orderable": true,
         }, 
         {
        	 "data" : "error",
             "orderable": true,
         },
         {
        	 "data" : "entity",
             "orderable": true,
         },
         {
        	 "data" : "action",
             "orderable": false,
         },
         ];

         var dataTable = $('#engagement-management').dataTable({
             serverSide: false,
             bLengthChange: false,
             bProcessing: true,
             bFilter: false,
             order: [
                 [1, "desc"]
             ],
             iDisplayLength: 100,
             "aoColumnDefs": [{
                 "sClass": "text-left",
                 "aTargets": [0, 1]
             }],
             ajax: {
                 url: SocialView.base_url + "management/harvester/admin/engagement-details-list",
                 type: 'POST',
                 data: function (d){
                	 d.client = client;
                     },
                 dataType: 'json',
                 error: function() {
                     Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                 }
             },
             columns: columns
         });
         
     	$(".harvester_submit").on("click",function(){
        	  client = $(".select_client").val();
        	  dataTable.api().ajax.reload();
            });
          $('.harvesters-error-management').on('click', '.edit_url', function(){
        	  var source_edit_id = $(this).attr("source_edit_id");
        	  var source_edit_url = $(this).attr("source_edit_url");
        	  if(source_edit_id && source_edit_url){
        		  $(".load_url").val(source_edit_url);
        		  $(".load_url_id").val(source_edit_id);
        		  $('#edit_url').modal('show');
        	  }
              	
              });
          
          $('.harvesters-error-management').on('click', '.delete', function(){
        	  var source_delete_id = $(this).attr("source_delete_id");
        	  if(source_delete_id){
        		  $(".load_url_id").val(source_delete_id);
        		  $('#delete').modal('show');
        	  }
            });
          
          $('.harvesters-error-management').on('click', '.escalate', function(){
        	  var source_escalate_id = $(this).attr("source_escalate_id");
        	  if(source_escalate_id){
        		  $(".load_url_id").val(source_escalate_id);
        		  $('#escalate').modal('show');
        	  }
              });
          
          $(".edit-url-submit").on("click",function(){
        	  var load_url = $(".load_url").val();
    		  var load_url_id = $(".load_url_id").val();
    		  $.ajax({
                  url: SocialView.base_url + "management/harvester/admin/update-harvester-url",
                  data: {
                	  id:load_url_id,
                	  url:load_url,
                	  type : 'edit'
                  },
                  type: "POST",
                  error: function(error) {
                      Custom.showMessages("error", "An error occurred.", "Sorry for the inconvenience. Please try again later.");
                  }
              }).done(function(data) {
            	  Custom.showMessages("success","Selected Harvester URL updated successfully!", [""]);
            	  window.location.reload();
            	  
              });
            });
          
        	  $(".delete_url_submit").on("click",function(){
        	  var load_url_id = $(".load_url_id").val();
    		  $.ajax({
                  url: SocialView.base_url + "management/harvester/admin/update-harvester-url",
                  data: {
                	  id:load_url_id,
                	  type : "delete_url"
                  },
                  type: "POST",
                  error: function(error) {
                      Custom.showMessages("error", "An error occurred.", "Sorry for the inconvenience. Please try again later.");
                  }
              }).done(function(data) {
            	  Custom.showMessages("success","Selected Harvester deleted successfully!", [""]);
            	  window.location.reload();
              });
            });
          
        	  $(".escalate_url_submit").on("click",function(){
        	  var load_url_id = $(".load_url_id").val();
    		  $.ajax({
                  url: SocialView.base_url + "management/harvester/admin/update-harvester-url",
                  data: {
                	  id:load_url_id,
                	  type : "escalate"
                  },
                  type: "POST",
                  error: function(error) {
                      Custom.showMessages("error", "An error occurred.", "Sorry for the inconvenience. Please try again later.");
                  }
              }).done(function(data) {
            	  Custom.showMessages("success","Selected Harvester Escalated successfully!", [""]);
            	  window.location.reload();
              });
            });
        	  $(".datepicker").datepicker({
                  orientation: "left",
                  autoclose: true,
                  dateFormat: "yy-mm-dd"
              }); 
        }
    }
}();