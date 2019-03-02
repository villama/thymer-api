const express = require("express")
const app = express()
const port = 3000

app.get("/", (req, res) => {
  return res.send("Hello Cara!")
})

app.listen(port, () =>
  console.log(`thymer app listening on port ${process.env.PORT || port}`)
)
