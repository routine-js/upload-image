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

export abstract class AbsUploadService {
  abstract upload(files: File): Promise<ImageRes>;
}

// export class RealUploadService implements AbsUploadService {
//   async upload(file: File) {
//     console.warn('这里是真实服务');

//     return mockUpload(file);
//   }
// }
