import { resolve } from 'path';
import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configImageminPlugin from './plugin/imagemin';

const root = process.cwd();

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

/**
 * 生产环境配置
 * @author wml
 * @Time 2021年6月7日
 */
export default mergeConfig(
  {
    base: './',
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      port: 3003,
      open: true,
      fs: {
        strict: true,
      },
    },
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      // configArcoResolverPlugin(),
      configImageminPlugin(),
    ],
    build: {
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true,
      //   },
      //   mangle: true,
      //   format: {
      //     comments: false,
      //   },
      // },
      rollupOptions: {
        input: {
          main: resolve(__dirname, '../index.html'),
          tabs: resolve(__dirname, '../tabs.html'),
        },
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  },
  baseConfig
);
