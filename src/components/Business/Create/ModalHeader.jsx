import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const ModalHeader = ({ onBack }) => (
  <div className="create-business-modal create-business-fb-header">
    {onBack && (
      <button className="left" onClick={onBack}>
        <FormattedMessage id="main.back" defaultMessage="!Back" />
      </button>
    )}
    <a className="right" style={{ color: '#1a936f' }} onClick={onBack}>
      <FormattedMessage id="main.help" defaultMessage="!Help" />
    </a>
  </div>
)
ModalHeader.propTypes = {
  onBack: PropTypes.func
}

export default injectIntl(ModalHeader)
