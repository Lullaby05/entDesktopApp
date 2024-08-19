import rollup, { OutputOptions } from 'rollup';
import chalk from 'chalk';
import ora from 'ora';
import waitOn from 'wait-on';
import net from 'net';
import { URL } from 'url';
import minimist from 'minimist';
import electronConnect from 'electron-connect';
// electron编译配置文件
import buildPath from './build.json'

import {
  getCompiler,
} from '../config/rollupElectronConfig';

const argv = minimist(process.argv.slice(2));
const TAG = '[compiler-electron]';

export function startCompilerElectron(port = 80) {
  // 因为 vite 不会重定向到 index.html，所以直接写 index.html 路由。
  const ELECTRON_URL = `http://localhost:${port}/index.html`;

  const spinner = ora(`${TAG} Electron build...`);
  const electron = electronConnect.server.create({ stopOnClose: true });

  function watchBuildFunc(inputUrl: string, outputUrl: string) {
    // 一旦到达这里，所有资源都可用
    // once here, all resources are available
    const compiler = getCompiler(inputUrl, outputUrl)
    const watcher = rollup.watch(compiler);
    watcher.on('change', (filename) => {
      console.log(filename);
      const log = chalk.green(`change -- ${filename}`);
      console.log(TAG, log);
    });
    watcher.on('event', (ev) => {
      if (ev.code === 'END') {
        // init-未启动、started-第一次启动、restarted-重新启动
        console.log('启动');
        electron.electronState === 'init'
          ? electron.start()
          : electron.restart();
      } else if (ev.code === 'ERROR') {
        console.log(ev.error);
      }
    });
  }

  if (argv.watch) {
    waitOn(
      {
        resources: [ELECTRON_URL],
        timeout: 5000,
      },
      (err) => {
        if (err) {
          const { hostname } = new URL(ELECTRON_URL);
          const serverSocket = net.connect(port, hostname, () => {
            // watchFunc();
            buildPath.forEach(element => {
              watchBuildFunc(element.input, element.output)
            });
          });
          serverSocket.on('error', (e) => {
            console.log(err);
            console.log(e);
            process.exit(1);
          });
        } else {
          // watchFunc();
          buildPath.forEach(element => {
            watchBuildFunc(element.input, element.output)
          });
        }
      }
    );
  } else {
    spinner.start();
    buildPath.forEach(element => {
      const compiler = getCompiler(element.input, element.output)
      rollup
      .rollup(compiler)
      .then((build) => {
        spinner.stop();
        console.log(TAG, chalk.green('Electron build successed.'));
        build.write(compiler.output as OutputOptions);
      })
      .catch((error) => {
        spinner.stop();
        console.log(`\n${TAG} ${chalk.red('构建报错')}\n`, error, '\n');
      });
    });
  }
}
