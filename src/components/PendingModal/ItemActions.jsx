import PropTypes from 'prop-types'
import React from 'react'
import { IconButton } from '../_common'

export default class ItemActions extends React.PureComponent {
  static propTypes = {
    record: PropTypes.object.isRequired,
    verificationStatus: PropTypes.object,
    toggleApprove: PropTypes.func.isRequired,
    cancelReject: PropTypes.func.isRequired,
    openRejectPopover: PropTypes.func.isRequired
  }

  handleToggleApprove = () => {
    this.props.toggleApprove(this.props.record.campaign_lead_id)
  }

  handleDisputeClick = (e) => {
    const { record: { campaign_lead_id, verification_status } } = this.props
    const rejected = verification_status === this.props.verificationStatus.Rejected
    if (rejected) {
      this.props.cancelReject(campaign_lead_id)
    } else {
      this.props.openRejectPopover(e, campaign_lead_id)
    }
  }

  render() {
    const { record: { verification_status }, verificationStatus } = this.props

    const approved = verification_status === verificationStatus.Approved
    const rejected = verification_status === verificationStatus.Rejected

    return (
      <div style={{ margin: 'auto', padding: '0 10px' }}>
        {approved ? (
          <div style={{ width: 23, height: 23, display: 'inline-block' }}>&nbsp;</div>
        ) : (
          <IconButton
            icon="close"
            style={{
              background: `${rejected ? '#747474' : '#D68686'}`,
              color: 'white'
            }}
            onClick={this.handleDisputeClick}
          />
        )}
        &nbsp;&nbsp;
        {rejected ? (
          <div style={{ width: 23, height: 23, display: 'inline-block' }}>&nbsp;</div>
        ) : (
          <IconButton
            icon="check"
            style={{
              background: `${approved ? '#747474' : '#57D589'}`,
              color: 'white'
            }}
            onClick={this.handleToggleApprove}
          />
        )}
      </div>
    )
  }
}
