document.addEventListener('DOMContentLoaded', function () {
    const sliderConfig = window.template2SliderConfig || {
        autoplay: false,
        autoplay_delay: 1000,
        effect: 'fade',
        crossFade: true,
        lazyLoad: false,
    };
    const swiper = new Swiper('.swiper-container', {
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

    swiper.on('slideChange', function () {
        const activeIndex = swiper.realIndex;
        const navSlides = document.querySelectorAll('.oe-travel-nav-slide');
        navSlides.forEach((slide) => slide.classList.remove('active'));

        if (navSlides[activeIndex]) {
            navSlides[activeIndex].classList.add('active');
        }
    });

    document.querySelectorAll('.oe-travel-nav-slide').forEach((navSlide, index) => {
        navSlide.addEventListener('click', () => {
            swiper.slideToLoop(index);
        });
    });
});
