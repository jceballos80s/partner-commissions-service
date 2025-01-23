const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const hubspot = require('@hubspot/api-client')
const axios = require('axios')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const hubspotCli = new hubspot.Client({
  accessToken: 'pat-na1-aff1e7ee-7023-4546-941a-766cc2ae0c8a',
  checkLimit: true // (Optional) Specify whether to check the API limit on each call. Default: true
})

app.post('/register', async (req, res) => {
  let data = []

  if ((req.body).__proto__.constructor.name == 'Object') {
    data = [req.body]
  } else {
    data = req.body
  }

  let results = []

  for await (const item of data) {
    const contactObject = await hubspotCli.crm.contacts.basicApi.getById(item.objectId, ['hs_object_id', 'partner_id'])
    const partnerObject = await hubspotCli.crm.objects.basicApi.getById('2-11190825', contactObject.properties.partner_id, ['hs_object_id'])

    const result = await axios.post('https://api-na1.hubapi.com/automation/v4/webhook-triggers/177047/FX3pS1z', {
      partner: Number(partnerObject.properties.hs_object_id),
      contact: Number(contactObject.properties.hs_object_id)
    })
    results.push(result.data)
  }

  res.send({
    sent: true,
    results
  })
})

app.post('/hook', async (req, res) => {
  console.log(req.body)

  res.send({
    ok: true
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})