const fs = require('fs').promises;
const path = require('path');

async function copyDir(copyDir, nameNewDir) {
  const { readdir } = fs;
  const pathCopyDir = path.join(__dirname, copyDir);
  const pathNewDir = path.join(__dirname, nameNewDir);
  try {
    await fs.rm(pathNewDir, { recursive: true, force: true});
    await fs.mkdir(pathNewDir, { recursive: true });
    const files = await readdir(pathCopyDir);
    files.forEach(file => {
      const pathFile = (pathDir) => path.join(pathDir, file)
      fs.copyFile(pathFile(pathCopyDir), pathFile(pathNewDir));
    });
    console.log(`${copyDir} copied to ${nameNewDir}`)
  }
  catch (error) {
    console.log(error);
  }
}

copyDir('files', 'files-copy');
