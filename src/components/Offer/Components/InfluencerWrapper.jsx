import PropTypes from 'prop-types'
import React from 'react'

const InfluencerWrapper = ({ offer, children }) => (
  <div className="col-sm-12 col-md-6 col-xl-4 influencer-card-wrapper">
    <div className="influencer-card-title-wrapper">
      <div className="influencer-card-title-icon">
        <img src={offer.business_profile_media_url} alt="" />
      </div>
      <div className="influencer-card-title-name">{offer.business_name}</div>
    </div>
    {children}
  </div>
)

InfluencerWrapper.propTypes = {
  offer: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])
}

export default InfluencerWrapper
