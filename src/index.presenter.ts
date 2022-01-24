import { inject, injectable, Presenter } from '@lujs/mvp';
import { IFile } from '.';
import { makeFile, UploadImageModel } from './index.model';
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

  // /**
  //  * 切换上传服务
  //  * @param s
  //  */
  // useUploadService(s: AbsUploadService) {
  //   this.uploadService = s;
  // }

  // /**
  //  * 切换选图服务
  //  * @param s
  //  */
  // useSelectImageService(s: AbsSelectImageService) {
  //   this.selectImageService = s;
  // }

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

  /**
   * 调用选图服务 添加或者替换filelist
   * @returns
   */
  selectImage(index?: number) {
    if (index !== undefined) {
      if (this.state.fileList[index]) {
        // 选图服务允许返回多个文件
        // 如果指定了下标， 就只选用第一个文件
        return this.selectImageService
          .__selectAndRunMiddleware()
          .then((files) => {
            this.model.setState((s) => {
              s.fileList[index].file = files[0];
              // 重置状态
              s.fileList[index].status = 'default';
            });
          });
      }
      throw Error(`index：(${index}) not found in fileList`);
    } else {
      // 选图方法
      return this.selectImageService
        .__selectAndRunMiddleware()
        .then((files) => {
          this.model.setState((s) => {
            s.fileList = [...s.fileList, ...files.map((v) => makeFile(v))];
          });
        });
    }

    //
  }

  /**
   * 调用上传服务 上传指定文件 更新 fileList 状态
   * 指定了下标就选择对应的文件， 不然就选最后一个文件
   * @param index
   * @returns
   */
  uploadFile(index?: number) {
    const i =
      typeof index === 'number' ? index : this.state.fileList.length - 1;
    const file = this.state.fileList[i];
    if (!file) {
      throw Error(`index: ${index} uploadFile out of index,`);
    }
    if (file.status !== 'successful') {
      this.showLoading();
      return this.uploadService
        .upload(file.file)
        .then((res) => {
          this.model.setState((s) => {
            s.fileList[i].url = res.url;
            s.fileList[i].name = res.name;
            s.fileList[i].thumbUrl = res.thumbUrl;
            s.fileList[i].status = 'successful';
          });
        })
        .catch((e) => {
          this.model.setState((s) => {
            s.fileList[i].status = 'failed';
          });
          throw e;
        })
        .finally(() => {
          this.hideLoading();
        });
    }
    // 该文件已经上传成功
    return Promise.resolve(true);
  }

  /**
   * 移除文件
   * @param index
   */
  removeFile(index: number) {
    this.model.setState((s) => {
      s.fileList.splice(index, 1);
    });
  }

  /**
   * 选择图片，并上传最后一张图片
   */
  async selectAndUpload() {
    await this.selectImage();
    await this.uploadFile();
  }

  replaceFileAt(index: number, file: IFile) {
    this.model.setState((s) => {
      s.fileList[index] = {
        ...s.fileList[index],
        ...file,
      };
    });
  }
}
