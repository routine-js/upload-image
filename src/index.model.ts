import { Model } from '@lujs/mvp';
import { uniqueID } from './help';

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
export class UploadImageModel extends Model<IViewState> {
  constructor() {
    super();
    this.state = { loading: false, fileList: [] };
  }
}
