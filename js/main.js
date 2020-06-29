import images from './gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  largeImage: document.querySelector('.lightbox__image'),
  closeButton: document.querySelector('button[data-action="close-lightbox"]'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
};

// Создание и рендер разметки по массиву данных и предоставленному шаблону

const createGallery = images => {
  const arrItems = images.map(image => {
    const galleryItemRef = document.createElement('li');
    galleryItemRef.classList.add('gallery__item');

    const galleryLinkRef = document.createElement('a');
    galleryLinkRef.classList.add('gallery__link');
    galleryLinkRef.setAttribute('href', image.original);
    galleryItemRef.append(galleryLinkRef);

    const galleryImageRef = document.createElement('img');
    galleryImageRef.classList.add('gallery__image');
    galleryImageRef.setAttribute('src', image.preview);
    galleryImageRef.setAttribute('data-source', image.original);
    galleryImageRef.setAttribute('alt', image.description);
    galleryLinkRef.append(galleryImageRef);

    return galleryItemRef;
  });

  refs.gallery.append(...arrItems);
};

createGallery(images);

// Релизация делегирования на галерее URL.js-gallery и получение url большого изображения

refs.gallery.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  event.preventDefault();

  const largeImageURL = event.target.dataset.source;

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  window.addEventListener('keydown', onPressButton);
  refs.modal.classList.add('is-open'); // Открытие модального окна по клику на элементе галереи.

  setLargeImgSrc(largeImageURL);
}

// Подмена значения атрибута src элемента img.lightbox__image.

function setLargeImgSrc(url) {
  refs.largeImage.src = url;
}

// Закрытие модального окна по клику на кнопку button[data-action="close-modal"].

refs.closeButton.addEventListener('click', onCloseModal);
refs.lightboxOverlay.addEventListener('click', onOverlayClick);

function onCloseModal() {
  window.removeEventListener('keydown', onPressButton);
  refs.modal.classList.remove('is-open');

  refs.largeImage.src = ''; //Очистка значения атрибута src элемента img.lightbox__image.
}

// По клику на серый Оверлей

function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

// По клику на ESC и по клику на стрелки Право-Лево

function onPressButton(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }

  if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
    handlePressArrow(event.code);
  }
}

function handlePressArrow(code) {
  let newIndex;

  const index = images.findIndex(
    image => image.original === refs.largeImage.src,
  );

  if (index === -1) {
    return;
  }

  if (code === 'ArrowRight') {
    if (images.length === index + 1) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }
  }

  if (code === 'ArrowLeft') {
    if (index === 0) {
      newIndex = images.length - 1;
    } else {
      newIndex = index - 1;
    }
  }

  refs.largeImage.src = images[newIndex].original;
}
