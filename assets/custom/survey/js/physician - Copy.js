$(document).ready(function() {
$("input:text,form").attr("autocomplete","off");
});

// show Reject Reason popup

function ShowrejectPopup(contId,DocId,Status,ReasonId,OtherReason){
	
	
	save_method = 'reject';
	//$('#rejectreason-form')[0].reset(); // reset form on modals
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

//show Approve Reason popup

function ShowapprovePopup(contId,DocId,Status,ReasonId,OtherReason){
	
	//alert('yash');
	save_method = 'approve';
	//$('#rejectreason-form')[0].reset(); // reset form on modals
	$('#ApproveReasonpopup').modal('show'); 
	$("#reasonapprove").select2();
	
	 var eurl = SurveyView.base_url + "survey/approvereason";
	 
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
			  $('#showapprovereason').html(data.approvereason);
			  Testinomialscrollhidden();
		  },
		  error : function(data, statusMsg, jqXHR) 
		  {
			  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
		  }
	
	 	});
	
}


function ApproveTestimonialReason(contentid,documentid){
	
	var reasonval = $('#reasonapprove').val();
	var reasontext = $('#reason_text_approve').val().trim();
	//var contentid = $('#contentid').val();
	//var documentid = $('#documentid').val();
	
	
	if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
				   
		  $('#reason_error_approve').addClass('alert alert-error').html('Please enter comment') ;
		  return false;	
		}
	  else
	  {
		  $('#reason_error_approve').removeClass('alert alert-error').html('');
			 var url = SurveyView.base_url + "survey/approve/";
		
		  $.ajax({
			  url : url,
			  type : "POST",
			  data : {
				  contentid : contentid,
				  documentid : documentid,
				  editReasonId : reasonval,
				  editOtherReason : reasontext
				  
			  },
			  beforeSend: function(){
					Custom.showLoader();
				},
				complete: function(){
					Custom.hideLoader();
				},
		  }).done(function(json){
			 
				 
				  if(json['statusCode'] == 200) {
					  $('#ApproveReasonpopup').modal('hide');
					  Testinomialscrollshow();
			    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials approved successfully!') ;
			    	  var table = $('#physicians-list').DataTable();
			          table.ajax.reload();
				  
				  } else{
					  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
					  
				  }
			
			    
		  });
		  
	  }
	
}

function ApproveTestimonial(contId,DocId,Status)
{
	$('#ajaxResults').removeClass('alert alert-success').html('');
	$('#ajaxResults').removeClass('alert alert-error').html('');
	//alert(contId);alert(DocId);alert(Status);
	if(Status == 1)
	{
		var url = SurveyView.base_url + "survey/approve/";
	}
	else if(Status == 2)
	{
		 var url = SurveyView.base_url + "survey/reject/";
	}
	//alert(url);
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
		    	  var table = $('#physicians-list').DataTable();
		          table.ajax.reload();
			  
			  }else{
				  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
				  
			  }
		  }
		  else if(Status == 2)
		  {
			  if(json['statusCode'] == 200) {
		    	  $('#ajaxResults').addClass('alert alert-success').html('Selected testimonials rejected successfully!') ;
		    	  var table = $('#physicians-list').DataTable();
		          table.ajax.reload();
			  
			  } else{
				  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
				  
			  }
		  }
		    
	  });
}


function reasonchangereject(){
	
var reasonval = $('#reasonreject').val();
	
	if(reasonval == 9){
		$('#edit_reason_textbox_reject').css('display','block');
		$('#edit_reason_textbox').show();
	}else{
		$('#edit_reason_textbox').hide();
		$('#edit_reason_textbox_reject').css('display','none');
		$('#reason_error_reject').removeClass('alert alert-error').html('');
	}
}

function reasonchangeapprove(){
	
	var reasonval = $('#reasonapprove').val();
		
		if(reasonval == 9){
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
	
	
	if(reasonval == 9){
		$('#reject_reason_textbox').show();
	}else{
		$('#reject_reason_textbox').hide();
		$('#reason_error').removeClass('alert alert-error').html('');
	}
}

function reasonchange(){
	var reasonval = $('#reason').val();
	
	if(reasonval == 9){
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
  //alert(reasontext);
 
  if($('#responce').val() =='')
  {
			//alert('test');
           $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
  }	else if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
	   
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
     //alert(url);
   // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#testimonial-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
        	//alert(data);
           //if success close modal and reload ajax table
           $('#edittestimonial').modal('hide');
           var table = $('#physicians-list').DataTable();
           table.ajax.reload();
           data.statusText="Testimonial response updated successfully";
           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
      
}    
}




function saveApproveTestimonial()
{

  var url;
  client_id =  $('[name="client_id"]').val(); 
  var reasonval = $('#reason').val();
  var reasontext = $('#reason_text').val().trim();
  //alert(reasontext);
 
  if($('#responce').val() =='')
  {
			//alert('test');
           $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
  }	else if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
	   
	  $('#reason_error').addClass('alert alert-error').html('Please enter comment') ;
	  return false;	
	}
  else
  {
	  
    Custom.hideMessages();
    $('#survey').css('border', '');
    $('#type').css('border', '');
    $('#reason_error').removeClass('alert alert-error').html('');
	 
		     url = SurveyView.base_url + "survey/"+client_id+"/ApproveStatusTestimonial/app";
		     //alert(url);
		     // ajax adding data to database
		      $.ajax({
		        url : url,
		        type: "POST",
		        data: $('#testimonial-form').serialize(),
		        dataType: "JSON",
		        success: function(data)
		        {
		        	//alert(data);
		           //if success close modal and reload ajax table
		           $('#edittestimonial').modal('hide');
		           var table = $('#physicians-list').DataTable();
		           table.ajax.reload();
		           data.statusText="Testimonial approval status updated successfully";
		           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
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
	//var contentid = $('#contentid').val();
	//var documentid = $('#documentid').val();
	
		
	if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
				   
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
			    	  var table = $('#physicians-list').DataTable();
			          table.ajax.reload();
				  
				  } else{
					  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
					  
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
  $('#reject_reason_dropdown').css('display','block');
  $('#edit_reason_dropdown').css('display','none');
  $('#edit_reason_textbox').css('display','none');
  $('#reason_type_reject').val(2);
  $('[id="reason_type_reject"]').val(2);
  

 
  if($('#responce').val() =='')
  {
			//alert('test');
           $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
			return false;
  }	else if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
	   
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
     //alert(url);
     // ajax adding data to database
      $.ajax({
        url : url,
        type: "POST",
        data: $('#testimonial-form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
        	//alert(data);
           //if success close modal and reload ajax table
           $('#edittestimonial').modal('hide');
           var table = $('#physicians-list').DataTable();
           table.ajax.reload();
           data.statusText="Testinomial Reject Status Updated Successfull";
           $('#ajaxResults').addClass('alert alert-success').html(data.statusText) ;
        },
        error: function ()
        {
          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
        }
    });
  }
}


function saveRevertTestimonial()
{
	var url;
	  client_id =  $('[name="client_id"]').val(); 
	  var reasonval = $('#reason').val();
	  var reasontext = $('#reason_text').val().trim();
	  //alert(reasontext);
	 
	  if($('#responce').val() =='')
	  {
				//alert('test');
	           $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
				return false;
	  }	else if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
		   
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
	     //alert(url);
	     // ajax adding data to database
	      $.ajax({
	        url : url,
	        type: "POST",
	        data: $('#testimonial-form').serialize(),
	        dataType: "JSON",
	        success: function(data)
	        {
	        	//alert(data);
	           //if success close modal and reload ajax table
	           $('#edittestimonial').modal('hide');
	           var table = $('#physicians-list').DataTable();
	           table.ajax.reload();
	           data.statusText="Testimonial revert status updated successfully";
	           $('#ajaxResults').addClass('alert alert-success').html(data.statusText);
	        },
	        error: function ()
	        {
	          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
	        }
	    });
	  }
}

function saveRevertapproveTestimonial()
{
	var url;
	  client_id =  $('[name="client_id"]').val(); 
	  var reasonval = $('#reason').val();
	  var reasontext = $('#reason_text').val().trim();
	  //alert(reasontext);
	 
	  if($('#responce').val() =='')
	  {
				//alert('test');
	           $('#customm_test').addClass('alert alerttestimonial-error').html('Please enter testimonial response') ;
				return false;
	  }	else if(reasonval == 9 && (reasontext =='' || reasontext == null || reasontext.lenght ==0)){
		   
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
	    // alert(url);
	     // ajax adding data to database
	      $.ajax({
	        url : url,
	        type: "POST",
	        data: $('#testimonial-form').serialize(),
	        dataType: "JSON",
	        success: function(data)
	        {
	        	//alert(data);
	           //if success close modal and reload ajax table
	           $('#edittestimonial').modal('hide');
	           var table = $('#physicians-list').DataTable();
	           table.ajax.reload();
	           data.statusText="Testimonial revert status updated successfully";
	           $('#ajaxResults').addClass('alert alert-success').html(data.statusText);
	        },
	        error: function ()
	        {
	          Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
	        }
	    });
	  }
}

/*==================== End Reason for Edit comment =============*/

/*================================Display Reason Edit  Info ======================================*/
function showeditreason(editReasonValue,editOtherReason){
	
	
	var html = '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Reason:</b> '+ editReasonValue+'</div>';
	if(editOtherReason != 'null' && editOtherReason != '')
		html += '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Comment:</b> '+ editOtherReason+'</div>';
	
	$("#showeditreasontext").html(html);
	
    $('body').css('overflow','hidden');
	$('body').css('position','fixed');
	
}


function showrejectreason(rejectreasonvalue,rejectotherreasonvalue){
						
	var html = '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Reason:</b> '+ rejectreasonvalue+'</div>';
	if(rejectotherreasonvalue != 'null' && rejectotherreasonvalue !='')
		html += '<div class="col-md-12 col-sd-12 col-xs-12 phyname_pop"><b>Comment:</b> '+ rejectotherreasonvalue+'</div>';
	$("#showrejectreasontext").html(html);
	
    $('body').css('overflow','hidden');
	$('body').css('position','fixed');
}
/*================================End of Display Reason Reject  Info================================*/

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

/*===============Calendar to be displayed on textbox when click of Calendar icon=======================*/	
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
/*===============Calendar to be displayed on textbox when click of Calendar icon====================*/

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
								bProcessing : false,
								searching: false,
								bDestroy: true,
								iDisplayLength : 50,
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
								/*success: function(data, textMessage, jqXHR)
								  {
									alert(data+textMessage+jqXHR);
								  },*/
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
							
							aoColumns : [
											{
												"mData" : "surveyDate",
												"mRender" : function(data, type, full) {
													var html = '<span ><input style="margin-left:7px" type="checkbox" name="optionsRadios2"' +
													'id="check-box-each"' +
													'class="check-box-each1 check-box-alert-each delete-checkbox-' + data + '"' +
													'value="' + full.contentId + '" document-id="' + full.document_id+'"/></span>';
													
													return html;
												},
												 "sWidth": "2%",
												 "orderable": false
											},
								            {
								             "mData" : "ratings",
								             "ratings" : "Ratings",
								             "sWidth": "19%",
								             "orderable": true
								            },
								            {
								             "mData" : "response",
								             "mRender" : function(data, type, full) {
								            	 
								            	 	//$('.survey-testimonial').attr('data-qinfo', JSON.stringify(full.questionsInfo));
								            	 	var html = ''+data+'&nbsp;<br><a href="#surveytestimonial" class="survey-testimonial sqi" data-toggle="modal">[Survey Response]</a>&nbsp;';
								            	 	
								            	 	if(full.editrole == true)
								            	 	 html += '<a title="Edit" data-toggle="modal" data-doc_value="'+full.document_id+'" data-doc_value1="'+cid+'"  testimonial-id='+full.responseId+'  href="#edittestimonial" class="edit-testimonial pull-right edit_icon_padding" data-backdrop="static" data-keyboard="false"><i class="fa fa-pencil-square-o  fa-2x"></i></a>';
								            	 	else
								            	 	 html += '';
								            	 		 
								            	 	if((full.editedTime == null))
													{
														html += '';
													}
													else
													{
														var EditReason='';
														if(full.editedToDate !='null' && full.editedToDate !='')
															EditReason = "<a href='#showEditReason' onclick='showeditreason(\"" + full.editReasonValue + "\",\"" + full.editOtherReason + "\")' editreasonvalue-id='"+full.editReasonValue+"' editOtherReasonvalue-id='"+full.editOtherReason+"' class='edit-reason-show reason-text' data-toggle='modal' data-backdrop='static' data-keyboard='false'>("+ full.editReasonValue +")</a>";
																													
														html += '<br><span style="font-weight:bold;font-size:12px;">Edited by '+ EditReason +' :</span> <span class="edit_content_text">'+full.editedBy+'</span>&nbsp;<span class="edit_content_text"> '+full.editedTime+'</span>';
														//html += '<table><tr ><td style="border: 0px solid #eff3f8;" align="left" height="4">Edited by</td><td  style="border: 0px solid #eff3f8;" height="4"><span style="color:orange;margin-left:2px;">'+full.reviewedBy+'</span></td></tr><tr><td colspan=2><span style="color:orange">'+full.editedTime+'</span></td></tr></table>';
														//html += "<div style='border:1px solid red;'>Edited by :"+full.reviewedBy+"</div>";
													}
													
													
													return html;
												},
												 "orderable": true
								            },
								            {
								             "mData" : "surveyDate",
								             "Date" : "Date",
								             "mRender" : function(data, type, full) {
										          var html = '<table><tr><td style="border: 0px solid #eff3f8;" align="center">'+full.surveyDate+'</td></tr></table>'; 
									              return html;
									             },
									         "sWidth": "15%",
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
									             "orderable": true
									        },
								            {
									             "mData" : "reviewed",
									             "reviewed" : "reviewed",
									             "sWidth": "15%",
									             "orderable": true
									        }
										 ]
						});
	
	
	
}

function questionsInfoDataTable(documentId)
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
			docId: documentId  
		},
		/*success: function(data, textMessage, jqXHR)
		  {
			alert(data+textMessage+jqXHR);
		  },
		beforeSend: function(){
			Custom.showLoader();
		},
		complete: function(){
			Custom.hideLoader();
		},*/
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
		           /* {
		             	"mData" : "BFQuestionId",
					 	"BFQuestionId" : "Question Id",
					 	"orderable": true
		            },*/
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

var Physician = function() {
	
	return {
		home : function(cid,pid) {
			//alert(cid);
			//alert(pid);
		   $("#warning").select2({
		        allowClear: true
		   });
			
			$("#status").select2({
		        allowClear: true
		   });
			
			$(getDataTable(cid,pid));
			$('#physician_filter').click(function( event )
			{
				$('#ajaxResults').removeClass('alert alert-success').html('');
				$('#ajaxResults').removeClass('alert alert-error').html('');
				getDataTable(cid,pid);	
			});
			
			
			
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
				
					if ($('.check-box-each1:checked').length > 1) 
					{
						$('#modal_ack_approv').modal('show');
						var approveCnt = $('.check-box-each1:checked').length;
						$('#shwcnt').text(approveCnt);
						$('#shwcnt_1').text(approveCnt);
						//Popup Scroll hidden and background scroll fixed.
						$('body').css('overflow','hidden');
						$('body').css('position','fixed');
						
						$("#uniform-iagree > span").removeClass ( 'checked' );
						$( "#approve_form" ).click(function() {
							var iagree = $("#iagree").prop("checked");
							if(iagree == true)
							{
								//alert($('.check-box-each1:checked').length);
								
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
									    	  var table = $('#physicians-list').DataTable();
									          table.ajax.reload();
									          $("#uniform-checkAll > span").removeClass ( 'checked' );
									          $('#modal_ack_approv').modal('hide');
									          $('#error-bubble').removeClass('alert alert-error').html('');
									          //Popup Scroll normal and background scroll normal.
									          $('body').css('overflow-y','scroll');
									      	  $('body').css('position','relative');
										  
									  } else{
										  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
										  
									  }
								  });
							}
							else
							{
								$('#error-bubble').addClass('alert alert-error').html('Please click on "I agree" if you wish to proceed.') ;
							}
							
						});
						
						$( "#cancel_approveform" ).click(function() {
							//Popup Scroll normal and background scroll normal.
					          $('body').css('overflow-y','scroll');
					      	  $('body').css('position','relative');
						});
						$( "#ackappclose" ).click(function() {
							//Popup Scroll normal and background scroll normal.
					          $('body').css('overflow-y','scroll');
					      	  $('body').css('position','relative');
						});
						
					}
					else if($('.check-box-each1:checked').length == 1)
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
							    	  var table = $('#physicians-list').DataTable();
							          table.ajax.reload();
							          $("#uniform-checkAll > span").removeClass ( 'checked' );
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  
							  }
						  });
					}
			        else 
			        {
			        	$('#ajaxResults').addClass('alert alert-error').html('Please select atleast one testimonial') ;
			        }
				
						
			});
			
			$("body").on("click", ".reject_test", function(e)
			{
				$('#ajaxResults').removeClass('alert alert-success').html('');
				$('#ajaxResults').removeClass('alert alert-error').html('');
				
				
					if ($('.check-box-each1:checked').length > 1) 
					{
						var rejCnt = $('.check-box-each1:checked').length;
						$('#shwrejcnt').text(rejCnt);
						$('#modal_ack_reject').modal('show');
						//Popup Scroll hidden and background scroll fixed.
						$('body').css('overflow','hidden');
						$('body').css('position','fixed');
						
						$("#uniform-iagree > span").removeClass ( 'checked' );
						$( "#reject_form" ).click(function() {
							var iagreerej = $("#iagreerej").prop("checked");
							if(iagreerej == true)
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
									    	  var table = $('#physicians-list').DataTable();
									          table.ajax.reload();
									          $("#uniform-checkAll > span").removeClass ( 'checked' );
									          $('#modal_ack_reject').modal('hide');
									          $('#error-reject').removeClass('alert alert-error').html('');
									          //Popup Scroll normal and background scroll normal.
									          $('body').css('overflow-y','scroll');
									      	  $('body').css('position','relative');
										  
									  } else{
										  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
										  
									  }
								  });
							}
							else
							{
								$('#error-reject').addClass('alert alert-error').html('Please click on "I agree" if you wish to proceed.') ;
							}
							
						});
						
						$( "#cancel_rejectform" ).click(function() {
							//Popup Scroll normal and background scroll normal.
					          $('body').css('overflow-y','scroll');
					      	  $('body').css('position','relative');
						});
						$( "#ackrejclose" ).click(function() {
							//Popup Scroll normal and background scroll normal.
					          $('body').css('overflow-y','scroll');
					      	  $('body').css('position','relative');
						});
						
						
					}
					else if($('.check-box-each1:checked').length == 1)
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
							    	  var table = $('#physicians-list').DataTable();
							          table.ajax.reload();
							          $("#uniform-checkAll > span").removeClass ( 'checked' );
								  
							  } else{
								  $('#ajaxResults').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
								  
							  }
						  });
					}
			        else 
			        {
			        	$('#ajaxResults').addClass('alert alert-error').html('Please select atleast one testimonial') ;
			        }
				
			});
			
		/*================================Generating Questions Info Data Table======================================*/			
			$("body").on("click", ".survey-testimonial", function(e)
			{
				
				oTable = $('.physician-list').dataTable();
				
				var row = $(this).parents("td")[0];
				var pos = oTable.fnGetPosition(row);
			    var docId = oTable.fnGetData(pos[0])['document_id'];
			   
				//Generating Questions Info datatable.
			    //alert(docId);
			    questionsInfoDataTable(docId);
			    $('body').css('overflow','hidden');
				$('body').css('position','fixed');
			});
			/*================================End of Generating Questions Info Data Table================================*/
			
			/*================================Cancel Questions Info Data Table======================================*/			
			$("body").on("click", ".close", function(e)
			{
				$('body').css('position','relative');
	            $('body').css('overflow-y','scroll');
			});
			/*================================End of Cancel Generating Questions Info Data Table================================*/
			
			/*==================== Reason for Edit comment =============*/
			
			$('#reason').select2({
		        allowClear: true
			   });
			
			
				
			
			
			
		}
	}
}();