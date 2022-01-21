import { useCallback, useEffect, useRef, useState } from 'react';

// accept="image/png" or accept=".png" — Accepts PNG files.
// accept="image/png, image/jpeg" or accept=".png, .jpg, .jpeg" — Accept PNG or JPEG files.
// accept="image/*" — Accept any file with an image/* MIME type. (Many mobile devices also let the user take a picture with the camera when this is used.)

export interface IPropsUseInputFile {
  accept?: string;
  capture?: boolean;
  multiple?: boolean;
}
const defaultProps: IPropsUseInputFile = {
  accept: 'image/*',
  capture: false,
  multiple: false,
};
export function useInputFile(props = defaultProps) {
  const [files, setFiles] = useState<File[]>([]);
  const refInput = useRef<any>(null);

  useEffect(() => {
    if (!refInput.current) {
      refInput.current = document.createElement('input');
      refInput.current.setAttribute('id', 'useInputFile');
      refInput.current.setAttribute('type', 'file');
      refInput.current.style.display = 'none';
      refInput.current.style.cssText =
        'opacity: 0; position: absolute; top: -100px; left: -100px;';
      document.body.appendChild(refInput.current);
    }

    (refInput.current as HTMLInputElement).addEventListener('change', e => {
      if (refInput.current.files) {
        const fs = refInput.current.files;
        setFiles(s => {
          return [...s, ...fs];
        });
      }
      // 允许重复选择一个文件
      (refInput.current as HTMLInputElement).value = '';
    });

    return () => {
      document.body.removeChild(refInput.current);
    };
  }, []);

  useEffect(() => {
    if (props.accept) {
      refInput.current.setAttribute('accept', props.accept);
    }
  }, [props.accept]);

  useEffect(() => {
    if (props.capture) {
      refInput.current.setAttribute('capture', props.capture);
    }
  }, [props.capture]);

  useEffect(() => {
    if (props.multiple) {
      refInput.current.setAttribute('multiple', props.multiple);
    }
  }, [props.multiple]);

  const chooseFile = useCallback(() => {
    refInput.current.click();
  }, []);

  return {
    files,
    lastFile: files[files.length - 1],
    chooseFile,
  };
}
