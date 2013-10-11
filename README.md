Slideshow
=========

A framework for creating slideshows in HTML/CSS/Javascript and compiling them down to a single HTML file ( inline CSS/JS and base64 encoded images ).

How To
------

1. Define the slides in ```slides.json``` ( see options below for more details )
2. Add any media to ```/slides/```
3. Run ```grunt``` to create compressed js and css.
4. Run ```node build.js``` to process images and inline content.
5. Open compiled.html
6. Present!

Options
-------

There are anumber of options usable when defining slides (more can be added, or they can be changed - it's essentially data for the Handlebars templates).

```
	[
		{
			type: String, [text | Picture], optional (will infer from use of 'background')
			classes: String, list of classes to be added to the slide
			background: String, path to an image file (.jpg, .png, .gif)
			title: String, the title of the slide
			subtitle: String, the subtitle
			content: String, the text content. TODO: Markdown parsing...
		}
	]
```