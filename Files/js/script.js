(function($){
	
	// Using a self-executing anonymous function,
	// so that we do not pollute the global space
	
	$(document).ready(function(){
	
		var page	= $('#page');

		// Creating the expanding images:
			
		var picArr = [
			
			new pic({
				top : 90, left : 198, width : 100,height : 62, href:'#',
				img : { src : '../img/4.jpg', offsetTop : 43, offsetLeft: 73}
			}),
			new pic({
				top : 52, left : 315, width : 58,height : 90, href:'#',
				img : { src : '../img/5.jpg', offsetTop : 13, offsetLeft: 42}
			}),
			new pic({
				top : 167, left : 216, width : 90,height : 58, href:'#',
				img : { src : '../img/6.jpg', offsetTop : 0, offsetLeft: 13}
			}),
			new pic({
				top : 159, left : 325, width : 63,height : 93, href:'#',
				img : { src : '../img/7.jpg', offsetTop : 37, offsetLeft: 9}
			}),
			
			
			
		];
		
		// Appending the images to the #page div:
		
		$.each(picArr,function(){
			page.append(this.elem);
		});
		
	
		// Setting up an event listener for the window.load event.
		// window.load is executed after all the images have been loaded.
		
		$(window).load(function(){

			page.mousemove(function(e){
				
				var left = (e.pageX - page.offset().left),
					top = (e.pageY - page.offset().top),
					pic = null;
				
				// On each mouse movement, loop through the pics
				// and check whether the cursor is above any of them.

				for(var i = 0;i < picArr.length;i++){
					pic = picArr[i];
					
					if(pic.near(left,top)){

						if(pic.over(left,top)){
							pic.open();
						}
						else pic.focus();
					}
					else pic.close();
				}
				
			}).mouseleave(function(){
				
				// When the mose leaves the #page div,
				// foce a close on all the images.
				
				for(var i = 0;i < picArr.length;i++){
					picArr[i].close();
				}
				
			});
		});	
	});

	// This is the constructor of the pics
	
	function pic(options){
		
		// All the properties of the options object
		// are copied to the current pic:
		
		$.extend(this,options);
		
		// Creating the markup of the pic,
		// and storing it in the elem property:
		
		this.elem = $('<a>',{
			className: 'pic',
			href: this.href,
			css : {
				top : this.top,
				left : this.left,
				width: this.width,
				height: this.height
			}
		});

		var borderWidth = 5;

		// The bottom and right properties are not passed
		// as arguments, so we need to calculate them.
				
		this.bottom = this.top+this.height+2*borderWidth;
		this.right = this.left+this.width+2*borderWidth;
		
		this.image = $('<img>',{
			css:{
				left : -this.img.offsetLeft,
				top : -this.img.offsetTop
			}
		});
		
		var self = this;
		
		// Appending the image to the body so we can get
		// its dimensions. After we do this, we remove it
		// and append it to the markup stored in this.elem:
		
		this.image.hide().appendTo('body').load(function(){
			
			self.img.width = self.image.width();
			self.img.height = self.image.height();
			self.elem.append(self.image.show());
			
		}).attr('src',this.img.src);
		
	}
	
	// The prototype holds the class methods,
	// that are common for all objects.
	
	pic.prototype = {
		open	: function(){
			if(this.opened){
				return false;
			}
			
			this.opened = true;
			
			// Firing our own expand method with a percentage of 100:
			this.expand(100);
		},
		close	: function(){
			if(!this.opened && !this.focused){
				return false;
			}
			
			this.opened = this.focused = false;
			this.expand(0);
		},
		focus	: function(){
			if(this.focused || this.opened){
				return false;
			}
			
			this.focused = true;
			
			//Expanding to 30%:
			this.expand(30);
		},
		
		near	: function(x,y){
			// Checking whether the passed x and y coordinates are near the current image:
			return (x > this.left-15 && x < this.right+15 && y > this.top-15 && y < this.bottom+15);
		},
		
		over	: function(x,y){
			// The same, but returning true only when directly above the image:
			return (x > this.left && x < this.right && y > this.top && y < this.bottom);
		},
		
		expand : function(animPercent){
			if(!this.animateObj){
				this.animateObj = {count:0};
			}
			
			// We use jQuery's animate method to
			// change the count property of the object:
			
			$(this.animateObj).stop().animate({
				count:animPercent
			},{
				duration:150,
				
				// The step funciton is executed on every animation frame.
				// With jQuery's proxy we pass the "this" of the function:
				step:$.proxy(this.stepAnimation,this)
			});
		},
		
		stepAnimation : function(p,fx){
			
			// P holds the current value of the count property,
			// between 0 and 100. Below we are turning into percentage.
			
			p = p/100;
			
			// Changing the size and position of the image holder:
			
			this.elem.css({
				width : (this.img.width - this.width)*p + this.width ,
				height : (this.img.height - this.height)*p + this.height,
				marginTop : -this.img.offsetTop*p,
				marginLeft: -this.img.offsetLeft*p,
				zIndex: 100*p
			});
			
			// Moving the image so it appears as if fixed:
			
			this.image.css({
				marginLeft : p*this.img.offsetLeft,
				marginTop : p*this.img.offsetTop
			});
		}
	};

})(jQuery);