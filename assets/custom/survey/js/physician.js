$(document).ready(function() {
$("input:text,form").attr("autocomplete","off");
});

// Show appeal popup

function ShowappealPopup(contId,DocId,Status,clientID,responce,editresp,surveydate,rwdBy,rwdtime,editby,edittime){
	
	$('#ajaxResults').removeClass('alert alert-success').html('');
	$('#ajaxResults').removeClass('alert alert-error').html('');
	save_method = 'appeal';
	// $('#rejectreason-form')[0].reset(); // reset form on modals
	//$('#editappeal').modal('hide');
	$('#editappeal').modal('show'); 
	$("#reason").select2();
	
	 var eurl = SurveyView.base_url + "survey/appealpopup";
	 
	 $.ajax({
		  url : eurl,
		  type : "POST",
		  datatype : "json",
		  data : 
		  {
			  contId : contId,
			  DocId: DocId,
			  Status: Status,
			  clientID: clientID,
			  responce: responce,
			  editresp: editresp,
			  rwdBy: rwdBy,
			  rwdtime: rwdtime,
			  editby: editby,
			  edittime: edittime,
			  surveydate : surveydate
			  
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#showeditappeal').html(data.appealpopup);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
	
}

function saveAppealComment()
{

  var url;
  client_id =  $('[name="client_id"]').val(); 
 /* var reasonval = $('#reason').val();
  var reasontext = $('#reason_text').val().trim();*/
  var orgtestimonialval =$('[name="responce_org"]').val().trim();
  var appealval = $('[name="appeal_resp"]').val().trim();
 //alert(flag);return false;
  if($('#appeal_resp').val() =='')
  {
  		$('#customm_test').addClass('alert alert-error').html('Please enter Appeal') ;
			return false;
  }	
  else
  {
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
	 
		     url = SurveyView.base_url + "survey/"+client_id+"/AppealComment/";
		      // ajax adding data to database
		      $.ajax({
		        url : url,
		        type: "POST",
		        data: $('#appeal-form').serialize(),
		        dataType: "JSON",
		        success: function(data)
		        {
		           // if success close modal and reload ajax table
		           $('#editappeal').modal('hide');
		           dataTableAjaxReload();
		           data.statusText="Appealed Comment Added successfully";
		           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
		           setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-success').html('');
		       			}, 2000);
		        },
		        error: function ()
		        {
		          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		        }
		    });
  }
}

//Show appeal Review popup

function ShowappealreviewPopup(contId,DocId,Status,clientID,responce,editresp,surveydate,rwdBy,rwdtime,editby,edittime,appealtext,editrid,editrvalue,editothreason,appeltime){
	
	$('#ajaxResults').removeClass('alert alert-success').html('');
	$('#ajaxResults').removeClass('alert alert-error').html('');
	save_method = 'appeal';
	// $('#rejectreason-form')[0].reset(); // reset form on modals
	//$('#editappeal').modal('hide');
	$('#editappealreview').modal('show'); 
	$("#reason").select2();
	
	 var eurl = SurveyView.base_url + "survey/appealreviewpopup";
	
	 $.ajax({
		  url : eurl,
		  type : "POST",
		  datatype : "json",
		  data : 
		  {
			  contId : contId,
			  DocId: DocId,
			  Status: Status,
			  clientID: clientID,
			  responce: responce,
			  editresp: editresp,
			  rwdBy: rwdBy,
			  rwdtime: rwdtime,
			  editby: editby,
			  edittime: edittime,
			  editrid: editrid,
			  editrvalue: editrvalue,
			  editothreason: editothreason,
			  appealtext: appealtext,
			  appeltime: appeltime,
			  surveydate : surveydate
			  
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#showeditappealreview').html(data.appealpopup);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
	
}

function reasonchange(){
	var reasonval = $('#reason').val();
	
	if(reasonval == 13){
		$('#edit_reason_textbox').show();
	}else{
		$('#edit_reason_textbox').hide();
		$('#reason_error').removeClass('alert alert-error').html('');
	}
}


function saveReviewAppealComment(status)
{

  var url;
  client_id =  $('[name="client_id"]').val(); 
 /* var reasonval = $('#reason').val();
  var reasontext = $('#reason_text').val().trim();*/
  var orgtestimonialval =$('[name="responce_org"]').val().trim();
  var appealval = $('[name="appeal_review_resp"]').val().trim();
  var edit_chk = $('[name="coupon_question"]').is(":checked");
  var responce =  $('[name="responce"]').val().trim();
  var reason = $('#reason').val();
  var reason_text = $('#reason_text').val().trim();
 
  
 //alert(flag);return false;
  if($('#appeal_review_resp').val() =='')
  {
  		$('#customm_test').addClass('alert alert-error').html('Please enter Appeal Review response') ;
			return false;
  }	else if(edit_chk == true && (responce == '' || responce == null)){
	  $('#custom_edit').addClass('alert alert-error').html('Please enter edit testimonial') ;
		return false;
  }	else if(edit_chk == true && reason == 13 && (reason_text =='' || reason_text == null)){
	  $('#custom_edit').addClass('alert alert-error').html('Please enter comment') ;
		return false;
  }else
  {
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
	 
		     url = SurveyView.base_url + "survey/"+client_id+"/ReviewedAppealComment/"+status;
		      // ajax adding data to database
		      $.ajax({
		        url : url,
		        type: "POST",
		        data: $('#appealreview-form').serialize(),
		        dataType: "JSON",
		        success: function(data)
		        {
		           // if success close modal and reload ajax table
		           $('#editappealreview').modal('hide');
		           dataTableAjaxReload();
		           data.statusText="Reviewed the Appealed Comment successfully";
		           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
		           setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-success').html('');
		       			}, 2000);
		        },
		        error: function ()
		        {
		          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		        }
		    });
  }
}


// show Reject Reason popup

function ShowrejectPopup(contId,DocId,Status,ReasonId,OtherReason){
	
	$('#ajaxResults').removeClass('alert alert-success').html('');
	$('#ajaxResults').removeClass('alert alert-error').html('');
	save_method = 'reject';
	// $('#rejectreason-form')[0].reset(); // reset form on modals
	// $('#RejectReasonpopup').modal('show');
	$('#edittestimonial').modal('hide');
	$('#RejectReasonpopup').modal('show'); 
	$("#reason").select2();
	
	 var eurl = SurveyView.base_url + "survey/rejectreason";
	 
	 $.ajax({
		  url : eurl,
		  type : "POST",
		  datatype : "json",
		  data : 
		  {
			  contId : contId,
			  DocId: DocId,
			  Status: Status,
			  ReasonId: ReasonId,
			  OtherReason: OtherReason
			  
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#showrejectreason').html(data.rejectreason);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
	
}

function dataTableAjaxReload()
{
	 var table = $('#physicians-list').DataTable();
     table.ajax.reload(null, false);
	
}

//show Revert and Reject Reason popup
function revertrejectpopup(contId,DocId,Status,ReasonId,OtherReason){
	
	$('#ajaxResults').removeClass('alert alert-success').html('');
	$('#ajaxResults').removeClass('alert alert-error').html('');
	save_method = 'reject';
	// $('#rejectreason-form')[0].reset(); // reset form on modals
	// $('#RejectReasonpopup').modal('show');
	$('#edittestimonial').modal('hide');
	$('#RevertRejectReasonpopup').modal('show'); 
	$("#reason").select2();
	
	 var eurl = SurveyView.base_url + "survey/revertrejectreason";
	 
	 $.ajax({
		  url : eurl,
		  type : "POST",
		  datatype : "json",
		  data : 
		  {
			  contId : contId,
			  DocId: DocId,
			  Status: Status,
			  ReasonId: ReasonId,
			  OtherReason: OtherReason
			  
			  
		  },
		  success: function(data, statusMsg, jqXHR)
		  {
			  $('#showrevertrejectreason').html(data.revertrejectreason);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
	
}


function ApproveTestimonial(contId,DocId,Status)
{
	$('#ajaxResults').removeClass('alert alert-success').html('');
	$('#ajaxResults').removeClass('alert alert-error').html('');
	
	if(Status == 1)
	{
		var url = SurveyView.base_url + "survey/approve/";
	}
	else if(Status == 2)
	{
		 var url = SurveyView.base_url + "survey/reject/";
	}
	
	  $.ajax({
		  url : url,
		  type : "POST",
		  data : {
			  contentid : contId,
			  documentid : DocId
		  },
		  beforeSend: function(){
				Custom.showLoader();
			},
			complete: function(){
				Custom.hideLoader();
			},
	  }).done(function(json){
		  if(Status == 1)
		  {
			  if(json['statusCode'] == 200) {
		    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials approved successfully!') ;
		    	  dataTableAjaxReload();
		          setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-success').html('');
		       			}, 2000);
			  
			  }else{
				  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
				  setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-error').html('');
		       			}, 2000);
				  
			  }
		  }
		  else if(Status == 2)
		  {
			  if(json['statusCode'] == 200) {
		    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials rejected successfully!') ;
		    	  dataTableAjaxReload();
		          setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-success').html('');
		       			}, 2000);
			  
			  } else{
				  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
				  setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-error').html('');
		       			}, 2000);
				  
			  }
		  }
		    
	  });
}

function reasonchangemultireject(){
	
	var reasonval = $('#reasonrejectmulti').val();
		
	//alert(reasonval);
		if(reasonval == 13){
			$('#edit_reason_textbox_reject_multiple').css('display','block');
			
		}else{
			$('#edit_reason_textbox_reject_multiple').css('display','none');
			$('#reason_error_reject_multi').removeClass('alert alert-error').html('');
		}
	}


function reasonchangereject(){
	
	var reasonval = $('#reasonreject').val();
		
		if(reasonval == 13){
			$('#edit_reason_textbox_reject').css('display','block');
			$('#edit_reason_textbox').show();
		}else{
			$('#edit_reason_textbox').hide();
			$('#edit_reason_textbox_reject').css('display','none');
			$('#reason_error_reject').removeClass('alert alert-error').html('');
		}
	}

function reasonchangerevertreject(){
	
	var reasonval = $('#reasonrevertreject').val();
		
		if(reasonval == 13){
			$('#edit_revert_reason_textbox_reject').css('display','block');
			$('#reason_text_reject_revert').show();
		}else{
			$('#edit_revert_reason_textbox_reject').hide();
			$('#edit_reason_textbox_reject').css('display','none');
			$('#revert_reason_error_reject').removeClass('alert alert-error').html('');
		}
	}

	function reasonchangeapprove(){
		
		var reasonval = $('#reasonapprove').val();
			
			if(reasonval == 13){
				$('#reason_text_approve').css('display','block');
				$('#edit_reason_textbox_approve').show();
			}else{
				$('#edit_reason_textbox_approve').hide();
				$('#reason_text_approve').css('display','none');
				$('#reason_error_approve').removeClass('alert alert-error').html('');
			}
		}

	function changeReject(){
		var reasonval = $('#reason_reject').val();
		
		
		if(reasonval == 13){
			$('#reject_reason_textbox').show();
		}else{
			$('#reject_reason_textbox').hide();
			$('#reason_error').removeClass('alert alert-error').html('');
		}
	}

	function reasonchange(){
		var reasonval = $('#reason').val();
		
		if(reasonval == 13){
			$('#edit_reason_textbox').show();
		}else{
			$('#edit_reason_textbox').hide();
			$('#reason_error').removeClass('alert alert-error').html('');
		}
	}

	function limitText(limitField, limitCount, limitNum) {
		if (limitField.value.length > limitNum) {
			limitField.value = limitField.value.substring(0, limitNum);
		} else {
			limitCount.value = limitNum - limitField.value.length;
		}
	}

function saveTestimonial()
{
	
  var url;
  var client_id;
 
  client_id =  $('[name="client_id"]').val(); 
  var reasonval = $('#reason').val();
  var reasontext = $('#reason_text').val().trim();
   
  if($('#responce').val() =='')
  {
			
           $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
  }	else if(reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
	   
	  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
	  return false;	
	}
  else
  {
	  
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');


     url = SurveyView.base_url + "survey/"+client_id+"/updateTestimonial/save";
   
   // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#testimonial-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
        	
           // if success close modal and reload ajax table
           $('#edittestimonial').modal('hide');
           dataTableAjaxReload();
           data.statusText="Testimonial response updated successfully";
           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
           setTimeout(function() {
      			$('#ajaxResults').removeClass('alert alert-success').html('');
      			}, 2000);
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
      
}    
}




function saveApproveTestimonial(flag)
{

  var url;
  client_id =  $('[name="client_id"]').val(); 
  var reasonval = $('#reason').val();
  var reasontext = $('#reason_text').val().trim();
  var orgtestimonialval =$('[name="responce_org"]').val().trim();
  var edittestinomialval = $('[name="responce"]').val().trim();
 //alert(flag);return false;
  if($('#responce').val() =='')
  {
  		$('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
  }	else if(flag == 0  && reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
	   
	  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
	  return false;	
	}
  /*else if(flag == 1 && orgtestimonialval != edittestinomialval && reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
		   
		  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
		  return false;	
		}*/
  else
  {
	  
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
	 
		     url = SurveyView.base_url + "survey/"+client_id+"/ApproveStatusTestimonial/app";
		      // ajax adding data to database
		      $.ajax({
		        url : url,
		        type: "POST",
		        data: $('#testimonial-form').serialize(),
		        dataType: "JSON",
		        success: function(data)
		        {
		        
		           // if success close modal and reload ajax table
		           $('#edittestimonial').modal('hide');
		           dataTableAjaxReload();
		           data.statusText="Testimonial approval status updated successfully";
		           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
		           setTimeout(function() {
		       			$('#ajaxResults').removeClass('alert alert-success').html('');
		       			}, 2000);
		        },
		        error: function ()
		        {
		          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		        }
		    });
  }
}

function RejectTestimonial(contentid,documentid){
	
	var reasonval = $('#reasonreject').val();
	var reasontext = $('#reason_text_reject').val().trim();
	
	if(reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
				   
		  $('#reason_error_reject').addClass('alert alert-error').html('Please enter comment') ;
		  return false;	
		}
	  else
	  {
		  $('#reason_error_reject').removeClass('alert alert-error').html('');
			 var url = SurveyView.base_url + "survey/reject/";
		
		  $.ajax({
			  url : url,
			  type : "POST",
			  data : {
				  contentid : contentid,
				  documentid : documentid,
				  reviewReasonId : reasonval,
				  reviewOtherReason : reasontext
				  
			  },
			  beforeSend: function(){
					Custom.showLoader();
				},
				complete: function(){
					Custom.hideLoader();
				},
		  }).done(function(json){
			 
				 
				  if(json['statusCode'] == 200) {
					  $('#RejectReasonpopup').modal('hide');
					  Testinomialscrollshow();
			    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials rejected successfully!') ;
			    	  dataTableAjaxReload();
			          setTimeout(function() {
			       			$('#ajaxResults').removeClass('alert alert-success').html('');
			       			}, 2000);
				  
				  } else{
					  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
					  setTimeout(function() {
			       			$('#ajaxResults').removeClass('alert alert-error').html('');
			       			}, 2000);
				  }
			
			    
		  });
		  
	  }
	
}


function RevertRejectTestimonial(contentid,documentid){
			
		var url;
		var reasonval = $('#reasonrevertreject').val();
		var reasontext = $('#reason_text_reject_revert').val().trim();
	 	 
	 if(reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
		   
		  $('#error-reason-reject').addClass('alert alert-error').html('Please enter comment') ;
		  return false;	
		}
	  else
	  {
		 
	    $('#error-reason-reject').removeClass('alert alert-error').html('');
	  
	     url = SurveyView.base_url + "survey/revert/revertreject";
	      // ajax adding data to database
	      $.ajax({
	        url : url,
	        type: "POST",
	        data : {
				  contentid : contentid,
				  documentid : documentid,
				  reviewReasonId : reasonval,
				  reviewOtherReason : reasontext
				  
			  },
	        dataType: "JSON",
	        success: function(data)
	        {
	           // if success close modal and reload ajax table
	           $('#RevertRejectReasonpopup').modal('hide');
	           dataTableAjaxReload();
	           Testinomialscrollshow();
	           data.statusText="Testimonial revert status updated successfully";
	           $('#ajaxResults').addClass('alert alert-success').html(data.statusText);
	           setTimeout(function() {
	       			$('#ajaxResults').removeClass('alert alert-success').html('');
	       			}, 2000);
	        },
	        error: function ()
	        {
	          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
	        }
	    });
	  }
	
	
	
	
	
	
	
	
}

function saveRejectTestimonial()
{
  var url;
  client_id =  $('[name="client_id"]').val();
  var reasonval = $('#reason_reject').val();
  var reasontext = $('#reason_text_reject').val().trim();
  
 
  if($('#responce').val() =='')
  {
		    $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
  }	else if(reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
	   
	  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
	  return false;	
	}
  else
  {
	  
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
  
     url = SurveyView.base_url + "survey/"+client_id+"/ApproveStatusTestimonial/rej";
     
     // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#testimonial-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
        	
           // if success close modal and reload ajax table
           $('#edittestimonial').modal('hide');
           dataTableAjaxReload();
           data.statusText="Testinomial Reject Status Updated Successfull";
           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
           setTimeout(function() {
      			$('#ajaxResults').removeClass('alert alert-success').html('');
      			}, 2000);
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
  }
}


function saveRevertTestimonial(flag)
{
	var url;
	  client_id =  $('[name="client_id"]').val(); 
	  var reasonval = $('#reason').val();
	  var reasontext = $('#reason_text').val().trim();
	 	 
	  if($('#responce').val() =='')
	  {
			$('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
	  }	else if(flag == 0 && reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
		  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
		  return false;	
		}
	  else
	  {
		  
	    Custom.hideMessages();
	    $('#survey').css('border', '');
	    $('#type').css('border', '');
	    $('#reason_error').removeClass('alert alert-error').html('');
	    
	     url = SurveyView.base_url + "survey/"+client_id+"/updateTestimonial/revert";
	    
	     // ajax adding data to database
	      $.ajax({
	        url : url,
	        type: "POST",
	        data: $('#testimonial-form').serialize(),
	        dataType: "JSON",
	        success: function(data)
	        {
	        	
	           // if success close modal and reload ajax table
	           $('#edittestimonial').modal('hide');
	           dataTableAjaxReload();
	           data.statusText="Testimonial revert status updated successfully";
	           $('#ajaxResults').addClass('alert alert-success').html(data.statusText);
	           setTimeout(function() {
	       			$('#ajaxResults').removeClass('alert alert-success').html('');
	       			}, 2000);
	        },
	        error: function ()
	        {
	          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
	        }
	    });
	  }
}


function saveRevertapproveTestimonial(flag)
{
	var url;
	  client_id =  $('[name="client_id"]').val(); 
	  var reasonval = $('#reason').val();
	  var reasontext = $('#reason_text').val().trim();
	 
	 
	  if($('#responce').val() =='')
	  {
			$('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
	  }	else if(flag == 0 && reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
		   
		  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
		  return false;	
		}
	  else
	  {
		  
	    Custom.hideMessages();
	    $('#survey').css('border', '');
	    $('#type').css('border', '');
	    $('#reason_error').removeClass('alert alert-error').html('');
	  
	     url = SurveyView.base_url + "survey/"+client_id+"/ApproveStatusTestimonial/revert";
	      // ajax adding data to database
	      $.ajax({
	        url : url,
	        type: "POST",
	        data: $('#testimonial-form').serialize(),
	        dataType: "JSON",
	        success: function(data)
	        {
	           // if success close modal and reload ajax table
	           $('#edittestimonial').modal('hide');
	           dataTableAjaxReload();
	           data.statusText="Testimonial revert status updated successfully";
	           $('#ajaxResults').addClass('alert alert-success').html(data.statusText);
	           setTimeout(function() {
	       			$('#ajaxResults').removeClass('alert alert-success').html('');
	       			}, 2000);
	        },
	        error: function ()
	        {
	          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
	        }
	    });
	  }
}

/* ==================== End Reason for Edit comment ============= */

/*
 * ================================Display Reason Edit Info
 * ======================================
 */
function showeditreason(editReasonValue,editOtherReason){
	
	
	var html = '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Reason:</b> '+ editReasonValue+'</div>';
	if(editOtherReason != 'null' && editOtherReason != '')
		html += '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Comment:</b> '+ editOtherReason+'</div>';
	
	$("#showeditreasontext").html(html);
	
	Testinomialscrollhidden();
	
}


function showrejectreason(rejectreasonvalue,rejectotherreasonvalue){
						
	var html = '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Reason:</b> '+ rejectreasonvalue+'</div>';
	if(rejectotherreasonvalue != 'null' && rejectotherreasonvalue !='')
		html += '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Comment:</b> '+ rejectotherreasonvalue+'</div>';
	$("#showrejectreasontext").html(html);
	
	Testinomialscrollhidden();
}
/*
 * ================================End of Display Reason Reject
 * Info================================
 */

function Testinomialscrollhidden()
{
	$('body').css('overflow','hidden');
	$('body').css('position','fixed');
}

function Testinomialscrollshow()
{
	$('body').css('overflow-y','scroll');
	$('body').css('position','relative');
}

/*
 * ===============Calendar to be displayed on textbox when click of Calendar
 * icon=======================
 */	
$('.input-group').find('.start_date').on('click', function(){
    $('#start_date').trigger('focus');
});

$('.input-group').find('.end_date').on('click', function(){
    $('#end_date').trigger('focus');
});
$('.input-group').find('.estart_date').on('click', function(){
    $('#estart_date').trigger('focus');
});

$('.input-group').find('.eend_date').on('click', function(){
    $('#eend_date').trigger('focus');
});
$('.input-group').find('.rstart_date').on('click', function(){
    $('#rstart_date').trigger('focus');
});

$('.input-group').find('.rend_date').on('click', function(){
    $('#rend_date').trigger('focus');
});

$('.input-group').find('.apl_start_date').on('click', function(){
    $('#apl_start_date').trigger('focus');
});

$('.input-group').find('.apl_end_date').on('click', function(){
    $('#apl_end_date').trigger('focus');
});
/*
 * ===============Calendar to be displayed on textbox when click of Calendar
 * icon====================
 */

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function getDataTable(cid,pid)
{
	$('.physician-list').dataTable(
			{
								serverSide : true,
								bLengthChange : false,
								bAutoWidth : false,
								bProcessing : false,
								searching: false,
								bDestroy: true,
								iDisplayLength : 50,
								sAjaxDataProp : "data.responseData",
								"language": {
								      "emptyTable": "No data available to display"
								    },
								ajax : {
									url : SurveyView.base_url
											+ "survey/"+cid+"/list-ajax-physician/"+pid,
									type : 'POST',
								dataType : 'json',
								data: {
									physicianFilter:  JSON.stringify($('#physician-filter-form').serializeObject())
								},
								
								beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
								error : function() {
									Custom
											.showMessages(
													"error",
													"An error occurred",
													[ "Sorry, there is an error processing your request. Please try again later" ]);
								}
							},
						       "rowCallback": function( row, data, index ) {
						        var ddoc = data.document_id;
						        var docG = data.documentGroup;
						                 if(docG == 0){
						                     $(row).removeClass('myodd myeven');
						                     $(row).addClass('myodd');
						                 }else if(docG == 1){
						                     $(row).removeClass('myodd myeven');
						                      $(row).addClass('myeven');
						                 }
						               },
							aoColumns : [
											{
												"mData" : "surveyDate",
												"mRender" : function(data, type, full) {
													//if((full.editcomment == true) && (full.appealFlag == 0))
													if((full.manageApproveReject == true) && (full.appealFlag == 0))
													{
														var html = '<span ><input style="margin-left:7px" type="checkbox" name="optionsRadios2"' +
														'id="check-box-each"' +
														'class="check-box-each1 check-box-alert-each delete-checkbox-' + data + '"' +
														'value="' + full.contentId + '" document-id="' + full.document_id+'"/></span>';
													}
													else
													{
														var html = '';
													}	
													return html;
												},
												 "sWidth": "2%",
												 "orderable": false
											},
											{
								             "mData" : "contentId",
								             "contentId" : "contentId",
								             "sClass" : "content-top-new",
								             "sWidth": "10%",
								             "orderable": false
									        },
								            {
								             "mData" : "ratings",
								             "ratings" : "Ratings",
								             "sClass" : "content-top-new",
								             "sWidth": "19%",
								             "orderable": false
								            },
								            {
								             "mData" : "response",
								             "sClass" : "content-top-new",
								             "mRender" : function(data, type, full) {
								            	 	
								            	 	//$('.survey-testimonial').attr('data-qinfo', JSON.stringify(full.questionsInfo));  && (full.status== 0)
								            	 	var html = ''+data+'&nbsp;<br><a href="#surveytestimonial" class="survey-testimonial sqi" data-toggle="modal">[Survey Response]</a>&nbsp;<a href="#commentHistory" class="commentHistoryLink" id="commentHistoryLink" data-toggle="modal">[Comment History]</a>';
								            	 	
								            	 	if((full.editcomment == true) && (full.appealFlag == 0))
								            	 		html += '<a title="Edit" data-toggle="modal" data-doc_value="'+full.document_id+'" data-doc_value1="'+cid+'"  testimonial-id='+full.responseId+'  href="#edittestimonial" class="edit-testimonial pull-right edit_icon_padding" data-backdrop="static" data-keyboard="false"><i class="fa fa-pencil-square-o  fa-2x"></i></a>';
								            	 	else
								            	 		html += '';
								            	 	/*if((full.editcomment == true) && (full.appealFlag!= 0 || full.status == 0 || full.appealStatus== 1))
								            	 	 html += '<a title="Edit" data-toggle="modal" data-doc_value="'+full.document_id+'" data-doc_value1="'+cid+'"  testimonial-id='+full.responseId+'  href="#edittestimonial" class="edit-testimonial pull-right edit_icon_padding" data-backdrop="static" data-keyboard="false"><i class="fa fa-pencil-square-o  fa-2x"></i></a>';
								            	 	else
								            	 	 html += '';
								            	 		*/ 
								            	 	if((full.editedTime == null))
													{
														html += '';
													}
													else
													{
														var EditReason='';
														if(full.editedToDate !='null' && full.editedToDate !='' && full.editReasonValue =='Other'){
															EditReason = "<a href='#showEditReason' onclick='showeditreason(\"" + full.editReasonValue + "\",\"" + full.editOtherReason + "\")' editreasonvalue-id='"+full.editReasonValue+"' editOtherReasonvalue-id='"+full.editOtherReason+"' class='edit-reason-show' data-toggle='modal' data-backdrop='static' data-keyboard='false' style='font-weight:bold;'>"+ full.editReasonValue +"</a>";
														}else{
															EditReason = ""+ full.editReasonValue +"";
														}															
														html += '<br><span style="font-weight:bold;font-size:12px;">Edited by:</span> <span class="edit_content_text">'+full.editedBy+'</span>&nbsp;<br><span class="edit_content_text"><span style="font-weight:bold;font-size:12px;">Reason</span>: '+ EditReason +'</span>&nbsp;<br><span class="edit_content_text"> '+full.editedTime+'</span>';
														//html += '<table><tr ><td style="border: 0px solid #eff3f8;" align="left" height="4">Edited by</td><td  style="border: 0px solid #eff3f8;" height="4"><span style="color:orange;margin-left:2px;">'+full.reviewedBy+'</span></td></tr><tr><td colspan=2><span style="color:orange">'+full.editedTime+'</span></td></tr></table>';
														//html += "<div style='border:1px solid red;'>Edited by :"+full.reviewedBy+"</div>";
													}
													
													
													return html;
												},
												//"sWidth" : "40%",
												 "orderable": true
								            },
								            {
								             "mData" : "surveyDate",
								             "Date" : "Date",
								             "mRender" : function(data, type, full) {
										          var html = '<table><tr><td style="border: 0px solid #eff3f8;padding-top:0px" align="top">'+full.surveyDate+'</td></tr></table>'; 
									              return html;
									             },
									         "sWidth": "11%",
									         "sClass" : "content-top-new",
								             "orderable": true
								            },
								            {
									             "mData" : "flagged",
									             "flagged" : "flagged",
									             "mRender" : function(data, type, full) {
									            	 if(full.flagged == 0)
								            		 {
									            		 var updated_flag = full.flagged+1;
									            		 var nextflag = "Click to set Flagged";
									            		 var html = '<a href="#1" id="flagswitch" contID="'+full.contentId+'" flagValue = "'+updated_flag+'"  ><span class="glyphicon  glyphicon-flag fa-2x flag-color"  title="'+nextflag+'"></span></a>';
								            		 }
									            	 else if(full.flagged == 1)
									            	 {
									            		 var updated_flag = full.flagged+1;
									            		 var nextflag = "Click to set Completed";
									            		 var html = '<a href="#1" id="flagswitch" contID="'+full.contentId+'" flagValue = "'+updated_flag+'"  ><span class="glyphicon  glyphicon-flag fa-2x flag-color-red" title="'+nextflag+'"></span></a>';
									            	 }
									            	 else if(full.flagged == 2)
									            	 {
									            		 var updated_flag = full.flagged-2;
									            		 var nextflag = "Click to set Unflagged";
									            		 var html = '<a href="#1" id="flagswitch" contID="'+full.contentId+'" flagValue = "'+updated_flag+'" ><span class="glyphicon  glyphicon-ok fa-2x flag-color-tick" title="'+nextflag+'"></span></a>';
									            	 }
									            	 
										              return html;
										             },
									             "sWidth": "4%",
									             "sClass" : "content-top-new",
									             "orderable": true
									        },
								            {
									             "mData" : "profanity",
									             "profanity" : "profanity",
									             "mRender" : function(data, type, full) {
									            	 if((full.phi == true) || (full.profanity == true))
								            		 {
									            		 var html = '<span class="yes_phi">YES</span>';
								            		 }
									            	 else
								            		 {
									            		 var html = '<span class="No_phi">NO</span>';
								            		 }
										              return html;
										             },
									             "sWidth": "6%",
									             "sClass" : "content-top-new",
									             "orderable": true
									        },
								            {
									             "mData" : "reviewed",
									             "reviewed" : "reviewed",
									             "sWidth": "19%",
									             "sClass" : "content-top-new",
									             "orderable": false
									        }
										 ],
											"drawCallback": function(settings){
												
												//Getting the value of ShowRatings from ajax data source.
												var ratingsDisplay = false;
												ratingsDisplay = settings.json.data.ShowRatings;
												
												if(ratingsDisplay === false)
												{
													$('table.physician-list thead').find("tr th").each(function(){
														if($(this).text() === "Ratings")
														{
															$(this).hide();
														}
													});
													$('table.physician-list tbody').find("tr td:nth-child(3)").each(function(){$(this).remove()});
												}
												else if(ratingsDisplay === true)
												{
													$('table.physician-list thead').find("tr th").each(function(){
														if($(this).text() === "Ratings")
														{
															$(this).show();
														}
													});
												}
												
											}
						});
	
	
	
}

function questionsInfoDataTable(documentId, sourceId)
{
	
	$('.questions-list').dataTable(
	{
		
		serverSide : false,
		bLengthChange : false,
		bProcessing : false,
		searching: false,
		bDestroy: true,
		iDisplayLength : 50,
		"language": {
		      "emptyTable": "No data available to display"
		    },
		ajax : {
			url : SurveyView.base_url
					+ "survey/surveyResponse",
			type : 'POST',
		dataType : 'json',
		data: {
			docId: documentId,
			sourceId: sourceId
		},
		
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
						"mData" : "PGQuestionId",
						"PGQuestionId" : "PG Question Id",
						 "orderable": true
					},
		           /*
					 * { "mData" : "BFQuestionId", "BFQuestionId" : "Question
					 * Id", "orderable": true },
					 */
		            {
		            	"mData" : "QuestionName",
					 	"QuestionName" : "Question Label",
					 	"orderable": true
		            },
		            {
		            	"mData" : "Response",
					 	"Response" : "Response",
					 	"orderable": true
		            }
		            
				 ]
	
        
    });	
}

function commentHistoryDataTable(contentId)
{
	
	$('.commentHistoryTable').dataTable(
	{
		
		serverSide : true,
		bLengthChange : false,
		bProcessing : false,
		searching: false,
		bDestroy: true,
		iDisplayLength : 50,
		aaSorting : [],
		"language": {
		      "emptyTable": "No data available to display"
		    },
		ajax : {
			url : SurveyView.base_url
					+ "survey/commentHistory",
			type : 'POST',
		dataType : 'json',
		data: {
			contentId: contentId
		},
		
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
						"mData" : "historyRow",
						 "orderable": false
					}
		            
				 ]
	    
    });	
}


var Physician = function() {
	
	return {
		home : function(cid,pid) {
			
		   $("#warning").select2({
		        allowClear: false,
		        closeOnSelect: true
		   });
			
		   $("#status").select2({
			   allowClear: false,
		       closeOnSelect: true
		   });
		   
		   $("#editedreason").select2({
			   allowClear: false,
		       closeOnSelect: true
		   });
		   
		   $("#editedby").select2({
			   allowClear: false,
		       closeOnSelect: true
		   });
		   
		   $("#rejectreason").select2({
			   allowClear: false,
		       closeOnSelect: true
		   });
		   
		   $("#reviewby").select2({
			   allowClear: false,
		       closeOnSelect: true
		   });
		   
		   $("#appealby").select2({
		        allowClear: false,
		        closeOnSelect: true
		   });
		   
		   var commentHistoryModal = $('#commentHistory');
		   
		   commentHistoryModal.on('show.bs.modal', function(){
				$('body').css('overflow-y','hidden');
				$('body').css('position','fixed');
			});

		   commentHistoryModal.on('hide.bs.modal', function(){
				$('body').css('overflow-y','scroll');
				$('body').css('position','relative');
			});
			
			$(getDataTable(cid,pid));
			
			$('#physician_filter').click(function( event )
			{
				if($('#physician-filter-form').valid())
				{
					$('#ajaxResults').removeClass('alert alert-success').html('');
					$('#ajaxResults').removeClass('alert alert-error').html('');
					getDataTable(cid,pid);
				}
			});
			
			
			/*
			 * $.validator.addMethod("greaterThan", function(value, element,
			 * params) {
			 * 
			 * if (!/Invalid|NaN/.test(new Date(value))) { return new
			 * Date(value) > new Date($(params).val()); }
			 * 
			 * return isNaN(value) && isNaN($(params).val()) || (Number(value) >
			 * Number($(params).val())); },'Must be greater than {0}.')
			 */

			$('#physician-filter-form')
					.validate(
							{
								errorElement : 'span',
								errorClass : 'help-block',
								onfocusout : function() {
								},
								groups : {
									names : "start_date end_date"
								},
								rules : {
									
									start_date : {
										date : true,
										require_from_group : {
											params : [ 1, ".send" ],
											depends : function(element) {
												// alert("End Date:
												// "+$('#end_date').val());
												return $('#end_date').val() == "";
											}
										}
									},
									end_date : {
										date : true,
										require_from_group : {
											params : [ 1, ".send" ],
											depends : function(element) {
												// alert("Start Date:
												// "+$('#start_date').val());
												return $('#start_date').val() == "";
											}
										}
									}

								},

								messages : {
									
									start_date : 'Start Date and End Date is required',
									end_date : 'Start Date and End Date is required'
								},
								invalidHandler : function(event, validator) {
									$('.alert-danger', $('#physician-filter-form'))
											.show();
								},

								highlight : function(element) { // hightlight
																// error inputs
									$(element).closest('.form-group').addClass(
											'has-error'); // set error class
															// to the control
															// group
								},

								success : function(label) {
									label.closest('.form-group').removeClass(
											'has-error');
									label.remove();
								},

								errorPlacement : function(error, element) {
									error.insertAfter(element
											.closest('.input-group'));
									// error.insertAfter(element.closest('.select2').next());
								},

								submitHandler : function(form) {
									if ($("div.identifydiv").children()
											.hasClass('has-error')) {
										$("div.identifydiv").children()
												.removeClass('has-error');
									}

									return false;

								}
							});
			/* =========================Form Validation ends================= */
			
			
			
			$("body").on("click", ".edit-testimonial", function(e)
			{
				$('#ajaxResults').removeClass('alert alert-success').html('');
				$('#ajaxResults').removeClass('alert alert-error').html('');
						e.preventDefault();
						
						oTable = $('.physician-list').dataTable();
						
						var row = $(this).parents("td")[0];
						var pos = oTable.fnGetPosition(row);
					    var data = oTable.fnGetData(pos[0]);
					    
					    var clientId = $(this).data("doc_value1");
					    $("#reason").select2();
						
						 var eurl = SurveyView.base_url + "survey/"+clientId+"/testimonial";
						
						
						 $.ajax({
							  url : eurl,
							  type : "POST",
							  datatype : "json",
							  data : 
							  {
								  testimonial_id : data,
								  clientId: clientId
							  },
							  success: function(data, statusMsg, jqXHR)
							  {
								  $('#showedittest').html(data.form);
								  Testinomialscrollhidden();
							  },
							  error : function(data, statusMsg, jqXHR) 
							  {
								  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
							  }
						
						 	});
					});
			
		
			
			
			$("#checkAll").change(function () {
			    $(".check-box-each1").prop('checked', $(this).prop("checked"));
			});
			
		
			$("body").on("click", ".approve_test", function(e)
			{
				$('#ajaxResults').removeClass('alert alert-success').html('');
				$('#ajaxResults').removeClass('alert alert-error').html('');
				
					if ($('.check-box-each1:checked').length > 0) 
					{
						$('#approveacknowledgement-form')[0].reset(); // reset
																		// form
																		// on
																		// modals
						$('#modal_ack_approv').modal('show');
						var approveCnt = $('.check-box-each1:checked').length;
						$('#shwcnt').text(approveCnt);
						$('#shwcnt_1').text(approveCnt);
						// Popup Scroll hidden and background scroll fixed.
						Testinomialscrollhidden();
						
						$("#uniform-iagree > span").removeClass ( 'checked' );
											
						
						
					}
					/*else if($('.check-box-each1:checked').length == 1)
					{
						var chkId = '';
						var DocId = '';
						
						 $('.check-box-each1:checked').each(function() {
						   chkId += $(this).val() + ",";
						   DocId += $(this).attr('document-id') + ",";
						 });
						 chkId = chkId.slice(0,-1);// Remove last comma
						 DocId = DocId.slice(0,-1);// Remove last comma
												
												 
						 var url = SurveyView.base_url + "survey/approve/";
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  contentid : chkId,
								  documentid : DocId
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							    if(json['statusCode'] == 200) {
							    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials Approved successfully!') ;
							    	  dataTableAjaxReload();
							          $("#uniform-checkAll > span").removeClass ( 'checked' );
							          $("#uniform-iagree > span").removeClass ( 'checked' );
							          setTimeout(function() {
							       			$('#ajaxResults').removeClass('alert alert-success').html('');
							       			}, 2000);
							          
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  setTimeout(function() {
						       			$('#ajaxResults').removeClass('alert alert-error').html('');
						       			}, 2000);
							  }
						  });
					}*/
			        else 
			        {
			        	$('#ajaxResults').addClass('alert alert-error').html('Please select atleast one testimonial') ;
			        	setTimeout(function() {
			       			$('#ajaxResults').removeClass('alert alert-error').html('');
			       			}, 2000);
			        }
				
						
			});
			
			$("body").on("click", ".reject_test", function(e)
			{
				$('#ajaxResults').removeClass('alert alert-success').html('');
				$('#ajaxResults').removeClass('alert alert-error').html('');
									
					if ($('.check-box-each1:checked').length > 0) 
					{
						var rejCnt = $('.check-box-each1:checked').length;
						$('#shwrejcnt').text(rejCnt);
						$('#rejectacknowledgement-form')[0].reset(); // reset
																		// form
																		// on
																		// modals
						$('#modal_ack_reject').modal('show');
						// Popup Scroll hidden and background scroll fixed.
						Testinomialscrollhidden();
						
						$("#uniform-iagree > span").removeClass ( 'checked' );
						
						
						
						
						
					}
					/*else if($('.check-box-each1:checked').length == 1)
					{
						var chkId = '';
						var DocId = '';
						
						 $('.check-box-each1:checked').each(function() {
						   chkId += $(this).val() + ",";
						   DocId += $(this).attr('document-id') + ",";
						 });
						 chkId = chkId.slice(0,-1);// Remove last comma
						 DocId = DocId.slice(0,-1);// Remove last comma
												
												 
						 var url = SurveyView.base_url + "survey/reject/";
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  contentid : chkId,
								  documentid : DocId
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							    if(json['statusCode'] == 200) {
							    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials rejected successfully!') ;
							    	  dataTableAjaxReload();
							          $("#uniform-checkAll > span").removeClass ( 'checked' );
							          $("#uniform-iagreerej > span").removeClass ( 'checked' );
							          setTimeout(function() {
							       			$('#ajaxResults').removeClass('alert alert-success').html('');
							       			}, 2000);
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  
							  }
						  });
					}*/
			        else 
			        {
			        	$('#ajaxResults').addClass('alert alert-error').html('Please select atleast one testimonial') ;
			        }
				
			});
			
			$( "#cancel_approveform" ).click(function() {
				// Popup Scroll normal and background scroll normal.
				Testinomialscrollshow();
				 $("#uniform-iagree > span").removeClass ( 'checked' );
		      	 $('#error-bubble').removeClass('alert alert-error').html('');
			});
			$( "#ackappclose" ).click(function() {
				// Popup Scroll normal and background scroll normal.
				Testinomialscrollshow();
				 $("#uniform-iagree > span").removeClass ( 'checked' );
		      	 $('#error-bubble').removeClass('alert alert-error').html('');
			});
			
			$( "#cancel_rejectform" ).click(function() {
				// Popup Scroll normal and background scroll normal.
				Testinomialscrollshow();
		      	 $('#error-reject').removeClass('alert alert-error').html('');
		      	$("#uniform-iagreerej > span").removeClass ( 'checked' );
		      	$('#edit_reason_textbox_reject_multiple').css('display','block');
		      	
			});
			
			$( "#ackrejclose" ).click(function() {
				// Popup Scroll normal and background scroll normal.
				 Testinomialscrollshow();
				 $("#uniform-iagreerej > span").removeClass ( 'checked' );
		      	 $('#error-reject').removeClass('alert alert-error').html('');
		      	$('#edit_reason_textbox_reject_multiple').css('display','block');
			});
			
			
			$( "#approve_form" ).click(function() {
				var iagree = $("#iagree").prop("checked");
				
				if(iagree == true)
				{
													
					var chkId = '';
					var DocId = '';
					
					 $('.check-box-each1:checked').each(function() {
					   chkId += $(this).val() + ",";
					   DocId += $(this).attr('document-id') + ",";
					 });
					 chkId = chkId.slice(0,-1);// Remove last comma
					 DocId = DocId.slice(0,-1);// Remove last comma
											
											 
					 var url = SurveyView.base_url + "survey/approve/";
					  $.ajax({
						  url : url,
						  type : "POST",
						  data : {
							  contentid : chkId,
							  documentid : DocId
						  },
						  beforeSend: function(){
								Custom.showLoader();
							},
							complete: function(){
								Custom.hideLoader();
							},
					  }).done(function(json){
						    if(json['statusCode'] == 200) {
						    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials Approved successfully!') ;
						    	  dataTableAjaxReload();
						          $("#uniform-checkAll > span").removeClass ( 'checked' );
						          $("#uniform-iagree > span").removeClass ( 'checked' );
						          $('#modal_ack_approv').modal('hide');
						          $('#error-bubble').removeClass('alert alert-error').html('');
						          // Popup Scroll normal and
									// background scroll normal.
						          Testinomialscrollshow();
						      	setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-success').html('');
					       			}, 2000);
							  
						  } else{
							  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
							  setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-error').html('');
					       			}, 2000);
						  }
					  });
				}
				else
				{
					$('#error-bubble').addClass('alert alert-error').html('Please click on "I agree" if you wish to proceed.') ;
					setTimeout(function() {
		       			$('#error-bubble').removeClass('alert alert-error').html('');
		       			}, 2000);
				}
				
			});
			
			$( "#reject_form" ).click(function() {
				var iagreerej = $("#iagreerej").prop("checked");
				var reasonval = $('#reasonrejectmulti').val();
				var reasontext = $('#reason_text_reject_multiple').val().trim();
				
				 if(iagreerej == false)
				  {
							
					 $('#error-reject').addClass('alert alert-error').html('Please click on "I agree" if you wish to proceed.') ;
							return false;
				  }	else if(reasonval == 13 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
					   
					  $('#error-reject').addClass('alert alert-error').html('Please enter comment') ;
					  return false;	
					}
				  else{
					  $('#error-reject').removeClass('alert alert-error').html('');
					  
					  	var chkId = '';
						var DocId = '';
						
						 $('.check-box-each1:checked').each(function() {
						   chkId += $(this).val() + ",";
						   DocId += $(this).attr('document-id') + ",";
						 });
						 chkId = chkId.slice(0,-1);// Remove last
													// comma
						 DocId = DocId.slice(0,-1);// Remove last
													// comma
												
												 
						 var url = SurveyView.base_url + "survey/reject/";
						  $.ajax({
							  url : url,
							  type : "POST",
							  data : {
								  contentid : chkId,
								  documentid : DocId,
								  reviewReasonId: reasonval,
								  reviewOtherReason: reasontext,
								  multile:1
							  },
							  beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
						  }).done(function(json){
							    if(json['statusCode'] == 200) {
							    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials rejected successfully!') ;
							    	  dataTableAjaxReload();
							          $("#uniform-checkAll > span").removeClass ( 'checked' );
							          $("#uniform-iagreerej > span").removeClass ( 'checked' );
							          $('#modal_ack_reject').modal('hide');
							          $('#error-reject').removeClass('alert alert-error').html('');
							          $('#edit_reason_textbox_reject_multiple').css('display','block');
							          // Popup Scroll normal and
										// background scroll normal.
							          Testinomialscrollshow();
							      	setTimeout(function() {
						       			$('#ajaxResults').removeClass('alert alert-success').html('');
						       			}, 2000);
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  setTimeout(function() {
						       			$('#ajaxResults').removeClass('alert alert-error').html('');
						       			}, 2000);
								  
							  }
						  });
					  
				  }
	
			});
			
		/*
		 * ================================Generating Questions Info DataTable======================================
		 */			
			$("body").on("click", ".survey-testimonial, .commentHistoryLink", function(e)
			{
				var oTable = $('.physician-list').dataTable();
				var row = $(this).parents("td")[0];
				var pos = oTable.fnGetPosition(row);
				if(e.currentTarget.id === 'commentHistoryLink')
				{
					var contentId = oTable.fnGetData(pos[0])['contentId'];
					commentHistoryDataTable(contentId);
				}
				else
				{
					var docId = oTable.fnGetData(pos[0])['document_id'];
					var sourceId = oTable.fnGetData(pos[0])['sourceId'];
			    
					// Generating Questions Info datatable.
					questionsInfoDataTable(docId, sourceId);
					Testinomialscrollhidden();
				}
			});
			/*
			 * ================================End of Generating Questions Info
			 * Data Table================================
			 */
			
			/*
			 * ================================Cancel Questions Info Data
			 * Table======================================
			 */			
			$("body").on("click", ".close", function(e)
			{
				Testinomialscrollshow();
			});
			/*
			 * ================================End of Cancel Generating
			 * Questions Info Data Table================================
			 */
			
			/* ==================== Reason for Edit comment ============= */
			
			$('#reason').select2({
		        allowClear: true
			   });
			
			
			/* ===================Flag switch =============================*/
			$("body").on("click", "#flagswitch", function()
			{
				//alert('FlagSwitch --');
				var contId = $(this).attr('contId');
				//alert(contId);
				var fValue = $(this).attr('flagValue');
				//alert(fValue);
				
				var url = SurveyView.base_url + "survey/testinomialflag";
				  $.ajax({
					  url : url,
					  type : "POST",
					  data : {
						  contentId : contId,
						  flagValue : fValue
					  },
					  beforeSend: function(){
							Custom.showLoader();
						},
						complete: function(){
							Custom.hideLoader();
						},
				  }).done(function(json){
					    if(json['statusCode'] == 200) {
					    	 //alert(json['flagValue']);
					    	 if(fValue == 0)
					    		 var f_value = "Unflagged";
					    	 else if(fValue == 1)
					    		 var f_value = "Flagged";
					    	 else if(fValue == 2)
					    		 var f_value = "Completed";
					    	 else
					    		 var f_value = "";
					    	  
					    	  //$('#ajaxResults').addClass('alert alert-success').html('Flag changed to '+f_value+' status successfully!');
					    	  setTimeout(function() {
					       			$('#ajaxResults').removeClass('alert alert-success').html('');
					       			}, 2000);
					    	  dataTableAjaxReload();
					          
						  
					  } else{
						  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
						  
					  }
				  });
								
			});	
			
			
			$("body").on("click", "#coupon_question", function()
					{	
						//alert('checkbox');
						
						    if($(this).is(":checked")) {
						        $("#answer").show();
						        $("#reasondropdwon").show();
						        $("#reasonComment").show();
						    } else {
						    	$('#custom_edit').removeClass('alert alert-error').html('');
						        $("#answer").hide();
						        $("#reasondropdwon").hide();
						        $("#reasonComment").hide();
						    }
						
					});
			
			
			
		}
	}
}();
