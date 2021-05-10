/**
 * 添加项目模版
 * add
 */
const {fse, inquirer,} = require("../tools/module");
const path = require('path')
const log = require("../modules/Log")
const {addTemplate, templateConfig, fileExtList} = require('../config/template')
const {createSerialEventNoRe} = require("../modules/async")

module.exports = async function (fileDir, options) {
    //创建模版文件
    if (options.template) {
        await createTemplate(fileDir)
        return;
    }
    //创建单个文件
    createSingleFile(fileDir, options)
}

/**
 * 打印内容
 * @param {*} resultReason
 */
function printLog(resultReason) {
    resultReason.forEach(result => {
        if (result) {
            let resultArr = result.msg.split("^")
            if (result.type) {
                log.success('\r\t' + resultArr[0] + '=====' + resultArr[1])
            } else {
                log.error('\r\t' + resultArr[0] + '=====' + resultArr[1])
            }
        }
    })
}

/**
 * 创建单个文本文件
 * @param {*} fileDir
 */
async function createSingleFile(fileDir, options) {
    //只能输入相对路径
    if (path.isAbsolute(fileDir)) {
        log.error("请输入相对路径!")
        process.exit(0)
    }
    const {ext} = path.parse(fileDir)
    //1.判断当前最后一个文件是否有后缀，如果没有后缀，则进行后缀选择，如果有直接创建文件
    let resultExt = [ext];
    if (!ext) {
        const exts = await inquirer.prompt([
            {
                name: 'fileExt',
                type: 'checkbox',//类型比较丰富
                message: "请选择文件类型",
                choices: fileExtList,
                validate: function (value) {
                    var done = this.async();
                    setTimeout(function () {
                        if (value.length == 0) {
                            done('你必须选择文件类型!');
                            return;
                        }
                        done(null, true);
                    }, 0);
                }
            },]
        )
        resultExt = exts.fileExt;
    }
    const arr = resultExt.map((item) => {
        if (fileDir.lastIndexOf('/') === fileDir.length - 1) {
            const tmp = fileDir.split('/')
            return fileDir + tmp[tmp.length - 2] + item
        } else {
            if(ext) {
                return fileDir
            }
            return fileDir + item
        }
    })
    await createFileEvent(arr, '', options.force)
}

/**
 * 创建文件模版
 * @param {*} templateName 输入要创建的模版名称
 */
async function createTemplate(templateName) {
    /**
     * 1.模版名字输入是否合理  没有模版则进行添加文件名称 文件中不包含/字符 *
     */
        //2.输入模版名字
        //2.1 选择创建的样式类型
    let createDirName = templateName;
    if (!createDirName) {
        let dirInputName = await inquirer.prompt([{
            name: 'dirname',
            type: 'input',
            message: '请输入你的模板文件名称:'
        }])
        createDirName = dirInputName.dirname;
    }
    if (/\./g.test(createDirName)) {
        log.error("模板文件名称不要带上后缀名,请重新操作一次!")
        process.exit(1)
    }
    //当前文件夹是否存在
    if (fse.pathExistsSync(createDirName)) {
        // log.warning("检测目录已存在，删除中...")
        // fse.removeSync(createDirName)
        // log.success("删除完毕!")
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
            // await fse.remove(targetDir);
            log.success(`\r移除成功!`)
        }
    }

    //选择要进行生成的模版类型
    let type = Object.keys(addTemplate);
    let resultTemType = await inquirer.prompt([{
        name: 'type',
        type: 'list',
        choices: type,
        message: '请选择模板类型：'
    }])
    let templateType = resultTemType.type;
    const arr = addTemplate[templateType].map((item) => {
        if (createDirName.lastIndexOf('/') === createDirName.length - 1) {
            const tmp = createDirName.split('/')
            return createDirName + tmp[tmp.length - 2] + item
        } else {
            return createDirName + item
        }
    })
    await createFileEvent(arr, '', true)
    log.success(`${createDirName} 模板生成成功!`)
}

/**
 * 创建文件的异步函数
 * @param {*} arr  当前文件的文件名称 [index.js,c.js]
 * @param {*} dirName 文件夹名称
 * @param {*} force 是否需要强制去更新
 */
async function createFileEvent(arr, dirName, force) {
    let resArr = []
    await createSerialEventNoRe(arr, async (item) => {
        fileName = path.join(dirName, item)
        let result = await createFile(fileName, force);
        resArr.push(result)
    }, (res) => {
        printLog(resArr)
    })
    return 0
}

/**
 * 创建文件
 * @param {*} fileName  文件名字
 * @param {*} force 是否需要强制创建
 */
async function createFile(fileName, force) {
    const {ext} = path.parse(fileName)
    const fileExt = ext;
    //2.判读文件是否存在ext
    if (fse.pathExistsSync(fileName)) {
        if (!force) {
            log.warning(`文件 ${fileName} 已经存在!`);
            //进行选择是否继续创建 如果继续创建则删除源文件
            let op = await inquirer.prompt([{
                name: 'confirm',
                type: 'confirm',
                message: `你想继续生成吗?将会覆盖掉已存在的文件!`,
            }])
            if (!op.confirm) {
                return {type: false, msg: `${fileName} ^ 取消生成!`}
            }
        }
        fse.removeSync(fileName);
    }
    //3.如果是.vue文件或者是.json文件进行文本的copy
    const tplPath = path.join(__dirname, '../../template/index' + fileExt);
    if (templateConfig.indexOf(fileExt) != -1) {
        await fse.copy(tplPath, path.resolve(process.cwd(), fileName), err => {
            if (err) {
                log.error(err)
                process.exit(0)
            }
        })
    } else {
        //3.进行创建文件 先获取创建文件的路径
        await fse.ensureFile(path.resolve(process.cwd(), fileName), err => {
            if (err) {
                log.error(err)
                process.exit(0)
            }
        })
    }
    return {type: true, msg: `${fileName}  ^ 生成成功!`};
}


/**
 * @param { src: String }
 * @param { dest: String }
 */

function copyDirSync(src, dest) {
    if (!isFileExist(dest)) {
        fs.mkdirSync(dest);
    }
    if (!isFileExist(src)) {
        return false;
    }
    // console.log("src:" + src + ", dest:" + dest);
    // 拷贝新的内容进去
    const dirs = fs.readdirSync(src);
    dirs.forEach(function (item) {
        const item_path = path.join(src, item);
        const temp = fs.statSync(item_path);
        if (temp.isFile()) { // 是文件
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()) { // 是目录
            copyDirSync(item_path, path.join(dest, item));
        }
    });
}


function isFileExist(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}
