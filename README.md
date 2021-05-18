# seeai-cli使用说明

## 创建项目

输入项目命令后进行输入项目名称，选择项目模版，选择项目版本，回车后即可
```
seeai-cli create [project-name]
```
![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/create-all.gif)

### 强制创建
此时将不检测当前创建文件目录中是否存在同名的文件夹，将会直接移除进行创建先的项目
```
seeai-cli create [project-name] -f
```

### 跳过安装依赖创建
```
seeai-cli create [project-name] -s
```
![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/create.gif)

## config 配置项目

### 默认模版源
```
https://gitee.com/api/v5/repos/xccjh-zjh
```
### 自定义模板源

通过命令修改模版源，需要在gitee上创建自己的项目仓库模版organizations

执行以下命令 
```
seeai-cli c -sto
```
命令行交互
```
? please input your template origin xccjh-zjh
? please confirm the template origin xccjh-zjh Yes
√ config successful!
```
![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/sto.gif)

更换github模板域，通过命令修改模版域:

```
seeai-cli c -stu
```
命令行交互
```
? please input your template domain https://github.com
? please confirm the template domain https://github.com Yes
√ config successful!
```
![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/stu.gif)

这样再次进行创建项目操作 就可以下载你自己模版源下的文件了

### 获取当前模板源配置
![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/stg.gif)

1. 执行：
```
seeai-cli c -g 
```
命令行交互
```shell script
error: option '-g,--get <templateOrigin|domainOrigin|templateDefault|domainDefault>' argument missing
```
<br/>
<hr/>
2. 执行：

```shell script
seeai-cli c -g templateOrigin
```
命令行交互
```shell script
xccjh-zjh
```
<br/>
<hr/>

3. 执行：

```shell script
seeai-cli c -g domainOrigin
```
命令行交互
```shell script
https://gitee.com
```

### 重置为默认模板源
1. 执行：
```
seeai-cli c -std
```
2. 示例：

![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/std.gif)

## 增加文件

### 直接添加文件 含后缀名字
```
seeai-cli g seeai-cli.js 
```
* 检测本目录下是否有同名文件，如果有则进行提示，根据后续选择进行操作，无同名文件将会直接创建
* 无同名文件
```jsx static
        seeai-cli.js  =====  生成成功!
```
存在同名文件
```
文件 seeai-cli.js 已经存在!
? 你想继续生成吗?将会覆盖掉已存在的文件! (Y/n)
        seeai-cli.js  =====  生成成功!
```
### 直接添加文件 不包含后缀名字

```
seeai-cli g seeai-cli 
```
输入完成后，可选择文件名字后缀进行填充
```
? 请选择文件类型 (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) .js
 (*) .ts
 (*) .vue
 (*) .json
 ( ) .less
 ( ) .css
 ( ) .scss
        seeai-cli.js  =====  生成成功!
        seeai-cli.ts  =====  生成成功!
        seeai-cli.vue  =====  生成成功!
        seeai-cli.json  =====  生成成功!
```
### 输入参数为路径
```
seeai-cli g seeai-cli/path.js
```
将会创建seeai-cli文件夹和path.js


### 输入参数为路径 未带后缀
```
seeai-cli g seeai-cli/path
```
此时将seeai-cli为文件夹，seeai-cli为文件名称 进行选择创建文件后缀创建文件
```
seeai-cli g seeai-cli/
```
进行选择创建文件后缀创建文件,将会创建seeai-cli文件夹和seeai-cli.js

![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/file.gif)

### 强制创建文件

```
seeai-cli g path -f
``` 

###  创建模版文件

```
seeai-cli g -t <template-name>
```
选择后进行操作即可，名称规则同创建文件
```
seeai-cli g -t
```
命令行交互
```shell script
? 请输入你的模板文件名称: exit/template
? 请选择模板类型：(Use arrow keys)
> vue
  react

        exit/template.vue  ===== 生成成功!
        exit/template.less  ===== 生成成功!
        exit/template.js  ===== 生成成功!
```

![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/template.gif)

```shell script
seeai-cli g -t template
```
命令行交互
```shell script
? 请选择模板类型：(Use arrow keys)
> vue
  react
        exit/template.vue  ===== 生成成功!
        exit/template.less  ===== 生成成功!
        exit/template.scss  ===== 生成成功!
        exit/template.js  ===== 生成成功!
```

[注意点]fileName 相对路径

## 删除文件/文件夹

### 删除文件夹
```
seeai-cli r pathName
```
![hq-seeai-cli使用演示](https://xccjhzjh.oss-cn-hongkong.aliyuncs.com/xccjh-images/del.gif)

### 删除单个文件
```
seeai-cli r filename.js
```
### 删除同名、后缀名字不同的文件
```
seeai-cli r fileName.*
```


