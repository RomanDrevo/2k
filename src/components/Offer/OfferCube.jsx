import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import CampaignAdminMeta from './Components/CampaignAdminMeta'
import CampaignDate from './Components/CampaignDate'
import CampaignDescription from './Components/CampaignDescription'
import CampaignDescriptionFeature from './Components/CampaignDescriptionFeature'
import CampaignFullDescription from './Components/CampaignFullDescription'
import CampaignHeadline from './Components/CampaignHeadline'
import CampaignInfluencerButtons from './Components/CampaignInfluencerButtons'
import CampaignInfluencerMeta from './Components/CampaignInfluencerMeta'
import CampaignOwnerButtons from './Components/CampaignOwnerButtons'
import CampaignRecomendButtons from './Components/CampaignRecomendButtons'
import CampaignTile from './Components/CampaignTile'
import * as userRoles from '../../constants/user_roles'
import * as viewModes from '../../constants/view_modes'
import { Auth } from '../../Auth/Auth'
import './OfferCube.css'

class OfferCube extends React.PureComponent {
  static propTypes = {
    isInactive: PropTypes.bool,
    isMobile: PropTypes.bool,
    isFeatured: PropTypes.bool,
    isAdminPreviewMode: PropTypes.bool,
    windowWidth: PropTypes.number,
    offer: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    userMetadata: PropTypes.object.isRequired,
    recommendLoading: PropTypes.object,
    handleEdit: PropTypes.func,
    updateCampaign: PropTypes.func,
    recommendCampaign: PropTypes.func.isRequired,
    likeCampaign: PropTypes.func.isRequired,
    dislikeCampaign: PropTypes.func.isRequired,
    FETCH_CAMPAIGN_INFLUENCER_RESULTS: PropTypes.func.isRequired,
    SET_CAMPAIGN_DATA: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.instanceOf(Auth)
  }

  state = {
    showFullDescription: '',
    showRecommendOptions: ''
  }

  getViewMode = () => {
    const { offer: { user_role: role }, isAdminPreviewMode } = this.props
    const viewMode =
      ((role === userRoles.OWNER || role === userRoles.ADVERTISER)
        && isAdminPreviewMode && viewModes.ADMIN)
      || (role === userRoles.INFLUENCER && viewModes.INFLUENCER)
      || viewModes.GUEST
    return viewMode
  }

  getPriceInfo = (viewMode) => {
    const { offer, intl: { formatMessage, formatNumber } } = this.props
    console.log('offerrrr: ', offer)
    switch (viewMode) {
    case viewModes.ADMIN:
      return formatMessage(
        {
          id: 'campaign_tile.owner_tile',
          defaultMessage: '!CPL - {amount}'
        },
        {
          amount: formatNumber((offer.average_paid_cpa || 0), {
            style: 'currency',
            currency: offer.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })
        }
      )
      // return `CPL - ${offer.average_paid_cpa || 0}${currencyDict[offer.currency]}`
    case viewModes.INFLUENCER:
    case viewModes.GUEST:
      return formatMessage(
        {
          id: 'campaign_tile.not_owner_tile',
          defaultMessage: '!{amount} Per Lead'
        },
        {
          amount: formatNumber((offer.bid_amount || 0), {
            style: 'currency',
            currency: offer.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })
        }
      )
      // return `${offer.bid_amount || 0}${currencyDict[offer.currency]} Per Lead`
    default:
      return null
    }
  }

  getTileProps = (viewMode) => {
    const { offer, userMetadata: { liked_campaign_ids = {} } } = this.props

    return {
      viewMode,
      campaign: offer,
      role: offer.user_role,
      favorite: liked_campaign_ids[offer.id],
      priceInfo: this.getPriceInfo(viewMode),
      handleAddFavorite: this.handleLikeClick
    }
  }

  getDescriptionProps = (viewMode) => {
    const { offer, windowWidth } = this.props
    return {
      viewMode,
      description: offer.description,
      handleClickReadMore: this.handleClickReadMore,
      tags: offer.tags,
      role: offer.user_role,
      windowWidth
    }
  }

  getButtonsProps = (viewMode) => {
    const { offer, isInactive, recommendLoading } = this.props
    const { showRecommendOptions, showFullDescription } = this.state

    if (viewMode === viewModes.INFLUENCER) {
      return {
        isInactive,
        handleRecomendClick: this.handleClickRecommend,
        handleResultsClick: this.handleResultsClick,
        offer,
        showRecommendOptions,
        showFullDescription,
        handleBackClick: this.handleClickOutside
      }
    } else if (viewMode === viewModes.ADMIN) {
      return {
        isInactive,
        handlePublishClick: this.handlePublishClick,
        handleEditClick: this.handleEditClick,
        handleActivateClick: this.handleActivateClick
      }
    }
    return {
      offer,
      isInactive,
      loading: recommendLoading[offer.id],
      showRecommendOptions,
      showFullDescription,
      handleClickRecommend: this.handleClickRecommend,
      handleSocialClick: this.handleSocialClick,
      handleBackClick: this.handleClickOutside
    }
  }

  handleClickOutside = () => {
    if (this.state.showRecommendOptions) {
      this.setState({ showRecommendOptions: '' })
    }
  }

  handleSocialClick = (e) => {
    e.stopPropagation()
  }

  handleClickReadMore = () => {
    this.setState({ showFullDescription: 'flipped' })
  }

  handleClickBack = () => this.setState({ showFullDescription: '' })

  handleEditClick = () => {
    this.props.handleEdit(this.props.offer.id)
  }

  handleActivateClick = () => {
    console.log('ACTIVATE')
  }

  handleClickRecommend = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { offer } = this.props
    if (!offer.twokey_link) {
      const body = JSON.stringify({
        business_id: offer.business_id,
        campaign_id: offer.id
      })
      // console.log(this.context.auth.isAuthenticated())
      this.props.recommendCampaign(body)
    } else {
      this.setState({ showRecommendOptions: 'showRecommendOptions' })
    }
  }

  handlePublishClick = () => {
    const offer = { ...this.props.offer, is_public: true, tags: this.props.offer.tags.join(',') }
    console.log(offer.id, offer)
    this.props.updateCampaign(offer.id, offer)
  }

  handleLikeClick = () => {
    const { userMetadata: { liked_campaign_ids } } = this.props
    if (liked_campaign_ids && liked_campaign_ids[this.props.offer.id]) {
      this.props.dislikeCampaign(this.props.offer.id)
    } else {
      this.props.likeCampaign(this.props.offer.id)
    }
  }

  handleResultsClick = () => {
    const { offer } = this.props
    this.props.SET_CAMPAIGN_DATA(offer)
    this.props.FETCH_CAMPAIGN_INFLUENCER_RESULTS(
      offer.id,
      offer.start_date,
      offer.end_date
    )
  }

  render() {
    const {
      offer, isInactive, isAdminPreviewMode, isMobile, windowWidth
    } = this.props
    const { showRecommendOptions, showFullDescription } = this.state
    const smokedOut = isInactive ? 'offer-cube_header offer-cube--smoked-out' : 'offer-cube_header'
    const greenBorder = offer.user_role === userRoles.INFLUENCER ? 'offer-cube--green-border' : ''
    const viewMode = this.getViewMode()
    const isFeatured = this.props.isFeatured && windowWidth > 991
    return (
      <div className={`offer-cube${isFeatured && !isMobile ? ' featured' : ''}`}>
        <div className={`offer-cube__card ${showFullDescription} ${greenBorder}`}>
          {showFullDescription ? (
            <figure className={`offer-cube__card-back ${smokedOut}`}>
              <CampaignFullDescription
                description={offer.description}
                handleClickBack={this.handleClickBack}
              >
                <CampaignDate
                  offer={offer}
                  showRecommendOptions={showRecommendOptions}
                  isInactive={isInactive}
                />
              </CampaignFullDescription>
            </figure>
          ) : (
            <figure className="offer-cube__card-front">
              <div className={`${isFeatured && !isMobile ? 'featured-cube' : ''} relative cube`}>
                <div className={`${smokedOut}`}>
                  <CampaignTile {...this.getTileProps(viewMode)} />
                  {(!isFeatured || isMobile) && (<CampaignHeadline headline={offer.headline} />)}
                  {(!isFeatured || isMobile) && (
                    <CampaignDescription {...this.getDescriptionProps(viewMode)} />
                  )}
                  {(!isFeatured || isMobile) && viewMode === viewModes.ADMIN && (
                    <CampaignAdminMeta offer={offer} isAdminPreviewMode={isAdminPreviewMode} />
                  )}
                  {(!isFeatured || isMobile) && viewMode === viewModes.INFLUENCER && (
                    <CampaignInfluencerMeta offer={offer} />
                  )}
                  {(!isFeatured || isMobile)
                    && viewMode === viewModes.GUEST && offer.tags && offer.tags.length ? (
                      <div className="offer-cube__tags">{offer.tags.map((tag) => `#${tag}`).join(' ')}</div>
                    ) : null}
                </div>
                <div className="offer-cube_footer">
                  {viewMode === viewModes.INFLUENCER && (
                    <CampaignInfluencerButtons {...this.getButtonsProps(viewMode)} />
                  )}
                  {viewMode === viewModes.ADMIN && (
                    <CampaignOwnerButtons {...this.getButtonsProps(viewMode)} />
                  )}
                  {viewMode === viewModes.GUEST && (
                    <CampaignRecomendButtons {...this.getButtonsProps(viewMode)} />
                  )}
                  <CampaignDate
                    offer={offer}
                    showRecommendOptions={showRecommendOptions}
                    isInactive={isInactive}
                  />
                </div>
              </div>
              {isFeatured && !isMobile && (
                <div className="meta-column">
                  <CampaignHeadline headline={offer.headline} />
                  <CampaignDescriptionFeature {...this.getDescriptionProps(viewMode)} />
                  <div className="meta-footer">
                    {viewMode === viewModes.ADMIN && (
                      <CampaignAdminMeta offer={offer} isAdminPreviewMode={isAdminPreviewMode} />
                    )}
                    {viewMode === viewModes.INFLUENCER && (
                      <CampaignInfluencerMeta offer={offer} />
                    )}
                    {viewMode === viewModes.GUEST && offer.tags && offer.tags.length ? (
                      <div className="offer-cube__tags">{offer.tags.map((tag) => `#${tag}`).join(' ')}</div>
                    ) : null}
                  </div>
                </div>
              )}
            </figure>
          )}
        </div>
      </div>
    )
  }
}

export default injectIntl(OfferCube)
