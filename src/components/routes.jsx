import PropTypes from 'prop-types'
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import App from './app'
import NestedRoute from './NestedRoute'
import AuthenticateModal from './AuthenticateModal/AuthenticateModal'
import IndexPage from './index'
import { Business, BusinessPage, BusinessCreate, BusinessAudience, BusinessFinances } from './Business/index'
import NotFound from './NotFound'
// import Authenticate from './AuthenticateModal'


import InfluencerPage, {
  InfluencerBalance,
  InfluencerExplore,
  InfluencerFavorites,
  InfluencerMyActivity
} from './InfluencerPage/index'

import SettingsPage, {
  NotificationSettings,
  PaymentOptions,
  ProfileSettings,
  CreateNewPaymentMethod,
  EditPaymentMethod
} from './SettingsPage/index'

import Settings, {
  BusinessInformation,
  Invoices,
  AccountRoles,
  Notifications,
  PaymentMethods,
  CreatePayMethod
} from './Business/Settings/index'

const $ = window.jQuery

$(() => {
  $('body').on('click', 'a[data-outside]', (e) => {
    e.preventDefault()
    window.open(e.currentTarget.getAttribute('href'), '_blank')
  })
})

// const skipIfLogged = (nextState, replace, cb) => {
//   if (auth.isAuthenticated()) replace('/')
//   cb()
// }

class Routes extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  static childContextTypes = {
    auth: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      auth: this.props.auth
    }
  }

  render() {
    return (
      <Switch>
        <NestedRoute path="/" component={App}>
          <Switch>
            <Route path="/login/:phase?" component={AuthenticateModal} />
            <Route path="/signup/:phase?" component={AuthenticateModal} />
            <Route path="/forgot" component={AuthenticateModal} />
            <Route path="/verify" component={AuthenticateModal} />
            <Route exact path="/" component={IndexPage} />
            <Route path="/business/create/:phase?" component={BusinessCreate} />
            <NestedRoute path="/business" component={Business}>
              <Switch>
                <Route path="/business/:handle/audience" component={BusinessAudience} />
                <Route path="/business/:handle/finances" component={BusinessFinances} />
                <NestedRoute path="/business/:handle/settings" component={Settings} private>
                  <Switch>
                    <Route path="/business/:handle/settings/business-information" component={BusinessInformation} />
                    <Route path="/business/:handle/settings/payment-methods" component={PaymentMethods} />
                    <Route path="/business/:handle/settings/business-invoices" component={Invoices} />
                    <Route path="/business/:handle/settings/account-roles" component={AccountRoles} />
                    <Route path="/business/:handle/settings/notifications" component={Notifications} />
                    <Route path="/business/:handle/settings/payment/new/:method" component={CreatePayMethod} />
                    <Route component={BusinessInformation} />
                  </Switch>
                </NestedRoute>
                <Route path="/business/:handle/:join?/:business_id?/:campaign_id?" component={BusinessPage} />
              </Switch>
            </NestedRoute>
            <NestedRoute path="/influencer" component={InfluencerPage} private>
              <Switch>
                <Redirect exact from="/influencer" to="/influencer/my-activity" />
                <Route path="/influencer/my-activity" component={InfluencerMyActivity} />
                <Route path="/influencer/favorites" component={InfluencerFavorites} />
                <Route path="/influencer/explore" component={InfluencerExplore} />
                <Route path="/influencer/balance" component={InfluencerBalance} />
                <Route component={InfluencerMyActivity} />
              </Switch>
            </NestedRoute>
            <NestedRoute path="/settings" component={SettingsPage} private>
              <Switch>
                <Redirect exact from="/settings" to="/settings/profile" />
                <Route path="/settings/profile" component={ProfileSettings} />
                <Route path="/settings/payment/new/:method" component={CreateNewPaymentMethod} />
                <Route exact path="/settings/payment" component={PaymentOptions} />
                <Route path="/settings/notification" component={NotificationSettings} />
                <Route path="/settings/edit-paymethod/:paymentId" component={EditPaymentMethod} />
                <Route component={ProfileSettings} />
              </Switch>
            </NestedRoute>
            <Route component={NotFound} />
          </Switch>
        </NestedRoute>
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default Routes
