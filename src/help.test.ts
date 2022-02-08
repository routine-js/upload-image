import {extBySpiltDot, formatFilename, formatFilenameWithFile, formatFilenameWithImgPath, getBase64Ext, getFileExtByFileType, uniqueID} from './help'

const file = new File([''],'mock.png', {
  type: 'image/png'
})

const base64Image = 'data:image/png;base64,iVBORw0K'

describe('help', () => {
  it('uniqueID',() => {
    expect(uniqueID().length).toBe(36)
  })

  it('getFileExtByFileType', () => {
    const got = getFileExtByFileType(file.type)
    const want = 'png'
    expect(got).toBe(want)
  })

  it('getBase64Ext', () => {
    const got = getBase64Ext(base64Image)
    const want = 'png'
    expect(got).toBe(want)
  })

  it('formatFilename',() => {
    const got = formatFilename('png')
    const want = 'png'
    expect(typeof got === 'string').toBeTruthy()
    expect(got.length).toBe(11 + 36+ 4)
  })

  it('extBySpiltDot', () => {
    const got = extBySpiltDot('a.png')
    const want = 'png'
    expect(got).toBe(want)
  })

  it('formatFilenameWithFile', () => {
    const got = formatFilenameWithFile(file)
    expect(typeof got === 'string').toBeTruthy()
    expect(got.length).toBe(11 + 36+ 4)
  })

  it('formatFilenameWithImgPath', () => {
    const got = formatFilenameWithImgPath('a.png')
    expect(typeof got === 'string').toBeTruthy()
    expect(got.length).toBe(11 + 36+ 4)
  })
})
