var logging=false;

(function($){
	
	$().ready(function(){
		
		$(".aboutText").hide();
		var displayed=false;
		$(".about").click(function(){
			if (displayed) {
				$(".aboutText").hide(160);
				displayed = false;
			}
			else {
				$(".aboutText").show(160);
				displayed=true;
			}
		});
		
		var documentWidth = $().width();
		var documentHeight = $().height();
		
		log(documentWidth);
		log(documentHeight);
		
		var lock=false;
		var elemToReposition = $("#hello");
		
		elemToReposition.offset({
			top:documentHeight/2,
			left:documentWidth/2
		});
		
		var difficulty = document.getElementById("difficulty").value;
		$("#difficulty").change(function(){
			difficulty = document.getElementById("difficulty").value;
		});
		
		var text = elemToReposition.html();
		elemToReposition
			.mouseover(function(){
				if (!lock) {
					lock=true;
					var self = elemToReposition;
					self.html("Got me!");
					self.css(
						{							
							backgroundColor:'#f21'
						}					
					);
				}
			})
			.mouseout(function(){
				elemToReposition.html(text);
				elemToReposition.css({
					backgroundColor:'#eee'
				});
				lock=false;
			});
		
		$().mousemove(function(event){
			var mouseX = event.clientX;
			var mouseY = event.clientY;
			
			if (!lock) {
				elemToReposition.offset(calculateEscapePosition({
					x: mouseX,
					y: mouseY
				}, {
					width: elemToReposition.outerWidth(),
					height: elemToReposition.outerHeight(),
					offset: elemToReposition.offset()
				}));
			}
		});
		
		var calculateEscapePosition = function(hunter, prey) {
			
			var width = prey.width;
			var height = prey.height;
			var offset = prey.offset;
			
			var centerX = offset.left + width/2;
			var centerY = offset.top + height/2;
			
			var distanceFromHunterX= centerX-hunter.x;
			var distanceFromHunterY = centerY-hunter.y;
			
			var distanceFromHunter = Math.sqrt(Math.pow(distanceFromHunterX,2)+Math.pow(distanceFromHunterY,2));
			
			var distanceFromDocumentleftBoundary = offset.left;
			var distanceFromDocumentTopBoundary = offset.top;
			var distanceFromDocumentRightBoundary = documentWidth - offset.left - width;
			var distanceFromDocumentBottomBoundary = documentHeight - offset.top - height;
			
			var directionX = ((distanceFromDocumentRightBoundary-distanceFromDocumentleftBoundary)/documentWidth + 
					distanceFromHunterX/(distanceFromHunter-width/2))*difficulty;
			
			var directionY = ((distanceFromDocumentBottomBoundary-distanceFromDocumentTopBoundary)/documentHeight + 
					distanceFromHunterY/(distanceFromHunter-height/2))*difficulty;
			
			var position = {left:offset.left + directionX, top:offset.top + directionY};
			
			if(position.top<0)
			{
				log(hunter);
				log(prey);
				log(prey.offset);
			}
			
			return position;
		};
		
	});
	
	// the following functionality is planned for jQuery 1.4
	// based on http://plugins.jquery.com/files/offset.js.txt
	$.fn.extend({
		_offset: $.fn.offset,
		offset: function(newOffset) {
		    return !newOffset ? this._offset() : this.each(function() {
				var elem = $(this),
					// we need to convert static positioning to relative positioning
					isRelative = /relative|static/.test(elem.css('position')),
					hide = elem.css('display') == 'none';
	
				(isRelative && elem.css('position', 'relative'));
				(hide && elem.show());
	
				var offset = elem.offset(),
					delta = {
						left : parseInt(elem.css('left'), 10),
						top: parseInt(elem.css('top'), 10)
					};
	
				// in case of 'auto'
				delta.left = !isNaN(delta.left)
					? delta.left
					: isRelative
						? 0
						: this.offsetLeft;
				delta.top = !isNaN(delta.top)
					? delta.top
					: isRelative
						? 0
						: this.offsetTop;
	
				// allow setting only left or only top
				if (newOffset.left || newOffset.left === 0) {
					elem.css('left', newOffset.left - offset.left + delta.left);
				}
				if (newOffset.top || newOffset.top === 0) {
					elem.css('top', newOffset.top - offset.top + delta.top);
				}
	
				(hide && elem.hide());
			});
		}
	});

})(jQuery);


