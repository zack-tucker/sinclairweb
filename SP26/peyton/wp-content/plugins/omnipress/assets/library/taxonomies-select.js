jQuery(document).ready(function($) {
    let mediaUploader;
    $('#upload_taxonomy_image').on('click', function(e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }
        mediaUploader = wp.media.frames.file_frame = wp.media({
            title: 'Choose Image',
            button: { text: 'Select Image' },
            multiple: false
        });
        mediaUploader.on('select', function() {
            const attachment = mediaUploader.state().get('selection').first().toJSON();
            $('#taxonomy_image').val(attachment.url);
            $('#taxonomy_image_preview').html('<img src="' + attachment.url + '" alt="Taxonomy Image" style="max-width: 200px;">');
            $('#remove_taxonomy_image').show();
        });
        mediaUploader.open();
    });
    $('#remove_taxonomy_image').on('click', function(e) {
        e.preventDefault();
        $('#taxonomy_image').val('');
        $('#taxonomy_image_preview').html('');
        $(this).hide();
    });
});
