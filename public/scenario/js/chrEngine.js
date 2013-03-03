var Chr = function(data) {
	var image			= new Image();
		image.src		= "images/media/chrs/" + data.chr.background;
		
	var nick			= data.nick,
		msg				= [],
		
		stoppedX		= true,
		stoppedY		= true,
		estado			= "parado",
		
		countMsg		= 0,

		auxCountFrame	= 0,
		countFrame		= 0,
		
		radianos		= 0,
		angle			= 0,
		maxHeight		= data.chr.maxHeight,
		did				= null,
		direction		= data.chr.direction,
		positionX		= data.positionX,
		positionY		= data.positionY,
		newPositionX	= data.newPositionX,
		newPositionY	= data.newPositionY,
		
		oldX			= null,
		oldY			= null;
		
		return {
			setOldPosition: function(data) {
				oldX = data.x;
				oldY = data.y
			},
			getOldPosition: function() {
				return {
					'oldX': oldX, 
					'oldY': oldY
				};
			},
			getImage: function() {
				return image;
			},
			getMaxHeight: function() {
				return maxHeight;
			},
			getMsg: function() {
				return msg;
			},
			getNick: function() {
				return nick;
			},
			doCountMsg: function() {
				countMsg++;
			
	        	// LIMITE DE QUADROS
	    		if(countMsg >= 600) {
	    			msg			= [];
	    			countMsg	= 0;
	    		}
			},
			doCountFrame: function() {
				auxCountFrame++;
				
	        	// MANTER INTERVALO DE FRAMES
	        	if(auxCountFrame > direction[did].timing) {
	        		countFrame++;
	        		auxCountFrame = 0;
	        	}
	        	
	        	// LIMITE DE QUADROS
	    		if(countFrame >= direction[did].frame.length) {
	    			countFrame = 0;
	    		}
			},
			getCountFrame: function() {
				return countFrame;
			},
			getDirection: function() {
				return direction[did];
			},
			setStoppedFalse: function() {
				stoppedX = false;
				stoppedY = false;
			},
			setStoppedX: function(data) {
				stoppedX = data;
			},
			setStoppedY: function(data) {
				stoppedY = data;
			},
			setNewPosition: function(data) {
				newPositionX = data.x;
				newPositionY = data.y;
			},
			setNewPositionX: function(x) {
				newPositionX = x;
			},
			setNewPositionY: function(y) {
				newPositionY = y;
			},
			getNewPositionX: function(x) {
				return newPositionX;
			},
			getNewPositionY: function(y) {
				return newPositionY;
			},
			setPosition: function(data) {
				positionX = data.x;
				positionY = data.y;
			},
			setPositionX: function(x) {
				positionX = x;
			},
			setPositionY: function(y) {
				positionY = y;
			},
			getPosition: function() {
				return {
					'x'	: positionX,
					'y'	: positionY
				};
			},
			getPositionX: function() {
				return positionX;
			},
			getPositionY: function() {
				return positionY;
			},
			updateAngle: function() {
				var triangle_x = newPositionX - positionX;
				var triangle_y = newPositionY - positionY;
				
				radianos = Math.atan2(triangle_y, triangle_x);
				
				var auxRadianos = 180 / Math.PI;
				
				if(auxRadianos*radianos < 0) {
					angle = Math.round(Math.abs(auxRadianos*radianos));
				} else {
					angle = Math.round((auxRadianos*radianos)*(-1)+360);
				}
			},
			updatePosition: function() {
				var velocity	= direction[did].timing/3,
					cos			= Math.cos(radianos),
					sen			= Math.sin(radianos);
				
				positionX += Math.round(Math.cos(radianos) * velocity);
    			positionY += Math.round(Math.sin(radianos) * velocity);
				
				if (sen < 0 && cos > 0) {
	    			
	    			if(positionX >= newPositionX) {
	    				positionX = newPositionX;
	    				stoppedX = true;
	    			}
	    			
	    			if(positionY <= newPositionY) {
	    				positionY = newPositionY;
	    				stoppedY = true;
	    			}
					
				} else if (sen > 0 && cos > 0) {
		    		
	    			if(positionX >= newPositionX) {
	    				positionX = newPositionX;
	    				stoppedX = true;
	    			}
	    		
	    			if(positionY >= newPositionY) {
	    				positionY = newPositionY;
	    				stoppedY = true;
	    			}
					
				} else if (sen > 0 && cos < 0) {
		    		
	    			if(positionX <= newPositionX) {
	    				positionX = newPositionX;
	    				stoppedX = true;
	    			}
		       
	    			if(positionY >= newPositionY) {
	    				positionY = newPositionY;
	    				stoppedY = true;
	    			}
					
				} else if(sen < 0 && cos < 0) {
					
	    			if(positionX <= newPositionX) {
	    				positionX = newPositionX;
	    				stoppedX = true;
	    			}
	    			
	    			if(positionY <= newPositionY) {
	    				positionY = newPositionY;
	    				stoppedY = true;
	    			}
				}
				
				cos = Math.round(cos),
				sen = Math.round(sen);
				
				if (sen === 0) {
					stoppedY = true;
				} else if (cos === 0) {
					stoppedX = true;
				}
				
				if(sen === 0 && cos > 0) {
					if(positionX >= newPositionX) {
	    				positionX = newPositionX;
	    				stoppedX = true;
	    			}
				}
								
				velocity	= 0;
			},
			updateDirection: function() {
				
				// standing
				if(stoppedX === true && stoppedY === true) {
					
					if(angle <= 10) {
						
						if(direction[9] !== null) {
							did = 9;
						} else {
							did = 10;
						}
						
					} else if(angle > 350) {
								
						if(direction[9] !== null) {
							did = 9;
						} else {
							did = 10;
						}
						
					} else if(angle <= 350 && angle > 280) {
						
						if(direction[10] !== null) {
							did = 10;
						} else {
							did = 11;
						}
						
					} else if(angle <= 280 && angle > 260) {
						
						if(direction[11] !== null) {
							did = 11;
						} else {
							did = 10;
						}
						
					} else if(angle <= 260 && angle > 190) {
						
						if(direction[12] !== null) {
							did = 12;
						} else {
							did = 11;
						}
						
					} else if(angle <= 190 && angle > 170) {
						
						if(direction[13] !== null) {
							did = 13;
						} else {
							did = 12;
						}
						
					} else if(angle <= 170 && angle > 100) {
						
						if(direction[14] !== null) {
							did = 14;
						} else {
							did = 15;
						}
												
					} else if(angle <= 100 && angle > 80) {
						
						if(direction[15] !== null) {
							did = 15;
						} else {
							did = 8;
						}
						
					} else if(angle <= 80 && angle > 10) {
						
						if(direction[8] !== null) {
							did = 8;
						} else {
							did = 15;
						}
						
					}
					
				// walking
				} else {
										
					if(angle <= 10) {
						
						if(direction[1] !== null) {
							did = 1;
						} else {
							did = 2;
						}
						
					} else if(angle > 350) {
						
						if(direction[1] !== null) {
							did = 1;
						} else {
							did = 2;
						}
					
					} else if(angle <= 350 && angle > 280) {
						
						if(direction[2] !== null) {
							did = 2;
						} else {
							did = 3;
						}
						
					} else if(angle <= 280 && angle > 260) {
						
						if(direction[3] !== null) {
							did = 3;
						} else {
							did = 2;
						}
						
					} else if(angle <= 260 && angle > 190) {
						
						if(direction[4] !== null) {
							did = 4;
						} else {
							did = 3;
						}
						
					} else if(angle <= 190 && angle > 170) {
						
						if(direction[5] !== null) {
							did = 5;
						} else {
							did = 4;
						}
						
					} else if(angle <= 170 && angle > 100) {
						
						if(direction[6] !== null) {
							did = 6;
						} else {
							did = 7;
						}
												
					} else if(angle <= 100 && angle > 80) {
						
						if(direction[7] !== null) {
							did = 7;
						} else {
							did = 0;
						}
						
					} else if(angle <= 80 && angle > 10) {
						
						if(direction[0] !== null) {
							did = 0;
						} else {
							did = 7;
						}
						
					}
					
				}
			},
			setMsg: function(ctx, text) {
				var limit	= 100;
				var col		= [];
				var tamText	= text.length;
				var rest;
					countMsg = 0;
				
				for(var count = 0; count <= tamText; count++) {
				
					var metrics = ctx.measureText(text.slice(0,count)).width;
					
					rest = text.slice(0,count);
								
					if(metrics >= limit) {
						
						var search = text.lastIndexOf(" ",count);
						var halfText = ctx.measureText(text.slice(0,search)).width;
						
						if(search !== -1 && halfText >= limit/2) {
							
							count = search + 1;
							col.push(text.slice(0,search));
							
						} else {
							
							col.push(text.slice(0,count));
							
						}		
						
						text = text.slice(count);
						
						rest = null;
						tamText = text.length;
						count = 0;
					}
				}
				
				col.push(rest);
						
				msg = col;
				
			}
		}
	};