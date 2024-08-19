/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ImportMetaEnv {
  readonly VUE_APP_BASE_API: string;
  readonly VITE_API_BASE_URL: string;
}

declare global {
  import '@arco-design/web-vue/es/components';
}
