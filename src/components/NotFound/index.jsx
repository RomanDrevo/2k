import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const NotFound = () => (
  <div>
    <FormattedMessage tagName="h3" id="not_found.header" defaultMessage="!404 page not found" />
    <FormattedMessage
      tagName="p"
      id="not_found.sorry"
      defaultMessage="!We are sorry but the page you are looking for does not exist."
    />
  </div>
)

export default injectIntl(NotFound)
