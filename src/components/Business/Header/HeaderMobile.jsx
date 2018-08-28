import PropTypes from 'prop-types'
import React from 'react'
import './HeaderMobile.css'
import { ClipImg } from '../../_common'
import { getLocationString } from '../../../_core/utils'

const HeaderMobile = ({ businessDetails }) => (
  <div className="mobile-view">
    {businessDetails.cover_media_url ? (
      <ClipImg
        className="cover-image"
        style={{ width: '100%' }}
        src={businessDetails.cover_media_url}
        x1={businessDetails.cover_x1}
        y1={businessDetails.cover_y1}
        x2={businessDetails.cover_x2}
        y2={businessDetails.cover_y2}
      />
    ) : (
      <img src="http://via.placeholder.com/350x150" className="cover-image" alt={businessDetails.description} />
    )}
    <div className="container-fluid">
      <div className="row meta-info">
        {businessDetails.profile_media_url ? (
          <ClipImg
            className="profile-image"
            src={businessDetails.profile_media_url}
            x1={businessDetails.profile_x1}
            y1={businessDetails.profile_y1}
            x2={businessDetails.profile_x2}
            y2={businessDetails.profile_y2}
          />
        ) : (
          <img src="http://via.placeholder.com/150x150" className="profile-image" alt={businessDetails.description} />
        )}
        <div className="business-cover">
          <h2>{businessDetails.name}</h2>
          <h3>{getLocationString(businessDetails)}</h3>
        </div>
      </div>
    </div>
  </div>
)

HeaderMobile.propTypes = {
  businessDetails: PropTypes.object
}

export default HeaderMobile
