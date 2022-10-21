
// const axios = require('axios');
const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const ref = {
  searchButton: document.querySelector('.search-form'),
  gallerySet: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('button.load-more'),
}

// console.log(ref.searchButton);
// console.log(ref.gallerySet);
// console.log(ref.loadMoreButton);

const onClick = {
  image(event) {
    event.preventDefault();
    console.log(event.target.alt);
  },
  
  loadMoreButton (event) {
    console.log('search');
    findImagesService.setPage();
    findImagesService.find();    
  }

}

const on = {
  searchButton: ref.searchButton.addEventListener('submit', onSearchButtonClick),
  // image: ref.gallerySet.addEventListener('click', onImageClick),
  image: ref.gallerySet.addEventListener('click', onClick.image),
  // loadMoreButton: ref.loadMoreButton.addEventListener('click', onloadMoreButtonClick),
  loadMoreButton: ref.loadMoreButton.addEventListener('click', onClick.loadMoreButton),
}

// const onSearchButton = ref.searchButton.addEventListener('submit', onSearchButtonClick);
// const onImage = ref.gallerySet.addEventListener('click', onImageClick);
// const onloadMoreButton = ref.loadMoreButton.addEventListener('click', onloadMoreButtonClick)

// function onImageClick(event) {
//   event.preventDefault();
//   console.log(event.target.alt);
// }



// function onloadMoreButtonClick(event) {
//   console.log('search');
//   findImagesService.setPage();
//   findImagesService.find();
// }



// ========
function onSearchButtonClick(event) {
  event.preventDefault();
  
  console.log(event.currentTarget.elements.searchQuery.value);
  const querryString = event.currentTarget.elements.searchQuery.value;

    // findImagesService.find(querryString);
  findImagesService.querryString = querryString;
  findImagesService.find();
};


function onGetValidData(dataArray, currentPage, perPage) {
  console.log(dataArray.data.total);
  console.log(`total data ${dataArray.data.total}`);
  const totalHits = dataArray.data.totalHits;
  console.log(`currentPage`);
  console.log(currentPage);
  console.log(`perPage`);
  console.log(perPage);
  const totalPages = Math.ceil(totalHits / perPage);
  console.log(`totalPages`);
  console.log(totalPages);

  if (totalHits === 0) {
    console.log(totalHits);
    return Notify.failure(`Sorry, there are no images matching your search querry. Please try again`);
  };

 

  const stringToDisplay = dataArray.data.hits.map(
    ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
      `<div class="photo-card">
        <a href="${largeImageURL}" class="gallery__item">
          <img class="gallery__image" 
            src="${webformatURL}" 
            alt="${tags}" loading="lazy"
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
  )
  .join('');

  ref.gallerySet.insertAdjacentHTML('beforeend', stringToDisplay);
  // ref.gallerySet.innerHTML = stringToDisplay;


  if (currentPage === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);

      lBox.init()
      console.log('aaaaa');
    // console.log(lightbox);
  } else {
    console.log('bbbbb');
    // console.log(lightbox);
    lBox.refresh()
  }

  
  smoothScroll();


  if ( totalPages !== currentPage) {
    return loadMoreButtonVisibility(true);
    } 
  loadMoreButtonVisibility(false);
  Notify.failure("We're sorry, but you've reached the end of search results.");
    
}

function clearGallery() {
  ref.gallerySet.innerHTML = '';
}



// ========


const findImagesService = {

  page: 1,
  querryString: '',
  previousSearch: '',
  prevoiusPage: NaN,
  perPage: 40,

  find () {
    if (this.querryString === '') {
      clearGallery();
      loadMoreButtonVisibility(false);
      return Notify.failure(`please input what you want to search!`);
    }

    console.log(this.querryString);

    if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
      return Notify.success(`To show more press "Load more" downside button or change search querryy please`);
    }

    if (this.previousSearch !== '' && this.previousSearch !== this.querryString) {
      console.log('!==');
      this.page = 1;
      clearGallery();
    }

    const currentPage = this.page;
    const perPage = this.perPage;

    const querry = axios.get('https://pixabay.com/api/', {
      params: {
        key:'30695501-7cf0afb8f69a77a083ed747e6',
        q: this.querryString,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.perPage,
      }
    })
    .then(function (response) {
      onGetValidData(response, currentPage, perPage)
    })
    .then(function () {
      // always executed
    });

    console.log(`displaying page: ${this.page}`);
    console.log(`displaying prevPage: ${this.prevoiusPage}`);
    console.log(`searchin QS: ${this.querryString}`);
    console.log(`previous QS: ${this.previousSearch}`);

    // this.querryString = querryString;
    // this.saveQuerryString()
    this.previousSearch = this.querryString;
    this.prevoiusPage = this.page;

  },

  setPage () {
    this.page += 1;
    console.log(this.page);
  },
}








function loadMoreButtonVisibility(isHaveToVisible) {
  if (isHaveToVisible) {
    return ref.loadMoreButton.style.display = 'inline-block';
  }

  ref.loadMoreButton.style.display = 'none';
}

const lBox = {

  lightbox: NaN,

  init(){
    this.lightbox = new SimpleLightbox('.photo-card a', {// ініціалізуємо SimpleLightbox
    // captions: true,//by default
    captionsData: 'alt',
    captionDelay: 250,
    close: false,
    showCounter: false,
    // captionPosition: 'bottom',//by default
  });
  },

  refresh() {
    this.lightbox.refresh();
  }

}

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  console.log(`doc.h ${cardHeight}`);
  console.log(window.innerHeight);
  console.log(Math.floor(window.innerHeight / cardHeight));

  window.scrollBy({
  // top: cardHeight * 2,
  top: ((Math.floor(window.innerHeight / cardHeight) - 1) * cardHeight),
  behavior: "smooth",
  });

  
}


Notify.init({
  width: notifySetup().width,
  position: notifySetup().position,
  distance: '10px',
  opacity: 0.7,
  clickToClose: true,
  fontSize: notifySetup().fontSize,
});

function notifySetup() {
  if (window.innerWidth >= 1100) {
      return {
      position: 'center-top',
      fontSize: '18px',
      width: '400px',
      }
  };
  return {
  fontSize: '14px',
  position: 'right-top',
  width: '280px',
  };
};

