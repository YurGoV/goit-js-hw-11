
https://dev.to/dcodeyt/create-a-button-with-a-loading-spinner-in-html-css-1c0h

  https://www.npmjs.com/package/handlebars
  https://www.npmjs.com/package/parcel-plugin-handlebars-precompile // не працює, збиває інші модулі!!!
  https://www.npmjs.com/package/parcel-transformer-hbs // parcel-transformer-hbs // встановлено цей (додатково згідно доків змінити .parcelrc)
  https://youtu.be/Fh8d14cY9AM?t=56m15s // пояснення щодо шаблону





LAZYLOAD:
бібліотека lazysizes https://textbook.edu.goit.global/javascript-yk5evp/v2/uk/docs/lesson-14/lazy-load#%D0%B1%D1%96%D0%B1%D0%BB%D1%96%D0%BE%D1%82%D0%B5%D0%BA%D0%B0-lazysizes
має бути встановлена та підключена бібліотека lazysizes:
https://www.npmjs.com/package/lazysizes
    npm i lazysizes
    import 'lazysizes';

import { LazyLoadConfig } from "./lazyloadconfig-class.js";
розмітка img:
розмітка для браузерів, що підтримують (без lazysizes): <img src="my-image.jpg" loading="lazy" alt="Image description" .../> //src... loading...

розмітка для браузерів, що не підтримують (із lazysizes): <img data-src="image.jpg" class="lazyload"  alt="Image description" .../> //щоб працювало - має бути тільки ata-src, src прибрати
  є підтримка респонсивного обчислення розмірів картинки, розібратися

перевірка чи підтримує браузер:
if ('loading' in HTMLImageElement.prototype) {// https://youtu.be/kxwN7eXBNDQ?t=1h9m35s
    console.log('Браузер поддерживает lazyload');
  } else {
    console.log('Браузер НЕ поддерживает lazyload');
}