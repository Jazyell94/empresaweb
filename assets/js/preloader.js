/* ============================================
   PRELOADER.JS - Canvas Gradient Preloader
   Webgamma Replica v1.0.0
   ============================================ */

'use strict';

/**
 * Preloader - Animated canvas gradient preloader
 * Creates a colorful gradient animation inside a circle,
 * then transitions to the site logo
 */
const Preloader = {
    /** @type {HTMLCanvasElement|null} */
    canvas: null,
    /** @type {CanvasRenderingContext2D|null} */
    ctx: null,
    /** @type {number} Animation frame ID */
    animationFrame: 0,
    /** @type {boolean} Whether animation is running */
    isAnimating: true,

    /**
     * Initialize the preloader
     */
    init() {
        const preloader = document.getElementById('r-preloader');
        if (!preloader) return;

        this.canvas = document.getElementById('r-preloader-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        const container = document.querySelector('.r-preloader__container');

        if (!this.canvas || !this.ctx || !container) return;

        // Animate container in
        container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';

        // Start canvas animation
        this._startCanvasAnimation();

        // Wait for resources then transition
        this._waitForResources(() => {
            setTimeout(() => this._animateToLogo(), 1200);
        });
    },

    /**
     * Start the animated gradient canvas
     * @private
     */
    _startCanvasAnimation() {
        const canvas = this.canvas;
        const ctx = this.ctx;

        // Size canvas to container
        const resize = () => {
            const size = canvas.parentElement.offsetWidth;
            canvas.width = size;
            canvas.height = size;
        };
        resize();
        window.addEventListener('resize', resize);

        // Color palettes matching Webgamma's brand colors
        const palettes = [
            ['rgba(244, 185, 64, 0)', 'rgba(244, 185, 64, 0.95)', 'rgba(244, 185, 64, 0)'],
            ['rgba(73, 160, 78, 0)', 'rgba(73, 160, 78, 0.95)', 'rgba(73, 160, 78, 0)'],
            ['rgba(255, 240, 59, 0)', 'rgba(255, 240, 59, 0.95)', 'rgba(255, 240, 59, 0)'],
            ['rgba(226, 104, 45, 0)', 'rgba(226, 104, 45, 0.95)', 'rgba(226, 104, 45, 0)'],
            ['rgba(241, 133, 53, 0)', 'rgba(241, 133, 53, 0.95)', 'rgba(241, 133, 53, 0)'],
            ['rgba(45, 101, 235, 0)', 'rgba(45, 101, 235, 0.95)', 'rgba(45, 101, 235, 0)'],
        ];

        // Create animated gradient points
        const points = palettes.map(palette => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.015,
            vy: (Math.random() - 0.5) * 0.015,
            palette,
            phase: Math.random() * Math.PI * 2
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            points.forEach(point => {
                // Update position with slight acceleration
                point.vx *= 1.001;
                point.vy *= 1.001;
                point.x += point.vx;
                point.y += point.vy;

                // Bounce off edges
                if (point.x <= 0.2 || point.x >= 0.8) {
                    point.vx *= -1;
                    point.x = Math.max(0.2, Math.min(0.8, point.x));
                }
                if (point.y <= 0.2 || point.y >= 0.8) {
                    point.vy *= -1;
                    point.y = Math.max(0.2, Math.min(0.8, point.y));
                }

                // Limit speed
                const speed = Math.sqrt(point.vx ** 2 + point.vy ** 2);
                if (speed > 0.01) {
                    point.vx = (point.vx / speed) * 0.01;
                    point.vy = (point.vy / speed) * 0.01;
                }

                // Draw radial gradient
                const gradient = ctx.createRadialGradient(
                    point.x * canvas.width, point.y * canvas.height, 0,
                    point.x * canvas.width, point.y * canvas.height, canvas.width * 0.5
                );

                point.phase = (point.phase + 0.15) % (Math.PI * 2);
                ctx.globalAlpha = 0.3 + Math.sin(point.phase) * 0.15;

                gradient.addColorStop(0, point.palette[1]);
                gradient.addColorStop(0.5, point.palette[1]);
                gradient.addColorStop(1, point.palette[2]);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

            ctx.globalAlpha = 1;
            this.animationFrame = requestAnimationFrame(draw);
        };

        draw();
    },

    /**
     * Wait for fonts and hero images to load
     * @param {Function} callback
     * @private
     */
    _waitForResources(callback) {
        const check = () => {
            if (document.fonts && document.fonts.status === 'loaded') {
                const hero = document.querySelector('.section--hero');
                if (hero) {
                    const images = hero.querySelectorAll('img');
                    let loaded = 0;
                    const total = images.length;

                    if (total === 0) {
                        callback();
                        return;
                    }

                    images.forEach(img => {
                        if (img.complete) {
                            loaded++;
                            if (loaded === total) callback();
                        } else {
                            img.addEventListener('load', () => {
                                loaded++;
                                if (loaded === total) callback();
                            });
                        }
                    });
                } else {
                    callback();
                }
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    },

    /**
     * Animate the preloader circle to the logo position
     * @private
     */
    _animateToLogo() {
        if (!this.isAnimating) return;

        const preloader = document.getElementById('r-preloader');
        const container = document.querySelector('.r-preloader__container');
        const siteLogo = document.querySelector('.site-logo .custom-logo');
        const background = document.querySelector('.r-preloader__background');
        const hero = document.querySelector('.hero--home');

        // Stop canvas after a delay
        setTimeout(() => {
            cancelAnimationFrame(this.animationFrame);
            this.isAnimating = false;
        }, 1000);

        // Set initial hero state
        if (hero) {
            hero.style.transform = 'scale(0.95)';
            hero.style.opacity = '0';
            hero.style.transition = 'none';
        }

        // Remove theme-inited so text starts hidden
        document.documentElement.classList.remove('theme-inited');

        // Animate preloader out
        const duration = 800;
        const start = performance.now();

        // Fade out canvas and background
        const fadeOut = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            if (this.canvas) this.canvas.style.opacity = 1 - ease;
            if (background) background.style.opacity = 1 - ease;

            if (progress < 0.7) {
                container.style.transform = `scale(${1 - ease * 0.8})`;
            }

            if (progress >= 1) {
                container.style.opacity = '0';

                // Remove preloader
                if (preloader) preloader.remove();

                // Animate hero in
                this._animateHeroIn(hero, siteLogo);
                return;
            }

            requestAnimationFrame(fadeOut);
        };

        requestAnimationFrame(fadeOut);
    },

    /**
     * Animate the hero section in after preloader is gone
     * @param {Element} hero
     * @param {Element} siteLogo
     * @private
     */
    _animateHeroIn(hero, siteLogo) {
        // Logo fade in
        if (siteLogo) {
            siteLogo.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            siteLogo.style.opacity = '1';
            siteLogo.style.transform = 'translate(0, 0)';
        }

        // Hero scale in
        if (hero) {
            hero.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease';
            hero.style.transform = 'scale(1)';
            hero.style.opacity = '1';

            // After hero animation, reveal text
            setTimeout(() => {
                document.documentElement.classList.add('theme-inited');

                // Animate hero link images
                const images = hero.querySelectorAll('.hero__links .r-image');
                images.forEach((img, i) => {
                    img.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                });
            }, 300);
        }

        // Add scrolled class for footer
        setTimeout(() => {
            document.documentElement.classList.add('scrolled');
        }, 500);
    }
};
