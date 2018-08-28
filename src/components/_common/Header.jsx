import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { UtilActions } from '../../_redux'
import logo from '../../2key-icon.svg'
import Menu from '../Menu/Menu'
import NotificationIcon from './NotificationIcon'
import ProfilePicture from './ProfilePicture'
import './header.css'

const mapStateToProps = (state) => ({
  isMenuVisible: state.general.get('isMenuVisible')
})

const mapDispatchToProps = {
  TOGGLE_MENU: UtilActions.TOGGLE_MENU
}

class AppHeader extends React.PureComponent {
  static propTypes = {
    isMenuVisible: PropTypes.bool,
    hideProfileName: PropTypes.bool,
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onProfileClick: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    TOGGLE_MENU: PropTypes.func.isRequired
  }
  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  close = () => {
    this.props.TOGGLE_MENU(false)
  }

  openMenu = () => {
    this.props.TOGGLE_MENU(true)
  }

  closeMenu = (e) => {
    if (!!e && !!e.preventDefault) {
      e.preventDefault()
    }
    this.props.TOGGLE_MENU(false)
  }

  render() {
    const { user, isMenuVisible } = this.props
    const { auth } = this.context

    return (
      <div>
        <div className="app-header fixed top-0 left-0 right-0">
          <div className={`js-overlay ${isMenuVisible ? 'visible' : ''}`} onClick={this.close} />
          <div className="app-header-inner container">
            <div className="top-bar-left" id="createWizzard-1" data-tip="wizzard" data-for="createWizzard">
              <button
                onClick={this.openMenu}
                type="button"
                className="float-left menu-button"
                data-target="#offCanvasMenu"
              >
                <span className="oi oi-menu" />
              </button>
            </div>
            <div className="top-bar-center">
              <Link to="/" className="App-logo">
                <img src={logo} alt="2key logo." />
              </Link>
            </div>
            <div className="top-bar-right">
              {auth.isAuthenticated() ? (
                <div className="d-flex justify-content-end align-items-center">
                  <div><NotificationIcon /></div>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    onClick={this.props.onProfileClick}
                  >
                    <div>
                      <ProfilePicture
                        size={30}
                        picture={user.profile_media_url}
                        first_name={user.first_name || user.given_name}
                        last_name={user.last_name || user.family_name}
                      />
                    </div>
                    {!this.props.hideProfileName && (
                      <div className="label user-name" id="label-user-name">
                        {user.first_name || user.given_name}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="d-flex justify-content-end align-items-center"
                  onClick={this.props.onLoginClick}
                >
                  <div>
                    <ProfilePicture
                      size={30}
                      picture={user.profile_media_url}
                      first_name={user.first_name || user.given_name}
                      last_name={user.last_name || user.family_name}
                    />
                  </div>
                  <div className="login-block d-none d-md-block">
                    <button className="header-login" onClick={this.props.onLoginClick}>
                      <FormattedMessage id="auth.login" defaultMessage="!Login" />
                    </button>
                    <span className="login-devision">|</span>
                    <button className="header-login header-signup" onClick={this.props.onSignupClick}>
                      <FormattedMessage id="auth.signup" defaultMessage="!Signup" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Menu
          visible={isMenuVisible}
          onMenuClose={this.closeMenu}
          onLogout={this.props.onLogout}
        />
      </div>

    )
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AppHeader))
