const mockUpload = (file: File) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'xxx.png', url: 'xxx.url' });
    }, 1000);
  });

export class UploadService {
  upload(files: File[]) {
    return Promise.all(files.map((f) => mockUpload(f)));
  }
}
