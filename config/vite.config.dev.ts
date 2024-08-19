import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

/**
 * 开发环境配置
 * @author wml
 * @Time 2021年6月7日
 */
export default mergeConfig(
  {
    server: {
      // host: '0.0.0.0',
      port: 3000,
      open: false,
      fs: {
        strict: true,
      },
      proxy: {
        '/dev': {
          // target: 'http://192.168.1.192:32201', //勇哥服务器
          // target: 'http://172.16.16.9:32200', // 小魏哥的服务器
          target: 'https://business.api.xkrsecure.com', // 测试服务器
          // target: 'http://172.16.16.16:32200', // 邓哥服务器
          // target: 'https://prodapi.xkrsecure.com', // 正式服务器
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev/, ''),
          pathRewrite: { '^/dev': '' },
        },
        '/dev/messageCenter': {
          // target: 'http://192.168.1.192:42200', //勇哥服务器
          target: 'https://business.api.xkrsecure.com', // 测试服务器
          // target: 'https://prodapi.xkrsecure.com', // 正式服务器
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/dev\/messageCenter/, ''),
          // pathRewrite: { '^/dev/messageCenter': '' },
          rewrite: (path) => path.replace(/^\/dev/, ''),
          pathRewrite: { '^/dev': '' },
        },
        '/wflowApi': {
          // target: 'http://172.16.16.9:10000',
          target: 'https://business.api.xkrsecure.com', // 测试服务器
          // target: 'https://prodapi.xkrsecure.com', // 正式服务器
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/wflowApi/, ''),
          // pathRewrite: { '/wflowApi': '' },
          // rewrite: (path) => path.replace(/^\/wflowApi/, '/businessApi'),
          // pathRewrite: { '/wflowApi': '/businessApi' },
        },
        '/business/ws': {
          // target: 'ws://172.16.16.9:32200/', // 小魏哥的服务器
          target: 'wss://business.api.xkrsecure.com/',
          // target: 'wss://prodapi.xkrsecure.com/',
          changeOrigin: true,
          ws: true,
        },
      },
      hmr: {
        overlay: true,
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true,
      },
    },
  },
  baseConfig
);
