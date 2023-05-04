const fs = require('fs')
const fsp = fs.promises;
const path = require('path');

async function createBundle(pathDir, pathBundle) {
  try {
    const files = await fsp.readdir(pathDir);
    const cssFiles = async function () {
      let data = '';
      for (const file of files) {
        if (path.extname(file) == ".css") {
          const pathFile = path.join(pathDir, file);
          const readableStream = fs.createReadStream(pathFile, 'utf-8');
          for await (const chunk of readableStream) {
            data += chunk;
          }
        };
      }
      return data;
    }
    const cssText = await cssFiles();
    await fsp.writeFile(pathBundle, cssText);
    console.log('bundle created')
  }
  catch (error) {
    console.log(error)
  }
}
const pathDir = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
createBundle(pathDir, pathBundle);
