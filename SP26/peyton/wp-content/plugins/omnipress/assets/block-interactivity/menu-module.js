import { getElement, store } from '@wordpress/interactivity';

store('omnipress/menu', {
    actions: {
        setWidth: () => {
            const { ref } = getElement();

            const refRect = ref.getBoundingClientRect();
            const submenu = ref.querySelector('.op-block__megamenu-submenu');
            const documentWidth = document.documentElement.clientWidth;

            if (submenu) {
                submenu.style.maxWidth = `${documentWidth - refRect.right}px`;
            }
        },
        toggleMenu: () => {
            const { ref } = getElement();
            const menuWrapper = ref.nextElementSibling.querySelector('.op-block__megamenu-lists');

            menuWrapper.classList.toggle('active');
        },
    },
});
