import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import LoginButton from './LoginButton'
import Terms from './Terms'
import googleIcon from '../../icons/google_plus.svg'
import civicIcon from '../../icons/civic.svg'
import uportIcon from '../../icons/uport.svg'

const Signup = ({
  intl: { formatMessage }, loginWithFaceBook, loginWithCivic,
  loginWithGoogle, onSignupWithMail, loginWithUPort
}) => (
  <main>
    <FormattedMessage tagName="h5" id="auth.signup_title" defaultMessage="!Create your 2key account" />
    <div>
      <LoginButton
        onClick={loginWithFaceBook}
        className="facebook"
        icon={<i className="login-icon fa fa-facebook" />}
        label={formatMessage({
          id: 'auth.continue_with',
          defaultMessage: '!Continue with {provider}'
        }, { provider: 'Facebook' })}
      />
      <LoginButton
        onClick={loginWithGoogle}
        className="google"
        icon={<img src={googleIcon} alt="" />}
        label={formatMessage({
          id: 'auth.continue_with',
          defaultMessage: '!Continue with {provider}'
        }, { provider: 'Google' })}
      />
      <LoginButton
        onClick={loginWithCivic}
        className="civic"
        icon={<img src={civicIcon} alt="" />}
        label={formatMessage({
          id: 'auth.continue_with',
          defaultMessage: '!Continue with {provider}'
        }, { provider: 'Civic' })}
      />
      <LoginButton
        onClick={loginWithUPort}
        className="uport"
        icon={<img src={uportIcon} alt="" />}
        label={formatMessage({
          id: 'auth.continue_with',
          defaultMessage: '!Continue with {provider}'
        }, { provider: 'uPort' })}
      />
      <div className="or">
        <FormattedMessage tagName="span" id="or" defaultMessage="!or" />
      </div>
      <LoginButton
        onClick={onSignupWithMail}
        className="userpass"
        label={formatMessage({ id: 'auth.continue_with_email', defaultMessage: '!Sign Up with Emai' })}
      />
    </div>
    <Terms />
  </main>
)

Signup.propTypes = {
  intl: PropTypes.object.isRequired,
  loginWithFaceBook: PropTypes.func.isRequired,
  loginWithCivic: PropTypes.func.isRequired,
  loginWithGoogle: PropTypes.func.isRequired,
  loginWithUPort: PropTypes.func.isRequired,
  onSignupWithMail: PropTypes.func.isRequired
}

export default injectIntl(Signup)
