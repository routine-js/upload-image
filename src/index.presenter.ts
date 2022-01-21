import { IMiddleware } from '@lujs/middleware';
import { Presenter } from '@lujs/mvp';
import { UploadImageModel } from './index.model';
import { SelectImageService } from './selectImage.service';
import { UploadService } from './upload.service';

export class UploadImagePresenter extends Presenter<UploadImageModel> {
  constructor(
    private model: UploadImageModel,
    private selectImageService: SelectImageService,
    private uploadService: UploadService,
  ) {
    super();
  }

  showLoading() {
    this.model.setState((s) => {
      s.loading = true;
    });
    this.updateView();
  }

  hideLoading() {
    this.model.setState((s) => {
      s.loading = false;
    });
    this.updateView();
  }

  selectImage() {
    // 选图方法
    return this.selectImageService.select();
    //
  }

  /**
   * 添加选图之后执行的中间件
   */
  useSelectImageMiddleware(middleware: IMiddleware<File[]>) {
    this.selectImageService.useMiddleware(middleware);
  }

  upload(files: File[]) {
    return this.uploadService.upload(files);
  }

  selectAndUpload() {
    this.selectImage().then((files) => {
      this.upload(files).then((data) => {
        this.model.setState((s) => {
          s.imageList.concat(data);
        });
        this.updateView();
      });
    });
  }
}
