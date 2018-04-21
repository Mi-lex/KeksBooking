'use strict';

(function mainPinHanlder() {
  var mapMainPin = window.map.querySelector('.map__pin--main'),
      noticeForm = document.querySelector('.notice__form'),
      addressInput = noticeForm.querySelector('#address');

  window.getElemCoords = function getElemCoords(elem) {
    var coordsObj = elem.getBoundingClientRect();

    return {
      left: coordsObj.left,
      top: coordsObj.top
    }
  }

  function activeMap() {
    window.map.classList.remove('map--faded');
    mapMainPin.addEventListener('mousedown', onMainPinMousedownHandler);
  }

  function activeForm() {
    noticeForm.classList.remove('notice__form--disabled');
  }

  function onMainPinMouseupHandler() {
    // Should change soon
    activeMap();
    window.activeMapFeatures();
    activeForm();
    mapMainPin.removeEventListener('mouseup', onMainPinMouseupHandler);
  }

  function onMainPinMousedownHandler (ev) {
    var mainPinCoords = window.getElemCoords(mapMainPin),
        mapCoords = window.getElemCoords(window.map),
        shift = {
          x: ev.clientX - mainPinCoords.left - mapMainPin.offsetWidth / 2,
          y: ev.clientY - mainPinCoords.top - mapMainPin.offsetHeight / 2
        };
    mapMainPin.style.position = 'absolute';
    mapMainPin.style.zIndex = 10;

    function movePinAt(moveEvent) {
      var newPinCoords = {
        left: moveEvent.clientX - mapCoords.left - shift.x,
        top: moveEvent.clientY - mapCoords.top - shift.y
      },
          rightEdge = window.map.offsetWidth,
          bottomEdge = 650;

      if (newPinCoords.left > rightEdge) {
        newPinCoords.left = rightEdge;
      } else if (newPinCoords.left < 50) {
          newPinCoords.left = 50;
      }

      if (newPinCoords.top > bottomEdge) {
        newPinCoords.top = bottomEdge;
      } else if (newPinCoords.top < 100) {
        newPinCoords.top = 100;
      }

      mapMainPin.style.left = `${newPinCoords.left}px`;
      mapMainPin.style.top = `${newPinCoords.top}px`;
      addressInput.value = `x: ${newPinCoords.left}, y: ${newPinCoords.top - 50}`;
    }

    function onDocMousemoveHandler(moveEvent) {
      movePinAt(moveEvent);
    }

    function onDocMouseupHandler() {
      document.removeEventListener('mousemove', onDocMousemoveHandler);
      document.onmouseup = null;
    }

    document.addEventListener('mousemove', onDocMousemoveHandler);
    document.onmouseup = onDocMouseupHandler;
  }

  mapMainPin.addEventListener('mouseup', onMainPinMouseupHandler);
}());

function mapPinRender() {
  var mapPinsContainer = window.map.querySelector('.map__pins');

  function renderMapPins() {
    var fragment = document.createDocumentFragment(),
        similarMapPinItem = document.querySelector('template').content.
          querySelector('.map__pin');

    window.cards.forEach((el, i) => {
      var mapPin = similarMapPinItem.cloneNode(true),
          mapPinIcon = mapPin.querySelector('img'),
          pinCoords = el.getAttribute('data-pinlocation').split(', '),
          pinAvatar = el.querySelector('img').getAttribute('src');
      mapPin.style.left = `${pinCoords[0] - mapPinIcon.style.width / 2}px`;
      mapPin.style.top = `${pinCoords[1] - mapPinIcon.style.height}px`;
      mapPin.setAttribute('data-popup-card', i);
      mapPinIcon.setAttribute('src', pinAvatar);
      fragment.appendChild(mapPin);
    });

    mapPinsContainer.appendChild(fragment);
  }

  renderMapPins();
}
