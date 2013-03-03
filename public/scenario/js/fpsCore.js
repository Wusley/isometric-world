	// class Ticker
var	Ticker = function() {
	var fps 			= null,
		pulseCallback 	= null,
		lastMilisecond	= 0;
		
		fps				= new Fps().getFps();
		pulseCallback	= new Pulse();
		lastMilisecond	= new Date().getTime();

		return {
			initCanvas: function(scenario) {
				canvas = new Canvas();
				canvas.init(scenario.name, scenario.width, scenario.height);
			},
			
			initPulse: function(brush) {
				ping = new Ping(pulseCallback, lastMilisecond);
				
				if (!pulseCallback) {
			        alert('É preciso especificar a função a ser chamada a cada pulso. GameLoop não iniciado.');
			    } else if (!canvas) {
			        alert('É preciso especificar o canvas a ser usado, com setCanvas. GameLoop não iniciado.');
			    } else {
			        setInterval('ping(brush)', 1000 / fps);
			    }
		    }
		}
	};	

	// class Fps
var	Fps = function(optionalNewValue) {
		var fps = 60;
		
		return {
			setFps: function(optionalNewValue) {
				if (optionalNewValue) {
			        fps = optionalNewValue;
			    }
			},
			getFps: function() {
			    return fps;
			}
		}
	};
	
    // class Ping
var	Ping = function(callback,lastMilisecond) {
		
		var pulseCallback		= callback,
			pulsesCount			= 0,
			pulsesInLastSecond	= 0,
			lastMilisecond		= lastMilisecond;

		return function(brush) {			
			if (pulseCallback) {
			    pulsesCount++;
			    var date = new Date();
			    if (date.getTime() - lastMilisecond > 1000) {
			        lastMilisecond = date.getTime();
			        pulsesInLastSecond = pulsesCount;
			        pulsesCount = 0;
			    }

			    pulseCallback();
			    brush.drawFps(pulsesInLastSecond);
			}
		}
	};