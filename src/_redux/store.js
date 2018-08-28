import { applyMiddleware, compose, createStore } from 'redux'
import promise from 'redux-promise'
// import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import rootReducer from '.'
import businessMiddleware from './business/middleware'

export default (history, initialState = {}) => {
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  /* eslint-enable no-underscore-dangle */

  /*
  const middlewares = [
    applyMiddleware(...[thunk, promise, businessMiddleware, routerMiddleware(history)])
  ]
*/
  const middlewares = [
    applyMiddleware(...[thunk, promise, businessMiddleware])
  ]

  const store = createStore(rootReducer, initialState, composeEnhancers(...middlewares))

  window.store = store
  return store
}
