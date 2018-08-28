import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import CampaignShareItems from './CampaignShareItems'

const CampaignRecomendButtons = (props) => {
  const {
    offer,
    isInactive,
    loading,
    showRecommendOptions,
    showFullDescription,
    handleClickRecommend,
    handleSocialClick,
    handleBackClick
  } = props
  const onClickRecommend = isInactive || loading ? null : handleClickRecommend
  const recommendButtonClass = isInactive ? 'offer-cube__recommend-inactive' : 'offer-cube__recommend'
  return (
    <div className="offer-cube__social" onClick={handleSocialClick}>
      <div
        key="recommend_button"
        onClick={onClickRecommend}
        className={`${recommendButtonClass} ${showRecommendOptions} ${loading ? 'loading' : ''}`}
      >
        {loading && (<i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />)}
        <FormattedMessage tagName="span" id="campaign_tile.recommend" defaultMessage="!Recommend" />
      </div>
      <CampaignShareItems
        offer={offer}
        showFullDescription={showFullDescription}
        showRecommendOptions={showRecommendOptions}
        handleBackClick={handleBackClick}
      />
    </div>
  )
}

CampaignRecomendButtons.propTypes = {
  offer: PropTypes.object,
  loading: PropTypes.bool,
  isInactive: PropTypes.bool,
  showRecommendOptions: PropTypes.string,
  showFullDescription: PropTypes.string,
  handleClickRecommend: PropTypes.func.isRequired,
  handleSocialClick: PropTypes.func.isRequired,
  handleBackClick: PropTypes.func.isRequired
}

export default injectIntl(CampaignRecomendButtons)
