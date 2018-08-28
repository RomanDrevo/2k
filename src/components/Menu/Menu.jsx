import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import React from 'react'
import './Menu.css'
import activity from '../../icons/activity.svg'
import audiences from '../../icons/audiences.svg'
import balance from '../../icons/balance.svg'
import businesses from '../../icons/businesses.svg'
import BusinessList from '../Business/BusinessList'
import dashboard from '../../icons/dashboard.svg'
import discover from '../../icons/discover.svg'
import favorites from '../../icons/favorites.svg'
import gift from '../../icons/gift.svg'
import icSwitch from '../../icons/switch.svg'
import images from '../../icons/images.svg'
import messagesIcon from '../../icons/messages.svg'
import MenuItem from './MenuItem'
import products from '../../icons/products.svg'
import settings from '../../icons/settings.svg'
import plus from '../../icons/squared-plus.svg'
import userIcon from '../../icons/user.svg'
import { UtilActions, BusinessActions, MediaActions } from '../../_redux'
import { loadHistory } from '../../_core/utils'

class Menu extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    openMedia: PropTypes.bool,
    currentBusiness: PropTypes.object,
    businessList: PropTypes.object,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.object,
    OPEN_LOGOUT_DIALOGUE: PropTypes.func.isRequired,
    FETCH_BUSINESS_LIST: PropTypes.func.isRequired,
    onMenuClose: PropTypes.func.isRequired,
    OPEN_MEDIA_MODAL: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    isBusinessListOpen: true,
    personalMode: true
  }

  componentWillMount() {
    if (this.context.auth.isAuthenticated()) {
      Promise.resolve(this.props.FETCH_BUSINESS_LIST())
        .then(({ owner, advertiser }) => {
          this.setState({
            personalMode: !(((owner && owner.length)
              || (advertiser && advertiser.length))
              && this.props.location.pathname.includes('business'))
          })
        })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      if (nextProps.location.pathname.includes('business') && this.state.personalMode
        && nextProps.user.owner_business_ids && nextProps.user.owner_business_ids.length) {
        this.setState({ personalMode: false })
      } else if (!nextProps.location.pathname.includes('business') && !this.state.personalMode) {
        this.setState({ personalMode: true })
      }
    }
  }

  onBusinessListClick = (e) => {
    e.preventDefault()
    this.setState({ isBusinessListOpen: !this.state.isBusinessListOpen })
  }

  onImagesClick = () => {
    this.props.OPEN_MEDIA_MODAL(!this.props.openMedia)
    this.props.onMenuClose()
  }

  onSwitchBusinessPersonal = () => {
    if (this.state.personalMode) {
      console.log(loadHistory(), this.props)
      this.props.history.push(loadHistory())
    } else {
      this.props.history.push('/influencer')
    }
    this.setState({ personalMode: !this.state.personalMode })
  }

  onLoginClick = () => {
    this.props.onMenuClose()
    this.props.history.replace('/login')
  }

  render() {
    const isAuthenticated = this.context.auth.isAuthenticated()
    const {
      user, OPEN_LOGOUT_DIALOGUE, currentBusiness: business,
      businessList
    } = this.props
    const { personalMode } = this.state
    // const showBusinessAdminMenu = !personalMode && isCurrentBusinessAdmin
    return (
      <div
        ref={this.refMenu}
        className={`Menu ${(this.props.visible) ? 'show' : ''}`}
        id="offCanvasMenu"
      >
        <a className="close-btn" onClick={this.props.onMenuClose}>&times;</a>
        {/* <LanguageSwitcher/>*/}
        <ul className="nav flex-column">
          <li className="nav-header">
            {!isAuthenticated && (
              <div className="profile-data">
                <h3>
                  <FormattedMessage id="user_guest" defaultMessage="!Guest" />
                </h3>
                <div className="userIcon">
                  <img alt="" src={userIcon} />
                </div>
              </div>
            )}
            {isAuthenticated && personalMode && (
              <div className="profile-data">
                <h5>{user.full_name}</h5>
                <h6>{user.email}</h6>
                <div className="userIcon">
                  <img alt="" src={user.profile_media_url} />
                </div>
              </div>
            )}
            {isAuthenticated && !personalMode && (
              <div className="business-data">
                <h5>
                  {business.name}
                  {!!business.profile_media_url && <img alt="" src={business.profile_media_url} />}
                </h5>
              </div>
            )}
          </li>
          {!this.state.personalMode ?
            (Object.keys(businessList).length > 0 && (
              <li className="menu-text">
                <div className="menuIcon">
                  <img alt="" src={businesses} />
                </div>
                <a
                  className={this.state.isBusinessListOpen ? 'open' : ''}
                  onClick={this.onBusinessListClick}
                >
                  <FormattedMessage id="main_menu.my_businesses" defaultMessage="!My Businesses" />
                </a>
                <BusinessList
                  isVisible={this.state.isBusinessListOpen}
                  click={this.props.onMenuClose}
                />
              </li>
            )) || (
              <MenuItem className="newBusiness" onClick={this.props.onMenuClose} to="/business/create" img={plus}>
                <FormattedMessage id="main_menu.create_business" defaultMessage="!Create new business" />
              </MenuItem>
            ) : null}
          {isAuthenticated && !this.state.personalMode && <li className="menu-border" />}
          {isAuthenticated && (
            <MenuItem onClick={this.props.onMenuClose} to="/user/messages" img={messagesIcon}>
              <FormattedMessage id="main_menu.notifications" defaultMessage="!Notifications" />
            </MenuItem>
          )}
          {/* Business Section*/}
          {isAuthenticated && !this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to={`/business/${business.handle}/dashboard`} img={dashboard}>
              <FormattedMessage id="main_menu.dashboard" defaultMessage="!Dashboard" />
            </MenuItem>
          )}
          {isAuthenticated && !this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to={`/business/${business.handle}/products`} img={products}>
              <FormattedMessage id="main_menu.products" defaultMessage="!Products" />
            </MenuItem>
          )}
          {isAuthenticated && !this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to={`/business/${business.handle}/audience`} img={audiences}>
              <FormattedMessage id="main_menu.audiences" defaultMessage="!Audiences" />
            </MenuItem>
          )}
          {isAuthenticated && !this.state.personalMode && (
            <MenuItem onClick={this.onImagesClick} img={images}>
              <FormattedMessage id="main_menu.images" defaultMessage="!Images" />
            </MenuItem>
          )}
          {isAuthenticated && !this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to={`/business/${business.handle}/settings`} img={settings}>
              <FormattedMessage id="main_menu.settings" defaultMessage="!Settings" />
            </MenuItem>
          )}
          {/* Personal Section */}
          {isAuthenticated && this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to="/influencer/my-activity" img={activity}>
              <FormattedMessage id="main_menu.my_activity" defaultMessage="!My Activity" />
            </MenuItem>
          )}
          {isAuthenticated && this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to="/influencer/favorites" img={favorites}>
              <FormattedMessage id="main_menu.favorites" defaultMessage="!Favorites" />
            </MenuItem>
          )}
          {isAuthenticated && this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to="/influencer/explore" img={discover}>
              <FormattedMessage id="main_menu.explore" defaultMessage="!Explore" />
            </MenuItem>
          )}
          {isAuthenticated && this.state.personalMode && (
            <MenuItem onClick={this.props.onMenuClose} to="/influencer/balance" img={balance}>
              <FormattedMessage id="main_menu.balance" defaultMessage="!Balance" />
            </MenuItem>
          )}
          <li className="menu-border" />
          {/* General Links */}
          <MenuItem onClick={this.props.onMenuClose} href="https://www.2key.co/faq/for-consumers/">
            <FormattedMessage id="main_menu.faq" defaultMessage="!FAQ" />
          </MenuItem>
          <MenuItem onClick={this.props.onMenuClose} href="https://medium.com/2key">
            <FormattedMessage id="main_menu.blog" defaultMessage="!Blog" />
          </MenuItem>
          {isAuthenticated && (
            <MenuItem onClick={this.props.onMenuClose} href="https://www.2key.co/invite-a-friend" img={gift}>
              <FormattedMessage id="main_menu.invite_a_friend" defaultMessage="!Invite a Friend" />
            </MenuItem>
          )}
          {Object.keys(businessList).length > 0 ? (
            <MenuItem
              onClick={this.onSwitchBusinessPersonal}
              img={icSwitch}
            >
              {!this.state.personalMode && (
                <FormattedMessage id="main_menu.switch_to_personal" defaultMessage="!Switch to Personal" />
              )}
              {this.state.personalMode && (
                <FormattedMessage id="main_menu.switch_to_business" defaultMessage="!Switch to Business" />
              )}

            </MenuItem>
          ) : (
            <MenuItem
              className="newBusiness"
              onClick={this.props.onMenuClose}
              href="https://home.2key.network"
            >
              <FormattedMessage id="main_menu.2key_businesses" defaultMessage="!2key for businesses" />
            </MenuItem>
          )}
          {isAuthenticated ? (
            <MenuItem onClick={OPEN_LOGOUT_DIALOGUE} to="">
              <FormattedMessage id="menu.logout" defaultMessage="!Logout" />
            </MenuItem>
          ) : (
            <MenuItem onClick={this.onLoginClick} >
              <FormattedMessage id="menu.login" defaultMessage="!Login" />
            </MenuItem>
          )}
        </ul>
      </div>
    )
  }
}

export default withRouter(injectIntl(connect((state) => {
  // const businessDetails
  //  = state.business.get('businessDetails') && state.business.get('businessDetails').toJS()
  // const id = businessDetails && businessDetails.business && businessDetails.business.id
  const businessList = state.business.get('businessList').toJS()
  return {
    user: state.user.get('userMetadata').toJS(),
    // isCurrentBusinessAdmin: (
    //   id && businessList && !!businessList[id]
    // ),
    currentBusiness: state.business.get('businessDetails')
      && state.business.get('businessDetails').toJS().business,
    businessList,
    openMedia: state.media.get('open')
  }
}, {
  OPEN_LOGOUT_DIALOGUE: UtilActions.OPEN_LOGOUT_DIALOGUE,
  FETCH_BUSINESS_LIST: BusinessActions.FETCH_BUSINESS_LIST,
  OPEN_MEDIA_MODAL: MediaActions.OPEN_MEDIA_MODAL
})(Menu)))
