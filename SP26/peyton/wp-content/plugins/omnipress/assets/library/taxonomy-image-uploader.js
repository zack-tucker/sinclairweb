jQuery(document).ready(function($) {
    $('.upload-taxonomy-image').on('click', function(e) {
        e.preventDefault();

        const $this = $(this);
        const $preview = $this.closest('.form-field, td').find('#taxonomy_image_preview');
        const $input = $this.closest('.form-field, td').find('#taxonomy_image');
        const $removeButton = $this.siblings('.remove-taxonomy-image');

        var customUploader = wp.media({
            title: 'Select or Upload Image',
            button: {
                text: 'Use this image'
            },
            multiple: false
        }).on('select', function() {
            const attachment = customUploader.state().get('selection').first().toJSON();
            $input.val(attachment.url);
            $preview.html('<img src="' + attachment.url + '" alt="Featured Image" class="op-max-w-full op-max-h-full op-object-cover op-rounded">');
            $removeButton.removeClass('op-hidden');
        }).open();
    });

    $('.remove-taxonomy-image').on('click', function(e) {
        e.preventDefault();

        const $this = $(this);
        const $preview = $this.closest('.form-field, td').find('#taxonomy_image_preview');
        const $input = $this.closest('.form-field, td').find('#taxonomy_image');

        $input.val('');
        $preview.html('<span class="op-text-gray-500">No image selected</span>');
        $this.addClass('op-hidden');
    });
});
