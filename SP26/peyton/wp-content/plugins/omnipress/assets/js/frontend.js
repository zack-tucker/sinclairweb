window.addEventListener('DOMContentLoaded', () => {
  /* ================ active class Toggler. ================ */
  const elementsNeededToToggle = document.querySelectorAll(
    '[data-toggle-active]',
  );

  if (elementsNeededToToggle.length > 0) {
    elementsNeededToToggle.forEach((element) => {
      if (element.hasAttribute('data-toggle-on')) {
        let toggleOn = element.getAttribute('data-toggle-on');

        if (toggleOn === 'hover') {
          toggleOn = 'mouseenter';
        }

        element.addEventListener(toggleOn, () => {
          elementsNeededToToggle.forEach((el) => {
            el.classList.remove('active');
          });

          element.classList.add('active');
        });
      }
    });
  }

  /* ================ Handle Link controller for blocks ================ */
  const linkControllers = document.querySelectorAll('div[data-href]');
  const linkPreviewMarkup = document.createElement('div');
  linkPreviewMarkup.classList.add('link-preview');

  if (linkControllers.length > 0) {
    linkControllers.forEach((linkController) => {
      const link = linkController.getAttribute('data-href');
      const target = linkController.getAttribute('target') || '_self';

      linkController.addEventListener('mouseenter', (e) => {
        linkPreviewMarkup.innerText = link;

        if (e.target.closest('a')) {
          return;
        }

        linkController.appendChild(linkPreviewMarkup);
      });

      linkController.addEventListener('mouseleave', () => {
        linkController?.closest('.link-preview')?.remove();
      });

      linkController.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          window.open(link, target);
        }
      });

      linkController.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          return; // Let the <a> tag behave normally
        }

        window.open(link, target);
      });
    });
  }
});
