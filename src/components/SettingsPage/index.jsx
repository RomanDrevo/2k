import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Loading from '../_common/Loading'
import Menu from './Menu'
import { InfluencerActions } from '../../_redux/index'
import '../../styles/page.css'

class SettingsPage extends Component {
  static propTypes = {
    children: PropTypes.object,
    // history: PropTypes.object.isRequired,
    FETCH_INFLUENCER_PAYMETHOD_LIST: PropTypes.func
  }
  static contextTypes = {
    auth: PropTypes.object
  }
  componentDidMount() {
    this.props.FETCH_INFLUENCER_PAYMETHOD_LIST()
  }

  render() {
    const { children } = this.props

    return (
      <div className="page-body container settings">
        <div className="d-flex justify-content-center">
          <div className="d-none d-sm-block">
            <Menu />
          </div>
          <div className="w-100">
            {children}
          </div>
        </div>
      </div>
    )
  }
}

const Settings = Loadable({
  loading: Loading,
  loader: () => import('./ProfileSettings')
})
const Options = Loadable({
  loading: Loading,
  loader: () => import('./PaymentOptions')
})
const Notification = Loadable({
  loading: Loading,
  loader: () => import('./NotificationSettings')
})
const CreatePayment = Loadable({
  loading: Loading,
  loader: () => import('./PaymentOptions/Components/CreateAccount')
})
const EditPayment = Loadable({
  loading: Loading,
  loader: () => import('./PaymentOptions/Components/EditAccount')
})
const Modal = Loadable({
  loading: Loading,
  loader: () => import('./SettingsModal')
})


export default connect(null, {
  FETCH_INFLUENCER_PAYMETHOD_LIST: InfluencerActions.FETCH_INFLUENCER_PAYMETHOD_LIST
})(SettingsPage)
// export { default as PaymentOptions } from './PaymentOptions'
export const ProfileSettings = () => <Settings />
export const PaymentOptions = () => <Options />
export const NotificationSettings = () => <Notification />
export const CreateNewPaymentMethod = () => <CreatePayment />
export const EditPaymentMethod = () => <EditPayment />
export const SettingsModal = () => <Modal />
