import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import CampaignShareItems from './CampaignShareItems'

const CampaignInfluencerButtons = ({
  isInactive, handleRecomendClick, handleResultsClick,
  offer, showFullDescription, showRecommendOptions, handleBackClick
}) =>
  (
    <div>
      <div className={`offer-cube__button-influencer${showRecommendOptions ? ' inactive' : ''}`}>
        <a
          onClick={handleRecomendClick}
          className={`button-publish-activate${isInactive ? ' inactive' : ''}`}
        >
          <FormattedMessage id="campaign_tile.recommend" defaultMessage="!Recommend" />
        </a>
        <a onClick={handleResultsClick} className="button-edit-results">
          <FormattedMessage id="campaign_tile.results" defaultMessage="!Results" />
        </a>
      </div>
      <CampaignShareItems
        offer={offer}
        showFullDescription={showFullDescription}
        showRecommendOptions={showRecommendOptions}
        handleBackClick={handleBackClick}
      />
    </div>
  )

CampaignInfluencerButtons.propTypes = {
  isInactive: PropTypes.bool,
  showRecommendOptions: PropTypes.string,
  showFullDescription: PropTypes.string,
  offer: PropTypes.object.isRequired,
  handleRecomendClick: PropTypes.func.isRequired,
  handleResultsClick: PropTypes.func.isRequired,
  handleBackClick: PropTypes.func.isRequired
}

export default injectIntl(CampaignInfluencerButtons)
