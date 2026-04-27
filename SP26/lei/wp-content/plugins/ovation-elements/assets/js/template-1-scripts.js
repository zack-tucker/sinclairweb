document.addEventListener('DOMContentLoaded', function () {
    const sliderConfig = window.template1SliderConfig || {
        autoplay: false,
        autoplay_delay: 1000,
        effect: 'fade',
        crossFade: true,
        lazyLoad: false,
    };

    const swiper = new Swiper('.oe-slider-outer', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: sliderConfig.autoplay ? {
            delay: sliderConfig.autoplay_delay || 1000,
            disableOnInteraction: false,
        } : false,
        effect: sliderConfig.effect,
        fadeEffect: {
            crossFade: sliderConfig.crossFade,
        },
        lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
        },
    });


    // Slide change event for updating counter
    swiper.on('slideChange', function () {
        const activeIndex = swiper.realIndex;
        const counters = document.querySelectorAll('.count');

        counters.forEach((counter, index) => {
            if (index === activeIndex) {
                counter.classList.add('active');
            } else {
                counter.classList.remove('active');
            }
        });
    });
});