	var socket	= io.connect('http://192.168.1.100'), // CONTAINER SOCKET
		display = null,
		brush	= null,
		cid		= null,
		chrs	= {};
	
	// CRIANDO LISTA DOS CENARIOS
	socket.on('list scenarios', function(data) {  
		$("select[name='list-scenarios']",window.parent.document).html("<option value='0'>Selecione</option>");
		
		for(var id in data) {
			$("select[name='list-scenarios']",window.parent.document).append("<option value='" + data[id].id + "'> " + data[id].name + " </option>");
		}
	});
	
	// CRIANDO CENARIO
	$("input[name='create']",window.parent.document).click(function() {
		var name 	= $("input[name='name-scenario']",window.parent.document).val();
		var width	= $("input[name='width-scenario']",window.parent.document).val();
		var height 	= $("input[name='height-scenario']",window.parent.document).val();
		
		socket.emit('created scenario', {'name': name, 'width': width, 'height': height});
	});
	
	// SELECIONANDO CENARIO
	$("input[name='select']",window.parent.document).click(function() {
		var value = $("select[name='list-scenarios']",window.parent.document).find("option:selected").val();
		
		socket.emit('selected scenario', value);
	});
	
	// RECEBENDO CENARIO
	socket.on('sending scenario', function(data) {
		$("section.list-scenarios",window.parent.document).hide();
		$("#window",window.parent.document).show();
		
		// INICIANDO APP
		var ticker = new Ticker();
		
		// INICIANDO CENARIO
		ticker.initCanvas(data);
		
		// INICIANDO PINCEL
		brush = new Brush(data.name);
		
		// INICIANDO PULSADOR DE QUADROS
		ticker.initPulse(brush);
		
		// INICIANDO CHR
		display = new Display(window.parent.innerWidth,window.parent.innerHeight);
		socket.emit('create',{"width": display.getWidth(), "height": display.getHeight()});
	});
	
	$(window.parent).resize(function(){
		display.update(this.innerWidth,this.innerHeight);
	});
	
	// CRIA NOVO CHR
	socket.on('create new chr', function(data) {		
		
		// ID PESSOAL
		cid = data.me.id;
		
		// CONSTRUINDO CHR PESSOAL
		chrs[cid] = new Chr(data.me);
				
		chrs[cid].updateAngle();
		chrs[cid].updateDirection();

		// CONSTRUINDO OUTROS CHRS
		data.all.forEach(function(chr,id) {
			chrs[chr.id] = new Chr(chr);
			
			chrs[chr.id].setPosition({
				'x'	: chr.newPositionX,
				'y'	: chr.newPositionY
			});
			
			chrs[chr.id].updateAngle();
			chrs[chr.id].updateDirection();
		});
	});
	////////////////

	// CLICK SCENARIO
	$("body").click(function(e) {
		if(!e.shiftKey) {
			socket.emit('post chr', {'positionY': chrs[cid].getPositionY(), 'positionX': chrs[cid].getPositionX(), 'newPositionY': e.pageY, 'newPositionX': e.pageX });
			
			chrs[cid].setNewPosition({
				'x'	: e.pageX,
				'y'	: e.pageY
			});
			
			chrs[cid].setStoppedFalse();
			
			chrs[cid].updateAngle();
			chrs[cid].updateDirection();
		}
	});
	/////////////////

	////////////////////////
	// DESENHANDO NO CENARIO
	var cl = false;
	$(window).mousedown(function(e) {
		if(e.shiftKey) {
			cl = true;
			brush.initDrawFree(e.pageX, e.pageY);
			
			chrs[cid].setOldPosition({'x': e.pageX, 'y': e.pageY});
			
			socket.emit('draw free first point',{'x':e.pageX,'y':e.pageY});
		}
	});
	
	$(window).mouseup(function() {
		cl = false;
	});
	
	$(window).mousemove(function(e) {
		if(e.shiftKey && cl === true) {
			var data = chrs[cid].getOldPosition();
			brush.drawFree(data.oldX, data.oldY, e.pageX,e.pageY);
			
			chrs[cid].setOldPosition({'x': e.pageX, 'y': e.pageY});

			socket.emit('draw free',{'x':e.pageX,'y':e.pageY});
		}
	});
	
	socket.on('you draw first point', function(data) {
		if(chrs[cid]) {
			brush.initDrawFree(data.x, data.y);
			
			chrs[cid].setOldPosition({'x': data.x, 'y': data.y});
		}
	});
	
	socket.on('you draw', function(data) {
		if(chrs[cid]) {
			var position = chrs[cid].getOldPosition();
			
			brush.drawFree(position.oldX, position.oldY, data.x, data.y);
			
			chrs[cid].setOldPosition({'x': data.x, 'y': data.y});
		}
	});
	////////////////////////
	
	// CRIAR EVENTO QUE RECEBA E ATUALIZE A NOVA POSIÇÃO
	socket.on('Do you want new listchr?', function() {	
		socket.emit('Yes, I want!');
	});
	
	socket.on('receiving new listchr', function(data) {
		// NOVA COLLECTION
		var newChrs = {};
		
		// CONSTRUINDO OUTROS CHRS
		data.forEach(function(chr,id) {
			var status = false;
			
			// LISTA DE CHRS EXISTENTES
	    	for(var id in chrs) {	    		
	    		// VERIFICANDO CHR JA CONSTRUIDO
	    		if(id === chr.id) {
	    			status = true;
	    			
	    			chrs[id].setNewPosition({
	    				'x'	: chr.newPositionX,
	    				'y'	: chr.newPositionY
	    			});
	    		}
			}
    		
	    	// CONSTRUINDO NOVO CHRS
    		if(status === false) {
    			chrs[chr.id] = new Chr(chr);
    		}
    		
    		if(chrs[chr.id].getPositionX() !== chrs[chr.id].getNewPositionX()) {
				chrs[chr.id].setStoppedX(false);
			} else {
				chrs[chr.id].setStoppedX(true);
			}
			
			if(chrs[chr.id].getPositionY() !== chrs[chr.id].getNewPositionY()) {
				chrs[chr.id].setStoppedY(false);
			} else {
				chrs[chr.id].setStoppedY(true);
			}
    		
    		chrs[chr.id].updateAngle();
    		chrs[chr.id].updateDirection();
    		
    		newChrs[chr.id] = chrs[chr.id];
    	});
		
		// MANTENDO INSTANCIA PESSOAL
		newChrs[cid]	= chrs[cid];
		
		// RECEBENDO NOVA COLECAO
    	chrs			= newChrs;
	});
	///////////
	
	// CHAT
	$("label#write-box input:button",window.parent.document).click(function(){
		var talk = $(this).siblings("input:text").val();
		
    	chrs[cid].setMsg(brush.getContext(), talk);
    	$("section.chat",window.parent.document).append('<p><span>' + chrs[cid].getNick() + ": </span>" + talk + '</p>');
		
    	$(this).siblings("input:text").val(null);

    	socket.emit('say', talk);
	});
	
	socket.on('read',function(data){
		if(chrs[data.id]) {
			chrs[data.id].setMsg(brush.getContext(), data.msg);
		
			$("section.chat",window.parent.document).append('<p><span>' + data.nick + ": </span>" + data.msg + '</p>');
		}
	});
	///////