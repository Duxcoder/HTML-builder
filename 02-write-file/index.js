const fs = require('fs');
const path = require('path');
const process = require('process');

const { stdin, stdout } = process;
const url = path.join(__dirname, 'text.txt')

fs.writeFile(url, '', (err) => {
  if (err) throw err;
  console.log('Хай, как ты сюда забрёл друг? Ну-ка расскажи мне в консоли...');
});

process.on('exit', () => {
  stdout.write('Да? Очень интересно, ладно, всё удачи, мне пора!');
  process.exit();
});

stdin.on('data', data => fs.appendFile(url, data, err => {
  if (err) throw err;
  if (data.toString().trim() === 'exit') process.exit();
}));

process.on('SIGINT', () => {
  console.log('');
  process.exit()
});