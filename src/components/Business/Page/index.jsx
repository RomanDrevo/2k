import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import {
  BusinessActions, CampaignActions, PendingActions, ProductActions
} from '../../../_redux'
import { detectInactiveOffer, getLocationObjFromString, getLocationString } from '../../../_core/utils'
import { GOOGLE_MAP_API_KEY } from '../../../constants/api_keys'
import GoogleMap from '../../_common/GoogleMap'
import '../../../styles/global.css'
import loadingImg from '../../../loading.svg'
import './BusinessPage.css'
import Header from '../Header'
import OfferCubeGrid from '../../Offer/OfferCubeGrid'
import Onboarding from '../Onboarding'
import Faq from './Faq'

const mapStateToProps = (state, props) => {
  const offers = state.campaign.get('campaigns').toList().toJS()
  const onboarding = props.match.params.join === 'join'
  const focusedCampaign = state.campaign.get('campaign').toJS()
  const activeOffers = onboarding
    ? [...offers].filter((offer) => !detectInactiveOffer(offer))
      .filter((item) => item.id !== focusedCampaign.id)
    : [...offers].filter((offer) => !detectInactiveOffer(offer))
  const inactiveOffers = [...offers].filter((offer) => detectInactiveOffer(offer))
  // console.log(activeOffers, inactiveOffers)
  const businessDetails = state.business.get('businessDetails').toJS().business
  const businessList = state.business.get('businessList').toJS()
  const isAdmin = businessDetails && businessDetails.id && Boolean(businessList[businessDetails.id])
  return {
    loading: state.business.get('loading'),
    businessDetails,
    focusedCampaign,
    activeOffers,
    inactiveOffers,
    isAdmin,
    onboarding,
    windowWidth: state.general.get('windowWidth'),
    isMobile: state.general.get('isMobile')
  }
}

const mapDispatchToProps = {
  FETCH_BUSINESS_DETAILS: BusinessActions.FETCH_BUSINESS_DETAILS,
  UPDATE_BUSINESS_INFO: BusinessActions.UPDATE_BUSINESS_INFO,
  FETCH_CAMPAIGNS: CampaignActions.FETCH_CAMPAIGNS,
  UPDATE_CAMPAIGN: CampaignActions.UPDATE_CAMPAIGN,
  SET_EDIT_CAMPAIGN_ID: CampaignActions.SET_EDIT_CAMPAIGN_ID,
  OPEN_CAMPAIGN_CREATE_MODAL: CampaignActions.OPEN_CAMPAIGN_CREATE_MODAL,
  FETCH_PRODUCT_LIST: ProductActions.FETCH_PRODUCT_LIST,
  FETCH_PENDINGS: PendingActions.FETCH_PENDINGS,
  FETCH_CAMPAIGN: CampaignActions.FETCH_CAMPAIGN,
  FETCH_BUSINESS_AUDIENCES: BusinessActions.FETCH_BUSINESS_AUDIENCES
}

class BusinessPage extends Component {
  static propTypes = {
    handle: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    loading: PropTypes.bool,
    onboarding: PropTypes.bool,
    isAdmin: PropTypes.bool,
    isMobile: PropTypes.bool,
    windowWidth: PropTypes.number,
    businessDetails: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    focusedCampaign: PropTypes.object,
    intl: PropTypes.object.isRequired,
    activeOffers: PropTypes.array,
    inactiveOffers: PropTypes.array,
    FETCH_BUSINESS_DETAILS: PropTypes.func.isRequired,
    FETCH_CAMPAIGN: PropTypes.func.isRequired,
    FETCH_CAMPAIGNS: PropTypes.func.isRequired,
    FETCH_PRODUCT_LIST: PropTypes.func.isRequired,
    FETCH_PENDINGS: PropTypes.func.isRequired,
    SET_EDIT_CAMPAIGN_ID: PropTypes.func.isRequired,
    UPDATE_CAMPAIGN: PropTypes.func.isRequired,
    UPDATE_BUSINESS_INFO: PropTypes.func.isRequired,
    OPEN_CAMPAIGN_CREATE_MODAL: PropTypes.func.isRequired,
    FETCH_BUSINESS_AUDIENCES: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    selectedTab: this.props.match.params.join === 'join' ? 'offers' : 'about',
    isContactEditEnabled: false,
    isAboutEditEnabled: false,
    isAdminPreviewMode: true,
    business: this.props.businessDetails || {},
    changes: {},
    onboardingModal: this.props.onboarding
  }

  componentWillMount() {
    if (this.props.onboarding) {
      const {
        FETCH_CAMPAIGN,
        FETCH_BUSINESS_DETAILS,
        FETCH_CAMPAIGNS,
        match: { params: { business_id, campaign_id } } = this.props
      } = this.props
      console.log('business_id', business_id)
      if (!this.context.auth.isAuthenticated()) {
        this.context.auth.generateGuestToken()
          .then(() => {
            FETCH_BUSINESS_DETAILS(business_id)
            FETCH_CAMPAIGN(campaign_id)
            FETCH_CAMPAIGNS(business_id)
          })
      } else {
        FETCH_BUSINESS_DETAILS(business_id)
        FETCH_CAMPAIGN(campaign_id)
        FETCH_CAMPAIGNS(business_id)
      }
    } else {
      this.initBusinessPage(this.props.match.params.handle)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loading } = this.props
    if (loading && !nextProps.loading) {
      this.setState({ loading: false })
    }
    if (this.props.match.params.handle !== nextProps.match.params.handle) {
      this.setState({ loading: true })
      this.initBusinessPage(
        nextProps.match.params.handle,
        nextProps.isAdmin
      )
    }
    if (!this.props.isAdmin && nextProps.isAdmin) {
      this.props.FETCH_PENDINGS(nextProps.businessDetails.id)
      this.props.FETCH_BUSINESS_AUDIENCES(nextProps.businessDetails.id)
    }
  }

  getOffersEmptyMessage = () => {
    const { isAdmin, intl: { formatMessage } } = this.props
    return isAdmin
      ? formatMessage({
        id: 'business.no_active_offers', defaultMessage: '!No Active Offers Yet. Start Making Some!'
      }) : formatMessage({
        id: 'business.no_available_offers', defaultMessage: '!No Offers Available at this Moment.'
      })
  }

  initBusinessPage(handle, isAdmin) {
    // const businessId = this.props.location.state
    const {
      FETCH_BUSINESS_DETAILS,
      FETCH_CAMPAIGNS,
      FETCH_PRODUCT_LIST,
      FETCH_PENDINGS,
      FETCH_BUSINESS_AUDIENCES
    } = this.props
    // if (!businessId) {
    Promise.resolve(FETCH_BUSINESS_DETAILS(handle)
    // .catch(loadingSetter(STATE_STATUS_LOADING_FAILED))
      .then(({ business }) => {
        this.setState({ business })
        if (isAdmin) {
          FETCH_PENDINGS(business.id)
          FETCH_BUSINESS_AUDIENCES(business.id)
        }
        FETCH_PRODUCT_LIST(business.id)
        FETCH_CAMPAIGNS(business.id)
      }))
    // } else {
    //   Promise.resolve(FETCH_BUSINESS_DETAILS(handle)
    //     // .catch(loadingSetter(STATE_STATUS_LOADING_FAILED))
    //     .then(({ business }) => {
    //       this.setState({ business })
    //     }))
    //
    //   FETCH_PRODUCT_LIST(businessId)
    //   FETCH_PENDINGS(businessId)
    //   FETCH_CAMPAIGNS(businessId)
    // }
  }

  handleBusinessChange = (e) => {
    const business = { ...this.state.business }
    const changes = { ...this.state.changes }
    business[e.target.name] = e.target.value
    changes[e.target.name] = e.target.value
    this.setState({ business, changes })
  }

  handleSaveClick = (e) => {
    e.stopPropagation()
    const changes = { ...this.state.changes }
    const { businessLocation } = changes
    delete changes.businessLocation
    if (businessLocation) {
      this.sendUpdateRequest({
        ...changes,
        ...getLocationObjFromString(businessLocation)
      })
    } else {
      this.sendUpdateRequest(changes)
    }
    this.setState({ isContactEditEnabled: false, isAboutEditEnabled: false })
  }

  handleOnboardingClose = () => this.setState({ onboardingModal: false, faq: true })

  handleFaqClose = () => this.setState({ faq: false })

  handleEditClick = () => this.setState({ isContactEditEnabled: true })

  sendUpdateRequest = (objField) => {
    const { businessDetails, UPDATE_BUSINESS_INFO } = this.props
    const newObj = { ...objField, id: businessDetails.id, business_id: businessDetails.id }
    Promise.resolve(UPDATE_BUSINESS_INFO(newObj))
      .then(({ business }) => this.setState({ changes: {}, business }))
  }

  updatePreviewMode = (e) => {
    this.setState({
      isAdminPreviewMode: e.target.checked
    })
  }

  handleEditOffer = (campaignId) => {
    this.props.SET_EDIT_CAMPAIGN_ID(campaignId)
  }

  handleCreateCampaign = () => {
    this.props.OPEN_CAMPAIGN_CREATE_MODAL(true)
  }

  selectOffers = () => this.setState({ selectedTab: 'offers' })

  selectAbout = () => this.setState({ selectedTab: 'about' })

  selectContact = () => this.setState({ selectedTab: 'contact' })

  renderMobileContent() {
    const { selectedTab } = this.state
    let out

    switch (selectedTab) {
    case 'offers':
      out = this.renderMobileOfferCubeGrid()
      break
    case 'about':
      out = this.renderMobileAbout()
      break
    case 'contact':
      out = this.renderMobileContactInfo()
      break
    default:
      return null
    }

    return (
      <div className="container show-mobile">
        {this.renderMobileTabs()}
        {out}
      </div>
    )
  }

  renderMobileOfferCubeGrid() {
    const {
      activeOffers, onboarding, focusedCampaign, UPDATE_CAMPAIGN
    } = this.props
    return (
      <div className="offer-cube-grid">
        {onboarding && (
          <div>
            <OfferCubeGrid
              offers={[focusedCampaign]}
              isAdmin={this.props.isAdmin}
              handleEditOffer={this.handleEditOffer}
              isAdminPreviewMode={this.state.isAdminPreviewMode}
              emptyMessage={this.getOffersEmptyMessage()}
              updateCampaign={UPDATE_CAMPAIGN}
            />
            {this.state.faq && <Faq isMobile onClose={this.handleFaqClose} />}
            <FormattedMessage tagName="h5" id="business.active_capmaigns" defaultMessage="!Active Campaigns" />
          </div>
        )}
        <OfferCubeGrid
          offers={activeOffers}
          isAdmin={this.props.isAdmin}
          handleEditOffer={this.handleEditOffer}
          isAdminPreviewMode={this.state.isAdminPreviewMode}
          emptyMessage={this.getOffersEmptyMessage()}
          updateCampaign={UPDATE_CAMPAIGN}
        />
        {this.renderMobileInactiveOfferCubeGrid()}
      </div>
    )
  }

  renderMobileInactiveOfferCubeGrid() {
    const { inactiveOffers, UPDATE_CAMPAIGN } = this.props
    const { isAdminPreviewMode } = this.state
    if (!inactiveOffers || inactiveOffers.length === 0 || !isAdminPreviewMode) {
      return null
    }

    return (
      <div>
        <FormattedMessage tagName="h5" id="business.ended_paused" defaultMessage="!Ended / Paused Campaigns" />
        <OfferCubeGrid
          offers={inactiveOffers}
          isAdmin={this.props.isAdmin}
          handleEditOffer={this.handleEditOffer}
          isAdminPreviewMode={isAdminPreviewMode}
          updateCampaign={UPDATE_CAMPAIGN}
        />
      </div>
    )
  }

  renderMobileContactInfo() {
    if (this.state.isContactEditEnabled) {
      return this.renderEditMobileContactInfo()
    }
    const { businessDetails } = this.props
    const { business } = this.state

    return (
      <div className="contact-wrapper">
        <FormattedMessage tagName="h4" id="business.contact_info" defaultMessage="!Contact info" />
        <ul className="contact-list">
          <li
            className="contact-list-phone-number"
          >{business.contact_phone_number || businessDetails.contact_phone_number}
          </li>
          <li className="contact-list-email">{business.contact_email || businessDetails.contact_email}</li>
          <li className="contact-list-website">
            <a href={business.website || businessDetails.website} data-outside="">
              {business.website || businessDetails.website}
            </a>
          </li>
          <li className="contact-list-address">{business.businessLocation || getLocationString(businessDetails)}</li>
        </ul>
        {this.props.isAdmin ? (
          <a onClick={this.handleEditClick} className="edit-save">
            <FormattedMessage id="main.edit" defaultMessage="!Edit" />
          </a>
        ) : null}
        {this.renderGoogleMaps()}
      </div>
    )
  }

  renderGoogleMaps() {
    const { businessDetails } = this.props
    const visible = typeof (businessDetails.location_lat) === 'number'
      && typeof (businessDetails.location_long) === 'number'
    return (
      <GoogleMap
        isMarkerShown
        markerCoordinates={{
          lat: businessDetails.location_lat,
          lng: businessDetails.location_long
        }}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${GOOGLE_MAP_API_KEY}`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '400px', margin: '20px 0' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        visible={visible}
      />
    )
  }

  renderEditMobileContactInfo() {
    const { businessDetails, intl: { formatMessage } } = this.props
    const { business } = this.state
    return (
      <div className="contact-wrapper">
        <ul className="contact-list">
          <li className="contact-list-phone-number">
            <input
              className="contact-list-edit"
              type="text"
              name="contact_phone_number"
              placeholder={formatMessage({ id: 'business.phone', defaultMessage: '!Phone' })}
              value={business.contact_phone_number || businessDetails.contact_phone_number || ''}
              onChange={this.handleBusinessChange}
            />
          </li>
          <li className="contact-list-email">
            <input
              className="contact-list-edit"
              type="text"
              name="contact_email"
              placeholder={formatMessage({ id: 'business.mail', defaultMessage: '!Mail' })}
              value={business.contact_email || businessDetails.contact_email || ''}
              onChange={this.handleBusinessChange}
            />
          </li>
          <li className="contact-list-website">
            <input
              className="contact-list-edit"
              type="text"
              name="website"
              placeholder={formatMessage({ id: 'business.website', defaultMessage: '!Website' })}
              value={business.website || businessDetails.website || ''}
              onChange={this.handleBusinessChange}
            />
          </li>
          <li className="contact-list-address">
            <input
              className="contact-list-edit"
              type="text"
              name="businessLocation"
              placeholder={formatMessage({ id: 'business.full_adress', defaultMessage: '!Full adress' })}
              value={business.businessLocation || getLocationString(businessDetails) || ''}
              onChange={this.handleBusinessChange}
            />
          </li>
        </ul>
        <a onClick={this.handleSaveClick} className="edit-save">
          <FormattedMessage id="main.save" defaultMessage="!Save" />
        </a>
        {this.renderGoogleMaps()}
      </div>
    )
  }

  renderMobileAbout() {
    if (this.state.isAboutEditEnabled) {
      return this.renderEditMobileAbout()
    }
    const { businessDetails } = this.props
    const { business } = this.state

    return (
      <div className="about-wrapper">
        <FormattedMessage tagName="h4" id="business.story" defaultMessage="!Story" />
        <p>{business.description || businessDetails.description}</p>

        {this.props.isAdmin ? (
          <a onClick={this.handleEditClick} className="edit-save">
            <FormattedMessage id="main.edit" defaultMessage="!Edit" />
          </a>
        ) : null}
      </div>
    )
  }

  renderEditMobileAbout() {
    const { businessDetails, intl: { formatMessage } } = this.props
    const { business } = this.state

    return (
      <div className="about-wrapper">
        <textarea
          name="description"
          placeholder={formatMessage({
            id: 'business.description',
            defaultMessage: '!Founded: YearDescription about your business and it\'s dervices'
          })}
          value={business.description || businessDetails.description || ''}
          onChange={this.handleBusinessChange}
          rows="5"
        />
        <a onClick={this.handleSaveClick} className="edit-save">
          <FormattedMessage id="main.save" defaultMessage="!Save" />
        </a>
      </div>
    )
  }

  renderMobileTabs() {
    return (
      <ul className="tabs">
        <li>
          <span className={this.state.selectedTab === 'offers' ? 'active-tab' : 'inactive-tab'} />
          <a onClick={this.selectOffers}>
            <FormattedMessage id="business.tab_offers" defultMessage="!Offers" />
          </a>
        </li>
        <li>
          <span className={this.state.selectedTab === 'about' ? 'active-tab' : 'inactive-tab'} />
          <a onClick={this.selectAbout}>
            <FormattedMessage id="business.tab_about" defultMessage="!About" />
          </a>
        </li>
        <li>
          <span className={this.state.selectedTab === 'contact' ? 'active-tab' : 'inactive-tab'} />
          <a onClick={this.selectContact}>
            <FormattedMessage id="business.tab_contact" defultMessage="!Contact" />
          </a>
        </li>
      </ul>
    )
  }

  renderDesktopOfferCubeGrid() {
    const {
      activeOffers, focusedCampaign, onboarding, UPDATE_CAMPAIGN, isAdmin
    } = this.props
    return (
      <div className="offer-cube-grid hide-mobile">
        {onboarding && (
          <div>
            <OfferCubeGrid
              isActive
              offers={[focusedCampaign]}
              handleEditOffer={this.handleEditOffer}
              isAdmin={isAdmin}
              isAdminPreviewMode={this.state.isAdminPreviewMode}
              emptyMessage={this.getOffersEmptyMessage()}
              updateCampaign={UPDATE_CAMPAIGN}
            />
            {this.state.faq && <Faq onClose={this.handleFaqClose} />}
            <div className="container no-padding">
              <FormattedMessage tagName="h5" id="business.active_capmaigns" defaultMessage="!Active Campaigns" />
            </div>
          </div>
        )}
        <OfferCubeGrid
          isActive={!onboarding}
          offers={activeOffers}
          handleEditOffer={this.handleEditOffer}
          isAdmin={isAdmin}
          isAdminPreviewMode={this.state.isAdminPreviewMode}
          emptyMessage={this.getOffersEmptyMessage()}
          updateCampaign={UPDATE_CAMPAIGN}
        />
        {!onboarding && this.renderDesktopInactiveOfferCubeGrid()}
      </div>
    )
  }

  renderDesktopInactiveOfferCubeGrid() {
    const { inactiveOffers, UPDATE_CAMPAIGN, intl: { formatMessage } } = this.props
    const { isAdminPreviewMode } = this.state

    if (!inactiveOffers || inactiveOffers.length === 0 || !isAdminPreviewMode) return null
    return (
      <div className="offer-cube-grid hide-mobile">
        <div className="container no-padding">
          <FormattedMessage tagName="h5" id="business.ended_paused" defaultMessage="!Ended / Paused Campaigns" />
        </div>
        <OfferCubeGrid
          isAdmin={this.props.isAdmin}
          offers={inactiveOffers}
          isAdminPreviewMode={isAdminPreviewMode}
          handleEditOffer={this.handleEditOffer}
          emptyMessage={formatMessage({
            id: 'business.no_ended_offers', defaultMessage: '!No history, start making some!'
          })}
          updateCampaign={UPDATE_CAMPAIGN}
        />
      </div>
    )
  }

  render() {
    const {
      isAdmin, isMobile, businessDetails = {}, history: { push }, UPDATE_BUSINESS_INFO
    } = this.props
    const { loading, onboardingModal } = this.state
    if (!onboardingModal && (Object.keys(businessDetails).length <= 0 || loading)) {
      return <img className="loader" src={loadingImg} alt="" />
    }
    if (onboardingModal && !this.context.auth.isAuthenticated()) {
      return <img className="loader" src={loadingImg} alt="" />
    }

    return (
      <div className={`business-page container-fluid${this.state.onboardingModal ? ' onboarding' : ''}`}>
        <Header
          isAdmin={isAdmin}
          isAdminPreviewMode={this.state.isAdminPreviewMode}
          updatePreviewMode={this.updatePreviewMode}
          businessDetails={businessDetails}
          updateBusinessInfo={UPDATE_BUSINESS_INFO}
          onCreateNewCampaign={this.handleCreateCampaign}
          windowWidth={this.props.windowWidth}
        />
        {this.renderMobileContent()}
        {this.renderDesktopOfferCubeGrid()}
        <Onboarding
          onRequestClose={this.handleOnboardingClose}
          isOpen={onboardingModal}
          isMobile={isMobile}
          push={push}
        />
      </div>
    )
  }
}

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BusinessPage)))
