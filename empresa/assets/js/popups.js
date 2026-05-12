/* ============================================
   POPUPS.JS - Contact & Apply Form Modals
   Webgamma Replica v1.0.0
   ============================================ */

'use strict';

/**
 * Popups - Manages opening/closing of popup forms
 */
const Popups = {
    /**
     * Initialize popup functionality
     */
    init() {
        this._initOpenTriggers();
        this._initCloseTriggers();
        this._initFormInteractions();
    },

    /**
     * Listen for clicks on links that reference popup IDs
     * @private
     */
    _initOpenTriggers() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="#contact"], a[href*="#apply"]');
            if (!link) return;

            const href = link.getAttribute('href');
            const hash = href.includes('#') ? '#' + href.split('#').pop() : null;

            if (hash) {
                const popup = document.querySelector(hash + '.popup');
                if (popup) {
                    e.preventDefault();
                    this._openPopup(popup);
                }
            }
        });
    },

    /**
     * Listen for close button and overlay clicks
     * @private
     */
    _initCloseTriggers() {
        // Close buttons
        document.querySelectorAll('.close-popup').forEach(btn => {
            btn.addEventListener('click', () => {
                const popupId = btn.dataset.id;
                const popup = popupId ? document.querySelector(popupId + '.popup') : btn.closest('.popup');
                if (popup) this._closePopup(popup);
            });
        });

        // Close on overlay click
        document.querySelectorAll('.popup__overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                const popup = overlay.closest('.popup');
                if (popup) this._closePopup(popup);
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openPopup = document.querySelector('.popup.is-open');
                if (openPopup) this._closePopup(openPopup);
            }
        });
    },

    /**
     * Initialize form interactions (file upload, checkboxes)
     * @private
     */
    _initFormInteractions() {
        // File upload UI
        document.querySelectorAll('.js-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const container = btn.closest('.file-container');
                const input = container?.querySelector('input[type="file"]');
                if (input) input.click();
            });
        });

        // Service checkbox labels toggle
        document.querySelectorAll('.service-options label').forEach(label => {
            label.addEventListener('click', () => {
                // CSS handles the visual state via :checked
            });
        });
    },

    /**
     * Open a popup
     * @param {HTMLElement} popup
     * @private
     */
    _openPopup(popup) {
        popup.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close a popup
     * @param {HTMLElement} popup
     * @private
     */
    _closePopup(popup) {
        popup.classList.remove('is-open');
        document.body.style.overflow = '';
    }
};
