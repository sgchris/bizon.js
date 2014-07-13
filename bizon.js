/**
 * @TODO
 * - open the gallery immediately in full screen mode
 * - add callbacks
 * - fix - display image only after it's loaded completely
 */
;(function() {

	// helping tools
	var tools = {
		// clear the dom element content
		empty: function(DOMElem) {
			while (DOMElem && DOMElem.firstChild) {
				DOMElem.removeChild(DOMElem.firstChild);
			}
		},

		createElement: function (tag, attrs, content, isHtml) {
			// create the element
			var newElem = document.createElement(tag);

			// set attributes
			if (attrs && attrs instanceof Object) {
				for (var attrName in attrs) {
					if (typeof(attrs[attrName]) !== 'function') {
						// validate value type
						var valueType = typeof(attrs[attrName]);
						if (['string', 'number'].indexOf(valueType) >= 0) {
							newElem.setAttribute(attrName, attrs[attrName]);
						}
					}
				}
			}

			// set the content
			if (content) {
				if (content instanceof HTMLElement) {
					newElem.appendChild(content);
				} else if (isHtml) {
					newElem.innerHTML = content;
				} else {
					newElem.textContent = content;
				}
			}

			return newElem;
		},

		getElementIndex: function (elem) {
			var i = 0;
			while( (elem = elem.previousSibling) !== null ) i++;
			return i;
		},

		getElementRelativeTop: function(elem) {
			return elem.offsetTop - elem.parentNode.offsetTop;
		},

		// merge two objects, override obj1 properties with obj2 properties
		merge_objects: function(obj1, obj2) {
			var obj3 = {};
			for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
			for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
			return obj3;
		}
	};

	// define bizon object
	var bizonObj = function(container, options) {
		// private configurable // 

		// set default options
		var defaultOptions = {
			'fullScreen': false,
			'smallImagesWrapperMinWidth': 80,
			'smallImagesPadding': 3
		};
		options = tools.merge_objects(defaultOptions, options);

		// space between each small image and its wrapper
		this._smallImagesPadding = options['smallImagesPadding'];
		// min width of the small images area
		this._smallImagesWrapperMinWidth = options['smallImagesWrapperMinWidth'];

		// private //

		this._bigImage = null; // IMG
		this._bigImageTitle = null; // DIV
		this._bigImageWrapper = null; // DIV (>IMG)
		this._smallImagesWrapper = null; // DIV (>DIVs>IMG)
		this._currentImage = 0;
		
		this._callbacks = {};
		
		this._fullScreenMode = options['fullScreen'];
		this._initialContainerWidth = container.clientWidth;
		this._initialContainerHeight = container.clientHeight;

		// public // 

		this.container = container;
		this.images = [];
		
		// initializers 

		this.loadImages();
		this.buildDom();
		this.bindEvents();
		this.fixSize();
		
		var that = this;
		window.addEventListener('resize', function() {
			that.fixSize();
		}, false);
	};

	bizonObj.prototype = {
		on: function(eventName, callbackFn) {
			if (typeof(this._callbacks[eventName]) == 'undefined') {
				this._callbacks[eventName] = [];
			}
			
			this._callbacks[eventName].push(callbackFn);
		},
		
		_trigger: function(eventName) {
			if (this._callbacks[eventName]) {
				this._callbacks[eventName].forEach(function(callbackFn) {
					if (typeof(callbackFn) == 'function') {
						callbackFn();
					}
				});
			}
		},
			
		// function(scrollTo, elem)
		animateScrollTo: (function() {

			var timeoutInterval = 10;
			var destinationDivide = 3;
			var finalScrollTo;

			var animate = function(elem) {
				var initialScrollTop = elem.scrollTop;
				var maxScrollTop = elem.scrollHeight - elem.clientHeight;
				var delta = Math.floor((finalScrollTo - initialScrollTop) / destinationDivide);
				if (delta === 0 || (initialScrollTop >= maxScrollTop && finalScrollTo >= maxScrollTop)) {
					return;
				}

				var nextScrollTop = initialScrollTop + delta;
				elem.scrollTop = nextScrollTop;

				setTimeout(function() {
					animate(elem);
				}, timeoutInterval);
			};

			return function(scrollTo, elem) {
				finalScrollTo = scrollTo;
				animate(elem);
			};
		})(),
		// function(newHeight, elem)
		animateHeightTo: (function() {

			var timeoutInterval = 10;
			var destinationDivide = 3;
			var finalHeight;

			var animate = function(elem, callbackFn) {
				var initialHeight = elem.clientHeight;
				var delta = Math.floor((finalHeight - initialHeight) / destinationDivide);
				if (delta === 0) {
					if (typeof(callbackFn) == 'function') callbackFn();
					return;
				}

				elem.style.height = (initialHeight + delta) + 'px';

				setTimeout(function() {
					animate(elem, callbackFn);
				}, timeoutInterval);
			};

			return function(newHeight, elem, callbackFn) {
				finalHeight = newHeight;
				animate(elem, callbackFn);
			};
		})(),
		// function(newHeight, elem)
		fadeOut: (function() {

			var elemOpacity = 1;
			var timeoutInterval = 10;
			var _fadeOut = function(elem, callbackFn) {
				if (elemOpacity >= 0) {
					elemOpacity-= 0.2;
					elem.style.opacity = elemOpacity;

					setTimeout(function() {
						_fadeOut(elem, callbackFn);
					}, timeoutInterval);
				} else {
					if (typeof(callbackFn) == 'function') {
						callbackFn();
					}
				}
			};

			return function(elem, callbackFn) {
				elemOpacity = 1;
				_fadeOut(elem, callbackFn);
			};
		})(),
		// load images into an object
		loadImages: function() {
			this.images = [];

			var that = this;
			[].forEach.call(this.container.querySelectorAll('img'), function(img) {
				that.images.push({
					src: img.getAttribute('src'), 
					fullImageSrc: img.getAttribute('full-image-src'),
					width: img.getAttribute('width'),
					height: img.getAttribute('height'),
					title: img.getAttribute('title'),
					alt: img.getAttribute('alt'),
					ratio: parseInt(img.getAttribute('width')) / parseInt(img.getAttribute('height'))
				});
			});
		},
		// create initial DOM for the gallery
		buildDom: function() {
			if (this.container.classList.contains('bizon-initialized')) return;
			tools.empty(this.container);

			// big image
			this._bigImage = tools.createElement('img', {'src':this.images[this._currentImage].fullImageSrc});
			this._bigImageWrapper = tools.createElement('div', {'class':'bizon-image-wrapper'}, this._bigImage);
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-album-title'}, this.container.getAttribute('title') || 'Gallery'));
			this._bigImageTitle = tools.createElement('div', {'class': 'bizon-image-title'}, 'Image description goes here...');
			this._bigImageWrapper.appendChild(this._bigImageTitle);
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-arrow-right', 'title': 'Next image'}, '>'));
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-arrow-left', 'title': 'Previous image'}, '<'));
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-full-screen', 'title': 'Full screen'}, '#'));
			this._bigImageWrapper.appendChild(tools.createElement('div', {'class': 'bizon-close', 'title': 'Close'}, 'x'));

			// small images
			this._smallImagesWrapper = tools.createElement('div', {'class':'bizon-small-images-wrapper'});
			for (var i=0, totalImages=this.images.length; i<totalImages; i++) {
				var smallImageWrapper = tools.createElement('div', {'class':'bizon-small-image-wrapper'});
				if (i===0) smallImageWrapper.classList.add('bizon-active');

				var smallImage = tools.createElement('img', {
					'src': this.images[i].src,
					'class': 'bizon-small-image'
				});
				smallImageWrapper.appendChild(smallImage);
				this._smallImagesWrapper.appendChild(smallImageWrapper);
			}

			// add to container
			this.container.appendChild(this._bigImageWrapper);
			this.container.appendChild(this._smallImagesWrapper);

			this.setActiveImage();

			this.container.classList.add('bizon-initialized');
		},
		// set main image + scroll to thumb's place
		setActiveImage: function(imgNumber) {
			if (typeof(imgNumber) == 'undefined') imgNumber = this._currentImage; 
			this._currentImage = imgNumber;

			// remove `active` 
			var currentActiveElem = this._smallImagesWrapper.querySelector('.bizon-active');
			if (currentActiveElem) currentActiveElem.classList.remove('bizon-active');

			// mark relevant small image as active 
			var theSmallImage = this._smallImagesWrapper.querySelectorAll('div.bizon-small-image-wrapper')[imgNumber];
			if (theSmallImage) {
				theSmallImage.classList.add('bizon-active');
			}
			
			this._bigImage.src = this.images[imgNumber].fullImageSrc;

			// set image title
			this._bigImageTitle.textContent = this.images[this._currentImage].alt || this.images[this._currentImage].alt; 

			// fix small images scroll
			// if below
			var smallImageScrollTop = tools.getElementRelativeTop(theSmallImage);
			if (smallImageScrollTop + theSmallImage.clientHeight > this._smallImagesWrapper.scrollTop + this.container.clientHeight) {
				// this._smallImagesWrapper.scrollTop = theSmallImage.offsetTop;
				this.animateScrollTo(tools.getElementRelativeTop(theSmallImage), this._smallImagesWrapper);
			}
			// if above
			if (smallImageScrollTop < this._smallImagesWrapper.scrollTop) {
				// this._smallImagesWrapper.scrollTop = theSmallImage.offsetTop;
				this.animateScrollTo(smallImageScrollTop, this._smallImagesWrapper);
			}

			// hide arrows
			if (this._currentImage === 0) {
				this.container.getElementsByClassName('bizon-arrow-left')[0].style.visibility = 'hidden';
			} else {
				this.container.getElementsByClassName('bizon-arrow-left')[0].style.visibility = 'visible';
			}

			if (this._currentImage >= this.images.length - 1) {
				this.container.getElementsByClassName('bizon-arrow-right')[0].style.visibility = 'hidden';
			} else {
				this.container.getElementsByClassName('bizon-arrow-right')[0].style.visibility = 'visible';
			}

			this._bigImage.style.opacity = 1;
			this.fixSize();
		},
		// fix elements sized according to the image/screen
		fixSize: function() {
			var that = this;

			// get full width/height
			var containerWidth, containerHeight,
				bigImageWrapperWidth;
			
			if (this._fullScreenMode) {
				// set width and height as the size of the window
				containerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				containerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
				bigImageWrapperWidth = containerWidth - 20
				
				this.container.style.position = 'absolute';
				this.container.style.left = 0;
				this.container.style.top = 0;
				this.container.style.width = containerWidth + 'px';
				this.container.style.height = containerHeight + 'px';
				
			} else {
				// set width and height as the size of the container
				containerWidth = this._initialContainerWidth; // this.container.clientWidth;
				containerHeight = this._initialContainerHeight;
				bigImageWrapperWidth = Math.floor(containerWidth * 0.95) - 20

				this.container.style.position = 'relative';
				this.container.style.width = containerWidth + 'px';
				this.container.style.height = containerHeight + 'px';
			}
			
			// fix small/big images wrapper
			var smallImagesWrapper = Math.floor(containerWidth * 0.05);
			if (smallImagesWrapper < this._smallImagesWrapperMinWidth) {
				var deltaTillMinimum = this._smallImagesWrapperMinWidth - smallImagesWrapper;
				smallImagesWrapper = this._smallImagesWrapperMinWidth;
				bigImageWrapperWidth-= deltaTillMinimum;
			}

			var bigImageWrapperRatio = bigImageWrapperWidth / containerHeight;

			// fix big image wrapper
			this._bigImageWrapper.style.width = bigImageWrapperWidth + 'px';
			this._bigImageWrapper.style.height = containerHeight + 'px';

			this._smallImagesWrapper.style.width =  smallImagesWrapper+ 'px';
			this._smallImagesWrapper.style.height = containerHeight + 'px';
			this._smallImagesWrapper.style.marginLeft = '20px';
			if (this._fullScreenMode) {
				this._smallImagesWrapper.style.display = 'none';
			} else {
				this._smallImagesWrapper.style.display = 'block';
			}

			// fix small images
			[].forEach.call(this._smallImagesWrapper.querySelectorAll('.bizon-small-image-wrapper'), function(elem) {
				elem.style.padding = that._smallImagesPadding + 'px';
				elem.firstChild.style.width = (smallImagesWrapper - (that._smallImagesPadding * 2) - 17) + 'px'; // 17 - scroll width
			});

			// fix main image
			var currentImage = this.images[this._currentImage];
			var bigImageRatio = currentImage.ratio;
			if (bigImageRatio > bigImageWrapperRatio) {
				// set max width
				this._bigImage.style.width = bigImageWrapperWidth + 'px';
				var bigImageHeight = Math.floor(bigImageWrapperWidth / bigImageRatio);
				this._bigImage.style.height = bigImageHeight + 'px';

				// fix top position
				var imgTop = Math.floor((containerHeight - bigImageHeight) / 2);
				this._bigImage.style.top = imgTop + 'px';
				this._bigImage.style.left = 0;
			} else {
				// set max height
				var bigImageWidth = Math.floor(containerHeight * bigImageRatio);
				this._bigImage.style.width = bigImageWidth + 'px';
				this._bigImage.style.height = containerHeight + 'px';

				// fix left position
				var imgLeft = Math.floor((bigImageWrapperWidth - bigImageWidth) / 2);
				this._bigImage.style.top = 0;
				this._bigImage.style.left = imgLeft + 'px';
			}

		},
		// go to the next image (if there is)
		nextImage: function() {
			if (this._currentImage + 1 < this.images.length) {
				this._currentImage++;
				var that = this;
				this.fadeOut(this._bigImage, function() {
					that.setActiveImage();
				});
			}
		},
		// go to the previous image (if there is)
		prevImage: function() {
			if (this._currentImage > 0) {
				this._currentImage--;
				var that = this;
				this.fadeOut(this._bigImage, function() {
					that.setActiveImage();
				});
			} 
		},
		// close (slide-up) the gallery (DOM is not removed, it becomes height 0)
		close: function() {
			var that = this;
			this.animateHeightTo(0, this.container, function() {
				that.container.parentNode.removeChild(that.container);
			});
			
			this._trigger('close');
		},
		// bind gallery events
		bindEvents: function() {
			var that = this;

			// click small image (wrapper)
			[].forEach.call(this.container.querySelectorAll('.bizon-small-image-wrapper'), function(imgWrapper) {
				imgWrapper.addEventListener('click', function() {
					var elem = imgWrapper;
					if (elem.classList.contains('bizon-small-image-wrapper')) {
						var imgNumber = tools.getElementIndex(elem);
						that.setActiveImage(imgNumber);
					}
				});
			});

			// click "next"
			that.container.getElementsByClassName('bizon-arrow-right')[0].addEventListener('click', function() {
				that.nextImage();
			});

			// click "prev"
			that.container.querySelector('.bizon-arrow-left').addEventListener('click', function() {
				that.prevImage();
			});

			// click "fullscreen"
			that.container.querySelector('.bizon-full-screen').addEventListener('click', function() {
				that._fullScreenMode = !that._fullScreenMode;
				that.setActiveImage();
			});
			
			var timer = null;
			window.addEventListener('keydown', function(evt) {
				if (timer) clearTimeout(timer);
				// check press button "right"
				if (evt.keyCode == 39 || evt.keyCode == 40) {
					timer = setTimeout(function() {
						that.nextImage();
					}, 10);
				}
				
				// check press button "left"
				if (evt.keyCode == 37 || evt.keyCode == 38) {
					timer = setTimeout(function() {
						that.prevImage();
					}, 10);
				}
				
			});
			
			// click on main image 
			that.container.querySelector('.bizon-image-wrapper img').addEventListener('click', function() {
				that.nextImage();
			});

			// click on "close"
			that.container.querySelector('.bizon-close').addEventListener('click', function() {
				that.close();
			});


		}
	};

	// define main bizon function
	window.bizon = function(container, options) {
		return new bizonObj(container, options);
	};

	// initialize bizon galleries - all elements with class "bizon"
	document.addEventListener('DOMContentLoaded', function() {
		[].forEach.call(document.querySelectorAll('.bizon'), function(bizonContainer) {
			window.bizon(bizonContainer, {'fullScreen': true});
		});
	}, false);

})();
