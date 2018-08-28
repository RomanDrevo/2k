import { createAsyncAction, createAction } from '../actions'
import { fetchAPI } from '../../_core/http'
import { ERROR } from '../notification/actions'

const OPEN_PAYPAL_WITHDRAWAL_WINDOW = createAction('OPEN_PAYPAL_WITHDRAWAL_WINDOW', () => (true))
const CLOSE_PAYPAL_WITHDRAWAL_WINDOW = createAction('CLOSE_PAYPAL_WITHDRAWAL_WINDOW', () => (true))

const SET_CURRENCY_TO_WITHDRAWAL = createAction('SET_CURRENCY_TO_WITHDRAWAL', (currency) => (currency))

const SET_AMOUNT_TO_WITHDRAWAL = createAction('SET_AMOUNT_TO_WITHDRAWAL', (amount) => (amount))

const SHOW_NEW_ACCOUNT_MOBILE_BUTTONS = createAction('SHOW_NEW_ACCOUNT_MOBILE_BUTTONS', () => (true))
const HIDE_NEW_ACCOUNT_MOBILE_BUTTONS = createAction('HIDE_NEW_ACCOUNT_MOBILE_BUTTONS', () => (true))

const OPEN_CREATE_BANK_ACCOUNT_FORM = createAction('OPEN_CREATE_BANK_ACCOUNT_FORM', () => (true))
const CLOSE_CREATE_BANK_ACCOUNT_FORM = createAction('CLOSE_WITHDRAWAL_WINDOW', () => (true))

const OPEN_WITHDRAWAL_WINDOW = createAction('OPEN_WITHDRAWAL_WINDOW', () => (true))
const CLOSE_WITHDRAWAL_WINDOW = createAction('CLOSE_WITHDRAWAL_WINDOW', () => (true))

const OPEN_ADD_NEW_ACCOUNT = createAction('OPEN_ADD_NEW_ACCOUNT', () => (true))
const CLOSE_ADD_NEW_ACCOUNT = createAction('CLOSE_ADD_NEW_ACCOUNT', () => (false))

const OPEN_PAYMETHODS_LIST = createAction('OPEN_PAYMETHODS_LIST', () => (true))
const CLOSE_PAYMETHODS_LIST = createAction('CLOSE_PAYMETHODS_LIST', () => (false))

const fetchInfluencerSummary = createAsyncAction(
  'FETCH_INFLUENCER_SUMMARY',
  function() {
    const url = 'influencer/summary'
    return (dispatch) => fetchAPI(url).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      // console.log('GET SUMMARY RESPONSE', res)
      return res
    })
  }
)

const fetchInfluencerCampaigns = createAsyncAction(
  'FETCH_INFLUENCER_CAMPAIGNS',
  function() {
    const url = 'campaign/list'
    return (dispatch) => fetchAPI(url).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
  }
)

const fetchInfluencerCampaignResults = createAsyncAction('FETCH_INFLUENCER_CAMPAIGN_RESULTS', function() {
  const url = 'influencer/campaign/results'
  return (dispatch) => fetchAPI(url).catch((err) => {
    dispatch(ERROR(...err.errors))
    dispatch(this.failed(err))
    throw err
  }).then((res) => {
    dispatch(this.success({ data: res }))
    return res
  })
})

const fetchInfluencerBalance = createAsyncAction(
  'FETCH_INFLUENCER_BALANCE',
  function() {
    const url = 'influencer/balance'
    return (dispatch) => fetchAPI(url).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      console.log('GET BALANCE RESPOPNSE: ', res)
      return res
    })
  }
)

const sendInfluencerDispute = createAsyncAction(
  'SEND_INFLUENCER_DISPUTE',
  function(data) {
    const url = 'influencer/dispute'
    return (dispatch) => fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
      .catch((err) => {
        dispatch(ERROR(...err.errors))
        dispatch(this.failed(err))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res }))
        return res
      })
  }
)
const fetchInfluencerPaymethodList = createAsyncAction('FETCH_INFLUENCER_PAYMETHOD_LIST', function() {
  const url = 'influencer/paymethod/list'
  return (dispatch) => fetchAPI(url, { method: 'GET' }).catch((err) => {
    dispatch(ERROR(...err.errors))
    dispatch(this.failed(err))
    throw err
  }).then((res) => {
    // console.log("Here", res)

    dispatch(this.success({ data: res }))
    return res
  })
})
// eslint-disable-next-line
// const PRIMARY_PAYMETHOD_MAKE_CHANGED = createAsyncAction('PRIMARY_PAYMETHOD_MAKE_CHANGED', function() {
//   console.log('Changing PRIMARY payMethod!')
//   const url = 'influencer/paymethod'
//   return (dispatch) => fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
//     .catch((err) => {
//       dispatch(ERROR(...err.errors))
//       dispatch(this.failed(err))
//       throw err
//     })
//     .then((res) => {
//       console.log('creating new payMethod res: ', res)
//
//       dispatch(this.success({ data: res }))
//     })
// })

const createInfluencerPayMethod = createAsyncAction('CREATE_INFLUENCER_PAYMETHOD', function createNewPayMethod(data) {
  console.log('creating new payMethod!')
  const url = 'influencer/paymethod'
  return (dispatch) => fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      console.log('creating new payMethod res: ', res)

      dispatch(this.success({ data: res }))
    })
})

const editInfluencerPayMethod = createAsyncAction('EDIT_INFLUENCER_PAYMETHOD', function editPayMethod(data) {
  console.log('EDITING payMethod!')
  const url = 'influencer/paymethod'
  return (dispatch) => fetchAPI(url, { method: 'PUT', body: JSON.stringify(data) })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      console.log('EDITING payMethod res: ', res)

      dispatch(this.success({ data: res }))
    })
})

const setNewPrimary = createAsyncAction('SET_NEW_PRIMARY', function setNewPrimaryMethod(paymethodId) {
  console.log('Set NEW PRImaRy!!!')
  const url = 'influencer/paymethod'
  const body = {
    is_default: true,
    paymethod_id: paymethodId
  }
  return (dispatch) => fetchAPI(url, { method: 'PUT', body: JSON.stringify(body) })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      console.log('EDITING payMethod res: ', res)
      dispatch(this.success({ data: res }))
      return res
    })
})

const deleteInfluencerPayMethod = createAsyncAction(
  'DELETE_INFLUENCER_PAYMETHOD',
  function deletePayMethod(paymethodId) {
    console.log('DELETING PAYMETHOD!')
    const url = 'influencer/paymethod'
    const body = {
      is_deleted: true,
      paymethod_id: paymethodId
    }
    return (dispatch) => fetchAPI(
      url,
      { method: 'PUT', body: JSON.stringify(body) }
    ).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err }))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      console.log('PAYMETHOD HAS BEEN DELETED! RES is: ', res)
      return res
    })
  }
)

export default {
  ...fetchInfluencerSummary,
  ...fetchInfluencerCampaigns,
  ...fetchInfluencerBalance,
  ...fetchInfluencerCampaignResults,
  ...sendInfluencerDispute,
  ...fetchInfluencerPaymethodList,
  ...createInfluencerPayMethod,
  ...editInfluencerPayMethod,
  ...deleteInfluencerPayMethod,
  ...setNewPrimary,
  OPEN_ADD_NEW_ACCOUNT,
  CLOSE_ADD_NEW_ACCOUNT,
  OPEN_PAYMETHODS_LIST,
  CLOSE_PAYMETHODS_LIST,
  OPEN_WITHDRAWAL_WINDOW,
  CLOSE_WITHDRAWAL_WINDOW,
  OPEN_CREATE_BANK_ACCOUNT_FORM,
  CLOSE_CREATE_BANK_ACCOUNT_FORM,
  SET_AMOUNT_TO_WITHDRAWAL,
  SHOW_NEW_ACCOUNT_MOBILE_BUTTONS,
  HIDE_NEW_ACCOUNT_MOBILE_BUTTONS,
  SET_CURRENCY_TO_WITHDRAWAL,
  OPEN_PAYPAL_WITHDRAWAL_WINDOW,
  CLOSE_PAYPAL_WITHDRAWAL_WINDOW
}
