import { REMOVE_FAVORITE_OFFER, SET_FAVORITE_OFFERS } from '../../constants'

export const favoriteOffer = (offerId) =>
  // todo refactor this -> it's just a placeholder
  ({
    type: SET_FAVORITE_OFFERS,
    payload: offerId
  })


export const removeFavoriteOffer = (offerId) =>
  // todo refactor this -> it's just a placeholder
  ({
    type: REMOVE_FAVORITE_OFFER,
    payload: offerId
  })


export default {
  favoriteOffer,
  removeFavoriteOffer
}
