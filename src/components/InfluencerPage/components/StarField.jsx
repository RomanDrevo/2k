import React from 'react'
require('./star-field.css')

const StarField = ({ value }) => {
  return (
    <div>
      <div className="star-field-wrapper">
        <div className="star-field-img"><img src="/img/star.png" style={{ width: '100%' }}/></div>
        <span className="star-field-value">{value}</span>
      </div>
    </div>
  )
}

export default StarField
