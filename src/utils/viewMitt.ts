import mitt from 'mitt';
const Mitt = mitt();
declare module 'vue' {
  export interface ComponentCustomProperties {
    $mitt: typeof Mitt;
  }
}
export { Mitt };
