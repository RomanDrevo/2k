import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {LOCATION_CHANGE} from 'react-router-redux'

const initialState = Immutable.Map({
  path: ''
})

export default handleActions({
  [LOCATION_CHANGE]: (state, action) => {
    var path = action.payload.pathname

    return state.withMutations(map => {
      map.set('path', path)
    })
  }
}, initialState)
