import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedNumber, FormattedMessage } from 'react-intl'

class MobileBusinessCampaign extends React.PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    renderMediaPreview: PropTypes.func.isRequired,
    // handleCmapaignClick: PropTypes.func.isRequired,
    handleOnCashOutClick: PropTypes.func.isRequired
  }

  handleClick = () => {
    this.props.handleOnCashOutClick(this.props.campaign.balance_to_cash)
  }

  render() {
    const itemStyle = {
      paddingLeft: 10, paddingRight: 10, paddingBottom: 2.5, paddingTop: 2.5, backgroundColor: '#E3E3E3'
    }
    const {
      campaign, intl: { formatDate }, renderMediaPreview
    } = this.props

    return (
      <div style={itemStyle}>
        <div
          className="business-Summary row-direction"
          style={{ backgroundColor: '#F7F7F7', borderWidth: 0 }}
          // onClick={handleCmapaignClick}
        >
          <div className="flex" style={{ flex: 1 }}>
            <div className="flex-center">
              <div className="align-text">
                <div className="detail-profile-img">{renderMediaPreview(campaign)}</div>
                <div className="mobile-last-activity">
                  <FormattedMessage
                    id="influencer.last_activity_value"
                    defaultMessage="!Last Activity {last}"
                    values={{
                      last: formatDate(new Date(campaign.last_activity), {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="business-name mobile">{campaign.campaign_headline}</div>
              <div className="mobile-last-activity row-direction">
                <div>
                  <div>
                    <div className="total-earnings">
                      <FormattedNumber value={campaign.total_earnings} style="currency" currency={campaign.currency} />
                    </div>
                    <div className="total-earnings-title">
                      <FormattedMessage
                        id="influencer.total_earnings"
                        defaultMessage="!Total Earnings {total}"
                        values={{ total: '' }}
                      />
                    </div>
                  </div>
                  <div
                    onClick={this.handleClick}
                    className={campaign.balance_to_cash > 0 ? 'mobile-to-cash' : 'mobile-to-cash-zoro'}
                  >
                    <div
                      className="to-cash-earnings"
                      style={{ color: campaign.balance_to_cash > 0 ? 'white' : '#1a936f' }}
                    >
                      <FormattedNumber value={campaign.balance_to_cash} style="currency" currency={campaign.currency} />
                    </div>
                    <div
                      className="to-cash-earnings-title"
                      style={{ color: campaign.balance_to_cash > 0 ? 'white' : '#1a936f' }}
                    >
                      <FormattedMessage id="campaign_tile.to_cash" defaultMessage="!To cash" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(MobileBusinessCampaign)
