export class LazyLoadConfig {
  constructor (source, loadingType, galleryClass, isSupport, a, b) {
    this.source = source;
    this.loadingType = loadingType;
    this.galleryClass = galleryClass;
    this.isSupport = isSupport;
    // this.a = a;
    // this.b = b;
  }

  onLazyloadCheck() {
      if ('loading' in HTMLImageElement.prototype) {
        // if (this.a !== this.b) {
          console.log('Браузер поддерживает lazyload');
          return {
            source: 'src',
            loadingType: 'loading="lazy"',
            galleryClass: 'gallery__image',
            isSupport: true,
          }
          // addSrcAttrToLazyImages();
        } else {
          console.log('Браузер НЕ поддерживает lazyload');
      
          import('lazysizes');
          // ref.searchSection.style.backgroundColor = '#d0ebca';
      
          return {
            source: 'data-src',
            loadingType: '',
            galleryClass: 'lazyload gallery__image',
            isSupport: false,
          }
        }
  } 
};