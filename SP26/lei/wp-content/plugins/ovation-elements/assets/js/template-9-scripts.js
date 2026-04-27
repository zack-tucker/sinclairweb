document.addEventListener('DOMContentLoaded', function () {
    const sliderConfig = window.template9SliderConfig || {
        autoplay: false,
        autoplay_delay: 1000,
        effect: 'fade',
        crossFade: false,
        lazyLoad: false,
    };

    const swiper = new Swiper('.swiper-container-1', {
        loop: true,
        navigation: {
            nextEl: '.custom-button-next',
            prevEl: '.custom-button-prev',
        },
        autoplay: sliderConfig.autoplay ? {
            delay: sliderConfig.autoplay_delay || 1000,
            disableOnInteraction: false,
        } : false,
        effect: sliderConfig.effect,
        fadeEffect: {
            crossFade: sliderConfig.crossFade,
        },
        lazy: sliderConfig.lazyLoad ? {
            loadPrevNext: true,
            loadOnTransitionStart: true,
        } : false,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                // Format numbers with leading zeros
                let formattedIndex = (index + 1).toString().padStart(2, '0');
                return `<span class="${className}">${formattedIndex}</span>`;
            },
        },
        on: {
            init: function () {
                updateForemostContent(this.slides[this.realIndex]);
            },
            slideChange: function () {
                updateForemostContent(this.slides[this.realIndex]);
            }
        }
    });

    function updateForemostContent(activeSlide) {
        if (!activeSlide) return;

        const title = activeSlide.querySelector('.slide-title')?.textContent || '';
        const button = activeSlide.querySelector('.slide-button');

        const foremostTitle = document.querySelector('.foremost-title');
        const foremostTitle1 = document.querySelector('.foremost-title-1');
        const exploreBtn = document.querySelector('.explore-more');

        // Update the title (no split)
        if (foremostTitle) foremostTitle.textContent = title;
        if (foremostTitle1) {
            foremostTitle1.textContent = '';
            foremostTitle1.style.display = 'none';
        }
        // Update the button
        if (exploreBtn && button) {
            exploreBtn.textContent = button.textContent;
            exploreBtn.setAttribute('href', button.getAttribute('href'));
            exploreBtn.style.display = 'inline-block';
        } else if (exploreBtn) {
            exploreBtn.style.display = 'none';
        }
    }
});

