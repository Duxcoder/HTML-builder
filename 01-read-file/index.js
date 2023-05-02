const fs = require('fs');
const path = require('path');
const url = path.join(__dirname + '/text.txt')
const readableStream = fs.createReadStream(url, 'utf-8');
readableStream.on('data', text => console.log(text));