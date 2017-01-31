/* Jquery Extensions*/
(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

$(function() {
	
	var client = SocialView.Filter['clientId'];
	loadEntity(client, 'Location', false);
	loadEntity(client, 'Person', false);
	
	var defaultMapping = new Array();
	defaultMapping[4019] = 4401;
	defaultMapping[4017] = 4402;
	defaultMapping[4018] = 4403;
	defaultMapping[4020] = 4404;
    defaultMapping[4016] = 4406;
	defaultMapping[4024] = 4406;
	defaultMapping[4004] = 4407;
	defaultMapping[4037] = 4407;
	defaultMapping[4038] = 4407;
	defaultMapping[4005] = 4408;
	defaultMapping[4039] = 4408;
	defaultMapping[4040] = 4408;
	defaultMapping[4025] = 4409;
	defaultMapping[4015] = 4408;
	
	$('.default').on('change', function(e){
		var me = $(this);
		if($('.si').parent().parent().css('display') !="none"){
			$('.si').select2('val',defaultMapping[me.val()]);
		}
	});

	var filter_opts_height = $(window).height() - 270;
	$("#sentiment-list-wrapper").css({
		"min-height" : filter_opts_height
	});

	$('#expdate').datepicker( ).on('changeDate',function(){
	console.log('show');
	$('.day, .next, .prev').click(function(event) {
	    console.log('Preventing');
	    event.preventDefault();
	    event.stopPropagation();
	})});
	
	$('#toggle-button').invisible();
	
	$('.pin').click(function(e){
		var me = $(this);
		if(me.hasClass('active')){
			me.removeClass('active');
		}else{
			me.addClass('active');
		}
	});

	$('.sentence')
			.click(
					function(e) {
						if (e.shiftKey) {
							if(!$('.pin').hasClass('active')){
								$('.pin').addClass('active');
							}
					    } 
						//$('.sentence').css('background-color','');
						console.log(highlight);
						if(!highlight){
							$('.sentence').css('background-color','');
							highlight=true;
						}
						
						$(this).css('background-color','#FFFF93');
						var prevsentence = $('.tag-content').html();
						var prefixhtml = "<div class='alert tags alert-success alert-dismissable' contenteditable><button data-dismiss='alert' class='close' href='#'></button><div class='tag-content'>";
						var fullcontent = $($(".fullcontent").html()).text()
								.trim();
						if (typeof prevsentence != 'undefined'
								&& $(this).html() != prevsentence)
							html = prefixhtml + prevsentence + $(this).html()
									+ "</div></div>";
						else
							html = prefixhtml + $(this).html() + "</div></div>";
						if ($('.tag-content').text().trim() != fullcontent)
							$('.sentiment-text .text').html(html);
						$(".tags").on("keydown", function(e) {
							// Allow: home, end, left, right, down, up
				            if(!(e.keyCode >= 35 && e.keyCode <= 40) || !(e.ctrlKey &&e.KeyCode==67))
							e.preventDefault();
				            console.log( e.keyCode);
						});
						$(".tags").bind('dragover drop', function(event){
						    event.preventDefault();
						    return false;
						});
						$('.tags.alert-success .close').bind('click',function(){
							if($('.pin').hasClass('active')){
								$('.pin').removeClass('active');
							}
							highlight=false;
						})
					 
						$(".tags").bind('paste', function(event){
						    event.preventDefault();
						    return false;
						});
					 
						 
						
					});

	var sentiment = $('.sentiment-text .text');
	sentiment.css({
		cursor : 'pointer'
	});
	$('.sentiment-text span').live('click', function(e) {
		var str = updateToken($(this).text());
		if (str != '') {
			var opinionWord = $('input[name="opinion-word"]').val();
			var featureWord = $('input[name="feature-word"]').val();
			if (opinionWord == '') {
				$('input[name="opinion-word"]').val(str);
			} else if(featureWord == '') {
				$('input[name="feature-word"]').val(str);
			} 
		}
	});

	/* doubleclick event working with ranges */
	sentiment.on('mouseup', function(e) {
		$(this).blur();
		var words = snapSelectionToWord();
		var word ='';
		if (typeof words != "undefined")
			 word = updateToken($.trim(words.toString()));

		function snapSelectionToWord() {
			var sel;
			// Check for existence of window.getSelection() and that it has a
			// modify() method. IE 9 has both selection APIs but no modify()
			// method.
			if (window.getSelection && (sel = window.getSelection()).modify) {
				sel = window.getSelection();
				if (!sel.isCollapsed) {
					// Detect if selection is backwards
					var range = document.createRange();
					range.setStart(sel.anchorNode, sel.anchorOffset);
					range.setEnd(sel.focusNode, sel.focusOffset);
					var backwards = range.collapsed;
					//range.detach();

					// modify() works on the focus of the selection
					var endNode = sel.focusNode, endOffset = sel.focusOffset;
					sel.collapse(sel.anchorNode, sel.anchorOffset);

					var direction = [];
					if (backwards) {
						direction = [ 'backward', 'forward' ];
					} else {
						direction = [ 'forward', 'backward' ];
					}

					sel.modify("move", direction[0], "character");
					sel.modify("move", direction[1], "word");
					sel.extend(endNode, endOffset);
					sel.modify("extend", direction[1], "character");
					sel.modify("extend", direction[0], "word");
					return sel;
				}
			} else if ((sel = document.selection) && sel.type != "Control") {
				var textRange = sel.createRange();

				if (textRange.text) {
					textRange.expand("word");
					// Move the end back to not include the word's trailing
					// space(s),
					// if necessary
					while (/\s$/.test(textRange.text)) {
						textRange.moveEnd("character", -1);
					}
					// textRange.select();
				}
			}
		}

		if (word != '') {
			var opinionWord = $('input[name="opinion-word"]').val();
			var featureWord = $('input[name="feature-word"]').val();
			if (opinionWord == '') {
				$('input[name="opinion-word"]').val(word);
			} else if(featureWord == '')  {
				$('input[name="feature-word"]').val(word);
			}
		}
		/*
		 * use this if firefox: range.collapse(range.anchorNode,
		 * range.anchorOffset);
		 */
		// range.collapse();
		e.stopPropagation();
	});

	$('#negate a').click(function(e) {
		e.preventDefault();
		var opinionWord = $('input[name="opinion-word"]').val();
		if (/not/i.test(opinionWord)) {
			opinionWord = opinionWord.replace('not ', '');
			opinionword = opinionWord.substr(opinionWord.indexOf(" ") + 1);

			$('input[name="opinion-word"]').val("no " + opinionWord);
		} else {
			opinionWord = opinionWord.replace('no ', '');
			opinionword = opinionWord.substr(opinionWord.indexOf(" ") + 1);

			$('input[name="opinion-word"]').val("not " + opinionWord);
		}
	});

	$('#clear a').click(function(e) {
		e.preventDefault();
		$('input[name="opinion-word"]').val("");
	});

	$('#fclear a').click(function(e) {
		e.preventDefault();
		$('input[name="feature-word"]').val("");
	});

	// Add Sentiment
	$("#addsnt")
			.on(
					"click",
					function(e) {
						e.preventDefault();

						var err_msg = 'Please enter';
						var err_flag = false;

						var opinion = $('#opinion').val();
						var feature = $('#feature').val();
						var expdate = $('#mention-date').val();
						var cat_first = $('#default').val();
						var cat_second = $('#HCAHPS').val();
						var docStatus = $('#docStatus').val();
						var locationId = $('#locationId').val();
						var personId = $('#personId').val();
						var score = $('input[name="score"]:checked').val();
						var content = $('.sentiment-text .text').text();
						var docID = $('#docID').val();
						var product = $('#productID').val();
						var first_cat_name = $("#default option:selected")
								.text();
						var second_cat_name = $("#HCAHPS option:selected")
								.text();
						var selBoxcnt = 0;
						$('select[name*="cats"]').each(function() {
							if ($(this).val() != null && $(this).val() != '')
								selBoxcnt = parseInt(selBoxcnt) + parseInt(1);
						});

						if (content == "") {
							err_msg += ' Content,';
							err_flag = true;
						}

						if (opinion == "") {
							err_msg += ' Opinion,';
							err_flag = true;
						}
						if (feature == "") {
							err_msg += ' Feature,';
							err_flag = true;
						}
						if (typeof score === "undefined") {
							err_msg += ' Score,';
							err_flag = true;
						}
						if (selBoxcnt == 0) {
							err_msg += ' Category ';
							err_flag = true;
						}
						if (err_flag == true) {
							alert(err_msg.substring(0, err_msg.length - 1));
							return false;
						} else {
							if(!$('.pin').hasClass('active')){
								$('.tags.alert-success .close').trigger('click');
							}
							showStatus('Adding Sentiment ...', false);
							var cnt = $('#cnthd').val();
							cnt++;
							$('#cnthd').val(cnt);
							var arrayIds = [];
							var arrayText = [];
							var loop = 1;
							var a_first;
							var a_second;
							$('select[name*="cats"]')
									.each(
											function() {
												a_first = 'option:selected';
												a_second = "#id_" + loop + ' '
														+ a_first;
												if ($('#id_' + loop).select2(
														'val') != undefined
														&& $('#id_' + loop)
																.select2('val') != 0) {
													arrayIds.push($(
															'#id_' + loop)
															.select2('val'));
													arrayText.push($(a_second)
															.text());
												}
												loop = parseInt(loop)
														+ parseInt(1);
											});
							url = SocialView.base_url
									+ 'management/content/'+SocialView.Filter.clientId+'/addSentiments/';
									 
							$.ajax(
											{
												type : "POST",
												dataType : "html",
												url : url,
												data : {
													counter : cnt,
													catIds : arrayIds,
													catTexts : arrayText,
													content_id : SocialView.Filter.content_id,
													docid : docID,
													locationId : locationId,
													personId : personId,
													sourceId: $('#sourceId').val(),
													opinion : opinion,
													feature : feature,
													score : score,
													content : content,
													expdte : expdate,
													docstatus : docStatus,
													product: product
												},
												error : function() {
													bootbox.alert("Cannot add sentiment.Error accessing remote server.");
													showStatus(
															'Cannot add sentiment.',
															true);
												}
											})
									.done(
											function(data,textStatus, xhr) {
												var xhrheader= xhr.getResponseHeader('service-staus');
												if(xhrheader!='success'){
												console.log(xhr.status);
												jsondata = JSON.parse(data);
												bootbox.alert("Cannot add sentiment."+ jsondata.message);
												showStatus('Cannot add sentiment.',true);
												} else {
													$('#updstatus').val('1');
													$('#docStatus').val('P');
													clearValues(false);
													showStatus(
															'Sentiment added Succesfully.',
															true);
													$("#SentimentList")
															.prepend(data);
													/*apply for first child*/
													var newitem= $("#SentimentList div:first-of-type");
													loopcnt=0;
													$("#SentimentList").children().each(function(){ 
														enableQuickEdits($(this)); loopcnt++;
														if(loopcnt>=arrayIds.length){return false;}
													});
													
													refreshCount();
												}
											});
						}
					});
	// end of click 'addsnt'

	// EDIT
	$("#SentimentList").on(
					"click",
					".sentiment-edit-link",
					function(e) {
						e.preventDefault();
						var me = $(this);
						$('#action-correct').val(0);
						var sentimentId = me.attr("sentiment-id");
						var categoryName = me.attr('sentiment-cat');
						editSentiment(sentimentId, categoryName);
					});

	$("#SentimentList").on(
			"click",
			".sentiment-correct-link",
			function(e) {
				e.stopPropagation();
			    e.preventDefault();
			    $('#action-correct').val('1');
				var sentimentId = $(this).attr("sentiment-id");
				var categoryName = $(this).attr('sentiment-cat');
				editSentiment(sentimentId, categoryName);
			});
	
	
	
	// Delete
	$("#SentimentList")
			.on("click",
					".sentiment-delete-link",
					function(e) {
						e.preventDefault();
						var me = $(this);
						var sentimentId = $(me).attr("sentiment-id");
						//var itemdiv = $(this).parents('.sentiment-wrapper');
						deleteSentiment(sentimentId,0 );
						
					});

	// Update
	$("#updatesnt").on(
			"click",
			function(e) {
				if ($("#updatesnt").data("disabled")) {
					return false;
				}
				$("#updatesnt").data("disabled", "disabled");
				var updateUrl = SocialView.base_url + 'management/content/'
					+SocialView.Filter.clientId+'/updateSentiments';
				var contend_id = $('#contentId').val(); // passing content id
				var sentimentid = $('#updocid').val();
				e.preventDefault();
				var err_msg = 'Please enter';
				var err_flag = false;

				var opinion = $('#opinion').val();
				var feature = $('#feature').val();
				var expdate = $('#expdate').val();
				var score = $('input[name="score"]:checked').val();
				var content = $('.sentiment-text .text').html();
				var docID = $('#docID').val();
				var product = $('#productID').val();
				var selBoxcnt = 0;
				$('select[name*="cats"]').each(function() {
					if ($(this).val() != null && $(this).val() != '')
						selBoxcnt = parseInt(selBoxcnt) + parseInt(1);
				});

				if (opinion == "") {
					err_msg += ' Opinion,';
					err_flag = true;
				}
				if (feature == "") {
					err_msg += ' Feature,';
					err_flag = true;
				}
				if (typeof score === "undefined") {
					err_msg += ' Score,';
					err_flag = true;
				}

				if (selBoxcnt == 0) {
					err_msg += ' Category ';
					err_flag = true;
				}

				if (err_flag == true) {

					alert(err_msg.substring(0, err_msg.length - 1));
					return false;
				} else {

					var arrayIds = [];
					var arrayText = [];
					var loop = 1;
					var a_first;
					var a_second;
					$('select[name*="cats"]').each(
							function() {
								a_first = 'option:selected';
								a_second = "#id_" + loop + ' ' + a_first;
								if ($('#id_' + loop).val() != undefined
										&& $('#id_' + loop).val() != 0) {
									arrayIds.push($('#id_' + loop).val());
									arrayText.push($(a_second).text());
								}
								loop = parseInt(loop) + parseInt(1);
							});
					showStatus('Updating Sentiment ...', false);
					$.ajax({
						type : "POST",
						datatye : "text",
						url : updateUrl,
						data : {
							client : SocialView.Filter.clientId,
							contentid : contend_id,
							sentiment_id : sentimentid,
							catIds : arrayIds,
							catTexts : arrayText,
							content_id : SocialView.Filter.content_id,
							docid : docID,
							opinion : opinion,
							feature : feature,
							score : score,
							content : content,
							expdte : expdate,
							correction: $('#action-correct').val(),
							correctaction:$('#corr-action').val(),
							correctreason:$('#corr-reason').val(),
							product: product
						},
						error : function() {
							$(".text-toggle-color").fadeIn();
							$(".fullcontent").fadeIn();
							$('.sentiment-text .text').html('');
							$("#updatesnt").removeData("disabled");
						}
					}).done(function(data) {
						clearValues();
						$("#updatesnt").removeData("disabled");
						showStatus('Sentiment updated succesfully.', true);
						$("#SentimentList").html(data);
						enableQuickEdits($('#SentimentList'));
						$('#cnthd').val($('#cntupdt').val());
						$('#updatesnt').hide();
						$('.cancelupdate').hide();
						$('#action-correct').val('0');
						cancelActiveEdit();
					});
				}

			});

	$('.cancelupdate').click(function(e) {
		e.preventDefault();
		$('#action-correct').val('0');
		cancelActiveEdit();
	});
	
	$("#deletesnt").on( "click", function(e) {
		var sentimentId = $('#updocid').val();
		deleteSentiment(sentimentId,$('#action-correct').val());
				
			});

	$('#selectall').click(function(event) {
		if (this.checked) {
			$('.checkbox1').each(function() {
				this.checked = true;
			});
		} else {
			$('.checkbox1').each(function() {
				this.checked = false;
			});
		}
	});

	$('.location,.person,.product,.lan,.expdte').on("change", function(e) {
		$('#savehd').show();
	});

	$('.lan').on('change', function() {
		var lang = $(this).val();
		if (lang != "") {
			$('.fullcontent').html('');
			$('.fullcontent').html($('#full-content-hidden-' + lang).html());
		}
	});
	
	// status change
	$("#toggle-button")
	.on(
			"click",
			function(e) {
				e.preventDefault();
				var pValues = [], qValues = [];
				if($("#docStatus").val()=='Q'){
					bootbox.dialog({
						message : "Changing status to P ...",
						closeButton : false
					});
					qValues.push($("#contentId").val());
					showStatus("Status is being changed...", false );
					var urlstatChange =  SocialView.base_url + 'management/content/'+SocialView.Filter.clientId+'/statchange';
					$.ajax({
						type : "POST",
						url : urlstatChange,
						async:false,
						dataType : "text",
						data : {
							p : pValues,
							q : qValues
						},
						error : function() {
							bootbox.hideAll();
							bootbox.alert('Error with status change.');
							showStatus("Error with status change.", true );
						}
					}).done(function(data) {
						bootbox.hideAll();
						if(data =='success'){ 
						showStatus("Status toggled.", true );
						$("#docStatus").val('P');
						$("#toggle-button").invisible();
						bootbox.alert('Status of the document changed to P.');
						}else
							{ bootbox.alert('Error with status change.'); showStatus("Error with status change.", true ); }
					});
					
				} else
					{
				 bootbox.alert('Document is not in Q status.');
					}
			}
	);

	$("#savehd")
			.on("click",
					function(e) {
						var clickctrl=$(this);
						if(clickctrl.hasClass('processing'))
					          return;
						clickctrl.addClass('processing');
						bootbox.dialog({
							message : "Changing document details ...",
							closeButton : false
						});
						var saveUrl =  SocialView.base_url + 'management/content/'+SocialView.Filter.clientId+'/updateDocument';
						var location = $('.location').val();
						var person = $('.person').val();
						var product = $('.product').val();
						var lan = $('.lan').val();
						var expdate = $('#expdate').val();
						var errormsg = "Cannot update details.<br>Location person may already added for the content.<br>Verify document is not deleted.";

						$.ajax({
											type : "POST",
											datatye : "text",
											url : saveUrl,
											data : {
												docsId : SocialView.Filter.document_id,
												contentId : SocialView.Filter.content_id,
												locationId : location,
												personId : person,
												/*productId : product*/
											},
											error : function() {
												bootbox.alert(errormsg,function(){bootbox.hideAll();});
												clickctrl.removeClass('processing');
											}
										})
								.done(
										function(data) {
											$('#locationId').val(location);
											$('#personId').val(person);
											console.log(data);
											if (typeof data.status !='undefined' && typeof data.status['code'] != 'undefined'&& data.status['code'] == 200){
												bootbox.alert('Document details updated.');
												window.location.reload();
											}else{
												bootbox.alert(errormsg,function(){bootbox.hideAll();});
											}
											clickctrl.removeClass('processing');
											
										});

					});
	// Delete multiple
	$("#del").on("click",
					function(e) {
						e.preventDefault();
						e.stopPropagation();
						var checkedValues = $('input:checkbox:checked').map(
								function() {
									return this.value;
								}).get();
						if ($('.sentiment-wrapper').find("input[name='check[]']:checked").length <= 0) {
							bootbox.alert("Please select sentiments that needs to be removed. ");
							return;
						}
						var deleteUrl =  SocialView.base_url + 'management/content/'+SocialView.Filter.clientId
								+ '/deleteAllSentiments';
						bootbox
								.confirm("Are you sure want to delete selected sentiments?",
										function(result) {
											if (result) {
												$.ajax({
																	type : "POST",
																	datatye : "text",
																	url : deleteUrl,
																	data : {
																		chekedvalue : checkedValues
																	},
																	error : function() {
																		showStatus(
																				'Sentiment deletion failed.',
																				true);
																	}
																}).done(
																function(data) {
																	cancelActiveEdit();
																	$(
																			'.sentiment-wrapper')
																			.find(
																					"input[name='check[]']:checked")
																			.closest(
																					'.sentiment-wrapper')
																			.remove();
																	refreshCount();
																	showStatus(
																			'Sentiment deleted successfully.',
																			true);
																});
											}
										});

					});

	$(".nselect").bind("touchstart", function() {
		e.preventDefault();
	});
	// $('#feature').autocomplete({showHint:false,visibleLimit:5});
	var industry = SocialView.industry;
	if(industry == "healthcare" || industry == "admin" ){
		worddata=['Staff', 'Doctor', 'Overall Experience', 'Hospital', 'Treatment',
				   'Nurse','Outcome','Likely To Come Back','Likely To Recommend','Wait',
				   'Office'];
	}else if(industry == "apartment"){
		worddata=['Staff', 'Overall Experience', 'Community','Apartment','Management',
				   'Office', 'Security', 'Trash', 'Maintenance'];
	}else if(industry == "other"){
		worddata=['Overall Experience', 'Accomodation', 'Cleanliness', 'Sauna & Fitness', 'Service', 'Value', 'On-Board Activities', 'Public Areas', 'Safety', 'Expedition Team', 'Excursions', 'Crew', 'Food', 'Ambiance', 'Entertainment', 'Public Rooms', 'Family and Children','Decor','Noise'];
	}else{
		worddata=['Staff', 'Overall Experience', 'Office'];
	}
	$('#feature').autocomplete({source:worddata,minLength:0 }).focus(function() {
		    $(this).autocomplete("search", $(this).val());
	 });; 
	 $('#addsnt').blur(function(){  $('.fullcontent').focus();  });
	 $('.page-content').css({'min-height':'100%'});
 
});
var highlight=true;
function changeClass(ctrl) {
	var phrase = ctrl.attr('name');
	if (!ctrl.prop('checked')) {
		$(".fullcontent>span>span." + phrase).addClass('no-' + phrase)
				.removeClass(phrase);
		$(".tag-content>span." + phrase).addClass('no-' + phrase)
		.removeClass(phrase);
		
	} else {
		$(".fullcontent>span>span." + 'no-' + phrase).addClass(phrase)
				.removeClass('no-' + phrase);
		$(".tag-content>span." + 'no-' + phrase).addClass(phrase)
		.removeClass('no-' + phrase);
		
	}
}

$(function() {
	var coloropt={ 
	'noun':false,
	'adjective':false,
	'verb':false,
	'adverb':false };
	
	/*changeClass($("input[name='noun']"));
	changeClass($("input[name='adjective']"));
	changeClass($("input[name='verb']"));
	changeClass($("input[name='adverb']"));*/
	
	/*load opts*/
	cookieName = 'coloropts-' + SocialView.user_id.replace('@', '-');
	var colorcookie = $.cookie(cookieName);
	if(typeof colorcookie != 'undefined'){ 
		coloropt = JSON.parse(colorcookie);
		//console.log(colorcookie);
	}
	
	$("input[name='noun']").prop('checked', coloropt.noun).trigger('change');
	$("input[name='adjective']").prop('checked', coloropt.adjective).trigger('change');
	$("input[name='verb']").prop('checked', coloropt.verb).trigger('change');
	$("input[name='adverb']").prop('checked', coloropt.adverb).trigger('change');
	

	$("input[name='noun'],input[name='adjective'],input[name='verb'],input[name='adverb']").bind('change',function(){
		/*make json and save*/
		coloropt.noun=$("input[name='noun']").prop('checked');
		coloropt.adjective=$("input[name='adjective']").prop('checked');
		coloropt.verb=$("input[name='verb']").prop('checked');
		coloropt.adverb=$("input[name='adverb']").prop('checked');
		cookieName = 'coloropts-' + SocialView.user_id.replace('@', '-');
		var date = new Date();
		date.setMonth(date.getMonth() + 12);
		 var cookie = $.cookie(cookieName,JSON.stringify(coloropt),{expires:date});
	});
	
	
	$("select.select2-cat").select2({
		allowClear : true,
	});
	
	updateUrl = SocialView.base_url + 'management/content/'+SocialView.Filter.clientId+'/listSentiments';
	
	//$('#sentiment-list-wrapper').loader('show');
	Custom.showLoader('#sentiment-list-wrapper');
	
	$.ajax({
		type : "POST",
		datatye : "text",
		url : updateUrl,
		data : {
			contentid : SocialView.Filter.content_id,
			product: $('#productID').val()
		},
		error : function() {
			//$('#sentiment-list-wrapper').loader('hide');
			Custom.hideLoader('#sentiment-list-wrapper');
		}
	}).done(function(data) {
		$("#SentimentList").html('');
		//$('#sentiment-list-wrapper').loader('hide');
		Custom.hideLoader('#sentiment-list-wrapper');
		$("#SentimentList").append(data);
		refreshCount();
		$('#cnthd').val($('#cntupdt').val());
		enableCorrect( $('.sentiment-error-link'));
		enableQuickEdits($('#SentimentList'));

	});
	
	if($('#isActive').val()=='false'){
		$('.form-body').attr('diabled','disabled');
		$('.form-body :input').attr('disabled',true);
		$('.fullcontent').css('pointerEvents', 'none');
		$('.fullcontent').css('text-decoration', 'line-through'); 
		$('#addsnt,#toggle-button,#del').hide(); 
		$('btnqc1');
		
	}
	
/*qc calls*/	
	$('.btnqc1').click(function(){
		if(!validateQC('QC1'))return;
		
		ajaxCall( 'updateqc/'+ $('#contentId').val()+'/'+1,'GET',{},
				function(data){
			bootbox.alert("Document marked as QC level1 passed.");
			$(".btnqc1").prop('disabled', true);
			$(".btnrefer").prop('disabled', true);
			$(".info-qc1").removeClass('disabled-info');
			$('.leftpanel').find('.correct-wrap').hide();
		},function(data){
					alert("Cannot update QC");
				});
	});
	
	$('.btnqc2').click(function(){
		if(!validateQC('QC2'))return;
		ajaxCall( 'updateqc/'+ $('#contentId').val()+'/'+2,'GET',{},
				function(data){
			bootbox.alert("Document marked as QC level 2 passed.");
			$(".btnqc2").prop('disabled', true);
			$(".btncorrect").prop('disabled', true);
			$(".info-qc2").removeClass('disabled-info');
		},function(data){
					alert("Cannot update QC");
				});
	});
	function validateQC(strqc){
			corrdivs= $('#sentiment-list-wrapper').find('.sentiment-correct-view');
			var array_corr = new Array();
			$(corrdivs).each(function() {
				sentid=$(this).parents('.sentiment-wrapper').attr('id');
				array_corr.push(sentid);
				$('#'+sentid).removeClass('highlight');
			});
			
			if(array_corr.length>0){
				bootbox.alert("Please correct "+array_corr.length+" pending sentiments before "+strqc,function(){ for(itr=0;itr<array_corr.length;itr++ ){ 
								$('#'+ array_corr[itr]).addClass('highlight', {duration:500});}  });
				return false;
			}
			return true;
	}
	$('.btnrefer').click(function(){
		if(!validateQC('Refer'))return;
		
		var pValues = [], qValues = [];
		bootbox.dialog({
			message : "Changing status to R ...",
			closeButton : false
		});
		qValues.push($("#contentId").val());
		showStatus("Status is being changed...", false );
		var urlstatChange = SocialView.base_url + 'management/content/'+SocialView.Filter.clientId+'/statchangeall/R';
		$.ajax({
			type : "POST",
			url : urlstatChange,
			async:false,
			dataType : "text",
			data : {
				contentIds : qValues
			},
			error : function() {
				bootbox.hideAll();
				bootbox.alert('Error with status change.');
				showStatus("Error with status change.", true );
			}
		}).done(function(data) {
			bootbox.hideAll();
			if( data =='success'){ 
			showStatus("Status toggled.", true );
			$("#docStatus").val('R');
			$(".btnqc1").prop('disabled', true);
			$(".btnrefer").prop('disabled', true);
			bootbox.alert('Document marked as R (Refer). This document will be available for others to review.');
			}else
				{ bootbox.alert('Error with status change.'); showStatus("Error with status change.", true ); }
		});
	});
	
	//enableCorrect( $('#btncorrect'));
	$('#btncorrect').click(function(e){
		 e.stopPropagation();
	        e.preventDefault();
	        $('#model-inside-button').editable('toggle');
	});
	
	$('#model-inside-button').on('save', function(e, params) {
		applyReview(SocialView.Filter.clientId, 0,params.newValue);
	});
	
	// Delete document
	$('.content-edit-form').on('click', '#deletedoc', function(){
		bootbox.confirm("Are you sure?", function(result) {
			if(result){
				deleteDocument(false);
			}
		});  
	});
});
/* <<<<<<<< Ready function ends here >>>>>>>>> */

function deleteDocument (forceDelete) {

	var url = SocialView.base_url + 'management/content/' +SocialView.Filter.clientId+'/gridDelete';
	var data = {
					griddelete : [$('#contentId').val()],
					editor_mode: SocialView.editor_mode,
					parentDocument: true
				};
	if (forceDelete) {
		data.forceDelete = true ;
	}
	$.ajax({
		url : url,
		type : "POST",
		dataType : "text",
		data : data,
		error : function() {
			window.location.reload();
		},
		beforeSend: function(){
			Custom.showLoader();
		},
		complete: function(){
			Custom.hideLoader();
		}
	}).done(function(data){
		var result = $.parseJSON(data);
		if (typeof result.status.code != "undefined" && result.status.code == "200"){
			if(result.status.undeleted!="undefined" && result.status.undeleted.length>0){
				if (!forceDelete) {
					bootbox.confirm(result.status.undeleted[0].error+'. Do you want to force delete it ?',function (result) {
						if (result) {
							deleteDocument (true);
						}
					});
				} else {
					bootbox.alert("Document cannot be deleted."+result.status.undeleted[0].error);
				}
			}else { 
			bootbox.alert({ 
			    message: "Document deleted successfully", 
			    callback: function(){
			    	Custom.showLoader();
			    	window.location.reload();
			    }
			});
			}
		}else{
			bootbox.alert('Something went wrong. Please try again later!');
		}
  	});
	
}

function deleteSentiment(sentimentId,correction){
	itemdiv = $('#sentiment-'+sentimentId);
	bootbox.confirm(
			"Are you sure want to delete?",
			function(result) {
				if (result) {
					'/listSentiments';
					var deleteUrl = SocialView.base_url
					+ 'management/content/'+SocialView.Filter.clientId+'/deleteSentiments/' ;
					$.ajax(
									{
										type : "POST",
										datatye : "text",
										url : deleteUrl,
										data : { client : SocialView.Filter.clientId,
											sentimentId : sentimentId,content_id:$('#contentId').val(),
											correction: correction,
											correctaction:$('#corr-action').val(),
											correctreason:$('#corr-reason').val()
										},
										error : function() {
											$('#msgedit').show();
											showStatus('Cannot delete sentiment. Please try again.',true);
										}
									})
							.done(
									function(data) {
										if (sentimentId == $('#updocid').val()) {
											cancelActiveEdit();
										}
										itemdiv.fadeOut(600).remove();
										refreshCount();
										$('#msgedit').html('');
										$('#msgedit').show();
										showStatus('Sentiment deleted successfully.',true);
									});
				}
			});
}


function editSentiment(sentimentId, categoryName){
	var editUrl = SocialView.base_url
	+ 'management/content/'+SocialView.Filter.clientId+'/editSentiments/';

//errortext=$(this).parent().parent().parent().find('.sentiment-correct-view').clone().wrap('<p/>').parent().html();
//console.log(errortext); 
showStatus('Loading sentiment details ...', false);
$.ajax({
		type : "POST",
		url : editUrl,
		data : {
			sentimentId : sentimentId
		},
		error : function() {
			// window.location.reload();
		}
	})
	.done(function(data) {
				var selBoxcnt = 0;
				$('select[name*="cats"]')
						.each(
								function() {
									selBoxcnt = parseInt(selBoxcnt)
											+ parseInt(1);
								});
				var k;
				var result = data;
			/*	$(".fullcontent").slideUp();
				$(".text-toggle-color").slideUp();*/
				$.each(
								result.data,
								function(index,value) {

									$('#opinion').val(value.opinion);
									$('#feature').val(value.feature);
									$('#expdate').val(value.experience_time);
									if($('.pin').hasClass('active')){
										$('.pin').removeClass('active');
									}
								 
									for (k = 1; k <= selBoxcnt; k++) {
										$(
												'#id_'
														+ k)
												.parent()
												.parent()
												.css(
														"display",
														"initial");
									}
									for (k = 1; k <= selBoxcnt; k++) {
										$('#id_'+ k).select2('val',value.categoryId);
									}
									/*
									 * hide unused categories
									 */
									var hideCnt = 0;
									for (k = 1; k <= selBoxcnt; k++) {
										if ($('#id_'+ k).select2('val') == null) {
											$('#id_'+ k)
													.parent()
													.parent()
													.css("display","none");
											hideCnt++;
										}
									}
									
									// If all are hidden, then set the default select
									if (hideCnt == selBoxcnt) {
										$('select.default').append($('<option/>', {value:value.categoryId, text:categoryName}));
										$('select.default').select2('val',value.categoryId);
										$('select.default').parent()
											.parent()
											.css(
													"display",
													"initial");
									}
									/*
									 * $('.category-group').find('select').each(function() {
									 * console.log(this.select2('val') );
									 * if
									 * (this.select2('val') ==
									 * '')
									 * $(this).parent().css("display",
									 * "none"); });
									 */
									optidx = 0
									if (value.score == 'Positive')
										{$( '#option1').val([ 1 ]);optidx=1; }
									if (value.score == 'Neutral')
										{$( '#option2').val([ 0 ]);optidx=2;}
									if (value.score == 'Negative')
										{$( '#option3').val([ -1 ]);optidx=3;}
										$.uniform.update($('#option'+optidx).attr('checked',true));
									$('#updocid')
											.val(value.sentiment_id);
								/*	$(
											'.sentiment-text .text')
											.html(
													$(
															"<div>"
																	+ value.sentiment
																	+ "</div>")
															.addClass(
																	"alert-success tags"));*/
									
									/*start of sentiment*/
									
									var prefixhtml = "<div class='alert tags alert-success alert-dismissable' contenteditable><button data-dismiss='alert' class='close' href='#'></button><div class='tag-content'>";
									var fullcontent = $($(".fullcontent").html()).text()
											.trim();
									 
										html = prefixhtml + value.content + "</div></div>";
									if ($('.tag-content').text().trim() != fullcontent)
										$('.sentiment-text .text').html(html);
									$(".tags").on("keydown", function(e) {
										// Allow: home, end, left, right, down, up
							            if(!(e.keyCode >= 35 && e.keyCode <= 40))
										e.preventDefault();
									});
									$(".tags").bind('dragover drop', function(event){
									    event.preventDefault();
									    return false;
									});
								 
									$(".tags").bind('paste', function(event){
									    event.preventDefault();
									    return false;
									});
								 
									$("input[name='noun'] ,input[name='adjective'], input[name='verb'], input[name='adverb']").trigger('change');
									
									/*end of sentiment*/
									showStatus('Sentiment loaded successfully.',true);
									$('#addsnt').hide();
									$('.qc-doc-tools').hide();
									$('#updatesnt').show();
									$('.cancelupdate').show();

								});
				/**/
				if($('#action-correct').val()=='1')
				{
					$('#updatesnt').text('Correct');
					$('#deletesnt').show();
					$('.corr-input').show();
				}else{
					$('.corr-input').hide();
					$('#deletesnt').hide();
					$('#updatesnt').text('Update');
				}
			});
}


function enableQuickEdits(pNode){
	pNode.find('.opinion-editlink,.feature-editlink').editable({ url:'' });
	pNode.find('.score-editlink').editable({type:'select',value:1,showbuttons:false,
		hidden:function(){ },
		source: [
	                                                      {value: 'positive', text: 'Positive'},
	                                                      {value:'neutral', text: 'Neutral'},
	                                                      {value: 'negative', text: 'Negative'}
	                                                   ]});
	pNode.find('.score-editlink').on('hidden',function(){ $(this).parent().parent().removeClass('white'); }).on('shown',function(){console.log('cancel');  $(this).parent().parent().addClass('white');  });
	$('#sentiment-list-wrapper').find('[class*=-editlink]').on('shown', function(e, editable) {
		 editable.input.postrender = function() {
			 popcontainer=editable.input.$input.closest('.editable-container');
			  popcontainer.find('.arrow').css('display','none');
			 popcontainer.css( 'top','');
	    if(popcontainer.position().left<0){
	    	popcontainer.css( 'left',0);
	    }
	    if(popcontainer.position().top<0){
	    	popcontainer.css( 'top',0);
	    }
		 };
	}).on('save',function(e,params){
		// console.log(params.submitValue.reason+params.submitValue.action);
		
		//SS applyCorrection(SocialView.settings.datasource,$(this).attr('data-pk'),params.submitValue);
	});
	
	$('#sentiment-list-wrapper').find('[class*=-editlink]').on('save',function(e,params){ 
		//console.log($(this).editable('getValue',true));
		params.newValue=$(this).editable('getValue',true);
		bootbox.alert('Cannot quick edit now! Please use edit option.');
	});
	
	
	
	pNode.find('.sent-corr-editable').editable(
		        {url:'',emptytext:'',display:function(value){ return '';},
		       	 validate: function(value) {
		                if($.trim(value) == '') return 'Enter correction comments.';
		             }});
	pNode.find('.sent-corr-editable').on('save', function(e, params) {
		applyReview(SocialView.Filter.clientId,datatoggle.attr('data-pk'),params.newValue);
 	});
	
	pNode.find('.sentiment-error-link').click(function(e){
	 	e.stopPropagation();
        e.preventDefault();
        datatoggle=$(this).parent().prev().prev();
        datatoggle.editable('toggle');
	});
	
/*	pNode.find('.sentiment-correct-link').click(function(e){
	 	e.stopPropagation();
        e.preventDefault();
        $('#action-correct').val('1');
		var sentimentId = $(this).attr("sentiment-id");
		editSentiment(sentimentId);
	});*/
	
	
	$('.correct-action').editable({
        emptytext:'',showbuttons:'bottom',/*display:function(value){ return '';},*/
       save:function(){
    	  // console.log('save');
       },
        value: {
           
        },
        validate: function(value) {
            if(value.reason == '') return 'reason required!'; 
        },
        display: function(value) {
            if(!value) {
                $(this).empty();
                return; 
            }
            var html ='';// '<b>' + $('<div>').text(value.city).html() + '</b>, ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
            $(this).html(html); 
        }         
    });              
         
	//$('[data-toggle="popover"]').popover({trigger: 'hover'}); 
}

function enableCorrect(element){
	$('#model-inside-button').editable({url:'',emptytext:'',display:function(value){ return '';},
	 validate: function(value) {
         if($.trim(value) == '') return 'Enter correction comments.';
      }
	});
	 
}

function applyReview(clientId,sentimentId, comment){
	if(comment!=''){
		errorMsg = "Cannot update Correction details.Server response:";
		ajaxCall( 'addreview/'+ $('#contentId').val()+'/'+sentimentId,'POST',{
			'clientId':clientId,
			'qcreason':comment,'sentimentId':sentimentId
		},
				function(data){
			retdata = JSON.parse(data);
			if(retdata.status.code==200){
				bootbox.alert("Content marked for correction.");
				review = retdata.review;
				htmlcnt = '<div class="boxed-content sentiment-correct-view">'+
				'<i>Correction Reason:</i>'+review.requestReason+'<br><i>Request by:'+review.requestUser+'</i><br><i>Date:'+review.requestTime+'</i></div>';
				if(sentimentId!=0){
					placeholder = $('#sentiment-'+sentimentId);
					placeholder.find('.sentiment-content').after(htmlcnt);
					placeholder.find('.tools').html('<a class="btn acebtn btn-minier btn-info sentiment-correct-link " '+
							'sentiment-id="'+sentimentId+'"> <i class="icon-only ace-icon fa fa-share"></i> Correct</a>');
				}else{
					$('.leftpanel').find('.correct-wrap').append(htmlcnt);
				}
				$('#btncorrect,.btnqc2').prop('disabled', true);
				$("#docStatus").val('C');
			}
			else
				{bootbox.alert(errorMsg+data); return; }
			
		},function(data){
			bootbox.alert(errorMsg);
				});
	}else{
		bootbox.alert("Please enter correction details and submit again.");
	}
}

function applyCorrection(clientId,sentimentId, correctionobj){
	if(correctionobj!=''){
		errorMsg = "Cannot update Correction details.";
		ajaxCall( 'addcorrection/'+ $('#contentId').val()+'/'+sentimentId,'POST',{
			'clientId':clientId,
			'correctreason':correctionobj.reason,
			'correctaction':correctionobj.action,
			'sentimentId':sentimentId
		},
				function(data){
			if(data=='success'){
				bootbox.alert("Sentiment correction completed.");
				$('#sentiment-'+ sentimentId).find('.sentiment-correct-view').hide();
			}
			else
				{bootbox.alert(errorMsg+data); return; }
			$('#btncorrect').prop('disabled', true);
			$("#docStatus").val('C');
		},function(data){
			bootbox.alert(errorMsg);
				});
	}else{
		bootbox.alert("Please enter correction details and submit again.");
	}
}

function updateToken(token) {
	return token;// .replace(/[^\w\s$]/gi, '');
}

function ajaxCall(dataurl,method, dataparam, successCallback, errorCallback){
	 $.ajax({
	        beforeSend: function() {
	            //$.mobile.loading('show');
	        },
	        complete: function() {
	           // $.mobile.loading('hide');
	        },
	        type: method,
	        url: SocialView.base_url + 'management/content/'+SocialView.Filter.clientId+'/'+dataurl,
	        data: dataparam,
	        success: function() {
	        },
	        error: function() {
	            errorCallback();
	        }
	    }).done(function(data){ successCallback(data); });
}

function showStatus(message, hide) {
	$('#msgedit').fadeIn(200);
	$('#msgedit').html(message);
	if (hide)
		$('#msgedit').fadeOut(1500);
}

function resetCategories() {
	$('select[name*="cats"]').each(function() {
		$(this).parent().parent().css("display", "initial");
		$(this).select2('val', '');
	});
}

function refreshCount() {
	items = $('.sentiment-wrapper').find("input[name='check[]']").length;
	$("#uniform-selectall").next().html(
			' ' + items + ' Sentiment' + (items > 1 ? 's' : ''));
	if(items <=0&&$('#docStatus').val()=='Q')
		{ $('#toggle-button').visible();
		}
	else{ 
		$('#toggle-button').invisible();
	}
	$('#sentiment-list-wrapper').css('max-height',$(window).height() - 100);
	
	 $('#sentiment-list-wrapper').slimScroll({
		 height: 'auto',size:'10px'
	    });
	 $('.fullcontent').css({'max-height':$(window).height()-420});
	 
	 if($('.fullcontent').get(0).scrollHeight > $('.fullcontent').innerHeight() )
			 $('.fullcontent').slimScroll({
				 height: 'auto',size:'10px'
			    });
}

function cancelActiveEdit() {
	$('#updatesnt').hide();
	$('#deletesnt').hide();
	$('.corr-input').hide();
	$('.corr-input').find('textarea').each(function(){ $(this).val(''); });
	$('.cancelupdate').hide();
	$('#addsnt').show();
	$('#updocid').val('');
	$(".text-toggle-color").fadeIn();
	$(".fullcontent").fadeIn();
	$('.qc-doc-tools').show();
	clearValues();
}

function clearValues(clear) {
	if (typeof clear === "undefined"){
		clear = true;
	}
	if(clear){
		$('.sentiment-text .text').html('');
	}
	$('#opinion').val('');
	$('#feature').val('');
	$.uniform.update($('input[name="score"]').attr('checked',false));
	resetCategories();
}

(function(e, t, n) {
	var r = function(e) {
		var r = {
			text : "",
			start : 0,
			end : 0
		};
		if (!e.value) {
			return r
		}
		try {
			if (t.getSelection) {
				r.start = e.selectionStart;
				r.end = e.selectionEnd;
				r.text = e.value.slice(r.start, r.end)
			} else if (n.selection) {
				e.focus();
				var i = n.selection.createRange(), s = n.body.createTextRange();
				r.text = i.text;
				try {
					s.moveToElementText(e);
					s.setEndPoint("StartToStart", i)
				} catch (o) {
					s = e.createTextRange();
					s.setEndPoint("StartToStart", i)
				}
				r.start = e.value.length - s.text.length;
				r.end = r.start + i.text.length
			}
		} catch (o) {
		}
		return r
	};
	var i = {
		getPos : function(e) {
			var t = r(e);
			return {
				start : t.start,
				end : t.end
			}
		},
		setPos : function(e, n, r) {
			r = this._caretMode(r);
			if (r === "start") {
				n.end = n.start
			} else if (r === "end") {
				n.start = n.end
			}
			e.focus();
			try {
				if (e.createTextRange) {
					var i = e.createTextRange();
					if (t.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
						n.start = e.value.substr(0, n.start).replace(/\r/g, "").length;
						n.end = e.value.substr(0, n.end).replace(/\r/g, "").length
					}
					i.collapse(true);
					i.moveStart("character", n.start);
					i.moveEnd("character", n.end - n.start);
					i.select()
				} else if (e.setSelectionRange) {
					e.setSelectionRange(n.start, n.end)
				}
			} catch (s) {
			}
		},
		getText : function(e) {
			return r(e).text
		},
		_caretMode : function(e) {
			e = e || "keep";
			if (e === false) {
				e = "end"
			}
			switch (e) {
			case "keep":
			case "start":
			case "end":
				break;
			default:
				e = "keep"
			}
			return e
		},
		replace : function(t, n, i) {
			var s = r(t), o = t.value, u = e(t).scrollTop(), a = {
				start : s.start,
				end : s.start + n.length
			};
			t.value = o.substr(0, s.start) + n + o.substr(s.end);
			e(t).scrollTop(u);
			this.setPos(t, a, i)
		},
		insertBefore : function(t, n, i) {
			var s = r(t), o = t.value, u = e(t).scrollTop(), a = {
				start : s.start + n.length,
				end : s.end + n.length
			};
			t.value = o.substr(0, s.start) + n + o.substr(s.start);
			e(t).scrollTop(u);
			this.setPos(t, a, i)
		},
		insertAfter : function(t, n, i) {
			var s = r(t), o = t.value, u = e(t).scrollTop(), a = {
				start : s.start,
				end : s.end
			};
			t.value = o.substr(0, s.end) + n + o.substr(s.end);
			e(t).scrollTop(u);
			this.setPos(t, a, i)
		}
	};
	e.extend({
		selection : function(r) {
			var i = (r || "text").toLowerCase() === "text";
			try {
				if (t.getSelection) {
					if (i) {
						return t.getSelection().toString()
					} else {
						var s = t.getSelection(), o;
						if (s.getRangeAt) {
							o = s.getRangeAt(0)
						} else {
							o = n.createRange();
							o.setStart(s.anchorNode, s.anchorOffset);
							o.setEnd(s.focusNode, s.focusOffset)
						}
						return e("<div></div>").append(o.cloneContents())
								.html()
					}
				} else if (n.selection) {
					if (i) {
						return n.selection.createRange().text
					} else {
						return n.selection.createRange().htmlText
					}
				}
			} catch (u) {
			}
			return "";
		}
	});
	e.fn.extend({
		selection : function(e, t) {
			t = t || {};
			switch (e) {
			case "getPos":
				return i.getPos(this[0]);
			case "setPos":
				return this.each(function() {
					i.setPos(this, t)
				});
			case "replace":
				return this.each(function() {
					i.replace(this, t.text, t.caret)
				});
			case "insert":
				return this.each(function() {
					if (t.mode === "before") {
						i.insertBefore(this, t.text, t.caret)
					} else {
						i.insertAfter(this, t.text, t.caret)
					}
				});
			case "get":
			default:
				return i.getText(this[0])
			}
			return this
		}
	})
})(jQuery, window, window.document)

function loadEntity(client, entityType, competitor) {
	SocialView.Filter.query = [];
	SocialView.Filter.query[entityType] = '';
	$('.' + entityType.toLowerCase()).select2('val', '');
	$('.' + entityType.toLowerCase())
			.select2(
					{
						placeholder : 'Search for ' + entityType,
						allowClear : true,
						minimumInputLength : 2,
						formatResult: format,
						formatSelection: format,
						ajax : {
							url :SocialView.base_url
									+ 'management/content/'+client+'/entityjson/'
									+ entityType + '/' + competitor + '/',
							dataType : 'json',
							quietMillis : 300,
							data : function(term) {
								SocialView.Filter.query[entityType] = term;
								return {
									term : term
								};
							},
							results : function(data) {
								return {
									results : $.map(data, function(item) {
										return {
											text : item.name,
											id : item.id
										}
									})
								};
							}
						},
					
						initSelection : function(element, callback) {
							callback({id: $('#'+entityType.toLowerCase()+'Id').val(), text: $('#'+entityType.toLowerCase()+'Name').val() });
						}
					});
}

function format(item) {
    var originalText = item.text;
    return "<div title ='" + originalText + "'>" + originalText + "</div>";
}
