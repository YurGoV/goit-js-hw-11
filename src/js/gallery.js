
// https://dev.to/dcodeyt/create-a-button-with-a-loading-spinner-in-html-css-1c0h

  //https://www.npmjs.com/package/handlebars
  //https://www.npmjs.com/package/parcel-plugin-handlebars-precompile // не працює, збиває інші модулі!!!
  // https://www.npmjs.com/package/parcel-transformer-hbs // parcel-transformer-hbs // встановлено цей (додатково згідно доків змінити .parcelrc)
  // https://youtu.be/Fh8d14cY9AM?t=56m15s // пояснення щодо шаблону

// має бути встановлена та підключена бібліотека lazysizes:
// https://www.npmjs.com/package/lazysizes

// import { LazyLoadConfig } from "./lazyloadconfig-class.js";
// розмітка img:
//   натівна lazyload:  <img src="" alt="" loading="lazy" />
//   згідно lazysizes: <img data-src="image.jpg" class="lazyload" />
//   є підтримка рпспонсивного обчислення розмірів картинки, розібратися


// todo afterAll - refactore code

// const axios = require('axios');
const axios = require('axios').default;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// import { LazyLoadConfig } from "./lazyloadconfig-class.js";
import { ButtonSpinner } from "./button-spinner-class.js";
// const lazyLoadConfig = new LazyLoadConfig;/////

// const templatePath = isLazySupportCardsTemplate().toString();
// console.log(templatePath);

import cardsTemplateFunc from '../templates/gallery-cards.hbs';
import lazyCardsTemplateFunc from '../templates/gallery-cards-lazysizes.hbs';



function isLazySupportCardsTemplate() {
  if ('loading' in document.createElement('img')) {//дубль 32-33ї
    return cardsTemplateFunc;
  } 
  return lazyCardsTemplateFunc;
}

// async function isLazySupportCardsTemplate2() {
//   if ('loading' in document.createElement('img')) {//дубль 32-33ї
//     await import(cardsTemplateFunc2).then(path => '../templates/gallery-cards-copy.hbs');
//     // return await import('../templates/gallery-cards.hbs')
//     // let cardsTemplateFunc2 = await import('../templates/gallery-cards-copy.hbs');
//     // console.log(cardsTemplateFunc2);
//     return cardsTemplateFunc2;
//   }
//   return lazyCardsTemplateFunc;
// }
// isLazySupportCardsTemplate2().then(res => console.log(res))


// let cardsTemplateFunc2 = await import('../templates/gallery-cards.hbs')

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

function onLazyloadSupportCheck() {
  if (!('loading' in document.createElement('img'))) {//дубль 32-33ї
    Notify.success(`lazysizes library was loaded!`);
    // ref.searchSection.style.backgroundColor = '#d0ebca';
    import('lazysizes');
  } 
};
onLazyloadSupportCheck();

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
    return Notify.failure(`Вибачте, немає зображень за таким запитом, Спробуйте ще`);
  };

  // const str = await display.stringToDisplay(dataArray);

  ref.gallerySet.insertAdjacentHTML('beforeend', await display.stringToDisplay(dataArray));

  if (currentPage === 1) {
    Notify.success(`Так! Ми знайшли ${totalHits} зображень.`);

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
  Notify.failure("На жаль, ви дійшли до кінця результату пошуку.");
  }
};

const display = {

  // loadConf: lazyLoadConfig.onLazyloadCheck(),
  
  async stringToDisplay(dataArray) {
    try {
      // console.log("🚀 ~ loadConf", this.loadConf)
      // if (this.loadConf.isSupport === false) {
      //   ref.searchSection.style.backgroundColor = '#d0ebca';
      // }
  
      // return await dataArray.data.hits.map(await isLazySupportCardsTemplate2());//генеруємо розмітку з шаблона 
      return await dataArray.data.hits.map(isLazySupportCardsTemplate()).join('');
  // або:
  // return await dataArray.data.hits.map(card => isLazySupportCardsTemplate()(card)).join('');//біль "початківський" запис

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
      return Notify.failure(`будь ласка введіть, що ви хочете знайти!`);
    }

    if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
      return Notify.success(`Щоб побачити більше - тисніть "Завантажити ще" внизу або введіть інший запит`);
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
