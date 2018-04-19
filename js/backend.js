/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

'use strict';

(function serverOperations() {
  window.load = function load(url, onLoad, onError) {
    var xml = new XMLHttpRequest();

    function timeoutHandler() {
      console.error(`The request took more than ${xml.timeout} ms.`);
    }

    function errorHanler() {
      onError('Connection lost');
    }

    function loadHandler() {
      var response = JSON.parse(xml.response),
          errMessage;

      switch (xml.status) {
        case 200:
          onLoad(response);
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

    xml.timeout = 10000;
    xml.addEventListener('timeout', timeoutHandler);
    xml.addEventListener('error', errorHanler);
    xml.addEventListener('load', loadHandler);
    xml.open('GET', url, false);

    xml.send();

  };

  window.save = function save(url, data, onLoad, onError) {
    var xml = new XMLHttpRequest();

    function timeoutHandler() {
      console.error(`The request took more than ${xml.timeout} ms.`);
    }

    function errorHanler() {
      onError('Connection lost');
    }

    function loadHandler() {
      var errMessage;

      switch (xml.status) {
        case 200:
          onLoad();
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

    xml.timeout = 10000;
    xml.open('POST', url, true);
    xml.addEventListener('timeout', timeoutHandler);
    xml.addEventListener('error', errorHanler);
    xml.addEventListener('load', loadHandler);

    xml.send(data);
  }
}());
