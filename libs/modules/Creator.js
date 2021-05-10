const {getRepoList, getRepoTags} = require('../request/index')
const {wrapLoading} = require('../tools/util')
const {inquirer} = require('../tools/module')
const {spawn, exec} = require('child_process');
const {templateOrigin,domain} = require('../config');

//downloadGitRepo 为普通方法，不支持promise
const downloadGitRepo = require('download-git-repo')
const util = require('util');
const path = require('path')
const log = require("./Log")

const loading = require("./Loading");

class Creator {
    constructor(projectName, targetDir) {

        this.name = projectName; //项目文件名称
        this.target = targetDir; //项目文件目录

        //将downloadGitRepo 转化成promise的函数
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    async create(options) {
        //先获取当前的模版信息
        let repo = await this.getRepoList();

        //根据模版获取当前的版本信息
        let tag = await this.getRepoTags(repo);

        //根据选择的模版和版本下载当前的地址内容
        let downloadUrl = await this.downloadGit(repo, tag);

        // 下载完成后进入到当前的下载url中进行安装node_modules以及安装完成后进行提示
        let result = this.downloadNodeModules(downloadUrl, options);
    }

    async getRepoList() {
        let repos = await wrapLoading(getRepoList, '初始化项目仓库中...');
        if (repos.length == 0) {
            log.error("没有在模板源中找到可用模板,请配置正确的模板源!")
        }
        //获取repos的name
        repos = repos.map(repo => repo.name)

        //用户交互展示出来
        let {repo} = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: "请选择一个模板创建项目:"
        })
        return repo;
    }

    async getRepoTags(repo) {
        let tags = await wrapLoading(getRepoTags, `正在查询可用的tags版本 ${repo}`, repo);
        if (tags.length == 0) {
            log.error("该模板项目尚未打tags,为了模板后期迭代,请先对该模板项目打tags标记,再来创建!")
            process.exit();
        }
        tags = tags.map(tag => tag.name)
        let {tag} = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tags,
            message: "请选择一个tags创建项目:"
        })
        return tag;
    }

    async downloadGit(repo, tag) {
        let downloadUrl = path.resolve(process.cwd(), this.target);

        //先拼接出下载路径
        let requestUrl = `direct:${domain}/${templateOrigin}/${repo}.git${tag ? '#' + tag : ''}`

        //2.把路径资源下载到某个路径上 xccjh-zjh/

        //todo 后续可以增加缓存功能
        await wrapLoading(this.downloadGitRepo, `正在初始化 ${repo} ${tag} 到本地...`, requestUrl, downloadUrl, {clone: true});
        return downloadUrl;
    }

    async downloadNodeModules(downLoadUrl, options) {
        let that = this;
        log.info('√ 项目初始化完毕!')
        if (options && options.skipInstall) {
            // const gitCommand = `git init && git add . && git commit -m 初始化项目`;
            // exec(gitCommand, function (err, stdout, stderr) {
            //     if (err) {
            //         console.log('get stdout error:' + gitCommand)
            //         console.log(stderr)
            //         log.error(`\r? 初始化git失败,不用担心,请手动进入 ${that.name} 初始化git即可:`)
            //         log.error(`\n cd ${that.name} \n git add .\n git commit -m 初始化项目`)
            //         log.error(`\n 没有安装依赖，记得手动安装依赖哦~`)
            //         process.exit()
            //     } else {
            log.info(`√ 初始化git成功!`)
            log.info(`√ 成功创建项目 ${that.name}!`)
            log.info(`√ 使用以下命令安装依赖运行项目即可:`)
            log.info(`  cd ${that.name} \n  yarn \n  yarn start`)
            process.exit()
            //     }
            // });
            return
        }
        const execProcess = `cd ${downLoadUrl} && yarn`;
        loading.show("正在安装项目依赖,可能需要点时间,请耐心等待...")

        const instance = spawn(execProcess, {
            stdio: 'inherit',
            shell: true
        });
        instance.on('close', (code) => {
            if (code === 0) {
                // const gitCommand = `git init && git add . && git commit -m 初始化项目`;
                // exec(gitCommand, function (err, stdout, stderr) {
                //     if (err) {
                //         console.log('get stdout error:' + gitCommand)
                //         console.log(stderr)
                //         log.error(`\r? 初始化git失败,不用担心,请手动进入 ${that.name} 初始化git即可:`)
                //         log.error(`\n cd ${that.name} \n git add .\n git commit -m 初始化项目`)
                //         process.exit()
                //     } else {
                log.info(`√ 安装依赖成功,初始化git成功!`)
                log.info(`√ 成功创建项目 ${that.name}!`)
                log.info(`√ 使用以下命令运行项目即可:`)
                log.info(`  cd ${that.name} \n  yarn start \n`)
                process.exit()
                //     }
                // });
            } else {
                log.error(`\r? 安装依赖失败,不用担心,请手动进入 ${that.name} 安装依赖即可:`)
                log.error(`\n cd ${that.name} \n yarn \n yarn start`)
                process.exit()
            }
        });
        return true;
    }
}

module.exports = Creator;
