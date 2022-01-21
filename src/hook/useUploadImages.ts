import { message } from 'antd';
import { useState, useRef, useEffect, useCallback } from 'react';
import { IPropsUseInputFile, useInputFile } from './useInputFile';

export type ImageList = { url: string; name: string }[];
export interface IPropsUseUploadImages extends IPropsUseInputFile {
  uploadFn: (file: File) => Promise<{ name: string; url: string }>;
}
/**
 * todo
 * 1. removeFn  需要异步删除远程图片之类
 * 2. chooseFile 需要用jsbridge选图之类的
 * 3. base64 和file 的转换函数
 */
export function useUploadImages({
  uploadFn,
  ...propsUseUploadImages
}: IPropsUseUploadImages) {
  const [loading, setloading] = useState(false);
  const { lastFile: file, chooseFile } = useInputFile(propsUseUploadImages);
  const refClickIndex = useRef(-1);
  const [imageList, setImageList] = useState<ImageList>([]);
  const refUploadFn = useRef(uploadFn);

  useEffect(() => {
    if (file) {
      const upload = (f: File) => {
        setloading(true);
        return refUploadFn
          .current(file)
          .catch(e => {
            message.warning(`上传失败：${e}`);
          })
          .finally(() => {
            setloading(false);
          });
      };

      const uploadIndex = (i: number) => {
        if (file) {
          upload(file).then(res => {
            if (res) {
              setImageList(s => {
                const n = [...s];
                n[i].url = res.url;
                n[i].name = res.name;
                return n;
              });
            }
          });
        }
      };

      const uploadAppend = () => {
        if (file) {
          upload(file).then(res => {
            if (res) {
              setImageList(s => {
                const n = [...s, { url: res.url, name: res.name }];
                return n;
              });
            }
          });
        }
      };

      if (refClickIndex.current !== -1) {
        uploadIndex(refClickIndex.current);
      } else {
        uploadAppend();
      }
    }
  }, [file]);

  const reUpload = useCallback(
    (i: number) => {
      refClickIndex.current = i;
      chooseFile();
    },
    [chooseFile],
  );

  const upload = useCallback(() => {
    refClickIndex.current = -1;
    chooseFile();
  }, [chooseFile]);

  const remove = useCallback((i: number) => {
    setImageList(s => {
      const n = [...s];
      n.splice(i, 1);
      return n;
    });
  }, []);

  return {
    upload,
    reUpload,
    imageList,
    loading,
    remove,
  };
}
