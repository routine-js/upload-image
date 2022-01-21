/* eslint-disable max-classes-per-file */
import { IMiddleware, MiddlewareRunner } from '@lujs/middleware';

export interface IPropsUseInputFile {
  accept?: string;
  capture?: boolean;
  multiple?: boolean;
}
const defaultProps: IPropsUseInputFile = {
  accept: 'image/*',
  capture: false,
  multiple: false,
};

interface ISelect {
  (): Promise<File[]>;
}

export abstract class AbsSelectImageService {
  abstract select(): Promise<File[]>;

  middlewareRunner = new MiddlewareRunner<File[]>();

  __selectAndRunMiddleware() {
    return this.select().then((fs) => this.middlewareRunner.run(fs));
  }

  useMiddleware(middleware: IMiddleware<File[]>) {
    this.middlewareRunner.use(middleware);
  }
}

const browserInputSelect: ISelect = () => {
  let isChoosing = false;
  return new Promise((resolve, reject) => {
    const $input = document.createElement('input');
    $input.setAttribute('id', 'useInputFile');
    $input.setAttribute('type', 'file');
    $input.style.cssText =
      'opacity: 0; position: absolute; top: -100px; left: -100px;';

    $input.setAttribute('accept', 'image/*');

    document.body.appendChild($input);

    const unMount = () => {
      console.log('unmount');
      // eslint-disable-next-line no-use-before-define
      $input.removeEventListener('change', changeHandler);
      document.body.removeChild($input);
    };

    const changeHandler = () => {
      isChoosing = true;

      if ($input.files) {
        console.log($input.files, '$input.files');
        const fs = [...$input.files];
        unMount();
        resolve(fs);
      }

      // 允许重复选择一个文件
      $input.value = '';

      console.log('changeHandler');
    };

    $input.addEventListener('change', changeHandler);

    // 取消选择文件
    window.addEventListener(
      'focus',
      () => {
        console.log('focus');
        setTimeout(() => {
          if (!isChoosing && $input) {
            unMount();
            reject(new Error('onblur'));
          }
        }, 100);
      },
      { once: true },
    );
    $input.click();
  });
};

export const sizeMiddleware: IMiddleware<File[]> = (context, next) => {
  console.log('sizeMiddleware');

  const allPass = context.every((f) => f.size < 1000 * 10);
  if (allPass) {
    next();
  } else {
    throw Error('请上传大于。。。');
  }
};

export class SelectImageService extends AbsSelectImageService {
  select = () => browserInputSelect();
}
