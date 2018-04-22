'use strict';

(function avatarLoader() {
  var noticePhoto = document.querySelector('.notice__photo'),
      avatarDropZone = noticePhoto.querySelector('.drop-zone'),
      imgInput = noticePhoto.querySelector('#avatar'),
      formAvatar = noticePhoto.querySelector('img'),
      mapAvatar = window.map.querySelector('.map__pin--main img');

  function insertImg(imgElem, imgFile) {
    imgElem.setAttribute('src', event.target.result);
    imgElem.setAttribute('title', imgFile.name);
  }

  function loadHandler(file) {
    function innerLoadHandler(event) {
      insertImg(mapAvatar, file);
      insertImg(formAvatar, file);
    }

    return innerLoadHandler
  }

  function errorHandler(event) {
    alert(`Something went wrong, buddy. Error code: ${event.target.error.code}`);
  }

  function onInputFileChangeHandler(ev) {
    var file = ev.target.files[0];

    if (file) {
      if (!file.type.match('image.*')) {
        return;
      }
      let reader = new FileReader();

      reader.addEventListener('load', loadHandler(file));
      reader.addEventListener('error', errorHandler)
      reader.readAsDataURL(file);
    }
  }

  function onLabelDropHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var file = evt.dataTransfer.files[0];

    if (file) {
      if (!file.type.match('image.*')) {
        return;
      }
      let reader = new FileReader();

      reader.addEventListener('load', loadHandler(file));
      reader.addEventListener('error', errorHandler)
      reader.readAsDataURL(file);
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  imgInput.addEventListener('change', onInputFileChangeHandler, false);
  avatarDropZone.addEventListener('drop', onLabelDropHandler, false);
  avatarDropZone.addEventListener('dragover', handleDragOver, false);
}());
