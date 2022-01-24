// import {
//   AbsSelectImageService,
//   SelectImageMiddlewareFactor,
// } from './selectImage.service';

// const sizeMiddleware = SelectImageMiddlewareFactor.buildImageSizeCheck({
//   max: 1000,
// });

// const jsbride = {
//   chooseImage: (option = {}) => Promise.resolve('base64'),
// };

// const baseToFile = (base64: string) =>
//   new File([base64], 'base64.png', {
//     type: 'image/png',
//   });

// export class JsbrideSelectService extends AbsSelectImageService {
//   constructor() {
//     super();
//     this.useMiddleware(sizeMiddleware);
//   }

//   select() {
//     return jsbride.chooseImage().then((base64) => [baseToFile(base64)]);
//   }
// }
