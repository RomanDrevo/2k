import _ from 'lodash'
import { createAction, createAsyncAction } from '../actions'
import { fetchAPI, updateAPI } from '../../_core/http'
import { ERROR } from '../notification/actions'
import { UPDATE_PENDINGS } from '../../constants'

const fetchPendings = createAsyncAction('FETCH_PENDINGS', function(business_id) {
  const url = 'business/results/pending'
  return (dispatch) => fetchAPI(url, { params: { business_id } }, { business_id })
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

const updatePendings = createAsyncAction(UPDATE_PENDINGS, function(data) {
  const url = 'business/results'
  const clonedData = _.clone(data)
  clonedData.leads = _.map(data.leads.filter((lead) => lead.verification_status), (lead) => _.pick(lead, ['campaign_lead_id', 'verification_status', 'rejection_type', 'rejection_text']))

  return (dispatch) => updateAPI(url, {}, clonedData)
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

const CHANGE_PENDINGS = createAction('CHANGE_PENDINGS', (data) => data)
export default {
  ...fetchPendings,
  ...updatePendings,
  CHANGE_PENDINGS
}
