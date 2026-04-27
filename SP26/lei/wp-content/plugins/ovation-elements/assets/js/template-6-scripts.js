document.addEventListener('DOMContentLoaded', function () {
    console.log('sliderData:', sliderData);

    if (!sliderData || !sliderData.images) {
        console.error('sliderData.images is not defined or is null!');
        return;
    }
    const sliderConfig = window.template6SliderConfig || {
        autoplay: false,
        autoplay_delay: 1000,
        effect: 'fade',
        crossFade: true,
        lazyLoad: false,
    };

    const swiper = new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Makes numbers clickable
            renderBullet: function (index, className) {
                return `<span class="${className}">${index + 1}</span>`;
            },
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

    // Update background image and color on slide change
    swiper.on('slideChange', function () {
        var activeIndex = swiper.realIndex;

        var newBackgroundImageUrl = sliderData.images[activeIndex];
        var newBackgroundColor = sliderData.background_colors[activeIndex];

        var sliderBackgroundElement = document.getElementById('slider-background');
        sliderBackgroundElement.style.backgroundImage = 'url(' + newBackgroundImageUrl + ')';
        sliderBackgroundElement.style.backgroundColor = newBackgroundColor; 

        document.getElementById("current-slide").textContent = (activeIndex + 1).toString().padStart(2, '0');
    });

    var initialBackgroundImageUrl = sliderData.images[swiper.realIndex];
    var initialBackgroundColor = sliderData.background_colors[swiper.realIndex];

    var sliderBackgroundElement = document.getElementById('slider-background');
    sliderBackgroundElement.style.backgroundImage = 'url(' + initialBackgroundImageUrl + ')';
    sliderBackgroundElement.style.backgroundColor = initialBackgroundColor;

    // new i add for slide no 
    document.getElementById("current-slide").textContent = (swiper.realIndex + 1).toString().padStart(2, '0');
});


//for popup vedio
document.addEventListener("DOMContentLoaded", function () {
    var videoButtons = document.querySelectorAll(".myVideoBtns");

    videoButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            var videoUrl = button.getAttribute("data-url"); 
            var modal = document.getElementById("myVideoNewModals");
            var iframe = document.getElementById("videoEmbed");

            // Update video 
            if (videoUrl && videoUrl !== "#") {
                iframe.src = videoUrl;
                modal.style.display = "block";
            }
        });
    });

    // Close modal
    document.querySelector(".close-one").addEventListener("click", function () {
        var modal = document.getElementById("myVideoNewModals");
        var iframe = document.getElementById("videoEmbed");

        modal.style.display = "none";
        iframe.src = ""; 
    });
});

//end




