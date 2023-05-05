const fs = require('fs/promises');
const path = require('path');

async function createDir(path) {
  await fs.mkdir(path, { recursive: true })
}
const pathProject = path.join(__dirname, 'project-dist');
createDir(pathProject);

const pathComponents = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndex = path.join(pathProject, 'index.html');


const getComponents = function () {
  return fs.readdir(pathComponents)
    .then(files => {
      let components = files.map(file => {
        const name = file.replace('.html', '');
        const pathFile = path.join(pathComponents, file)
        return fs.readFile(pathFile)
          .then((html) => {
            return [name, html.toString()]
          })
      })
      return Promise.all(components)
    })
}

const insertComponents = function (path) {
  const components = getComponents();
  return fs.readFile(path)
    .then((htmlCode) => {
      return htmlCode.toString()
    })
    .then((htmlCode) => {
      return components
        .then(components => {
          let html = htmlCode
          for (const component of components) {
            const [nameComponent, htmlComponent] = component
            html = html.replace(`{{${nameComponent}}}`, htmlComponent);
          }
          return html
        })
    })
}

const createIndex = function (path) {
  const html = insertComponents(pathTemplate);
  return html.then((res) => {
    return fs.writeFile(path, res)
  })
}

// const createBundleCss = function (path) {

// }
createIndex(pathIndex);