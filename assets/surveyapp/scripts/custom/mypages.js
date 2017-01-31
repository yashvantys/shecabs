(function($) {

    $.fn.onEnter = function(func) {
        this.bind('keypress', function(e) {
            if (e.keyCode == 13) func.apply(this, [e]);
        });
        return this;
    };
    // custom css expression for a case-insensitive contains()
    jQuery.expr[':'].Contains = function(a, i, m) {
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(
            m[3].toUpperCase()) >= 0;
    };
    $(document).ready(function() {

        $("form.client-search-form").live("submit", function(e) {
            e.preventDefault();
            searchClient();
            return false;
        });

        function searchClient() {
            var q = $(".client-search").val();
            var $list = $("div.clients-list");
            if (q && q != "") {

                $list.find("a.client-link span.title:not(:Contains(" + q + "))").parents('.col-div').hide();
                $list.find("a.client-link span.title:Contains(" + q + ")").parents('.col-div').show();
            } else {
                $list.find("div.col-div").show();
            }
        }

        $(".client-search").live("keyup", function(e) {
            var filter = $(this).val();
            if (filter) {
                if (!$(this).hasClass("image-added")) {
                    $(this).after('<i class="fa fa-times clear-text" title="Clear..." ></i>');
                    $(this).addClass("image-added");
                }
            } else {
                $(this).parent().find('.fa-times').remove();
                $(this).removeClass("image-added");
            }

            $(this).change();

        });

        $(".client-search, .client-search-button").onEnter(function(e) {
            e.preventDefault();
            searchClient();

        });


        $(".client-search-form .fa-times").live("click", function(e) {
            e.preventDefault();
            $('.client-search').val('');
            $(this).siblings().removeClass('image-added');
            $(this).remove();
            $('.client-search').focus();
            searchClient();
            return false;
        });

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

    });

}(jQuery));