import { injectIntl, FormattedMessage, FormattedDate, FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import clock from '../../../../icons/clock.svg'
import lock from '../../../../icons/lock.svg'

class WithdrawalHistory extends Component {
  static propTypes={
    isMobile: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    withdrawal_history: PropTypes.array
  }

  state = {}

  render() {
    const { intl: { formatNumber }, withdrawal_history, isMobile } = this.props
    return (
      <div className="withdrawal-container">
        {!isMobile && (
          <div className="withdrawal-title flex-center">
            <div style={{ flex: 4.5 }}>
              <FormattedMessage id="influencer.data_description" defaultMessage="!Date + Description" />
            </div>
            <div className="row-direction" style={{ flex: 1 }}>
              <div className="amount" style={{ flex: 2 }}>
                <FormattedMessage id="influencer.amount" defaultMessage="!Amount" />
              </div>
              <div className="status" style={{ flex: 1 }}>
                <FormattedMessage id="influencer.status" defaultMessage="!Status" />
              </div>
            </div>
          </div>
        )}
        {withdrawal_history.map((item) => (
          <div className="withdrawal-content flex-center" style={{ borderBottomWidth: 1 }}>
            <div className="row-direction" style={{ flex: isMobile ? 3 : 4.5 }}>
              <div className="date-description" style={{ flex: 1, paddingLeft: isMobile && 20 }}>
                <div className="date" style={{ flex: 1 }}>
                  <FormattedDate value={new Date(item.date)} />
                </div>
                <div className="description" style={{ flex: 1 }}>
                  {item.deposited_to}
                </div>
              </div>
              <div>
                <div className="tax-paid-amount" style={{ marginTop: 30, marginRight: 20 }}>
                  <FormattedMessage
                    id="influencer.tax_value"
                    defaultMessage="!Tax: {tax}%"
                    values={{
                      tax: formatNumber(item.tax_paid_percent)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row-direction" style={{ flex: 1 }}>
              <div className="amount" style={{ flex: 1 }}>
                <div className="paid-amount">
                  <FormattedNumber
                    value={item.paid_amount}
                    style="currency"
                    currency={item.paid_currency}
                  />
                </div>
                <div className="tax-paid-amount">
         (
                  <FormattedNumber
                    value={item.tax_paid_amount}
                    style="currency"
                    currency={item.paid_currency}
                  />
         )
                </div>
              </div>
              <div className="flex-center pr1" style={{ flex: 1 }}>
                <img
                  alt="lock"
                  className="lockimg"
                  src={item.confirmation_number ? lock : clock}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}


export default injectIntl(WithdrawalHistory)

