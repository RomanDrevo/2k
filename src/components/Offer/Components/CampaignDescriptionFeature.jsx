import PropTypes from 'prop-types'
import React from 'react'
import TruncateText from 'react-text-truncate'
import * as viewModes from '../../../constants/view_modes'
import ReadMore from './CampaignReadMore'

const CampaignDescriptionFeature = ({
  viewMode, description, handleClickReadMore
}) => {
  const influencer = viewMode === viewModes.INFLUENCER
  const admin = viewMode === viewModes.ADMIN
  const lines = (influencer && 8) || (admin && 9) || 12

  return (
    <div className={`offer-cube__description${admin ? ' admin' : ''}`}>
      <TruncateText
        line={lines}
        truncateText={lines ? '...' : ''}
        text={description}
        textTruncateChild={<ReadMore onClick={handleClickReadMore} />}
      />
    </div>
  )
}

CampaignDescriptionFeature.propTypes = {
  viewMode: PropTypes.string,
  description: PropTypes.string,
  handleClickReadMore: PropTypes.func.isRequired
}

export default CampaignDescriptionFeature
