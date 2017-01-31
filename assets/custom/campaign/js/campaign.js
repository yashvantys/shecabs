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

var Campaign = function() {
	return {
		home : function(cid,Intid) {
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
				
				/*$("#status").select2({
			        allowClear: true,
			        closeOnSelect: true,
				    placeholder: ''
			   });*/
			
				/*========Loading Datatable onload with default values==========*/
	  			displayDataTable(cid);
	  			/*========End of loading Datatable onload with default values====*/
	  	
			function displayDataTable(cid)
			{

				$('.audiencelist').dataTable(
							
					{
						
								serverSide : false,
								bLengthChange : false,
								bProcessing : false,
								bDestroy: true,
								searching: true,
								iDisplayLength : 100,
								"language": {
								      "emptyTable": "No data available in audience"
								    },
								
								ajax : {
									url : SurveyView.base_url
											+ "campaign/recipientlistData",
									type : 'POST',
									dataType : 'json',
									data : {
										cid : cid,
										Intid : Intid
										  
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
									"mData" : "name",
									"orderable": true
								}/*,
								{
									"mData" : "locationId",
									"orderable": true
								}*/,
								{
									"mData" : "emailSendTime",
									"orderable": true
								},
								{
									"mData" : "emailreadTime",
									"orderable": true
								},
								{
									"mData" : "linkClickedTime",
									"orderable": true
								},
								{
									"mData" : "respondedTime",
									"orderable": true
								},
								{
									"mData" : "reminderTime",
									"orderable": true
								},
								{
						             "mData" : "surveyResponse",
						             "Date" : "Date",
						             "mRender" : function(data, type, full) {
								          var html = '<a href="'+SurveyView.base_url+"campaign/"+cid+/surveyresponse-list/+full.documentId+'" target="_blank" data-doc_value="'+full.documentId+'" class="survey-testimonial sqi" data-toggle="modal">View Response</a> '; 
							              return html;
							             },
							         "sWidth": "11%",
							         "sClass" : "content-top-new",
						             "orderable": true
						        }
								
								]
								
								
							});
			
			}
			
			/*
			 * ================================Generating Questions Info DataTable======================================
			 */			
				$("body").on("click", ".survey-testimonial, .commentHistoryLink", function(e)
				{
					var oTable = $('.audiencelist').dataTable();
					//var row = $(this).parents("td")[0];
					
					//var pos = oTable.fnGetPosition(row);
					//var docId = oTable.fnGetData(pos[6])['documentId'];
					//alert(pos);
					//alert($(this).prop('data-doc_value'));
					var docId = $(this).data('doc_value');
						
						//var sourceId = oTable.fnGetData(pos[0])['sourceId'];
				    
						// Generating Questions Info datatable.
						questionsInfoDataTable(docId);
						Testinomialscrollhidden();
					
				});
				/*
				 * ================================End of Generating Questions Info
				 * Data Table================================
				 */
			
			function questionsInfoDataTable(documentId)
			{
				//alert(documentId);
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
								+ "campaign/surveyResponse",
						type : 'POST',
					dataType : 'json',
					data: {
						docId: documentId/*,
						sourceId: sourceId*/
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
		
		},
		response : function(cid,docid) { 
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
				
				/*$("#status").select2({
			        allowClear: true,
			        closeOnSelect: true,
				    placeholder: ''
			   });*/
			//alert('response function');
				/*========Loading Datatable onload with default values==========*/
				questionsInfoDataTable(cid,docid);
	  			/*========End of loading Datatable onload with default values====*/
	  	
			
				/*
				 * ================================End of Generating Questions Info
				 * Data Table================================
				 */
			
			function questionsInfoDataTable(cid,docid)
			{
				
				$('.responcelist').dataTable(
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
								+ "campaign/responcelistData",
						type : 'POST',
					dataType : 'json',
					data: {
						docId: docid/*,
						sourceId: sourceId*/
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
								/*{
									"mData" : "PGQuestionId",
									"PGQuestionId" : "PG Question Id",
									 "orderable": true
								},*/
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
								 	"mRender" : function(data, type, full) {
								 		 if(full.Response !=null && full.Response !='')
							             {
							              	 var html = full.Response;
							              	 
								          }else{
								            	var html = '';
								          }  
							             $('#location').html("<b>Location: </b> "+full.location).show();
							             $('#physician').html("<b>Physician: </b> "+full.physician).show();
							              
							              return html;
							             },
								 	"orderable": true
					            }
								
							 ]
				
			        
			    });	
			}
		
		}
					
		}
}();