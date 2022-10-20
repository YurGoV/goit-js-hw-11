
// const axios = require('axios');
const axios = require('axios').default;

const ref = {
  searchButton: document.querySelector('.search-form'),
  gallerySet: document.querySelector('.gallery'),
}

console.log(ref.searchButton);
console.log(ref.gallerySet);

const querry = ref.searchButton.addEventListener('submit', getPictures);
const clk = ref.gallerySet.addEventListener('click', onClick);

function onClick(event) {
  console.log(event.target.alt);
}


// // ===
// const picturesSearch = {

//   onSearch






// }


function getPictures(event) {
  event.preventDefault();
  // console.log('ddd');
  console.log(event.currentTarget.elements.searchQuery.value);
  const querryString = event.currentTarget.elements.searchQuery.value;

  const querry = axios.get('https://pixabay.com/api/', {
      params: {
        key:'30695501-7cf0afb8f69a77a083ed747e6',
        q: querryString,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40
      }
    })
    .then(function (response) {
      onGetValidData(response)
    //   // return response;
    //   console.log(response.data.totalHits);
    //   console.log(response.data.hits);
    })
    // .then(onGetValidData(event))
    // // .catch(function (error) {
    // //   console.log(error);
    // // })
    .then(function () {
      // always executed
    });

    console.log(typeof querry);
};



function onGetValidData(dataArray) {
  console.log(dataArray);
  console.log(dataArray.data.totalHits);
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

  ref.gallerySet.insertAdjacentHTML('beforeend', stringToDisplay)
  // console.log(stringToDisplay);
  
  
 //array of pictures

}

// access to large image link:  /listener/dataset.largeImage


// getPictures('yellow+flowers');

// async function getPictures(request) {
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

// getPictures('yellow+flowers');



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
// const querry = searchButton.querySelector('submit', getPictures);


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