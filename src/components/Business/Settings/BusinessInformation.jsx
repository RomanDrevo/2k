import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { Fields, reduxForm } from 'redux-form'
import { injectIntl, FormattedMessage } from 'react-intl'
import Phone from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import { validateEmail, validatePhoneNumber } from '../../../_core/utils'
import { Button, TextInput } from '../../_common'
import { BusinessActions } from '../../../_redux'

function validate(values, { intl: { formatMessage } }) {
  const errors = {}
  const required = formatMessage({ id: 'form_validation.required', defaultMessage: '!Required' })
  if (!values.business_name) {
    errors.business_name = required
  }

  if (!values.internal_full_address) {
    errors.internal_full_address = required
  }

  if (!values.email) {
    errors.email = required
  } else if (!validateEmail(values.email)) {
    errors.email = formatMessage({ id: 'form_validation.invalid_email', defaultMessage: '!Invalid email format' })
  }

  if (values.contact_number && !validatePhoneNumber(values.contact_number)) {
    errors.contact_number = formatMessage({
      id: 'form_validation.invalid_phone',
      defaultMessage: '!Invalid phone number format. Following the E.164 recommendation'
    })
  }

  if (values.handle && !/^[\w_]+$/.test(values.handle)) {
    errors.handle = formatMessage({
      id: 'form_validation.invalid_handle',
      defaultMessage: '!Only lettsrs, number and the signs - _ are valid'
    })
  }

  if (values.handle && values.handle.length < 4) {
    errors.handle = formatMessage({
      id: 'form_validation.min_length',
      defaultMessage: '!Minimum {min} letters are required'
    }, { min: 4 })
  }
  return errors
}

class BusinessInformation extends Component {
  static propTypes = {
    // pristine: PropTypes.bool,
    // hideTitle: PropTypes.bool,
    // handle: PropTypes.string,
    // COUNTRIES: PropTypes.array,
    userProfile: PropTypes.object,
    intl: PropTypes.object.isRequired,
    businessDetails: PropTypes.object,
    UPDATE_BUSINESS_INFO: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  // componentDidMount(){
  //   const { FETCH_USER_ROLE_LIST, businessDetails }
  //   this.props.FETCH_USER_ROLE_LIST()
  // }

  onSubmit = (values) => {
    // const { intl: { formatMessage } } = this.props

    const clonedValues = { ...values }

    const { default_currency: defaultCurrency, handle } = this.props.userProfile

    if (defaultCurrency) delete clonedValues.default_currency
    if (handle && handle === clonedValues.handle) delete clonedValues.handle
    clonedValues.business_id = this.props.businessDetails.id
    clonedValues.internal_email = clonedValues.email
    clonedValues.internal_phone_number = clonedValues.contact_number
    clonedValues.internal_business_name = clonedValues.business_name
    // clonedValues.name = clonedValues.internal_business_name
    console.log('clonedValues: ', clonedValues)
    this.props.UPDATE_BUSINESS_INFO(clonedValues)

    // toast.info(formatMessage({ id: 'business.creating', defaultMessage: '!Creating your business...' }))
    toast.info('Changes saved!')
  }

  renderFields = (fields) => {
    const {
      intl: { formatMessage },
      // pristine,
      handleSubmit,
      userProfile: { email_verified: emailVerified }
    } = this.props
    const {
      business_name, internal_full_address, email, contact_number
    } = fields
    const fieldClass = 'col-4 d-flex justify-content-end justify-content-sm-start text-sm-left text-right pl-40 pt-10'
    return (
      <div className="profile-settings-container">
        <div>
          <div className="row" id="business_settings.business_name">
            <div className={fieldClass}>
              <FormattedMessage id="business_settings.business_name" defaultMessage="!Business Name" />
            </div>
            <div className="col-8 col-md-8">
              <TextInput
                border
                errorInside
                meta={business_name.meta}
                value={business_name.input.value}
                onChange={business_name.input.onChange}
              />
            </div>
          </div>
          <div className="row" id="business_settings.full_address">
            <div className={fieldClass}>
              <FormattedMessage id="business_settings.full_address" defaultMessage="!Full Address" />
            </div>
            <div className="col-8 col-md-8">
              <TextInput
                border
                errorInside
                meta={internal_full_address.meta}
                value={internal_full_address.input.value}
                onChange={internal_full_address.input.onChange}
              />
            </div>
          </div>

          <div className="row" id="business_settings.email">
            <div className={fieldClass}>
              <FormattedMessage id="business_settings.email" defaultMessage="!Email" />
            </div>
            <div className="col-8 col-md-8">
              <TextInput
                border
                errorInside
                meta={email.meta}
                action={emailVerified && <img src="/img/verified.png" alt="verified" />}
                value={email.input.value}
                onChange={email.input.onChange}
              />
            </div>
          </div>


          <div className="row" id="settings.phone_number">
            <div className={fieldClass}>
              <FormattedMessage id="settings.phone_number" defaultMessage="!Phone Number" />
            </div>
            <div className="col-9 col-md-5">
              <div className="phone-wrapper">
                <Phone
                  meta={contact_number.meta}
                  value={contact_number.input.value}
                  onChange={contact_number.input.onChange}
                />
              </div>
            </div>
          </div>
          <div className="row mt-30 mb-30">
            <div className="col-12 d-flex justify-content-center">
              <Button
                style={{
                  background: '#1A936F', width: 150, color: 'white', textTransform: 'uppercase'
                }}
                disabledStyle={{ background: '#999999', color: '#434343' }}
                rounded
                // disabled={
                //   pristine || !business_name.input.value ||
                //   !internal_full_address.input.value || !email.input.value
                // }
                title={formatMessage({ id: 'main.save', defaultMessage: '!Save' })}
                onClick={handleSubmit(this.onSubmit)}
              />
            </div>
          </div>
        </div>

      </div>
    )
  }

  render() {
    console.log('BusinessDetails: ', this.props.businessDetails)

    return (
      <div className="business-info-wrapper">
        <div className="business-info-body pt2 mt-30">
          <Fields
            names={[
              'business_name', 'internal_full_address', 'email', 'gender', 'birthday',
              'contact_number', 'country', 'city', 'language', 'default_currency', 'handle'
            ]}
            component={this.renderFields}
          />
        </div>
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const enums = state.enums.get('enums').toJS()

  const businessDetails = state.business.get('businessDetails').toJS().business
  const userRoleList = state.business.get('userRoleList').toJS()

  const {
    Gender,
    Language,
    Currency,
    Country
  } = enums
  // const  = enums.Language
  // const  = enums.Currency
  // const Country = enums.Country

  return {
    initialValues: {
      business_name: businessDetails.internal_business_name,
      email: businessDetails.internal_email || businessDetails.email,
      country: userMetadata.country,
      city: userMetadata.city,
      handle: userMetadata.handle,
      internal_full_address: businessDetails.internal_full_address || 'Your Address',
      contact_number: businessDetails.internal_phone_number || 'Your Phone Number'
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

    notification: state.notification.toJS(),
    businessDetails,
    userRoleList
  }
}, {
  // CHANGE_USER_METADATA: UserActions.CHANGE_USER_METADATA,
  // UPDATE_USER_PROFILE: UserActions.UPDATE_USER_PROFILE,
  UPDATE_BUSINESS_INFO: BusinessActions.UPDATE_BUSINESS_INFO
})(reduxForm({
  form: 'profile-setting-form',
  validate,
  enableReinitialize: true
})(BusinessInformation)))
