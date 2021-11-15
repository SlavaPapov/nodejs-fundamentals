/*
По ссылке вы найдете файл с логами запросов к серверу весом более 2 Гб.
Напишите программу, которая находит в этом файле все записи с ip-адресами
89.123.1.41 и 34.48.240.111, а также сохраняет их в отдельные файлы с названием
“%ip-адрес%_requests.log”.
*/

const readline = require('readline');
const fs = require('fs');
const srcFile = './access.log';
const _ips = ['89.123.1.41', '34.48.240.111']
const targets = Object.fromEntries(_ips.map(ip => [ip, fs.createWriteStream(`./${ip}_requests.log`) ] ));
const nl = '\n';

const readlineInterface = readline.createInterface({ input: fs.createReadStream(srcFile) });
readlineInterface.on('line', (line) => {
  for (const [ip, ws] of Object.entries(targets)) {
    if (line.startsWith(ip)) { ws.write(line + nl); }
  }
});

readlineInterface.on('close', (line) => {
  Object.values(targets).forEach(ws => ws.close());
});