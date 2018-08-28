import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import { loadHistory } from '../_core/utils'
import { UserActions, BusinessActions } from '../_redux'

class IndexPage extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    // FETCH_USERS_IDP: PropTypes.func.isRequired,
    FETCH_USER_METADATA: PropTypes.func.isRequired,
    FETCH_BUSINESS_LIST: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  componentWillMount() {
    const {
      location: { hash }, history: { push },
      // FETCH_USERS_IDP,
      FETCH_USER_METADATA, FETCH_BUSINESS_LIST
    } = this.props
    const { auth } = this.context
    if (/access_token|id_token|error/.test(hash)) {
      auth.handleAuthentication().then(() => {
        if (!auth.isAuthenticated()) {
          push('/login')
        } else {
          // const fbLogin = Cookies.get('FacebookLogin')
          const route = localStorage.getItem('route') || loadHistory()
          Cookies.remove('FacebookLogin')
          localStorage.removeItem('route')
          // FETCH_USERS_IDP()
          FETCH_USER_METADATA()
          FETCH_BUSINESS_LIST()
          push(route)
        }
      })
        .catch(() => {
          push('/login')
        })
    } /* else if (!auth.isAuthenticated()) {
      replace('/login')
    }*/
  }

  render() {
    return (
      <div className="text-center">Please use the menu to navigate through the app</div>
    )
  }
}

export default withRouter(connect(null, {
  FETCH_USERS_IDP: UserActions.FETCH_USERS_IDP,
  FETCH_USER_METADATA: UserActions.FETCH_USER_METADATA,
  FETCH_BUSINESS_LIST: BusinessActions.FETCH_BUSINESS_LIST
})(IndexPage))
