'use strict';

function mapFilterHandler() {
  var filters = window.map.querySelector('.map__filters'),
      housingType = filters.querySelector('#housing-type'),
      housingPrice = filters.querySelector('#housing-price'),
      housingRooms = filters.querySelector('#housing-rooms'),
      housingGuests = filters.querySelector('#housing-guests'),
      housingfeatures = filters.querySelector('#housing-features'),
      pinsContainer = window.map.querySelector('.map__pins'),
      pins = pinsContainer.querySelectorAll(".map__pin:not(.map__pin--main)");

  /**
   * Shows or hides pins depending on filters that user choses.
   * Takes out pin container before filtering. Each iteration pin gets shown,
   * then it makes sure whether the pin and related card apply the filters.
   * if card&pin don't apply a filter, the pin gets hidden
   * and current iteration breaks immediately.
   * @returns {void}
   */
  function updatePins() {
    window.map.removeChild(pinsContainer);

    for (let i = 0; i < window.cards.length; i++) {
      let currCard = window.cards[i],
          currPin = pins[i],
          cardType = currCard.querySelector('h4').textContent,
          cardPrice = Number(currCard.querySelector('.popup__price').
            textContent.replace(/[^(\d)+]/gi, '')),
          [cardRoomsAmount, , cardGuestsAmount] = currCard.querySelector('h4 ~ p').
            textContent.split(' '),
          cardFeatures = currCard.querySelector('.popup__features'),
          selectedFeatures = housingfeatures.querySelectorAll('input:checked~label');
      window.showItem(currPin);

      // Housing type filter
      switch (housingType.value) {
        case 'any':
          break;
        case cardType:
          break;
        default:
          window.hideItem(currPin);
          continue;
      }
      // Housing price filter
      switch (housingPrice.value) {
        case 'any':
          break;
        case 'low':
          if (cardPrice > 10000) {
            window.hideItem(currPin);
            continue;
          }
          break;
        case 'middle':
          if (cardPrice < 10000 || cardPrice > 50000) {
            window.hideItem(currPin);
            continue;
          }
          break;
        case 'high':
          if (cardPrice < 50000) {
            window.hideItem(currPin);
            continue;
          }
          break;
        default:
      }

      // Housing rooms filter
      switch (housingRooms.value) {
        case 'any':
          break;
        case cardRoomsAmount:
          break;
        default:
          window.hideItem(currPin);
          continue;
      }

      // Housing guests filter
      switch (housingGuests.value) {
        case 'any':
          break;
        case cardGuestsAmount:
          break;
        default:
          window.hideItem(currPin);
          continue;
      }

      // Housing features filters
      for (let j = 0; j < selectedFeatures.length; j++) {
        if (!cardFeatures.getElementsByClassName(selectedFeatures[j].className).length) {
          window.hideItem(currPin);
          continue;
        }
      }
    }
    window.map.insertBefore(pinsContainer, window.map.children[0]);
  }

  filters.addEventListener('change', () => {
    window.debounce(updatePins, 500);
  });
}
