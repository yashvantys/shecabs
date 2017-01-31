var SuperCampaign = function() {
    return {
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
            
            $(".camp-name-edit-btn").on("click", function(e) {
                var me = $(this);
                me.addClass('hidden');
                $('.camp-name-hidden-icons').removeClass('hidden');
                $('#camp-name').removeAttr('disabled');
            	return true;
            });
            
            $(".camp-name-clear-btn").on("click", function(e) {
            	var me = $(this);
            	
            	$('.camp-name-edit-btn').removeClass('hidden');
            	$('.camp-name-hidden-icons').addClass('hidden');
            	$('#camp-name').attr('disabled','disabled');
            	$('#camp-name').val($('#camp-name-hidden').val());
            	return true;
            });
            
            $(".camp-name-save-btn").on("click", function(e) {
            	var me = $(this);
            	
            	$('.camp-name-edit-btn').removeClass('hidden');
            	$('.camp-name-hidden-icons').addClass('hidden');
            	$('#camp-name').attr('disabled','disabled');
            	$('#camp-name-hidden').val($('#camp-name').val());
            	
                var campaignId = me.attr("campaign-id");
            	SuperCampaign.updateSuperCampain(clientId, avatarId, campaignId);
            	return true;
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
        dataMapping: function(clientId, avatarId) {
            SuperCampaign.common();

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

                        var dropdown = SuperCampaign.getDropDown(container, full.type).clone();
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
            }, {
                "mData": "actions",
                "sWidth": "20%",
                "bSearchable": false,
                "orderable": false,
                "className": "text-center",
                "mRender": function(data, type, full) {
                	if(full.recordType == "new"){
                		var html = "<div class=\"btn-group\">";
                        html += '<a href="#" class="btn btn-xs mapping-add"><i class="fa fa-cart-plus"></i> Add Mapping</a>';
                        html += '<a href="#" class="btn btn-xs mapping-remove"><i class="fa fa-trash"></i> Remove</a>';
                        html += "</div>";
                        return html;
                	}
                	return '';
                }
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
                        url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign/data-mapping-ajax/" + encodeURIComponent(mappingType),
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
    	                SuperCampaign.updateMapping(updatedMappings, dataTables[mappingType], newRow, dataMapping);
                	}
                }
            });
            $("table.data-table").on('page.dt', function () {
            	Custom.keepAlive();
            });

            $("body").on("change", ".data-mapping-select2", function(e) {
                e.preventDefault();
                var me = $(this);
                var value = $(this).val();
                var mappingType = me.attr("data-type");

                var row = me.parents('tr')[0];
                SuperCampaign.updateMapping(updatedMappings, dataTables[mappingType], row, value);
            });

            $(".data-mappping-submit").on("click", function(e) {
                e.preventDefault();
                var dataType = $(this).attr("data-type");
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
                            url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign/data-mapping-ajax-update/" + dataType,
                            data: {
                                "column": dataType,
                                "user-data": userData,
                                "selected-data": selectedData
                            }
                        })
                        .done(function(json) {
                            if (json.result) {
                                //that means they are updated successfully!
                                Custom.showMessages("success", "Mapping updated successfully!", ["Your new mappings are updated succesfully. If there is any invalid recipients against this mapping, it will be processed soon."]);
                                
  							for(key in mappingsTobeUpdated) {
  								var row = mappingsTobeUpdated[key]["row"];
  								$(row).find(".mapped-class").html("Yes");
  		            		}
  							delete updatedMappings[dataType];
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
        updateSuperCampain: function(clientId, avatarId, campaignId) {
        	var name = $('#camp-name').val();
        	if (name == '') {
        			bootbox.alert('Please enter a name!');
        			return;
        	} else {
                $.ajax({
                    method: "POST",
                    beforeSend: function(xhr) {
                        Custom.showLoader();
                    },
                    url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign/update",
                    data: {
                        "campaignId": campaignId,
                        "name": name
                    }
                })
                .done(function(json) {
                	if (json.status.code == 200) {
                		Custom.showMessages("success", "Success.", ["Name updated successfully."]);
                	} else {
                		Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                	}
                	Custom.hideLoader();
                }).fail(function() {
                    Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    Custom.hideLoader();
                });        		
        	}
        },
        common: function() {
            if ($("select.select2").length) {
                $("select.select2").select2();
            }

            $(".show-loader-on-submit").on("click", function(e) {
                Custom.showLoader();
                setTimeout(function(){
                	Custom.hideLoader();
                }, 3000);
                return true;
            });
            
        }

    };
}();