/**
 * @description electron的主启动程序
 * @author wml
 * @Date 2023-05-24
 */
import {
  app,
  BrowserWindow,
  ipcMain,
  BrowserView,
  crashReporter,
  session,
  dialog,
  globalShortcut,
  Tray,
  Menu,
} from 'electron';
import log from 'electron-log';
import { join } from 'path';
import isDev from 'electron-is-dev';
const { autoUpdater } = require('electron-updater');

interface IWindowInstance {
  window: BrowserView;
  name: string;
  route: string;
  routeUrl?: string;
  routeParams?: object;
}

autoUpdater.logger = log;

// 自动更新事件
autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
  console.log('有可用的更新');
  dialog.showMessageBox({
    type: 'info',
    title: '有可用的更新',
    message: '有可用的新版本，正在下载...',
  });
});

//没有新版本时
autoUpdater.on('update-not-available', (_info) => {
  console.log('没有更新');
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded.');
  console.log('下载完成');
  dialog
    .showMessageBox({
      type: 'info',
      title: '新版本已准备好',
      message: '新版本已经安装完成， 重启以使用新版本',
      buttons: ['重启', '稍后'],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater. ' + err);
});

if (!isDev) {
  log.transports.file.resolvePath = () => '/task-manager.log';
  log.transports.file.level = 'info';
  // 初始化自动更新器
  autoUpdater.checkForUpdatesAndNotify();
}
const path = require('path');
const os = require('os');
// const loudness = require('loudness');

let loginWindow: BrowserWindow | null | undefined;
let mainWindow: BrowserWindow | null | undefined;
let dataWindow: Record<string, BrowserWindow | null | undefined> = {};
let listWindow: IWindowInstance[] = [];
let userInfo = {};
let tabList = '';

// 获取奔溃堆栈文件存放路径
let crashFilePath = 'E:/crash';
let crashDumpsDir = 'crashDump';
try {
  // electron 低版本
  crashFilePath = path.join(app.getPath('temp'), app.getName() + ' Crashes');
  console.log('————————crash path:', crashFilePath);

  // electron 高版本
  crashDumpsDir = app.getPath('crashDumps');
  console.log('————————crashDumpsDir:', crashDumpsDir);
} catch (e) {
  console.error('获取奔溃文件路径失败', e);
}

// app.disableHardwareAcceleration();

// 创建登录进程
class createLoginWin {
  constructor() {
    loginWindow = new BrowserWindow({
      // width: parseInt(`${displayWorkAreaSize.width * 0.85}`, 10),
      // height: parseInt(`${displayWorkAreaSize.height * 0.85}`, 10),
      width: 1000,
      height: 480,
      movable: true,
      // frame: false,
      show: false,
      center: true,
      resizable: false,
      frame: true,
      titleBarStyle: 'hidden',
      transparent: false,
      backgroundColor: '#ffffffff', // 设置背景色为全透明
      // transparent: true,
      webPreferences: {
        // devTools: isDev,
        devTools: true,
        contextIsolation: true,
        nodeIntegration: true,
        // 关闭web权限检查，允许跨域
        webSecurity: false,
        preload: path.join(__dirname, 'preload.js'),
      },
      // backgroundColor: '#ffffff00',
      icon: join(__dirname, '../../config/build/logo-256.ico'),
      autoHideMenuBar: true,
    });
    const URL = isDev
      ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
      : `file://${join(__dirname, '../index.html')}`; // vite 构建后的静态文件地址
    // console.log('login-URL=', URL);
    if (isDev) {
      loginWindow.loadURL(URL);
    } else {
      const url =
        process.platform === 'darwin'
          ? `file://${join(__dirname, '../index.html')}`
          : join(__dirname, '../index.html');
      loginWindow.loadURL(url);
    }

    // loginWindow.loadFile(path.join(__dirname, '../index.html'));
    loginWindow.on('ready-to-show', () => {
      loginWindow?.show();
    });
    // 未调用
    // ipcMain.handle('ping', () => '消息来自主进程pong');
    // if (isDev) {
    loginWindow.webContents.openDevTools({ mode: 'detach' });
    // }
    loginWindow.on('close', (e) => {
      app.quit();
    });
  }
}

// 创建主页进程
class createMainWin {
  constructor() {
    mainWindow = new BrowserWindow({
      // width: parseInt(`${displayWorkAreaSize.width * 0.85}`, 10),
      // height: parseInt(`${displayWorkAreaSize.height * 0.85}`, 10),
      width: 1600,
      height: 900,
      movable: true,
      show: false,
      center: true,
      resizable: true,
      titleBarStyle: 'hidden',
      transparent: false,
      frame: true,
      backgroundColor: '#ffffffff', // 设置背景色为全透明
      webPreferences: {
        // devTools: isDev,
        devTools: true,
        contextIsolation: true,
        nodeIntegration: true,
        // 关闭web权限检查，允许跨域
        webSecurity: false,
        preload: path.join(__dirname, 'tabPreload.js'),
      },
      icon: join(__dirname, '../../config/build/logo-256.ico'),
      autoHideMenuBar: true,
    });
    const URL = isDev
      ? `http://localhost:${process.env.PORT}` + '/tabs.html' // vite 启动的服务器地址
      : `file://${join(__dirname, '../index.html')}`; // vite 构建后的静态文件地址

    // console.log('URL=', URL);
    if (isDev) {
      mainWindow.loadURL(URL);
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      const url =
        process.platform === 'darwin'
          ? `file://${join(__dirname, '../tabs.html')}`
          : join(__dirname, '../tabs.html');
      mainWindow.loadURL(url);
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    mainWindow.on('ready-to-show', () => {
      // mainWindow.show();
    });

    const crashFilePath = 'E:/crash';
    const crashDumpsDir = 'crashDump';
    mainWindow.webContents.on('did-finish-load', function (event) {
      mainWindow?.webContents.send(
        'crash-file-path',
        `${crashFilePath} or ${crashDumpsDir}`
      );
    });

    mainWindow.hide();
    mainWindow.on('close', (e) => {
      app.quit();
      for (let key in dataWindow) {
        dataWindow[key]?.destroy();
        dataWindow[key] = null;
      }
    });
  }
}

function openChildWindow(param: {
  url: string;
  width: number;
  height: number;
}) {
  if (dataWindow[param.url]) {
    dataWindow[param.url]?.show();
    dataWindow[param.url]?.focus();
    dataWindow[param.url]?.center();
    return;
  }
  dataWindow[param.url] = new BrowserWindow({
    width: param.width,
    height: param.height,
    // parent: mainWindow, // win是主窗口，不加parent，新建的窗口将于主窗口平级
    movable: true,
    center: true,
    resizable: false,
    titleBarStyle: 'hidden',
    transparent: true,
    backgroundColor: '#00000000', // 设置背景色为全透明
    autoHideMenuBar: true,
    webPreferences: {
      // devTools: isDev,
      devTools: true,
      contextIsolation: true,
      nodeIntegration: true,
      // 关闭web权限检查，允许跨域
      webSecurity: false,
      preload: path.join(__dirname, 'dataPreload.js'),
    },
    icon: join(__dirname, '../../config/build/logo-256.ico'),
  });
  dataWindow[param.url]?.maximize();

  if (isDev) {
    const URL = `http://localhost:${process.env.PORT}` + '/#' + param.url; // vite 启动的服务器地址
    dataWindow[param.url]?.webContents.loadURL(URL);
    dataWindow[param.url]?.webContents.openDevTools({ mode: 'detach' });
  } else {
    const url =
      process.platform === 'darwin'
        ? `file://${join(__dirname, '../index.html')}`
        : join(__dirname, '../index.html');
    const URL = url + '#' + param.url; // vite 构建后的静态文件地址
    dataWindow[param.url]?.webContents.loadURL(URL);
    dataWindow[param.url]?.webContents.openDevTools({ mode: 'detach' });
  }

  dataWindow[param.url]?.on('closed', () => {
    dataWindow[param.url]?.destroy();
    dataWindow[param.url] = null;
  });
}

// 创建主体视图
const createWindowView = async (name: string, href?: string) => {
  // Create the browser view.
  const window = new BrowserView({
    webPreferences: {
      // devTools: isDev,
      devTools: true,
      contextIsolation: true,
      nodeIntegration: true,
      // 关闭web权限检查，允许跨域
      webSecurity: false,
      preload: path.join(__dirname, 'clentPreload.js'),
      disableDialogs: false,
      safeDialogs: true,
      enableWebSQL: false,
    },
  });

  // mac 运行问题   9.14 重新释放注释
  console.log('platform', process.platform);
  if (process.platform !== 'darwin') {
    if (isDev) {
      const URL = `http://localhost:${process.env.PORT}` + '/#' + href; // vite 启动的服务器地址
      window.webContents.loadURL(URL);
      window.webContents.openDevTools({ mode: 'detach' });
    } else {
      const url =
        process.platform === 'darwin'
          ? `file://${join(__dirname, '../index.html')}`
          : join(__dirname, '../index.html');
      const URL = url + '#' + href; // vite 构建后的静态文件地址
      window.webContents.loadURL(URL);
      window.webContents.openDevTools({ mode: 'detach' });
    }
  }

  listWindow.push({
    window,
    name,
    route: href || '/dashboard/workplace',
  });
  if (mainWindow) {
    // tabChange 通道目前没用
    // mainWindow.webContents.send('tabChange', getTabData());
  }
  // ipcMain.handle('BrowserViewPing', () => '消息来自主进程pong');
  return window;
};

// 标签列表
interface TabList {
  tabs: string[];
  active: string;
  activeRoute: string;
  activeRouteUrl?: string;
  activeRouteParams?: object;
}

// 获取标签数据
const getTabData = (): TabList => {
  const curActive = listWindow.find(
    (instance) =>
      instance.window.webContents.id ===
      mainWindow?.getBrowserView()?.webContents?.id
  );
  return {
    tabs: listWindow.map((instance) => instance.name),
    active: curActive?.name || '',
    activeRoute: curActive?.route || '',
  };
};

// 创建标签
const newTab = async (
  name: string,
  router: string,
  routeUrl?: string,
  routeParams?: object
) => {
  const route = router || '/dashboard/workplace';
  const window = await createWindowView(name, route);
  // console.log('newTab=',router)
  if (routeUrl) {
    tabJumpRouter(window, { routeUrl, routeParams }, true);
  } else {
    setTab(window);
  }
  // mac 问题解决   9.14 启动注释  还原原版
  if (process.platform === 'darwin') {
    if (isDev) {
      const URL = `http://localhost:${process.env.PORT}` + '/#' + route; // vite 启动的服务器地址
      window.webContents.loadURL(URL);
      window.webContents.openDevTools({ mode: 'detach' });
    } else {
      const URL =
        process.platform === 'darwin'
          ? `file://${join(__dirname, '../index.html') + '#' + route}`
          : join(__dirname, '../index.html') + '#' + route; // vite 构建后的静态文件地址
      window.webContents.loadURL(URL);
      window.webContents.openDevTools({ mode: 'detach' });
    }
  }
};

// 切换标签
const setTab = (instance: BrowserView) => {
  // 切换标签时，关闭上一个view的开发者工具
  mainWindow?.getBrowserView()?.webContents.closeDevTools();
  // if (isDev) {
  instance?.webContents.openDevTools();
  // }
  mainWindow?.setBrowserView(instance);
  instance.setBounds({
    x: 0,
    y: 40,
    width: mainWindow!.getBounds().width,
    height: mainWindow!.getBounds().height - 40,
  });
  instance.setAutoResize({
    width: true,
    height: true,
    horizontal: false,
    vertical: false,
  });
  setTimeout(() => {
    instance.webContents.send('pinia-store-set', tabList);
  }, 1500);
};

// 切换tab并且跳转到指定路由，仅一次
const tabJumpRouter = (
  instance: BrowserView,
  routeConfig: any,
  newTab = false
) => {
  setTab(instance);
  const { routeUrl, routeParams, route } = routeConfig;
  setTimeout(
    () => {
      instance.webContents.send('jumpRouter', { route, routeUrl, routeParams });
    },
    newTab ? 1500 : 0
  );
};

// 关闭标签
const closeTab = (tab: any) => {
  const tabName = tab.modelName;
  log.verbose(`Try to close tab ${tabName}`);
  const closeInstance = listWindow.find(
    (instance) => instance.name === tabName
  );

  /**
   * 工作台标签不会被关闭， 通过通知工作台视图，被关闭视图，从而将window与view进行同步
   */
  listWindow[0].window.webContents.send('window-close-handle', tab);
  if (closeInstance) {
    const currentState = getTabData();
    const closeIndex = listWindow.findIndex(
      (instance) => instance === closeInstance
    );

    listWindow = listWindow.filter((instance) => instance.name !== tabName); // Update the list
    if (listWindow.length === 0) {
      mainWindow?.close();
      return;
    }
    if (closeInstance.name === currentState.active) {
      // If close the active one, try to set new active to the previous tab
      log.verbose(`Try to set new active tab`);
      setTab(listWindow[closeIndex <= 0 ? 0 : closeIndex - 1].window);
      return;
    }
    closeInstance.window.webContents.close();
    mainWindow?.webContents.send('tabChange', getTabData());
  }
};

app.on('ready', () => {
  // 配置 crashReporter
  // 开启crash捕获 官方建议写在app.on('ready')前
  crashReporter.start({
    productName: 'Your-Application-Name',
    companyName: 'Your-Company-Name',
    submitURL:
      'http://119.91.134.51:32200/businessApi/business/upload/uploadFile', // 上传到服务器的地址
    uploadToServer: false, // 不上传服务器
    ignoreSystemCrashHandler: false, // 不忽略系统自带的奔溃处理，为 true 时表示忽略，奔溃时不会生成奔溃堆栈文件
  });
  // session.defaultSession.on(
  //   'will-download',
  //   async (event, item, webContents) => {
  //     // 取消 Electron 的默认下载行为
  //     event.preventDefault();

  //     const url = item.getURL();
  //     const decodedUrl = decodeURIComponent(url);
  //     let filename = url.match(/([^\/]+)(?=\?|$)/)[0];
  //     const match = decodedUrl.match(/\/([^\/]+)\/\//);
  //     if (match && match[1]) {
  //       filename = match[1];
  //     }
  //     // 显示保存对话框
  //     const { filePath } = await dialog.showSaveDialog(
  //       BrowserWindow.getFocusedWindow(),
  //       {
  //         defaultPath: path.join(app.getPath('downloads'), filename),
  //       }
  //     );
  //     if (filePath) {
  //       // 开始下载文件
  //       item.setSavePath(filePath);
  //       item.once('done', (event, state) => {
  //         if (state === 'completed') {
  //           console.log('Download successfully');
  //         } else {
  //           console.log(`Download failed: ${state}`);
  //         }
  //       });
  //       item.resume();
  //     }
  //   }
  // );
});

let appTray: Tray | null = null;
let hideWindow: typeof mainWindow | typeof loginWindow = null;
app
  .whenReady()
  .then(() => {
    // 忽略https证书相关错误，加在electron相关js文件里，解决闪退问题
    app.commandLine.appendSwitch('ignore-certificate-errors');
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    new createLoginWin();
  })
  .then(() => {
    // 忽略https证书相关错误，加在electron相关js文件里，解决闪退问题
    app.commandLine.appendSwitch('ignore-certificate-errors');
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    new createMainWin();
    // 托盘
    const url = isDev
      ? join(__dirname, '../../config/build/logo-16.ico')
      : join(__dirname, '../logo-16.ico');
    appTray = new Tray(url);
    const ctxMenu = Menu.buildFromTemplate([
      {
        label: '打开应用',
        click: () => {
          if (hideWindow?.isMinimized()) {
            hideWindow.restore();
          }
          hideWindow?.show();
        },
      },
      {
        label: '退出',
        click: () => {
          app.quit();
        },
      },
    ]);
    appTray.setContextMenu(ctxMenu);
    appTray.setToolTip('祥惠');
    appTray.on('click', () => {
      if (hideWindow?.isMinimized()) {
        hideWindow.restore();
      }
      hideWindow?.show();
    });
  });

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      mainWindow.focus();
    }
  });
}

ipcMain.handle('os', () => os.type());

ipcMain.handle('pinia-store-change', (event, params) => {
  tabList = params;
  // 遍历window执行
  listWindow.forEach((currentWin) => {
    currentWin.window.webContents.send('pinia-store-set', params);
  });
});

ipcMain.handle('new-tab', async (event, tab: any) => {
  // Create new tab
  await newTab(tab.modelName, tab.route, tab.routeUrl, tab.routeParams);
});

ipcMain.handle('get-tabs', async (event, href: string) => {
  return getTabData();
});

ipcMain.handle('rename-tab', async (event, newName: string) => {
  // return getTabData();
  const activeTab = listWindow.find(
    (instance) =>
      instance.window.webContents.id ===
      mainWindow?.getBrowserView()?.webContents?.id
  );
  if (activeTab) {
    activeTab.name = newName;
    mainWindow?.webContents.send('tabChange', getTabData());
  }
});

ipcMain.handle('set-tab', async (event, tab: any) => {
  // log.debug('set-tab', tab.modelName);
  // 未执行？
  console.log('listWindow=', listWindow);
  const windowview = listWindow.find((instance) => {
    console.log(instance.name);
    console.log(instance.name === tab.modelName);
    return instance.name === tab.modelName;
  });
  if (!windowview) {
    // windowview = listWindow[0]
    newTab(tab.modelName, tab.route, tab.routeUrl, tab.routeParams);
    return;
  }
  setTab(windowview.window);
});

// 需要处理已经打开的tab，但是仍然需要跳转，只跳转一次
ipcMain.handle('tab-jump-router', async (event, tab: any) => {
  mainWindow?.focus();
  const windowview = listWindow.find((instance) => {
    return instance.name === tab.modelName;
  });
  tabJumpRouter(windowview!.window, {
    route: tab.route,
    routeUrl: tab.routeUrl,
    routeParams: tab.routeParams,
  });
});

ipcMain.handle('close-tab', async (event, tab: any) => {
  closeTab(tab);
});

ipcMain.handle('close-window', async (event, tabName: string) => {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
    app.quit();
  }
});

ipcMain.handle('minimum-window', async (event, tabName: string) => {
  if (mainWindow) {
    hideWindow = mainWindow;
    mainWindow.minimize();
  }
});

ipcMain.handle('view-new-tab-order', async (event, tab: any) => {
  mainWindow?.webContents.send('window-new-tab-order', tab);
});
ipcMain.handle('view-set-tab-order', async (event, tab: any) => {
  mainWindow?.webContents.send('window-set-tab-order', tab);
});
ipcMain.handle('view-tab-jump-router', async (event, tab: any) => {
  mainWindow?.webContents.send('window-tab-jump-router', tab);
});

ipcMain.handle('toggle-maximum-window', async (event, tabName: string) => {
  mainWindow?.webContents.send(
    'window-change-maximize',
    !mainWindow.isMaximized()
  );
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return;
    }
    mainWindow.maximize();
  }
});

ipcMain.handle('toggle-maximum-data-window', async (event) => {
  // if (dataWindow) {
  //   if (dataWindow.isMaximized()) {
  //     dataWindow.unmaximize();
  //     return;
  //   }
  //   dataWindow.maximize();
  // }
});

ipcMain.handle('minimum-data-window', async (event, url: string) => {
  if (dataWindow[url]) {
    dataWindow[url].minimize();
  }
});

ipcMain.handle('close-data-window', async (event, url) => {
  if (dataWindow[url]) {
    dataWindow[url].close();
    dataWindow[url] = null;
  }
});

ipcMain.handle('get-user-info', () => userInfo);

ipcMain.on('sumbit', (event, arg) => {
  console.log(arg);
});

ipcMain.on('indexMsg', (event, arg) => {
  console.log('indexMsg', arg);
});

let logoutBrowserView: BrowserView | null = null;

ipcMain.on('login', async (event, arg) => {
  // console.log('login 成功', arg);
  userInfo = arg;
  // 关闭devtools
  loginWindow?.webContents.closeDevTools();
  if (mainWindow) {
    if (logoutBrowserView) {
      mainWindow.setBrowserView(logoutBrowserView);
      logoutBrowserView = null;
    } else {
      newTab('dashboard', '/dashboard/workplace', '');
    }
    listWindow.forEach((instance) => {
      instance.window.webContents.send('login', arg);
    });
    mainWindow.center();
    // if (isDev) {
    mainWindow.webContents.openDevTools();
    // }
    mainWindow?.show();
    loginWindow?.hide();
  }
});

// 登出直接退出应用并重新启动，防止之前的数据影响
ipcMain.on('logout', (event, arg) => {
  if (mainWindow) {
    app.relaunch();
    app.exit();
  }
});

ipcMain.on('reopen', (evnet, arg) => {
  userInfo = arg;
  if (Object.keys(dataWindow).length > 0) {
    for (let key in dataWindow) {
      dataWindow[key]?.destroy();
      dataWindow[key] = null;
    }
  }
  if (mainWindow) {
    mainWindow.destroy();
    mainWindow = null;
    listWindow.forEach((instance) => {
      instance.window.webContents.closeDevTools();
    });
    listWindow = [];
    app.commandLine.appendSwitch('ignore-certificate-errors');
    new createMainWin();
    newTab('dashboard', '/dashboard/workplace', '');
    listWindow.forEach((instance) => {
      instance.window.webContents.send('login', arg);
    });
    mainWindow!.webContents.send('login', arg);
    mainWindow!.center();
    // if (isDev) {
    mainWindow!.webContents.openDevTools();
    // }
    mainWindow!.show();
  }
});

ipcMain.on('login-quit', (event, arg) => {
  log.debug('login-quit=', arg);
  // loginWindow?.destroy();
  // mainWindow?.destroy();
  if (loginWindow) {
    hideWindow = loginWindow;
    loginWindow.hide();
  }
});

ipcMain.on('window-min', (event, arg) => {
  hideWindow = mainWindow;
  mainWindow?.minimize();
});

ipcMain.handle('on-open-event', (event, param) => {
  openChildWindow(param);
});

ipcMain.on('main-quit', (event, arg) => {
  // loginWindow?.destroy();
  // mainWindow?.destroy();
  // for (let key in dataWindow) {
  //   dataWindow[key]?.destroy();
  // }
  // 只是关闭到系统托盘
  if (mainWindow) {
    hideWindow = mainWindow;
    mainWindow.hide();
  }
});

ipcMain.on('download', (event, url) => {
  const win = BrowserWindow.getFocusedWindow();
  win!.webContents.downloadURL(url);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// app.on('before-quit', () => {
//   if (process.platform !== 'darwin') {
//     // mainWindow.close();
//     // mainWindow = null;
//     app.quit();
//   }
// });

app.on('activate', () => {
  // if (BrowserWindow.getAllWindows().length === 0) {
  // new createWin();
  // } else {
  // }
});

const additionalData = { myKey: 'myValue' };
const gotTheLock = app.requestSingleInstanceLock(additionalData);

if (!gotTheLock) {
  app.quit();
} else {
  app.on(
    'second-instance',
    (event, commandLine, workingDirectory, additionalData) => {
      if (hideWindow?.isMinimized()) {
        hideWindow.restore();
      }
      hideWindow?.show();
    }
  );
}

// ipcMain.on('open-sound', async () => {
//   await loudness.setMuted(false);
//   await loudness.setVolume(100);
// });

// ipcMain.handle('get-sound', async () => {
//   return loudness.getMuted();
// });

ipcMain.on('change-theme', (event, theme: any) => {
  mainWindow?.webContents.send('window-change-theme', theme);
});
