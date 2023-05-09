import express from "express"
import { loadJsonFile } from "load-json-file"
import sqlQuery from "../../mysql/sqlQuery.js"

const router = express.Router()
// 文件上传
router.post("/uploadFile", async (req, res) => {
  let fileObj = null
  let filePath = ""
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send({
      code: 500,
      msg: "上传失败"
    })
    return
  }

  fileObj = req.files.file
  filePath = "./upload/" + fileObj.name
  fileObj.mv(filePath, (err) => {
    console.log("cv-err", err)
    if (err) {
      return res.status(500).send({
        code: 500,
        msg: err
      })
    }
    res.send({
      code: 200,
      data: "上传成功~"
    })
  })
})

router.get("/loadJson", async (req, res) => {
  const { fileName } = req.query
  if (!fileName) {
    return res.status(404).send({
      code: 0,
      msg: "无相关文件资源"
    })
  }
  try {
    const json = await loadJsonFile(`./upload/${fileName}`)
    res.status(200).send({
      code: 1,
      msg: "解析文件成功",
      data: json
    })
  } catch (err) {
    res.status(200).send({
      code: 0,
      msg: "解析文件报错"
    })
  }

})
export default router