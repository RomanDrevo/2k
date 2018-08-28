import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'

import { MEDIA_ACTION_FAILED_STATUS, MEDIA_ACTION_STATUS, MEDIA_FROM } from '../../_redux'
import { ClipImg, IconButton, ThumbnailView, VideoPreview } from '../_common'

class HostedMedias extends React.Component {
  static propTypes = {
    media: PropTypes.object,
    intl: PropTypes.object.isRequired,
    medias: PropTypes.array,
    onCrop: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  state = {
    media: this.props.media
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(newProps.media, this.state.media)) {
      this.setState({ media: newProps.media })
    }
  }

  getErrorMsg = (failed_status) => failed_status === MEDIA_ACTION_FAILED_STATUS.updating_faield &&
    this.props.intl.formatMessage({ id: 'media.upload_failed', defaultMessage: '!Upload failed' })

  getStatusMsg = (status) => status === MEDIA_ACTION_STATUS.updating &&
    this.props.intl.formatMessage({ id: 'media.updating', defaultMessage: '!Updating...' })

  selectMedia = (media) => {
    this.setState({ media }, () => {
      if (this.props.onSelect) this.props.onSelect(media)
    })
  }

  cropImage = (image, e) => {
    e.stopPropagation()
    if (this.props.onCrop) {
      this.props.onCrop(image)
    }
  }

  render() {
    const { medias } = this.props
    const { media } = this.state
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
                <ClipImg style={{ width: '100%' }} src={item.url} x1={x1} y1={y1} x2={x2} y2={y2} />
              )}
              {item.type === 'VIDEO' && <VideoPreview src={item.url} width="150px" height="100px" />}
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
              )}
          </div>
          {item.status === null && item.failed_status !== null && (
            <div className="thumbnail-item-title">
              <div className="error">{this.getErrorMsg(item.failed_status)}</div>
            </div>
          )}
          {item.status !== null && item.status !== undefined && (
            <div className="thumbnail-item-title">
              <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style={{ fontSize: 12 }} />
              <div className="info">{this.getStatusMsg(item.status)}</div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="gallery-container">
        <ThumbnailView
          data={medias}
          selections={media}
          itemRenderer={mediaItemRenderer}
          onChange={this.selectMedia}
        />
      </div>
    )
  }
}

export default injectIntl(connect((state) => ({
  medias: state.media.get(`${MEDIA_FROM.hosted}`).toList().toJS()
  // medias: _.orderBy(state.media.get('medias').toList().toJS()
  //   .filter((m) => m.from === MEDIA_FROM.hosted), (m) => m.id, 'asc')
}))(HostedMedias))
