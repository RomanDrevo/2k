
import { createAction } from '../actions'


const OPEN_SETTINGS_MODAL = createAction('OPEN_SETTINGS_MODAL', (isOpen) => isOpen)
const CLOSE_SETTINGS_MODAL = createAction('CLOSE_SETTINGS_MODAL', (isOpen) => !isOpen)

export default {
  OPEN_SETTINGS_MODAL,
  CLOSE_SETTINGS_MODAL
}

