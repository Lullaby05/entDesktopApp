import { resolve } from 'path';
import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';
import ViteAutoImport from 'unplugin-auto-import/vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

/**
 * 基础配置
 * @author wml
 * @Time 2021年6月7日
 */
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    svgLoader({ svgoConfig: {} }),
    // configArcoStyleImportPlugin(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',

      /**
       * 自定义插入位置
       * @default: body-last
       */
      // inject?: 'body-last' | 'body-first'

      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      // customDomId: '__svg__icons__dom__',
    }),
    ViteAutoImport({
      imports: ['vue', 'vue-router'],
      dts: resolve(__dirname, '../src/auto-imports.d.ts'),
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
        // 引入全局的Less库，有关lib.less请看 → https://www.jianshu.com/p/b13e2a2204b2
        additionalData: '@import "./src/assets/theme.less";',
      },
    },
  },
  optimizeDeps: {
    entries: ['index.html', 'tabs.html'],
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
    ],
  },
});
