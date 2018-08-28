import PropTypes from 'prop-types'
import React from 'react'
import TruncateText from 'react-text-truncate'
import * as viewModes from '../../../constants/view_modes'
import ReadMore from './CampaignReadMore'

const CampaignDescription = ({
  viewMode, description, handleClickReadMore, tags = [], windowWidth
}) => {
  const influencer = viewMode === viewModes.INFLUENCER
  const admin = viewMode === viewModes.ADMIN
  let lines
  if (influencer && windowWidth > 991) {
    lines = 0
  } else if (influencer && windowWidth <= 375) {
    lines = 8
  } else if (influencer && windowWidth <= 420) {
    lines = 4
  } else if (influencer && windowWidth <= 500) {
    lines = 8
  } else if (influencer && windowWidth <= 575) {
    lines = 6
  } else if (influencer && windowWidth <= 767) {
    lines = 0
  } else if (influencer && windowWidth <= 991) {
    lines = 2
  } else if (!influencer && windowWidth <= 375) {
    lines = admin ? 8 : (tags.length > 0 && 10) || 11
  } else if (!influencer && windowWidth <= 420) {
    lines = admin ? 5 : (tags.length > 0 && 7) || 8
  } else if (!influencer && windowWidth <= 500) {
    lines = admin ? 10 : (tags.length > 0 && 12) || 13
  } else if (!influencer && windowWidth <= 575) {
    lines = admin ? 8 : (tags.length > 0 && 10) || 11
  } else if (!influencer && windowWidth <= 767) {
    lines = admin ? 1 : (tags.length > 0 && 3) || 4
  } else if (!influencer && windowWidth <= 991) {
    lines = admin ? 3 : (tags.length > 0 && 5) || 6
  } else {
    lines = admin ? 1 : (tags.length > 0 && 3) || 4
  }

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

CampaignDescription.propTypes = {
  windowWidth: PropTypes.number,
  viewMode: PropTypes.string,
  tags: PropTypes.array,
  description: PropTypes.string,
  handleClickReadMore: PropTypes.func.isRequired
}

export default CampaignDescription
