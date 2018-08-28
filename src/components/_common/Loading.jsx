import React from 'react'
import PropTypes from 'prop-types'

const Loading = ({ error, pastDelay }) => {
  if (error) {
    return <div>Error!</div>
  } else if (pastDelay) {
    return <div>Loading...</div>
  }
  return null
}

Loading.propTypes = {
  error: PropTypes.object,
  pastDelay: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
}

export default Loading
