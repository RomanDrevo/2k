import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber, injectIntl } from 'react-intl'
import payPalPLogo from '../../../icons/paypal-p-logo.svg'
import payPalLogo from '../../../icons/paypal-logo.svg'

class PayPalDepositWindow extends Component {
    static propTypes = {
      businessDetails: PropTypes.object,
      currencyToDeposit: PropTypes.string.isRequired,
      amountWithCurrency: PropTypes.string.isRequired,
      selectedCampaign: PropTypes.number.isRequired,
      amountToDeposit: PropTypes.number.isRequired,
      closePaypalDepositWindow: PropTypes.func.isRequired
    }

    state={}

    handleOnClick = () => {
      this.props.closePaypalDepositWindow()
    }

    render() {
      const {
        amountWithCurrency, businessDetails, currencyToDeposit, selectedCampaign, amountToDeposit
      } = this.props
      return (
        <div className="flex flex-column items-center mt2">
          <h1>PayPal Payment</h1>
          <div className="amount-to-deposit">
            <FormattedNumber
              value={amountToDeposit}
              style="currency"
              currency={currencyToDeposit}
            />
          </div>
          <form className="flex items-center" action="http://localhost:5000/pay" method="post">
            <input
              className="cash-in-amount"
              type="hidden"
              name="amount"
              value={amountWithCurrency}
              placeholder="Enter Amount To Cash In"
            />

            <input type="hidden" name="business_id" value={businessDetails.id} />
            <input type="hidden" name="campaign_id" value={selectedCampaign} />
            <input type="hidden" name="campaign_currency" value={currencyToDeposit} />
            {/* <input className="cash-in-btn" type="submit" value="Cash In" />*/}

            <button className="paypal-button flex items-end" type="submit">
              <img className="paypal-button-logo" src={payPalPLogo} alt="" />
              <img className="" src={payPalLogo} alt="" />
              <span className="paypal-button-text ml1"> Checkout</span>
            </button>
          </form>
          <div className="mt1 pointer" onClick={this.handleOnClick}>Cancel</div>
        </div>
      )
    }
}

export default injectIntl(PayPalDepositWindow)
