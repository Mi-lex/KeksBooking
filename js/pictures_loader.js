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

(function photoLoader() {
  var formPhotoContainer = document.querySelector('.form__photo-container'),
      photoInput = formPhotoContainer.querySelector('#images'),
      photoDropZone = formPhotoContainer.querySelector('.drop-zone');

  function renderPictures(files) {
    var photoContainer = document.createElement('DIV'),
        ImageParam = {
          alt: 'accommodation pictures',
          display: 'inline-block',
          height: '100px',
          margin: '5px'
        }
    photoContainer.classList.add('photo-container');
    photoContainer.style.width = "400px";
    // Доработать эту функцию. Создать элемент картинку, обработать и вставить
    function loadHandler(file) {
      function innerLoadHandler(event) {
        var imgElem = document.createElement('IMG');
        imgElem.setAttribute('alt', ImageParam.alt);
        imgElem.setAttribute('src', event.target.result);
        imgElem.setAttribute('title', file.name);
        imgElem.style.display = ImageParam.display;
        imgElem.style.height = ImageParam.height;
        imgElem.style.margin = ImageParam.margin;
        photoContainer.appendChild(imgElem);
      }

      return innerLoadHandler
    }

    function errorHandler(event) {
      alert(`Something went wrong, buddy. Error code: ${event.target.error.code}`);
    }

    for (let i = 0, file; file = files[i]; i++) {
      if (!file.type.match('image.*')) {
        return;
      }

      let reader = new FileReader();

      reader.addEventListener('load', loadHandler(file));
      reader.addEventListener('error', errorHandler);
      reader.readAsDataURL(file);
    }

    formPhotoContainer.appendChild(photoContainer);
  }

  function onInputFileChangeHandler(ev) {
    var files = ev.target.files;

    if (files) {
      renderPictures(files);
    }
  }

  function onLabelDropHandler(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var files = ev.dataTransfer.files;

    if (files) {
      renderPictures(files);
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  photoInput.addEventListener('change', onInputFileChangeHandler, false);
  photoDropZone.addEventListener('drop', onLabelDropHandler, false);
  photoDropZone.addEventListener('dragover', handleDragOver, false);
}());
