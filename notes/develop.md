Serve site in dev mode, using **Vite**.
```shell
$ pnpm dev
``` 

Compile TypeScript with **tsc**, then build package with **Vite** in **dist** folder[^1].
```shell
$ pnpm build
```

Serve site from **dist/svg-web** folder, using **Vite**.
```shell
$ pnpm preview
```

[^1] The project is configured in **vite.config.js** to build for deployment with a base folder of **svg-web**,
and to write the output to  **./dist/svg-web**. That is appropriate for deploying the app to a subfolder
of the website's root, like on **pop-os** and **tilde.institute**. To build it for deployment on a site 
like **tilde.team**, where it will be served in a subfolder of **~psobolik**, you need to specify the correct 
base directory on the command line:
```shell
$ pnpm build --base=/~padeso/svg-tool --outDir=dist/tilde.team
```
