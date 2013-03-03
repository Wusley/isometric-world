	var directions 	= [],
		current,
		timing 		= 250,
		interval,
		tempReq;
	
	$(document).ready(function() {
		
		// SELECIONA LISTA DE CHRS
		$.ajax({
	        type: "GET",
	        url: "/chr",
	        dataType: "json",
            cache: false,
            success	: function(data) {
            	updateList(data);
            	
            	// RESET TOTAL
				fullReset();
           	}
        });
        
		// ENVIAR DADOS
		$("input[name='chr-enviar']").live("click",function() {			
			
			var data = compressData();
			
			// REGISTRA NOVO CHR
			newChr(data);
			
		});
		///////////////	
		
		// ALTERAR DADOS
		$("input[name='chr-name']").keyup(function(){
			
			var name	= $(this).val(),
				num		= $(this).siblings("select").find("option").length;
				
			// VALIDACAO DA ATUALIZACAO DO CHR NAME
			validationUpdateChrName(num,name);
		});
		////////////////
		
		// SELECIONAR PERSONAGEM
		$("select[name='chr-select']").live('change',function() {
			var id = $(this).find("option:selected").val();
				
			// SELECT CHR
			selectChr(id);
			
		});
		////////////////////////
		
		// ATUALIZAR DADOS
		$("input[name='chr-atualizar']").live("click",function() {
			
			var id		= $("input[name='chr-name']").attr("id"),
				data 	= compressData();
					
			// ATUALIZA CHR
			updateChr(id,data);		
			 
		});
		//////////////////
		
		// REMOVER DADOS
		$("input[name='chr-remove']").live("click",function() {
			
			var id	= $("input[name='chr-name']").attr("id"); 
			
			// REMOVE CHR
			removeChr(id);
			
		});
		////////////////
		
		// RESET TOTAL
		$("input[name='chr-reset']").live("click",function() {
			
			// RESET TOTAL
			fullReset();
			
		});
		////////////////
			
		// EFEITO SOB A ESTRELA DAS DIRECOES
		$("input[type='checkbox']").click(function() {
			
			// VERIFICA NUMERO DA DIRECAO CORRENTE
			current = numDirection(this);
			
			// VERIFICA SE A DIRECAO FOI IDENTIFICADA E SELECIONADA
			if(current !== null && $(this).attr("checked") === "checked") {
				
				// DESABILITA TODOS CHECKBOX
				$(this).parents("form[name='form-directions']").find("input[type='checkbox']").attr({"disabled":true});
				
				// HABILITA CHECKBOX CORRENTE
				$(this).attr({"disabled":false});
				
				// EXIBE PASSO 2(CRIACAO)
				$("article.passo-2").css({"display":"table"});
				
				$("input[name='chr-reset']").css({"display":"inline"});
				
				// CRIANDO COLECAO
				if(!directions[current]) {
					
					directions[current] = [];
					
					// INICIANDO CAMPOS INVALIDOS
					directions[current].status = false;
					
					// VALIDACAO
					doValidation();
				
				// COLECAO JA EXISTENTE
				} else {
					
					//CASO NAO EXISTA FRAME
					if(directions[current].frame) {
					
						// NUMERO DE QUADROS EXISTENTE
						var num = directions[current].frame.length;
						
						// INSERINDO NUMERO DE QUADROS
						$("form[name='form-frames']").find("input[name='qtd-frames']").val(num);
						
						// MODELANDO QUADROS
						modelFrames(num);
						
						// INTERVALO DOS FRAMES
						timing = directions[current].timing;
						$("input[name='timing']").val(timing);
					
					}
					
					// VALIDACAO
					doValidation();
				}
			
			// CAMPO UNCHECKED
			} else {
				
				// RESETA PASSOS 2 / 3
				resetMiddle(current);
				
			}
		});
		////////////////////////////////////
		
		// CRIANDO FRAMES PARA PREENCHIMENTO
		$("form[name='form-frames']").find("input[name='enviar-qtd-frames']").click(function() {
			
			// NUMERO DE QUADROS
			var num = parseInt($(this).siblings("input[name='qtd-frames']").val());
			
			// MODELANDO QUADROS
			modelFrames(num);
			
		});
		////////////////////////////////////
		
		// VALIDANDO AO MUDAR CONTEUDO DO CAMPO
		$("form[name='form-frames']").find(".frames").find("input").live('change',function(){
			
			// VALIDACAO
			doValidation();
			
		});
		///////////////////////////////////////
		
		// INSERCAO DA IMAGEM NO FRAME
		$("input[name='address']").live('change',function(){
			var id = parseInt($(this).parents(".frame").find("input[name='id']").val());
			
			directions[current].frame[id].path = $(this).val();
			
			$(this).parents(".frame").find(".frame-box").css({"background-image":"url(/gyulpon/chr/images/" + directions[current].frame[id].path + ")"});
		});
		//////////////////////////////
		
		// DEFININDO ALTURA E LARGURA
		$("input[name='height']").live('change',function(){
			var id = parseInt($(this).parents(".frame").find("input[name='id']").val());
			
			directions[current].frame[id].height = $(this).val();
			
			$(this).parents(".frame").find(".frame-box").css({"height":directions[current].frame[id].height});
		});
		
		$("input[name='width']").live('change',function(){
			var id = parseInt($(this).parents(".frame").find("input[name='id']").val());
			
			directions[current].frame[id].width = $(this).val();
			
			$(this).parents(".frame").find(".frame-box").css({"width":directions[current].frame[id].width});
		});
		/////////////////////////////
		
		// POSICIONANDO IMAGEM NO FRAME
		$("input[name='position-y']").live('change',function(){
			var id = parseInt($(this).parents(".frame").find("input[name='id']").val());
			
			directions[current].frame[id].top = $(this).val();
			
			$(this).parents(".frame").find(".frame-box").css({"background-position-y":directions[current].frame[id].top+"px"});
		});
		
		$("input[name='position-x']").live('change',function(){
			var id = parseInt($(this).parents(".frame").find("input[name='id']").val());
			
			directions[current].frame[id].left = $(this).val();
			
			$(this).parents(".frame").find(".frame-box").css({"background-position-x":directions[current].frame[id].left+"px"});
		});
		///////////////////////////////
		
		// DEFININDO TAMANHO DA MESA DE EFEITOS
		$("input[name='enviar-effects']").toggle(function(){
			
			var qtd 		= parseInt($("form[name='form-frames']").find("input[name='qtd-frames']").val()),
				count 		= 0,
				intervaL	= null,
				height 		= 0,
				width 		= 0,
				path,
				top,
				left;
			
			// QUANTIDADE DE INTERLADO(MILISEGUNDOS)
			timing = parseInt($("input[name='timing']").val());
			
			// ALTERANDO NOME DO BOTAO
			$("input[name='enviar-effects']").val("Pausar");
			
			// VERIFICANDO FRAME COM MAIOR ALTURA
			for(; count < qtd; count++) {
				newHight = parseInt($("article.frames").find("ul.frame:eq(" + count + ")").find("input[name='height']").val());
				
				if(height < newHight) { height = newHight; }
				
			}
			
			// APLICANDO MAIOR ALTURA AO QUADRO DE EFEITOS
			$("fieldset.applying").find("article").css({"display":"block","height":height});
			
			// RESETANDO QUADRO INICIAL
			count = 0;
			
			// QUADRO INICIAL
			var path = 	$("article.frames").find("ul.frame:eq(" + count + ")").find("input[name='address']").val();
			
				$("fieldset.applying").find("div").css({"background-image":"url(/gyulpon/chr/images/" + path + ")"});
			
			//MECANICA DE ANIMACAO
			doAnimation(count);

			// EFEITOS DOS QUADROS
			interval = window.setInterval(function() {
				
				//MECANICA DE ANIMACAO
				doAnimation(count);
				
				// PROXIMO QUADRO
				count++;
				
				// LIMITE DE QUADROS
				if(count >= qtd) {
					count = 0;
				}
			
			}, timing);	
			//////////////////////
			
		// INTERROMPENDO EFEITO
		}, function() {
			
			// ALTERANDO NOME DO BOTAO
			$("input[name='enviar-effects']").val("Continuar");
			
			// INTERROMPENDO EFEITO
			window.clearInterval(interval);
			
		});
		///////////////////////////////////////
		
		// FINALIZA EDICAO DO FRAME
		$("input[name='enviar-frames']").live('click',function(){
			// VALIDACAO
			doValidation();
				
			if(directions[current].status) {
				// RESETA PASSOS 2 / 3
				resetMiddle(current);
			}
		});
		///////////////////////////	
		
	});
	
	// VERIFICA NUMERO DA DIRECAO
	var numDirection = function(element) {
		var that 	= element,
			str 	= $(that).attr('name'),
			model 	= /[0-9]/g;
			
		str = str.match(model);
		
		str =  str[0] + "" + str[1];
			
		return parseInt(str);
	},
	
	// CRIANDO QUADROS
	makeFrames = function(numFrames) {
		for(var count = 0; count < numFrames; count++ ) {
			// REFERENCIANDO QUADRO A UM OBJETO
			if(!directions[current].frame[count]) {
				directions[current].frame[count] = [];
			}
			
			// ATRIBUINDO UM IDENTIFICADOR PARA O QUADRO
			$(".container-box").find("input[name='id']").val(count);
			
			// INICIANDO O QUADRO
			$("article.frames").append($(".container-box").html());
		}
	},
	
	// INSERINDO INFORMACOES NOS CAMPOS
	insertData = function() {
		// ABREVIANDO CAMINHO
		var path = function(count) {
				return $("article.frames").find("ul.frame:eq("+count+")");
			}
		
		// INSERINDO INFORMACOES NOS CAMPOS
		for(var count = 0; count < directions[current].frame.length; count++) {	
			path(count).find(".frame-box").css({"background-image":"url(/gyulpon/chr/images/"+directions[current].frame[count].path+")"});
			path(count).find("input[name='address']").val(directions[current].frame[count].path);
			path(count).find(".frame-box").css({"height":directions[current].frame[count].height});
			path(count).find("input[name='height']").val(directions[current].frame[count].height);
			path(count).find(".frame-box").css({"width":directions[current].frame[count].width});
			path(count).find("input[name='width']").val(directions[current].frame[count].width);
			path(count).find(".frame-box").css({"background-position-y":directions[current].frame[count].top+"px"});
			path(count).find("input[name='position-y']").val(directions[current].frame[count].top);
			path(count).find(".frame-box").css({"background-position-x":directions[current].frame[count].left+"px"});
			path(count).find("input[name='position-x']").val(directions[current].frame[count].left);
		}
	},
	
	// MODELANDO QUADROS
	modelFrames = function(num) {
		// QUANTIDADE DE QUADROS
		var numFrames = num;
		
		// REMOVENDO ELEMENTOS EXISTENTES
		$("article.frames").html(null);
		
		// EXIBINDO PASSO 3(EFEITOS)
		$("article.passo-3").css({"display":"table"});
		
		// CRIANDO COLECAO DE QUADROS
		if(!directions[current].frame) {
			
			directions[current].frame = [];
			 			
			// CRIANDO QUADROS
			makeFrames(numFrames);
			
		// COLECAO DOS QUADROS JA EXISTENTE
		} else {
			
			// REMOVENDO QUADROS EXCEDENTES
			if(numFrames >= 0 && numFrames < directions[current].frame.length) {					
				directions[current].frame.splice(numFrames);					
			}
			
			// CRIANDO QUADROS
			makeFrames(numFrames);
			
			// INSERINDO INFORMACOES NOS CAMPOS
			insertData();
				
		}
	},
	
	// RESET TOTAL
	fullReset = function() {
		$("input#action").val("Enviar").attr({"disabled":false,"name":"chr-enviar"});
			
		$("select[name='chr-select']").find("option:eq(0)").attr({"selected":true});
		
		$("input[name='chr-remove'], input[name='chr-reset']").hide();
			
		$("svg.svg-directions").find("line").attr({"stroke":"#000"});
		$("input[name='chr-name']").val("").attr({"id":""});
		
		// RESETA PASSOS 2 / 3
		resetMiddle(current);
		directions = [];
	},
	
	// RESETA PASSOS 2 / 3
	resetMiddle = function(id) {
		
		if(directions[id] !== null) {
			if(!directions[id].status) {
				// RESETAR SETA
				$(".svg-directions").find("line.pos-" + id + "").attr({"stroke":"black"});
				
				// RESETAR BOTAO
				$("input[name='enviar-frames']").css({"background-color":"#555","color":"#ccc"});
			}
		}
		
		current = null;
		// REABILITAR CHECKBOX
		$("form[name='form-directions']").find("input[type='checkbox']").attr({"disabled":false,"checked":false});
		
		// INTERROMPENDO A CRIACAO
		$("article.passo-2").hide();
		
		// INTERROMPENDO OS EFEITOS
		$("article.passo-3").hide();
		
		// LIMPANDO CAMPOS
		$("form[name='form-frames'], form[name='form-effects']").each(function(){ 
            this.reset();
        }); 
		// REMOVENDO FRAMES
		$("article.frames").html(null);
	
	},
	
	// EFEITO DE VALIDACAO
	formatValidation = function(id) {	
		
		if(directions[id] !== null) {	
			if(directions[id].status) {
				// SETA VALIDADA
				$(".svg-directions").find("line.pos-" + id + "").attr({"stroke":"green"});
				
				// RESETAR BOTAO
				$("input[name='enviar-frames']").css({"background-color":"green"}).val("Clique aqui para concluir edição");
			} else {			
				// SETA INVALIDADA
				$(".svg-directions").find("line.pos-" + id + "").attr({"stroke":"red"});
				
				// RESETAR BOTAO
				$("input[name='enviar-frames']").css({"background-color":"red"}).val("Animacao invalida");
			}
			
		} else {
			// DIRECAO INEXISTENTE
			$(".svg-directions").find("line.pos-" + id + "").attr({"stroke":"black"});
				
			// RESETAR BOTAO
			$("input[name='enviar-frames']").css({"background-color":"red"}).val("Animacao invalida");
		}
	},
	
	// VALIDACAO
	doValidation = function() {
		
		if(directions[current].frame) {
		
			var validationStatus	= false,
				path 				= function(count) {
					return $("article.frames").find("ul.frame:eq("+count+")");
				};
			
			var num = parseInt($("form[name='form-frames']").find("input[name='qtd-frames']").val());
			
			// VALIDANDO CAMPOS
			for(var count = 0; count < num; count++) {	
				
				if(path(count).find("input[name='address']").val() === "") {
					validationStatus = false;
					break;
				}
				
				if(path(count).find("input[name='height']").val() === "") {
					validationStatus = false;
					break;
				}
				
				if(path(count).find("input[name='width']").val() === "") {
					validationStatus = false;
					break;
				}
				
				if(path(count).find("input[name='position-y']").val() === "") {
					validationStatus = false;
					break;
				}
				
				if(path(count).find("input[name='position-x']").val() === "") {
					validationStatus = false;
					break;
				}
				
				validationStatus = true;
			}
			
			if(validationStatus === true) {
				
				// DIRECAO VALIDADA
				directions[current].status = true;
				
				//INSERINDO TEMPORIZAÇÃO NA DIREÇÃO
				directions[current].timing = timing;
				
			} else {
				
				// DIRECAO INVALIDADA
				directions[current].status = false;
				
			}
			
			// EFEITO DE VALIDACAO
			formatValidation(current);
			
		} else {	
			
			// EFEITO DE VALIDACAO
			formatValidation(current);
			
		}
	},
	
	// MECANICA DE ANIMACAO
	doAnimation = function(count) {
		
		//RECEBENDO INFORMACOES DOS CAMPOS
		var height 	= parseInt($("article.frames").find("ul.frame:eq("+count+")").find("input[name='height']").val()),
			width 	= parseInt($("article.frames").find("ul.frame:eq("+count+")").find("input[name='width']").val()),
			top 	= parseInt($("article.frames").find("ul.frame:eq("+count+")").find("input[name='position-y']").val()),
			left 	= parseInt($("article.frames").find("ul.frame:eq("+count+")").find("input[name='position-x']").val());
			
		// APLICANDO INFORMACOES RECEBIDAS
		$("fieldset.applying").find("div").css({
			"height":height,
			"width":width,
			"background-position-y":top + "px",
			"background-position-x":left + "px"
		});
	},
	
	// COMPRIMINDO E FORMATANDO INFORMACOES
	compressData = function() {
		var data = {},
			name = $("input[name='chr-name']").val();
		
		data.name = name;
		
		data.directions = {};
		data.directions.direction = {};
		
		// PERCORRENDO DIRECOES
		for(var cont = 0; cont <= 15; cont++) {
			data.directions.direction[cont] = {};
			
			if(directions[cont]) {
				
				if(directions[cont].status) {
					
					data.directions.direction[cont].timing = directions[cont].timing;
					data.directions.direction[cont].frames = {};
					data.directions.direction[cont].frames.frame = {};
										
					directions[cont].frame.forEach(function(elem,id) {
						
						data.directions.direction[cont].frames.frame[id] = {};
						
						data.directions.direction[cont].frames.frame[id].path		= directions[cont].frame[id].path;
						data.directions.direction[cont].frames.frame[id].height		= directions[cont].frame[id].height;
						data.directions.direction[cont].frames.frame[id].width		= directions[cont].frame[id].width;
						data.directions.direction[cont].frames.frame[id].top		= directions[cont].frame[id].top;
						data.directions.direction[cont].frames.frame[id].left		= directions[cont].frame[id].left;

					});
					
				} else {
					data.directions.direction[cont] = null;
				}
				
			} else {
				data.directions.direction[cont] = null;
			}
		}
		return data;
	},
	
	// DESCOMPRIMINDO E REFORMATANDO INFORMACOES
	unCompressData = function(data) {
		
		var cont1	= 0,
			data	= data.data;
			
		directions = [];
				
		for(direction in data.directions.direction) {
			
			directions[cont1] = [];	
					
			if(data.directions.direction[cont1] !== "null") {
				
				directions[cont1].status = true;
				directions[cont1].timing = parseInt(data.directions.direction[cont1].timing);
				
				for(frames in data.directions.direction[cont1].frames) {
					
					var cont2 = 0;
					directions[cont1].frame = [];
					
					for(frame in data.directions.direction[cont1].frames.frame) {
						directions[cont1].frame[cont2] = [];
						
						directions[cont1].frame[cont2].path		= data.directions.direction[cont1].frames.frame[cont2].path;
						directions[cont1].frame[cont2].height	= parseInt(data.directions.direction[cont1].frames.frame[cont2].height);
						directions[cont1].frame[cont2].width	= parseInt(data.directions.direction[cont1].frames.frame[cont2].width);
						directions[cont1].frame[cont2].top		= parseInt(data.directions.direction[cont1].frames.frame[cont2].top);
						directions[cont1].frame[cont2].left		= parseInt(data.directions.direction[cont1].frames.frame[cont2].left);
						
						cont2++;
					}
				}	
				
			} else {
				directions[cont1] = null;
			}
			cont1++;
		}
	},
	
	// PRINTANDO INFORMACOES
	printData = function(data) {
		
		var cont1	= 0,
			data	= data.data;
			
		$("div.recebe").append("name: " + data.name + ",<br />");
						
		for(direction in data.directions.direction) {
								
			if(data.directions.direction[cont1] !== "null") {
				
				$("div.recebe").append("{<br />");
				$("div.recebe").append("timing: " + parseInt(data.directions.direction[cont1].timing) + ",<br />");
				
				for(frames in data.directions.direction[cont1].frames) {
					
					var cont2 = 0;
					$("div.recebe").append("<br /> {<br />");
					
					for(frame in data.directions.direction[cont1].frames.frame) {
						$("div.recebe").append(
							"{<br />path: " + data.directions.direction[cont1].frames.frame[cont2].path +
							",<br />height: " + parseInt(data.directions.direction[cont1].frames.frame[cont2].height) +
							",<br />width: " + parseInt(data.directions.direction[cont1].frames.frame[cont2].width) +
							",<br />top: " + parseInt(data.directions.direction[cont1].frames.frame[cont2].top) +
							",<br />left: " + parseInt(data.directions.direction[cont1].frames.frame[cont2].left) +
							"<br />},<br />"
						);
						cont2++;
					}
					$("div.recebe").append("},<br /> <br />");
				}	
				cont1++;
			} else {
				$("div.recebe").append(data.directions.direction[cont1]);
				directions[cont1] = null;
			}
		}
	},
	
	// ATUALIZA SELECT DOS PERSONAGENS
	updateList = function(data) {
		if(data.coll !== null) {
    		$("select[name='chr-select']").html(null);
			$("select[name='chr-select']").append("<option value='0'>Selecione</option>");
 
    		data.coll.forEach(function(el, ind) {
   				$("select[name='chr-select']").append("<option value='" + data.coll[ind].id + "'>" + data.coll[ind].name + "</option>");
			});
		}
	},
		
	// REGISTRA NOVO CHR
	newChr = function(data) {
					
		$.ajax({
	        type: "POST",
	        url: "/chr",
	        data: {data: data},
	        dataType: "json",
            cache: false,
            success	: function(coll) {
            	updateList(coll);
            	
            	// RESET TOTAL
				fullReset();
           	}
        });
        
	},
	
	// ATUALIZA CHR
	updateChr = function(id,data) {			
		$.ajax({
	        type: "PUT",
	        url: "/chr/"+id,
	        data: {id: id, data: data},
	        dataType: "json",
            cache: false,
            success	: function(coll) {
            	updateList(coll);
            	
            	// RESET TOTAL
				fullReset();
           	}
        });
	},
	
	// REMOVE CHR
	removeChr = function(id) {
		$.ajax({
	        type: "DELETE",
	        url: "/chr/"+id,
	        data: {id: id},
	        dataType: "json",
            cache: false,
            success	: function(coll) {
            	updateList(coll);
            	
            	// RESET TOTAL
				fullReset();
           	}
        });
	},
	
	// SELECT CHR
	selectChr = function(id) {
		if($("select[name='chr-select']").find("option:selected").val() !== "0") {
			$("input[name='chr-remove'], input[name='chr-reset']").css({"display":"inline"});
		
			$.ajax({
		        type: "POST",
		        url: "/chr/"+id,
		        data: {id: id},
		        dataType: "json",
	            cache: false,
	            success	: function(data) {
	            	if(data.coll !== null) {               			
               			unCompressData(data.coll);
               			
               			for(var num = 0; num < directions.length; num++) {
               				formatValidation(num);
               			}
               			
               			$("input#action").val("Atualizar").attr({"name":"chr-atualizar"});
						$("input[name='chr-name']").css({"color":"green"}).val(data.coll.name).attr({"id":data.id});
					}
               	}
	        });
	        
		} else {
			
			// RESET TOTAL
			fullReset();
		}
	},
	
	// VALIDACAO DA ATUALIZACAO DO CHR NAME
	validationUpdateChrName = function(num,name) {
		if(name !== "") {
				
			$("input[name='chr-reset']").css({"display":"inline"});
		
			if($("select[name='chr-select']").find("option:selected").val() !== "0") {
				for(var count = 0; count < num; count++) {
					if($("select[name='chr-select']").find("option:eq("+count+")").text() === name) {
						
						if(!$("select[name='chr-select']").find("option:eq("+count+")").attr("selected")) {
							$("input#action").val("Personagem já existe").attr({"disabled":true});
							$("input[name='chr-name']").css({"color":"red"});
							break;
						}
					
					} else {
						
						$("input#action").val("Atualizar").attr({"disabled":false,"name":"chr-atualizar"});
						$("input[name='chr-name']").css({"color":"green"});
						
					}
				}
			} else {
				for(var count = 0; count < num; count++) {
					
					if($("select[name='chr-select']").find("option:eq("+count+")").text() === name) {

						$("input#action").val("Personagem já existe").attr({"disabled":true});
						$("input[name='chr-name']").css({"color":"red"});
						break;
					
					} else {
						
						$("input#action").val("Enviar").attr({"disabled":false,"name":"chr-enviar"});
						$("input[name='chr-name']").css({"color":"green"});
						
					}
				}
			}
		}
	}