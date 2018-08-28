import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

class CashInOptionsButtons extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    location: PropTypes.object.isRequired,
    hideDepositButtons: PropTypes.func.isRequired,
    openPayPalDepositWindow: PropTypes.func.isRequired
  }

  state={}

  handleOnClickPaypal = () => {
    this.props.hideDepositButtons()
    this.props.openPayPalDepositWindow()
  }

  render() {
    const {
      location, isMobile, hideDepositButtons
    } = this.props
    return (
      <div
        className={`new-account-buttons-wrapper${isMobile ? ' mt4 mb4' : ''}`}
      >
        <div className={`flex mt2 mb2 ${isMobile
          ? 'flex-column items-center'
          : 'justify-center'}`}
        >
          <button
            style={{
              backgroundColor: '#1A936F',
              color: '#fff',
              borderRadius: '50px'
            }}
            onClick={this.handleOnClickPaypal}
            className={`btn payment-method-btn${isMobile ? '' : ' mr3'}`}
          >
            <FormattedMessage
              id="influencer.paypal_account"
              defaultMessage="!PayPal Account"
            />
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
                <FormattedMessage
                  id="influencer.bank_account"
                  defaultMessage="!Bank Account"
                />
              </button>
            </Link>
          ) : (
            <div className="flex flex-column">
              <Link
                to={{
                  pathname: '/settings/payment/new/bank',
                  state: { prevLocation: location.pathname }
                }}
              >
                <button
                  onClick={() => hideDepositButtons()}
                  className="btn payment-method-btn ml3"
                  style={{
                    backgroundColor: '#1A936F',
                    color: '#fff',
                    borderRadius: '50px'
                  }}
                >
                  <FormattedMessage
                    id="influencer.bank_account"
                    defaultMessage="!Bank Account"
                  />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default injectIntl(CashInOptionsButtons)
