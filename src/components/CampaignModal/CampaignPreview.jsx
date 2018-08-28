import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import TruncateText from 'react-text-truncate'
import { ClipImg, VideoPreview } from '../../components/_common'

require('./campaign-preview.css')

class CampaignPreview extends React.Component {
  static propTypes = {
    headline: PropTypes.string,
    description: PropTypes.string,
    published_at: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    media: PropTypes.object,
    intl: PropTypes.object
  }
  renderPreview() {
    const { media } = this.props

    if (media && media.url) {
      if (media.type !== 'VIDEO') {
        let {
          x1, y1, x2, y2
        } = media
        const { url, default_crop_upper_left, default_crop_lower_right } = media
        if (default_crop_upper_left) {
          if (default_crop_upper_left.x) x1 = default_crop_upper_left.x
          if (default_crop_upper_left.y) y1 = default_crop_upper_left.y
        }
        if (default_crop_lower_right) {
          if (default_crop_lower_right.x) x2 = default_crop_lower_right.x
          if (default_crop_lower_right.y) y2 = default_crop_lower_right.y
        }
        return <ClipImg src={url} x1={x1} y1={y1} x2={x2} y2={y2} />
      }
      return <VideoPreview src={media.url} width="100%" height="100%" />
    }
    return <img src="https://via.placeholder.com/300x200?text=No+Logo" alt="blank" />
  }
  render() {
    const {
      intl: { formatDate }, headline, description, tags, published_at
    } = this.props
    return (
      <div className="campaign-preview-container">
        <div className="campaign-preview-header">
          <FormattedMessage
            id="campaign.preview"
            defaultMessage="!Preview"
          />
        </div>
        <div className="campaign-preview-body">
          <div className="campaign-preview-img">{this.renderPreview()}</div>
          <div className="campaign-preview-banner">15$ Per Lead</div>
          <div className="campaign-preview-headline">{headline}</div>
          <div className="campaign-preview-description">
            <TruncateText
              line={3}
              truncateText="..."
              text={description}
            />
          </div>
          <div className="campaign-preview-description">{tags.map((tag) => `#${tag}`).join(' ')}</div>
          <div className="campaign-preview-recommend">
            <FormattedMessage
              id="campaign.recommend"
              defaultMessage="!RECOMMEND"
            />
            <div className="campaign-preview-recommend-icon">
              <i className="fa fa-play" />
            </div>
          </div>
          <div className="campaign-preview-description align-center">
            <FormattedMessage
              id="campaign.published_value"
              defaultMessage="!Published {at}"
              values={{
                at: formatDate(
                  published_at ? new Date(published_at) : Date.now(),
                  { year: 'numeric', day: 'numeric', month: 'short' }
                )
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const selector = formValueSelector('campaign-form')
  const tags = selector(state, 'fields.tags')
  return {
    media: {
      type: selector(state, 'fields.media_type'),
      url: selector(state, 'fields.media_url'),
      x1: selector(state, 'fields.media_x1'),
      y1: selector(state, 'fields.media_y1'),
      x2: selector(state, 'fields.media_x2'),
      y2: selector(state, 'fields.media_y2')
    },
    headline: selector(state, 'fields.headline'),
    description: selector(state, 'fields.description'),
    tags: tags || [],
    published_at: selector(state, 'fields.published_at')
  }
}, {})(CampaignPreview))
