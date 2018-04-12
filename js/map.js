/* eslint max-statements: ["error", 200, { "ignoreTopLevelFunctions": true }]*/
/* eslint linebreak-style: ["error", "unix"] */
/* eslint max-len: ["error", { "code": 200 }] */

'use strict';

(function random() {
  window.getRandItem = function getRandItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  window.getRandInt = function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  window.getRandRgbaColor = function getRandRgbaColor() {
    return `rgba(${window.getrandInt(0, 255)}, ${window.getrandInt(0, 255)}, ${window.getrandInt(0, 255)}`;
  }
}());

(function mapCardRender() {
  function getMapCardList() {
    var mapCardArr = [],
        apartmentTypeList = ['flat', 'house', 'bungalo'],
        ckeckinTimeList = ['12:00', '13:00', '14:00'],
        featuresList = [
          "wifi", "dishwasher",
          "parking", "washer",
          "elevator", "conditioner"
        ],
        offerTitleList = [
          "Большая уютная квартира",
          "Маленькая неуютная квартира",
          "Огромный прекрасный дворец",
          "Маленький ужасный дворец",
          "Красивый гостевой домик",
          "Некрасивый негостеприимный домик",
          "Уютное бунгало далеко от моря",
          "Неуютное бунгало по колено в воде"
        ];

    for (let i = 0; i < 8; i++) {
      let mapCardItem = {
        author: {
          avatar: `img/avatars/user0${i + 1}.png`
        },
        location: {
          x: window.getRandInt(300, 900),
          y: window.getRandInt(100, 500)
        },
        offer: {
          checkin: window.getRandItem(ckeckinTimeList),
          checkout: window.getRandItem(ckeckinTimeList),
          description: 'Absense',
          features: featuresList.slice(0, window.getRandInt(1, 5)),
          photos: [],
          price: window.getRandInt(1000, 1000000),
          rooms: window.getRandInt(1, 5),
          title: offerTitleList[i],
          type: i < 2 ? apartmentTypeList[0]:
                i > 5 ? apartmentTypeList[2]:
                        apartmentTypeList[1]
        }
      };
      mapCardItem.offer.address = `${mapCardItem.location.x}, ${mapCardItem.location.y}`;
      mapCardItem.offer.guests = window.getRandInt(1, 3) * mapCardItem.offer.rooms;
      mapCardArr.push(mapCardItem);
    }

    return mapCardArr;
  }

  function renderMapCards(mapCardList) {
    var fragment = document.createDocumentFragment(),
        similarMapCardTemplate = document.querySelector('template').content.
      querySelector('.map__card');
    window.map = document.querySelector('.map');

    mapCardList.forEach((el) => {
      var mapCardItem = similarMapCardTemplate.cloneNode(true);
      mapCardItem.querySelector('h3').textContent = el.offer.title;
      mapCardItem.querySelector('h3 ~ p').textContent = el.offer.address;
      mapCardItem.querySelector('.popup__price').innerHTML =
        `${el.offer.price}&#x20bd;/ночь`;
      mapCardItem.querySelector('h4').textContent = el.offer.type;
      mapCardItem.querySelector('h4 ~ p').textContent = `${el.offer.rooms} для ${el.offer.guests}`;
      mapCardItem.querySelector('h4 ~ p ~ p').textContent = `Заезд после ${el.offer.checkin} выезд до ${el.offer.checkout}`;

      mapCardItem.querySelector('.popup__features').innerHTML = '';
      el.offer.features.forEach((featureName) => {
        var featureItem = document.createElement('LI');
        featureItem.classList.add(`feature`);
        featureItem.classList.add(`feature--${featureName}`);
        mapCardItem.querySelector('.popup__features').appendChild(featureItem);
      });

      mapCardItem.querySelector('.popup__features ~ p').textContent = el.offer.description;
      mapCardItem.querySelector('.popup__avatar').setAttribute('src', el.author.avatar);
      mapCardItem.classList.add('hidden');
      fragment.appendChild(mapCardItem);
    });

    window.map.appendChild(fragment);
  }

  renderMapCards(getMapCardList());
}());

(function mapPinRender() {
  var mapCardList = window.map.querySelectorAll('.map__card'),
      mapPinsContainer = window.map.querySelector('.map__pins');

  function renderMapPins() {
    var fragment = document.createDocumentFragment(),
        similarMapPinItem = document.querySelector('template').content.
      querySelector('.map__pin');

    mapCardList.forEach((el, i) => {
      var mapPinBtn = similarMapPinItem.cloneNode(true),
          mapPinIcon = mapPinBtn.querySelector('img'),
          pinCoords = el.querySelector('h3 ~ p').textContent.split(', '),
          pinAvatar = el.querySelector('img').getAttribute('src');
      mapPinBtn.style.left = `${pinCoords[0] - mapPinIcon.style.width / 2}px`;
      mapPinBtn.style.top = `${pinCoords[1] - mapPinIcon.style.height}px`;
      mapPinBtn.classList.add('hidden');
      mapPinBtn.setAttribute('data-popup-card', i);
      mapPinIcon.setAttribute('src', pinAvatar);
      fragment.appendChild(mapPinBtn);
    });

    mapPinsContainer.appendChild(fragment);
  }

  renderMapPins();
}());

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
    window.map.querySelectorAll('.map__pin').forEach((el) => {
      el.classList.remove('hidden');
    });
    mapMainPin.addEventListener('mousedown', onMainPinMousedownHandler);
  }

  function activeForm() {
    noticeForm.classList.remove('notice__form--disabled');
  }

  function onMainPinMouseupHandler() {
    activeMap();
    activeForm();
  }

  function onMainPinMousedownHandler (ev) {
    var mainPinCoords = window.getElemCoords(mapMainPin),
        mapCoords = window.getElemCoords(window.map),
        shift = {
          x: ev.clientX - mainPinCoords.left - mapMainPin.offsetWidth / 2,
          y: ev.clientY - mainPinCoords.top - mapMainPin.offsetHeight / 2
        };
    mapMainPin.style.position = 'absolute';
    mapMainPin.style.zIndex = 100;

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

(function mapFeaturesHandlers() {
    var mapCardList = window.map.querySelectorAll('.map__card');

  function showPopUpCard(cardNumb, mapPin) {
    closePopupCard();
    mapPin.classList.add('map__pin--active');
    mapCardList[cardNumb].classList.remove('hidden');
  }

  function closePopupCard() {
    if (window.map.querySelector('.map__pin--active')) {
      window.map.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
    mapCardList.forEach((el) => {
      el.classList.add('hidden');
    });
  }

  function onMapClickHandler(e) {
    if (e.target.closest('.map__pin') && !e.target.closest('.map__pin--main')) {
      let currentMapPin = e.target.closest('.map__pin'),
      cardNumb = e.target.closest('.map__pin').getAttribute('data-popup-card');
      showPopUpCard(cardNumb, currentMapPin);
    }

    if (e.target.closest('.popup__close')) {
      closePopupCard();
    }
  }

  window.map.addEventListener('click', onMapClickHandler);
}());
