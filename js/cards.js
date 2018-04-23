'use strict';

(function mapCardRender() {
  // The url for ajax to get the object for rendering
  var url = 'https://js.dump.academy/keksobooking/data';

  /**
   * Render the cards on the map
   * @param {array} mapCardList - the array of objects to be rendered
   * @returns {void}
   */
  function renderMapCards(mapCardList) {
    var fragment = document.createDocumentFragment(),
        similarMapCardTemplate = document.querySelector('template').content.
      querySelector('.map__card');

    // Clone card item, which is div, full the card with information from object
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
      mapCardItem.setAttribute('data-pinlocation', `${el.location.x}, ${el.location.y}`);
      window.hideItem(mapCardItem);
      fragment.appendChild(mapCardItem);
    });

    // Finally append list of cards in the map div
    window.map.appendChild(fragment);
    window.cards = window.map.querySelectorAll('.map__card');
  }

  function onError(message) {
    alert(message);
  }

  /**
   * Show cards, then make them interactive, render pins and active the filters.
   * mapPinRender and mapFilterHandler are placed in anothers modules
   * Need to rewrite the function using promises.
   * @param {array} mapCardList - the array of objects to be rendered
   * @return {void}
   */
  function onSuccess(mapCardList) {
    renderMapCards(mapCardList);
    mapPinRender();
    window.addMapCardHandler();
    mapFilterHandler();
  }

  window.activeMapFeatures = function activeMapFeatures() {
    window.load(url, onSuccess, onError);
  }
}());

(function mapCardHandlers() {
  function showPopUpCard(cardNumb, mapPin) {
    closePopupCard();
    mapPin.classList.add('map__pin--active');
    window.cards[cardNumb].classList.remove('hidden');
  }

  function closePopupCard() {
    if (window.map.querySelector('.map__pin--active')) {
      window.map.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
    window.cards.forEach((el) => {
      el.classList.add('hidden');
      window.hideItem(el);
    });
  }

  /**
   * Use delegation to close or open card depending on user's target
   * @param {object} e - event
   * @return {void}
   */
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
  window.addMapCardHandler = function addMapCardHandler() {
    window.map.addEventListener('click', onMapClickHandler);
  }
}());
