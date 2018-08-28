import {
  UPDATE_BUSINESS_INFO,
  RECOMMEND_CAMPAIGN, UPDATE_CAMPAIGN, CREATE_CAMPAIGN, UPDATE_CAMPAIGN_RESULTS,
  CREATE_PRODUCT, UPDATE_PRODUCT, CREATE_HOSTED_SITE, UPDATE_HOSTED_SITE,
  UPDATE_PENDINGS, FETCH_BUSINESS_DETAILS
} from '../../constants'
import CampaignActions from '../campaign/actions'
import BusinessActions from './actions'
import PendingActions from '../pending/actions'
import ProductActions from '../product/actions'
import MediaActions from '../media/actions'

const businessActions = {
  [`${UPDATE_BUSINESS_INFO}_SUCCESS`]: true,
  [`${RECOMMEND_CAMPAIGN}_SUCCESS`]: true,
  [`${UPDATE_CAMPAIGN}_SUCCESS`]: true,
  [`${CREATE_CAMPAIGN}_SUCCESS`]: true,
  [`${UPDATE_CAMPAIGN_RESULTS}_SUCCESS`]: true,
  [`${CREATE_PRODUCT}_SUCCESS`]: true,
  [`${UPDATE_PRODUCT}_SUCCESS`]: true,
  [`${CREATE_HOSTED_SITE}_SUCCESS`]: true,
  [`${UPDATE_HOSTED_SITE}_SUCCESS`]: true,
  [`${UPDATE_PENDINGS}_SUCCESS`]: true
}

const refreshData = (store) => {
  const state = store.getState().business
  const businessDetails = state.get('businessDetails')
  const businessList = state.get('businessList')
  const business = businessDetails.get('business')
  const id = business && business.get && business.get('id')
  if (id) {
    store.dispatch(CampaignActions.FETCH_CAMPAIGNS(id))
    store.dispatch(BusinessActions.FETCH_BUSINESS_DETAILS(id))
    store.dispatch(BusinessActions.FETCH_BUSINESS_AUDIENCES(id))
    if (businessList.get && businessList.get(`${id}`)) {
      store.dispatch(PendingActions.FETCH_PENDINGS(id))
      store.dispatch(ProductActions.FETCH_PRODUCT_LIST(id))
      store.dispatch(MediaActions.FETCH_MEDIA_LIST({ business_id: id }))
    }
  }
}

export default (store) => (next) => (action) => {
  next(action)
  if (action.type === `${FETCH_BUSINESS_DETAILS}_REQUEST`) {
    const businessDetails = store.getState().business.get('businessDetails')
    const business = businessDetails.get('business')
    if (business.get) {
      const handle = business.get('handle')
      const id = business.get('id')
      if (!(action.payload === handle || action.payload === id)) {
        store.dispatch({ type: 'CLEAR_CAMPAIGNS' })
        store.dispatch({ type: 'CLEAR_MEDIAS' })
        store.dispatch({ type: 'CLEAR_PENDINGS' })
        store.dispatch({ type: 'CLEAR_AUDIENCES' })
      }
    }
  }
  if (businessActions[action.type]) {
    refreshData(store)
  }
}
