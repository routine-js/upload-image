const mockUpload = (file: File) =>
  Promise.resolve({ name: 'xxx.png', url: 'xxx.url' });

export class UploadService {
  upload(files: File[]) {
    return Promise.all(files.map((f) => mockUpload(f)));
  }
}
