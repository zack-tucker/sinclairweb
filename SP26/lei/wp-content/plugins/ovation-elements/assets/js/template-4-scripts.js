document.addEventListener('DOMContentLoaded', function () {
    // Use dynamic data passed via localized script
    const sliderConfig = window.template4SliderConfig || {
        autoplay: false,
        autoplay_delay: 1000,
        effect: 'fade',
        crossFade: true,
        lazyLoad: false,
    };
    const swiper = new Swiper('.swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
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
        document.querySelectorAll('.slider-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeIndex = swiper.realIndex;
        const activeNavItem = document.querySelectorAll('.slider-nav .nav-item')[activeIndex];
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    });
});
