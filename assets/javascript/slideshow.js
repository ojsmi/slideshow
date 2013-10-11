/* 

Sideshow
--------

Contains slideshow functionality.

Constructs slides from Templates & data.
Initialises listeners to advance/control.

Requires: Zepto, our compiled templates.

*/

(function( $, undefined ){
	var slideClass = '.slideshow--slide';

	var Slideshow = function( _slides ){
		this.$currentSlide = undefined;
		this.$firstSlide = undefined;
		this.$lastSlide = undefined;
		this.$slideshow = this.construct( _slides );
		this.$slides = this.$slideshow.find( slideClass );
		this.initialise();
	};

	Slideshow.prototype = {
		guessSlideType: function( slide ){
			if( slide.background ){
				return 'picture';
			}
			return 'text'; //default to text type
		},
		construct: function( slides ){	
			var $slideshow = $( T[ 'slideshow' ]() );

			for( i in slides ){
				var slide = slides[ i ];
				if( !slide.type || typeof T[ 'slide--' + slide.type ] !== 'function' ){
					slide.type = this.guessSlideType( slide );
				}
				$( T[ 'slide--' + slide.type ]( slide ) ).appendTo( $slideshow );
			}
			$('body').append( $slideshow );

			return $slideshow;
		},
		initialise: function(){
			var that = this;
			this.$firstSlide = this.$slideshow.find( slideClass + ':first-child' );
			this.$lastSlide = this.$slideshow.find( slideClass + ':last-child' );
			this.$currentSlide = this.$firstSlide;

			document.addEventListener( 'click', function(){
				that.next();
			});
			document.addEventListener( 'keydown', function( e ){
				switch( e.which ){
					case 37: //left arrow
						that.prev();
					break;
					case 32: //space
					case 39: //right arrow
					default: 
						that.next();
					break;
				}
			});
			
			this.updateDom();

		},
		updateDom: function(){
			this.$slides.addClass( 'hidden' );
			this.$currentSlide.removeClass( 'hidden' );
		},
		next: function(){
			if( this.$currentSlide.next( slideClass ).length > 0 ){
				this.$currentSlide = this.$currentSlide.next( slideClass );
			}
			this.updateDom();
		},
		prev: function(){
			if( this.$currentSlide.prev( slideClass ).length  > 0 ){
				this.$currentSlide = this.$currentSlide.prev( slideClass );
			}
			this.updateDom();
		}
	}

	window.Slideshow = Slideshow;
	
})( Zepto );