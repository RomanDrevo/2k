import { handleActions, handleAction } from 'redux-actions'
import { fromJS, Map } from 'immutable'
import { createAsyncHandlers } from '../actions'

const initialState = Map({
  products: Map(), // current product list
  sites: Map() // current hosted site list
})

const fetchProductList = createAsyncHandlers('FETCH_PRODUCT_LIST', {
  success(state, action) {
    const { data } = action.payload
    const products = {}
    data.items.forEach((product) => {
      products[product.id] = product
    })
    return state.set('products', fromJS(products))
    // return state.withMutations((map) => {
    //   map.set('products', map.get('products').withMutations((es) => {
    //     _.each(data.items, (p) => {
    //       es.set(p.id, fromJS(p))
    //     })
    //   }))
    // })
  }
})


const createProduct = createAsyncHandlers('CREATE_PRODUCT', {
  success(state, action) {
    const { data } = action.payload
    const products = state.get('products').toJS()
    products[data.product.id] = data.product
    return state.set('products', fromJS(products))
    // return state.withMutations((map) => {
    //   map.set('products', map.get('products').set(data.product.id, fromJS(data.product)))
    // })
  }
})

const updateProduct = createAsyncHandlers('UPDATE_PRODUCT', {
  success(state, action) {
    const { data } = action.payload
    const products = state.get('products').toJS()
    products[data.product.id] = data.product
    return state.set('products', fromJS(products))
    // return state.withMutations((map) => {
    //   map.set('products', map.get('products').set(data.product.id, fromJS(data.product)))
    // })
  }
})


const fetchHostedSiteList = createAsyncHandlers('FETCH_HOSTED_SITE_LIST', {
  success(state, action) {
    const { data } = action.payload
    const sites = {}
    data.items.forEach((site) => {
      if (site.is_duplication_ready) {
        sites[site.id] = site
      }
    })
    return state.set('sites', fromJS(sites))

    // return state.withMutations((map) => {
    //   map.set('sites', map.get('sites').withMutations((es) => {
    //     _.each(data.items, (s) => {
    //       if (s.is_duplication_ready) {
    //         es.set(s.id, fromJS(s))
    //       }
    //     })
    //   }))
    // })
  }
})

const createHostedSite = createAsyncHandlers('CREATE_HOSTED_SITE', {
  success(state, action) {
    const { data } = action.payload
    const { hosted_site } = data
    return hosted_site && hosted_site.is_duplication_ready ? state.withMutations((map) => {
      map.set('sites', map.get('sites').set(data.hosted_site.id, fromJS(data.hosted_site)))
    }) : state
  }
})

const updateHostedSite = createAsyncHandlers('UPDATE_HOSTED_SITE', {
  success(state, action) {
    const { data } = action.payload
    return state.withMutations((map) => {
      map.set('sites', map.get('sites').set(data.hosted_site.id, fromJS(data.hosted_site)))
    })
  }
})

const UPDATE_EXISTING_HOSTED_SITE = handleAction('UPDATE_EXISTING_HOSTED_SITE', (state, action) => (
  state.withMutations((map) => {
    map.set('sites', map.get('sites').set(action.payload.id, fromJS(action.payload)))
  })
), initialState)

export default handleActions({
  ...fetchProductList,
  ...createProduct,
  ...updateProduct,
  ...fetchHostedSiteList,
  ...createHostedSite,
  ...updateHostedSite,
  UPDATE_EXISTING_HOSTED_SITE
}, initialState)
