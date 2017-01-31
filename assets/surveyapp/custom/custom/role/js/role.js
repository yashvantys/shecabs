var Role = function() {
	return {
		home : function(clientId) {
			
			$('.role-list')
			.dataTable(
					{
						serverSide : true,
						bLengthChange : false,
						bProcessing : true,
						iDisplayLength : 100,
						ajax : {
							url : SocialView.base_url
									+ "role/" + clientId+ "/list-ajax",
							type : 'POST',
							dataType : 'json',
							error : function() {
								Custom
										.showMessages(
												"error",
												"An error occurred",
												[ "Sorry, there is an error processing your request. Please try again later" ]);
							}
						},
						aoColumns : [
								{
									"mData" : "email"
								},
								{
									"mData" : "name",
									"name" : "Name"
								},
								{
									"mData" : "roleId"
								},
								{
									"mData" : "memberFor",
									 "orderable": false
								},
								{
									"mData" : "email_encoded",
									"mRender" : function(data, type,
											full) {

										var html = "";
										if (data != "") {
											var html = '<a href="'
													+ SocialView.base_url
													+ "users/" + clientId + "/view/"
													+ data + "/rule"
													+ '" class="btn default" style="margin-bottom: 5px;">Alerts</a>';
											
											html += '<a href="'
													+ SocialView.base_url
													+ "users/" + clientId + "/view/"
													+ data + "/report"
													+ '" class="btn default"  style="margin-bottom: 5px;">Reports</a>';
										}
										return html;
									},
									 "orderable": false
								}
							 ]
					});
			
		},
		
		add: function(isEdit) {
			var lower = /[a-z]/;
			var upper = /[A-Z]/;
					    
			$('input[type="submit"]').click(function(event) {
				
				Custom.hideMessages();
				$('#role').css('border', '');
	            
	            
	            if ($('#role').val() == '' || $('#role').val().trim().length == 0) {
					if (!isEdit) {
					Custom
					.showMessages(
							"error",
							"",
							[ "Role name is required" ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#role').css('border', '1px solid red');
					}
				} 
			});
			
			
			
		}
	}
}();