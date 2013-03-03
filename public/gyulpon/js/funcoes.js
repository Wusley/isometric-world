	$(document).ready(function() {

		$("a").click(function() {
			var href = $(this).attr('href');
			
			$(this).attr('href','javascript:void');
			
			$.get( href , function(data) {
				$('section.conteudo').html(data);
			});
			
			return null;
		});
		
		/*
		$("input[type='button']").click(function(){
			$.get("/teste",{campo:campo},function(data){
							
			});
			
			//alert("teste");
		});
		*/
	});