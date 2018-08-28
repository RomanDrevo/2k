import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import querystring from 'querystring'
import swal from 'sweetalert2'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Button, TapButton } from '../../../_common/index'
import { InfluencerActions } from '../../../../_redux/index'
import BankWithdrawalWindow from './BankWithdrawalWindow'
import NewAccountButtons from '../NewAccountButtons'
import my_earning_select from '../../../../icons/my-earning-select.svg'
import my_earning_unselect from '../../../../icons/my-earning-unselect.svg'
import withdrawal_select from '../../../../icons/withdrawal_history_select.svg'
import withdrawal_unselect from '../../../../icons/withdrawal_history_unselect.svg'
import noEarningsIcon from '../../../../icons/no_earnings_icon.svg'
import PayPalWithdrawalWindow from './PayPalWithdrawalWindow'

class DeskTopHeader extends React.Component {
  static propTypes = {
    isWithdrawalWindowOpen: PropTypes.bool,
    isMyEarning: PropTypes.bool,
    isWithDrawal: PropTypes.bool,
    totalPaid: PropTypes.number,
    totalCampaigns: PropTypes.number,
    lastActivity: PropTypes.string,
    location: PropTypes.object,
    summaryDetails: PropTypes.object,
    earnings: PropTypes.array,
    // bankAccountsList: PropTypes.array,
    setMyEarning: PropTypes.func.isRequired,
    setWithDrawal: PropTypes.func.isRequired,
    OPEN_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    OPEN_PAYPAL_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    CLOSE_PAYPAL_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    SET_AMOUNT_TO_WITHDRAWAL: PropTypes.func.isRequired,
    isPayPalWithdrawalWindowOpen: PropTypes.bool.isRequired
  }

  state = {}

  componentWillMount() {
    const parsed = querystring.parse(this.props.location.search)
    console.log('parsed: ', parsed)
    if (parsed.payout_id) {
      console.log('here')
      swal({
        title: `You have successfully cashed out! Pay Pal Payout Batch ID is: ${parsed.payout_id}`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
        // cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
        confirmButtonClass: 'btn swal confirm',
        // cancelButtonClass: 'btn swal cancel',
        customClass: 'border-green'
      })
    }
    // else {
    //   swal({
    //     title: 'Something went wrong with your Pay Pal transaction! Please try again.',
    //     // text: `Error: ${parsed.name}.`,
    //     type: 'error',
    //     showCancelButton: false,
    //     confirmButtonText: 'OK',
    //     // cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
    //     confirmButtonClass: 'btn swal btn-danger',
    //     // cancelButtonClass: 'btn swal cancel',
    //     customClass: 'border-green'
    //   })
    // }
  }

  getVal(val) {
    const resultNumber = val / 1000
    if (resultNumber > 0) {
      return `${resultNumber.toFixed(1)}k`
    } return val
  }

  handleOnCashOutClick = () => {
    const { summaryDetails } = this.props
    const amountToWithdrawal = summaryDetails.total_earnings
    this.props.SET_AMOUNT_TO_WITHDRAWAL(amountToWithdrawal)
    this.setState({ showOpenNewAccountButtons: true })
    // if (!bankAccountsList.length) {
    //   this.setState({
    //     showOpenNewAccountButtons: true
    //   })
    // } else {
    //   this.props.OPEN_WITHDRAWAL_WINDOW()
    //   this.setState({
    //     showOpenNewAccountButtons: false
    //   })
    // }
  }

  hidePayMethodsButtons = () => {
    this.setState({ showOpenNewAccountButtons: false })
  }

  render() {
    const {
      summaryDetails,
      earnings,
      totalPaid,
      isMyEarning,
      isWithDrawal,
      setMyEarning,
      setWithDrawal,
      totalCampaigns,
      lastActivity,
      location,
      isPayPalWithdrawalWindowOpen,
      OPEN_PAYPAL_WITHDRAWAL_WINDOW,
      CLOSE_PAYPAL_WITHDRAWAL_WINDOW,
      OPEN_WITHDRAWAL_WINDOW
    } = this.props

    return (
      <div>
        <div className="header flex-center">
          <div className="revenues" style={{ flex: 1 }}>
            <FormattedMessage id="influencer.revenues" defaultMessage="!Revenues" />
          </div>
          {earnings.length ? (
            <Button
              style={{
                backgroundColor: '#E3E3E3',
                height: 25,
                paddingLeft: 50,
                paddingRight: 50
              }}
              onClick={this.handleOnCashOutClick}
            >
              <div className="button-text-cash-out">
                <FormattedMessage id="influencer.cash_out" defaultMessage="!Cash Out" />
              </div>
            </Button>
          ) : null}
        </div>
        <div className="earning flex-center">
          <div className="earning-items" style={{ flex: 1 }}>
            <div className="earning-item-content">
              {summaryDetails.total_earnings_display_string}
            </div>
            <div className="earning-item-title">
              <FormattedMessage
                id="influencer.total_earnings"
                defaultMessage="!Total Earnings"
                values={{ total: '' }}
              />
            </div>
          </div>
          <div className="earning-items" style={{ flex: 1 }}>
            <div className="earning-item-content">
              {this.getVal(totalPaid)}
            </div>
            <div className="earning-item-title">
              <FormattedMessage id="influencer.paid" defaultMessage="!Paid" />
            </div>
          </div>
          <div className="earning-items" style={{ flex: 1 }}>
            <div className="earning-item-content">
              {summaryDetails.current_balance_pending_display_string}
            </div>
            <div className="earning-item-title">
              <FormattedMessage id="influencer.pending" defaultMessage="!Pending" />
            </div>
          </div>
          <div className="earning-items" style={{ flex: 1 }}>
            <div className="earning-item-content">
              {summaryDetails.current_balance_display_string}
            </div>
            <div className="earning-item-title">
              <FormattedMessage id="influencer.balance" defaultMessage="!Balance" />
            </div>
          </div>
          <div className="earning-items" style={{ flex: 1 }}>
            {earnings.length ? (
              <div>
                <div className="earning-item-content">{lastActivity}</div>
                <div className="earning-item-title">
                  <FormattedMessage id="influencer.last_earnings" defaultMessage="!Last Earnings" />
                </div>
              </div>
            ) : (
              <FormattedMessage
                tagName="div"
                id="influencer.no_activity"
                defaultMessage="!No Activity yet, We are ready when you are"
              />
            )}
          </div>
        </div>
        {this.state.showOpenNewAccountButtons ?
          <NewAccountButtons
            location={location}
            openPayPalWithdrawalWindow={OPEN_PAYPAL_WITHDRAWAL_WINDOW}
            openBankWithdrawalWindow={OPEN_WITHDRAWAL_WINDOW}
            hidePayMethodsButtons={this.hidePayMethodsButtons}
          />
          : null}
        {this.props.isWithdrawalWindowOpen ? (
          <div className="mt4 mb4">
            <BankWithdrawalWindow setAmountToWithdrawal={this.props.SET_AMOUNT_TO_WITHDRAWAL} />
          </div>
        ) : null}

        {
          isPayPalWithdrawalWindowOpen ?
            <PayPalWithdrawalWindow
              summaryDetails={summaryDetails}
              closePaypalWithdrawalWindow={CLOSE_PAYPAL_WITHDRAWAL_WINDOW}
            /> : null
        }

        {earnings.length ? (
          <div className="flex-center" style={{ marginTop: 25 }}>
            <div className="row-direction" style={{ flex: 1 }}>
              <TapButton
                select={isMyEarning}
                title="My Earnings"
                icon={isMyEarning ? my_earning_select : my_earning_unselect}
                onClick={() => setMyEarning()}
              />
              <TapButton
                select={isWithDrawal}
                title="Withdrawl History"
                icon={!isMyEarning ? withdrawal_select : withdrawal_unselect}
                onClick={() => setWithDrawal()}
              />
            </div>


            <div className="row-direction">
              <div style={{ color: '#747474', fontSize: 13, marginTop: 10 }}>
                {isMyEarning ? (
                  <FormattedMessage id="influencer.total_campaigns" defaultMessage="!Total Campaigns" />
                ) : (
                  <FormattedMessage id="influencer.total_withdrawls" defaultMessage="!Total Withdrawls" />
                )}:&nbsp;
              </div>
              <div style={{ color: '#1A936F', fontSize: 13, marginTop: 10 }}>
                {totalCampaigns}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt3">
            <img src={noEarningsIcon} alt="No Earnings" />
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(injectIntl(connect(
  (state) => {
    const bankAccountsList = state.influencer.get('payment_methods_list').toArray()
    const summaryDetails = state.influencer.get('summary_data').toJS()
    const balanceDetails = state.influencer.get('balance_data').toJS()
    const isWithdrawalWindowOpen = state.influencer.get('isWithdrawalWindowOpen')
    const isPayPalWithdrawalWindowOpen = state.influencer.get('isPayPalWithdrawalWindowOpen')

    return {
      balanceDetails,
      summaryDetails,
      bankAccountsList,
      isWithdrawalWindowOpen,
      isPayPalWithdrawalWindowOpen
    }
  },
  {
    OPEN_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_WITHDRAWAL_WINDOW,
    OPEN_PAYPAL_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_PAYPAL_WITHDRAWAL_WINDOW,
    CLOSE_PAYPAL_WITHDRAWAL_WINDOW: InfluencerActions.CLOSE_PAYPAL_WITHDRAWAL_WINDOW,
    SET_AMOUNT_TO_WITHDRAWAL: InfluencerActions.SET_AMOUNT_TO_WITHDRAWAL
  }
)(DeskTopHeader)))

