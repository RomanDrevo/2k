import React from 'react'
import PropTypes from 'prop-types'

const LoginButton = ({
  onClick, icon, label, className = ''
}) => (
  <button className={`login-button ${className}`} onClick={onClick}>
    <span className="login-icon">{icon}</span>
    <span className="login-label">{label}</span>
  </button>
)

LoginButton.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default LoginButton
