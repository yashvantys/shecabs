var Administration = function() {
    return {
        home: function() {

        },
        ftpConfig: function() {

            var listColumns = [{
                "mData": "clientId",
                "orderable": false,
                "className": "text-center"
            }, {
                "mData": "remoteUrl",
                "orderable": false,
                "className": "text-center"
            }, {
                "mData": "folderPath",
                "orderable": false,
                "className": "text-center"
            }, {
                "mData": "userName",
                "orderable": false,
                "className": "text-center"
            }, {
                "mData": "password",
                "orderable": false,
                "className": "text-center",
                "mRender" : function(data, type, full) {
                	var html = "";
                	html = data;
                	
                	return html;
                }
            }, {
                "mData": "fileFormat",
                "orderable": false,
                "className": "text-center"
            }, {
                "mData": "id",
                "orderable": false,
                "className": "text-center",
                "mRender": function(data, type, full) {
                    var html = "";
                    html += '<a href="#" alert-id="' + data + '" class="btn btn-xs default delete-config"><i class="fa fa-times"></i> Delete</a>';
                    return html;
                }
            }];
            var dataTableObj = $(".ftp-configurations")
                .dataTable({
                    serverSide: false,
                    bLengthChange: false,
                    bProcessing: true,
                    searching: false,
                    iDisplayLength: 100,
                    order: [
                        [0, 'desc']
                    ],
                    ajax: {
                        url: SocialView.base_url + "admin/ftp-config-ajax",
                        type: 'POST',
                        dataType: 'json',
                        error: function() {
                            Custom
                                .showMessages(
                                    "error",
                                    "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
                        }
                    },
                    aoColumns: listColumns
                });
            
            
			$("body").on("click", ".delete-config", function(e){
				e.preventDefault();
				var me = $(this);
				bootbox.confirm("Are you sure?", function(result) {
					if(result){
						  var url = SocialView.base_url + "admin/delete-ftp-config/";
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  config_id : me.attr("alert-id")
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							  if(typeof json == 'object' && json.status.code == 200) {
								  Custom.showMessages("success", "Selected configuration deleted successfully!", [""]);
								 me.parents("tr").remove();
								  
							  } else{
								  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
							  }
						  });
					}
					}); 
			});
        },
        cron : function() {
			$(".cron_enable").on("click",function(){  
				$("#cron_action").val("cron_enable");
				$("#cron_id").val($(this).attr('cron-id'));
				$("#cron_param").val($(this).attr('status'));
				Metronic.blockUI({ target: '.main-content',animate: true,overlayColor: 'none'});
				$("#cron_form").submit();
				
			});
			$(".cron_lock").on("click",function(){  
				$("#cron_action").val("cron_lock");
				$("#cron_id").val($(this).attr('cron-id'));
				$("#cron_param").val($(this).attr('status'));
				Metronic.blockUI({ target: '.main-content',animate: true,overlayColor: 'none'});
				$("#cron_form").submit();
				
			});		
			
        },
        harvester: function(){
        	$('.merge-entities').on("click",function(e){
        		e.preventDefault();
        		var harvestList = {ids:[]};
        		$(".chkharvester").each(function(){
        			if($(this).attr("checked")) { 
        				harvestList.ids.push($(this).attr("data-id"));
        				}
        		});
        		
        		
        		  var url = SocialView.base_url + "admin/harvester_duplication_finder/";
				  $.ajax({
					  url : url,
					  type : "POST",
					  data : {
						  harvesterList : harvestList
					  },
					  beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
				  }).done(function(json){
					  if(typeof json == 'object' && json.status.code == 200) {
						  bootbox.alert("Harvesters submitted for merging.")
					  } else{
						 bootbox.alert("Error when merging harvester.")
					  }
				  });
        		
        		
        	})
        },
        referenceSubscription: function(className){
        	var url = SocialView.base_url + 'admin/user-search/';
            $('.' + className)
                .select2({
                    placeholder: 'Search a User',
                    allowClear: true,
                    minimumInputLength: 2,
                    ajax: {
                        url: url,
                        dataType: 'json',
                        quietMillis: 300,
                        data: function(term) {
                        	var data =  {
                                term: term
                            };
                            return data;
                        },
                        results: function(data) {
                            return {
                                results: $.map(data, function(item) {
                                    return {
                                        text: item.name + " (Email - " + item.email + ")",
                                        id: item.email
                                    }
                                })
                            };
                        }
                    }
             });
            
            $('.add-to-reference').click(function(e){
            	e.preventDefault();
            	var email = $('.user-load').select2('val');
            	var role = $('.role').select2('val');
            	var errorMessages = new Array();
            	if(email == ""){
            		errorMessages.push("Please select User.");
            	}
            	if(role == ""){
            		errorMessages.push("Please select Role.");
            	}
            	if(errorMessages.length > 0){
            		Custom.showMessages("error", "Validation Error",errorMessages);
            	}else{
            		$.ajax({
                        url: SocialView.base_url + "admin/add-to-reference/",
                        type: "POST",
                        data: {
                        	email: email,
                        	role: role
                        },
                        beforeSend: function() {
                            Custom.showLoader();
                        },
                        complete: function() {
                            Custom.hideLoader();
                        }
                    }).done(function(json) {
                        if (json['status']) {
                            if (json['status']['code'] == 200) {
                            	Custom.showMessages("success", "Success",["The User with email "+email+" is successfully added to Reference Subscription"]);
                            }else if (json['status']['code'] == 400) {
                            	Custom.showMessages("error", "Already Exist",[json['status']['message']]);
                            } else {
                                if (json['status']['message']) {
                                    alert(json['status']['message']);
                                    return false;
                                }
                            }
                        }
                    }).fail(function() {}).always(function() {});
            	}
            	return false;
            });
            
            $('.remove-from-reference').click(function(e){
            	e.preventDefault();
            	var email = $('.user-load').select2('val');
            	var errorMessages = new Array();
            	if(email == ""){
            		errorMessages.push("Please select User.");
            	}
            	if(errorMessages.length > 0){
            		Custom.showMessages("error", "Validation Error",errorMessages);
            	}else{
            		Custom.showConfirm("Are you sure you want to delete "+email+" ?","","Yes","No"
                			,function(result){
                		if(result){
                			$.ajax({
		                        url: SocialView.base_url + "admin/remove-from-reference/",
		                        type: "POST",
		                        data: {
		                        	email: email
		                        },
		                        beforeSend: function() {
		                            Custom.showLoader();
		                        },
		                        complete: function() {
		                            Custom.hideLoader();
		                        }
		                    }).done(function(json) {
		                        if (json['status']) {
		                            if (json['status']['code'] == 200) {
		                            	Custom.showMessages("success", "Success",["The User with email "+email+" is successfully removed from Reference Subscription"]);
		                            }else {
		                                if (json['status']['message']) {
		                                    alert(json['status']['message']);
		                                    return false;
		                                }
		                            }
		                        }
		                    }).fail(function() {}).always(function() {});
            		
                		}
            		});
            	}
            	return false;
            });
        }
    };
}();