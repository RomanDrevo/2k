import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from '../../../components/_common'
import ModalHeader from './ModalHeader'

const BusinessMeta = ({
  onBack, name, handle, onChange, createBusiness, intl: { formatMessage }
}) => (
  <div>
    <ModalHeader onBack={onBack} />
    <div className="create-business-modal create-business-fb-contents meta">
      <div className="create-business-fb-title-content">
        <FormattedMessage id="business.choose_name" defaultMessage="!Please choose your business name" />
      </div>
    </div>
    <div style={{ flex: 1 }} className="line" />
    <div className="check-email meta">
      <div className="form-group flex-center">
        <label htmlFor="businessName">
          <FormattedMessage id="business.new_business_name" defaultMessage="!Business name" />
          <input
            id="businessName"
            name="name"
            className="form-control email-input"
            style={{ height: 50, width: 255 }}
            value={name || ''}
            onChange={onChange}
            placeholder={formatMessage({
              id: 'business.new_business_placeholder', defaultMessage: '!Enter your business name'
            })}
          />
        </label>
      </div>
      <div className="form-group flex-center">
        <label htmlFor="businesshandle">
          <FormattedMessage id="business.handle" defaultMessage="!Business handle" />
          <input
            id="businesshandle"
            name="handle"
            className="form-control email-input"
            style={{ height: 50, width: 255 }}
            value={handle || ''}
            onChange={onChange}
            placeholder={formatMessage({
              id: 'business.handle_placeholder', defaultMessage: '!Enter your business handle'
            })}
          />
        </label>
      </div>
      <div className="form-group flex-center">
        <Button
          className="input-button"
          title={formatMessage({
            id: 'business.continue', defaultMessage: '!CONTINUE'
          })}
          style={{
            paddingLeft: 72, paddingRight: 72, height: 50, width: 255
          }}
          onClick={createBusiness}
        />
      </div>
    </div>
  </div>
)

BusinessMeta.propTypes = {
  // noPages: PropTypes.bool,
  name: PropTypes.string,
  handle: PropTypes.string,
  intl: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  createBusiness: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(BusinessMeta)
