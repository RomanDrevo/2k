import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import './BankAccounts.css'
import loadingImg from '../../../../loading.svg'
import BankAccountElement from '../Components/BankAccountElement'

const BankAccounts = ({ loading, paymentMethodsList }) => (
  loading ? (
    <div className="flex justify-center mt-30"><img src={loadingImg} alt="loading" /></div>
  ) : (!paymentMethodsList.length && (
    <div>
      <FormattedMessage id="settings.no_account" defaultMessage="!No Accounts" />
    </div>
  )) || (
    <div className="bank-accounts-wrapper">
      {paymentMethodsList.map((account) => (
        <div key={account.id}>
          <BankAccountElement paymentMethod={account} />
        </div>
      ))}
    </div>
  )
)

BankAccounts.propTypes = {
  paymentMethodsList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  loading: PropTypes.bool
}

export default withRouter(injectIntl(connect((state) => ({
  notification: state.notification.toJS(),
  paymentMethodsList: state.influencer.get('payment_methods_list').toJS(),
  loading: state.influencer.get('loading')
}))(BankAccounts)))
