var Statistics = function () {
	return{
		loadPage:function(){
			var clientList = $.cookie("man-statistics-client-list");
			if (clientList != null) {
				$("#clientlist").select2("val",clientList.split(','));
			}
			
			$(".chkuserfilter").click(function(){
				var chk= $('.chkuserfilter').is(':checked');
				if(chk){ 
					$(".userfilter").prop("disabled",false);
					$(".userlist").prop("disabled",true);
					$(".userfilter").focus();
				}else{
					$(".userfilter").prop("disabled",true);
					$(".userlist").prop("disabled",false);
				}
			});
			
			 $("#clientlist").on("change",function(){
				 if($(this).val().indexOf("allclients")>=0){
					
					 allclients = Array();
					 $("#clientlist option").each(function()
								{
								    // log the value and text of each option
									if($(this).val()!=""){
										if($(this).parent().attr("label")=="Customers"){
											allclients.push($(this).val()); 
										}
									}
								});
					 $(this).select2('val', allclients);
					 
				 }
			 });
			
			
			 $(".cedit_stat_filter_submit").click(function(e){
				e.preventDefault();
 
				var data = $('.rule-filter-form').serializeArray();
            var aoData ={};
	             for (var i = 0; i <  data.length; i++) {
	            	 aoData [data[i].name]=  data[i].value
			            } 

				 $('#example').DataTable( {
					 "dom": 'T<"clear">lfrtip',
					 "processing": true,
				        "serverSide": true,
				        "bSort" : false,
				        "ajax": {
				            "url": SocialView.base_url+'management/statistics/bwmc/userdata',
				            "type": "POST",
				            data:aoData,
				 			complete: function(){
				 				Custom.hideLoader();
				 			},
				 			beforeSend :function(){
				 				Custom.showLoader();
				 			}
							
							
				        },
				        /*"ajax": SocialView.base_url+'management/statistics/bwmc/userdata',*/
				        bFilter: false,
				        bPaginate: false,
				        bDestroy: true,
				        'oLanguage': {
				        	'sEmptyTable': 'No data found in the given date range'
				        	},
				        	 "bInfo" : false,
				        "oTableTools": {
				            "sSwfPath": SocialView.asset_url+"global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
				        "aButtons":[
				            "copy",
				            "csv",
				            {
			                    "sExtends": "pdf",
			                    "sTitle": "Content Management Statistics"},
				            "print"
				        ]},
				        "fnServerParams": function (aoData) {	
				   
				          
				        }
				    } );
			 });
			 
			 $(".cedit_pending_submit ").click(function(){

			 });
			 
			 $("#cmb_report_type").on("change",function(){
				 if($("#cmb_report_type").val() == "automated_task_count"){
					 $("#chkcompetitor").prop("disabled",true)
				 }else{
					 $("#chkcompetitor").prop("disabled",false)
				 }
			 }).trigger("change");
			 
			 $( "#rule-filter-task-form" ).submit(function( event ) {
					 if($("#clientlist").select2("val").length==0){
					  bootbox.alert("Please select atleast one client.");
					  event.preventDefault();
					 }else{
						 var clientList = $("#clientlist").select2("val");
						 $.cookie("man-statistics-client-list", clientList);
					 }
				});
		}
	}
}();
