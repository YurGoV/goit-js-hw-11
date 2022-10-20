
// const axios = require('axios');
const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  width: notifySetup().width,
  position: notifySetup().position,
  distance: '10px',
  opacity: 0.7,
  clickToClose: true,
  fontSize: notifySetup().fontSize,
});

const ref = {
  searchButton: document.querySelector('.search-form'),
  gallerySet: document.querySelector('.gallery'),
  nextPageButton: document.querySelector('button.load-more'),
}

console.log(ref.searchButton);
console.log(ref.gallerySet);
console.log(ref.nextPageButton);

const onSearchButton = ref.searchButton.addEventListener('submit', onSearchButtonClick);
const onImage = ref.gallerySet.addEventListener('click', onImageClick);
const onNextPageButton = ref.nextPageButton.addEventListener('click', onNextPageButtonClick)

function onImageClick(event) {
  console.log(event.target.alt);
}

function onNextPageButtonClick(event) {
  console.log('search');
  fingImagesService.setPage();
  fingImagesService.find();
}

// ===
// const picturesSearch = {

//   onSearch


// }

const fingImagesService = {

  page: 1,
  querryString: '',
  previousSearch: '',
  prevoiusPage: NaN,


  find () {

    
  if (this.querryString === '') {
    return Notify.failure(`please input what you want to search!`);
  }

  console.log(this.querryString);

  if (this.previousSearch !== '' && this.previousSearch !== this.querryString) {
    console.log('!==');
    this.page = 1;
    clearGallery();
  }

  if (this.prevoiusPage === this.page && this.previousSearch === this.querryString) {
    return Notify.success(`To show more press "Load more" downside button or change search querryy please`);
  }
    
  // this.querryString = ''

    const querry = axios.get('https://pixabay.com/api/', {
      params: {
        key:'30695501-7cf0afb8f69a77a083ed747e6',
        q: this.querryString,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      }
    })
    .then(function (response) {
      onGetValidData(response)
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



// console.log(typeof querry);




function onSearchButtonClick(event) {
  event.preventDefault();
  
  console.log(event.currentTarget.elements.searchQuery.value);
  const querryString = event.currentTarget.elements.searchQuery.value;

    // fingImagesService.find(querryString);
    fingImagesService.querryString = querryString;
  fingImagesService.find();



};



function onGetValidData(dataArray) {
  // console.log(dataArray);
  const totalHits = dataArray.data.totalHits;

  if (totalHits === 0) {
    console.log(totalHits);
    return Notify.failure(`Sorry, there are no images matching your search querry. Please try again`);
  };

  Notify.success(`Horray! We found ${totalHits} images.`);
  // console.log(dataArray);
  // ttt = dataArray.data.hits;

  const stringToDisplay = dataArray.data.hits.map(
    ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
  `<div class="photo-card">
    <img class="gallery__image" 
      src="${webformatURL}" 
      alt="" loading="lazy" 
      data-large-image="${largeImageURL}"/>
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

}

function clearGallery() {
  ref.gallerySet.innerHTML = '';
}

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
    // console.log(notifySetup().fontSize);

// access to large image link:  /listener/dataset.largeImage


// onImageClick('yellow+flowers');

// async function onImageClick(request) {
//   event.preventDefault()
//   try {
//     request.preventDefault()
//     const response = await axios.get('https://pixabay.com/api/', {
//       params: {
//         key:'30695501-7cf0afb8f69a77a083ed747e6',
//         q: request,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         per_page: 40
//       }
//     });
//     response.preventDefault()
//     console.log(response.data.hits);
//     console.log(response.data.hits);
//   } catch (error) {
//     console.error(error);
//   }
// }

// onImageClick('yellow+flowers');



// querry ({id, webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
//   console.log(id);
// }

// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";

// const galleryCards = galleryItems.map(({description, original, preview}) => 
//   `<a class="gallery__item" href="${original}">
//   <img 
//     class="gallery__image"
//     src="${preview}"
//     alt="${description}"
//   />
// </a>`)
// .join("");


// const refGallery = document.querySelector('.gallery')// шукаємо дів-ку
// // console.log(refGallery);

// refGallery.insertAdjacentHTML('beforeend', galleryCards)// аджастимо галерею в ДОМ

// refGallery.addEventListener('click', openModal);//Додаємо слухача на gallery (галарею в цілому), та виклик SimpleLightbox


// function openModal(event) {
//     event.preventDefault();//не даємо відкриватися імг-шці за замовченням
// }

// let lightbox = new SimpleLightbox('.gallery a', {// ініціалізуємо SimpleLightbox
//     // captions: true,//by default
//     captionsData: 'alt',
//     captionDelay: 250,
//     // captionPosition: 'bottom',//by default
// });


// const searchButton = document.querySelector('.search-form');
// const querry = searchButton.querySelector('submit', onImageClick);


// const querry = axios.get('https://pixabay.com/api/', {
//   params: {
//     key:'30695501-7cf0afb8f69a77a083ed747e6',
//     q: 'yellow+flowers',
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: 40
//   }
// })
// .then(function (response) {
//   console.log(response.data.hits);
//   console.log(response.data.totalHits);
// })
// // .then(onResponse(response))
// // .catch(function (error) {
// //   console.log(error);
// // })
// .then(function () {
//   // always executed
// }); 

// console.log(typeof querry);