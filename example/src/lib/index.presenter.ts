import { IMiddleware } from '@lujs/middleware';
import { injectable, Presenter } from '@lujs/mvp';
import { UploadImageModel } from './index.model';
import {
  AbsSelectImageService,
  SelectImageService,
} from './selectImage.service';
import { TestUploadService, AbsUploadService } from './upload.service';

@injectable()
export class UploadImagePresenter extends Presenter<UploadImageModel> {
  constructor(
    private model: UploadImageModel,
    private selectImageService: SelectImageService,
    private uploadService: TestUploadService,
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

  // /**
  //  * 添加选图之后执行的中间件
  //  */
  // useSelectImageMiddleware(middleware: IMiddleware<File[]>) {
  //   this.selectImageService.useMiddleware(middleware);
  // }

  upload(files: File[]) {
    return this.uploadService.upload(files);
  }

  selectAndUpload() {
    this.showLoading();
    console.log('up');
    return this.selectImage()
      .then((files) => {
        console.log(files, 'selsect');
        return this.upload(files).then((data) => {
          console.log(data, 'data');
          this.model.setState((s) => {
            s.imageList.concat(data);
          });
        });
      })
      .finally(() => {
        this.hideLoading();
      });
  }
}
