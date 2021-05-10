
/**
 * 删除项目
 */
const { fse, inquirer} = require("../tools/module")
const loading = require("../modules/Loading")
const path = require("path")
const log = require("../modules/Log")
module.exports = async (fileDirArr, args) => {
  /**
   * 1.判断当前项目是否存在
   * 2.存在进行提示 是否删除
   * 3.不存在进行提示
   */
  //正则匹配到文件内容
  let fileLists=[];
  //正则匹配式 删除文件
  if(fileDirArr.length>1){
    fileLists = fileDirArr;
     //文件存在 判断是否是文件夹 如果是文件夹并且内部包含文件 则进行提示 选择
    fileLists.forEach(file=>{
      let filePath = file
      let fi = fse.statSync(filePath)
      if(fi.isFile()){
        fse.removeSync(filePath)
      }
    })
    log.success("\r删除成功!")
    return ;
  }

  let fileDir = fileDirArr[0]
  if (!fse.existsSync(fileDir)) {
    log.warning("该文件路径 " + fileDir + " 不存在")
    process.exit(0)
  }

  let result = fse.statSync(fileDir);
  if (result.isDirectory()) {
    let files = fse.readdirSync(fileDir)
    if (files.length > 0) {
      let op = await inquirer.prompt([{
        name: 'confirm',
        type: 'confirm',
        message: `该目录存在文件 ,你确定要全部删除吗?`,
      }])
      if (!op.confirm) {
        log.info("你取消了操作!")
        process.exit(0)
      }
    }
  }
  //直接进行删除即可
  loading.show("删除文件中....")
  try {
    fse.removeSync(fileDir)
    loading.succeed();
    log.success("\r删除成功!")
  }
  catch (err) {
    loading.fail(err);
  }
}
