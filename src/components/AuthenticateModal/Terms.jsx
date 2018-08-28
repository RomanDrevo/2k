import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const Terms = () => (
  <p className="terms">
    <FormattedMessage id="auth.terms_policy" defaultMessage="!By creating and account you agree the 2key" />
    <br />
    <a href="https://home.2key.network/terms-and-conditions/" target="_blank" rel="noopener noreferrer">
      <FormattedMessage id="auth.terms" defaultMessage="!Terms of Service" />
    </a>&nbsp;
    <FormattedMessage id="auth.and" defaultMessage="!and" />&nbsp;
    <a href="https://home.2key.network/privacy-policy/" target="_blank" rel="noopener noreferrer">
      <FormattedMessage id="auth.policy" defaultMessage="!Privacy Policy" />
    </a>
  </p>
)

export default injectIntl(Terms)
