import PropTypes from 'prop-types'
import React from 'react'
import HeaderDesktop from './HeaderDesktop'
import HeaderMobile from './HeaderMobile'

const Header = ({
  isAdmin,
  isAdminPreviewMode,
  updatePreviewMode,
  updateBusinessInfo,
  onCreateNewCampaign,
  businessDetails,
  windowWidth
}) => (
  <div className="header">
    {windowWidth < 992 ? (
      <HeaderMobile
        isAdmin={isAdmin}
        businessDetails={businessDetails}
      />
    ) : (
      <HeaderDesktop
        isAdmin={isAdmin}
        isAdminPreviewMode={isAdminPreviewMode}
        updatePreviewMode={updatePreviewMode}
        businessDetails={businessDetails}
        updateBusinessInfo={updateBusinessInfo}
        onCreateNewCampaign={onCreateNewCampaign}
      />
    )}
  </div>
)

Header.propTypes = {
  isAdmin: PropTypes.bool,
  isAdminPreviewMode: PropTypes.bool,
  windowWidth: PropTypes.number,
  businessDetails: PropTypes.object,
  updatePreviewMode: PropTypes.func.isRequired,
  updateBusinessInfo: PropTypes.func.isRequired,
  onCreateNewCampaign: PropTypes.func.isRequired
}

export default Header
