//define out inputs and outputs
var slideDefinitionsInput = 'slides.json';
var slideDefinitionsOutput = 'compile/show.js';
var styles = [ 'compile/style.css' ];
var scripts = [ 'compile/slideshow.js', 'compile/show.js' ];
//some tools we'll need
var fs = require( 'fs' );
var jsdom = require( 'jsdom' );

// functions to sort this out:
var mightBeImagePath = function( path ){
	var imageExtensionRegexp =  /(.jpg|.jpeg|.gif|.png)$/;
	return imageExtensionRegexp.test( path );
}

var imageToBase64 = function( file, callback ){
	fs.readFile( file, function( err, data ){
		if( err ){
			console.log( err );
		}
		if( data && typeof callback === 'function' ){
			var base64 = new Buffer( data ).toString( 'base64' );
			callback( base64 );
		}

	});
};

var convertImages = function( definition, callback ){
	var imageCount = 0;
	var convertedCount = 0;

	for( var i in definition ){
		var slide = definition[ i ];
		for( key in slide ){			
			if( mightBeImagePath( slide[key] ) ){
				imageCount++;
				(function( slide, key ){						
					imageToBase64( slide[key], function( base64 ){
						convertedCount++;
						slide[key] = 'data:image/png;base64,' + base64;
						if( convertedCount === imageCount && typeof callback === 'function' ){
							callback( definition );
						}
					});
				})( slide, key );
			}
		}
	}
	if( imageCount === 0 && typeof callback === 'function' ){
		callback( definition );
	}
}

var saveEncoded = function( data, filename, callback ){
	fs.writeFile( filename, data, function( err ){
		if( !err && typeof callback === 'function' ) callback();
	} )
};

var processSlideImages = function( src, callback ){
	//read the JSON definitions file
	fs.readFile( src, { encoding: 'utf8' }, function( err, data ){
		var definition = JSON.parse( data );
		convertImages( definition, callback );
	});
};


var compile = function( file, callback ){	
	fs.readFile( file, { encoding: 'utf8' }, function( err, data ){
		doc = jsdom.jsdom( data );
		var window = doc.parentWindow;
		var css = doc.getElementsByTagName( 'link' );
		var js = doc.getElementsByTagName( 'script' );
		var aim = css.length + js.length;
		var count = 0;
		var cssContent = '';
		var jsContent = '';

		for( var i = 0; i < css.length; i++ ){
			var tag = css[i];
			(function( tag ){
				fs.readFile( tag.href, { encoding: 'utf8' }, function( err, data ){
					cssContent += data;
					count++;					
					if( count === aim ){
						callback( cssContent, jsContent );
					}
				} );
			})( tag );	
		}

		for( var i = 0; i < js.length; i++ ){
			var tag = js[i];
			(function( tag ){
				fs.readFile( tag.src, { encoding: 'utf8' }, function( err, data ){
					jsContent += data;
					count++;
					if( count === aim ){						
						callback( cssContent, jsContent );
					}
				});
			})( tag );
		}
		
	} );
};


//GO: 

//run through slide definitions
processSlideImages( slideDefinitionsInput, function( data ){
	// save our input json as a javascript file for use
	var file = 'window.Show = ' + JSON.stringify( data ) + ';';
	saveEncoded( file, slideDefinitionsOutput, function(){
		//go through index.html and inline all files
		compile( 
			'./index.html',
			function( css, js ){
				//take our css and js and place them in a document
				var html = '<html><head><style type="text/css">';
				html += css;
				html += '</style></head><body>';
				html += '<script type="text/javascript">';
				html += js;
				html += '</script></body></html>';
				//save the document as our compiled file
				saveEncoded( 
					html, 
					'compiled.html', 
					function(){ 
						console.log( 'Complete. Saved as ./compiled.html' );
					}
				)
			}
		);
	}); 
} );


