import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

class Header extends Component {
  // static propTypes = {
  //
  // }

  state={}

  render() {
    return (
      <div className="row flex flex-column">
        <div className="earning flex justify-between">
          <div className="earning-items">
            <div className="earning-item-content">
                456
            </div>
            <div className="earning-item-title">
              <FormattedMessage
                id="influencer.total_earnings"
                defaultMessage="!Total Earnings"
                values={{ total: '' }}
              />
            </div>
          </div>
          <div className="earning-items">
            <div className="earning-item-content">
                457457
            </div>
            <div className="earning-item-title">
              <FormattedMessage id="influencer.paid" defaultMessage="!Paid" />
            </div>
          </div>
          <div className="earning-items">
            <div className="earning-item-content">
                474574
            </div>
            <div className="earning-item-title">
              <FormattedMessage id="influencer.pending" defaultMessage="!Pending" />
            </div>
          </div>
          <div className="earning-items">
            <div className="earning-item-content">
                457457
            </div>
            <div className="earning-item-title">
              <FormattedMessage id="influencer.balance" defaultMessage="!Balance" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
