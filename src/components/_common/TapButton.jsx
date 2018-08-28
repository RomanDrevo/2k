import React from 'react'
import PropTypes from 'prop-types'
import './tap-button.css'

const TapButton = ({
  children, icon, title, onClick, style, textStyle, iconStyle, select
}) => (
  <div className="tap-button">
    <a className={select ? 'button-select' : 'button-unselect'} style={style} onClick={onClick}>
      {children && children}
      {!children && (
        <img className={select ? 'icon-style-select' : 'icon-style-unselect'} style={iconStyle} src={icon} alt="" />
      )}
      {!children && (
        <div className={select ? 'text-style-select' : 'text-style-unselect'} style={textStyle}>{title}</div>
      )}
    </a>
  </div>
)

TapButton.propTypes = {
  select: PropTypes.bool,
  icon: PropTypes.string,
  title: PropTypes.string,
  iconStyle: PropTypes.object,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.node,
    PropTypes.string
  ]),
  onClick: PropTypes.func
}

export default TapButton
