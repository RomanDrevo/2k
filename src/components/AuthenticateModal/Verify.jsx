import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from '../_common'

const Verify = ({
  intl: { formatMessage }, onClick, loading
}) => (
  <main className="login-inputs verify">
    <FormattedMessage tagName="h5" id="auth.signup_title" defaultMessage="!Create your 2key account" />
    <div>
      <FormattedMessage tagName="p" id="auth.thank" defaultMessage="!Thank you!" />
      <FormattedMessage tagName="p" id="auth.please_verify" defaultMessage="!Please verify your email" />
    </div>
    <div className="form-group flex-center">
      <Button
        title={formatMessage({ id: 'continue', defaultMessage: '!CONTINUE' })}
        style={{ width: 225 }}
        id="continue"
        type="submit"
        onClick={onClick}
        loading={loading}
      />
    </div>
  </main>
)

Verify.propTypes = {
  loading: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default injectIntl(Verify)
