/* ============================================
   APP.JS - Main Application Controller
   Webgamma Replica v1.0.0
   ============================================ */

'use strict';

/**
 * App - Ponto de entrada principal
 * Inicia todos os módulos (animações, preloader, navegação) assim que a página carrega.
 */
const App = {
    /**
     * Inicia a aplicação
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize modules in order
            Preloader.init();
            Navigation.init();
            Carousel.init();
            Popups.init();
            ScrollAnimations.init();

            console.log('[Webgamma] Site initialized successfully');
        });
    }
};

// Boot the application
App.init();
