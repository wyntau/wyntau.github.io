---
layout: post
title: 在使用 JS 的项目中使用 ESLint 强制进行 code style check
pid: 2016051301
tags: [ESLint]
---

code style 是一个经常被大家提起的东西. 当项目中人少的时候, 大家一般都能有一个约定, 并去遵守.

但是当项目变大, 或者有新的开发人员加入进来的时候, code style 不一致的问题就会变大. 甚至有些写法不规范的地方, 导致看代码的时候感觉不舒服.
假如每个人喜欢的风格不一致, 当编辑代码的时候, 又使用了代码自动格式化工具按照自己的喜好进行格式化, 那么当提交到 git 的时候, 会出现全红全绿的情况, 特别不利于 review.

因此应该采取一种手段进行约束.

所以我采用了 git hook 的方式在本地强制进行 code style check. 当 check fail 时, 直接拒绝 commit. 防止出现为了修复 code style 而添加的一些意义不大的 commit.

1. 项目安装 ESLint, 并配置 `eslintrc` 和 `eslintignore`
2. 在项目的 `.git-hooks` 目录下添加如下脚本, 来源 https://gist.github.com/linhmtran168/2286aeafe747e78f53bf

   ```sh
   #!/bin/sh

   STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$")

   if [[ "$STAGED_FILES" = "" ]]; then
     exit 0
   fi

   # Check for eslint
   ESLINT="./node_modules/.bin/eslint"
   if [[ ! -e $ESLINT ]]; then
     echo ""
     echo "  \033[41mPlease use <npm install> to install ESlint\033[0m"
     exit 1
   fi;

   PASS=true
   echo ""

   for FILE in $STAGED_FILES
   do
     $ESLINT "$FILE"

     if [[ "$?" == 0 ]]; then
       echo "  \033[32mESLint Passed: $FILE\033[0m"
     else
       echo "  \033[41mESLint Failed: $FILE\033[0m"
       PASS=false
     fi
   done

   if ! $PASS; then
     echo "\n\033[41mCOMMIT FAILED:\033[0m Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n"
     exit 1
   else
     echo "\n\033[42mCOMMIT SUCCEEDED\033[0m\n"
   fi

   exit $?
   ```
3. 在 `package.json` 中进行配置 `postinstall` 为如下内容

   ```sh
   cp .git-hooks/* .git/hooks/
   ```

这样, 每次 npm install 之后, 都会将检查脚本放置到正确的位置. 每次 git commit 的时候, 都会进行 code style check.

我们目前的项目中, 使用了 FIS3 进行开发, 所以我们开发时, 会有对应的 `npm run dev` 这样的 script, 为了确保检查脚本能被正确放置, 我在 `npm run dev` 中也会去跑一遍 `npm run postinstall`.
这样, 就不会出现, 由于原来已经 npm install 过了, 而没有把检查脚本正确放置的情况.
