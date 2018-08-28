import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl'
import arrow_bottom from '../../../../icons/mobile-bottom-arrow.svg'
import arrow_top from '../../../../icons/mobile-top-arrow.svg'

class MobileBusinessSummary extends React.Component {
  static propTypes = {
    data: PropTypes.object
  }

  state = {
    action: false
  }

  handleClick = (e) => {
    e.stopPropagation()
    this.setState({ action: !this.state.action })
  }

  render() {
    const { data } = this.props
    return (
      <div
        className="business-Summary row-direction"
        style={{ borderBottomWidth: !this.state.action ? 0 : 1 }}
        onClick={this.handleClick}
      >
        <div className="row-direction" style={{ flex: 1 }}>
          <div className="flex-center">
            <img className="mobile-profile-img" alt="mobile-profile" src={data.business_profile_pic_url} />
          </div>
          <div className="content">
            <div className="business-name line" style={{ fontWeight: 'bold' }}>{data.business_name}</div>
            <div className="mobile-last-activity row-direction">
              <div className="last-activity-mobile">
                <FormattedMessage
                  tagName="div"
                  id="campaign_tile.last_activity"
                  defaultMessage="!Last Activity {last}"
                  values={{
                    last: data.last_activity
                  }}
                />
              </div>
              <div className="mobile-earnings">
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
              <div className={parseInt(data.balance_to_cash, 10) > 0 ? 'mobile-to-cash' : 'mobile-to-cash-zoro'}>
                <div className="to-cash-earnings">
                  <FormattedNumber value={data.balance_to_cash} style="currency" currency={data.currency} />
                </div>
                <div className="to-cash-earnings-title">
                  <FormattedMessage id="campaign_tile.to_cash" defaultMessage="!To cash" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-center" style={{ paddingLeft: 5 }}>
          {!this.state.action ?
            <img className="mobile-arrow-img" alt="arrow-bottom" src={arrow_bottom} /> :
            <img className="mobile-arrow-img" alt="arrow-top" src={arrow_top} />
          }
        </div>
      </div>
    )
  }
}

export default injectIntl(MobileBusinessSummary)
