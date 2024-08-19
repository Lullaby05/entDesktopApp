//pinia 插件
export default function ({ store }) {
  //监测逻辑，只有符合要求的store才能同步
  if (store.$id.indexOf('tabList') == 0) {
    const storeName = store.$id;
    // 监听数据变化
    // store.$subscribe(() => {
    //   console.log(`主动更新 ${storeName} 的状态`);
    //   // 通知主线程更新
    //   window.main.setStore({
    //     targetStoreName: storeName,
    //     jsonStr: JSON.stringify(store.$state),
    //   });
    // });
    store.$onAction(({ after }) => {
      after(() => {
        console.log(
          `主动更新 ${storeName} 的状态`,
          JSON.parse(JSON.stringify(store.$state))
        );
        // 通知主线程更新
        window.main.setStore({
          targetStoreName: storeName,
          jsonStr: JSON.stringify(store.$state),
        });
      });
    });
    if (navigator.userAgent.includes('Electron')) {
      window.main.onStoreChange((event, params) => {
        const { targetStoreName, jsonStr } = params;
        if (storeName === targetStoreName) {
          console.log('被动更新状态:' + storeName, JSON.parse(jsonStr));

          const obj = JSON.parse(jsonStr);
          const keys = Object.keys(obj);
          const values = Object.values(obj);

          for (let i = 0; i < keys.length; i++) {
            store.$state[keys[i]] = values[i];
          }
        }
      });
    }
  }
}
