const express = require('express')
const app = express()
const port = 3000

app.post('/', (req, res) => {
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