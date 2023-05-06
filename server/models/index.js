

import fileUploadRouter from "./common/uploadData.js"
import test from "./test.js"
const main = (app) => {
  // app.use("/marks", () => import("./marks/point"))
  app.use("/api/common", fileUploadRouter)
  app.use("/api", test)
}
// module.exports = (app) => {
//   app.use("/common", fileUploadRouter)
// }

export default main