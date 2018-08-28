import { handleAction, handleActions } from 'redux-actions'
import { Map } from 'immutable'

const initialState = Map({
  isOpenSettingsModal: false
})
const OPEN_SETTINGS_MODAL = handleAction('OPEN_SETTINGS_MODAL', (state, action) => {
  const isOpen = action.payload
  return state.set('isOpenSettingsModal', isOpen)
}, initialState)

const CLOSE_SETTINGS_MODAL = handleAction('CLOSE_SETTINGS_MODAL', (state, action) => {
  const isOpen = action.payload
  return state.set('isOpenSettingsModal', !isOpen)
}, initialState)

export default handleActions({
  OPEN_SETTINGS_MODAL,
  CLOSE_SETTINGS_MODAL
}, initialState)
