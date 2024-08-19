/**
 * @description 主体窗口的预加载脚本，主要承担主体窗口的标签管理任务，以及控制BrowserView的切换
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
  // -----------------------start 由tab渲染进程通知主进程进行标签新增，切换，关闭等操作---------
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
  getTabs: () => {
    return ipcRenderer.invoke('get-tabs');
  },
  setTab: (tab) => {
    // console.log('tabPreload:set-tab');
    return ipcRenderer.invoke('set-tab', tab);
  },
  tabJumpRouter: (tab) => {
    return ipcRenderer.invoke('tab-jump-router', tab);
  },
  renameTab: (name) => {
    return ipcRenderer.invoke('rename-tab', name);
  },
  closeTab: (tab) => {
    return ipcRenderer.invoke('close-tab', tab);
  },
  // ----------------------end---------------------------------------------------------
  closeWindow: () => {
    return ipcRenderer.invoke('close-window');
  },
  minimumWindow: () => {
    return ipcRenderer.invoke('minimum-window');
  },
  toggleMaximumWindow: () => {
    return ipcRenderer.invoke('toggle-maximum-window');
  },
  mainQuit: () => {
    ipcRenderer.send('main-quit', 'main-quit');
  },
  windowMin: () => {
    ipcRenderer.send('window-min', 'window-min');
  },
  getWindowMaximized: (cb) => {
    ipcRenderer.on('window-change-maximize', (event, isMaximized) => {
      if (cb) {
        cb(isMaximized);
      }
    });
  },
  changeTheme: (cb) => {
    ipcRenderer.on('window-change-theme', (event, theme) => {
      if (cb) {
        cb(theme);
      }
    });
  },
  // -----------------------start tab渲染进程监听主进程通知事件 由操作的BrowserView的渲染进程通知主进程推送对应的tab操作指令---------
  // 视图发送新增或切换标签指令
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
  viewJumpRouterTab: (cb) => {
    ipcRenderer.on('window-tab-jump-router', (event, tab) => {
      if (cb) {
        cb(tab);
      }
    });
  },
  setStore: (params) => ipcRenderer.invoke('pinia-store-change', params),
  onStoreChange: (cb) => {
    ipcRenderer.on('pinia-store-set', (event, params) => {
      if (cb) {
        cb(event, params);
      }
    });
  },
  onLogin: (cb) =>
    ipcRenderer.on('login', (event, userInfo) => {
      if (cb) {
        cb(userInfo);
      }
    }),
  // ----------------------end---------------------------------------------------------
});
