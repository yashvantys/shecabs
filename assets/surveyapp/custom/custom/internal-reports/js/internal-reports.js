var InternalReports = function() {
	return {
		loadHierarchySetup: function() {
			$('body').on('click', '.hierarchy-setup .ajax-open', function(e) {
 				var me = $(this);
				var avatar_id = me.attr('avatar-id');;
				var parents_attr = me.attr('parents-attr');
				var parents = parents_attr.split(',');
				$.ajax({
					url: me.attr("data-url"),
					type: "POST",
					data: {
						parents: parents
					},
					beforeSend: function(xhr) {
						me.removeClass('fa-plus-square-o ajax-open').addClass('fa-refresh fa-spin');
					}
				}).done(function(data) {
					me.removeClass('fa-refresh fa-spin').addClass('fa-minus-square-o hierarchy-close');
					table = data.data;
					var node_data = data.node_data;
					$('.issues-identified-'+avatar_id).attr('issues-identified-node-'+avatar_id, node_data.issuesIdentified).html(node_data.issuesIdentified);
					var parent = me.parents("tr");
					var rows = $(table).find("tbody").html();
					parent.after(rows);
				});
				return false;
			});
			$('body').on('click', '.hierarchy-setup .hierarchy-open', function(e) {
 				var me = $(this);
				var avatar_id = me.attr('avatar-id');
				me.removeClass('fa-plus-square-o hierarchy-open').addClass('fa-minus-square-o hierarchy-close');
				$('.avatar-child-of-'+avatar_id).removeClass('hidden').find('i.hierarchy-close').removeClass('fa-minus-square-o hierarchy-close').addClass('fa-plus-square-o hierarchy-open');
				$('.issues-identified-'+avatar_id).html($('.issues-identified-'+avatar_id).attr('issues-identified-node-'+avatar_id));
				if (parseInt($('.issues-identified-'+avatar_id).html()) == 0) {
					$('.issues-identified-'+avatar_id).css('color', 'inherit!important');
				}else{
					$('.issues-identified-'+avatar_id).css('color', '#ff0000!important');
				}
			});
			$('body').on('click', '.hierarchy-setup .hierarchy-close', function(e) {
 				var me = $(this);
				var avatar_id = me.attr('avatar-id');
				me.removeClass('fa-minus-square-o hierarchy-close').addClass('fa-plus-square-o hierarchy-open');
				$('.avatar-parent-'+avatar_id).addClass('hidden');
				$('.issues-identified-'+avatar_id).html($('.issues-identified-'+avatar_id).attr('issues-identified-roll-up-'+avatar_id));
				if (parseInt($('.issues-identified-'+avatar_id).html()) == 0) {
					$('.issues-identified-'+avatar_id).css('color', 'inherit!important');
				}else{
					$('.issues-identified-'+avatar_id).css('color', '#ff0000!important');
				}
			});
			$('body').on('click', '.internal-modal-link', function(e) {
				var me = $(this);
				var selectedAvatar = me.attr("selected-avatar");
				var content_type = $(this).attr("data-type-selected");
				$.ajax({
					url: me.attr("data-url"),
					type: "GET",
					data: 'type=' + content_type,
					beforeSend: function(xhr) {
						Custom.showLoader();
					}
				}).done(function(data) {
					table = data.data;
					$("#full .test-data").html(table);
					$(".verify-internal-reports").attr('data-url',data.data_url);
					$(".verify-internal-reports").attr('selected-avatar',selectedAvatar);
					if(content_type == 'harvester'){
						$("#full .modal-title").html("Harvester Details")
					}
					if(content_type == 'competitor'){
						$("#full .modal-title").html("Competitor Details")
					}
					if($('.harvester-count-status-'+selectedAvatar).hasClass('btn-danger')) {
						$(".verify-internal-reports").html("Verify");
						$('.verify-internal-reports').attr('disabled',false);
					}
					
					if($('.harvester-count-status-'+selectedAvatar).hasClass('default')) {
						$(".verify-internal-reports").html("Verified");
						$('.verify-internal-reports').attr('disabled','disabled');
					}
					$("#full").modal('show');
					Custom.hideLoader();
				}).fail(function() {
					
				});
				return false;
			});
			$('body').on('click', '.verify-internal-reports', function(e) {
				var allCheckedItems = [];
				var dataArray = [];
				var status = 0;
				$('.source-item-check').each(function() {
					if($(this).is(':checked')){
						status = 1;
						allCheckedItems.push($(this).val());
						dataArray.push({
							avatar_id: $(".avatar-"+$(this).val()).val(), 
							comment_text:  $(".comment-source-"+$(this).val()).val(),
							source_id :$(this).val()
						});
					}

				});

				if(status == 1){
					$.ajax({
						url: $(this).attr("data-url"),
						type: "POST",
						data: {
							data: dataArray
						},
						beforeSend: function(xhr) {
							$(".status-updates").html("");
							$('.verify-internal-reports').html('Please wait...');
							$('.verify-internal-reports').attr('disabled','disabled');
						}
					}).done(function(data) {
						if(data){
							$('.source-item-check').each(function() {
								if($(this).is(':checked')){
									$(".success-"+$(this).val()).html('<i class="fa fa-check"></i>');
									$(this).attr('readonly',true);
									$(this).attr('disabled',true);
									$(".comment-source-"+$(this).val()).val("");
								}

							});

						}
						
						if(!data.data.data.harvesterIssueFlag){
							$(".harvester-count-status-"+data.data.data.avatarId).removeClass("btn-danger");
							$(".harvester-count-status-"+data.data.data.avatarId).addClass("default");
							var selectedAvatarId = $('.verify-internal-reports').attr('selected-avatar');
							// Count update
							
							updatedParentHarvesterCount($(".harvester-count-status-"+data.data.data.avatarId),selectedAvatarId,'negative');
							// End
						}
						
						$("#full").modal('hide');
//						$(".status-updates").html("<span style='color:green;'>Selected Sources has been verified</span>");
						$('.verify-internal-reports').html('Verify');
						setTimeout(function(){
							$(".status-updates").html("");
						}, 2000);

						Custom.showMessages('success', 'Selected Sources has been verified', []);
						setTimeout(function(){
							Custom.hideMessages();
						}, 3000);
						$('.verify-internal-reports').attr('disabled',false);
					});
				}else{
					$(".status-updates").html("<span style='color:red;'>Please check Harvester's</span>");
					setTimeout(function(){
						$(".status-updates").html("");
					}, 2000);
				}

				return false;
			});
			
			$('body').on('click', '.competitor-modal-link', function(e) {
				var me = $(this);
				var competitorVerifiedFlag = me.attr("competitor-verified-flag");
				var avatarId = me.attr("avatar-id");
				var content_type = me.attr("data-type-selected");
				$.ajax({
					url: me.attr("data-url"),
					type: "GET",
					data: 'type=' + content_type,
					beforeSend: function(xhr) {
						Custom.showLoader();
					}
				}).done(function(data) {
					table = data.data;
					competitorComment = '';
					if (typeof data.parent_data.competitorComment != "undefined") {
						competitorComment = data.parent_data.competitorComment;
					}
					$(".competitor-comment").val(competitorComment);
					$("#responsive .selected-avatar").val(avatarId);
					$("#responsive .test-data").html(table);
					$(".verify-competitor-internal-reports").attr('data-url',data.data_url);
					if(competitorVerifiedFlag == 'yes'){
						$(".verify-competitor-internal-reports").hide();
						$(".flag-error-competitor-internal-reports").show();
					}else if(competitorVerifiedFlag == 'no'){
						$(".flag-error-competitor-internal-reports").hide();
						$(".verify-competitor-internal-reports").show();
					}
					$(".verify-competitor-internal-reports").attr('data-url');
					$(".flag-error-competitor-internal-reports").attr('data-url',data.data_url);
					if(content_type == 'harvester'){
						$("#responsive .modal-title").html("Harvester Details")
					}
					if(content_type == 'competitor'){
						$("#responsive .modal-title").html("Competitor Details")
					}
					$("#responsive").modal('show');
					Custom.hideLoader();
				}).fail(function() {
					
				});
				return false;
			});
			
			$('body').on('click', '.verify-competitor-internal-reports', function(e) {
				var selectedAvatarId = $(".selected-avatar").val();
				var competitorComment = $(".competitor-comment").val();
				var competitorStatus = 'true';
				if(selectedAvatarId){
					$.ajax({
						url: $(this).attr("data-url"),
						type: "POST",
						data: {
							data: competitorComment,competitorStatus:competitorStatus
						},
						beforeSend: function(xhr) {
							Custom.hideMessages();
							$('.verify-competitor-internal-reports').html('Please wait...');
							$('.verify-competitor-internal-reports').attr('disabled','disabled');
						}
					}).done(function(data) {
						if(data.data.flagStatus){
							$(".status-btn-"+selectedAvatarId).removeClass("default");
							$(".status-btn-"+selectedAvatarId).addClass("btn-danger");
							$(".status-btn-"+selectedAvatarId).attr("competitor-verified-flag",'no');
						}else{
							$(".status-btn-"+selectedAvatarId).removeClass("btn-danger");
							$(".status-btn-"+selectedAvatarId).addClass("default");
							$(".status-btn-"+selectedAvatarId).attr("competitor-verified-flag",'yes');
						}
						
						updatedParentHarvesterCount($(".harvester-count-status-"+data.data.data.avatarId),selectedAvatarId,'negative');

						// Count update
//						var avatarIssuesCell = $(".issues-identified-"+selectedAvatarId);
//						var avatarIssuesCell_html = avatarIssuesCell.html();
//						var current_roll_up_errors = avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId);
//						current_roll_up_errors_new = current_roll_up_errors;
//						if (current_roll_up_errors != "undefined" && current_roll_up_errors > 0) {
//							var current_roll_up_errors_new = parseInt(current_roll_up_errors) - 1;
//							avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId, current_roll_up_errors_new);
//						}
//						var current_node_errors = avatarIssuesCell.attr("issues-identified-node-"+selectedAvatarId);
//						if (current_node_errors != "undefined" && current_node_errors > 0) {
//							var current_node_errors_new = parseInt(current_node_errors) - 1;
//							avatarIssuesCell.attr("issues-identified-node-"+selectedAvatarId, current_node_errors_new);
//						}
//						if(parseInt(avatarIssuesCell_html) > 0){
//							var avatarIssuesCell_html_new = parseInt(avatarIssuesCell_html) - 1;
//							avatarIssuesCell.html(avatarIssuesCell_html_new);
//							avatarIssuesCell.html(avatarIssuesCell_html_new);
//							if(avatarIssuesCell_html_new == 0){
//								avatarIssuesCell.css("color","#333333");
//							}
//						}
						// End
						
						$("#responsive").modal('hide');
						$(".competitor-comment").val("");
						$('.verify-competitor-internal-reports').html('Verify');
						Custom.showMessages('success', 'Verified the changes.', []);
						setTimeout(function(){
							Custom.hideMessages();
						}, 3000);
						$('.verify-competitor-internal-reports').attr('disabled',false);
						
					});
				}

				return false;
			});
			$('body').on('click', '.flag-error-competitor-internal-reports', function(e) {
				var selectedAvatarId = $(".selected-avatar").val();
				var competitorComment = $(".competitor-comment").val();
				var competitorStatus = 'false';
				if(selectedAvatarId){
					$.ajax({
						url: $(this).attr("data-url"),
						type: "POST",
						data: {
							data: competitorComment,competitorStatus:competitorStatus
						},
						beforeSend: function(xhr) {
							Custom.hideMessages();
							$('.flag-error-competitor-internal-reports').html('Please wait...');
							$('.flag-error-competitor-internal-reports').attr('disabled','disabled');
						}
					}).done(function(data) {
						if(data.data.flagStatus){
							$(".status-btn-"+selectedAvatarId).removeClass("btn-danger");
							$(".status-btn-"+selectedAvatarId).addClass("default");
							$(".status-btn-"+selectedAvatarId).attr("competitor-verified-flag",'yes');
						}else{
							$(".status-btn-"+selectedAvatarId).removeClass("default");
							$(".status-btn-"+selectedAvatarId).addClass("btn-danger");
							$(".status-btn-"+selectedAvatarId).attr("competitor-verified-flag",'no');
						}
						updatedParentHarvesterCount($(".harvester-count-status-"+data.data.data.avatarId),selectedAvatarId,'plus');

//						// Count update
//						var avatarIssuesCell = $(".issues-identified-"+selectedAvatarId);
//						var avatarIssuesCell_html = avatarIssuesCell.html();
//						var current_roll_up_errors = avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId);
//						current_roll_up_errors_new = current_roll_up_errors;
//						if (current_roll_up_errors != "undefined") {
//							var current_roll_up_errors_new = parseInt(current_roll_up_errors) + 1;
//							avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId, current_roll_up_errors_new);
//						}
//						var current_node_errors = avatarIssuesCell.attr("issues-identified-node-"+selectedAvatarId);
//						if (current_node_errors != "undefined") {
//							var current_node_errors_new = parseInt(current_node_errors) + 1;
//							avatarIssuesCell.attr("issues-identified-node-"+selectedAvatarId, current_node_errors_new);
//						}
//						var avatarIssuesCell_html_new = parseInt(avatarIssuesCell_html) + 1;
//						avatarIssuesCell.html(avatarIssuesCell_html_new);
						// End
						
						$("#responsive").modal('hide');
						$(".competitor-comment").val("");
						$('.flag-error-competitor-internal-reports').html('Flag Error');
						
						Custom.showMessages('success', 'Error flaged.', []);
						setTimeout(function(){
							Custom.hideMessages();
						}, 3000);
						$('.flag-error-competitor-internal-reports').attr('disabled',false);
						
					});
				}

				return false;
			});
			
			function updatedParentHarvesterCount(selector,selectedAvatarId,calcType) {
				var parentListString = $(selector).attr("parents-list-attr");
				
				var parentList = parentListString.split(',');
				var selectedAvatarId = selectedAvatarId;
				console.log(selectedAvatarId)
				var avatarIssuesCell = $(".issues-identified-"+selectedAvatarId);
				var avatarIssuesCell_html = avatarIssuesCell.html();
				console.log(avatarIssuesCell_html);
				var current_roll_up_errors = avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId);
				current_roll_up_errors_new = current_roll_up_errors;
				if (current_roll_up_errors != "undefined" && current_roll_up_errors > 0) {
					var current_roll_up_errors_new = parseInt(current_roll_up_errors) - 1;
					avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId, current_roll_up_errors_new);
				}
				var current_node_errors = avatarIssuesCell.attr("issues-identified-node-"+selectedAvatarId);
				if (current_node_errors != "undefined") {
					if(calcType == "negative"){
						var current_node_errors_new = parseInt(current_node_errors) - 1;
					}else{
						var current_node_errors_new = parseInt(current_node_errors) + 1;
					}
					avatarIssuesCell.attr("issues-identified-node-"+selectedAvatarId, current_node_errors_new);
				}
				console.log(avatarIssuesCell_html);
				if(calcType == "negative"){
					if(parseInt(avatarIssuesCell_html) > 0){
						var avatarIssuesCell_html_new = parseInt(avatarIssuesCell_html) - 1;
					}else{
						var avatarIssuesCell_html_new = 0;

					}
				}else{
					if(parseInt(avatarIssuesCell_html) > 0){
						var avatarIssuesCell_html_new = parseInt(avatarIssuesCell_html) + 1;
					}else{
						var avatarIssuesCell_html_new = 0 + 1;

					}
				}
				avatarIssuesCell.html(avatarIssuesCell_html_new);
				if(avatarIssuesCell_html_new == 0){
					avatarIssuesCell.css("color","#333333");
				}else{
					avatarIssuesCell.css("color","#ff0000");
				}
				$.each( parentList, function( index, value ){
					var selectedAvatarId = value;
					var avatarIssuesCell = $(".issues-identified-"+selectedAvatarId);
					var avatarIssuesCell_html = avatarIssuesCell.html();
					var current_roll_up_errors = avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId);
					current_roll_up_errors_new = current_roll_up_errors;
					if (current_roll_up_errors != "undefined" && current_roll_up_errors > 0) {
						if(calcType == "negative"){
							var current_roll_up_errors_new = parseInt(current_roll_up_errors) - 1;
						}else{
							var current_roll_up_errors_new = parseInt(current_roll_up_errors) + 1;
						}
						
						avatarIssuesCell.attr("issues-identified-roll-up-"+selectedAvatarId, current_roll_up_errors_new);
						
					}
				});
				
			}
		},
		tableRowClassRefresh: function(class_name) {
			/*$('table.' + class_name + ' tbody tr').removeClass('odd even');
			$('table.' + class_name + ' tbody tr:visible:odd').css('background-color', 'none');
			$('table.' + class_name + ' tbody tr:visible:even').css('background-color', '#f9f9f9 !important;');*/
		}
	};
}();
