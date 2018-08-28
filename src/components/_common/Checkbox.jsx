import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({ title, checked }) => (
  <div>
    <input type="checkbox" checked={checked} /> {title}
  </div>
)

Checkbox.propTypes = {
  checked: PropTypes.bool,
  title: PropTypes.string
}

export default Checkbox

