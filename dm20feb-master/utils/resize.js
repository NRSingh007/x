const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const path = require('path');
const getStream = require('get-stream');
const fs = require('fs');

class Resize {

  constructor(folder) {
    this.folder = folder;
  }

  async save(file) {
    const stream = fs.createReadStream(file.path);
    const buffer = await getStream(stream);
    // console.log(buffer);
    // const filename = Resize.filename();
    const filename = file.filename;
    const compressedFilepath = this.filepath('compressed',filename);
    const webFilepath = this.filepath('web',filename);
    const webThumbnailFilepath = this.filepath('web_thumbnail',filename);
    const mobileFilepath = this.filepath('mobile',filename);
    const mobileThumbnailFilepath = this.filepath('mobile_thumbnail',filename);

    try {

      // First convert & compress size to 60%
      await sharp(file.path)
      .flatten({background: {r: 255, g: 255, b: 255}})
      .toFormat('jpeg')
      .jpeg({quality: 60})
      .toFile(compressedFilepath);

      // web resize
      await sharp(compressedFilepath)
      .resize( 1280 )
      .toFile(webFilepath);

      // web thumbnail
      await sharp(compressedFilepath)
      .resize( 320 )
      .toFile(webThumbnailFilepath);


      // mobile
      await sharp(compressedFilepath)
      .resize( 640 )
      .toFile(mobileFilepath);

      // mobile thumbnail
      await sharp(compressedFilepath)
      .resize( 160 )
      .toFile(mobileThumbnailFilepath);

      return filename;
      
    } catch (error) {
      console.log("image resizing error ",error);

    }
    
  }
  static filename() {
    return `${uuidv4()}.jpg`;
  }
  filepath( specificFolder, filename) {
    return path.resolve(`${this.folder}/${specificFolder}/${filename}`)
  }
}
module.exports = Resize;