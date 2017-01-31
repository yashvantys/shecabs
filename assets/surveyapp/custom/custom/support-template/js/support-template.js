tinyMCE.init({
	selector : ".description-html-body",
    statusbar : false,
    plugins: ["advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table contextmenu paste jbimages"
              ],
    images_upload_base_path: "/var/www/socialview/assets/upload",
    images_upload_credentials: true,
    format : 'html',
        setup: function(editor) {
            editor.on( 'keyup', function( event ){
                $(".description_test").text($(".description-html-body").html());
                tinyMCE.triggerSave();
            } );
        }
    });

$("#add-configuration-form").on("submit", function(e){
	$(".description_test").css("display","block");
	$(".description_test").attr("visible",true);
	$(".description_test").show();
	$("#description_test").html($(".description-html-body").html());
	tinyMCE.triggerSave();
	Custom.showLoader();
	return true;
});

$("#add_release_note_form").on("submit", function(e){
	$(".description_test").css("display","block");
	$(".description_test").attr("visible",true);
	$(".description_test").show();
	$("#description_test").html($(".description-html-body").html());
	tinyMCE.triggerSave();
	Custom.showLoader();
	return true;
});

$("#industry").on("change", function(e){
	findClientsEntities();
});

function findClientsEntities() {
	
	var me = $("select.filter-industry-id, input.filter-industry-id");
	var clientEntity = $("select.filter-client-entity");
	var selectedIndustryId = me.val();
	var clientEntityId = clientEntity.val();
	
	if (selectedIndustryId != "" && selectedIndustryId != null) {
		$.ajax({
			url: SocialView.base_url +'reports/admin/dom_request/get_client_entities/' + selectedIndustryId,
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
			if (data.length > 0) {
				$("#client").attr("label","shdjasd");
				$(data).each(function() {
					if (clientEntityId != null && clientEntityId == this.val) {
						clientEntity.append($("<option selected='selected'>").attr('value', this.text).text(this.val));
					}else{
						clientEntity.append($("<option>").attr('value', this.val).text(this.text));
					}
					
				});
			}
			Custom.hideLoader();
			clientEntity.select2({allowClear : true});
		});
	}
}
//tinyMCE.activeEditor.getContent();