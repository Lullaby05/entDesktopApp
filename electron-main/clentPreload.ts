// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
/**
 * @description electron的BrowserView的预加载脚本，主要承担网页与主进程的通讯，以及获取BrowserView之间的共享数据
 * @author wml
 * @Date 2023-05-24
 */
import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, (process.versions as any)[type]);
  }
});
contextBridge.exposeInMainWorld('versions', {
  start: () => start(),
  login: () => login(),
  logout: () => logout(),
  loginQuit: () => loginQuit(),
  windowMin: () => windowMin(),
});

contextBridge.exposeInMainWorld('main', {
  loginQuit: () => loginQuit(),
  reopenWindow: (arg: any) => {
    ipcRenderer.send('reopen', arg);
  },
  // 向主进程通知新增/切换标签 指令，再由主进程转发给tab渲染进程
  newTab: (tab) => {
    ipcRenderer.invoke('view-new-tab-order', tab);
  },
  setTab: (tab) => {
    // console.log('view-set-tab-order',tab)
    ipcRenderer.invoke('view-set-tab-order', tab);
  },
  tabJumpRouter: (tab) => {
    ipcRenderer.invoke('view-tab-jump-router', tab);
  },
  onTabChange: (cb) => {
    ipcRenderer.on('tabChange', (event, tabList) => {
      if (cb) {
        cb(tabList);
      }
    });
  },
  onJumpRouter: (cb) => {
    ipcRenderer.on('jumpRouter', (event, router) => {
      if (cb) {
        cb(router);
      }
    });
  },
  // 向主进程通知关闭标签指令，再由主进程转发给view渲染进程，通知数据更新
  closeHandle: (cb) => {
    ipcRenderer.on('window-close-handle', (event, tab) => {
      if (cb) {
        cb(tab);
      }
    });
  },
  getUserInfo: () => ipcRenderer.invoke('get-user-info'),
  onLogin: (cb) =>
    ipcRenderer.on('login', (event, userInfo) => {
      if (cb) {
        cb(userInfo);
      }
    }),
  openWindow: (param) => ipcRenderer.invoke('on-open-event', param),
  setStore: (params) => ipcRenderer.invoke('pinia-store-change', params),
  onStoreChange: (cb) => {
    ipcRenderer.on('pinia-store-set', (event, params) => {
      if (cb) {
        cb(event, params);
      }
    });
  },
  changeTheme: (theme: any) => ipcRenderer.send('change-theme', theme),
  mainQuit: () => {
    ipcRenderer.send('main-quit', 'main-quit');
  },
  download: (url: string) => {
    ipcRenderer.send('download', url);
  },
  // 声音相关
  openSound: () => {
    ipcRenderer.send('open-sound');
  },
});

function start() {
  ipcRenderer.on('msg', (event, message) => {
    console.log('msg', message); // 消息来自主进程
  });
  ipcRenderer.send('indexMsg', '消息来自渲染进程');
}

function login() {
  ipcRenderer.send('login', 'login');
}
function logout() {
  ipcRenderer.send('logout', 'logout');
}
function loginQuit() {
  ipcRenderer.send('login-quit', 'login-quit');
}
function windowMin() {
  ipcRenderer.send('window-min', 'window-min');
}
