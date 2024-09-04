;(function() {

	class Bizon {
		// the default options. Can be overridden by the provided "params" to the constructor
		#defaultOptions = {
			title: null,
			images: [],
            callbacks: {
                onClose: null,
            },
		}

		// slider options - combined, default and provided by the user
		#options = {};

		// the slider element
		#bizonEl = null;
		#mainImageWrapper = null; // the wrapping <div> of the main <img> (or <video>)
		#mainImageEl = null;
		#mainVideoEl = null;
		#rightButtonEl = null;
		#leftButtonEl = null;
		#closeButtonEl = null;

		#currentImageIndex = 0;

		#bizonHtml = [
		`<div id="bizon-slider" class="prevent-select">`,
			`<div id="bizon-main-image"></div>`,
			`<div id="bizon-thumbnails"></div>`,
		`</div>`].join('');

		constructor(options) {
			// build the object options
			this.#options = {...this.#defaultOptions, ...options};
		}

		// show the slider
		show() {
			// check that images are defined
			if (this.#options.images.length === 0) {
				console.warn("Bizon: images are not provided");
				return;

			// allow gallery only for images. For videos, only one item is allowed
			} else if (this.#options.images.length > 1 &&
				this.#options.images.some(imgObj => this.#isVideo(imgObj))) {
				console.error("Bizon gallery does not support gallery for video files")
				return;
			}

			this.#initBizonEl();
			this.#initMainImage();
			this.#initThumbnails();
			this.#initControls();

			this.#setMainImage(this.#currentImageIndex);

			this.#bindEvents();
		}

		#isVideo(imageObj) {
			return (typeof(imageObj.type) == 'string' && imageObj.type.toLowerCase() == 'video') ||
				imageObj.src.match(/\.(mp4|wmv|mpg|mpeg)$/g);
		}

		hide() {
			this.#unbindEvents();

			this.#bizonEl.remove();

            // call the onClose  callback
            if (typeof(this.#options.callbacks.onClose) == 'function') {
                this.#options.callbacks.onClose();
            }
		}


		// get/create the bizon element
		#initBizonEl() {
			// clear the previous slider if exists
			if (this.#bizonEl) {
				this.#bizonEl.remove();
				this.#bizonEl = null;
			}

			// use wrapper to create the new slider element.
			const bizonWrapper = document.createElement('div');
			bizonWrapper.innerHTML = this.#bizonHtml;
			this.#bizonEl = bizonWrapper.firstChild;
			this.#bizonEl.parentNode.removeChild(this.#bizonEl);
			bizonWrapper.remove();

			if (this.#options.images.length <= 1) {
				this.#bizonEl.classList.add('bizon-single-image');
			}

			document.body.appendChild(this.#bizonEl);
		}

		// fill the main image
		#initMainImage() {
			this.#mainImageWrapper = document.createElement('div');
			this.#mainImageWrapper.id = 'bizon-main-image-wrapper';

			this.#mainImageEl = document.createElement('img');

			this.#bizonEl.querySelector('#bizon-main-image').appendChild(this.#mainImageWrapper);
		}

		// fill the thumbnails section
		#initThumbnails() {
			if (this.#options.images.length <= 1) {
				return;
			}

			const that = this;
			this.#options.images.forEach((img, idx) => {
				const tagName = typeof(img.type) == "string" && img.type.toLowerCase() == 'video' ? 'video' : 'img';
				let imgEl =  document.createElement(tagName);
				imgEl.src = img.thumb || img.src;
				if (img.caption) {
					imgEl.setAttribute('alt', img.caption);
					imgEl.setAttribute('title', img.caption);
				}

				let wrapperEl = document.createElement('div');
				wrapperEl.classList.add('bizon-thumb-wrapper');
				wrapperEl.setAttribute('thumb-index', idx);
				if (idx == 0) {
					wrapperEl.classList.add('bizon-thumb-wrapper-active');
				}
				wrapperEl.appendChild(imgEl);
				wrapperEl.onclick = e => {
					this.#setMainImage(idx);
				}

				that.#bizonEl.querySelector('#bizon-thumbnails').appendChild(wrapperEl);
			});
		}

		// update the <img> or <video> element
		#setMainImageEl() {
			// check if the element is image or video
			const currentImageObj = this.#options.images[this.#currentImageIndex];
			const isVideo = (typeof(currentImageObj.type) == 'string' && currentImageObj.type.toLowerCase() == 'video') ||
				currentImageObj.src.match(/\.(mp4|wmv|mpg|mpeg)$/g);

			// clear the current element
			if (this.#mainImageWrapper.firstChild) {
				this.#mainImageWrapper.removeChild(this.#mainImageWrapper.firstChild);
			}

			// create the main image or video
			let mainEl;
			if (isVideo) {
				this.#mainVideoEl = document.createElement('video');
				this.#mainVideoEl.autoplay = true;
				this.#mainVideoEl.playsinline = true;
				this.#mainVideoEl.muted = false;
				this.#mainVideoEl.loop = true;
				this.#mainVideoEl.controls = true;
				this.#mainVideoEl.controlsList = "nodownload";
				this.#mainVideoEl.oncontextmenu = "return false;";
				//this.#mainVideoEl.load();
				//this.#mainVideoEl.play();
				mainEl = this.#mainVideoEl;
			} else {
				this.#mainVideoEl = document.createElement('img');
				mainEl = this.#mainImageEl;
			}

			mainEl.setAttribute('alt', (currentImageObj.caption || ""));
			mainEl.setAttribute('title', (currentImageObj.caption || ""));
			mainEl.src = currentImageObj.src;

			// set the dimensions
			setTimeout(() => {
				const wrapperWidth = this.#mainImageWrapper.clientWidth;
				const wrapperHeight = this.#mainImageWrapper.clientHeight;
				const wrapperRatio = (1.0 * wrapperWidth) / wrapperHeight;

				const mediaRatio = (1.0 * currentImageObj.width) / currentImageObj.height;

				if (wrapperRatio > mediaRatio) {
					mainEl.style.height = wrapperHeight + 'px';
					mainEl.style.width = 'auto';
				} else {
					mainEl.style.width = wrapperWidth + 'px';
					mainEl.style.height = 'auto';
				}
			});
			this.#mainImageWrapper.appendChild(mainEl);
		}

		// set the image and process all the events: mark thumb, hide arrows if needed.
		#setMainImage(idx) {
			// check if out of range
			if (idx >= this.#options.images.length || idx < 0) {
				return;
			}

			this.#currentImageIndex = idx;

			// update the <img> or <video> element
			this.#setMainImageEl()

			this.#setActiveThumbnail();

			this.#updateControlsVisibility();
		}

		#setActiveThumbnail() {
			if (this.#options.images.length <= 1) {
				return;
			}

			const idx = this.#currentImageIndex;

			// remove current active thumb
			[].forEach.call(this.#bizonEl.querySelectorAll('.bizon-thumb-wrapper-active'), el => {
				el.classList.remove('bizon-thumb-wrapper-active');
			});

			const thumbs = this.#bizonEl.querySelector('#bizon-thumbnails').childNodes;
			thumbs[idx].classList.add('bizon-thumb-wrapper-active');
		}

		// init the "right", "left" and "close" buttons
		#initControls() {
			const mainImageSection = this.#bizonEl.querySelector('#bizon-main-image');

			// the areas
			const moveLeftSection = document.createElement('div');
			moveLeftSection.classList.add('bizon-move-section');
			moveLeftSection.classList.add('bizon-move-section-left');
			const moveRightSection = document.createElement('div');
			moveRightSection.classList.add('bizon-move-section');
			moveRightSection.classList.add('bizon-move-section-right');

			// the arrows
			this.#leftButtonEl = document.createElement('div');
			this.#leftButtonEl.classList.add('bizon-move-arrow');
			this.#leftButtonEl.classList.add('bizon-move-arrow-left');
			this.#leftButtonEl.title = "Previous";
			this.#rightButtonEl = document.createElement('div');
			this.#rightButtonEl.classList.add('bizon-move-arrow');
			this.#rightButtonEl.classList.add('bizon-move-arrow-right');
			this.#rightButtonEl.title = "Next";

			// the close button
			this.#closeButtonEl = document.createElement('div');
			this.#closeButtonEl.classList.add('bizon-close-button');
			this.#closeButtonEl.title = "Close";

			// add the elements to the panels
			moveLeftSection.appendChild(this.#leftButtonEl);
			moveRightSection.appendChild(this.#rightButtonEl);
			moveRightSection.appendChild(this.#closeButtonEl);

			// add sections to the main image section
			mainImageSection.appendChild(moveLeftSection);
			mainImageSection.appendChild(moveRightSection);
		}

		// hide right on last image, or left on forst image
		#updateControlsVisibility() {
			// disable "next" on last item
			this.#bizonEl.querySelector('.bizon-move-arrow-right').style.display =
				(this.#currentImageIndex >= this.#options.images.length - 1 ||
					this.#options.images.length <= 1) ? 'none' : 'initial';
			this.#bizonEl.querySelector('.bizon-move-section-left').style.visibility =
				(this.#currentImageIndex <= 0) ? 'hidden' : 'visible';
		}

		// bind keyboard press and buttons' click
		#bindEvents() {
			this.#rightButtonEl.parentNode.onclick = e => {
				if (e.target == this.#closeButtonEl) {
					this.hide();
					return;
				}

				this.#setMainImage(this.#currentImageIndex + 1);
			};
			this.#leftButtonEl.parentNode.onclick = e => {
				this.#setMainImage(this.#currentImageIndex - 1);
			};

			this.#bizonEl.querySelector('#bizon-main-image-wrapper').onclick = e => {
				if (e.target == this.#bizonEl.querySelector('#bizon-main-image-wrapper')) {
					this.hide();
				}
			}

			window.__bizon_keydown_callback = e => {
				if (e.key === 'Escape') {
					this.hide();
				}

				if (e.key === 'ArrowRight') {
					this.#setMainImage(this.#currentImageIndex + 1);
				}

				if (e.key === 'ArrowLeft') {
					this.#setMainImage(this.#currentImageIndex - 1);
				}
			}

			window.addEventListener('keydown', window.__bizon_keydown_callback, false);
		}

		#unbindEvents() {
			window.removeEventListener('keydown', window.__bizon_keydown_callback);
		}
	}

	window.Bizon = Bizon;

}());
