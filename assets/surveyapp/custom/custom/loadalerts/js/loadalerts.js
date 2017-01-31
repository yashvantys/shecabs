var Loadalerts = function() {
	return {
		checkMapping : function() {
			$('input[type="submit"]').click(function(event) {
				Custom.hideMessages();
				$('#column-selectthealerttype').css('border', '');
	            $('#column-selectassignee').css('border', '');
	            $('#column-enabletaskforthisrule').css('border', '');
	            $('#column-selectasurvey').css('border', '');
	            $('#column-selectaquestion').css('border', '');
	            $('#column-selectanoption').css('border', '');
				if ($('#column-selectthealerttype').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Select the alert type"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-selectthealerttype').css('border', '1px solid red');
				}else if ($('#column-selectassignee').val() == '-1' ) {
					Custom
					.showMessages(
						"error",
						"",
						[ 'Please select value for the field "Select Assignee"' ]);
						// Prevent form submission
						event.preventDefault();
						$('#column-selectassignee').css('border', '1px solid red');
				}else if ($('#column-enabletaskforthisrule').val() == '-1' && 
							$('#column-selectamatrix').val() != '-1' ) {
					Custom
					.showMessages(
							"error",
							"",
							[ 'Please map "Enable task"' ]);
		            // Prevent form submission
		            event.preventDefault();
		            $('#column-enabletaskforthisrule').css('border', '1px solid red');
				}else if ( !($('#column-selectasurvey').val() != '-1' && 
						$('#column-selectaquestion').val() != '-1' && $('#column-selectanoption').val() != '-1')) {
						if ( $('#column-selectasurvey').val() != '-1' ||  
							$('#column-selectaquestion').val() != '-1' || $('#column-selectanoption').val() != '-1' ) {
						Custom
						.showMessages(
							"error",
							"",
							[ 'Please map "Select a survey" and "Select a question", "Select an option"' ]);
						// Prevent form submission
						event.preventDefault();
						if ($('#column-selectasurvey').val() == '-1' )
							$('#column-selectasurvey').css('border', '1px solid red');
						if ($('#column-selectaquestion').val() == '-1')
							$('#column-selectaquestion').css('border', '1px solid red');
						if ($('#column-selectanoption').val() == '-1')
							$('#column-selectanoption').css('border', '1px solid red');
					}
		        }
			});
		}
	};
}();
