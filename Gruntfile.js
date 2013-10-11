module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			templates: {
				files: ['assets/templates/**/*'],
				tasks: ['handlebars']
			},
			styles: {
				files: ['assets/sass/**/*'],
				tasks: ['compass']
			},
			javascript: {
				files: ['assets/javascript/**/*'],
				tasks: ['uglify']
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			dist: {
				files: {
					'compile/slideshow.js': ['assets/javascript/libs/*.js', 'assets/javascript/templates.js', 'assets/javascript/slideshow.js','assets/javascript/main.js']
				}
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: 'assets/sass',
					cssDir: 'assets/stylesheets'
				}
			},
			compile: {
				options: {
					sassDir: 'assets/sass',
					cssDir: 'compile',
					outputStyle: 'compressed'
				}
			}
		},
		handlebars: {
			compile: {
				options: {
					namespace: "T",
					processName: function(filePath) {
    					return filePath.replace( 'assets/templates/', '' ).replace( '.hbs', '' );
  					}
				},
				files: {
					'assets/javascript/templates.js': [ 'assets/templates/*.hbs' ]
				}
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['handlebars', 'compass', 'uglify']);
	

};