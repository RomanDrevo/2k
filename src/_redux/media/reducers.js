import _ from 'lodash'
import { handleAction, handleActions } from 'redux-actions'
import { fromJS, Map, OrderedMap } from 'immutable'
import { createAsyncHandlers } from '../actions'
import { MEDIA_ACTION_FAILED_STATUS, MEDIA_ACTION_STATUS, MEDIA_FROM } from './actions'

const init = {
  medias: OrderedMap(),
  web_media_page: MEDIA_FROM.mine,
  open: false
}

init[MEDIA_FROM.mine] = OrderedMap()
init[MEDIA_FROM.hosted] = OrderedMap()
init[MEDIA_FROM.web] = OrderedMap()

const initialState = Map(init)

const orderById = (source) => [...source].filter((media) => !media.is_deleted)
  .sort((a, b) => {
    if (a.id > b.id) {
      return 1
    } else if (a.id < b.id) {
      return -1
    }
    return 0
  }).reduce((accumulator, currentValue) => {
    const result = accumulator
    result[currentValue.id] = currentValue
    return result
  }, {})

const fetchMediaList = createAsyncHandlers('FETCH_MEDIA_LIST', {
  success(state, action) {
    const { data } = action.payload
    const { my_lib, from_hosted } = data
    return state.withMutations((map) => {
      map.set(`${MEDIA_FROM.mine}`, fromJS(orderById(my_lib)))
      map.set(`${MEDIA_FROM.hosted}`, fromJS(orderById(from_hosted)))
      /*
      map.set('medias', map.get('medias').withMutations((es) => {
        _.each(data.my_lib, (m) => {
          es.set(m.id, fromJS({ ...m, from: MEDIA_FROM.mine }))
        })

        _.each(data.from_hosted, (m) => {
          es.set(m.id, fromJS({ ...m, from: MEDIA_FROM.hosted }))
        })
      }))
    */
    })
  }
})

const searchWebMedias = createAsyncHandlers('SEARCH_WEB_MEDIAS', {
  success(state, action) {
    const { data, page } = action.payload
    console.log(data, page)
    return state.withMutations((map) => {
      if (page === 1) {
        // const medias = map.get(`${MEDIA_FROM.web}`).toList().toJS().filter((m) => m.from === MEDIA_FROM.web)
        const medias = map.get(`${MEDIA_FROM.web}`)
        map.set(`${MEDIA_FROM.web}`, map.get(`${MEDIA_FROM.web}`).withMutations((ms) => {
          // medias.forEach((m) => ms.delete(m.id))
          medias.forEach((m) => ms.delete(m.get('id')))
        }))
      }
      map.set(`${MEDIA_FROM.web}`, map.get(`${MEDIA_FROM.web}`).withMutations((es) => {
        _.each(data.hits, (m) => {
          const media = {
            id: `web-${m.id}`,
            url: m.webformatURL,
            width: m.imageWidth,
            height: m.imageHeight,
            from: MEDIA_FROM.web
          }
          es.set(media.id, fromJS(media))
        })
      }))
      map.set('web_media_page', (page || map.get('web_media_page')) + 1)
    })
  }
})

const createMedia = createAsyncHandlers('CREATE_MEDIA', {
  success(state, action) {
    const { data, clientId, from } = action.payload
    return state.withMutations((map) => {
      const media = (map.getIn([`${from}`, `${clientId}`]) || fromJS({})).toJS()
      media.id = data.media.id
      media.isTemporary = false
      media.status = MEDIA_ACTION_STATUS.uploading
      map.set(`${from}`, map.get(`${from}`).delete(`${clientId}`).set(`${data.media.id}`, fromJS(media)))
    })
  },
  failed(state, action) {
    const { clientId, from } = action.payload

    return state.withMutations((map) => {
      let media = map.getIn([`${from}`, `${clientId}`])
      if (media) {
        media = media.toJS()
        media.failed_status = media.failed_status === MEDIA_ACTION_FAILED_STATUS.uploading_once_failed
          ? MEDIA_ACTION_FAILED_STATUS.uploading_more_failed : MEDIA_ACTION_FAILED_STATUS.uploading_once_failed
        media.status = null
        map.set(`${from}`, map.get(`${from}`).set(`${clientId}`, fromJS(media)))
      }
    })
  }
})

const updateMedia = createAsyncHandlers('UPDATE_MEDIA', {
  success(state, action) {
    const { data, from } = action.payload
    return state.withMutations((map) => {
      // const media = map.get(`${from}`).get(clientId)
      // data.media.from = media.get('from')
      data.media.url = data.media.url || data.media.twokey_url || data.media.web_url
      map.set(`${from}`, map.get(`${from}`).set(`${data.media.id}`, fromJS(data.media)))
    })
  },
  failed(state, action) {
    const { clientId, from } = action.payload

    return state.withMutations((map) => {
      let media = map.get(`${from}`).get(`${clientId}`)
      if (media) {
        media = media.toJS()
        media.failed_status = MEDIA_ACTION_FAILED_STATUS.updating_faield
        media.status = null
        map.set(`${from}`, map.get(`${from}`).set(`${clientId}`, fromJS(media)))
      }
    })
  }
})

const deleteMedia = createAsyncHandlers('DELETE_MEDIA', {
  success(state, action) {
    const { media_id, from } = action.payload
    return state.withMutations((map) => {
      map.set(`${from}`, map.get(`${from}`).delete(`${media_id}`))
    })
  },
  failed(state, action) {
    const { media_id, from } = action.payload

    return state.withMutations((map) => {
      let media = map.get(`${from}`).get(`${media_id}`)
      if (media) {
        media = media.toJS()
        media.failed_status = MEDIA_ACTION_FAILED_STATUS.deleting_failed
        media.status = null
        map.set(`${from}`, map.get(`${from}`).set(`${media_id}`, fromJS(media)))
      }
    })
  }
})

const SELECT_MEDIA = handleAction('SELECT_MEDIA', (state, action) => {
  const media = action.payload
  return state.set('media', media ? fromJS(media) : null)
}, initialState)

const ADD_MEDIA = handleAction('ADD_MEDIA', (state, action) => {
  const { media, from } = action.payload
  return state.setIn([`${from}`, `${media.id}`], fromJS(media))
  // return state.withMutations((map) => {
  //   map.set(`${from}`, map.get(`${from}`).set(`${media.id}`, fromJS(media)))
  /*
    if (!map.get(`${from}`).get(`${media.id}`)) {
      media.isTemporary = true
      // media.from = MEDIA_FROM.mine
      map.setIn([`${from}`, media.id], media)
      console.log('SETIN')
    }
  */
  // })
}, initialState)

const REMOVE_MEDIA = handleAction('REMOVE_MEDIA', (state, action) => {
  const { media_id, from } = action.payload
  return state.withMutations((map) => {
    map.set(`${from}`, map.get(`${from}`).delete(media_id))
  })
}, initialState)


const CHANGE_MEDIA_ACTION_STATUS = handleAction('CHANGE_MEDIA_ACTION_STATUS', (state, action) => {
  const { media_id, status, from } = action.payload

  return state.withMutations((map) => {
    let media = map.get(`${from}`).get(`${media_id}`)
    if (media) {
      media = media.toJS()
      media.status = status
      map.set(`${from}`, map.get(`${from}`).set(`${media_id}`, fromJS(media)))
    }
  })
}, initialState)

const CHANGE_MEDIA = handleAction('CHANGE_MEDIA', (state, action) => {
  const { media, from } = action.payload
  console.log(media)
  return state.setIn([`${from}`, `${media.id}`], fromJS(media))
  // return state.withMutations((map) => {
  //   if (media && media.id) {
  //     if (map.getIn([`${from}`, `${media.id}`])) {
  //       map.set(`${from}`, map.get(`${from}`).set(media.id, fromJS(media)))
  //     }
  //   }
  // })
}, initialState)

const CLEAR_MEDIAS = handleAction(
  'CLEAR_MEDIAS', (state) => {
    console.log('CLEAR_MEDIAS')
    return state
      .set('medias', OrderedMap())
      .set(`${MEDIA_FROM.mine}`, OrderedMap())
      .set(`${MEDIA_FROM.hosted}`, OrderedMap())
      .set(`${MEDIA_FROM.web}`, OrderedMap())
  },
  initialState
)

const OPEN_MEDIA_MODAL = handleAction(
  'OPEN_MEDIA_MODAL',
  (state, action) => state.set('open', action.payload),
  initialState
)

export default handleActions({
  ...fetchMediaList,
  ...createMedia,
  ...updateMedia,
  ...deleteMedia,
  ...searchWebMedias,
  SELECT_MEDIA,
  ADD_MEDIA,
  REMOVE_MEDIA,
  CHANGE_MEDIA,
  CHANGE_MEDIA_ACTION_STATUS,
  CLEAR_MEDIAS,
  OPEN_MEDIA_MODAL
}, initialState)
