import React from 'react'
import PropTypes from 'prop-types'
import './card.css'

const Card = ({
  title, style, className, children
}) => (
  <div className={`card-wrapper ${className}`} style={style}>
    {title && <div className="card-title">{title}</div>}
    {children}
  </div>
)

Card.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.element
  ])
}

export default Card
