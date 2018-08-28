import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import TagsInput from 'react-tagsinput'
import ReactTooltip from 'react-tooltip'
import 'react-tagsinput/react-tagsinput.css'
import { Button, InfoTooltip, Panel, TextArea, TextInput } from '../../components/_common'
import MediaGalleryModal from '../MediaGallery'
import './creativePanel.css'

class CreativePanel extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  }
  state = {
    openMediaGalleryModal: false,
    isCropMode: false
  }

  componentDidMount() {
    this.button = document.getElementById('select_campaign_photo')
  }

  handleChangePhotoClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const event = { ...e }
    if (this.props.fields.media_id.input.value) {
      if (!this.button) {
        this.button = document.getElementById('select_campaign_photo')
      }
      this.tooltip.showTooltip(event)
    } else {
      this.setState({ openMediaGalleryModal: true })
    }
  }

  openMediaGalleryModal = () => this.setState({ openMediaGalleryModal: true })

  openMediaGalleryCrop = () => this.setState({ openMediaGalleryModal: true, isCropMode: true })

  closeMediaGalleryModal = () => {
    this.setState({ openMediaGalleryModal: false, isCropMode: false })
  }

  confirmSelectedMedia = (media) => {
    this.props.fields.media_id.input.onChange(media.id)
    this.props.fields.media_type.input.onChange(media.type)
    this.props.fields.media_url.input.onChange(media.url)
    this.props.fields.media_x1.input.onChange(media.x1)
    this.props.fields.media_y1.input.onChange(media.y1)
    this.props.fields.media_x2.input.onChange(media.x2)
    this.props.fields.media_y2.input.onChange(media.y2)
    this.closeMediaGalleryModal()
  }

  handleTagsChange = (t) => {
    this.props.fields.tags.input.onChange(_.uniq(t))
  }

  refTooltip = (e) => {
    this.tooltip = e
  }

  render() {
    const {
      intl: { formatMessage }, fields: {
        headline, description, tags, hosted_site_id, media_id,
        media_type, media_url, media_x1, media_y1, media_x2, media_y2
      }
    } = this.props
    const cropImage = {
      id: media_id.input.value,
      type: media_type.input.value,
      url: media_url.input.value,
      x1: media_x1.input.value,
      x2: media_x2.input.value,
      y1: media_y1.input.value,
      y2: media_y2.input.value
    }
    return (
      <Panel
        title={formatMessage({ id: 'campaign.step_creative', defaultMessage: '!Creative' })}
        className="creative"
      >
        <div id="campaign-form-error-headline">
          <TextInput
            label={formatMessage({ id: 'campaign.headline', defaultMessage: '!Headline' })}
            tooltip={formatMessage({ id: 'campaign.headline', defaultMessage: '!Headline' })}
            {...headline.input}
            meta={headline.meta}
            maxLength={60}
            tIndex={1}
          />
        </div>
        <div id="campaign-form-error-description" className="mt-10">
          <TextArea
            label={formatMessage({ id: 'campaign.text', defaultMessage: '!Text' })}
            tooltip={formatMessage({ id: 'campaign.text', defaultMessage: '!Text' })}
            className="capmaign"
            {...description}
            maxLength={540}
            tIndex={2}
          />
        </div>
        <div className="mt-10">
          <div className="flex vCenter">
            <div className="field-label">
              <FormattedMessage id="campaign.hash_tags" defaultMessage="HashTags" />
            </div>
            <InfoTooltip
              id="info-tooltip-product-name"
              content={<FormattedMessage id="campaign.hash_tags" defaultMessage="HashTags" />}
            />
          </div>
          <div className="field-input">
            <TagsInput
              value={tags.input.value || []}
              onChange={this.handleTagsChange}
            />
          </div>
        </div>
        <div id="campaign-form-error-media_id" className="mt-20 flex">
          <Button
            id="select_campaign_photo"
            bsType="select"
            title={formatMessage({ id: 'campaign.select_photo_gif', defaultMessage: '!Select Photo/GIF' })}
            tooltip={formatMessage({ id: 'campaign.select_photo_gif', defaultMessage: '!Select Photo/GIF' })}
            onClick={this.handleChangePhotoClick}
            disabled={!hosted_site_id.input.value}
            className="vCenter"
          />
          {media_id.meta.touched && media_id.meta.error && <div className="msg small error">{media_id.meta.error}</div>}
        </div>
        <MediaGalleryModal
          isOpen={this.state.openMediaGalleryModal}
          onClose={this.closeMediaGalleryModal}
          onConfirm={this.confirmSelectedMedia}
          isCropMode={this.state.isCropMode}
          cropImage={cropImage}
          imageField="campaign"
        />
        <ReactTooltip
          id="campaignPhoto"
          globalEventOff="click"
          place="bottom"
          type="light"
          effect="float"
          className="extra"
          ref={this.refTooltip}
        >
          <div className="tooltip-content" onClick={this.openMediaGalleryModal}>
            <FormattedMessage tagName="span" id="media.image_change" defaultMessage="!Change" />
          </div>
          <div className="tooltip-content" onClick={this.openMediaGalleryCrop}>
            <FormattedMessage tagName="span" id="media.image_reposition" defaultMessage="!Reposition" />
          </div>
        </ReactTooltip>
      </Panel>
    )
  }
}

export default injectIntl(connect()(CreativePanel))

