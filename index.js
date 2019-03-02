const express = require("express")
const app = express()

app.get("/", (req, res) => {
  return res.send("Hello Cara!")
})

app.listen(process.env.PORT || 5000, () =>
  console.log(`thymer app listening on port ${process.env.PORT || 5000}`)
)
