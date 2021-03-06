const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.REQUIRE_SSL.toLowerCase() == "true"
})

// query(text, values, callback(err, result))
module.exports = async (text, values, callback) => {
  // Get a client from the connection pool
  const client = await pool.connect()
  // Query the database
  await client.query(text, values, (err, result) => {
    // Release the client from the connection pool
    client.release()
    // Print the err if there is one
    if (err) console.log(err.detail ? err.detail : err)
    // Run the callback function
    return callback(err, result)
  })
}
