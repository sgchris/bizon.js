;(function() {

	class Bizon {
		// the default options. Can be overridden by the provided "params" to the constructor
		#defaultOptions = {
			title: null,
			images: [],
		}

		// slider options - combined, default and provided by the user
		#options = {};

		// the slider element
		#bizonEl = null;
		#mainImageEl = null;
		#rightButtonEl = null;
		#leftButtonEl = null;
		#closeButtonEl = null;

		#currentImageIndex = 0;

		#bizonHtml = `
		<div id="bizon-slider" class="prevent-select">
			<div id="bizon-main-image"></div>
			<div id="bizon-thumbnails"></div>
		</div>`.replace(/\s+</g, '<'); // remove whitespaces

		constructor(options) {
			// build the object options
			this.#options = {...this.#defaultOptions, ...options};
		}

		// show the slider
		show() {
			if (this.#options.images.length === 0) {
				console.error("Bizon: images are not provided");
				return;
			}

			this.#initBizonEl();
			this.#initMainImage();
			this.#initThumbnails();
			this.#initControls();

			this.#setMainImage(this.#currentImageIndex);

			this.#bindEvents();
		}

		hide() {
			this.#unbindEvents();

			this.#bizonEl.remove();
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

			document.body.appendChild(this.#bizonEl);
		}

		// fill the main image
		#initMainImage() {
			let mainImageWrapper = document.createElement('div');
			mainImageWrapper.id = 'bizon-main-image-wrapper';

			this.#mainImageEl = document.createElement('img');

			mainImageWrapper.appendChild(this.#mainImageEl);
			this.#bizonEl.querySelector('#bizon-main-image').appendChild(mainImageWrapper);
		}

		// fill the thumbnails section
		#initThumbnails() {
			const that = this;
			this.#options.images.forEach((img, idx) => {
				let imgEl = document.createElement('img');
				imgEl.src = img.thumb || img.src;
				imgEl.setAttribute('alt', img.caption);
				imgEl.setAttribute('title', img.caption);

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

		// set the image and process all the events: mark thumb, hide arrows if needed.
		#setMainImage(idx) {
			// check if in range
			idx = idx >= this.#options.images.length ? this.#options.images.length - 1 : idx;
			idx = idx < 0 ? 0 : idx;

			this.#currentImageIndex = idx;
			const currentImageObj = this.#options.images[this.#currentImageIndex];

			this.#mainImageEl.src = currentImageObj.src; // set the first image by default
			this.#mainImageEl.setAttribute('alt', currentImageObj.caption);
			this.#mainImageEl.setAttribute('title', currentImageObj.caption);

			this.#setActiveThumbnail();

			this.#updateControlsVisibility();
		}

		#setActiveThumbnail() {
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
			this.#bizonEl.querySelector('.bizon-move-section-right').style.visibility = 
				(this.#currentImageIndex >= this.#options.images.length - 1) ? 'hidden' : 'visible';
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

			window.__bizon_keydown_callback = e => {
				console.log('e.key', e.key);
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
