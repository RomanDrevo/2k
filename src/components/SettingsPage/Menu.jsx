import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import swal from 'sweetalert2'
import './menu.css'

class Menu extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    style: PropTypes.object,
    intl: PropTypes.object.isRequired,
    // history: PropTypes.object.isRequired,
    onLinkClick: PropTypes.func
  }

  static contextTypes = {
    auth: PropTypes.object
  }

  onLogout = () => {
    const { intl: { formatMessage } } = this.props
    swal({
      title: formatMessage({ id: 'settings.logout_confirm', defaultMessage: '!Are you sure you want to log out?' }),
      showCancelButton: true,
      cancelButtonText: formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' }),
      confirmButtonText: formatMessage({ id: 'menu.logout', defaultMessage: '!Logout' }),
      confirmButtonClass: 'btn black-color swal transparent',
      cancelButtonClass: 'btn black-color swal transparent',
      customClass: 'border-green'
    }).then((res) => {
      if (res.value) {
        console.log('LOGOUT')
        this.context.auth.handleLogout()
        window.location.replace('https://home.2key.network/')
      }
    })
  }

  render() {
    const { style, isMobile, onLinkClick } = this.props

    return (
      <div style={style} className={`settings-menu-container ${isMobile ? ' mobile' : ''}`}>
        <div>
          <NavLink className="menu-item" activeClassName="selected" to="/settings/profile" onClick={onLinkClick}>
            <FormattedMessage id="settings.profile" defaultMessage="!Profile Settings" />
          </NavLink>
        </div>
        <div>
          <NavLink className="menu-item" activeClassName="selected" to="/settings/payment" onClick={onLinkClick}>
            <FormattedMessage id="settings.payment_options" defaultMessage="!Payment Options" />
          </NavLink>
        </div>
        <div>
          <NavLink className="menu-item" activeClassName="selected" to="/settings/notification" onClick={onLinkClick}>
            <FormattedMessage id="settings.notification_settings" defaultMessage="!Notification Settings" />
          </NavLink>
        </div>
        {!isMobile && <div style={{ height: 30 }} />}
        <div>
          <a className="menu-item" onClick={this.onLogout}>
            <FormattedMessage id="menu.logout" defaultMessage="!Logout" />
          </a>
        </div>
      </div>
    )
  }
}

export default withRouter(injectIntl(Menu))
