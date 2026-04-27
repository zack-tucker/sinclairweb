import { getContext, getElement, store } from '@wordpress/interactivity';

const STYLES = {
  active: 'display:block;',
  close: 'display:none;',
};

const setCookie = (name, value, days) => {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  return (
    document.cookie
      .split(';')
      .find((cookie) => cookie.trim().startsWith(nameEQ))
      ?.substring(nameEQ.length) || null
  );
};

const updatePopupDisplayCount = (instanceId, repetition) => {
  if (repetition === -1) {return;}

  const count =
    parseInt(getCookie(`omnipress_popup_display_count_${instanceId}`), 10) || 0;
  setCookie(`omnipress_popup_display_count_${instanceId}`, count + 1, 7);
};

const popupCache = {};

const removeElement = (element, instanceId, repetition, isShowNextTime) => {
  updatePopupDisplayCount(instanceId, repetition);

  setTimeout(() => {
    if (isShowNextTime) {
      const innerElement = element.innerHTML;

      popupCache[instanceId] = innerElement;
      element.innerHTML = '';
      return;
    }

    element?.parentElement?.remove();
  }, 600);
};

const initiateInactivityListener = (callback, idleTime = 3) => {
  const idleDuration = idleTime * 1000;
  let timer;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(callback, idleDuration);
  };

  ['load', 'mousemove', 'keypress'].forEach((event) =>
    window.addEventListener(event, resetTimer),
  );
};

const closePopup = (context, isClicked) => {
  if (!context.popupEl) {return;}

  context.popupEl.style.cssText = STYLES.close;

  removeElement(
    context.popupEl,
    context.instanceId,
    context.popup_repetition,
    isClicked,
  );
  context.isOpened = false;
};

const togglePopup = function () {
  if (!this || (this.close_button_delay > 0 && this.isOpened)) {return;}

  const { popupEl, auto_close_delay } = this;

  if (popupCache[this.instanceId]) {
    popupEl.innerHTML = popupCache[this.instanceId];
    popupCache[this.instanceId] = null;
  }
  popupEl.style.cssText = this.isOpened ? STYLES.close : STYLES.active;

  if (auto_close_delay) {
    setTimeout(() => closePopup(this), auto_close_delay * 1000);
  }

  startCloseTimer(this);

  if (!this.is_dismissible) {
    attachCloseOnClick(this);
  }

  this.isOpened = !this.isOpened;
};

const startCloseTimer = (context) => {
  if (context.close_button_delay <= 0) {return;}

  const interval = setInterval(() => {
    context.close_button_delay--;
    if (context.close_button_delay <= 0) {
      clearInterval(interval);
      context.close_button_delay = 'Close';
      context.button_style = 'padding:8px;background:#fff';
    }
  }, 1000);
};

const openPopup = (context) => {
  if (!context || !context.popupEl) {return;}

  if (context.popup_triggered === 'on_click' && context.childrenEl) {
    context.popupEl.innerHTML = popupCache.childrenEl;
  }

  context.isOpened = true;
  context.popupEl.style.cssText =
    'floating_bar' === context.popup_type
      ? STYLES.active + 'transition:200ms ease-in;'
      : STYLES.active;

  if (context.auto_close_delay) {
    setTimeout(() => closePopup(context), context.auto_close_delay * 1000);
  }

  startCloseTimer(context);

  if (!context.is_dismissible) {
    attachCloseOnClick(context);
  }
};

const handlePopupTrigger = function () {
  const { popup_triggered, time_delay } = this;

  switch (popup_triggered) {
    case 'on_page_load':
      setTimeout(() => openPopup(this), time_delay * 1000);
      break;

    case 'on_exit_intend':
      window.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0) {openPopup(this);}
      });
      break;

    case 'on_inactivity':
      initiateInactivityListener(() => openPopup(this));
      break;

    case 'on_scroll':
      const checkScrollPosition = () => {
        const { scrollTop, scrollHeight } = document.documentElement;
        const viewportHeight = window.innerHeight;
        const scrolledPercentage =
          (scrollTop / (scrollHeight - viewportHeight)) * 100;

        if (scrolledPercentage >= time_delay) {
          openPopup(this);
          window.removeEventListener('scroll', checkScrollPosition);
        }
      };
      window.addEventListener('scroll', checkScrollPosition);
      break;
  }
};

const attachCloseOnClick = (context) => {
  if (!context) {return;}

  document
    .querySelectorAll(`.opcpop-${context.instanceId}`)
    .forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => closePopup(context, true));
    });
};

const { state, actions, callbacks } = store('omnipress/popup', {
  actions: {
    closeModal: (e) => {
      e.stopPropagation();

      if (!e.target.classList.contains('op-popup-modal')) {
        return;
      }

      const context = getContext();

      if (context.close_button_delay > 0) {return;}

      closePopup(context, context.popup_triggered === 'on_click');
    },

    closePopup: () => closePopup(getContext()),
  },
  callbacks: {
    onTriggeredPopup: (e) => {
      const context = getContext();
      context.popupEl = getElement().ref;

      if (context.popup_triggered === 'on_click') {
        document
          .querySelectorAll(`.optpop-${context.instanceId}`)
          .forEach((btn) => {
            btn.addEventListener('click', togglePopup.bind(context));
          });
      } else {
        handlePopupTrigger.call(context);
      }
    },
    openPopup: (e) => {
      const context = getContext();
      context.popupEl = getElement().ref;
      handlePopupTrigger.call(context);
    },
  },
});
