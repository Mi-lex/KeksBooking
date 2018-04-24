'use strict';

window.map = document.querySelector('.map');

(function data() {
  window.getRandItem = function getRandItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  window.getRandInt = function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  window.getRandRgbaColor = function getRandRgbaColor() {
    return `rgba(${window.getRandInt(0, 255)}, ${window.getRandInt(0, 255)}, ${window.getRandInt(0, 255)}`;
  }

  window.getElemCoords = function getElemCoords(elem) {
    var coordsObj = elem.getBoundingClientRect();

    return {
      left: coordsObj.left,
      top: coordsObj.top
    }
  }

  window.debounce = function debounce(action, delayTime) {
    clearTimeout(window.debounceTimer);

    window.debounceTimer = setTimeout(() => {
      action();
    }, delayTime);
  }

  window.hideItem = function hideItem(el) {
    el.classList.add('hidden');
  }

  window.showItem = function showItem(el) {
    el.classList.remove('hidden');
  }
}());
