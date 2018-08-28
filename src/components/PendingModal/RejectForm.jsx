import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, Radio } from '../_common'
import './reject-form.css'

export const REJECT_TYPES = {
  neverAnswerd: 'NO_RESPONSE',
  doesNotExist: 'FAKE',
  other: 'OTHER'
}

class RejectForm extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    onDone: PropTypes.func
  }

  state = {
    rejectType: REJECT_TYPES.neverAnswerd,
    rejectReasonOther: ''
  }

  onClickDone = () => {
    const { rejectType, rejectReasonOther } = this.state
    if (rejectType === REJECT_TYPES.other && rejectReasonOther.trim() === '') {
      // TODO: No Rejection reason, should add error state.
      return
    }
    if (this.props.onDone) this.props.onDone(rejectType, rejectReasonOther)
  }

  selectRejectType = (type) => {
    this.setState({ rejectType: type })
  }

  render() {
    const { intl: { formatMessage } } = this.props
    const { rejectType } = this.state
    return (
      <div className="reject-form-container">
        <div className="field-label">
          <FormattedMessage id="pendings.reason" defaultMessage="!Reason" />
        </div>
        <Radio
          id="radio-reject-type-never-answerd"
          title={formatMessage({ id: 'pendings.never_answerd', defaultMessage: '!Never Answerd' })}
          checked={rejectType === REJECT_TYPES.neverAnswerd}
          onClick={() => this.selectRejectType(REJECT_TYPES.neverAnswerd)}
        />
        <Radio
          id="radio-reject-type-does-not-exist"
          title={formatMessage({ id: 'pendings.does_not_exist', defaultMessage: '!Does not Exist' })}
          checked={rejectType === REJECT_TYPES.doesNotExist}
          onClick={() => this.selectRejectType(REJECT_TYPES.doesNotExist)}
        />
        <Radio
          id="radio-reject-type-other"
          title={formatMessage({ id: 'pendings.other', defaultMessage: '!Other' })}
          checked={rejectType === REJECT_TYPES.other}
          onClick={() => this.selectRejectType(REJECT_TYPES.other)}
        />
        <textarea
          disabled={rejectType !== REJECT_TYPES.other}
          onChange={(e) => this.setState({ rejectReasonOther: e.target.value })}
        />
        <div className="footer">
          <Button bsSize="small" onClick={this.onClickDone} style={{ textTransform: 'uppercase' }}>
            <FormattedMessage id="pendings.done" defaultMessage="!done" />
          </Button>
        </div>
      </div>
    )
  }
}
export default injectIntl(RejectForm)
