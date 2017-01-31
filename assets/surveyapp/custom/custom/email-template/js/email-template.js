var EmailTemplate = function() {
	return {
		home : function(clientId, avatarId) {
			
			// Delete Template
			
			$(".email-template button.delete-template").on("click", function(e){
				e.preventDefault();
				var me  = $(this);
				var templateId = me.attr("template-id");
				$.ajax({
					  method: "POST",
					  beforeSend: function( xhr ) {
						   Custom.showLoader("#template-"+templateId);
						  },
					  url: SocialView.base_url+"email-template/"+clientId+"/"+avatarId+"/delete/"+templateId,
					  data: { }
					})
					  .done(function( json ) {
						  var templateTitle = $("#template-title-"+templateId).html();
						  if(json.status.code == 200) {
							  Custom.showMessages("success", "Template <b>"+templateTitle+"</b> deleted successfully!", [""]);
							  $("#template-"+templateId).remove();
							  
						  } else{
							  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
						  }
						  
						  
					  }).fail(function(){
						  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
					  }).always(function(){
						  Custom.hideLoader("#template-"+templateId);
						  var modalId = "#delete-"+templateId+"-template";
							$(modalId).modal("toggle");
					  });
				
				
			});
			
			// Update flags
			
			$("a.update-default-status").on("click", function(e){
				e.preventDefault();
				var me = $(this);
				if(me.children("i.fa").hasClass("orange")) {
					
				} else {
					var type = me.attr("type");
					var templateId = me.parent(".tools").attr("template-id");
					EmailTemplate.updateDefault(clientId, avatarId, templateId, type);
				}
			});
		},
		templateEdit : function(clientId, avatarId, templateId){
			 $(".dont-allow-clicks").on("click", function (e) {
		            e.preventDefault();
		            return false;
		        });
			 
			$("#template-edit-form").on("submit", function(e){
				// do something here
				// send the updated html via textarea
				$("#updated-template").html(encodeURIComponent($(".template-html-body").html()));
				Custom.showLoader();
				return true;
			});
			
			 $(".save-template").on("change", function(e) {
				 if($(this).prop("checked") == true){
					 $(".title-wrapper").removeClass("hidden");
				 } else {
					 $(".title-wrapper").addClass("hidden");
				 }
	               
	            });
			 if($("select.select2").length) {
				 $("select.select2").select2();
			 }
			
			
		},
		updateDefault : function(clientId, avatarId, templateId, type) {
			
			$.ajax({
				  method: "POST",
				  beforeSend: function( xhr ) {
					   Custom.showLoader("#template-"+templateId);
					  },
				  url: SocialView.base_url+"email-template/"+clientId+"/"+avatarId+"/update-default/"+templateId,
				  data: { type : type}
				})
				  .done(function( json ) {
					  if(typeof json == 'object'){
						  
					  var templateTitle = $("#template-title-"+templateId).html();
					  if(json.status.code == 200) {
						  Custom.showMessages("success", "Template <b>"+templateTitle+"</b> is set as "+ type +" level default template!", [""]);
						  // remove other templates classes
						  
						  var $templatesWrapper = $("#template-"+templateId).parents(".templates");
						  var className = " ."+type +"-default";
						  var icon = "", iconActive = "";
							  
						  switch (type) {
						  case "client" :
							  icon = 'fa-square-o';
							  iconActive = 'fa-check-square-o orange';
							  break;
						  case "avatar" :
							  icon = 'fa-star-o';
							  iconActive = 'fa-star orange';
							  break;
						  }
						  $templatesWrapper.find(className+" i.fa").removeClass(iconActive).addClass(icon);
						  $("#template-"+templateId+className+" i.fa" ).removeClass(icon).addClass(iconActive);
						  return true;
					  } else{
						  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
					  }
					  
					  }
					  
				  }).fail(function(){
					  Custom.showMessages("error", "An error occurred.", ["Sorry for the inconvenience. Please try again later."]);
				  }).always(function(){
					  Custom.hideLoader("#template-"+templateId);
				  });
			return false;
		}
	};
}();


tinymce.init({
    selector: ".bf-text-editor",
    inline: true,
    toolbar: "undo redo",
    menubar: false
});

tinymce.init({
  selector: ".bf-image-editor",
  inline: true,
  plugins : ["image jbimages"],
  toolbar: "image jbimages",
  menubar: false,
  relative_urls: false,
});

tinymce.init({
    selector: ".bf-number-editor",
    inline: true,
    toolbar: "undo redo",
    menubar: false
});

tinymce.init({
    selector: ".bf-textarea-editor",
    inline: true,
    relative_urls: false,
    plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table contextmenu paste jbimages"],
    toolbar1: "insertfile undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    toolbar2: "styleselect formatselect fontselect fontsizeselect| tablecontrols | insertdate inserttime preview"
});
