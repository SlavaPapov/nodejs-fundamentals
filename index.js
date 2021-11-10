const math = require('mathjs');
const colors = require('colors');
const argv = process.argv;
const colorsOrder = ['green', 'yellow', 'red'];

if (argv.length < 4 || isNaN(argv[2]) || isNaN(argv[3])) {
  console.error(
    `Аргумент, переданный при запуске, не считается числом. Программа завершена.`
  );
  process.exit(1);
}

let currentNum = +argv[2];
let maxNum = +argv[3];
let currentColor = 0;
for (; currentNum <= maxNum; currentNum++) {
  if (math.isPrime(currentNum)) {
    console.log(currentNum.toString()[colorsOrder[currentColor % 3]]);
    currentColor++;
  }
}

let primesFound = currentColor > 0;
if (!primesFound) {
  console.log(`Простых чисел в диапазоне нет.`.red);
}
