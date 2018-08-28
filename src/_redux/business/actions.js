import {
  CREATE_BUSINESS, FETCH_BUSINESS_AUDIENCES, FETCH_BUSINESS_DETAILS,
  FETCH_BUSINESS_LIST, UPDATE_BUSINESS_INFO
} from '../../constants'
import { createAsyncAction, createAction } from '../actions'
import { fetchAPI, updateAPI } from '../../_core/http'
import { ERROR } from '../notification/actions'


/**
 * Should have name, contact_email and in facebook funnel business page url
 * @type {{}|*}
 */

const OPEN_CREATE_AUDIENCE_WINDOW = createAction('OPEN_CREATE_AUDIENCE_WINDOW', (payload) => (payload))

const CLOSE_CREATE_AUDIENCE_WINDOW = createAction('CLOSE_CREATE_AUDIENCE_WINDOW', () => (false))

const OPEN_EDIT_AUDIENCE_WINDOW = createAction('OPEN_EDIT_AUDIENCE_WINDOW', (payload) => (payload))


const createBusiness = createAsyncAction(CREATE_BUSINESS, function(data) {
  const url = 'business'
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
})

const fetchBusinessDetails = createAsyncAction(FETCH_BUSINESS_DETAILS, function(business_id) {
  const url = 'business'
  return (dispatch) => fetchAPI(url, { params: { business_id } })
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

const fetchBusinessAudiences = createAsyncAction(FETCH_BUSINESS_AUDIENCES, function(business_id) {
  const url = 'business/audiences'
  return (dispatch) => fetchAPI(url, { params: { business_id } })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      // console.log('Fetched Audiences: ', res)
      dispatch(this.success({ data: res }))
      return res
    })
})

const createBusinessAudience = createAsyncAction('CREATE_BUSINESS_AUDIENCE', function createNewBusinessAudience(data) {
  // console.log('creating new AUDIENCE! Data is: ', data)
  const url = 'business/audiences'
  return (dispatch) => fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      console.log('creating new AUDIENCE res: ', res)

      dispatch(this.success({ data: res }))
    })
})

const editBusinessAudience = createAsyncAction('EDIT_BUSINESS_AUDIENCE', function editAudience(data) {
  console.log('EDITING AUDIENCE! Data is: ', data)
  const url = 'business/audiences'
  return (dispatch) => fetchAPI(url, { method: 'PUT', body: JSON.stringify(data) })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      console.log('EDITING AUDIENCE res: ', res)

      dispatch(this.success({ data: res }))
    })
})

const deleteBusinessAudience = createAsyncAction(
  'DELETE_BUSINESS_AUDIENCE',
  function deletePayMethod({ businessId, audienceId }) {
    console.log('DELETING AUDIENCE! DATA: ', businessId, audienceId)
    const url = 'business/audiences'
    const body = {
      is_deleted: true,
      business_id: businessId,
      // business_id: 0,
      audience_id: audienceId
    }
    return (dispatch) => fetchAPI(
      url,
      { method: 'DELETE', body: JSON.stringify(body) }
    ).catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err, audienceId }))
      throw err
    }).then((res) => {
      dispatch(this.success({ data: res }))
      console.log('AUDIENCE HAS BEEN DELETED! RES is: ', res)
      return res
    })
  }
)

const fetchBusinessList = createAsyncAction(FETCH_BUSINESS_LIST, function() {
  const url = 'business/list?selection_fields=id,name,profile_media_url,handle,facebook_page_id'
  return (dispatch) => fetchAPI(url, { params: {} })
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

const fetchUserRoleList = createAsyncAction('FETCH_USER_ROLE_LIST', function(business_id) {
  console.log('Here, fetching ROLES! BussID is: ', business_id)
  const url = 'user-role/list'
  return (dispatch) => fetchAPI(url, { params: { business_id } })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      console.log('Fetched userRoleList: ', res)
      dispatch(this.success({ data: res }))
      return res
    })
})

const updateBusinessInfo = createAsyncAction(UPDATE_BUSINESS_INFO, function(business) {
  console.log('Business: ', business)
  const url = 'business'
  return (dispatch) => updateAPI(url, { params: { business_id: business.business_id } }, business)
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
    })
    .then((res) => {
      dispatch(this.success({ data: res }))
      return res
    })
})

/**
 *
 * @data {business_id, file_name}
 */
const createFile = createAsyncAction('CREATE_FILE', function(data) {
  const url = 'business/file'
  return (dispatch) => fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed({ err, file_name: data.file_name }))
      throw err
    })
    .then((res) => {
      dispatch(this.success({ data: res, file_name: data.file_name }))
      return res
    })
})

const deleteFile = createAsyncAction('DELETE_FILE', function(file_id) {
  const url = 'business/file'
  return (dispatch) => updateAPI(url, { method: 'DELETE', params: { file_id } })
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

export default {
  ...fetchBusinessDetails,
  ...fetchBusinessAudiences,
  ...createBusinessAudience,
  ...editBusinessAudience,
  ...deleteBusinessAudience,
  ...fetchBusinessList,
  ...updateBusinessInfo,
  ...createBusiness,
  ...createFile,
  ...deleteFile,
  ...fetchUserRoleList,
  OPEN_CREATE_AUDIENCE_WINDOW,
  CLOSE_CREATE_AUDIENCE_WINDOW,
  OPEN_EDIT_AUDIENCE_WINDOW
}

