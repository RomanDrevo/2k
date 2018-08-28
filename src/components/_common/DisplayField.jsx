import React from 'react'
import PropTypes from 'prop-types'
import './display-field.css'

const DisplayField = (props) => {
  const {
    icon, label, value, style, className, valueStyle, labelStyle, colon, hyphenSymbol
  } = props
  return (
    <div className={`display-field-container ${className}`} style={style}>
      {icon && <div className="display-field-icon"><i className={`fa fa-${icon}`} /></div>}
      {label && (
        <div className="display-field-label" style={labelStyle}>
          {label}{hyphenSymbol || (colon ? ': ' : '')}
        </div>
      )}
      <div className="display-field-value" style={valueStyle}>{value}</div>
    </div>
  )
}

DisplayField.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueStyle: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  colon: PropTypes.bool,
  hyphenSymbol: PropTypes.string
}

DisplayField.defaultProps = {
  colon: true
}

export default DisplayField
