export type IMiddlewareNextFunction = () => Promise<any>;

export interface IMiddleware<CTX> {
  (context: CTX, next: IMiddlewareNextFunction): any | Promise<any>;
}

export class MiddlewareRunner<CTX> {
  middleware: IMiddleware<CTX>[] = [];

  middlewareCurrent = 0;

  use = (middleware: IMiddleware<CTX>) => {
    this.middleware.push(middleware);
  };

  run = (context: CTX) => {
    const next = async () => {
      const middleware = this.middleware[this.middlewareCurrent];
      this.middlewareCurrent += 1;
      if (typeof middleware === 'function') {
        const p = middleware(context, next);
        if (p instanceof Promise) {
          await p;
        }
      }
    };
    next();
  };
}
