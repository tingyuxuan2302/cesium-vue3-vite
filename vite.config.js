/*
 * @Description:
 * @Author: 笙痞77
 * @Date: 2023-06-05 11:16:24
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-12-21 14:16:37
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import cesium from "vite-plugin-cesium";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";

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
    cesium(),
    {
      ...viteCompression({
        //gzip压缩
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      apply: "build",
    },
    viteImagemin(), // 图片压缩
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    commonjsOptions: {
      strictRequires: true, // 兼容commonjs
    },
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
  server: {
    // 开发服务器配置
    host: "0.0.0.0", // 开发模式下，配置ip访问
    open: "/pages/", // 指定打开的路由
    port: 6678, // 指定端口
  },
});
