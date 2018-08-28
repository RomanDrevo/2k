import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { InfluencerActions } from '../../../_redux/index'
import DeskTopHeader from './Header/DesktopHeader'
import MobileHeader from './Header/MobileHeader'
import MyEarning from './MyEarning'
import WithDrawalHistory from './WithdrawalHistory'
import Menu from '../Menu'
import noEarningsIcon from '../../../icons/no_earnings_icon.svg'
import loadingImg from '../../../loading.svg'
import NewAccountButtons from './NewAccountButtons'
import WithdrawalWindowMobile from './Header/WithdrawalWindowMobile'
import './balance.css'

class Balance extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    FETCH_INFLUENCER_BALANCE: PropTypes.func,
    FETCH_INFLUENCER_SUMMARY: PropTypes.func,
    FETCH_INFLUENCER_PAYMETHOD_LIST: PropTypes.func,
    FETCH_INFLUENCER_CAMPAIGNS: PropTypes.func,
    intl: PropTypes.object.isRequired,
    balanceDetails: PropTypes.object,
    summaryDetails: PropTypes.object,
    payMethodDetails: PropTypes.array,
    isNewAccountMobileButtonsOpen: PropTypes.bool,
    isWithdrawalWindowOpen: PropTypes.bool,
    location: PropTypes.object,
    SET_AMOUNT_TO_WITHDRAWAL: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      isMyEarning: true,
      isWithDrawal: false
    }

    this.relativeTime = {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1M',
        MM: '%dM',
        y: '1y',
        yy: '%dy'
      }
    }
  }

  componentWillMount() {
    this.props.FETCH_INFLUENCER_BALANCE()
    //  .then((res) => console.log('FETCH_BALANCES', res))
    this.props.FETCH_INFLUENCER_SUMMARY()
    //  .then((res) => console.log('FETCH_SUMMARYS', res))
    this.props.FETCH_INFLUENCER_PAYMETHOD_LIST()
    this.props.FETCH_INFLUENCER_CAMPAIGNS()
  }

  getLastActivity = () => {
    const { balanceDetails, intl: { formatDate } } = this.props
    const workerList = balanceDetails.my_earnings
      ? balanceDetails.my_earnings.business_summary
      : []
    // moment.updateLocale(language, this.relativeTime)
    if (!_.isEmpty(workerList)) {
      const startDtArr = []
      workerList.forEach((value) => {
        startDtArr.push(value.last_activity
          ? formatDate(new Date(value.last_activity.trim()))
          : formatDate(new Date()))
      })
      const startDt = _.max(startDtArr)
      return startDt
    }
    return null
  }

  setMyEarning= () => this.setState({ isWithDrawal: false, isMyEarning: true })

  setWithDrawal= () => this.setState({ isWithDrawal: true, isMyEarning: false })

  renderDescTop = () => {
    const { payMethodDetails } = this.props
    const { isWithDrawal, isMyEarning } = this.state
    const { balanceDetails, summaryDetails } = this.props
    const businessEarnings = balanceDetails.my_earnings
      ? balanceDetails.my_earnings.business_summary
      : []
    console.log('businessEarnings: ', businessEarnings)
    const myEarningsBusinessSummary = businessEarnings.filter((x) => x.total_earnings > 0)
    const myEarningsBusinessIdToCampaigns = balanceDetails.my_earnings
      ? balanceDetails.my_earnings.business_id_to_campaigns
      : []

      // const myEarningsBusinessIdToCampaigns = this.props.campaigns_data.owner.filter((x) => x.business_id === )

    console.log('myEarningsBusinessIdToCampaigns: ', myEarningsBusinessIdToCampaigns)
    const summary = summaryDetails
    const totalPaid = balanceDetails.total_paid
    const currency = summaryDetails
    const totalCampaigns = summaryDetails.n_total_campaigns

    const withdrawal_history = [
      {
        date: '2018-03-15T15:53:00',
        deposited_to: 'Deposited to Credit Card Ending 3621',
        tax_paid_percent: 0.1,
        tax_paid_amount: 1.00,
        paid_amount: 6.00,
        paid_currency: 'USD',
        payment_status: 'COMPLETED'
      }
    ]

    return (
      <div className="balance desktop">
        <DeskTopHeader
          payMethodDetails={payMethodDetails}
          earnings={myEarningsBusinessSummary}
          fetchSummary={summary}
          totalPaid={totalPaid}
          currency={currency}
          isWithDrawal={isWithDrawal}
          isMyEarning={isMyEarning}
          totalCampaigns={totalCampaigns}
          setMyEarning={this.setMyEarning}
          setWithDrawal={this.setWithDrawal}
          lastActivity={this.getLastActivity()}
        />
        {myEarningsBusinessSummary ? (
          <div>
            {
              this.state.isMyEarning ?
                <MyEarning
                  my_earnings_business_summary={myEarningsBusinessSummary}
                  my_earnings_business_id_to_campaigns={myEarningsBusinessIdToCampaigns}
                />
                :
                <WithDrawalHistory
                  withdrawal_history={withdrawal_history}
                />
            }


          </div>
        ) : (
          <div>
            <img src={noEarningsIcon} alt="no-earnings" />
          </div>
        )}
      </div>
    )
  }

  renderMobile = () => {
    const { isWithDrawal, isMyEarning } = this.state
    const { balanceDetails, summaryDetails } = this.props
    const businessEarnings = balanceDetails.my_earnings
      ? balanceDetails.my_earnings.business_summary
      : []
    const myEarningsBusinessSummary = businessEarnings.filter((x) => x.total_earnings > 0)
    const myEarningsBusinessIdToCampaigns = balanceDetails.my_earnings
      ? balanceDetails.my_earnings.business_id_to_campaigns
      : []
    const { withdrawl_history } = balanceDetails
    const summary = summaryDetails
    const totalPaid = balanceDetails.total_paid
    const currency = summaryDetails
    const totalCampaigns = summaryDetails.n_total_campaigns
    return (
      <div className="balance mobile">
        <MobileHeader
          earnings={myEarningsBusinessSummary}
          fetchSummary={summary}
          totalPaid={totalPaid}
          currency={currency}
          isWithDrawal={isWithDrawal}
          isMyEarning={isMyEarning}
          totalCampaigns={totalCampaigns}
          setMyEarning={this.setMyEarning}
          setWithDrawal={this.setWithDrawal}
          lastActivity={this.getLastActivity()}
        />
        <Menu isMobile={this.props.isMobile} />
        {this.props.isNewAccountMobileButtonsOpen ? (
          <NewAccountButtons location={this.props.location} isMobile={this.props.isMobile} />
        ) : null}
        {this.props.isWithdrawalWindowOpen ? (
          <div className="mt4 mb4">
            <WithdrawalWindowMobile setAmountToWithdrawal={this.props.SET_AMOUNT_TO_WITHDRAWAL} />
          </div>
        ) : null}
        {myEarningsBusinessSummary ? (
          <div>
            <MyEarning
              my_earnings_business_summary={myEarningsBusinessSummary}
              my_earnings_business_id_to_campaigns={myEarningsBusinessIdToCampaigns}
            />
            <div>
              <div className="mobile-paid">
                <FormattedMessage
                  id="influencer.total_paid"
                  defaultMessage="!Paid: {total}"
                  values={{ total: totalPaid }}
                />
              </div>
              <WithDrawalHistory
                isMobile={this.props.isMobile}
                withdrawl_history={withdrawl_history}
              />
            </div>
          </div>
        ) : (
          <div>
            <img src={noEarningsIcon} alt="no-earnings" />
          </div>
        )}
      </div>
    )
  }

  render() {
    console.log('Influencer Props: ', this.props)
    if (_.isEmpty(this.props.balanceDetails) ||
      _.isEmpty(this.props.summaryDetails)) {
      return <div className="flex justify-center mt-30"><img src={loadingImg} alt="loading" /></div>
    }
    return (
      <div>
        {this.props.isMobile ? this.renderMobile() : this.renderDescTop()}
      </div>
    )
  }
}

export default withRouter(injectIntl(connect((state) => ({
  isMobile: state.general.get('isMobile'),
  balanceDetails: state.influencer.get('balance_data').toJS(),
  summaryDetails: state.influencer.get('summary_data').toJS(),
  campaigns_data: state.influencer.get('campaigns_data').toJS(),
  payMethodDetails: state.influencer.get('payment_methods_list').toJS(),
  isNewAccountMobileButtonsOpen: state.influencer.get('isNewAccountMobileButtonsOpen'),
  isWithdrawalWindowOpen: state.influencer.get('isWithdrawalWindowOpen')
}), {
  FETCH_INFLUENCER_BALANCE: InfluencerActions.FETCH_INFLUENCER_BALANCE,
  FETCH_INFLUENCER_SUMMARY: InfluencerActions.FETCH_INFLUENCER_SUMMARY,
  FETCH_INFLUENCER_CAMPAIGNS: InfluencerActions.FETCH_INFLUENCER_CAMPAIGNS,
  FETCH_INFLUENCER_PAYMETHOD_LIST: InfluencerActions.FETCH_INFLUENCER_PAYMETHOD_LIST,
  SET_AMOUNT_TO_WITHDRAWAL: InfluencerActions.SET_AMOUNT_TO_WITHDRAWAL
})(Balance)))

