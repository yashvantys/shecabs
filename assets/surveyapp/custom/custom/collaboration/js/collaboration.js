function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var Collaboration = function () {
	return{
		loadTasks:function(){
			// Toggle Filter
//			$('#task-filter-form').hide();
			$('.coll-task-filter-toggle').on('click', function() {
				$('#task-filter-form').slideToggle('fast');
			});
			
			// My Task and All Task Button functionalities
			$(".coll_task_filter_recipient").on("change", function(){
				Custom.hideMessages();
				var me = $(this);
				if (me.select2('val') == SocialView.user_mail) {
					$(".my-task").addClass("active");
					$(".all-task").removeClass("active");
				}else{
					$(".all-task").addClass("active");
					$(".my-task").removeClass("active");
				}
			});
			
			$(".my-task").not('.active').on("click", function(){
				Custom.hideMessages();
				if ($('.coll_task_filter_recipient option[value="'+SocialView.user_mail+'"]').length || $(".coll_task_filter_recipient").val() == '') {
					
					if ($('.coll_task_filter_recipient option[value="'+SocialView.user_mail+'"]').length == 0) {
						var messages = [];
						messages.push("Since your email id not in assignee list, 'My tasks' can't populate.");
						
						Custom.showMessages('warning', 'Alert', messages);
					}else{
						$(".my-task").addClass("active");
						$(".all-task").removeClass("active");
						$('.escalation-task').removeClass("active");
						
						// Email reseting
						$(".coll_task_filter_recipient").select2('val', SocialView.user_mail);
						
						// Trigger click on filter submit
						$('.coll-task-filter-date-range-label').html('Task Date Range');
						$('#task_type').val('myTask');
						Collaboration.taskFilterFormSubmit('myTask');
					}
				}else{
					$(".all-task").trigger("click");
				}
			});
			$('.all-task').not('.active').on('click', function(){
				Custom.hideMessages();
				$('.all-task').addClass('active');
				$('.my-task').removeClass('active');
				$('.escalation-task').removeClass("active");
				
				// Email reseting
				$('.coll_task_filter_recipient').select2('val', '');
				
				// Trigger click on filter submit
				$('.coll-task-filter-date-range-label').html('Task Date Range');
				$('#task_type').val('allTask');
				Collaboration.taskFilterFormSubmit('allTask');
			});
			$('.escalation-task').not('.active').on('click', function(){
				Custom.hideMessages();
				$('.escalation-task').addClass("active");
				$('.all-task').removeClass('active');
				$('.my-task').removeClass('active');
				
				// Email reseting
				$('.coll_task_filter_recipient').select2('val', '');
				
				// Trigger click on filter submit
				$('.coll-task-filter-date-range-label').html('Escalation Date Range');
				$('#task_type').val('escalation');
				Collaboration.taskFilterFormSubmit('escalation');
			});
			// End of My Task and All Task
			
			// Task filter submit
			if ($(".coll_task_filter_submit").length) {
				if(SocialView.coll_task_filter_show_escalations == true){
					$(".escalation-task").click();
				}else if($(".coll_task_filter_recipient").select2('val') == SocialView.user_mail){
					$(".my-task").click();
				}else{ 
					$(".all-task").click();
				}
			}
			
			
			// End of task filter submit
			
			// Filter toggle
			$(".coll-task-filter").hide();
			$(".task-list-filter-toggle").on("click", function(){
				$(".coll-task-filter").slideToggle(200);
				$(this).toggleClass("active");
			});
			// End of filter toggle
			
			// Task list load more
			$(".coll_task_load_more").live("click", function(){
				
				var me = $(this);
				Custom.hideMessages();
				$.ajax({
					type: "POST",
					url: $(this).attr("data-url"),
					data: {
					},
					beforeSend: function(){
						Custom.showLoader('.coll-task-load-more-td');
					},
					complete: function(){
						Custom.hideLoader('.coll-task-load-more-td');
					},
					timeout: 60000,
					error: function(){
						var messages = [];
						messages.push("Please try again later.");
						
						Custom.showMessages('error', 'Something went wrong!', messages);
					}
				})
				.done(function( result ) {
					if(result.status.code == 200){
						var parent = me.parents("tbody");
						var rows = $(result.data).find("tbody").html();
						
						me.parents("tr").remove();
						parent.append(rows);
					}else{
						var messages = [];
						messages.push("Please try again later.");
						
						Custom.showMessages('error', 'Something went wrong!', messages);
					}
				});
			});
			
			
			//draft message change 
			$('.main-content').on('change','.task-engage-response-draft-main-page', function(){
				var pre_subject = $("option:selected", this).attr("subject");
				var pre_message = $("option:selected", this).attr("message");
				
				var subject = $("#approve-task-main-page-modal .task-engage-subject");
				var message = $("#approve-task-main-page-modal .task-engage-text");
				
				if ( (subject.length && subject.val() != "") || message.val() != "") {
					if (confirm("Do you wish to replace the content with the draft response ?")) {
						if(subject.length){
							subject.val(pre_subject);
						}
						message.val(pre_message);
					}
				}else{
					if(subject.length){
						subject.val(pre_subject);
					}
					message.val(pre_message);
				}
			});
			//task approve from main page
			$('body').on("click",".taskApproveFromMainPage",function(){
				var taskId = $(this).attr("taskApproveId");
				Custom.hideMessages();
				if(taskId){
					var clicked_btn = $(this);
					$.ajax({
							type: 'POST',
							url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-get-details/' + taskId,
							data: {
								taskId: taskId
							},
							beforeSend: function(){
								Custom.showLoader();
							},
							complete: function(){
								Custom.hideLoader();
							},
							timeout: 60000,
							error: function(){
								setTimeout(function(){
									var messages = [];
									messages.push("Please try again later.");
									
									Custom.showMessages('error', 'Something went wrong!', messages);
								}, 1000);
							}
						})
						.done(function( result ) {
							$("#approve-task-main-page-modal").modal('show');
							$('.task-details-div').html(result.data);
							$('#approve-task-main-page-modal .task-engage-source-account').select2();
							$("#approve-task-main-page-modal .task-engage-response-draft-main-page").select2();
						});
				}
			});
			
			//Task decline modal from main page
			$('body').on("click",".taskDeclineFromMainPage",function(){
				var taskId = $(this).attr("taskdeclineid");
				$("#task-declined-modal-main-page").modal("show");
				$("#task-declined-modal-main-page .declineTaskId").val(taskId);
			});
			// Draft change
			$('.task-engage-response-draft-main-page').on('change', function(){
				
				var pre_subject = $("option:selected", this).attr("subject");
				var pre_message = $("option:selected", this).attr("message");
				
				var subject = $("#approve-task-main-page-modal .task-engage-subject");
				var message = $("#approve-task-main-page-modal .task-engage-text");
				
				if ( (subject.length && subject.val() != "") || message.val() != "") {
					if (confirm("Do you wish to replace the content with the draft response ?")) {
						if(subject.length){
							subject.val(pre_subject);
						}
						message.val(pre_message);
					}
				}else{
					if(subject.length){
						subject.val(pre_subject);
					}
					message.val(pre_message);
				}
			});
			// End of draft change
			// Task approved by approver from main page
			$('body').on('click','.taskEngageByMainPage',function(){
				var taskId=$('.taskEngageByMainPage').attr('taskId');
				Custom.hideMessages();
				var clicked_btn = $(this);
				var messages = [];
				var validated = true;
				var source_account = $('#approve-task-main-page-modal .task-engage-source-account');
				var subject = $('#approve-task-main-page-modal .task-engage-subject');
				var subject_val = '';
				var document_id = $('.task-engage-document-id').val();
				var draft_approval_note =$("#approve-task-main-page-modal .task-engage-draft-note").val();
				var source_account_count = $("#approve-task-main-page-modal .source_account_setup").val();
				// Button Name
				if (clicked_btn.hasClass('taskEngageByMainPage')) {
					button_name = 'Approve';
					draft_approval_note = $("#approve-task-main-page-modal .task-engage-draft-note").val();
					if(source_account_count > 0){
						draft_approval_note = $("#approve-task-main-page-modal .task-engage-draft-note").val();
					}else{
						//$("#task-view-source-setup-flag-false-modal").modal('show');
						//return false;
					}
					
				}
				// Public flag
				var public_flag = '';
				if($('.task-engage-public:checked').length){
					public_flag = 'true';
				}else{
					public_flag = 'false';
				}
				var source_account_val = source_account.select2('val');
				var comment_box = $('#approve-task-main-page-modal .task-engage-text');
					if(source_account.select2('val') ==''){
						validated = false;
						messages.push("Select source account.");
					}else{
						source_account_val = source_account.select2('val');
					}
				if (subject.length && subject.val() == "" ) {
					validated = false;
					messages.push("Enter subject.");
				}else{
					subject_val = subject.val();
				}
				if (comment_box.val() == '') {
					messages.push('Enter message');
					validated = false;
				}
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#approve-task-main-page-modal .modal-header');
					return false;
				}else{
					clicked_btn.attr('disabled',true);
					$.ajax({
						type: "POST",
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-engage/' + taskId,
						data: {
							document_id: document_id,
							account_id: source_account_val,
							content: comment_box.val(),
							button_name: button_name,
							public_flag: public_flag,
							notes : draft_approval_note
						},
						beforeSend: function(){
							Custom.showLoader('.task-details-div');
						},
						complete: function(){
							Custom.hideLoader('.task-details-div');
						},
						error: function(){
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					})
					.done(function( result ) {
						if(typeof result == 'object' && result.status.code == 200) {
							$("#approve-task-main-page-modal").modal('hide');
							// For closing the task
							$.ajax({
								type: 'POST',
								url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + taskId + '/C',
								data: {
									current_action: "A",
									comment: comment_box.val()
								},
								beforeSend: function(){
									Custom.hideLoader();
									Custom.showLoader(".approveBtnDiv-"+taskId);
								},
								complete: function(){
									Custom.hideLoader();
								},
								timeout: 60000,
								error: function(){
									setTimeout(function(){
										var messages = [];
										messages.push("Please try again later.");
										
										Custom.showMessages('error', 'Something went wrong!', messages);
									}, 1000);
								}
							})
							.done(function( result ) {
								if(result.status.code == 200){
									$(".approve-message-div-"+taskId).remove();
									if($(".approveBtnDiv-"+taskId).length >0){
										$(".taskAction-"+taskId).html("Closed");
										$(".taskActionTaken-"+taskId).html("Responded Online");
										$(".approveBtnDiv-"+taskId).html("<p style='color:green;font-weight:bold;'>This task has been approved and closed.</p>");
										setTimeout(function(){
											$(".approveBtnDiv-"+taskId).remove();
										}, 3000);
										$(".taskAction-"+taskId).closest('tr').find('td.details-control').attr('task-approve',1);
									}
								}else{
									var messages = [];
									messages.push("Please try again later.");
									Custom.showMessages('error', 'Something went wrong!', messages);
								}
							});
							
						}
					});
				}
			});
			// End of task task approve from main page
			
			
			// Decline task
			$('.taskDeclinedByMainPage').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var current_action = $('.task-declined-current-action');
				var comment_box = $('.task-decline-text');
				var taskId = $(".declineTaskId").val();
				if(taskId){
					$(this).attr('disabled',true);
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-decline-action/' + taskId + '/B',
						data: {
							current_action: current_action.val(),
							comment: comment_box.val()
						},
						beforeSend: function(){
							Custom.showLoader('.declcineModalMain .modal-content');
						},
						complete: function(){
							Custom.hideLoader('.declcineModalMain .modal-content');
						},
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							if($(".approveBtnDiv-"+taskId).length >0){
								$(".approve-message-div-"+taskId).remove();
								$("#task-declined-modal-main-page").modal('hide');
								$(".taskAction-"+taskId).html("In-Progress<br/>(Draft saved)");
								$(".approveBtnDiv-"+taskId).html("<p style='color:green;font-weight:bold;'>Task Declined and Send back.</p>");
								setTimeout(function(){
									$(".approveBtnDiv-"+taskId).css("display","none");
									}, 2000);
								$(".taskAction-"+taskId).closest('tr').find('td.details-control').attr('task-declined',1);

							}
							$('body .task-decline-text').val("");
							comment_box.val('');
							$(this).attr('disabled',false);
						}
					});
				}
				
			});
			// End of closing task
			
			// Listing grid
			// Draft change
			
			
		},
		taskFilterFormSubmit: function(task_type){
			Custom.hideMessages();
			var table = $("#collaboration-list").DataTable();
			table.clear();
			var coll_task_filter_recipient = $('#coll_task_filter_recipient').select2('val');
			var coll_task_filter_source = $('#coll_task_filter_source').select2('val');
			var coll_task_filter_action = $('#coll_task_filter_action').select2('val');
			var coll_task_filter_action_taken = $('#coll_task_filter_action_taken').select2('val');
			var coll_task_filter_location = $('#coll_task_filter_location').select2('val');
			var coll_task_filter_physician ='';
			if($('#coll_task_filter_physician').length > 0)
				coll_task_filter_physician = $('#coll_task_filter_physician').select2('val');
			var coll_task_filter_start_date = $('#coll_task_filter_start_date').val();
			var coll_task_filter_end_date = $('#coll_task_filter_end_date').val();
			var coll_task_filter_type = $('#coll_task_filter_type').select2('val');
			
			var operational_category_id = $('#operational_category_id').select2('val');
			var coll_task_filter_create_task_type = $('#coll_task_filter_create_task_type').select2('val');
			var task_source_types = $('#task_source_types').select2('val');
			var coll_task_filter_my_task_flag = false;
			if ($('.my-task.active').length) {
				var coll_task_filter_my_task_flag = true;
			}
			if (task_type == null) {
				task_type = $('#task_type').val();
			}
	        var listColumns = [
	            {
	            	"className":      'details-control sorting_disabled',
            		"targets": 'no-sort',
	            	"orderable":      false,
	            	"data":           null,
	            	"defaultContent": ''
	            },
	            {
					"mData": "taskId",
					"name": "ID",
					"orderable": true,
					"mRender": function(data, type, full){
						 return full.id_html;
					}
				},
				{
					"mData": "score",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.score_html;
					},
					"className" : "text-center"
				},
				{
					"mData": "loc_pro_name",
					"orderable": false,
					"width": "20%" 
				}
//				{
//					"mData": "content",
//					"orderable": false,
//					"mRender": function(data, type, full){
//						return full.content_html;
//					},
//					"width": "50%" 
//				}
            ];
	        
	        if(!coll_task_filter_my_task_flag){
				listColumns.push({
					"mData": "assignee",
					"name": "ASSIGNEE",
					"orderable": true,
					"className" : "text-center"
				});
            }else{
            	 listColumns.push({
                    "mData": "assignee",
					"name": "ASSIGNEE",
					"orderable": true,
					"visible": false,
					"className" : "text-center"
				});
            }
	        if(task_type == 'escalation'){
	        	 listColumns.push({
	                    "mData": "escalationUsers",
	                    "name": "ESCALATION_FOR",
						"orderable": false,
						"className" : "text-center"
					});
	        }else{
	        	listColumns.push({
	        		"mData": "escalationUsers",
                    "name": "ESCALATION_FOR",
					"orderable": false,
					"visible": false,
					"className" : "text-center"
				});
	        }
	        listColumns.push({
				"mData": "open_since",
				"orderable": false,
				"className" : "text-center"
			});
	        listColumns.push({
                "mData": "action",
				"name": "ACTION",
                "orderable": true,
                "className" : "text-center actionTd"
            });
	        listColumns.push({
                "mData": "task_type",
				"name": "TASK_TYPE",
                "orderable": false,
                "className" : "text-center"
            });
	        listColumns.push({
                "mData": "action_taken",
				"name": "LAST_ACTION_TAKEN",
                "orderable": true,
                "className" : "text-center"
            });
	        
	        
			var dataTableObj = $("#collaboration-list").DataTable({
				serverSide: true,
				bLengthChange: false,
				searching: false,
				iDisplayLength: 100,
				"bDestroy": true,
				"bProcessing":false,
				"language": {
					"emptyTable":     "There is no task available for the given filter settings."
				},
				order: [
					[0, 'desc']
				],
				ajax: {
					url: SocialView.base_url + 'collaboration/' + SocialView.client + '/taskjson',
					type: 'POST',
					data: {
						coll_task_filter_recipient : coll_task_filter_recipient,
						coll_task_filter_source: coll_task_filter_source,
						coll_task_filter_action : coll_task_filter_action,
						coll_task_filter_action_taken : coll_task_filter_action_taken,
						coll_task_filter_location : coll_task_filter_location,
						coll_task_filter_physician : coll_task_filter_physician,
						coll_task_filter_start_date : coll_task_filter_start_date,
						coll_task_filter_end_date : coll_task_filter_end_date,
						coll_task_filter_type : coll_task_filter_type,
						coll_task_filter_my_task_flag : coll_task_filter_my_task_flag,
						coll_task_filter_task_type: task_type,
						operational_category_id:operational_category_id,
						coll_task_filter_create_task_type:coll_task_filter_create_task_type,
						task_source_types:task_source_types
						
					},
					dataType: 'json',
					beforeSend: function(){
						var table = $("#collaboration-list").DataTable();
						table.clear();
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
					error: function() {
						Custom.hideLoader();
						Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
					}
				},
				aoColumns: listColumns
			});
			 $('#collaboration-list tbody').on('click', 'td.details-control', function () {
				 var tr = $(this).closest('tr');
			        var row = dataTableObj.row(tr);
			        var approveStatus = 0;
			        var taskApproved = $(this).attr('task-approve');
			        var taskDeclined = $(this).attr('task-declined');
			        if(taskApproved || taskDeclined){
			        	approveStatus = 1;
			        }
			        
			        if ( row.child.isShown() ) {
			            // This row is already open - close it
			        	 row.child.hide();
			             tr.removeClass('shown');
			        }
			        else {
			            // Open this row
			            row.child( Collaboration.loadForamat(row.data(),approveStatus),'').show();
			            tr.addClass('shown');
			            $('div.slider', row.child()).slideDown();
			        }
		        } );
			
			return false;
		},
		loadForamat: function(data,approveStatus){
			var contentHtml ="";
			var contentApproveHtml = "";
			if(data){
				if(approveStatus == 0){
					contentApproveHtml = data.approve_html;
					contentHtml = data.content_html_fade_out;
				}else{
					contentHtml = data.content_html_fade_out_without_approve_msg;
				}
			}
			// `d` is the original data object for the row
		    return '<div>'+contentHtml+'<br/>'+contentApproveHtml+'</div>';

		},
		loadTaskDetails: function(){
			// Tabs
			$('[data-toggle="tabajax"]').click(function(e) {
				var $this = $(this),
					url = $this.attr('href'),
					target = $this.attr('data-target');
				//if ($(target).html() == '') {
					$.ajax({
						type: 'GET',
						url: url,
						beforeSend: function(){
							setTimeout(function(){
								Custom.showLoader('.activity-region');
							}, 500);
						},
						complete: function(){
							Custom.hideLoader('.activity-region');
						},
						timeout: 60000,
						error: function(){
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							$(target).html(result.data);
						}else{
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				//}
				$this.tab('show');
				return false;
			});
			// Tabs
			$('[data-toggle="relatedTaskTabajax"]').click(function(e) {
				var $this = $(this),
					url = $this.attr('href'),
					target = $this.attr('data-target');
				//if ($(target).html() == '') {
					$.ajax({
						type: 'GET',
						url: url,
						beforeSend: function(){
							setTimeout(function(){
								Custom.showLoader('.related-task');
							}, 500);
						},
						complete: function(){
							Custom.hideLoader('.related-task');
						},
						timeout: 60000,
						error: function(){
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							$(target).html(result.data);
						}else{
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				//}
				$this.tab('show');
				return false;
			});
			Collaboration.showActivities();
			// End of Tabs in task view page
			
			// Assign task
			$('.task-assign-submit').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var validated = true;
				var assignee_select = $('.task-assign-new-assignee');
				var assignee_current = $('.task-assign-current-assignee');
				var comment_box = $('.task-assign-comment-text');
				if (assignee_select.select2('val') == '') {
					messages.push('Please select an assignee');
					validated = false;
				}
				if (assignee_select.select2('val') == assignee_current.val()) {
					messages.push('Task is already assigned to this assignee');
					validated = false;
				}
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-assign-modal .modal-header');
					return false;
				}else{
					$('#task-view-assign-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-assign/' + SocialView.task_id,
						data: {
							assignee: assignee_select.select2('val'),
							comment: comment_box.val()
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var assignee_data = assignee_select.select2('data');
							var messages = [];
							messages.push("Task assigned to " + assignee_data.text);
							Custom.showMessages('success', 'Success!', messages);
							
							$('.task-assignee-display-text').html(assignee_data.text);
							assignee_current.val(assignee_select.select2('val'));
							
							if (comment_box.val() != '') {
								Collaboration.showActivities();
								comment_box.val('');
							}
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of assign task
			
			// Share task
			$('.task-share-submit').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var validated = true;
				var share_email_select = $('select.task-share-email');
				var comment_box = $('.task-share-comment-text');
				if (share_email_select.select2('val').length == 0) {
					messages.push('Please select users');
					validated = false;
				}
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-share-modal .modal-header');
					return false;
				}else{
					$('#task-view-share-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-share/' + SocialView.task_id,
						data: {
							emails: share_email_select.select2('val'),
							comment: comment_box.val()
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							messages.push("Task shared successfully.");
							Custom.showMessages('success', 'Success!', messages);
							
							share_email_select.select2('val', []);
							Collaboration.showActivities();
							if (comment_box.val() != '') {
								
								comment_box.val('');
							}
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of share task
			
			// No action required
			$('.task-no-action-submit').on('click', function(){
				Custom.hideMessages();
				
				var me = $(this);
				var messages = [];
				var validated = true;
				var current_action = $('.task-no-action-current-action');
				var comment_box = $('.task-no-action-text');
				/*if (comment_box.val() == '') {
					messages.push('Enter message');
					validated = false;
				}*/
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-no-action-modal .modal-header');
					return false;
				}else{
					$('#task-view-no-action-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + SocialView.task_id + '/R',
						data: {
							current_action: current_action.val(),
							comment: comment_box.val()
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							messages.push("Task updated");
							Custom.showMessages('success', 'Success!', messages);
							
							comment_box.val('');
							
							if (me.attr('close-task') == "1") {
								$('.task-view-buttons').remove();
								$('.task-close-submit').trigger('click');
							}else{
								$('#task_no_action,#task_engage,#task_no_engage,#task_other').addClass('hidden');
								$('#task_close').removeClass('hidden');
								Custom.hideLoader();
								Collaboration.showActivities();
							}
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of no action task
			
			// Add comment
			$('.task-comment-submit').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var validated = true;
				var comment_box = $('.task-comment-text');
				if (comment_box.val() == '') {
					messages.push('Enter message');
					validated = false;
				}
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-comment-modal .modal-header');
					return false;
				}else{
					$('#task-view-comment-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-add-comment/' + SocialView.task_id,
						data: {
							comment: comment_box.val()
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							messages.push("Comment added");
							Custom.showMessages('success', 'Success!', messages);
							comment_box.val('');
							
							Collaboration.showActivities();
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of add comment
			
			// Save as draft/Engage
			
			
			// Draft change
			$('.task-engage-response-draft').on('change', function(){
				
				var pre_subject = $("option:selected", this).attr("subject");
				var pre_message = $("option:selected", this).attr("message");
				
				var subject = $(".task-engage-subject");
				var message = $(".task-engage-text");
				
				if ( (subject.length && subject.val() != "") || message.val() != "") {
					if (confirm("Do you wish to replace the content with the draft response ?")) {
						if(subject.length){
							subject.val(pre_subject);
						}
						message.val(pre_message);
					}
				}else{
					if(subject.length){
						subject.val(pre_subject);
					}
					message.val(pre_message);
				}
			});
			// End of draft change
			
			
			$('.task-engage-draft-submit,.task-engage-submit,.task-engage-submit-for-approval,.task-engage-submit-approved').on('click', function(){
				
				Custom.hideMessages();
				var clicked_btn = $(this);
				var messages = [];
				var validated = true;
				var source_account = $('.task-engage-source-account');
				var subject = $('.task-engage-subject');
				var subject_val = '';
				var document_id = $('.task-engage-document-id').val();
				var draft_approval_note =$(".task-engage-draft-note").val();
				var source_account_count = $(".source_account_setup").val();
				
				// Button Name
				if (clicked_btn.hasClass('task-engage-draft-submit')) {
					button_name = 'Save Draft';
				}else if(clicked_btn.hasClass('task-engage-submit')){
					button_name = clicked_btn.val();
				}
				if (clicked_btn.hasClass('task-engage-submit-for-approval')) {
					button_name = 'Request for Approval';
					if(source_account_count > 0){
						draft_approval_note = $(".task-engage-draft-note").val();
					}else{
						//$("#task-view-source-setup-flag-false-modal").modal('show');
						//return false;
					}
					
				}
				if (clicked_btn.hasClass('task-engage-submit-approved')) {
					button_name = 'Approve';
					draft_approval_note = $(".task-engage-draft-note").val();
					if(source_account_count > 0){
						draft_approval_note = $(".task-engage-draft-note").val();
					}else{
						//$("#task-view-source-setup-flag-false-modal").modal('show');
						//return false;
					}
					
				}
				// Public flag
				var public_flag = '';
				if($('.task-engage-public:checked').length){
					public_flag = 'true';
				}else{
					public_flag = 'false';
				}
				
				var comment_box = $('.task-engage-text');
				if (clicked_btn.hasClass('task-engage-submit') && source_account.select2('val') == "" ) {
					validated = false;
					messages.push("Select source account.");
				}else{
					if(clicked_btn.hasClass('task-engage-draft-submit') && source_account.select2('val') == ""){
						source_account_val = 0;
					}else if(clicked_btn.hasClass('task-engage-submit-for-approval') && source_account.select2('val') == ""){
						source_account_val = 0;
					}else if(clicked_btn.hasClass('task-engage-submit-approved') && source_account.select2('val') == ""){
						validated = false;
						messages.push("Select source account.");
					}else{
						source_account_val = source_account.select2('val');
					}
				}
				if (subject.length && subject.val() == "" ) {
					validated = false;
					messages.push("Enter subject.");
				}else{
					subject_val = subject.val();
				}
				if (comment_box.val() == '') {
					messages.push('Enter message');
					validated = false;
				}
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-engage-modal .modal-header');
					return false;
				}else{
					$('#task-view-engage-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-engage/' + SocialView.task_id,
						data: {
							document_id: document_id,
							account_id: source_account_val,
							subject: subject_val,
							content: comment_box.val(),
							button_name: button_name,
							public_flag: public_flag,
							notes : draft_approval_note
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == '200'){
							var messages = [];
							
							if (clicked_btn.hasClass('task-engage-draft-submit')) {
								$('#task_no_action').addClass('hidden');
								$('#task_other').addClass('hidden');
								$('.task-engage-delete-draft-submit').removeClass('hidden');
								messages.push("Draft saved successfully.");
							}else if(clicked_btn.hasClass('task-engage-submit')){
								
								if (result.engaged_status != "DRAFT") {
									if (clicked_btn.attr('close-task') == "1") {
										$('.task-view-buttons').remove();
										$('.task-close-submit').trigger('click');
									}else{
										$('#task_no_action,#task_engage,#task_no_engage,#task_other').addClass('hidden');
										$('#task_close').removeClass('hidden');
									}
								}else{
									$('.task-engage-delete-draft-submit').removeClass('hidden');
								}
								
								if (typeof result.display_message != 'undefined') {
									messages.push(result.display_message);
								}else{
									messages.push("Task engaged successfully.");
								}
							}else if(clicked_btn.hasClass('task-engage-submit-for-approval')){
								
								$('#task_no_action').addClass('hidden');
								$('#task_other').addClass('hidden');
								$('#task_engage').addClass('hidden');
								$('.task_engage_approval_status').removeClass('hidden');
								//messages.push("Draft saved successfully.");
								messages.push("Approval request sent successfully.");
							}else if(clicked_btn.hasClass('task-engage-submit-approved')){
								if (clicked_btn.attr('close-task') == "1") {
									$('.task-view-buttons').remove();
									$('.task-close-submit').trigger('click');
								}
								$('.approve-by-user').removeClass('show');
								$('.approve-by-user').addClass('hidden');
								
								$('.close-by-user').removeClass('show');
								$('.close-by-user').addClass('hidden');
								
								$('.decline-by-user').removeClass('show');
								$('.decline-by-user').addClass('hidden');
								$('#task_close').removeClass('hidden');
								
								messages.push("Task approved successfully.");
							}
							Custom.showMessages('success', 'Success!', messages);
							setTimeout(function() {
								Collaboration.showActivities();
							}, 5000);
						}else {
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			
			// Delete draft
			$('.task-engage-delete-draft-submit').on('click', function(){
				Custom.hideMessages();
				
				var me = $(this);
				var messages = [];
				var validated = true;
				var current_action = $('.task-engage-current-action');
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-no-action-modal .modal-header');
					return false;
				}else{
					$('#task-view-engage-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + SocialView.task_id + '/B',
						data: {
							current_action: current_action.val()
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							messages.push("Task updated");
							Custom.showMessages('success', 'Success!', messages);
							
							me.addClass('hidden');
							$('#task_no_action').removeClass('hidden');
							$('#task_other').removeClass('hidden');
							$('.task-engage-source-account').select2('val', '');
							$('.task-engage-text').val('');
							$('.task-engage-draft-note').val('');
							$('.task-engage-subject').val('');
							$(".task-engage-response-draft").select2('val', '');
							Collaboration.showActivities();
//							$(".task-engage-response-draft option[value='']").attr('selected', true);
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End delete draft
			
			// End of engage/draft task
			
			// Offline Action task
			$('.task-other-submit').on('click', function(){
				Custom.hideMessages();
				
				var me = $(this);
				var messages = [];
				var validated = true;
				var current_action = $('.task-other-current-action');
				var comment_box = $('.task-other-text');
				var requestApproval = me.attr('close-offline-status');
				if(requestApproval == 1){
					requestApproval = true;
				}else{
					requestApproval = false;
				}
				if (comment_box.val() == '') {
					messages.push('Enter message');
					validated = false;
				}
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-other-modal .modal-header');
					return false;
				}else{
					$('#task-view-other-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + SocialView.task_id + '/O',
						data: {
							current_action: current_action.val(),
							comment: comment_box.val(),
							requestApproval:requestApproval
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							messages.push("Task updated.");
							Custom.showMessages('success', 'Success!', messages);
							
							comment_box.val('');
							
							
							if (me.attr('close-task') == "1") {
								$('.task-view-buttons').remove();
								$('.task-close-submit').trigger('click');
							}else{
								$('#task_no_action,#task_engage,#task_no_engage,#task_other').addClass('hidden');
								$('#task_close').removeClass('hidden');
								Custom.hideLoader();
								Collaboration.showActivities();
							}
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of offline action task
			
			// Reopen task
			$('.task-reopen-submit').on('click', function(){
				Custom.hideMessages();
				
				var me = $(this);
				var messages = [];
				var validated = true;
				var current_action = $('.task-reopen-current-action');
				var comment_box = $('.task-reopen-text');
				if (comment_box.val() == '') {
					messages.push('Enter message');
					validated = false;
				}
				
				if (validated == false) {
					Custom.showMessages('warning', 'Please check the following fields!', messages, '#task-view-reopen-modal .modal-header');
					return false;
				}else{
					$('#task-view-reopen-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + SocialView.task_id + '/BR',
						data: {
							current_action: current_action.val(),
							comment: comment_box.val()
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var messages = [];
							messages.push("Task reopened successfully.");
							Custom.showMessages('success', 'Success!', messages);
							
							comment_box.val('');
//							$('.open-since-container').html('few seconds');
							
							$('#task_reopen').addClass('hidden');
							//$('#task_no_action,#task_engage,#task_no_engage,#task_other,.utility-operations').removeClass('hidden');
							location.reload(true);
							Collaboration.showActivities();
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of reopen task
			
			// Close task
			$('.task-close-submit').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var current_action = $('.task-close-current-action');
				var comment_box = $('.task-close-text');
				
				$('#task-view-close-modal').modal('hide');
				$.ajax({
					type: 'POST',
					url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + SocialView.task_id + '/C',
					data: {
						current_action: current_action.val(),
						comment: comment_box.val()
					},
					beforeSend: function(){
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
					timeout: 60000,
					error: function(){
						setTimeout(function(){
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}, 1000);
					}
				})
				.done(function( result ) {
					if(result.status.code == 200){
						var messages = [];
						messages.push("Task closed.");
						Custom.showMessages('success', 'Success!', messages);
						
						$('.task-view-close-button').remove();
						
						//Collaboration.showActivities();
						// Redirecting
						window.location.href = SocialView.base_url + 'collaboration/' + SocialView.client + '/filter/' + SocialView.encoded;
						
						comment_box.val('');
					}else{
						var messages = [];
						messages.push("Please try again later.");
						Custom.showMessages('error', 'Something went wrong!', messages);
					}
				});
			});
			// End of closing task
			
			// Close sub task
			$('.sub-task-close-submit').on('click', function(){
				Custom.hideMessages();
				var messages = [];
				var validated = true;
				var current_action = $('.task-close-current-action');
				var operationalCategoryId = $(".operational_category_type").select2('val');
				var parent_task_id = $(".sub-task-close-parent-id").val();
				var document_id = $(".sub-task-close-parent-document-id").val();
				var taskType = $(".sub-task-close-type").val();
				if(!operationalCategoryId){
					messages.push('Please select Operational Category');
					validated = false;
				}
				var comment_box = $('.sub-task-close-text');
				if (!comment_box.val()) {
					messages.push('Please enter comment');
					validated = false;

				}
				if (validated == false) {
				Custom.showMessages('warning', 'Please check the following fields!', messages, '#close-sub-task-modal .modal-header');
					return false;
				}else{
				$('#close-sub-task-modal').modal('hide');
				$.ajax({
					type: 'POST',
					url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-update-action/' + SocialView.task_id + '/C',
					data: {
						current_action: current_action.val(),
						taskType : taskType,
						operationalCategoryId:operationalCategoryId,
						comment: comment_box.val()
					},
					beforeSend: function(){
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
					timeout: 60000,
					error: function(){
						setTimeout(function(){
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}, 1000);
					}
				})
				.done(function( result ) {
					if(result.status.code == 200){
						var messages = [];
						messages.push("Task closed.");
						Custom.showMessages('success', 'Success!', messages);
						
						$('.task-view-close-button').remove();
						
						//Collaboration.showActivities();
						// Redirecting
						window.location.href = SocialView.base_url + 'collaboration/' + SocialView.client + '/filter/' + SocialView.encoded;
						
						comment_box.val('');
					}else{
						var messages = [];
						messages.push("Please try again later.");
						Custom.showMessages('error', 'Something went wrong!', messages);
					}
				});
				}
			});
			// End of closing sub task
			// Decline task
			$('.task-decline-submit').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var current_action = $('.task-declined-current-action');
				var comment_box = $('.task-decline-text');
				
				$('#task-declined-modal').modal('hide');
				$.ajax({
					type: 'POST',
					url: SocialView.base_url + 'collaboration/' + SocialView.client + '/task-decline-action/' + SocialView.task_id + '/B',
					data: {
						current_action: current_action.val(),
						comment: comment_box.val()
					},
					beforeSend: function(){
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
					timeout: 60000,
					error: function(){
						setTimeout(function(){
							var messages = [];
							messages.push("Please try again later.");
							
							Custom.showMessages('error', 'Something went wrong!', messages);
						}, 1000);
					}
				})
				.done(function( result ) {
					if(result.status.code == 200){
						var messages = [];
						messages.push("Task Declined and Send back.");
						Custom.showMessages('success', 'Success!', messages);
						
						$('.task-view-close-button').remove();
						
						//Collaboration.showActivities();
						// Redirecting
						window.location.href = SocialView.base_url + 'collaboration/' + SocialView.client + '/filter/' + SocialView.encoded;
						
						comment_box.val('');
					}else{
						var messages = [];
						messages.push("Please try again later.");
						Custom.showMessages('error', 'Something went wrong!', messages);
					}
				});
			});
			// End of closing task
			
			
			
			// Create Sub task
			$('.create-sub-task').on('click', function(){
				Custom.hideMessages();
				
				var messages = [];
				var validated = true;
				var assignee_select = $('.sub-task-assign-new-assignee');
				var assignee_current = $('.task-assign-current-assignee');
				var comment_box = $('.sub-task-create-comment-text');
				var parent_task_id = $(".sub-task-parent-id").val();
				var document_id = $(".sub-task-parent-document-id").val();
				if (!assignee_select.select2('val')) {
					messages.push('Please select an assignee');
					validated = false;

				}
				if (!comment_box.val()) {
					messages.push('Please enter comment');
					validated = false;

				}
//				if (assignee_select.select2('val') == assignee_current.val()) {
//					messages.push('Task is already assigned to this assignee');
//					validated = false;
//				}
//				
				if (validated == false) {
				Custom.showMessages('warning', 'Please check the following fields!', messages, '#create-sub-task-modal .modal-header');
					return false;
				}else{
					$('#create-sub-task-modal').modal('hide');
					$.ajax({
						type: 'POST',
						url: SocialView.base_url + 'collaboration/' + SocialView.client + '/create-sub-task-action/' + SocialView.task_id,
						data: {
							assignee: assignee_select.select2('val'),
							comment: comment_box.val(),
							parent_task_id: parent_task_id,
							document_id: document_id
						},
						beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
						timeout: 60000,
						error: function(){
							setTimeout(function(){
								var messages = [];
								messages.push("Please try again later.");
								
								Custom.showMessages('error', 'Something went wrong!', messages);
							}, 1000);
						}
					})
					.done(function( result ) {
						if(result.status.code == 200){
							var assignee_data = assignee_select.select2('data');
							var messages = [];
							messages.push("Sub Task has been created and assigned to " + assignee_data.text);
							Custom.showMessages('success', 'Success!', messages);
							
//							$('.task-assignee-display-text').html(assignee_data.text);
							assignee_current.val("");
							$('.sub-task-create-comment-text').val("");
							Collaboration.showRelatedTask();
							Custom.showLoader();
							Collaboration.showActivities();
							Custom.hideLoader();
							
						}else{
							var messages = [];
							messages.push("Please try again later.");
							Custom.showMessages('error', 'Something went wrong!', messages);
						}
					});
				}
			});
			// End of create new sub task
			
			// close event 
			$('.cancel_sub_task').on('click', function(){ 
				$(this).attr("data-dismiss",'modal');
		      });
		},
		showActivities: function() {
			$('.assignment-tab').click();
		},
		showRelatedTask: function() {
			$('.related-tab').click();
		},
		loadRules: function(){
			// Submting rule list filter form on load
			
			var alertType =  $("select.alert-type").val();
			var asigneeObj;
			if($("select.assignee").length) {
				asigneeObj = $("select.assignee");
			} else {
				asigneeObj = $("input.assignee");
			}
			var assignee = asigneeObj.val();
			
			var listColumns = [{
                "mData": "assignee",
                "orderable": false
            }];
			if(SocialView.ctlPermission){
				listColumns.push({
					"mData": "watchers",
					"orderable": false
				});
			}
			listColumns.push({
                "mData": "description",
                "orderable": false,
                "mRender" : function(data, type, full) {
                	var html = "";
                	html += "<span class=\"description\">"+data+"</span><span class=\"type btn btn-sm default\"><i class=\"fa fa-tag\"></i>"+full.alertType+"</span>";
                	return html;
                }
            },{
                "mData": "task",
                "orderable": false,
                "className" : "text-center"
            },{
                "mData": "id",
                "orderable": false,
                "mRender" : function(data, type, full){
                	var html = "";
                	html += '<a href="' + SocialView.base_url + 'rule/' + SocialView.client + '/view/' + data + '" class="btn btn-xs default"><i class="fa fa-eye"></i> View</a>' +
                			'<a href="' + SocialView.base_url + 'rule/' + SocialView.client + '/edit/' + data + '" class="btn btn-xs default"><i class="fa fa-edit"></i> Edit</a>' +
							'<a href="#" alert-id="' + data + '" class="btn btn-xs default delete-alert"><i class="fa fa-times"></i> Delete</a>';
                	
                	return html;
                },
				"width": "200px",
                "className" : "text-center"
            });
            var dataTableObj = $("#rule-list").dataTable({
                serverSide: true,
                bLengthChange: false,
                bProcessing: true,
                searching: false,
                iDisplayLength: 100,
                ajax: {
                    url: SocialView.base_url + "rule/" + SocialView.client + "/ajax-list",
                    type: 'POST',
                    data: function(d) {
                    	d.assignee = assignee;
                        d.alertType = alertType;
                    },
                    dataType: 'json',
                    error: function() {
                        Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
                    }
                },
                aoColumns : listColumns
            });
			
			$("#rule-filter-form").on("submit", function(e) {
				e.preventDefault();
				alertType =  $("select.alert-type").val();
				assignee = asigneeObj.val();
                dataTableObj.api().ajax.reload();
            });
			
			$("body").on("click", ".delete-alert", function(e){
				e.preventDefault();
				var me = $(this);
				bootbox.confirm("Are you sure?", function(result) {
					if(result){
						  var url = SocialView.base_url + "rule/" + SocialView.client + "/delete-rule/"+me.attr("alert-id");
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  rule_id : me.attr("alert-id")
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							  if(typeof json == 'object' && json.status.code == 200) {
								  Custom.showMessages("success", "Selected rule deleted successfully!", [""]);
								 me.parents("tr").remove();
								  
							  } else{
								  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
							  }
						  });
					}
					}); 
			});
		},
		addRule : function () {
			$("select.select2").select2();
			$("#alert-type").on("change", function(e){
				var me = $(this);
				
				var type = me.val();
				
				var redirectURL = SocialView.base_url + 'rule/' + SocialView.client + '/add/' + type;
				Custom.showLoader();
				email = getParameterByName("uid");
				
				if (email !== '') {
					redirectURL += "?uid=" + email;
				}
				window.location = redirectURL;
			});
			var questions = {};
			var options = {};
			var $surveyObj = $("select#survey");
			var $questionObj = $("select#question");
			var $optionObj = $("select#option");
			
			$questionObj.on("change", function(e){
				var me = $(this);
				var currentValue = me.val();
				if(currentValue != "") {
					Custom.showLoader();
					Collaboration.updateQuestionOption(currentValue, options);
					Custom.hideLoader();
				} else {
					$optionObj.empty().select2();
					$optionObj.parents(".after-question").addClass("hidden");
				}
			});
			
			$surveyObj.on("change", function(e){
				var me = $(this);
				var currentValue = me.val();
				questions = {};
				options = {};
				if(currentValue != "") {
					Collaboration.updateSurveyQuestion(currentValue, questions, options);
				} else {
					$questionObj.empty().select2();
					$questionObj.parents(".after-survey").addClass("hidden");
					$optionObj.empty().select2();
					$optionObj.parents(".after-question").addClass("hidden");
				}
			});
			
			if($surveyObj.length && $surveyObj.val() == '') {
				$questionObj.parents(".after-survey").addClass("hidden");
			}
			if($surveyObj.length && $surveyObj.val() != '') {
				$surveyObj.trigger( "change" );
			}
			if($questionObj.length && $questionObj.val() == '') {
				$optionObj.parents(".after-question").addClass("hidden");
			}
			$('.enable-tesk').on('click', function() {
				if ($('.enable-matrix:checked').length) {
					$('.enable-matrix').trigger('click');
				}
				$('.enable-matrix-wrapper,.watchers-wrapper').toggleClass('hidden');
				if ($('.enable-tesk:checked').length == 0 && $('.Watchers').length) {
					$('.Watchers').select2('val', '');
				}
			});
			$('.enable-matrix').on('click', function() {
				$('.matrix-list').toggleClass('hidden');
			});
			
			// On load events
			if ($('.block-excludeSources').length) {
				var includedSources = $('.includeSources').select2('val');
				if (includedSources.indexOf("100000") == -1 && includedSources.indexOf("100001") == -1 && includedSources.indexOf("100011") == -1) {
					//$('.block-excludeSources').addClass('hidden');
				}
				
				// Change event
				$('.includeSources').on('change', function(){
					var includedSources = $('.includeSources').select2('val');
					if (includedSources.indexOf("100000") == -1 && includedSources.indexOf("100001") == -1 && includedSources.indexOf("100011") == -1) {
						$('.block-excludeSources').addClass('hidden');
						$('.excludeSources').select2('val', '');
					}else{
						$('.block-excludeSources').removeClass('hidden');
					}
				});
			}
			
			$("#add-rule-form").on("submit", function(e){
				var validated = Collaboration.validateRuleDefinition();
				if (validated) {
					Custom.hideMessages();
					Custom.showLoader();
					return true;
				}
				return false;
			});
		},
		updateSurveyQuestion : function(surveyId, questions, options) {
			
			  var url = SocialView.base_url + "rule/" + SocialView.client + "/ajax-survey-questions";
			  $.ajax({
				  url : url,
				  type : "POST",
				  data : {
					  survey_id : surveyId
				  },
				  beforeSend: function(){
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
			  }).done(function(json){
				  if(typeof json == 'object') {
					 
					 var questionSelectBox = $("select#question");
					 questionSelectBox.empty();
					 questionSelectBox.append($("<option></option>")
						     .attr("value", "").text("Select a question"));
					 $.each(json, function(index, value){
						 questions[value.id]= value.title;
						 options[value.id]= value.options;
						 questionSelectBox.append($("<option></option>")
							     .attr("value", value.id).text(value.title));
					 });
					 questionSelectBox.select2();
					 questionSelectBox.parents(".after-survey").removeClass("hidden");
					 var question_default_value = $("#question_default").val();
					 if(jQuery.type(question_default_value) != "undefined"){
						 questionSelectBox.select2().select2("val", question_default_value);
						 questionSelectBox.trigger( "change" );
					 }
				  } else{
					  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				  }
			  });
		},
		updateQuestionOption: function(questionId, options){
			
			var optionSelectBox = $("select#option");
			optionSelectBox.empty();
			optionSelectBox.append($("<option></option>")
				     .attr("value", "").text("Select an option"));
			 $.each(options[questionId], function(index, value){
				 optionSelectBox.append($("<option></option>")
					     .attr("value", value.id).text(value.name));
			 });
			 optionSelectBox.select2();
			 optionSelectBox.parents(".after-question").removeClass("hidden");
			 var option_default_value = $("#option_default").val();
			 if(jQuery.type(option_default_value) != "undefined"){
				 optionSelectBox.select2().select2("val", option_default_value);
			 }
		},
		validateRuleDefinition: function() {
			var validated = true;
			var errors = [];
			
			// Source
			if ($('.excludeSources').length) {
				if ($($('.includeSources').select2('val')).filter($('.excludeSources').select2('val')).length) {
					validated = false;
					errors.push('You can\'t exclude sources that are already selected for include.');
				}
			}
			
			// Threshold
			if ($('.minThreshold').length) {
				if ($('.ResponseScore').length && parseFloat($('.minThreshold').val()) > parseFloat($('.ResponseScore').val())) {
					validated = false;
					errors.push('Enter Threshold range from lower value to higher.');
				}
				if ($('.ResponseScore').length && (parseFloat($('.minThreshold').val()) < 0 || parseFloat($('.ResponseScore').val()) > 5)) {
					validated = false;
					errors.push('Enter the Threshold value between 0 and 5.');
				}
				if ($('.Threshold').length && parseFloat($('.minThreshold').val()) > parseFloat($('.Threshold').val())) {
					validated = false;
					errors.push('Enter Threshold range from lower value to higher.');
				}
				if ($('.Threshold').length && (parseFloat($('.minThreshold').val()) < 0 || parseFloat($('.Threshold').val()) > 5)) {
					validated = false;
					errors.push('Enter the Threshold value between 0 and 5.');
				}
			}
			
			// Watchers
			if ($('.Watchers').length && $('.Watchers').select2('val').indexOf($('.assignee').select2('val')) >= 0) {
				validated = false;
				errors.push('Assignee can\'t be a watcher.');
			}
			
			Custom.hideMessages();
			Custom.showMessages('error', 'Please check following fields.', errors);
			return validated;
		},
		editRule: function() {
			$('#edit-rule-form').on('submit', function(){
				if ($('.Watchers').length && $('.Watchers').select2('val').indexOf($('.assignee').val()) >= 0) {
					Custom.hideMessages();
					Custom.showMessages('error', 'Assignee can\'t be a watcher.', []);
					return false;
				}else{
					return true;
				}
				return false;
			});
		},
		loadEscalation: function() {
			// Delete matrix
			$('.delete-matrix').on('click', function(){
				var delete_btn = $(this);
				bootbox.confirm("Are you sure?", function(result) {
					if(result){
						$.ajax({
							url : SocialView.base_url + "collaboration/" + SocialView.client + "/delete_escalation_matrix/" + delete_btn.attr('matrix-id'),
							type : "GET",
							beforeSend: function(){
								Custom.showLoader();
							},
							complete: function(){
								Custom.hideLoader();
							},
						}).done(function(data){
							if(typeof data == 'object' && data.status.code == 200) {
								delete_btn.closest('tr').slideUp().remove();
								Custom.showMessages('success', 'Success!', ['Matrix deleted successfully.']);
							} else{
								Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
							}
						});
					}
				});
			});
		},
		allowOnlyNumerals: function (elem) {
			$(elem).die().keydown(function (e) {
				// Allow: backspace, delete, tab, escape, enter and .( removed)
				if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190 ]) !== -1 ||
					 // Allow: Ctrl+A, Command+A
					(e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
					 // Allow: home, end, left, right, down, up
					(e.keyCode >= 35 && e.keyCode <= 40)) {
						 // let it happen, don't do anything
						 return;
				}
				// Ensure that it is a number and stop the keypress
				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}
			});
		},
		addMatrixPlanTemplate: function() {
			$('.matrix-plan-dummy').find('input:checkbox').each(function(){
				$.uniform.restore($(this).attr("id"));
			});
			var html = $('.matrix-plan-dummy').clone().html();
			$('.panel-body.outer-matrix').append(html);
			$('input:checkbox').uniform();
			
			$('.row.matrix-plan').not('.matrix-plan-dummy .row.matrix-plan').find('select.matrix-plan-users').select2();
			Collaboration.allowOnlyNumerals('.matrix-day-intervel');
		},
		removeMatrixPlanTemplate: function(me, delete_plan) {
			bootbox.confirm("Are you sure?", function(result) {
				if(result){
					me.closest('.row.matrix-plan').remove();
					if (delete_plan) {
						var deleted_plan_ids = $('.deleted-plan-ids').val().split(',');
						if (typeof me.attr('rel') != 'undefined' && me.attr('rel') > 0 && deleted_plan_ids.indexOf(me.attr('rel')) == "-1") {
							deleted_plan_ids.push(me.attr('rel'));
							$('.deleted-plan-ids').val(deleted_plan_ids.join(',').replace(/^,|,$/g,''));
						}
					}
				}
			});
		},
		loadEscalationAdd: function() {
			// Numeric pre validation
			Collaboration.allowOnlyNumerals('.matrix-day-intervel');
			Collaboration.allowOnlyNumerals('.reminder-day-interval');
			// Select2
			$('select.select2-matrix-plan').select2({
                placeholder : "",
                allowClear : true,
                closeOnSelect : false
            });
			// Reminder check
			$('.reminder-check').on('click', function() {
				if ($('.reminder-day-interval').attr('disabled')) {
					$('.reminder-day-interval').removeAttr('disabled');
				} else {
					$('.reminder-day-interval').attr('disabled', 'disabled');
				}
			});
			// Add plan from dummy
			$('.add-matrix-plan').on('click', function() {
				Collaboration.addMatrixPlanTemplate();
			});
			// Remove plan
			$('.panel-body.outer-matrix').on('click', '.remove-matrix-plan', function(){
				var me = $(this);
				Collaboration.removeMatrixPlanTemplate(me, false);
			});
			// Add button click
			$('.add-matrix-btn').on('click', function() {
				Custom.hideMessages();
				if(Collaboration.validateMatrix()){
					Collaboration.addMatrix();
				}
			});
		},
		validateMatrix: function() {
			
			var messages = [], temp_intervals = [];
			var validated = true;
			
			if ($('.matrix-title').val() == "") {
				validated = false;
				messages.push('Please enter matrix title.');
			}
			if ($('.reminder-check:checked').length == 1 && $('.reminder-day-interval').val() == "") {
				validated = false;
				messages.push('Please enter reminder day interval.');
			}else if ($('.reminder-check:checked').length == 1 && $('.reminder-day-interval').val() == "0") {
				validated = false;
				messages.push("Reminder day interval can't be zero.");
			}
			if ($('.row.matrix-plan').not('.matrix-plan-dummy .row.matrix-plan').length == 0 && $('.reminder-check:checked').length == 0) {
				validated = false;
				messages.push('Please add either matrix plan or reminder.');
			}else{// if ($('.reminder-check:checked').length == 0)
				$('.row.matrix-plan').not('.matrix-plan-dummy .row.matrix-plan').each(function() {
					var this_plan = $(this);
					var plan_intervel = this_plan.find('.matrix-day-intervel').val();
					
					if (plan_intervel == "" && $('.reminder-check:checked').length == 0) {
						validated = false;
						messages.push('Please enter day interval.');
					}else if (plan_intervel == 0) {
						validated = false;
						messages.push("Day interval can't be zero.");
					}else if (temp_intervals.indexOf(plan_intervel) == "-1") {
						temp_intervals.push(plan_intervel);
						var plan_roles = [];
						this_plan.find('.matrix_plan_roles:checked').each(function() {
							plan_roles.push($(this).val());
						});
						var plan_users = this_plan.find('.matrix-plan-users').select2('val');
						
						if (plan_roles.length == 0 && plan_users.length == 0) {
							validated = false;
							messages.push('Please select either roles or users for each plan.');
						}
					}else{
						validated = false;
						messages.push('Please enter distinct day intervals.');
					}
				});
			}
			
			if (validated == false) {
				messages = Collaboration.getUniqueList(messages);
				Custom.showMessages('error', 'Please check the following fields!', messages);
				return false;
			}else{
				return true;
			}
		},
		getUniqueList: function (list) {
			var result = [];
			$.each(list, function(i, e) {
			  if ($.inArray(e, result) == -1) result.push(e);
			});
			return result;
		},
		addMatrix: function () {
			// Plan looping
			var plans = [];
			$('.row.matrix-plan').not('.matrix-plan-dummy .row.matrix-plan').each(function() {
				var plan = {};
				var this_plan = $(this);
				
				var plan_intervel = this_plan.find('.matrix-day-intervel').val();
				var plan_roles = [];
				this_plan.find('.matrix_plan_roles:checked').each(function() {
					plan_roles.push($(this).val());
				});
				var plan_users = this_plan.find('.matrix-plan-users').select2('val');
				
				plan['days'] = plan_intervel;
				plan['roles'] = plan_roles;
				plan['users'] = plan_users;
				
				if (plan_intervel > 0) {
					plans.push(plan);
				}
			});
			var matrix = {};
			matrix['title'] = $('.matrix-title').val();
			matrix['plans'] = plans;
			if ($('.reminder-check:checked').length == 1 && $('.reminder-day-interval').val() != "") {
				reminder = {};
				reminder['days'] = $('.reminder-day-interval').val();
				matrix['reminder'] = reminder;
			}
			
			$.ajax({
				url: SocialView.base_url + "collaboration/" + SocialView.client + "/create_escalation_matrix",
				type: "POST",
				data: matrix,
				beforeSend: function(){
					Custom.showLoader();
				},
				complete: function(){
					//Custom.hideLoader();
				},
			}).done(function(json){
				if(typeof json == 'object' && json.status.code == 200 && json.matrix_id > 0) {
					//Custom.showMessages("success", "Matrix added successfully.", [""]);
					window.location.href = SocialView.base_url + "collaboration/" + SocialView.client + "/edit-escalation-matrix/" + json.matrix_id;
				} else{
					Custom.hideLoader();
					Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				}
			});
		},
		loadEscalationEdit: function() {
			// Numeric pre validation
			Collaboration.allowOnlyNumerals('.matrix-day-intervel');
			Collaboration.allowOnlyNumerals('.reminder-day-interval');
			// Select2
			$('select.select2-matrix-plan').select2({
                placeholder : "",
                allowClear : true,
                closeOnSelect : false
            });
			// Reminder check
			$('.reminder-check').on('click', function() {
				if ($('.reminder-day-interval').attr('disabled')) {
					$('.reminder-day-interval').removeAttr('disabled');
					if (typeof $('.reminder-day-interval').attr('rel') != 'undefined' && $('.reminder-day-interval').attr('rel') > 0) {
						var deleted_plan_ids = $('.deleted-plan-ids').val().split(',');
						var index = deleted_plan_ids.indexOf($('.reminder-day-interval').attr('rel'));
						if (index > -1) {
							deleted_plan_ids.splice(index, 1);
						}
						$('.deleted-plan-ids').val(deleted_plan_ids.join(',').replace(/^,|,$/g,''));
					}
				} else {
					$('.reminder-day-interval').attr('disabled', 'disabled');
					if (typeof $('.reminder-day-interval').attr('rel') != 'undefined' && $('.reminder-day-interval').attr('rel') > 0) {
						var deleted_plan_ids = $('.deleted-plan-ids').val().split(',');
						deleted_plan_ids.push($('.reminder-day-interval').attr('rel'));
						$('.deleted-plan-ids').val(deleted_plan_ids.join(',').replace(/^,|,$/g,''));
					}
				}
			});
			// Add plan from dummy
			$('.add-matrix-plan').on('click', function() {
				Collaboration.addMatrixPlanTemplate();
			});
			// Remove plan
			$('.panel-body.outer-matrix').on('click', '.remove-matrix-plan', function(){
				var me = $(this);
				Collaboration.removeMatrixPlanTemplate(me, true);
				
			});
			// Add button click
			$('.update-matrix-btn').on('click', function() {
				Custom.hideMessages();
				if(Collaboration.validateMatrix()){
					Collaboration.updateMatrix();
				}
			});
		},
		updateMatrix: function() {
			// Plan looping
			var plans = [];
			$('.row.matrix-plan').not('.matrix-plan-dummy .row.matrix-plan').each(function() {
				var plan = {};
				var this_plan = $(this);
				
				var plan_intervel = this_plan.find('.matrix-day-intervel').val();
				var plan_roles = [];
				this_plan.find('.matrix_plan_roles:checked').each(function() {
					plan_roles.push($(this).val());
				});
				var plan_users = this_plan.find('.matrix-plan-users').select2('val');
				
				if (typeof $(this).attr('rel') != 'undefined' && $(this).attr('rel') > 0 ) {
					plan['id'] = $(this).attr('rel');
				}
				
				plan['days'] = plan_intervel;
				plan['roles'] = plan_roles;
				plan['users'] = plan_users;
				
				if (plan_intervel > 0) {
					plans.push(plan);
				}
			});
			var matrix = {};
			matrix['id'] = SocialView.matrix_id;
			matrix['title'] = $('.matrix-title').val();
			matrix['plans'] = plans;
			if ($('.reminder-check:checked').length == 1 && $('.reminder-day-interval').val() != "") {
				reminder = {};
				reminder['days'] = $('.reminder-day-interval').val();
				if (typeof $('.reminder-day-interval').attr('rel') != 'undefined' && $('.reminder-day-interval').attr('rel') > 0) {
					reminder['id'] = $('.reminder-day-interval').attr('rel');
				}
				matrix['reminder'] = reminder;
			}
			if ($('.deleted-plan-ids').length && $('.deleted-plan-ids').val() != "") {
				var del_ids = $('.deleted-plan-ids').val().split(',');
				var deletePlans = [];
				for (var i=0;i<del_ids.length;i++) {
					del_plan = {};
					del_plan['id'] = del_ids[i];
					deletePlans.push(del_plan);
				}
				matrix['deletePlans'] = deletePlans;
			}
			
			$.ajax({
				url: SocialView.base_url + "collaboration/" + SocialView.client + "/update_escalation_matrix/" + SocialView.matrix_id,
				type: "POST",
				data: matrix,
				beforeSend: function(){
					Custom.showLoader();
				},
				complete: function(){
					//Custom.hideLoader();
				},
			}).done(function(json){
				if(typeof json == 'object' && json.status.code == 200) {
					//Custom.showMessages("success", "Matrix added successfully.", [""]);
					window.location.href = SocialView.base_url + "collaboration/" + SocialView.client + "/edit-escalation-matrix/" + SocialView.matrix_id;
				} else{
					Custom.hideLoader();
					Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				}
			});
		},
		loadVacation: function() {
			$('.vacation-filter-submit').on('click', function(){
				var from_user = $('#from_user').select2('val');
				var to_user = $('#to_user').select2('val');
				var from_date = $('#coll_vacation_filter_start_date').val();
				var to_date = $('#coll_vacation_filter_end_date').val();
				Collaboration.listVacations(from_user, to_user, from_date, to_date);
				return false;
			});
			$('.vacation-filter-submit').click();
			
			// Delete vacation
			$("body").on("click", ".delete-vacation", function(e){
				e.preventDefault();
				var me = $(this);
				bootbox.confirm("Are you sure?", function(result) {
					if(result){
						var url = SocialView.base_url + "collaboration/" + SocialView.client + "/delete-vacation";
						$.ajax({
							url : url,
							type : "POST",
							data : {
								vacation_id : me.attr("vacation-id")
							},
							beforeSend: function(){
								Custom.hideMessages();
								Custom.showLoader();
							},
							complete: function(){
								Custom.hideLoader();
							},
						}).done(function(json){
							if(typeof json == 'object' && json.status.code == 200) {
								Custom.showMessages("success", "Selected rule deleted successfully!", [""]);
								me.parents("tr").remove();
							} else {
								Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
							}
						});
					}
				}); 
			});
		},
		listVacations: function(from_user, to_user, from_date, to_date){
			//Custom.hideMessages();
			
	        var listColumns = [
				{
					"mData": "id",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.id_html;
					}
				},
				{
					"mData": "from_user",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.from_user;
					},
					"className" : "text-center"
				},
				{
					"mData": "to_user",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.to_user;
					},
					"className" : "text-center"
				},
				{
					"mData": "from_date",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.from_date;
					},
					"className" : "text-center"
				},
				{
					"mData": "to_date",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.to_date;
					},
					"className" : "text-center"
				},
				{
					"mData": "created_time",
					"orderable": false,
					"mRender": function(data, type, full){
						 return full.created_time;
					},
					"className" : "text-center"
				},{
					"mData": "actions",
					"orderable": false,
					"mRender" : function(data, type, full){
						var html = "";
						if (full.from_date_yyyymmdd > full.today) {
							html += '<a href="' + SocialView.base_url + 'collaboration/' + SocialView.client +'/edit-vacation/' + full.id + '" class="btn btn-xs default edit-vacation"><i class="fa fa-pencil"></i> Edit</a>';
						}
						html += '<a href="#" vacation-id="' + full.id + '" class="btn btn-xs default delete-vacation"><i class="fa fa-times"></i> Delete</a>';
						
						return html;
					},
					"className" : "text-center"
				}
            ];
	        
			var dataTableObj = $("#collaboration-vacation-list").dataTable({
				serverSide: true,
				bLengthChange: false,
				searching: false,
				iDisplayLength: 100,
				"bDestroy": true,
				"bProcessing":false,
				"language": {
					"emptyTable":     "There is no task available for the given filter settings."
				},
				order: [
					[0, 'desc']
				],
				ajax: {
					url: SocialView.base_url + 'collaboration/' + SocialView.client + '/vacation-list',
					type: 'POST',
					data: {
						from_user: from_user,
						to_user: to_user,
						from_date: from_date,
						to_date: to_date
					},
					dataType: 'json',
					beforeSend: function(){
						Custom.hideMessages();
						Custom.showLoader();
					},
					complete: function(){
						Custom.hideLoader();
					},
					error: function() {
						Custom.hideLoader();
						Custom.showMessages("error", "An error occurred", ["Sorry, there is an error processing your request. Please try again later"]);
					}
				},
				aoColumns: listColumns
			});
			
			return false;
		},
		loadVacationAdd: function() {
			$('.vacation-add-submit').on('click', function(e) {
				e.preventDefault();
				var validated = true;
                var errors = [];
				
				var from_user = $('#from_user').select2('val');
				var to_user = $('#to_user').select2('val');
				var from_date = $('#coll_vacation_filter_start_date').val();
				var to_date = $('#coll_vacation_filter_end_date').val();
				var tomorrow = $('#tomorrow').val();
				
				if(from_user == "" || to_user == ""){
					errors.push("Select from and to user");
                    validated = false;
				} else if (from_user == to_user) {
					errors.push("From user and To user can't be same");
                    validated = false;
				}
				if (Custom.get_date_yyyymmdd(from_date) < Custom.get_date_yyyymmdd(tomorrow)) {
					errors.push("Select a date range in future");
                    validated = false;
				}
				
				if (validated) {
					$.ajax({
						url: SocialView.base_url + "collaboration/" + SocialView.client + "/create-vacation",
						type: "POST",
						data: {
							from_user: from_user,
							to_user: to_user,
							from_date: from_date,
							to_date: to_date
						},
						beforeSend: function(){
							Custom.hideMessages();
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
					}).done(function(json){
						if(typeof json == 'object' && json.status.code == 200) {
							window.location.href = SocialView.base_url + "collaboration/" + SocialView.client + "/vacation";// + json.vacation.id
						} else if(typeof json == 'object' && json.status.code == 204) {
							var user_index = '';
							var user_arr = [];
							if(typeof json.vacation.fromUserVacations != "undefined"){
								user_arr.push('current assignee');
							}if(typeof json.vacation.toUserVacations != "undefined"){
								user_arr.push('new assignee');
							}if (user_arr.length) {
								user_index = user_arr.join(', ');
							}
							Custom.showMessages("warning", "Invalid Operation.", ["There is already a vacation scheduled for the " + user_index + " for the selected date range."]);
						} else {
							Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
						}
					});
				} else {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                }
                return false;
			});
		},
		loadVacationEdit: function() {
			$('.vacation-edit-submit').on('click', function(e) {
				e.preventDefault();
				var validated = true;
                var errors = [];
				
				var from_user = $('#from_user').select2('val');
				var to_user = $('#to_user').select2('val');
				var from_date = $('#coll_vacation_filter_start_date').val();
				var to_date = $('#coll_vacation_filter_end_date').val();
				var tomorrow = $('#tomorrow').val();
				
				if(from_user == "" || to_user == ""){
					errors.push("Select from and to user");
                    validated = false;
				} else if (from_user == to_user) {
					errors.push("From user and To user can't be same");
                    validated = false;
				}
				
				if (Custom.get_date_yyyymmdd(from_date) < Custom.get_date_yyyymmdd(tomorrow)) {
					errors.push("Select a date range in future");
                    validated = false;
				}
				
				if (validated) {
					$.ajax({
						url: SocialView.base_url + "collaboration/" + SocialView.client + "/update-vacation/" + SocialView.vacation_id,
						type: "POST",
						data: {
							from_user: from_user,
							to_user: to_user,
							from_date: from_date,
							to_date: to_date
						},
						beforeSend: function(){
							Custom.hideMessages();
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
					}).done(function(json){
						if(typeof json == 'object' && json.status.code == 200) {
							window.location.href = SocialView.base_url + "collaboration/" + SocialView.client + "/vacation";// + json.vacation.id
						} else if(typeof json == 'object' && json.status.code == 204) {
							var user_index = '';
							var user_arr = [];
							if(typeof json.vacation.fromUserVacations != "undefined"){
								user_arr.push('current assignee');
							}if(typeof json.vacation.toUserVacations != "undefined"){
								user_arr.push('new assignee');
							}if (user_arr.length) {
								user_index = user_arr.join(', ');
							}
							Custom.showMessages("warning", "Invalid Operation.", ["There is already a vacation scheduled for the " + user_index + " for the selected date range."]);
						} else {
							Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
						}
					});
				} else {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                }
                return false;
			});
		}
	};
}();

