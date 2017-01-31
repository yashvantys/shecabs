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

function edit_clients(id){
	
	//Removing status messages if any exists before loading the form.
	$('#status-message').removeClass("alert alert-success alert-error");
	$('#status-message').html("");
	
	
	
	url = SurveyView.base_url
	+ "vendor/resourceslist/";
  
		$.ajax({
			method: "POST",
			beforeSend: function(xhr) {
					Custom.showLoader();
				},
			url: url,
			data: {
				id : id
			},
			dataType: "text"
      
		}).done(function(json) 
		{
			   Testinomialscrollhidden();
				$('#modal_form').modal('show'); // show bootstrap modal when complete loaded
				$('.modal-title').text('Edit Vendor Configuration'); // Set title to Bootstrap modal title
				$('#editClientCat').html(json); //Displaying the Client Category Form.
				
				CKEDITOR.replace( 'releasenote', {
					basicEntities : false,	
					autoParagraph : false,
					
					toolbar: [
					  		{ name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] },	// Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
					  		//[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ],			// Defines toolbar group without name.
					  		//'/',																					// Line break - next group will be placed in new line.
					  		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
					  		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] }
					  		//{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
					  		//{ name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] }
					  	]
				});
				clientCategoryFormValidation();
				displayClientCategoryDropDown(); //Calling Client Category Dropdown method.
				
			
		 }).fail(function() 
		 {
		     $('#status-message').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
		 }).always(function() 
		 {
		     Custom.hideLoader();
		 });
		
}

// client list

function view_clients(id){
	
	url = SurveyView.base_url
	+ "vendor/clientlist/";
  
		$.ajax({
			method: "POST",
			beforeSend: function(xhr) {
					Custom.showLoader();
				},
			url: url,
			data: {
				id : id
			},
			dataType: "text"
      
		}).done(function(json) 
		{
			    Testinomialscrollhidden();
				$('#client_list').modal('show'); // show bootstrap modal when complete loaded
				$('.modal-title').text('Clients'); // Set title to Bootstrap modal title
				$('#viewclients').html(json); //Displaying the Client Category Form.
				
				
			
		 }).fail(function() 
		 {
		     $('#status-message').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
		 }).always(function() 
		 {
		     Custom.hideLoader();
		 });
	
	
}

//Method to handle Client Category Dropdown.
function displayClientCategoryDropDown()
{
	$("#clientcategory").select2({
		allowClear: false,
		closeOnSelect: true,
	    placeholder: ''
	});
	
	$('.startdatetime').hide();
	$('.enddatetime').hide();
	$('.reportshide').show();
	$('.reportsshow').hide();
	
	
	$('#clientcategory').on("change", function(event){
		
		var resourceId = $('#clientcategory').val();
		
		//Clearing previous error messages
		clearPreviousErrorMessages();
		
		url = SurveyView.base_url
		+ "vendor/resourcevalue/";
	  
			$.ajax({
				method: "POST",
				beforeSend: function(xhr) {
						Custom.showLoader();
					},
				url: url,
				data: {
					id : resourceId
				},
				dataType: "json",
				beforeSend: function(){
					Custom.showLoader('#editClientCat');
				},
				complete: function(){
					Custom.hideLoader('#editClientCat');
					
					
					var resourcename = $("#clientcategory option:selected").text();
					$('#status-message').removeClass('alert alert-error').html('');
					
					if(resourcename != ''){
					      $("#resourcename").html("<b>"+resourcename+" : <span class='span-red'>*</span></b>");
					}else{
					   	 var resourcename = "Disclaimer";
					     $("#resourcename").html("<b>"+resourcename+" : <span class='span-red'>*</span></b>");
					}

					
					//$("#resourcename").html("<b>"+resourcename+" : <span class='span-red'>*</span></b>");
					
					if(resourcename == "Releasenotes")
					{
						//alert('release not');
						$('#status-message').removeClass('alert alert-error').html('');
						$("input:text[name=startDate]").attr("disabled", false);
						$("input:text[name=endDate]").attr("disabled", false);
						$('.startdatetime').show();
						$('.enddatetime').show();
						$('.reportshide').show();
						$('.reportsshow').hide();
					}
					else if(resourcename == "Reports")
					{
						//alert('reprot alert');
						$('#reports_show').css('display','block');
						$('.reportsshow').show();
						$('.reportshide').hide();
						$('.startdatetime').hide();
						$('.enddatetime').hide();
						$("input:text[name=startDate]").attr("disabled", true);
						$("input:text[name=endDate]").attr("disabled", true);
						
					}
					else
					{
						//alert('else disclaimer');
						$('#status-message').removeClass('alert alert-error').html('');
						$('.startdatetime').hide();
						$('.enddatetime').hide();
						$("input:text[name=startDate]").attr("disabled", true);
						$("input:text[name=endDate]").attr("disabled", true);
						$('.reportshide').show();
						$('.reportsshow').hide();
					}
				}
	      
			}).done(function(json) 
			{
				if(json != null) {
				CKEDITOR.instances['releasenote'].setData(json.resourceValue);
				$("input:hidden[name=label]").val(json.label);
				$("input[name=startDate]").val(json.startTime);
				$("input[name=endDate]").val(json.endTime);
				$("input:hidden[name=clientCategoryId]").val(json.id);
				$("input:hidden[name=resourceKey]").val(json.resourceKey);
				if(json.resourceKey == "menu.reports")
					$("input:radio[name='reports'][value='"+ json.resourceValue +"']").prop('checked', true);
				}
				
			 }).fail(function() 
			 {
			     $('#status-message').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.') ;
			 }).always(function() 
			 {
			     Custom.hideLoader();
			 });
		
	});
}

//Method to handle Client Category Form Submit.
function editClientCategoryFormSubmit()
{
		
	//$("input:radio[name='reports'][value='0']").prop('checked', true);
	var resourceId = $('#clientcategory').val();
	var resourcename = $("#clientcategory option:selected").text();
	
	var url = SurveyView.base_url+ "vendor/updateDisclaimer/";
	
	//alert(JSON.stringify($('#client-category-form').serializeObject()));
	$.ajax({
	url: url,
	type: "POST",
	datatype: "text",
	data:  {
		postedData: JSON.stringify($('#client-category-form').serializeObject())
	},
	beforeSend: function(){
		Custom.showLoader('#editClientCat');
	},
	complete: function(){
		Custom.hideLoader('#editClientCat');
	}
	
	}).done(function(json) {
	  if(json)
	  {
		  //Testinomialscrollshow();
		  $('#status-message').addClass('alert alert-success').html(json);
		  setTimeout(function() {
			$('#status-message').removeClass('alert alert-success').html('');
			}, 2000);
	  }
	  else
      {
		  $('#status-message').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.');
      }
	}).
	fail(function(json){alert(json);
		$('#status-message').addClass('alert alert-error').html('Sorry for the inconvenience. Please try again later.');
		$('#client-category-form').reset();
	});
	
}


//Method to handle Edit Client Form Validation
function clientCategoryFormValidation()
{
	//Initializing DateTimePicker Calendar
    initializeDateTimePicker();
    
   /*=========================Validation Begins================*/
	
	$.validator.addMethod("startDate_endDate_not_same", function(value, element) {
		   return $("input:text[name=startDate]").val() != $("input:text[name=endDate]").val()
	}, "StartDate and EndDate should not be same");
	
	$.validator.addMethod("startDate_greaterthan_endDate", function(value, element) {
		   //return $("input:text[name=endDate]").val() > $("input:text[name=startDate]").val()
		  var ValEndDate = $("input:text[name=endDate]").val();
		  var UDTENDdateGMT = Timetoparse(ValEndDate);
		  var ENDDateparse = Date.parse(UDTENDdateGMT);
		  //alert("END : "+Date.parse(UDTENDdateGMT));
		  
		  var ValStartDate = $("input:text[name=startDate]").val();
		  var UDTSTdateGMT = Timetoparse(ValStartDate);
		  //alert("Start : "+Date.parse(UDTSTdateGMT));
		  
		  var STDateparse = Date.parse(UDTSTdateGMT);
		  
		  return ENDDateparse > STDateparse
		  
	}, "StartDate should be less than EndDate");
	
	$.validator.addMethod("releaseNoteValidation", function(value, element) {
		var resourcename = $("#clientcategory option:selected").text();
		
		var result = true;
		if(resourcename == "Email")
		{
			if($.validator.methods.email.call(this, value, element) === false)
			{
				result = false;
				$.validator.messages.releaseNoteValidation = "Please enter valid Email Address";
			}
		}
		return result;
			
	}, "");
	
	$('#client-category-form').validate({
		errorElement: 'span',
		errorClass: 'help-block col-md-offset-5', 
		onfocusout: function(){},
		ignore: "input:hidden:not(input:hidden.required),input:hidden:not(input:hidden.htmlEditor)",
		rules:  {
			releasenote:{
				required: function()
				{
					//IMPORTANT: update CKEDITOR textarea with actual content before submit.
					CKEDITOR.instances['releasenote'].updateElement();
					$.validator.messages.required = $("#clientcategory option:selected").text()+" is required.";
				},
				releaseNoteValidation: true
			},
			startDate:{
				required: true,
				startDate_endDate_not_same: true,
				startDate_greaterthan_endDate: true
			},
			endDate:{
				required: true,
				startDate_endDate_not_same: true,
				startDate_greaterthan_endDate: true
			}
			
		},
		
		messages:{
			startDate: {
				required: 'Start Date is required'	
			},
			endDate:{
				required: 'End Date is required'
			} 
		},
		invalidHandler: function (event, validator) {   console.log("Validator:  "+validator);
			$('.alert-danger', $('#client-category-form')).show();
		},
		
		highlight: function (element) {console.log("Highlight:  "+element); // hightlight error inputs
			$(element)
				.closest('.form-group').addClass('has-error'); // set error class to the control group
		},
		
		success: function (label) {console.log("Success:  "+label);
			label.closest('.form-group').removeClass('has-error');
			label.remove();
		},

		errorPlacement: function (error, element) {console.log(error);
			error.insertAfter(element.closest('.input-group'));
		},
		
		submitHandler: function (form) {
			$("div").children().removeClass('has-error');
			editClientCategoryFormSubmit();
		}
	});
	
	/*===========================Validation Ends================================*/
}

function initializeDateTimePicker()
{
	/*=====================Date Time Picker====================*/
	//Initializing DateTimePicker
	$('#datetimepicker1').datetimepicker({
		format: "DD/MM/YYYY HH:mm",
		useCurrent: false
	});

	$('#datetimepicker2').datetimepicker({
		format: "DD/MM/YYYY HH:mm",
		useCurrent: false
	});	
	
	$('.input-group').find('.startDateAddon').on('click', function(){
	    $('input:text[name=startDate]').trigger('focus');
	});
	
	$('.input-group').find('.endDateAddon').on('click', function(){
	    $('input:text[name=endDate]').trigger('focus');
	});
	
	//Setting the MinimumDate in StartDate calendar as current date.
	$("#datetimepicker1").on("dp.change", function (e) {
		
		$('#datetimepicker2').data("DateTimePicker").minDate(e.date);
		if($('#datetimepicker1').val() != "")
		{
			$('#datetimepicker1').data("DateTimePicker").maxDate($('#datetimepicker2').val());
		}
		else
		{
			$('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
		}
		
    });
	//Disabling all the days before the day selected in Start Date calendar.
    $("#datetimepicker2").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });
    
    /*==========================================================*/
	
}

function Timetoparse(date)
{
 if ( date != '' ) {	
	 var Valstspacedate = date.split(' ');
	 var Valstslashdiv = Valstspacedate[0].split('/');
	 var Valstcolondiv = Valstspacedate[1].split(':');
	 var UDTSTdate = Valstslashdiv[1]+'/'+Valstslashdiv[0]+'/'+Valstslashdiv[2]+' '+Valstcolondiv[0]+':'+Valstcolondiv[1];
	 var dateST = new Date(UDTSTdate);
	 UDTSTdateGMT = dateST.toString();
	 return UDTSTdateGMT;
}
 return false;
}

function clearPreviousErrorMessages()
{
	$('#client-category-form').validate().resetForm();
	$('div').removeClass("has-error");
		
	$('#status-message').removeClass("alert alert-success alert-error");
	$('#status-message').html("");
}

$("body").on("click", ".close", function(e){
	
	Testinomialscrollshow();
	
});

$("body").on("click", "#cancel_vendor", function(e){
	
	Testinomialscrollshow();
	
});


var Clientcat = function() {
	return {
		home : function() {
			
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
			
			$.fn.reset = function(fn) {
				return fn ? this.bind("reset", fn) : this.trigger("reset");
			};
				
				
			displayDataTable();
				
			function displayDataTable()
			{
						
							$('.clientcat-list').dataTable(
								
							{
								serverSide : false,
								bLengthChange : false,
								bProcessing : true,
								searching: false,
								destroy: true,
								iDisplayLength : 50,
								"language": {
							      "emptyTable": "No data available in Users"
							    },
							
								ajax : {
									url : SurveyView.base_url
											+ "vendor/list",
									type : 'POST',
									dataType : 'json',
									data: {
									      data:  JSON.stringify($('#client-filter-form').serializeObject())
									  },
									  beforeSend: function(){
											Custom.showLoaderCustomize(".defaultprogress");
											
										},
										complete: function(){
											Custom.hideLoader(".defaultprogress");
										},
									error : function() {
										Custom
												.showMessages(
														"error",
														"An error occurred",
														[ "Sorry, there is an error processing your request. Please try again later" ]);
									}
								},
								
								aoColumns : [{
									"mData" : "clientName",
									 "orderable": true
								},
																
								{
									"mRender" : function(data, type, full) {
										var html;
										html = "<a title='Edit' data-toggle='modal' class='edit-ftpaccess' data-backdrop='static' data-keyboard='false' onclick='edit_clients(\"" + full.clientId + "\")'><i class='fa fa-pencil-square-o fa-2x'></i>Edit</a>&nbsp;&nbsp;";
										
										html += "<a title='View Clients' data-toggle='modal' class='edit-ftpaccess' data-backdrop='static' data-keyboard='false' onclick='view_clients(\"" + full.clientId + "\")'><i class='fa fa-plus-square fa-2x' style='margin-right:5px;'></i>Clients</a>";
										
										return html;
										},
										 "orderable": false
									}
								
								
								]
								
								
							});
			}
		}
					
	}
}();