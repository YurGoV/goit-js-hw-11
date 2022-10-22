
// const axios = require('axios');
const axios = require('axios').default;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
    console.log(event.target.alt);
  },
  
  loadMoreButton (event) {
    console.log('search');
    findImagesService.setPage();
    findImagesService.find();    
  },

  async onSearchButtonClick(event) {
    event.preventDefault();
    
    console.log(event.currentTarget.elements.searchQuery.value);
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
    console.log(totalHits);
    return Notify.failure(`Sorry, there are no images matching your search querry. Please try again`);
  };

  const str = await display.stringToDisplay(dataArray);

  ref.gallerySet.insertAdjacentHTML('beforeend', await display.stringToDisplay(dataArray));

  if (currentPage === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);

      sLightBox.init()
      console.log('aaaaa');
  } else {
    console.log('bbbbb');
    sLightBox.refresh();
    display.smoothScroll();
  }

  if ( totalPages !== currentPage) {
    return display.loadMoreButtonVisibility(true);
    } 
  display.loadMoreButtonVisibility(false);
  Notify.failure("We're sorry, but you've reached the end of search results.");
};

const display = {

  async stringToDisplay(dataArray) {
    try {
   const arrayData = await dataArray.data.hits.map(
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
  
    console.log(`doc.h ${cardHeight}`);
    console.log(window.innerHeight);
    console.log(Math.floor(window.innerHeight / cardHeight));
  
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

    console.log(this.querryString);

    if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
      return Notify.success(`To show more press "Load more" downside button or change search querryy please`);
    }

    if (this.previousSearch !== '' && this.previousSearch !== this.querryString) {
      console.log('!==');
      this.page = 1;
      display.clearGallery();
    }

    const currentPage = this.page;
    console.log(`111111 ${currentPage}`);
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
      return res = await onGetValidData(querry, currentPage, perPage);
      } catch (error) {
        console.log(error.message);
      }
    };
    await querry();


    console.log(`displaying page: ${this.page}`);
    console.log(`displaying prevPage: ${this.prevoiusPage}`);
    console.log(`searchin QS: ${this.querryString}`);
    console.log(`previous QS: ${this.previousSearch}`);

    this.previousSearch = this.querryString;
    this.prevoiusPage = this.page;

  },

  setPage () {
    this.page += 1;
    console.log(this.page);
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

