document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.oe-banner-img');
    const prevButton = document.querySelector('.oe-slider-controls .prev');
    const nextButton = document.querySelector('.oe-slider-controls .next');
    const itemWrappers = document.querySelectorAll('.item-wrapper');

    function updateClasses() {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'previous', 'next');
        });
        itemWrappers.forEach((item, i) => {
            item.classList.remove('active', 'previous', 'next');
        });

        slides[currentIndex].classList.add('active');
        itemWrappers[currentIndex].classList.add('active');

        const prevIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        const nextIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;

        slides[prevIndex].classList.add('previous');
        itemWrappers[prevIndex].classList.add('previous');

        slides[nextIndex].classList.add('next');
        itemWrappers[nextIndex].classList.add('next');
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function (event) {
            event.preventDefault();
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateClasses();
        });

        nextButton.addEventListener('click', function (event) {
            event.preventDefault();
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateClasses();
        });

        updateClasses();
    } else {
        console.error('Navigation buttons not found');
    }
});