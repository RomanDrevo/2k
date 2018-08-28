import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { MEDIA_FROM, MediaActions } from '../../_redux'
import { ClipImg, IconButton, ThumbnailView, VideoPreview } from '../_common'

class WebMedias extends React.Component {
  static propTypes = {
    media: PropTypes.object,
    medias: PropTypes.array,
    onCrop: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired
  }

  state = {
    playing: {},
    media: this.props.media
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(newProps.media, this.state.media)) {
      this.setState({ media: newProps.media })
    }
  }

  selectMedia = (media) => {
    this.setState({ media }, () => {
      if (this.props.onSelect) this.props.onSelect(media)
    })
  }

  toggleMediaPlaying = (media, e) => {
    e.stopPropagation()
    const { playing } = this.state
    playing[media.id] = !playing[media.id]
    this.setState({ playing })
  }

  stopMediaPlaying = (media) => {
    const { playing } = this.state
    playing[media.id] = false
    this.setState({ playing })
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
              {item.type === 'VIDEO' && (
                <VideoPreview src={item.url} width="150px" height="100px" />
              )}
            </div>
            <div className="thumbnail-crop-overlay">
              <div style={{ float: 'left' }}>{`${item.width}x${item.height}px`}</div>
              <IconButton
                style={{ float: 'right', color: '#FFF' }}
                icon="crop"
                onClick={(e) => this.cropImage(item, e)}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="gallery-container" onScroll={this.props.onScroll}>
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

export default injectIntl(connect((state) => {
  const medias = state.media.get(`${MEDIA_FROM.web}`)
  return {
    medias: medias.toList().toJS()
  }
}, {
  SEARCH_WEB_MEDIAS: MediaActions.SEARCH_WEB_MEDIAS
})(WebMedias))
