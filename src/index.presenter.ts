import { inject, injectable, Presenter } from '@lujs/mvp';
import { UploadImageModel } from './index.model';
import { AbsSelectImageService } from './selectImage.service';
import { AbsUploadService } from './upload.service';

export const SelectImageServiceToken = 'SelectImageServiceToken';
export const UploadServiceToken = 'UploadServiceToken';

@injectable()
export class UploadImagePresenter extends Presenter<UploadImageModel> {
  constructor(
    private model: UploadImageModel,
    @inject(SelectImageServiceToken)
    private selectImageService: AbsSelectImageService,
    @inject(UploadServiceToken) private uploadService: AbsUploadService,
  ) {
    super();
  }

  /**
   * 切换上传服务
   * @param s
   */
  useUploadService(s: AbsUploadService) {
    this.uploadService = s;
  }

  /**
   * 切换选图服务
   * @param s
   */
  useSelectImageService(s: AbsSelectImageService) {
    this.selectImageService = s;
  }

  showLoading() {
    this.model.setState((s) => {
      s.loading = true;
    });
  }

  hideLoading() {
    this.model.setState((s) => {
      s.loading = false;
    });
  }

  selectImage() {
    // 选图方法
    return this.selectImageService.__selectAndRunMiddleware();
    //
  }

  upload(files: File[]) {
    return this.uploadService.upload(files);
  }

  selectAndUpload() {
    this.showLoading();
    return this.selectImage()
      .then((files) =>
        this.upload(files).then((data) => {
          this.model.setState((s) => {
            s.imageList.concat(data);
          });
        }),
      )
      .finally(() => {
        this.hideLoading();
      });
  }
}
