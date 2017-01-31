
var config = function () {
	return{
		dataTableObj:false,
		standardQueues : JSON.parse('[{"id":"99999","text":"All Clients - Affiliated Physicians"}]') ,
		init:function(client_id,report_id,encoded_filter){
			
		},
		
		// Validate Report configuraiton filter
		loadPage:function(){
			$(".industry-list").select2('val','healthcare').trigger('change');
			$(".filter_clear_submit").on("click",function(){ clearList(false) ;});
			$(".filter_start_submit").on("click",function(){ clearList(true) ;});
			$(".new-queue").on("click",function(e){
				e.preventDefault();
				btn = $(this);
				bootbox.prompt("Enter name for the queue.", function(result) {                
					  if (result === null) {                                             
					                          
					  } else if (result==""){
						  if(!$(".bootbox-form").hasClass('error-data')){$(".bootbox-form").addClass('error-data');
						 $(".bootbox-form").append("<div class='text-danger'>Please enter a name for the queue.</div>");
						  }
						 return false;
					  } else {
							Custom.hideMessages();
							$.ajax({
								type: "POST",
								url: btn.attr("data-url"),
								data: {
									name:result
								},
								beforeSend: function(){
									Custom.showLoader();
								},
								complete: function(){
									Custom.hideLoader();
								},
								timeout: 60000,
								error: function(){
									var messages = [];
									messages.push("Please try again later.");
									Custom.showMessages('error', 'Something went wrong!', messages);
								}
							})
							.done(function( result ) {
								if(result.status.code == 200){
									dataTableObj.ajax.reload();
								}else{
									var messages = [];
									messages.push("Please try again later.");
									Custom.showMessages('error', 'Something went wrong!', messages);
								}
							});
					  }
					});
			});
			$("#cmb-queue").on("change", function(e){
				$(".filter-portlet").hide();
				loadQueue($("#cmb-queue").select2('val'));
			});
			this.updateQueues();
		},
		updateQueues:function() {
			var listColumns = [
				               	{
				               		"mData" : "id",
				               		"orderable" : false,
				               		"sClass" : "queue-id",
				               		"width":"5%",
				               	 "visible": false
				               	}, {
				               		"mData" : "name",
				               		"sClass" : "queue-name",
				               		"orderable" : false,
				               		"width" : "85%"
				               	} ,
				               	{
				                    "mData": "Action",
				                    "width" : "5%",
				                    "sClass" : "text-center",
				                    bSortable: false,
				                    mRender: function (data,type,row) {
				                    	var hiddenClass = '';
				                    	if (row.id == 99999) {
				                    		hiddenClass = 'hidden';
				                    	}
				                    	return '<i title="delete" class="queue-delete-link fa fa-trash-o '+hiddenClass+'" data-id="'+row.id+'" style="font-size: 22px;" data-original-title="Delete"></i>'; }
				                } ,
				               	{
				                    "mData": "Users",
				                    "width" : "5%",
				                    "sClass" : "text-center",
				                    bSortable: false,
				                    mRender: function (data,type,row) { return '<i title="add users" class="queue-users-link fa fa-user-plus" data-id="'+row.id+'" style="font-size: 22px;" data-original-title="Add Users" ></i>'; }
				                }
				               	];

           	dataTableObj = $("#queue-list")
           			.DataTable(
           					{
           						serverSide : true,
           						bLengthChange : false,
           						searching : false,
           						iDisplayLength : 100,
           		                "bDestroy" : true,
           						"bProcessing" : false,
           						"language" : {
           							"emptyTable" : "There is no queue available."
           						},
           						order : [ [ 0, 'desc' ] ],
           						ajax : {
           							url : SocialView.base_url + 'management/config/admin'
           									+ '/get_queues',
           							type : 'GET',
           							data : {
           							},
           							dataType : 'json',
           							beforeSend : function() {
           								Custom.showLoader();
           							},
           							complete : function() {
           								//cmb-queue
           								var cmbqueuedata =[];
           								$.each( dataTableObj.data() ,function(idx,val){
           									cmbqueuedata.push({id:val.id,text:val.name});
           								});
           								
           								// Commenting the following line because, we are getting 
           								// standard queue in the service call itself
//           								$.each(config.standardQueues,function(key,val){
//           									cmbqueuedata.push(val);
//           								});
           								
           								$("#cmb-queue").select2({ data: cmbqueuedata });
           								Custom.hideLoader();
           							},
           							error : function() {
           								Custom.hideLoader();
           								Custom.showMessages(
           												"error",
           												"An error occurred",
           												[ "Sorry, there is an error processing your request. Please try again later" ]);
           							}
           						},
           						aoColumns : listColumns
           					});
           	
           	$("#queue-list").on("click",".queue-delete-link",function() {
           		var queueId = ( $(this).attr('data-id'));
           		var queueName = ( $(this).parents('tr').find(".queue-name").text());
           		Custom.showConfirm("Are you sure want to delete "+queueName+" ?","","Yes","No",function(result){
           				if(result){
           					config.deleteQueue(queueId);
           				}
           		} );
           	});
           	
           	var selectedUserList = [];
           	$("#queue-list").on("click",".queue-users-link",function() {
           		var queueId = ( $(this).attr('data-id'));
           		var queueName = ( $(this).parents('tr').find(".queue-name").text());
//           		var userList = $.parseJSON($(this).attr('user-list'));
        		
        		$.ajax({
        			type: "POST",
        			url: SocialView.base_url + 'management/config/admin'
        				+ '/get_users',
        			data: {
        				id:queueId
        			},
        			beforeSend: function(){
        				Custom.showLoader();
        			},
        			complete: function(){
        				Custom.hideLoader();
        			},
        			timeout: 60000,
        			error: function(){
        				var messages = [];
        				messages.push("Please try again later.");
        				Custom.showMessages('error', 'Something went wrong!', messages);
        				Custom.hideLoader();
        			}
        		})
        		.done(function( result ) {
        			Custom.hideLoader();
        			var userList = [];
        			if(result.status.code == 200){
        				userList = result.data;
        			}else{
        				var messages = [];
        				messages.push("Please try again later.");
        				Custom.showMessages('error', 'Something went wrong!', messages);
        			}
        			selectedUserList = preselectUserList(userList);
               		
            		var box = bootbox.dialog({
            			message : getBootboxMessage(queueId),
            			title : "Assign Users - "+ queueName,
            			id : "assign-users",
            			backdrop: false,
            			buttons : [ {
            				label : "Assign",
            				className : "btn btn-primary pull-left",
            				callback : function() {
            					box.modal('hide');
            					config.assignUsers(queueId, selectedUserList);
            					return false;
            				}
            			}, {
            				label : "Close",
            				className : "btn btn-default pull-left",
            				callback : function() {
            				}
            			} ],
            			onEscape : function() {
            			}
            		});
               	});        			
        		});
           	
            $('body').on('click', '.btnOk', function() {
            	selectedUserList = [],
                    items = '';
                $('.SumoSelect #users option:selected').each(function(i) {
                	if (($.inArray($(this).val(), selectedUserList)) == -1) {
                		selectedUserList.push($(this).val());
                	}
                });
              });
            
            $("body").on('click', '.user-list-container .SumoSelect li', function(event) {
                if(!$(this).hasClass('selected')) {
                	var dataVal = $(this).attr('data-val');
                	$('#users option[value="'+dataVal+'"]').prop('selected', false);
                	selectedUserList = $.grep(selectedUserList, function(value) {
                		  return value != dataVal;
                		});
                }
            })
		},
		assignUsers: function(queueId, userlist){
			$.ajax({
				type: "POST",
				url: SocialView.base_url + 'management/config/admin'
					+ '/assign_queue',
				data: {
					id:queueId,
					userList: (userlist.length > 0)?userlist:[]
					
				},
				beforeSend: function(){
					Custom.showLoader();
				},
				complete: function(){
					Custom.hideLoader();
				},
				timeout: 60000,
				error: function(){
					var messages = [];
					messages.push("Please try again later.");
					Custom.showMessages('error', 'Something went wrong!', messages);
				}
			})
			.done(function( result ) {
				if(result.status.code == 200){
					var messages = [];
					messages.push("Queue assigned successfully.");
					Custom.showMessages('success', 'Success', messages);
				}else{
					var messages = [];
					messages.push("Please try again later.");
					Custom.showMessages('error', 'Something went wrong!', messages);
				}
			});			
		},
		deleteQueue:function(queueId) {
			Custom.hideMessages();
			$.ajax({
				type: "POST",
				url: SocialView.base_url + 'management/config/admin'
					+ '/delete_queue',
				data: {
					id:queueId
				},
				beforeSend: function(){
					Custom.showLoader();
				},
				complete: function(){
					Custom.hideLoader();
				},
				timeout: 60000,
				error: function(){
					var messages = [];
					messages.push("Please try again later.");
					Custom.showMessages('error', 'Something went wrong!', messages);
					Custom.hideLoader();
				}
			})
			.done(function( result ) {
				Custom.hideLoader();
				if(result.status.code == 200){
					bootbox.alert("Queue deleted successfully.")
					dataTableObj.ajax.reload();
				}else{
					var messages = [];
					messages.push("Please try again later.");
					Custom.showMessages('error', 'Something went wrong!', messages);
				}
			});
		}
	}
}();

function getBootboxMessage(queueId) {
	var content = $('.client-dropdown').html();
	var object = $('<div/>').html(content).contents();
	
	object.find('#users').SumoSelect({
		okCancelInMulti:true, 
		selectAll:true ,   
		filter:true
		});
	return object;
} 

function preselectUserList(userList) {
	var preSelected = [];
	if (userList.length > 0) {
		$('#users option').each(function(){
			for (i = 0; i < userList.length; i++) {
				if (userList[i].name == this.value) {
					$(this).attr('selected', true);
					preSelected.push($(this).val());
					break;
				}else {
					$(this).removeAttr('selected');
				}
			}
		});
	} else {
		$('#users option').each(function(){
			$(this).removeAttr('selected');
		});		
	}
	return preSelected;
}

var dataTableObj1;

function loadQueueList()
{
	
	               
	return dataTableObj;
}

var clientList={};

$(function() {
	$( ".ui-sortable" ).sortable();
	//$("#client-list1").select2().on("click",function())
	select2 = $("#client-list1").select2().on('select2-loaded', function(e) {
	    dropDownList = e.items.results;
	});
	select2.onSelect = (function(fn) {
	    return function(data, options) {
	        var target;
	        
	        if (options != null) {
	            target = $(options.target);
	        }
	        
	        if (target && target.hasClass('info')) {
	        } else {
	        	
	            return fn.apply(this, arguments);
	        }
	    }
	})(select2.onSelect);
	
	$(".industry-list").on("change", function(e){
		findClientsEntities();
	});
	
	
	
	$("body").on("click",".quick-filter",function(e){
		e.preventDefault();
		if($("#cmb-queue").select2('val') >=99999) {
			$("#chkcompetitor").closest('.form-group').hide();
			$("#chkcustomq").closest('.form-group').show();
			$("#uniform-chkcustomq").next().text("Activate " + $('#cmb-queue').select2('data').text);
		} else {
			$("#chkcustomq").closest('.form-group').hide();
			$("#chkcompetitor").closest('.form-group').show();
		}
		$(".filter-portlet").show();
		var client_id = ($(this).parent().parent().find(".ui-icon").attr("data-id"));
		loadConfig(client_id);
		//triggerSource(client_id);
	});
	
	$("body").on("change",".frequency-list",function(e){
		e.preventDefault();
		var me = $(this);
		var value = me.val();
		if(value == "custom"){
			$('.date-range-group').show();
		}else{
			$('.date-range-group').hide();
		}
		
	});
	
	$("body").on("click",".quick-delete",function(e){
		e.preventDefault();
		$(".filter-portlet").hide();
		var ele = ($(this).parent().parent().find(".ui-icon").parent());
		ele.remove();
		//triggerSource(client_id);
	});
	
	$('#client-list1').on("select2-selecting", function(e) { 
		if($('#cmb-queue').select2('val')=="")
			{
			bootbox.alert("You must select a queue to add clients",function(){$('#client-list1').select2('val','');});
			return;
			}
		console.log($('#client-list1').select2('val'));
		if(e.choice.id=="allclients"){
			Custom.showConfirm("This will clear existing items and will add all clients. Do you want to continue?","","Yes","No",function(res){
				if(res){
					$("#client-list1 option").each(function()
							{
							    // log the value and text of each option
								if($(this).val()!=e.choice.id && $(this).val()!=""){
									if($(this).parent().attr("label")=="Customers"){
								    var html = getClientTextItem($(this).val(),$(this).text());
								    $(".client-sortable").append(html);
									}
								}
							});
				}
			});
					
			return;
		}
		var html = getClientTextItem(e.choice.id,e.choice.text);
		var dup=false;
		
		$(".client-sortable li").each(function(){ 
			    if( $(this).find(".ui-icon").text() == e.choice.text)
			    	{
			    	bootbox.alert("Client already in queue.");
			    	dup=true;
			    	}
			});
	
		if(!dup)
		$(".client-sortable").append(html);
	});
	
	
	//loadConfig("bwmc");
	 //client-sortable
	

 
	$('.filter_config_submit').click(function(e){
		e.preventDefault();
		//build sources
		/*var sources = [];
		$(".sources-sortable").children().each(function(index,ele){
			sid =  ($(ele).find(".ui-icon").attr("data-id"));
			sources.push(sid);
		});*/
		
		//build filter
		var filter= readFilters();
		 
		queueId = $(".cmb-queue").select2('val');
		$.each(config.standardQueues,function(key,val){
				if(val.id == queueId){ 
					filter.customQ = $("#chkcustomq").is(':checked');
					return false;
				}
		});
	
		
		var clientarr = [$(".filter_title").attr("data-id")];
		saveConfig(clientarr,filter,queueId);
	
	});
	
	function readFilters() {
		var filter=Object();
		
		filter.frequency = $("#frequency-list").val();
		filter.startdate = $(".filter_start_date").val();
		filter.enddate = $(".filter_end_date").val();
		if($("#source-tags").val())
			filter.sources=$("#source-tags").val();
		else { 
			filter.sources=[];
		}
		filter.competitor=$("#chkcompetitor").is(':checked');
		filter.competitor=$("#chkcompetitor").is(':checked');
		queueId = $(".cmb-queue").select2('val');
		$.each(config.standardQueues,function(key,val){
				if(val.id == queueId){ 
					filter.customQ = $("#chkcustomq").is(':checked');
					return false;
				}
		});
		return filter;
	}
	
	function saveConfig( client,filter,queueId ) {
		Custom.showLoader();
		url = SocialView.base_url + 'management/config/admin/saveconfig';
		$.ajax({
					type : "POST",
					url : url,
					dataType : "text",
					data : {
						clientId : client,
						clientFilter : filter,
						'industryId':queueId
					},
					error : function() {
						//window.location.reload();
					},
					always: function(){
						Custom.hideLoader();
					}
				})
				.done(
						function(data) { 
							Custom.hideLoader();
							bootbox.alert("Filter configuration saved successfully.");

						});
	}
	
	
	
	$('.filter_order_submit').click(function(e){
		e.preventDefault();
		//build sources
		var clients = [];
		$(".client-sortable").children().each(function(index,ele){
			sid =  ($(ele).find(".ui-icon").attr("data-id"));
			clients.push(sid);
		});
		queueId = $(".cmb-queue").select2('val');
		 
		var filter=Object();
		filter.clients=clients;
	
		saveConfig(["admin"], filter, queueId);
		Custom.showLoader();
 
	});
	
	$('.filter_apply_all').click(function(e){
		e.preventDefault();
		//build sources
		var clients = [];
		$("#sortable li>span").each(function(i,val){ 
			sid = $(val).attr('data-id');
			if(sid!="")
				clients.push(sid);
		});
		 
		queueId = $(".cmb-queue").select2('val');
		 
		var filter = readFilters();
	
		saveConfig(clients, filter, queueId);
		Custom.showLoader();
 
	});
	
	
});

function clearList(reSchedule) {
	strreschedule='';
	if(reSchedule)strreschedule='Queueing process started.';
	$.ajax({
		url: SocialView.base_url +'management/config/admin/clear_schedules/',
		beforeSend: function(xhr) {
			Custom.showLoader();
		},
		type: "POST",dataType : "json",
		data : {
			'reSchedule' : reSchedule,
		},
		timeout: 100000,
		error: function(error) {
			var messages = [];
			messages.push('Please try after sometime.');
			Custom.showMessages('error', 'Something went wrong!', messages);
			Custom.hideLoader();
		}
	}).done(function(data) {
		if(data.status.code==200){
			bootbox.alert("Schedule list cleared."+strreschedule);
		}
		Custom.hideLoader();
	});
}

function findClientsEntities() {
	
	 
	var clientEntity = $("select.client");
	var selectedIndustryId = $(".industry-list").select2('val');
	var clientEntityId = clientEntity.val();
	
	if (selectedIndustryId != "" && selectedIndustryId != null) {
		$.ajax({
			url: SocialView.base_url +'management/config/admin/get_client_entities/' + selectedIndustryId,
			beforeSend: function(xhr) {
				Custom.showLoader();
			},
			type: "GET",
			timeout: 100000,
			error: function(error) {
				var messages = [];
				messages.push('Please try after sometime.');
				Custom.showMessages('error', 'Something went wrong!', messages);
				Custom.hideLoader();
			}
		}).done(function(data) {
			clientEntity.find('option').remove().end();
			clientEntity.append("<option></option>")
				$.each(data,function(key,value){
					 var optgroup = $('<optgroup>');
			            optgroup.attr('label',key);
				$(value).each(function() {
					clientList[this.val] = this.text;
					if (clientEntityId != null && clientEntityId == this.val) {
						optgroup.append($("<option selected='selected'>").attr('value', this.text).text(this.val));
					}else{
						optgroup.append($("<option>").attr('value', this.val).text(this.text));
					}
					
				});
				clientEntity.append(optgroup);
				});
			 
			Custom.hideLoader();
		});
	}
}

function loadQueue(queueId) {
	if (queueId != '') {
		//$('#wait_3').show();
		if(queueId >=99999) {
			$(".filter-portlet").hide();
			$(".industry-list, #client-list1 , .filter_order_submit,.filter_apply_all").attr("disabled","disabled");
			html = getClientTextItem("admin",$('#cmb-queue').select2('data').text );
			$(".client-sortable").html(html);
			return;
		} else {
			$(".industry-list, #client-list1 , .filter_order_submit,.filter_apply_all").removeAttr("disabled");
		}
		url = SocialView.base_url + 'management/config/admin/get_client_config';
		Custom.showLoader();
		$.ajax({
					type : "POST",
					url : url,
					dataType : "json",
					data : {
						'industryId' : queueId,
					},
					error : function() {
						//window.location.reload();
					},
					always: function(){
						Custom.hideLoader();
					}
				})
				.done(
						function(data) {
							if(typeof data.selClients!='undefined'){
								$(".client-sortable").html('');
								$.each(data.selClients,function(key,val){
									html = getClientTextItem(val.id,val.name );
									$(".client-sortable").append(html);
								});
								
							}
							Custom.hideLoader();

						});
	}	
}

function getClientTextItem(id,text){
	var html ='<li class="ui-state-default list ui-sortable-handle"><span class="ui-icon ui-icon-arrowthick-2-n-s" data-id="'+id+'">'+text+'</span>'+text+' ';
	html +="<div class='tools'><a href='#' class='btn acebtn btn-minier btn-info quick-filter' > <i class='icon-only ace-icon fa fa-share'></i> Filter</a> <a href='#' class='btn acebtn btn-minier btn-info quick-delete' > <i class='icon-only ace-icon fa fa-trash'></i> Delete</a> </div></li>";
	return html;
}

function loadConfig(client) {
	if (client != '') {
		//$('#wait_3').show();
		

		url = SocialView.base_url + 'management/config/admin/loadconfig';
		Custom.showLoader();
		$(".filter_title").text("Filter Setup["+$('#cmb-queue').select2('data').text +"-"+ client+"]");
		$(".filter_title").attr('data-id',client);
		queueId = $(".cmb-queue").select2('val');
		$.ajax({
					type : "POST",
					url : url,
					dataType : "json",
					data : {
						clientId : client,
						queueId:queueId
					},
					error : function() {
					},
					always: function(){
						Custom.hideLoader();
					}
				})
				.done(
						function(data) {
							if(data.status!="200"){
								Custom.hideLoader();
								bootbox.alert("Error loading client information.Verify client exist in this environment.");return;
							}
							$("#frequency-list").select2('val',data.frequency);
							if(data.frequency == "custom"){
								$('.date-range-group').show();
							}else{
								$('.date-range-group').hide();
							}
							$(".filter_start_date").val(data.dateInfo.startdate);
							$( ".filter_start_date" ).datepicker( "setDate", data.dateInfo.startdate );
							$(".filter_end_date").val(data.dateInfo.enddate);
							$( ".filter_end_date" ).datepicker( "setDate", data.dateInfo.enddate );
							sources = data.sources;
							
							
							/*$("#source-tags").select2({tags: data.sources ,width:'style',createTag: function(params) {
				                return undefined;
					           },
							createSearchChoice: function() { return null; }
							});*/
							window.targetSources = $('#source-tags').SumoSelect({okCancelInMulti:true, selectAll:true ,   filter:true });
							$('#source-tags')[0].sumo.unSelectAll();
							$('#source-tags  option').each(function(i, selected){ 
								$('#source-tags')[0].sumo.remove(0); 
								});
							var idx=0;
							$.each(sources,function(k,v){
								if(v.id!=100000){ 
									$('#source-tags')[0].sumo.add(v.id,v.text);
									if(data.selsources.indexOf(""+v.id)>=0){ 
										$('#source-tags')[0].sumo.selectItem(idx);
									}
									idx++;
								}
							});
							if(data.competitor=='true'){
								$("#chkcompetitor").prop('checked', true);
								$("#uniform-chkcompetitor span:first-child").addClass("checked");
							} else 
								{
								$("#chkcompetitor").prop('checked', false);
								$("#uniform-chkcompetitor span:first-child").removeClass("checked");
								}
							$("#source-tags").select2('val',data.selsources);
							$("#source-tags").on("change", function() { /*$("#e15_val").html($("#e15").val());*/});
 
							$("#source-tags").select2("container").find("ul.select2-choices").sortable({
							    containment: 'parent',
							    start: function() { $("#source-tags").select2("onSortStart"); },
							    update: function() { $("#source-tags").select2("onSortEnd"); }
							});
							
							$.each(config.standardQueues,function(key,val){
								if(val.id == queueId){ 
									if(data.customQ=='true'){
										$("#chkcustomq").prop('checked', true);
										$("#uniform-chkcustomq span:first-child").addClass("checked");
									} else 
										{
										$("#chkcustomq").prop('checked', false);
										$("#uniform-chkcustomq span:first-child").removeClass("checked");
										}
									return false;
								}
								});
							Custom.hideLoader();

						});
	}
}

/*process methods*/
//Get Source
function triggerSource(client) {
	if (client != '') {
		//$('#wait_3').show();
		

		url = SocialView.base_url + 'management/content/admin/sourceList';
		Custom.showLoader();
		$.ajax({
					type : "POST",
					url : url,
					dataType : "text",
					data : {
						client : client,
				
					},
					error : function() {
						window.location.reload();
					},
					always: function(){
						Custom.hideLoader();
					}
				})
				.done(
						function(data) {  
							$(".sources-sortable").html("");
							var sourceList = JSON.parse(data); 
							sourceList = Object.keys(sourceList).map(function(k) { return k; });
							//$("#source-tags").select2({tags: sourceList ,width:'style'});
							/*for(idx in sourceList){
								var html ='<li class="ui-state-default ui-sortable-handle"><span class="ui-icon ui-icon-arrowthick-2-n-s" data-id="'+idx+'"></span>'+sourceList[idx] +'</li>';
								$(".sources-sortable").append(html);
							}*/
						 
						   
							Custom.hideLoader();

						});
	}
}
