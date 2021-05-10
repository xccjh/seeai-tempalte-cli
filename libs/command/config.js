const {inquirer, chalk, fse} = require('../tools/module')
const {templateDefault, domainDefault} = require('../config')
const path = require('path')
const packageInfo = require('../../package.json')
const {isString} = require('../tools/util')
const log = console.log
//配置默认选项
module.exports = async function (value, options) {
    //设置模板名字 解构相应的变量
    let {setTemplateOrigin, setDomainOrigin, setDefault, get} = options;
    //如果是设置模板字符样式
    if (setTemplateOrigin) {
        configTemplate(options)
    }

    if (setDomainOrigin) {
        configTemplate(options)
    }

    if (get) {
        console.log(packageInfo[get] || '未找到对应配置')
    }

    if (setDefault) {
        editTemplate()
    }

}

async function editTemplate(name, msg, isTemplate) {
    //进行更改文件 package.json 中的 templateOrigin
    let targetPath = path.join(__dirname, '../../package.json')
    //读取文件
    await fse.readJson(targetPath).then(packageJson => {
        if (!name) {
            packageJson.templateOrigin = templateDefault;
            packageJson.domainOrigin = domainDefault;
        } else {
            if (isTemplate) {
                packageJson.templateOrigin = name;
            } else {
                packageJson.domainOrigin = name;
            }
        }
        //写入到.json文件中
        fse.writeJsonSync(targetPath, packageJson)
        log(chalk.green.bold(msg ? msg : `√ 配置成功!\ntemplateOrigin: ${templateDefault}\ndomainOrigin: ${domainDefault}`))
    }).catch(error => {
        log(chalk.red.bold(error))
    })
}

async function configTemplate(options) {
    //输入当前用户自定义的内容
    let result = await inquirer.prompt([{
        name: 'repoName',
        type: 'input',
        message: "请输入你想配置为默认的" + (options.setTemplateOrigin ? "模板源" : "模板域") + ':',
        validate: function (input) {
            var done = this.async();
            if (!input || !isString(input)) {
                log(chalk.red("输入格式错误或没有收到输入的值 ,请再输入一次!"))
                done(null, false);
                return false
                //用户未输入 则表示用默认的配置项目
            }
            done(null, true);
        }
    }])
    //进行二次的确认
    let confirmResult = await inquirer.prompt([{
        name: 'confirm',
        type: 'confirm',
        message: `请确认你刚才输入的${options.setTemplateOrigin ? "模板源" : "模板域"}: ${result.repoName}`,
    }])

    if (!confirmResult.confirm) {
        log(chalk.red.bold("你取消了操作!"))
        process.exit(0)
    }
    editTemplate(result.repoName, `√ 配置成功!\ntemplateOrigin: ${result.repoName}`, options.setTemplateOrigin)
}
