
// const axios = require('axios');
const axios = require('axios').default;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';



// ========= 

import 'lazysizes';// піздніше додати до умови непідтримки

if ('loading' in HTMLImageElement.prototype) {// https://youtu.be/kxwN7eXBNDQ?t=1h9m35s
  console.log('Браузер поддерживает lazyload');
  // addSrcAttrToLazyImages();
} else {
  console.log('Браузер НЕ поддерживает lazyload');
  // addLazySizesScript();
};




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
};

const onClick = {
  image(event) {
    event.preventDefault();
    // console.log(event.target.alt);
  },
  
  loadMoreButton (event) {
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

  const str = await display.stringToDisplay(dataArray);
  // console.log(typeof str);

  ref.gallerySet.insertAdjacentHTML('beforeend', await display.stringToDisplay(dataArray));

  // ref.gallerySet.append(...str);//append

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

loadConfig = {
  source: 'src',
  loadingType: 'loading="lazy"',
  class: '',
}

loadConfig2 = {
  source: 'data-src',
  loadingType: '',
  class: ' lazyload',
}

const display = {

  loadConf: loadConfig2,

  async stringToDisplay(dataArray) {
    try {
   const arrayData = await dataArray.data.hits.map(
    ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => /* { */
      `<div class="photo-card">
        <a href="${largeImageURL}" class="gallery__item">
          <img class="gallery__image${this.loadConf.class}" 
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

    //   const cardDiv = document.createElement('div');
    //   cardDiv.classList.add('photo-card')

    //   const aHref = document.createElement('a');
    //   aHref.href = largeImageURL;
    //   aHref.classList.add('gallery__item');

    //   const img = document.createElement('img');
    //   img.classList.add('gallery__image');
    //   img.classList.add('lazyload');
    //   // img.loading = 'lazy';
    //   // img.src = webformatURL;
    //   img.setAttribute('data-src', webformatURL);
    //   img.alt = tags;
      
    //   aHref.append(img);

    //   const infoDiv = document.createElement('div');
    //   infoDiv.classList.add('info');

    //   const pLikes = document.createElement('p');
    //   pLikes.classList.add('info-item');
    //   const bLikes = document.createElement('b');
    //   bLikes.textContent = 'Likes';
    //   pLikes.append(bLikes, likes);

    //   const pViews = document.createElement('p');
    //   pViews.classList.add('info-item');
    //   const bViews = document.createElement('b');
    //   bViews.textContent = 'Views';
    //   pViews.append(bViews, views);

    //   const pComments = document.createElement('p');
    //   pComments.classList.add('info-item');
    //   const bComments = document.createElement('b');
    //   bComments.textContent = 'Comments';
    //   pComments.append(bComments, comments);

    //   const pDownloads = document.createElement('p');
    //   pDownloads.classList.add('info-item');
    //   const bDownloads = document.createElement('b');
    //   bDownloads.textContent = 'Downloads';
    //   pDownloads.append(bDownloads, downloads);

    //   infoDiv.append(pLikes, pViews, pComments, pDownloads);
    //   cardDiv.append(aHref, infoDiv);
    //   return cardDiv;
    // }
  );
    // const ttt = await arrayData;
    // console.log(...ttt);
  const stringData = await arrayData.join('');
  // const stringData = await arrayData;//append
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
    top: ((Math.floor(window.innerHeight / cardHeight) - 1) * cardHeight),
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
  perPage: 40,

  async find () {
    if (this.querryString === '') {
      display.clearGallery();
      display.loadMoreButtonVisibility(false);
      this.previousSearch = '';
      return Notify.failure(`please input what you want to search!`);
    }

    if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
      return Notify.success(`To show more click "Load more" downside button or change search querryy please`);
    }

    if (this.previousSearch !== '' && this.previousSearch !== this.querryString) {
      this.page = 1;
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

