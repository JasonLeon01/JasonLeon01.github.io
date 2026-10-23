# JasonLeon's Homepage

页面源码位于 `__default/PageProject`，根目录的 HTML、图标和 `assets` 为导出产物，请通过构建更新。

首次使用需要 Node.js 22.12+（或更新的受支持版本）和 Git，在仓库根目录执行：

```sh
npm ci --prefix __default/PageProject
npm run hooks:install --prefix __default/PageProject
```

钩子配置仅对当前 checkout 生效，新克隆的仓库需要重新安装。提交前先暂存完整的网站构建输入；钩子会清理旧产物、构建并导出，然后仅将生成的站点文件及旧产物删除纳入本次提交。存在未暂存或未跟踪的构建输入、构建失败时会阻止提交，避免提交内容与导出页面不一致。

手动导出仍可运行 `node build_page.mjs`，或 Windows 的 `build_page.bat` / macOS、Linux 的 `bash build_page.sh`。所有入口复用相同的清理和导出逻辑，只处理明确列出的站点产物，保留源码、钩子及仓库配置。
