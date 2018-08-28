const express = require('express')
//  eslint-disable-next-line
const ejs = require('ejs')
const paypal = require('paypal-rest-sdk')
const bodyParser = require('body-parser')
const queryString = require('query-string')

paypal.configure({
  mode: 'sandbox', // sandbox or live
  // client_id: 'AQK-HYNLracc0BLbFjZJVhqn7D4KI2MIdnxG2H1hWvf6GNvcYwRU5UiLU2NpSy0Ru0-SuIh6P924xZ7U',
  client_id: 'AXX2YrkVfxT8W7hUtCbcrb5b5TRoy8BgOe6agwlnQdPdxvzEK0EZpFhsKYbMkljqoHSM7h1dk5SD0erE',
  // client_secret: 'EIGUaf6csmE-0zCHX7gZ740m9hq9EnwUc5uXNTVo58kNx1puX2JwewuDrc2Fa0HusX7TNZ8uhNZT0HzW'
  client_secret: 'EKfTbB8cEIqeoMD08hUvFA0BQ8UZiOCLY4YjGrKzLXj2id3ZG4lKXiwpCWobDy4_wDAvEAXABUYw0QIX'
})

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

exports.handler = async(event, context, callback) => {
  app.post('/cashout', (req, res) => {
    const sender_batch_id = Math.random().toString(36).substring(9)
    const uncuttedAmountToSend = parseFloat(req.body.amountToSend)
    const amountToSend = uncuttedAmountToSend.toFixed(2)
    const currencyToSend = req.body.currencyToSend
    console.log('amountToSend: ', amountToSend)
    console.log('currencyToSend: ', currencyToSend)

    const create_payout_json = {
      sender_batch_header: {
        sender_batch_id,
        email_subject: 'You have a payment'
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: amountToSend,
            currency: currencyToSend
          },
          // receiver: 'el-facilitator@2key.co',
          // receiver: 'el-buyer-1@2key.co',
          receiver: 'orangefuehrer-facilitator@gmail.com',
          // receiver: 'orangefuehrer-buyer@gmail.com',
          note: 'Thank you.',
          sender_item_id: 'item_3'
        }
      ]
    }

    const sync_mode = 'false'

    paypal.payout.create(create_payout_json, sync_mode, (error, payout) => {
      if (error) {
        console.log(error.response)
        throw error
      } else {
        // console.log('amountToSend', amountToSend)
        console.log('Create Single Payout Response')
        console.log(payout)
        const payoutId = payout.batch_header.payout_batch_id
        paypal.payout.get(payoutId, (error, payout) => {
          if (error) {
            console.log(error)
            // throw error

            res.redirect(`http://localhost:3000/influencer/balance/error?${queryString.stringify(error.response)}`)
          } else {
            console.log('Get Payout Response')
            console.log(JSON.stringify(payout))
            res.redirect(`http://localhost:3000/influencer/balance/success?batch_status=${payout.batch_header.batch_status}&payout_id=${payout.batch_header.payout_batch_id}`)
          }
        })
      }
    })
  })

  app.get('/cancel', (req, res) => res.send('Cancelled'))
}

app.listen(5000, () => console.log('Server Started'))
