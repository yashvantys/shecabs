var users = function () {
	return{
		init:function(client_id,report_id,encoded_filter){
			
		},
	
		scheduledReport:function(){
			$(".delete-scheduled-report").on("click",function(){
				var selectedReport = $(this).attr('rel');
				var url = SocialView.base_url + 'users/' + SocialView.client_id + '/delete-schedule';
				$("#draggable").modal('show');
				
				$(".delete-schedule").on("click",function(){
					
					
					$('.delete-schedule').prop('disabled', true);
					Metronic.blockUI({
		                target: '#draggable',
		                overlayColor: 'none',
		                animate: true
		            });
                            $.ajax({
                                url: url,
                                data: {
                                    schedule_id: selectedReport
                                },
                                type: "POST",
                                error: function(error) {
                                    window.location.reload();
                                }
                            }).done(function(data) {
                            	if(data.status=='success'){
                            		Custom.showMessages("success", "Selected report deleted successfully!", [""]);
                            	}else{
                            		Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                            	}
                            	Custom.hideLoader();
                            	$('#reportTable').dataTable()._fnAjaxUpdate();
                            });
                            return true;
				});
				
			});
			
			$('body').on("click",".verification-all",function(){
				msg = "Are you sure want to switch the report(s) to";
				var type = $(this).data('type');
				var ids = [];
				
				$(".tbl-schedule-list .check-box-each:checked").each(function() {
					ids.push($(this).val());
				});
				
				if (ids.length > 0) {
	  				bootbox.confirm( msg + " " + type + " verification?", function(res){ if(!res){
						verificationMethod(ids,type);
					}});
				} else {
					alert("Please select report");
				}
			});
			
			
			$('body').on("click",".delete-scheduled-report-user",function(){
				var client_id = $(this).attr("client-id");
				var rel = $(this).attr("rel");
				var selectedReport = "";
				var scheduleId = null;
				var paramString ="?";
				if ($(this).hasClass('single')) {
					paramString += "scheduleId=" + ($(this).data("id"));
					scheduleId = ($(this).data("id"));
				} else {
				 $(".check-box-each1:checked").each(function() {
					 paramString += "scheduleId="+($(this).val())+"&";
					 scheduleId =  ($(this).val());
				    });
				}
				var url = SocialView.base_url + 'users/' + client_id + '/delete_schedule/' + paramString;
				if ($(this).hasClass('single')) {
					$("#draggable-modal").modal('show');
				} 
				else {
					if (scheduleId) {
						$("#draggable-modal").modal('show');
					} else {
						alert("Please select scheduled report");
						return false;
					}
				}
			
				$('body').on("click",".delete-schedule-user",function(){
					if(url){
						$.ajax({
                            url: url,
                            data: {
                            	saved_config_id: paramString
                            },
                            type: "POST", 'dataType': 'json',
                            error: function(error) {
                                window.location.reload();
                            }
                        }).done(function(data) {
                        	if(data.status=='success'){
                        		Custom.showMessages("success", "Selected report deleted successfully!", [""]);
                        	}else{
                        		Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                        	}
                        	$("#draggable-modal").modal('hide');
                        	$('#reportTable').dataTable()._fnAjaxUpdate();
                        	$('.select-all-check1').parent('span').removeClass("checked");
    		            	$('.select-all-check1').attr("checked",false);
                        });
                        return true;
					}
					else{
						return false;
					}
                            
				});
				
				
			});
			
			$("body").on("click",".select-all-check",function(){
				if(this.checked) { // check select status
		            $('.check-box-each').each(function() { //loop through each checkbox
		            	$('.check-box-each').parent('span').addClass("checked");
		                $('.check-box-each').attr("checked","checked");  //select all checkboxes with class "checkbox1"               
		            });
		        }else{
		            $('.check-box-each').each(function() { //loop through each checkbox
		            	$('.check-box-each').parent('span').removeClass("checked");
		            	$('.check-box-each').attr("checked",false);  //deselect all checkboxes with class "checkbox1"                       
		            });         
		        }
			});
			
			$("body").on("click",".select-all-check1",function(){
				if(this.checked) { // check select status
		            $('.check-box-each1').each(function() { //loop through each checkbox
		            	$('.check-box-each1').parent('span').addClass("checked");
		                $('.check-box-each1').attr("checked","checked");  //select all checkboxes with class "checkbox1"               
		            });
		        }else{
		            $('.check-box-each1').each(function() { //loop through each checkbox
		            	$('.check-box-each1').parent('span').removeClass("checked");
		            	$('.check-box-each1').attr("checked",false);  //deselect all checkboxes with class "checkbox1"                       
		            });         
		        }
			});
			
		}
		
	};
}();

function verificationMethod(ids,method) {
	  var url = SocialView.base_url + "users/" + SocialView.client_id + "/report_verification";
	  $.ajax({
		  url : url,
		  type : "POST",
		  data : {
			  scheduleId :ids,
			  'method':method
		  },
		  beforeSend: function(){
				Custom.showLoader();
			},
			complete: function(){
				Custom.hideLoader();
			},
	  }).done(function(json){
		  console.log(json);
		 /* if(typeof json == 'object' && json.status.code == 200) {
			  Custom.showMessages("success", "Selected rule deleted successfully!", [""]);
		  } else{
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }*/
	  });
}
$("body").on("click", ".delete-alert-user", function(e){
	e.preventDefault();
	var client_id = $(this).attr("client-id");
	var me = $(this);
	var ruleId = null;
	var paramString="";
	
	if ($(this).hasClass('single')) {
		paramString += "" + ($(this).data("id"));
		ruleId = ($(this).data("id"));
	} else {
		 $(".check-box-alert-each:checked").each(function() {
			 paramString += ""+($(this).val())+",";
			 ruleId =  ($(this).val());
		    });
	}
	if(ruleId){
	bootbox.confirm("Are you sure?", function(result) {
		if(result){
			  var url = SocialView.base_url + "users/" + client_id + "/delete_rule";
			  $.ajax({
				  url : url,
				  type : "POST",
				  data : {
					  rule_id: paramString
				  },
				  beforeSend: function(){
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
			  }).done(function(json){
				  if(typeof json == 'object' && json.status.code == 200) {
					  Custom.showMessages("success", "Selected rule deleted successfully!", [""]);
				  } else{
					  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				  }
				  
				  $('#ruleTable').dataTable()._fnAjaxUpdate();
				  $('.select-all-check').parent('span').removeClass("checked");
				  $('.select-all-check').attr("checked",false);
			  });
			  
		}
		});  }
	else{
		alert("Please select alert");
		return false;
	}
});
