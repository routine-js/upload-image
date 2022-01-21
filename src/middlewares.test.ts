import {
  IMiddleware,
  IMiddlewareNextFunction,
  MiddlewareRunner,
} from './middlewares';

const delay = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 100);
  });
describe('middleware', () => {
  it('use', () => {
    const m1: IMiddleware<string> = (ctx, next) => {
      next();
    };

    const m2: IMiddleware<string> = (ctx, next) => {
      next();
    };

    const runner = new MiddlewareRunner<string>();
    runner.use(m1);
    runner.use(m2);
    expect(runner.middleware.length).toBe(2);
  });

  it('run', () => {
    let count = 0;
    let ctx = '';

    const m1: IMiddleware<string> = (context: string, next) => {
      count += 1;
      ctx = context;
      next();
    };

    const inputStr = 'haha';
    const runner = new MiddlewareRunner<string>();
    runner.use(m1);

    expect(count).toBe(0);
    runner.run(inputStr);

    console.log(runner);

    expect(count).toBe(1);
    expect(ctx).toBe(inputStr);
  });

  it('run async', (done) => {
    let count = 0;
    let ctx = '';

    const m1: IMiddleware<string> = async (context: string, next) => {
      count += 1;
      ctx = context;
      await delay();
      next();
      count += 1;
    };

    const inputStr = 'haha';
    const runner = new MiddlewareRunner<string>();
    runner.use(m1);

    expect(count).toBe(0);
    runner.run(inputStr);

    expect(count).toBe(1);
    expect(ctx).toBe(inputStr);

    // after async middleware
    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 1000);
  });

  it('log', () => {
    const m1: IMiddleware<string> = (ctx, next) => {
      console.log(1);
      next();
      console.log(6);
    };
    const m2: IMiddleware<string> = (ctx, next) => {
      console.log(2);
      next();
      console.log(5);
    };
    const m3: IMiddleware<string> = (ctx, next) => {
      console.log(3);
      next();
      console.log(4);
    };

    const runner = new MiddlewareRunner<string>();
    runner.use(m1);
    runner.use(m2);
    runner.use(m3);
    expect(runner.middleware.length).toBe(3);

    runner.run('');
  });

  it('log async', () => {
    const m1: IMiddleware<string> = async (ctx, next) => {
      console.log('async', 1);
      await next();
      console.log('async', 6);
    };
    const m2: IMiddleware<string> = async (ctx, next) => {
      console.log('async', 2);
      await next();
      console.log('async', 5);
    };
    const m3: IMiddleware<string> = async (ctx, next) => {
      console.log('async', 3);
      await next();
      console.log('async', 4);
    };

    const runner = new MiddlewareRunner<string>();
    runner.use(m1);
    runner.use(m2);
    runner.use(m3);
    expect(runner.middleware.length).toBe(3);

    runner.run('');
  });

  it('run change ctx', () => {
    interface CTX {
      a: string;
    }
    const ctx: CTX = {
      a: 'a',
    };

    const inputStr = 'haha';

    const m1: IMiddleware<CTX> = (context, next) => {
      context.a = inputStr;
      next();
    };

    const runner = new MiddlewareRunner<CTX>();
    runner.use(m1);

    expect(ctx.a).toBe('a');
    runner.run(ctx);
    expect(ctx.a).toBe(inputStr);
  });

  it('run change ctx delay async', (done) => {
    interface CTX {
      a: string;
    }
    const ctx: CTX = {
      a: 'a',
    };

    const inputStr = 'haha';

    const m1: IMiddleware<CTX> = async (context, next) => {
      await delay();
      context.a = inputStr;
      next();
    };

    const runner = new MiddlewareRunner<CTX>();
    runner.use(m1);

    expect(ctx.a).toBe('a');
    runner.run(ctx);

    // after async middleware
    setTimeout(() => {
      expect(ctx.a).toBe(inputStr);

      done();
    }, 1000);
  });
});
