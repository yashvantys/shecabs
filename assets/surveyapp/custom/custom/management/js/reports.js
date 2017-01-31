var Reports = function() {
    return {
        loadPage: function(clientId) {
        	$('.report-link').on('click',function(e){
				var me = $(this);
				me.parent('.rpt-list-item').siblings().toggle('slow');
			});
			
			$('.generate').on('click',function(e){
				e.preventDefault();
				var me = $(this);
				var id = me.closest("form").attr('id');
				var fields = $("#"+id).serializeArray();
				var errorMessages = new Array();
				var params = new Array();
				$.each(fields, function(i, field){
					var element = $("#"+id).find('#'+field.name);
					var label = element.attr('data-label');
					if(element.attr('required')){
						if(field.value == ""){
							errorMessages.push("Please enter "+label);
						}
					}
					if(field.value != ""){
						if(element.hasClass('date')){
							var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
						    if (!(date_regex.test(field.value))) {
						    	errorMessages.push(label+" Must Be in mm/dd/yyyy format");
						    }else{
						    	/*var d = new Date(field.value);
								field.value = d.toISOString();*/
						    	field.value = field.value.replace(/\//g, "");
						    }
						}
						params[field.name] = field.value;
					}
				});
				if(errorMessages.length > 0){
                    Custom.showMessages("error", "Validation Error", errorMessages,'.'+id);
            		return false;
            	}else{
            		params['reprtSQLId'] = id;
            		var paramObject = $.extend({}, params);;
            		$('#'+id).trigger("reset");
            		$('#'+id).find('.select2').select2("val", "");
            		var url = SocialView.base_url + "management/reports/" + clientId + "/send-mail";
            		$.ajax({
                        url: url,
                        global: false,
                        type: "POST",
                        dataType: "json",
                        data : {params : paramObject},
                        beforeSend: function() {Custom.showLoader('body');},
                        complete: function() {Custom.hideLoader('body');},
                    })
                    .done(
                        function(json) {
                        	if (json['status']) {
                                if (json['status']['code'] == 200) {
                                	Custom.showMessages('success','',['An email will be send to your mailbox soon.'],'.'+id);
                                } else {
                                    if (json['status']['message']) {
                                        alert(json['status']['message']);
                                        return false;
                                    }
                                }
                            }
                        }).fail(function() {
                    }).always(function() {});
            	}
			});
		},
		scheduledReportsUpdate: function(clientId) {
			/* http://www.jasny.net/bootstrap/javascript/#fileinput */
            /* fileinput() is a method in bootstrap-fileupload.js */
            $('.fileinput').fileinput();
            /* change.bs.fileinput is an event in bootstrap-fileupload.js */
            $('.fileinput').on('change.bs.fileinput',function(e){
            	/*$('.upload-button').show();*/
            	$('.upload-button').trigger('click');
            });
            $('.fileinput').on('clear.bs.fileinput',function(e){
            	$('.upload-button').hide();
            });
            
            $('.fileinput').on('reset.bs.fileinput',function(e){
            	$('.upload-button').hide();
            });
            
            $(".upload-button").on("click", function(e) {
            	Custom.showLoader();
            });
		}
	};
}();			
			