### git

Git（读音为/gɪt/）是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。 [1]  也是Linus Torvalds为了帮助管理Linux内核开发而开发的一个开放源码的版本控制软件。

常用命令

*  git config：设置身份——Name和Email地址。并且每次提交时会使用此信息。
```js
$ git config --global user.name "Your name"  
​
$ git config --global user.email "Your email"
```
* git version：检查你使用的是哪个版本的Git

* git init：将创建一个空白的新存储库，然后你可以将源代码存储在此存储库中。

* git clone：git clone命令将使用现有的存储库进行复制。git init和git clone之间有一个主要区别（在你需要在现有的存储库上进行复制时，使用git clone。git clone命令首先在内部使用git init命令，然后检出所有内容）
```js
git clone <your project URL>
```
* git add：git add命令会把所有新的代码文件或修改后的文件添加到存储库中
```js
// 将单个文件添加到暂存区
$ git add your_file_name

// 将所有修改过的文件和新文件添加到暂存区
$ git add .
```
*  git commit：git commit会将更改添加到本地存储库且可以添加注释
```js
$ git commit -m "your useful commit message"
```
* git status：查看有多少文件被修改

* git branch：git branch命令有效地管理分支。
```js
// 列出所有分支
$ git branch

// 创建新的分支
$ git branch <branch_name>

// 删除分支
$ git branch -d <branch_name>
```
* git checkout：用于在分支之间进行切换
```js
// 切换到某个分支
$ git checkout <branch_name>

// 创建并切换到新创建的分支
$ git checkout -b <your_new_branch_name>
```
* git remote：将你的本地存储库连接到远程。
```js
$ git remote add <shortname> <url>

// 例子
$ git remote add origin https://dev.azure.com/aCompiler/_git/DemoProject
```
* git push：（借助git remote命令）与远程存储库连接之后，就需要将更改推送到存储库。
```js
$ git push <远程主机名> <本地分支名> <远程分支名>

// 使用-u指定一个主机，然后后续提交直接用给git push
$ git push -u origin master

// 远程分支和本地分支同名或者新建一个远程分支master
$ git push origin master
```
* git pull：git pull命令下载内容（而不是元数据），并立即用最新的内容更新本地存储库。
```js
$ git pull <remote_url>
```
* git merge：git merge可帮助将来自两个分支的更改集成到单个分支中
```js
// 此命令会将<branch_name>合并到当前你选择的分支中
$ git merge <branch_name>
```
* git help：Git中有许多命令，如果你需要其他命令的帮助，则可以随时在终端上使用git help

* git log：可以看到所有之前的提交，并且最近的提交出现在最前面。它将显示当前已检出分支的所有提交，但是你可以强制通过所有选项来查看所有分支的所有提交。


