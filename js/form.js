'use strict';

// The module for form validation.
(function formHandlers() {
  var noticeForm = document.querySelector('.notice__form'),
      typeInput = noticeForm.querySelector('#type'),
      priceInput = noticeForm.querySelector('#price'),
      timeinSelect = noticeForm.querySelector('#timein'),
      timeoutSelect = noticeForm.querySelector('#timeout'),
      roomsAmount = noticeForm.querySelector('#room_number'),
      guestsCapacityOptions = noticeForm.querySelector('#capacity').children;

  /**
   * Handler for accommodation type input. Depending on chosen type
   * the function sets the min attribute and placeholder in price input.
   * @returns {void}
   */
  function onTypeChangeHandler() {
    var inputValue = typeInput.value,
        minPrice;

    switch (inputValue) {
      case 'bungalo':
        minPrice = '0';
      break;
      case 'flat':
        minPrice = '1000';
        break;
      case 'house':
        minPrice = '5000';
        break;
      case 'palace':
        minPrice = '10000';
        break;
      default:
        minPrice = '0';
    }

    priceInput.setAttribute('min', minPrice);
    priceInput.setAttribute('placeholder', minPrice);
  }

  /**
   * Sets the same option in sibling input (options have to be in the same order)
   * @param {object} ev - event object
   * @param {object} siblingSelect - DOM object, input
   * @return {void}
   */
  function synchSibling(ev, siblingSelect) {
    siblingSelect.selectedIndex = ev.currentTarget.selectedIndex;
  }

  /**
   * Makes available to choose amount of guests according to the condition
   * "one room - one guests", i.e. if you choose 2 rooms, options with more
   * than 2 guests are disabled.
   * @returns {void}
   */
  function onRoomsChangeHandler() {
    var selectedRoomAmount = roomsAmount.selectedIndex;

    for (let i = 0; i < guestsCapacityOptions.length; i++) {
      if (i > selectedRoomAmount) {
        guestsCapacityOptions[i].setAttribute('disabled', 'disabled');
      } else {
          guestsCapacityOptions[i].removeAttribute('disabled');
      }
    }
  }

  // AJAX request for form submit
  function onFormSubmitHandler(e) {
    var formData = new FormData(e.target),
        url = 'http://localhost/formtest.php';

    window.save(url, formData, () => {
      alert('Success');
    }, (message) => {
        alert(message);
    });
    e.preventDefault()
  }

  noticeForm.addEventListener('submit', onFormSubmitHandler);
  typeInput.addEventListener('change', onTypeChangeHandler);
  timeinSelect.addEventListener('change', (event) => {
    synchSibling(event, timeoutSelect);
  });
  timeoutSelect.addEventListener('change', (event) => {
    synchSibling(event, timeinSelect);
  });
  roomsAmount.addEventListener('change', onRoomsChangeHandler);
}());
