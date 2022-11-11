нативна підтримка:
атрибут зображення loading="lazy":
<img src="my-image.jpg" loading="lazy" alt="Image description" />

бібліотека lazysizes https://textbook.edu.goit.global/javascript-yk5evp/v2/uk/docs/lesson-14/lazy-load#%D0%B1%D1%96%D0%B1%D0%BB%D1%96%D0%BE%D1%82%D0%B5%D0%BA%D0%B0-lazysizes

https://www.npmjs.com/package/lazysizes
    npm i lazysizes
    import 'lazysizes';


розмітка для браузерів, що підтримують (без lazysizes):
<img src="image.jpg" loading="lazy" alt... href... /> //src... loading...

розмітка для браузерів, що не підтримують (із lazysizes):
<img data-src="image.jpg" class="lazyload" alt... href... />


перевірка чи підтримує браузер:
if ('loading' in HTMLImageElement.prototype) {// https://youtu.be/kxwN7eXBNDQ?t=1h9m35s
  console.log('Браузер поддерживает lazyload');
  // addSrcAttrToLazyImages();
} else {
  console.log('Браузер НЕ поддерживает lazyload');
  // addLazySizesScript();
}
або значення перемінної:
const isLazyLoadNativeSupport = document.createElement('img');
console.dir(isLazyLoadNativeSupport)