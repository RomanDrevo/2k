import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const ReadMore = ({ onClick, className = '' }) => (
  <a onClick={onClick} className={`offer-cube__description__link ${className}`}>
    <FormattedMessage id="main.read_more" defaultMessage="!Read more" />
  </a>
)

ReadMore.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default injectIntl(ReadMore)
