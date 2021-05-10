
const {
  getdate,
  getStdout,
  getCommitId,
  getCommitInfo,
  getBranch,
  getCommitAuthor
} = require('./common')

async function record () {
  const commitId = await getCommitId()
  console.log(commitId)
  const branch = await getBranch()
  console.log(2)
  const commitInfo = await getCommitInfo(commitId)
  console.log(3)
  const author = await getCommitAuthor()
  console.log(4)
}

record()
