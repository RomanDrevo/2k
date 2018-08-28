import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'
import payPalPLogo from '../../../../icons/paypal-p-logo.svg'
import payPalLogo from '../../../../icons/paypal-logo.svg'
// import './paypalWithdrawalWindow.css'

class PayPalWithdrawalWindow extends Component {
  static propTypes = {
    summaryDetails: PropTypes.object,
    closePaypalWithdrawalWindow: PropTypes.func.isRequired
  }

  handleClick = () => {
    this.props.closePaypalWithdrawalWindow()
  }

  render() {
    const { summaryDetails } = this.props
    // const amountWithCurrency = `${summaryDetails.total_earnings} ${summaryDetails.currency}`
    return (
      <div className="flex flex-column items-center mt2 paypal-withdrawal-window-wrapper">
        <h3>PayPal</h3>
        <form className="flex" action="http://localhost:5000/cashout" method="post">
          {/* <input*/}
          {/* className="cash-out-amount"*/}
          {/* type="text"*/}
          {/* name="amountWithCurrency"*/}
          {/* value={amountWithCurrency}*/}
          {/* placeholder="Enter Amount To Cash In"*/}
          {/* />*/}

          <div className="cash-out-amount flex items-center">
            <FormattedNumber
              value={summaryDetails.total_earnings}
              style="currency"
              currency={summaryDetails.currency}
            />
          </div>

          <input
            type="hidden"
            name="amountToSend"
            value={summaryDetails.total_earnings}
          />
          <input
            type="hidden"
            name="currencyToSend"
            value={summaryDetails.currency}
          />

          <button
            className="paypal-button flex items-end"
            type="submit"
          >
            <img className="paypal-button-logo" src={payPalPLogo} alt="" />
            <img className="" src={payPalLogo} alt="" />
            <span className="paypal-button-text ml1">Checkout</span>
          </button>
        </form>
        <div className="mt1 pointer" onClick={this.handleClick}>Cancel</div>
      </div>
    )
  }
}

export default PayPalWithdrawalWindow
