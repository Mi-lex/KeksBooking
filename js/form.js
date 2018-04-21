'use strict';

(function formHandlers() {
  var noticeForm = document.querySelector('.notice__form'),
      typeInput = noticeForm.querySelector('#type'),
      priceInput = noticeForm.querySelector('#price'),
      timeinSelect = noticeForm.querySelector('#timein'),
      timeoutSelect = noticeForm.querySelector('#timeout'),
      roomsAmount = noticeForm.querySelector('#room_number');

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

  function synchSibling(ev, siblingSelect) {
    siblingSelect.selectedIndex = ev.currentTarget.selectedIndex;
  }

  function onRoomsChangeHandler() {
    var siblingSelectOptions = document.querySelector('#capacity').children,
        sIndex = roomsAmount.selectedIndex;

    for (let i = 0; i < 4; i++) {
      if (i > sIndex) {
        siblingSelectOptions[i].setAttribute('disabled', 'disabled');
      } else {
          siblingSelectOptions[i].removeAttribute('disabled');
      }
    }
  }

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
