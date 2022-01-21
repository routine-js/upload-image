type WxUploadImageOptions = {
  url: string;
  imageSrc: string;
  fname: string;
  oss: {
    OSSAccessKeyId: string;
    signature: string;
    "x-oss-security-token": string;
    policy: string;
  };
};
/**
 * 微信上传图片
 * @param uploadFile
 * @param options
 */
export function wxUploadImage(
  wxApi: typeof wx,
  options: WxUploadImageOptions
): Promise<wx.UploadFileResponse> {
  const { url, imageSrc, fname, oss } = options;

  return new Promise((resolve, reject) => {
    wxApi.uploadFile({
      url,
      filePath: imageSrc,
      name: "file",
      formData: {
        // name: imageSrc,
        key: fname,
        policy: oss.policy,
        OSSAccessKeyId: oss.OSSAccessKeyId,
        success_action_status: "200",
        signature: oss.signature,
        "x-oss-security-token": oss["x-oss-security-token"],
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

/**
 *
 * @param w
 * @param count
 */
export function wxChooseImage(
  wxApi: typeof wx,
  count: number
): Promise<wx.TempFilesData> {
  return new Promise((resolve, reject) => {
    wxApi.chooseImage({
      count,
      sizeType: ["compressed", "original"],
      sourceType: ["album", "camera"],
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
