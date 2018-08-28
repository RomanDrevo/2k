import 'react-tagsinput/react-tagsinput.css'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import swal from 'sweetalert2'

import './HeaderDesktop.css'

import { BusinessActions, MediaActions } from '../../../_redux'
import { getLocationObjFromString, getLocationString } from '../../../_core/utils'
import About from './About'
import ContactDetails from './ContactDetails'
import contentEditIcon from '../../../icons/pencil_icon.png'
import createCampaign from '../../../icons/create_campaign.png'
import { fetchAPI } from '../../../_core/http'
import MediaGallery from '../../MediaGallery/index'
import TitleDetails from './TitleDetails'
import TooltipWizzard from './TooltipWizzard'

const getUserLocation = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition((position) => {
    resolve(position.coords)
  }, () => {
    reject()
  })
})

class HeaderDesktop extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool,
    openMedia: PropTypes.bool,
    isAdminPreviewMode: PropTypes.bool,
    businessDetails: PropTypes.object,
    enums: PropTypes.object,
    intl: PropTypes.object.isRequired,
    updatePreviewMode: PropTypes.func.isRequired,
    onCreateNewCampaign: PropTypes.func.isRequired,
    updateBusinessInfo: PropTypes.func.isRequired,
    FETCH_MEDIA_LIST: PropTypes.func.isRequired
    // CREATE_BUSINESS: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const { businessDetails, isAdmin, isAdminPreviewMode } = props
    const firstTimeUse = localStorage.getItem('FirstTimeUse')
    if (!firstTimeUse) {
      localStorage.setItem('FirstTimeUse', 'true')
    }
    const wizzardTooltip = isAdmin && businessDetails && businessDetails.id
      && (!firstTimeUse || firstTimeUse === 'true')
    const admin = isAdmin && isAdminPreviewMode && !wizzardTooltip
    const contacts = (admin && !businessDetails.website && !businessDetails.contact_phone_number
      && !businessDetails.contact_email && !getLocationString(businessDetails)) || wizzardTooltip
    const title = (admin && !businessDetails.name) || wizzardTooltip
    const location = (admin && !getLocationString(businessDetails)) || wizzardTooltip
    const about = (admin && !businessDetails.description) || wizzardTooltip
    const tags = (admin && !businessDetails.tags) || wizzardTooltip

    this.state = {
      business: { ...businessDetails, businessLocation: getLocationString(businessDetails) } || {},
      changes: {},
      original: {},
      editable: businessDetails && businessDetails.id ? {
        contacts: Boolean(contacts),
        title: Boolean(title),
        location: Boolean(location),
        about: Boolean(about),
        tags: Boolean(tags)
      } : {
        contacts: true,
        title: true,
        location: true,
        about: true,
        tags: true
      },
      tooltip: wizzardTooltip ? 'cover,profile' : '',
      wizzardTooltip,
      step2done: false,
      firstTimeUse: !firstTimeUse || firstTimeUse === 'true',
      openMedia: props.openMedia
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside)
    const { businessDetails, FETCH_MEDIA_LIST } = this.props
    if (this.props.isAdmin) {
      if (businessDetails
        && businessDetails.id) {
        FETCH_MEDIA_LIST({ business_id: businessDetails.id })
      }
    }
  }

  componentWillReceiveProps(props) {
    if (!this.props.isAdmin && props.isAdmin) {
      const { isAdmin, businessDetails } = props
      const { firstTimeUse } = this.state
      const wizzardTooltip = isAdmin && businessDetails && businessDetails.id
      && firstTimeUse

      const editable = this.setEditable({}, props, wizzardTooltip)
      this.setState({ editable, wizzardTooltip, tooltip: wizzardTooltip ? 'cover,profile' : this.state.tooltip })
      this.props.FETCH_MEDIA_LIST({ business_id: props.businessDetails.id })
    }
    if ((!this.props.businessDetails && props.businessDetails)
      || this.props.businessDetails.id !== props.businessDetails.id) {
      this.setState({
        business: {
          ...props.businessDetails,
          businessLocation: getLocationString(props.businessDetails)
        }
      })
      const editable = this.setEditable({}, props)
      this.setState({ editable })
      if (props.isAdmin && props.businessDetails && props.businessDetails.id) {
        this.props.FETCH_MEDIA_LIST({ business_id: props.businessDetails.id })
      }
    }
    if (this.props.openMedia !== props.openMedia) {
      this.setState({ openMedia: props.openMedia })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside)
  }

  setEditable = (newValue, props = this.props, wizzardTooltip) => {
    const { business } = this.state
    const { isAdmin, isAdminPreviewMode } = props
    const admin = isAdmin && isAdminPreviewMode && !wizzardTooltip
    const contacts = admin && !business.website && !business.contact_phone_number
      && !business.contact_email && !business.businessLocation
    const title = admin && !business.name
    const location = admin && !getLocationString(business)
    const about = admin && !business.description
    const tags = admin && !business.tags
    return {
      contacts,
      title,
      location,
      about,
      tags,
      ...newValue
    }
  }

  handleKeyPress = (e) => {
    const pressedKey = e.charCode || e.keyCode || e.which
    const element = e.target

    if (pressedKey === 27 && !!element) {
      e.preventDefault()
      const stateField = element.getAttribute('data-state-field')
      const stateInitialValue = element.getAttribute('data-state-initial-value')
      const stateFieldEnabledProperty = `isEdit${stateField.charAt(0).toUpperCase()}${stateField.slice(1)}Enabled`
      this.setState({
        [stateFieldEnabledProperty]: false,
        [stateField]: stateInitialValue
      })
    }
  }

  handleInputChange = (e) => {
    const business = { ...this.state.business }
    const changes = { ...this.state.changes }
    const original = { ...this.state.original }
    if (changes[e.target.name] === undefined) {
      original[e.target.name] = business[e.target.name]
    }
    business[e.target.name] = e.target.value
    changes[e.target.name] = e.target.value
    this.setState({ business, changes, original })
  }

  handleTagsChange = (e) => {
    const original = { ...this.state.original }
    const business = { ...this.state.business }
    const changes = { ...this.state.changes }
    if (changes.tags === undefined) {
      original.tags = business.tags
    }
    business.tags = e.join(',')
    changes.tags = e.join(',')
    this.setState({ business, changes, original })
  }

  handleEditNameClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const editable = this.setEditable({ title: true })
    this.setState({ editable })
  }

  handleEditLocationClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const editable = this.setEditable({ location: true })
    this.setState({ editable })
  }

  handleEditAboutClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const editable = this.setEditable({ about: true })
    this.setState({ editable })
  }

  handleEditTagsClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const editable = this.setEditable({ tags: true })
    this.setState({ editable })
  }

  handleEditContactClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const editable = this.setEditable({ contacts: true })
    this.setState({ editable })
  }

  handleFacebookUpdate = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { intl: { formatMessage } } = this.props
    const defaultMessage = `!We can sync all the updated information from
      your facebook page or sync only Profile and
      Cover Images.`
    swal({
      title: formatMessage({ id: 'business.fb_update', defaultMessage }),
      html: this.renderCustomButtons(),
      padding: 10,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' }),
      cancelButtonClass: 'btn swal cancel',
      customClass: 'border-green create-close-dialog'
    }).then(this.createOrUpdateBusiness)
  }

  createBusiness = (business) => {
    fetchAPI('business', { method: 'POST', body: JSON.stringify(business) })
      .catch((err) => {
        console.warn(err)
      })
      .then((res) => {
        const newBusiness = { ...res.business, tags: res.tags }
        this.setState({ business: newBusiness, changes: {} })
        this.props.FETCH_MEDIA_LIST({ business_id: res.business.id })
      })
  }

  updateBusiness = (changes) => {
    Promise.resolve(this.props.updateBusinessInfo(changes))
      .catch(() => {})
      .then((res) => {
        if (res) {
          const { business } = res
          this.setState({
            business: { ...business, businessLocation: getLocationString(business) }
          })
        }
      })
  }

  createOrUpdateBusiness = (answer) => {
    if (answer.value) {
      const changes = { ...this.state.changes }
      const business = { ...this.state.business }
      const { businessLocation } = changes
      if (businessLocation) {
        const location = getLocationObjFromString(businessLocation)
        Object.keys(location).forEach((key) => {
          changes[key] = location[key]
          business[key] = location[key]
        })
        delete changes.businessLocation
      }
      if (changes.location_country) {
        business.businessLocation = getLocationString({
          ...business,
          location_country: changes.location_country
        })
      }
      if (business.id) {
        if (typeof (business.location_lat) !== 'number' ||
          typeof (business.location_long) !== 'number') {
          const { intl: { formatMessage } } = this.props
          const defaultMessage = `!Do you want to
            use current location?`
          swal({
            title: formatMessage({ id: 'business.update_location', defaultMessage }),
            padding: 10,
            showCancelButton: true,
            confirmButtonText: formatMessage({ id: 'main.yes', defaultMessage: '!Yes' }),
            cancelButtonText: formatMessage({ id: 'main.no', defaultMessage: '!No' }),
            confirmButtonClass: 'btn swal confirm',
            cancelButtonClass: 'btn swal cancel',
            customClass: 'border-green create-close-dialog'
          }).then(({ value }) => {
            if (value) {
              getUserLocation()
                .then((coords) => {
                  business.location_long = coords.longitude
                  business.location_lat = coords.latitude
                  changes.location_long = coords.longitude
                  changes.location_lat = coords.latitude
                  this.updateBusiness({ ...changes, business_id: business.id })
                })
                .catch((err) => {
                  console.warn(err)
                  this.updateBusiness({ ...changes, business_id: business.id })
                })
            } else {
              this.updateBusiness({ ...changes, business_id: business.id })
            }
          })
        } else {
          this.updateBusiness({ ...changes, business_id: business.id })
        }
      } else {
        this.createBusiness(business)
      }
      this.setState({ original: {}, business, changes: {} })
    } else {
      const original = { ...this.state.original }
      const business = { ...this.state.business }
      Object.keys(original).forEach((key) => {
        business[key] = original[key]
      })
      this.setState({ original: {}, business, changes: {} })
    }
  }

  handleClickOutside = (e, force = false) => {
    if (this.state.firstTimeUse) {
      return
    }
    if (this.props.isAdmin) {
      if (force) {
        this.createOrUpdateBusiness({ value: true })
        return
      }
      const targetElm = e && e.target
      const emlId = targetElm && targetElm.getAttribute('id')
      if (emlId === 'syncAllBtn') {
        swal.close()
        this.handleSyncAllClick()
        return
      } else if (emlId === 'syncImgBtn') {
        swal.close()
        this.handleSyncImgClick()
        return
      }
      if (this.state.openMedia || swal.isVisible()) {
        return
      }
      const classes = targetElm && targetElm.getAttribute('class')
      if ((!classes || !classes.includes('stopPropagation'))
        && (Object.keys(this.state.editable).length || this.state.tooltip)) {
        const editable = this.setEditable({})
        this.setState({ editable, tooltip: '' })
      }
      const { businessDetails } = this.props
      const { changes } = this.state
      const equal = Object.keys(changes).every((key) => (
        (typeof (changes[key]) === 'object' && changes[key] !== null) || businessDetails[key] === changes[key]
      ))
      if (!equal) {
        const { intl: { formatMessage } } = this.props
        swal({
          title: formatMessage({ id: 'business.save_changes', defaultMessage: '!Save Changes?' }),
          padding: 10,
          showCancelButton: true,
          confirmButtonText: formatMessage({ id: 'main.save', defaultMessage: '!Save' }),
          cancelButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' }),
          confirmButtonClass: 'btn swal confirm',
          cancelButtonClass: 'btn swal cancel',
          customClass: 'border-green create-close-dialog'
        }).then(this.createOrUpdateBusiness)
      }
    }
  }

  handleProfileImageClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ tooltip: 'profile', imageField: 'profile' })
  }

  handleCoverImageClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ tooltip: 'cover', imageField: 'cover' })
  }

  handleTooltipHide = () => this.setState({ tooltip: '' })

  handleOpenMediaGallery = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ openMedia: true })
  }

  handleOpenCrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ openMedia: true, isCropMode: true })
  }

  handleDeleteImg = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { intl: { formatMessage } } = this.props
    swal({
      title: formatMessage({ id: 'business.remove_image', defaultMessage: '!Remove Image?' }),
      padding: 10,
      showCancelButton: true,
      confirmButtonText: formatMessage({ id: 'business.remove', defaultMessage: '!Remove' }),
      cancelButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' }),
      confirmButtonClass: 'btn swal confirm',
      cancelButtonClass: 'btn swal cancel',
      customClass: 'border-green create-close-dialog'
    }).then((res) => {
      if (res.value) {
        const { imageField } = this.state
        const business = { ...this.state.business }
        const changes = { ...this.state.changes }
        business[`${imageField}_media_delete`] = true
        changes[`${imageField}_media_delete`] = true
        business[`${imageField}_x1`] = null
        business[`${imageField}_x2`] = null
        business[`${imageField}_y1`] = null
        business[`${imageField}_y2`] = null
        this.setState({ business, changes }, () => this.handleClickOutside(null, true))
      }
    })
  }

  handleMediaGalleryClose = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.setState({ openMedia: false, isCropMode: false })
  }

  handleMediaGalleryConfirm = (image) => {
    const { imageField, isCropMode } = this.state
    const business = { ...this.state.business }
    const changes = { ...this.state.changes }
    const original = { ...this.state.original }

    if (!isCropMode) {
      business[`${imageField}_media_type`] = image.type
      original[`${imageField}_media_url`] = changes[`${imageField}_media_url`] === undefined
        ? business[`${imageField}_media_url`]
        : undefined
      business[`${imageField}_media_url`] = image.url
      changes[`${imageField}_media_url`] = image.url
    }
    original[`${imageField}_media_id`] = changes[`${imageField}_media_id`] === undefined
      ? business[`${imageField}_media_id`]
      : undefined
    original[`${imageField}_x1`] = changes[`${imageField}_x1`] === undefined
      ? business[`${imageField}_x1`]
      : undefined
    original[`${imageField}_x2`] = changes[`${imageField}_x2`] === undefined
      ? business[`${imageField}_x2`]
      : undefined
    original[`${imageField}_y1`] = changes[`${imageField}_y1`] === undefined
      ? business[`${imageField}_y1`]
      : undefined
    original[`${imageField}_y2`] = changes[`${imageField}_y2`] === undefined
      ? business[`${imageField}_y2`]
      : undefined

    business[`${imageField}_media_id`] = image.id
    business[`${imageField}_x1`] = image.x1
    business[`${imageField}_x2`] = image.x2
    business[`${imageField}_y1`] = image.y1
    business[`${imageField}_y2`] = image.y2

    changes[`${imageField}_media_id`] = image.id
    changes[`${imageField}_x1`] = image.x1
    changes[`${imageField}_x2`] = image.x2
    changes[`${imageField}_y1`] = image.y1
    changes[`${imageField}_y2`] = image.y2

    console.log(business, image, changes)
    this.setState({
      openMedia: false,
      imageField: null,
      business,
      changes,
      original,
      isCropMode: false
    }, () => {
      console.log(this.state.business)
      // this.handleClickOutside()
    })
  }

  handleSyncAllClick = () => {
    const changes = { ...this.state.changes }
    changes.facebook_page_url = this.state.business.facebook_page_url
    this.setState({ changes }, () => this.handleClickOutside(null, true))
  }

  handleSyncImgClick = () => {
    const changes = { ...this.state.changes }
    changes.facebook_page_url = this.state.business.facebook_page_url
    this.setState({ changes }, () => this.handleClickOutside(null, true))
  }

  handleTipAdminEnable = () => this.setState({ step2done: true })

  handleTipClose = () => {
    const { intl: { formatMessage } } = this.props
    localStorage.setItem('FirstTimeUse', 'false')
    this.setState({ wizzardTooltip: false, tooltip: '', firstTimeUse: false }, () => {
      const html = document.createElement('div')
      html.setAttribute('class', 'main')
      const img = document.createElement('img')
      img.setAttribute('src', createCampaign)
      html.appendChild(img)
      swal({
        title: formatMessage({ id: 'business.first_campaign', defaultMessage: '!Let\'s insert your first Campaign' }),
        showCloseButton: true,
        html,
        padding: 10,
        width: 500,
        showCancelButton: false,
        confirmButtonText: formatMessage({ id: 'business.start', defaultMessage: '!Start' }),
        confirmButtonClass: 'btn swal confirm',
        customClass: 'border-green create-close-dialog createCamaign'
      }).then(({ value }) => {
        if (value) {
          this.props.onCreateNewCampaign()
        }
      })
    })
  }

  renderCustomButtons = () => {
    const { intl: { formatMessage } } = this.props
    return `
    <div class="fb-sync">
      <button id="syncAllBtn" class="btn swal confirm swal2-styled">
        ${formatMessage({ id: 'business.sync_all', defaultMessage: '!Sync All' })}
      </button>
      <button id="syncImgBtn" class="btn swal confirm swal2-styled">
        ${formatMessage({ id: 'business.sync_images', defaultMessage: '!Sync Images only' })}
      </button>
    </div>
    `
  }

  render() {
    const {
      isAdmin, isAdminPreviewMode, updatePreviewMode,
      onCreateNewCampaign, enums
    } = this.props
    const {
      business, editable, tooltip, wizzardTooltip,
      openMedia, imageField, step2done
    } = this.state

    const cropImage = {
      id: business[`${imageField}_media_id`],
      type: business[`${imageField}_media_type`],
      url: business[`${imageField}_media_url`],
      x1: business[`${imageField}_x1`],
      x2: business[`${imageField}_x2`],
      y1: business[`${imageField}_y1`],
      y2: business[`${imageField}_y2`]
    }
    return (
      <div className="container desktop-view">
        <div className="row header-row">
          <ContactDetails
            business={business}
            handleInputChange={this.handleInputChange}
            isAdmin={isAdmin && isAdminPreviewMode}
            handleEditContactClick={this.handleEditContactClick}
            editable={editable.contacts}
            onCreateNewCampaign={onCreateNewCampaign}
            tooltip={tooltip}
            wizzard={!wizzardTooltip || step2done}
            handleImageClick={this.handleProfileImageClick}
          />
          <TitleDetails
            contentEditIcon={contentEditIcon}
            business={business}
            isAdmin={isAdmin && isAdminPreviewMode}
            isEditBusinessNameEnabled={editable.title}
            isEditBusinessLocationEnabled={editable.location}
            handleEditNameClick={this.handleEditNameClick}
            handleEditLocationClick={this.handleEditLocationClick}
            handleInputChange={this.handleInputChange}
            handleBusinessNameKeyPress={this.handleKeyPress}
            enums={enums}
            tooltip={tooltip}
            handleImageClick={this.handleCoverImageClick}
          />
          <About
            contentEditIcon={contentEditIcon}
            isEditAboutEnabled={editable.about}
            isEditTagsEnabled={editable.tags}
            business={business}
            handleInputChange={this.handleInputChange}
            handleEditAboutClick={this.handleEditAboutClick}
            handleEditTagsClick={this.handleEditTagsClick}
            handleTagsChange={this.handleTagsChange}
            isAdmin={isAdmin}
            isAdminPreviewMode={isAdminPreviewMode && (!wizzardTooltip || step2done)}
            updatePreviewMode={updatePreviewMode}
          />
        </div>
        <MediaGallery
          isOpen={openMedia}
          isMobile={window.innerWidth < 768}
          cropImage={cropImage}
          imageField={imageField}
          isCropMode={this.state.isCropMode}
          onClose={this.handleMediaGalleryClose}
          onConfirm={this.handleMediaGalleryConfirm}
        />
        {isAdmin && isAdminPreviewMode && (
          <ReactTooltip
            globalEventOff="click"
            place="bottom"
            type="dark"
            effect="solid"
            className="extra"
          // afterHide={this.handleTooltipHide}
          >
            <div onClick={this.handleOpenMediaGallery} className="tooltip-content">
              <FormattedMessage tagName="span" id="media.image_change" defaultMessage="!Change" />
            </div>
            <div onClick={this.handleOpenCrop} className="tooltip-content">
              <FormattedMessage tagName="span" id="media.image_reposition" defaultMessage="!Reposition" />
            </div>
            <div onClick={this.handleFacebookUpdate} className="tooltip-content">
              <FormattedMessage tagName="span" id="media.image_update_fb" defaultMessage="!Update from Facebook" />
            </div>
            <div onClick={this.handleDeleteImg} className="tooltip-content">
              <FormattedMessage tagName="span" id="media.image_remove" defaultMessage="!Remove" />
            </div>
          </ReactTooltip>
        )}
        <TooltipWizzard
          visible={wizzardTooltip}
          onClose={this.handleTipClose}
          onAdminEnable={this.handleTipAdminEnable}
        />
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const enums = state.enums.get('enums').toJS()
  return {
    enums: (enums.Country && enums.Country.Country) || {},
    openMedia: state.media.get('open')
  }
}, {
  FETCH_MEDIA_LIST: MediaActions.FETCH_MEDIA_LIST,
  CREATE_BUSINESS: BusinessActions.CREATE_BUSINESS
})(HeaderDesktop))
