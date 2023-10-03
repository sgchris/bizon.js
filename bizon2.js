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
			this.#options.images.forEach(img => {
				let imgEl = document.createElement('img');
				imgEl.src = img.thumb || img.src;
				imgEl.setAttribute('alt', img.caption);
				imgEl.setAttribute('title', img.caption);

				let wrapperEl = document.createElement('div');
				wrapperEl.classList.add('bizon-thumb-wrapper');
				wrapperEl.appendChild(imgEl);

				that.#bizonEl.querySelector('#bizon-thumbnails').appendChild(wrapperEl);
			});
		}
	}

	window.Bizon = Bizon;

}());
