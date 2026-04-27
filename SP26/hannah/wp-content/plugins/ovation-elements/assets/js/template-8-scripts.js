document.addEventListener('DOMContentLoaded', function () {
  const sliderConfig = window.template8SliderConfig || {
    autoplay: false, // Default to false if not provided
    autoplay_delay: 1000, // Default delay time
    effect: 'fade',
    crossFade: true,
    lazyLoad: false,
  };
  const swiper = new Swiper('.swiper-container', {
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


//for color picker
const circularProgress = document.querySelectorAll(".circular-progress");

Array.from(circularProgress).forEach((progressBar) => {
  const progressValue = progressBar.querySelector(".percentage");
  const innerCircle = progressBar.querySelector(".inner-circle");
  let startValue = 0,
    endValue = Number(progressBar.getAttribute("data-percentage")),
    speed = 50,
    progressColor = progressBar.getAttribute("data-progress-color");

  const progress = setInterval(() => {
    startValue++;
    progressValue.textContent = `${startValue}%`;
    progressValue.style.color = `${progressColor}`;

    innerCircle.style.backgroundColor = `${progressBar.getAttribute(
      "data-inner-circle-color"
    )}`;


    progressBar.style.background = `conic-gradient(${progressColor} ${startValue * 3.6
      }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
    if (startValue === endValue) {
      clearInterval(progress);
    }
  }, speed);
});
//end

//for popup vedio
document.addEventListener("DOMContentLoaded", function () {
  const videoBtns = document.querySelectorAll(".myVideoBtns");
  videoBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();

      // get vedio url
      const videoUrl = this.getAttribute("data-url");
      // Find the modal and embed element
      const modal = document.getElementById("myVideoNewModals");
      const videoEmbed = document.getElementById("videoEmbed");

      if (videoUrl && videoUrl !== "#") {
        videoEmbed.setAttribute("src", videoUrl); // Set video URL
        modal.classList.add("show"); // Show modal
      }
    });
  });

  // Close button functionality
  document.querySelector(".close-one").addEventListener("click", function () {
    const modal = document.getElementById("myVideoNewModals");
    const videoEmbed = document.getElementById("videoEmbed");

    modal.classList.remove("show");
    videoEmbed.setAttribute("src", "");
  });
});
//end



jQuery("#slide_splice").html(function () {
  var text = jQuery(this).text().trim();
  var words = text.split(" ");

  if (words.length >= 4) {
    words[4] = "<span class='span2'>" + words[4] + "</span>";

  }

  var updatedText = words.join(" ");
  return updatedText;
});