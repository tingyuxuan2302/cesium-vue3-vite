import express from "express"
import sqlQuery from "../mysql/sqlQuery.js"

const router = express.Router()

router.get("/test", async (req, res) => {
  const strSql = `select * from test`;
  try {
    const result = await sqlQuery(strSql);
    res.send({
      code: 1,
      message: "请求成功",
      result,
    });
  } catch (err) {
    console.error(err)
    res.send({
      code: -1,
      message: "请求失败",
    });
  }
})

export default router