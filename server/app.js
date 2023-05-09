/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-04-04 16:22:07
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-04-07 09:43:33
 */
import express from "express"
import http from "http"
import fileUpload from "express-fileupload"
import cors from "cors"
import modelMain from "./models/index.js"

const app = express()

// 解析请求体中间件：对post请求时的请求体进行解析
// 当请求体content-type是application/json时
app.use(express.json())
// 当请求体content-type是application/x-www-form-urlencoded时
app.use(express.urlencoded({
  extended: false,
}))
// 解决跨域
app.use(cors())
// 使用express-fileupload中间件
app.use(fileUpload())

modelMain(app)
const server = http.createServer(app)
const port = 3000
server.listen(port)
server.on("error", (err) => {
  console.log("---error", err)
})

server.on("listening", () => {
  console.log(`Listening on ${port}`)
})