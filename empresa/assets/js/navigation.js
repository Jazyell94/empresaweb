/* ============================================
   NAVIGATION.JS - Header & Menu Logic
   Webgamma Replica v1.0.0
   ============================================ */

'use strict';

/**
 * Navigation - Handles header, mobile menu, submenus, scroll behavior
 */
const Navigation = {
    /** @type {HTMLElement|null} */
    header: null,
    /** @type {HTMLElement|null} */
    menu: null,
    /** @type {HTMLElement|null} */
    toggle: null,
    /** @type {number} Last scroll position */
    lastScroll: 0,

    /**
     * Initialize navigation
     */
    init() {
        this.header = document.getElementById('masthead');
        this.menu = document.querySelector('.r-header__item--menu');
        this.toggle = document.querySelector('.menu-toggle');

        if (!this.header) return;

        this._initMobileMenu();
        this._initSubmenus();
        this._initScrollBehavior();
    },

    /**
     * Mobile hamburger menu toggle
     * @private
     */
    _initMobileMenu() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => {
            const isOpen = this.menu.classList.toggle('is-open');
            this.toggle.classList.toggle('is-active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('is-open')) {
                this._closeMenu();
            }
        });
    },

    /**
     * Submenu toggle for mobile
     * @private
     */
    _initSubmenus() {
        const hasChildren = document.querySelectorAll('.menu-item-has-children');

        hasChildren.forEach(item => {
            const link = item.querySelector(':scope > a');
            const submenu = item.querySelector('.sub-menu');

            if (!link || !submenu) return;

            // On mobile: tap to toggle
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    item.classList.toggle('is-open');
                    submenu.classList.toggle('is-open');
                }
            });
        });

        // Close submenu button
        const closeBtn = document.querySelector('.close-submenu');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.querySelectorAll('.sub-menu.is-open').forEach(sm => {
                    sm.classList.remove('is-open');
                    sm.closest('.menu-item-has-children')?.classList.remove('is-open');
                });
            });
        }
    },

    /**
     * Header behavior on scroll (hide/show, add shadow)
     * @private
     */
    _initScrollBehavior() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScroll = window.pageYOffset;

                    // Add scrolled class when past threshold
                    if (currentScroll > 50) {
                        document.body.classList.add('scrolled');
                        this.header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    } else {
                        document.body.classList.remove('scrolled');
                        this.header.style.boxShadow = 'none';
                    }

                    // Scroll direction classes
                    if (currentScroll > this.lastScroll && currentScroll > 100) {
                        document.body.classList.add('scroll-down');
                        document.body.classList.remove('scroll-up');
                    } else {
                        document.body.classList.remove('scroll-down');
                        document.body.classList.add('scroll-up');
                    }

                    this.lastScroll = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    /**
     * Close the mobile menu
     * @private
     */
    _closeMenu() {
        if (this.menu) this.menu.classList.remove('is-open');
        if (this.toggle) this.toggle.classList.remove('is-active');
        document.body.style.overflow = '';
    }
};
