var SupportConfig = function() {
    return {
        home: function(clientId, avatarId, industryId) {

            function makeSafeForCSS(name) {
                return name.replace(/[^a-z0-9]/g, function(s) {
                    var c = s.charCodeAt(0);
                    if (c == 32) return '-';
                    if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
                    return '__' + ('000' + c.toString(16)).slice(-4);
                });
            }

            var fromDate, endDate;

            fromDate = Date.parse($("#campaign-start-date").val());
            endDate = Date.parse($("#campaign-end-date").val());

            var listColumns = [{
                    "mData": "campaignDate",
                    "orderable": true,
                    "mRender": function(data, type, full) {
                        if (data != null) {
                            var d = new Date(data);
                            if (type == 'sort') {
                                return d.getTime();
                            } else {

                                var html = "";

                                html = "<a class=\"more-link\" href=\"" + SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/view/" + full.id + "\"><span class=\"name\">" +
                                    full.name +
                                    "</span><span class=\"extra-info\"><span class=\"date\"><i class=\"fa fa-calendar\"></i> " + d.toLocaleString() + "</span><span class=\"type btn btn-sm default\">" + full.type + "</span></span>" + "</a>";
                            }
                            return html;
                        }
                    }
                }, {
                    "mData": "total",
                    "orderable": true,
                    "className" : "text-center"
                }, {
                    "mData": "validCount",
                    "orderable": true,
                    "className" : "text-center"
                }, {
                    "mData": "locationInvalidCount",
                    "orderable": true,
                    "mRender": function(data, type, full) {
                        var html = "";
                        if (data != null) {
                        	if(Number(data) > 0) {
                        		html = "<a href=\"" + SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign/data-mapping?active_tab=data-mapping-location\">" + data + "</a>";
                        	} else {
                        		html = data;
                        	}
                        }
                        return html;
                    },
                    "className" : "text-center"
                }

            ];
            if (industryId == 'healthcare') {
                listColumns.push({
                    "mData": "personInvalidCount",
                    "orderable": false,
                    "mRender": function(data, type, full) {
                        var html = "";
                        if (data != null) {
                        	if(Number(data) > 0) {
                        		html = "<a href=\"" + SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/super-campaign/data-mapping?active_tab=data-mapping-physician\">" + data + "</a>";
                        	} else {
                        		html = data;
                        	}
                        }
                        return html;
                    },
                    "className" : "text-center"
                });
            }
            listColumns.push({
                "mData": "documentCount",
                "orderable": false,
                "className" : "text-center"
            });

            var dataTableObj = $("#campaign-list").dataTable({
                serverSide: false,
                bLengthChange: false,
                bProcessing: true,
                searching: false,
                iDisplayLength: 100,
                order: [
                    [0, 'desc']
                ],
                ajax: {
                    url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/get-list",
                    type: 'POST',
                    data: function(d) {
                        endDate.setHours(23);
                        endDate.setMinutes(59);
                        d.fromDate = fromDate.toISOString();
                        d.endDate = endDate.toISOString();
                    },
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                aoColumns: listColumns
            });


            $("#campaign-date-submit").on("click", function(e) {
                e.preventDefault();
                fromDate = Date.parse($("#campaign-start-date").val());
                endDate = Date.parse($("#campaign-end-date").val());
                dataTableObj.api().ajax.reload();
            });

        },
        view: function(clientId, avatarId, campaignId, industryId) {

            $('.campaign-recipient').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/get-recipients/" + campaignId,
                    type: 'POST',
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                aoColumns: [{
                    "mData": "name",
                    "name": "R Name"
                }, {
                    "mData": "email_send_time",
                    "mRender": function(data, type, full) {
                        if (data != null) {
                            var d = new Date(data);
                            return d.toLocaleString();
                        }
                        return "";
                    }
                }, {
                    "mData": "email_viewed_time",
                    "mRender": function(data, type, full) {
                        if (data != null) {
                            var d = new Date(data);
                            return d.toLocaleString();
                        }
                        return "";
                    }
                }, {
                    "mData": "link_clicked_time",
                    "mRender": function(data, type, full) {
                        if (data != null) {
                            var d = new Date(data);
                            return d.toLocaleString();
                        }
                        return "";
                    }
                }, {
                    "mData": "reminder_sent_time",
                    "mRender": function(data, type, full) {
                        if (data != null) {
                            var d = new Date(data);
                            return d.toLocaleString();
                        }
                        return "";
                    }
                }, {
                    "mData": "document_id",
                    "mRender": function(data, type, full) {
                    	if(type == "sort") {
                    		return full.document_id;
                    	} else {
                    		var html = "";
	                        if (data > 0) {
	                           var html = "<a href=\""+full.document_url+"\" target=\"_blank\">View Response</a>"
	                        }
	                        return html;
                    	}
                    }
                }]
            });

            var invalidColumns = [{
                "data": "name",
                "name": "R Name"
            }, {
                "data": "reason_invalid",
                "orderable": false
            }, {
                "data": "locationName",
                "orderable": false
            }];
            if (industryId == 'healthcare') {
                invalidColumns.push({
                    "data": "physicianName",
                    "orderable": false
                });
            }

            $('.campaign-invalid-recipients').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/get-invalid-recipients/" + campaignId,
                    type: 'POST',
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: invalidColumns
            });

            $(".dont-allow-clicks").on("click", function(e) {
                e.preventDefault();
                return false;
            });

            $("button.delete-campaign").on("click", function(e) {
                e.preventDefault();
                var me = $(this);
                var campaignId = me.attr("campaign-id");
                $.ajax({
                        method: "POST",
                        beforeSend: function(xhr) {
                            Custom.showLoader();
                        },
                        url: SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId + "/delete/" + campaignId,
                        data: {
                            "campaignId": campaignId
                        }
                    })
                    .done(function(json) {
                        var templateTitle = me.attr("campaign-title");
                        if (json.status.code == 200) {
                            Custom.showMessages("success", "campaign <b>" + templateTitle + "</b> deleted successfully!", [""]);
                            window.location = SocialView.base_url + "email-campaign/" + clientId + "/" + avatarId;
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
        selectAudience: function(clientId, avatarId, type) {


            $(".auto-reminder").on("change", function(e) {
                if ($(this).is(":checked")) {
                    $(this).parents(".tab-pane").find(".reminder-time-wrapper").removeClass("hidden");
                } else {
                    $(this).parents(".tab-pane").find(".reminder-time-wrapper").addClass("hidden");
                }
            });

            $(".use-super-campaign").on("change", function(e) {
                if ($(this).is(":checked")) {
                    $(this).parents(".tab-pane").find(".hide-if-super-campaign").hide();
                    $(this).parents(".tab-pane").find(".show-if-super-campaign").show();
                } else {
                    $(this).parents(".tab-pane").find(".hide-if-super-campaign").show();
                    $(this).parents(".tab-pane").find(".show-if-super-campaign").hide();
                }
            });

            $(".use-super-campaign").trigger("change");
            if ($(".timezone-offset").length) {
                var d = new Date()
                var n = d.getTimezoneOffset();
                $(".timezone-offset").val(n);
            }

            var locationMapString = $("#location-map").val();
            var decodedString = $("<div/>").html(locationMapString).text();
            var locationMap = JSON.parse(decodedString);

            var industryId = $("#industry-id").val();
            EmailCampaign.manualForm(type, industryId);
             
            function next_hour() {
                var current_date = new Date();
                current_date.setHours(current_date.getHours() + 1);
                current_date.setMinutes(00);
                return current_date;
              }
              $(".manual-fill-form .datetime-picker").datetimepicker({
                  changeYear: true,
                  changeMonth: true,
                  minDate : next_hour(),
                  minDateTime : next_hour(),
                  maxDate: '+100y',
                  dateFormat: 'mm/dd/yy',
                  timeFormat : 'hh:mm TT',
                  yearRange: "0:+100",
                  constrainInput : true,
                  showMillisec : false,
                  showMicrosec : false,
                  showTimezone : false
              });
              
              $(".upload-file-form .datetime-picker").datetimepicker({
                  changeYear: true,
                  changeMonth: true,
                  minDate : next_hour(),
                  minDateTime : next_hour(),
                  maxDate: '+100y',
                  dateFormat: 'mm/dd/yy',
                  timeFormat : 'hh:mm TT',
                  yearRange: "0:+100",
                  constrainInput : true,
                  showMillisec : false,
                  showMicrosec : false,
                  showTimezone : false
              });

            // Survey Campaign
            $('.audience-manual-tab.survey').on('change', 'select.location', function() {
                var me = $(this);
                var avatar_id = me.val();

                var survey_list = locationMap[avatar_id];
                var html = '<option value="0">Allow participant to specify</option>';
                var surveySelect = me.parent().next().find('select.survey_name');
                surveySelect.html('');
                if (avatar_id != "0") {
                    $.each(survey_list, function(index, value) {
                        html += '<option value="' + value.key + '">' + value.value + '</option>';
                    });
                }
                surveySelect.html(html);
                surveySelect.select2();
            });

            // Testmonial campaign
            $('.audience-manual-tab.testimonial').on('change', 'select.location', function() {
                var me = $(this);
                var avatar_id = me.val();

                // $("#preview-overlay").show(); // for ajax if needed
                var physician_list = locationMap[avatar_id];
                var html = ''; //'<option value="0">Allow participant to specify</option>';
                var physicianSelect = me.parent().next().find('select.physician_name');
                physicianSelect.html('');
                if (avatar_id != "0") {
                    $.each(physician_list, function(index, value) {
                        html += '<option value="' + value.key + '">' + value.value + '</option>';
                    });
                }
                physicianSelect.html(html);
                physicianSelect.select2();
            });

            // Add more btn click
            $(".add_more").on("click", function(e) {
                e.preventDefault();
                var campaign_type = type;
                var locationDropdown, surveyDropdown, physicianDropdown, firstContent;
                if ($("#campaign-locations").length) {
                    locationDropdown = $("#campaign-locations").clone().removeAttr("id");
                }
                if ($("#campaign-surveys").length) {
                    surveyDropdown = $("#campaign-surveys").clone().removeAttr("id");
                }
                if ($("#campaign-physicians").length) {
                    physicianDropdown = $("#campaign-physicians").clone().removeAttr("id");
                }

                var temp_id = $(".manual-filling-table tbody > tr").last().attr("id");
                var split = temp_id.split("_");
                var id = split[2];
                count = (parseInt(id) + 1);

                switch (campaign_type) {
                    case "survey":
                        firstContent = EmailCampaign.surveyFormRow(count, locationDropdown, surveyDropdown);
                        break;
                    case "testimonial":
                        firstContent = EmailCampaign.testimonialFormRow(count, locationDropdown, physicianDropdown, industryId);
                        break;
                    default:
                        break;
                }
                $(".manual-filling-table tbody").append(firstContent);
                $(".manual-filling-table tbody").find("select.select2").select2({
                    width: '100%'
                });
                if ($(".manual_row").length > 1) {
                    $(".manual_row a.remove").show();
                }

            });

            // Remove button click
            $(".main-content").on("click", ".remove", function(e) {
                e.preventDefault();
                var temp_id = $(this).attr("id");
                var split = temp_id.split("_");
                var id = split[1];
                if ($(".manual_row").length > 1) {
                    $("#manual_row_" + id).remove();
                    if ($(".manual_row").length == 1) {
                        $(".manual_row a.remove").hide();
                    }

                } else {
                    Custom.showMessages("warning", "Atleast one row needed.", ["Sorry, to send an email campaign please specify atleast one recipient."]);
                }
            });
            
           

            $("#upload-file-form").on("submit", function(e) {
                Custom.showLoader();
                return true;
            });

            $("#manual-fill-form").on("submit", function(e) {
                var continue_action = true;
                var rows = [];
                $(".manual_row").each(

                    function() {

                        var temp_id = $(this).attr("id");
                        var split = temp_id.split("_");
                        var id = split[2];
                        var survey_name = '';
                        var physician_name = '';
                        var name = $(this).find(".name").val();
                        var email = $(this).find(".email").val();
                        var location = $(this).find("select.location").val();
                        if ($(this).find("select.survey_name").length) {
                            survey_name = $(this).find("select.survey_name").val();
                        }
                        if ($(this).find("select.physician_name").length) {
                            physician_name = $(this).find("select.physician_name").val();
                        }
                        if (name != "" || email != "") {
                            if (email != "" && !(/(.+)@(.+){2,}\.(.+){2,}/.test(email))) {
                                Custom.showMessages("error", "Please enter valid email ", [""]);
                                $(this).find(".email").focus();
                                status = 1;
                                continue_action = false;
                                return false;
                            } else if (name == "") {
                                Custom.showMessages("error", "Name is missing in a row", [""]);
                                $(this).find(".name").focus();
                                status = 1;
                                continue_action = false;
                                return false;
                            } else if (email == "") {
                                Custom.showMessages("error", "Email is missing in a row", [""]);
                                $(this).find(".email").focus();
                                status = 1;
                                continue_action = false;
                                return false;
                            }
                            var temp = new Object();
                            temp.name = name;
                            temp.email = email;
                            temp.locationAvatarId = location;
                            if (survey_name != '') {
                                temp.surveyId = survey_name;
                            }
                            if (physician_name != '') {
                                temp.personAvatarId = physician_name;
                            }
                            rows.push(temp);
                        }
                    });

                if (!rows.length && status != 1) {
                    Custom.showMessages("error", "Please enter atleast one recipient", [""]);
                    continue_action = false;
                    return false;
                }

                $("input[name='manual_payload']").val(JSON.stringify(rows));

                if (continue_action) {
                    Custom.showLoader();
                }
                return continue_action;
            });



        },
        manualForm: function(campaign_type, industryId) {
            var locationDropdown, surveyDropdown, physicianDropdown, firstContent;
            if ($("#campaign-locations").length) {
                locationDropdown = $("#campaign-locations").clone().removeAttr("id");
            }
            if ($("#campaign-surveys").length) {
                surveyDropdown = $("#campaign-surveys").clone().removeAttr("id");
            }
            if ($("#campaign-physicians").length) {
                physicianDropdown = $("#campaign-physicians").clone().removeAttr("id");
            }

            firstContent = "<table class=\"manual-filling-table table table-striped table-advance blue\">";
            switch (campaign_type) {
                case "survey":
                    firstContent += "<thead><tr><th>Name</th><th>Email</th><th>Location</th><th>Survey</th>" + "<th><a href=\"#\" class=\"add_more\" title=\"Add more\"><i class=\"fa fa-plus-circle\"></i></a></th></tr></thead>";
                    firstContent += "<tbody>";
                    for (var i = 1; i <= 4; i++) {
                        firstContent += EmailCampaign.surveyFormRow(i, locationDropdown, surveyDropdown);
                    }
                    break;

                case "testimonial":
                    if (industryId == 'healthcare') {
                        firstContent += "<thead><tr><th>Name</th><th>Email</th><th>Location</th><th>Physician</th>" + "<th><a href=\"#\" class=\"add_more\" title=\"Add more\"><i class=\"fa fa-plus-circle\"></i></a></th></tr></thead>";
                    } else {
                        firstContent += "<thead><tr><th>Name</th><th>Email</th><th>Location</th>" + "<th><a href=\"#\" class=\"add_more\" title=\"Add more\"><i class=\"fa fa-plus-circle\"></i></a></th></tr></thead>";
                    }
                    firstContent += "<tbody>";
                    for (var i = 1; i <= 4; i++) {
                        firstContent += EmailCampaign.testimonialFormRow(i, locationDropdown, physicianDropdown, industryId);
                    }
                    break;
                default:
                    break;
            }
            firstContent += "</tbody></table>";
            $(".audience-manual-tab").append(firstContent);
            $(".audience-manual-tab").find("select.select2").select2({
                width: '100%'
            });
            
        },
        surveyFormRow: function(count, locations, surveys) {
            var response = '<tr class="manual_row" id="manual_row_' + count + '">';
            response += '<td class="item"><input placeholder="Name" class="form-control input-sm name" id="name_' + count + '" type="text"/></td>';
            response += '<td class="item"><input placeholder="Email" class="form-control input-sm email" id="email_' + count + '" type="email"/></td>';
            response += '<td class="select-item"><select class="form-control input-sm location select2" id="location_' + count + '">' + locations.html() + '</select></td>';
            response += '<td class="select-item"><select class="form-control input-sm survey_name select2" id="survey_name_' + count + '">' + surveys.html() + '</select></td>';
            response += '<td><a href="#" class="remove" id="remove_' + count + '" title="Remove"><i class="fa fa-minus-circle"></i></a></td>';
            response += '</tr>';
            return response;
        },
        testimonialFormRow: function(count, locations, physicians, industryId) {
            var response = '<tr class="manual_row" id="manual_row_' + count + '">';
            response += '<td class="item"><input placeholder="Name" class="form-control input-sm name" id="name_' + count + '" type="text"/></td>';
            response += '<td class="item"><input placeholder="Email" class="form-control input-sm email" id="email_' + count + '" type="email"/></td>';
            response += '<td class="select-item"><select class="location input-sm select2" id="location_' + count + '">' + locations.html() + '</select></td>';
            if (industryId == 'healthcare') {
                response += '<td class="select-item"><select class="physician_name input-sm select2" id="physician_name_' + count + '">' + physicians.html() + '</select></td>';
            }
            response += '<td><a href="#" class="remove" id="remove_' + count + '" title="Remove"><i class="fa fa-minus-circle"></i></a></td>';
            response += '</tr>';
            return response;
        },
        columnMapping: function($client_id, $avatar_id, $campaign_id) {
            $("select.select2").select2();
        },
        dataMapping: function($client_id, $avatar_id, $campaign_id) {
            $("select.select2").select2();
        },
        adminHome: function() {

            $('.supports').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                searching: false,
                ordering: false,
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "admin/support-list-configurations",
                    type: 'POST'
                },
                aoColumns: [{
                    "mData": "industryId",
                    "name": "R Name"
                }, {
                    "mData": "type"
                },{
                    "mData": "title"
                },{
                    "mData": "description"
                },{
                	"mData": "videoLink",
                	"mRender": function(data, type, full) {
                		var htmlvideoLink = "";
                		if(data){
                			htmlvideoLink = '<p>'+data+'</p>';
                		}
                		
                		return htmlvideoLink;

                	}
                },{
                    "mData": "weight"
                },{
                    "mData": "id",
                    "mRender": function(data, type, full) {
                    	var htmlObj = '<a  class="btn view-configuration btn-xs blue" config-id="'+data+'" href="'+SocialView.base_url +'admin/support/support-config/'+data+'" > <i class="fa fa-edit"></i></a><a href="javascript:void(0)" class="delete-configuration btn btn-xs red" config-id="'+data+'"><i class="fa  fa-trash-o "></i> </a>';
                        return htmlObj;

                    }
                }]
            });

            $(".supports").on("click", ".delete-configuration", function(e) {
                e.preventDefault();
                var me = $(this);
                var configId = me.attr("config-id");

                bootbox.dialog({
                    message: "Are you sure?",
                    title: "Delete Support",
                    buttons: {
                        danger: {
                            label: "Cancel",
                            className: "btn-danger",
                            callback: function() {}
                        },
                        success: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function() {
                                $.ajax({
                                        method: "POST",
                                        beforeSend: function(xhr) {
                                            Custom.showLoader();
                                        },
                                        url: SocialView.base_url + "admin/support/delete",
                                        data: {
                                            configId: configId
                                        }
                                    })
                                    .done(function(json) {
                                    	if (json.status != undefined && json.status.code == 200) {
                                    		Custom.showMessages("success", "Configuration deleted successfully!", [""]);
                                    		me.parents("tr").remove();
                                    		setTimeout(function(){
                                    			location.reload();
                                    		}, 1000);

                                    	} else {
                                    		Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                                    	}


                                    }).fail(function() {
                                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                                    }).always(function() {
                                        Custom.hideLoader();

                                    });
                            }
                        }
                    }
                });
            });
            

            $('.release-note').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                searching: false,
                ordering: false,
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "admin/fyi-list-configurations",
                    type: 'POST'
                },
                aoColumns: [{
                    "mData": "industryId",
                    "name": "R Name"
                }, {
                    "mData": "clientId"
                },{
                    "mData": "title"
                },{
                    "mData": "description"
                },{
                	"mData": "Release Date",
                	"mRender": function(data, type, full) {
                		var htmlvideoLink = "";
                		if(data){
                			htmlvideoLink = '<p>'+data+'</p>';
                		}
                		
                		return htmlvideoLink;

                	}
                },{
                    "mData": "id",
                    "mRender": function(data, type, full) {
                    	var htmlObj = '<a  class="btn view-configuration btn-xs blue" config-id="'+data+'" href="'+SocialView.base_url +'admin/fyi/fyi-config/'+data+'" > <i class="fa fa-edit"></i></a><a href="javascript:void(0)" class="delete-configuration btn btn-xs red" config-id="'+data+'"><i class="fa  fa-trash-o "></i> </a>';
                        return htmlObj;

                    }
                }]
            });
            $(".release-note").on("click", ".delete-configuration", function(e) {
                e.preventDefault();
                var me = $(this);
                var configId = me.attr("config-id");

                bootbox.dialog({
                    message: "Are you sure?",
                    title: "Delete Release Note",
                    buttons: {
                        danger: {
                            label: "Cancel",
                            className: "btn-danger",
                            callback: function() {}
                        },
                        success: {
                            label: "Yes",
                            className: "btn-success",
                            callback: function() {
                                $.ajax({
                                        method: "POST",
                                        beforeSend: function(xhr) {
                                            Custom.showLoader();
                                        },
                                        url: SocialView.base_url + "admin/delete_fyi_config",
                                        data: {
                                            configId: configId
                                        }
                                    })
                                    .done(function(json) {
                                    	if (json.status != undefined && json.status.code == 200) {
                                    		Custom.showMessages("success", "Configuration deleted successfully!", [""]);
                                    		me.parents("tr").remove();
                                    		setTimeout(function(){
                                    			location.reload();
                                    		}, 1000);

                                    	} else {
                                    		Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                                    	}


                                    }).fail(function() {
                                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                                    }).always(function() {
                                        Custom.hideLoader();

                                    });
                            }
                        }
                    }
                });
            });
            
           
        },
        addConfiguration: function() {
            $("select.select2").select2();
            $('body').on("keydown", ".support-priority",function (e) {
            	if (e.shiftKey || e.ctrlKey || e.altKey) {
            		e.preventDefault();
            	} else {
            		var key = e.keyCode;
            		if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
            			
            			e.preventDefault();
            		}
            	}
            });
           
        }


    };
}();