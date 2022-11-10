
// https://dev.to/dcodeyt/create-a-button-with-a-loading-spinner-in-html-css-1c0h

// + todo: move spinner and disable button to class!
// + todo: "adaptive" lazyload - write class_doc // refactor code
// + todo: add card nums on mobile display
    // https://stackdiary.com/detect-mobile-browser-javascript/
// todo: add handlebars
  //https://www.npmjs.com/package/handlebars
  //https://www.npmjs.com/package/parcel-plugin-handlebars-precompile
// todo: lazysizes refactor code with handlebars

// todo afterAll - refactore code


// const axios = require('axios');
const axios = require('axios').default;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { LazyLoadConfig } from "./lazyloadconfig-class.js";
import { ButtonSpinner } from "./button-spinner-class.js";
const lazyLoadConfig = new LazyLoadConfig;


const supportsLazyLoad = ('loading' in document.createElement('img'));
console.log("🚀 ~ supportsLazyLoad", supportsLazyLoad)


//// for test
// const refTestString = document.querySelector('#test_string');
// console.log(refTestString);
// refTestString.textContent = 'lalala'
//// for test

function perPageValue() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
    return 16;
  };
  return 40;
} 



Notify.init({
  width: 400,
  position:  'right-top',
  distance: '10px',
  opacity: 0.7,
  clickToClose: true,
  fontSize:'14px',
});

const ref = {
  searchButton: document.querySelector('.search-form'),
  gallerySet: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('button.load-more'),
  searchSection: document.querySelector('.search-section'),
};



const loadmoreBtnSpinner = new ButtonSpinner(ref.loadMoreButton);

const onClick = {
  image(event) {
    event.preventDefault();
    // console.log(event.target.alt);
  },
  
  loadMoreButton (event) {
    // loadMoreButtonSpinner.start();////
    loadmoreBtnSpinner.start();
    findImagesService.setPage();
    findImagesService.find();    
  },

  async onSearchButtonClick(event) {
    event.preventDefault();

    const querryString = await event.currentTarget.elements.searchQuery.value;
  
    findImagesService.querryString = querryString;
    await findImagesService.find();
  },
};

const on = {
  searchButton: ref.searchButton.addEventListener('submit', onClick.onSearchButtonClick),
  image: ref.gallerySet.addEventListener('click', onClick.image),
  loadMoreButton: ref.loadMoreButton.addEventListener('click', onClick.loadMoreButton),
};


async function onGetValidData(dataArray, currentPage, perPage) {
  const totalHits = dataArray.data.totalHits;
  const totalPages = Math.ceil(totalHits / perPage);

  if (totalHits === 0) {
    return Notify.failure(`Sorry, there are no images matching your search querry. Please try again`);
  };

  // const str = await display.stringToDisplay(dataArray);

  ref.gallerySet.insertAdjacentHTML('beforeend', await display.stringToDisplay(dataArray));

  if (currentPage === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);

      sLightBox.init()
  } else {
    sLightBox.refresh();
    display.smoothScroll();
  }

  if ( totalPages !== currentPage) {
    return display.loadMoreButtonVisibility(true);
    } 
  display.loadMoreButtonVisibility(false);

  if (currentPage !== 1) {
  Notify.failure("We're sorry, but you've reached the end of search results.");
  }
};



const display = {

  loadConf: lazyLoadConfig.onLazyloadCheck(),
  

  async stringToDisplay(dataArray) {
    try {
      console.log("🚀 ~ loadConf", this.loadConf)
      if (this.loadConf.isSupport === false) {
        ref.searchSection.style.backgroundColor = '#d0ebca';
      }
   const arrayData = await dataArray.data.hits.map(
    ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => /* { */
      `<div class="photo-card">
        <a href="${largeImageURL}" class="gallery__item">
          <img class="${this.loadConf.galleryClass}" 
            ${this.loadConf.source}="${webformatURL}" 
            alt="${tags}" ${this.loadConf.loadingType}
            />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>
      `
  );
  const stringData = await arrayData.join('');
  return stringData;
   } catch (error) {
    console.log(error.message);
   }
  },

  smoothScroll() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    // top: cardHeight * 2,
    // top: ((Math.floor(window.innerHeight / cardHeight) - 1) * cardHeight),// якщо треба автоскрол із одним загальним рядком
    top: ((Math.floor(window.innerHeight / cardHeight) - 0.8) * cardHeight),    
    // top: ((Math.floor(window.innerHeight / cardHeight)) * cardHeight),
    behavior: "smooth",
    });  
  },

  clearGallery() {
    return ref.gallerySet.innerHTML = '';
  },

  loadMoreButtonVisibility(isHaveToVisible) {
    if (isHaveToVisible) {
      return ref.loadMoreButton.style.display = 'inline-block';
    };
    ref.loadMoreButton.style.display = 'none';
  }
};


const findImagesService = {

  page: 1,
  querryString: '',
  previousSearch: '',
  prevoiusPage: NaN,
  // perPage: 40,
  perPage: perPageValue(),

  async find () {
    if (this.querryString === '') {
      
      display.loadMoreButtonVisibility(false);
      display.clearGallery();
      this.previousSearch = '';
      return Notify.failure(`please input what you want to search!`);
    }

    if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
      return Notify.success(`To show more click "Load more" downside button or change search querryy please`);
    }

    if (this.previousSearch !== '' && this.previousSearch !== this.querryString) {
      this.page = 1;
      display.loadMoreButtonVisibility(false);
      display.clearGallery();
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

    loadmoreBtnSpinner.stop();

  },

  setPage () {
    this.page += 1;
  },
}


const sLightBox = {

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

}



// =============
// function lazyLoadConfig() {
// const a = 1;
// const b = 1;

//   // if ('loading' in HTMLImageElement.prototype) {
//     if (a !== b) {
//     console.log('Браузер поддерживает lazyload');
//     return {
//       source: 'src',
//       loadingType: 'loading="lazy"',
//       galleryClass: 'gallery__image',
//     }
//     // addSrcAttrToLazyImages();
//   } else {
//     console.log('Браузер НЕ поддерживает lazyload');

//     import('lazysizes');
//     ref.searchSection.style.backgroundColor = '#d0ebca';

//     return {
//       source: 'data-src',
//       loadingType: '',
//       galleryClass: 'lazyload gallery__image',
//     }
//   }
// };
