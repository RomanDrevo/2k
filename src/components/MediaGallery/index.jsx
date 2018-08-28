import { connect } from 'react-redux'
import Cropper from 'react-cropper'
import { injectIntl, FormattedMessage } from 'react-intl'
import { debounce } from 'lodash'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import React from 'react'
import swal from 'sweetalert2'
import '../../../node_modules/cropperjs/dist/cropper.css'

import { Button, IconButton, SearchInput, Tab, Tabs } from '../_common'
import { MEDIA_FROM, MediaActions } from '../../_redux'
import HostedMedias from './HostedMedias'
import MyMedias from './MyMedias'
import WebMedias from './WebMedias'

require('../../styles/modal.css')
require('./gallery.css')
require('../../components/_common/button.css')

const CROP_RATE = {
  Logo: 1 / 1,
  Cover: 2.7 / 1,
  Campaign: 1.667 / 1
}

class MediaGalleryModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    isMobile: PropTypes.bool,
    isCropMode: PropTypes.bool,
    imageField: PropTypes.string,
    web_media_page: PropTypes.number,
    cropImage: PropTypes.object,
    intl: PropTypes.object,
    medias: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    CHANGE_MEDIA: PropTypes.func.isRequired,
    UPDATE_MEDIA: PropTypes.func.isRequired,
    REMOVE_MEDIA: PropTypes.func.isRequired,
    DELETE_MEDIA: PropTypes.func.isRequired,
    SEARCH_WEB_MEDIAS: PropTypes.func.isRequired,
    OPEN_MEDIA_MODAL: PropTypes.func.isRequired
  }

  state = {
    activeTab: 1,
    crop: {
      image: null, // cropping image(media object)
      on: null, // on 1:`MyGallery`, 2:`WebMedia`, 3:`SearchWeb`
      rate: null
    },
    selection: {
      media: null,
      on: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen && nextProps.isCropMode) {
      const { imageField, cropImage } = nextProps
      const crop = {
        image: cropImage,
        on: 1,
        rate: (imageField === 'campaign' && CROP_RATE.Campaign)
        || (imageField === 'cover' && CROP_RATE.Cover) || CROP_RATE.Logo
      }
      this.setState({ crop })
    }
  }

  onCancel = () => {
    const { crop, activeTab } = this.state
    if (crop.on === activeTab && this.props.isCropMode === false) {
      return
    }

    this.setState({ crop: {}, corpObject: {} })
    if (this.props.onClose) {
      this.props.onClose()
      this.props.OPEN_MEDIA_MODAL(false)
    }
  }

  onConfirm = () => {
    const { isCropMode } = this.props
    const { crop, activeTab } = this.state
    if (crop.on === activeTab) {
      // console.log('Cropped data', this.cropper.getData())
      const { corpObject } = this.state
      const {
        x, y, width, height
      } = (!corpObject || Number.isNaN(corpObject.x) || Number.isNaN(corpObject.y)
        || Number.isNaN(corpObject.width) || Number.isNaN(corpObject.height))
        ? this.cropper.getData(true)
        : corpObject
      const media = Object.assign({ ...crop.image }, {
        x1: Math.round(x), y1: Math.round(y), x2: Math.round(x + width), y2: Math.round(y + height)
      })
      // console.log('CONFIRMED_CROP', media)

      if (isCropMode && this.props.onConfirm) {
        const cropped = {
          ...crop.image,
          x1: Math.round(corpObject.x),
          y1: Math.round(corpObject.y),
          x2: Math.round(corpObject.x) + Math.round(corpObject.width),
          y2: Math.round(corpObject.y) + Math.round(corpObject.height)
        }
        this.props.onConfirm(cropped)
        this.props.OPEN_MEDIA_MODAL(false)
        this.setState({ corpObject: {}, crop: {} })
        return
      }

      const { CHANGE_MEDIA, UPDATE_MEDIA } = this.props
      Promise.resolve(CHANGE_MEDIA(media, activeTab))
        .then(() => {
          this.setState({ crop: {} })
          // if (media.from === MEDIA_FROM.web) {
          if (activeTab === MEDIA_FROM.web) {
            this.setSelection(media.id, activeTab)
          } else {
            Promise.resolve(UPDATE_MEDIA(media.id, media, activeTab))
              .then(() => {
                this.setSelection(media.id, activeTab)
              })
              .catch((err) => {
                console.error(err)
                this.setSelection(media.id, activeTab)
              })
          }
        })
        .catch((err) => {
          console.error(err)
        })
      return
    }

    if (this.props.onConfirm) {
      this.props.onConfirm(this.state.selection.media)
      this.props.OPEN_MEDIA_MODAL()
    }
  }

  onSelectTab = (eventKey) => {
    this.setState({ activeTab: eventKey })
  }

  onCrop = (image, on) => {
    this.setState({
      crop: {
        image,
        on,
        rate: CROP_RATE.Campaign
      }
    })
  }

  onSelectMedia = (media, on) => {
    this.setState({ selection: { media, on } })
  }

  onScrollWebMedias = (e) => {
    const el = e.target
    const { scrollTop, clientHeight, scrollHeight } = el
    if (scrollTop + clientHeight === scrollHeight) {
      this.searchWebMedias(this.webMediasSearchInput.value(), this.props.web_media_page)
    }
  }

  setSelection = (mediaId, on) => {
    this.setState({ selection: { media: this.props.medias.find((m) => m.id === mediaId), on } })
  }

  handleCrop = debounce((e) => {
    this.setState({ corpObject: e.detail })
    // console.log('CROP', e, this.cropper.getData(true))
  }, 300)

  deleteSelectedMedia = () => {
    const { intl: { formatMessage } } = this.props
    const { selection: { media, on }, activeTab } = this.state
    if (!media || on !== activeTab) return

    swal({
      title: formatMessage(
        { id: 'media.delete_type', defaultMessage: '!Delete This {type}?' },
        { type: media.type }
      ),
      showCancelButton: true,
      confirmButtonText: formatMessage({ id: 'main.yes', defaultMessage: '!Yes' }),
      cancelButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' }),
      confirmButtonClass: 'btn swal confirm',
      cancelButtonClass: 'btn swal cancel',
      customClass: 'border-green'
    }).then((res) => {
      if (res.value) {
        if (media.isTemporary) {
          this.props.REMOVE_MEDIA(media.id, activeTab)
        } else {
          this.props.DELETE_MEDIA(media.id, activeTab)
        }
      }
    })
  }

  searchWebMedias = (query, page) => {
    this.props.SEARCH_WEB_MEDIAS({ q: query, page })
  }

  refCropper = (c) => {
    this.cropper = c
  }

  renderCropping() {
    const { crop: { image, rate } } = this.state

    if (!image) {
      return null
    }
    return (
      <Cropper
        ref={this.refCropper}
        crop={this.handleCrop}
        src={image.url}
        style={{ height: 450 }}
        aspectRatio={rate}
        guides={false}
      />
    )
  }

  renderCroppingToolbar(crop) {
    const style = (type) => {
      let width
      let height
      switch (type) {
      case 'Logo':
        width = 25
        height = 25
        break
      case 'Cover':
        width = 55
        height = width / CROP_RATE.Cover
        break
      case 'Campaign':
      default:
        width = 45
        height = width / CROP_RATE.Campaign
      }

      return {
        width,
        height
      }
    }

    return (
      <div className="cropping-toolbar-container">
        <div className="cropping-toolbar-title">
          <FormattedMessage id="media.best_fit" defaultMessage="!Best Fit For" />
        </div>
        {Object.keys(CROP_RATE).map((key) => (
          <div
            key={`crop-option-${key}`}
            className={`cropping-toolbar-option-wrapper${crop.rate === CROP_RATE[key] ? ' selected' : ''}`}
            onClick={() => {
              this.setState({ crop: { ...crop, rate: CROP_RATE[key] } })
            }}
          >
            <div className="cropping-toolbar-option">
              <div className="cropping-toolbar-option-img-wrapper">
                <div className="cropping-toolbar-option-img" style={style(key)} />
              </div>
              <div className="cropping-toolbar-option-label">{key}</div>
            </div>
          </div>
        ))}
        <div className="flex-1">&nbsp;</div>
      </div>
    )
  }

  renderDesktop() {
    const { intl: { formatMessage }, medias = [] } = this.props
    const { activeTab, crop, selection } = this.state

    const body = (content, hide) => (
      <div
        className="modal-body"
        style={{ height: 450, background: 'white', display: hide ? 'none' : 'block' }}
      >
        {content}
      </div>
    )

    const footer = () => (
      <div className="modal-footer border-top flex" style={{ background: '#E8F0F2', height: 50 }}>
        {activeTab === 1 && crop.on !== activeTab && (
          <div className="flex-1">
            <IconButton style={{ color: '#95989A' }} icon="trash" onClick={this.deleteSelectedMedia} />
          </div>
        )}
        {crop.on === activeTab && this.renderCroppingToolbar(crop)}
        <Button
          bsType="cancel"
          title={formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' })}
          onClick={this.onCancel}
        />&nbsp;
        <Button
          title={formatMessage({ id: 'main.confirm', defaultMessage: '!Confirm' })}
          onClick={this.onConfirm}
        />
      </div>
    )
    return (
      <div className="modal-container middle">
        <div className="modal-content">
          <Tabs className="media" activeKey={activeTab || 1} onSelect={this.onSelectTab}>
            <Tab
              eventKey={1}
              title={formatMessage({ id: 'media.gallery', defaultMessage: '!My Gallery' })}
            >
              {crop.on === activeTab
                ? this.renderCropping()
                : body(
                  <MyMedias
                    media={selection.on === activeTab ? selection.media : null}
                    onCrop={(image) => this.onCrop(image, activeTab)}
                    onSelect={(media) => this.onSelectMedia(media, activeTab)}
                  />,
                  crop.on === activeTab
                )}
            </Tab>
            {medias.length ? (
              <Tab
                eventKey={2}
                title={formatMessage({ id: 'media.website', defaultMessage: '!Media from Website' })}
              >
                {crop.on === activeTab
                  ? this.renderCropping()
                  : body(
                    <HostedMedias
                      media={selection.on === activeTab ? selection.media : null}
                      onCrop={(image) => this.onCrop(image, activeTab)}
                      onSelect={(media) => this.onSelectMedia(media, activeTab)}
                    />,
                    crop.on === activeTab
                  )}
              </Tab>
            ) : null}
            <Tab
              eventKey={medias.length ? 3 : 2}
              title={formatMessage({ id: 'media.search', defaultMessage: '!Search Web' })}
              selectedExtraEl={(
                <div style={{ marginTop: 5 }}>
                  <SearchInput
                    ref={(w) => {
                      this.webMediasSearchInput = w
                    }}
                    onSubmit={(val) => this.searchWebMedias(val, 1)}
                  />
                </div>
              )}
            >
              {crop.on === activeTab
                ? this.renderCropping()
                : body(
                  <WebMedias
                    media={selection.on === activeTab ? selection.media : null}
                    onCrop={(image) => this.onCrop(image, activeTab)}
                    onSelect={(media) => this.onSelectMedia(media, activeTab)}
                    onScroll={this.onScrollWebMedias}
                  />,
                  crop.on === activeTab
                )}
            </Tab>
          </Tabs>
          {footer()}
        </div>
      </div>
    )
  }

  render() {
    const { isOpen, isMobile } = this.props

    return (
      <Modal
        className="modal-trans"
        isOpen={isOpen}
        onRequestClose={this.onCancel}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
      >
        {isMobile ? <div>Here is mobile design</div> : this.renderDesktop()}
      </Modal>
    )
  }
}

const connectedComponent = connect((state) => ({
  // medias: state.media.get('medias').toList().toJS(),
  medias: state.media.get(`${MEDIA_FROM.hosted}`).toList().toJS(),
  web_media_page: state.media.get('web_media_page')
}), {
  DELETE_MEDIA: MediaActions.DELETE_MEDIA,
  REMOVE_MEDIA: MediaActions.REMOVE_MEDIA,
  CHANGE_MEDIA: MediaActions.CHANGE_MEDIA,
  UPDATE_MEDIA: MediaActions.UPDATE_MEDIA,
  SEARCH_WEB_MEDIAS: MediaActions.SEARCH_WEB_MEDIAS,
  OPEN_MEDIA_MODAL: MediaActions.OPEN_MEDIA_MODAL
})(MediaGalleryModal)

export default injectIntl(connectedComponent)
