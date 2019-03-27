const express = require("express")
const query = require("./query")
const validate = require("./validate")
var bcrypt = require("bcryptjs")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  return res.send("Hello Cara!")
})

app.post("/register", (req, res) => {
  // Validate request
  const joi = validate.register(req.body)
  if (joi.error) {
    console.log(joi.error.message)
    return res.status(422).send(joi.error.message)
  }

  const { username, email, password, first_name, last_name } = req.body

  // Hash password
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(13))

  // Insert user
  query(
    "insert into accounts (username, email, password, first_name, last_name, created_on) values ($1, $2, $3, $4, $5, current_timestamp)",
    [username, email, hash, first_name.trim(), last_name.trim()],
    (err, result) => {
      if (err) return res.status(500).send(err.detail ? err.detail : err)

      // Return user
      query(
        "select * from accounts where lower(username) = lower($1)",
        [username],
        (err, result) => {
          if (err) return res.status(500).send(err.detail ? err.detail : err)
          var user = result.rows[0]
          delete user["password"]
          console.log("User " + user.username + " created")
          return res.status(200).send(user)
        }
      )
    }
  )
})

app.post("/login", (req, res) => {
  // Validate request
  const joi = validate.login(req.body)
  if (joi.error) {
    console.log(joi.error.message)
    return res.status(422).send(joi.error.message)
  }

  const { username, email, password } = req.body

  if ((!username && !email) || (username && email)) {
    console.log("Username xor email required")
    return res.status(422).send("Username xor email required")
  }

  // Find the user
  var column = username ? "username" : "email"
  query(
    `select * from accounts where lower(${column}) = lower($1)`,
    [username ? username : email],
    (err, result) => {
      if (err) return res.status(500)
      if (result.rowCount == 0) {
        console.log("No user found")
        return res.status(403).send("Incorrect credentials")
      }
      // Match the passwords
      // if (result.rows[0].password != password) {
      if (!bcrypt.compareSync(password, result.rows[0].password)) {
        console.log("Incorrect password")
        return res.status(403).send("Incorrect credentials")
      }
      console.log("Login successful")
      delete result.rows[0].password
      res.status(200).send(result.rows[0])
    }
  )
})

app.listen(process.env.PORT, () =>
  console.log(`thymer app listening on port ${process.env.PORT}`)
)
