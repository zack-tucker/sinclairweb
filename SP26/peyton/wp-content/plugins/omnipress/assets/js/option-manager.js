document.addEventListener('DOMContentLoaded', function () {
  /**
   * Generic function to handle AJAX requests for option management.
   *
   * @param {string} actionType - 'add', 'update', 'get', 'get_by_key', or 'delete'
   * @param {string} optionName - Name of the option
   * @param {mixed} value - Value for add/update (optional)
   * @param {string} key - Key for get_by_key action (optional)
   * @param {function} callback - Callback function to handle response
   */
  function manageOption(actionType, optionName, value, key, callback) {
    const formData = new FormData();
    formData.append('action', 'manage_option');
    formData.append('action_type', actionType);
    formData.append('option_name', optionName);

    if (value !== null && value !== undefined) {
      formData.append('value', JSON.stringify(value));
    }
    if (key !== null && key !== undefined) {
      formData.append('key', key);
    }
    formData.append('nonce', optionManager.nonce);

    fetch(optionManager.ajax_url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          callback(null, response.data);
        } else {
          callback(response.data?.message || 'Unknown error', null);
        }
      })
      .catch((error) => {
        callback(error.message, null);
      });
  }

  function getOption() {
    manageOption('get', 'my_option', null, null, function (err, data) {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Option value:', data.value);
      }
    });
  }
  function addOption(value) {
    manageOption('add', 'my_option', value, null, function (err, data) {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Success:', data.message);
      }
    });
  }

  function deleteOption() {
    manageOption('delete', 'my_option', null, null, function (err, data) {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Success:', data.message);
      }
    });
  }

  function getOptionByKey(key) {
    manageOption('get_by_key', 'my_option', null, key, function (err, data) {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Option key value:', data.value);
      }
    });
  }

  function updateOptionByKey(key, value) {
    manageOption(
      'update',
      'my_option_by_key',
      value,
      key,
      function (err, data) {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('Success:', data.message);
        }
      },
    );
  }

  function deleteOptionByKey(key) {
    manageOption('delete', 'my_option_by_key', null, key, function (err, data) {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Success:', data.message);
      }
    });
  }

  const optionsHandlers = {
    getOption,
    addOption,
    deleteOption,
    getOptionByKey,
    updateOptionByKey,
    deleteOptionByKey,
  };

  // assign to global window object
  window._omnipress.optionManager = optionsHandlers;

  window.addEventListener('load', () => {
    const addOptionButton = document.querySelectorAll('#add-option');
    const getOptionButton = document.querySelectorAll('#get-option');
    const deleteOptionButton = document.querySelectorAll('#delete-option');
    const getOptionByKeyButton = document.querySelectorAll('#get-option-key');
    const deleteOptionByKeyButton =
      document.querySelectorAll('#delete-option-key');
    const updateOptionByKeyButton =
      document.querySelectorAll('#update-option-key');

    /* Event Listeners for perform option manager actions */
    addOptionButton.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const value = e.target.dataset.value;
        addOption(value);
      });
    });

    getOptionButton.forEach((button) => {
      button.addEventListener('click', getOption);
    });

    deleteOptionButton.forEach((button) => {
      button.addEventListener('click', deleteOption);
    });

    getOptionByKeyButton.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const key = e.target.dataset.key;
        getOptionByKey(key);
      });
    });

    deleteOptionByKeyButton.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const key = e.target.dataset.key;
        deleteOptionByKey(key);
      });
    });

    updateOptionByKeyButton.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const key = e.target.dataset.key;
        const value = e.target.dataset.value;
        updateOptionByKey(key, value);
      });
    });
  });
});
