var Affiliated = function() {
    return {
    	home: function(){
    		$('.learn-more').click(function(e){
    			var me = $(this);
    			var div = me.attr('href');
    			$('#more').toggle();
    			 $('html,body').animate({
    			        scrollTop: $(div).offset().top},
    			        'slow');
    		});
    	},
    	timezone: function(){
    		var offset = new Date().getTimezoneOffset();
    		$('#offset').val(offset);
    	},
        upload: function(clientId,encodedData) {
        	$.ajax({
                url: SocialView.base_url + "affiliated/" + clientId + "/upload_template/" + encodedData,
                type: 'POST',
                beforeSend: function() {
                    Custom.showLoader();
                },
                complete: function() {
                    //Custom.hideLoader();
                }
            }).done(function(json) {
            	var template = jQuery.parseJSON(json);
            	var stutus = '';
            	if(template.task){
            		var task = template.task;
            		if(task.status == 'error'){
            			Custom.showMessages("error", "Validation Error", [task.message],'.page-bar',100);
            			Custom.hideLoader();
            		}else{
            			status = task.status;
            		}
            	}
            	if(status == 'Q'){
            		Custom.showMessages("info", "Processing", [task.message],'.page-bar',100);
            		Affiliated.taskHandler(clientId,task.id);
            	}else{
            		if(template['data']){
	            		var popUpContent = template['popUpContent'];
	                	var columns = template['data'];
	                	var dropdowns = {};
	                	var items = {};
	                	$.each(columns, function(i, obj) {
	                		columns[i].defaultContent = "";
	                		columns[i].mRender = 
	    	            		function(data, type, full) {
	                				if (full.type == "existing") {
	                					if (obj.type == "id") {
	        	            				return "<input type='checkbox' name='"+obj.id+"' class='input-sm' value='" + data + "' >";
	        	            			}else{
	        	            				var key = obj.id+"Id";
	        	            				var content = "";
	        	            				if(obj.id != "actions" && obj.id != "id"){
	    	    	            				if(key in full){
	    	    	            					content = '<input type="hidden" data-text="'+data+'" id="'+obj.id+'" value="'+full[key]+'">';
	    	    	            				}else{
	    	    	            					content = '<input type="hidden" data-text="" id="'+obj.id+'" value="'+data+'">';
	    	    	            				}
	        	            				}
	        	            				if(typeof (data) =='undefined' )
	        	            					return null;
	        	            				return data + content;
	        	            			}
	                				}
	    	            		};
	                    });
	                    var dataTable = $('.upload-table').dataTable({
	        	                serverSide: false,
	        	                bLengthChange: false,
	        	                bProcessing: true,
	        	                order: [
	        	                    [2, "asc"]
	        	                ],
	        	                iDisplayLength: 100,
	        	                ajax: {
	        	                    url: SocialView.base_url + "affiliated/" + clientId + "/uploaded_physicians/" + encodedData,
	        	                    type: 'POST',
	        	                    data: {
	        	                    	//token: token
	        	                    },
	        	                    dataType: 'json',
	        	                    error: function() {
	        	                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"],'.page-bar',100);
	        	                    }
	        	                },
	        	                columns: columns,
	        	                dom:  "<'col-md-12 table-title'<'col-xs-7 caption upload-physicians standard-title without-border'><'pull-right search'f>><'row'<'col-md-6 col-sm-5'l><'col-md-6 col-sm-12'>r><'table-scrollable't><'row'<'col-md-12 col-sm-12 phy-del pull-left'><'col-md-12 col-xs-12'<'pull-right upload-pagination'p><'pull-right shows'i>>>",
	        	                buttons: [
	        	                          //{text:"Add Physician",title:"Add Physician",className:"add-physician-row btn btn-circle btn-info",action:function(e,t,n,a){}},
	        	                          //{text:"Upload Physician",title:"Upload Physician",className:"upload-physician btn btn-circle btn-info",action:function(e,t,n,a){}}
	        	                      ],
	        	                "language": {
	        	                	"emptyTable": "Physicians cart is empty",
	        	                	"sSearch": ""
	        	                },
	        	                "initComplete": function(settings, json) {
	        	                	$('.upload-table-portlet').addClass('properties');
	        	                	$(".phy-validation").on("click", function(e) {
	        	        				e.preventDefault();
	        	        				var me = $(this);
	        	        				var itemId = me.attr('auto-id');
	        	        				var row = me.parents("tr");
	        	        				Custom.showLoader(row);
	        	        				var column = me.parents("td");
	        	        				var preFilledData = new Array();
	        	        				var preErrorMessages = new Array();
	        	        				row.find(":hidden").each(function() {
	        	        					var hiddenFields = $(this);
	        	        					if(hiddenFields.attr("id") != "undefined"){
	        	        						preFilledData[hiddenFields.attr("id")] = [];
	        	        						preFilledData[hiddenFields.attr("id")]['id'] = hiddenFields.val();
	            	        					preFilledData[hiddenFields.attr("id")]['text'] = hiddenFields.attr('data-text');
	        	        					}
	        	        				});
	        	        				column.find(".validation").each(function() {
	        	        					var validation = $(this);
	        	        					preErrorMessages.push(validation.val());
	        	        				});
	        	        				phyPopUp(row,preFilledData,preErrorMessages,itemId);
	        	        			});
	        	                	
	        	                	if(settings.jqXHR != null){
	        	                		if($.parseJSON(settings.jqXHR.responseText).taskLogs){
	        	                			var taskInfo = $.parseJSON(settings.jqXHR.responseText).taskLogs;
	        	                			preErrorMessages = new Array();
	                	                	$.each(taskInfo,function(k,v){
	                	                		preErrorMessages.push(v.message);
	                	                	});
	                	                	Custom.showMessages("error", "Your last Upload task has following issues.", preErrorMessages,'.page-bar',100);
	        	                		}
	        	                	}
	        	                },
	        	                "drawCallback": function( settings ) {
	        	                	var api = this.api();
	        	                	$count = 0;
	        	                	if(api.rows( {page:'current'} ).data().length == 0){
	        	                		$('.continue').hide();
	        	                		$count++;
	        	                	}else{
	        	                		$('.phy-del').html( '<a href="#" role="button" class="btn btn-primary delete-physicians">Remove Physicians</a>');
	        	                	}
	        	                	if($('.upload-table').find('.phy-validation').length > 0){
	                                	$('.continue').hide();
	                                	$('.alert.error-alert').show();
	                                	$count++;
	                            	}else{
	                            		$('.alert.error-alert').hide();
	                            	}
	        	                	if($count == 0){
	        	                		$('.continue').show();
	        	                	}
	        	                	if(settings.jqXHR != null){
	        	                		if($.parseJSON(settings.jqXHR.responseText).transactionInfo){
	        	                			var transactionInfo = $.parseJSON(settings.jqXHR.responseText).transactionInfo;
	                	                	$('.total-number-of-physicians .value').html(transactionInfo.count);
	                                    	$('.cost-per-physician .value').html('$ '+transactionInfo.productCost+'/Year');
	                                    	$('.total-cost .value').html('$ '+transactionInfo.totalCost);
	        	                		}
	        	                	}
	        	                	$('.upload-table').find('th,td').addClass('vertical-align-middle');
	        	                },
	        	                "footerCallback": function( tfoot, data, start, end, display ) {
	        	                	$('.phy-del').html('');
	        	                }
	                    	});
	                    
	                    $("div.caption").html('New Physicians');
	                    $('div.dataTables_filter input').addClass('input-circle');
	                    $('div.dataTables_filter input').attr("placeholder", "Search...");
	                    
	                    function phyPopUp(row,preFilledData,preErrorMessages,itemId){
	                    	preErrorMessages = preErrorMessages || new Array();
	            			preFilledData = preFilledData || new Array();
	            			itemId = itemId || 0;
	                    	var object = $('<div/>').html(popUpContent).contents();
	                    	object.find('.select2.parent').select2({ data:[{"id":"","text":""}] });
	                    	var parentUrl = SocialView.base_url + "affiliated/" + clientId + "/get-parent/" + encodedData;
	                    	object.find('input.select2.parent')
	                        .select2({
	                            allowClear: true,
	                            minimumInputLength: 3,
	                            ajax: {
	                                url: parentUrl,
	                                dataType: 'json',
	                                quietMillis: 300,
	                                type: "POST",
	                                data: function(term) {
	                                	var data =  {
	                                        term: term,
	                                        type: this.attr('data-avatarType')
	                                    };
	                                	return data;
	                                },
	                                results : function(data) {
	    								return {
	    									results : $.map(data, function(item) {
	    										return {
	    											text : item.text,
	    											id : item.id
	    										}
	    									})
	    								};
	    							},
	                            },
	                            initSelection: function(element, callback) {
	                            	var name = element[0]['name'];
	                            	if(preFilledData[name]){
	                            		return callback({id: preFilledData[name]['id'], text: preFilledData[name]['text']});
	                            	}
	                            	return '[]';
	                            }
	                        });
	                    	object.find('.select2.child').select2({ data:[{"id":"","text":""}] });
	                    	object.find('.select2.parent').on("change", function(e, data) {
	                    		var me = $(this);
	                    		var parentId = me.val();
	                    		if(data){
	                    			var async = data.async || true; 
	                    		}
	                    		
	                    		if(parentId != null && parentId != "") {
	                    			
	                        		var type = me.attr('data-childType');
	            					var childId = me.attr('data-childId');
	            					$('.'+childId).select2({ data:[{"id":"","text":""}] });
	            					url = SocialView.base_url + "affiliated/" + clientId + "/get-children/" + encodedData;
	                                $.ajax({
	                                        url: url,
	                                        global: false,
	                                        type: "POST",
	                                        async: false,
	                                        dataType: "json",
	                                        data : {parentId : parentId,type : type},
	                                        beforeSend: function() {Custom.showLoader('.modal-body');},
	                                        complete: function() {Custom.hideLoader('.modal-body');}
	                                    })
	                                    .done(
	                                        function(json) {
	                                        	var sources = {};
	                                            if (json['data']) {
	                                                var data = new Array();
	                                                data = json['data'];
	                                                $('.'+childId).select2({
	                                                    data: data
	                                                });
	                                            }
	                                        }).fail(function() {
	                                    }).always(function() {});
	                    		}
	                    	});
	                    	/*var box = bootbox.dialog({
	            				message : object,
	            				title : "Add Physician",
	            				backdrop: 'static',
	            			    keyboard: false
	            			});
	                    	box.on("shown.bs.modal", function() {
	                    		Custom.hideLoader(row);
	                    	});*/
	                    	$('.add-physician-portlet').html(object);
	            			if(preErrorMessages.length){
	            				Custom.showMessages("error", "Validation Error", preErrorMessages,'.page-bar',100);
	            			}
	            			for (var index in preFilledData) {
	            				$('.upload-physician-form').find("."+index).val(preFilledData[index]['id']);
	            				if($('.upload-physician-form').find("."+index).hasClass( "parent" )){
	            					$('.upload-physician-form').find("."+index+".parent").trigger( "change", [{async:false}] );
	            				}
	            				$('.upload-physician-form').find(".select2.child."+index).select2("val",preFilledData[index]['id']);
	            			}
	            			Custom.hideLoader(row);
	            			
	            			object.find('.phy-add').on("click",  function(e) {
	                            e.preventDefault();
	                            var me = $(this);
	                        	var params = new Array();
	                        	var errorMessages = new Array();
	                        	$.each(columns, function(i, obj) {
	                        		if(!(obj.id == "id" || obj.id == "actions")){
	                        			if(!(obj.type == "checkbox" || obj.type == "label")){
	                                    	var val = "";
	                                    	if(obj.type == "textarea"){
	                                    		val = $('.upload-physician-form').find("textarea[name='"+obj.id+"']").val();
	                                    	}else if(obj.type == "text"){
	                                    		val = $('.upload-physician-form').find("."+obj.id).val();
	                                    	}else if(obj.type == "dropdown"){
	                                    		if($('.upload-physician-form').find("."+obj.id).select2('val') != ""){
	                                    			if($('.upload-physician-form').find("."+obj.id).select2('data') != null){
	                                    				val = $('.upload-physician-form').find("."+obj.id).select2('data').text;
	                                        			params[obj.id+"Id"] = $('.upload-physician-form').find("."+obj.id).select2('val');
	                                    			}
	                                    		}else{
	                                    			params[obj.id+"Id"] = "";
	                                    		}
	                                    	}
	                                    	val = $.trim(val);
	                                    	if(val == ""){
	                                    		if($('#'+obj.id+'-error').length > 0){
	                                    			$('#'+obj.id+'-error').text('Please enter '+obj.name);

	                                    		}else{
		                                    		$("#"+obj.id).after('<label id="'+obj.id+'-error" class="error" for="'+obj.id+'">Please enter '+obj.name+'</label>');
	
	                                    		}
	                                    		errorMessages.push('Please enter '+obj.name);
	                                    	}else{
	                                    		if(val){
//		                                    		if($('#'+obj.id+'-error').length > 0){
//		                                    			$('#'+obj.id+'-error').hide();
//
//		                                    		}
		                                    		if(obj.validation){
		                                    			var validationUploadMsg ='';
		                                    			validationUploadMsg = Affiliated.validationUpload(obj.name, val, obj.validation, validationUploadMsg);
		                                    			if(validationUploadMsg !=''){
		                                    				if($('#'+obj.id+'-error').length > 0){
				                                    			$('#'+obj.id+'-error').text(validationUploadMsg);

				                                    		}else{
					                                    		$("#"+obj.id).after('<label id="'+obj.id+'-error" class="error" for="'+obj.id+'">'+validationUploadMsg+'</label>')
				
				                                    		}
			                                    			errorMessages.push(validationUploadMsg);

		                                    			}else{
			                                    			$('#'+obj.id+'-error').html('');

		                                    			}
		                                    		}else{
		                                    			$('#'+obj.id+'-error').html('');
		                                    		}
		                                    	}
	                                    	}
	                                    	
	                                    	val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	                                    	params[obj.id] = val;
	                                    }
	                        		}
	                            });
	                        	params['itemId'] = itemId;
	                        	var paramObject = $.extend({}, params);
	                            if(errorMessages.length > 0){
	                                /*Custom.showMessages("error", "Validation Error", errorMessages,'.popup-validation');*/
//	                                Custom.showMessages("error", "Validation Error", errorMessages,'.page-bar',100);
	                        		return false;
	                        	}
	                            $.ajax({
	                            	url: SocialView.base_url + "affiliated/" + clientId + "/add-physicians/" + encodedData,
	                            	type: 'POST',
	                            	data: {
	                                	params: paramObject,
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
	                                    		if(json['validationErrorCount'] == 0){
	                                    			row = row || '';
	                                    			if(row != null && row != ""){
	                                    				//removing the deleted row from datatable starts
	            		                                var rowIndexTORemove = dataTable.fnGetNodes(row);
	            		                                dataTable.fnDeleteRow(rowIndexTORemove);
	            		                                //removing the deleted row from datatable ends
	                                    			}
	                                    			var rowIndex = dataTable.fnAddData(json["data"]);
	                                                if(json['transactionInfo']){
	                                                	$('.total-number-of-physicians .value').html(json['transactionInfo'].count);
	                                                	$('.cost-per-physician .value').html('$ '+json['transactionInfo'].productCost);
	                                                	$('.total-cost .value').html('$ '+json['transactionInfo'].totalCost);
	                                                }
	                                                $.each(columns, function(i, obj) {
	            	                                    $('.upload-physician-form').find("textarea[name='"+obj.id+"']").val('');
	            	                                    $('.upload-physician-form').find("."+obj.id).val('');
	            	                                    $('.upload-physician-form').find("."+obj.id).select2('val','');
	                                                });
	                                                Custom.hideMessages();
	                                                Custom.showMessages('success','',['Physician(s) added successfully.'],'.page-bar',100);
	                                    		}else{
	                                    			var errorMessages = new Array();
	                                        		var content = json['data'];
	                                        		$.each(content, function(i, obj) {
	                                        			if(obj.validation){
	                                        				var validation = obj.validation;
	                                        				$.each(validation, function(validationKey, validationObject) {
	                                        					errorMessages.push(validationObject.message);
	                                        				});
	                                        			}
	                                        		});
	                                        		Custom.showMessages("error", "Validation Error", errorMessages,'.page-bar',100);
	                                    		}
	                                    	} else {
	                                        	if (json['status']['message']) {
	                                            	alert(json['status']['message']);
	                                                return false;
	                                            }
	                                        }
	                                    }
	                               }).fail(function() {}).always(function() {});
	                            return false;
	                        });
	                        $('.popup-close').live("click",  function(e) {
	                            e.preventDefault();
	                            $('.bootbox.modal').modal('hide');
	                        });
	                    }
	                    
	                    $('.upload-physician').on("click", function(e) {
	                        	e.preventDefault();
	                        	var uploadContainer = $(".upload-container").html();
	                        	bootbox.dialog({
	                				message : uploadContainer,
	                				title : "Multiple Physicians Spreadsheet",
	                				id : "upload",
	                				backdrop: 'static',
	                			    keyboard: false,
	                			    onEscape: function() {
	                			    	$('.upload-button').hide();
	                			    }
	                			});
	                        	
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
	                            	Custom.showLoader('.bootbox-body');
	                            });
	                        });
	                    
	                    $(".select-all").on("click", function(e) {
	                        if ($('.select-all').is(':checked')) {
	                            $('.upload-table tbody input[type="checkbox"]:not(:checked)').trigger('click');
	                        } else {
	                            $('.upload-table tbody input[type="checkbox"]').prop('checked', false);
	                        }
	                    });
	                    
	                    $('.price-detail').show();
	                    
	                    phyPopUp();
	                    Affiliated.npi(clientId,encodedData);
	                    Affiliated.heightAdjust('.add-physician-portlet','.price-detail');
	                    
	                    $(".add-physician-row").on("click", function(e) {
	                    	e.preventDefault();
	                    	var me = $(this);
	                        phyPopUp();
	                    });
	                    
	                    $('.upload-table').on("click", ".phy-delete", function(e) {
	                        e.preventDefault();
	                        var me = $(this);
	                        Custom.showConfirm("Are you sure you want to delete ?","","Yes","No"
	                    			,function(result){
	                    		if(result){
	    			                        var row = me.parents("tr");
	    			                        var physiciansId = new Array();
	    			                        physiciansId[0] = me.attr("auto-id");
	    			                        if(physiciansId[0] == 0){
	    			                        	//removing the deleted row from datatable starts
	    		                                var rowIndexTORemove = dataTable.fnGetNodes(row);
	    		                                dataTable.fnDeleteRow(rowIndexTORemove);
	    		                                //removing the deleted row from datatable ends
	    			                        }else{
	    			                        	$.ajax({
	    				                            url: SocialView.base_url + "affiliated/" + clientId + "/delete-physician/" + encodedData,
	    				                            type: "POST",
	    				                            data: {
	    				                            	physiciansId: physiciansId
	    				                            },
	    				                            beforeSend: function() {
	    				                                Custom.showLoader(me.parents("tr"));
	    				                            },
	    				                            complete: function() {
	    				                                Custom.hideLoader(me.parents("tr"));
	    				                            }
	    				                        }).done(function(json) {
	    				                            if (json['status']["code"] == 200) {
	    				                                //removing the deleted row from datatable starts
	    				                                var rowIndexTORemove = dataTable.fnGetNodes(row);
	    				                                dataTable.fnDeleteRow(rowIndexTORemove);
	    				                                //removing the deleted row from datatable ends
	    				                                if(json['transactionInfo']){
	    	                                            	$('.total-number-of-physicians .value').html(json['transactionInfo'].count);
	    	                                            	$('.cost-per-physician .value').html('$ '+json['transactionInfo'].productCost);
	    	                                            	$('.total-cost .value').html('$ '+json['transactionInfo'].totalCost);
	    	                                            }
	    				
	    				                            }
	    				                        }).fail(function() {
	    				                        }).always(function() {
	    				                        });
	    			                        }
	    			                       
	                    		}
	                        });
	                        return false;
	                    });
	                    $(".delete-physicians").live("click", function(e) {
	                        e.preventDefault();
	                        var className = 'delete-physicians';
	                        var url = SocialView.base_url + "affiliated/" + clientId + "/delete-physician/" + encodedData;
	                        Affiliated.updatePhysician(className, url, "delete");
	                    });
            		}
            		Custom.hideLoader();
            	}
            }).fail(function() {}).always(function() {});
        	
        },
        heightAdjust: function(firstDiv,secondDiv){
        	var firstDivHeight = $(firstDiv).height();
        	var secondDivHeight = $(secondDiv).height();
        	if(firstDivHeight > secondDivHeight){
        		$(secondDiv).css({'height':firstDivHeight});
        	}
        },
        updatePhysician: function(className, url, updateType) {
            if ($(".upload-table input:checkbox:checked").length == 0) {
                bootbox.alert("Please select physicians!");
                return false;
            }
            if (updateType == "delete") {
            	Custom.showConfirm("Are you sure you want to delete ?","","Yes","No"
            			,function(result){
            		if(result){
            			var dataTable = $('.upload-table').dataTable();
            			var rows = $(".upload-table tbody input:checkbox:checked").parents("tr");
            			var physiciansId = $(".upload-table tbody input:checkbox:checked").map(function() {
            				if($(this).val() != 0){
            					return $(this).val();
                            }
                        }).get();
            			$.each(rows, function(i, obj) {
                        	var val = $(obj).find('input:checkbox').val();
                        	if(val == 0){
                        		var nodes = dataTable.fnGetNodes(obj);
                                dataTable.fnDeleteRow(nodes);
                        	}
                        });
            			if(physiciansId.length > 0){
            				$.ajax({
                                url: url,
                                type: "POST",
                                data: {
                                	physiciansId: physiciansId
                                },
                                beforeSend: function() {
                                    Custom.showLoader('.' + className);
                                },
                                complete: function() {
                                    Custom.hideLoader('.' + className);
                                },
                            }).done(function(json) {
                                if (json['status']) {
                                    if (json['status']['code'] == 200) {
                                        if (updateType == 'delete') {
                                            $.each(rows, function(i, obj) {
                                            	var val = $(obj).find('input:checkbox').val();
                                            	if(val != 0){
                                            		var nodes = dataTable.fnGetNodes(obj);
                                                    dataTable.fnDeleteRow(nodes);
                                            	}
                                            });
                                            if(json['transactionInfo']){
                                            	$('.total-number-of-physicians .value').html(json['transactionInfo'].count);
                                            	$('.cost-per-physician .value').html('$ '+json['transactionInfo'].productCost);
                                            	$('.total-cost .value').html('$ '+json['transactionInfo'].totalCost);
                                            }
                                        }
                                    } else {
                                        if (json['status']['message']) {
                                            alert(json['status']['message']);
                                            return false;
                                        }
                                    }
                                }
                            }).fail(function() {}).always(function() {});
            			}
            		}
            	});
            }
        },
        validation : function(name, val, validation, errorMessages){
        	switch (validation) {
        	case "email":
        		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        		if(!regex.test(val))
        			 errorMessages.push("Please enter a valid email address");
	            break;
	        case "npi":
	        	if (val.length != 10) {
	        		errorMessages.push("Please enter only digits.");
                }
                if (isNaN(val) || val < 0) {
                	errorMessages.push("Please enter only digits.");
                }
	            break;
	        default:
	        	break
        	}
	        return errorMessages;
        },
        validationUpload : function(name, val, validation, errorMessage ){
        	switch (validation) {
        	case "email":
        		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        		if(!regex.test(val))
        			 errorMessage="Please enter a valid email address";
	            break;
	        case "npi":
	        	if (val.length != 10) {
	        		errorMessage ="NPI should be 10 Digit";
                }
                if (isNaN(val) || val < 0) {
                	errorMessage ="NPI should be a 10 digit positive number";
                }
	            break;
	        default:
	        	break
        	}
	        return errorMessage;
        },
        taskHandler : function(clientId,taskId){
        	$.ajax({
                url: SocialView.base_url + "affiliated/" + clientId + "/task-handler/" + taskId,
                type: 'POST',
                beforeSend: function() {
                },
                complete: function() {
                }
            }).done(function(json) {
            	if (json['status']) {
                	if (json['status']['code'] == 200) {
                		if(json['task']){
                			if(json['task']['status'] == "D"){
                				window.location.href = window.location.href;
                			}else{
                				setTimeout(function() {
                					Affiliated.taskHandler(clientId,taskId);
                				}, 5000)
                			}
                		}
                	} else {
                    	if (json['status']['message']) {
                        	console.log(json['status']['message']);
                            return false;
                        }
                    }
            	}
            }).fail(function() {}).always(function() {});
        },
        npi: function(clientId,encodedData){
        	if($('.npi').length > 0 && $('.npi').val().trim().length == 0){
        		
        		$('.npi').keyup(function(){
        			var errorMessages = new Array();
        			
        			if($(this).val().trim().length == 10){
        				errorMessages = Affiliated.validation('npi', $('.npi').val(), 'npi', errorMessages);
        				if(errorMessages.length == 0){
        					Custom.hideMessages();
            				var npi = $('.npi').val();
            				$.ajax({
            	                url: SocialView.base_url + "affiliated/" + clientId + "/npi-validate/" + npi,
            	                type: 'POST',
            	                beforeSend: function() {
            	                	Custom.showLoader();
            	                	Custom.showMessages("info","",["The system is searching the Physician's NPI ID. Please wait for the process to complete."],'.page-bar',100);
            	                },
            	                complete: function() {
            	                }
            	            }).done(function(json) {
            	            	if (json['status']['code'] =='200') {
            	            		$(".firstname").val(json['details']['firstName']);
                	            	$(".lastname").val(json['details']['lastName']);
                	            	$(".email").val(json['details']['email']);
                	            	$(".confirm-email").val(json['details']['email']);
                	            	Custom.hideMessages();
                                }else if(json['status']['code'] =='400'){
                                	$(".firstname").css('background-color', '#fff');
                                	$(".lastname").css('background-color', '#fff');
                                	$(".email").css('background-color', '#fff');
                                	$(".confirm-email").css('background-color', '#fff');
                                	$(".firstname").val('');
                	            	$(".lastname").val('');
                	            	$(".email").val('');
                	            	$(".confirm-email").val('');
                	            	Custom.hideMessages();
                	            	Custom.showMessages("info","",["NPI was not found in the database. Please manually enter the information."],'.page-bar',100);
                                }
                                else{
                                	$(".firstname").val('');
                	            	$(".lastname").val('');
                	            	$(".email").val('');
                	            	$(".confirm-email").val('');
                	            	Custom.hideMessages();
                                }
            	            	Custom.hideLoader();
            	            }).fail(function() {}).always(function() {});
        				}else{
        					
        					 //Custom.showMessages("error", "Validation Error", errorMessages,'.page-bar',100);
        					if($('#npi-error').length == 0){
        						$('#npi').parent().append('<label id="npi-error" class="error" for="npi" style=""></label>');
        					}
       					 	$('#npi-error').text(errorMessages);
        					return false;
        				}
            		}
        		});
        		
        	}
        	
        },
        loadForgetPassword:function () {
			$('.forget-form').show();
			$('input[name="email"]').focus();
			$('.forget-form').validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",
				rules: {
					email: {
						required: true,
						email: true
					}
				},
	
				messages: {
					email: {
						required: "Email is required."
					}
				},
	
				invalidHandler: function (event, validator) { //display error alert on form submit   
	
				},
	
				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.form-group').addClass('has-error'); // set error class to the control group
				},
	
				success: function (label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
				},
	
				errorPlacement: function (error, element) {
					error.insertAfter(element.closest('.input-icon'));
				},
	
				submitHandler: function (form) {
					Custom.showLoader('.content,.login-content');
					form.submit();
				}
			});
	
			$('.forget-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.forget-form').validate().form()) {
						$('.forget-form').submit();
					}
					return false;
				}
			});
		},
		management:function (clientId) {
			
			var columns = [{
                "data": "name",
                "name": "name",
                "orderable": true
            }, {
                "data": "npi",
                "name": "npi",
                "orderable": true
            }, {
                "data": "email",
                "name": "email",
                "orderable": true
            }, {
                "data": "orderDate",
                "name": "orderDate",
                "orderable": true,
                "mRender": function(data, type, full) {
                	var d = new Date(data);
                	if (type == 'sort') {
                        return d.getTime();
                    } else {
                    	return d.toLocaleDateString();
                    }
                }
            }];

            var dataTable = $('.affiliates-management-table').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                bFilter: true,
                order: [
                    [0, "asc"]
                ],
                iDisplayLength: 100,
                "aoColumnDefs": [{
                    "sClass": "text-center",
                    "aTargets": [1, 2, 3]
                }],
                ajax: {
                    url: SocialView.base_url + "management/affiliated/" + clientId + "/affiliate_list",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        
                    },
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: columns
            });
            
            var orderColumns = [{
                "data": "cardName",
                "name": "cardName",
                "orderable": true
            }, {
                "data": "code",
                "name": "code",
                "orderable": true
            }, {
                "data": "email",
                "name": "email",
                "orderable": true
            }, {
                "data": "orderDate",
                "name": "orderDate",
                "orderable": true,
                "mRender": function(data, type, full) {
                	var d = new Date(data);
                	if (type == 'sort') {
                        return d.getTime();
                    } else {
                    	return d.toLocaleDateString();
                    }
                }
            }, {
                    "data": "days",
                    "name": "days",
                    "orderable": false
                }, {
                    "data": "cashbackDays",
                    "name": "cashbackDays",
                    "orderable": false
                }, {
                    "data": "cashback",
                    "name": "cashback",
                    "orderable": false
                }, {
                    "data": "actions",
                    "name": "actions",
                    "orderable": false
            }];

            var dataTableOrder = $('.orders-table').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                bFilter: true,
                order: [
                    [0, "asc"]
                ],
                iDisplayLength: 100,
                "aoColumnDefs": [{
                    "sClass": "text-center",
                    "aTargets": [1, 2, 3 , 4, 5, 6, 7]
                }],
                ajax: {
                    url: SocialView.base_url + "management/affiliated/" + clientId + "/order_list",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        
                    },
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: orderColumns
            });
            
            $('.orders-table').on("click", ".cancel-order", function(e) {
            	e.preventDefault();
             	var me = $(this);
             	var row = me.parents("tr");
             	var code = me.attr('code');
             	Custom.showConfirm("Are you sure want to cancel order?","Confirm","Continue","Cancel"
            			,function(result){
            		if(result){
            			if(result){
            				var url = SocialView.base_url + "management/affiliated/" + clientId + "/cancel-order";
            				 $.ajax({
            		                url: url,
            		                type: "POST",
            		                data: {
            		                    code: code
            		                },
            		                beforeSend: function() {
            		                    Custom.showLoader(row);
            		                },
            		                complete: function() {
            		                    Custom.hideLoader(row);
            		                },
            		            }).done(function(json) {
            		                if (json['status']) {
            		                    if (json['status']['code'] == 200) {
            		                        var node = dataTableOrder.fnGetNodes(row);
            		                        dataTableOrder.fnDeleteRow(node);
            		                    } else {
            		                        if (json['status']['message']) {
            		                            alert(json['status']['message']);
            		                        }
            		                    }
            		                }
            		                return false;
            		            }).fail(function() { }).always(function() { });
                    	}
            		}
             	});
             	return false;
        	});
		}
    };
}();

$('.affiliated_create_account').click(function(event) {
	
	
	$.validator.addMethod("termsValidator", function(value, element) {
		$('#signup_terms_conditions-error').remove();
		if(value != "on"){
			$('.checkbox-list').parent().append('<label id="signup_terms_conditions-error" class="error" for="signup_terms_conditions" style="display: inline-block;">You accept our Terms & Conditions.</label>');
			return false;
		}
        return true;
    }, "");
	
	if($('#password_strength').length >0){
		$('#password_strength-error').css('width','100%');
	}
	var signupForm = $("#signupForm");
	signupForm.validate({
        rules: {
        	npi: {
                required: true,
                digits: true,
                minlength: 10
            },
            first_name: {
                required: true
            },
            last_name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            confirm_email: {
                required: true,
                email: true,
                equalTo: "#email"
            },
            passcode: {
                required: true,
                minlength: 8
            },
            confirm_email: {
                required: true
            },
            phone: {
                required: true
            },
            cpass: {
                required: true,
                equalTo: "#password_strength"
            },
            signup_terms_conditions: {
            	termsValidator: true
            },
        },
        messages: {
        	npi:{
        		required: 'Please enter NPI.'
        	},
        	first_name: {
                required: 'Please enter First Name.'
            },
            last_name: {
            	required: 'Please enter Last Name.'
                
            },
            phone: {
            	required: 'Please enter Telephone Number.',
            	digits: 'Please enter Telephone Number. eg: (XXX) - XXX - XXXX.'
            },
            passcode: {
                required: "Please enter a Password.",
                minlength: "Your password must be at least 8 characters long."
            },
            cpass: {
            	 required: "Please confirm Password.",
                 minlength: "Your password must be at least 8 characters long.",
                 equalTo: "Your Passwords do not match."
            },
            email: {
            	required: "Please enter Email."
            },
            confirm_email: {
            	required: "Please confirm Email.",
            	equalTo: "Your email addresses do not match."
            },
            signup_terms_conditions: "You accept our Terms & Conditions."
        },
        submitHandler: function(form) {
        		var errorMsg = '';
	        	if($('#password_strength').val() == ''){
	        		errorMsg = "Password is required";
	        	}else{
	        	    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
	        	    if (!regex.test($('#password_strength').val())) {
	        	    	errorMsg = "Password must contain at least one upper case alphabet, one lower case alphabet, and one numeric character.";
	        	    }
	        	}
	        	if($('#password_strength-error').length ==0){
					$('#password_strength').parent().append('<label id="password_strength-error" class="error" for="password_strength" style=""></label>');
				}else{
					$('#password_strength-error').css('display','block');
					$('#password_strength-error').css('width','100%');
				}
	        	if(errorMsg){
	        		$('#password_strength-error').text(errorMsg);
	        		return false;
	        	}
	    		var email = $('.email').val();
	    		$.ajax({
	                url: SocialView.base_url + "user/exist",
	                type: 'POST',
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
	            	if (json['status']['code'] == 200) {
	            		if(json['userInfo']['userExists'] == 0){
	            			form.submit();
	            		}else{
	            			Custom.showMessages("error", "Validation Error", ['User already exists in the system.'],'.page-bar',100);
	            		}
	                }else{
	                	if (json['status']['message']) {
	                    	console.log(json['status']['message']);
	                        return false;
	                    }
	                }
	            }).fail(function() {}).always(function() {});
	    }
    });
	
	
});

$('.affiliated_update_password').on('click', function(event) {
	
	if($('#password_strength').length >0){
		$('#password_strength-error').css('width','100%');
	}
	var changePasswordForm = $("#changePasswordForm");
	changePasswordForm.validate({
        rules: {
        	password: {
                required: true,
                minlength: 8
            },
            confirm_password: {
                required: true,
                equalTo: "#password_strength"
            }
        },
        messages: {
        	password: {
                required: "Please provide a password.",
                minlength: "Your password must be at least 8 characters long."
            },
            confirm_password: {
            	 required: "Please provide a password.",
                 minlength: "Your password must be at least 8 characters long.",
            }
        },
        submitHandler: function(form) {
        	var errorMsg = '';
        	if($('#password_strength').val() == ''){
        		errorMsg = "Password is required";
        	}else{
        	    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        	    if (!regex.test($('#password_strength').val())) {
        	    	errorMsg = "Password must contain at least one upper case alphabet, one lower case alphabet, and one numeric character.";
        	    }
        	}
        	if($('#password_strength-error').length ==0){
				$('#password_strength').parent().append('<label id="password_strength-error" class="error" for="password_strength" style=""></label>');
			}else{
				$('#password_strength-error').css('display','block');
				$('#password_strength-error').css('width','100%');
			}
        	if(errorMsg){
        		$('#password_strength-error').text(errorMsg);
        		return false;
        	}
        		form.submit();
        }
    });
});
$('.update-personal-info').on('click', function(event) {
		
	var updatePersonalForm = $("#updatePersonalForm");
	updatePersonalForm.validate({
        rules: {
        	first_name: {
                required: true
            },
            last_name: {
                required: true
            },
            password: {
                required: true
            },
            confirm_email: {
                required: true
            },
            phone_number: {
                required: true
            }
        },
        messages: {
        	first_name: {
                required: 'First name cannot be blank.'
            },
            last_name: {
            	required: 'First name cannot be blank.'
                
            },
            phone_number: {
            	digits: 'Please enter a phone number eg: (XXX) XXX - XXXX.'
            },
            password: {
                required: "Please enter current password to update."
            }
        },
        submitHandler: function(form) {
        		form.submit();
        }
    });
	
});

$(".loginSubmitBtn").on("click",function(){
	
	var loginForm = $("#login-form");
	loginForm.validate({
        rules: {
        	username: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
        	username: {
                required: 'Please enter email address.'
                
            },
            password: {
                required: "Please enter your password."
            }
        },
        errorPlacement: function ($error, $element) {
            var name = $element.attr("name");
            $("#error-" + name).append($error);
        },
        submitHandler: function(form) {
        		form.submit();
        }
    });
	
	
});
$("#affiliated-reset-pass-btn").on("click",function(){
	if($('#password_strength').length >0){
		$('#password_strength-error').css('width','100%');
	}
	var resetPasswordForm = $(".reset-password-form");
	resetPasswordForm.validate({
        rules: {
        	password: {
                required: true,
                minlength: 8
            },
            rpassword: {
                required: true,
                equalTo: "#password_strength"
            }
        },
        messages: {
        	password: {
                required: "Please enter a new password.",
                minlength: "Your password must be at least 8 characters long."
            },
            rpassword: {
            	 required: "Please enter confirm password.",
                 minlength: "Your password must be at least 8 characters long.",
            }
        },
        submitHandler: function(form) {
        	var errorMsg = '';
        	if($('#password_strength').val() == ''){
        		errorMsg = "Password is required";
        	}else{
        	    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        	    if (!regex.test($('#password_strength').val())) {
        	    	errorMsg = "Password must contain at least one upper case alphabet, one lower case alphabet, and one numeric character.";
        	    }
        	}
        	if($('#password_strength-error').length ==0){
				$('#password_strength').parent().append('<label id="password_strength-error" class="error" for="password_strength" style=""></label>');
			}else{
				$('#password_strength-error').css('display','block');
				$('#password_strength-error').css('width','100%');
			}
        	if(errorMsg){
        		$('#password_strength-error').text(errorMsg);
        		return false;
        	}
        		form.submit();
        }
    });
});
