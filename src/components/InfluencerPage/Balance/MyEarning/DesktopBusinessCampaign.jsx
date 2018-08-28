import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedNumber, FormattedMessage } from 'react-intl'

class DesktopBusinessCampaign extends React.PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    renderMediaPreview: PropTypes.func.isRequired,
    handleOnCashOutClick: PropTypes.func.isRequired
  }

  handleClick = () => {
    this.props.handleOnCashOutClick(this.props.campaign.balance_to_cash)
  }

  render() {
    const itemStyle = {
      paddingLeft: 10, paddingRight: 10, paddingBottom: 2.5, paddingTop: 2.5, backgroundColor: '#E3E3E3'
    }
    const { campaign, intl: { formatDate }, renderMediaPreview } = this.props

    return (
      <div style={itemStyle}>
        <div className="business-Summary" style={{ backgroundColor: '#F7F7F7', borderWidth: 0 }}>
          <div className="row-direction" style={{ flex: 1 }}>
            <div style={{ flex: 1 }} className="detail-profile-img">{renderMediaPreview(campaign)}</div>
            <div className="flex flex-column justify-center ml1" style={{ flex: 5 }}>
              <div className="business-id-to-name">{campaign.campaign_headline}</div>
              <div className="last-activity" style={{ marginTop: 0 }}>
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
            <div className="row-direction">
              <div className="">
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
                // onClick={this.handleClick}
                className={parseInt(campaign.balance_to_cash, 10) > 0 ? 'to-cash' : 'to-cash-zoro'}
              >
                <div className="to-cash-earnings">
                  <FormattedNumber value={campaign.balance_to_cash} style="currency" currency={campaign.currency} />
                </div>
                <div className="to-cash-earnings-title">
                  <FormattedMessage id="campaign_tile.to_cash" defaultMessage="!To cash" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(DesktopBusinessCampaign)
