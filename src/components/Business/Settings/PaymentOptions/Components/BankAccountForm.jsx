import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Fields } from 'redux-form'
import BankFields from './BankFields'
import '../../../../../styles/global.css'
// import '../../profile-settings.css'

const BankAccountForm = ({
  handleSubmit, userProfile, BANKS, onSubmit,
  handleCancel, isCancelBtnShow, isMobile
}) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Fields
      names={['bank_account_name', 'payment_provider_id', 'bank_branch_id',
        'gender', 'birthday', 'bank_account_id', 'country',
        'user_social_id', 'language', 'default_currency', 'handle'
      ]}
      component={BankFields}
      userProfile={userProfile}
      isCancelBtnShow={isCancelBtnShow}
      BANKS={BANKS}
      handleCancel={handleCancel}
      isMobile={isMobile}
    />
  </form>
)

BankAccountForm.propTypes = {
  isMobile: PropTypes.bool,
  isCancelBtnShow: PropTypes.bool,
  userProfile: PropTypes.object,
  BANKS: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default injectIntl(BankAccountForm)
