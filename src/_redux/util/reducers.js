import { Map } from 'immutable'
import { handleAction, handleActions } from 'redux-actions'

const initialState = Map({
  isLogoutDialogueOpen: false,
  isMobile: window.innerWidth <= 550,
  windowWidth: window.innerWidth,
  isMenuVisible: false
})

const OPEN_LOGOUT_DIALOGUE = handleAction('OPEN_LOGOUT_DIALOGUE', (state) => (
  state.set('isLogoutDialogueOpen', true)
), initialState)

const CLOSE_LOGOUT_DIALOGUE = handleAction('CLOSE_LOGOUT_DIALOGUE', (state) => (
  state.set('isLogoutDialogueOpen', false)
), initialState)

const RESIZE = handleAction('RESIZE', (state, action) => (
  state.set('isMobile', action.payload <= 550).set('windowWidth', window.innerWidth)
), initialState)

const TOGGLE_MENU = handleAction('TOGGLE_MENU', (state, action) => (
  state.set('isMenuVisible', action.payload)
), initialState)

export default handleActions({
  OPEN_LOGOUT_DIALOGUE,
  CLOSE_LOGOUT_DIALOGUE,
  RESIZE,
  TOGGLE_MENU
}, initialState)
