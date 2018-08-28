import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { InfluencerActions, UserActions } from '../../../../../_redux/index'
import BankAccountForm from './BankAccountForm'
import { validateNumbers } from '../../../../../_core/utils'

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

class EditPaymentMethod extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    handle: PropTypes.string,
    notification: PropTypes.object,
    userProfile: PropTypes.object,
    BANKS: PropTypes.object,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    EDIT_INFLUENCER_PAYMETHOD: PropTypes.func.isRequired,
    OPEN_WITHDRAWAL_WINDOW: PropTypes.func.isRequired
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
    clonedValues.paymethod_id = this.props.match.params.paymentId
    clonedValues.is_deleted = false

    Promise.resolve(this.props.EDIT_INFLUENCER_PAYMETHOD(clonedValues))
      .then(() => {
        this.props.history.push(pathname)
      })
  }

  handleCancel = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <BankAccountForm
        {...this.props}
        isCancelBtnShow
        onSubmit={this.onSubmit}
        handleCancel={this.handleCancel}
      />
    )
  }
}

export default withRouter(injectIntl(connect((state, ownProps) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const enums = state.enums.get('enums').toJS()
  const paymentMethodsList = state.influencer.get('payment_methods_list').toJS()
  const editPayMethod = paymentMethodsList
    .find((x) => x.id === parseInt(ownProps.match.params.paymentId, 10))
  const {
    Gender,
    Language,
    Currency,
    Country,
    banks,
    PaymentMethodType
  } = enums

  return {
    initialValues: {
      bank_account_name: editPayMethod ? editPayMethod.bank_account_name : '',
      bank_branch_id: editPayMethod ? editPayMethod.bank_branch_id : '',
      bank_account_id: editPayMethod ? editPayMethod.bank_account_id : '',
      payment_provider_id: editPayMethod ? editPayMethod.payment_provider_id : '',
      user_social_id: editPayMethod ? editPayMethod.user_social_id : ''
    },

    // currentValues: {
    //   ...getFormValues('edit-paymethod-form')(state)
    // },

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
    paymentMethodsList,
    isMobile: state.general.get('isMobile')
  }
}, {
  CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  EDIT_INFLUENCER_PAYMETHOD: InfluencerActions.EDIT_INFLUENCER_PAYMETHOD,
  DELETE_INFLUENCER_PAYMETHOD: InfluencerActions.DELETE_INFLUENCER_PAYMETHOD,
  OPEN_ADD_NEW_ACCOUNT: InfluencerActions.OPEN_ADD_NEW_ACCOUNT,
  CLOSE_ADD_NEW_ACCOUNT: InfluencerActions.CLOSE_ADD_NEW_ACCOUNT,
  OPEN_PAYMETHODS_LIST: InfluencerActions.OPEN_PAYMETHODS_LIST,
  OPEN_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_WITHDRAWAL_WINDOW,
  FETCH_INFLUENCER_PAYMETHOD_LIST: InfluencerActions.FETCH_INFLUENCER_PAYMETHOD_LIST

})(reduxForm({
  form: 'edit-paymethod-form',
  validate,
  enableReinitialize: true
})(EditPaymentMethod))))
