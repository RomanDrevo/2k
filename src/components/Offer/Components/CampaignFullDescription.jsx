import PropTypes from 'prop-types'
import React from 'react'

const CampaignFullDescription = ({ description, children, handleClickBack }) => (
  <div className="offer-cube__description offer-cube__description--back">
    <span onClick={handleClickBack} className="offer-cube__description__link-back" />
    <div className="offer-cube__description-text">
      {description}
    </div>
    {children}
  </div>
)

CampaignFullDescription.propTypes = {
  description: PropTypes.string,
  children: PropTypes.element,
  handleClickBack: PropTypes.func.isRequired
}

export default CampaignFullDescription
