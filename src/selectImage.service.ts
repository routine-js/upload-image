/* eslint-disable max-classes-per-file */
import { IMiddleware, MiddlewareRunner } from '@lujs/middleware';

interface ISelect {
  (): Promise<File[]>;
}

/**
 * 基础选图服务
 */
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

/**
 * 选图函数生成器
 */
interface BrowserInputSelect {
  // 接受的参数
  accept?: string;
  capture?: boolean;
  multiple?: boolean;
}

export class SelectFnFactor {
  static buildBrowserInputSelect(option?: BrowserInputSelect) {
    const DefaultBrowserInputSelect = {
      accept: 'image/*',
      capture: false,
      multiple: false,
    };

    const opt = {
      ...DefaultBrowserInputSelect,
      ...option,
    };
    return () => {
      let isChoosing = false;
      return new Promise<File[]>((resolve, reject) => {
        const $input = document.createElement('input');
        $input.setAttribute('id', 'useInputFile');
        $input.setAttribute('type', 'file');
        $input.style.cssText =
          'opacity: 0; position: absolute; top: -100px; left: -100px;';

        $input.setAttribute('accept', opt.accept);

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
  }
}

const browserInputSelect: ISelect = SelectFnFactor.buildBrowserInputSelect({
  accept: 'image/*',
});

/**
 * 浏览器 input 选择服务
 */
export class SelectImageServiceBrowserInput extends AbsSelectImageService {
  select = () => browserInputSelect();
}
