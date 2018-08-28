import { createAsyncAction, createAction } from '../actions'
import { fetchAPI } from '../../_core/http'
import { ERROR } from '../notification/actions'
import { CREATE_PRODUCT, UPDATE_PRODUCT, CREATE_HOSTED_SITE, UPDATE_HOSTED_SITE } from '../../constants'

/**
 * Fetch product list of business
 * @business_id:
 */
const fetchProductList = createAsyncAction('FETCH_PRODUCT_LIST', function(business_id) {
  const url = 'product/list'
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

/**
 * Create new product
 *
 * @data: {business_id, name}
 */
const createProduct = createAsyncAction(CREATE_PRODUCT, function(data) {
  const url = 'product'
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

/**
 * Update product
 * @data: {business_id, product_id, name, ...}
 */
const updateProduct = createAsyncAction(UPDATE_PRODUCT, function(data) {
  const url = 'product'
  return (dispatch) => fetchAPI(url, { method: 'PUT', body: JSON.stringify(data) })
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
 * Get hosted site list of product
 * @product_id
 */
const fetchHostedSiteList = createAsyncAction('FETCH_HOSTED_SITE_LIST', function(product_id) {
  const url = 'hosted/list'
  return (dispatch) => fetchAPI(url, { params: { product_id } })
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
 * Create new host site of product
 *
 * @data: {product_id, name, original_landing_page_url}
 */
const createHostedSite = createAsyncAction(CREATE_HOSTED_SITE, function(data) {
  const url = 'hosted'
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

/**
 * Update host site
 * @data: {product_id, hosted_id}
 */
const updateHostedSite = createAsyncAction(UPDATE_HOSTED_SITE, function(data) {
  const url = 'hosted'
  return (dispatch) => fetchAPI(url, { method: 'PUT', body: JSON.stringify(data) })
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

const updateExistingHostedSite = createAction('UPDATE_EXISTING_HOSTED_SITE', (payload) => (payload))


export default {
  ...fetchProductList,
  ...createProduct,
  ...updateProduct,
  ...fetchHostedSiteList,
  ...createHostedSite,
  ...updateHostedSite,
  updateExistingHostedSite
}
