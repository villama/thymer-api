const express = require("express")
const query = require("./query")

const app = express()

app.get("/", (req, res) => {
  return res.send("Hello Cara!")
})

app.listen(process.env.PORT, () =>
  console.log(`thymer app listening on port ${process.env.PORT}`)
)

// ***
query("select * from account", [], (err, result) => {
  if (err) return console.log(err)
  console.log(result)
})
