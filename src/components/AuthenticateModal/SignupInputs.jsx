import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from '../_common'
import Terms from './Terms'

const SignupInputs = ({
  intl: { formatMessage }, onSubmit, onChange, credentials, loading, errorMessage, civic
}) => (
  <main className="login-inputs">
    <FormattedMessage tagName="h5" id="auth.signup_title" defaultMessage="!Create your 2key account" />
    <div>
      <form onSubmit={onSubmit} autoComplete="off">
        <div className="form-group flex-center">
          <input
            className="form-control"
            id="first-name"
            name="firstName"
            placeholder={formatMessage({ id: 'auth.enter_first_name', defaultMessage: '!First name' })}
            value={credentials.firstName || ''}
            onChange={onChange}
          />
        </div>
        <div className="form-group flex-center">
          <input
            className="form-control"
            id="last-name"
            name="lastName"
            placeholder={formatMessage({ id: 'auth.enter_last_name', defaultMessage: '!Last name' })}
            value={credentials.lastName || ''}
            onChange={onChange}
          />
        </div>
        {!civic && (
          <div className="form-group flex-center">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              autoComplete="nopeemail"
              placeholder={formatMessage({ id: 'email', defaultMessage: '!Email' })}
              value={credentials.email || ''}
              onChange={onChange}
            />
          </div>
        )}
        {!civic && (
          <div className="form-group flex-center">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              autoComplete="nopepassword"
              placeholder={formatMessage({ id: 'password', defaultMessage: '!Password' })}
              value={credentials.password || ''}
              onChange={onChange}
            />
          </div>
        )}
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
            disabled={!credentials.firstName || !credentials.lastName ||
            (!civic && (!credentials.email || !credentials.password))}
          />
        </div>
      </form>
    </div>
    <Terms />
  </main>
)

SignupInputs.propTypes = {
  loading: PropTypes.bool,
  civic: PropTypes.bool,
  errorMessage: PropTypes.string,
  intl: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(SignupInputs)
