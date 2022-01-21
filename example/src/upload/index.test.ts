import { createFile } from "../__test__/file";
import { check, filename } from "./helper";

/**
- 压缩上传测试完成（用同一张图片是否开启压缩测试）
-

*/

// // eslint-disable-next-line no-shadow
// function readImg(url: string) {
//   const data = fs.readFileSync(url);
//   const extensionName = path.extname(url);

//   // convert image file to base64-encoded string
//   const base64Image = new Buffer(data, 'binary').toString('base64');

//   // combine all strings
//   const imgSrcString = `data:image/${extensionName
//     .split('.')
//     .pop()};base64,${base64Image}`;

//   return imgSrcString;
//   // send image src string into jade compiler
// }

describe("test upload", () => {
  it("check file max size", async () => {
    const size = 1024 * 1024 * 5; // 5mb
    const file = createFile("1.jpg", size, "image/jpeg") as File;

    const { pass } = await check(file, { maxSizeMB: 4 });
    expect(pass).toBeFalsy();
  });

  it("check file max size", async () => {
    const size = 1024 * 1024 * 1;
    const file = createFile("1.jpg", size, "image/jpeg") as File;

    const { pass } = await check(file, { maxSizeMB: 4 });
    expect(pass).toBeTruthy();
  });

  // it('check base64', () => {
  //   expect('').toBe('1');
  // });

  it("output filename", () => {
    const ext = "png";
    const fname = filename(ext);

    expect(fname).toMatch(/^\d{4}\/\d{2}\/\d{2}\//);
  });

  // it('compress max 4mb', () => {
  //   expect('').toBe('1');
  // });
});
