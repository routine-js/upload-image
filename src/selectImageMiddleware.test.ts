import { IMiddleware, MiddlewareRunner } from '@lujs/middleware';
import { SelectImageMiddlewareFactor } from './selectImageMiddleware';

type ImageConstructor = new (
  width?: number | undefined,
  height?: number | undefined,
) => HTMLImageElement;

global.Image = class {
  onload: () => void;

  constructor() {
    this.onload = jest.fn();
    setTimeout(() => {
      this.onload();
    }, 50);
  }
} as unknown as ImageConstructor;

const mockFile = new File(['123'], 'mock.png', { type: 'image/png' });

describe('SelectImageMiddlewareFactor', () => {
  it('check max size, fail', () => {
    const SelectImageMiddlewareCheck: IMiddleware<File[]> =
      SelectImageMiddlewareFactor.checkSize({ max: 1 });

    const runner = new MiddlewareRunner<File[]>();

    runner.use(SelectImageMiddlewareCheck);

    expect(() => runner.run([mockFile])).rejects.toThrow();
  });

  it('check max size ,pass', (done) => {
    const SelectImageMiddlewareCheck: IMiddleware<File[]> =
      SelectImageMiddlewareFactor.checkSize({ max: 1023 });

    const runner = new MiddlewareRunner<File[]>();

    runner.use(SelectImageMiddlewareCheck);
    runner.run([mockFile]).then((res) => {
      expect(res).toEqual([mockFile]);
      done();
    });
  });

  it('check image ', () => {
    const SelectImageMiddlewareCheck: IMiddleware<File[]> =
      SelectImageMiddlewareFactor.checkImageInBrowser({ width: 100 });

    const runner = new MiddlewareRunner<File[]>();

    runner.use(SelectImageMiddlewareCheck);

    expect(() => runner.run([mockFile])).rejects.toThrow();
  });
});
