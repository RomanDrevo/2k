import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import { Button } from '../../../_common/index'
import { InfluencerActions } from '../../../../_redux/index'


class BankWithdrawalWindow extends Component {
  static propTypes = {
    amountToWithdrawal: PropTypes.string,
    paymentMethod: PropTypes.array,
    paymentMethodsList: PropTypes.array,
    location: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    balanceDetails: PropTypes.object,
    setAmountToWithdrawal: PropTypes.func.isRequired,
    CLOSE_WITHDRAWAL_WINDOW: PropTypes.func.isRequired
  }

  handleOnChange = (event) => {
    this.props.setAmountToWithdrawal(event.target.value)
  }
  render() {
    const { paymentMethod, intl: { formatMessage }, paymentMethodsList } = this.props

    console.log('amount to withdrawal: ', this.props.amountToWithdrawal)

    if (!paymentMethodsList.length) {
      return (
        // eslint-disable-next-line
        <div>No Bank Accounts has been set. Proceed to "Settings -> PaymentMethods" to create one.</div>
      )
    }

    return (
      <div className="profile-settings-container withdrawal-window flex justify-center">
        <div className="row flex items-end">
          <div className="col-sm-8">
            <div className="flex items-center">
              <div className="withdrawal-title">
                <FormattedMessage id="influencer.withdrawal_amount_of" defaultMessage="!Withdrawal Amount Of:" />
              </div>
              <div className="text-input-container ml2">
                <input
                  className="text-center border"
                  value={this.props.amountToWithdrawal}
                  // onChange={this.handleOnChange}
                />
              </div>
            </div>
            <div className="flex">
              <FormattedMessage
                tagName="div"
                id="influencer.transfer_amount_of"
                defaultMessage="!Transfer Amount Of"
              />
              <div className="ml2">
                <FormattedNumber
                  value={this.props.amountToWithdrawal}
                  style="currency"
                  currency={this.props.balanceDetails.currency}
                />
              </div>
            </div>
            <div className="flex">
              <FormattedMessage tagName="div" id="influencer.to" defaultMessage="!To" />
              <div className="ml2">
                {paymentMethod[0].bank_account_name}
              </div>
            </div>
            <div className="flex">
              <FormattedMessage tagName="div" id="settings.account_no" defaultMessage="!Account No." />
              <div className="ml2">
                {paymentMethod[0].bank_account_id}
              </div>
            </div>
            <div className="flex">
              <FormattedMessage tagName="div" id="settings.branch_no" defaultMessage="!Branch No." />
              <div className="ml2">
                {paymentMethod[0].bank_branch_id}
              </div>
            </div>
            <div className="flex">
              <FormattedMessage tagName="div" id="settings.bank" defaultMessage="!Bank" />
              <div className="ml2">
                <FormattedMessage id="influencer.hapoalim" defaultMessage="!Hapoalim" />
              </div>
            </div>
            <div className="flex">
              <Link
                to={{
                  pathname: `/settings/edit-paymethod/${paymentMethod[0].id}`,
                  state: { prevLocation: this.props.location.pathname }
                }}
                className="mr1"
              >
                <div className="edit-account">
                  <FormattedMessage id="main.edit" defaultMessage="!Edit" />
                </div>
              </Link>
              <div className="edit-account mr1">
                <FormattedMessage id="or" defaultMessage="!or" />
              </div>
              <Link to="/settings/payment">
                <div className="edit-account">
                  <FormattedMessage id="influencer.change_account" defaultMessage="!Change Account" />
                </div>
              </Link>
              <div className="ml2" />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="mt-30">
              <div className="mt-30 flex flex-column items-center">
                <Button
                  style={{
                    background: '#1A936F', width: 180, color: 'white', textTransform: 'uppercase'
                  }}
                  disabledStyle={{ background: '#999999', color: '#434343' }}
                  rounded
                  title={formatMessage({ id: 'main.confirm', defaultMessage: '!Confirm' })}
                />
                <div className="text-center cancel-withdrawal-btn" onClick={this.props.CLOSE_WITHDRAWAL_WINDOW}>
                  <FormattedMessage id="main.cancel" defaultMessage="!Cancel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(injectIntl(connect(
  (state) => {
    const paymentMethodsList = state.influencer.get('payment_methods_list').toJS()
    console.log('paymentMethodsList: ', paymentMethodsList)
    const paymentMethod = paymentMethodsList.filter((x) => x.is_default)
    const summaryDetails = state.influencer.get('summary_data').toJS()
    const balanceDetails = state.influencer.get('balance_data').toJS()
    const loading = state.influencer.get('loading')
    const amountToWithdrawal = state.influencer.get('amountToWithdrawal')

    return {
      balanceDetails,
      summaryDetails,
      paymentMethodsList,
      loading,
      paymentMethod,
      amountToWithdrawal
    }
  },
  { CLOSE_WITHDRAWAL_WINDOW: InfluencerActions.CLOSE_WITHDRAWAL_WINDOW }
)(BankWithdrawalWindow)))
