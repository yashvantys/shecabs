var History = function() {
	return {
		home : function(clientId) {

			$('.history-list')
					.dataTable(
							{
								serverSide : true,
								bLengthChange : false,
								bProcessing : true,
								iDisplayLength : 20,
								ajax : {
									url : SocialView.base_url
											+ "history/" + clientId+ "/list-ajax",
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
											"mData" : "fileName"
										},
										{
											"mData" : "module"
										},
										{
											"mData" : "status"
										},
										{
											"mData" : "processed"
										},
										{
											"mData" : "errors"
										},
										{
											"mData" : "enteredTime"
										},
										 ]
							});
		},
		errors : function(clientId, tokenId) {
			$('.errors-list')
					.dataTable(
							{
								serverSide : true,
								bLengthChange : false,
								bProcessing : true,
								iDisplayLength : 20,
								ajax : {
									url : SocialView.base_url
											+ "history/" + clientId+ "/errorDatalist_ajax/"+tokenId,
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
											"mData" : "email",
											"orderable": false
										},
										{
											"mData" : "rowNumber",
										},
										{
											"mData" : "errorReason"
										},
										]
							});
		},
	
	};
}();
