import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap'
import { Panel } from '../../../_common/index'
import { InfluencerActions, UserActions, SettingsActions } from '../../../../_redux/index'
import BankAccounts from './Components/BankAccounts'
import './PaymentOptions.css'
// import '../profile-settings.css'

class PaymentOptions extends React.Component {
  static propTypes = {
    // children: PropTypes.oneOfType([
    //   PropTypes.object,
    //   PropTypes.array,
    //   PropTypes.node
    // ]),
    OPEN_ADD_NEW_ACCOUNT: PropTypes.func,
    paymentMethodsList: PropTypes.array,
    isPaymethodListOpen: PropTypes.bool,
    isAddNewAccountOpen: PropTypes.bool,
    prevLocation: PropTypes.string,
    location: PropTypes.object,
    // FETCH_INFLUENCER_PAYMETHOD_LIST: PropTypes.func,
    CLOSE_SETTINGS_MODAL: PropTypes.func,
    businessDetails: PropTypes.object
  }

  state={
    showNewAccountBtns: !(this.props.location.state && this.props.location.state.prevLocation === '/influencer/balance')
  }

  componentDidMount() {
    // this.props.FETCH_INFLUENCER_PAYMETHOD_LIST()

  }

  handleAddNewAccount = () => {
    this.props.OPEN_ADD_NEW_ACCOUNT()
  }

  handleOnLinkClick = () => {
    this.props.CLOSE_SETTINGS_MODAL()
  }

  refContainer = (e) => {
    this.container = e
  }

  render() {
    console.log('PayOptionsProps: ', this.props)
    const { businessDetails } = this.props
    if (!this.props.paymentMethodsList.length || this.props.isAddNewAccountOpen) {
      return (
        <div className="payment-options-wrapper">
          <Panel
            ref={this.refContainer}
            className="black small"
            style={{ padding: 0 }}
            title={(
              <div className="col-sm-auto">
                <FormattedMessage id="settings.payment_add_account" defaultMessage="!Add New Account" />
              </div>
            )}
          >
            <div>
              {this.state.showNewAccountBtns ? (
                <div className="flex justify-center">
                  <ButtonToolbar>
                    <ButtonGroup>
                      <Link
                        style={{ textDecoration: 'none' }}
                        className="mr2"
                        // to="/settings/payment/new/bank"
                        to={`/business/${businessDetails.id}/settings/payment/new/bank`}
                        onClick={this.handleOnLinkClick}
                      >
                        <button className="btn payment-method-btn mr3">
                          <FormattedMessage id="settings.bank_account" defaultMessage="!Bank Account" />
                        </button>
                      </Link>
                    </ButtonGroup>
                    <ButtonGroup>
                      <Link
                        style={{ textDecoration: 'none' }}
                        className="ml2"
                        // to="/settings/payment/new/paypal"
                        to={`/business/${businessDetails.id}/settings/payment/new/paypal`}
                      >
                        <button className="btn payment-method-btn mr3">
                          <FormattedMessage id="settings.paypal" defaultMessage="!PayPal" />
                        </button>
                      </Link>
                    </ButtonGroup>
                  </ButtonToolbar>
                </div>
              ) : null}
              {/* {this.props.children}*/}
            </div>
          </Panel>
        </div>
      )
    }
    if (this.props.paymentMethodsList.length || this.props.isPaymethodListOpen) {
      return (
        <div className="payment-options-wrapper">
          <Panel
            ref={this.refContainer}
            className="black small"
            style={{ padding: 0 }}
            title={(
              <div className="col-sm-auto">
                <FormattedMessage id="settings.withdrawal" defaultMessage="!Withdrawal Accounts Details" />
              </div>
            )}
          >
            <BankAccounts />
            <span className="add-account-btn" onClick={this.handleAddNewAccount}>
              + <FormattedMessage id="settings.payment_add_account" defaultMessage="!Add New Account" />
            </span>
          </Panel>
        </div>
      )
    }
    return null
  }
}

export default withRouter(injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const enums = state.enums.get('enums').toJS()
  const paymentMethodsList = state.influencer.get('payment_methods_list').toJS()
    .filter((x) => x.is_deleted !== true)
  const summaryDetails = state.influencer.get('summary_data').toJS()

  const businessDetails = state.business.get('businessDetails').toJS().business

  const balanceDetails = state.influencer.get('balance_data').toJS()
  const isAddNewAccountOpen = state.influencer.get('isAddNewAccountOpen')
  const isPaymethodListOpen = state.influencer.get('isPaymethodListOpen')
  const {
    Gender,
    Language,
    Currency,
    Country,
    // banks,
    PaymentMethodType
  } = enums

  return {
    initialValues: {
      bank_account_name: userMetadata.bank_account_name || userMetadata.given_name,
      bank_branch_id: userMetadata.bank_branch_id,
      bank_account_id: userMetadata.bank_account_id,
      language: userMetadata.language,
      default_currency: userMetadata.default_currency,
      country: userMetadata.country,
      user_social_id: userMetadata.user_social_id,
      handle: userMetadata.handle
    },
    userProfile: { ...userMetadata },
    GENDERS: Gender ? Object.keys(Gender.Gender.name_to_value).map((key) =>
      ({ value: key, label: Gender.Gender.name_to_value[key] })) : [],
    LANGUAGES: Language ? Object.keys(Language.Language.name_to_value).map((key) =>
      ({ value: key, label: Language.Language.name_to_value[key] })) : [],
    CURRENCIES: Currency ? Object.keys(Currency.Currency.name_to_value).map((key) =>
      ({ value: key, label: `${key} ${Currency.Currency.name_to_value[key]}` })) : [],
    COUNTRIES: Country ? Object.keys(Country.Country.name_to_value).map((key) =>
      ({ value: key, label: Country.Country.name_to_value[key] })) : [],
    PaymentMethodType: PaymentMethodType ?
      Object.keys(PaymentMethodType.PaymentMethodType.name_to_value)
        .map((key) =>
          ({ value: key, label: PaymentMethodType.PaymentMethodType.name_to_value[key] })) : [],
    notification: state.notification.toJS(),
    balanceInfo: { ...balanceDetails },
    summaryInfo: { ...summaryDetails },
    paymentMethodsList,
    isAddNewAccountOpen,
    isPaymethodListOpen,
    businessDetails
  }
}, {
  CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  CREATE_INFLUENCER_PAYMETHOD: InfluencerActions.CREATE_INFLUENCER_PAYMETHOD,
  DELETE_INFLUENCER_PAYMETHOD: InfluencerActions.DELETE_INFLUENCER_PAYMETHOD,
  FETCH_INFLUENCER_BALANCE: InfluencerActions.FETCH_INFLUENCER_BALANCE,
  FETCH_INFLUENCER_SUMMARY: InfluencerActions.FETCH_INFLUENCER_SUMMARY,
  FETCH_INFLUENCER_PAYMETHOD_LIST: InfluencerActions.FETCH_INFLUENCER_PAYMETHOD_LIST,
  OPEN_ADD_NEW_ACCOUNT: InfluencerActions.OPEN_ADD_NEW_ACCOUNT,
  CLOSE_ADD_NEW_ACCOUNT: InfluencerActions.CLOSE_ADD_NEW_ACCOUNT,
  CLOSE_SETTINGS_MODAL: SettingsActions.CLOSE_SETTINGS_MODAL
})(PaymentOptions)))
