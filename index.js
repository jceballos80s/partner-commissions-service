require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const hubspot = require('@hubspot/api-client')
const axios = require('axios')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const hubspotCli = new hubspot.Client({
  accessToken: process.env.HUBSPOT_PRIVATE_KEY,
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
    const partnerSearch = await hubspotCli.crm.objects.searchApi.doSearch('2-11190825', {
      // query: `partner_id=${contactObject.properties.partner_id}`,
      "filterGroups": [
        {
          "filters": [
            {
              "propertyName": "partner_id",
              "operator": "EQ",
              "value": contactObject.properties.partner_id
            }
          ]
        }
      ],
      properties: ['hs_object_id']
    })
    if (partnerSearch.results.length > 0) {
      const partnerObject = partnerSearch.results[0]
      const result = await axios.post(process.env.WORKFLOW_ENDPOINT, {
        partner: Number(partnerObject.properties.hs_object_id),
        contact: Number(contactObject.properties.hs_object_id)
      })
      results.push(result.data)
    }
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