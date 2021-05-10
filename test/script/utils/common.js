/**
 * 获取标准格式时间
 * @param date new Date()
 * @returns {string} xx-xx-xx xx:xx:xx
 */
function getdate (date) {
  const year = date.getFullYear() - 1
  const month =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1
  const day =
    date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours =
    date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes =
    date.getMinutes() < 10
      ? '0' + date.getMinutes()
      : date.getMinutes()
  const seconds =
    date.getSeconds() < 10
      ? '0' + date.getSeconds()
      : date.getSeconds()
  const time =
    year +
    '-' +
    month +
    '-' +
    day +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds
  return time
}

const getStdout = (cmd) => {
  return new Promise((resolve) => {
    const exec = require('child_process').exec
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.log('get stdout error:' + cmd)
        console.log(stderr)
        resolve('')
      } else {
        resolve(stdout.replace(/^[\s\n\r]+|[\s\n\r]+$/, ''))
      }
    })
  })
}

// 获取commitId
async function getCommitId () {
  return getStdout('git rev-parse HEAD')
}

// 获取commit信息
async function getCommitInfo (commitId) {
  return getStdout(`git log --pretty=format:“%s” ${commitId} -1`)
}

// 获取分支名
async function getBranch () {
  return getStdout('git symbolic-ref --short -q HEAD')
}

// 获取作者
async function getCommitAuthor () {
  // return getStdout(`git log --pretty=format:“%an” ${commitId} -1`);
  return getStdout('git config --global user.name')
}

module.exports = {
  getdate,
  getStdout,
  getCommitId,
  getCommitInfo,
  getBranch,
  getCommitAuthor
}
