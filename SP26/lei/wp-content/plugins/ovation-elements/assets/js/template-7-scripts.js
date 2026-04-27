document.addEventListener('DOMContentLoaded', function () {
    // Use dynamic data passed via localized script
    const sliderConfig = window.template7SliderConfig || {
        autoplay: false, // Default to false if not provided
        autoplay_delay: 1000, // Default delay time
        effect: 'fade',
        crossFade: true,
        lazyLoad: false,
    };
    const swiper = new Swiper('.swiper', {
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
            clickable: true,
            renderBullet: function (index, className) {
                // Format numbers with leading zeros
                let formattedIndex = (index + 1).toString().padStart(2, '0');
                return `<span class="${className}">${formattedIndex}</span>`;
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

    swiper.on('slideChange', function () {
        const activeIndex = swiper.realIndex;

        const allPosts = document.querySelectorAll('.oe-travel-slider-carousel-post-boxes');
        allPosts.forEach(post => post.classList.remove('active'));

        const activePost = document.querySelector(`.post-box-${activeIndex}`);
        if (activePost) {
            activePost.classList.add('active');
        }
    });

    swiper.emit('slideChange');
});



//for popup vedio

document.addEventListener("DOMContentLoaded", function () {
    const videoBtns = document.querySelectorAll(".myVideoBtns");
    const modal = document.getElementById("myVideoNewModals");
    const videoEmbed = document.getElementById("videoEmbed");
    const closeBtn = document.querySelector(".close-one");

    videoBtns.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            const videoUrl = this.getAttribute("data-url");

            if (videoUrl) {
                videoEmbed.src = videoUrl;
                modal.style.display = "block";
            }
        });
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
        videoEmbed.src = ""; // Stop video playback
    });

    // Close modal when clicking outside the video
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            videoEmbed.src = "";
        }
    });
});
