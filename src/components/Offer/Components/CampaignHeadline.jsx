import PropTypes from 'prop-types'
import React from 'react'
import { shortenString } from '../../../_core/utils'

const CampaignHeadline = ({ headline = '' }) => {
  const text = headline.length > 65 ? `${shortenString(headline, 100)}` : headline
  return (
    <h2 className="offer-cube__headline">{text}</h2>
  )
}

CampaignHeadline.propTypes = {
  headline: PropTypes.string
}

export default CampaignHeadline
