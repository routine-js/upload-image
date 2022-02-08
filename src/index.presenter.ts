import { inject, injectable, Presenter } from '@clean-js/presenter';
import { AbsSelectImageService } from './selectImage.service';
import { AbsUploadService } from './upload.service';
import { uniqueID } from './help';

export const SelectImageServiceToken = 'SelectImageServiceToken';
export const UploadServiceToken = 'UploadServiceToken';

export type IFile = {
  file: File; // 上传的源文件
  thumbUrl: string; // 缩略图地址
  id: string; // 唯一id ，自动生成
  url: string;
  name: string; // 上传文件名，由上传函数提供
  status: 'default' | 'pending' | 'failed' | 'successful' | 'aborted';
};

export type IFileList = IFile[];

interface IViewState {
  loading: boolean;
  fileList: IFileList;
}

export const makeFile = (file: File) => {
  const o: IFile = {
    file,
    thumbUrl:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC',
    id: uniqueID(),
    url: '',
    name: '',
    status: 'default',
  };
  return o;
};

@injectable()
export class UploadImagePresenter extends Presenter<IViewState> {
  constructor(
    @inject(SelectImageServiceToken)
    private selectImageService: AbsSelectImageService,
    @inject(UploadServiceToken) private uploadService: AbsUploadService,
  ) {
    super();
    this.state = { loading: false, fileList: [] };
  }

  showLoading() {
    this.setState((s) => {
      s.loading = true;
    });
  }

  hideLoading() {
    this.setState((s) => {
      s.loading = false;
    });
  }

  /**
   * 调用选图服务 添加或者替换filelist
   * @returns
   */
  select(index?: number) {
    if (index !== undefined) {
      if (this.state.fileList[index]) {
        // 选图服务允许返回多个文件
        // 如果指定了下标， 就只选用第一个文件
        return this.selectImageService
          .__selectAndRunMiddleware()
          .then((files) => {
            this.setState((s) => {
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
          this.setState((s) => {
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
  upload(index?: number) {
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
          this.setState((s) => {
            s.fileList[i].url = res.url;
            s.fileList[i].name = res.name;
            s.fileList[i].thumbUrl = res.thumbUrl;
            s.fileList[i].status = 'successful';
          });
        })
        .catch((e) => {
          this.setState((s) => {
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
  remove(index: number) {
    this.setState((s) => {
      s.fileList.splice(index, 1);
    });
  }

  /**
   * 选择图片，并上传最后一张图片
   */
  async selectAndUpload() {
    await this.select();
    await this.upload();
  }

  replaceAt(index: number, file: IFile) {
    this.setState((s) => {
      s.fileList[index] = {
        ...s.fileList[index],
        ...file,
      };
    });
  }
}
