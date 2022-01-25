import { IMiddleware } from '@lujs/middleware';

export class ErrorSelectImageMiddleware<P = any> extends Error {
  constructor(public message: string, public data?: P) {
    super(message);
  }
}

const ErrorCheckMaxSize = new Error('ErrorCheckMaxSize');

// 校验的属性
export type ICheckOptions = {
  maxSizeMB?: number; // mb
  width?: number; // 图片的宽度，不一样就不匹配，
  height?: number;
  rate?: number; // 图片宽高比 （宽度/高度）
};
export type ICheckFailOptions = keyof ICheckOptions;

type IMiddleCheckFailData = {
  filename: string;
  failKey: ICheckFailOptions;
};
/**
 * 内置的中间件生成器
 */
export class SelectImageMiddlewareFactor {
  /**
   * 校验图片大小
   * @param options.max  Byte
   */
  static checkSize(options: { max: number }): IMiddleware<File[]> {
    return async (context, next) => {
      await Promise.all(
        context.map(
          (file) =>
            new Promise((resolve, reject) => {
              if (options?.max) {
                const maxBytes = options.max;
                if (file.size > maxBytes) {
                  throw ErrorCheckMaxSize;
                }
              } else {
                throw Error('please pass max');
              }
              resolve(true);
            }),
        ),
      );
      await next();
    };
  }

  // static check(options: ICheckOptions): IMiddleware<File[]> {
  //   return async (context, next) => {
  //     // try {
  //     await Promise.all(
  //       context.map(
  //         (file) =>
  //           new Promise((resolve, reject) => {
  //             // 没有传参数直接通过
  //             if (options === undefined) {
  //               resolve(true);
  //             } else {
  //               const { maxSizeMB, width, height, rate } = options;

  //               if (maxSizeMB) {
  //                 const maxBytes = maxSizeMB * 1024 * 1024;
  //                 if (file.size > maxBytes) {
  //                   reject(
  //                     new ErrorSelectImageMiddleware<IMiddleCheckFailData>(
  //                       `Image size over ${options.maxSizeMB} mb`,
  //                       {
  //                         failKey: 'maxSizeMB',
  //                         filename: file.name,
  //                       },
  //                     ),
  //                   );
  //                 }
  //               }
  //               if (width || height || rate) {
  //                 const reader = new FileReader();

  //                 reader.readAsDataURL(file);
  //                 reader.onload = (e) => {
  //                   if (e.target === null) {
  //                     reject(new Error('can not read file'));
  //                   } else if (Image) {
  //                     const image = new Image();
  //                     // Set the Base64 string return from FileReader as source.
  //                     image.src = e.target.result as string;
  //                     // Validate the File Height and Width.
  //                     image.onload = () => {
  //                       const iw = image.width;
  //                       const ih = image.height;
  //                       if (width) {
  //                         if (iw !== width) {
  //                           reject(
  //                             new ErrorSelectImageMiddleware<IMiddleCheckFailData>(
  //                               `Image width is not equal to ${options.width}`,
  //                               {
  //                                 failKey: 'width',
  //                                 filename: file.name,
  //                               },
  //                             ),
  //                           );
  //                           // resolve({
  //                           //   pass: false,
  //                           //   optionKey: 'width',
  //                           // });
  //                         }
  //                       }
  //                       if (height) {
  //                         if (ih !== height) {
  //                           reject(
  //                             new ErrorSelectImageMiddleware<IMiddleCheckFailData>(
  //                               `Image height is not equal to ${options.height}`,
  //                               {
  //                                 failKey: 'height',
  //                                 filename: file.name,
  //                               },
  //                             ),
  //                           );
  //                           // resolve({
  //                           //   pass: false,
  //                           //   optionKey: 'height',
  //                           // });
  //                         }
  //                       }

  //                       if (rate) {
  //                         if (iw / ih !== rate) {
  //                           reject(
  //                             new ErrorSelectImageMiddleware<IMiddleCheckFailData>(
  //                               `Image rate is not equal to ${options.rate}`,
  //                               {
  //                                 failKey: 'rate',
  //                                 filename: file.name,
  //                               },
  //                             ),
  //                           );
  //                           // resolve({
  //                           //   pass: false,
  //                           //   optionKey: 'rate',
  //                           // });
  //                         }
  //                       }

  //                       resolve(true);
  //                     };
  //                     image.onerror = (error) => {
  //                       console.error(error, '加载图片出错');
  //                       reject(error);
  //                     };
  //                   } else {
  //                     console.warn('当前环境不支持Image对象');
  //                   }
  //                 };
  //               } else {
  //                 console.log('padd max size');
  //                 // 因为检查图片是异步的，这里用else
  //                 resolve(true);
  //               }
  //             }
  //           }),
  //       ),
  //     );
  //     // .then((res) => {
  //     //   console.log(res, '======sresn');
  //     // })
  //     // .catch((e) => {
  //     //   console.log(e, '==========e');
  //     // });
  //     // } catch (e) {
  //     //   console.log(e, '======e');
  //     // }

  //     await next();
  //   };
  // }
}

// // use age
// export const MiddlewareImageSize: IMiddleware<File[]> =
//   SelectImageMiddlewareFactor.buildImageSizeCheck({
//     max: 1000 * 100,
//   });
