import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { BusinessActions } from '../../../_redux'
import '../../../styles/global.css'
import Loading from '../../_common/Loading'
import Menu from './Menu'
import './settings.css'


class BussinesSettings extends Component {
    static propTypes = {
      FETCH_BUSINESS_DETAILS: PropTypes.func,
      FETCH_USER_ROLE_LIST: PropTypes.func,
      businessDetails: PropTypes.object,
      // audience: PropTypes.object,
      match: PropTypes.object,
      // loading: PropTypes.bool,
      OPEN_CREATE_AUDIENCE_WINDOW: PropTypes.func,
      // isCreateNewAudienceWindowOpen: PropTypes.bool,
      // businessAudiences: PropTypes.array
      children: PropTypes.object
    }

    componentWillMount() {
      const { FETCH_USER_ROLE_LIST, FETCH_BUSINESS_DETAILS } = this.props
      Promise.resolve(FETCH_BUSINESS_DETAILS(this.props.match.params.handle))
        .then(() => {
          FETCH_USER_ROLE_LIST(this.props.businessDetails.id)
        })
    }

    handleOpenNewAudienceWindow = () => {
      this.props.OPEN_CREATE_AUDIENCE_WINDOW()
    }

    render() {
      const { children, businessDetails } = this.props

      // console.log('BusinessDetails: ', businessDetails)

      return (
        <div className="page-body container settings">
          <div className="container">
            <div className="row">


              <div className="col-sm-3">
                <div className="d-none d-sm-block">
                  <Menu businessDetails={businessDetails} />
                </div>
              </div>


              <div className="col-9 col-xl-5 business-info-wrapper">
                <div className="business-info-header flex">
                  <div className="flex flex-column header-item border-none">
                    <div className="header-item-numeric">$6.5K</div>
                    <div>Funds Used</div>
                  </div>
                  <div className="flex flex-column header-item">
                    <div className="header-item-numeric">$6.3K</div>
                    <div>Funds Remain</div>
                  </div>
                  <div className="flex flex-column header-item border-none">
                    <div className="header-item-numeric">50</div>
                    <div>Results</div>
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      )
    }
}

const BusinessInfo = Loadable({
  loading: Loading,
  loader: () => import('./BusinessInformation')
})
const PayOptions = Loadable({
  loading: Loading,
  loader: () => import('./PaymentOptions/index')
})
const BusinessInvoices = Loadable({
  loading: Loading,
  loader: () => import('./Invoices')
})
const NotificationSettings = Loadable({
  loading: Loading,
  loader: () => import('./Notifications')
})
const BusinessAccountRoles = Loadable({
  loading: Loading,
  loader: () => import('./AccountRoles')
})
const CreateNewPayMethod = Loadable({
  loading: Loading,
  loader: () => import('./PaymentOptions/Components/CreateAccount')
})

export const BusinessInformation = () => <BusinessInfo />
export const PaymentMethods = () => <PayOptions />
export const Invoices = () => <BusinessInvoices />
export const AccountRoles = () => <BusinessAccountRoles />
export const Notifications = () => <NotificationSettings />
export const CreatePayMethod = () => <CreateNewPayMethod />
// export const CreateNewPaymentMethod = () => <CreatePayment />
// export const EditPaymentMethod = () => <EditPayment />
// export const SettingsModal = () => <Modal />

function mapStateToProps(state) {
  const businessDetails = state.business.get('businessDetails').toJS().business
  const businessList = state.business.get('businessList').toJS()
  const businessAudiences = state.business.get('businessAudiences').toJS()
    .filter((x) => x.is_deleted === false)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const isAdmin = businessDetails && businessDetails.id && Boolean(businessList[businessDetails.id])
  const isCreateNewAudienceWindowOpen = state.business.get('isCreateNewAudienceWindowOpen')
  const isEditAudienceWindowOpen = state.business.get('isCreateNewAudienceWindowOpen')
  const selector = formValueSelector('campaign-form')
  const audience_name = selector(state, 'fields.white_list_audience_name')
  const white_list_audience_names = state.business
    .get('businessDetails').toJS().business.white_list_audience_names || []
  if (audience_name && audience_name.length > 0) white_list_audience_names.push(audience_name)

  return {
    loading: state.business.get('loading'),
    businessDetails,
    businessList,
    isAdmin,
    businessAudiences,
    isCreateNewAudienceWindowOpen,
    white_list_audience_names,
    isEditAudienceWindowOpen,
    audience: state.business.get('audience').toJS()
  }
}

export default injectIntl(withRouter(connect(mapStateToProps, {
  FETCH_BUSINESS_DETAILS: BusinessActions.FETCH_BUSINESS_DETAILS,
  UPDATE_BUSINESS_INFO: BusinessActions.UPDATE_BUSINESS_INFO,
  FETCH_BUSINESS_AUDIENCES: BusinessActions.FETCH_BUSINESS_AUDIENCES,
  OPEN_CREATE_AUDIENCE_WINDOW: BusinessActions.OPEN_CREATE_AUDIENCE_WINDOW,
  OPEN_EDIT_AUDIENCE_WINDOW: BusinessActions.OPEN_CREATE_AUDIENCE_WINDOW,
  CLOSE_EDIT_AUDIENCE_WINDOW: BusinessActions.OPEN_CREATE_AUDIENCE_WINDOW,
  CREATE_FILE: BusinessActions.CREATE_FILE,
  DELETE_FILE: BusinessActions.DELETE_FILE,
  FETCH_USER_ROLE_LIST: BusinessActions.FETCH_USER_ROLE_LIST
})(BussinesSettings)))

