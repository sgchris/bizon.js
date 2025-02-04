class BizonGallery {
    #defaultOptions = {
        title: null,
        images: [],
        callbacks: {
            onClose: null,
        },
    };

    #options = {};
    #bizonEl = null;
    #mainImageWrapper = null;
    #mainImageEl = null;
    #mainVideoEl = null;
    #currentImageIndex = 0;

    constructor(options = {}) {
        this.#options = { ...this.#defaultOptions, ...options };

        if (!Array.isArray(this.#options.images) || this.#options.images.length === 0) {
            console.warn("BizonGallery: No images provided.");
            return;
        }
    }

    show() {
        if (this.#options.images.length > 1 && this.#options.images.some(img => this.#isVideo(img))) {
            console.error("BizonGallery does not support multiple videos.");
            return;
        }

        this.#createSlider();
        this.#setMainImage(this.#currentImageIndex);
        this.#bindEvents();
    }

    hide() {
        this.#unbindEvents();
        this.#bizonEl?.remove();
        this.#options.callbacks?.onClose?.();
    }

    #isVideo(imageObj) {
        return imageObj?.type?.toLowerCase() === 'video' || /\.(mp4|wmv|mpg|mpeg)$/i.test(imageObj?.src);
    }

    #createSlider() {
        this.#bizonEl = document.createElement("div");
        this.#bizonEl.id = "bizon-slider";
        this.#bizonEl.classList.add("prevent-select");

        const mainImageContainer = document.createElement("div");
        mainImageContainer.id = "bizon-main-image";

        this.#mainImageWrapper = document.createElement("div");
        this.#mainImageWrapper.id = "bizon-main-image-wrapper";
        mainImageContainer.appendChild(this.#mainImageWrapper);

        const thumbnailsContainer = document.createElement("div");
        thumbnailsContainer.id = "bizon-thumbnails";

        this.#options.images.length > 1 && this.#createThumbnails(thumbnailsContainer);
        
        this.#bizonEl.append(mainImageContainer, thumbnailsContainer);
        document.body.appendChild(this.#bizonEl);
    }

    #createThumbnails(container) {
        this.#options.images.forEach((img, idx) => {
            const thumbEl = document.createElement(this.#isVideo(img) ? "video" : "img");
            thumbEl.src = img.thumb || img.src;
            thumbEl.alt = img.caption || "";
            thumbEl.title = img.caption || "";

            const wrapper = document.createElement("div");
            wrapper.classList.add("bizon-thumb-wrapper");
            wrapper.dataset.index = idx;
            if (idx === 0) wrapper.classList.add("bizon-thumb-wrapper-active");

            wrapper.appendChild(thumbEl);
            wrapper.addEventListener("click", () => this.#setMainImage(idx));
            container.appendChild(wrapper);
        });
    }

    #setMainImage(index) {
        if (index < 0 || index >= this.#options.images.length) return;

        this.#currentImageIndex = index;
        const currentImageObj = this.#options.images[index];

        this.#mainImageWrapper.innerHTML = "";
        let mainEl;

        if (this.#isVideo(currentImageObj)) {
            mainEl = document.createElement("video");
            Object.assign(mainEl, {
                src: currentImageObj.src,
                autoplay: true,
                playsInline: true,
                loop: true,
                controls: true,
                controlsList: "nodownload",
                oncontextmenu: () => false
            });
        } else {
            mainEl = document.createElement("img");
            mainEl.src = currentImageObj.src;
        }

        mainEl.alt = currentImageObj.caption || "";
        mainEl.title = currentImageObj.caption || "";

        this.#mainImageWrapper.appendChild(mainEl);
        this.#updateThumbnails();
    }

    #updateThumbnails() {
        document.querySelectorAll(".bizon-thumb-wrapper-active").forEach(el =>
            el.classList.remove("bizon-thumb-wrapper-active")
        );

        const activeThumb = document.querySelector(`[data-index="${this.#currentImageIndex}"]`);
        activeThumb?.classList.add("bizon-thumb-wrapper-active");
    }

    #bindEvents() {
        document.addEventListener("keydown", this.#handleKeyDown);
    }

    #unbindEvents() {
        document.removeEventListener("keydown", this.#handleKeyDown);
    }

    #handleKeyDown = (event) => {
        if (event.key === "Escape") {
            this.hide();
        } else if (event.key === "ArrowLeft") {
            this.#setMainImage(this.#currentImageIndex - 1);
        } else if (event.key === "ArrowRight") {
            this.#setMainImage(this.#currentImageIndex + 1);
        }
    };
}
