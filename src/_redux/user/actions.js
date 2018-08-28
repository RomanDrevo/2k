import { createAction, createAsyncAction } from '../actions'
import { ERROR } from '../notification/actions'
import { fetchAPI } from '../../_core/http'

/*
const fetchUserProfile = createAsyncAction(
  'FETCH_USER_PROFILE',
  function getProfile(auth) {
    return (dispatch) => new Promise((resolve) => {
      auth.getProfile(resolve)
    }).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
  }
)
*/
// const fetchusersAppMetadata = createAsyncAction(
//   'FETCH_USERS_APP_METADATA',
//   function getUser(auth) {
//     return (dispatch) => new Promise((resolve) => {
//       auth.getUser(resolve)
//     }).catch((err) => {
//       dispatch(ERROR(...err.errors))
//       dispatch(this.failed(err))
//       throw err
//     }).then((res) => {
//       dispatch(this.success({ data: res }))
//       return res
//     })
//   }
// )

const authenticateWithCredentials =
  createAsyncAction('AUTHENTICATE_WITH_CREDENTIALS', function authenticateWithCredentials(username, password) {
    return (dispatch) => fetchAPI('user/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password, scope: 'openid profile email read:users read:user_idp_tokens' })
    })
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
const fetchusersIDP = createAsyncAction('FETCH_USERS_IDP', function getIDP() {
  return (dispatch) => fetchAPI('user/auth/facebook').catch((err) => {
    dispatch(ERROR(...err.errors))
    dispatch(this.failed(err))
    throw err
  }).then((res) => {
    dispatch(this.success({ data: res }))
    return res
  })
})

// const renewToken = createAsyncAction('RENEW_TOKEN', (auth) => (dispatch) =>
//   new Promise((resolve, reject) => {
//     auth.renewToken()
//   }))


// const setFavoriteOffers = createAsyncAction('SET_FAVORITE_OFFER', function setFavoriteOffer() {
//   return (dispatch) => fetchAPI('', { method: 'POST' })
//     .catch((err) => {
//       dispatch(ERROR(...err.errors))
//       dispatch(this.failed(err))
//       throw err
//     })
//     .then((res) => {
//       dispatch(this.success({ data: res }))
//       return res
//     })
// })

const fetchUserMetadata = createAsyncAction('FETCH_USER_METADATA', function getMetaData(data) {
  console.log(data)
  const url = 'user/profile'
  return (dispatch) => fetchAPI(url, { method: 'GET', params: {} })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err }))
      throw err
    })
    .then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
})

const likeCampaign = createAsyncAction('LIKE_CAMPAIGN', function likeCampaign(campaign_id) {
  const url = 'user-role'
  return (dispatch) => fetchAPI(url, {
    method: 'POST',
    params: {},
    body: JSON.stringify({
      campaign_id,
      target_role_type: 'liked'
    })
  })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err, campaign_id }))
      throw err
    })
    .then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
})

const dislikeCampaign = createAsyncAction('DISLIKE_CAMPAIGN', function dislikeCampaign(campaign_id) {
  const url = 'user-role'
  return (dispatch) => fetchAPI(url, {
    method: 'POST',
    params: {},
    body: JSON.stringify({
      campaign_id,
      target_role_type: 'disliked'
    })
  })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err, campaign_id }))
      throw err
    })
    .then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
})


const updateUserProfile = createAsyncAction(
  'UPDATE_USER_PROFILE',
  function updateProfile(data) {
    const url = 'user/profile'
    return (dispatch) => fetchAPI(
      url,
      { method: 'PUT', params: {}, body: JSON.stringify(data) }
    ).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err }))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
  }
)

const deleteUserPicture = createAsyncAction(
  'DELETE_USER_PICTURE',
  function deletePicture() {
    const url = 'user/profile'
    const body = {
      remove_profile_media: true
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
      return res
    })
  }
)

const restoreOriginalUserPicture = createAsyncAction(
  'RESTORE_ORIGINAL_PICTURE',
  function restorePicture() {
    const url = 'user/profile'
    const body = {
      restore_default_profile_pic: true
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
      console.log('---RESPONSE FROM ACTION', res)
      return res
    })
  }
)

const createUserPicture = createAsyncAction(
  'CREATE_USER_PICTURE',
  function createPicture(fileName) {
    const url = 'user/media'
    return (dispatch) => fetchAPI(url, {
      method: 'POST',
      body: JSON.stringify({ file_name: fileName, is_profile_picture: true, is_cover_photo: false })
    }).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err }))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
  }
)

const CHANGE_USER_METADATA = createAction(
  'CHANGE_USER_METADATA',
  (key, value) => ({ key, value })
)

const SET_AUTH_MODAL = createAction('SET_AUTH_MODAL', (open) => open)
const SET_AUTH_STATE = createAction('SET_AUTH_STATE', (state) => state)
const REPLACE_USER_METADATA = createAction('REPLACE_USER_METADATA', (userMeta) => userMeta)

export default {
  ...authenticateWithCredentials,
  // ...fetchUserProfile,
  // ...fetchusersAppMetadata,
  ...updateUserProfile,
  ...deleteUserPicture,
  ...createUserPicture,
  ...fetchUserMetadata,
  ...fetchusersIDP,
  ...restoreOriginalUserPicture,
  ...likeCampaign,
  ...dislikeCampaign,
  CHANGE_USER_METADATA,
  SET_AUTH_MODAL,
  SET_AUTH_STATE,
  REPLACE_USER_METADATA
}
