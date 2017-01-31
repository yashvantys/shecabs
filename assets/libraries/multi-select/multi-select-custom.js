$(".category").on("click",function(){
	alert("click");

        			if($(this).is(':checked'))
//         			   alert("check");
        			$(".category-all").prop('checked', true);
        			else
//         				alert("unchecked"); // unchecked
        			$(".category-all").prop('checked', false);
						
	
        		});