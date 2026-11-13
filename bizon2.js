class Bizon {
    // The currently open instance (only one lightbox can be open at a time)
    static activeInstance = null;

    #defaultOptions = {
        title: null,
        images: [],
        labels: {
            close: "Close",
            previous: "Previous",
            next: "Next",
            error: "This media could not be loaded.",
        },
        callbacks: {
            onClose: null,
        },
    };

    #options = {};

    // DOM elements
    #bizonEl = null;
    #stageEl = null;
    #wrapperEl = null;
    #boxEl = null;
    #mediaEl = null;
    #spinnerEl = null;
    #errorEl = null;
    #captionEl = null;
    #thumbsEl = null;
    #prevBtn = null;
    #nextBtn = null;
    #closeBtn = null;

    // state
    #currentImageIndex = 0;
    #dims = { w: 0, h: 0 };
    #knownDims = false;
    #renderToken = 0;
    #isOpen = false;
    #historyPushed = false;
    #previouslyFocused = null;
    #resizeRaf = 0;
    #preloaded = [];

    constructor(options = {}) {
        const opts = options || {};
        const defaults = this.#defaultOptions;
        this.#options = {
            ...defaults,
            ...opts,
            labels: { ...defaults.labels, ...(opts.labels || {}) },
            callbacks: { ...defaults.callbacks, ...(opts.callbacks || {}) },
        };

        if (!Array.isArray(this.#options.images) || this.#options.images.length === 0) {
            console.warn("BizonGallery: No images provided.");
            return;
        }
    }

    get isOpen() {
        return this.#isOpen;
    }

    show() {
        if (this.#isOpen || Bizon.activeInstance) return;
        if (!Array.isArray(this.#options.images) || this.#options.images.length === 0) return;

        Bizon.activeInstance = this;
        this.#isOpen = true;
        this.#previouslyFocused = document.activeElement;

        this.#createSlider();
        document.documentElement.classList.add("bizon-open");
        this.#setMainImage(this.#currentImageIndex);
        this.#bindEvents();
        this.#pushHistory();

        try {
            this.#closeBtn.focus({ preventScroll: true });
        } catch (e) { /* ignore */ }
    }

    hide() {
        if (!this.#isOpen) return;
        this.#isOpen = false;

        this.#unbindEvents();
        this.#teardownMedia();
        this.#preloaded = [];
        this.#bizonEl?.remove();
        this.#bizonEl = null;
        document.documentElement.classList.remove("bizon-open");

        // the history entry, that was added in show(), is not needed anymore
        if (this.#historyPushed) {
            this.#historyPushed = false;
            try {
                window.history.back();
            } catch (e) { /* ignore */ }
        }

        Bizon.activeInstance = null;

        try {
            this.#previouslyFocused?.focus?.({ preventScroll: true });
        } catch (e) { /* ignore */ }
        this.#previouslyFocused = null;

        this.#options.callbacks?.onClose?.();
    }

    #isVideo(imageObj) {
        if (imageObj?.type?.toLowerCase() === "video") {
            return true;
        }
        const src = String(imageObj?.src || "").split("?")[0];
        return /\.(mp4|m4v|mov|webm|wmv|mpg|mpeg)$/i.test(src);
    }

    #createButton(className, label, svgInner) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = className;
        btn.setAttribute("aria-label", label);
        btn.title = label;
        btn.innerHTML =
            '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' +
            'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
            svgInner + "</svg>";
        return btn;
    }

    #createSlider() {
        const images = this.#options.images;
        const labels = this.#options.labels;
        const isSingle = images.length === 1;

        this.#bizonEl = document.createElement("div");
        this.#bizonEl.id = "bizon-slider";
        this.#bizonEl.classList.add("prevent-select");
        this.#bizonEl.setAttribute("role", "dialog");
        this.#bizonEl.setAttribute("aria-modal", "true");
        this.#bizonEl.setAttribute("aria-label", this.#options.title || images[0]?.alt || "Gallery");
        this.#bizonEl.setAttribute("dir", "ltr");
        if (isSingle) {
            this.#bizonEl.classList.add("bizon-single-image");
        }

        // the stage: the media + arrows + close button
        this.#stageEl = document.createElement("div");
        this.#stageEl.id = "bizon-main-image";

        this.#wrapperEl = document.createElement("div");
        this.#wrapperEl.id = "bizon-main-image-wrapper";
        this.#stageEl.appendChild(this.#wrapperEl);

        this.#spinnerEl = document.createElement("div");
        this.#spinnerEl.className = "bizon-spinner";
        this.#spinnerEl.setAttribute("aria-hidden", "true");
        this.#spinnerEl.hidden = true;
        this.#stageEl.appendChild(this.#spinnerEl);

        this.#errorEl = document.createElement("div");
        this.#errorEl.className = "bizon-error";
        this.#errorEl.setAttribute("role", "alert");
        this.#errorEl.textContent = labels.error;
        this.#errorEl.hidden = true;
        this.#stageEl.appendChild(this.#errorEl);

        // navigation arrows - only when there is more than one item
        if (!isSingle) {
            this.#prevBtn = this.#createButton(
                "bizon-arrow bizon-arrow-left", labels.previous, '<polyline points="15 5 8 12 15 19"></polyline>'
            );
            this.#prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.#setMainImage(this.#currentImageIndex - 1);
            });

            this.#nextBtn = this.#createButton(
                "bizon-arrow bizon-arrow-right", labels.next, '<polyline points="9 5 16 12 9 19"></polyline>'
            );
            this.#nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.#setMainImage(this.#currentImageIndex + 1);
            });

            this.#stageEl.appendChild(this.#prevBtn);
            this.#stageEl.appendChild(this.#nextBtn);
        }

        this.#closeBtn = this.#createButton(
            "bizon-close", labels.close, '<line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line>'
        );
        this.#closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hide();
        });
        this.#stageEl.appendChild(this.#closeBtn);

        // click on the empty area closes. Click on an image moves to the previous / next one
        this.#stageEl.addEventListener("click", (e) => {
            if (e.target === this.#wrapperEl || e.target === this.#stageEl) {
                this.hide();
                return;
            }

            // clicks on a video belong to the video controls
            if (!isSingle && e.target.tagName === "IMG" && e.target.classList.contains("bizon-media")) {
                const rect = e.target.getBoundingClientRect();
                if (e.clientX > rect.left + rect.width / 2) {
                    this.#setMainImage(this.#currentImageIndex + 1);
                } else {
                    this.#setMainImage(this.#currentImageIndex - 1);
                }
            }
        });

        this.#captionEl = document.createElement("div");
        this.#captionEl.className = "bizon-caption";
        this.#captionEl.setAttribute("dir", "auto");
        this.#captionEl.hidden = true;

        this.#thumbsEl = document.createElement("div");
        this.#thumbsEl.id = "bizon-thumbnails";
        if (!isSingle) {
            this.#createThumbnails(this.#thumbsEl);
        }

        this.#bizonEl.append(this.#stageEl, this.#captionEl, this.#thumbsEl);
        document.body.appendChild(this.#bizonEl);
    }

    #createThumbnails(container) {
        const total = this.#options.images.length;

        this.#options.images.forEach((img, idx) => {
            const isVideo = this.#isVideo(img);

            const wrapper = document.createElement("button");
            wrapper.type = "button";
            wrapper.className = "bizon-thumb-wrapper";
            wrapper.dataset.index = idx;
            wrapper.setAttribute("aria-label", img.alt || img.caption || (idx + 1) + " / " + total);

            // a video without a thumbnail image has no usable <img> source
            if (img.thumb || !isVideo) {
                const thumbEl = document.createElement("img");
                thumbEl.src = img.thumb || img.src;
                thumbEl.alt = "";
                thumbEl.draggable = false;
                wrapper.appendChild(thumbEl);
            }

            if (isVideo) {
                const play = document.createElement("span");
                play.className = "bizon-thumb-play";
                play.setAttribute("aria-hidden", "true");
                wrapper.appendChild(play);
            }

            wrapper.addEventListener("click", () => this.#setMainImage(idx));
            container.appendChild(wrapper);
        });
    }

    // stop the current media (and its download) and remove it
    #teardownMedia() {
        if (this.#mediaEl && this.#mediaEl.tagName === "VIDEO") {
            try {
                this.#mediaEl.pause();
                this.#mediaEl.removeAttribute("src");
                this.#mediaEl.load();
            } catch (e) { /* ignore */ }
        }
        this.#mediaEl = null;
        this.#boxEl?.remove();
        this.#boxEl = null;
    }

    #setSpinner(visible) {
        if (this.#spinnerEl) {
            this.#spinnerEl.hidden = !visible;
        }
    }

    #showError() {
        this.#setSpinner(false);
        if (this.#errorEl) {
            this.#errorEl.hidden = false;
        }
    }

    #setMainImage(index) {
        if (index < 0 || index >= this.#options.images.length) return;

        this.#currentImageIndex = index;
        const currentImageObj = this.#options.images[index];

        this.#teardownMedia();
        const token = ++this.#renderToken;
        const isStale = () => token !== this.#renderToken || !this.#isOpen;

        this.#errorEl.hidden = true;
        this.#setSpinner(true);

        // the known dimensions are used to size the box immediately (no jump when the media loads)
        const w = Number(currentImageObj.width) || 0;
        const h = Number(currentImageObj.height) || 0;
        this.#knownDims = w > 0 && h > 0;
        this.#dims = { w, h };

        this.#boxEl = document.createElement("div");
        this.#boxEl.className = "bizon-media-box";
        const alt = currentImageObj.alt || currentImageObj.caption || "";

        if (this.#isVideo(currentImageObj)) {
            const video = document.createElement("video");
            video.className = "bizon-media";
            video.controls = true;
            video.loop = true;
            video.playsInline = true;
            video.setAttribute("playsinline", "");
            video.preload = "auto";
            video.setAttribute("controlslist", "nodownload");
            video.setAttribute("aria-label", alt);
            video.title = alt;
            if (currentImageObj.thumb) {
                video.poster = currentImageObj.thumb;
            }
            video.addEventListener("contextmenu", (e) => e.preventDefault());
            video.addEventListener("loadedmetadata", () => {
                if (isStale()) return;
                this.#onNaturalSize(video.videoWidth, video.videoHeight);
            });
            ["loadeddata", "playing", "canplay"].forEach((evtName) => {
                video.addEventListener(evtName, () => {
                    if (!isStale()) this.#setSpinner(false);
                });
            });
            video.addEventListener("waiting", () => {
                if (!isStale()) this.#setSpinner(true);
            });
            video.addEventListener("error", () => {
                if (!isStale()) this.#showError();
            });

            this.#mediaEl = video;
            this.#boxEl.appendChild(video);
            this.#wrapperEl.appendChild(this.#boxEl);
            this.#fit();

            video.src = currentImageObj.src;
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch((err) => {
                    // autoplay with sound can be blocked - retry muted
                    if (!isStale() && err && err.name === "NotAllowedError") {
                        video.muted = true;
                        const retry = video.play();
                        retry && retry.catch && retry.catch(() => {});
                    }
                });
            }
        } else {
            // the small thumbnail is shown immediately, the sharp image fades in when it is loaded
            let placeholder = null;
            if (currentImageObj.thumb && currentImageObj.thumb !== currentImageObj.src) {
                placeholder = document.createElement("img");
                placeholder.className = "bizon-placeholder";
                placeholder.alt = "";
                placeholder.setAttribute("aria-hidden", "true");
                placeholder.src = currentImageObj.thumb;
                this.#boxEl.appendChild(placeholder);
            }

            const img = document.createElement("img");
            img.className = "bizon-media";
            img.alt = alt;
            img.draggable = false;
            img.addEventListener("load", () => {
                if (isStale()) return;
                this.#onNaturalSize(img.naturalWidth, img.naturalHeight);
                img.classList.add("bizon-loaded");
                placeholder?.remove();
                this.#setSpinner(false);
                this.#preloadNeighbours();
            });
            img.addEventListener("error", () => {
                if (!isStale()) this.#showError();
            });

            this.#mediaEl = img;
            this.#boxEl.appendChild(img);
            this.#wrapperEl.appendChild(this.#boxEl);
            this.#fit();

            img.src = currentImageObj.src;
        }

        // caption
        const caption = currentImageObj.caption || "";
        this.#captionEl.textContent = caption;
        this.#captionEl.hidden = caption === "";

        // arrows are hidden at the first / last item
        if (this.#prevBtn) this.#prevBtn.hidden = index === 0;
        if (this.#nextBtn) this.#nextBtn.hidden = index === this.#options.images.length - 1;

        this.#updateThumbnails();
    }

    // The real size of the media is known - re-fit when the size was unknown or different
    #onNaturalSize(naturalW, naturalH) {
        if (!naturalW || !naturalH) return;

        const ratioDiffers = this.#knownDims &&
            Math.abs((naturalW / naturalH) / (this.#dims.w / this.#dims.h) - 1) > 0.01;

        if (!this.#knownDims || ratioDiffers) {
            this.#dims = { w: naturalW, h: naturalH };
            this.#knownDims = true;
            this.#fit();
        }
    }

    // Size the media box to fill the available area, keeping the aspect ratio
    #fit() {
        const box = this.#boxEl;
        if (!box || !this.#wrapperEl) return;

        const style = window.getComputedStyle(this.#wrapperEl);
        const availW = this.#wrapperEl.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const availH = this.#wrapperEl.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

        if (!this.#knownDims || !(availW > 0) || !(availH > 0)) {
            // unknown size: let the media take its natural size (limited by the screen)
            box.classList.add("bizon-media-box-auto");
            box.style.width = "";
            box.style.height = "";
            return;
        }

        box.classList.remove("bizon-media-box-auto");
        const scale = Math.min(availW / this.#dims.w, availH / this.#dims.h);
        box.style.width = Math.floor(this.#dims.w * scale) + "px";
        box.style.height = Math.floor(this.#dims.h * scale) + "px";
    }

    // load the neighbour images in advance
    #preloadNeighbours() {
        [this.#currentImageIndex - 1, this.#currentImageIndex + 1].forEach((i) => {
            const neighbour = this.#options.images[i];
            if (!neighbour || this.#isVideo(neighbour)) return;
            const pre = new Image();
            pre.src = neighbour.src;
            this.#preloaded.push(pre);
        });
        if (this.#preloaded.length > 6) {
            this.#preloaded.splice(0, this.#preloaded.length - 6);
        }
    }

    #updateThumbnails() {
        if (!this.#thumbsEl) return;

        let activeThumb = null;
        this.#thumbsEl.querySelectorAll(".bizon-thumb-wrapper").forEach((el) => {
            const isActive = Number(el.dataset.index) === this.#currentImageIndex;
            el.classList.toggle("bizon-thumb-wrapper-active", isActive);
            if (isActive) {
                el.setAttribute("aria-current", "true");
                activeThumb = el;
            } else {
                el.removeAttribute("aria-current");
            }
        });

        // keep the active thumbnail centered in the (horizontally scrollable) strip
        if (activeThumb) {
            const left = activeThumb.offsetLeft - (this.#thumbsEl.clientWidth - activeThumb.offsetWidth) / 2;
            if (typeof this.#thumbsEl.scrollTo === "function") {
                this.#thumbsEl.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
            } else {
                this.#thumbsEl.scrollLeft = Math.max(0, left);
            }
        }
    }

    #pushHistory() {
        // so the browser's Back button closes the lightbox instead of leaving the page
        if (window.history && typeof window.history.pushState === "function") {
            try {
                window.history.pushState({ bizon: true }, "");
                this.#historyPushed = true;
            } catch (e) { /* ignore */ }
        }
    }

    #bindEvents() {
        document.addEventListener("keydown", this.#handleKeyDown);
        window.addEventListener("resize", this.#handleResize);
        window.addEventListener("popstate", this.#handlePopState);
    }

    #unbindEvents() {
        document.removeEventListener("keydown", this.#handleKeyDown);
        window.removeEventListener("resize", this.#handleResize);
        window.removeEventListener("popstate", this.#handlePopState);
        if (this.#resizeRaf) {
            cancelAnimationFrame(this.#resizeRaf);
            this.#resizeRaf = 0;
        }
    }

    #handleResize = () => {
        if (this.#resizeRaf) return;
        this.#resizeRaf = requestAnimationFrame(() => {
            this.#resizeRaf = 0;
            this.#fit();
        });
    };

    #handlePopState = () => {
        // the history entry was already removed by the browser (Back button)
        this.#historyPushed = false;
        this.hide();
    };

    #handleKeyDown = (event) => {
        if (!this.#isOpen) return;

        if (event.key === "Escape") {
            event.preventDefault();
            this.hide();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            // arrows belong to the video player when it has the focus (seek)
            if (document.activeElement && document.activeElement.tagName === "VIDEO") return;
            this.#setMainImage(this.#currentImageIndex + (event.key === "ArrowLeft" ? -1 : 1));
        } else if (event.key === "Tab") {
            this.#trapFocus(event);
        }
    };

    // keep the keyboard focus inside the lightbox
    #trapFocus(event) {
        const focusable = Array.from(this.#bizonEl.querySelectorAll("button:not([hidden]), video"));
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        const isInside = focusable.includes(active);

        if (event.shiftKey && (active === first || !isInside)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && (active === last || !isInside)) {
            event.preventDefault();
            first.focus();
        }
    }
}
