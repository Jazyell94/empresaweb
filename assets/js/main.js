/* ============================================
   MAIN.JS - Core Application Logic
   Webgamma Design System v1.0.0
   ============================================ */

'use strict';

/**
 * App - Main application controller
 * Initializes all modules and manages global state
 */
const App = {
    /** @type {boolean} Whether the app has been initialized */
    initialized: false,

    /**
     * Initialize the application
     */
    init() {
        if (this.initialized) return;

        document.addEventListener('DOMContentLoaded', () => {
            this._initSidebar();
            this._initNavigation();
            this._initScrollAnimations();
            this._initDropdowns();
            this._initTooltips();

            this.initialized = true;
            console.log('[Webgamma DS] Application initialized');
        });
    },

    /* ─── Sidebar ─── */

    _initSidebar() {
        const toggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.ds-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('is-open');
            toggle.classList.toggle('is-active', isOpen);

            if (overlay) {
                overlay.classList.toggle('is-visible', isOpen);
            }

            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                this._closeSidebar(sidebar, toggle, overlay);
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
                this._closeSidebar(sidebar, toggle, overlay);
            }
        });

        // Close sidebar when a nav link is clicked (mobile)
        sidebar.querySelectorAll('.ds-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this._closeSidebar(sidebar, toggle, overlay);
                }
            });
        });
    },

    /**
     * Close sidebar programmatically
     * @param {Element} sidebar
     * @param {Element} toggle
     * @param {Element} overlay
     */
    _closeSidebar(sidebar, toggle, overlay) {
        sidebar.classList.remove('is-open');
        if (toggle) toggle.classList.remove('is-active');
        if (overlay) overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    },

    /* ─── Navigation ─── */

    _initNavigation() {
        const navLinks = document.querySelectorAll('.ds-nav a');

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Remove active from all
                navLinks.forEach(l => l.classList.remove('active'));
                // Set active on clicked
                this.classList.add('active');

                // Smooth scroll to section
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80;
                        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });

        // Update active nav on scroll (Intersection Observer)
        this._initScrollSpy();
    },

    _initScrollSpy() {
        const sections = document.querySelectorAll('.ds-section[id]');
        const navLinks = document.querySelectorAll('.ds-nav a');

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    },

    /* ─── Scroll Animations ─── */

    _initScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .stagger-children');

        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    },

    /* ─── Dropdowns ─── */

    _initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown__trigger');
            if (!trigger) return;

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other open dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('is-open');
                });
                dropdown.classList.toggle('is-open');
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            dropdowns.forEach(d => d.classList.remove('is-open'));
        });

        // Close dropdowns on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdowns.forEach(d => d.classList.remove('is-open'));
            }
        });
    },

    /* ─── Tooltips ─── */

    _initTooltips() {
        const tooltipTriggers = document.querySelectorAll('[data-tooltip]');

        tooltipTriggers.forEach(trigger => {
            trigger.style.position = 'relative';

            trigger.addEventListener('mouseenter', function () {
                const text = this.getAttribute('data-tooltip');
                const tip = document.createElement('div');
                tip.className = 'tooltip-popup';
                tip.textContent = text;
                tip.style.cssText = `
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--bg-elevated, #252525);
                    color: var(--text-primary, #fff);
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 70;
                    pointer-events: none;
                    animation: fadeInUp 0.2s ease-out;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                `;
                this.appendChild(tip);
            });

            trigger.addEventListener('mouseleave', function () {
                const tip = this.querySelector('.tooltip-popup');
                if (tip) tip.remove();
            });
        });
    }
};

// Initialize the app
App.init();
