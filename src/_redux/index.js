import { combineReducers } from 'redux'
import { reducer as FormReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import BusinessReducer from './business/reducers'
import CampaignReducer from './campaign/reducers'
import DBEnumsReducer from './enums/reducers'
import InfluencerReducer from './influencer/reducers'
import MediaReducer from './media/reducers'
// import NavigationReducer from './navigation/reducers'
import NotificationReducer from './notification/reducers'
import PendingReducer from './pending/reducers'
import ProductReducer from './product/reducers'
import SettingsReducer from './settings/reducers'
import UserReducer from './user/reducers'
import UtilReducer from './util/reducers'

export { default as UtilActions } from './util/actions'
export { default as DBEnumsActions } from './enums/actions'
export { default as BusinessActions } from './business/actions'
export { default as NavigationActions } from './navigation/actions'
export { default as NotificationActions } from './notification/actions'
export { default as PendingActions } from './pending/actions'
export { default as CampaignActions } from './campaign/actions'
export { default as ProductActions } from './product/actions'
export { default as MediaActions, MEDIA_ACTION_STATUS, MEDIA_ACTION_FAILED_STATUS, MEDIA_FROM } from './media/actions'
export { default as UserActions } from './user/actions'
export { default as InfluencerActions } from './influencer/actions'
export { default as SettingsActions } from './settings/actions'

export default combineReducers({
  routing: routerReducer,
  form: FormReducer,
  // navigation: NavigationReducer,
  notification: NotificationReducer,
  // loading: LoadingReducer,
  pending: PendingReducer,
  business: BusinessReducer,
  campaign: CampaignReducer,
  user: UserReducer,
  product: ProductReducer,
  media: MediaReducer,
  enums: DBEnumsReducer,
  influencer: InfluencerReducer,
  settings: SettingsReducer,
  general: UtilReducer
})
