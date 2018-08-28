import { fromJS, List, Map } from 'immutable'
import { handleActions, handleAction } from 'redux-actions'
import {
  CREATE_BUSINESS,
  FETCH_BUSINESS_AUDIENCES,
  FETCH_BUSINESS_DETAILS,
  FETCH_BUSINESS_LIST,
  UPDATE_BUSINESS_INFO
} from '../../constants'
import { createAsyncHandlers } from '../actions'
import { saveHistory } from '../../_core/utils'

const initialState = Map({
  audience: Map(),
  businessDetails: Map().set('business', {}),
  businessList: Map(),
  userRoleList: Map(),
  businessAudiences: List(),
  currentBusinessId: 0,
  isCreateNewAudienceWindowOpen: false,
  isEditAudienceWindowOpen: false,
  backupAudiences: {}
})

const OPEN_EDIT_AUDIENCE_WINDOW = handleAction('OPEN_EDIT_AUDIENCE_WINDOW', (state, action) => {
  const selectedAudience = state.get('audience').toJS()
  if ((selectedAudience && selectedAudience.id === action.payload) || !action.payload) {
    return state.set('audience', Map())
  }
  const audiences = state.get('businessAudiences').toJS()
  console.log('AUDIENCES', audiences, action.payload)
  const audience = audiences.find((item) => item.id === action.payload)
  return state.set('audience', fromJS(audience))
}, initialState)

const OPEN_CREATE_AUDIENCE_WINDOW = handleAction('OPEN_CREATE_AUDIENCE_WINDOW', (state) => (
  state.set('isCreateNewAudienceWindowOpen', true)
), initialState)

const CLOSE_CREATE_AUDIENCE_WINDOW = handleAction('CLOSE_CREATE_AUDIENCE_WINDOW', (state) => (
  state.set('isCreateNewAudienceWindowOpen', false)
), initialState)

const createBusiness = createAsyncHandlers(CREATE_BUSINESS, {
  success(state, action) {
    const { data } = action.payload
    const businessList = {
      ...state.get('businessList').toJS()
    }
    // console.log(businessList, data.business)
    businessList[data.business.id] = {
      id: data.business.id,
      name: data.business.name,
      logo: data.business.profile_media_url,
      handle: data.business.handle,
      fbId: data.business.facebook_page_id
    }
    return state
      // .set('businessDetails', fromJS(data))
      .set('businessList', fromJS(businessList))
  }
})

const fetchBusinessDetails = createAsyncHandlers(FETCH_BUSINESS_DETAILS, {
  success(state, action) {
    const { data } = action.payload
    const owner = state.getIn(['businessList', `${data.business.id}`])
    if (owner) {
      saveHistory(`/business/${data.business.handle || data.business.id}`)
    }
    return state.set('businessDetails', fromJS(data))
      .set('currentBusinessId', data.business.id)
      .set('loading', false)
  },
  request(state) {
    return state.set('loading', true)
  },
  failed(state, action) {
    const { data } = action.payload
    console.log('Business REDUX: ', data)
    return state.set('loading', false)
  }
})
const fetchBusinessAudiences = createAsyncHandlers(FETCH_BUSINESS_AUDIENCES, {
  success(state, action) {
    const { data } = action.payload
    return state.set('businessAudiences', fromJS(data))
      .set('loading', false)
  },
  request(state) {
    return state.set('loading', true)
  },
  failed(state) {
    return state.set('loading', false)
  }
})

const createBusinessAudience = createAsyncHandlers('CREATE_BUSINESS_AUDIENCE', {
  success(state, action) {
    const { data } = action.payload
    const businessAudiences = state.get('businessAudiences').toJS()
    // console.log(paymentMethodsList, data.payment_method)
    businessAudiences.push(data)
    return state.set('businessAudiences', fromJS(businessAudiences))
      .set('loading', false)
  }
  // request(state) {
  //   return state.set('loading', true)
  // },
  // failed(state) {
  //   return state.set('loading', false)
  // }
})

const editBusinessAudience = createAsyncHandlers('EDIT_BUSINESS_AUDIENCE', {
  success(state, action) {
    console.log('DATA from REDUX: ', action)
    const { data } = action.payload
    const businessAudiences = state.get('businessAudiences').toJS()
      .map((audience) => (audience.id === data.id ? data : audience))
    return state.set('businessAudiences', fromJS(businessAudiences))
      .set('loading', false)
  }
  // request(state) {
  //   return state.set('loading', true)
  // },
  // failed(state) {
  //   return state.set('loading', false)
  // }
})

const deleteBusinessAudience = createAsyncHandlers('DELETE_BUSINESS_AUDIENCE', {
  success(state, { payload: { data: { audience_id } } }) {
    const backupAudiences = state.get('backupAudiences')
    console.log('SUCESS', audience_id)
    delete backupAudiences[audience_id]
    return state.set('backupAudiences', backupAudiences)
  },
  failed(state, { payload: { audienceId } }) {
    const backupAudiences = state.get('backupAudiences')
    const businessAudiences = state.get('businessAudiences').toJS()
    businessAudiences.push(backupAudiences[audienceId])
    delete backupAudiences[audienceId]
    console.log('ERRORR: ', audienceId)
    return state
      .set('backupAudiences', backupAudiences)
      .set('businessAudiences', fromJS(businessAudiences.sort((a, b) => {
        if (a.id > b.id) {
          return 1
        } else if (a.id < b.id) {
          return -1
        }
        return 0
      })))
  },
  request(state, action) {
    console.log('DATA TO SERVER: ', action)
    const { businesId, audienceId } = action.payload
    console.log('Bus ID, AU ID: ', businesId, audienceId)
    const businessAudiences = []
    const backupAudiences = state.get('backupAudiences')
    state.get('businessAudiences').toJS()
      .forEach((item) => {
        if (item.id === audienceId) {
          backupAudiences[audienceId] = item
        } else {
          businessAudiences.push(item)
        }
      })
    return state.set('businessAudiences', fromJS(businessAudiences))
      .set('backupAudiences', backupAudiences)
  }
})

const fetchBusinessList = createAsyncHandlers(FETCH_BUSINESS_LIST, {
  request(state) {
    return state.set('listLoading', true)
  },
  success(state, action) {
    const { data } = action.payload
    const businessList = {}
    data.owner.forEach((b) => {
      businessList[b.id] = {
        id: b.id,
        name: b.name,
        logo: b.profile_media_url,
        handle: b.handle,
        internal_business_name: b.internal_business_name,
        fbId: b.facebook_page_id
      }
    })
    return state.set('businessList', fromJS(businessList)).set('listLoading', false)
  },
  failed(state) {
    return state.set('listLoading', false)
  }
})

const fetchUserRoleList = createAsyncHandlers('FETCH_USER_ROLE_LIST', {
  request(state) {
    return state.set('userRoleListLoading', true)
  },
  success(state, action) {
    const { data } = action.payload
    console.log('SUCCESS DATA from REDUXX :', data)
    return state.set('userRoleList', fromJS(data)).set('userRoleListLoading', false)
  },
  failed(state, action) {
    console.log('SUCCESS DATA from REDUXX :', action.payload)
    return state.set('userRoleListLoading', false)
  }
})

const updateBusinessInfo = createAsyncHandlers(UPDATE_BUSINESS_INFO, {
  success(state, action) {
    console.log('ActionSuccess: ', action)
    const { data = {} } = action.payload
    const businessList = state.get('businessList').set(data.business.id, {
      id: data.business.id,
      name: data.business.name,
      logo: data.business.profile_media_url,
      handle: data.business.handle,
      internal_business_name: data.business.internal_business_name,
      fbId: data.business.facebook_page_id
    })
    return state.set('businessDetails', fromJS(data)).set('businessList', businessList)
  },
  failed(state, action) {
    console.log('ActionFailed: ', action)
  }
})

const createFile = createAsyncHandlers('CREATE_FILE', {
  success(state, action) {
    const { data } = action.payload
    console.log('REDUX DATA: ', data)
    return state.set('createdFile', fromJS(data))
  }
})

const deleteFile = createAsyncHandlers('DELETE_FILE', {
  success(state, action) {
    const { data } = action.payload
    return state.set('deletedFile', fromJS(data.file_deleted))
  }
})

const CLEAR_AUDIENCES = handleAction(
  'CLEAR_AUDIENCES', (state) =>
    state.set('businessAudiences', List()),
  initialState
)

const SET_AUTH_MODAL = handleAction('SET_AUTH_MODAL', (state, action) => (action.payload ?
  state.withMutations((map) => {
    map.set('audience', Map())
    map.set('businessList', Map())
    map.set('userRoleList', Map())
    map.set('businessAudiences', Map())
  }) : state), initialState)


export default handleActions({
  ...fetchBusinessDetails,
  ...fetchBusinessAudiences,
  ...fetchBusinessList,
  ...updateBusinessInfo,
  ...createBusiness,
  ...createFile,
  ...deleteFile,
  ...createBusinessAudience,
  ...editBusinessAudience,
  ...deleteBusinessAudience,
  ...fetchUserRoleList,
  OPEN_CREATE_AUDIENCE_WINDOW,
  CLOSE_CREATE_AUDIENCE_WINDOW,
  OPEN_EDIT_AUDIENCE_WINDOW,
  CLEAR_AUDIENCES,
  SET_AUTH_MODAL
}, initialState)
