import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import { ClipImg } from '../../_common'
import './menu.css'

const Menu = ({ style, onLinkClick, businessDetails }) => (
  <div style={style} className="settings-menu-container">
    <div className="business-logo mb3">
      <div className="logo-wrapper">
        <ClipImg
          src={businessDetails.profile_media_url}
          x1={businessDetails.profile_x1}
          y1={businessDetails.profile_y1}
          x2={businessDetails.profile_x2}
          y2={businessDetails.profile_y2}
        />
      </div>
      <div className="flex items-center pl2">
        {businessDetails.name}
      </div>
    </div>
    <div>
      <NavLink
        className="menu-item"
        activeClassName="selected"
        to={`/business/${businessDetails.handle}/settings`}
        onClick={onLinkClick}
      >
        <FormattedMessage id="business_settings.information" defaultMessage="!Business Information" />
      </NavLink>
    </div>

    <div>
      <NavLink
        className="menu-item"
        activeClassName="selected"
        to={`/business/${businessDetails.id}/settings/payment-methods`}
        onClick={onLinkClick}
      >
        <FormattedMessage id="business_settings.payment_methods" defaultMessage="!Payment Methods" />
      </NavLink>
    </div>

    <div>
      <NavLink
        className="menu-item"
        activeClassName="selected"
        to={`/business/${businessDetails.id}/settings/business-invoices`}
        onClick={onLinkClick}
      >
        <FormattedMessage id="business_settings.invoices" defaultMessage="!Invoices" />
      </NavLink>
    </div>

    <div>
      <NavLink
        className="menu-item"
        activeClassName="selected"
        to={`/business/${businessDetails.id}/settings/account-roles`}
        onClick={onLinkClick}
      >
        <FormattedMessage id="business_settings.account_roles" defaultMessage="!Account Roles" />
      </NavLink>
    </div>
    <div>
      <NavLink
        className="menu-item"
        activeClassName="selected"
        to={`/business/${businessDetails.id}/settings/notifications`}
        onClick={onLinkClick}
      >
        <FormattedMessage id="business_settings.notification_settings" defaultMessage="!Notification Settings" />
      </NavLink>
    </div>
  </div>
)

Menu.propTypes = {
  style: PropTypes.object,
  onLinkClick: PropTypes.func,
  businessDetails: PropTypes.object.isRequired
}

export default withRouter(injectIntl(Menu))
