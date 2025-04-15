# Install
```shell
$ pnpm install
```
# Build & deploy
## pop-os
```shell
$ pnpm build
$ sudo rsync --recursive --mkpath --delete ./dist/svg-tool/ /var/www/html/svg-tool/
```
# tilde.team

```shell
$ pnpm build --base=/~padeso/svg-tool --outDir=dist/tilde.team
$ rsync --recursive --mkpath --delete ./dist/tilde.team/ tilde.team:~/public_html/svg-tool/
```

