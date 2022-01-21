import { useEffect, useState } from 'react';
import { usePresenter } from '@lujs/react-mvp-adaptor';
import { sizeMiddleware } from '@/lib/selectImage.service';
import { UploadImagePresenter } from '@/lib/index.presenter';
import styles from './index.less';
import { RealUploadService } from '@/lib/upload.service';
import { JsbrideSelectService } from '@/lib/selectImage.service.test';

const Inner = () => {
  const { presenter, state } =
    usePresenter<UploadImagePresenter>(UploadImagePresenter);

  useEffect(() => {
    presenter.useUploadService(new RealUploadService());
    presenter.useSelectImageService(new JsbrideSelectService());
  }, []);

  return (
    <div>
      <h1 className={styles.title}>{state.loading && 'loading'}</h1>
      {state.imageList.map((v) => {
        console.log(v);
        return <img key={v.name} src={v.url} alt=""></img>;
      })}
      <button
        onClick={() => {
          try {
            presenter.selectAndUpload().catch((e) => {
              console.log(e, '=e1');
            });
          } catch (e) {
            console.log(e, '==eeee');
          }
        }}
      >
        add image
      </button>
    </div>
  );
};

export default function IndexPage() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button
        onClick={() => {
          setShow((s) => !s);
        }}
      >
        switch Inner
      </button>
      {show && <Inner></Inner>}
    </div>
  );
}
