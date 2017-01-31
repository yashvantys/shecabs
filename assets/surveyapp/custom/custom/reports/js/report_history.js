var reporthistory = function() {
	
	return {
		 dataTableObj:false,
		init : function(client_id, report_id, encoded_filter) {

		},
		initPage : function() {
			
			$("#filter_verified_date").clearSearch();
			$("#history-list").on(
					"click",
					".mail-link",
					function(e) {
						e.preventDefault();
						var href = $(this).attr("href");
						$(".modal").find(".mail-subject").html(
								$(this).attr("data-subject"));
						$(".modal").find(".loading").show();
						$(".modal").find('iframe').attr('src', href);
						$(".modal").find('iframe').hide();
						$('.modal').modal({
							show : true
						});
					});
			$('.modal').on('hidden.bs.modal', function() {
				$(".modal").find('iframe').attr('src', "about:blank");
				$(".modal").find(".loading").show();
				Custom.showLoader($(".modal").find(".loading"));
			});

			$(".modal").find('iframe').load(function() {
				$(".modal").find(".loading").hide();
				Custom.hideLoader(".loading");
			});

			$('.modal').on('shown.bs.modal', function() {
				href = ($(this).find('iframe').attr('src'));
				$(".modal").find('iframe').show();
			});

			$(".send-all-verfied").on("click", function(e) {
				e.preventDefault();
				// Show the datepicker in the bootbox
				bootbox.dialog({
					message : BootboxContent('sent'),
					title : "Send Report",
					onEscape : function() {
					},
					buttons : {
						main : {
							label : "Send",
							className : "btn-primary accept-send",
							callback : acceptSend
						},
						cancel : {
							label : "Cancel",
							className : "btn-default"
						}

					}
				});

			});
			
			$(".reschedule-all-reports").on("click", function(e) {
				e.preventDefault();
				bootbox.dialog({
					message : BootboxContent('rescheduled'),
					title : "ReSchedule Report",
					onEscape : function() {
					},
					buttons : {
						main : {
							label : "Reschedule",
							className : "btn-primary accept-reschedule",
							callback : acceptReschedule
						},
						cancel : {
							label : "Cancel",
							className : "btn-default"
						}

					}
				});

			});

			$("#history-list")
					.on("click",
							".sent-now",
							function(e) {
								e.preventDefault();
								link = $(this);
								var notificationId = $(this).attr(
										'data-notification');
								var historyid = $(this).attr('data-id');
								url = SocialView.base_url + 'reports/'
										+ SocialView.client_id
										+ '/page/notification_trigger/'
										+ notificationId;
								$.ajax(
												{
													'url' : url,
													'dataType' : 'json',
													data : {
														notification_id : notificationId,
														'historyId' : historyid
													},
													type : "POST",
													error : function(error) {
														bootbox.alert("Error when sending report.");
													},
													beforeSend : function() {
														Custom.showLoader(".report-history");
													},
													complete : function() {
														Custom.hideLoader(".report-history");
													}
												})
										.done(
												function(data) {
													
													
													
													if (data.status.code == 200) {
														if(data.hasOwnProperty('historyData')) {
															 
															link.parents('tr').find(".col-sentinfo .date").html(data.historyData.sentInfo);
														}
														bootbox.alert("Reports will be sent using the schedule configuration.");
														link.parents('tr').find(".col-qc").html('sent');
														link.parent().html("--");
													} else {
														bootbox.alert("Error when sending report."
																		+ data.status.message);
													}

												});

							});

			$("#history-list").on(
					"click",
					".reject-link",
					function(e) {
						e.preventDefault();
						link = $(this);
						bootbox.confirm("Are you sure want to " + link.text()
								+ " this report?", function(res) {
							if (res) {
								var notificationId = link
										.attr('data-notification');
								var historyid = link.attr('data-id');
								auditReportSchedule(link, historyid,
										notificationId, 'rejected')

							}
						});

					});

			$("#history-list").on(
					"click",
					".approve-link",
					function(e) {
						e.preventDefault();
						link = $(this);
						bootbox.confirm("Are you sure want to " + link.text()
								+ " this report?", function(res) {
							if (res) {
								var notificationId = link
										.attr('data-notification');
								var historyid = link.attr('data-id');
								auditReportSchedule(link, historyid,
										notificationId, 'approved');

							}
						});
					});

			$("#history-list").on("click",".reschedule-link",
					function(e) {
						e.preventDefault();
						link = $(this);
						bootbox.confirm("Are you sure want to " + link.text()
								+ " this report?", function(res) {
							if (res) {
								var notificationId = link
										.attr('data-notification');
								var historyid = link.attr('data-id');
								auditReportSchedule(link, historyid,
										notificationId, 'reschedule')
							}
						});

					});

		},
		submitFilter : function() {
			Custom.hideMessages();
			var filter_mail_recipient = $('#filter_mail_recipient').select2(
					'val');
			var status_list = $(".filter_status").select2("val");
			var verifiedDate = $("#filter_verified_date").val();
			var chk = $('#chkdate').is(':checked');
			var report_type =  $("#filter_report_type").val(); 
			var verifiedBy = $('#filter_mail_verified').select2('val');
			start_date = '', end_date = '';
			if (chk) {
				start_date = $("#filter_start_date").val();
				end_date = $("#filter_end_date").val();
			}
			var listColumns = [

			{
				"mData" : "report",
				"orderable" : false,
			/* "className" : "text-center" */
			}, {
				"mData" : "recipient",
				"orderable" : false,
				"sClass": "col-sentinfo",
				"width" : "20%"
			}, {
				"mData" : "status",
				"orderable" : false,
				"sClass" : "col-status text-center",
				"width" : "5%"
			}, {
				"mData" : "prepared_time",
				"orderable" : false,
				/*
				 * "mRender": function(data, type, full){ return
				 * full.content_html; },
				 */
				"width" : "10%"
			}, {
				"mData" : "qc_details",
				"sClass" : "col-qc",
				"orderable" : false,
				"width" : "15%"
			}, {
				"mData" : "qc_actions",
				"orderable" : false,
				"width" : "10%"
			}, {
				"mData" : "actions",
				"orderable" : false,
				"width" : "10%"
			}

			];

			dataTableObj = $("#history-list")
					.DataTable(
							{
								serverSide : true,
								bLengthChange : false,
								searching : false,
								iDisplayLength : 100,
								"bDestroy" : true,
								"bProcessing" : false,
								"language" : {
									"emptyTable" : "There is no report history available for the given filter settings."
								},
								order : [ [ 0, 'desc' ] ],
								ajax : {
									url : SocialView.base_url + 'statistics/'
											+ SocialView.client_id
											+ '/history_report_json',
									type : 'POST',
									data : {
										mail_recipient : filter_mail_recipient,
										status_list : status_list,
										start_date : start_date,
										end_date : end_date,
										report_type:report_type,
										verifiedBy:verifiedBy,
										verifiedDate:verifiedDate,
									},
									dataType : 'json',
									beforeSend : function() {
										Custom.showLoader();
									},
									complete : function() {
										Custom.hideLoader();
									},
									error : function() {
										Custom.hideLoader();
										Custom
												.showMessages(
														"error",
														"An error occurred",
														[ "Sorry, there is an error processing your request. Please try again later" ]);
									}
								},
								aoColumns : listColumns
							});

			return false;
		},
		filterPage : function() {
			$("#chkdate").click(
					function() {
						var chk = $('#chkdate').is(':checked');
						if (chk) {
							$(".filter_start_date,.filter_end_date").prop(
									"disabled", false);
							$(".filter_start_date").focus();
						} else {
							$(".filter_start_date,.filter_end_date").prop(
									"disabled", true);
						}
					});

			$(".history_filter_submit").on("click", function(e) {
				e.preventDefault();
				reporthistory.submitFilter();
			});

		}
	};
}();

var lastDate = '';
var scheduleDate = '';
var lastStatus = '';

function acceptSend() {
	lastDate = $(".date-popup").val();
	scheduleDate = $(".date-popup-scheduled").val();
	lastStatus = $("#filter_status_popup").select2('val');
	if (scheduleDate == "" || lastDate == "" || lastStatus.length == 0) {
		bootbox.alert("Please enter valid date and status", function() {
			$('#filter_status_popup').select2({});
		});
		return false;
	}

	processPendingReports(lastDate,scheduleDate, lastStatus, 'view');

}

function acceptReschedule() {
	lastDate = $(".date-popup").val();
	scheduleDate = $(".date-popup-scheduled").val();
	lastStatus = $("#filter_status_popup").select2('val');
	if (lastDate == "" || lastStatus.length == 0) {
		bootbox.alert("Please enter valid date and status", function() {
			$('#filter_status_popup').select2({});
		});
		return false;
	}

	processRescheduleReports(lastDate,scheduleDate, lastStatus, 'view');

}

function processRescheduleReports(selDate,scheduleDate, filter_status, action) {
	url = SocialView.base_url + 'reports/' + SocialView.client_id
			+ '/page/notification_reschedule_by_status/' + action;
	$.ajax({
				'url' : url,
				'dataType' : 'json',
				data : {
					preparedDate : selDate,
					scheduleDate:scheduleDate,
					reportStatus : filter_status
				},
				type : "POST",
				error : function(error) {
					bootbox.alert("Error when rescheduling report.");
				},
				beforeSend : function() {
					Custom.showLoader();
				},
				complete : function() {
					Custom.hideLoader();
				}
			})
			.done(
					function(data) {
						if (action == 'reschedule') {
							if (data.data.length == 0) {
								bootbox
										.alert("No reports were pending to reschedule.");
							} else {
								bootbox.alert(data.data.length
										+ " reports are rescheduled.",
										function() {
										//dataTableObj.ajax.reload();
										});
							}
						} else {
							if (data.data.length == 0) {
								bootbox
										.alert("No reports were pending to reschedule.");
								return;
							}

							finalhtml = '<div class="scroller" style="height: 300px;" data-always-visible="1" data-rail-visible="0"><ul class="feeds">';

							$.each(
											data.data,
											function(index, value) {
												strlbl = 'label-warning';
												if (value.status == 'approved')
													strlbl = 'label-info';
												html = '	<li><div class="col1"><div class="cont"><div class="cont-col1">';
												html += '<div class="label label-sm '
														+ strlbl
														+ ' " title="'
														+ value.status
														+ '"><i class="fa fa-check"></i></div></div><div class="cont-col2"><div class="desc" title="'+value.subject+'"><div class="ellipsis">'
														+ value.subject;
												html += '</div><span class="reschedule-status label label-sm '
														+ strlbl + '">';
												html += value.status
														+ '</span></div></div></div></div><div class="col2"><div class="date" title="Prepared Time">'
														+ value.preparedTime
														+ '</div></div></li>';
												finalhtml += html;

											});

							finalhtml += '</li></ul></div>';
							bootbox
									.dialog({
										message : finalhtml,
										title : "Reschedule Reports."
												+ " <small>Click 'Reschedule' button to reschedule "
												+ data.data.length
												+ " report(s).</small>",
										onEscape : function() {
										},
										buttons : {
											main : {
												label : "Reschedule",
												className : "btn-primary accept-verified-reschedule",
												callback : function() {
												}
											},
											cancel : {
												label : "Cancel",
												className : "btn-default"
											}

										}
									});

							$(".accept-verified-reschedule").on(
									"click",
									function() {
										processRescheduleReports(lastDate,scheduleDate,
												lastStatus, 'reschedule');
									});

							$(".scroller").slimScroll({
								allowPageScroll : false,
								size : '7px',
								wheelStep : 1,
								touchScrollStep : 75,
								disableFadeOut : true
							});

						}
					});
}

function processPendingReports(selDate,schDate, filter_status, action) {
	url = SocialView.base_url + 'reports/' + SocialView.client_id
			+ '/page/notification_trigger_by_status/' + action;
	$
			.ajax({
				'url' : url,
				'dataType' : 'json',
				data : {
					preparedDate : selDate,
					scheduleDate : schDate,
					reportStatus : filter_status
				},
				type : "POST",
				error : function(error) {
					bootbox.alert("Error when sending report.");
				},
				beforeSend : function() {
					Custom.showLoader();
				},
				complete : function() {
					Custom.hideLoader();
				}
			})
			.done(
					function(data) {
						if (action == 'trigger') {
							if (data.data.length == 0) {
								bootbox
										.alert("No reports were pending to send.");
							} else {
								bootbox.alert(data.data[0].count
										+ " reports are scheduled to be send.",
										function() {
										});
							}
						} else {
							if (data.data.length == 0) {
								bootbox
										.alert("No reports were pending to send.");
								return;
							}

							finalhtml = '<div class="scroller" style="height: 300px;" data-always-visible="1" data-rail-visible="0"><ul class="feeds">';

							$
									.each(
											data.data,
											function(index, value) {
												strlbl = 'label-warning';
												if (value.status == 'approved')
													strlbl = 'label-info';
												html = '	<li><div class="col1"><div class="cont"><div class="cont-col1">';
												html += '<div class="label label-sm '
														+ strlbl
														+ ' " title="'
														+ value.status
														+ '"><i class="fa fa-check"></i></div></div><div class="cont-col2"><div class="desc">'
														+ value.subject;
												html += '<span class="label label-sm '
														+ strlbl + '">';
												html += value.status
														+ '</span></div></div></div></div><div class="col2"><div class="date" title="Prepared Time">'
														+ value.preparedTime
														+ '</div></div></li>';
												finalhtml += html;

											});

							finalhtml += '</li></ul></div>';
							bootbox
									.dialog({
										message : finalhtml,
										title : "Sent Reports."
												+ " <small>Click 'send' button to send "
												+ data.data.length
												+ " report(s).</small>",
										onEscape : function() {
										},
										buttons : {
											main : {
												label : "Send",
												className : "btn-primary accept-verified-send",
												callback : function() {
												}
											},
											cancel : {
												label : "Cancel",
												className : "btn-default"
											}

										}
									});

							$(".accept-verified-send").on(
									"click",
									function() {
										processPendingReports(lastDate,scheduleDate,
												lastStatus, 'trigger');
									});

							$(".scroller").slimScroll({
								allowPageScroll : false,
								size : '7px',
								wheelStep : 1,
								touchScrollStep : 75,
								disableFadeOut : true
							});

						}
					});
}

function BootboxContent(type) {
	var daylist = '';
	for(var dy=1;dy<=31;dy++) {
		daylist += "<option>"+("0" + dy).slice(-2);+"</option>";
	}
	var frm_str = '<form id="some-form">'
			+ '<div class="form-group">'
			/* +'Are you sure want to send all verified reports?' */
			+ '<label for="date">Select Reports by date . These reports would be '+type+'.</label>'
			+'<br>Prepared Date<br>'
			+ '<input id="date" class="date date-popup span2 form-control input-sm" size="16" placeholder="mm/dd/yyyy" value="" type="text"><br>'
			+ '<label>Current schedule day</label>'
			+ '<select id="date" class="  date-popup-scheduled span2 form-control input-sm" placeholder="" value=""  >'+daylist+"</select><br>"
			+ '<div class="form-group "><label for="filter_status" class="">Status</label>'
			+ '<select name="filter_status_popup" id="filter_status_popup" block_class="col-lg-3 col-md-4 col-sm-6 col-xs-12 " class="select2 filter_status_popup valid form-control input-sm"  label="Status" multiple="multiple" data-placeholder="-- Select status for reports --" value=""> <option value=""></option>'
			+ (type=='sent'? '<option value="prepared">Prepared</option> <option value="approved">Approved</option>':'<option value="rejected">Rejected</option> <option value="sent" selected>Sent</option>')
			+'</select> </div></div> '
			+ '</div>' + '</form>';

	var object = $('<div/>').html(frm_str).contents();

	object.find('.date').datepicker({
		format : 'mm/dd/yyyy',
		autoclose : true
	}).on('changeDate', function(ev) {
		$(this).blur();
		$(this).datepicker('hide');
	});

	object.find('#filter_status_popup').select2({});

	object.find('#filter_status_popup').select2('val', []);

	return object
}

function auditReportSchedule(link, historyId, notificationId, status) {

	url = SocialView.base_url + 'reports/' + SocialView.client_id
			+ '/page/audit_report_schedule/' + historyId;
	$.ajax({
		'url' : url,
		'dataType' : 'json',
		data : {
			'status' : status
		},
		type : "POST",
		error : function(error) {
			bootbox.alert("Error when sending report.");
		},
		beforeSend : function() {
			Custom.showLoader(link.parents('tr'));
		},
		complete : function() {
			Custom.hideLoader(link.parents('tr'));
		}
	}).done(
			function(data) {
				if (data.status.code == 200) {
					Custom.hideLoader(link.parents('tr'));
					html = "<a href='#' data-notification='" + notificationId
							+ "' data-id='" + historyId
							+ "' class='sent-now'>Sent Now</a>";
					htmlreschedule = "<a href='#' data-notification='" + notificationId
					+ "' data-id='" + historyId
					+ "' class='reschedule-link'>Reschedule</a>";
					if(status!='reschedule'){
						link.parents('tr').find(".col-status").html(status);
					} else {
						link.parents('tr').find(".col-status").html('rescheduled');
					}
					
					if((status =="approved" || status =="rejected") && data.hasOwnProperty('historyData')) {
						hdata = data.historyData;
						qcstatus = hdata.verifiedBy+'<br>'+hdata.verifiedTime;
						link.parents('tr').find(".col-qc").html(qcstatus);
					}
					
					if (status != "rejected" && status != "reschedule") {
						link.parent().html(html);
					} else if(status == "rejected") {
						link.parent().html(htmlreschedule);
					}else {
						link.parent().html("--");
					}

				} else {
					bootbox.alert("Error when sending report."
							+ data.status.message);
				}

			});
}