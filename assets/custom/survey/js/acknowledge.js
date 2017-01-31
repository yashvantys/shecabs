jQuery(document).ready(function() {  
	$('body').css('overflow','hidden');
	$('body').css('position','fixed');
	$('body').css('width','100%');
	$('#modal_ack').modal('show');
	$('.close').hide();
	
	
	
});

$("body").on("click", "#cancel_form", function(e){
	e.preventDefault();
	var url = SurveyView.base_url + "user/logout";
	$(location).attr('href',encodeURI(url));
	
});

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}


$("body").on("click", "#continue_form", function(e){
	e.preventDefault();
	
	var defaultUrl = SurveyView.base_url + "survey/home";
	var url = SurveyView.base_url + "survey/getPreviousUrl";
	var redirectUrl = '';
	
	$.ajax({
		type : 'GET',
		dataType: "text",
		url: url,
		async:false
		}).done(function(data) {
		   redirectUrl = data;
		});
	
	var iagree = $("#iagree").prop("checked");// == true();
	
	if ( redirectUrl == '')
		redirectUrl = encodeURI(defaultUrl);
	
	if(iagree == true && isUrl(redirectUrl)){
		$(location).attr('href',redirectUrl);
	}else{
		$('#error-bubble').addClass('alert alert-error').html('Please click on "I agree" if you wish to proceed.') ;
	}
});

