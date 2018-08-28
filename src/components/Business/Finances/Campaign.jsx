import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'
import { FormattedNumber } from 'react-intl'

class Campaign extends Component {
    static propTypes = {
      campaign: PropTypes.object.isRequired,
      setAmountToDeposit: PropTypes.number,
      setCurrencyToDeposit: PropTypes.number,
      showDepositButtons: PropTypes.func,
      setSelectedCampaign: PropTypes.func
    }

    state={}

    submitOnClick = (amount, campaignId, campaignCurrency) => {
      const { setAmountToDeposit } = this.props
      setAmountToDeposit(amount)
      this.props.showDepositButtons()
      this.props.setSelectedCampaign(campaignId)
      this.props.setCurrencyToDeposit(campaignCurrency)
    }

    render() {
      const { campaign } = this.props
      console.log('Campaign details: ', campaign)
      return (
        <div className="table-row">
          <div className="row">
            <div className="divTableCell col-sm-3 audience-name flex items-center">
              <div className="campaign-logo-wrapper">
                <img src={campaign.media_url} alt="logo" />
              </div>
              <div className="campaign-name ml1">
                {campaign.name}
              </div>
            </div>
            <div className="divTableCell col-sm-3 text-center mt2">
              <FormattedNumber
                value={campaign.withstanding_budget}
                style="currency"
                currency={campaign.currency}
              />
            </div>
            <div className="divTableCell col-sm-3 text-center mt2">
              <FormattedNumber
                value={campaign.total_budget}
                style="currency"
                currency={campaign.currency}
              />
            </div>
            <div className="divTableCell col-sm-3 text-center mt1">
              {
                campaign.withstanding_budget ?
                  <button
                    // disabled={!campaign.withstanding_budget}
                    className="cash-in-btn"
                    onClick={() => this.submitOnClick(campaign.withstanding_budget, campaign.id, campaign.currency)}
                  >
                    <div className="">
                      <FormattedNumber
                        value={campaign.withstanding_budget}
                        style="currency"
                        currency={campaign.currency}
                      />
                    </div>
                  </button>
                  :
                  <div className="cash-in-btn-disabled ml3" />
              }
            </div>
          </div>
        </div>
      )
    }
}

export default withRouter(Campaign)
