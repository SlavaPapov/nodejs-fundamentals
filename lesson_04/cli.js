'use strict'

/*
По ссылке вы найдете файл с логами запросов к серверу весом более 2 Гб.
Напишите программу, которая находит в этом файле все записи с ip-адресами
89.123.1.41 и 34.48.240.111, а также сохраняет их в отдельные файлы с названием
“%ip-адрес%_requests.log”.
*/

/*
По ссылке вы найдете файл с логами запросов к серверу весом более 2 Гб.
Напишите программу, которая находит в этом файле все записи с ip-адресами
89.123.1.41 и 34.48.240.111, а также сохраняет их в отдельные файлы с названием
“%ip-адрес%_requests.log”.
*/

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const yargs = require('yargs')

const absolutizePath = (target) => {
  if (!target.startsWith('/')) {
    return path.join(currentPath, target)
  }
  return target
}

const isFile = (targetPath) => {
  return fs.lstatSync(absolutizePath(targetPath)).isFile()
}

const isDirectory = (targetPath) => {
  return fs.lstatSync(absolutizePath(targetPath)).isDirectory()
}

function getPrettyChoises(targetPath) {
  const dirContent = fs.readdirSync(targetPath)
  return [
    new inquirer.Separator('Directories:'),
    ...dirContent.filter(isDirectory),
    new inquirer.Separator('Files:'),
    ...dirContent.filter(isFile),
  ]
}

function ask() {
  inquirer
    .prompt([
      {
        name: 'target',
        type: 'list',
        message: 'Select a folder or a file',
        choices: getPrettyChoises(currentPath),
        loop: false,
      },
    ])
    .then((answer) => {
      const { target } = answer
      currentPath = absolutizePath(target)
      if (isDirectory(currentPath)) {
        ask()
      } else {
        inquirer
          .prompt({
            type: 'input',
            name: 'searchPattern',
            message:
              'Specify the search pattern or leave blank to show the whole file content:',
            default: '89.123.1.41',
          })
          .then((answers) => {
            const { searchPattern } = answers
            const readlineInterface = readline.createInterface({
              input: fs.createReadStream(currentPath),
            })
            readlineInterface.on('line', (line) => {
              if (line.indexOf(searchPattern) > -1) {
                console.log(line)
              }
            })
          })
      }
    })
}

let currentPath = process.cwd()

const options = yargs.usage('Usage: -p <path>').option('d', {
  alias: 'startPath',
  describe:
    'Relative or absolute target directory path (current is the default)',
  type: 'string',
  demandOption: false,
  default: currentPath,
}).argv

currentPath = absolutizePath(options.startPath)

ask()
