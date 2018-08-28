import moment from 'moment'
import { handleAction, handleActions } from 'redux-actions'
import { fromJS, Map } from 'immutable'
import { createAsyncHandlers } from '../actions'

const initialState = Map({
  isOpenCampaignCreateModal: false,
  editCampaignId: null,
  selectedCampaign: null,
  results: Map(),
  campaign: Map(),
  campaigns: Map(),
  recommendLoading: Map(),
  resultsLoading: false,
  resultsModal: false,
  amountToDeposit: 0,
  currencyToDeposit: null,
  isDepositButtonsOpen: false,
  isDepositBudgetAlertOpen: false,
  isPayPalDepositWindowOpen: false
})

const OPEN_PAYPAL_DEPOSIT_WINDOW = handleAction('OPEN_PAYPAL_DEPOSIT_WINDOW', (state) => (
  state.set('isPayPalDepositWindowOpen', true)
), initialState)

const CLOSE_PAYPAL_DEPOSIT_WINDOW = handleAction('CLOSE_PAYPAL_DEPOSIT_WINDOW', (state) => (
  state.set('isPayPalDepositWindowOpen', false)
), initialState)

const SHOW_DEPOSIT_BUDGET_ALERT = handleAction('SHOW_DEPOSIT_BUDGET_ALERT', (state) => (
  state.set('isDepositBudgetAlertOpen', true)
), initialState)

const HIDE_DEPOSIT_BUDGET_ALERT = handleAction('HIDE_DEPOSIT_BUDGET_ALERT', (state) => (
  state.set('isDepositBudgetAlertOpen', false)
), initialState)

const HIDE_DEPOSIT_BUTTONS = handleAction('HIDE_DEPOSIT_BUTTONS', (state) => (
  state.set('isDepositButtonsOpen', false)
), initialState)

const SHOW_DEPOSIT_BUTTONS = handleAction('SHOW_DEPOSIT_BUTTONS', (state) => (
  state.set('isDepositButtonsOpen', true)
), initialState)

const SET_CURRENCY_TO_DEPOSIT = handleAction('SET_CURRENCY_TO_DEPOSIT', (state, action) => (
  state.set('currencyToDeposit', action.payload)
), initialState)

const SET_AMOUNT_TO_DEPOSIT = handleAction('SET_AMOUNT_TO_DEPOSIT', (state, action) => (
  state.set('amountToDeposit', action.payload)
), initialState)

const SET_EDIT_CAMPAIGN_ID = handleAction('SET_EDIT_CAMPAIGN_ID', (state, action) => {
  const campaignId = action.payload
  return state.set('editCampaignId', campaignId).set('campaign', Map())
}, initialState)

const SET_SELECTED_CAMPAIGN = handleAction('SET_SELECTED_CAMPAIGN', (state, action) => {
  const campaignId = action.payload
  return state.set('selectedCampaign', campaignId).set('campaign', Map())
}, initialState)

const OPEN_CAMPAIGN_CREATE_MODAL = handleAction('OPEN_CAMPAIGN_CREATE_MODAL', (state, action) => {
  const isOpen = action.payload
  const campaign = {
    is_active: true
  }
  return state.set('isOpenCampaignCreateModal', isOpen).set('campaign', isOpen ? fromJS(campaign) : Map())
}, initialState)

const SET_CAMPAIGN_DATA = handleAction('SET_CAMPAIGN_DATA', (state, action) => {
  const { campaign } = action.payload
  return state.set('campaign', fromJS(campaign))
}, initialState)


const SORT_CAMPAIGN_RESULTS = handleAction('SORT_CAMPAIGN_RESULTS', (state, action) => {
  const sortFunc = action.payload
  const results = state.get('results').toJS()
  results.leads = results.leads.sort(sortFunc)
  return state.set('results', fromJS(results))
}, initialState)

const CLOSE_CAMPAIGN_RESULTS_MODAL = handleAction('CLOSE_CAMPAIGN_RESULTS_MODAL', (state, action) => (
  state.set('resultsModal', action.payload)
), initialState)

const FETCH_CAMPAIGN_RESULTS = createAsyncHandlers('FETCH_CAMPAIGN_RESULTS', {
  success(state, action) {
    const { data } = action.payload
    return state.set('results', fromJS(data))
  }
})

const FETCH_CAMPAIGN_INFLUENCER_RESULTS = createAsyncHandlers('FETCH_CAMPAIGN_INFLUENCER_RESULTS', {
  request(state) {
    return state
      .set('resultsLoading', true)
      .set('resultsModal', true)
  },
  success(state, action) {
    const { data } = action.payload
    return state
      .set('results', fromJS(data))
      .set('resultsLoading', false)
  },
  failed(state) {
    return state
      .set('resultsLoading', false)
  }
})

const UPDATE_CAMPAIGN_RESULTS = createAsyncHandlers('UPDATE_CAMPAIGN_RESULTS', {
  success(state, action) {
    const { data } = action.payload
    return state.set('results', fromJS(data))
  }
})

const recommendCampaign = createAsyncHandlers('RECOMMEND_CAMPAIGN', {
  request(state, action) {
    const recommendLoading = state.get('recommendLoading').toJS()
    const id = JSON.parse(action.payload).campaign_id
    recommendLoading[id] = true
    return state.set('recommendLoading', fromJS(recommendLoading))
  },
  success(state, action) {
    const { data: { twokey } } = action.payload
    const campaigns = state.get('campaigns').toJS()
    const recommendLoading = state.get('recommendLoading').toJS()
    recommendLoading[twokey.campaign_id] = false
    campaigns[twokey.campaign_id] =
      { ...campaigns[twokey.campaign_id], twokey_link: twokey.short_url, user_role: 'influencer' }
    return state.set('campaigns', fromJS(campaigns)).set('recommendLoading', fromJS(recommendLoading))
  },
  failed(state, action) {
    const recommendLoading = state.get('recommendLoading').toJS()
    const id = JSON.parse(action.payload.body).campaign_id
    recommendLoading[id] = false
    return state.set('recommendLoading', fromJS(recommendLoading))
  }
}, initialState)

const createCampaign = createAsyncHandlers('CREATE_CAMPAIGN', {
  success(state, action) {
    const { data: { campaign, tags } } = action.payload
    const { id, start_date: startDate, end_date: endDate } = campaign
    if (startDate) campaign.start_date = moment(startDate, 'YYYY-MM-DD')
    if (endDate) campaign.end_date = moment(endDate, 'YYYY-MM-DD')

    const campaigns = { ...state.get('campaigns').toJS() }
    // const tags = [...campaigns[id].tags || []]
    campaigns[id] = { ...campaigns[id], ...campaign, tags: tags || campaign.tags }

    // return state.withMutations((map) => {
    //   map.set('campaigns', map.get('campaigns').set(id, fromJS(campaign)))
    // })
    return state.set('campaigns', fromJS(campaigns))
  }
})

const updateCampaign = createAsyncHandlers('UPDATE_CAMPAIGN', {
  success(state, action) {
    const { data: { campaign, tags } } = action.payload
    const { id, start_date: startDate, end_date: endDate } = campaign
    if (startDate) {
      campaign.start_date = moment(startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      campaign.end_date = moment(endDate, 'YYYY-MM-DD')
    }
    const campaigns = { ...state.get('campaigns').toJS() }
    // const tags = [...campaigns[id].tags || []]
    campaigns[id] = { ...campaigns[id], ...campaign, tags: tags || campaign.tags }
    // .map((item) => (item.id === id ? campaign : item))

    // return state.withMutations((map) => {
    //   map.set('campaigns', map.get('campaigns').set(id, fromJS(campaign)))
    // })
    return state.set('campaigns', fromJS(campaigns))
  }
})

const fetchCampaign = createAsyncHandlers('FETCH_CAMPAIGN', {
  success(state, action) {
    const { data } = action.payload
    const { start_date: startDate, end_date: endDate } = data.campaign
    if (startDate) data.campaign.start_date = moment(startDate, 'YYYY-MM-DD')
    if (endDate) data.campaign.end_date = moment(endDate, 'YYYY-MM-DD')
    return state.set('campaign', fromJS(data.campaign))
  }
})

const fetchCampaigns = createAsyncHandlers('FETCH_CAMPAIGNS', {
  success(state, action) {
    const { data } = action.payload
    const campaigns = {}
    data.items.forEach((item) => {
      campaigns[item.id] = item
    })
    // return state.withMutations((map) => {
    //   map.set('campaigns', map.get('campaigns').withMutations((es) => {
    //     if (data.items) {
    //       data.items.forEach((c) => {
    //         es.set(c.id, fromJS(c))
    //       })
    //     }
    //   }))
    // })

    return state.set('campaigns', fromJS(campaigns))
      .set('loading', false)
  },
  request(state) {
    return state.set('loading', true)
  },
  failed(state) {
    return state.set('loading', false)
  }
})

const CLEAR_CAMPAIGNS = handleAction(
  'CLEAR_CAMPAIGNS', (state) =>
    state.set('loading', true).set('campaigns', fromJS({})),
  initialState
)


export default handleActions({
  SET_EDIT_CAMPAIGN_ID,
  OPEN_CAMPAIGN_CREATE_MODAL,
  SET_CAMPAIGN_DATA,
  SORT_CAMPAIGN_RESULTS,
  CLOSE_CAMPAIGN_RESULTS_MODAL,
  ...FETCH_CAMPAIGN_RESULTS,
  ...UPDATE_CAMPAIGN_RESULTS,
  ...FETCH_CAMPAIGN_INFLUENCER_RESULTS,
  ...createCampaign,
  ...updateCampaign,
  ...fetchCampaign,
  ...fetchCampaigns,
  ...recommendCampaign,
  CLEAR_CAMPAIGNS,
  SET_AMOUNT_TO_DEPOSIT,
  SHOW_DEPOSIT_BUTTONS,
  HIDE_DEPOSIT_BUTTONS,
  SET_SELECTED_CAMPAIGN,
  SET_CURRENCY_TO_DEPOSIT,
  SHOW_DEPOSIT_BUDGET_ALERT,
  HIDE_DEPOSIT_BUDGET_ALERT,
  OPEN_PAYPAL_DEPOSIT_WINDOW,
  CLOSE_PAYPAL_DEPOSIT_WINDOW
}, initialState)
