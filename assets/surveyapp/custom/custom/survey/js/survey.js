var Survey = function() {
	return {
		process : function (){
			
        var surveyQuestions = {};
        var surveyTotalPageCount = parseInt($("#survey-page-total-count").val());
        
        var surveyPageIdPrefix = "survey-page-";
        var boolArray = {
            'true': true,
            'false': false
        };
        var jqueryValidateClass = "required";
        var validationErrorClass = "validation-error";
        var hiddenClass = "hide-me";
        hide_or_unhide_group_questions("#survey-page-1 .question-group");
        
        if($("#bf-survey").length){
          // that means survey processing page
          set_survey_progress_bar(1);
        }
        
        if($("#entity-survey").length){
          $("#entity-survey").validate();
          $(".chosen-show").chosen();
        }
        
        $.uniform.restore('.options input:radio, .options input:checkbox, .question-disclaimer input:checkbox');
        $('.options input:radio').jqTransRadio();
        $('.options input:checkbox').jqTransCheckBox();
        $('.question-disclaimer input:checkbox').jqTransCheckBox();
        $("#bf-survey select.no-autocomplete").jqTransSelect();
        $("#bf-survey select.chosen-autocomplete").each(function(){
          var selectBox = $(this);
          var sname = $(this).attr("name");
          var questionId = sname.split("_").pop();
          var temp = get_options_from_js(questionId);
          var textfield = $(this).next('input.auto-text');
          textfield.autocomplete({
            source: temp,
            change: function( event, ui ) {
              if(ui.item == null && selectBox.find('option:selected').length){
                selectBox.val('');
                selectBox.trigger("change");
              }
              return false;
            },
            select: function( event, ui ) {
              textfield.val( ui.item.label );
              selectBox.val( ui.item.value );
              selectBox.trigger("change");
              return false;
            },
            focus: function(event, ui){
            	textfield.val( ui.item.label );
                selectBox.val( ui.item.value );
                selectBox.trigger("change");
                return false;
            }
          });
        });
        
        function get_options_from_js(questionId){
          var output;
          var questions = Questions[questionId];
          if(questions.length == 0){
            output = false;
          }
          else {
            output = questions;
          }
          return output;
        }
        $("#bf-survey select.chosen-autocomplete-editable").each(function(){
          var autoEditBox = $(this);
          var autoEditName = autoEditBox.attr("name");
          var questionId = autoEditName.split("_").pop();
          var qoptions = get_options_from_js(questionId);
          var autoText = autoEditBox.next("input.auto-edit-text");
          autoText.autocomplete({
            source: qoptions,
            change: function( event, ui ) {
              
              if(ui.item == null && autoEditBox.find('option:selected').length){
                autoEditBox.val('');
                autoEditBox.trigger("change");
              }
              return false;
            },
            select: function( event, ui ) {
//              console.log(ui);
              autoText.val( ui.item.label );
              autoEditBox.val( ui.item.value );
              autoEditBox.trigger("change");
              return false;
            }
          });
        });
        
        /*.chosen({
          create_option: function(term){
            var chosen = this;
            chosen.append_option({
              value: term,
              text: "Custom: " + term
            });
          },
          persistent_create_option: false
        });
*/
        $("div.question").each(function() {
            var objQuestion = $(this);
            var question = {};
            var unformattedId = $(this).attr("id");
            var questionId = unformattedId.split("-").pop();
            var responseRequired = $(this).attr("response-required");
            question.id = questionId;
            question.depended_questions = [];
            question.has_rule = false;
            question.response_required = boolArray[responseRequired];
            if (objQuestion.hasClass("has-rule")) {
                var objRuleset = objQuestion.children('div.ruleset');
                question.has_rule = true;
                question.rule_validated = false;
                var ruleSet = {};
                ruleSet.operator = objRuleset.attr('operator');
                ruleSet.rules = [];
                objRuleset.find("span.rulespan").each(function() {
                    var objRule = $(this);
                    var rule = {};
                    rule.constraint = objRule.attr("constraint");
                    rule.question = objRule.attr("question");
                    rule.option = objRule.attr("option");
                    ruleSet.rules.push(rule);

                    // add the current question to the dependent
                    // questions array of parent question
                    if (surveyQuestions[objRule.attr("question")]) {
                        if (($.inArray(questionId, surveyQuestions[objRule.attr("question")].depended_questions)) < 0) {
                            surveyQuestions[objRule.attr("question")].depended_questions.push(questionId);
                        }
                    } else {
                    //    console.log("there is no such questions exist");
                    }
                });
                question.ruleset = ruleSet;
            } else {

                if (question.response_required) {
                    add_class_to_question(question.id, jqueryValidateClass);
                }
            }
            // surveyQuestions.push(question);
            surveyQuestions[question.id] = question;
            set_question_numbers();
        });
        
        function get_slider_option(questionId, selectedSlider){
          var questionDivObj = $("#question-"+questionId);
          var sliderOptions = questionDivObj.children('div.options').children('.warddrob').children('.slider-options').children('span:nth-child('+selectedSlider+')');
          return sliderOptions;
        }
        
        function set_slider_question_value(questionId, selectedSlider){
          var option = get_slider_option(questionId, selectedSlider);
          if(option.length){
            var optionId = option.attr('option-id');
            $("input[name='question_"+questionId+"']").val(optionId);
            $("input[name='question_"+questionId+"']").trigger('change');
          }
        }
        /*
        $('#promoter-survey-form').ajaxForm({
            beforeSubmit: function() {
              
              var parentObj = $("input[type='submit'].submit-survey").parents(".survey-page");
              // validate the current page here start
              var validated = validate_current_page(parentObj);
              //  $('#survey-form').validate({});
              if(validated){
                // that means thye page is validated perfectly and gonna start send to server.
                // Start the loading here
				$("input[type='submit'].submit-survey").hide();
                //parentObj.addClass('dont-show-this-page');
                //parentObj.removeClass('show-this-page');
                $(".survey-to-server").removeClass('hidden');
                set_survey_progress_bar(-1);
                $("input[type='submit'].submit-survey").attr('disbaled','disbaled');
              }
                return validated;
            },
            uploadProgress : function(event, position, total, percentComplete){
           //   console.log(percentComplete);
            },
            success: function(resp) {
                //$("#survey-response").html(resp);
				var processPage = $("#survey-process-page").val();
				if (resp != "") {
					processPage += '/'+resp;
				}
               window.location=processPage;
            }
        });*/
		/*
		$('#survey-form').ajaxForm({
            beforeSubmit: function() {
              
              var parentObj = $("input[type='submit'].submit-survey").parents(".survey-page");
              // validate the current page here start
              var validated = validate_current_page(parentObj);
              //  $('#survey-form').validate({});
              if(validated){
                // that means thye page is validated perfectly and gonna start send to server.
                // Start the loading here
                parentObj.addClass('dont-show-this-page');
                parentObj.removeClass('show-this-page');
                $(".survey-to-server").removeClass('hidden');
                set_survey_progress_bar(-1);
                $("input[type='submit'].submit-survey").attr('disbaled','disbaled');
              }
                return validated;
            },
            uploadProgress : function(event, position, total, percentComplete){
           //   console.log(percentComplete);
            },
            success: function(resp) {
                $("#survey-response").html(resp);
                var finishPage = $("#survey-finish-page").val();
               window.location=finishPage;
                
            }
        });
		*/
        //set highlight in source link
        $(".page-toolbar").on("click",function(){
        	 $('.page-toolbar').find('img').removeClass('active1');
        	    $('.page-toolbar').find('img').removeClass('active2');
        	    //$(this).next().find('img').addClass('active2');
        	    $(this).closest('div').find('img').addClass('active2');
        });
        //set highlight in source link
        $(".promoter-source-link .jqTransformRadio").on("click",function(){
        	 $('.page-toolbar').find('img').removeClass('active1');
        	 $('.page-toolbar').find('img').removeClass('active2');
     	   $(this).next().closest('div').find('img').addClass('active2');
        });
        
		$('#survey-form').submit(function(e){
			e.preventDefault();
			var me = $(this);
			 var parentObj = $("button[type='submit'].submit-survey").parents(".survey-page");
             // validate the current page here start
             var validated = validate_current_page(parentObj);
             //  $('#survey-form').validate({});
             if(validated){
               // that means thye page is validated perfectly and gonna start send to server.
               // Start the loading here
               parentObj.addClass('dont-show-this-page');
               parentObj.removeClass('show-this-page');
               $(".survey-to-server").removeClass('hidden');
               set_survey_progress_bar(-1);
               $("button[type='submit'].submit-survey").attr('disbaled','disbaled');
               
               var validatePromoterQuestion = 0;
               var sourceId = "";
               var sourceLinkLength = 0;
              
             }
             if(validated) {
            	 if($('.link-radio-check').is(':checked')) {
              	   
              	   validatePromoterQuestion =1;
              	   sourceId = $('form .link-radio-check:checked').val();
              	   var sourceUrl = $(".source-url-"+sourceId).val();
              	   sourceLinkLength = $('.rule-validate-success .source-url-'+sourceId).length;
              	   if(sourceLinkLength >0){
              		 window.open("about:blank", "sourcePage");

              	   }
              	  
                 }
            	 $.ajax({
            		  type: "POST",
            		  url: me.attr("action"),
            		  beforeSend: function( xhr ) {
            			  Custom.showLoader(".survey-to-server");
        			  },
            		  data: me.serialize(),
            		}).done(function(resp){
            			var finishPage = $("#survey-finish-page").val();
            			if( typeof resp == 'object' && resp.StatusCode == 200) {
//            				importantStuff = window.open('', '_blank');
            				if(validatePromoterQuestion == 1 && sourceUrl !="" && sourceLinkLength >0){
           					 //var redirectWindow = window.open(sourceUrl, '_blank');
            				var finishPage = $("#survey-finish-page").val();
            				window.open(sourceUrl, 'sourcePage');
         				   window.location=finishPage;
           				}else{
           					var finishPage = $("#survey-finish-page").val();
           				   window.location = finishPage;
           				}
            				
            				
            			} else {
            				parentObj.removeClass('dont-show-this-page');
            				parentObj.addClass('show-this-page');
            				$(".survey-to-server").addClass('hidden');
            				set_survey_progress_bar(-1);
            				//$("button[type='submit'].submit-survey").attr('disbaled','disbaled');
            			}
            		});
             }
			
			return false;
		});
		
		// survey submit by source url & id's
		
		$('.submit-survey-by-source1').on("click",function(e){
			e.preventDefault();
			var me = $(this);
			var sourceId =$(this).attr("sourceId");
			var sourceUrl =$(this).attr("sourceUrl");
			var sourceQuestionName = $(this).attr("question_name");
			var surveyFormData = new FormData();
			 var parentObj = $("button[type='submit'].submit-survey").parents(".survey-page");
             // validate the current page here start
             var validated = validate_current_page(parentObj);
             //  $('#survey-form').validate({});
//             if(validated){
               // that means thye page is validated perfectly and gonna start send to server.
               // Start the loading here
               parentObj.addClass('dont-show-this-page');
               parentObj.removeClass('show-this-page');
               $(".survey-to-server").removeClass('hidden');
               set_survey_progress_bar(-1);
               $("button[type='submit'].submit-survey-by-source").attr('disbaled','disbaled');
//             }
//             if(validated) {
            	 var surveyFormData = $('#survey-form').serializeArray();
            	 surveyFormData.push({ name: sourceQuestionName, value: sourceUrl });
//            	 surveyFormData.push({ name: "sourceId", value: sourceId });
//            	 console.log(surveyFormData); return false;
            	 $.ajax({
            		  type: "POST",
            		  url: $('#survey-form').attr("action"),
            		  beforeSend: function( xhr ) {
            			  Custom.showLoader(".survey-to-server");
        			  },
            		  data: surveyFormData,
            		}).done(function(resp){
            			if( typeof resp == 'object' && resp.StatusCode == 200) {
            				var finishPage = $("#survey-finish-page").val();
            				window.location=sourceUrl;
            			} else {
            				parentObj.removeClass('dont-show-this-page');
            				parentObj.addClass('show-this-page');
            				$(".survey-to-server").addClass('hidden');
            				set_survey_progress_bar(-1);
            				//$("button[type='submit'].submit-survey").attr('disbaled','disbaled');
            			}
            		});
//             }
			
			return false;
		});

        function radio_on_change(obj) {
            obj.change(function() {
                var objOption = $(this);
                var questionIdString = objOption.attr("name");
                var questionId = questionIdString.split("_").pop();
                var optionId = objOption.attr("id");
                // trigger rule set processing
           //     console.log($(this));
                processRuleset(questionId, optionId);
                //  checkDependentQuestions(questionId);
                });
        }
        $('#bf-survey select').live("change", function() {
          var objOption = $(this);
        //  console.log("sss");
          var questionIdString = objOption.attr("name");
          var questionId = questionIdString.split("_").pop();
          var optionId = objOption.val();
          // trigger rule set processing
          processRuleset(questionId, optionId);
          //  checkDependentQuestions(questionId);
          });

        $("input[type='hidden'].is-a-question").change(function(){
          var objOption = $(this);
          var optionId = $(this).val();
          if(optionId != null){
            var questionIdString = objOption.attr("name");
            var questionId = questionIdString.split("_").pop();
         //   console.log("a slider has activated:"+questionId);
            processRuleset(questionId, optionId);
          }
        });
        
        $("select.slider-select").each(function(){
          var options = $(this).find('option');
          if($(this).parents(".large-slider").length){
            var count = Math.round(options.length/2);
          }
          else{
            var count = options.length;
          }
            
          var middle = 1;
          var value = $(options[middle-1]).attr('value');
          $(this).selectToUISlider({labels:count});
          $(this).val(value);
          $(this).trigger('change');
          
        });
        
        $("input[type='text'].is-a-question").change(function(){
          var inputName = $(this).attr('name');
          var questionId = inputName.split('_').pop();
          var parentDiv = get_question_div_object(questionId);

          parentDiv.removeClass(validationErrorClass);
          parentDiv.find('label.error').html('');
        });
        $('input[type="radio"]').change(function() {
            var objOption = $(this);
            if (objOption.attr('checked') == "checked") {
                var questionIdString = objOption.attr("name");
                var questionId = questionIdString.split("_").pop();
                var optionId = objOption.attr("id");
                // trigger rule set processing
               // console.log("Clicked on a radio Button:"+optionId);
                processRuleset(questionId, optionId);
                //  checkDependentQuestions(questionId);
                }
            
            if(objOption.hasClass('radio-text')){
              var inputId = objOption.attr("for");
              var inputObj = $("#"+inputId);
              if (objOption.attr('checked') == "checked") {
                inputObj.removeClass(hiddenClass);
                inputObj.focus();
              }
              else{
                inputObj.addClass(hiddenClass);
              }
            }
        });
        
        $('input[type="checkbox"].is-a-question').change(function() {
          var objOption = $(this);
            var questionIdString = objOption.attr("name");
            var questionId = questionIdString.split("_").pop();
            questionId = questionId.replace("[]","");
            var optionId = objOption.val();
            // trigger rule set processing
            //     console.log("Clicked on a checkbox:"+optionId);
            processRuleset(questionId, optionId);
            //  checkDependentQuestions(questionId);
            if(objOption.hasClass('checkbox-text')){
            	var inputId = objOption.attr("for");
                var inputObj = $("#"+inputId);
                if (objOption.is(":checked")) {
                	inputObj.removeClass(hiddenClass);
                  inputObj.focus();
                }
                else{
                  inputObj.addClass(hiddenClass);
                }
              }
        });

        /*
         *  process the rules of every question to find out whether there is any 
         *  question has rule validating successfully
         */
        function processRuleset(questionId, optionId) {
        //    console.log("processRuleset for Question:"+questionId);
            // do other stuffs start
            var parentDiv = get_question_div_object(questionId);

            parentDiv.removeClass(validationErrorClass);
            parentDiv.find('label.error').html('');
            // do other stuffs end

            var dependentQuestions = surveyQuestions[questionId].depended_questions;
         //   console.log("dependentQuestions for question "+questionId+" are "+dependentQuestions);
            $.each(dependentQuestions, function(key, dependentQuestionId) {
                var question = surveyQuestions[dependentQuestionId];
                // var questionId = question.id; 
                if (question.has_rule) {
                    if (question.ruleset.operator == "") {
                        // Only one question
                        var currentRule = question.ruleset.rules[0];
                        var ruleValidated = false;
                        switch (currentRule.constraint) {
                        case "option_eq":
                      //    console.log(get_current_value(currentRule.question));
                            if (currentRule.question == questionId && rule_option_validate_eq(currentRule.question,currentRule.option)) {
                                ruleValidated = true;
                            } else {
                            }
                            break;
                        case "option_ne" :
                          if (currentRule.question == questionId && rule_option_validate_ne(currentRule.question,currentRule.option)) {
                            ruleValidated = true;
                        }
                          break;
                        }
                        if (ruleValidated) {
                            rule_validate_success(question.id);
                        } else {

                            rule_validated_failed(question.id);
                        }

                    } else {
                        // It is a ruleset;
                        var logicalOperator = question.ruleset.operator;
                        var rules = question.ruleset.rules;
                        var ruleStatus = [];
                        $.each(rules, function(index, rule) {
                            switch (rule.constraint) {
                            case "option_eq":

                                if (rule_option_validate_eq(rule.question,rule.option)) {
                                    ruleStatus.push(true);
                                } else {
                                    ruleStatus.push(false);
                                }
                                break;
                            case "option_ne":
                              if (rule_option_validate_ne(rule.question,rule.option)) {
                                ruleStatus.push(true);
                            } else {
                                ruleStatus.push(false);
                            }
                              break;
                            }

                        });
                        var outputStatus = ruleStatus[0];
                        $.each(ruleStatus, function(i, status) {

                            if (logicalOperator == "or") {
                                outputStatus = outputStatus || status;
                            } else if (logicalOperator == "and") {
                                outputStatus = outputStatus && status;
                            }
                        });
                        if (outputStatus) {
                            rule_validate_success(question.id);
                        } else {
                            rule_validated_failed(question.id);
                        }

                    }

                }

            });

        }
        
        function rule_option_validate_eq(questionId, ruleOption){
          var result = false; 
          var value = get_current_value(questionId);
          var questionType = get_question_type(questionId);
          switch (questionType) {
          case "checkbox":
                // the return will be an array. so check in array
                var re = $.inArray(ruleOption, value);
                if(re >= 0){
                  result = true;
                }
            break;
            default :
              if(ruleOption == value){
                result = true;
              }
              break;
          }
          
          return result;
        }
        
        function rule_option_validate_ne(questionId, ruleOption){
          var result = true; 
          var value = get_current_value(questionId);
          var questionType = get_question_type(questionId);
          switch (questionType) {
          case "checkbox":
            // the return will be an array. so check in array
            var re = $.inArray(ruleOption, value);
            if(re >= 0){
              result = false;
            }
            break;
          default :
            if(ruleOption == value){
              result = false;
            }
          break;
          }
          
          return result;
        }
        
        function validate_current_page(parentObj){
          var validated = true;
          var errorQuestions = [];
          parentObj.children('div.questions').find("div.question .email").each(function(){
        	  var emailObj = $(this);
        	  if(emailObj.val() !=""){
        		  var emailVal = emailValidation(emailObj.val());
        		  if(emailVal){
        			  validated = false;
                	  emailObj.closest("div.question").find("label.error").html('Please enter a valid email address').css('display', 'block').addClass('force-error');
        		  }
        	  }
        	 
          });
          parentObj.children('div.questions').find("div.rule-validate-success[response-required='true']").each(function() {
        	  var sparentObj = $(this);
              var questionId = get_question_id_from_attributeId($(this).attr("id"));
              var qObj = get_question_object(questionId);
              var questionType = get_question_type(questionId);              
              if(questionType == "checkbox"){
                  //console.log(qObj.is(":checked"));
                  if(qObj.is(":checked")){
                    sparentObj.removeClass(validationErrorClass);
                    sparentObj.removeClass('force-error');
                  }
                  else{
                    sparentObj.addClass(validationErrorClass);
                    validated = false;
                    var parentDiv = get_question_div_object(questionId);
                    errorQuestions.push(parentDiv);
                    parentDiv.find('label.error').html('Please select atleast one').css('display', 'block').addClass('force-error');
                  }
                }
              if(questionType == "checkbox"){
                //console.log(qObj.is(":checked"));
                if(qObj.is(":checked")){
                  sparentObj.removeClass(validationErrorClass);
                  sparentObj.removeClass('force-error');
                }
                else{
                  sparentObj.addClass(validationErrorClass);
                  validated = false;
                  var parentDiv = get_question_div_object(questionId);
                  errorQuestions.push(parentDiv);
                  parentDiv.find('label.error').html('Please select atleast one').css('display', 'block').addClass('force-error');
                }
              }
              else if(questionType == 'autocomplete'){
            	  if(qObj.val() == "" || $(":selected",qObj).text() != $("input[name='auto_widget_"+questionId+"']").val()){
              		sparentObj.addClass(validationErrorClass);
              		validated = false;
              		var parentDiv = get_question_div_object(questionId);
              		errorQuestions.push(parentDiv);
              		parentDiv.find('label.error').html('Please select atleast one').css('display', 'block');
              	}  
              }
              else if(questionType == 'autocomplete_editable'){
                if(qObj.val() == "" && $("input[name='auto_edit_widget_"+questionId+"']").val() == ""){
                  // that means no option found for the entered criteria
                    sparentObj.addClass(validationErrorClass);
                    validated = false;
                    var parentDiv = get_question_div_object(questionId);
                    errorQuestions.push(parentDiv);
                    parentDiv.find('label.error').html('Please select atleast one').css('display', 'block');
                }
                else{
                  sparentObj.removeClass(validationErrorClass);
                }
              }
              else{
                
              if (!qObj.valid()) {
                  sparentObj.addClass(validationErrorClass);
                  validated = false;
                  var parentDiv = get_question_div_object(questionId);
                  errorQuestions.push(parentDiv);
              } else {
                  sparentObj.removeClass(validationErrorClass);
              }
              }

          });
          if(!validated){
          	  if(errorQuestions.length){
          		  errorQuestions.reverse();
          		  var obj = errorQuestions.pop();
          		  var focus_id = obj['selector'];
          		  $('#focus_elem').attr('onclick', "window.location='"+focus_id+"'");
          		  $('#focus_elem').click();
          	  }
          }
          
          return validated;
        }
        $("button.next-page").live("click", function(e) {
            e.preventDefault();
       //     console.log("clicked on a next btton");
            var parentObj = $(this).parents(".survey-page");
            // validate the current page here start
            var validated = validate_current_page(parentObj);

            // validate the current page here end
            // go to next if and only if validated = true
            if (validated) {
                var nextPageObj = parentObj.next('.survey-page');
                var nextPageId = nextPageObj.attr("id");
                var pageArray = nextPageId.split("-");
                var nextPageInt = pageArray[pageArray.length - 1];
                while (parseInt(nextPageInt) < surveyTotalPageCount && !page_is_valid(surveyPageIdPrefix + nextPageInt)) {
                    nextPageInt++;
                }
                nextPageId = surveyPageIdPrefix + nextPageInt;
                parentObj.addClass("dont-show-this-page");
                parentObj.removeClass("show-this-page");
                if(!page_is_valid(nextPageId)){
                  // that means the last page has nothing to show. So just trigger the submit button
                  $("button[type='submit'].submit-survey").trigger('click');
                }
                else{
                  var nextPageObj = $("#" + nextPageId);
                  nextPageObj.removeClass("dont-show-this-page");
                  hide_or_unhide_group_questions("#"+nextPageObj.attr('id') + " .question-group");
                  nextPageObj.addClass("show-this-page");
                  set_question_numbers();
                  set_survey_progress_bar(nextPageInt);
                  $("html, body").scrollTop(0);
                }
            }
        });
        $("button.previous-page").live("click", function(e) {
            e.preventDefault();
       //     console.log("clicked on a previous btton");
            var parentObj = $(this).parents(".survey-page");
            var prevPageObj = parentObj.prev('.survey-page');
            var prevPageId = prevPageObj.attr("id");
            var pageArray = prevPageId.split("-");
            var prevPageInt = pageArray[pageArray.length - 1];

            while (prevPageInt > 1 && !page_is_valid(surveyPageIdPrefix + prevPageInt)) {
                prevPageInt--;
            }
            prevPageId = surveyPageIdPrefix + prevPageInt;
            parentObj.addClass("dont-show-this-page");
            parentObj.removeClass("show-this-page");
            var prevPageObj = $("#" + prevPageId);
            prevPageObj.removeClass("dont-show-this-page");
            hide_or_unhide_group_questions("#"+prevPageObj.attr('id') + " .question-group");
            prevPageObj.addClass("show-this-page");
            set_question_numbers();
            set_survey_progress_bar(prevPageInt);
            $("html, body").scrollTop(0);

        });

        function page_is_valid(pageId) {
            var pageObj = $("#" + pageId);
            var availableQuestionCount = pageObj.children(".questions").find("div.rule-validate-success").length;
//            console.log(pageObj.find("div.question-disclaimer"));
            if(pageObj.find("div.question-disclaimer").length){
              // that means it is last page and it should be shown because of that *** discalimer thing
              return true;
            }
            return Boolean(availableQuestionCount);
        }

        /*
         * If a question has succeeded its rule process
         * this function will be do the rest of items
         * 
         * 
         */
        function rule_validate_success(questionId) {
       //     console.log("rule_validate_success for "+questionId);
            if (!surveyQuestions[questionId].rule_validated) {
                surveyQuestions[questionId].rule_validated = true;
                //   console.log(surveyQuestions[questionId]);
                var objQuestion = $("#question-" + questionId);
                objQuestion.addClass("rule-validate-success");
                objQuestion.removeClass("rule-validate-failed");
                if (surveyQuestions[questionId].response_required) {
                    add_class_to_question(questionId, jqueryValidateClass);
                }
                set_question_numbers();
                var page = objQuestion.parents(".survey-page");
                hide_or_unhide_group_questions("#"+page.attr('id') + " .question-group");
            }
        }
        /*
         * If a question has failed its rule process
         * this function will be do the rest of items
         */
        function rule_validated_failed(questionId) {
     //       console.log("rule_validated_failed "+questionId);
            if (surveyQuestions[questionId].rule_validated) {
                surveyQuestions[questionId].rule_validated = false;
                //     console.log(surveyQuestions[questionId]);
                var objQuestion = $("#question-" + questionId);
                objQuestion.removeClass("rule-validate-success");
                objQuestion.addClass("rule-validate-failed");
                var currentValue = get_current_value(questionId);
//                if (currentValue != "") {
                    unset_current_value(questionId);
//                }

                if (surveyQuestions[questionId].response_required) {
                    remove_class_from_question(questionId, jqueryValidateClass);
                }
                set_question_numbers();
                var page = objQuestion.parents(".survey-page");
                hide_or_unhide_group_questions("#"+page.attr('id') + " .question-group");
            }
        }
        /*
         * get the type of a question
         */
        function get_question_type(questionId) {
            var objQue = $("#question-" + questionId);
            var questionType = objQue.attr("question-type");
            return questionType;
        }

        /*
         * get the current selected value of a question
         */
        function get_current_value(questionId) {
            var selectedValue = "";
            var questionType = get_question_type(questionId);

            switch (questionType) {

            case "radio":
                var objSelected = $("input[type='radio'][name='question_" + questionId + "']:checked");
                if (objSelected.length) {
                    selectedValue = objSelected.val();
                }
                break;
            case "checkbox":
                var values = [];
                $("input[type='checkbox'][name='question_" + questionId + "[]']:checked").each(function(i){
                  values[i] = $(this).val();
                });
                return values;
                break;
            case "slider":
              var objSelected = $("select[name='question_" + questionId + "']");
              if (objSelected.length) {
                  selectedValue = objSelected.val();
              }
                break;
            case "autocomplete":
            case "autocomplete_editable":
            case "select_combo":
                var objSelected = $("select[name='question_" + questionId + "']");
                if (objSelected.length) {
                    selectedValue = objSelected.val();
                }
                break;
            case "textfield" : 
              var objSelected = $("input[type='text'][name='question_" + questionId + "']");
              if (objSelected.length) {
                  selectedValue = objSelected.val();
              }
              break;
            case "textarea" : 
              var objSelected = $("textarea[name='question_" + questionId + "']");
              if (objSelected.length) {
                selectedValue = objSelected.val();
              }
              break;
            default : 
              var objSelected = $("*[name='question_" + questionId + "']");
            if (objSelected.length) {
              selectedValue = objSelected.val();
            }
            break;
            }
        //    console.log("Question "+questionId+" has value: "+selectedValue);
            return selectedValue;
        }

        function add_class_to_question(questionId, className) {
            $("*[name='question_" + questionId + "']").addClass(className);
        }
        function remove_class_from_question(questionId, className) {
            $("*[name='question_" + questionId + "']").removeClass(className);
        }

        function get_question_id_from_attributeId(pageId) {
            var pageArray = pageId.split("-");
            var questionId = pageArray[pageArray.length - 1];
            return questionId;
        }

        function get_question_object(questionId) {
          var qObj;
          var questionType = get_question_type(questionId);
              switch (questionType) {
              case "checkbox":
                qObj = $("*[name='question_" + questionId + "[]']");
                break;
              default:
                qObj = $("*[name='question_" + questionId + "']");
                break;
              }
            return qObj;
        }

        function get_question_div_object(questionId) {
            var qDivObj = $("#question-" + questionId);
            return qDivObj;
        }

        function unset_current_value(questionId) {
            var qObj = get_question_object(questionId);
            var questionType = get_question_type(questionId);
            switch (questionType) {
            case "radio":

                var checkedobj = qObj.filter(':checked');
                if (checkedobj.length) {
                    checkedobj.each(function() {
                  //      console.log('should remove jq class of option '+$(this).attr('id'));
                        $(this).prop('checked', false);
                        if($(this).prev("a.jqTransformRadio").length){
                        $(this).prev("a.jqTransformRadio").removeClass('jqTransformChecked');
                        }
                    });
                    qObj.trigger("change");
                }
                break;
            case "checkbox":
              qObj = get_question_object(questionId);
              var checkedobj = qObj.filter(':checked');
              if (checkedobj.length) {
                checkedobj.each(function() {
                  //      console.log('should remove jq class of option '+$(this).attr('id'));
                  $(this).prop('checked', false);
                  if($(this).prev("a.jqTransformCheckbox").length){
                    $(this).prev("a.jqTransformCheckbox").removeClass('jqTransformChecked');
                  }
                });
                qObj.trigger("change");
              }
              break;

            case "select_combo":
                qObj.find('option').removeAttr('selected');
                qObj.trigger("change");
                break;
            case "autocomplete":
              qObj.val('');
              qObj.next('input.auto-text').val('');
              qObj.trigger("change");
              break;
            case "autocomplete_editable":
              qObj.val('');
              qObj.next('input.auto-edit-text').val('');
              qObj.trigger("change");
              break;
            default:
                qObj.val('');
                qObj.trigger("change");
                break;
            }
        }

        function set_question_numbers() {
            var co = 1;
            $(".has-question-number").each(function() {
                if( ($(this).hasClass('rule-validate-success') || 
                    $(this).hasClass('group-rule-validate-success')) && (!$(this).hasClass('hide-me')) ){
                  var string = '';
                  if(co < 10){
                    string = "&nbsp;"+co;
                  }
                  else{
                    string = co;
                  }
                $(this).find(".question-number").html(string);
                co++;
                }
            });

        }
        
        function set_survey_progress_bar(pageNo){
          var globalBar = $("#gloabal-progressbar");
          if(pageNo == -1){
            globalBar.removeClass('hide-me');
            globalBar.children(".current-progress").css("width","100%");
          }
          else{
            var pagePrefix = "#survey-page-";
            var pageObj = $(pagePrefix+pageNo);
            var currentProgress = pageObj.children('.current-progress').attr('progressbar-width');
            globalBar.removeClass('hide-me');
            globalBar.children(".current-progress").css("width",currentProgress+"%");
          }
        }
        
        function hide_or_unhide_group_questions(selector){
          
          var selectorObj = $(selector);
          selectorObj.each(function(){
            if($(this).find("div.rule-validate-success").length){
              $(this).removeClass("hidden");
              $(this).addClass('group-rule-validate-success');
            }
            else{
              $(this).addClass('hidden');
              $(this).removeClass('group-rule-validate-success');
            }
          });
          
        }
        function emailValidation(email){
        	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		if(!regex.test(email)){
    			return true;
    		}else{
    			return false;
    		}
        }
        
        if($(".question-number-before").length){
        	if ($.browser.msie) {
        		if($.browser.version < 10){
        			// IE 9 or older
        			$(".question-number-before").addClass( "below-ie-10" );
        		}else{
        			// IE 10 or above
        			$(".question-number-before").addClass( "ie-10-or-above" );
        		}
            }
        }
        
        $.validator.messages.required = 'This question must be answered';
        
        var myW = 500;
        $(".jqTransformHidden").css("width", myW);
        $(".jqTransformHidden").parents(".jqTransformSelectWrapper").css("width", myW);
        $(".jqTransformHidden").parents(".jqTransformSelectWrapper").find("ul,span").css("width", myW);
        
        
        
		}
    };
}();
window.setTimeout(function(){
	$(".links-in-finish").show();
},8000);