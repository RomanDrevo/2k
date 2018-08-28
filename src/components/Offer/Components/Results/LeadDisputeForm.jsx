import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, DisplayField, IconButton, TextArea } from '../../../_common'
import { InfluencerActions } from '../../../../_redux'

class LeadDisputeForm extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    lead: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    SEND_INFLUENCER_DISPUTE: PropTypes.func.isRequired
    // responseMessage: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      disputing: false,
      disputeReason: '',
      // sending: false,
      sentStatus: null
    }
  }

  onDispute = () => {
    // this.setState({ sending: true })
    Promise.resolve(this.props.SEND_INFLUENCER_DISPUTE({
      campaign_id: this.props.campaign.id,
      campaign_lead_id: this.props.lead.campaign_lead_id,
      dispute_reason: this.state.disputeReason,
      dispute_contact_number: null // ?
    }))
      .then(() => {
        this.setState({ sentStatus: 'success' })// , sending: false })
      })
      .catch(() => {
        this.setState({ sentStatus: 'failed' })// , sending: false })
      })
  }

  statusPanel = () => {
    const { sentStatus } = this.state

    return (
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        {sentStatus === 'success' && (
          <div>
            <div className="label green middle">
              <FormattedMessage id="campaign_results.thank_you" defaultMessage="!Thank you" />
            </div>
            <div className="label description">
              <FormattedMessage id="campaign_results.notify_soon" defaultMessage="!We will notify you soon" />
            </div>
          </div>
        )}
        {sentStatus === 'failed' && (
          <div>
            <div className="label green middle">
              <FormattedMessage id="campaign_results.sorry" defaultMessage="!Sorry" />
            </div>
            <div className="label description">
              <FormattedMessage id="campaign_results.something_wrong" defaultMessage="!Something wrong" />
            </div>
          </div>
        )}
      </div>
    )
  }

  formPanel = () => {
    const { lead, intl: { formatMessage } } = this.props
    const { disputing, disputeReason } = this.state

    return (
      <div>
        <div className="text-center">
          <DisplayField
            className="font-small dark-black"
            labelStyle={{ fontWeight: 'bold' }}
            label={formatMessage({ id: 'campaign_results.reason', defaultMessage: '!Reason' })}
            value={lead.rejection_text}
          />
        </div>
        <div className="text-center">
          <DisplayField
            className="font-small"
            label={formatMessage({ id: 'campaign_results.updated', defaultMessage: '!Updated' })}
            value={moment(new Date(lead.date)).format('DD/MM/YYYY - HH:mm')}
          />
        </div>
        {!disputing && (
          <div className="flex align-right">
            <Button
              bsType="transparent"
              bsSize="middle"
              title={formatMessage({ id: 'campaign_results.dispute', defaultMessage: '!Dispute' })}
              onClick={() => this.setState({ disputing: true })}
            />
          </div>
        )}
        {disputing && (
          <div>
            <div className="flex align-center">
              <TextArea
                placeholder={formatMessage({
                  id: 'campaign_results.describe_dispute_reason',
                  defaultMessage: '!Please describe dispute reason'
                })}
                style={{ maxWidth: 400 }}
                inputStyle={{ border: '1px solid #BEBEBE' }}
                maxLen={200}
                value={disputeReason}
                onChange={(val) => this.setState({ disputeReason: val })}
              />
            </div>
            <div className="flex align-right">
              <Button
                bsType="transparent"
                bsSize="small"
                title={formatMessage({ id: 'campaign_results.send', defaultMessage: '!Send' })}
                style={{ color: '#1A936F' }}
                onClick={this.onDispute}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { sentStatus } = this.state

    return (
      <div className="lead-dispute-form-container">
        <IconButton
          className="modal-close-btn"
          style={{ color: '#434343' }}
          icon="close"
          onClick={this.props.onClose}
        />
        {!sentStatus && this.formPanel()}
        {sentStatus && this.statusPanel()}
      </div>
    )
  }
}

export default injectIntl(connect(null, {
  SEND_INFLUENCER_DISPUTE: InfluencerActions.SEND_INFLUENCER_DISPUTE
})(LeadDisputeForm))
