import { createAction } from '../actions'

const OPEN_LOGOUT_DIALOGUE = createAction('OPEN_LOGOUT_DIALOGUE', () => (true))
const CLOSE_LOGOUT_DIALOGUE = createAction('CLOSE_LOGOUT_DIALOGUE', () => (false))
const resize = createAction('RESIZE', () => (window.innerWidth))
const TOGGLE_MENU = createAction('TOGGLE_MENU', (open) => (open))

export default {
  OPEN_LOGOUT_DIALOGUE,
  CLOSE_LOGOUT_DIALOGUE,
  resize,
  TOGGLE_MENU
}
