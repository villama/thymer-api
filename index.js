const express = require("express")
const query = require("./query")
const validate = require("./validate")

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

  // Unpack stuff that we want
  const { username, email, password, first_name, last_name } = req.body

  // Query for username
  query(
    "select username from accounts where lower(username) = lower($1)",
    [username],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      if (result.rowCount > 0) {
        console.log(`Username ${username} is taken`)
        return res.status(409).send(`Username ${username} is taken`)
      }
      // Query for email
      query(
        "select email from accounts where lower(email) = lower($1)",
        [email],
        (err, result) => {
          if (err) {
            console.log(err)
            return res.status(500).send(err)
          }
          if (result.rowCount > 0) {
            console.log(`Email ${email} is taken`)
            return res.status(409).send(`Email ${email} is taken`)
          }
          // Query for inserting user
          query(
            "insert into accounts (username, email, password, first_name, last_name, created_on) values ($1, $2, $3, $4, $5, current_timestamp)",
            [username, email, password, first_name, last_name],
            (err, result) => {
              if (err) {
                console.log(err)
                return res.status(500)
              }
              // Return user
              query(
                "select * from accounts where lower(username) = lower($1)",
                [username],
                (err, result) => {
                  if (err) {
                    console.log(err)
                    return res.status(500)
                  }
                  var user = result.rows[0]
                  delete user["password"]
                  console.log("User " + user.username + " created")
                  return res.status(200).send(user)
                }
              )
            }
          )
        }
      )
    }
  )
})

app.listen(process.env.PORT, () =>
  console.log(`thymer app listening on port ${process.env.PORT}`)
)

// ***

// query("select * from accounts", [], (err, result) => {
//   if (err) return console.log(err)
//   console.log(result)
// })
