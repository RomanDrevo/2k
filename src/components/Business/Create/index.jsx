import 'react-tagsinput/react-tagsinput.css'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import swal from 'sweetalert2'
import { toast } from 'react-toastify'
import './styles.css'
import { getAccounts, getPermissions } from '../../../_core/fb'
import { loadHistory } from '../../../_core/utils'
// import Authenticate from '../../AuthenticateModal/AuthenticateModal'
import backgroundCenterHeader from '../../../icons/background_center_head.png'
import backgroundContent from '../../../icons/background-content.png'
import backgroundLeftHeader from '../../../icons/background_left_head.png'
import backgroundRightHeader from '../../../icons/background_right_head.png'
import { BusinessActions, CampaignActions, UserActions } from '../../../_redux'
import BusinessMeta from './BusinessMeta'
import BusinessPageReady from './BusinessPageReady'
import CheckEmail from './CheckEmail'
import CreateModal from './CreateModal'
import FacebookPageList from './FacebookPageList'
import Loading from './Loading'
import LoginFaceBook from './LoginFaceBook'
import NoPages from './NoPages'
import Authenticate from '../../AuthenticateModal/AuthenticateModal'
import waitingPage from '../../../icons/waiting_page.jpg'

const urlRegex = /[^a-zA-Z0-9-_]/g

let mounted = false

const mapStateToProps = (state) => ({
  user: {
    data: state.user.get('userData').toJS(),
    meta: state.user.get('userMetadata').toJS(),
    profile: state.user.get('userProfile').toJS(),
    identities: state.user.get('identities').toJS()
  },
  idpLoading: state.user.get('loading'),
  listLoading: state.business.get('listLoading'),
  businessList: state.business.get('businessList').toJS(),
  authModalOpen: state.user.get('authModalOpen')
})

const mapDispatchToProps = {
  CREATE_BUSINESS: BusinessActions.CREATE_BUSINESS,
  FETCH_BUSINESS_DETAILS: BusinessActions.FETCH_BUSINESS_DETAILS,
  OPEN_CAMPAIGN_CREATE_MODAL: CampaignActions.OPEN_CAMPAIGN_CREATE_MODAL,
  UPDATE_BUSINESS_INFO: BusinessActions.UPDATE_BUSINESS_INFO,
  FETCH_USERS_IDP: UserActions.FETCH_USERS_IDP
}

class CreateBusiness extends Component {
  static propTypes = {
    listLoading: PropTypes.bool,
    authModalOpen: PropTypes.bool,
    user: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    businessList: PropTypes.object,
    CREATE_BUSINESS: PropTypes.func.isRequired,
    // FETCH_BUSINESS_DETAILS: PropTypes.func.isRequired,
    OPEN_CAMPAIGN_CREATE_MODAL: PropTypes.func.isRequired,
    UPDATE_BUSINESS_INFO: PropTypes.func.isRequired,
    FETCH_USERS_IDP: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  state = {
    facebookAccounts: [],
    isCreateBusinessEnabled: true,
    wizzard: true,
    loading: !this.props.match.params.phase || this.props.match.params.phase === 'pages'
    || this.props.match.params.phase === 'login',
    business: {
      email: this.props.user.profile.email || ''
    }
  }

  componentDidMount() {
    mounted = true
    const { phase } = this.props.match.params
    const { auth } = this.context
    if (!phase || phase === 'pages' || phase === 'login') {
      if (!auth.isAuthenticated()) {
        this.checkPhases(this.props.match.params.phase)
      } else {
        this.props.FETCH_USERS_IDP().then(() => {
          this.checkPhases(this.props.match.params.phase)
        })
      }
    } else {
      this.checkPhases(this.props.match.params.phase)
    }
  }

  componentWillReceiveProps(props) {
    if (props.user.identities.loading) {
      return
    }
    if (!props.authModalOpen && this.props.authModalOpen && !this.state.isCreateBusinessEnabled) {
      this.setState({ isCreateBusinessEnabled: true })
    }
    const { phase: newPhase } = props.match.params
    const { phase } = this.props.match.params
    const { loading } = this.props.user.identities
    const { loading: newLoading, facebook } = props.user.identities
    if ((phase !== newPhase && !newLoading) || (loading !== newLoading && !newLoading)) {
      this.checkPhases(newPhase, facebook)
    }
    const { email } = this.props.user.profile
    const { email: newEmail } = props.user.profile
    if (email !== newEmail) {
      const business = { ...this.state.business, email: newEmail }
      this.setState({ business })
    }
    if (newPhase === 'pages' && this.props.listLoading && !props.listLoading) {
      this.checkPhases(newPhase, facebook, true)
    }
  }

  componentWillUnmount() {
    mounted = false
  }

  onBack = () => {
    const { phase = 'login' } = this.props.match.params
    // console.log(phase, phase === 'nopages')
    if (phase === 'nopages') {
      this.goTo('login')
    } else if (phase === 'handle') {
      const { facebookAccounts } = this.state
      if (facebookAccounts && facebookAccounts.length) {
        this.props.history.goBack()
      } else {
        this.goTo('login')
      }
    } else if (phase === 'login') {
      this.onCloseRequest()
    } else {
      this.props.history.goBack()
    }
  }

  onAuth0Login = () => {
    if (this.context.auth.isAuthenticated()) {
      this.goToHandle()
    } else {
      this.setState({ isCreateBusinessEnabled: false })
      localStorage.setItem('route', '/business/create/pages')
      this.props.history.push('/signup')
      // this.goTo('auth0login')
    }
  }

  onBusinessPageDtail = (detail) => {
    Cookies.set('FacebookLogin', 'false')
    const business = {
      ...this.state.business,
      name: detail.name,
      handle: detail.name.replace(urlRegex, ''),
      email: detail.email
    }
    this.setState({
      data: detail,
      business
    }, () => this.goTo('checkmail'))
  }

  onChangeBusinessMeta = (e) => {
    const business = { ...this.state.business }
    business[e.target.name] = e.target.value
    if (e.target.name === 'name') {
      business.handle = e.target.value.replace(urlRegex, '')
    } else if (e.target.name === 'handle') {
      business.handle = e.target.value.replace(urlRegex, '')
    }
    this.setState({ business, emailChanged: this.state.emailChanged || e.target.name === 'email' })
  }

  onBusinessDetail = (id, handle) => {
    if (mounted && !this.state.abort) {
      this.setState({ id })
      this.goTo('ready')
      setTimeout(() => {
        if (mounted) {
          this.setState({ data: {}, business: {} })
          this.props.history.push(`/business/${handle}`)
        }
      }, 2000)
      // Promise.resolve(this.props.FETCH_BUSINESS_DETAILS(id))
      //   .then((res) => {
      //     // console.log('=======FETCH_BUSINESS_DETAILS', res.business, this.state.data)
      //     // if (this.state.data && this.state.data.id) {
      //     //   if (res.business.facebook_page_url && res.business.facebook_category) {
      //     //     browserHistory.push(`/business/${res.business.handle}`)
      //     //     clearInterval(this.intervalId)
      //     //     this.intervalId = null
      //     //   }
      //     // } else {
      //     //   clearInterval(this.intervalId)
      //     //   this.intervalId = null
      //     //   browserHistory.push(`/business/${res.business.handle}`)
      //     // }
      //     clearTimeout(this.intervalId)
      //     this.intervalId = null
      //     if (mounted) {
      //       browserHistory.push(`/business/${res.business.handle}`)
      //     }
      //   })
      //   .catch((err) => console.warn('=====FETCH_BUSINESS_DETAILS', err))
    }
  }

  onCreateBusiness = () => {
    const { CREATE_BUSINESS, intl: { formatMessage } } = this.props
    const { data: fbData } = this.state
    const str = (fbData && fbData.id) ?
      `https://www.facebook.com/${fbData.name.replace(/\s/g, '-')}-${fbData.id}/`
      : undefined
    const business = {
      ...this.state.business,
      facebook_category: fbData && fbData.category,
      facebook_page_id: fbData && fbData.id,
      facebook_page_url: str,
      facebook_page_name: fbData && fbData.name
    }
    if (this.state.emailChanged) {
      business.contact_email = this.state.business.email
    }
    this.setState({ business }, () => {
      this.goTo('waiting')
    })
    const postData = { ...business }
    delete postData.email
    toast.info(formatMessage({ id: 'business.creating', defaultMessage: '!Creating your business...' }))
    // console.log('========FACEBOOKPARAMETER', postData)
    Promise.resolve(CREATE_BUSINESS(postData))
      .catch((err) => {
        // loadingSetter(false)
        console.warn(err)
      })
      .then((res) => {
        // console.log('==========CREATEBUSSNESSRESULT', res)
        if (res) {
          toast.dismiss()
          toast.success(formatMessage({
            id: 'business.almost_ready', defaultMessage: '!Your business is almost ready...'
          }))
          this.setState({ data: res.business }, () => {
            if (mounted) {
              this.intervalId = setTimeout((() => {
                this.onBusinessDetail(res.business.id, res.business.handle)
              }), 200)
            }
          })
        } else if (!this.state.abort) {
          this.goTo('handle')
        } else {
          this.onAbort()
        }
        // loadingSetter(false)
      })
    // loadingSetter(true)()
  }

  onAbort = () => {
    localStorage.removeItem('route')
    mounted = false
    const route = this.context.auth.isAuthenticated() ? loadHistory(true) : '/'
    this.setState({
      abort: true,
      wizzard: false,
      id: null,
      business: {
        email: this.props.user.profile.email || ''
      },
      data: null,
      noPages: null,
      facebookAccounts: []
    })
    const { data } = this.state
    if (data && data.id) {
      this.props.UPDATE_BUSINESS_INFO({ id: data.id, business_id: data.id, is_deleted: true })
    }
    // this.props.FETCH_BUSINESS_DETAILS(businessId)
    this.props.history.push(route)
  }

  onCloseRequest = () => {
    const { intl: { formatMessage } } = this.props
    const defaultMessage = `!Only few more clicks and
      your new 2key Business
      Page is ready!`
    swal({
      title: formatMessage({ id: 'business.abort_new', defaultMessage }),
      padding: 10,
      showCancelButton: true,
      confirmButtonText: formatMessage({ id: 'business.continue', defaultMessage: '!CONTINUE' }),
      cancelButtonText: formatMessage({ id: 'business.leave', defaultMessage: '!LEAVE' }),
      confirmButtonClass: 'btn swal confirm',
      cancelButtonClass: 'btn swal cancel stopPropagation',
      customClass: 'border-green create-close-dialog'
    }).then((res) => {
      if (res.dismiss) {
        this.onAbort()
      }
    })
  }

  onCreateNewCampaign = () => {
    this.props.OPEN_CAMPAIGN_CREATE_MODAL(true)
  }

  confirmEmail = () => {
    const business = {
      ...this.state.business,
      name: this.state.data.name,
      handle: this.state.data.name.replace(urlRegex, '')
    }
    this.setState({ business }, () => this.goTo('handle'))
  }

  goTo = (phase) => {
    const { location: { pathname }, match: { params: { phase: currentPhase } } } = this.props
    const newRoute = pathname.replace(/\/$/, '').replace(`/${currentPhase}`, '')
    this.props.history.push(`${newRoute}/${phase}`)
  }

  goToHandle = () => {
    const business = {
      ...this.state.business,
      name: this.state.business.name || 'Change me',
      handle: this.state.business.handle || 'Changeme'
    }
    this.setState({ business, loading: false }, () => this.goTo('handle'))
  }

  checkPhases = (phase = 'login', token, force = false) => {
    if (this.state.abort) {
      this.onAbort()
    }
    if (phase === 'ready') {
      if (!this.state.id) {
        this.goTo('login')
      }
    } else if (phase === 'waiting') {
      if (!this.state.business.name) {
        this.goTo('login')
      }
    } else if (phase === 'handle') {
      if (this.state.wizzard && !this.state.business.name) {
        this.goTo('login')
      }
    } else if (phase === 'checkmail') {
      if (!this.state.data) {
        this.goTo('login')
      }
    } else if (phase === 'nopages') {
      if (!this.state.noPages) {
        this.goTo('login')
      }
    } else if (phase === 'pages') {
      this.checkSecond(token, force)
    } else if (phase === 'auth0login') {
      if (this.context.auth.isAuthenticated()) {
        this.goToHandle()
      } else {
        localStorage.setItem('route', '/business/create/pages')
      }
    } else {
      this.checkFirst(token)
    }
  }

  checkFirst = (token = this.props.user.identities.facebook) => {
    if (this.context.auth.isAuthenticated()) {
      this.setState({ loading: true })
      getPermissions(token)
        .then(({ data }) => {
          const permissions = data.filter((item) => item.status === 'granted').map((item) => item.permission).join(',')
          const pageShowList = permissions.includes('pages_show_list')
          // console.log('permissions', data, permissions, pageShowList)
          if (pageShowList) {
            this.setState({ fbGranted: true })
          }
          this.setState({ loading: false })
        })
        .catch((err) => {
          console.warn(err)
          this.setState({ loading: false })
        })
    } else {
      this.setState({ loading: false })
    }
  }

  checkSecond = (token = this.props.user.identities.facebook, force) => {
    this.setState({ loading: true })
    if (this.props.listLoading && !force) {
      return
    }
    // console.log('token', token)
    if (!token) {
      if (!this.context.auth.isAuthenticated()) {
        this.goTo('login')
      } else {
        this.goToHandle()
        return
      }
    }

    getAccounts(token)
      .then(({ data }) => {
        if (data.length) {
          const { businessList, user } = this.props
          const list = Object.keys(businessList).map((key) => businessList[key].fbId).join(',')
          const facebookAccounts = data.reduce((accumulator, currentValue) => {
            if (currentValue.is_published && !list.includes(currentValue.id)) {
              accumulator.push({
                ...currentValue,
                email: (currentValue.emails && currentValue.emails[0]) || user.meta.email
              })
            }
            return accumulator
          }, [])
          // const facebookAccounts = [...data]
          //   .filter((item) => (!list.includes(item.id) && item.is_published))
          // console.log(data, facebookAccounts)
          if (!facebookAccounts.length) {
            this.setState({
              noPages: true,
              loading: false
            })
            this.goTo('nopages')
          } else {
            this.setState({ facebookAccounts, loading: false })
          }
        } else {
          this.setState({
            noPages: true,
            loading: false
          })
          this.goTo('nopages')
        }
      })
      .catch((error) => {
        console.warn(error)
        this.goTo('login')
        this.setState({ loading: false })
      })
  }

  loginWithFaceBook = () => {
    Cookies.set('FacebookLogin', 'true')
    if (this.state.fbGranted) {
      this.goTo('pages')
    } else {
      localStorage.setItem('route', '/business/create/pages')
      this.context.auth.auth0.authorize({
        connection: 'facebook',
        connection_scope: 'pages_show_list'
      })
    }
  }

  render() {
    const { match: { params: { phase = 'login' } }, intl: { formatMessage } } = this.props
    const {
      facebookAccounts, loading, isCreateBusinessEnabled,
      business
    } = this.state
    return (
      <div className="business-page container-fluid">
        <CreateModal isOpen={isCreateBusinessEnabled} handleClose={this.onCloseRequest}>
          {phase === 'login' && (
            <LoginFaceBook
              onLogin={this.onAuth0Login}
              onBack={this.onBack}
              loginWithFaceBook={this.loginWithFaceBook}
            />
          )}
          {phase === 'auth0login' && (
            <Authenticate
              onBack={this.onBack}
              isOpen
              {...this.props}
              singupTitle={formatMessage({ id: 'business.no_worries', defaultMessage: '!No worries!' })}
              singupSubTitle={formatMessage({
                id: 'business.loginTo2key',
                defaultMessage: '!Create your 2key Bussines page in less then 3 minutes First, Join 2key!'
              })}
            />)
          }
          {phase === 'pages' && (
            <FacebookPageList
              onBack={this.onBack}
              facebookAccounts={facebookAccounts}
              businessPageDetail={this.onBusinessPageDtail}
            />
          )}
          {phase === 'nopages' && (
            <NoPages
              onBack={this.onBack}
              createManual={this.goToHandle}
              onCancel={this.onAbort}
            />
          )}
          {phase === 'checkmail' && (
            <CheckEmail
              onBack={this.onBack}
              email={business.email}
              onChange={this.onChangeBusinessMeta}
              confirmEmail={this.confirmEmail}
            />
          )}
          {phase === 'handle' && (
            <BusinessMeta
              // noPages={noPages || (!facebookAccounts || facebookAccounts.length <= 0)}
              onBack={this.onBack}
              name={business.name}
              handle={business.handle}
              onChange={this.onChangeBusinessMeta}
              createBusiness={this.onCreateBusiness}
            />
          )}
          {phase === 'waiting' && <img className="waiting-page" src={waitingPage} alt="" />}
          {phase === 'ready' && <BusinessPageReady />}
          {loading && <Loading />}
        </CreateModal>
        <div>
          <div className="row create-background">
            <div className="col-md-3 minimal-padding d-none d-md-block">
              <img className="background-horizontal" src={backgroundLeftHeader} alt="" />
            </div>
            <div className="col-md-6 minimal-padding">
              <img className="background-header-content" src={backgroundCenterHeader} alt="" />
            </div>
            <div className="col-md-3 minimal-padding d-none d-md-block">
              <img className="background-horizontal" src={backgroundRightHeader} alt="" />
            </div>
          </div>
          <div className="row create-background">
            <div className="col-md-3 minimal-padding d-none d-md-block">
              <img className="background-horizontal" src={backgroundContent} alt="" />
            </div>
            <div className="col-md-3 minimal-padding d-none d-md-block">
              <img className="background-horizontal" src={backgroundContent} alt="" />
            </div>
            <div className="col-md-3 minimal-padding d-none d-md-block">
              <img className="background-horizontal" src={backgroundContent} alt="" />
            </div>
            <div className="col-md-3 minimal-padding d-none d-md-block">
              <img className="background-horizontal" src={backgroundContent} alt="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreateBusiness)))
