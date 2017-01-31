$(function() {
	$.pageLoad = true;
	/* init ui els */
	$('.datepicker').datepicker({
		autoclose : true,
		todayHighlight : true
	});
	/* end of ui */
	// handle sidebar show/hide
	$('.menu-toggler.sidebar-toggler').click(function() {
		var container = $(".page-sidebar-menu");
		if (container.hasClass("page-sidebar-menu-closed") === true) {
			$(".ui-pager-control").removeClass("affix-full");
		} else {
			$(".ui-pager-control.affix").addClass("affix-full");
		}
	});

	$('.ui-pager-control').on('affix.bs.affix', function() {
		var container = $(".page-sidebar-menu");
		if (container.hasClass("page-sidebar-menu-closed") === true) {
			$(".ui-pager-control.affix-top").addClass("affix-full");
		}
		// alert('affix!');
	});

	$('.ui-pager-control').on(' affixed-top.bs.affix', function() {

		$(".ui-pager-control").removeClass("affix-full");
		// alert('Fired!');
	});

	function checkBox(e) {
		e = e || event; /* get IE event ( not passed ) */
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		$('.check').prop('checked', e.checked);
	}

	// Get Source
	function triggerSource(client, restore) {
		if (client != '') {
			// $('#wait_3').show();

			url = SocialView.base_url + 'management/content/admin/parseSource';
			Custom.showLoader();
			$
					.ajax({
						type : "POST",
						url : url,
						dataType : "text",
						data : {
							client : client,
							sources : SocialView.Filter.sourceSession
						},
						error : function() {
							window.location.reload();
						},
						always : function() {
							Custom.hideLoader();
						}
					})
					.done(
							function(data) {
								$('.source-dropdown').html('');
								$('.source-dropdown').html(
										$(data).filter(".source-dropdown"));
								if (restore) {
									var sources = SocialView.Filter.sourceSession;
									for (var ix = 0; sources != null
											&& ix < sources.length; ix++) {
										$(
												'option[value="' + sources[ix]
														+ '"]', $('#source'))
												.prop('selected', true);
									}
								}
								$('#source')
										.multiselect(
												{
													includeSelectAllOption : true,
													enableCaseInsensitiveFiltering : true,
													enableFiltering : true,
													onChange : function(option,
															checked, select) {
														if (typeof $(option)
																.val() == 'undefined') {
															$('#selectall')
																	.val(100000);
														} else {
															$('#selectall')
																	.val('');
														}
													},
													maxHeight : 200,
													templates : {
														filter : '<li class="multiselect-item filter"><input class="form-control multiselect-search" type="text"></li>',
														filterClearBtn : ''
													}
												});
								Custom.hideLoader();

							});
		}
	}

	var urlInstance = SocialView.Filter.clientId;
	SocialView.Filter.Limit = 100;

	$('#lddata').val(2); // seeting load more data hidden box value to 2 in
	// page load,to indicate first page loaded
	// $('#wait_1').hide(); // hiding ajax loader gif image

	/*
	 * $('#source').multiselect({ includeSelectAllOption : true, onChange :
	 * function(option, checked, select) {
	 * 
	 * if (typeof $(option).val() == 'undefined') { $('#selectall').val(100000); }
	 * else { $('#selectall').val(''); } }, maxHeight : 200
	 * 
	 * });
	 */

	$('.filterbtn')
			.on(
					'click',
					function(e) {
						/* setting in hidden client instance */
						e.preventDefault();
						filter = SocialView.Filter;
						if (filter.ajaxreq) {
							bootbox
									.confirm(
											"Another search in progress. Are you sure want to submit?",
											function(result) {
												if (result) {
													if (typeof dataRequest != 'undefined')
														dataRequest.abort();
													clearGrid();

													filterButton_Clicked();
												} else {
												}
											});
						} else {
							filterButton_Clicked();
						}
					});

	function filterButton_Clicked() {
		$('#clnthdid').val($('.client').val());
		selectall = $('#selectall').val();
		$('#filterload').val('');
		var err_msg = 'Please select';
		var err_flag = false;
		SocialView.Filter.personData = ($('.person').select2("data") != null && $(
				'.person').select2("data") != '') ? JSON.stringify($('.person')
				.select2("data")) : '';
		SocialView.Filter.locationData = ($('.location').select2("data") != null)
				&& ($('.location').select2("data") != '') ? JSON.stringify($(
				'.location').select2("data")) : '';

		var clients = $('select.client').select2("val");
		SocialView.Filter.ClientId = clients;
		SocialView.Filter.clientId = clients;
		var location = $('.location').select2("val");
		SocialView.Filter.location = location;
		var person = $('.person').select2("val");
		SocialView.Filter.person = person;
		var status = $('.status').select2("val");
		SocialView.Filter.status = status;
		var cmpt = $('select.cmpt').select2("val");
		SocialView.Filter.compt = cmpt;
		var statusai = $('select.statusai').select2("val");
		SocialView.Filter.active = statusai;
		var qcBy = $('select.qcBy').select2("val");
		SocialView.Filter.qcBy = qcBy;
		var qc2By = $('select.qc2By').select2("val");
		SocialView.Filter.qc2By = qc2By;
		var qc_date_first = $('.qc-start-date').val();
		SocialView.Filter.qcDateFrom = qc_date_first;
		var qc_date_second = $('.qc-end-date').val();
		SocialView.Filter.qcDateTo = qc_date_second;
		var date_first = $('.content-start-date').val();
		SocialView.Filter.dateFrom = date_first;
		var date_second = $('.content-end-date').val();
		SocialView.Filter.dateTo = date_second;
		var source = $('.source').val();
		SocialView.Filter.source = source;
		var authorFlag = $('select.authorFlag').select2("val");
		SocialView.Filter.authorFlag = authorFlag;
		SocialView.Filter.contentIds = '';
		var clientUrl = SocialView.Filter.clientId;
		if (new Date(date_first) > new Date(date_second)) {
			alert('Invalid date range selected');
			return false;
		}
		// If no client is selected or any client is selected set the client id
		// to null
		if (clients == '' || clients == -1) {
			clients = null;
			SocialView.Filter.ClientId = null;
			SocialView.Filter.clientId = null;
		}
		// If qcby is selected, force the user to select the staus also to avoid
		// query issues
		if ((qcBy != '' && status == '') || (qc2By != '' && status == '')) {
			bootbox.alert('Please select a status');
			return false;
		}

		if (source == 'null')
			source = '';
		var filterpagination = '&clients=' + clients + '&location=' + location
				+ '&person=' + person + '&status=' + status + '&cmpt=' + cmpt
				+ '&datefirst=' + date_first + '&datesecond=' + date_second
				+ '&source=' + source + '&authorFlag=' + authorFlag + '&';
		filterpagination += 'locationData=' + SocialView.Filter.locationData
				+ "&personData=" + SocialView.Filter.personData + "&qcBy="
				+ qcBy + "&qc2By=" + qc2By + "&qcdatefirst=" + qc_date_first
				+ "&qcdatesecond=" + qc_date_second;
		$('#filterload').val(filterpagination);
		if (qcBy != "" || qc2By != "") {
			if (qc_date_first == "") {
				err_msg += ' QC From Date,';
				err_flag = true;
			}
			if (qc_date_second == "") {
				err_msg += ' QC To Date,';
				err_flag = true;
			}
		}
		if (date_first == "") {
			err_msg += ' From Date,';
			err_flag = true;
		}
		if (date_second == "") {
			err_msg += ' To Date,';
			err_flag = true;
		}
		if (err_flag == true) {
			return false;
		} else {
			$(".quick-search").val('');
			SocialView.Filter.contentIds = '';
			clearGrid();
			loadGrid(SocialView.Filter, 1, $('.cmblimit').val());
			$('#lddata').val(2);
		}
	}

	var handleMultiSelect = function(rowid, e) {
		var grid = $(this);
		if (!e.ctrlKey && !e.shiftKey) {
			return true;
			// grid.jqGrid('resetSelection');
		} else if (e.shiftKey) {
			var initialRowSelect = grid.jqGrid('getGridParam', 'selrow');
			grid.jqGrid('resetSelection');
			var CurrentSelectIndex = grid.jqGrid('getInd', rowid);
			var InitialSelectIndex = grid.jqGrid('getInd', initialRowSelect);
			var startID = "";
			var endID = "";
			if (CurrentSelectIndex > InitialSelectIndex) {
				startID = initialRowSelect;
				endID = rodateFromwid;
			} else {
				startID = rowid;
				endID = initialRowSelect;
			}
			var shouldSelectRow = false;
			$.each(grid.getDataIDs(), function(_, id) {
				if ((shouldSelectRow = id == startID || shouldSelectRow)
						&& (id != rowid)) {
					grid.jqGrid('setSelection', id, false);
				}
				return id != endID;
			});
		}
		return true;
	};
	/* Grid related script */
	var grid_selector = "#grid-table";

	// Resize to fit page size
	$(window).on('resize.jqGrid', function() {
		$(grid_selector).jqGrid('setGridWidth', $("#gridcntr").width() - 1);
	});
	// On Resize
	$(window).resize(
			function() {

				if (window.afterResize) {
					clearTimeout(window.afterResize);
				}

				window.afterResize = setTimeout(function() {

					jQuery(grid_selector).jqGrid('setGridWidth',
							$("#gridcntr").width() - 1);

				}, 500);

			});

	// Init grid

	presortname = 'mention_time';
	presortorder = 'desc';
	if (SocialView.Filter.sortCol != 'undefined') {
		presortname = SocialView.Filter.sortCol;
		presortorder = SocialView.Filter.sortOrder;
	}
	/*
	 * //Start of datatable var oTable = $('#resizeTable').dataTable( { "sDom":
	 * 'RplfrJti', "autoWidth": false, "oColReorder": { "headerContextMenu":
	 * true }, "columnDefs": [ { "targets": "col_status_type", "visible": false,
	 * "searchable": false, "width":"0%" }, { "targets": "col_count", "visible":
	 * false, "searchable": false,"width":"0%" } , { "targets": "col_flag",
	 * "visible": false, "searchable": false,"width":"0%" } , { "targets":
	 * "col_lockedby", "visible": false, "searchable": false,"width":"0%" } , {
	 * "targets": "col_id", "width":"5%" }, { "targets": "col_loc",
	 * "width":"10%" }, { "targets": "col_per", "width":"10%" }, { "targets":
	 * "col_source", "width":"10%" }, { "targets": "col_content", "width":"50%" }, {
	 * "targets": "col_mtime", "width":"10%" } , { "targets": "col_status",
	 * "width":"5%" } ]
	 *  } );
	 * 
	 * $('#resizeTable').dataTable().draw();
	 */

	// End of datatable
	var colNames = [ '', 'ID', 'Location', 'Person', 'Source', 'Content',
			'Mention Time', 'Status', 'Author Flag', 'status_type', 'count',
			'flag', 'locked_by' ];

	var listColumns = [ {
		name : 'locked',
		index : 'locked',
		width : 3,
		formatter : imageFormatter,
	}, {
		name : 'id',
		index : 'id',
		hidden : false,
		width : 7,
		sortable : true,
		resizable : true
	}, {
		name : 'location_name',
		index : 'location_name',
		width : 7,
		sortable : false,
		formatter : nameFormatter
	}, {
		name : 'person_name',
		index : 'person_name',
		width : 8,
		sortable : false,
		formatter : nameFormatter
	}, {
		name : 'source_name',
		index : 'source_id',
		width : 5,
		sortable : false
	}, {
		name : 'content',
		index : 'response',
		width : 60,
		sortable : false,
		formatter : contentFormatter
	}, {
		name : 'mention_time',
		index : 'mention_time',
		formatter : dateFormatter,
		width : 7,
	}, {
		name : 'status_name',
		index : 'status_name',
		width : 5,
		sortable : false,
		formatter : statusFormatter
	}, {
		name : 'author_post_flag',
		index : 'author_post_flag',
		width : 5,
		sortable : false
	}, {
		name : 'status',
		index : 'status',
		width : 0,
		sortable : false,
		hidden : true
	}, {
		name : 'count',
		index : 'count',
		width : 0,
		sortable : false,
		hidden : true
	}, {
		name : 'active_flag',
		index : 'active_flag',
		hidden : true,
		width : 0,
		sortable : false,
	}, {
		name : 'locked_by',
		index : 'locked_by',
		hidden : true,
	} ];

	if (SocialView.editor_mode) {
		colNames.push("ClientId");
		listColumns.push({
			name : 'client_id',
			index : 'client_id',
			sortable : false,
			width : 10,
		});
	}

	$(grid_selector).jqGrid(
			{
				// url: SocialView.settings.base_url + 'contentjson/items/' +
				// SocialView.settings.datasource,
				datatype : "local",
				height : 'auto',
				shrinkToFit : true,
				colNames : colNames,
				sortname : presortname,
				sortorder : presortorder,
				colModel : listColumns,
				viewrecords : false,
				emptyrecords : "No Records Found.",
				rowNum : 50,
				mtype : "GET",
				altRows : true,
				multiselect : true,
				autowidth : true,
				onSelectRow : function(rowId) {
					var rowData = $("#grid-table").jqGrid('getRowData', rowId);
					gridRowClicked(rowId, rowData);
				},
				onSortCol : function(index, columnIndex, sortOrder) {
					console.log(index + ',' + columnIndex + ',' + sortOrder);
					var pages = SocialView.Filter.Page - 1;
					clearGrid();
					SocialView.Filter.sortCol = index;
					SocialView.Filter.sortOrder = sortOrder;
					loadGrid(SocialView.Filter, 1, $('.cmblimit').val());
					// return 'stop';
				},
				rowattr : function(rowData, inputRowData) {

					if (rowData.active_flag == false)
						return {
							'class' : "linethrough"
						};
					if (rowData.status == 'Q')
						return {
							style : "font-weight : bold !important;"
						};
				},
				loadComplete : function(data) {
					var table = this;
					setTimeout(function() {
						enableTooltips(table);
					}, 0);
				},
				beforeSelectRow : handleMultiSelect,
				gridComplete : function() {
					var ids = $(grid_selector).jqGrid('getDataIDs');
					if (ids == '') {
						$('.ui-pager-control').find('button').attr('disabled',
								'disabled');
					} else {
						if (SocialView.editor_mode) {
							$('.ui-pager-control').find(
									'.editq,.chstat,.dlfrnt').removeAttr(
									'disabled');
							$('.ui-pager-control').find(
									'.lock,.unlock,.loaddata').hide();
						} else {
							$('.ui-pager-control').find('button').removeAttr(
									'disabled');
						}
					}
					$('.jqgrow').mouseover(function(e) {

						/*
						 * * if(e.which ==1){ var rowId = $(this).attr('id');
						 * jQuery(grid_selector).setSelection(rowId, true);
						 * console.log( e); }
						 */

					});
					$('.ui-pager-control').find('.dwnload').removeAttr(
							'disabled');
				},
				loadComplete : function(data) {

				},
				caption : "Listing.."
			});
	$(window).triggerHandler('resize.jqGrid');
	$(window).trigger('resize');
	// the grid get the correct size
	// $(grid_selector).disableSelection();
	// Enable content-start-date
	function pickDate(cellvalue, options, cell) {
		setTimeout(function() {
			$(cell).find('input[type=text]').content - start - date({
				format : 'yyyy-mm-dd',
				autoclose : true
			});
		}, 0);
	}

	function dateFormatter(cellvalue, options, rowObject) {
		return cellvalue.substring(0, 10);
	}

	function imageFormatter(cellvalue, options, rowObject) {
		var editable = "", locktext = "Locked ";
		if (typeof rowObject.locked_by != 'undefined'
				&& rowObject.locked_by != SocialView.user_id) {
			locktext += " by " + rowObject.locked_by;
			// console.log(rowObject);
			$('#grid-table.jqgrow input').attr("disabled", "disabled");
			editable = "ui-icon-lock-warn";
		}

		var lock = "<div title=\""
				+ locktext
				+ "\" style=\"\" class=\"ui-pg-div\"  onclick=\"$.fn.fmatter.rowactions.call(this,'edit');\" onmouseover=\"$(this).addClass('ui-state-hover');\" onmouseout=\"$(this).removeClass('ui-state-hover')\" data-original-title=\"Locked\"><span class=\"ui-icon ui-icon-lock "
				+ editable + " \"></span></div>";
		var unlock = "<div  class=\"ui-pg-div\" data-original-title=\"UnLocked\"><span class=\"ui-icon ui-icon-unlock\"></span></div>";
		if (cellvalue == true) {
			return lock;
		} else
			return unlock;
	}

	function nameFormatter(cellvalue, options, rowObject) {
		if (typeof cellvalue == 'undefined') {
			return "--";
		}

		return cellvalue;
	}

	function contentFormatter(cellvalue, options, rowObject) {
		var val = cellvalue.replace(/(\r\n|\n|\r)/gm, "");
		try {
			val = $.parseJSON(val);
			if (typeof val[val['default']] != 'undefined') {
				return val[val['default']].replace(/(\r\n|\n|\r)/gm, "");
			} else {
				console.log(val['default']);
			}
		} catch (Exception) {
		}
		return cellvalue;
	}

	function statusFormatter(cellvalue, options, rowObject) {
		return rowObject.status + ' - ' + rowObject.count;
	}

	function gridRowClicked(rowId, rowData) {
		if (SocialView.Filter.quickedit) {
			bootbox.dialog({
				message : "Locking for editing ...",
				closeButton : false
			});
			retdata = $.parseJSON(lockDocument("document=" + rowId, false));

			bootbox.hideAll();
			console.log(retdata);
			if (retdata.locked.length > 0) {
				var clientUrl = SocialView.Filter.clientId;
				window.location.href = SocialView.base_url
						+ 'management/content/' + clientUrl + '/edit';
			} else {
				bootbox
						.alert('Cannot lock the content. It may already locked by some other user');
			}
		}
	}

	$(grid_selector).jqGrid().setGridParam({});

	function enableTooltips(table) {
		$('.navtable .ui-pg-button').tooltip({
			container : 'body'
		});
		$(table).find('.ui-pg-div').tooltip({
			container : 'body'
		});
	}

	$(document).on('ajaxloadstart', function(e) {
		$(grid_selector).jqGrid('GridUnload');
		$('.ui-jqdialog').remove();
	});

	$(".ui-jqgrid-titlebar").hide();/* remove grid title */
	// Delete
	$('.dlfrnt')
			.click(
					function() {
						$('#hddlml').val('');

						var grid = $("#grid-table");
						var str = '';
						var selRowId = grid.jqGrid('getGridParam', 'selarrrow');
						str = selRowId;
						$('#hddlml').val(str);

						if (str == '') {
							alert('Select an item to delete');
							return false;
						}
						gridAlert('Deleting ...');
						var urlgridDelete = SocialView.base_url
								+ 'management/content/'
								+ SocialView.Filter.clientId + '/gridDelete/';
						$
								.ajax({
									type : "POST",
									url : urlgridDelete,
									dataType : "text",
									data : {
										griddelete : str,
										editor_mode : SocialView.editor_mode
									},
									error : function() {
										window.location.reload();
									}
								})
								.done(
										function(data) {
											var result = $.parseJSON(data);
											var newval = '';
											$('#cmpparse').val('');
											if (result.status.undeleted.length > 0) {

												$.each(result.status.undeleted,
														function(index, value) {
															newval += value.id
																	+ ',';
														});
												$('#cmpparse').val(newval);
												var strlast = $('#cmpparse')
														.val();
												var finalstring = strlast
														.substring(
																0,
																strlast.length - 1);
												var str1 = $('#hddlml').val();
												var str2 = finalstring;

												var array1 = str1.split(',');
												var array2 = str2.split(',');

												// Filtered below
												arrayFinal = $(array1).not(
														array2).get();

												arrayFinal = arrayFinal
														.toString();

												if (arrayFinal == '') {
													gridAlert('Seleted Items cannot be deleted its already published/engaged.');
													alert('Seleted Items cannot be deleted its already published/engaged.');
													return false;

												}
												var match = arrayFinal
														.split(',');
												for ( var a in match) {
													$(
															"#grid-table tr#"
																	+ match[a]
																	+ " ")
															.addClass(
																	'linethrough');
												}
												gridAlert('Some of the document cannot be deleted.Its already engaged');
												alert('Some of the document cannot be deleted.Its already engaged');
											} else {
												var newstr;
												newstr = $('#hddlml').val();
												var match = newstr.split(',');

												for ( var b in match) {
													$(
															"#grid-table tr#"
																	+ match[b]
																	+ " ")
															.addClass(
																	'linethrough');
													if (SocialView.editor_mode) {
														$(
																"#grid-table tr#"
																		+ match[b]
																		+ " ")
																.remove();
													}
												}

												$(
														"#grid-table  tr td :checkbox")
														.prop("checked", false);
												grid.jqGrid('resetSelection');
												gridAlert('Successfully deleted.');
											}
										});
					});
	// Undelete
	$('.undo')
			.click(
					function() {
						$('#uhddlml').val('');
						var grid = $("#grid-table");
						var str = grid.jqGrid('getGridParam', 'selarrrow');
						;
						$('#uhddlml').val(str);
						if (str == '') {
							alert('Select an item to undelete');
							return false;
						}
						gridAlert('UnDeleting ...');
						var urlgridunDelete = SocialView.base_url
								+ 'management/content/'
								+ SocialView.Filter.clientId + '/gridUnDelete/';
						$
								.ajax(
										{
											type : "POST",
											url : urlgridunDelete,
											dataType : "text",
											data : {
												gridundelete : str
											},
											error : function() {
												window.location.reload();
												gridAlert('An error has occurred,please try agian later.');
											}
										})
								.done(
										function(data) {
											var newstr = '';
											newstr = $('#uhddlml').val();
											var match = newstr.split(',');
											for ( var a in match) {
												$(
														"#grid-table tr#"
																+ match[a]
																+ " ")
														.removeClass(
																'linethrough');
												$(
														"#grid-table  tr td :checkbox")
														.prop("checked", false);
												grid.jqGrid('resetSelection');
											}
											gridAlert('Successfully recovered all the items');
										});
					});
	// Unlock
	$(".unlock")
			.on(
					'click',
					function(e) {
						var grid = $("#grid-table");
						var selRowId = grid.jqGrid('getGridParam', 'selarrrow');

						if (selRowId == '') {
							bootbox
									.confirm(
											"No item selected to unlock. Do you want to unlock all items?",
											function(result) {
												if (result) {
													unlockAll(true);
												}

											});
							return false;
						}
						selRowId = selRowId.toString();

						var unlockPath = "";
						var urlUnLock = SocialView.base_url
								+ 'management/content/'
								+ SocialView.Filter.clientId + '/removeLock/';
						var comma = selRowId.split(",");

						for (var si = 0; si < comma.length; si++) {
							unlockPath += "document=" + comma[si] + '&';
						}

						$.ajax({
							type : "POST",

							url : urlUnLock,
							dataType : "text",
							data : {
								un_lock_data_list : unlockPath
							},
							error : function() {
								window.location.reload();
							}
						}).done(function(data) {
							unlockUpdate(data);
						});
					});

	function unlockAll(refresh) {
		urlunlockall = SocialView.base_url + 'management/content/'
				+ SocialView.Filter.clientId + '/unLockAll/';
		$.ajax({
			type : "POST",
			async : false,
			url : urlunlockall,
			dataType : "text",
			data : {},
			error : function() {
				// window.location.reload();
			}
		}).done(function(data) {
			if (refresh) {
				var pages = SocialView.Filter.Page - 1;
				clearGrid();
				loadGrid(SocialView.Filter, 1, pages * 100);
				console.log(data);
			} else {
				location.reload();
			}
		});
	}
	function unlockUpdate(data) {
		var objs = $.parseJSON(data);

		if (objs.ignored == '') {
			$
					.map(
							objs.unlocked,
							function(id) {
								$("#grid-table tr#" + id)
										.find("input[type=checkbox]")
										.closest('td')
										.next('td')
										.html(
												"<div data-original-title='UnLocked' class=\"ui-pg-div\"><span class=\"ui-icon ui-icon-unlock\"></span></div>");
							});

			gridAlert('Successfully Unlocked.');
		} else {
			gridAlert('These items cannot be Unlocked.');
		}
	}

	// Lock
	$('.lock')
			.click(
					function() {
						gridAlert('Locking process started....');
						var grid = $("#grid-table");
						var selRowId = grid.jqGrid('getGridParam', 'selarrrow');
						var str = '';
						var i;

						if (selRowId == '') { // if user not selected
							// anything,automatically
							// picking first five
							$("#grid-table  tr td :checkbox:lt(5)").prop(
									"checked", true);
							for (i = 0; i < 5; i++) {

								str += grid.getDataIDs()[i] + ',';
								grid.setSelection(grid.getDataIDs()[i], true);
							}
						} else {
							str = selRowId;
							str = str + ',';
						}

						var match = str.split(',');
						var matchCount = 0;

						for ( var a in match) {
							matchCount += 1;
						}

						if (matchCount - 1 > 1000) {

							alert('You are not allowed to select more than 1000 content at a time for locking.');
							return false;
						}

						var servicePath = "";
						var comma = str.split(",");
						for (var si = 0; si < comma.length - 1; si++) {
							servicePath += "document=" + comma[si] + '&';
						}
						lockDocument(servicePath, true);

					});

	function lockDocument(docList, isasync) {
		var urlLock = SocialView.base_url + 'management/content/admin/addLock/';
		var client = 'admin';
		if (null != SocialView.Filter.clientId) {
			client = SocialView.Filter.clientId;
		}
		var retdata;
		$
				.ajax({
					type : "POST",
					async : isasync,
					url : urlLock,
					dataType : "text",
					data : {
						lock_data_list : docList,
						ds : client
					},
					error : function() {
						// window.location.reload();
					}
				})
				.done(
						function(data) {
							retdata = data;
							if (data != false) {
								var obj = $.parseJSON(data);
								if (obj.status.code == 500) {
									gridAlert('Locking process cannot be completed.User may not have permission to lock.');
								} else {
									if (obj.ignored.length > 0) {
										gridAlert('Some of the items alreday in locked state.');
									}
									$
											.map(
													obj.locked,
													function(id) {
														$(
																"#grid-table tr#"
																		+ id)
																.find(
																		"input[type=checkbox]")
																.closest('td')
																.next('td')
																.html(
																		"<div data-original-title='Locked' class=\"ui-pg-div\"><span class=\"ui-icon ui-icon-lock\"></span></div>");
													});
									gridAlert('Locking process completed.');
								}

							} else {
								gridAlert('Locking process failed, please try again.');
							}
						});
		return retdata;
	}
	// Load more data
	$('.cmblimit').on(
			"change",
			function() {

				if (typeof SocialView.Filter.clientId != 'undefined') {
					jQuery('#grid-table').jqGrid('clearGridData').jqGrid(
							'setGridParam', {
								data : [],
								datatype : 'json'
							}).trigger('reloadGrid');
					len = loadGrid(SocialView.Filter, 1, $('.cmblimit').val());
				}
			});

	// Edit Queue
	$('.editq').click(
			function() {
				var clientUrl = 'admin';
				if (null != SocialView.Filter.clientId) {
					clientUrl = SocialView.Filter.clientId;
				}
				window.location.href = SocialView.base_url
						+ 'management/content/' + clientUrl + '/edit';
			});

	// Start taging - Locking as well as Edit queue happening in this call
	$(".starttag").on(
			"click",
			function() {

				var grid = $("#grid-table");
				var selRowId = grid.jqGrid('getGridParam', 'selarrrow');
				selRowId = selRowId.toString();
				servicePath = '';
				var client = SocialView.settings.datasource;
				var urlLock = SocialView.base_url + 'management/content'
						+ SocialView.Filter.clientId + '/addLock';
				var comma = selRowId.split(",");
				for (var si = 0; si < comma.length; si++) {
					servicePath += "document=" + comma[si] + '&';
				}

				$.ajax({
					type : "POST",

					url : urlLock,
					dataType : "text",
					data : {
						lock_data_list : servicePath,
						ds : client
					},
					error : function() {
						window.location.reload();
					}
				}).done(
						function(data) {

							var clientUrl = SocialView.Filter.clientId;
							window.location.href = SocialView.base_url
									+ 'management/content/' + clientUrl
									+ '/edit';

						});
			});

	$(".quick-search")
			.keydown(
					function(e) {

						// Allow: backspace, delete, tab, escape, enter and .
						if (e.keyCode == 13) {
							if (!this.checkValidity()) {
								bootbox.alert('ContentIds are only numeric');
								return;
							} else {
								bootbox
										.confirm(
												"This will reset your search filter.Are you sure want to continue?",
												function(result) {
													if (result) {
														clearGrid();
														SocialView.Filter.contentIds = $(
																".quick-search")
																.val();
														loadGrid(
																SocialView.Filter,
																1, 100);
														// reload grid with
														// contentIdset

													}
												});

							}
						}
					});
	// Fav related
	var ClientCookie = function() {
		var cookieName = 'Fav-' + SocialView.user_id.replace('@', '-');
		var cookie = $.cookie(cookieName);
		if (typeof cookie != 'undefined') {
		} else {
			cookie = "[]";
		}
		var store = JSON.parse(cookie);

		return {
			add : function(title, text) {
				if (/,/i.test(text))
					text = "'" + text + "'";
				var new_Item = {
					title : title,
					text : text
				};
				store.push(new_Item);
				this.save();
			},
			remove : function(title) {
				/* store.splice(index, 1); */
				if (this.list() == null || this.list().length < 1)
					return false;
				for (var idx = 0; idx < this.list().length; idx++)
					if (store[idx].title == title) {
						store.splice(idx, 1);
						this.save();
						return true;
					}

				return false;
			},
			count : function() {
				if (this.list() == null || this.list().length < 1)
					return 0;
				return this.list().length;
			},
			hasitem : function(title) {
				if (this.list() == null || this.list().length < 1)
					return false;
				for (var idx = 0; idx < this.list().length; idx++) {

					if (store[idx].title == title)
						return true;
				}
				return false;
			},
			list : function() {
				return store;
			},
			save : function() {
				var date = new Date();
				date.setMonth(date.getMonth() + 12);
				$.cookie(cookieName, JSON.stringify(store), {
					expires : date
				});
			}
		};
	};

	function updateFavs() {
		var clientcookie = new ClientCookie();
		$('#cookieul').html('');
		if (clientcookie.list() == null || clientcookie.list().length < 1) {
			$('#cookieul').append(
					'<li ><a href="#">No favourites found</a></li>');
			return false;
		}
		$.each(clientcookie.list(), function(i, e) {
			$('#cookieul').append(
					'<li id=' + e.title + '><a href="#">' + e.text
							+ '</a></li>');
		});
	}

	$("select.client").select2().bind("change", function() {
		var client = $('select.client').select2("val");
		var client_replace = '';

		// If no client is selected, then disable the location and person fields
		// Also set client as admin for loading the sources
		if (client == '' || client == 'admin') {
			client = 'admin';
			client_replace = 'admin';
			$('.location').attr('disabled', 'disabled');
			$('.person').attr('disabled', 'disabled');
			$('.cmpt').attr('disabled', 'disabled');
		} else {
			client_replace = client;
			$('.location').removeAttr('disabled');
			$('.person').removeAttr('disabled');
			$('.cmpt').removeAttr('disabled');

		}

		loadEntity(client, 'Location', $("select.cmpt").select2('val'));
		loadEntity(client, 'Person', $("select.cmpt").select2('val'));
		var clientcookie = new ClientCookie();
		triggerSource(client_replace, $.pageLoad);
		if (clientcookie.hasitem(client))
			$(".cookieul").addClass('favcheck');
		else
			$(".cookieul").removeClass('favcheck');
	});

	$('select.qcBy, select.qc2By').bind("change", function() {
		var elm = $(this); // Get the element which has been changed
		var qcEmail = elm.select2("val");

		// if qc1by is set, then disable qc2by and vice versa
		if (elm.hasClass('qcBy')) {
			if (qcEmail != '') {
				$('select.qc2By').attr('disabled', 'disabled');
			} else {
				$('select.qc2By').removeAttr('disabled', 'disabled');
			}
			$('select.qc2By').select2("val", '');
		} else if (elm.hasClass('qc2By')) {
			if (qcEmail != '') {
				$('select.qcBy').attr('disabled', 'disabled');
			} else {
				$('select.qcBy').removeAttr('disabled', 'disabled');
			}
			$('select.qcBy').select2("val", '');
		}
		if (qcEmail == '') {
			$('.qc-date').addClass('hidden');
			$('.content-start-date').removeAttr('disabled');
			$('.content-end-date').removeAttr('disabled');
		} else {
			$('.qc-date').removeClass('hidden');
			$('.content-start-date').prop("disabled", true);
			$('.content-end-date').prop("disabled", true);
		}
		// If selected any QC by, set the status to 'P'
		// Because for any QC by, document status is always P
		if (qcEmail != '') {
			$('.status').select2("val", 'P');
		} else {
		}
	});

	$("select.cmpt").select2().bind("change", function() {
		var client = $('select.client').select2("val");
		loadEntity(client, 'Location', $("select.cmpt").select2('val'));
		loadEntity(client, 'Person', $("select.cmpt").select2('val'));
	});

	$(".cookieul").on("click", function() {
		var newValue = $(".client option:selected").text();
		var selValue = $(".client option:selected").val();
		var clientcookie = new ClientCookie();

		if (/,/i.test(newValue))
			newValue = "'" + newValue + "'";
		if (newValue == '') {
			alert('Select an item from organization list to set as Favourite');
			return false;
		}
		if (clientcookie.hasitem(selValue))
			clientcookie.remove(selValue);
		else
			clientcookie.add(selValue, newValue);
		updateFavs();
		$(".client").trigger("change");

		function unique(list) {
			var result = [];
			$.each(list, function(i, e) {
				if ($.inArray(e, result) == -1)
					result.push(e);
			});
			return result;
		}

	});

	$("#cookieul li").live('click', function(e) {
		e.preventDefault();
		$(".client").val(this.id).trigger('change');
	});

	$(".chstat").on(
			"click",
			function() {

				var grid = $("#grid-table");
				var selRowId = grid.jqGrid('getGridParam', 'selarrrow');

				if (selRowId.length == 0) {
					alert('Select an item to change status');
					return false;
				}

				var pValues = [], qValues = []; // where to store the results

				for ( var a in selRowId) {

					value = grid.jqGrid('getCell', selRowId[a], 'status');

					if (value == 'P')
						pValues.push(selRowId[a]);
					else if (value == 'Q')
						qValues.push(selRowId[a]);
					else if (value == 'N')
						qValues.push(selRowId[a]);
					else if (value == 'X')
						qValues.push(selRowId[a]);

				}

				gridStatus("Status is being changed...", false, true);
				str = selRowId;
				var urlstatChange = SocialView.base_url + 'management/content/'
						+ SocialView.Filter.clientId + '/statchange';
				$.ajax({
					type : "POST",
					url : urlstatChange,
					dataType : "text",
					data : {
						p : pValues,
						q : qValues,
						editor_mode : SocialView.editor_mode
					},
					error : function() {
						gridStatus("Error with status change.", true, false);
					}
				}).done(function(data) {
					gridStatus("Status toggled.", true, false);
					var pages = SocialView.Filter.Page - 1;
					clearGrid();
					SocialView.Filter.Page = pages;
					loadGrid(SocialView.Filter, 1, pages * 100);
					/* load all data */

				});
			});

	$(".quick-edit").change(function() {
		SocialView.Filter.quickedit = $(".quick-edit").prop('checked');
		$(".quick-edit").prop('checked', SocialView.Filter.quickedit);
		cookieName = 'quick-' + SocialView.user_id.replace('@', '-');
		if (!$.pageload) {
			var cookie = $.cookie(cookieName, SocialView.Filter.quickedit);
		}
	});
	/* All initializations */
	$(".client").trigger("change");
	updateFavs();
	ClientId = SocialView.Filter.clientId;
	if (typeof ClientId != 'undefined' && ClientId != 'admin') {
		/*
		 * $(".client").val(ClientId).trigger('chosen:updated');
		 * triggerSource(ClientId);
		 */
	}
	/*
	 * if(SocialView.Filter.ClientId!='')
	 * $(".client").val(SocialView.Filter.ClientId).trigger('chosen:updated');
	 */
	$("select.select2, select.select2-multiple,select.select2-allow-clear")
			.select2({
				placeholder : "",
				allowClear : true,
				closeOnSelect : false
			});
	$("select.select2-nosearch").select2({
		minimumResultsForSearch : -1
	});
	$("select.select2-nosearch-allow-clear").select2({
		minimumResultsForSearch : -1,
		allowClear : true
	});
	/* autohide */
	cookieName = 'quick-' + SocialView.user_id.replace('@', '-');
	var quickeditcookie = $.cookie(cookieName);
	quickeditval = (typeof quickeditcookie != 'undefined')
			&& (quickeditcookie.trim() === "true");
	$(".quick-edit").prop('checked', quickeditval);
	SocialView.Filter.quickedit = quickeditval;
	$(".quick-search").val(SocialView.Filter.contentIds);

	if (SocialView.editor_mode) {
		cookieName = 'industry-' + SocialView.user_id.replace('@', '-');
		if (!$.cookie(cookieName) && undefined != $.cookie(cookieName)) {
//			$(".cmbindustry").val("");
//			$.cookie(cookieName, "healthcare");
		} else {
			if ($('.cmbindustry option[disabled != disabled]').size() == 1) {
				$(".cmbindustry").val($(".cmbindustry option:eq(1)").val());
				$.cookie(cookieName, $(".cmbindustry").val());
			} else {
				if ($(".cmbindustry option[value='"+$.cookie(cookieName)+"']").length > 0) {
					$(".cmbindustry").val($.cookie(cookieName));
				} else {
					$(".cmbindustry").val('');
					$.cookie(cookieName, $(".cmbindustry").val());
				}
			}
		}
		// var cookie = $.cookie(cookieName, SocialView.Filter.quickedit);
	}

	$(".cmbindustry")
			.on(
					"change",
					function() {
						bootbox
								.confirm(
										"This will release existing allocation. Do you want to continue?",
										function(response) {
											cookieName = 'industry-'
													+ SocialView.user_id
															.replace('@', '-');
											if (response) {
												$.cookie(cookieName, $(
														".cmbindustry").val());
												Custom.showLoader();
												unlockAll(false);
											} else {
												$(".cmbindustry").val(
														$.cookie(cookieName));
											}
										});
					});

	$('.downloadFlteredList').on('click', function() {
		var urlDwnld = SocialView.base_url + 'management/content/'
		+ SocialView.Filter.clientId + '/downloadList';
		$.ajax({
			type : "POST",
			url : urlDwnld,
			dataType : "json",
			data : {
				type: 'lockIds',
				client: SocialView.Filter.clientId
			},
			error : function() {
			}
		}).done(function(data) {
			if (data.status.code == 200) {
				window.open(data.url, '_blank');
			}
		});
	});

	$('.downloadNext').on('click', function() {
		$('#dwnld-start-date').val($.datepicker.formatDate('mm/dd/yy', new Date()));
		$('#dwnld-end-date').val($.datepicker.formatDate('mm/dd/yy', new Date()));
		
		var box = bootbox.dialog({
			message : getBootboxMessage(),
			title : "Configure your download",
			id : "dwnldFilter",
			backdrop : 'static',
			buttons : [ {
				label : "Download",
				className : "btn btn-primary pull-left",
				callback : function() {
					dwnldFiltrdLst();
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
		$('.date-popup').datepicker({
			format : 'mm/dd/yyyy',
			autoclose : true
		});
		$('.content-start-date-dwnload').on('change', function(){
			$('#dwnld-start-date').val(this.value);
		});
		$('.content-end-date-dwnload').on('change', function(){
			$('#dwnld-end-date').val(this.value);
		});

	});
	
	function getBootboxMessage() {
		var content = $(".form-content").html();
		var object = $('<div/>').html(content).contents();

		object.find('.product_dwnload').select2({});
		object.find('.product_dwnload').select2('val', []);
		
		object.find('.dwnload-lmt').select2({});
		object.find('.dwnload-lmt').select2('val', ['100']);

		return object
	} 

	function dwnldFiltrdLst() {
		
		var urlDwnld = SocialView.base_url + 'management/content/'
		+ SocialView.Filter.clientId + '/downloadList';
		var err_msg = 'Please select';
		var err_flag = false;

		var product = $('.product_dwnload').select2('val');
		var date_first = $("#dwnld-start-date").val();
		var date_second = $('#dwnld-end-date').val();
		var dwnldLmt = $('.dwnload-lmt').select2('val');
		
		// Check the date range selected
		if (new Date(date_first) > new Date(date_second)) {
			bootbox.alert('Invalid date range selected');
			return false;
		}

		if (product == '' || null == product) {
			err_msg += ' Product,';
			err_flag = true;
		}

		if (date_first == "") {
			err_msg += ' From Date,';
			err_flag = true;
		}
		if (date_second == "") {
			err_msg += ' To Date,';
			err_flag = true;
		}
		if (err_flag == true) {
			bootbox.alert(err_msg.slice(0, -1));
			return false;
		} else {
			$.ajax({
				type : "POST",
				url : urlDwnld,
				dataType : "json",
				data : {
					type: 'qcreport',
					product : product,
					startDate:date_first,
					endDate:date_second,
					limit:dwnldLmt,
					client:SocialView.Filter.clientId
				},
				error : function() {
				}
			}).done(function(data) {
				if (data.status.code == 200) {
					window.open(data.url, '_blank');
				}
			});
		}
	}

});

setTimeout(function() {

	$.pageLoad = false;
	if (typeof SocialView.Filter.ClientId != 'undefined'
			|| SocialView.editor_mode) {
		var pages = SocialView.Filter.Page;
		clearGrid();
		SocialView.Filter.Page = pages;
		if (SocialView.editor_mode) {
			SocialView.Filter.industry = $(".cmbindustry").val();
		}
		if (null != SocialView.Filter.industry) {
			loadGrid(SocialView.Filter, 1, pages * 100);
		}

	} else {
		gridStatus('No filters defined.', true, false);
	}
}, 1000);

function loadGridDataParams() {
	var clients = $('.client').val();
	SocialView.Filter.clientId = clients;
	var location = $('.location').val();
	SocialView.Filter.location = location;
	var person = $('.person').val();
	SocialView.Filter.person = person;
	var status = $('.status').val();
	SocialView.Filter.status = status;
	var cmpt = $('.cmpt').val();
	SocialView.Filter.compt = cmpt;
	var statusai = $('.statusai').val();
	SocialView.Filter.active = statusai;
	var authorFlag = $('.authorFlag').val();
	SocialView.Filter.authorFlag = authorFlag;
	var qcBy = $('select.qcBy').select2("val");
	SocialView.Filter.qcBy = qcBy;
	var qc2By = $('select.qc2By').select2("val");
	SocialView.Filter.qc2By = qc2By;
	var qc_date_first = $('.qc-start-date').val();
	SocialView.Filter.qcDateFrom = qc_date_first;
	var qc_date_second = $('.qc-end-date').val();
	SocialView.Filter.qcDateTo = qc_date_second;
	var date_first = $('.content-start-date').val();
	SocialView.Filter.dateFrom = date_first;
	var date_second = $('.content-end-date').val();
	SocialView.Filter.dateTo = date_second;
	var source = $('.source').val();
	SocialView.Filter.source = source;
}

function loadGrid(filter, pStart, pLimit) {
	if (typeof filter != 'object') {
		return false;
	}
	var dataUrl = SocialView.base_url + 'management/content/admin/json';
	var clients = filter.clientId;
	var location = filter.location;
	var person = filter.person;
	var status = filter.status;
	var cmpt = filter.compt;
	var date_first = filter.dateFrom;
	var date_second = filter.dateTo;
	var qc_by = filter.qcBy;
	var qc2_by = filter.qc2By;
	var qc_date_first = filter.qcDateFrom;
	var qc_date_second = filter.qcDateTo;
	var source = filter.source;
	var pageno = pStart;
	var active = filter.active;
	var contentIds = filter.contentIds;
	var authorFlag = filter.authorFlag
	filter.ajaxreq = true;
	var orderCol = (typeof filter.sortCol) != 'undefined' ? filter.sortCol : '';
	var orderDir = (typeof filter.sortOrder) != 'undefined' ? filter.sortOrder
			: '';

	var filterpagination = '&clients=' + clients + '&contentIds=' + contentIds
			+ '&location=' + location + '&person=' + person + '&status='
			+ status + '&authorFlag=' + authorFlag + '&cmpt=' + cmpt
			+ '&datefirst=' + date_first + '&datesecond=' + date_second
			+ '&flag=' + active + '&source=' + source + '&' + '&personData='
			+ SocialView.Filter.personData + '&locationData='
			+ SocialView.Filter.locationData + "&qcBy=" + qc_by + "&qc2By="
			+ qc2_by + "&qcdatefirst=" + qc_date_first + "&qcdatesecond="
			+ qc_date_second;
	filterpagination += ('&sortBy=' + orderCol + '&sortDirection=' + orderDir);
	if (pLimit != '')
		filterpagination += ('&limit=' + pLimit + '&');
	// Filterload
	var formData = 'page=' + pageno + '&clientUrlpass=' + clients
			+ filterpagination + "&editor_mode=" + SocialView.editor_mode
			+ "&industry=" + filter.industry + "&filterData="
			+ JSON.stringify(filter);
	gridStatus("Loading... ", false, true);
	$('.cmblimit').attr('disabled', 'disabled');
	dataRequest = $
			.ajax({
				type : "POST",
				// async : false,
				url : dataUrl,
				dataType : "json",
				data : formData,
				abort : function() {
					console.log('aborted');
					filter.ajaxreq = false;
				},
				error : function(xhr, status, error) {
					$('.cmblimit').removeAttr('disabled');
					gridStatus("Cannot update list", true, false);
					filter.ajaxreq = false;
					return false;
				}
			})
			.done(
					function(data) {
						$('.cmblimit').removeAttr('disabled');
						filter.ajaxreq = false;
						// add rows replace tags;
						for (var i = 0; i < data['rows'].length; i++) {
							console.log(data['rows'][i].content);
							data['rows'][i].content = data['rows'][i].content
									.replace(/</g, "&lt;")
									.replace(/>/g, "&gt;");

							$("#grid-table").jqGrid('addRowData',
									data['rows'][i]['id'], data['rows'][i],
									"last");
						}
						len = data['rows'].length;
						if (len >= 1) {
							SocialView.Filter.Page = parseInt(SocialView.Filter.Page) + 1;
							if (len < 100)
								$(".loaddata").attr('disabled', 'disabled');
							else
								$(".loaddata").removeAttr('disabled');
							gridStatus($("#grid-table")
									.getGridParam("reccount")
									+ ' Documents ', false, false);
							$('.document-count').html($("#grid-table")
									.getGridParam("reccount")+'<i class="fa fa-file-text"></i>');
							$('.document-count').attr('title', $("#grid-table")
									.getGridParam("reccount") + ' Documents')
						} else if (pStart == 1) {
							$(".loaddata").attr('disabled', 'disabled');
							gridStatus("No records found", false, false);
						} else {
							$(".loaddata").attr('disabled', 'disabled');
							gridStatus("No more records available", true, false);
						}
						if (pStart == 1) {
							$(window).triggerHandler('resize.jqGrid');
						}
					});

	return true;
}
var dataRequest;
function gridStatus(text, hide, animate) {
	$(".lckstat").stop();
	$('.lckstat').fadeIn(100);
	$('.lckstat').html(text);
	if (animate) {
		$('.lckstat').append(" <span class='loadspinner glyphicon'></span>");
	}
	if (hide) {
		$('.lckstat').fadeOut(2000, function() {
			$('.lckstat').html('');
		});
	}
}

function gridAlert(text) {
	$(".gridstat").stop();
	$('.gridstat').fadeIn(100);
	$('.gridstat').html(text);
	$('.gridstat').fadeOut(2000, function() {
		$('.gridstat').html('');
	});
}

function clearGrid() {
	$('#grid-table').jqGrid("clearGridData");
	SocialView.Filter.Page = 1;
	return true;
}

function loadEntity(client, entityType, competitor) {
	SocialView.Filter.query = [];
	SocialView.Filter.query[entityType] = '';
	$('.' + entityType.toLowerCase()).select2('val', '');
	$('.' + entityType.toLowerCase()).select2(
			{
				placeholder : 'Search for ' + entityType,
				allowClear : true,
				minimumInputLength : 2,
				ajax : {
					url : SocialView.base_url + 'management/content/' + client
							+ '/entityjson/' + entityType + '/' + competitor
							+ '/',
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
					if ((typeof SocialView.Filter[entityType.toLowerCase()
							+ 'Data'] != 'undefined')
							&& typeof SocialView.Filter[entityType
									.toLowerCase()
									+ 'Data'] != null) {
						var data = jQuery
								.parseJSON(SocialView.Filter[entityType
										.toLowerCase()
										+ 'Data']);
						return callback(data);
					}
					return '[]';
				}
			});
}