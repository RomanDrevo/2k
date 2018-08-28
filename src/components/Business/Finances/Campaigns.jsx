import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Scrollbars } from 'react-custom-scrollbars'
import { FormattedMessage } from 'react-intl'
import { Button } from '../../_common/index'
import Campaign from './Campaign'


class Campaigns extends Component {
    static propTypes = {
      campaigns: PropTypes.array.isRequired,
      businessDetails: PropTypes.object,
      setAmountToDeposit: PropTypes.func,
      setCurrencyToDeposit: PropTypes.func.isRequired,
      showDepositButtons: PropTypes.func,
      amountToDeposit: PropTypes.number,
      setSelectedCampaign: PropTypes.func.isRequired,
      openPayPalDepositWindow: PropTypes.func.isRequired
    }

    handleOnCashInClick = () => {
      this.props.showDepositButtons()
    }

    render() {
      const {
        campaigns, businessDetails, amountToDeposit, setAmountToDeposit, showDepositButtons, setSelectedCampaign,
        setCurrencyToDeposit, openPayPalDepositWindow
      } = this.props

      return (
        <div>
          <div className="header flex justify-between mt4 mb4">
            <div className="revenues">
              <FormattedMessage id="influencer.revenues" defaultMessage="!Revenues" />
            </div>
            <Button
              style={{
                backgroundColor: '#E3E3E3',
                height: 25,
                paddingLeft: 50,
                paddingRight: 50
              }}
              onClick={this.handleOnCashInClick}
            >
              <div className="button-text-cash-out">
                <FormattedMessage id="business_finances.deposit" defaultMessage="!Deposit" />
              </div>
            </Button>
          </div>

          <div className="finance-table">
            <div className="table-header table-row flex flex-column">
              <div className="row header-row">
                <div className="divTableCell col-sm-3 audience-name flex items-center">
                  Campaign Name
                </div>
                <div className="divTableCell col-sm-3 text-center flex items-center justify-center">
                  Withstanding Budget
                </div>
                <div className="divTableCell col-sm-3 text-center flex items-center justify-center">
                  Total Budget
                </div>
                <div className="divTableCell col-sm-3 text-center">
                  Amount To Deposit
                </div>
              </div>
            </div>
            <div className="finance-table-body">
              <Scrollbars autoHide style={{ height: '100%' }}>
                {
                  campaigns.map((campaign) =>
                    (<Campaign
                      campaign={campaign}
                      amountToDeposit={amountToDeposit}
                      setAmountToDeposit={setAmountToDeposit}
                      setCurrencyToDeposit={setCurrencyToDeposit}
                      businessDetails={businessDetails}
                      showDepositButtons={showDepositButtons}
                      setSelectedCampaign={setSelectedCampaign}
                      openPayPalDepositWindow={openPayPalDepositWindow}
                    />))
                }
              </Scrollbars>
            </div>
          </div>
        </div>
      )
    }
}

export default withRouter(Campaigns)
