
//Variable initialisation
var showRequestReportHistory = $('#showrequest_reporthistory');
var showHistoryProcessedFilePath = $('#showhistoryprocessedFilePath');
var showReportHistoryRequest = $('#showreportshistoryrequest');
var reportHistoryRequest = $('#reportshistoryrequest');
var client = $('#client');
var sentStatus = $("#sentStatus");
var fileGeneratedStatus = $("#fileGeneratedStatus");
var reportHistoryFilter = $('#reportshistory_filter');
var reportHistoryClass = $('.reportshistory');
var reportHistoryFilterForm = $('#reportshistory-filter-form');
var reportHistoryFilePath = SurveyView.base_url + "reportshistory/";
var inputGroupClass = $('.input-group');
var startDate = $('#start_date');
var endDate = $('#end_date');
var startDateClassString = ".start_date";
var endDateClassString = ".end_date";


function showerrorfilepath(filename){
	showRequestReportHistory.html(filename).show();
}

function showprocessedFilePath(filename){
	showHistoryProcessedFilePath.html(filename).show();
}

function showjsonData(data)
{
	DecodeJsonRequest = atob(data);
	//alert(DecodeJsonRequest);
	showReportHistoryRequest.jsonViewer(JSON.parse(DecodeJsonRequest));
}

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

var reportshistory = function() {
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
				
				reportHistoryRequest.on('show.bs.modal', function(){
					$('body').css('overflow-y','hidden');
					$('body').css('position','fixed');
				});

				reportHistoryRequest.on('hide.bs.modal', function(){
					$('body').css('overflow-y','scroll');
					$('body').css('position','relative');
				});
				
				client.select2();
				
				sentStatus.select2({
					   allowClear: false,
				       closeOnSelect: true
				   });
				
				fileGeneratedStatus.select2({
					   allowClear: false,
				       closeOnSelect: true
				   });
				
				/*========Loading Datatable onload with default values==========*/
	  			displayDataTable();
	  			/*========End of loading Datatable onload with default values====*/
	  			
	  			/*===============Calendar to be displayed on textbox when click of Calendar icon=======================*/ 
	  			inputGroupClass.find(startDateClassString).on('click', function(){
	  		        startDate.trigger('focus');
	  		    });
	  		    
	  			inputGroupClass.find(endDateClassString).on('click', function(){
	  		        endDate.trigger('focus');
	  		    });
	  		     /*===============Calendar to be displayed on textbox when click of Calendar icon===========*/
				
	  		reportHistoryFilter.click(function( event )
			{
					displayDataTable();
				
			});
			
			
			function displayDataTable()
			{
		
				reportHistoryClass.dataTable(
							
					{
								serverSide : true,
								bLengthChange : false,
								bProcessing : false,
								bDestroy: true,
								searching: false,
								iDisplayLength : 50,
								"language": {
								      "emptyTable": "No data available in Reports history"
								    },
								
								ajax : {
									url : reportHistoryFilePath +"reportList",
									type : 'POST',
									dataType : 'JSON',
									data: {
									      data:  JSON.stringify(reportHistoryFilterForm.serializeObject())
									  },
									beforeSend: function(){
								           Custom.showLoader();
								          },
								          complete: function(){
								           Custom.hideLoader();
								          },
									error : function() {
										Custom.showMessages(
														"error",
														"An error occurred",
														[ "Sorry, there is an error processing your request. Please try again later" ]);
									}
								},
								
								aoColumns : [
																
									
								{
									"mData" : "sentTo",
									"orderable": true,
									"sWidth" : "200px"
								},								
								{
									"mData" : "sentStatus",
									"mRender" : function(data, type, full) {
										
										if((full.sentStatus == "0"))
					            		 {
						            		 var html = 'Pending';
					            		 }
						            	 else if((full.sentStatus == "1"))
					            		 {
						            		 var html = 'Success';
					            		 }
						            	 else if((full.sentStatus == "2"))
					            		 {
						            		 var html = 'Fail';
					            		 }
						            	 else if((full.sentStatus == "-1"))
					            		 {
						            		 var html = 'All';
					            		 }
										 return html;
						             },
						            "sWidth" : "100px",
						         	"orderable": false
								},
								{
									"mData" : "fileGeneratedStatus",
									"mRender" : function(data, type, full) {
										
										if((full.fileGeneratedStatus == "0"))
					            		 {
						            		 var html = 'Pending';
					            		 }
						            	 else if((full.fileGeneratedStatus == "1"))
					            		 {
						            		 var html = 'Success';
					            		 }
						            	 else if((full.fileGeneratedStatus == "2"))
					            		 {
						            		 var html = 'Fail';
					            		 }
						            	 else if((full.fileGeneratedStatus == "-1"))
					            		 {
						            		 var html = 'All';
					            		 }
										 return html;
						             },
						            "sWidth" : "100px",
						         	"orderable": false
								},
								/*{
									"mData" : "applicationName",
									"orderable": false
								},
								{
									"mData" : "createdBy",
									"orderable": false,
									"sWidth" : "200px"
								},*/
								
								{
									"mData" : "createdTimeVal",
									"orderable": true,
									"sWidth" : "150px"
								},
								{
									"mData" : "request",
									 "mRender" : function(data, type, full) {
										 /*var dr = {
												  "foobar": "foobaz",
												  "foobar": "foobaz"
												};*/
										 
										//var RequestJson = JSON.stringify(full.request);
										//EncodeRequest = btoa(full.request);
										//alert(EncodeRequest);
									if(full.uuid !=null && full.uuid !='')
						            {
						              	//var html = '<a href="#reportshistoryrequest" data-toggle="modal"  data-backdrop="static" data-keyboard="false" onclick="showjsonData(\'' + EncodeRequest + '\');Testinomialscrollshow();">Show</a>';
						              	var html = '<a href=\''+reportHistoryFilePath+'download/'+full.uuid+'\'>Download</a>';
						            	 //var html = '<a href=\''+reportHistoryFilePath+'download/test\'>Download</a>'; 
						              	 
						            }else{
						            	var html = '';
						            }
						              
						              return html;
						             },
						        	"orderable": false,
									"sWidth" : "100px"
								}
								
								
								]
								
								
							});
			
			}
		
		}
					
		}
}();