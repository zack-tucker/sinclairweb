/**
 * Content Switcher Block - Frontend Interactivity
 *
 * Handles the toggle functionality between two content panels
 * using WordPress Interactivity API.
 *
 * @package Omnipress
 * @since 1.4.5
 */

import { getContext, getElement, store } from '@wordpress/interactivity';

const { state, actions, callbacks } = store(
  'omnipress/content-switcher',
  {
    state: {
      get isSecondActive() {
        const context = getContext();
        return context.activeTarget === 'switch-2';
      },
    },

    actions: {
      /**
       * Toggle between switch-1 and switch-2
       */
      toggle() {
        const context = getContext();
        context.activeTarget =
          context.activeTarget === 'switch-1' ? 'switch-2' : 'switch-1';
      },

      /**
       * Activate the first content panel
       */
      activateFirst() {
        const context = getContext();
        context.activeTarget = 'switch-1';
      },

      /**
       * Activate the second content panel
       */
      activateSecond() {
        const context = getContext();
        context.activeTarget = 'switch-2';
      },
    },

    callbacks: {
      /**
       * Initialize the switcher wrapper and set initial state
       */
      initSwitcherSwitch() {
        const context = getContext();
        const element = getElement().ref;

        context.switchRef = element;
        context.activeStyles = 'display:block;';

        // Set initial active state
        callbacks.updateStyles();
      },

      /**
       * Handle toggle switch click event
       */
      onToggleSwitch() {
        const context = getContext();
        const element = getElement().ref;

        // Toggle the active target
        context.activeTarget =
          context.activeTarget === 'switch-1' ? 'switch-2' : 'switch-1';

        // Update toggle indicator class
        if (context.activeTarget === 'switch-1') {
          element.classList.remove('active');
        } else {
          element.classList.add('active');
        }

        callbacks.updateStyles();
      },

      /**
       * Activate left content panel
       */
      activateLeftContent() {
        const context = getContext();

        if (context.toggleRef) {
          context.toggleRef.classList.remove('active-switcher');
        }

        context.activeTarget = 'switch-1';
        callbacks.updateStyles();
      },

      /**
       * Activate right content panel
       */
      activateRightContent() {
        const context = getContext();

        if (context.toggleRef) {
          context.toggleRef.classList.add('active-switcher');
        }

        context.activeTarget = 'switch-2';
        callbacks.updateStyles();
      },

      /**
       * Update styles and classes based on active state
       */
      updateStyles() {
        const context = getContext();

        // Update switch labels active state
        if (context.switchRef) {
          const switchLabels =
            context.switchRef.querySelectorAll('.switch-label');

          switchLabels.forEach((label, index) => {
            const targetIndex = index + 1;
            if (context.activeTarget === `switch-${targetIndex}`) {
              label.classList.add('active');
            } else {
              label.classList.remove('active');
            }
          });
        }

        // Generate dynamic style for content visibility
        const uniqueId = context.uniqueId;
        const activeTarget = context.activeTarget;
        const activeStyles = context.activeStyles || 'display:block;';

        // Update the style element content
        context.style = `.op-${uniqueId} [data-type="omnipress/content-switcher-contents"] > .wp-block-omnipress-container.${activeTarget} { ${activeStyles} }`;
      },

      /**
       * Watch for context changes and update styles
       */
      watchStyles() {
        callbacks.updateStyles();
      },

      /**
       * Initialize the toggle indicator element
       */
      initSwitcher() {
        const context = getContext();
        const element = getElement().ref;

        context.toggleRef = element;

        // Set initial state for toggle indicator
        if (context.activeTarget === 'switch-2') {
          element.classList.add('active-switcher');
        }
      },
    },
  },
  {
    lock: true,
  }
);
