/* eslint-disable max-classes-per-file */
type ImageRes = {
  name: string;
  url: string;
  thumbUrl: string;
  [p: string]: any;
};

export interface UploadFn {
  (file: File): Promise<ImageRes>;
}

const mockUpload: UploadFn = (file: File) =>
  new Promise<ImageRes>((resolve) => {
    setTimeout(() => {
      resolve({ name: file.name, url: 'xxx.url', thumbUrl: 'thumbUrl' });
    }, 1000);
  });

export abstract class AbsUploadService {
  abstract upload(files: File): Promise<ImageRes>;
}

export class TestUploadService implements AbsUploadService {
  async upload(file: File) {
    console.warn('这里是测试服务，请实现的上传服务');
    return mockUpload(file);
  }
}

export class RealUploadService implements AbsUploadService {
  async upload(file: File) {
    console.warn('这里是真实服务');

    return mockUpload(file);
  }
}
