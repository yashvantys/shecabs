var Harvesters = function() {
    return {
        management: function() {
            var client = $("select.hv-client").val();
            var source = $("select.hv-source").val();
        	var status = $("select.hv-status").val();
        	var nextRunDate = $("input.next-run-date").val();
        	var competitorFlag = $("select.hv-competitor").val();
        	var retryCount = $("input.retry-count").val();
        	$(".hv-competitor-wrapper").hide();
            var columns = [{
                'targets': 0,
                'searchable':false,
                "width": "3%",
                'orderable':false,
                'className': 'dt-body-center',
                'render': function (data, type, full, meta){
                    return '<input type="checkbox" name="harvesterId[]" value="' + full.id + '">';
                }
             }, {
                "data": "sourceName",
                "orderable": false,
                "width": "7%"
            }, {
                "data": "entity",
                "orderable": false,
                "width": "8%"
            }, {
                "data": "url",
                "orderable": false,
                "width": "20%"
            }, {
                "data": "statusText",
                "orderable": false,
                "width": "3%"
            },{
                "data": "retryCount",
                "orderable": false,
                "width": "2%"
            },{
            	"data" : "lastRunTime",
            	"orderable": false,
            	"width": "8%",
            	 "mRender": function(data, type, full) {
            		 var html = "";
                     if (data != null && data != "") {
                         var d = new Date(data);
                         if (type == 'sort') {
                             return d.getTime();
                         } else {
                             html = "<span class=\"date\">" + d.toLocaleString() + "</span>";
                         }
                     }
                     return html;
                 }
            },{
            	"data" : "nextRunTime",
            	"orderable": false,
            	"width": "8%",
            	 "mRender": function(data, type, full) {
            		 var html = "";
                     if (data != null && data != "") {
                         var d = new Date(data);
                         if (type == 'sort') {
                             return d.getTime();
                         } else {
                             html = "<span class=\"date\">" + d.toLocaleString() + "</span>";
                         }
                     }
                     return html;
                 }
            },{
            	"data" : "mentionStartTime",
            	"orderable": false,
            	"width": "8%",
            	 "mRender": function(data, type, full) {
            		 var html = "";
                     if (data != null && data != "") {
                         var d = new Date(data);
                         if (type == 'sort') {
                             return d.getTime();
                         } else {
                             html = "<span class=\"date\">" + d.toLocaleString() + "</span>";
                         }
                     }
                     return html;
                 }
            },  {
                "data": "error",
                "orderable": false,
                "width": "10%"
            }, {
                "data": "action",
                "orderable": false,
                "width": "10%"
            }, ];

            var dataTable = $('#harvesters-error-management').dataTable({
                serverSide: true,
                dom: "<'row'<'col-md-6 col-sm-12'li><'col-md-6 col-sm-12'fp>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
                bLengthChange: false,
                bProcessing: true,
                bFilter: false,
                order: [
                    [6, "asc"]
                ],
                iDisplayLength: 100,
                "aoColumnDefs": [{
                    "sClass": "text-left",
                    "aTargets": [0, 1]
                }],
                ajax: {
                    url: SocialView.base_url + "management/harvester/admin/harvesters-details-list",
                    type: 'POST',
                    data: function(d) {
                        d.clientId = client;
                        d.source = source;
                        d.status = status;
                        d.nextRunDate = nextRunDate;
                        d.competitorFlag = competitorFlag;
                        d.retryCount = retryCount;
                    },
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                columns: columns
            });

            $("select.hv-client").on("change", function(){
            	var client = $(this).val();
            	
            	if(client!="") {
            		$(".hv-competitor-wrapper").show();
            	} else {
            		$(".hv-competitor-wrapper").hide();
            	}
            	
            });
            
            $('#select-all').on('click', function(){
                // Get all rows with search applied
             
            	 if ($('#select-all').is(':checked')) {
                     $('#harvesters-error-management tbody input[type="checkbox"]:not(:checked)').trigger('click');
                 } else {
                     $('#harvesters-error-management tbody input[type="checkbox"]').prop('checked', false);
                 }
             });

            
            $(".harvester-filter").on("click", function(e) {
            	e.preventDefault();
                client = $("select.hv-client").val();
                source = $("select.hv-source").val();
                status = $("select.hv-status").val();
                nextRunDate = $("input.next-run-date").val();
                competitorFlag = $("select.hv-competitor").val();
                retryCount = $("input.retry-count").val();
                dataTable.api().ajax.reload();
                return false;
            });
            
            
            
            $(".harvester-mgmt").on("click", ".run-asap-btn", function(){
            	var client = "All Clients";
            	if($("select.hv-client").val() != "") {
            		client = $("select.hv-client").val();
            		$(".run-asap-competitor-wrapper").show();
            	$(".run-asap-client").html(client);
            	$(".run-asap-source").html($("select.hv-source").select2('data').text);
            	var statuses = $("select.hv-status").select2('data');
            	var statHtml = "";
            	for (var int = 0; int < statuses.length; int++) {
            		statHtml += statuses[int]['text'];
            		statHtml += ", ";
				}
            	$(".run-asap-status").html(statHtml);
            	$(".run-asap-next-run-date").html(nextRunDate);
            	$(".run-asap-competitor").html(competitorFlag);
            	$(".run-asap-retry-count").html(retryCount);
            	$("#run-asap-modal").modal("show");
            	
            	} else {
            		Custom.showMessages("error", "You should select a client.", ["Sorry, in order to Run ASAP, you should select a client first."]);
            	}
            })
            
            
            $(".harvester-mgmt").on("click",".run-asap-submit", function(){
            	
            	$.ajax({
                    url: SocialView.base_url + "management/harvester/admin/re-run-harvesters",
                    data: {
                    	 clientId : client,
                         source : source,
                         status : status,
                         nextRunDate : nextRunDate,
                         competitorFlag : competitorFlag,
                         retryCount : retryCount
                    },
                    type: "POST",
                    error: function(error) {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    },
                    beforeSend: function() {
                        Custom.showLoader();
                    },
                    complete: function() {
                        Custom.hideLoader();
                    }
                }).done(function(data) {
                	if(data.status.code == 200) {
                		Custom.showMessages("success", "Harvesters matching below criterias will be run ASAP!", [""]);
                		dataTable.api().ajax.reload();
                	} else {
                		Custom.showMessages("error", "An error occurred.", [data.status.message]);
                	}
                });
            	
            });
            
            $(".harvester-mgmt").on("click", ".run-selected-btn", function(){
            	var count;
            	var harvesterIds = $("#harvesters-error-management tbody input:checkbox:checked").map(function() {
                    return $(this).val();
                }).get();
            	if(harvesterIds.length > 0) {
            		$(".run-selected-count").html(harvesterIds.length);
            		$("#run-selected-modal").modal("show");
            	} else {
            		Custom.showMessages("warning", "You haven't selected anything!", [""]);
            	}
            });
            
            $(".harvester-mgmt").on("click",".run-selected-submit", function(){
            	var harvesterIds = $("#harvesters-error-management tbody input:checkbox:checked").map(function() {
                    return $(this).val();
                }).get();
            	$.ajax({
                    url: SocialView.base_url + "management/harvester/admin/re-run-harvesters",
                    data: {
                    	harvesterId : harvesterIds
                    },
                    type: "POST",
                    error: function(error) {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    },
                    beforeSend: function() {
                        Custom.showLoader();
                    },
                    complete: function() {
                        Custom.hideLoader();
                    }
                }).done(function(data) {
                	if(data.status.code == 200) {
                		Custom.showMessages("success", "Selected Harvesters will be run ASAP!", [""]);
                		dataTable.api().ajax.reload();
                	} else {
                		Custom.showMessages("error", "An error occurred.", [data.status.message]);
                	}
                });
            	
            });
            

            $(".harvester-mgmt").on("click", ".escalate-selected-btn", function(){
            	var count;
            	var harvesterIds = $("#harvesters-error-management tbody input:checkbox:checked").map(function() {
                    return $(this).val();
                }).get();
            	if(harvesterIds.length > 0) {
            		$(".escalate-selected-count").html(harvesterIds.length);
            		$("#escalate-selected-modal").modal("show");
            	} else {
            		Custom.showMessages("warning", "You haven't selected anything!", [""]);
            	}
            });
            
            $(".harvester-mgmt").on("click",".escalate-selected-submit", function(){
            	var harvesterIds = $("#harvesters-error-management tbody input:checkbox:checked").map(function() {
                    return $(this).val();
                }).get();
            	$.ajax({
                    url: SocialView.base_url + "management/harvester/admin/escalate-harvester",
                    data: {
                    	harvesterId : harvesterIds
                    },
                    type: "POST",
                    error: function(error) {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    },
                    beforeSend: function() {
                        Custom.showLoader();
                    },
                    complete: function() {
                        Custom.hideLoader();
                    }
                }).done(function(data) {
                	if(data.status != undefined && data.status.code == 200) {
                		Custom.showMessages("success", "Selected Harvesters will be escalated!", [""]);
                	} else {
                		Custom.showMessages("error", "An error occurred.", [data.status.message]);
                	}
                });
            	
            });
            
            $('.harvesters-error-management').on('click', '.edit_url', function() {
                var source_edit_id = $(this).attr("source_edit_id");
                var source_edit_url = $(this).attr("source_edit_url");
                if (source_edit_id && source_edit_url) {
                    $(".load_url").val(source_edit_url);
                    $(".load_url_id").val(source_edit_id);
                    $('#edit_url').modal('show');
                }

            });

            $('.harvesters-error-management').on('click', '.delete', function() {
                var source_delete_id = $(this).attr("source_delete_id");
                if (source_delete_id) {
                    $(".load_url_id").val(source_delete_id);
                    $('#delete').modal('show');
                }
            });

            $('.harvesters-error-management').on('click', '.escalate', function() {
                var source_escalate_id = $(this).attr("source_escalate_id");
                if (source_escalate_id) {
                    $(".load_url_id").val(source_escalate_id);
                    $('#escalate').modal('show');
                }
            });

            $(".edit-url-submit").on("click", function() {
                var load_url = $(".load_url").val();
                var load_url_id = $(".load_url_id").val();
                var me = $(".edit-hv"+load_url_id);
                var row = me.parents("tr");
                $.ajax({
                    url: SocialView.base_url + "management/harvester/admin/update-harvester-url",
                    data: {
                        id: load_url_id,
                        url: load_url,
                        type: 'edit'
                    },
                    type: "POST",
                    error: function(error) {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    },
                    beforeSend: function() {
                        Custom.showLoader(me.parents("tr"));
                    },
                    complete: function() {
                        Custom.hideLoader(me.parents("tr"));
                    }
                }).done(function(data) {
                    Custom.showMessages("success", "Selected Harvester URL updated successfully!", [""]);
                    var rowIndexTORemove = dataTable.fnGetNodes(row);
                    dataTable.fnDeleteRow(rowIndexTORemove);

                });
            });

            $(".delete_url_submit").on("click", function() {
            	
                var load_url_id = $(".load_url_id").val();
                var me = $(".delete-hv-"+load_url_id);
            	var row = me.parents("tr");
                $.ajax({
                    url: SocialView.base_url + "management/harvester/admin/update-harvester-url",
                    data: {
                        id: load_url_id,
                        type: "delete_url"
                    },
                    type: "POST",
                    error: function(error) {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    },
                    beforeSend: function() {
                        Custom.showLoader(me.parents("tr"));
                    },
                    complete: function() {
                        Custom.hideLoader(me.parents("tr"));
                    }
                }).done(function(data) {
                    Custom.showMessages("success", "Selected Harvester deleted successfully!", [""]);
                    var rowIndexTORemove = dataTable.fnGetNodes(row);
                    dataTable.fnDeleteRow(rowIndexTORemove);
                });
            });

            $(".escalate_url_submit").on("click", function() {
                var load_url_id = $(".load_url_id").val();
                var me = $(".escalate-hv-"+load_url_id);
            	var row = me.parents("tr");
                $.ajax({
                    url: SocialView.base_url + "management/harvester/admin/update-harvester-url",
                    data: {
                        id: load_url_id,
                        type: "escalate"
                    },
                    type: "POST",
                    error: function(error) {
                        Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
                    },
                    beforeSend: function() {
                        Custom.showLoader(me.parents("tr"));
                    },
                    complete: function() {
                        Custom.hideLoader(me.parents("tr"));
                    }
                }).done(function(data) {
                    Custom.showMessages("success", "Selected Harvester Escalated successfully!", [""]);
//                    dataTable.row( me.parents('tr') ).remove().draw();
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