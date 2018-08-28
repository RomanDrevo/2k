import _ from 'lodash'
import { createAction, createAsyncAction } from '../actions'
import { fetchAPI } from '../../_core/http'
import { ERROR } from '../notification/actions'
import {
  RECOMMEND_CAMPAIGN, UPDATE_CAMPAIGN, CREATE_CAMPAIGN, UPDATE_CAMPAIGN_RESULTS
} from '../../constants'

const OPEN_PAYPAL_DEPOSIT_WINDOW = createAction('OPEN_PAYPAL_DEPOSIT_WINDOW', () => (true))

const CLOSE_PAYPAL_DEPOSIT_WINDOW = createAction('CLOSE_PAYPAL_DEPOSIT_WINDOW', () => (false))

const SHOW_DEPOSIT_BUDGET_ALERT = createAction('SHOW_DEPOSIT_BUDGET_ALERT', () => (true))

const HIDE_DEPOSIT_BUDGET_ALERT = createAction('HIDE_DEPOSIT_BUDGET_ALERT', () => (true))

const SHOW_DEPOSIT_BUTTONS = createAction('SHOW_DEPOSIT_BUTTONS', () => (true))

const HIDE_DEPOSIT_BUTTONS = createAction('HIDE_DEPOSIT_BUTTONS', () => (false))

const SET_AMOUNT_TO_DEPOSIT = createAction('SET_AMOUNT_TO_DEPOSIT', (amount) => (amount))

const SET_CURRENCY_TO_DEPOSIT = createAction('SET_CURRENCY_TO_DEPOSIT', (currency) => (currency))

const SET_EDIT_CAMPAIGN_ID = createAction('SET_EDIT_CAMPAIGN_ID', (campaignId) => campaignId)

const SET_SELECTED_CAMPAIGN = createAction('SET_SELECTED_CAMPAIGN', (campaignId) => campaignId)

const OPEN_CAMPAIGN_CREATE_MODAL = createAction('OPEN_CAMPAIGN_CREATE_MODAL', (isOpen) => isOpen)

const SET_CAMPAIGN_DATA = createAction('SET_CAMPAIGN_DATA', (campaign) => ({ campaign }))

const CLOSE_CAMPAIGN_RESULTS_MODAL = createAction('CLOSE_CAMPAIGN_RESULTS_MODAL', (isOpen) => (isOpen))

const FETCH_CAMPAIGN_RESULTS = createAsyncAction('FETCH_CAMPAIGN_RESULTS', function getCampaignResults(campaignId) {
  const url = 'campaign/results'
  return (dispatch) => fetchAPI(url, { params: { campaign_id: campaignId } })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
})

const FETCH_CAMPAIGN_INFLUENCER_RESULTS = createAsyncAction(
  'FETCH_CAMPAIGN_INFLUENCER_RESULTS',
  function getCampaignInfluencerResults(campaign_id) {
    const url = 'influencer/campaign/results'
    return (dispatch) => fetchAPI(url, { params: { campaign_id } })
      .catch((err) => {
        if (err.errors) {
          dispatch(ERROR(...err.errors))
        }
        dispatch(this.failed(err))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res }))
        return res
      })
  }
)

const SORT_CAMPAIGN_RESULTS = createAction('SORT_CAMPAIGN_RESULTS', (sortFunc) => sortFunc)

const updateCampaignResults = createAsyncAction(
  UPDATE_CAMPAIGN_RESULTS,
  function updateCampaignResults(data) {
    const url = 'campaign/results'

    const newData = {
      leads: _.map(
        data.leads.filter((lead) =>
          lead.verification_status),
        (lead) => _.pick(lead, ['campaign_lead_id', 'verification_status', 'rejection_type', 'rejection_text'])
      )
    }

    return (dispatch) => (
      fetchAPI(url, { method: 'PUT', body: JSON.stringify(newData) })
        .catch((err) => {
          dispatch(ERROR(...err.errors))
          dispatch(this.failed(err))
          throw err
        })
        .then((res) => {
          dispatch(this.success({ data: res }))
          return res
        })
    )
  }
)

const createCampaign = createAsyncAction(CREATE_CAMPAIGN, function createCampaign(data) {
  const url = 'campaign'
  return (dispatch) => (
    fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
      .catch((err) => {
        dispatch(ERROR(...err.errors))
        dispatch(this.failed(err))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res }))
        return res
      })
  )
})

const recommendCampaign = createAsyncAction(RECOMMEND_CAMPAIGN, function recommendCampaign(body) {
  const url = '2key'
  return (dispatch) => (
    fetchAPI(url, { method: 'POST', body })
      .catch((err) => {
        console.log(err)
        dispatch(ERROR(...err.errors))
        dispatch(this.failed({ err, body }))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res }))
        return res
      })
  )
})

const updateCampaign = createAsyncAction(
  UPDATE_CAMPAIGN,
  function updateCampaign(campaignId, data) {
    const url = 'campaign'
    return (dispatch) => (
      fetchAPI(url, {
        method: 'PUT',
        params: { campaign_id: campaignId },
        body: JSON.stringify({ ...data, campaign_id: campaignId })
      })
        .catch((err) => {
          dispatch(ERROR(...err.errors))
          dispatch(this.failed({ err }))
          throw err
        })
        .then((res) => {
          dispatch(this.success({ data: res }))
          return res
        })
    )
  }
)


const fetchCampaign = createAsyncAction('FETCH_CAMPAIGN', function fetchCampaign(campaignId) {
  const url = 'campaign'
  return (dispatch) => (
    fetchAPI(url, { params: { campaign_id: campaignId } })
      .catch((err) => {
        console.log(err)
        dispatch(ERROR(...err.errors))
        dispatch(this.failed(err))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res }))
        return res
      })
  )
})


const fetchCampaigns = createAsyncAction('FETCH_CAMPAIGNS', function fetchCampaigns(businessId) {
  const url = 'campaign/list'
  return (dispatch) => (
    fetchAPI(url, { params: { business_id: businessId } }, { business_id: businessId })
      .catch((err) => {
        dispatch(ERROR(...err.errors))
        dispatch(this.failed(err))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res }))
        return res
      })
  )
})

export default {
  SET_EDIT_CAMPAIGN_ID,
  OPEN_CAMPAIGN_CREATE_MODAL,
  SET_CAMPAIGN_DATA,
  SORT_CAMPAIGN_RESULTS,
  CLOSE_CAMPAIGN_RESULTS_MODAL,
  ...FETCH_CAMPAIGN_RESULTS,
  ...updateCampaignResults,
  ...FETCH_CAMPAIGN_INFLUENCER_RESULTS,
  ...createCampaign,
  ...updateCampaign,
  ...fetchCampaign,
  ...fetchCampaigns,
  ...recommendCampaign,
  SET_AMOUNT_TO_DEPOSIT,
  SHOW_DEPOSIT_BUTTONS,
  HIDE_DEPOSIT_BUTTONS,
  SET_SELECTED_CAMPAIGN,
  SET_CURRENCY_TO_DEPOSIT,
  SHOW_DEPOSIT_BUDGET_ALERT,
  HIDE_DEPOSIT_BUDGET_ALERT,
  OPEN_PAYPAL_DEPOSIT_WINDOW,
  CLOSE_PAYPAL_DEPOSIT_WINDOW
}
