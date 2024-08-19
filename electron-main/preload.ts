// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
/**
 * @description 登录窗口的预加载脚本，主要承担登录窗口与主窗口之间的通讯问题
 * @author wml
 * @Date 2023-05-24
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  start: () => start(),
  ping: () => ipcRenderer.invoke('ping'),
  login: (arg: any) => login(arg),
  logout: () => logout(),
  loginQuit: () => loginQuit(),
  windowMin: () => windowMin(),
  openWindow: () => openWindow(),
});

contextBridge.exposeInMainWorld('main', {});

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

function start() {
  ipcRenderer.on('msg', (event, message) => {
    console.log('msg', message); // 消息来自主进程
  });
  ipcRenderer.send('indexMsg', '消息来自渲染进程');
}

function login(arg: any) {
  ipcRenderer.send('login', arg);
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
function openWindow() {
  ipcRenderer.send('on-open-event');
}
// /**
//  * start方法
//  */
// crashReporter.start({
//   // 要上报的服务器地址
//   submitURL: 'http://localhost:32200/businessApi/business/upload/uploadFile',

//   // 产品名称
//   productName: 'test',

//   // 是否压缩，默认true，如果开启会上传gzip，服务器要处理一下
//   compress: false,

//   // 是否限制频次，默认为false，如果开启每小时上传1次
//   rateLimit: false,

//   // 是否上传到服务器，默认为true，如果关闭只在本地生成crash文件
//   uploadToServer: false,

//   // 是否禁止系统crash处理，默认为false
//   ignoreSystemCrashHandler: false,

//   // 携带的参数，extra中的参数只有主进程崩溃会携带
//   extra: {
//     userId: 'test_extra'
//   },

//   // 携带的参数，globalExtra中的参数所有进程崩溃都会携带
//   globalExtra: {
//     userId: 'test_globalExtra'
//   },
// });
