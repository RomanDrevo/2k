import React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import { UserActions, BusinessActions } from '../../_redux'
import { loadHistory } from '../../_core/utils'
import Login from './Login'
import LoginInputs from './LoginInputs'
import Signup from './Signup'
import SignupInputs from './SignupInputs'
import FooterLogin from './FooterLogin'
import FooterSignup from './FooterSignup'
import Forgot from './Forgot'
import Verify from './Verify'
import Loader from './Loader'
import logo from '../../icons/2key_logo.png'
import './styles.css'

const mapDispatchToProps = {
  REPLACE_USER_METADATA: UserActions.REPLACE_USER_METADATA,
  FETCH_BUSINESS_LIST: BusinessActions.FETCH_BUSINESS_LIST,
  UPDATE_USER_PROFILE: UserActions.UPDATE_USER_PROFILE
}

class AuthenticateModal extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    REPLACE_USER_METADATA: PropTypes.func.isRequired,
    FETCH_BUSINESS_LIST: PropTypes.func.isRequired,
    UPDATE_USER_PROFILE: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    credentials: {},
    loggingThroughCredentials: false,
    loadingSignup: false,
    reseting: false,
    flipped: false,
    initialState: this.props.match.url,
    globalLoading: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      this.setState({ errorMessage: '' })
    }
  }

  onClose = () => {
    if (this.context.auth.isAuthenticated()) {
      this.props.history.push(loadHistory())
    } else {
      const route = localStorage.getItem('route')
      if (route) {
        localStorage.removeItem('route')
        this.props.history.push(route)
      } else {
        this.props.history.replace('/')
      }
    }
  }

  onBackClick = () => {
    // const { authState } = this.props
    const authState = this.props.match.url
    const { history: { push, goBack } } = this.props
    const { initialState } = this.state
    if (authState === '/login' || authState === '/signup') {
      if (authState === initialState) {
        this.onClose()
      } else {
        // this.props.SET_AUTH_STATE(initialState)
        push(initialState)
        this.setState({ flipped: !this.state.flipped })
      }
    } else if (authState === '/login/credentials') {
      this.setState({ credentials: {}, errorMessage: '', flipped: !this.state.flipped })
      push('/login')
      // this.props.SET_AUTH_STATE('login')
    } else if (authState === '/signup/credentials') {
      this.setState({ credentials: {}, errorMessage: '', flipped: !this.state.flipped })
      push('/signup')
      // this.props.SET_AUTH_STATE('signup')
    } else if (authState === '/forgot') {
      this.setState({ credentials: {}, errorMessage: '', flipped: !this.state.flipped })
      push('/login/credentials')
      // this.props.SET_AUTH_STATE('/loginCredentials')
    } else if (authState.includes('uport')) {
      this.setState({ credentials: {}, errorMessage: '', flipped: !this.state.flipped })
      goBack()
      // this.props.SET_AUTH_STATE(this.props.authStatePrev)
    }
  }

  onSignInUpClick = () => {
    this.setState({ flipped: !this.state.flipped })
    const { history: { push }, match: { url } } = this.props
    push(url.includes('login') ? '/signup' : '/login')
    // SET_AUTH_STATE(authState.includes('login') ? 'signup' : 'login')
  }

  onLoginWithMail = () => {
    this.setState({ flipped: !this.state.flipped })
    const { history: { push }, match: { url } } = this.props
    push(`${url}/credentials`)
    // this.props.SET_AUTH_STATE(this.props.authState === 'login' ? 'loginCredentials' : 'signupCredentials')
  }

  onForgot = () => {
    this.setState({ flipped: !this.state.flipped })
    this.props.history.push('/forgot')
    // this.props.SET_AUTH_STATE('forgot')
  }

  onCredentialsChange = (e) => {
    const credentials = { ...this.state.credentials }
    credentials[e.target.name] = e.target.value
    this.setState({ credentials })
  }

  onBackToLogin = () => {
    this.setState({ flipped: !this.state.flipped, resetResult: '' })
    this.props.history.push('/login/credentials')
    // this.props.SET_AUTH_STATE('loginCredentials')
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

  loginWithCivic = () => {
    this.setState({ globalLoading: true })
    this.context.auth.loginWithCivic()
      .then((res) => {
        const { userProfile, isUserNew } = res
        this.props.REPLACE_USER_METADATA(userProfile)
        this.props.FETCH_BUSINESS_LIST()
        this.setState({ globalLoading: false })
        if (isUserNew) {
          this.props.history.push('/signup/civic')
        } else {
          const route = loadHistory()
          this.props.history.push(route)
        }
      })
      .catch(() => {
        this.setState({ globalLoading: false })
      })
  }

  loginWithUPort = () => {
    this.setState({ flipped: !this.state.flipped })
    const { history: { push }, match: { url } } = this.props
    push(`${url}/uport`)
    this.context.auth.loginWithUPort()
      .then(({ userProfile }) => {
        this.props.REPLACE_USER_METADATA(userProfile)
        this.props.FETCH_BUSINESS_LIST()
        const route = loadHistory()
        push(route)
      })
      .catch(() => {
        this.onBackClick()
      })
  }

  loginWithMail = (e) => {
    e.preventDefault()
    this.setState({ loggingThroughCredentials: true })
    const { credentials: { email, password } } = this.state
    if (!email || email.trim() === '' || !password || password.trim() === '') {
      this.setState({ errorMessage: 'Both Username and Password are required' })
    } else {
      this.context.auth.loginWithCredentials(email, password)
        .then(() => {
          this.setState({ loggingThroughCredentials: false, credentials: {}, errorMessage: '' })
        })
        .catch((err) => {
          this.setState({ loggingThroughCredentials: false, credentials: {}, errorMessage: err.description })
        })
    }
  }

  signupWithCivic = (e) => {
    e.preventDefault()
    const { credentials: { firstName: first_name = '', lastName: last_name = '' } } = this.state
    this.setState({ loadingSignup: true })
    Promise.resolve(this.props.UPDATE_USER_PROFILE({ first_name, last_name }))
      .then(() => {
        this.setState({ loadingSignup: false })
        const route = loadHistory()
        this.props.history.push(route)
      })
      .catch((err) => {
        this.setState({ loadingSignup: false, errorMessage: err.message })
      })
  }

  signupWithMail = (e) => {
    e.preventDefault()
    const { intl: { formatMessage } } = this.props
    const {
      credentials: {
        email, password, firstName = '', lastName = ''
      }
    } = this.state
    const connection = 'Username-Password-Authentication'
    // const recaptchaValue = this.state.signupRecaptcha
    // todo: add recaptcha server side validation
    if ((password && password.trim() !== '')
      && (firstName && firstName.trim() !== '') && (email && email.trim() !== '')
      && (lastName && lastName.trim() !== '')) {
      this.setState({ loadingSignup: true, errorMessage: '' })
      this.context.auth.auth0.signup({
        username: `${firstName}+${lastName}`,
        connection,
        email,
        password,
        user_metadata: { firstName, lastName, name: `${firstName}${lastName}` }
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
          this.setState({ flipped: !this.state.flipped })
          this.props.history.push('/verify')
          // this.props.SET_AUTH_STATE('verify')

          // this.context.auth.loginWithCredentials(email, password)
          //   .then(() => {
          //     this.setState({ loadingSignup: false, credentials: {}, errorMessage: '' })
          //   })
          //   .catch((error) => {
          //     this.setState({ loadingSignup: false, credentials: {}, errorMessage: error })
          //   })
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

  loginAfterSignup = (e) => {
    e.preventDefault()
    const { email, password } = this.state.credentials
    this.setState({ loggingThroughCredentials: true })
    this.context.auth.loginWithCredentials(email, password)
      .then(() => {
        this.setState({ loggingThroughCredentials: false, credentials: {}, errorMessage: '' })
      })
      .catch((error) => {
        this.setState({ loggingThroughCredentials: false, credentials: {}, errorMessage: error })
      })
  }

  resetPassword = (e) => {
    e.preventDefault()
    this.setState({ reseting: true })
    const { credentials: { email } } = this.state
    const connection = 'Username-Password-Authentication'
    this.context.auth.auth0.changePassword({
      connection,
      email
    }, (err, res) => {
      if (err) {
        let msg = ''
        if (err.name) {
          msg = err.name
        } else if (err.message && err.message !== '') {
          msg = err.message
        } else {
          msg = err.description
          console.log(err)
        }
        this.setState({ reseting: false, errorMessage: msg })
      } else {
        this.setState({ credentials: {}, reseting: false, resetResult: res })
      }
    })
  }

  render() {
    const { match: { url } } = this.props
    const {
      credentials, loggingThroughCredentials, errorMessage,
      flipped, loadingSignup, reseting, resetResult, globalLoading
    } = this.state
    return (
      <Modal
        className="authenticate-modal authenticate-modal-container"
        isOpen
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        overlayClassName="auth-overlay"
      >
        <div className={`login-box${flipped ? ' flipped' : ''}`}>
          <section className="mirror">
            <header>
              <span>
                {url !== '/verify' && (
                  <button className="back-btn" onClick={this.onBackClick}>
                    <FormattedMessage id="main.back" defaultMessage="!Back" />
                  </button>
                )}
              </span>
              <span className="logo">
                <img src={logo} alt="" />
              </span>
            </header>
            {url === '/login' && (
              <Login
                loginWithFaceBook={this.loginWithFaceBook}
                loginWithGoogle={this.loginWithGoogle}
                loginWithCivic={this.loginWithCivic}
                loginWithUPort={this.loginWithUPort}
                onLoginWithMail={this.onLoginWithMail}
              />
            )}
            {url === '/signup' && (
              <Signup
                loginWithFaceBook={this.loginWithFaceBook}
                loginWithGoogle={this.loginWithGoogle}
                loginWithCivic={this.loginWithCivic}
                loginWithUPort={this.loginWithUPort}
                onSignupWithMail={this.onLoginWithMail}
              />
            )}
            {url === '/login/credentials' && (
              <LoginInputs
                onChange={this.onCredentialsChange}
                credentials={credentials}
                loading={loggingThroughCredentials}
                onSubmit={this.loginWithMail}
                errorMessage={errorMessage}
                onForgot={this.onForgot}
              />
            )}
            {url === '/signup/credentials' && (
              <SignupInputs
                onChange={this.onCredentialsChange}
                credentials={credentials}
                loading={loadingSignup}
                onSubmit={this.signupWithMail}
                errorMessage={errorMessage}
              />
            )}
            {url === '/signup/civic' && (
              <SignupInputs
                onChange={this.onCredentialsChange}
                credentials={credentials}
                loading={loadingSignup}
                onSubmit={this.signupWithCivic}
                errorMessage={errorMessage}
                civic
              />
            )}
            {url === '/forgot' && (
              <Forgot
                onChange={this.onCredentialsChange}
                credentials={credentials}
                loading={reseting}
                onSubmit={this.resetPassword}
                errorMessage={errorMessage}
                resetResult={resetResult}
                onBack={this.onBackToLogin}
              />
            )}
            {url === '/verify' && (
              <Verify
                onClick={this.loginAfterSignup}
                loading={loggingThroughCredentials}
              />
            )}
            {url.includes('uport') && (
              <div id="uport-qr" className="uport-container" />
            )}
            {url.includes('login') || url.includes('signup') ?
              (url.includes('login') && <FooterLogin onClick={this.onSignInUpClick} />)
              || (url.includes('signup') && <FooterSignup onClick={this.onSignInUpClick} />)
              : null
            }
          </section>
          {globalLoading && <Loader />}
        </div>
      </Modal>
    )
  }
}

export default injectIntl(withRouter(connect(null, mapDispatchToProps)(AuthenticateModal)))
