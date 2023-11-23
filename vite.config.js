/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-06-05 11:16:24
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-23 16:55:28
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    cesium()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  build: {
    commonjsOptions: {
      strictRequires: true, // 兼容commonjs
    }
  },
  base: "./",
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3000",
  //       rewrite: (path) => path.replace(/^\/api/, "")
  //     }
  //   }
  // }
})
