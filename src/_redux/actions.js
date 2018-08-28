import * as ra from 'redux-actions'
import { Map, Set } from 'immutable'

export const { createAction } = ra

// const LOADING_START = createAction('async/LOADING_START')
// const LOADING_END = createAction('async/LOADING_END')

export function createAsyncAction(name, worker) {
  const success = `${name}_SUCCESS`
  const fail = `${name}_FAIL`

  const request = createAction(`${name}_REQUEST`)

  const stages = {
    success: createAction(success),
    failed: createAction(fail)
  }

  return {
    [request]: request,
    [success]: stages.success,
    [fail]: stages.failed,
    /* eslint-disable */
    [name]: function() {
      const args = new Array(arguments.length)
      for (var i = 0; i < args.length; ++i) {
        args[i] = arguments[i]
      }
      return (dispatch, getState) => {
        dispatch(request(args[0]))
        // dispatch(LOADING_START(name))
        return Promise.resolve(worker.apply(stages, args)(dispatch))
          .catch(function() {
            // dispatch(LOADING_END(name))
            return Promise.reject.apply(Promise, arguments)
          })
          .then(function() {
            // dispatch(LOADING_END(name))
            // console.log(getState())
            return Promise.resolve.apply(Promise, arguments)
          })
      }
    }
    /* eslint-enable */
  }
}

export function createAsyncHandlers(name, { request, failed, success }) {
  return {
    [`${name}_REQUEST`]: (state, action) => {
      let next = state
        .set('errors', state.get('errors', Map()).remove(name))
      if (request) {
        next = request(next, action)
      }
      return next
    },
    [`${name}_FAIL`]: (state, action) => {
      let next = state
        .set('errors', state.get('errors', Map()).set(name, action.payload))
      if (failed) {
        next = failed(next, action)
      }
      return next
    },
    [`${name}_SUCCESS`]: (state, action) => {
      let next = state
        .set('errors', state.get('errors', Map()).remove(name))
      if (success) {
        next = success(next, action)
      }
      return next
    }
  }
}

export const loadingReducer = ra.handleActions({
  'async/LOADING_START': (state, action) => state.add(action.payload),
  'async/LOADING_END': (state, action) => state.remove(action.payload)
}, Set())


export const STATE_STATUS = {
  INIT: 0,
  LOADING: 1,
  LOADING_SUCCESSED: 2,
  LOADING_FAILED: 1
}
