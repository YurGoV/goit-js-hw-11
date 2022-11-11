import axios from 'axios';// const axios = require('axios').default;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ButtonSpinnerAndVisibility } from "./button-spinner-class.js";
import cardsTemplateFunc from '../templates/gallery-cards.hbs';
import lazyCardsTemplateFunc from '../templates/gallery-cards-lazysizes.hbs';
import { notifyParams } from './notify-responsive-config.js';

const ref = {
  searchButton: document.querySelector('.search-form'),
  gallerySet: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('button.load-more'),
  searchSection: document.querySelector('.search-section'),
};

const on = {
  searchButton: ref.searchButton.addEventListener('submit', onSearchButtonClick),
  image: ref.gallerySet.addEventListener('click', onImageClick),
  loadMoreButton: ref.loadMoreButton.addEventListener('click', onLoadMoreButtonClick),
};

// CHECK AND SETUP SECTION START
const isLazyLoadNativeSupport = 'loading' in document.createElement('img');//чи підтримує браузер lazyload

const nofifyConfig = notifyParams.setParams();
Notify.init(nofifyConfig);

function perPageValue() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
    return 16;
  };
  return 40;
};

function onLazyloadSupportCheck() {
  if (!isLazyLoadNativeSupport) {
    Notify.success(`lazysizes library was loaded!`);
    import('lazysizes');
  } 
};

onLazyloadSupportCheck();

const simplLightBox = {
  init(){
    this.lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    close: false,
    showCounter: false,
  });
  },

  refresh() {
    this.lightbox.refresh();
  }
};

const loadmoreBtn = new ButtonSpinnerAndVisibility(ref.loadMoreButton);
// CHECK AND SETUP SECTION END

// ON CLICK FUNCTIONS START
 function onImageClick(event) {
    event.preventDefault();
  };
  
  function onLoadMoreButtonClick (event) {
    loadmoreBtn.spinnerStart();
    findImagesService.setPage();
    findImagesService.find();    
  };

  async function onSearchButtonClick(event) {
    event.preventDefault();

    const querryString = await event.currentTarget.elements.searchQuery.value;
  
    findImagesService.querryString = querryString;
    await findImagesService.find();
  };
// ON CLICK FUNCTIONS END

const findImagesService = {
  page: 1,
  querryString: '',
  previousSearch: '',
  prevoiusPage: NaN,
  perPage: perPageValue(),

  async find () {
    if (this.querryString === '') {
      loadmoreBtn.isVisible(false);
      clearGallery();
      this.previousSearch = '';
      return Notify.failure(`будь ласка введіть, що ви хочете знайти!`);
    }
    if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
      return Notify.success(`Щоб побачити більше - тисніть "Завантажити ще" внизу або введіть інший запит`);
    }
    if (this.previousSearch !== '' && this.previousSearch !== this.querryString) {
      this.page = 1;
      loadmoreBtn.isVisible(false);
      clearGallery();
    }

    const currentPage = this.page;
    const perPage = this.perPage;
    const querryString = this.querryString

    async function querry() {
      try {
      const querry = await axios.get('https://pixabay.com/api/', {
       params: {
        key:'30695501-7cf0afb8f69a77a083ed747e6',
        q: querryString,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
        }
        });
      return await onGetValidData(querry, currentPage, perPage);
      } catch (error) {
        console.log(error.message);
      }
    };
    await querry();

    this.previousSearch = this.querryString;
    this.prevoiusPage = this.page;

    loadmoreBtn.spinnerStop();
  },

  setPage () {
    this.page += 1;
  },
};

async function onGetValidData(dataArray, currentPage, perPage) {
  const totalHits = dataArray.data.totalHits;
  const totalPages = Math.ceil(totalHits / perPage);

  if (totalHits === 0) {
    return Notify.failure(`Вибачте, немає зображень за таким запитом, Спробуйте ще`);
  };

  ref.gallerySet.insertAdjacentHTML('beforeend', await stringToDisplay(dataArray));

  if (currentPage === 1) {
    Notify.success(`Так! Ми знайшли ${totalHits} зображень.`);
    simplLightBox.init()
  } else {
    simplLightBox.refresh();
    smoothScroll();
  }

  if ( totalPages !== currentPage) {
    return loadmoreBtn.isVisible(true);
    } 
  loadmoreBtn.isVisible(false);

  if (currentPage !== 1) {
  Notify.failure("На жаль, ви дійшли до кінця результату пошуку.");
  }
};

// DISPLAY FUNCTIONS START
async function stringToDisplay(dataArray) {
  try {
    return await dataArray.data.hits.map(isLazySupportCardsTemplate()).join('');
 } catch (error) {
  console.log(error.message);
 }
};

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: ((Math.floor(window.innerHeight / cardHeight) - 0.8) * cardHeight),// top: ((Math.floor(window.innerHeight / cardHeight)) * cardHeight),
    behavior: "smooth",
  });  
};

function clearGallery() {
  return ref.gallerySet.innerHTML = '';
};

function isLazySupportCardsTemplate() {
  if (isLazyLoadNativeSupport) {
    return cardsTemplateFunc;
  } 
  return lazyCardsTemplateFunc;
}
// DISPLAY FUNCTIONS END
