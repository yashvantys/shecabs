/**
Custom module for you to write your own javascript functions
**/
var Custom = function() {

    // private functions & variables
    var startTime
    var myFunc = function(text) {
        alert(text);
    }
    
    $(document).ajaxComplete(function(e, xhr, settings){
		if(xhr.status == 401){
			location.reload();
		}
	});

    // Public functions
    return {

        //main function
        init: function() {
            //initialize here something.        
            startTime = new Date().getTime();
            $(".dont-allow-clicks").on("click", function (e) {
	            e.preventDefault();
	            return false;
	        });
		 
        },
        keepAlive: function() {

            var currentTime = new Date().getTime();
            if ((currentTime - startTime) / 1000 > 360) {

                $.ajax({
                    url: SocialView.base_url + "user/keep-alive/",
                    type: "GET",
                    data: {},
                    beforeSend: function() {},
                    complete: function() {},
                }).done(function(json) {
                    startTime = new Date().getTime();
                });
            }
        },

        // Show loader
        showLoader: function(target) {
            target = target || '.main-content';
            Metronic.blockUI({
                target: target,
                animate: true,
                overlayColor: 'none'
            });
        },

        // Hide loader
        hideLoader: function(target) {
            target = target || '.main-content';
            Metronic.unblockUI(target);
        },
        showConfirm:function(message,title,oktext,canceltext,callbackfn){
            bootbox.dialog({
		        message: message,
		        title: title,
		        onEscape: function() {},
		        buttons: {
		           main: {
		              label: oktext,
		              className: "btn-primary",
		            	  callback: callbackfn
		           },
		           cancel : {
		        	   label: canceltext,
			              className: "btn-default"
		           }
		    	  
		        }
		    });
        }
        ,

        // Show Custom messages with type and title
        showMessages: function(type, title, messages, target, offset) {
            target = target || '.page-bar';
            offset = offset || 60;
            Custom.hideMessages();

            var html = '';
            var message = '';
            var statusClass = 'alert alert-dismissable ';

            for (var i = 0; i < messages.length; i++) {
                message += "<div>" + messages[i] + "</div>";
            }

            switch (type) {
                case 'success':
                    statusClass += 'alert-success';
                    break;
                case 'info':
                    statusClass += 'alert-info';
                    break;
                case 'warning':
                    statusClass += 'alert-warning';
                    break;
                case 'error':
                    statusClass += 'alert-danger';
                    break;
                default:
                    statusClass += 'alert-info';
                    break;
            }

            html = "<div class='row custom-messages'><div class='col-md-12 col-sm-12'><div class='" + statusClass + "'><button type='button' class='close' data-dismiss='alert'>×</button><strong>" + title + "</strong>" + message + "</div></div></div>";
            $(target).after(html);
            if (target == '.page-bar') {
            	if($('.custom-messages').length>0){
            		$("html, body").animate({
                        scrollTop: $('.custom-messages').offset().top - offset
                    });
            	}
                
            }
        },

        // Hide messages
        hideMessages: function() {
            $(".custom-messages").remove();
        },

        //some helper function
        doSomeStuff: function() {
            myFunc();
        },

        init_select2: function() {
            $("select.select2, select.select2-multiple,select.select2-allow-clear").select2({
                placeholder: "",
                allowClear: true,
                closeOnSelect: false
            });
            $("select.select2-nosearch").select2({
                minimumResultsForSearch: -1
            });
            $("select.select2-no-allow-clear").select2({
                placeholder: "",
                allowClear: false,
                closeOnSelect: false
            });
            $("select.select2-nosearch-allow-clear").select2({
                minimumResultsForSearch: -1,
                allowClear: true
            });
            $("select.select2-multiple").select2({

            });
        },
        init_datepicker: function() {
            $(".date").datepicker({
                orientation: "left",
                autoclose: true
            });

            $(".timepicker").timepicker({
                showMeridian: false,
                minuteStep: 15
            });

            $("input.timepicker").on('keydown', function(e) {
                var keycode = (e.keyCode ? e.keyCode : e.which);
                if (keycode == 9) {
                    $('.timepicker').timepicker('hideWidget');
                }
            });

            $(".input-daterange").datepicker({
                /*    orientation: "left",*/
                autoclose: true
            });
        },
        get_date_yyyymmdd: function (date) {
            month = date.substring(0, 2);
            day = date.substring(3, 5);
            year = date.substring(6, 10);
            return year + month + day;
        }
    };
}();