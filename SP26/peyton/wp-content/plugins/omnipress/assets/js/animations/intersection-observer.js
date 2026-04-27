/**
 * Omnipress Block Animations
 *
 * Handles intersection observer-based animations for blocks.
 *
 * @package Omnipress
 * @since 1.7.0
 */

(function () {
    window.addEventListener("DOMContentLoaded", function () {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    let animationClasses = (entry.target.dataset?.opAnimation || "").split(" ");

                    if (entry.isIntersecting) {
                        animationClasses.forEach((animationClass) => {
                            entry.target.classList.add(animationClass);
                        });

                        // observer.unobserve(entry.target);
                    } else {
                        let timeout;

                        if (timeout) {
                            clearTimeout(timeout);
                        }

                        timeout = setTimeout(() => {
                            entry.target.classList.remove(...animationClasses);
                        }, 1000);
                    }
                });
            },
            {
                rootMargin: "0px 0px 0px 20px",
                threshold: 0.5,
            }
        );

        document.querySelectorAll(".op_has_animation").forEach(function (element) {
            if (!element) {
                return;
            }

            observer.observe(element);
        });
    });
})();
