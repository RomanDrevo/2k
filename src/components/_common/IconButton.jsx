import React from 'react'
import PropTypes from 'prop-types'
import './icon-button.css'

const IconButton = ({
  icon, iconUrl, iconLetter, className = '', style, children, onClick
}) => (
  <button className={`btn-icon ${className}`} style={style} onClick={onClick}>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {icon && <i className={`fa fa-${icon}`} />}
        {iconUrl && <img src={iconUrl} alt="" />}
        {iconLetter && <span>{iconLetter}</span>}
      </div>
      {children && <div style={{ marginLeft: 5 }}>{children}</div>}
    </div>
  </button>
)

IconButton.propTypes = {
  icon: PropTypes.string,
  iconUrl: PropTypes.string,
  iconLetter: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string])
}

export default IconButton
