/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

'use strict';

(function serverOperations() {
  window.load = function load(url, onLoad, onError) {
    var xml = new XMLHttpRequest();

    function timeoutHandler() {
      console.error(`The request took more than ${this.timeout} ms.`);
    }

    function errorHanler() {
      onError('Connection lost');
    }

    function loadHandler() {
      var errMessage;

      switch (xml.status) {
        case 200:
          onLoad(xml.response);
          break;
        case 400:
          errMessage = 'Wrong request';
          break;
        case 401:
          errMessage = 'User has not authorized';
          break;
        case 404:
          errMessage = 'Not found';
          break;
        default:
          errMessage = `Unknown status ${xml.status}: ${xml.statusText}.`;
      }

      if (errMessage) {
        onError(errMessage);
      }
    }

    xml.timeout = 8000;
    xml.open('GET', url);
    xml.send();

    xml.addEventListener('timeout', timeoutHandler);
    xml.addEventListener('error', errorHanler);
    xml.addEventListener('load', loadHandler);
  };
}());
