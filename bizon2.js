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

		// slider styles
		#bizonCss = `
		#bizon-slider {
			
		}
		`.replace(/([\,\{\};]+)\s+/g, "$1"); // remove whitesoaces

		#bizonHtml = `
		<div id="bizon-slider">
			<div id="bizon-main"></div>
			<div id="slider-thumbnails"></div>
		</div>`.replace(/\s+</g, '<'); // remove whitespaces

		constructor(options) {
			// build the object options
			this.#options = {...this.#defaultOptions, ...options};

			// add bizon styles
			this.#addStyleSection();
		}

		// show the slider
		show() {
			this.#initBizonEl();

			this.#initThumbnails();
		}


		// add style section to the <head> element
		#addStyleSection() {
			// check that the CSS appears on the page
			if (!document.getElementById('bizon-style')) {
				const bizonStyle = document.createElement('style');
				bizonStyle.id = "bizon-style";
				bizonStyle.innerText = this.#bizonCss;

				document.head.appendChild(bizonStyle);
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

			console.log('bizonEl', this.#bizonEl);
			document.body.appendChild(this.#bizonEl);
		}

		// fill the main image
		#initMainImage() {
			const mainImage = this.#options.images[0];
			let mainImageWrapper = document.createElement('div');
			mainImageWrapper.classList.add('bizon-main-image-wrapper');

			let mainImageEl = document.createElement('img');
			mainImageEl.src = mainImage.src; // set the first image by default
			imgEl.setAttribute('alt', mainImage.caption);
			imgEl.setAttribute('title', mainImage.caption);
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

				console.log('el2', that.#bizonEl);
				that.#bizonEl.querySelector('#slider-thumbnails').appendChild(wrapperEl);
			});
		}
	}

	window.Bizon = Bizon;

}());
