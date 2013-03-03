
var Canvas = function() {
		return {
			init: function(name,width,height) {
				// PLACE CHR
				$("canvas.display").attr({"id":name,"width":width,"height":height});
				// PLACE SCENARIO
				$("#window",window.parent.document).attr({"width":width,"height":height});
				$("canvas#scenario").attr({"width":width,"height":height});
			}
		}
	};

var Brush = function(name) {
		var ctxDs = document.getElementById(name).getContext('2d');
		var ctxSc = document.getElementById("scenario").getContext('2d');
		
		return {
			getContext: function() {
				return ctxDs;
			},
			drawClear: function(x,y,w,h) {
				ctxDs.beginPath();
				ctxDs.clearRect( x-w/2 , y-h/2 , w , h ); 
				ctxDs.closePath();
			},
			drawPoint: function(color,posX,posY) {
				raio = 5;
				
				ctxDs.fillStyle = color;
				
				ctxDs.beginPath();
					ctxDs.arc(posX,posY,raio,0,Math.PI * 2,false);
					ctxDs.fill();
				ctxDs.closePath();
			},
			drawFps: function(text) {
				ctxDs.fillStyle = 'blue';
				ctxDs.beginPath();
			    	ctxDs.rect(6,36,50,20);
			    	ctxDs.fill();
			    ctxDs.closePath();
				
				ctxDs.fillStyle = 'yellow'
				ctxDs.font = 'bold 14px sans-serif';
				ctxDs.beginPath();
					ctxDs.textBaseline = 'alphabetic';
					ctxDs.fillText(text + ' fps', 10, 50);
			    ctxDs.closePath();
			},
			drawNick: function(text, x, y) {	
				ctxDs.fillStyle		= '#333';
				ctxDs.strokeStyle		= 'rgba(0,0,0,0.5)';
				ctxDs.font			= 'italic bold 10px sans-serif';
				ctxDs.textBaseline	= 'top';
				
				ctxDs.beginPath();
					ctxDs.fillText(text, x - ctxDs.measureText(text).width/2, y+20);
			    	ctxDs.strokeText(text, x - ctxDs.measureText(text).width/2, y+20);
			    ctxDs.closePath();
			},
			drawChr: function(cutX, cutY, cutWidth, cutHeight, posX, posY, img) {
				// ajustando dados recebidos
				posX = posX - (cutWidth/2);
				posY = posY - (cutHeight - 10);
				cutX = cutX*(-1);
				cutY = cutY*(-1);
				
				ctxDs.beginPath();
					ctxDs.drawImage(img, cutX, cutY, cutWidth, cutHeight, posX, posY, cutWidth, cutHeight);
				ctxDs.closePath();
			},
			drawBalloon: function(col,x,y) {
				var fontSize = 12;
				
				ctxDs.font = fontSize + 'px Arial';
				ctxDs.textBaseline = "bottom";
				
				//largura sentenca
				var attr = 0;
				var margin = 5;
				
				col.forEach(function(el,id) {
					if(attr <= ctxDs.measureText(el).width) {
						attr = ctxDs.measureText(el).width + margin*2;
					}
				});
				
				ctxDs.fillStyle = "rgba(0,0,0,0.6)";
				ctxDs.strokeStyle = "rgba(0,0,0,1)";
				
				ctxDs.beginPath();
						rectX		= x - ( attr / 2 ),
						rectY		= y - ( fontSize * col.length ) - ( margin * 2 ),
						rectWidth	= attr,
						rectHeight	= fontSize * col.length  + (margin * 2);
				
					ctxDs.fillRect(rectX, rectY, rectWidth, rectHeight);
					ctxDs.strokeRect(rectX, rectY, rectWidth, rectHeight);
				ctxDs.closePath();
				
				col.forEach(function(el,id) {
					id++;
					
					ctxDs.fillStyle = "#fff";
					ctxDs.beginPath();	
						ctxDs.fillText(el,x-(attr/2) + margin,y + (fontSize * id) - (fontSize * col.length) - margin);
					ctxDs.closePath();
				});
			},
			initDrawFree: function(x, y) {				
				ctxSc.fillStyle = '#FF8A00';
				
				ctxSc.beginPath();
					ctxSc.fillRect(x,y,1,1);
				ctxSc.closePath();
			},
			drawFree: function(oldX, oldY, x, y) {
				ctxSc.fillStyle = '#000000';
				ctxSc.lineWidth = 1;
				ctxSc.lineCap = "round";
				ctxSc.strokeStyle = '#FF8A00';
				
				ctxSc.beginPath();
					ctxSc.moveTo(oldX,oldY);
					ctxSc.lineTo(x,y);
					ctxSc.fill();
					ctxSc.stroke();
				ctxSc.closePath();
			}
		}
	};