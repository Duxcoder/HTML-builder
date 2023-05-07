const fs = require('fs');
const path = require('path');
const process = require('process');
const os = require('os');

const { stdin, stdout } = process;
const url = path.join(__dirname, 'text.txt')

fs.writeFile(url, '', (err) => {
  if (err) throw err;
  console.log('Хай, как ты сюда забрёл друг? Ну-ка расскажи мне в консоли...');
});

process.on('exit', () => {
  stdout.write('Да? Очень интересно, ладно, всё удачи, мне пора!' + os.EOL);
  process.exit();
});

stdin.on('data', data => {
  const isExit = (data) => data.toString().trim() === 'exit';
  const message = isExit(data) ? '' : data.toString().replace(os.EOL, '') + os.EOL;
  fs.appendFile(url, message, err => {
    if (err) throw err;
    if (isExit(data)) process.exit();
  })
});

process.on('SIGINT', () => {
  console.log('');
  process.exit()
});