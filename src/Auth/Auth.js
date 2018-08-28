import auth0 from 'auth0-js'
import jwt_decode from 'jwt-decode'
import jwt from 'jwt-simple'
import { toast } from 'react-toastify'
import { Connect, SimpleSigner } from 'uport-connect'
import kjua from 'kjua'
import { CONFIG } from '../config'
import { makeURL } from '../_core/http'
/* global civic */
/* eslint new-cap: [0] */

let tokenRenewalTimeout

let auth

const uportConfig = {
  uportDapp: '2key',
  uportClientId: '2otvkHMYcBPedNvq8RhpUC62jsNi7a1Fvvy',
  uportSigningKey: 'dc260eb63afab93ffa272dcd8c00e2452a9dd83fb8c8520b0ffc9ae473ff38d4',
  uportNetwork: 'rinkeby'
}

export class Auth {
  constructor() {
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.userHasScopes = this.userHasScopes.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.scheduleTokenRenewal = this.scheduleTokenRenewal.bind(this)
    this.getUser = this.getUser.bind(this)
    this.requestedScopes = 'openid profile email read:users read:user_idp_tokens'
    this.timestamp = Date.now()
    this.civicSip = new civic.sip({ appId: 'SJkB3pitz' })
    this.uport = new Connect(uportConfig.uportDapp, {
      clientId: uportConfig.uportClientId,
      network: uportConfig.uportNetwork,
      signer: SimpleSigner(uportConfig.uportSigningKey)
    })
    this.web3 = this.uport.getWeb3()
    this.unsubscribeCivic = null
    this.auth0 = new auth0.WebAuth({
      domain: CONFIG.domain,
      clientID: CONFIG.clientId,
      redirectUri: CONFIG.callbackUrl,
      audience: CONFIG.apiUrl,
      responseType: 'token id_token',
      scope: this.requestedScopes,
      state: 'aklsjhdnln12li3uh8sa$!*12309'
    })
    if (this.isAuthenticated() && localStorage.getItem('id_token')) {
      this.scheduleTokenRenewal()
      this.auth0manage = new auth0.Management({
        token: localStorage.getItem('id_token'),
        domain: CONFIG.domain,
        scope: ['read:user_idp_tokens']
      })
    }
  }

  loginWithCivic() {
    return new Promise((resolve, reject) => {
      console.log('AUTH CIVIC')
      console.log('CIVIC', this.civicSip)
      const onAuthReceived = (event) => {
        const jwtToken = event.response
        const headers = {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
        fetch(makeURL('sendauthcode'), {
          headers,
          method: 'post',
          body: JSON.stringify({ jwtToken })
        })
          .then((res) => res.json())
          .then((response) => {
            console.log('response', response)
            const expire = ((response.expires_in) * 1000)
            const expiresAt = JSON.stringify(expire + new Date().getTime())
            localStorage.setItem('access_token', response.token)
            localStorage.setItem('expires_at', expiresAt)
            localStorage.setItem('userProfile', JSON.stringify(response.userProfile))
            this.unsubscribeCivic()
            resolve(response)
          })
          .catch((error) => {
            console.log('error', error)
            this.unsubscribeCivic()
            reject(error)
          })
      }
      const onCancel = (event) => {
        console.log('cancelled', event)
        this.unsubscribeCivic()
        reject(event)
      }
      const onRead = (event) => {
        console.log('read', event)
      }
      const onError = (error) => {
        // handle error display if necessary.
        console.log(`   Error type = ${error.type}`)
        console.log(`   Error message = ${error.message}`)
        this.unsubscribeCivic()
        reject(error)
      }
      this.civicSip.on('auth-code-received', onAuthReceived)
      this.civicSip.on('user-cancelled', onCancel)
      this.civicSip.on('read', onRead)
      this.civicSip.on('civic-sip-error', onError)
      this.unsubscribeCivic = () => {
        this.civicSip.off('auth-code-received', onAuthReceived)
        this.civicSip.off('user-cancelled', onCancel)
        this.civicSip.off('read', onRead)
        this.civicSip.off('civic-sip-error', onError)
      }
      this.civicSip.signup({ style: 'popup', scopeRequest: this.civicSip.ScopeRequests.BASIC_SIGNUP })
    })
  }

  loginWithUPort() {
    return new Promise((resolve, reject) => {
      this.uport.requestCredentials(
        {
          requested: ['name', 'phone', 'country', 'avatar', 'email']
          // notifications: true
        },
        (uri) => { // needed to show qr - the simpler approach does nothing
          const qr = kjua({
            text: uri,
            fill: '#000',
            size: 400,
            back: 'rgba(255, 255, 255, 1)'
          })

          // Create wrapping link for mobile touch
          const aTag = document.createElement('a')
          aTag.href = uri

          // Nest QR in <a> and inject
          aTag.appendChild(qr)
          document.getElementById('uport-qr').appendChild(aTag)
        }
      ).then((userProfile) => {
        const headers = {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
        fetch(makeURL('generate_jwt_post'), {
          headers,
          method: 'post',
          body: JSON.stringify({ userProfile, source: 'uport' })
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('UPORT response')
            resolve(data)
          })
          .catch((err) => {
            console.warn(err)
            reject(err)
          })

        // Do something after they have disclosed credentials
      })
    })
  }


  loginWithCredentials(username, password) {
    return new Promise((resolve, reject) => {
      this.auth0.login({
        username,
        password,
        realm: 'Username-Password-Authentication',
        scope: 'openid profile email read:users read:user_idp_tokens'
      }, (err, res) => {
        if (err) {
          console.warn(err)
          toast.error(err.description, { autoClose: 4000, position: 'top-right' })
          reject(err)
        } else {
          console.log(res)
          resolve(res)
        }
      })
    })
  }

  generateGuestToken = () => new Promise((resolve) => {
    console.time('JWT')
    const nav = window.navigator
    const { screen } = window
    let guid = nav.mimeTypes.length
    guid += nav.userAgent.replace(/\D+/g, '')
    guid += nav.plugins.length
    guid += screen.height || ''
    guid += screen.width || ''
    guid += screen.pixelDepth || ''
    const payload = {
      sub: `Guest${guid}${Math.random()}${Date.now()}`,
      guest: true
    }
    const secret = '2key'
    const token = jwt.encode(payload, secret)
    console.log(token)
    localStorage.setItem('access_token', `GUEST${token}`)
    console.timeEnd('JWT')
    resolve(token)
  })

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult)
          // console.log('===========AUTHRESULT', authResult)
          resolve(authResult)
        } else if (err) {
          console.log(`Error: ${err.error}. Check the console for further details.`)
          console.log(err)
          reject(err)
        }
      })
    })
  }

  scheduleTokenRenewal() {
    if (tokenRenewalTimeout) {
      clearTimeout(tokenRenewalTimeout)
    }
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    const delay = expiresAt - Date.now()
    if (delay > 0) {
      tokenRenewalTimeout = setTimeout(() => {
        this.renewToken()
      }, delay)
      console.log('Time to renew token', delay / 1000 / 3600)
    }
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    const expire = ((authResult.expiresIn || authResult.expires_in) * 1000)
    const expiresAt = JSON.stringify(expire + new Date().getTime())
    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.requestedScopes || ''
    localStorage.setItem(
      'userProfile',
      JSON.stringify(authResult.idTokenPayload || jwt_decode(authResult.idToken || authResult.id_token))
    )
    localStorage.setItem('access_token', authResult.accessToken || authResult.access_token)
    localStorage.setItem('id_token', authResult.idToken || authResult.id_token)
    localStorage.setItem('expires_at', expiresAt)
    localStorage.setItem('scopes', JSON.stringify(scopes))
    this.scheduleTokenRenewal()
    // navigate to the home route - depreacted, handled in callback function instead
    // replace('/');
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  checkManage() {
    if (!this.auth0manage && this.isAuthenticated() && localStorage.getItem('id_token')) {
      this.auth0manage = new auth0.Management({
        token: localStorage.getItem('id_token'),
        domain: CONFIG.domain,
        scope: ['read:user_idp_tokens']
      })
    }
  }

  getUser(cb) {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'))
    this.checkManage()
    this.auth0manage.getUser(userProfile.sub, (err, data) => {
      cb(data)
    })
  }

  getProfile(cb) {
    const accessToken = this.getAccessToken()
    return this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile
      }
      cb(profile)
    })
  }

  handleLogout() {
    // Clear access token and ID token from local storage
    // localStorage.removeItem('userProfile')
    localStorage.removeItem('access_token')
    localStorage.removeItem('userProfile')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('scopes')
    localStorage.removeItem('currentRoute')
    localStorage.removeItem('currentBusinessId')
    clearTimeout(tokenRenewalTimeout)
  }

  renewToken() {
    this.auth0.checkSession(
      {
        audience: CONFIG.apiUrl,
        redirectUri: CONFIG.callbackUrl,
        scope: this.requestedScopes,
        usePostMessage: true
      },
      (err, result) => {
        if (err) {
          console.log(err)
        } else {
          this.setSession(result)
        }
      }
    )
  }

  refreshToken() {
    return new Promise((resolve, reject) =>
      this.auth0.checkSession({
        audience: CONFIG.apiUrl,
        redirectUri: CONFIG.callbackUrl,
        scope: this.requestedScopes,
        usePostMessage: true
      }, (err, result) => {
        if (err) {
          reject(err)
        } else {
          this.setSession(result)
          // const userProfile = JSON.parse(localStorage.getItem('userProfile'))
          // this.checkManage()
          // this.auth0manage.getUser(userProfile.sub, (error, data) => {
          //   if (error) {
          //     reject(error)
          //   } else {
          //     resolve(data)
          //   }
          // })
          resolve(result.accessToken)
        }
      }))
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    // if (!!expiresAt && new Date().getTime() < expiresAt) {
    //   this.renewToken();
    // }
    return new Date().getTime() < expiresAt
  }

  userHasScopes(scopes) {
    const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ')
    return scopes.every((scope) => grantedScopes.includes(scope))
  }
}

export const initAuthProvider = () => {
  auth = new Auth()
}

export const authInstance = auth

// export default auth

export default (new Auth())
