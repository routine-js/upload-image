import { IMiddleware } from '@lujs/middleware';

export class ErrorSelectImageMiddleware<P = any> extends Error {
  constructor(public message: string, public data?: P) {
    super(message);
  }
}

const ErrorCheckMaxSize = new Error('ErrorCheckMaxSize');
const ErrorCheckImageWidth = new Error('ErrorCheckImageWidth');
const ErrorCheckImageHeight = new Error('ErrorCheckImageHeight');
const ErrorCheckImageAspectRatio = new Error('ErrorCheckImageAspectRatio');

/**
 * 内置的中间件生成器
 */
export class SelectImageMiddlewareFactor {
  /**
   * 校验图片体积大小
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

  /**
   * 校验图片 宽高， 宽高比例
   */

  static checkImageInBrowser(options: {
    width?: number; // 图片的宽度，不一样就不匹配，
    height?: number;
    aspectRatio?: number; // 图片宽高比 （宽度/高度）
  }): IMiddleware<File[]> {
    return async (context, next) => {
      await Promise.all(
        context.map(
          (file) =>
            new Promise((resolve, reject) => {
              // 没有传参数直接通过
              if (options === undefined) {
                resolve(true);
              } else {
                const { width, height, aspectRatio } = options;

                if (!FileReader || !Image) {
                  console.warn('not support checkImage ');
                }
                if (width || height || aspectRatio) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = (e) => {
                    if (e.target === null) {
                      reject(new Error('can not read file'));
                    } else if (Image) {
                      const image = new Image();
                      image.src = e.target.result as string;
                      image.onload = () => {
                        const iw = image.width;
                        const ih = image.height;
                        if (width) {
                          if (iw !== width) {
                            throw ErrorCheckImageWidth;
                          }
                        }
                        if (height) {
                          if (ih !== height) {
                            throw ErrorCheckImageHeight;
                          }
                        }
                        if (aspectRatio) {
                          if (iw / ih !== aspectRatio) {
                            throw ErrorCheckImageAspectRatio;
                          }
                        }
                        resolve(true);
                      };
                      image.onerror = (error) => {
                        console.error(error, '加载图片出错');
                        reject(error);
                      };
                    } else {
                      console.warn('当前环境不支持Image对象');
                    }
                  };
                } else {
                  resolve(true);
                }
              }
            }),
        ),
      );
      await next();
    };
  }
}
