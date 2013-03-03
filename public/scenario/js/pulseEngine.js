	// class Pulse
var	Pulse = function() {
	
		return function() {
	        update();
	        render();
		}
    };

var	update = function() {
		
		// ATUALIZANDO POSICAO
		for(var id in chrs) {
			chrs[id].updatePosition();
    		chrs[id].updateDirection();
    		
    		// CONTADOR PARA INTERVALO DE FRAMES CHR
    		chrs[id].doCountFrame();
    		
    		// CONTADOR PARA INTERVALO DE MSG
    		chrs[id].doCountMsg();
		}
		
    },

    render = function() {
    	
    	// POSICAO PARA LIMPAR APENAS DISPLAY
    	var position = chrs[cid].getPosition();
    	
    	// LIMPA DISPLAY
    	brush.drawClear(position.x, position.y, display.getWidth(), display.getHeight());
    	
    	// DESENHANDO CHRS
    	for(var id in chrs) {
    		var position = chrs[id].getPosition();
    		
    		var direction	= chrs[id].getDirection(),
    			countFrame	= chrs[id].getCountFrame();
    		
    		brush.drawChr(
    			direction.frame[countFrame].left,
    			direction.frame[countFrame].top,
    			direction.frame[countFrame].width,
    			direction.frame[countFrame].height,
    			position.x,
    			position.y,
				chrs[id].getImage()
			);
		}
    	
    	// DESENHANDO NICK
    	for(var id in chrs) {
    		var position = chrs[id].getPosition();
    		
    		// DESENHA REFERENCIA CENTRAL
    		if(cid === id) {
    			//brush.drawPoint("green",position.x,position.y);
    			display.render(position.x,position.y);
    		} else {
    			//brush.drawPoint("red",position.x,position.y);
    		}
    		
    		// DESENHA NICK
    		brush.drawNick(
    			chrs[id].getNick(),
    			position.x,
    			position.y
    	    );
		}
    	
    	// DESENHANDO BALAO
    	for(var id in chrs) {
    		var position	= chrs[id].getPosition(),
    			msg			= chrs[id].getMsg();
    		    		
    		if(msg.length > 0) {
	    		brush.drawBalloon( 
	    			chrs[id].getMsg(),
	    			position.x,
	    	        // FORMATANDO COM A MAIOR ALTURA DOS SPRITES
	    			position.y - chrs[id].getMaxHeight()
	    		);
    		}
		}
    	
    };