(function () {
  /**
   * Initialize a single image uploader instance.
   *
   * @param {string} inputId        - ID of the hidden input field.
   * @param {string} previewId      - ID of the preview container.
   * @param {string} uploadButtonId - ID of the upload button.
   * @param {string} removeButtonId - ID of the remove button.
   */
  function initializeImageUploader(
    inputId,
    previewId,
    uploadButtonId,
    removeButtonId,
  ) {
    let mediaUploader;

    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const uploadButton = document.getElementById(uploadButtonId);
    const removeButton = document.getElementById(removeButtonId);

    console.log(
      'custom uploader === ',
      uploadButton,
      removeButton,
      input,
      preview,
    );

    // Add event listener for the upload button
    uploadButton.addEventListener('click', function (e) {
      e.preventDefault();

      if (mediaUploader) {
        mediaUploader.open();
        return;
      }

      // Initialize the WordPress media uploader
      mediaUploader = wp.media.frames.file_frame = wp.media({
        title: 'Choose Image',
        button: { text: 'Select Image' },
        multiple: false,
      });

      // Handle the image selection
      mediaUploader.on('select', function () {
        const attachment = mediaUploader
          .state()
          .get('selection')
          .first()
          .toJSON();
        input.value = attachment.url;
        preview.innerHTML = `<img src="${attachment.url}" alt="Uploaded Image" class="op-object-cover op-w-full op-h-full">`;
        removeButton.style.display = 'inline-block';
      });

      mediaUploader.open();
    });

    // Add event listener for the remove button
    removeButton.addEventListener('click', function (e) {
      e.preventDefault();
      input.value = '';
      preview.innerHTML = '';
      this.style.display = 'none';
    });
  }

  // Initialize all uploader instances on the page
  window.addEventListener('load', () => {
    document
      .querySelectorAll('.op-image-uploader[data-instance-id]')
      .forEach((container) => {
        const instanceId = container.dataset.instanceId;
        initializeImageUploader(
          `image_input_${instanceId}`,
          `image_preview_${instanceId}`,
          `upload_button_${instanceId}`,
          `remove_button_${instanceId}`,
        );
      });
  });
})();
