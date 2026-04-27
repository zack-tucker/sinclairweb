document.addEventListener('DOMContentLoaded', function () {
    // Use dynamic data passed via localized script
    const sliderConfig = window.template5SliderConfig || {
        autoplay: false,
        autoplay_delay: 1000,
        effect: 'fade',
        crossFade: true,
        lazyLoad: false,
    };

    const swiper = new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1.3,
        spaceBetween: 10,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: sliderConfig.autoplay
            ? {
                delay: sliderConfig.autoplay_delay || 1000,
                disableOnInteraction: false,
            }
            : false,
        effect: sliderConfig.effect === 'fade' ? 'fade' : 'slide',
        fadeEffect: sliderConfig.effect === 'fade'
            ? {
                crossFade: sliderConfig.crossFade,
            }
            : undefined,
        lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
        },
        on: {
            slideChangeTransitionEnd: function () {
                this.update();
            },
        },
        breakpoints: {
            320: {
                slidesPerView: 1, // Adjust for tablets
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 1, // Adjust for tablets
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 1, // Adjust for desktops
                spaceBetween: 40,
            },
            1200: {
                slidesPerView: 1.4, // Adjust for desktops
                spaceBetween: 40,
            },
        },
        on: {
            slideChange: function () {
                const currentSlideNumber = document.querySelector('.current-slide');
                if (currentSlideNumber) {
                    currentSlideNumber.textContent = String(this.realIndex + 1).padStart(2, '0');
                }
            },
            slideChangeTransitionEnd: function () {
                swiper.update();
            },
        },
    });

    // Set total slides count
    const totalSlides = document.querySelector('.total-slides');
    if (totalSlides) {
        const realSlidesCount = document.querySelectorAll('.swiper-wrapper .swiper-slide:not(.swiper-slide-duplicate)').length;
        totalSlides.textContent = String(realSlidesCount).padStart(2, '0');
    }

    // Debug layout if needed
    document.querySelector('.swiper-button-next').addEventListener('click', () => {
        swiper.update();
    });

    // for thmbnil slide
    document.querySelectorAll('.nav-item').forEach((navItem) => {
        navItem.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            swiper.slideToLoop(index);
        });
    });

});

