import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'

const FooterLogin = ({ onClick }) => (
  <footer>
    <p>
      <FormattedMessage id="auth.have_account" defaultMessage="!Already a member?" />
      <button onClick={onClick}>
        <FormattedMessage id="auth.login" defaultMessage="!Login" />
      </button>
    </p>
  </footer>
)

FooterLogin.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default injectIntl(FooterLogin)
