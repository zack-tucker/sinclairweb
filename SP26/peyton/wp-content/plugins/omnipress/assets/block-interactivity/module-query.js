import { getContext, getElement, store } from '@wordpress/interactivity';

const apiFetch = window.wp.apiFetch;
const { addQueryArgs } = wp.url;

const INITIAL_STATE = {
  filters: [
    {
      post_type: 'product',
      post_status: 'publish',
      post_title: 'Product',
      per_page: 10,
      orderby: 'date',
      order: 'desc',
      category: '1',
      tag: '1',
      price_from: '100',
      price_to: '1000',
      rating_from: '3',
      rating_to: '5',
    },
  ],
};

const isValidLink = (ref) =>
  ref &&
  ref instanceof window.HTMLAnchorElement &&
  ref.href &&
  (!ref.target || ref.target === '_self') &&
  ref.origin === window.location.origin;

const isValidEvent = (event) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.altKey &&
  !event.shiftKey &&
  !event.defaultPrevented;

const updateUrls = async (filters = {}, href) => {
  const url = new URL(window.location);

  if (Object.keys(filters).length > 0) {
    for (const [key, value] of Object.entries(filters)) {
      url.searchParams.set(key, value);
    }
  }

  const { actions } = await import('@wordpress/interactivity-router');

  actions.navigate(href, {});
};

const DEFAULT_STATE = {
  filters: {
    attribute: {},
  },
};

/**
 * Creates a store for managing query-related state and actions.
 *
 * @function
 * @param {string}  storeName             - The name of the store ('omnipress/query').
 * @param {Object}  storeConfig           - Configuration object for the store.
 * @param {Object}  storeConfig.state     - Initial state of the store.
 * @param {Object}  storeConfig.actions   - Actions that can be performed on the store.
 * @param {Object}  storeConfig.callbacks - Callback functions for various events.
 * @param {Object}  options               - Additional options for the store.
 * @param {boolean} options.lock          - Whether to lock the store or not.
 * @return {Object} An object containing the state and actions of the store.
 */
const { state } = store('omnipress/query', {
  state: DEFAULT_STATE,

  actions: {
    *navigate(event) {
      const ctx = getContext();
      const { ref } = getElement();

      const queryRef = ref.closest(
        '.wp-block-omnipress-query-loop[data-wp-router-region]',
      );

      if (isValidLink(ref) && isValidEvent(event)) {
        event.preventDefault();

        const { actions } = yield import('@wordpress/interactivity-router');

        yield actions.navigate(ref.href);
        ctx.url = ref.href;

        // Focus the first anchor of the Query block.
        const firstAnchor = `.wp-block-omnipress-query-template a[href]`;
        queryRef.querySelector(firstAnchor)?.focus();
      }
    },

    *onProductFilter(event) {
      event.preventDefault();
      const ctx = getContext();

      ctx.isProcessing = true;

      const { ref } = getElement();
      const { name, value } = ref.dataset;

      if (
        Boolean(ctx.filters[name]) &&
        ctx.filters[name] === value &&
        name != 'sort' &&
        name !== 'search'
      ) {
        const { [name]: removed, ...rest } = ctx.filters;
        ctx.filters = rest;
      } else if (name.includes('pa_')) {
        const attributes = ctx.filters.attributes ?? {};
        const formattedAttribute = validateProductAttribute(
          attributes,
          name,
          value,
        );

        ctx.filters.attributes = formattedAttribute;
      } else if ('sort' == name) {
        ctx.filters[name] = event.target.value;
      } else {
        ctx.filters[name] = value;
      }

      if (name === '_sale_price') {
        ctx.filters[name] = event.target.checked;
      }

      let timeout;
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        await fetchFilteredProducts.call(ctx);
      }, 400);
    },

    removeFilter() {
      const { ref } = getElement();
      const ctx = getContext();

      const { name, value } = ref.dataset;

      const { [name]: removed, ...rest } = ctx.filters;

      ctx.filters = { ...rest };

      fetchFilteredProducts.call(ctx);
    },

    *prefetch() {
      const { ref } = getElement();

      if (isValidLink(ref)) {
        const { actions } = yield import('@wordpress/interactivity-router');
        yield actions.prefetch(ref.href);
      }
    },

    isOpen: () => {
      const context = getContext();
      context.isOpen = !context.isOpen;
    },

    onSorting: (e) => {
      const context = getContext();
    },

    *addToCart(e) {
      e.preventDefault();

      const { ref } = getElement();
      const context = getContext();

      const { productId, quantity, isAddable, productType } = ref.dataset;

      const args = {
        quantity: 1,
        id: parseInt(productId, 10),
      };

      if ('variable' !== productType && 'simple' !== productType) {
        window.location.href = ref.href;
        return;
      }

      if (productType === 'variable' && context.selectedVariation) {
        args.variation = [];

        for (const [key, value] of Object.entries(context.selectedVariation)) {
          args.variation.push({
            attribute: key.replace('attribute_', ''),
            value,
          });
        }
      }

      const innerHtml = ref.getAttribute('value') ?? ref.getHTML();

      addToCart(ref, args).then((response) => {
        setTimeout(() => {
          addToCartAnimation(ref, response, innerHtml);
        }, 300);
      });
    },

    *loadMoreProducts(event) {
      event.preventDefault();
      const context = getContext();

      const { ref } = getElement();

      ref.innerHTML = 'Loading...';
      const { page, isProcessing } = ref.dataset;

      ref.dataset.page = Number(page) + 1;

      if (isProcessing === 'true') {
        return;
      }

      ref.dataset.isProcessing = true;
    },
  },
  callbacks: {
    onChangeFilterInput(event) {
      const ctx = getContext();

      ctx.filters[event.target.name] = event.target.value;
    },
    updatePrices(event) {
      const { ref } = getElement();
      const { name, value } = ref;
      const ctx = getContext();

      let timeout;

      if (timeout) {
        clearTimeout(timeout);
      }

      if (!name || !value) {
        return;
      }

      if (
        name === 'min_price' &&
        Number.parseInt(value) < Number.parseInt(ctx.filters.max_price)
      ) {
        ctx.filters.min_price = value;
      }

      if (
        name === 'max_price' &&
        Number.parseInt(value) > Number.parseInt(ctx.filters.min_price)
      ) {
        ctx.filters.max_price = value;
      }

      const sliderContent = ref.parentElement;

      const rangeTrack = sliderContent.querySelector('.range-highlight');
      const minPriceWidth = (ctx.filters.min_price / 10000) * 100;
      const maxPriceWidth = (ctx.filters.max_price / 10000) * 100;

      const rangeTrackWidth = maxPriceWidth - minPriceWidth;
      rangeTrack.style = `width:${rangeTrackWidth}%; left:${minPriceWidth}%;`;

      timeout = setTimeout(() => {
        fetchFilteredProducts.call(ctx);
      }, 600);
    },

    *onSelectVariation(event) {
      event.preventDefault();

      const { ref } = getElement();
      const context = getContext();

      if (ref.dataset.isProcessing === 'true') {
        return;
      }

      ref.dataset.isProcessing = true;

      yield setTimeout(() => {
        const currentProductItem = ref.closest(
          '[data-type="omnipress/single-product"]',
        );

        const { attributeName, attributeValue } = ref.dataset;

        // add class name to styling active attribute.
        const parentEl = ref.parentElement;

        const siblings = parentEl.querySelectorAll('.attribute-option');

        siblings.forEach((sibling) => {
          sibling.classList.remove('selected');
        });

        if (!context.selectedVariation) {
          context.selectedVariation = {};
        }

        if (context.selectedVariation[attributeName] === attributeValue) {
          const { [attributeName]: _, ...rest } = context.selectedVariation;
          context.selectedVariation = rest;
          ref.classList.remove('selected');
        } else {
          context.selectedVariation[attributeName] = attributeValue;
          ref.classList.add('selected');
        }

        const matchedAttrs = context.attributes.find((attribute) => {
          return Object.keys(attribute.attributes).every(
            (key) =>
              context.selectedVariation[key] === attribute.attributes[key],
          );
        });

        if (!matchedAttrs) {
          context.isCartDisabled = true;
        } else {
          context.isCartDisabled = false;
        }

        currentProductItem.querySelector('.product-price-html').innerHTML =
          matchedAttrs?.price_html ?? '';

        ref.dataset.isProcessing = false;
      }, 30);
    },

    initTemplate(event) {
      const context = getContext();
      const { ref } = getElement();

      context.templateRef = ref;
    },

    paginateItems(event) {
      const context = getContext();
      const { ref } = getElement();
      const { page } = ref.dataset;

      if (!Boolean(page)) {
        return;
      }

      context.page = page;
    },

    ontoggleViewLayout(event) {
      const context = getContext();

      const queryRef = document.querySelector('.wp-block-omnipress-query-loop');

      if (event.target.classList.contains('active')) {
        return;
      }
      const layoutType = event.target.dataset.viewLayout;

      const sibling = `[data-view-layout="${
        layoutType === 'grid' ? 'list' : 'grid'
      }"]`;

      event.target.parentElement
        .querySelector(sibling)
        .classList.remove('active');

      event.target.classList.add('active');

      context.view_layout = layoutType;
    },

    *prefetch() {
      const { url } = getContext();
      const { ref } = getElement();

      if (url && isValidLink(ref)) {
        const { actions } = yield import('@wordpress/interactivity-router');

        yield actions.prefetch(ref.href);
      }
    },
  },
});

// util function
function recursivelyRemoveEmptyKey(obj = {}) {
  if (!obj) {
    return {};
  }

  const newObj = {};
  for (const key in obj) {
    if (
      !Boolean(obj[key]) ||
      'queryId' === key ||
      (Array.isArray(obj[key]) && obj[key].length === 0)
    ) {
      continue;
    }

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      const nestedObj = recursivelyRemoveEmptyKey(obj[key]);

      if (Object.keys(nestedObj).length > 0) {
        newObj[key] = nestedObj;
      }
    } else if ('max_price' === key && 'max' === obj[key]) {
      continue;
    } else if ('min_price' === key || 'max_price' === key) {
      if (
        Number.isNaN(parseInt(obj.min_price)) ||
        Number.isNaN(parseInt(obj.max_price)) ||
        Number.parseInt(obj.min_price, 10) > Number.parseInt(obj.max_price, 10)
      ) {
        continue;
      } else {
        newObj[key] = obj[key];
      }
    } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

/**
 * Validate Query state remove empty values and only filter out only valid attributes.
 *
 * @param  existingAttributes
 * @param  attrName
 * @param  attrValue
 *
 * @return {Object}
 */
function validateProductAttribute(existingAttributes, attrName, attrValue) {
  const attributes = { ...existingAttributes };

  if (!attributes[attrName]) {
    attributes[attrName] = [attrValue];
  } else {
    const isExists = attributes[attrName].includes(attrValue);

    if (!isExists) {
      attributes[attrName] = [...attributes[attrName], attrValue];
    } else {
      attributes[attrName] = attributes[attrName].filter(
        (item) => item !== attrValue,
      );
    }
  }

  return attributes;
}

// fetched dynamic products..
async function fetchFilteredProducts() {
  const filteredState = recursivelyRemoveEmptyKey(this.filters);

  const { attributes, ...rest } = filteredState;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const s = urlParams.get('s');
  const post_type = urlParams.get('post_type');

  attributes &&
    Object.keys(attributes).forEach((key, i) => {
      if (!attributes[key].length) {
        return;
      }

      rest[key] = Array.isArray(attributes[key]) && attributes[key].join(',');
    });

  const queryStringObject = JSON.stringify(rest);

  if (Boolean(s)) {
    Object.assign(rest, { s });
  }

  if (Boolean(post_type)) {
    Object.assign(rest, { post_type });
  }

  const { actions } = await import('@wordpress/interactivity-router');
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  params.set(this.filters.queryId, queryStringObject);

  params.forEach((value, key) => {
    if (value === '{}' || !Boolean(value)) {
      params.delete(key);
    }
  });

  actions.navigate('?' + (params.toString() === '{}' ? '' : params.toString()));

  if (this.templateRef) {
    const firstAnchor = this.templateRef.querySelector(
      "[data-type='omnipress/single-product'] a",
    );

    if (firstAnchor) {
      firstAnchor.focus();
    }
  }

  setTimeout(() => {
    this.isProcessing = 'false';
  }, 1000); // Add a 1-second delay to display an animation while fetching products from the server.
}

// add to cart Helper functions
function changeInnerHTML(ref, html) {
  ref.innerHTML = html;
  ref.setAttribute('value', html);
}

function addToCartAnimation(ref, res, innerHtml) {
  const currentItem = res.items.find(
    (item) => item.id === Number(ref.dataset.productId),
  );

  if (currentItem) {
    const qty = currentItem.quantity;

    const innerText = `✓ ${qty} Item${qty > 1 ? 's' : ''} in the cart `;

    changeInnerHTML(ref, innerText);
  }

  setTimeout(() => {
    changeInnerHTML(ref, innerHtml);
    ref.style.pointerEvents = 'auto';
    ref.dataset.isProcessing = false;
  }, 2000);
}

async function addToCart(ref, data) {
  ref.innerHTML = 'Adding to cart...';
  ref.value = 'Adding to cart...';
  ref.style.pointerEvents = 'none';

  const response = await apiFetch({
    path: `/wc/store/v1/cart/add-item`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Nonce: window._omnipress.wc_nonce,
    },
    body: JSON.stringify(data),
  });

  document.dispatchEvent(
    new CustomEvent('added_to_cart', {
      detail: response,
    }),
  );

  return response;
}
