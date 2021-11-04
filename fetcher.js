// It should take two command line arguments:
// [0] a URL
// [1] a local file path
const arg = process.argv.slice(2, 4);
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const fileExists = (data) => {
  fs.access(arg[1], err=>{
    if (err) {
      // File doesn't exist
      writeFile(data);
    } else {
      // File already exists
      const rl = readline.createInterface({ input, output });
      rl.question(`File: ${arg[1]} already exists. Would you like to overwrite? (y/n)\n`, answer => {
        if (answer.toLowerCase() === 'y') {
          writeFile(data);
          rl.close();
        } else {
          console.log('Action cancelled, exiting without overwriting.');
          rl.close();
        }
      });
    }
  });
};

const writeFile = (data) => {
  fs.writeFile(arg[1], data, err => {
    if (err) {
      console.log('No such file or directory - Terminating');
    } else console.log(`Downloaded and saved ${data.length} bytes to ${arg[1]}`);
    // can also fs.statSync(arg[1]).size
  });
};

request(arg[0], (err, response, body) => {
  if (err) console.log('There was an error with the URL provided - Terminating');
  else fileExists(body);
});