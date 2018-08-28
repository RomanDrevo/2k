import React from 'react'
import PropTypes from 'prop-types'

const RouteComponent = (props) => (
  <props.component {...props}>
    {props.children}
  </props.component>
)

RouteComponent.propTypes = {
  children: PropTypes
    .oneOfType([PropTypes.string, PropTypes.bool, PropTypes.element, PropTypes.array])
}

export default RouteComponent
