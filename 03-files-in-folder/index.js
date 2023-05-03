const fs = require('fs');
const path = require('path')

const { readdir } = fs;
const pathDir = path.join(__dirname, 'secret-folder');
readdir(pathDir, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach(file => {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        let fileName = file.name.replace(ext, '')
        fs.stat(path.join(pathDir, file.name), (err, stats) => {
          if (err) console.log(err);
          const size = (stats.size / 1024).toFixed(3);
          console.log(`${fileName} - ${ext.slice(1)} - ${size}kb`);
        })
      }
    })
  }
});
