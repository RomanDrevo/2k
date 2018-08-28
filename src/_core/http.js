import _ from 'lodash'
import queryString from 'querystring'
import { toast } from 'react-toastify'
import { CONFIG } from '../config'
// TODO: rid of code duplication

export const HTTP_INIT = 0
export const HTTP_LOADING = 1
export const HTTP_LOADING_SUCCESSED = 2
export const HTTP_LOADING_FAILED = 3
export const CACHE_SIZE = 1000

let store
let auth

export const initService = (redux, auth0) => {
  store = redux
  auth = auth0
  console.log(store)
}

const messageByCode = {
  request_failed: [
    'Request failed to complete.',
    'This may be caused by bad network conditions.',
    'Check your connection and try again.'
  ].join(' '),
  unexpected: [
    'Impressive... You just uncovered a bug in the system.',
    'You might want to try again or report this issue.'
  ].join(' ')
}

function ServerError(...errs) {
  if (!(this instanceof ServerError)) {
    return new ServerError(...errs)
  }
  const len = errs.length
  this.name = 'ServerError'
  this.message = `${len} error${len > 1 ? 's' : ''} occurred`
  this.errors = errs
  this.children = errs
}

ServerError.fromResponse = (res) => (_.has(res, 'errors')
  ? ServerError(...res.errors)
  : ServerError({ code: 'unexpected', details: messageByCode.unexpected, meta: res })
)

ServerError.prototype = Object.create(Error.prototype)
ServerError.prototype.constructor = ServerError

ServerError.prototype.toFieldErrors = () => _.chain(this.errors)
  .map((fe) => {
    if (fe.code !== 'validation_failed') {
      return {}
    }
    let p = _.get(fe, 'source.pointer', '').replace(/^\//, '').split('/')
    if (p[0] === 'data') {
      p = p.slice(1)
    }
    const keyPath = p.length ? p : '_error'
    return _.set({}, keyPath, fe.details)
  })
  .reduce(_.merge, {})
  .value()

function unpackAPIObject(obj, included) {
  const rels = {}
  const iter = (e) => {
    const rel = _.get(included, `${e.type}:${e.id}`)
    return rel ? unpackAPIObject(_.get(included, `${e.type}:${e.id}`), included) : e
  }
  _.forEach(_.get(obj, 'relationships'), (es, k) => {
    const data = _.get(es, 'data')
    if (_.isArray(data)) {
      rels[k] = _.map(data, iter)
    } else {
      rels[k] = iter(data)
    }
  })
  return {
    ...obj.attributes,
    id: obj.id,
    type: obj.type,
    $relationships: rels,
    $original: obj
  }
}

function unpackAPIArray(arr, included) {
  return _.map(arr, (e) => unpackAPIObject(e, included))
}

export function unpackAPI(obj) {
  if (!obj) {
    return obj
  }
  const { data, included, ...rest } = obj || {}
  const includeMap = _.keyBy(included || [], (e) => `${e.type}:${e.id}`)

  if (!data) {
    return obj
  }

  let out

  if (_.isArray(data)) {
    out = unpackAPIArray(data, includeMap)
  } else {
    out = unpackAPIObject(data, includeMap)
  }

  return { ...rest, data: out }
}

const API_BASE = process.env.API_BASE || CONFIG.apiUrl

// eslint-disable-next-line
export let makeURL = _.identity

makeURL = (pathname, params) => {
  // const queryString = require('querystring')

  const endpoint = pathname.indexOf('http') === 0 ? pathname : `${API_BASE}/${pathname}`
  return `${endpoint}${!_.isEmpty(params) ? `?${queryString.stringify(params)}` : ''}`
}

const checkRefreshToken = (data) => {
  // console.log('>>>> FETCH', data)
  if (!!data && data.should_renew_token) {
    return auth.refreshToken()
      .then(() => (Promise.resolve(data)))
  }
  return Promise.resolve(data)
}

const handleBadResponse = (res) => {
  if (res.status === 400) {
    return res.json()
      .then((data) => {
        const { errors } = data
        if (errors) {
          toast.error(errors.map((err) => err.original_message).join('#'), { autoClose: 10000, position: 'top-right' })
        }
        return Promise.reject(res)
      })
  }
  if (res.status < 200 || res.status >= 300) {
    return Promise.reject(res)
  }
  return res
}


export function fetchAPI(pathname, options = {}, includeCredential = true) {
  let accessToken = null
  try {
    accessToken = auth.getAccessToken()
  } catch (err) {
    console.warn(err)
  }
  let opts

  if (includeCredential) {
    opts = {
      // credentials: 'include',
      headers:
        Object.assign({
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
          // Accept: 'application/json',
          // 'Content-Type': 'application/json'
        }, (accessToken ? { Authorization: `Bearer ${accessToken}` } : {})),
      ...options
    }
  }

  // console.log('======> fetchAPI', makeURL(pathname, options.params), opts)
  return fetch(makeURL(pathname, options.params), opts)
    .catch((err) => {
      toast.error(err)
      const code = 'request_failed'
      return Promise.reject(ServerError({ code, details: messageByCode[code] }))
    })
    .then(handleBadResponse)
    .catch((res) => {
      if (res instanceof ServerError) {
        return Promise.reject(res)
      }
      return res.json()
        .catch(() => {
          const code = 'unexpected'
          return Promise.reject(ServerError({
            status: res.status, code, details: messageByCode[code]
          }))
        })
        .then((e) => Promise.reject(ServerError.fromResponse(e)))
    })
    .then((res) => {
      if (res.status === 204) {
        return null
      }
      return res.json()
    })
    .then((body) => body)
    .then(checkRefreshToken)
}

export function updateAPI(pathname, options, data) {
  let accessToken = null
  try {
    accessToken = auth.getAccessToken()
  } catch (err) {
    console.warn(err)
  }
  const opts = {
    headers:
      Object.assign({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }, (accessToken ? { Authorization: `Bearer ${accessToken}` } : {})),
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }

  return fetch(makeURL(pathname, options.params), opts)
    .catch((err) => {
      toast.error(err)
      const code = 'request_failed'
      return Promise.reject(ServerError({ code, details: messageByCode[code] }))
    })
    .then(handleBadResponse)
    .catch((res) => {
      if (res instanceof ServerError) {
        return Promise.reject(res)
      }
      return res.json()
        .catch(() => {
          const code = 'unexpected'
          return Promise.reject(ServerError({
            status: res.status, code, details: messageByCode[code]
          }))
        })
        .then((e) => Promise.reject(ServerError.fromResponse(e)))
    })
    .then((res) => {
      if (res.status === 204) {
        return null
      }
      return res.json()
    })
    .then((body) => body)
    .then(checkRefreshToken)
}

