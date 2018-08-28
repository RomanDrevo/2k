import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from '../_common'

const LoginInputs = ({
  intl: { formatMessage }, onSubmit, onChange, credentials, loading, errorMessage, onForgot
}) => (
  <main className="login-inputs">
    <FormattedMessage tagName="h5" id="auth.login_title" defaultMessage="!Login to your 2key account" />
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
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder={formatMessage({ id: 'password', defaultMessage: '!Password' })}
            value={credentials.password || ''}
            onChange={onChange}
          />
        </div>
        {errorMessage && (
          <div id="login-error-label" className="form-group flex-center alert alert-danger">
            {errorMessage}
          </div>
        )}
        <div className="form-group flex-center">
          <Button
            title={formatMessage({ id: 'continue', defaultMessage: '!CONTINUE' })}
            style={{ width: 225 }}
            id="continue"
            type="submit"
            loading={loading}
            disabled={!credentials.email || !credentials.password}
          />
        </div>
        <div className="form-group flex-center">
          <button className="login-button forgot" onClick={onForgot}>
            <FormattedMessage id="auth.forgot_password" defaultMessage="Forgot Password?" />
          </button>
        </div>
      </form>
    </div>
  </main>
)

LoginInputs.propTypes = {
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  intl: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onForgot: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(LoginInputs)
