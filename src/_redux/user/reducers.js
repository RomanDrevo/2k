import { fromJS, Map } from 'immutable'
import { handleAction, handleActions } from 'redux-actions'
import { createAsyncHandlers } from '../actions'
// import { MEDIA_ACTION_FAILED_STATUS, MEDIA_ACTION_STATUS } from '../media/actions'

const convertUserMetadata = (metadata = {}) => {
  const liked_campaign_ids = {}
  if (metadata.liked_campaign_ids) {
    metadata.liked_campaign_ids.forEach((like) => {
      liked_campaign_ids[like] = true
    })
  }
  return { ...metadata, liked_campaign_ids }
}

const initialState = Map({
  // appMetadata: Map(),
  userData: Map(),
  userMetadata: Map(),
  userProfile: Map(),
  identities: Map(),
  userCredentialsToken: Map(),
  authModalOpen: false,
  authState: 'login',
  authStatePrev: 'login'
})

const authenticateWithCredentials = createAsyncHandlers('AUTHENTICATE_WITH_CREDENTIALS', {
  success(state, action) {
    const { data } = action.payload
    return state.set('userCredentialsToken', fromJS(data))
  }
})
/*
const fetchUserProfile = createAsyncHandlers('FETCH_USER_PROFILE', {
  success(state, action) {
    const { data } = action.payload
    return state.set('userProfile', fromJS(data))
  }
})
*/

const fetchUserIDP = createAsyncHandlers('FETCH_USERS_IDP', {
  request(state) {
    const identities = { ...state.get('identities').toJS(), loading: true }
    return state.set('identities', fromJS(identities))
  },
  success(state, action) {
    const { data } = action.payload
    const identities = { ...state.get('identities').toJS(), facebook: data.access_token, loading: false }
    return state.set('identities', fromJS(identities))
  },
  failed(state) {
    const identities = { ...state.get('identities').toJS(), loading: false }
    return state.set('identities', fromJS(identities))
  }
})

// const fetchUsersAppMetadata = createAsyncHandlers('FETCH_USERS_APP_METADATA', {
//   success(state, action) {
//     const { data = {} } = action.payload

//     return state
//       .set('appMetadata', data.app_metadata ? fromJS(data.app_metadata) : Map())
//     // .set('identities', data.identities ? fromJS(data.identities) : List())
//   }
// })

const fetchUserMetadata = createAsyncHandlers('FETCH_USER_METADATA', {
  success(state, action) {
    const { data } = action.payload
    return state.set('userMetadata', fromJS(convertUserMetadata(data.user_profile)))
  }
})

const updateUserProfile = createAsyncHandlers('UPDATE_USER_PROFILE', {
  success(state, action) {
    const { data } = action.payload
    return state.set('userMetadata', fromJS(convertUserMetadata(data.user_metadata)))
  }
})

const deleteUserPicture = createAsyncHandlers('DELETE_USER_PICTURE', {
  success(state, action) {
    const { data } = action.payload
    // console.log()
    // return state.withMutations((map) => {
    //   map.set('userMetadata', map.get('userMetadata')
    //     .set('profile_media_id', null)
    //     .set('profile_media_type', null)
    //     .set('profile_media_url', null))
    // })
    return state.set('userMetadata', fromJS(convertUserMetadata(data.user_metadata)))
  }
})

const restoreOriginalUserPicture = createAsyncHandlers('RESTORE_ORIGINAL_PICTURE', {
  success(state, action) {
    const { data } = action.payload
    return state.set('userMetadata', fromJS(convertUserMetadata(data.user_metadata)))
  }
})

const createUserPicture = createAsyncHandlers('CREATE_USER_PICTURE', {
  success(state) {
    return state
  }
})

const likeCampaign = createAsyncHandlers('LIKE_CAMPAIGN', {
  request(state, action) {
    const userMetadata = state.get('userMetadata').toJS()
    const liked_campaign_ids = { ...userMetadata.liked_campaign_ids }
    liked_campaign_ids[action.payload] = true
    userMetadata.liked_campaign_ids = liked_campaign_ids
    return state.set('userMetadata', fromJS(userMetadata))
  },
  success(state) {
    return state
  },
  failed(state, action) {
    const userMetadata = state.get('userMetadata').toJS()
    const liked_campaign_ids = { ...userMetadata.liked_campaign_ids }
    delete liked_campaign_ids[action.payload.campaign_id]
    userMetadata.liked_campaign_ids = liked_campaign_ids
    return state.set('userMetadata', fromJS(userMetadata))
  }
})

const dislikeCampaign = createAsyncHandlers('DISLIKE_CAMPAIGN', {
  request(state, action) {
    const userMetadata = state.get('userMetadata').toJS()
    const liked_campaign_ids = { ...userMetadata.liked_campaign_ids }
    delete liked_campaign_ids[action.payload]
    userMetadata.liked_campaign_ids = liked_campaign_ids
    return state.set('userMetadata', fromJS(userMetadata))
  },
  success(state) {
    return state
  },
  failed(state, action) {
    const userMetadata = state.get('userMetadata').toJS()
    const liked_campaign_ids = { ...userMetadata.liked_campaign_ids }
    liked_campaign_ids[action.payload.campaign_id] = true
    userMetadata.liked_campaign_ids = liked_campaign_ids
    return state.set('userMetadata', fromJS(userMetadata))
  }
})

const CHANGE_USER_METADATA = handleAction('CHANGE_USER_METADATA', (state, action) => {
  const { key, value } = action.payload

  const userProfile = state.get('userMetadata').toJS()
  userProfile[key] = value
  return state.set('userMetadata', fromJS(userProfile))
}, initialState)

const REPLACE_USER_METADATA = handleAction('REPLACE_USER_METADATA', (state, action) =>
  state.set('userMetadata', fromJS(convertUserMetadata(action.payload))), initialState)

const SET_AUTH_MODAL =
  handleAction('SET_AUTH_MODAL', (state, action) =>
    state.withMutations((map) => {
      map.set('authModalOpen', action.payload)
      if (action.payload) {
        map.set('userData', Map())
        map.set('userMetadata', Map())
        map.set('identities', Map())
        map.set('userCredentialsToken', Map())
      }
    }), initialState)

const SET_AUTH_STATE =
  handleAction('SET_AUTH_STATE', (state, action) => state.withMutations((map) => {
    map.set('authStatePrev', map.get('authState'))
    map.set('authState', action.payload)
  }), initialState)

export default handleActions({
  ...authenticateWithCredentials,
  // ...fetchUserProfile,
  // ...fetchUsersAppMetadata,
  ...updateUserProfile,
  ...deleteUserPicture,
  ...createUserPicture,
  ...fetchUserMetadata,
  ...fetchUserIDP,
  ...restoreOriginalUserPicture,
  ...likeCampaign,
  ...dislikeCampaign,
  CHANGE_USER_METADATA,
  SET_AUTH_MODAL,
  SET_AUTH_STATE,
  REPLACE_USER_METADATA
}, initialState)
