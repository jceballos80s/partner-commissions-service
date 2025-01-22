const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const hubspot = require('@hubspot/api-client')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/register', (req, res) => {
  console.log(req.body, '<< params received')

  res.send({
    deal: 1,
    partner: 1,
    subscription: 1,
    payment: 1,
    contact: 1
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})