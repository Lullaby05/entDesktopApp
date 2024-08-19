/**
 * @description 数据大屏的proload
 * @author wml
 * @Date 2023-05-24
 */
import { ipcRenderer, contextBridge, webFrame, ipcMain } from 'electron';
const path = require('path');

contextBridge.exposeInMainWorld('main', {
  os: () => ipcRenderer.invoke('os'),
  webFrame: {
    setZoomFactor: (factor) => {
      webFrame.setZoomFactor(factor);
    },
    getZoomFactor: () => webFrame.getZoomFactor(),
  },
  //-----------------------start 由tab渲染进程通知主进程进行标签新增，切换，关闭等操作---------
  newTab: (tab) => {
    ipcRenderer.invoke('new-tab', tab);
  },
  // 废弃
  onTabChange: (cb) => {
    ipcRenderer.on('tabChange', (event, tabList) => {
      if (cb) {
        cb(tabList);
      }
    });
  },
  getUserInfo: () => ipcRenderer.invoke('get-user-info'),
  closeHandle: (cb) => {
    ipcRenderer.on('window-close-handle', (event, tab) => {
      if (cb) {
        cb(tab);
      }
    });
  },
  onStoreChange: (cb) => {
    ipcRenderer.on('pinia-store-set', (event, params) => {
      if (cb) {
        cb(event, params);
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
  getTabs: () => {
    return ipcRenderer.invoke('get-tabs');
  },
  setTab: (tab) => {
    // console.log('tabPreload:set-tab');
    return ipcRenderer.invoke('set-tab', tab);
  },
  renameTab: (name) => {
    return ipcRenderer.invoke('rename-tab', name);
  },
  closeTab: (tab) => {
    return ipcRenderer.invoke('close-tab', tab);
  },
  //----------------------end---------------------------------------------------------
  closeWindow: (url) => {
    return ipcRenderer.invoke('close-data-window', url);
  },
  minimumWindow: (url) => {
    return ipcRenderer.invoke('minimum-data-window', url);
  },
  toggleMaximumWindow: () => {
    return ipcRenderer.invoke('toggle-maximum-data-window');
  },
  mainQuit: () => {
    ipcRenderer.send('main-quit', 'main-quit');
  },
  windowMin: () => {
    ipcRenderer.send('window-min', 'window-min');
  },
  onLogin: (cb) =>
    ipcRenderer.on('login', (event, userInfo) => {
      if (cb) {
        cb(userInfo);
      }
    }),
  //-----------------------start tab渲染进程监听主进程通知事件 由操作的BrowserView的渲染进程通知主进程推送对应的tab操作指令---------
  //视图发送新增或切换标签指令
  viewNewTag: (cb) => {
    ipcRenderer.on('window-new-tab-order', (event, tab) => {
      if (cb) {
        cb(tab);
      }
    });
  },
  viewSetTag: (cb) => {
    ipcRenderer.on('window-set-tab-order', (event, tab) => {
      if (cb) {
        cb(tab);
      }
    });
  },
  //----------------------end---------------------------------------------------------
  // 声音相关
  openSound: () => {
    ipcRenderer.send('open-sound');
  },
  getSound: () => {
    return ipcRenderer.invoke('get-sound');
  },
  download: (url: string) => {
    ipcRenderer.send('download', url);
  },
});
