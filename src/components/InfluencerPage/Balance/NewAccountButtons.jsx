import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

class NewAccountButtons extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    location: PropTypes.object.isRequired,
    openPayPalWithdrawalWindow: PropTypes.func.isRequired,
    openBankWithdrawalWindow: PropTypes.func.isRequired,
    hidePayMethodsButtons: PropTypes.func.isRequired
  }

  state={}

  onPayPalClick = () => {
    this.props.hidePayMethodsButtons()
    this.props.openPayPalWithdrawalWindow()
  }

  onBankClick = () => {
    this.props.hidePayMethodsButtons()
    this.props.openBankWithdrawalWindow()
  }

  render() {
    const { location, isMobile, hidePayMethodsButtons } = this.props
    return (
      <div className={`new-account-buttons-wrapper${isMobile ? ' mt4 mb4' : ''}`}>
        <div className="flex justify-center payment-method-question">
          <FormattedMessage
            tagName="b"
            id="influencer.how_to"
            defaultMessage="!How do you want to receive your earnings?"
          />
        </div>
        <div className={`flex mt2 ${isMobile ? 'flex-column items-center' : 'justify-center'}`}>
          <button
            className={`btn payment-method-btn${isMobile ? '' : ' mr3'}`}
            onClick={this.onPayPalClick}
          >
            <FormattedMessage id="influencer.paypal_account" defaultMessage="!PayPal Account" />
          </button>

          {isMobile && (
            <span className="mt1 mb1">
              <FormattedMessage tagName="b" id="or" defaultMessage="!or" />
            </span>
          )}
          {isMobile ? (
            <Link
              to={{
                pathname: '/settings/payment/new/bank',
                state: { prevLocation: location.pathname }
              }}
            >
              <button className="btn payment-method-btn">
                <FormattedMessage id="influencer.bank_account" defaultMessage="!Bank Account" />
              </button>
            </Link>
          ) : (
            <div className="flex flex-column">
              <button onClick={this.onBankClick} className="btn payment-method-btn ml3">
                <FormattedMessage id="influencer.bank_account" defaultMessage="!Bank Account" />
              </button>
            </div>
          )}
        </div>
        <div onClick={hidePayMethodsButtons} className="flex justify-center mt1 pointer">Cancel</div>
      </div>
    )
  }
}

export default injectIntl(NewAccountButtons)
