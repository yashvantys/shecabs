var PSI = function() {
    return {
        scorecard: function() {
            $.ajax({
                url: $("#my-pages-wrapper").attr("data-url"),
                context: $("#my-pages-wrapper")

            }).fail(function() {
                $("#my-pages-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
            }).done(function(data) {
                $("#my-pages-wrapper").html(data);
                $("img.lazy").lazyload({
                    event: "sporty"
                });
                setTimeout(function() {
                    $("img.lazy").trigger("sporty");
                }, 8000);

                //   listFilter($("div.search-wrapper"), $("div.clients-list"));
            }).complete(function() {
                Metronic.unblockUI('.main-content');
            });

            $(document).on('click', '.kpi_item', function(e) {      
                e.preventDefault();
                var id = $(this).attr('data-slug');
                $('html,body').animate({
                    scrollTop: ($('#'+id).offset().top-$(".navbar-fixed-top").height())
                }, 1000,'swing');
           });
        },
        trends: function() {

            $.ajax({
                url: $("#my-pages-wrapper").attr("data-url"),
                context: $("#my-pages-wrapper")

            }).fail(function() {
                $("#my-pages-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
            }).done(function(data) {
                $("#my-pages-wrapper").html(data);
                $("img.lazy").lazyload({
                    event: "sporty"
                });
                setTimeout(function() {
                    $("img.lazy").trigger("sporty");
                }, 8000);

                trend_fusion_chart();

                //   listFilter($("div.search-wrapper"), $("div.clients-list"));
            }).complete(function() {
                Metronic.unblockUI('.main-content');
            });

            function trend_fusion_chart() {

                var fusion_chart_json_data = $("#fusion-chart-json-data").attr("data-json");
                //console.log(fusion_chart_json_data);
                fusion_chart_json_data = JSON.parse(fusion_chart_json_data);

                FusionCharts.setCurrentRenderer("javascript");
                var myChart = new FusionCharts( "MSStackedColumn2DLineDY", "myChartId", "100%", "600" );
                myChart.setJSONData(fusion_chart_json_data);
                myChart.configure("ChartNoDataText", "No data to display!");
                myChart.render("socialScoreChart");

            }
        },
        monthWiseKpiData: function(previous_month,previous_year){
            Metronic.blockUI({ target: '.main-content',animate: true,overlayColor: 'none'});
            
            $.ajax({
                url: SocialView.base_url + "psi/" + client_id + "/getMonthWiseKpiData/" + provider_code,
                context: $("#kpi-table-wrapper"),
                data:{'previous_month':previous_month,'previous_year':previous_year},
                type:"POST",

            }).fail(function() {
                $("#kpi-table-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
            }).done(function(data) {
                $("#kpi-table-wrapper").html(data);
                $("img.lazy").lazyload({
                    event: "sporty"
                });
                setTimeout(function() {
                    $("img.lazy").trigger("sporty");
                }, 8000);

                month_wise_content();
                
            }).complete(function() {
                Metronic.unblockUI('.main-content');
            });

            function month_wise_content(){
                $.ajax({
                    url: SocialView.base_url + "psi/" + client_id + "/getMonthWiseContentData/" + provider_code,
                    context: $("#trends-content-wrapper"),
                    data:{'previous_month':previous_month,'previous_year':previous_year},
                    type:"POST",

                }).fail(function() {
                    $("#trends-content-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
                }).done(function(data) {
                    $("#trends-content-wrapper").html(data);
                });
            }
        },
        benchmark: function(client_id, provider_code){
            $.ajax({
                url: $("#my-pages-wrapper").attr("data-url"),
                context: $("#my-pages-wrapper")

            }).fail(function() {
                $("#my-pages-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
            }).done(function(data) {
                $("#my-pages-wrapper").html(data);
                $("img.lazy").lazyload({
                    event: "sporty"
                });
                setTimeout(function() {
                    $("img.lazy").trigger("sporty");
                }, 8000);

                benchmark_fusion_chart();

                //   listFilter($("div.search-wrapper"), $("div.clients-list"));
            }).complete(function() {
                Metronic.unblockUI('.main-content');
            });

            $(document).on('click', '.statBox_in', function() {
                $(".statBox_in").removeClass("active");
                $(this).addClass("active");


                var title       = $(this).attr("data-title");

                Metronic.blockUI({ target: '.main-content',animate: true,overlayColor: 'none'});
                
                $.ajax({
                    url: SocialView.base_url + "psi/" + client_id + "/getRegionWiseKpiData/" + provider_code,
                    context: $("#region-graph-table-wrapper"),
                    data:{'title':title},
                    type:"POST",

                }).fail(function() {
                    $("#region-graph-table-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
                }).done(function(data) {
                    $("#region-graph-table-wrapper").html(data);
                    $("img.lazy").lazyload({
                        event: "sporty"
                    });
                    setTimeout(function() {
                        $("img.lazy").trigger("sporty");
                    }, 8000);

                    benchmark_fusion_chart();

                }).complete(function() {
                    Metronic.unblockUI('.main-content');
                });
                
            });

            function benchmark_fusion_chart() {

                var fusion_chart_json_data = $("#fusion-chart-json-data").attr("data-json");
                //console.log(fusion_chart_json_data);
                fusion_chart_json_data = JSON.parse(fusion_chart_json_data);

                FusionCharts.setCurrentRenderer("javascript");
                if  ( FusionCharts( "myChartId" ) )  FusionCharts( "myChartId" ).dispose();
                var myChart = new FusionCharts( "MSStackedColumn2DLineDY", "myChartId", "100%", "600" );
                myChart.setJSONData(fusion_chart_json_data);
                myChart.configure("ChartNoDataText", "No data to display!");
                myChart.render("socialScoreChart");

            }
        },
        enterprise: function(){
            $.ajax({
                url: $("#my-pages-wrapper").attr("data-url"),
                context: $("#my-pages-wrapper")

            }).fail(function() {
                $("#my-pages-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
            }).done(function(data) {
                $("#my-pages-wrapper").html(data);
                $("img.lazy").lazyload({
                    event: "sporty"
                });
                setTimeout(function() {
                    $("img.lazy").trigger("sporty");
                }, 8000);

                enterprise_fusion_chart();

                enterprise_datatable();

                //   listFilter($("div.search-wrapper"), $("div.clients-list"));
            }).complete(function() {
                Metronic.unblockUI('.main-content');
            });

            $(document).on('submit', '#enterprise_data_search', function(e) {
                Metronic.blockUI({ target: '.main-content',animate: true,overlayColor: 'none'});
                
                var postData = $(this).serializeArray();
                var formURL = $(this).attr("action");
                $.ajax({
                    url: formURL,
                    type: "POST",
                    context: $("#my-pages-wrapper"),
                    data: postData
                }).fail(function() {
                    $("#my-pages-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
                }).done(function(data) {
                    $("#my-pages-wrapper").html(data);
                    $("img.lazy").lazyload({
                        event: "sporty"
                    });
                    setTimeout(function() {
                        $("img.lazy").trigger("sporty");
                    }, 8000);

                    enterprise_fusion_chart();

                     enterprise_datatable();
                     
                }).complete(function() {
                    Metronic.unblockUI('.main-content');
                });
                e.preventDefault();
            });

            function enterprise_fusion_chart() {

                if(typeof fusionData != 'undefined') {
                	
	                //console.log(fusion_chart_json_data);
	               // fusion_chart_json_data = JSON.parse(fusion_chart_json_data);
	
	                FusionCharts.setCurrentRenderer("javascript");
	                if  ( FusionCharts( "myChartId" ) )  FusionCharts( "myChartId" ).dispose();
	                var myChart = new FusionCharts( "bubble", "myChartId", "100%", "600" );
	                myChart.setJSONData(fusionData);
	                myChart.configure("ChartNoDataText", "No data to display!");
	                myChart.render("socialScoreChart");

                }
            }

            function enterprise_datatable(){

                /* Custom filtering function which will search data in column four between two values */
                $.fn.dataTableExt.afnFiltering.push( function(oSettings, aData, iDataIndex){
                        var min = parseInt( $('#psi_range_minimum').val(), 10 );
                        var max = parseInt( $('#psi_range_maximum').val(), 10 );
                        var age = parseFloat( aData[3] ) || 0; // use data for the age column
                 
                        if ( ( isNaN( min ) && isNaN( max ) ) ||
                             ( isNaN( min ) && age <= max ) ||
                             ( min <= age   && isNaN( max ) ) ||
                             ( min <= age   && age <= max ) )
                        {
                            return true;
                        }
                        return false;
                    }
                );

                var table = $('#sample_3').DataTable({
                    "applyFilter":true,
                    "oLanguage": { "sSearch": "" },
                    "aoColumns": [
                        { "bSortable": true },// <-- enable sorting for column 1
                        { "bSortable": true },// <-- enable sorting for column 2
                        { "bSortable": true }, // <-- enable sorting for column 3
                        { "bSortable": true },// <-- enable sorting for column 4
                        { "bSortable": true },// <-- enable sorting for column 5
                        { "bSortable": true },// <-- enable sorting for column 6
                        { "bSortable": true },// <-- enable sorting for column 7
                        { "bSortable": true },// <-- enable sorting for column 8
                    ]
                });
                /*.columnFilter({ 
                    aoColumns:[
                        null,
                        null,
                        null,
                        { sSelector: "#form_social_score", type:"number-range"  },
                        null,
                        null,
                        null
                    ]
                });*/

                jQuery('#sample_3_wrapper .dataTables_filter input').addClass("form-control input-lg"); // modify table search input
                jQuery('#sample_3_wrapper .dataTables_length select').addClass("form-control input-lg"); //
                jQuery('.dataTables_filter input').attr("placeholder", "Search");

                $('#psi_range_minimum, #psi_range_maximum').keyup( function() { table.fnDraw(); } );
            }
        },
        reports: function() {
             $.ajax({
                url: $("#my-pages-wrapper").attr("data-url"),
                context: $("#my-pages-wrapper")

            }).fail(function() {
                $("#my-pages-wrapper").html("<p>Sorry for the inconvenience. An error occurred in the system. Please try again later...</p>")
            }).done(function(data) {
                $("#my-pages-wrapper").html(data);
                $("img.lazy").lazyload({
                    event: "sporty"
                });
                setTimeout(function() {
                    $("img.lazy").trigger("sporty");
                }, 8000);

                //   listFilter($("div.search-wrapper"), $("div.clients-list"));
            }).complete(function() {
                Metronic.unblockUI('.main-content');
            });
        },
     // harvesters report
        harvesters: function(clientId) {
        	count = 0;
            $('.portlet-title .harvester-refresh').addClass('active');

            $(".dashboard-stat").each(function() {
                var me = $(this);
                var statType = me.attr("stat-type");
                me.addClass(statType);
                PSI.harvestersReports(statType, '.' + statType, true);
                count++;
            });

            $('.portlet-title .harvester-refresh').on('click', function(e) {
                var me = $(this);
                me.addClass('active');
                count = 0;
                $(".dashboard-stat").each(function() {
                    var me = $(this);
                    var statType = me.attr("stat-type");
                    PSI.harvestersReports(statType, '.' + statType, true);
                    count++;
                });
            });
        },
        harvestersReports: function(serviceType, className, cache) {
            cache = cache || false;
            if (!cache) {
                enquireType = 'refresh';
            }
            Custom.showLoader(className);
            $.ajax({
                url: SocialView.base_url + "management/harvester/admin/get-harvesters-report",
                type: 'POST',
                data: {
                    serviceType: serviceType,
                    cache: cache
                }
            }).done(function(json) {
                if (json['status']['code']) {
                	if (json['status']['code'] == 200) {
                   	 if (serviceType == "polarityCount") {
                   		 		var obj = json[serviceType];
                   		 		var dateObj = new Date(json["date"]);
								$(className + ' .number').html(obj['Positive']+ '/'+ obj['Neutral']+ '/'+ obj['Negative']);
								if(json["date"] && json["date"] == ""){}
								else{
									$(className + ' .date').html(dateObj.toLocaleString());
								}
                   	 		}
						else {
							var dateObj = new Date(json["date"]);
							$(className + ' .number').html(json[serviceType]);
							if(json["date"] && json["date"] == ""){}
							else{
								$(className + ' .date').html(dateObj.toLocaleString());
							}
							
						}
                    } else {}
                    Custom.hideLoader(className);
                    count--;
                    if (count == 0) {
                        $('.portlet-title .harvester-refresh').removeClass('active');
                    }
                }
                return true;
            }).fail(function() {
                return false;
            }).always(function() {
                return false;
            });
        },
        // site listing Page
        siteList: function() {
        	 var columns = [{
        		 "data" : "id",
                 "orderable": true,
             }, {
            	 "data" : "sitename",
                 "orderable": true,
             }];

             var dataTable = $('.site-listing-table').dataTable({
                 serverSide: false,
                 bLengthChange: false,
                 bProcessing: true,
                 bFilter: false,
                 order: [
                     [1, "desc"]
                 ],
                 iDisplayLength: 100,
                 "aoColumnDefs": [{
                     "sClass": "text-left",
                     "aTargets": [0, 1]
                 }],
                 ajax: {
                     url: SocialView.base_url + "management/harvester/admin/get-site-list",
                     type: 'POST',
                     data: {
                         },
                     dataType: 'json',
                     error: function() {
                         Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                     }
                 },
                 columns: columns
             });
        },
        // insight listing Page
        insightList: function() {
        	 var columns = [
             {
            	 "data" : "sourcename",
                 "orderable": true,
             }, 
             {
            	 "data" : "count",
                 "orderable": true,
             }];

             var dataTable = $('.insight-listing-table').dataTable({
                 serverSide: false,
                 bLengthChange: false,
                 bProcessing: true,
                 bFilter: false,
                 order: [
                     [1, "desc"]
                 ],
                 iDisplayLength: 100,
                 "aoColumnDefs": [{
                     "sClass": "text-left",
                     "aTargets": [0, 1]
                 }],
                 ajax: {
                     url: SocialView.base_url + "management/harvester/admin/get-insights-listing",
                     type: 'POST',
                     data: {
                         },
                     dataType: 'json',
                     error: function() {
                         Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                     }
                 },
                 columns: columns
             });
        },
        
     // insight sentment based listing Page
        insightSentimentList: function() {
        	 var columns = [
             {
            	 "data" : "sourcename",
                 "orderable": true,
             }, 
             {
            	 "data" : "positive",
                 "orderable": true,
             }, 
             {
            	 "data" : "neutral",
                 "orderable": true,
             }, 
             {
            	 "data" : "negative",
                 "orderable": true,
             }];

             var dataTable = $('.insight-sentiment-listing-table').dataTable({
                 serverSide: false,
                 bLengthChange: false,
                 bProcessing: true,
                 bFilter: false,
                 order: [
                     [0, "desc"]
                 ],
                 iDisplayLength: 100,
                 "aoColumnDefs": [{
                     "sClass": "text-left",
                     "aTargets": [0, 1, 2, 3]
                 }],
                 ajax: {
                     url: SocialView.base_url + "management/harvester/admin/get-insights-sentiment-listing",
                     type: 'POST',
                     data: {
                         },
                     dataType: 'json',
                     error: function() {
                         Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                     }
                 },
                 columns: columns
             });
        },
     // review count listing Page
        reviewCountList: function() {
       	 var columns = [
         {
        	 "data" : "sourcename",
             "orderable": true,
         }, 
         {
        	 "data" : "count",
             "orderable": true,
         }];

         var dataTable = $('.reviews-listing-table').dataTable({
             serverSide: false,
             bLengthChange: false,
             bProcessing: true,
             bFilter: false,
             order: [
                 [1, "desc"]
             ],
             iDisplayLength: 100,
             "aoColumnDefs": [{
                 "sClass": "text-left",
                 "aTargets": [0, 1]
             }],
             ajax: {
                 url: SocialView.base_url + "management/harvester/admin/get-reviews-listing",
                 type: 'POST',
                 data: {
                     },
                 dataType: 'json',
                 error: function() {
                     Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                 }
             },
             columns: columns
         });
        },
     // mentions count listing Page
        mentionsCountList: function() {
       	 var columns = [
         {
        	 "data" : "sourcename",
             "orderable": true,
         }, 
         {
        	 "data" : "count",
             "orderable": true,
         }];

         var dataTable = $('.mentions-listing-table').dataTable({
             serverSide: false,
             bLengthChange: false,
             bProcessing: true,
             bFilter: false,
             order: [
                 [1, "desc"]
             ],
             iDisplayLength: 100,
             "aoColumnDefs": [{
                 "sClass": "text-left",
                 "aTargets": [0, 1]
             }],
             ajax: {
                 url: SocialView.base_url + "management/harvester/admin/get-mentions-listing",
                 type: 'POST',
                 data: {
                     },
                 dataType: 'json',
                 error: function() {
                     Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                 }
             },
             columns: columns
         });
        },
        
     // stuctured response count listing Page
        structuredResoponse: function() {
       	 var columns = [
         {
        	 "data" : "sourceName",
             "orderable": true,
         }, 
         {
        	 "data" : "count",
             "orderable": true,
         }];

         var dataTable = $('.structured-response-listing-table').dataTable({
             serverSide: false,
             bLengthChange: false,
             bProcessing: true,
             bFilter: false,
             order: [
                 [1, "desc"]
             ],
             iDisplayLength: 100,
             "aoColumnDefs": [{
                 "sClass": "text-left",
                 "aTargets": [0, 1]
             }],
             ajax: {
                 url: SocialView.base_url + "management/harvester/admin/total-structured-response-list",
                 type: 'POST',
                 data: {
                     },
                 dataType: 'json',
                 error: function() {
                     Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                 }
             },
             columns: columns
         });
        },
     // un-stuctured response count listing Page
        unstructuredResoponse: function() {
       	 var columns = [
         {
        	 "data" : "sourceName",
             "orderable": true,
         }, 
         {
        	 "data" : "count",
             "orderable": true,
         }];

         var dataTable = $('.unstructured-response-listing-table').dataTable({
             serverSide: false,
             bLengthChange: false,
             bProcessing: true,
             bFilter: false,
             order: [
                 [1, "desc"]
             ],
             iDisplayLength: 100,
             "aoColumnDefs": [{
                 "sClass": "text-left",
                 "aTargets": [0, 1]
             }],
             ajax: {
                 url: SocialView.base_url + "management/harvester/admin/total-unstructured-response-list",
                 type: 'POST',
                 data: {
                     },
                 dataType: 'json',
                 error: function() {
                     Custom.showMessages("error", "An error occured", ["Sorry, there is an error processing your request. Please try again later"]);
                 }
             },
             columns: columns
         });
        }
    };
}();