/* eslint max-statements: ["error", 200, { "ignoreTopLevelFunctions": true }]*/
/* eslint linebreak-style: ["error", "unix"] */
/* eslint max-len: ["error", { "code": 100 }] */

'use strict';

var mapPin = document.querySelector('.map__pin');

var adsList = adsMaker(),
    map     = document.querySelector('section.map'),
    mapPins = document.querySelector('.map__pins');

document.querySelector('.map').classList.remove('map--faded');

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adsMaker() {
  var adsArr = [],
      apartmentTypes = ['flat', 'house', 'bungalo'],
      ckeckinTimes = ['12:00', '13:00', '14:00'],
      featuresList = [
        "wifi", "dishwasher",
        "parking", "washer",
        "elevator", "conditioner"
      ],
      offerTitles = [
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
    let adsItem = {
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      location: {
        x: getRandInt(300, 900),
        y: getRandInt(100, 500)
      },
      offer: {
        checkin: ckeckinTimes[getRandInt(0, ckeckinTimes.length - 1)],
        checkout: ckeckinTimes[getRandInt(0, ckeckinTimes.length - 1)],
        description: 'Absense',
        features: featuresList.slice(0, getRandInt(1, 5)),
        photos: [],
        price: getRandInt(1000, 1000000),
        rooms: getRandInt(1, 5),
        title: offerTitles[i],
        type: i < 2 ? apartmentTypes[0]:
              i > 5 ? apartmentTypes[2]:
                      apartmentTypes[1]
      }
    };
    adsItem.offer.address = `${adsItem.location.x}, ${adsItem.location.y}`;
    adsItem.offer.guests = getRandInt(1, 3) * adsItem.offer.rooms;
    adsArr.push(adsItem);
  }

  return adsArr;
}

function mapPinsRender() {
  var fragment = document.createDocumentFragment(),
      similarMapPinItem = document.querySelector('template').content.
    querySelector('.map__pin');

  adsList.forEach((el) => {
    var mapPinBtn = similarMapPinItem.cloneNode(true),
        mapPinIcon = mapPinBtn.querySelector('img');

    mapPinBtn.style.left = `${el.location.x - mapPinIcon.style.width/2}px`;
    mapPinBtn.style.top = `${el.location.y - mapPinIcon.style.height}px`;
    mapPinIcon.setAttribute('src', el.author.avatar);
    fragment.appendChild(mapPinBtn);
  });

  mapPins.appendChild(fragment);
}

function adsRender() {
  var fragment = document.createDocumentFragment(),
      similarMapCardTemplate = document.querySelector('template').content.
    querySelector('.map__card');

  adsList.forEach((el) => {
    var mapCardItem = similarMapCardTemplate.cloneNode(true);
    mapCardItem.querySelector('h3').textContent = el.offer.title;
    mapCardItem.querySelector('h3 ~ p').textContent = el.offer.address;
    mapCardItem.querySelector('.popup__price').innterHTML =
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
    fragment.appendChild(mapCardItem);
  });

  map.appendChild(fragment);
}

mapPinsRender();
adsRender();
