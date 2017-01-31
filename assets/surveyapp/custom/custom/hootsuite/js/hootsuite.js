var Hootsuite = function() {
	return {
		init : function() {
			// Form toggle
			$('#filter-form').hide();
			$(".menu-toggler").hide();
			$(".page-logo a").attr("href","");
			$('.hootsuite-settings').on('click', function(){
				$('#filter-form').slideToggle();
			});
			//load content when page onload
//			$.ajax({
//				url: $("#hootsuite-wrapper").attr("data-url"),
//				context: $("#hootsuite-wrapper"),
//				beforeSend: function(xhr) {
//					Custom.showLoader();
//				}
//			}).fail(function() {
//				$("#hootsuite-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
//			}).done(function(data) {
//				$("#hootsuite-wrapper").html(data);
//				Custom.hideLoader();
//			});
			if($(".avatar_id").val() !=""){
				var formData = $('#filter-form').serialize();
				var formId = $('#filter-form');
				Custom.showLoader("#hootsuite-wrapper-div");
				$.ajax({
					url: SocialView.base_url + 'hootsuite/hca/dom_request/get_stream_interface/',
					type: 'POST',
					data: formData,
				}).fail(function() {
					var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
//					Custom.showMessages('error', 'Error!', errors);
				}).done(function(data) {
					$("#hootsuite-wrapper-div").html(data.details);
					$(".supports").html(data.domain_recursive_view);
					if (data.status == 200) {
						$(".coll_task_filter_start_date").datepicker("update", data.start_date);
						$(".coll_task_filter_end_date").datepicker("update", data.end_date);;
					}
				}).complete(function() {
					
					
					Custom.hideLoader("#hootsuite-wrapper-div");
				});
			}else{
				$('#filter-form').show();
			}
			
			
			$("input[name=chk_group_date]:radio").change(function () {
				console.log($(this).val());
				var client_id = $(".client_id").val();
				
				
				
				
				
				if($(this).val() != "custom"){
					Custom.showLoader();
					$.ajax({
						url: SocialView.base_url + 'reports/' + client_id + '/dom_request/get_filter_dates/' + $(this).val(),
					}).fail(function() {
						var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
						Custom.showMessages('error', 'Error!', errors);
					}).done(function(data) {
						if (data.status == 200) {
							$(".coll_task_filter_start_date").datepicker("update", data.start_date);
							$(".coll_task_filter_end_date").datepicker("update", data.end_date);;
						}
					}).complete(function() {
						Custom.hideLoader();
					});
				}
				
			});
			
			$("select.filter-date-range").on("change", function(){
				if($("select.filter-date-range").val() != "custom"){
					Custom.showLoader();
					$.ajax({
						url: SocialView.base_url + 'reports/' + SocialView.client_id + '/dom_request/get_filter_dates/' + $("select.filter-date-range").val(),
					}).fail(function() {
						var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
						Custom.showMessages('error', 'Error!', errors);
					}).done(function(data) {
						if (data.status == 200) {
							$(".coll_task_filter_start_date").datepicker("update", data.start_date);
							$(".coll_task_filter_end_date").datepicker("update", data.end_date);;
						}
					}).complete(function() {
						Custom.hideLoader();
					});
				}
			});
			
			$("body").on("click",".generate-chart-block-btn",function(){
				var formData = $('#filter-form').serialize();
				var formId = $('#filter-form');
		        $('li',formId).removeClass('error');
		        $('span.error').remove();
//		        $('.input-required',formId).each(function(){
//		            var inputVal = $(this).val();
//		            console.log(inputVal); 
//		            var $parentTag = $(this).parent();
//		            if(inputVal == ''){
//		            	console.log('<span class="error">Required field</span>');
////		                $parentTag.addClass('error').append('<span class="error">Required field</span>');
//		            }
//		           
//		        });
				
//				return false;
				Custom.showLoader();
				$.ajax({
					url: SocialView.base_url + 'hootsuite/hca/dom_request/get_stream_interface/',
					type: 'POST',
					data: formData,
				}).fail(function() {
					var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
					Custom.showMessages('error', 'Error!', errors);
				}).done(function(data) {
					$("#hootsuite-wrapper-div").html(data.details);
					$(".supports").html(data.domain_recursive_view);
					if (data.status == 200) {
						$(".coll_task_filter_start_date").datepicker("update", data.start_date);
						$(".coll_task_filter_end_date").datepicker("update", data.end_date);;
					}
				}).complete(function() {
					
					$('#filter-form').slideToggle();
					Custom.hideLoader();
				});
			});
			
			$("body").on("click",".sort-order-icon",function(){
				$("#sortModal").modal("show");
				
			});
			
			$('body').on("click",".sort-order-icon-set",function(){
				
				var sortBy = $(".sort-by-group").find("label.active .sort_by").val();
				var sortOrderBy = $(".sort-order-group").find("label.active .sort_order").val();
				var formData = $('#filter-form').serializeArray();
				var formId = $('#filter-form');
		        $('li',formId).removeClass('error');
		        $('span.error').remove();
		        formData.push({name:'sortBy' , value:sortBy});
		        formData.push({name:'sortOrderBy' , value:sortOrderBy});
		        formData.push({name:'page_limit' , value:5});
		        formData.push({name:'page_start' , value:0});
		        formData.push({name:'page_start_limit' , value:10});
				Custom.showLoader();
				$.ajax({
					url: SocialView.base_url + 'hootsuite/hca/dom_request/get_stream_show_more_interface/',
					type: 'POST',
					 beforeSend: function(xhr) {
                         $(".sort-order-icon-set").html("Please wait...");
                     },
					data: formData,
				}).fail(function() {
					var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
					Custom.showMessages('error', 'Error!', errors);
				}).done(function(data) {
//					$("#hootsuite-wrapper-div").html(data.details);
					$(".container-chart").html(data.domain_recursive_view);
					if (data.status == 200) {
						$(".coll_task_filter_start_date").datepicker("update", data.start_date);
						$(".coll_task_filter_end_date").datepicker("update", data.end_date);;
					}
					$("#sortModal").modal("hide");
				}).complete(function() {
					$(".sort-order-icon-set").html('Sort<i class="glyphicon glyphicon-triangle-right"></i>');
					if($(".glyphicon-triangle-bottom").length >0){
						$(".sort-order-icon").attr("sort-order",'DESC');
						$(".sort-order-icon").removeClass("glyphicon-triangle-bottom");
						$(".sort-order-icon").addClass("glyphicon-triangle-top");
					}else{
						$(".sort-order-icon").attr("sort-order",'ASC');
						$(".sort-order-icon").removeClass("glyphicon-triangle-top");
						$(".sort-order-icon").addClass("glyphicon-triangle-bottom");
					}
					
					
					
					Custom.hideLoader();
				});
			})
			
			$("body").on("click",".show-more-link",function(){
				var formData = $('#filter-form').serializeArray();
				var formId = $('#filter-form');
				var sortBy = $(".sort-by-group").find("label.active .sort_by").val();
				var sortOrderBy = $(".sort-order-group").find("label.active .sort_order").val();
		        $('li',formId).removeClass('error');
		        $('span.error').remove();
				Custom.showLoader();
				 formData.push({name:'sortBy' , value:sortBy});
			     formData.push({name:'sortOrderBy' , value:sortOrderBy});
				$.ajax({
					url: SocialView.base_url + 'hootsuite/hca/dom_request/get_stream_show_more_interface/',
					type: 'POST',
					data: formData,
				}).fail(function() {
					var errors = ["Sorry for the inconvenience. An error occurred in the system. Please try again later..."];
					Custom.showMessages('error', 'Error!', errors);
				}).done(function(data) {
					$(".test-page").replaceWith(data.domain_recursive_view);
					$(".page_start").val(data.page_start);
					if (data.status == 200) {
						$(".coll_task_filter_start_date").datepicker("update", data.start_date);
						$(".coll_task_filter_end_date").datepicker("update", data.end_date);;
					}
				}).complete(function() {
					
					
					Custom.hideLoader();
				});
			});
			$("body").on("click",".sort_by",function(){
				$(this).attr("checked",true);
			});
		}
	};
}();
