var Loadusers = function() {
	return {
		checkMapping : function() {
			$('input[type="submit"]').click(function(event) {
				Custom.hideMessages();
				$('#column-fullname').css('border', '');
	            $('#column-emailaddress').css('border', '');
	            $('#column-password').css('border', '');
	            $('#column-selectavatars').css('border', '');
	            $('#column-selectsources').css('border', '');
	            $('#column-selectuserroles').css('border', '');
	            $('#column-selectproduct').css('border', '');
				if ($('#column-fullname').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Full name"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-fullname').css('border', '1px solid red');
				}else if ($('#column-emailaddress').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "E-Mail Address"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-emailaddress').css('border', '1px solid red');
				}else if ($('#column-password').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Password"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-password').css('border', '1px solid red');
				}else if ($('#column-selectavatars').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Select Avatars"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-selectavatars').css('border', '1px solid red');
				}else if ($('#column-selectsources').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Select Sources"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-selectsources').css('border', '1px solid red');
				}else if ($('#column-selectuserroles').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Select User Roles"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-selectuserroles').css('border', '1px solid red');
				}else if ($('#column-selectproduct').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Select Product"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-selectproduct').css('border', '1px solid red');
				}
			});
		},
		showProcess: function () {
			$("#upload-file-form").on("submit", function(e) {
				Custom.showLoader();
	            return true;
	        });
		},
		home: function(clientId, avatarId) {

        },
        view: function(clientId, avatarId, campaignId) {

            $(".dont-allow-clicks").on("click", function(e) {
                e.preventDefault();
                return false;
            });

            // Delete Template

            $("button.delete-campaign").on("click", function(e) {
                e.preventDefault();
                var me = $(this);
                var campaignId = me.attr("campaign-id");
                $.ajax({
                        method: "POST",
                        beforeSend: function(xhr) {
                            Custom.showLoader();
                        },
                        url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign/delete/" + campaignId,
                        data: {
                            "campaignId": campaignId
                        }
                    })
                    .done(function(json) {
                        var templateTitle = $("#campaign-title").html();
                        if (json.status.code == 200) {
                            Custom.showMessages("success", "campaign <b>" + templateTitle + "</b> deleted successfully!", [""]);
                            window.location = SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign";
                        } else {
                            Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                        }
                    }).fail(function() {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    }).always(function() {
                        Custom.hideLoader();
                        var modalId = "#delete-" + campaignId + "-campaign";
                        $(modalId).modal("toggle");
                    });


            });


        },
        create: function(clientId, avatarId) {
            $(".auto-reminder").on("change", function(e) {
                $(this).parents(".form-body").find(".reminder-time-wrapper").toggle();
            });

            if ($(".timezone-offset").length) {
                var d = new Date()
                var n = d.getTimezoneOffset();
                $(".timezone-offset").val(n);
            }

        },
        dataMapping: function(clientId, tokenId) {
        	
        	/* Message hiding */
        	$('li.map-users-data-tab').on('click', function() {
        		Custom.hideMessages();
        	});
        	
            Loadusers.common();
            var container = {};
            var updatedMappings = {};

            var listColumns = [{
                "mData": "key",
                "orderable": true,
                "sWidth": "40%",
                "bSearchable": true,
                "mRender": function(data, type, full) {
                	if(full.recordType == "new"){
                		return '<input type="text" id="key">';
                	}
                    if (data != null) {
                        if (type == 'sort') {
                            return data;
                        } else {
                            var html = data;
                        }
                        return html;
                    }
                }
            }, {
                "mData": "value",
                "orderable": false,
                "sWidth": "40%",
                "bSearchable": false,
                "mRender": function(data, type, full) {
                	
                    if (data != null) {
                        var html = "";

                        var dropdown = Loadusers.getDropDown(container, full.type).clone();
                        dropdown = $(dropdown[0]).val(data);
                        dropdown.find("option[value='" + data + "']").attr("selected", "selected");

                        html = dropdown[0].outerHTML;

                        return html;
                    }
                }
            }, {
                "mData": "mapped",
                "sWidth": "20%",
                "bSearchable": false,
                "orderable": true,
                "className": "text-center mapped-class"
            }];
            var dataTables = {};
            $("table.data-table").each(function(i) {

                var me = $(this);

                var mappingType = me.attr("data-type");
                dataTables[mappingType] = me.dataTable({
                    serverSide: false,
                    bLengthChange: false,
                    bProcessing: true,
                    searching: true,
                    iDisplayLength: 20,
                    fnDrawCallback: function() {
                    },
                    order: [
                        [2, 'asc']
                    ],
                    ajax: {
                        url: SocialView.base_url + "users/" + clientId + "/data-mapping-ajax/" + encodeURIComponent(mappingType)+ "/"+tokenId,
                        type: 'POST',
                        data: function(d) {},
                        dataType: 'json',
                        error: function() {
                            Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
                        }
                    },
                    aoColumns: listColumns,
                    fnCreatedRow: function(nRow, aData, iDataIndex) {
                        // Bold the grade for all 'A' grade browsers
                        $(nRow).find("select.select2").select2();
                    },
                    fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        // Bold the grade for all 'A' grade browsers
                        $(nRow).find("select.select2").select2();
                    }
                });
                
                var actionsWrapper = $(".actions-wrapper-"+mappingType);
                var tableWrapper = dataTables[mappingType].parents('.dataTables_wrapper');
                tableWrapper.find(".dataTables_filter").prepend(actionsWrapper.html());
                tableWrapper.find(".dataTables_paginate").parent().prepend(actionsWrapper.html());

            });
            $(".add-mapping-row").on('click',function(e){
            	e.preventDefault();
            	var me = $(this);
            	var mappingType = me.closest('table').attr('data-type');
            	$("table.data-table-"+mappingType).dataTable().fnAddData({
                    "type": mappingType,
                    "recordType": "new",
                    "value":0,
                    "mapped":"No"
                });
            });
            $('.table.data-table').on("click", ".mapping-remove", function(e) {
                e.preventDefault();
                var me = $(this);
                var row = me.parents("tr");
                var mappingType = me.closest('table').attr('data-type');
            	var dataTable = $("table.data-table-"+mappingType).dataTable();
                var rowIndexTORemove = dataTable.fnGetNodes(row);
                dataTable.fnDeleteRow(rowIndexTORemove);
            });
            $('.table.data-table').on("click", ".mapping-add", function(e) {
            	e.preventDefault();
                var me = $(this);
                var mappingType = me.closest('table').attr('data-type');
            	var row = me.parents("tr");
            	var key = row.find('#key').val();
            	var dataMapping = row.find('.data-mapping-select2').select2('data').id;
            	var dataTable = $("table.data-table-"+mappingType).dataTable();
                if (key == '') {
            		Custom.showMessages("error", "Validation Error", ["Please enter From file"]);
                    return false;
                }else if(dataMapping == ''){
                	Custom.showMessages("error", "Validation Error", ["Please select available "+mappingType.replace(/_/g, " ")+"s"]);
                    return false;
                }else{
                	var count = 0;
                	$.each( dataTable.fnGetData(), function(i, row){
                		if(row.key == key)
                			count++;
                	})
                	if(count != 0){
                		Custom.showMessages("error", "Validation Error", [key+" already exist"]);
                        return false;
                	}else{
                		var ai = dataTable.fnAddData({
    	                	"key": key,
    	                	"type": mappingType,
    	                    "recordType": "existing",
    	                    "value":dataMapping,
    	                    "mapped":"No"
    	                });
    	                var newRow = dataTable.fnSettings().aoData[ ai[0] ].nTr;
    	                var rowIndexTORemove = dataTable.fnGetNodes(row);
    	                dataTable.fnDeleteRow(rowIndexTORemove);
    	                Loadusers.updateMapping(updatedMappings, dataTables[mappingType], newRow, dataMapping);
                	}
                }
            });
            $("table.data-table").on('page.dt', function () {
            	Custom.keepAlive();
            });

            /*$("body").on("change", ".data-mapping-select2", function(e) {
                e.preventDefault();
                var me = $(this);
                var value = $(this).val();
                var mappingType = me.attr("data-type");

                var row = me.parents('tr')[0];
                Loadusers.updateMapping(updatedMappings, dataTables[mappingType], row, value);
            });*/

            $(".data-mappping-submit").on("click", function(e) {
            	e.preventDefault();
                var dataType = $(this).attr("data-type");
                var createType = $(this).attr("create-type");
                $("table[data-type="+dataType+"] select.data-mapping-select2").each(function(i) {
            		var value = $(this).val();
            		var row = $(this).parents("tr")[0];
            		Loadusers.updateMapping(updatedMappings, dataTables[dataType], row, value);
            	});	
                if (dataType in updatedMappings) {
                    var mappingsTobeUpdated = updatedMappings[dataType];
                    var userData = [],
                        selectedData = [];
                    for (key in mappingsTobeUpdated) {
                    	userData.push(key);
                        selectedData.push(mappingsTobeUpdated[key]["value"]);
                    }

                    $.ajax({
                            method: "POST",
                            beforeSend: function(xhr) {
                                Custom.showLoader();
                            },
                            url: SocialView.base_url + "users/" + clientId + "/data-mapping-ajax-update/" + dataType + 
                            	"/" +tokenId+"/"+createType,
                            data: {
                                "column": dataType,
                                "user-data": userData,
                                "selected-data": selectedData
                            }
                        })
                        .done(function(json) {
                            if (json.result) {
                                //that means they are updated successfully!
                            	Custom.showMessages("success", json.message, [""]);
                                
                                for(key in mappingsTobeUpdated) {
                                	var row = mappingsTobeUpdated[key]["row"];
                                	$(row).find(".mapped-class").html("Yes");
                                }
                                delete updatedMappings[dataType];
                                if (json.redirect) {
                                	setTimeout(function(){
                                		window.location = SocialView.base_url + "users/" + clientId + "/loadusers";	
        							}, 5000)
                                }	
                            } else {
                            	Custom.showMessages("error", json.message, [""]);
                            }

                        }).fail(function() {
                            Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                        }).always(function() {
                            Custom.hideLoader();

                        });
                }
            });
        },
        updateMapping: function(updatedMappings, dataTable, row, newValue) {
            var currentData = dataTable.fnGetData(row);
            if(typeof currentData.key != 'undefined'){
                if (!(currentData.type in updatedMappings)) {
                    updatedMappings[currentData.type] = {};
                }
                updatedMappings[currentData.type][currentData.key] = {
                    "value": newValue,
                    "row": row
                };
            }
        },
        getDropDown: function(container, type) {
            if (type in container) {
                return container[type];
            } else {
                var combo = $("<select></select>").attr("class", "select2 data-mapping-select2").attr("data-type", type).attr("style", "width:100%;").attr("name", "selecteddata-" + type + "[]");

                for (var key in window[type]) {
                    if (window[type].hasOwnProperty(key)) {
                        combo.append("<option value=\"" + key + "\">" + window[type][key] + "</option>");
                    }
                }
                container[type] = combo;
                return container[type];
            }

        },
        common: function() {
            if ($("select.select2").length) {
                $("select.select2").select2();
            }

            $(".show-loader-on-submit").on("click", function(e) {
                Custom.showLoader();
                return true;
            });
        }
	};
}();
