(function($) {
    
    wp.data.subscribe(() => {
        appendButton();
        appendSidePanel();
    });

    function appendSidePanel() {

        if ( !$('.ova-elems-side-panel-wrap').length ) {

            if (ova_elems_modal_js.is_author === "") {
                $('.components-v-stack.editor-post-panel__section').append(`<div class="ova-elems-side-panel-wrap is-background">
                    <div class="ova-elems-side-panel-img">
                        <img src="`+ ova_elems_modal_js.bundle_image +`" />
                    </div>
                    <div class="ova-elems-side-panel-btn-wrap">
                        <a class="ova-elems-demo-btn is-bundle" href="https://www.ovationthemes.com/collections/professional-wordpress-themes" target="_blank" >Live Demo</a>
                        <a class="ova-elems-buy-now-btn is-bundle" href="https://www.ovationthemes.com/products/wordpress-bundle" target="_blank" >Buy Now</a>
                    </div>
                </div>`);
            } else {

                $('.components-v-stack.editor-post-panel__section').append(`<div class="ova-elems-side-panel-wrap">
                    <div class="ova-elems-side-panel-img">
                        <img src="`+ ova_elems_modal_js.screenshot_url +`" />
                    </div>
                    <div class="ova-elems-side-panel-btn-wrap not-background">
                        <a class="ova-elems-demo-btn is-theme" href="`+ ova_elems_modal_js.demo_btn +`" target="_blank" >Live Demo</a>
                        <a class="ova-elems-buy-now-btn is-theme" href="`+ ova_elems_modal_js.buy_pro +`" target="_blank" >Buy Now</a>
                        <a class="ova-elems-docs-btn is-theme" href="`+ ova_elems_modal_js.free_doc +`" target="_blank" >Guide</a>
                    </div>
                    <a class="ova-elems-bundle-btn is-theme" href="https://www.ovationthemes.com/products/wordpress-bundle" target="_blank" >Wordpress Theme Bundle (125+ Theme at Just $89)</a>
                </div>`);
            }
        }
    }

    function appendButton() {
        if (!$('.ova-elems-templates-btn-wrap').length) {
            var ova_elems_btn = `<div class="ova-elems-templates-btn-wrap"><span>Ovation Elements</span></div>`;
            $('.components-accessible-toolbar.edit-post-header-toolbar').append(ova_elems_btn);
        }
    }

    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    window.onload = function() {
        if (!$('.ova-elems-templates-modal-wrap').length) {
            $('body').append(`
                <div class="templates-modal-wrap-main">
                    <div class="ova-elems templates-modal-wrap">
                        <span class="ova-elems-dismiss-modal">x</span>
                        <div class="ova-elems templates-modal-search">
                            <form  class="templates-modal-form" role="search" method="get">
                                <img class="ova-elems-search-img" src="`+ ova_elems_modal_js.search_icon +`">
                                <input type="search" id="ova-elems-template-search" name="search" placeholder="Ecommerce WordPress Theme...">
                            </form>
                        </div>
                        <div class="ova-elems templates-modal-content-wrap">
                            <div class="ova-elems templates-modal-content-categories">
                                <h4>Product categories</h4>
                                <ul class="ova-elems templates-modal-categories">
                                </ul>
                            </div>
                            <div class="ova-elems templates-modal-content-cards-wrap">
                                <div class="ova-elems templates-modal-content-cards"></div>
                                <button class="ova-elems templates-load-more">Load More</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }

        ova_elems_get_categories_records();
        ova_elems_get_templates_records();

        $('body').on("input", "#ova-elems-template-search", debounce(function (event) {
            
            ova_elems_get_templates_records( '', $(this).val(), '', 'search' )
        }, 300));

        $('body').on('click', '.ova-elems-templates-btn-wrap', function() {
            $('.templates-modal-wrap-main').show();
        })

        $('body').on('click', '.ova-elems-dismiss-modal', function() {
            $('.templates-modal-wrap-main').hide();
        })

        $('body').on('click', '.ova-elems.templates-load-more', function() {

            var active_filter = '';
            if ($('.ova-elems.templates-modal-categories li.active').length) {
                active_filter = $('.ova-elems.templates-modal-categories li.active').attr('data-value');
            }            
            
            ova_elems_get_templates_records( active_filter, '', $(this).attr('data-cursor'), 'basic' );
        })

        $('body').on('click', '.ova-elems.templates-modal-categories li', function() {

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');

                ova_elems_get_templates_records( '', '', '', 'filter' )
            } else {
                $('.ova-elems.templates-modal-categories li').removeClass('active');
                $(this).addClass('active');

                ova_elems_get_templates_records( $(this).attr('data-value'), '', '', 'filter' )
            }
        })
    }

    function ova_elems_get_categories_records() {
        $.ajax({
            method: "POST",
            url: ova_elems_modal_js.admin_ajax,
            data: {
                action: 'ova_elems_get_categories',
                nonce: ova_elems_modal_js.nonce
            }
        }).done(function( data ) {

            const response = data.data;
            if ( response.code == 200 ) {
                if (response.data.length) {
                    const categories = response.data;

                    categories.sort((a, b) => a.title.localeCompare(b.title));
                    
                    categories.map((data, index) => {                        
                        $('.ova-elems.templates-modal-categories').append('<li data-value="' + data.handle +'">'+ data.title +'</li>');
                    });
                }                
            }
            
        })
    }

    function ova_elems_get_templates_records( handle = '', search = '', cursor = '', action = 'basic' ) {
        
        const data = {
            handle: handle,
            search: search,
            cursor: cursor,
            action: 'ova_elems_get_templates',
            nonce: ova_elems_modal_js.nonce
        }
        
        $.ajax({
            method: "POST",
            url: ova_elems_modal_js.admin_ajax,
            data: data
        }).done(function( data ) {

            const response = data.data;
            if ( response.code == 200 ) {
                if (response.data.products.length) {
                    const templates_arr = response.data;
                    const products = templates_arr.products;
                    const pagination = templates_arr.pageInfo;
                    
                    $('.ova-elems.templates-load-more').hide();
                    if (pagination.hasNextPage) {
                        $('.ova-elems.templates-load-more').attr('data-cursor', pagination.endCursor);
                        $('.ova-elems.templates-load-more').show();
                    }
                    
                    const cardContainer = $('.ova-elems.templates-modal-content-cards');

                    if (action != 'basic') {
                        cardContainer.empty();                        
                    }

                    products.map((data, index) => {
                        const product = data.node;

                        var cardHtml = `
                            <div class="ova-elems-card-wrap">
                                <div class="ova-elems-card-img-wrap">
                                    <img src="${product.images.edges[0].node.src}" class="ova-elems-img" alt="${product.title}">
                                    <div class="ova-elems-button-wrap">
                                        <a href="${product.onlineStoreUrl}" class="btn btn-primary ova-elems-btn ova-elems-buy-btn" target="_blank">Buy Now</a>`;

                                        if ( product.hasOwnProperty('metafield') && product.metafield != null ) {
                                            cardHtml += `<a href="${product.metafield.value}" class="btn btn-primary ova-elems-btn ova-elems-demo-btn" target="_blank">Demo</a>`;
                                        }

                        cardHtml += `</div>
                                </div>
                                <div class="ova-elems-card-body">
                                    <h5 class="ova-elems-card-title">${product.title}</h5>
                                    <p class="ova-elems-card-price"><span>Price: </span>${product.variants.edges[0].node.price}</p>
                                </div>
                            </div>
                        `;

                        if ( !product.hasOwnProperty('inCollection') || product.inCollection ) {
                            cardContainer.append(cardHtml);                        
                        }
                    });
                }
            }
        });
    }

    window.onclick = function(event) {
        var modalWrap = $('.templates-modal-wrap-main');
        var modalButton = $('.ova-elems-templates-btn-wrap');
    
        if (modalWrap.is(':visible') && !modalWrap.is(event.target) && modalWrap.has(event.target).length === 0) {
            if (!modalButton.is(event.target) && modalButton.has(event.target).length === 0) {
                modalWrap.hide();
            }
        }
    };    

})(jQuery);