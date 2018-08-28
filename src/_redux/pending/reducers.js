import { handleAction, handleActions } from 'redux-actions'
import { fromJS, Map } from 'immutable'
import { createAsyncHandlers } from '../actions'

const initialState = Map({
  pendings: Map()
})

const FETCH_PENDINGS = createAsyncHandlers('FETCH_PENDINGS', {
  success(state, action) {
    const { data } = action.payload
    return state.set('pendings', fromJS(data))
  }
})

const UPDATE_PENDINGS = createAsyncHandlers('UPDATE_PENDINGS', {
  success(state) {
    return state
  }
})

const CHANGE_PENDINGS = handleAction('CHANGE_PENDINGS', (state, action) => {
  const data = action.payload

  return state.set('pendings', fromJS(data))
}, initialState)

const CLEAR_PENDINGS = handleAction(
  'CLEAR_PENDINGS', (state) =>
    state.set('pendings', Map()),
  initialState
)


export default handleActions({
  ...FETCH_PENDINGS,
  ...UPDATE_PENDINGS,
  CHANGE_PENDINGS,
  CLEAR_PENDINGS
}, initialState)

