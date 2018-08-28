import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, Radio, IconButton } from '../_common'
import './lead-status-form.css'

export const REJECT_TYPES = {
  neverAnswerd: 'NO_RESPONSE',
  doesNotExist: 'FAKE',
  other: 'OTHER'
}

class LeadStatusForm extends React.Component {
    static propTypes = {
      intl: PropTypes.object.isRequired,
      campaignLead: PropTypes.object.isRequired,
      onClose: PropTypes.func.isRequired,
      onReject: PropTypes.func.isRequired,
      onApprove: PropTypes.func.isRequired,
      responseMessage: PropTypes.string
    }

    constructor(props) {
      super(props)
      const { campaignLead } = props
      this.state = {
        rejection_type: campaignLead.rejection_type,
        rejection_text: campaignLead.rejection_text
      }
    }

    onClickApprove = () => {
      if (this.props.onApprove) {
        this.props.onApprove(this.props.campaignLead.campaign_lead_id)
      }
    }

    onClickReject = () => {
      const { rejection_type, rejection_text } = this.state
      const { campaign_lead_id } = this.props.campaignLead
      if (this.props.onReject) {
        this.props.onReject({ campaign_lead_id, rejection_type, rejection_text })
      }
    }

    onChangeRejectionText = (e) => {
      this.setState({ rejection_text: e.target.value })
    }

    onNeverAnswerd = () => {
      this.setState({ rejection_type: REJECT_TYPES.neverAnswerd })
    }

    onNotExist = () => {
      this.setState({ rejection_type: REJECT_TYPES.doesNotExist })
    }

    onOther = () => {
      this.setState({ rejection_type: REJECT_TYPES.other })
    }

    selectRejectionType = (type) => {
      this.setState({ rejection_type: type })
    }

    render() {
      const { rejection_type, rejection_text } = this.state
      const { responseMessage, intl: { formatMessage } } = this.props

      if (responseMessage) {
        return (
          <div className="lead-status-form-container">
            <IconButton
              className="btn-close"
              icon="close"
              onClick={this.props.onClose}
              style={{ color: '#434343' }}
            />
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <FormattedMessage tagName="div" id="campaign_results.thank_you" defaultMessage="!Thank you" />
              <div>{responseMessage}</div>
            </div>
          </div>
        )
      }

      return (
        <div className="lead-status-form-container">
          <IconButton className="btn-close" icon="close" onClick={this.props.onClose} style={{ color: '#434343' }} />
          <div className="field-label">
            <FormattedMessage id="campaign_results.change_status" defaultMessage="!Change Status" />
          </div>
          <div className="d-flex justify-content-center">
            <Button bsSize="small" onClick={this.onClickApprove}>
              <FormattedMessage id="campaign_results.approve_lead" defaultMessage="!Approve This Lead" />
            </Button>
          </div>
          <div className="field-label-small">
            <FormattedMessage id="campaign_results.reject" defaultMessage="!Reject" />:
          </div>
          <Radio
            id="radio-reject-type-never-answerd"
            title={formatMessage({ id: 'campaign_results.never_answerd', defaultMessage: '!Never Answerd' })}
            checked={rejection_type === REJECT_TYPES.neverAnswerd}
            onClick={this.onNeverAnswerd}
          />
          <Radio
            id="radio-reject-type-does-not-exist"
            title={formatMessage({ id: 'campaign_results.doesnt_exist', defaultMessage: '!Does not Exist' })}
            checked={rejection_type === REJECT_TYPES.doesNotExist}
            onClick={this.onNotExist}
          />
          <Radio
            id="radio-reject-type-other"
            title={formatMessage({ id: 'campaign_results.other', defaultMessage: '!Other' })}
            checked={rejection_type === REJECT_TYPES.other}
            onClick={this.onOther}
          />
          <textarea
            disabled={rejection_type !== REJECT_TYPES.other}
            value={rejection_text}
            onChange={this.onChangeRejectionText}
          />
          <div className="d-flex justify-content-center">
            <Button bsType="cancel" bsSize="small" onClick={this.onClickReject}>
              <FormattedMessage id="campaign_results.done" defaultMessage="!DONE" />
            </Button>
          </div>
        </div>
      )
    }
}

export default injectIntl(LeadStatusForm)
