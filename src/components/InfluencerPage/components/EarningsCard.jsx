import moment from 'moment'
import reduce from 'lodash/reduce'
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl'

import { Card } from '../../_common'

class EarningsCard extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  }

  renderDesktop() {
    const { intl: { formatNumber }, data } = this.props
    const balance = data && data.total_paid ?
      data.total_paid - reduce(
        data.withdrawl_history.map((history) => history.paid_amount),
        (sum, amount) => sum + amount
      ) : 0
    let total = 0
    const asCurrency = data.currency ? {
      style: 'currency', currency: data.currency
    } : { style: 'decimal' }
    return (
      <div style={{ padding: 10 }}>
        <div className="flex">
          <div className="label green flex-1">
            <FormattedMessage
              id="influencer.your_balance_is"
              defaultMessage="!Your Balance is {balance}"
              values={{
                balance: formatNumber(balance || 0, asCurrency)
              }}
            />
          </div>
          <div className="label">
            <FormattedMessage
              id="influencer.cash_withdrawal"
              defaultMessage="!Cash Withdrawal"
            />
          </div>
        </div>
        <div className="mt-10">
          {data && data.my_earnings && data.my_earnings.business_summary && (
            data.my_earnings.business_summary.map((summary, i) => {
              total += summary.balance_to_cash || 0
              return (
                <div key={`business-summary-${i}`} className="flex">
                  <div className="flex-1">
                    <div className="label pd-0">{summary.business_name}</div>
                    <div className="description">{moment(new Date(summary.last_activity)).fromNow()}</div>
                  </div>
                  <div className="value green no-bold pd-0">
                    <FormattedNumber
                      value={summary.balance_to_cash || 0}
                      style={summary.currency ? 'currency' : 'decimal'}
                      currency={summary.currency}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div className="mt-10 flex">
          <div className="label green flex-1">
            <FormattedMessage
              id="influencer.lifetime_earnings"
              defaultMessage="!Lifetime Earnings"
            />
          </div>
          <div className="value middle no-bold">
            {data && (
              <FormattedNumber
                value={total || 0}
                style={data.currency ? 'currency' : 'decimal'}
                currency={data.currency}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { intl: messages } = this.props
    return (
      <Card title={messages.earnings || 'Earnings'} className="d-md-none">
        {this.renderDesktop()}
      </Card>
    )
  }
}

export default injectIntl(EarningsCard)
