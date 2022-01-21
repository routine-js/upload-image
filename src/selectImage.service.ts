import { IMiddleware } from '@lujs/middleware';
import { MiddlewareRunner } from '.';

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

export class SelectImageService {
  middlewareRunner = new MiddlewareRunner<File[]>();

  select(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      const $input = document.createElement('input');
      $input.setAttribute('id', 'useInputFile');
      $input.setAttribute('type', 'file');
      $input.style.display = 'none';
      $input.style.cssText =
        'opacity: 0; position: absolute; top: -100px; left: -100px;';
      document.body.appendChild($input);

      const handler = () => {
        // 允许重复选择一个文件
        ($input as HTMLInputElement).value = '';

        if ($input.files) {
          const fs = [...$input.files];

          const unMount = () => {
            ($input as HTMLInputElement).removeEventListener('change', handler);
            document.body.removeChild($input);
          };
          this.middlewareRunner
            .run(fs)
            .then((res) => {
              unMount();
              resolve([...fs]);
            })
            .catch((err) => {
              reject(err);
            });
        }
      };

      ($input as HTMLInputElement).addEventListener('change', handler);
    });
  }

  useMiddleware(middleware: IMiddleware<File[]>) {
    this.middlewareRunner.use(middleware);
  }
}

export const sizeMiddleware: IMiddleware<File[]> = (context, next) => {
  const allPass = context.every((f) => f.size > 0);
  if (allPass) {
    next();
  } else {
    throw Error('请上传大于。。。');
  }
};
