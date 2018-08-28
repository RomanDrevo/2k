import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import './panel.css'

const Panel = ({
  title, className = '', children, style
}) => (
  <div className={`panel-container ${className}`} style={style}>
    {title && (<div className="panel-title">{title}</div>)}
    <div className="panel-body">
      {children}
    </div>
  </div>
)

Panel.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node, PropTypes.element]),
  style: PropTypes.object
}

export default injectIntl(Panel)
