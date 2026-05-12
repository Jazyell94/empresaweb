/* ============================================
   SCROLL-ANIMATIONS.JS - Scroll-Triggered Effects
   Webgamma Replica v1.0.0
   ============================================ */

'use strict';

/**
 * ScrollAnimations - Controla os efeitos baseados na rolagem (IntersectionObserver e EventListeners)
 */
const ScrollAnimations = {
    /**
     * Inicia todas as animações engatilhadas por rolagem
     */
    init() {
        this._initScrollReveal();
        this._initHeroScroll();
        this._initTextReveal();
        this._initFooterAccordion();
    },

    /**
     * Efeito da Seção Hero: diminui o tamanho (scale) e esmaece (fade out)
     * cria a sensação de que a seção está indo para o fundo da página.
     * @private
     */
    _initHeroScroll() {
        const heroInner = document.querySelector('.hero--home');
        if (!heroInner) return;

        let ticking = false;

        const updateHero = () => {
            const scrolled = window.scrollY;
            const viewportHeight = window.innerHeight;

            if (scrolled <= viewportHeight) {
                // Calculate progress 0 to 1
                const progress = scrolled / viewportHeight;
                const isMobile = window.innerWidth <= 781;
                
                // Scale from 1 to 0.85
                const scale = 1 - (progress * 0.15);

                heroInner.style.transform = `scale(${scale})`;

                if (isMobile) {
                    // Mobile: no fade, just scale — sections above cover it naturally
                    heroInner.style.opacity = 1;
                } else {
                    // Desktop: fade out from 1 to 0
                    const opacity = 1 - (progress * 1.5);
                    heroInner.style.opacity = Math.max(0, opacity);
                }
                heroInner.style.visibility = 'visible';
            } else {
                // Hide it completely when scrolled past
                heroInner.style.visibility = 'hidden';
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHero);
                ticking = true;
            }
        });

        // Initial check
        updateHero();
    },

    /**
     * Scroll Reveal: revela elementos genéricos conforme entram na tela.
     * Usa IntersectionObserver para performance (evita checar o scroll o tempo todo).
     * @private
     */
    _initScrollReveal() {
        // Removed as requested: "tire todos os scroll reveal do site e deixe so ao carregar o site"
        // Instead, we just make them all visible instantly
        const elements = document.querySelectorAll('.scroll-animate, .stagger-children');
        elements.forEach(el => el.classList.add('is-visible'));
    },

    /**
     * Big text scroll reveal (text-large section)
     * Animates text lines as user scrolls through the tall container
     * @private
     */
    _initTextReveal() {
        const textLargeSection = document.querySelector('.text-large');
        if (!textLargeSection) return;

        const lines = textLargeSection.querySelectorAll('.r-line');
        if (lines.length === 0) return;

        // Use scroll position within the section to reveal lines
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start monitoring scroll position
                    this._monitorTextRevealScroll(textLargeSection, lines);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0
        });

        observer.observe(textLargeSection);
    },

    /**
     * Monitora a rolagem para mudar as cores do texto grande progressivamente.
     * Utiliza requestAnimationFrame para que a animação não trave a rolagem.
     * @param {HTMLElement} section
     * @param {NodeListOf<HTMLElement>} lines
     * @private
     */
    _monitorTextRevealScroll(section, lines) {
        let ticking = false;

        const update = () => {
            const rect = section.getBoundingClientRect();
            
            // Only start animating when the top of the section reaches top 0
            if (rect.top <= 0) {
                // Calculate how much we scrolled past top 0
                // Available scroll = section height - viewport (the sticky pin area)
                const scrollableDistance = section.offsetHeight - window.innerHeight;
                const scrolledPast = Math.abs(rect.top);
                const progress = Math.min(1, scrolledPast / Math.max(1, scrollableDistance));

                const linesCount = lines.length;
                const progressPerLine = 1 / linesCount;

                lines.forEach((line, index) => {
                    const lineThreshold = index * progressPerLine; // Starts exactly when the previous finishes
                    
                    if (progress >= lineThreshold) {
                        // lineProgress goes from 0 to 1 during its dedicated time window
                        const lineProgress = Math.min(1, (progress - lineThreshold) / progressPerLine);
                        line.style.backgroundPositionX = (100 - lineProgress * 100) + '%';
                        
                        if (lineProgress >= 1) {
                            line.classList.add('is-visible');
                        } else {
                            line.classList.remove('is-visible');
                        }
                    } else {
                        line.style.backgroundPositionX = '100%';
                        line.classList.remove('is-visible');
                    }
                });
            } else {
                // If we scroll back up above top 0, reset
                lines.forEach(line => {
                    line.style.backgroundPositionX = '100%';
                    line.classList.remove('is-visible');
                });
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        });

        // Initial check
        update();
    },

    /**
     * Text Reveal: Efeito onde as linhas do texto mudam de cor gradativamente
     * ao rolar a página para baixo.
     * @private
     */
    _initFooterAccordion() {
        const accordionTitles = document.querySelectorAll('.footer-menu__row__title');

        accordionTitles.forEach(title => {
            title.addEventListener('click', () => {
                const row = title.closest('.footer-menu__row');
                if (row) {
                    row.classList.toggle('is-open');
                    const expanded = row.classList.contains('is-open');
                    title.setAttribute('aria-expanded', expanded);
                }
            });
        });
    },


};
