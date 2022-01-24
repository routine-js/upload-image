/* eslint-disable no-use-before-define */
import moment from 'dayjs';

export function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  return `${
    chr4() + chr4()
  }-${chr4()}-${chr4()}-${chr4()}-${chr4()}${chr4()}${chr4()}`;
}

/**
 * 生成文件名
 * @param fileType
 */
export function getFileExtByFileType(fileType: File['type']) {
  return fileType.split('/')[1];
}

/**
 * 获取base64图片的类型 返回 'png‘...
 * @param base64 img
 */
export function getBase64Ext(base64: string) {
  const ext = base64.split(';base64,')[0].split('data:image/')[1];
  return ext;
}

export function filename(ext: string): string {
  const key = moment().format('YYYY/MM/DD/');
  const hash = uniqueID();
  return `${key + hash}.${ext}`;
}

export function filenameWithFile(file: File): string {
  const ext = extBySpiltDot(file.name);
  return filename(ext);
}

export function filenameWithImgPath(path: string): string {
  const ext = extBySpiltDot(path);
  return filename(ext);
}

/**
 *
 * @param path 'a.png'
 * @return 'png'
 */
export function extBySpiltDot(path: string) {
  const list = path.split('.');
  return list[list.length - 1];
}
