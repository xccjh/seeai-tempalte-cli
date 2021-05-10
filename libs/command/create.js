

const path = require('path')
const { inquirer, fse ,program } = require('../tools/module')
const Creator = require('../modules/Creator')
const log = require("../modules/Log")

//创建项目
module.exports = async function (projectName, options) {


    // todo 校验文件内容格式
    //获取当前命令执行时候的工作目录
    const cwd = process.cwd();

    //获取当前target的目录
    const targetDir = path.join(cwd, projectName)

    //判断当前的文件夹是否存在
    if (fse.existsSync(targetDir)) {
      // 命令中存在--force
      if (options && options.force) {
        await fse.remove(targetDir);
      } else {

        let { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',//类型比较丰富
            message: "检测到目标路径已存在相关文件,请确认进行以下操作类型：",
            choices: [
              { name: '覆盖', value: 'overwrite' },
              { name: '取消', value: false, },
            ]
          },
        ])
        if (!action) {
          log.info("您选择了取消操作!")
          process.exit(0)
        } else if (action == 'overwrite') {
          log.info(`\r移除中.....`)
          await fse.remove(targetDir);
          log.success(`\r移除成功!`)
        }
      }
    }

    //当前文件操作已经完成 开始创建项目

    let creator = new Creator(projectName, targetDir)
    creator.create(options);
}
