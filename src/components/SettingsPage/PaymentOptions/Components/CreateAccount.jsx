import React from 'react'
// import paypal from 'paypal-checkout'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { InfluencerActions, UserActions } from '../../../../_redux/index'
import BankAccountForm from './BankAccountForm'
import { validateNumbers } from '../../../../_core/utils'
import payPalPLogo from '../../../../icons/paypal-p-logo.svg'
import payPalLogo from '../../../../icons/paypal-logo.svg'

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

class CreateNewPaymentMethod extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    handle: PropTypes.string,
    notification: PropTypes.object,
    userProfile: PropTypes.object,
    BANKS: PropTypes.objects,
    match: PropTypes.object.isRequired,
    location: PropTypes.object,
    summaryDetails: PropTypes.object,
    history: PropTypes.object.isRequired,
    CREATE_INFLUENCER_PAYMETHOD: PropTypes.func.isRequired,
    OPEN_PAYMETHODS_LIST: PropTypes.func.isRequired,
    CLOSE_ADD_NEW_ACCOUNT: PropTypes.func.isRequired,
    OPEN_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  state = {
    isCancelBtnShow: this.props.location.state && this.props.location.state.prevLocation === '/influencer/balance'
  }

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

  handleCancel = () => {
    this.props.history.push({
      pathname: '/influencer/balance'
    })
  }

  render() {
    const { match: { params: { method } }, summaryDetails } = this.props
    const amountWithCurrency = `${summaryDetails.total_earnings} ${summaryDetails.currency}`

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
          <h3>PayPal</h3>
          <form target="_blank" className="flex" action="http://localhost:5000/cashout" method="post">

            <input
              className="cash-in-amount"
              type="text"
              name="amountWithCurrency"
              value={amountWithCurrency}
              placeholder="Enter Amount To Cash In"
            />

            <input
              type="hidden"
              name="amountToSend"
              value={summaryDetails.total_earnings}
            />
            <input
              type="hidden"
              name="currencyToSend"
              value={summaryDetails.currency}
            />

            <button
              // onClick={this.startPoling}
              className="paypal-button flex items-end"
              type="submit"
            >
              <img className="paypal-button-logo" src={payPalPLogo} alt="" />
              <img className="" src={payPalLogo} alt="" />
              <span className="paypal-button-text ml1">Checkout</span>
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
  const summaryDetails = state.influencer.get('summary_data').toJS()

  // console.log('summaryDetails: ', summaryDetails)

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
    summaryDetails
  }
}, {
  CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  CREATE_INFLUENCER_PAYMETHOD: InfluencerActions.CREATE_INFLUENCER_PAYMETHOD,
  DELETE_INFLUENCER_PAYMETHOD: InfluencerActions.DELETE_INFLUENCER_PAYMETHOD,
  OPEN_ADD_NEW_ACCOUNT: InfluencerActions.OPEN_ADD_NEW_ACCOUNT,
  CLOSE_ADD_NEW_ACCOUNT: InfluencerActions.CLOSE_ADD_NEW_ACCOUNT,
  OPEN_PAYMETHODS_LIST: InfluencerActions.OPEN_PAYMETHODS_LIST,
  OPEN_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_WITHDRAWAL_WINDOW

})(reduxForm({
  form: 'create-paymethod-form',
  validate,
  enableReinitialize: true
})(CreateNewPaymentMethod))))
