import { getElement, store } from '@wordpress/interactivity';

store('omnipress/wc', {
    actions: {
        addToCart: (e) => {
            const { ref } = getElement();
            const link = ref.getAttribute('href');

            if (link.includes('add-to-cart')) {
                e.preventDefault();
                addtoCart(ref.dataset.productId, 1, ref.dataset.variation ?? [], ref);
            }
        },
    },
});

// Add to cart
function addtoCart(id, quantity, variation, el) {
    el.innerText = 'loading...';
    const { nonce } = el.dataset;

    const bodyData = {
        id: +id,
        quantity,
        variation,
        nonce,
    };

    setTimeout(async () => {
        const response = await addToCartItem(bodyData);
        updateMiniCart(response);

        el.innerHTML = '<span><i class="fas fa-check"></i></span>Go to cart';
    }, 100);

    el.addEventListener('click', (e) => {
        e.preventDefault();
        // el.removeEventListener("click", addtoCart);
        if (el.dataset.cartPage) {
            window.location.href = el.dataset.cartPage;
        }

        el.style.cursor = 'pointer';
        return false;
    });
}

// Update mini cart content:
function updateMiniCart(response) {
    document.dispatchEvent(
        new CustomEvent('added_to_cart', {
            detail: response,
        })
    );
    openDrawer();
}

async function addToCartItem(bodyData) {
    const { nonce, ...rest } = bodyData;

    const response = await wp.apiFetch({
        path: '/wc/store/v1/cart/add-item',
        method: 'POST',
        headers: {
            Nonce: nonce,
        },
        data: rest,
    });

    document.dispatchEvent(
        new CustomEvent('added_to_cart', {
            detail: response,
        })
    );

    return response;
}

function openDrawer() {
    const miniCart = document.querySelector('.wc-block-mini-cart__button ');

    if (!miniCart) {
        return;
    }

    const newEvent = new CustomEvent('click', {
        bubbles: false,
        cancelable: true,
    });

    miniCart.dispatchEvent(newEvent);
}
