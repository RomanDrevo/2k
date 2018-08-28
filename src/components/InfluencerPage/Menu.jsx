import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import '../Business/sub-menu.css'

const Menu = ({
  style, isMobile = false
}) => {
  const onwStyle = isMobile ? { ...style, background: 'transparent' } : style

  return (
    <div className="flex sub-menu-container" style={onwStyle}>
      <div className={`container flex-1${(isMobile && ' flex') || ''}`} >
        <NavLink
          to="/influencer/my-activity"
          activeClassName="selected"
          // ${selected === '' || selected === 'my-activity' || selected === 'influencer' ? 'selected' : ''}
          className={`sub-menu-item ${isMobile && 'borderBottom'}`}
        >
          <div>
            {!isMobile && (<div><img src="/img/menu-offer.png" alt="" /></div>)}
            <FormattedMessage tagName="div" id="main_menu.my_activity" defaultMessage="!My Activity" />
          </div>
        </NavLink>
        <NavLink
          to="/influencer/favorites"
          activeClassName="selected"
          className={`sub-menu-item ${isMobile && 'borderBottom'}`}
        >
          <div>
            {!isMobile && (<div><img src="/img/menu-favorites.png" alt="" /></div>)}
            <FormattedMessage tagName="div" id="main_menu.favorites" defaultMessage="!Favorites" />
          </div>
        </NavLink>
        <NavLink
          to="/influencer/explore"
          activeClassName="selected"
          className={`sub-menu-item ${isMobile && 'borderBottom'}`}
        >
          <div>
            {!isMobile && (<div><img src="/img/menu-explore.png" alt="" /></div>)}
            <FormattedMessage tagName="div" id="influencer.explore" defaultMessage="!Explore" />
          </div>
        </NavLink>
        <NavLink
          to="/influencer/balance"
          activeClassName="selected"
          className={`sub-menu-item ${isMobile && 'borderBottom'}`}
        >
          <div>
            {!isMobile && (<div><img src="/img/menu-balance.png" alt="" /></div>)}
            <FormattedMessage tagName="div" id="main_menu.balance" defaultMessage="!Balance" />
          </div>
        </NavLink>
      </div>
    </div>
  )
}

Menu.propTypes = {
  isMobile: PropTypes.bool,
  style: PropTypes.object
}

export default injectIntl(Menu)
