import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { replace, goBack } from 'react-router-redux'
import debounce from 'lodash/debounce'
import './OffCanvasOverlay'
import { CampaignActions, DBEnumsActions, SettingsActions, UserActions, UtilActions } from '../_redux'
import AppHeader from './_common/Header'
import { SettingsModal } from './SettingsPage/index'
import LogoutDialogue from './_common/LogoutDialogue'
import CampaignResultsModal from './Offer/Components/Results'
import '../styles/app.css'

const mapStateToProps = (state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  return {
    user: {
      ...userMetadata
    },
    isMobile: state.general.get('isMobile'),
    isLogoutDialogueOpen: state.general.get('isLogoutDialogueOpen'),
    campaign: state.campaign.get('campaign').toJS(),
    resultsModal: state.campaign.get('resultsModal'),
    resultsLoading: state.campaign.get('resultsLoading'),
    results: state.campaign.get('results').toJS(),
    businessList: state.business.get('businessList').toJS(),
    businessDetails: state.business.get('businessDetails')
      && state.business.get('businessDetails').toJS().business,
    pathname: state.routing.location.pathname
  }
}

const mapDispatchToProps = {
  // FETCH_USERS_IDP: UserActions.FETCH_USERS_IDP,
  FETCH_USER_METADATA: UserActions.FETCH_USER_METADATA,
  FETCH_DB_ENUMS: DBEnumsActions.FETCH_DB_ENUMS,
  OPEN_SETTINGS_MODAL: SettingsActions.OPEN_SETTINGS_MODAL,
  CLOSE_CAMPAIGN_RESULTS_MODAL: CampaignActions.CLOSE_CAMPAIGN_RESULTS_MODAL,
  resize: UtilActions.resize,
  replace,
  goBack
}

class App extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    resultsModal: PropTypes.bool,
    resultsLoading: PropTypes.bool,
    pathname: PropTypes.string,
    user: PropTypes.object,
    businessList: PropTypes.object,
    businessDetails: PropTypes.object,
    results: PropTypes.object,
    campaign: PropTypes.object,
    OPEN_SETTINGS_MODAL: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
    isLogoutDialogueOpen: PropTypes.bool,
    replace: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    FETCH_DB_ENUMS: PropTypes.func.isRequired,
    // FETCH_USERS_IDP: PropTypes.func.isRequired,
    FETCH_USER_METADATA: PropTypes.func.isRequired,
    CLOSE_CAMPAIGN_RESULTS_MODAL: PropTypes.func.isRequired,
    resize: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
    const { isAuthenticated } = this.context.auth
    const {
      FETCH_DB_ENUMS,
      FETCH_USER_METADATA
    } = this.props
    FETCH_DB_ENUMS()
    if (isAuthenticated()) {
      FETCH_USER_METADATA()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  onLoginClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.history.replace('/login')
  }

  onSignupClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.history.replace('/signup')
  }

  onLogout = () => {
    this.context.auth.handleLogout()
    window.location.replace(this.props.pathname.includes('/business')
      ? 'https://home.2key.network/4businesses/'
      : 'https://home.2key.network/')
    // this.props.history.replace('/')
  }

  onProfileClick = () => {
    if (this.props.isMobile) {
      this.props.OPEN_SETTINGS_MODAL(true)
    } else {
      this.props.history.push('/settings/profile')
    }
    /* const currentPath = this.props.location.pathname
      if (currentPath.indexOf('/settings') > -1 && this.previousPath) {
        this.props.replace(this.previousPath)
      } else {
        this.previousPath = currentPath
        this.props.replace('/settings/profile')
      }
    }*/
  }

  handleWindowResize = debounce(() => {
    this.props.resize()
  }, 300)

  handleResultsModalClose = () => {
    this.props.CLOSE_CAMPAIGN_RESULTS_MODAL(false)
  }

  refContainer = (e) => {
    this.container = e
  }

  render() {
    const {
      user, resultsModal, campaign, results,
      resultsLoading, businessList, businessDetails,
      isMobile
    } = this.props

    const { isLogoutDialogueOpen } = this.props
    const isAdmin = businessList && businessDetails && Boolean(businessList[businessDetails.id])
    return (
      <div ref={this.refContainer} className="App">
        <AppHeader
          user={user}
          onLogout={this.onLogout}
          onProfileClick={this.onProfileClick}
          hideProfileName={isMobile}
          onLoginClick={this.onLoginClick}
          onSignupClick={this.onSignupClick}
        />

        <div className={`app-body${isAdmin ? ' admin' : ''}`}>
          {this.props.children}
        </div>
        <div className="app-footer" />
        <SettingsModal isMobile={isMobile} />
        <LogoutDialogue isOpen={isLogoutDialogueOpen} onLogout={this.onLogout} />
        <CampaignResultsModal
          isMobile={isMobile}
          open={resultsModal}
          campaign={campaign}
          results={results}
          onClose={this.handleResultsModalClose}
          loading={resultsLoading}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
