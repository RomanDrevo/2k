import { createAction, createAsyncAction } from '../actions'
import { fetchAPI } from '../../_core/http'
import { ERROR } from '../notification/actions'

export const MEDIA_ACTION_FAILED_STATUS = {
  uploading_once_failed: 1,
  uploading_more_failed: 2,
  deleting_failed: 3,
  updating_faield: 4
}

export const MEDIA_ACTION_STATUS = {
  creating: 1,
  uploading: 2,
  deleting: 3,
  updating: 4
}

export const MEDIA_FROM = {
  mine: 1,
  hosted: 2,
  web: 3
}

/**
 * Add local temp media
 * @media: {id, url}
 */
const ADD_MEDIA = createAction('ADD_MEDIA', (media, from) => ({ media, from }))
const REMOVE_MEDIA = createAction('REMOVE_MEDIA', (media_id, from) => ({ media_id, from }))
const CHANGE_MEDIA = createAction('CHANGE_MEDIA', (media, from) => ({ media, from }))
const CHANGE_MEDIA_ACTION_STATUS =
  createAction('CHANGE_MEDIA_ACTION_STATUS', (payload) => payload)

const PIXABAY_KEY = '7146406-234c895c07f5116585e402c09'

/**
 *
 * @data {business_id, hosted_site_id}
 */
const fetchMediaList = createAsyncAction('FETCH_MEDIA_LIST', function(params) {
  const url = 'media/list'
  return (dispatch) => fetchAPI(url, { params })
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

/**
 * Create new media
 * @data {business_id, file_name}
 * @clientId media preview temp id
 */
const createMedia = createAsyncAction('CREATE_MEDIA', function(data, clientId, from) {
  const url = 'media'
  return (dispatch) => {
    dispatch(CHANGE_MEDIA_ACTION_STATUS({ media_id: clientId, status: MEDIA_ACTION_STATUS.creating, from }))
    return fetchAPI(url, { method: 'POST', body: JSON.stringify(data) })
      .catch((err) => {
        dispatch(ERROR(...err.errors))
        dispatch(this.failed({ err, clientId, from }))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res, clientId, from }))
        return res
      })
  }
})

/**
 * Update existing media
 * @media_id
 * @data {business_id, file_name}
 */
const updateMedia = createAsyncAction('UPDATE_MEDIA', function(media_id, data, from) {
  const url = 'media'
  return (dispatch) => {
    dispatch(CHANGE_MEDIA_ACTION_STATUS({ media_id, status: MEDIA_ACTION_STATUS.updating, from }))
    return fetchAPI(url, { method: 'PUT', params: { media_id }, body: JSON.stringify({ ...data, media_id }) })
      .catch((err) => {
        dispatch(ERROR(...err.errors))
        dispatch(this.failed({ err, clientId: media_id, from }))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res, clientId: media_id, from }))
        return res
      })
  }
})

/**
 * Delete media
 * @media_id
 */
const deleteMedia = createAsyncAction('DELETE_MEDIA', function(media_id, from) {
  const url = 'media'
  return (dispatch) => {
    dispatch(CHANGE_MEDIA_ACTION_STATUS({ media_id, status: MEDIA_ACTION_STATUS.deleting, from }))
    return fetchAPI(url, { method: 'DELETE', params: { media_id } })
      .catch((err) => {
        dispatch(ERROR(...err.errors))
        dispatch(this.failed({ err, media_id, from }))
        throw err
      })
      .then((res) => {
        dispatch(this.success({ data: res, media_id, from }))
        return res
      })
  }
})

const SELECT_MEDIA = createAction('SELECT_MEDIA', (media) => media)

/**
 * Search images from pixabay.com
 * @params {q, page}
 */
const searchWebMedias = createAsyncAction('SEARCH_WEB_MEDIAS', function(params) {
  const url = 'https://pixabay.com/api/'
  return (dispatch) => fetchAPI(url, { method: 'GET', params: { ...params, key: PIXABAY_KEY } }, false)
    .catch((err) => {
      dispatch(ERROR(...err.errors))
      dispatch(this.failed(err))
      throw err
    })
    .then((res) => {
      dispatch(this.success({ data: res, page: params.page }))
      return res
    })
})

const OPEN_MEDIA_MODAL = createAction('OPEN_MEDIA_MODAL', (open) => open)

export default {
  ...fetchMediaList,
  ...createMedia,
  ...updateMedia,
  ...deleteMedia,
  ...searchWebMedias,
  SELECT_MEDIA,
  ADD_MEDIA,
  REMOVE_MEDIA,
  CHANGE_MEDIA,
  CHANGE_MEDIA_ACTION_STATUS,
  OPEN_MEDIA_MODAL
}
