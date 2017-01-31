var Api = function () {
	return{
		loadJavascript:function(){
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            });
			// Datepicker
            /*$(".api-filter-date").datepicker({
                orientation: "left",  
                autoclose: true
            });*/
            
            // Datepicker grouping
            //$(".api-input-daterange").datepicker({
                /*orientation: "left",  */
            //   autoclose: true
            //});
            
            // Switching application
			$(".api-application-dropdown").on("change", function(e) {
                e.preventDefault();
                var appID = $(this).val();
                var jsFlag = '';
                var url = SocialView.base_url + "api/" + SocialView.client_id + "/javascript-code/" + appID;
                if (typeof SocialView.show_js != 'undefined' && SocialView.show_js == 'nojs') {
                    url = url + '/'  + SocialView.show_js;
                }
                
                window.location.href = url;
            });
            
            // Create Testimonials
            $(".create-api-js").on("click", function(e) {
                var validated = validateJSForm();
                if (validated) {
                    var locationId = $(".api-location-dropdown").select2('val');
                    var physicianId = '';
                    if ($(".api-physician-dropdown").length) {
                        physicianId = $(".api-physician-dropdown").select2('val');
                    }
                    var appID = $(".api-application-dropdown").select2('val');
                    var threshold = $(".api-threshold").val();
                    var minReviewCount = $(".api-min-review-count").val();
                    var maxReviewCount = $(".api-max-review-count").val();
                    var minWordCount = $(".api-min-word-count").val();
                    var pageNumber = $(".api-page-number").val();
                    var include_publishable = $(".api-testimonial-publishable-dropdown").select2('val');
                    var include_reviewed = $(".api-testimonial-reviewed-dropdown").select2('val');
                    var dayCount = $(".api-review-day").val();
                    var url = SocialView.base_url + "api/" + SocialView.client_id + "/javascript-code-ajax/" + appID;
                    if (typeof SocialView.show_js != 'undefined' && SocialView.show_js == 'nojs') {
                        url = url + '/'  + SocialView.show_js;
                    }
                    $.ajax({
                        type: "POST",
                        data: {
                            serviceType : "testimonials",
                            location_id: locationId,
                            physician_id: physicianId,
                            threshold: threshold,
                            minReviewCount: minReviewCount,
                            per_page: maxReviewCount,
                            minWordCount: minWordCount,
                            page: pageNumber,
                            include_publishable: include_publishable,
                            include_reviewed: include_reviewed,
                            dayCount: dayCount
                        },
                        beforeSend: function(xhr) {
                            $(".api-js-body").html('');
                            Custom.showLoader();
                        },
                        url: url
                    }).fail(function() {
                        Custom.hideLoader();
                    }).done(function(result) {
                        Custom.hideLoader();
                        $(".api-js-body").html(result);
                        $("html, body").animate({scrollTop: $('.api-js-body').offset().top - 60});
                    });
                }
                return false;
            });
            
            
            // Create Reviews
            $(".create-api-review-js").on("click", function(e) {
                var validated = validateReviewJSForm();
                var $wrapper = $(".api-reviews");
                if (validated) {
                    var avatarId = $(".api-avatar-dropdown").select2('val');
                    var appID = $(".api-application-dropdown").select2('val');
                    var threshold = $wrapper.find(".api-threshold").val();
                    var minReviewCount = $wrapper.find(".api-min-review-count").val();
                    var maxReviewCount = $wrapper.find(".api-max-review-count").val();
                    var minWordCount = $wrapper.find(".api-min-word-count").val();
                    var pageNumber = $wrapper.find(".api-page-number").val();
                    var include_publishable = $wrapper.find(".api-testimonial-publishable-dropdown").select2('val');
                    var include_reviewed = $wrapper.find(".api-testimonial-reviewed-dropdown").select2('val');
                    var fromDate = $wrapper.find(".api-from-date").val();
                    var toDate = $wrapper.find(".api-to-date").val();
                    var url = SocialView.base_url + "api/" + SocialView.client_id + "/javascript-code-ajax/" + appID;
                    if (typeof SocialView.show_js != 'undefined' && SocialView.show_js == 'nojs') {
                        url = url + '/'  + SocialView.show_js;
                    }
                    $.ajax({
                        type: "POST",
                        data: {
                            serviceType : "reviews",
                            avatar_id: avatarId,
                            threshold: threshold,
                            minReviewCount: minReviewCount,
                            per_page: maxReviewCount,
                            minWordCount: minWordCount,
                            page: pageNumber,
                            include_publishable: include_publishable,
                            include_reviewed: include_reviewed,
                            fromDate: fromDate,
                            toDate: toDate
                        },
                        beforeSend: function(xhr) {
                            $(".api-js-body").html('');
                            Custom.showLoader();
                        },
                        url: url
                    }).fail(function() {
                        Custom.hideLoader();
                    }).done(function(result) {
                        Custom.hideLoader();
                        $(".api-js-body").html(result);
                        $("html, body").animate({scrollTop: $('.api-js-body').offset().top - 60});
                    });
                }
                return false;
            });
            
            // Numeric validation
            $(".numeric-only").keydown(function(e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
            
            // Validate Testimonials Js form
            function validateJSForm() {
                var validated = true;
                var errors = [];
                
                if ($(".api-location-dropdown").select2('val') == "" && $(".api-physician-dropdown").select2('val') == "") {
                    validated = false;
                    errors.push("Please select either a Location or a Physician.");
                }else if ($(".api-location-dropdown").select2('val') == "" && $(".api-physician-dropdown").length == 0) {
                    validated = false;
                    errors.push("Please select a Location.");
                }
                
                if ($(".api-review-day").val() == "") {
                    validated = false;
                    errors.push("Please enter days.");
                }
                
                if ($(".api-min-review-count").val() != "" && $(".api-min-review-count").val() != "" && $(".api-min-review-count").val() > $(".api-max-review-count").val()) {
                    validated = false;
                    errors.push("Minmium number of reviews should not be higher than Maximum number of reviews.");
                }
                if (!validated) {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                } else {
                    Custom.hideMessages();
                }
                return validated;
            }
            
            // Validate Reviews Js form
            function validateReviewJSForm() {
                var validated = true;
                var errors = [];
                var scrollToTopItem = '';
                var scrollToTopItemFlag = false;
                var $wrapper = $(".api-reviews");
                if ($(".api-avatar-dropdown").select2('val') == "") {
                    validated = false;
                    errors.push("Please select an avatar");
                }
              
                if ($wrapper.find(".api-review-day").val() == "") {
                    validated = false;
                    errors.push("Please enter days.");
                }
              
                if ($wrapper.find(".api-min-review-count").val() != "" && $wrapper.find(".api-min-review-count").val() != "" && $wrapper.find(".api-min-review-count").val() > $wrapper.find(".api-max-review-count").val()) {
                    validated = false;
                    errors.push("Minmium number of reviews should not be higher than Maximum number of reviews.");
                }
                
                if (!validated) {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                } else {
                    Custom.hideMessages();
                }
                return validated;
            }
		},
	  loadAddApp:function(){
		  
		  $(".btn-add-app").closest("form").on("submit", function(e) {
				if(!validateNewForm()){
				e.preventDefault();
				return false;
		  }
				
				return true;
			});
		  
		    function validateNewForm(){
            	var validated = $('form').find('input:checked').length > 0;
                var errors = [];
                
                if (!validated) {
                    errors.push("Please select REST API options");
                }
                
                if (!validated) {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                } else {
                    Custom.hideMessages();
                }
                return validated;
            }
	  }
		,
	  loadConfigure:function(){
		  
		  if ($(".api-configuration-category").length) {
	            // that means category config table is present. If there is no rows present add one
	            var html;

	            $("table.api-configuration-category").each(function(){
	              var tbody = $(this).find("tbody");
	              
	            if (tbody.children('tr').length == 0) {
	                html = addNewCategoryRow(0);
	                tbody.append(html);
	               // tbody.find(".api-chosen").chosen();
	            } else {
	                tbody.children('tr').each(function() {
	                    var tr = $(this);
	                    var categoryId = tr.find(".category_id").val();
	                    var $cloneCategory = $(".total-categories").clone();
	                    var rowCount = tr.attr("row-key");
	                    var selectBox = '<select class="api-category form-control api-chosen" name="category_' + rowCount + '">' + $cloneCategory.html() +
	                        '</select>';
	                    tr.find("td.category-holder").append(selectBox);
	                    tr.find("select.api-chosen").val(categoryId);
	                   // tr.find("select.api-chosen").chosen().val(categoryId).trigger("liszt:updated");

	                });
	            }
	            });
		  }
		  
	         $('.btn-api-delete').click(function(e){
	        	 
	             
	            	 e.preventDefault();
	            	    var $link = $(this);
	            	    bootbox.confirm("Are you Sure want to delete ?", function (confirmation) {
	            	        confirmation && document.location.assign($link.attr('href'));
	            	    });  
	             });
		  
		  $(".api-configuration-category .add_more").live("click", function(e) {
              e.preventDefault();
              var $currentTable = $(this).parents("table.api-configuration-category");
              var currentRowCount = parseInt($currentTable.find("tbody tr:last").attr("row-key"));
              html = addNewCategoryRow(currentRowCount + 1);
              $currentTable.find("tbody").append(html);
              //$currentTable.find(".api-chosen").chosen();
          });
		  
		  $(".api-configuration-category .remove").live("click", function(e) {
              e.preventDefault();
              var me = $(this);
              var $currentTable = $(this).parents("table.api-configuration-category");
              var temp_id = $(this).attr("id");
              var split = temp_id.split("_");
              var id = split[1];
              if ($currentTable.find(".manual_row").length > 1) {
                $currentTable.find("#manual_row_" + id).remove();
                  if ($currentTable.find(".manual_row").length == 1) {
                    $currentTable.find(".manual_row a.remove").hide();
                  }

              } else {
                  alert("Atleast need one row");
              }
          });
		  
		  $(".api-category").live(
	                "change",
	                function(e) {
	                    var me = $(this);
	                    var categoryId = $(this).val();
	                    if (categoryId != "") {

	                        var categoryName = me.find(
	                            "option[value='" + categoryId + "']").text();
	                        categoryName = categoryName.replace(/-/g, "");
	                        categoryName = categoryName.slice(1);
	                        me.parents("tr").find(".custom_name").val(categoryName);
	                        me.parents("tr").find(".category_id").val(categoryId).attr("title",categoryName);
	                    } else {

	                        me.parents("tr").find(".custom_name").val("");
	                        me.parents("tr").find(".category_id").val("").attr("title","");
	                    }

	                }); 
		  $(".api-app-secret-link").live("click", function(e) {
	            e.preventDefault();

	            var secret = $(this).attr("secret");
	            $(this).text(secret);

	        });
		  $("#save-api-testimonial-configuration").live("click", function(e) {
	            e.preventDefault();
	            var $form = $(this).parents("form");
	            var formId = $form.attr("id");
	            //validate the configuration here
	            var errorObj = $(".error-messages");
	            var errors = [];
	            var validated = true;
	            if ($("#"+formId+" select.api-survey-dropdown").val() == "") {
	                validated = false;
	                errors.push("Please select a source");
	            }
	            if ($form.find("select[name='category_0']").val() == "") {
	                validated = false;
	                errors.push("Please select the primary category");
	            }
	            var categories = {};
	            
	            $form.find("input.category_id").each(function(){
	              var category = $(this).val();
	              if(category != "" && categories.hasOwnProperty(category)){
	                validated = false;
	                var title = $(this).attr("title");
	                errors.push("You have selected category \""+title+"\" multiple times. One category can be selected only once.");
	                return false;
	              } else{
	                categories[category] = category;
	              }
	            });
	            
	            
	            if (validated) {
	              $form.submit();
	            }

	            errorObj.html('');
	            if (!validated) {
                    Custom.showMessages('error', 'Please check following fields.', errors);
                } else {
                    Custom.hideMessages();
                }

	            return validated;

	        });
		  
		  $("#save-api-review-configuration").live("click", function(e) {
	          e.preventDefault();
	          var $form = $(this).parents("form");
	          //validate the configuration here
	          var errorObj = $(".error-messages");
	          var errors = [];
	          var validated = true;
	          if ($form.find(".api-survey-dropdown").select2('val') == "") {
	            validated = false;
	            errors.push("Please select a source");
	          }
	          if ($form.find("select[name='category_0']").val() == "") {
	            validated = false;
	            errors.push("Please select the primary category");
	          }
	          var categories = {};
	          
	          $form.find("input.category_id").each(function(){
	            var category = $(this).val();
	            if(category != "" && categories.hasOwnProperty(category)){
	              validated = false;
	              var title = $(this).attr("title");
	              errors.push("You have selected category \""+title+"\" multiple times. One category can be selected only once.");
	              return false;
	            } else{
	              categories[category] = category;
	            }
	          });
	          
	          
	          if (validated) {
	            $form.submit();
	          }
	          
	          errorObj.html('');
	          if (!validated) {
                  Custom.showMessages('error', 'Please check following fields.', errors);
              } else {
                  Custom.hideMessages();
              }
	          
	          return validated;
	          
	        });
		  
		  function addNewCategoryRow(rowCount) {
	            var $cloneCategory = $(".total-categories").clone();
	            var html = '<tr class="manual_row" row-key="' + rowCount + '" id="manual_row_' + rowCount + '"> \
	            <td class="category-holder"><select class="api-category form-control input-sm " name="category_' + rowCount + '">' + $cloneCategory.html() +
	                '</select><input type="hidden" class="category_id" name="hidden_category_' + rowCount + '" value=""></td> \
	          <td><input type="text" class="custom_name form-control input-sm" name="custom_name_' + rowCount + '" value=""></td> \
	          <td>';
	            if (rowCount > 0) {
	                html += '<a href="#" class="tools remove" id="remove_' + rowCount + '" title="Remove"><i class="fa fa-minus-circle"></i></a>';
	            } else {
	                html += '<a href="#" class="tools primary-category" id="primary_1" title="Primary Category"><i class="fa fa-key"></i></a>';
	            }
	            html += '</td> </tr>';
	            return html;
	        }
	  }
	};
}();
