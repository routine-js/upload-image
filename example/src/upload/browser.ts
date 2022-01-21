import OSS from "ali-oss";
import { XOR } from "../global.d";
/**
 * todo
 * 1 filename增加前缀
 * oss 签名，重命名下载文件
 * 导出工具
 */
import {
  filenameWithFile,
  getBase64Ext,
  check,
  compress,
  ICheckOptions,
  ICheckFailOptions,
  getFilefromDataUrl,
} from "./helper";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore

interface IUploadOpt {
  filenamePrefix?: string; // 默认文件名为 YYYY/MM/DD/uuid.ext, 你可以给这个文件名增加前缀
  useSignatureUrl?: boolean; // 是否对文件名称签名，用于私有 buket 文件的访问 默认关闭
  expiration?: number; // 签名过期时间 单位秒，默认1800，最大3600
  imageProcess?: string; // 图片处理参数，如果传入，处理后 url 在返回结果的 processUrl 中取到
  rename?: string; // 前置条件 useSignatureUrl 为true，强制下载名称，设置此参数生成强制下载 url，并以参数命名，url 在返回结果的 processUrl 中取到
  useCompress?: boolean; // 是否压缩 默认开启
  useCheck?: boolean; // 是否要校验 默认关闭， 开启之后需要传入checkOptions
  checkOptions?: ICheckOptions;
  compressOptions?: {
    maxSizeMB: number; // mb
    useWebWorker: boolean;
  };
  // oss 相关的数据
  oss: {
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    bucket: string;
    region: string;
  };
}
type IUploadProps = XOR<IUploadPropsBase64, IUploadPropsFile>;

type IUploadRes = {
  url: string; // 完整的图片地址
  processUrl?: string; // 图片处理后完整地址
  ossResult: OSS.PutObjectResult | {};
  checkPass: boolean; // 校验是否通过
  checkFailOptions?: ICheckFailOptions | "";
};

// 上传base64
type IUploadPropsBase64 = IUploadOpt & {
  base64: string; // 需要上传的base64
};
// 上传file
type IUploadPropsFile = IUploadOpt & {
  file: File; // 需要上传的 file
};
/**
 * 浏览器 压缩 校验 上传图片，返回图片地址 或者图片校验结果
 * @param props
 * @returns IUploadRes | boolean
 */
async function uploadImg(props: IUploadProps): Promise<IUploadRes> {
  const {
    base64,
    file,
    useCompress = true,
    useCheck,
    checkOptions,
    compressOptions = {
      maxSizeMB: 4, // mb
      useWebWorker: false,
    },
    oss,
    filenamePrefix = "",
    useSignatureUrl = false,
    expiration = 1800,
    imageProcess = "",
    rename,
  } = props;
  // base64 转文件
  try {
    let f: File;

    if (base64) {
      const ext = getBase64Ext(base64);
      f = await getFilefromDataUrl(base64, `tmp.${ext}`);
    } else if (file) {
      f = file;
    } else {
      throw new Error("请配置上传的文件，file or base");
    }

    // check file
    if (useCheck) {
      const { pass, optionKey } = await check(f, checkOptions);
      if (!pass) {
        return {
          url: "",
          ossResult: {},
          checkPass: false,
          checkFailOptions: optionKey,
        };
      }
    }

    if (useCompress) {
      try {
        f = await compress(f, compressOptions);
      } catch (e) {
        console.log("压缩出错, 使用原文件");
      }
    }

    const result = await uploadFile({
      filenamePrefix,
      file: f,
      oss,
    });

    // const fname = filename(file);
    // const result = await uploadOss(f, fname, oss);

    let url = result?.url || "";
    let processUrl = "";
    if (useSignatureUrl) {
      url = signatureUrl({
        fileKey: result.name,
        oss,
        expiration,
      });
      if (imageProcess || rename) {
        processUrl = signatureUrl({
          fileKey: result.name,
          oss,
          expiration,
          imageProcess,
          rename,
        });
      }
    } else if (imageProcess) {
      processUrl = `${url}?x-oss-process=${imageProcess}`;
    }
    return {
      url,
      processUrl,
      ossResult: result,
      checkPass: true,
      checkFailOptions: "",
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function uploadOss(file: File, name: string, opt: IUploadOpt["oss"],timeout?:number) {
  try {
    const client = new OSS(opt);
    // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    const result = await client.put(name, file,{timeout:timeout});
    return result;
  } catch (e) {
    throw Error(`上传失败：${e}`);
  }
}

// 上传文件
async function uploadFile(props: {
  file: File;
  oss: IUploadOpt["oss"];
  filenamePrefix?: string;
  timeout?:number
}) {
  try {
    const { oss, file, filenamePrefix = "",timeout } = props;

    const fname = formatFilenamePrefix(filenamePrefix) + filenameWithFile(file);

    const result = await uploadOss(file, fname, oss,timeout);
    return result;
  } catch (e) {
    throw Error(`上传失败文件：${e}`);
  }
}

/**
 * URL 签名
 *
 * @param {{
 *   fileKey: string;
 *   oss: IUploadOpt['oss'];
 *   expiration?: number;
 *   imageProcess?: string;
 *   rename?: string;
 * }} opt
 * @returns {string}
 */
function signatureUrl(opt: {
  fileKey: string;
  oss: IUploadOpt["oss"];
  expiration?: number;
  imageProcess?: string;
  rename?: string;
}): string {
  return new OSS(opt.oss).signatureUrl(opt.fileKey, {
    expires: opt.expiration,
    process: opt.imageProcess,
    response: opt.rename
      ? {
          "content-disposition": `attachment;filename=${opt.rename}`,
        }
      : null,
  });
}

// 处理 filenamePrefix，头部去掉 /，尾部加 /
function formatFilenamePrefix(filenamePrefix: string) {
  if (!filenamePrefix) {
    return filenamePrefix;
  }
  if (filenamePrefix.charAt(0) === "/") {
    filenamePrefix = filenamePrefix.substr(1);
  }
  if (filenamePrefix.charAt(filenamePrefix.length - 1) !== "/") {
    filenamePrefix += "/";
  }
  return filenamePrefix;
}

function ossClient(opt: IUploadOpt["oss"]) {
  return new OSS(opt);
}

export { ossClient, uploadImg, uploadFile, signatureUrl };
