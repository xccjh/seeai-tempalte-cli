
const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra')
// console.log(path.join(__dirname, '../template/index.vue'));
// console.log(path.resolve(process.cwd(),'aa/aa.vue'));
//
// fse.copy(path.join(__dirname, '../template/index.vue'), path.resolve(process.cwd(),'aa/aa.vue'), err => {
//     if (err) {
//         log.error(err)
//         process.exit(0)
//     }
// })

const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', './']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
})
