document.addEventListener('DOMContentLoaded', function () {
  const { addQueryArgs } = wp.url;

  function getSuggestions(e) {
    const query = this.value;
    const suggestions = document.getElementById('suggestions');

    const recentSearches = localStorage.getItem('recentSearches');
    let recentSearchesList = '';

    if (recentSearches) {
      const recentSearchesArray = JSON.parse(recentSearches);
      recentSearchesList = document.createElement('ul');

      recentSearchesList.innerHTML = '<h4>Recent Searches</h4>';

      recentSearchesArray.forEach(function (item) {
        const recentSearch = document.createElement('li');

        recentSearch.innerHTML = `<a href="${addQueryArgs('/', {
          post_type: 'product',
          s: item.query,
        })}"><i style="font-size:12px; margin-right:12px;" class="fas fa-history"></i>${item.query}</a>`;

        recentSearchesList.appendChild(recentSearch);
      });
    }

    suggestions.classList.add('active');

    fetch(window._omnipress?.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'opsp',
        query: query.toLowerCase(),
      }),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        suggestions.innerHTML = '';

        (data.lists && data.lists.length > 0) || query.length > 0
          ? data.lists.forEach(function (item) {
              const suggestion = document.createElement('li');
              url = addQueryArgs('', {
                post_type: 'product',
                s: item?.suggestion,
              });
              suggestion.innerHTML = `<a href="/${url}">${item?.suggestion_html}</a>`;
              suggestions.appendChild(suggestion);
            })
          : suggestions.appendChild(recentSearchesList);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const searchForm = document.getElementById('op-product-search');
  console.log(searchForm);

  if (searchForm) {
    const searchInput = searchForm.querySelector('#search-product-input');
    const selectedCategory = searchForm.querySelector("[name='category']");
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const query = searchInput?.value;

        let recentSearches =
          JSON.parse(localStorage.getItem('recentSearches')) || [];

        const existingIndex = recentSearches.findIndex(
          (item) => item.query === query,
        );

        if (existingIndex !== -1) {
          // If the query exists, update the timestamp
          recentSearches[existingIndex].timestamp = new Date().getTime();
        } else {
          recentSearches.push({
            query,
            timestamp: new Date().getTime(),
          });
        }

        recentSearches.sort((a, b) => b.timestamp - a.timestamp);

        recentSearches = recentSearches.slice(0, 5);

        await localStorage.setItem(
          'recentSearches',
          JSON.stringify(recentSearches),
        );

        const queryArgs = {
          post_type: 'product',
          s: query,
        };

        if (selectedCategory?.value) {
          queryArgs.category = selectedCategory.value;
        }

        if (query?.length === 0) {
          return;
        }

        window.location.href = addQueryArgs('/', queryArgs);
      } catch (e) {
        console.error(e);
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', getSuggestions);
      searchInput.addEventListener('focus', getSuggestions);

      searchInput.addEventListener('focusout', () => {
        const suggestions = document.getElementById('suggestions');

        setTimeout(function () {
          suggestions.classList.remove('active');
          suggestions.innerHTML = '';
        }, 1000);
      });
    }
  }
});
