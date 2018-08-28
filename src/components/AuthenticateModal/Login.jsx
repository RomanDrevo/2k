import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import LoginButton from './LoginButton'
import googleIcon from '../../icons/google_plus.svg'
import civicIcon from '../../icons/civic.svg'
import uportIcon from '../../icons/uport.svg'

const Login = ({
  intl: { formatMessage }, loginWithFaceBook, loginWithCivic,
  loginWithGoogle, loginWithUPort, onLoginWithMail
}) => (
  <main>
    <FormattedMessage tagName="h5" id="auth.login_title" defaultMessage="!Login to your 2key account" />
    <div>
      <LoginButton
        onClick={loginWithFaceBook}
        className="facebook"
        icon={<i className="login-icon fa fa-facebook" />}
        label={formatMessage({
          id: 'auth.login_with',
          defaultMessage: '!Login with {provider}'
        }, { provider: 'Facebook' })}
      />
      <LoginButton
        onClick={loginWithGoogle}
        className="google"
        icon={<img src={googleIcon} alt="" />}
        label={formatMessage({
          id: 'auth.login_with',
          defaultMessage: '!Login with {provider}'
        }, { provider: 'Google' })}
      />
      <LoginButton
        onClick={loginWithCivic}
        className="civic"
        icon={<img src={civicIcon} alt="" />}
        label={formatMessage({
          id: 'auth.login_with',
          defaultMessage: '!Login with {provider}'
        }, { provider: 'Civic' })}
      />
      <LoginButton
        onClick={loginWithUPort}
        className="uport"
        icon={<img src={uportIcon} alt="" />}
        label={formatMessage({
          id: 'auth.login_with',
          defaultMessage: '!Login with {provider}'
        }, { provider: 'uPort' })}
      />
      <div className="or">
        <FormattedMessage tagName="span" id="or" defaultMessage="!or" />
      </div>
      <LoginButton
        onClick={onLoginWithMail}
        className="userpass"
        label={formatMessage({
          id: 'auth.login_with',
          defaultMessage: '!Login with {provider}'
        }, { provider: 'Email' })}
      />
    </div>
  </main>
)

Login.propTypes = {
  intl: PropTypes.object.isRequired,
  loginWithFaceBook: PropTypes.func.isRequired,
  loginWithCivic: PropTypes.func.isRequired,
  loginWithGoogle: PropTypes.func.isRequired,
  loginWithUPort: PropTypes.func.isRequired,
  onLoginWithMail: PropTypes.func.isRequired
}

export default injectIntl(Login)
