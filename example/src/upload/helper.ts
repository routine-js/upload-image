/* eslint-disable @typescript-eslint/ban-ts-ignore */
import moment from "dayjs";
// import { v4 as uuidv4 } from 'uuid';
import UUID from "pure-uuid";
import imageCompression from "browser-image-compression";

/**
 * 生成文件名
 * @param fileType
 */
function getFileExtByFileType(fileType: File["type"]) {
  return fileType.split("/")[1];
}

/**
 * 获取base64图片的类型 返回 'png‘...
 * @param base64 img
 */
function getBase64Ext(base64: string) {
  const ext = base64.split(";base64,")[0].split("data:image/")[1];
  return ext;
}

function filename(ext: string): string {
  const key = moment().format("YYYY/MM/DD/");
  const hash = new UUID(4);
  return `${key + hash}.${ext}`;
}

function filenameWithFile(file: File): string {
  const ext = extBySpiltDot(file.name);
  return filename(ext);
}

function filenameWithImgPath(path: string): string {
  const ext = extBySpiltDot(path);
  return filename(ext);
}

/**
 *
 * @param path 'a.png'
 * @return 'png'
 */
function extBySpiltDot(path) {
  const list = path.split(".");
  return list[list.length - 1];
}

/**
 * 校验图片
 */
// 校验的属性
export type ICheckOptions = {
  maxSizeMB?: number; // mb
  width?: number; // 图片的宽度，不一样就不匹配，
  height?: number;
  rate?: number; // 图片宽高比 （宽度/高度）
};
export type ICheckFailOptions = keyof ICheckOptions;
function check(
  file: File,
  options: ICheckOptions
): Promise<{ pass: boolean; optionKey?: ICheckFailOptions }> {
  return new Promise((resolve, reject) => {
    // 没有传参数直接通过
    if (options === undefined) {
      resolve({
        pass: true,
      });
    } else {
      const { maxSizeMB, width, height, rate } = options;

      if (maxSizeMB) {
        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
          resolve({
            pass: false,
            optionKey: "maxSizeMB",
          });
        }
      }

      if (width || height || rate) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (e) => {
          if (e.target === null) {
            reject(new Error("can not read file"));
          } else {
            const image = new Image();
            // Set the Base64 string return from FileReader as source.
            image.src = e.target.result as string;
            // Validate the File Height and Width.
            image.onload = () => {
              const iw = image.width;
              const ih = image.height;
              // eslint-disable-next-line no-shadow
              if (width) {
                if (iw !== width) {
                  resolve({
                    pass: false,
                    optionKey: "width",
                  });
                }
              }
              if (height) {
                if (ih !== height) {
                  resolve({
                    pass: false,
                    optionKey: "height",
                  });
                }
              }

              if (rate) {
                if (iw / ih !== rate) {
                  resolve({
                    pass: false,
                    optionKey: "rate",
                  });
                }
              }

              resolve({ pass: true });
            };
            image.onerror = (error) => {
              console.error(error, "加载图片出错");
              reject(error);
            };
          }
        };
      } else {
        // 因为检查图片是异步的，这里用else
        resolve({ pass: true });
      }
    }
  });
}

/**
 * 压缩图片
 */
async function compress(
  file: File,
  options = {
    maxSizeMB: 4,
    useWebWorker: false,
  }
): Promise<File> {
  const fname = file.name;
  const f = (await imageCompression(file, options)) as File;
  // @ts-ignore
  f.name = fname;
  return f;
}

/**
 * getFilefromDataUrl
 *
 * @param {string} dataUrl
 * @param {string} filename
 * @param {number} [lastModified=Date.now()]
 * @returns {Promise<File | Blob>}
 */
function getFilefromDataUrl(
  dataUrl,
  name,
  lastModified = Date.now()
): Promise<File> {
  return new Promise((resolve) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    // eslint-disable-next-line no-plusplus
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file: File = new Blob([u8arr], { type: mime }) as File;
    // @ts-ignore
    file.name = name;
    // @ts-ignore
    file.lastModified = lastModified;
    resolve(file);

    // Safari has issue with File constructor not being able to POST in FormData
    // https://github.com/Donaldcwl/browser-image-compression/issues/8
    // https://bugs.webkit.org/show_bug.cgi?id=165081
    // let file
    // try {
    //   file = new File([u8arr], filename, { type: mime }) // Edge do not support File constructor
    // } catch (e) {
    //   file = new Blob([u8arr], { type: mime })
    //   file.name = filename
    //   file.lastModified = lastModified
    // }
    // resolve(file)
  });
}

/**
 * file 转base64
 * @param {File} file
 * @returns {string} base64
 */
function getDataUrlFromFile(file: File | Blob): Promise<string> {
  return imageCompression.getDataUrlFromFile(file);
}

export {
  filenameWithFile,
  getFilefromDataUrl,
  getFileExtByFileType,
  getBase64Ext,
  filenameWithImgPath,
  check,
  compress,
  filename,
  getDataUrlFromFile,
};
