import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { InfluencerActions, UserActions, CampaignActions } from '../../../../../_redux/index'
import BankAccountForm from './BankAccountForm'
import { validateNumbers } from '../../../../../_core/utils'
import payPalPLogo from '../../../../../icons/paypal-p-logo.svg'
import payPalLogo from '../../../../../icons/paypal-logo.svg'

function validate(values, { intl: { formatMessage } }) {
  const errors = {}
  const required = formatMessage({ id: 'form_validation.required', defaultMessage: '!Required' })

  if (!values.payment_provider_id) {
    errors.payment_provider_id = required
  }

  if (!values.bank_account_name) {
    errors.bank_account_name = required
  }

  if (!values.bank_branch_id) {
    errors.bank_branch_id = required
  }

  if (values.user_social_id && !validateNumbers(values.user_social_id)) {
    errors.user_social_id =
      formatMessage({ id: 'form_validation.numbers_only', defaultMessage: '!This field should contain only numbers!' })
  }

  return errors
}

// const consoleLog = console.log
// const interval = null
// const counter = 10

class CreateNewPaymentMethod extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    handle: PropTypes.string,
    notification: PropTypes.object,
    userProfile: PropTypes.object,
    BANKS: PropTypes.objects,
    match: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    location: PropTypes.object,
    history: PropTypes.object.isRequired,
    CREATE_INFLUENCER_PAYMETHOD: PropTypes.func.isRequired,
    FETCH_CAMPAIGN: PropTypes.func.isRequired,
    OPEN_PAYMETHODS_LIST: PropTypes.func.isRequired,
    CLOSE_ADD_NEW_ACCOUNT: PropTypes.func.isRequired,
    OPEN_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    amountToDeposit: PropTypes.number.isRequired,
    selectedCampaign: PropTypes.number.isRequired,
    currencyToDeposit: PropTypes.string.isRequired
  }

  state = {
    isCancelBtnShow: this.props.location.state && this.props.location.state.prevLocation === '/influencer/balance'
  }
  //
  // componentDidMount() {
  //   const { match: { params: { method } } } = this.props
  //
  //   if (method === 'paypal') {
  //     paypal.Button.render({
  //       // env: 'production',
  //       env: 'sandbox',
  //
  //       client: {
  //         sandbox: 'ASsU8s7B0DbLHICtVRuajMt-L5LdAWjl6r6ByvQzMFRaV67MhDlAgo1rVp8ts74KCW9YtNFbL0yEIVY-'
  //         // production: 'ASsU8s7B0DbLHICtVRuajMt-L5LdAWjl6r6ByvQzMFRaV67MhDlAgo1rVp8ts74KCW9YtNFbL0yEIVY-'
  //       },
  //
  //       commit: true, // Show a 'Pay Now' button
  //
  //       style: {
  //         color: 'gold',
  //         size: 'small'
  //       }
  //     }, '#paypal-button')
  //   }
  // }

  onSubmit = (values) => {
    const clonedValues = { ...values }
    const { handle } = this.props.userProfile
    const { location } = this.props

    let pathname = ''

    if (location.state && location.state.prevLocation === '/influencer/balance') {
      pathname = '/influencer/balance'
      this.props.OPEN_WITHDRAWAL_WINDOW()
    } else {
      pathname = '/settings/payment'
    }

    if (handle && handle === clonedValues.handle) delete clonedValues.handle
    clonedValues.method_type = 'BANK_TRANSFER'

    Promise.resolve(this.props.CREATE_INFLUENCER_PAYMETHOD(clonedValues))
      .then(() => {
        this.props.OPEN_PAYMETHODS_LIST()
        this.props.CLOSE_ADD_NEW_ACCOUNT()
        this.props.history.push(pathname)
      })
  }

  // startPoling = () => {
  //   interval = setInterval(() => {
  //     Promise.resolve(this.props.FETCH_CAMPAIGN(this.props.selectedCampaign)
  //       .then(() => {
  //         consoleLog('Counter: ', counter)
  //         counter -= 1
  //         if ((this.props.campaign.total_budget && this.props.campaign.total_budget > 0) || !counter) {
  //           clearInterval(interval)
  //         }
  //       }))
  //   }, 5000)
  // }

  handleCancel = () => {
    this.props.history.push({
      pathname: '/influencer/balance'
    })
  }

  render() {
    console.log('Account Props:', this.props)
    const { match: { params: { method } } } = this.props
    const amountWithCurrency = `${this.props.amountToDeposit} ${this.props.currencyToDeposit}`

    if (method === 'bank') {
      return (
        <BankAccountForm
          {...this.props}
          {...this.state}
          onSubmit={this.onSubmit}
          handleCancel={this.handleCancel}
        />
      )
    }

    if (method === 'paypal') {
      return (
        <div className="flex flex-column items-center mt2">
          <h1>PayPal Payment</h1>
          <form className="flex" action="http://localhost:5000/pay" method="post">
            <input
              className="cash-in-amount"
              type="text"
              name="amount"
              value={amountWithCurrency}
              placeholder="Enter Amount To Cash In"
            />
            <input type="hidden" name="business_id" value={this.props.location.state.businessId} />
            <input type="hidden" name="campaign_id" value={this.props.selectedCampaign} />
            <input type="hidden" name="campaign_currency" value={this.props.currencyToDeposit} />
            {/* <input className="cash-in-btn" type="submit" value="Cash In" />*/}

            <button onClick={this.startPoling} className="paypal-button flex items-end" type="submit">
              <img className="paypal-button-logo" src={payPalPLogo} alt="" />
              <img className="" src={payPalLogo} alt="" />
              <span className="paypal-button-text ml1"> Checkout</span>
            </button>
          </form>
        </div>
      )
    }

    return null
  }
}

export default withRouter(injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const enums = state.enums.get('enums').toJS()
  const amountToDeposit = state.campaign.get('amountToDeposit')
  const currencyToDeposit = state.campaign.get('currencyToDeposit')
  const selectedCampaign = state.campaign.get('selectedCampaign')
  const campaign = state.campaign.get('campaign').toJS()

  const {
    Gender,
    Language,
    Currency,
    Country,
    banks = [],
    PaymentMethodType
  } = enums

  return {
    initialValues: {
      fields: {
        bank_account_name: userMetadata.bank_account_name || userMetadata.given_name,
        bank_branch_id: userMetadata.bank_branch_id,
        bank_account_id: userMetadata.bank_account_id,
        language: userMetadata.language,
        default_currency: userMetadata.default_currency,
        country: userMetadata.country,
        user_social_id: userMetadata.user_social_id,
        handle: userMetadata.handle
      }
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

    BANKS: banks,
    PaymentMethodType: PaymentMethodType ?
      Object.keys(PaymentMethodType.PaymentMethodType.name_to_value)
        .map((key) =>
          ({ value: key, label: PaymentMethodType.PaymentMethodType.name_to_value[key] })) : [],

    notification: state.notification.toJS(),
    isMobile: state.general.get('isMobile'),
    amountToDeposit,
    selectedCampaign,
    currencyToDeposit,
    campaign
  }
}, {
  CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  CREATE_INFLUENCER_PAYMETHOD: InfluencerActions.CREATE_INFLUENCER_PAYMETHOD,
  DELETE_INFLUENCER_PAYMETHOD: InfluencerActions.DELETE_INFLUENCER_PAYMETHOD,
  OPEN_ADD_NEW_ACCOUNT: InfluencerActions.OPEN_ADD_NEW_ACCOUNT,
  CLOSE_ADD_NEW_ACCOUNT: InfluencerActions.CLOSE_ADD_NEW_ACCOUNT,
  OPEN_PAYMETHODS_LIST: InfluencerActions.OPEN_PAYMETHODS_LIST,
  OPEN_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_WITHDRAWAL_WINDOW,
  FETCH_CAMPAIGN: CampaignActions.FETCH_CAMPAIGN

})(reduxForm({
  form: 'create-paymethod-form',
  validate,
  enableReinitialize: true
})(CreateNewPaymentMethod))))
