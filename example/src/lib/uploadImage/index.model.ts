import { Model } from '@lujs/mvp';

type ImageList = { url: string; name: string }[];

interface IViewState {
  loading: boolean;
  imageList: ImageList;
}

export class UploadImageModel extends Model<IViewState> {
  constructor() {
    super();
    this.state = { loading: false, imageList: [] };
  }
}
