import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl'
import arrow_bottom from '../../../../icons/arrow-bottom.svg'
import arrow_right from '../../../../icons/arrow-right.svg'

class DesktopBusinessSummary extends React.Component {
  static propTypes = {
    data: PropTypes.object
  }

  state = {
    action: false
  }

  handleClick = () => this.setState({ action: !this.state.action })

  render() {
    const { data } = this.props
    return (
      <div
        className="business-Summary flex justify-between"
        style={{ borderBottomWidth: !this.state.action ? 0 : 1 }}
        onClick={this.handleClick}
      >
        <div className="flex">
          <div>
            <img className="profile-img" src={data.business_profile_pic_url} alt="business" />
          </div>
          <div className="flex flex-column justify ml2">
            <div className="business-name" style={{ fontWeight: 'bold' }}>{data.business_name}</div>
            <div className="last-activity">
              <FormattedMessage
                id="campaign_tile.last_activity"
                defaultMessage="!Last Activity {last}"
                values={{
                  last: data.last_activity
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="">
            <div className="total-earnings">
              <FormattedNumber value={data.total_earnings} style="currency" currency={data.currency} />
            </div>
            <div className="total-earnings-title">
              <FormattedMessage
                id="influencer.total_earnings"
                defaultMessage="!Total Earnings {total}"
                values={{
                  total: ''
                }}
              />
            </div>
          </div>
          <div className={parseInt(data.balance_to_cash, 10) > 0 ? 'to-cash' : 'to-cash-zoro'}>
            <div className="to-cash-earnings">
              <FormattedNumber value={data.balance_to_cash} style="currency" currency={data.currency} />
            </div>
            <div className="to-cash-earnings-title">
              <FormattedMessage id="campaign_tile.to_cash" defaultMessage="!To cash" />
            </div>
          </div>
          <div className="arrow flex-center">
            {this.state.action ? (
              <img className="arrow-bottom-img" src={arrow_bottom} alt="arrow" />
            ) : (
              <img className="arrow-right-img" src={arrow_right} alt="arrow" />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(DesktopBusinessSummary)

