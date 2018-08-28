import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from '../_common'

const Forgot = ({
  intl: { formatMessage }, onSubmit, onChange, credentials, loading, errorMessage, resetResult, onBack
}) => (
  <main className="login-inputs forgot">
    <FormattedMessage tagName="h5" id="auth.forgot_title" defaultMessage="!Forgot your password?" />
    <h5 className="reset">
      <FormattedMessage
        id="auth.forgot_reset"
        defaultMessage="!To reset your password, enter your email address"
      />
    </h5>
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group flex-center">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder={formatMessage({ id: 'email', defaultMessage: '!Email' })}
            value={credentials.email || ''}
            onChange={onChange}
          />
        </div>
        <div className="form-group flex-center">
          <Button
            title={formatMessage({ id: 'auth.reset_password', defaultMessage: '!Reset Password' })}
            style={{ width: 225, margin: '20px auto' }}
            id="continue"
            type="submit"
            loading={loading}
            disabled={!credentials.email}
          />
        </div>
        {resetResult ? (
          <FormattedMessage
            tagName="p"
            id="auth.reset_link"
            defaultMessage="!A reset password link will be send to your email"
          />
        ) : (
          <FormattedMessage
            tagName="p"
            id="auth.reset_message"
            defaultMessage="!A message with instructions was sent to your email"
          />
        )}
        {resetResult && (
          <div>
            <FormattedMessage id="auth.back_to" defaultMessage="!Back to" />
            <button className="forgot-back" onClick={onBack}>
              <FormattedMessage id="auth.login" defaultMessage="!Login" />
            </button>
          </div>
        )}
        {errorMessage && (
          <div id="login-error-label" className="form-group flex-center alert alert-danger">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  </main>
)

Forgot.propTypes = {
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  resetResult: PropTypes.string,
  intl: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(Forgot)
