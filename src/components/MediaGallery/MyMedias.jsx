import _ from 'lodash'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { injectIntl, FormattedMessage } from 'react-intl'
// import ImageCompressor from 'image-compressor.js'
import PropTypes from 'prop-types'
import React from 'react'

import { ClipImg, IconButton, ThumbnailView, VideoPreview } from '../_common'
import { MEDIA_ACTION_FAILED_STATUS, MEDIA_ACTION_STATUS, MEDIA_FROM, MediaActions } from '../../_redux'
import { uploadFile } from '../../_core/upload-file'


const FILE_ACCEPT = 'image/jpeg, image/png, image/gif, .mp4, .avi, .mpg'

class MyMedias extends React.Component {
  static propTypes = {
    business_id: PropTypes.number,
    media: PropTypes.object,
    intl: PropTypes.object,
    medias: PropTypes.array,
    onCrop: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    ADD_MEDIA: PropTypes.func.isRequired,
    CREATE_MEDIA: PropTypes.func.isRequired,
    CHANGE_MEDIA: PropTypes.func.isRequired,
    REMOVE_MEDIA: PropTypes.func.isRequired,
    DELETE_MEDIA: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      media: props.media,
      uploadProgress: {}
    }
    this.uploads = {}
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(newProps.media, this.state.media)) this.setState({ media: newProps.media })
  }

  onDrop = (accepted) => {
    accepted.forEach((file) => {
      const clientId = new Date().getTime()
      const type = file.type === 'image/gif' ? 'GIF' : ((file.type.indexOf('video/') > -1 && 'VIDEO') || 'IMAGE')
      this.uploads[clientId] = file
      this.createMedia({
        file_name: file.name, url: file.preview, id: clientId, type
      })
      /*
            if (type === 'VIDEO') {
              this.uploads[clientId] = file
              this.createMedia({
                file_name: file.name, url: file.preview, id: clientId, type
              })
            } else {
              this.compressFile(file)
                .then((compressed) => {
                  console.log(compressed, file)
                  this.uploads[clientId] = compressed
                  this.createMedia({
                    file_name: compressed.name, url: file.preview, id: clientId, type
                  })
                })
            }
      */
    })
  }

  /* compressFile = (file) => new Promise((resolve, reject) => new ImageCompressor(file, {
    quality: 0.3,
    success(compressed) {
      resolve(compressed)
    },
    error(e) {
      console.warn(e.message)
      reject(e)
    }
  }))*/


  refDropzone = (node) => {
    this.dropzone = node
  }

  updateUploadProgress = (mediaId, progress) => {
    const { uploadProgress } = this.state
    uploadProgress[mediaId] = progress.toFixed(0)
    this.setState({ uploadProgress })
  }

  createMedia = (media) => {
    const { file_name, id } = media

    const {
      ADD_MEDIA, CREATE_MEDIA, CHANGE_MEDIA, business_id,
      intl: { formatMessage }
    } = this.props

    // this.selectMedia(this.props.medias.find((m) => m.id === id))

    return Promise.resolve(ADD_MEDIA(media, MEDIA_FROM.mine))
      .then(() => {
        Promise.resolve(CREATE_MEDIA({ business_id, file_name }, media.id, MEDIA_FROM.mine))
          .then((res) => {
            this.updateUploadProgress(media.id, 0)
            uploadFile({
              url: res.media.presigned_upload_url,
              file: this.uploads[id],
              progressCallback: (evt) => {
                this.updateUploadProgress(res.media.id, (100 * evt.loaded) / evt.total)
              },
              doneCallback: () => {
                Promise.resolve(CHANGE_MEDIA(Object.assign(
                  { ...this.props.medias.find((m) => m.id === res.media.id) },
                  { url: res.media.twokey_url, status: null }
                ), MEDIA_FROM.mine))
                  .then(() => {
                    this.selectMedia(this.props.medias.find((m) => m.id === res.media.id))
                  })
              },
              errorCallback: (evt) => {
                console.error(
                  formatMessage({ id: 'media.upload_error', defaultMessage: '!Uploading via presigned url error' }),
                  evt
                )
                this.removeUpload(media)
              }
            })
            // this.selectMedia(this.props.medias.find((m) => m.id === media.id))
          })
          .catch((err) => {
            console.error(err)
          })
      })
      .catch((err) => {
        console.error(err)
      })
  };

  retryUpload = (media) => {
    this.createMedia(media)
  };

  removeUpload = (media) => {
    if (media.isTemporary) {
      this.props.REMOVE_MEDIA(media.id, MEDIA_FROM.mine)
    } else {
      this.props.DELETE_MEDIA(media.id, MEDIA_FROM.mine)
    }
  };

  openFileDialog = () => {
    this.dropzone.open()
  };

  selectMedia = (media) => {
    this.setState({ media }, () => {
      if (this.props.onSelect) this.props.onSelect(media)
    })
  };

  cropImage = (image, e) => {
    e.stopPropagation()

    if (this.props.onCrop) {
      this.props.onCrop(image)
    }
  };

  render() {
    const { medias, intl: { formatMessage } } = this.props

    const { media } = this.state

    const errorMsg = (failedStatus) => {
      switch (failedStatus) {
      case MEDIA_ACTION_FAILED_STATUS.uploading_once_failed:
      case MEDIA_ACTION_FAILED_STATUS.uploading_more_failed:
        return formatMessage({ id: 'media.upload_failed', defaultMessage: '!Upload failed' })
      case MEDIA_ACTION_FAILED_STATUS.deleting_failed:
        return formatMessage({ id: 'media.delete_failed', defaultMessage: '!Delete failed' })
      default:
        return null
      }
    }

    const statusMsg = (status, uploadProgress) => {
      switch (status) {
      case MEDIA_ACTION_STATUS.creating:
        return formatMessage({ id: 'media.creating', defaultMessage: '!Creating...' })
      case MEDIA_ACTION_STATUS.uploading:
        return formatMessage(
          { id: 'media.uploading', defaultMessage: '!Uploading...' },
          { progress: uploadProgress || 0 }
        )
      case MEDIA_ACTION_STATUS.deleting:
        return formatMessage({ id: 'media.deleting', defaultMessage: '!Deleting...' })
      case MEDIA_ACTION_STATUS.updating:
        return formatMessage({ id: 'media.updating', defaultMessage: '!Updating...' })
      default:
        return null
      }
    }

    const mediaItemRenderer = (item) => {
      let {
        x1, y1, x2, y2
      } = item
      if (item.default_crop_upper_left) {
        if (item.default_crop_upper_left.x) x1 = item.default_crop_upper_left.x
        if (item.default_crop_upper_left.y) y1 = item.default_crop_upper_left.y
      }
      if (item.default_crop_lower_right) {
        if (item.default_crop_lower_right.x) x2 = item.default_crop_lower_right.x
        if (item.default_crop_lower_right.y) y2 = item.default_crop_lower_right.y
      }
      return (
        <div>
          <div className="thumbnail-wrapper">
            <div className="thumbnail-content">
              {item.type !== 'VIDEO' && (
                <ClipImg className="clipImg" src={item.url} x1={x1} y1={y1} x2={x2} y2={y2} />
              )}
              {item.type === 'VIDEO' && (<VideoPreview src={item.url} width="150px" height="100px" />)}
            </div>
            {item.status !== MEDIA_ACTION_STATUS.uploading
              && item.failed_status !== MEDIA_ACTION_FAILED_STATUS.uploading_once_failed
              && item.failed_status !== MEDIA_ACTION_FAILED_STATUS.uploading_more_failed
              && item.type === 'IMAGE' && (
                <div className="thumbnail-crop-overlay">
                  <div style={{ float: 'left' }}>
                    <FormattedMessage id="media.crop_overlay" defaultMessage="!1920x1080px" />
                  </div>
                  <IconButton
                    style={{ float: 'right', color: '#FFF' }}
                    icon="crop"
                    onClick={(e) => this.cropImage(item, e)}
                  />
                </div>
              )
            }
          </div>
          {item.status === null && item.failed_status !== null && (
            <div className="thumbnail-item-title">
              <div className="error">{errorMsg(item.failed_status)}</div>
              {item.failed_status === MEDIA_ACTION_FAILED_STATUS.uploading_once_failed && (
                <IconButton
                  style={{ fontSize: 12 }}
                  icon="refresh"
                  onClick={(e) => {
                    e.stopPropagation()
                    this.retryUpload(item)
                  }}
                />
              )}
              {item.failed_status === MEDIA_ACTION_FAILED_STATUS.uploading_more_failed && (
                <IconButton
                  style={{ fontSize: 12 }}
                  icon="close"
                  onClick={(e) => {
                    e.stopPropagation()
                    this.removeUpload(item)
                  }}
                />
              )}
            </div>
          )}
          {(item.status !== null && item.status !== undefined) && (
            <div className="thumbnail-item-title">
              <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style={{ fontSize: 12 }} />
              <div className="info">{statusMsg(item.status, this.state.uploadProgress[item.id])}</div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="gallery-container">
        <Dropzone
          disableClick
          ref={this.refDropzone}
          style={{ position: 'relative', height: '100%' }}
          accept={FILE_ACCEPT}
          onDrop={this.onDrop}
        >
          <ThumbnailView
            newItemEnabled
            data={medias}
            selections={media}
            onNewItem={this.openFileDialog}
            itemRenderer={mediaItemRenderer}
            onChange={this.selectMedia}
          />
        </Dropzone>
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const id = state.business.get('businessDetails').get('business')
  return {
    business_id: id && id.get && id.get('id'),
    medias: state.media.get(`${MEDIA_FROM.mine}`).toList().toJS()
    // medias: _.orderBy(state.media.get('medias').toList().toJS()
    //   .filter((m) => m.from === MEDIA_FROM.mine), (m) => m.id, 'asc')
  }
}, {
  ADD_MEDIA: MediaActions.ADD_MEDIA,
  CREATE_MEDIA: MediaActions.CREATE_MEDIA,
  REMOVE_MEDIA: MediaActions.REMOVE_MEDIA,
  DELETE_MEDIA: MediaActions.DELETE_MEDIA,
  CHANGE_MEDIA: MediaActions.CHANGE_MEDIA
})(MyMedias))
