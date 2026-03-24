import { defineConfig, loadEnv } from 'vite'

import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const isProd = mode === 'production'
  const useProxy = env.VITE_APP_PROXY === 'true'
  const proxyTarget = env.VITE_APP_API_URL || 'http://localhost:8080'
  return {
    base: env.VITE_APP_CONTEXT,
    server: {
      port: env.VITE_APP_PORT,
      host: true,
      open: false,
      proxy: useProxy
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
            '/bspplus': {
              target: proxyTarget,
              changeOrigin: true,
            },
            '/ws': {
              target: proxyTarget,
              changeOrigin: true,
              ws: true,
            },
          }
        : undefined,
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, './'),
        '@': resolve(__dirname, './src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
      codeSplit: true,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') atRule.remove()
              },
            },
          },
        ],
      },
      devSourcemap: true,
    },
    plugins: [
      vue({
        template: {
          // compilerOptions: {
          //   isCustomElement: (tag) => [
          //     'cropper-element',
          //     'cropper-canvas',
          //     'cropper-image',
          //     'cropper-shade',
          //     'cropper-selection',
          //     'cropper-grid',
          //     'cropper-crosshair',
          //     'cropper-handle'
          //   ].includes(tag)
          // }
        }
      }),
      !isProd && vueDevTools(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
      }),
      viteMockServe({
        mockPath: 'mock',
        ignore: /^index/,
        localEnabled: !isProd, // 是否在开发环境使用Mock
        prodEnabled: false, // 正式发布包禁止注入生产 Mock
        logger: true,
        supportTs: false,
        watchFiles: true,
        // 用来动态控制生产环境是否开启Mock，通过动态添加代码到main.js
        // 如果直接把代码写到文件中，就会始终打包
        injectCode: `import { setupProdMockServer } from '/mock/index'; setupProdMockServer(); `,
      })
    ].filter(Boolean),
    build: {
      cache: true,
      assetsDir: 'static',
      chunkSizeWarningLimit: 20480,
      cssCodeSplit: true,
      outDir: 'dist',
      reportCompressedSize: false,
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        onwarn: () => {
          return
        },
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.split('/node_modules/').pop()?.split('/')[0]
            }
          },
        },
      },
    },
  }
})
