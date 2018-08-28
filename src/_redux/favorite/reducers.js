import { REMOVE_FAVORITE_OFFER, SET_FAVORITE_OFFERS } from '../../constants'

export default (state = {}, action) => {
  switch (action.type) {
  case SET_FAVORITE_OFFERS: {
    const favorites = { ...state }
    favorites[action.payload] = true
    return favorites
  }

  case REMOVE_FAVORITE_OFFER: {
    const favorites = { ...state }
    delete favorites[action.payload]
    return favorites
  }

  default:
    return state
  }
}
