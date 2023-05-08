const fs = require('fs');
const fsp = require('fs/promises')
const path = require('path');

const pathProject = path.join(__dirname, 'project-dist');
const pathComponents = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndex = path.join(pathProject, 'index.html');
const pathDirStyles = path.join(__dirname, 'styles');
const pathStyle = path.join(pathProject, 'style.css');
const pathAssets = path.join(__dirname, 'assets');
const pathCopyAssets = path.join(pathProject, 'assets');

const createDir = function (path) {
  return fsp.mkdir(path, { recursive: true })
}

const getComponents = function () {
  return fsp.readdir(pathComponents)
    .then(files => {
      let components = files.map(file => {
        const name = file.replace('.html', '');
        const pathFile = path.join(pathComponents, file)
        return fsp.readFile(pathFile)
          .then((html) => {
            return [name, html.toString()];
          })
      })
      return Promise.all(components);
    })
}

const insertComponents = function (path) {
  const components = getComponents();
  return fsp.readFile(path)
    .then((htmlCode) => {
      return htmlCode.toString();
    })
    .then((htmlCode) => {
      return components
        .then(components => {
          let html = htmlCode;
          for (const component of components) {
            const [nameComponent, htmlComponent] = component;
            html = html.replace(`{{${nameComponent}}}`, htmlComponent);
          }
          return html;
        })
    })
}

const createIndex = function (path) {
  const html = insertComponents(pathTemplate);
  return html.then((res) => {
    return fsp.writeFile(path, res);
  })
}

const createBundle = async function (pathDir, pathBundle) {
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
  }
  catch (error) {
    console.log(error);
  }
}

async function copyDir(pathCopyDir, pathNewDir) {
  const { readdir, lstat } = fsp;
  try {
    await fsp.rm(pathNewDir, { recursive: true, force: true });
    await fsp.mkdir(pathNewDir, { recursive: true });
    const files = await readdir(pathCopyDir);
    for (let file of files) {
      const sourcePath = path.join(pathCopyDir, file);
      const distPath = path.join(pathNewDir, file);
      const stats = await lstat(sourcePath);
      if (stats.isDirectory()) {
        await copyDir(sourcePath, distPath);
      } else {
        await fsp.copyFile(sourcePath, distPath);
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

createDir(pathProject)
  .then(() => {
    createIndex(pathIndex);
    createBundle(pathDirStyles, pathStyle);
    copyDir(pathAssets, pathCopyAssets);
  });