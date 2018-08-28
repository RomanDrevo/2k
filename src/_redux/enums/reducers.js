import { fromJS, Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { createAsyncHandlers } from '../actions'
import {
  FETCH_DB_ENUMS
} from '../../constants/index'

const initialState = Map({
  enums: Map().set('enums', {})
})

const fetchDBEnums = createAsyncHandlers(FETCH_DB_ENUMS, {
  success(state, action) {
    const { data } = action.payload
    const banks = {}
    data.banks.forEach((bank) => {
      banks[bank.id] = { ...bank, value: bank.id, label: bank.bank_local_name }
    })
    data.banks = banks
    return state.set('enums', fromJS(data))
  }
})


export default handleActions({
  ...fetchDBEnums
}, initialState)

