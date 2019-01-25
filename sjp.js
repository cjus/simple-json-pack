#!/usr/bin/env node

/**
* @name sjp
* @description Simple JSON Pack CLI
*/
const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');
const SimpleJSONPack = require('./simple-json-pack');

/**
 * @name conlog
 * @param {string} type - log type: 'info', 'debug', 'warning', 'error', 'fatal'
 * @param {string} message - message to log
 * @return {undefined}
 */
function log(type, message) {
  if (type !== 'info' && type !== 'debug' && type !== 'warning' && type !== 'error' && type !== 'fatal') {
    message = type;
    type = 'info';
  }
  let colorizer;
  switch (type) {
    case 'info':
      colorizer = chalk.white;
      break;
    case 'debug':
      colorizer = chalk.cyan;
      break;
    case 'warning':
      colorizer = chalk.yellow;
      break;
    case 'error':
      colorizer = chalk.red;
      break;
    case 'fatal':
      colorizer = chalk.bgRed;
      break;
  }
  console.log(colorizer(message));
}

/**
* @name main
* @description CLI driver
* @returns {undefined}
*/
function main() {
  log('info', 'SJP - Simple JSON Pack, ver 1.0');

  let simpleJSONPack = new SimpleJSONPack();
  program
    .version('1.0.0')
    .option('-p, --pack', 'perform packing')
    .option('-u, --unpack', 'perform unpacking')
    .option('-i, --input <file>', 'input filename')
    .option('-o, --output <file>', 'output filename')
    .parse(process.argv);

  if (!program.pack && !program.unpack && !program.input) {
    log('error', 'Use --help for options');
    process.exit(0);
  }
  if (program.pack && program.unpack) {
    log('error', 'You can\'t specify both packing and unpacking flags. Use one or the other.');
    process.exit(0);
  }
  if (!program.input) {
    log('error', 'You must specify an input file name.');
    process.exit(0);
  }
  if (!program.output) {
    program.output = `${program.input}.out`;
  }
  if (program.input === program.output) {
    log('error', 'Input and output file names can not be the same.');
    process.exit(0);
  }

  fs.readFile(program.input, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    let processedJSON = '';
    if (program.pack) {
      processedJSON = simpleJSONPack.pack(data);
    } else if (program.unpack) {
      processedJSON = simpleJSONPack.unpack(data);
    }
    fs.writeFile(program.output, processedJSON, (err) => {
      if (err) {
        throw err;
      }
      if (program.pack) {
        const stats1 = fs.statSync(program.input);
        const stats2 = fs.statSync(program.output);
        let reduction = 100 - (stats2.size / stats1.size) * 100;
        log('info', `${program.input} file size in bytes: ${stats1.size}`);
        log('info', `${program.output} file size in bytes: ${stats2.size}`);
        log('info', `resulting compression: ${reduction.toPrecision(2)}%`);
      }
    });
  });
}

main();
