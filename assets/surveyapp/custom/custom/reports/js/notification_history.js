var reporthistory = function() {
	
	return {
		 dataTableObj:false,
		init : function(client_id, report_id, encoded_filter) {

		},
		initPage : function() { 
		},
		submitFilter : function() { 
		},
		filterPage : function() { 
			$(".history_filter_submit").on("click",function(e){
				e.preventDefault();
				loadNotificationHistory();
			});
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
		}
	};
}();


function loadNotificationHistory() {
	Custom.hideMessages();
	var filter_mail_recipient = $('#filter_mail_recipient').select2(
			'val');
	var notification_type =  $("#filter_notification_type").val(); 
	start_date = '', end_date = '';
	start_date = $("input:text[name=filter_start_date]").val();
	end_date = $("input:text[name=filter_end_date]").val();
	 
	var listColumns = [

	{
		"mData" : "subject",
		"orderable" : false,
	}, {
		"mData" : "from_email",
		"orderable" : false,
		"sClass": "col-sentinfo text-center",
		"width" : "20%"
	}, {
		"mData" : "recipient",
		"orderable" : false,
		"width" : "10%"
	}, {
		"mData" : "type",
		"orderable" : false,
		"sClass" : "col-status text-center",
		"width" : "5%"
	}, {
		"mData" : "last_contact",
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
						"aoColumnDefs": [{ "sClass": "text-center", "aTargets": [ 1,2,3,4 ] }],
		                "bDestroy" : true,
						"bProcessing" : false,
						"language" : {
							"emptyTable" : "There is no notification history available for the given filter settings."
						},
						ajax : {
							url : SocialView.base_url + 'statistics/'
									+ SocialView.client_id
									+ '/notification_history_Json',
							type : 'POST',
							data : {
								mail_recipient : filter_mail_recipient,
								start_date : start_date,
								end_date : end_date,
								notification_type : notification_type
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
								Custom.showMessages(
												"error",
												"An error occurred",
												[ "Sorry, there is an error processing your request. Please try again later" ]);
							}
						},
						aoColumns : listColumns
					});
}
 