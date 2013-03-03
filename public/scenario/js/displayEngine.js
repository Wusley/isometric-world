	// class Display
var Display = function(w,h) {
		var width	= w,
			height	= h;
		
		return {
			update: function(w,h) {
				width	= w;
				height	= h;
			},
			render: function(left,top) {
				$("#window",window.parent.document).css({
		    		"margin-top":top*(-1),
					"margin-left":left*(-1)
		    	});
			},
			getWidth: function() {
				return width;
			},
			getHeight: function() {
				return height;
			}
		}
	};