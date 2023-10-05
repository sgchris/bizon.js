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

		#bizonHtml = `
		<div id="bizon-slider">
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

			this.#bindEvents();
		}

		hide() {
			this.#unbindEvents();
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
			const mainImage = this.#options.images[0];
			let mainImageWrapper = document.createElement('div');
			mainImageWrapper.id = 'bizon-main-image-wrapper';

			let mainImageEl = document.createElement('img');
			mainImageEl.src = mainImage.src; // set the first image by default
			mainImageEl.setAttribute('alt', mainImage.caption);
			mainImageEl.setAttribute('title', mainImage.caption);

			mainImageWrapper.appendChild(mainImageEl);
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
				if (idx == 0) {
					wrapperEl.classList.add('bizon-thumb-wrapper-active');
				}
				wrapperEl.appendChild(imgEl);

				that.#bizonEl.querySelector('#bizon-thumbnails').appendChild(wrapperEl);
			});
		}

		// init the "right", "left" and "close" buttons
		#initControls() {
			// the areas
			const moveLeftSection = document.createElement('div');
			moveLeftSection.classList.add('bizon-move-section');
			moveLeftSection.classList.add('bizon-move-section-left');
			const moveRightSection = document.createElement('div');
			moveRightSection.classList.add('bizon-move-section');
			moveRightSection.classList.add('bizon-move-section-right');

			// the arrows
			const moveLeftArrow = document.createElement('div');
			moveLeftArrow.classList.add('bizon-move-arrow');
			moveLeftArrow.classList.add('bizon-move-arrow-left');
			const moveRightArrow = document.createElement('div');
			moveRightArrow.classList.add('bizon-move-arrow');
			moveRightArrow.classList.add('bizon-move-arrow-right');

			moveLeftSection.appendChild(moveLeftArrow);
			moveRightSection.appendChild(moveRightArrow);

			this.#bizonEl.querySelector('#bizon-main-image').appendChild(moveLeftSection);
			this.#bizonEl.querySelector('#bizon-main-image').appendChild(moveRightSection);
		}

		#bindEvents() {
		}

		#unbindEvents() {
		}
	}

	window.Bizon = Bizon;

}());
