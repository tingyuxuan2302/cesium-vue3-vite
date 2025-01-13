/*
 * @Description:
 * @Author: 笙痞77
 * @Date: 2023-06-05 11:16:24
 * @LastEditors: 笙痞77
 * @LastEditTime: 2025-01-13 17:18:41
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import cesium from "vite-plugin-cesium";
import viteCompression from "vite-plugin-compression";
import { viteStaticCopy } from "vite-plugin-static-copy";

// import viteImagemin from "vite-plugin-imagemin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
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
      // viteImagemin(), // 图片压缩
      // viteStaticCopy({
      //   targets: [
      //     {
      //       src: "public/*", // 指定源文件路径
      //       dest: "docs/", // 指定打包后目标路径
      //     },
      //   ],
      // }),
      {
        name: "adjust-static-path",
        apply: "build",
        transformIndexHtml(html) {
          // 修改静态资源引用路径，确保打包后路径正确
          return html.replace(/\/json\//g, "/docs/json/");
        },
      },
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
      outDir: "docs",
      rollupOptions: {
        plugins: {
          // 重写静态资源路径
          name: "rewrite-paths",
          generateBundle(_, bundle) {
            for (const fileName in bundle) {
              const chunk = bundle[fileName];
              if (chunk.type === "chunk" && chunk.code) {
                chunk.code = chunk.code.replace(/\/json\//g, "/docs/json/");
                chunk.code = chunk.code.replace(/\/images\//g, "/docs/images/");
                chunk.code = chunk.code.replace(/\/models\//g, "/docs/models/");
              }
            }
          },
        },
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
  };
});
