document.addEventListener('DOMContentLoaded', () => {
  const loadMoreButtons = document.querySelectorAll(
    '.op-tax-query-load-more-button',
  );

  loadMoreButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const nextPage = parseInt(button.getAttribute('data-next-page'));
      const wrapper = button.closest('[data-type="omnipress/tax-query"]');
      const context = JSON.parse(wrapper.getAttribute('data-wp-context'));

      const { postsPerPage, taxonomy, selectedLayout } = context;
      const grid = wrapper.querySelector('.omnipress-layout-grid');

      button.disabled = true;
      button.textContent = 'Loading...';

      try {
        const response = await fetch(_omnipress.ajax_url, {
          method: 'POST',
          body: new URLSearchParams({
            action: 'omnipress_load_more_terms',
            nonce: _omnipress?.wp_ajax_nonce,
            taxonomy,
            page: nextPage,
            posts_per_page: postsPerPage,
            selected_layout: selectedLayout,
          }),
        });

        const data = await response.json();

        if (data.success) {
          grid.insertAdjacentHTML('beforeend', data.data.html);
          context.currentPage = nextPage;
          button.setAttribute('data-next-page', nextPage + 1);

          if (nextPage + 1 > context.totalPages) {
            button.remove();
          }
        } else {
          console.error('Error:', data.data.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        button.disabled = false;
        button.textContent = 'Load More';
      }
    });
  });
});
