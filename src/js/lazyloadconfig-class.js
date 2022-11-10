export class LazyLoadConfig {
  constructor (source, loadingType, galleryClass, isSupport, a, b) {
    this.source = source;
    this.loadingType = loadingType;
    this.galleryClass = galleryClass;
    this.isSupport = isSupport;
  }

  onLazyloadCheck() {
      if ('loading' in HTMLImageElement.prototype) {
          // console.log('Браузер поддерживает lazyload');
          return {
            source: 'src',
            loadingType: 'loading="lazy"',
            galleryClass: 'gallery__image',
            isSupport: true,
          }
        } else {
          // console.log('Браузер НЕ поддерживает lazyload');
          import('lazysizes');
          return {
            source: 'data-src',
            loadingType: '',
            galleryClass: 'lazyload gallery__image',
            isSupport: false,
          }
        }
  } 
};

// має бути встановлена та підключена бібліотека lazysizes:
// https://www.npmjs.com/package/lazysizes

// import { LazyLoadConfig } from "./lazyloadconfig-class.js";
// розмітка img:
//   натівна lazyload:  <img src="" alt="" loading="lazy" />
//   згідно lazysizes: <img data-src="image.jpg" class="lazyload" />
//   є підтримка рпспонсивного обчислення розмірів картинки, розібратися


