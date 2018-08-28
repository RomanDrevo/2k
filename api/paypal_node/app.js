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

app.get('/', (req, res) => res.render('index'))

app.post('/pay', (req, res) => {
  //  eslint-disable-next-line
  const amount = parseInt(req.body.amount)
  const currency = req.body.campaign_currency
  const businessId = req.body.business_id
  const campaignId = req.body.campaign_id

  console.log('Amount From Req:', amount)
  console.log('Currency From Req:', currency)

  const paymentObj = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel'
    },
    transactions: [{
      item_list: {
        items: [{
          name: 'campaign_name',
          sku: 'payment_type_enum',
          price: amount,
          currency,
          quantity: 1
        }]
      },
      amount: {
        currency,
        total: amount
      },
      description: `businessId: ${businessId}, campaignId: ${campaignId}`
    }]
  }

  const create_payment_json = JSON.stringify(paymentObj)

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error
    } else {
      // console.log('Create Payment Response')
      // console.log(payment)
      // res.send('test')
      for (let i = 0; i < payment.links.length; i += 1) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href)
        }
      }
    }
  })

  //  eslint-disable-next-line
  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID
    //  eslint-disable-next-line
    const paymentId = req.query.paymentId

    console.log('Here: ', amount)

    const execute_payment = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency,
            total: amount
          }
        }
      ]
    }

    const execute_payment_json = JSON.stringify(execute_payment)

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.log(error.response)
        // throw error
        res.redirect(`http://localhost:3000/business/${businessId}/finances/error?${queryString.stringify(error.response)}`)
      } else {
        console.log('Get Payment Response')
        console.log(JSON.stringify(payment))
        // res.send('Success dikm')
        // send request to API to update the campaign budget
        res
          .redirect(`http://localhost:3000/business/${businessId}/finances/success?${queryString.stringify(req.query)}`)
      }
    })
  })
})


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

app.listen(5000, () => console.log('Server Started'))
