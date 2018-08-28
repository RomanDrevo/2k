import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Select, TextInput, Button } from '../../../_common/index'

const BankFields = (props) => {
  const {
    bank_account_name,
    payment_provider_id,
    bank_branch_id,
    bank_account_id,
    user_social_id,
    userProfile,
    isCancelBtnShow,
    BANKS,
    handleCancel,
    intl: { formatMessage },
    isMobile
  } = props

  console.log('Banks: ', BANKS)

  let userCountry = ''

  if (userProfile) {
    if (userProfile.country) {
      const firstL = userProfile.country.slice(0, 1).toUpperCase()
      const rest = userProfile.country.slice(1).toLowerCase()
      userCountry = firstL.concat(rest)
    }
  }
  const rowClass = isMobile ? '' : 'row'
  const labelClass = isMobile
    ? 'pt-10 input-title'
    : 'col-3 d-flex justify-content-end justify-content-sm-start text-sm-left text-right pl-40 pt-10'
  const inputClass = isMobile ? '' : 'col-8'
  return (
    <div className="profile-settings-container">
      <div>
        <div className={rowClass}>
          <div className={labelClass}>
            <FormattedMessage
              tagName="b"
              id="settings.user_country"
              defaultMessage="!Country - {country}"
              values={{ country: userCountry }}
            />
          </div>
          <div className={inputClass} />
        </div>
        <div className={rowClass}>
          <div className={labelClass}>
            <FormattedMessage id="settings.name_bank_account" defaultMessage="!Name On Bank Account" />
          </div>
          <div className={inputClass}>
            <TextInput
              border
              errorInside
              meta={bank_account_name.meta}
              value={bank_account_name.input.value}
              onChange={bank_account_name.input.onChange}
            />
          </div>
        </div>
        <div className={rowClass}>
          <div className={labelClass}>
            <FormattedMessage id="settings.bank_name" defaultMessage="!Bank Name" />
          </div>
          <div className={inputClass}>
            {BANKS && (
              <Select
                rounded
                noShadow
                multiple={false}
                white
                items={Object.values(BANKS)}
                value={payment_provider_id.input.value}
                onSelect={(item) => payment_provider_id.input.onChange(item.value)}
              />
            )}
          </div>
        </div>
        <div className={rowClass}>
          <div className={labelClass}>
            <FormattedMessage id="settings.branch_number" defaultMessage="!Branch Number" />
          </div>
          <div className={inputClass}>
            <TextInput
              border
              errorInside
              meta={bank_branch_id.meta}
              value={bank_branch_id.input.value}
              onChange={bank_branch_id.input.onChange}
            />
          </div>
        </div>
        <div className={rowClass}>
          <div className={labelClass}>
            <FormattedMessage id="settings.account_number" defaultMessage="!Account Number" />
          </div>
          <div className={inputClass}>
            <TextInput
              border
              errorInside
              meta={bank_account_id.meta}
              value={bank_account_id.input.value}
              onChange={bank_account_id.input.onChange}
            />
          </div>
        </div>
        <div className={rowClass}>
          <div className={labelClass}>
            <FormattedMessage id="settings.israeli_id" defaultMessage="!Israeli ID" />
          </div>
          <div className={inputClass}>
            <TextInput
              errorInside
              border
              meta={user_social_id.meta}
              value={user_social_id.input.value}
              onChange={user_social_id.input.onChange}
            />
            <span className="dark-gray">
              <FormattedMessage
                id="settings.you_can_edit_bank"
                defaultMessage="!You can always Edit Bank Details in Settings"
              />
            </span>
          </div>
        </div>
        <div className="row mt-30">
          <div className="col-12 d-flex justify-content-center items-center">
            <Button
              style={{
                background: '#1A936F', width: 150, color: 'white', textTransform: 'uppercase'
              }}
              disabledStyle={{ background: '#999999', color: '#434343' }}
              rounded
              disabled={
                !bank_account_name.input.value ||
                !user_social_id.input.value ||
                !bank_branch_id.input.value
              }
              title={formatMessage({ id: 'main.save', defaultMessage: '!Save' })}
              type="submit"
            />
            {isCancelBtnShow && (
              <div className="text-center cancel-btn" onClick={handleCancel}>
                <FormattedMessage id="main.cancel" defaultMessage="!Cancel" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

BankFields.propTypes = {
  isMobile: PropTypes.bool,
  isCancelBtnShow: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  bank_account_name: PropTypes.object.isRequired,
  payment_provider_id: PropTypes.object.isRequired,
  bank_branch_id: PropTypes.object.isRequired,
  bank_account_id: PropTypes.object.isRequired,
  user_social_id: PropTypes.object.isRequired,
  userProfile: PropTypes.object,
  BANKS: PropTypes.object,
  handleCancel: PropTypes.func.isRequired
}

export default injectIntl(BankFields)
