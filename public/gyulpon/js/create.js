
	$(document).ready(function() {
		
		// SELECIONA LISTA DE CHRS
		$.ajax({
	        type: "GET",
	        url: "/chr",
	        dataType: "json",
            cache: false,
            success	: function(data) {
            	updateList(data);
           	}
        });
		
	});
	
	// ATUALIZA SELECT DOS PERSONAGENS
	var updateList = function(data) {
		if(data.coll !== null) {
    		$("select[name='chrId']").html(null);
			$("select[name='chrId']").append("<option value='0'>Selecione</option>");
 
    		data.coll.forEach(function(el, ind) {
   				$("select[name='chrId']").append("<option value='" + data.coll[ind].id + "'>" + data.coll[ind].name + "</option>");
			});
		}
	};