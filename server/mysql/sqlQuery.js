import db from "./link.js"
const sqlQuery = (strSql) => {
  return new Promise((resolve, reject) => {
    // 执行sql语句
    db.query(strSql, (err, res, fields) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

export default sqlQuery