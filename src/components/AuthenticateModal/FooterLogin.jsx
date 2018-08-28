import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'

const FooterLogin = ({ onClick }) => (
  <footer>
    <p>
      <FormattedMessage id="auth.havent_account" defaultMessage="!Not a member?" />
      <button onClick={onClick}>
        <FormattedMessage id="auth.signup" defaultMessage="!Signup" />
      </button>
    </p>
  </footer>
)

FooterLogin.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default injectIntl(FooterLogin)
