import React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import ReCAPTCHA from 'react-google-recaptcha'
import { withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from '../../components/_common'
import { loadHistory } from '../../_core/utils'
import './authenticate-modal.css'

class AuthenticateModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    singupTitle: PropTypes.string,
    singupSubTitle: PropTypes.string,
    onBack: PropTypes.func,
    intl: PropTypes.object,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.captcha = null
    console.log(props)
    this.state = {
      isLogin: props.match.path.includes('login'),
      loggingThroughCredentials: false,
      errorMessage: false
    }
  }

  onGoSignUp = () => {
    this.setState({ isLogin: false })
  }

  onGoSignIn = () => {
    this.setState({ isLogin: true })
  }

  onSignUp = () => {
    const { intl: { formatMessage } } = this.props
    const email = document.getElementById('signupEmail').value
    const password = document.getElementById('signupPassword').value
    const username = document.getElementById('signupName').value
    const databaseConnection = 'Username-Password-Authentication'
    const recaptchaValue = this.state.signupRecaptcha
    // todo: add recaptcha server side validation
    if (!!recaptchaValue && (!!password && password.trim() !== '')
      && (!!username && username.trim() !== '') && (!!email && email.trim() !== '')) {
      this.setState({ loadingSignup: true, errorMessage: false })
      this.context.auth.auth0.signup({
        connection: databaseConnection,
        username,
        email,
        password,
        user_metadata: { name: username }
      }, (err) => {
        if (err) {
          let msg = ''
          if (!!err.name && err.name === 'PasswordStrengthError') {
            msg = `${formatMessage({
              id: 'auth.strong_password',
              defaultMessage: '!Password should be composed with the following in mind:'
            })} <br />${err.policy.replace(/\n/g, '<br />')}`
          } else if (err.message && err.message !== '') {
            msg = err.message
          } else {
            msg = err.description
            console.log(err)
          }
          this.setState({ loadingSignup: false, errorMessage: msg })
        } else {
          this.context.auth.loginWithCredentials(username, password)
          // if all is well, don't remove the loading of the signup button,
          // instead leave it until the login is completed successfully
          // then the app reloads the view
          // TODO: handle login error, after signup => move to login form
          // TODO: creating a user makes a race condition in server when fetching from the server
          // .. for the first time
          // .. (happens because of the all server methods use get_or_create_usermetadata)
        }
      })
    } else {
      this.setState({
        loadingSignup: false,
        // errorMessage: 'One or more fields are missing, please fill all of them and try again'
        errorMessage: formatMessage({
          id: 'one_or_more_fields_are_missing',
          defaultMessage: '!One or more fields are missing, please fill all of them and try again'
        })
      })
    }
  }

  onchangeRecapa = (val) => {
    this.setState({ signupRecaptcha: val })
  }

  loginWithGoogle = () => {
    this.context.auth.auth0.authorize({
      connection: 'google-oauth2'
    }, (err) => {
      if (err) {
        const errorMessage = document.getElementById('error-message')
        errorMessage.innerHTML = err.description
        errorMessage.style.display = 'block'
      }
    })
  }

  loginWithLinkedIn = () => {
    this.context.auth.auth0.authorize({
      connection: 'linkedin'
    }, (err) => {
      if (err) {
        const errorMessage = document.getElementById('error-message')
        errorMessage.innerHTML = err.description
        errorMessage.style.display = 'block'
      }
    })
  }

  loginWithFaceBook = () => {
    this.context.auth.auth0.authorize({
      connection: 'facebook',
      scope: 'openid profile email read:users read:user_idp_tokens'
    }, (err, res) => {
      if (err) {
        const errorMessage = document.getElementById('error-message')
        errorMessage.innerHTML = err.description
        errorMessage.style.display = 'block'
      } else {
        console.log('=======FACEBOOKLOGINRESULT', res)
      }
    })
  }

  loginWithCivic = () => {
    this.context.auth.loginWithCivic()
      .then(() => {
        const route = loadHistory()
        this.props.history.push(route)
      })
  }

  catchSubmitLogin = (e) => {
    e.preventDefault()
    this.setState({ loggingThroughCredentials: true })
    const username = document.getElementById('email').value
    const password = document.getElementById('password').value
    if (!username || username.trim() === '' || !password || password.trim() === '') {
      this.setState({ errorMessage: 'Both Username and Password are required' })
    } else {
      this.context.auth.loginWithCredentials(username, password)
        .then(() => {
          this.setState({ loggingThroughCredentials: false })
        })
        .catch(() => {
          this.setState({ loggingThroughCredentials: false })
        })
    }
  }

  refCaptcha = (e) => {
    this.captcha = e
  }

  renderHeader = () => {
    const { onBack } = this.props
    return (
      <div className="login-header">
        {!!onBack && (
          <button className="left" onClick={onBack}>
            <FormattedMessage id="main.back" defaultMessage="!Back" />
          </button>
        )}
        <a className="right green" href="/help">
          <FormattedMessage id="main.help" defaultMessage="!Help" />
        </a>
      </div>
    )
  }

  renderContent = () => (
    <div className="login-contents">
      <div className="text-center dark-black font-xxxl" >
        {this.props.title || (
          <FormattedMessage id="auth.login_title" defaultMessage="!Login to 2key" />
        )}
      </div>
      <div className="text-center dark-black font-x-normal" >{this.props.subTitle}</div>
    </div>
  );

  renderSignupContent = () => (
    <div className="login-contents">
      <div className="text-center dark-black font-xxxl" >
        {this.props.singupTitle || (
          <FormattedMessage id="auth.signup_title" defaultMessage="!Join 2key" />
        )}
      </div>
      <div className="text-center dark-black font-x-normal" >{this.props.singupSubTitle}</div>
    </div>
  )

  renderFaceBook = () => (
    <div className="flex-center">
      <Button
        style={{ width: 223, backgroundColor: '#2e71cd', marginBottom: 15 }}
        icon="facebook"
        id="facebook-login"
        title={this.props.intl.formatMessage({
          id: 'login_with_facebook',
          defaultMessage: '!Login with Facebook'
        })}
        onClick={this.loginWithFaceBook}
      />
    </div>
  );

  renderSocial = () => (
    <div className="login-social">
      <FormattedMessage
        id="you_can_also_login"
        defaultMessage="!You can also login with"
      />&nbsp;
      <button className="google" onClick={this.loginWithGoogle}>
        <FormattedMessage id="google" defaultMessage="!Google" />
      </button>&nbsp;
      <FormattedMessage id="or" defaultMessage="!or" />&nbsp;
      <button className="linkedin" onClick={this.loginWithLinkedIn}>
        <FormattedMessage id="LinkdIn" defaultMessage="!LinkedIn" />&nbsp;
      </button>
      <FormattedMessage id="or" defaultMessage="!or" />
      <Button
        title={this.props.intl.formatMessage({ id: 'auth.civic', defaultMessage: '!Login with Civic' })}
        style={{ width: 223, margin: '10px auto 0' }}
        id="signupButton"
        onClick={this.loginWithCivic}
      />
    </div>
  )

  renderLoginbyEmail = () => (
    <div>
      <form onSubmit={this.catchSubmitLogin}>
        <div className="form-group flex-center">
          <input
            type="email"
            className="form-control"
            style={{ flex: 0.5 }}
            id="email"
            placeholder={this.props.intl.formatMessage({ id: 'email', defaultMessage: '!Email' })}
          />
        </div>
        <div className="form-group flex-center">
          <input
            type="password"
            className="form-control"
            style={{ flex: 0.5 }}
            id="password"
            placeholder={this.props.intl.formatMessage({ id: 'password', defaultMessage: '!Password' })}
          />
        </div>
        <div className="form-group flex-center">
          <Button
            title={this.props.intl.formatMessage({ id: 'continue', defaultMessage: '!CONTINUE' })}
            style={{ width: 223, paddingLeft: 72, paddingRight: 72 }}
            id="continue"
            onClick={this.catchSubmitLogin}
            loading={this.state.loggingThroughCredentials}
          />
        </div>
        {this.state.errorMessage && (
          <div id="login-error-label" className="form-group flex-center alert alert-danger">
            {this.state.errorMessage}
          </div>
        )}
      </form>
    </div>
  );

  renderSignUp = () => (
    <div className="form-group flex-center">
      <div className="login-signup">
        <FormattedMessage id="dont_have_account" defaultMessage="!Don't have an account?" />
        <button className="signup" onClick={this.onGoSignUp}>
          <FormattedMessage id="signup" defaultMessage="!Sign Up" />
        </button>
      </div>
    </div>
  )

  renderSignIn = () => (
    <div className="form-group flex-center">
      <div className="login-signup">
        <FormattedMessage id="auth.have_account" defaultMessage="!Already have an account?" />
        <button className="signup" onClick={this.onGoSignIn}>
          <FormattedMessage id="auth.signin" defaultMessage="!Sign In" />
        </button>
      </div>
    </div>
  )


  renderSignupInput = () => (
    <form onSubmit={this.onSignUp} style={{ marginTop: 20 }}>
      <div className="form-group flex-center">
        <input
          className="form-control"
          style={{ flex: 0.5 }}
          id="signupName"
          placeholder={this.props.intl.formatMessage({
            id: 'auth.enter_name',
            defaultMessage: '!Enter your Name'
          })}
        />
      </div>
      <div className="form-group flex-center">
        <input
          type="email"
          className="form-control"
          style={{ flex: 0.5 }}
          id="signupEmail"
          placeholder={this.props.intl.formatMessage({
            id: 'auth.enter_email',
            defaultMessage: '!Enter your Email'
          })}
        />
      </div>
      <div className="form-group flex-center">
        <input
          type="password"
          className="form-control"
          style={{ flex: 0.5 }}
          id="signupPassword"
          autoComplete="new-password"
          placeholder={this.props.intl.formatMessage({
            id: 'auth.enter_password',
            defaultMessage: '!Choose Password'
          })}
        />
      </div>
      <div className="text-center">
        <FormattedMessage
          id="auth.long_password"
          defaultMessage="!8 characters or longer. combine letters and numbers and special characters."
        />
      </div>
      <div className="form-group flex-center">
        <ReCAPTCHA
          ref={this.refCaptcha}
          sitekey="6LczUDgUAAAAAKyV3fEZSbXYf8BXqT1ejdszpO9z"
          onChange={this.onchangeRecapa}
        />
      </div>
      <div className="form-group flex-center">
        <Button
          title={this.props.intl.formatMessage({
            id: 'join_2key',
            defaultMessage: '!JOIN 2key'
          })}
          style={{ paddingLeft: 72, paddingRight: 72 }}
          onClick={this.onSignUp}
          loading={this.state.loadingSignup}
        />
      </div>
      {this.state.errorMessage && (
        <div
          className="form-group flex-center alert alert-danger"
          dangerouslySetInnerHTML={{ __html: this.state.errorMessage }}
        />
      )}
    </form>
  );

  render() {
    const { isOpen } = this.props
    const { isLogin } = this.state
    return (
      <Modal
        className="authenticate login-container"
        isOpen={isOpen}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick={false}
      >
        <div className="login-box">
          {this.renderHeader()}
          {isLogin ? this.renderContent() : this.renderSignupContent()}
          {isLogin && this.renderFaceBook()}
          {isLogin && this.renderSocial()}
          {isLogin && (
            <div className="flex-center">
              <div style={{ flex: 1 }} className="line" />
              <div className="or">
                <FormattedMessage id="or" defaultMessage="!or" />
              </div>
              <div style={{ flex: 1 }} className="line" />
            </div>
          )}
          {isLogin && this.renderLoginbyEmail()}
          <div style={{ flex: 1 }} className="line" />
          {!isLogin && this.renderSignupInput()}
          {isLogin ? this.renderSignUp() : this.renderSignIn()}
        </div>
      </Modal>
    )
  }
}

export default injectIntl(withRouter(AuthenticateModal))
