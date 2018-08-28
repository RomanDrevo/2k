import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import Alert from '../../../../_common/Alert'
import { InfluencerActions, UserActions, SettingsActions } from '../../../../../_redux/index'


class BankAccountElement extends Component {
  static propTypes = {
    paymentMethod: PropTypes.object,
    enums: PropTypes.object,
    intl: PropTypes.object.isRequired,
    DELETE_INFLUENCER_PAYMETHOD: PropTypes.func.isRequired,
    SET_NEW_PRIMARY: PropTypes.func.isRequired,
    CLOSE_SETTINGS_MODAL: PropTypes.func.isRequired
  }

  state={
    isOpen: false
  }

  deletePayMethod = () => {
    this.props.DELETE_INFLUENCER_PAYMETHOD(this.props.paymentMethod.id)
    this.setState({ isOpen: false })
  }

  handleMakePrimary = () => {
    this.props.SET_NEW_PRIMARY(this.props.paymentMethod.id)
  }

  handleOnEditClick = () => {
    this.props.CLOSE_SETTINGS_MODAL()
  }

  handleDeleteClick = () => this.setState({ isOpen: true })

  handleCancelClick = () => this.setState({ isOpen: false })

  render() {
    const { paymentMethod, enums, intl: { formatMessage } } = this.props
    const currentBank = enums.banks[paymentMethod.payment_provider_id] || {}
    // enums.banks.find((bank) => bank.id === paymentMethod.payment_provider_id) || {}

    return (
      <div key={paymentMethod.id} className="col-sm-6 bank-account">
        {paymentMethod.is_default ? (
          <span className="primary-account">
            <FormattedMessage id="settings.primary_account" defaultMessage="!Primary Account" />
          </span>
        ) : null}
        <div className="flex">
          <FormattedMessage tagName="div" id="settings.account_name" defaultMessage="!Name" />
          <div className="ml2">
            {paymentMethod.bank_account_name}
          </div>
        </div>
        <div className="flex">
          <FormattedMessage tagName="div" id="settings.account_no" defaultMessage="!Account No." />
          <div className="ml2">
            {paymentMethod.bank_account_id}
          </div>
        </div>
        <div className="flex">
          <FormattedMessage tagName="div" id="settings.branch_no" defaultMessage="!Branch No." />
          <div className="ml2">
            {paymentMethod.bank_branch_id}
          </div>
        </div>
        <div className="flex">
          <FormattedMessage tagName="div" id="settings.bank" defaultMessage="!Bank" />
          <div className="ml2">
            {currentBank.bank_name}
          </div>
        </div>
        <div className="flex">
          <Link
            className="mr1"
            onClick={this.handleOnEditClick}
            to={`/settings/edit-paymethod/${paymentMethod.id}`}
          >
            <div className="edit-account">
              <FormattedMessage id="main.edit" defaultMessage="!Edit" />
            </div>
          </Link>
          {!paymentMethod.is_default ? (
            <div onClick={this.handleDeleteClick} className="edit-account delete-account">
              <FormattedMessage id="main.delete" defaultMessage="!Delete" />
            </div>
          ) : null}
          {!paymentMethod.is_default ? (
            <div
              onClick={this.handleMakePrimary}
              className="edit-account delete-account ml4"
            >
              <FormattedMessage id="settings.make_primary" defaultMessage="!Make Primary" />
            </div>
          ) : null}
        </div>
        <Alert
          isOpen={this.state.isOpen}
          title={formatMessage({ id: 'settings.delete_account', defaultMessage: '!Delete Account?' })}
          buttonNo={formatMessage({ id: 'main.no', defaultMessage: '!No' })}
          buttonYes={formatMessage({ id: 'main.yes', defaultMessage: '!Yes' })}
          onYesClick={this.deletePayMethod}
          onNoClick={this.handleCancelClick}
        />
      </div>
    )
  }
}

export default withRouter(injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const enums = state.enums.get('enums').toJS()
  const paymentMethodsList = state.influencer.get('payment_methods_list').toJS()
  const summaryDetails = state.influencer.get('summary_data').toJS()
  const balanceDetails = state.influencer.get('balance_data').toJS()
  const loading = state.influencer.get('loading')
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
    BANKS: banks,
    PaymentMethodType: PaymentMethodType ?
      Object.keys(PaymentMethodType.PaymentMethodType.name_to_value)
        .map((key) =>
          ({ value: key, label: PaymentMethodType.PaymentMethodType.name_to_value[key] })) : [],
    notification: state.notification.toJS(),
    balanceDetails,
    summaryDetails,
    paymentMethodsList,
    loading,
    enums
  }
}, {
  CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  CREATE_INFLUENCER_PAYMETHOD: InfluencerActions.CREATE_INFLUENCER_PAYMETHOD,
  EDIT_INFLUENCER_PAYMETHOD: InfluencerActions.EDIT_INFLUENCER_PAYMETHOD,
  DELETE_INFLUENCER_PAYMETHOD: InfluencerActions.DELETE_INFLUENCER_PAYMETHOD,
  FETCH_INFLUENCER_BALANCE: InfluencerActions.FETCH_INFLUENCER_BALANCE,
  FETCH_INFLUENCER_SUMMARY: InfluencerActions.FETCH_INFLUENCER_SUMMARY,
  FETCH_INFLUENCER_PAYMETHOD_LIST: InfluencerActions.FETCH_INFLUENCER_PAYMETHOD_LIST,
  CLOSE_PAYMETHODS_LIST: InfluencerActions.CLOSE_PAYMETHODS_LIST,
  SET_NEW_PRIMARY: InfluencerActions.SET_NEW_PRIMARY,
  CLOSE_SETTINGS_MODAL: SettingsActions.CLOSE_SETTINGS_MODAL
})(BankAccountElement)))
