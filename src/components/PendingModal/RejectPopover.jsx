import PropTypes from 'prop-types'
import React from 'react'
import { Popover } from '../_common'
import RejectForm from './RejectForm'

const RejectPopover = ({
  clientRect, campaignLeadId, doneReject, closeRejectPopover
}) => (
  (clientRect === undefined || campaignLeadId === undefined) ? null : (
    <Popover
      clientRect={clientRect}
      size={{ width: 216, height: 195 }}
      arrow="right"
      borderColor="#D68686"
      onRequestClose={closeRejectPopover}
    >
      <RejectForm onDone={doneReject} />
    </Popover>
  ))

RejectPopover.propTypes = {
  campaignLeadId: PropTypes.number,
  clientRect: PropTypes.object,
  doneReject: PropTypes.func.isRequired,
  closeRejectPopover: PropTypes.func.isRequired
}

export default RejectPopover
