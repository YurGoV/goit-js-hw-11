import { galleryItems } from './gallery-items.js';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryCards = galleryItems.map(({description, original, preview}) => 
  `<a class="gallery__item" href="${original}">
  <img 
    class="gallery__image"
    src="${preview}"
    alt="${description}"
  />
</a>`)
.join("");


const refGallery = document.querySelector('.gallery')// шукаємо дів-ку
// console.log(refGallery);

refGallery.insertAdjacentHTML('beforeend', galleryCards)// аджастимо галерею в ДОМ

refGallery.addEventListener('click', openModal);//Додаємо слухача на gallery (галарею в цілому), та виклик SimpleLightbox


function openModal(event) {
    event.preventDefault();//не даємо відкриватися імг-шці за замовченням
}

let lightbox = new SimpleLightbox('.gallery a', {// ініціалізуємо SimpleLightbox
    // captions: true,//by default
    captionsData: 'alt',
    captionDelay: 250,
    // captionPosition: 'bottom',//by default
});

