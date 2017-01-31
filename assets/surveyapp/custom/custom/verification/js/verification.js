var Verification = function() {
    var impSources = {};
    var duplicateSources = {};
    var impSourceWiseCount = {};
    var count = 0;
    return {
        verifyEntity: function(clientId, entityId) {
            EntityName = $('.portlet-title .entity-name').html();
            impSources[100197] = {
                "name": "UCompare Healthcare",
                "url": encodeURI("https://www.google.co.in/?q=site:ucomparehealthcare.com+" + EntityName + "#safe=active&q=site:ucomparehealthcare.com+" + EntityName)
            };
            impSources[100175] = {
                "name": "Vitals",
                "url": encodeURI("https://www.google.co.in/?q=site:vitals.com+" + EntityName + "#safe=active&q=site:vitals.com+" + EntityName)
            };
            impSources[100176] = {
                "name": "RateMDs",
                "url": encodeURI("https://www.google.co.in/?q=site:ratemds.com+" + EntityName + "#safe=active&q=site:ratemds.com+" + EntityName)
            };
            impSources[100177] = {
                "name": "Health Grades",
                "url": encodeURI("https://www.google.co.in/?q=site:healthgrades.com+" + EntityName + "#safe=active&q=site:healthgrades.com+" + EntityName)
            };
            impSources[100185] = {
                "name": "Super Pages",
                "url": encodeURI("https://www.google.co.in/?q=site:superpages.com+" + EntityName + "#safe=active&q=site:superpages.com+" + EntityName)
            };
            impSources[100136] = {
                "name": "Yelp",
                "url": encodeURI("https://www.google.co.in/?q=site:yelp.com+" + EntityName + "#safe=active&q=site:yelp.com+" + EntityName)
            };
            impSources[100171] = {
                "name": "Google Plus",
                "url": encodeURI("https://www.google.co.in/?q=site:plus.google.com+" + EntityName + "#safe=active&q=site:plus.google.com+" + EntityName)
            };
            impSources[100350] = {
                "name": "TopNPI",
                "url": encodeURI("https://www.google.co.in/?q=site:topnpi.com+" + EntityName + "#safe=active&q=site:topnpi.com+" + EntityName)
            };
            duplicateSources = $.extend({}, impSources); // for suggested source
            var columns = [{
                "data": "id",
                "name": "R Name",
                "orderable": false,
                "mRender": function(data, type, full) {
                    if (full.sourceId in impSources) {
                        delete impSources[full.sourceId];
                    }
                    var html = "";
                    if (full.type == "existing") {
                        if (full.primaryFlag == "P") {
                            html = '<input type="checkbox" source-id="' + full.sourceId + '" disabled="disabled" name="harvesters[]" class="input-sm" value="' + data + '" >';
                        } else {
                            html = '<input type="checkbox" source-id="' + full.sourceId + '" name="harvesters[]" class="input-sm" value="' + data + '" >';
                        }
                    }
                    return html;
                }
            }, {
                "data": "sourceName",
                "orderable": true,
                "mRender": function(data, type, full) {
                    if (full.type == "existing") {
                        return data;
                    } else {
                        var html = "<input type='text' name='source' class='form-control input-sm select2'>";
                        return html;
                    }
                }
            }, {
                "data": "url",
                "orderable": true,
                "mRender": function(data, type, full) {
                    if (type == 'sort') {
                        if (full.type == "existing") {
                            return data;
                        } else {
                            return "";
                        }
                    } else {
                        if (full.type == "existing") {
                            html = "<a href=\"" + data + "\" target=\"_blank\">";
                            if (full.primaryFlag == "P") {
                                html += '<i class="fa fa-check-circle green"></i> ';
                            } else {
                                html += '<i class="fa fa-exclamation-circle yellow"></i> ';
                            }
                            html += data;
                            html += "</a>";
                            return html;
                        } else {
                            return "<input type='text' name='url' class='form-control url input-sm'>"
                        }
                    }
                }
            }, {
            	"data" : "documentCount",
            	"orderable" : false,
            	 "mRender": function(data, type, full) {
            		 if (full.type == "existing") {
                         return data;
                     } else {
                         return "";
                     }
            	 }
            }, {
                "data": "id",
                "orderable": false,
                "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
                    // checking how many times harvester is created for a particular source
                    if (oData.sourceId in impSourceWiseCount) {
                        impSourceWiseCount[oData.sourceId]["count"]++;
                        delete impSourceWiseCount['undefined'];
                    } else {
                        impSourceWiseCount[oData.sourceId] = {};
                        impSourceWiseCount[oData.sourceId]["count"] = 1;
                        impSourceWiseCount[oData.sourceId]["name"] = oData.sourceName;
                    }
                },
                "mRender": function(data, type, full) {
                    if (type == "sort") {
                        return full.id;
                    } else {
                        var html = "<div class=\"btn-group\">";
                        if (full.type == "existing") {
                            if (full.primaryFlag != "P") {
                                html += '<a href="#" class="btn btn-xs hr-verify" harvester-id="' + full.id + '"><i class="fa fa-check-circle"></i> Verify</a>';
                            }
                            //html +='<a href="#" class="btn btn-xs hr-edit" harvester-id="'+full.id+'"><i class="fa fa-edit"></i> Edit</a>';
                            html += '<a href="#" class="btn btn-xs hr-delete" source-id="' + full.sourceId + '" harvester-id="' + full.id + '"><i class="fa fa-delete icon-trash"></i> Delete</a>';
                        } else {

                            html += '<a href="#" class="btn btn-xs hr-add"><i class="fa fa-cart-plus"></i> Add Harvester</a>';
                            html += '<a href="#" class="btn btn-xs row-remove"><i class="fa fa-trash"></i> Remove</a>';
                        }
                        html += "</div>";
                        return html;
                    }
                }
            }];

            var dataTable = $('.harvesters-table').dataTable({
                serverSide: false,
                bLengthChange: false,
                bProcessing: true,
                order: [
                    [1, "asc"]
                ],
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "management/harvester/" + clientId + "/get-harvesters/" + entityId,
                    type: 'POST',
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: columns,
                "fnCreatedRow": function(nRow, aData, iDataIndex) {
                    if ($(nRow).find("input.select2")) {

                        $(nRow).find("input.select2").select2({
                            data: sources
                        });
                    }
                },
                "fnDrawCallback": function(oSettings) {

                    // To show suggested sources for which harvesters to be added 
                    var impSourcesObjectLength = Object.keys(impSources).length;
                    if (impSourcesObjectLength != 0) {
                        var impSourcesArr = $.map(impSources, function(val, i) {
                            return "<a href=" + val["url"] + "  target='_blank'>" + val["name"] + "</a>";
                        });
                        var impSourcesString = impSourcesArr.join(", ");
                        if (impSourcesArr.length == 1) {
                            var grammar = 'is';
                        } else {
                            var grammar = 'are';
                        }
                        var pinHtml = '<div class="alert alert-warning">' +
                            '<i class="fa fa-thumb-tack" style="margin:0 8px 0 0;"></i>' +
                            'The suggested sources for which harvesters to be added ' + grammar + ' ' + impSourcesString +
                            '.</div>';
                        $('.imp-sources').html(pinHtml);
                    } else {
                        $('.imp-sources').html('');
                    }

                    // To show sources having multiple harvesters
                    var impSourceWiseCountObjectLength = Object.keys(impSourceWiseCount).length;
                    if (impSourceWiseCountObjectLength != 0) {
                        var impSourceWiseCountArr = $.map(impSourceWiseCount, function(val, i) {
                            if (val["count"] > 1) {
                                return val["name"];
                            }
                        });
                        if (impSourceWiseCountArr.length > 0) {
                            if (impSourceWiseCountArr.length == 1) {
                                var grammar = 'is';
                            } else {
                                var grammar = 'are';
                            }
                            var impSourceWiseCountString = impSourceWiseCountArr.join(", ");
                            var pinHtml = '<div class="alert alert-info">' +
                                '<i class="fa fa-thumb-tack" style="margin:0 8px 0 0;"></i>' +
                                'The sources having multiple harvesters ' + grammar + ' ' + impSourceWiseCountString +
                                '.</div>';
                            $('.duplicate-sources').html(pinHtml);
                        } else {
                            $('.duplicate-sources').html('');
                        }
                    }
                }
            });
            $(".add-harvester-row").on("click", function(e) {
                e.preventDefault();
                dataTable.fnAddData({
                    "type": "new",
                    "id": ""
                });
                var sortingOrder = $('.harvesters-table').DataTable().order()[0][1];
                if ($(this).hasClass('top')) {
                    if (sortingOrder == 'desc') {
                        $("html, body").animate({
                            scrollTop: $('.harvesters-table').offset().top + $('.harvesters-table').height()
                        });
                    }
                } else {
                    if (sortingOrder == 'asc') {
                        $("html, body").animate({
                            scrollTop: $('.harvesters-table').offset().top - 60
                        });
                    }
                }
            });
            $('.harvesters-table').on("click", ".hr-add", function(e) {
                e.preventDefault();
                var me = $(this);
                var row = me.parents("tr");
                var sourceId = row.find("input.select2").val();
                var url = row.find("input.url").val();
                if (sourceId == '') {
                    alert("Please select a Source!");
                    return false;
                } else if (url == '') {
                    alert("URL cannot be empty!");
                    return false;
                } else {
                    $.ajax({
                        url: SocialView.base_url + "management/harvester/" + clientId + "/create-harvester/" + entityId,
                        type: 'POST',
                        data: {
                            sourceId: sourceId,
                            url: url
                        },
                        beforeSend: function() {
                            Custom.showLoader(me.parents("tr"));
                        },
                        complete: function() {
                            Custom.hideLoader(me.parents("tr"));
                        }
                    }).done(function(json) {
                        if (json['status']) {
                            if (json['status']['code'] == 200) {
                                var rowIndex = dataTable.fnAddData(json["data"]);
                                var rowAdded = dataTable.fnGetNodes(rowIndex);
                                var originalColour = $(rowAdded).css("background");
                                $(rowAdded).css("background-color", "#FFFF66");
                                var rowIndexTORemove = dataTable.fnGetNodes(row);
                                dataTable.fnDeleteRow(rowIndexTORemove);
                                var time = 5000;
                                setTimeout(function() {
                                    $(rowAdded).css("background-color", originalColour);
                                }, time);
                            } else {
                                if (json['status']['message']) {
                                    alert(json['status']['message']);
                                    return false;
                                }
                            }
                        }
                    }).fail(function() {}).always(function() {});
                }
            });
            $('.harvesters-table').on("click", ".row-remove", function(e) {
                e.preventDefault();
                var me = $(this);
                var row = me.parents("tr");
                var rowIndexTORemove = dataTable.fnGetNodes(row);
                dataTable.fnDeleteRow(rowIndexTORemove);
            });
            $('.entity-verified').click(function(e) {
                e.preventDefault();
                if ($('.hr-verify').length != 0) {
                    alert("There are pending items to verify !");
                    return false;
                }
                Custom.showLoader();

                Verification.updateEntityStatus(clientId, entityId, "Approved");
            });
            $('.entity-rejected').click(function(e) {
                e.preventDefault();
                if (confirm("Are you sure you want to reject this entity ?")) {
                    Custom.showLoader();
                    Verification.updateEntityStatus(clientId, entityId, "Rejected");
                }
                return false;
            });
            $('.entity-nonpi').click(function(e) {
                e.preventDefault();
                if (confirm("Are you sure no NPI is available for this entity?")) {
                    Custom.showLoader();
                    Verification.updateEntityStatus(clientId, entityId, "NoNPI");
                }
                return false;
            });
            $('.entity-next').click(function(e) {
                e.preventDefault();
                Custom.showLoader();
                Verification.updateEntityStatus(clientId, entityId, "N");
            });
            $(".verify-harvesters").on("click", function(e) {
                e.preventDefault();
                var className = 'verify-harvesters';
                var url = SocialView.base_url + "management/verification/" + clientId + "/verify-harvester/" + entityId;
                Verification.updateHarvesterStatus(className, url, "verify");
            });
            $(".delete-harvesters").on("click", function(e) {
                e.preventDefault();
                var className = 'delete-harvesters';
                var url = SocialView.base_url + "management/harvester/" + clientId + "/delete-harvester/" + entityId;
                Verification.updateHarvesterStatus(className, url, "delete");
            });
            $('.harvesters-table').on("click", ".hr-verify", function(e) {
                e.preventDefault();

                var me = $(this);
                var row = $(this).parents("tr");
                var harvesterId = $(this).attr("harvester-id");
                harvesterIds = new Array();
                harvesterIds[0] = harvesterId;
                $.ajax({
                    url: SocialView.base_url + "management/verification/" + clientId + "/verify-harvester/" + entityId,
                    type: "POST",
                    data: {
                        harvesterId: harvesterIds
                    },
                    beforeSend: function() {
                        Custom.showLoader(me.parents("tr"));
                    },
                    complete: function() {
                        Custom.hideLoader(me.parents("tr"));
                    }
                }).done(function(json) {
                    if (json['status']) {
                        if (json['status']['code'] == 200) {
                            if (json['data']) {
                                var data = new Array();
                                data = json['data'];
                                $.each(data, function(i, obj) {
                                    var rowIndex = dataTable.fnGetNodes(row);
                                    dataTable.fnDeleteRow(rowIndex);
                                    Verification.updateSuggestedSourceAndDecrementHarvesterCount(obj.sourceId);
                                    dataTable.fnAddData(obj);
                                });
                            }
                        } else {
                            if (json['status']['message']) {
                                alert(json['status']['message']);
                                return false;
                            }
                        }
                    }
                }).fail(function() {

                }).always(function() {

                });
            });
            $('.harvesters-table').on("click", ".hr-edit", function(e) {
                e.preventDefault();
                var harvesterId = $(this).attr("harvester-id");
            });
            $('.harvesters-table').on("click", ".hr-delete", function(e) {
                e.preventDefault();
                if (confirm("Are you sure you want to delete ?")) {
                    var me = $(this);
                    var row = me.parents("tr");
                    var harvestersId = new Array();
                    harvestersId[0] = $(this).attr("harvester-id");
                    $.ajax({
                        url: SocialView.base_url + "management/harvester/" + clientId + "/delete-harvester/" + entityId,
                        type: "POST",
                        data: {
                            harvesterId: harvestersId
                        },
                        beforeSend: function() {
                            Custom.showLoader(me.parents("tr"));
                        },
                        complete: function() {
                            Custom.hideLoader(me.parents("tr"));
                        }
                    }).done(function(json) {
                        if (json['status']["code"] == 200) {
                            var sid = me.attr("source-id");
                            Verification.updateSuggestedSourceAndDecrementHarvesterCount(sid); //to decrement harvester count of  source of deleted row and to update suggested source

                            //removing the deleted row from datatable starts
                            var rowIndexTORemove = dataTable.fnGetNodes(row);
                            dataTable.fnDeleteRow(rowIndexTORemove);
                            //removing the deleted row from datatable ends

                        }
                    }).fail(function() {

                    }).always(function() {

                    });
                }
                return false;
            });
            $(".select-all").on("click", function(e) {
                if ($('.select-all').is(':checked')) {
                    $('.harvesters-table tbody input[type="checkbox"]:not(:checked)').trigger('click');
                } else {
                    $('.harvesters-table tbody input[type="checkbox"]').prop('checked', false);
                }
            });
            $('.portlet-title .npi-edit').on('click', function(e) {
                var npi = $('.npi').html();
                $('.npi-edit-box').css("display", "inline-block");
                $('.npi-edit-box').val(npi);
                $('.npi-submit').css("display", "inline-block");
                $('.npi-cancel').css("display", "inline-block");
                $('.npi').css("display", "none");
                $('.npi-edit').css("display", "none");
            });
            $('.portlet-title .npi-cancel').on('click', function(e) {
                $('.npi-edit-box').css("display", "none");
                $('.npi-submit').css("display", "none");
                $('.npi-cancel').css("display", "none");
                $('.npi').css("display", "inline-block");
                $('.npi-edit').css("display", "inline-block");
            });
            $('.portlet-title .npi-submit').on('click', function(e) {
                var npi = $.trim($('.npi-edit-box').val());
                var existingNpi = $('.npi').html();
                if (npi.length != 10) {
                    Custom.showMessages("error", "Validation Error", ["NPI should be 10 Digit"]);
                    return false;
                }
                if (isNaN(npi) || npi < 0) {
                    Custom.showMessages("error", "Validation Error", ["NPI should be a 10 digit positive number"]);
                    return false;
                }
                if (npi == existingNpi) {
                    Custom.showMessages("error", "Same NPI", ["The existing NPI is same"]);
                    return false;
                }
                Custom.showLoader('.portlet-title');
                url = SocialView.base_url + "management/verification/" + clientId + "/update-npi/" + entityId;

                $.ajax({
                        url: url,
                        global: false,
                        type: "POST",
                        data: {
                            npi: npi
                        },
                        beforeSend: function() {},
                        complete: function() {},
                    })
                    .done(
                        function(json) {
                            if (json['status']) {
                                if (json['status'] == 200) {
                                    Custom.showMessages("success", "NPI updated successfully", ["NPI for this entity is updated successfully. Please wait to see the updated details."]);
                                    location.reload();
                                } else if (json['status'] == 409) {
                                    Custom.showMessages("error", "Same entity already exists", [json['message'],
                                        ["If you wanted to merge this two entities, please click <a href='" + SocialView.base_url + "management/verification/" + clientId + "/confirm-merge-entities?from-entity=" + entityId + "&to-entity=" + json['existingEntityId'] + "' targe=\"_blank\">here</a>"]
                                    ]);
                                    Custom.hideLoader('.portlet-title');
                                } else {
                                    Custom.showMessages("error", "An error occured", [json['message']]);
                                    Custom.hideLoader('.portlet-title');
                                }
                            }
                        }).fail(function() {

                    }).always(function() {

                    });
            });
        },
        updateHarvesterStatus: function(className, url, updateType) {
            if ($(".harvesters-table input:checkbox:checked").length == 0) {
                alert("Please select harvesters!");
                return false;
            }
            if (updateType == "delete") {
                if (!confirm("Are you sure you want to delete ?")) {
                    return false;
                }
            }
            var harvesterIds = $(".harvesters-table tbody input:checkbox:checked").map(function() {
                return $(this).val();
            }).get();
            var sourceIds = $(".harvesters-table tbody input:checkbox:checked").map(function() {
                return $(this).attr("source-id");
            }).get();

            var dataTable = $('.harvesters-table').dataTable();
            var rows = $(".harvesters-table tbody input:checkbox:checked").parents("tr");

            $.ajax({
                url: url,
                type: "POST",
                data: {
                    harvesterId: harvesterIds
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
                        if (updateType == 'verify') {
                            if (json['data']) {
                                var data = new Array();
                                data = json['data'];
                                
                                $.each(rows, function(i, obj) {
                                    var nodes = dataTable.fnGetNodes(rows);
                                    dataTable.fnDeleteRow(nodes);
                                });
                                $.each(data, function(i, obj) {
                                	Verification.updateSuggestedSourceAndDecrementHarvesterCount(obj.sourceId);
                                    dataTable.fnAddData(obj);
                                });
                            }
                        } else if (updateType == 'delete') {

                            $.each(sourceIds, function(i, val) {
                                Verification.updateSuggestedSourceAndDecrementHarvesterCount(val); //to decrement harvester count of  source of deleted row and to update suggested source
                            });

                            $.each(rows, function(i, obj) {
                                var nodes = dataTable.fnGetNodes(rows);
                                dataTable.fnDeleteRow(nodes);
                            });
                        }
                    } else {
                        if (json['status']['message']) {
                            alert(json['status']['message']);
                            return false;
                        }
                    }
                }
            }).fail(function() {

            }).always(function() {

            });
        },
        updateSuggestedSourceAndDecrementHarvesterCount: function(value) {
            // decrementing num of harvester created for a particular source on deletion
            // also adding to suggested source if one among them is removed
            impSourceWiseCount[value]["count"]--;
            if (impSourceWiseCount[value]["count"] == 0) {
                if (value in duplicateSources) {
                    if (!(value in impSources)) {
                        impSources[value] = {};
                        impSources[value]["name"] = duplicateSources[value]["name"];
                        impSources[value]["url"] = duplicateSources[value]["url"];
                    }
                }
            }
        },
        updateEntityStatus: function(clientId, entityId, status) {
            $.ajax({
                url: SocialView.base_url + "management/verification/" + clientId + "/update-entity-status/",
                type: 'POST',
                data: {
                    entityId: entityId,
                    status: status
                },
            }).done(function(json) {
                if (json['status']['code']) {
                    if (json['status']['code'] == 200) {
                        location.reload();
                    } else {
                        alert(json['status']['message']);
                    }
                }
                return true;
            }).fail(function() {
                return false;
            }).always(function() {
                return false;
            });
        },
        mergeEntity: function() {
            $('.from-entity').bind('change', function(e) {
                $('.to-entity').select2('val', '');
            });
            $('.merge-submit').on('click', function(e) {
                if ($('.from-entity').select2('val') == 0) {
                    Custom.showMessages("error", "An error occured", ["Please enter From Entity"]);
                    return false;
                }
                if ($('.to-entity').select2('val') == 0) {
                    Custom.showMessages("error", "An error occured", ["Please enter To Entity"]);
                    return false;
                }
                if ($('.from-entity').select2('val') == $('.to-entity').select2('val')) {
                    Custom.showMessages("error", "An error occured", ["Both selected entities are same"]);
                    return false;
                }
            });
        },
        transferHarvester: function(clientId) {
            $('.harvester-load').select2('val', '');
            $('.from-entity').bind('change', function(e) {
                $('.to-entity').select2('val', '');
                entityId = $(this).val();
                if (entityId != '') {
                    Custom.showLoader('.from-entity');
                    url = SocialView.base_url + "management/harvester/" + clientId + "/get-harvesters-for-select/" + entityId;

                    $.ajax({
                            url: url,
                            global: false,
                            type: "POST",
                            beforeSend: function() {},
                            complete: function() {},
                        })
                        .done(
                            function(json) {
                                if (json['data']) {
                                    var data = new Array();
                                    var content = new Array();
                                    data = json['data'];

                                    $('.harvester-load').select2({
                                        placeholder: "Select a harvester",
                                        multiple: 'multiple',
                                        data: data
                                    });
                                    Custom.hideLoader('.from-entity');
                                }
                            }).fail(function() {

                        }).always(function() {

                        });
                }
            });
            $('.transfer-submit').on("click", function(e) {
                if ($('.from-entity').select2('val') == '') {
                    Custom.showMessages("error", "Validation Error", ["Please select From Entity"]);
                    return false;
                }
                if ($('.harvester-load').select2('val') == '') {
                    Custom.showMessages("error", "Validation Error", ["Please select Harvesters"]);
                    return false;
                }
                if ($('.to-entity').select2('val') == '') {
                    Custom.showMessages("error", "Validation Error", ["Please select To Entity"]);
                    return false;
                }
                if ($('.from-entity').select2('val') == $('.to-entity').select2('val')) {
                    Custom.showMessages("error", "An error occured", ["Both selected entities are same"]);
                    return false;
                }
            });
        },
        home: function(clientId) {
            $('.portlet-title .statistics-refresh').addClass('active');

            $(".dashboard-stat").each(function() {
                var me = $(this);
                var statType = me.attr("stat-type");
                me.addClass(statType);
                Verification.statistics(clientId, statType, '.' + statType, "", "", "", true);
                count++;
            });

            $('.portlet-title .statistics-refresh').on('click', function(e) {
                var me = $(this);
                me.addClass('active');
                count = 0;
                $(".dashboard-stat").each(function() {
                    var me = $(this);
                    var statType = me.attr("stat-type");
                    Verification.statistics(clientId, statType, '.' + statType, 'refresh', "", "", true);
                    count++;
                });
            });

            setInterval(function() {
                $(".portlet-title .statistics-refresh").trigger("click");
            }, 120000);
        },
        statistics: function(clientId, serviceType, className, enquireType, fromDate, toDate, cache) {
            enquireType = enquireType || "normal";
            fromDate = fromDate || "";
            toDate = toDate || "";
            cache = cache || false;
            if (!cache) {
                enquireType = 'refresh';
            }
            Custom.showLoader(className);
            $.ajax({
                url: SocialView.base_url + "management/verification/" + clientId + "/get-statistics",
                type: 'POST',
                data: {
                    serviceType: serviceType,
                    enquireType: enquireType,
                    fromDate: fromDate,
                    toDate: toDate,
                    cache: cache
                }
            }).done(function(json) {
                if (json['status']['code']) {
                    if (json['status']['code'] == 200) {
                        $(className + ' .number').html(json[serviceType]);
                    } else {}
                    Custom.hideLoader(className);
                    count--;
                    if (count == 0) {
                        $('.portlet-title .statistics-refresh').removeClass('active');
                    }
                }
                return true;
            }).fail(function() {
                return false;
            }).always(function() {
                return false;
            });
        },
        statisticsDetail: function(clientId, period) {
            Verification.statisticsDetailContent(clientId, period);
            $('.period').on('click', function(e) {
                var period = $(this).attr("period");
                var oTable = $('.statistics-detail-table').dataTable();
                oTable.fnDestroy();
                Verification.statisticsDetailContent(clientId, period);
            });
        },
        statisticsDetailContent: function(clientId, period) {
            var fromDate = $('.' + period).attr('fromDate');
            var toDate = $('.' + period).attr('toDate');
            $(".dashboard-stat").each(function() {
                var me = $(this);
                var statType = me.attr("stat-type");
                me.addClass(statType);
                Verification.statistics(clientId, statType, '.' + statType, "refresh", fromDate, toDate);
            });
            var columns = [{
                "data": "name",
                "orderable": true,
                "mRender": function(data, type, full) {
                    var html = '<img alt="" class="img-circle activity-user-logo" src=' + full.image_url + ' style="margin:0 10px 0 0;"/>' +
                        '<span>' + full.name + '</span>';
                    return html;
                }
            }, {
                "data": "approved",
                "orderable": true,
                "mRender": function(data, type, full) {
                	if(type == "sort"){
                		return full.approved;
                	} else {
                		var html = '<a href="' + SocialView.base_url + 'management/verification/hca/statistics-user-specific?email=' + full.email + '&type=approved">' + full.approved + '</a>';
                		return html;
                	}
                }
            }, {
                "data": "rejected",
                "orderable": true,
                "mRender": function(data, type, full) {
                	if(type == "sort"){
                		return full.rejected;
                	} else {
                		var html = '<a href="' + SocialView.base_url + 'management/verification/hca/statistics-user-specific?email=' + full.email + '&type=rejected">' + full.rejected + '</a>';
                		return html;
                	}
                }
            }];

            var dataTable = $('.statistics-detail-table').dataTable({
                serverSide: false,
                bLengthChange: false,
                bProcessing: true,
                bFilter: false,
                order: [
                    [1, "desc"]
                ],
                iDisplayLength: 100,
                "aoColumnDefs": [{
                    "sClass": "text-center",
                    "aTargets": [1, 2]
                }],
                ajax: {
                    url: SocialView.base_url + "management/verification/" + clientId + "/get-statistics-detail",
                    type: 'POST',
                    data: {
                        fromDate: fromDate,
                        toDate: toDate
                    },
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: columns
            });
        },
        statisticsUserSpecific: function(clientId, email, type) {
            var columns = [{
                "data": "name",
                "name": "NAME",
                "orderable": true,
                "mRender": function(data, type, full) {
                    var url = SocialView.base_url + 'management/verification/hca/entity?specific-entity=' + full.id;
                    var html = "<a href=\"" + url + "\" target=\"_blank\">" + full.name + "</a>";
                    return html;
                }
            }, {
                "data": "id",
                "name": "ID",
                "orderable": false
            }, {
                "data": "harvestercount",
                "name": "HARVESTERCOUNT",
                "orderable": false
            }, {
                "data": "code",
                "name": "CODE",
                "orderable": false
            }, {
                "data": "verifiedtime",
                "name": "VERIFIED_TIME",
                "orderable": true
            }];

            var dataTable = $('.statistics-detail-table').dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                bFilter: false,
                order: [
                    [4, "desc"]
                ],
                iDisplayLength: 100,
                "aoColumnDefs": [{
                    "sClass": "text-center",
                    "aTargets": [1, 2, 3]
                }],
                ajax: {
                    url: SocialView.base_url + "management/verification/" + clientId + "/get-statistics-user-specific",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email: email,
                        type: type
                    },
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: columns
            });
        },
        confirmMergeEntities: function(clientId, fromEntityId, toEntityId) {
            var columns = [{
                "data": "sourceid",
                "name": "sourceid",
                "orderable": true
            }, {
                "data": "sourcename",
                "name": "sourcename",
                "orderable": true
            }, {
                "data": "url",
                "name": "url",
                "orderable": false
            }];

            var dataTable = $('.common-harvesters-table').dataTable({
                serverSide: false,
                bLengthChange: false,
                bProcessing: true,
                order: [
                    [1, "desc"]
                ],
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "management/verification/" + clientId + "/get-common-havesters",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        fromEntityId: fromEntityId,
                        toEntityId: toEntityId
                    },
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: columns
            });
        },
        psiAuditReport: function(clientId) {
        	$('.generate-report-submit').on('click',function(e){
        		if ($('.entity').select2('val') == 0) {
                    Custom.showMessages("error", "An error occured", ["Please Select Entity"]);
                    return false;
                }
        	});
        }
    };
}();