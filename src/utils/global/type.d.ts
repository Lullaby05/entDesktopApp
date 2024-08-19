import Vue from 'vue';

interface GlobalUtil {
  EQUIPMENT_STATUS: Array<string>;
  EQUIPMENT_STATUS_COLOR: Array<string>;
  UPLOAD_URL: string;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $G: typeof GlobalUtil;
  }
}

declare global {
  interface Window {
    version: {
      start: () => void;
      login: () => void;
      logout: () => void;
      loginQuit: () => void;
      windowMin: () => void;
    };
    main: {
      loginQuit: () => void;
      reopenWindow: (arg: any) => void;
      newTab: (tab: any) => void;
      setTab: (tab: any) => void;
      tabJumpRouter: (tab: any) => void;
      onTabChange: (cb: any) => void;
      onJumpRouter: (cb: any) => void;
      closeHandle: (cb: any) => void;
      getUserInfo: () => Promise<any>;
      onLogin: (cb: any) => void;
      openWindow: (param: any) => void;
      setStore: (params: any) => void;
      onStoreChange: (cb: any) => void;
      mainQuit: () => void;
      download: (url: string) => void;
      openSound: () => void;
      getSound: () => Promise<boolean>;
      minimumWindow: (win: string) => void;
    };
  }
}
