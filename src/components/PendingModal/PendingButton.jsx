import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import pendingActions from '../../_redux/pending/actions'
import './pending-button.css'

const PendingButton = ({
  style, onClick, totalPending
}) => (
  <div className="btn-pending-container" onClick={onClick} style={style}>
    <div className="pending-number-wrapper">{totalPending}</div>
    <FormattedMessage tagName="div" id="pendings.new_leads" defaultMessage="!new leads" />
  </div>
)

PendingButton.propTypes = {
  totalPending: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object
}


const connectedComponent = connect((state) => {
  const pendings = state.pending.get('pendings').toJS()
  return {
    totalPending: pendings ? pendings.total_pending : 0
  }
}, {
  FETCH_PENDINGS: pendingActions.FETCH_PENDINGS
})(PendingButton)

export default injectIntl(connectedComponent)
