import React from 'react'
import PropTypes from 'prop-types'
import './spinner.css'

const Spinner = ({ text, icon, className = '' }) => (
  <div className={`spinner ${className}`}>
    <div>
      <div className="spinner-icon">
        <i className={`fa fa-${icon || 'circle-o-notch'} fa-spin fa-3x fa-fw`} />
      </div>
      {text && <div>{text}</div>}
    </div>
  </div>
)

Spinner.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string
}

export default Spinner
