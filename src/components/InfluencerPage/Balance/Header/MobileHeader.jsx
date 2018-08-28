import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Button } from '../../../_common/index'
import { InfluencerActions } from '../../../../_redux/index'
import myEarningsSelect from '../../../../icons/my-earning-select.svg'
import myEarningsUnselect from '../../../../icons/my-earning-unselect.svg'
import withdrawalSelect from '../../../../icons/withdrawal_history_select.svg'
import withdrawalUnselect from '../../../../icons/withdrawal_history_unselect.svg'

class MobileHeader extends React.Component {
  static propTypes = {
    isMyEarning: PropTypes.bool,
    lastActivity: PropTypes.string,
    fetchSummary: PropTypes.object,
    // currency: PropTypes.object,
    balanceDetails: PropTypes.object,
    earnings: PropTypes.array,
    filteredPayMethods: PropTypes.array,
    setMyEarning: PropTypes.func.isRequired,
    setWithDrawal: PropTypes.func.isRequired,
    SHOW_NEW_ACCOUNT_MOBILE_BUTTONS: PropTypes.func.isRequired,
    OPEN_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    SET_AMOUNT_TO_WITHDRAWAL: PropTypes.func.isRequired,
    HIDE_NEW_ACCOUNT_MOBILE_BUTTONS: PropTypes.func.isRequired
  }

  static getVal(val) {
    const resultNumber = val / 1000
    if (resultNumber > 0) {
      return `${resultNumber.toFixed(1)}k`
    }
    return val
  }

  state = { }

  handleOnCashOutClick = () => {
    const { filteredPayMethods, balanceDetails } = this.props
    const amountToWithdrawal = balanceDetails.my_earnings.business_summary[0].total_earnings
    if (!filteredPayMethods.length) {
      this.props.SHOW_NEW_ACCOUNT_MOBILE_BUTTONS()
    } else {
      this.props.OPEN_WITHDRAWAL_WINDOW()
      this.props.SET_AMOUNT_TO_WITHDRAWAL(amountToWithdrawal)
      this.props.HIDE_NEW_ACCOUNT_MOBILE_BUTTONS()
    }
  }

  render() {
    const {
      earnings,
      fetchSummary,
      isMyEarning,
      setMyEarning,
      setWithDrawal,
      lastActivity
    } = this.props

    return (
      <div className="mobile-header">
        {earnings ? (
          <div>
            <div className="row-direction">
              <div style={{ flex: 1 }} className="mobile-header-text">
                <div style={{ marginTop: 3 }}>
                  <FormattedMessage
                    id="influencer.pending_value"
                    defaultMessage="!Pending: {value}"
                    values={{
                      value: fetchSummary.current_balance_pending_display_string
                    }}
                  />
                </div>
                <FormattedMessage
                  tagName="div"
                  id="influencer.last_activity_value"
                  defaultMessage="!Last Activity {last}"
                  values={{
                    last: lastActivity
                  }}
                />
              </div>
              <div className="right-text">
                <div className="mobile-total-earning">
                  <FormattedMessage
                    id="influencer.total_earnings"
                    defaultMessage="!Total Earnings {total}"
                    values={{
                      total: fetchSummary.total_earnings_display_string
                    }}
                  />
                </div>
                <div className="mobile-header-text">
                  <FormattedMessage
                    id="influencer.current_balance_value"
                    defaultMessage="!Current Balance {balance}"
                    values={{
                      balance: fetchSummary.current_balance_display_string
                    }}
                  />
                </div>
                <Button
                  style={{
                    backgroundColor: '#E3E3E3',
                    height: 14,
                    paddingLeft: 30,
                    paddingRight: 30,
                    marginLeft: 20
                  }}
                  onClick={this.handleOnCashOutClick}
                >
                  <div className="button-text-cash-out" style={{ fontSize: 11 }}>
                    <FormattedMessage id="influencer.cash_out" defaultMessage="!Cash Out" />
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex-center">
              <a className="mobile-withdrawal-history" style={{ flex: 1 }} onClick={setWithDrawal}>
                <img
                  alt="withdrawal"
                  className="mobile-header-img"
                  src={!isMyEarning ? withdrawalSelect : withdrawalUnselect}
                />
                <div className={!isMyEarning ? 'selected' : 'unselected'}>
                  <FormattedMessage id="influencer.withdral_history" defaultMessage="!Withdrawl History" />
                </div>
              </a>
              <a className="mobile-earning" style={{ flex: 1 }} onClick={setMyEarning}>
                <img
                  className="mobile-header-img"
                  alt="earnings"
                  src={isMyEarning ? myEarningsSelect : myEarningsUnselect}
                />
                <div className={isMyEarning ? 'selected' : 'unselected'}>
                  <FormattedMessage id="influencer.my_earning" defaultMessage="!My Earnings" />
                </div>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-column">
            <div className="flex justify-between">
              <FormattedMessage
                tagName="div"
                id="influencer.good_morning_user"
                defaultMessage="!Good Morning, User!"
              />
              <FormattedMessage
                tagName="div"
                id="influencer.no_earnings"
                defaultMessage="!No yearnings yet!"
              />
            </div>
            <div className="flex justify-center mt4 mb4">
              <FormattedMessage
                id="influencer.no_activity"
                defaultMessage="!No Activity yet, We are ready when you are"
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(injectIntl(connect(
  (state) => {
    const filteredPayMethods = state.influencer.get('payment_methods_list').toJS()
      .filter((x) => x.is_deleted !== true)
    const summaryDetails = state.influencer.get('summary_data').toJS()
    const balanceDetails = state.influencer.get('balance_data').toJS()
    const isWithdrawalWindowOpen = state.influencer.get('isWithdrawalWindowOpen')

    return {
      balanceDetails,
      summaryDetails,
      filteredPayMethods,
      isWithdrawalWindowOpen
    }
  },
  {
    OPEN_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_WITHDRAWAL_WINDOW,
    SET_AMOUNT_TO_WITHDRAWAL: InfluencerActions.SET_AMOUNT_TO_WITHDRAWAL,
    SHOW_NEW_ACCOUNT_MOBILE_BUTTONS: InfluencerActions.SHOW_NEW_ACCOUNT_MOBILE_BUTTONS,
    HIDE_NEW_ACCOUNT_MOBILE_BUTTONS: InfluencerActions.HIDE_NEW_ACCOUNT_MOBILE_BUTTONS
  }
)(MobileHeader)))
