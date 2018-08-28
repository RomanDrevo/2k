import max from 'lodash/max'
import { handleActions, handleAction } from 'redux-actions'
import { fromJS, Map, List } from 'immutable'
import { createAsyncHandlers } from '../actions'

const initialState = Map({
  summary_data: Map(),
  balance_data: Map(),
  campaigns_data: Map(),
  payment_methods_list: List(),
  results: Map(),
  last_activity: null,
  isAddNewAccountOpen: false,
  isPaymethodListOpen: false,
  isWithdrawalWindowOpen: false,
  isCreateBankAccountFormOpen: false,
  amountToWithdrawal: 0,
  currencyToWithdrawal: null,
  isNewAccountMobileButtonsOpen: false,
  isPayPalWithdrawalWindowOpen: false
})

const OPEN_PAYPAL_WITHDRAWAL_WINDOW = handleAction('OPEN_PAYPAL_WITHDRAWAL_WINDOW', (state) => (
  state.set('isPayPalWithdrawalWindowOpen', true)
), initialState)

const CLOSE_PAYPAL_WITHDRAWAL_WINDOW = handleAction('CLOSE_PAYPAL_WITHDRAWAL_WINDOW', (state) => (
  state.set('isPayPalWithdrawalWindowOpen', false)
), initialState)

const SET_CURRENCY_TO_WITHDRAWAL = handleAction('SET_CURRENCY_TO_WITHDRAWAL', (state, action) => (
  state.set('currencyToWithdrawal', action.payload)
), initialState)

const SHOW_NEW_ACCOUNT_MOBILE_BUTTONS = handleAction('SHOW_NEW_ACCOUNT_MOBILE_BUTTONS', (state) => (
  state.set('isNewAccountMobileButtonsOpen', true)
), initialState)

const HIDE_NEW_ACCOUNT_MOBILE_BUTTONS = handleAction('HIDE_NEW_ACCOUNT_MOBILE_BUTTONS', (state) => (
  state.set('isNewAccountMobileButtonsOpen', false)
), initialState)

const SET_AMOUNT_TO_WITHDRAWAL = handleAction('SET_AMOUNT_TO_WITHDRAWAL', (state, action) => (
  state.set('amountToWithdrawal', action.payload)
), initialState)

const OPEN_CREATE_BANK_ACCOUNT_FORM = handleAction('OPEN_CREATE_BANK_ACCOUNT_FORM', (state) => (
  state.set('isCreateBankAccountFormOpen', true)
), initialState)

const CLOSE_CREATE_BANK_ACCOUNT_FORM = handleAction('CLOSE_CREATE_BANK_ACCOUNT_FORM', (state) => (
  state.set('isCreateBankAccountFormOpen', false)
), initialState)

const OPEN_WITHDRAWAL_WINDOW = handleAction('OPEN_WITHDRAWAL_WINDOW', (state) => (
  state.set('isWithdrawalWindowOpen', true)
), initialState)

const CLOSE_WITHDRAWAL_WINDOW = handleAction('CLOSE_WITHDRAWAL_WINDOW', (state) => (
  state.set('isWithdrawalWindowOpen', false)
), initialState)

const OPEN_ADD_NEW_ACCOUNT = handleAction('OPEN_ADD_NEW_ACCOUNT', (state) => (
  state.set('isAddNewAccountOpen', true)
), initialState)

const CLOSE_ADD_NEW_ACCOUNT = handleAction('CLOSE_ADD_NEW_ACCOUNT', (state) => (
  state.set('isAddNewAccountOpen', false)
), initialState)

const OPEN_PAYMETHODS_LIST = handleAction('OPEN_PAYMETHODS_LIST', (state) => (
  state.set('isPaymethodListOpen', true)
), initialState)

const CLOSE_PAYMETHODS_LIST = handleAction('CLOSE_PAYMETHODS_LIST', (state) => (
  state.set('isPaymethodListOpen', false)
), initialState)

const fetchInfluencerSummary = createAsyncHandlers('FETCH_INFLUENCER_SUMMARY', {
  success(state, action) {
    const { data } = action.payload

    return state.withMutations((map) => {
      map.set('summary_data', fromJS(data))
    })
  }
})

const fetchInfluencerCampaigns = createAsyncHandlers('FETCH_INFLUENCER_CAMPAIGNS', {
  success(state, action) {
    const { data } = action.payload

    return state.withMutations((map) => {
      const lastActivities = []
      if (data.influencer && data.influencer.active && data.influencer.active.length > 0) {
        data.influencer.active.forEach(({ last_activity }) => {
          lastActivities.push(last_activity)
        })
      }
      if (data.influencer && data.influencer.inactive && data.influencer.inactive.length > 0) {
        data.influencer.inactive.forEach(({ last_activity }) => {
          lastActivities.push(last_activity)
        })
      }
      const lastActivity = lastActivities.length > 0 ? max(lastActivities) : new Date().toString()
      if ((!map.get('last_activity') || new Date(lastActivity) < map.get('last_activity'))
        && lastActivity) {
        map.set('last_activity', new Date(lastActivity))
      }
      map.set('campaigns_data', fromJS(data))
    })
  }
})

const fetchInfluencerBalance = createAsyncHandlers('FETCH_INFLUENCER_BALANCE', {
  success(state, action) {
    const { data } = action.payload

    return state.withMutations((map) => {
      const lastActivity = data.my_earnings && data.my_earnings.business_summary ?
        max(data.my_earnings.business_summary.map(({ last_activity }) => last_activity))
        : new Date().toString()
      if ((!map.get('last_activity')
        || new Date(lastActivity) < map.get('last_activity'))
        && lastActivity) {
        map.set('last_activity', new Date(lastActivity))
      }

      map.set('balance_data', fromJS(data))
    })
  }
})

const fetchInfluencerPaymethodList = createAsyncHandlers('FETCH_INFLUENCER_PAYMETHOD_LIST', {
  success(state, action) {
    const { data } = action.payload
    return state.set('payment_methods_list', fromJS(data.payment_methods.filter((x) => x.is_deleted !== true)))
      .set('loading', false)
  },
  request(state) {
    return state.set('loading', true)
  },
  failed(state) {
    return state.set('loading', false)
  }
})


const createInfluencerPayMethod = createAsyncHandlers('CREATE_INFLUENCER_PAYMETHOD', {
  success(state, action) {
    const { data } = action.payload
    const paymentMethodsList = state.get('payment_methods_list').toJS()
    // console.log(paymentMethodsList, data.payment_method)
    paymentMethodsList.push(data.payment_method)
    return state
      .set('payment_methods_list', fromJS(paymentMethodsList))
  }
})

const editInfluencerPayMethod = createAsyncHandlers('EDIT_INFLUENCER_PAYMETHOD', {
  success(state, action) {
    const { data } = action.payload
    const paymentMethodsList = state.get('payment_methods_list').toJS()
      .map((method) => (method.id === data.payment_method.id ? data.payment_method : method))
    return state
      .set('payment_methods_list', fromJS(paymentMethodsList))
  }
})

const setNewPrimary = createAsyncHandlers('SET_NEW_PRIMARY', {
  success(state, action) {
    const { data } = action.payload
    const paymentMethodsList = state.get('payment_methods_list').toJS()
      .map((method) =>
        (method.id === data.payment_method.id ?
          data.payment_method : { ...method, is_default: false }))
    return state
      .set('payment_methods_list', fromJS(paymentMethodsList))
  }
})

const deleteInfluencerPayMethod = createAsyncHandlers('DELETE_INFLUENCER_PAYMETHOD', {
  success(state, action) {
    const { data: { payment_method } } = action.payload
    const paymentMethodsList = state.get('payment_methods_list').toJS()
      .filter((item) => (item.id !== payment_method.id))
    return state.set('payment_methods_list', fromJS(paymentMethodsList))
  },
  failed(action) {
    console.log('DATA TO SERVER: ', action.payload)
  }
})


export default handleActions({
  ...fetchInfluencerSummary,
  ...fetchInfluencerBalance,
  ...fetchInfluencerCampaigns,
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
}, initialState)
