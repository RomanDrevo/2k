/* eslint-disable indent */
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from '../../../components/_common'
import ModalHeader from './ModalHeader'

const NoPages = ({
  onBack, createManual, onCancel, intl: { formatMessage }
}) => (
  <div>
    <ModalHeader onBack={onBack} />
    <div className="create-business-modal create-business-fb-contents meta">
      <div className="create-business-fb-title-content">
        <FormattedMessage id="business.no_pages" defaultMessage="!No New Fb Pages To Import" />
      </div>
    </div>
    <div style={{ flex: 1 }} className="line" />
    <div className="create-business-fb-center-content">
      <FormattedMessage id="business.create_manual" defaultMessage="!Create Page Manually?" />
    </div>
    <div className="flex-center">
      <Button
        title={formatMessage({ id: 'main.yes', defaultMessage: '!Yes' })}
        onClick={createManual}
        style={{
          width: 100,
          margin: '0 10px'
        }}
      />
      <Button
        title={formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' })}
        onClick={onCancel}
        style={{
          width: 100,
          margin: '0 10px',
          background: '#95989a'
        }}
      />
    </div>
  </div>
  )

NoPages.propTypes = {
  intl: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  createManual: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default injectIntl(NoPages)
