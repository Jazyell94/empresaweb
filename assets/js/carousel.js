/* ============================================
   CAROUSEL.JS - Vanilla JS Carousel/Slider
   Webgamma Replica v1.0.0
   ============================================ */

'use strict';

/**
 * Carousel - Touch-enabled horizontal slider with scrollbar
 */
const Carousel = {
    /**
     * Initialize all carousels on the page
     */
    init() {
        const carousels = document.querySelectorAll('.section--carousel .swiper-wrapper');
        carousels.forEach(wrapper => this._initCarousel(wrapper));
    },

    /**
     * Initialize a single carousel
     * @param {HTMLElement} wrapper - The scrollable wrapper element
     * @private
     */
    _initCarousel(wrapper) {
        const nav = wrapper.closest('.swiper')?.querySelector('.swiper-scrollbar');
        const scrollbarDrag = nav?.querySelector('.swiper-scrollbar-drag');

        if (!wrapper) return;

        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        // Mouse drag
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        wrapper.addEventListener('mouseup', () => {
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mouseleave', () => {
            isDragging = false;
            wrapper.style.cursor = 'grab';
        });

        // Update scrollbar position on scroll
        if (scrollbarDrag) {
            wrapper.addEventListener('scroll', () => {
                this._updateScrollbar(wrapper, scrollbarDrag);
            });

            // Initial scrollbar state
            requestAnimationFrame(() => {
                this._updateScrollbar(wrapper, scrollbarDrag);
            });
        }
    },

    /**
     * Update the scrollbar drag indicator position
     * @param {HTMLElement} wrapper
     * @param {HTMLElement} drag
     * @private
     */
    _updateScrollbar(wrapper, drag) {
        const scrollWidth = wrapper.scrollWidth - wrapper.clientWidth;
        const scrollPercent = scrollWidth > 0 ? wrapper.scrollLeft / scrollWidth : 0;
        const parentWidth = drag.parentElement.clientWidth;
        const dragWidth = Math.max(parentWidth * (wrapper.clientWidth / wrapper.scrollWidth), 60);

        drag.style.width = dragWidth + 'px';
        drag.style.transform = `translate3d(${scrollPercent * (parentWidth - dragWidth)}px, 0, 0)`;
    }
};
