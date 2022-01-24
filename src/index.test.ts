/* eslint-disable max-classes-per-file */
import { usePresenter } from '@lujs/react-mvp-adaptor';
import { renderHook, act } from '@testing-library/react-hooks';
import { AbsUploadService, UploadImagePresenter } from './index';
import { SelectImageServiceToken, UploadServiceToken } from './index.presenter';
import {
  AbsSelectImageService,
  SelectImageServiceBrowserInput,
} from './selectImage.service';

const mockUpload = (file: File) =>
  new Promise<{ name: string; url: string; thumbUrl: string }>((resolve) => {
    setTimeout(() => {
      resolve({ name: file.name, url: 'xxx.url', thumbUrl: 'thumbUrl' });
    }, 0);
  });

class TestUploadService extends AbsUploadService {
  async upload(file: File) {
    return mockUpload(file);
  }
}

class TestFailUploadService extends AbsUploadService {
  async upload(file: File) {
    throw Error('fail');
    return mockUpload(file);
  }
}

class MockSelectService extends AbsSelectImageService {
  async select(): Promise<File[]> {
    return [new File(['mock'], 'mock.png')];
  }
}

describe('', () => {
  it('base', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter, state } = result.current;
    expect(count).toBe(1);
    expect(state.fileList.length).toBe(0);
    expect(state.loading).toBeFalsy();
    // act(() => {
    //   result.current.presenter.selectAndUpload();
    // });
    // expect(count).toBe(1);
  });

  it('base', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter, state } = result.current;
    expect(count).toBe(1);
    expect(state.fileList.length).toBe(0);
    expect(state.loading).toBeFalsy();
    // act(() => {
    //   result.current.presenter.selectAndUpload();
    // });
    // expect(count).toBe(1);
  });

  it('showLoading', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        autoUpdate: true,
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter, state } = result.current;
    expect(count).toBe(1);
    expect(state.fileList.length).toBe(0);
    expect(state.loading).toBeFalsy();
    act(() => {
      result.current.presenter.showLoading();
    });
    expect(count).toBe(2);
    expect(result.current.state.loading).toBeTruthy();
  });

  it('hideLoading', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        autoUpdate: true,
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter, state } = result.current;
    expect(count).toBe(1);
    expect(state.fileList.length).toBe(0);
    expect(state.loading).toBeFalsy();
    act(() => {
      result.current.presenter.showLoading();
      result.current.presenter.hideLoading();
    });
    expect(count).toBe(2);
    expect(result.current.state.loading).toBe(false);
  });

  it('select', async () => {
    let count = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);
  });

  it('select with index', async () => {
    let count = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    presenter.selectImage(0);

    await waitForNextUpdate();
    expect(count).toBe(3);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);
  });

  it('select with index, out of index', async () => {
    let count = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    expect(() => {
      presenter.selectImage(1);
    }).toThrowError();
  });

  it('upload', async () => {
    let count = 0;
    const { result, waitForNextUpdate, waitFor } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    act(() => {
      presenter.uploadFile();
    });
    await waitForNextUpdate();
    // showloading changefile hideloading +3 time
    expect(count).toBe(5);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].url).toBe('xxx.url');
    expect(result.current.state.fileList[0].status === 'successful').toBe(true);
  });

  it('upload, fail', async () => {
    let count = 0;
    const { result, waitForNextUpdate, waitFor } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestFailUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    act(() => {
      expect(() => presenter.uploadFile()).rejects.toThrow();
    });
    await waitForNextUpdate();
    // showloading changefile hideloading +3 time
    expect(count).toBe(5);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].url).toBe('');
    expect(result.current.state.fileList[0].status === 'failed').toBe(true);
  });

  it('upload index', async () => {
    let count = 0;
    const { result, waitForNextUpdate, waitFor } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    act(() => {
      presenter.uploadFile(0);
    });
    await waitForNextUpdate();
    // showloading changefile hideloading +3 time
    expect(count).toBe(5);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].url).toBe('xxx.url');
    expect(result.current.state.fileList[0].status === 'successful').toBe(true);

    // if has upload
    expect(presenter.uploadFile(0)).resolves.toBeTruthy();
  });

  it('upload index, out of index', async () => {
    let count = 0;
    const { result, waitForNextUpdate, waitFor } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    act(() => {
      presenter.uploadFile(0);
    });
    await waitForNextUpdate();
    // showloading changefile hideloading +3 time
    expect(count).toBe(5);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].url).toBe('xxx.url');
    expect(result.current.state.fileList[0].name).toBe('mock.png');
    expect(result.current.state.fileList[0].thumbUrl).toBe('thumbUrl');
    expect(result.current.state.fileList[0].status === 'successful').toBe(true);

    // if has upload
    expect(presenter.uploadFile(0)).resolves.toBeTruthy();

    expect(() => presenter.uploadFile(100)).toThrow();
  });

  it('remove', async () => {
    let count = 0;
    const { result, waitForNextUpdate, waitFor } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    presenter.selectImage();

    await waitForNextUpdate();
    expect(count).toBe(2);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].status === 'default').toBe(true);

    act(() => {
      presenter.uploadFile();
    });
    await waitForNextUpdate();
    // showloading changefile hideloading +3 time
    expect(count).toBe(5);
    expect(result.current.state.fileList.length).toBe(1);
    expect(result.current.state.fileList[0].file.name).toBe('mock.png');
    expect(result.current.state.fileList[0].url).toBe('xxx.url');
    expect(result.current.state.fileList[0].status === 'successful').toBe(true);

    act(() => {
      presenter.removeFile(0);
    });
    expect(count).toBe(6);
    expect(result.current.state.fileList.length).toBe(0);
  });

  it('selectAndUpload', (done) => {
    let count = 0;
    const { result, waitForNextUpdate, waitFor } = renderHook(() => {
      count += 1;
      return usePresenter<UploadImagePresenter>(UploadImagePresenter, {
        registry: [
          { token: UploadServiceToken, useClass: TestUploadService },
          {
            token: SelectImageServiceToken,
            useClass: MockSelectService,
          },
        ],
      });
    });
    const { presenter } = result.current;
    expect(count).toBe(1);
    expect(result.current.state.fileList.length).toBe(0);
    expect(result.current.state.loading).toBeFalsy();

    act(() => {
      presenter.selectAndUpload();
    });

    setTimeout(() => {
      expect(count).toBe(5);

      expect(result.current.state.fileList.length).toBe(1);
      expect(result.current.state.fileList[0].file.name).toBe('mock.png');
      expect(result.current.state.fileList[0].url).toBe('xxx.url');
      expect(result.current.state.fileList[0].status === 'successful').toBe(
        true,
      );
      done();
    }, 100);
  });
});
