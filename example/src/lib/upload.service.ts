/* eslint-disable max-classes-per-file */
type ImageRes = { name: string; url: string; [p: string]: any };

export interface UploadFn {
  (file: File): Promise<ImageRes>;
}

const mockUpload: UploadFn = (file: File) =>
  new Promise<ImageRes>((resolve) => {
    setTimeout(() => {
      resolve({ name: file.name, url: 'xxx.url' });
    }, 1000);
  });

export abstract class AbsUploadService {
  abstract upload(files: File[]): Promise<ImageRes[]>;
}

export class TestUploadService implements AbsUploadService {
  upload(files: File[]) {
    console.warn('这里是测试服务，请实现的上传服务');
    return Promise.all(files.map((f) => mockUpload(f)));
  }
}

export class RealUploadService implements AbsUploadService {
  upload(files: File[]) {
    console.warn('这里是真实服务');
    return Promise.all(files.map((f) => mockUpload(f)));
  }
}
