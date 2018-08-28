import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from '../../../components/_common'
import ModalHeader from './ModalHeader'

const CheckEmail = ({
  onBack, email, onChange, confirmEmail, intl: { formatMessage }
}) => (
  <div>
    <ModalHeader onBack={onBack} />
    <div className="create-business-modal create-business-fb-contents">
      <div className="create-business-fb-title-content">
        <FormattedMessage id="business.your_email" defaultMessage="!Is this your email?" />
      </div>
      <div className="create-business-fb-bottom-content">
        <FormattedMessage id="business.confirm_email" defaultMessage="!Make sure this is your corrent email," />
      </div>
      <div className="create-business-fb-bottom-content">
        <FormattedMessage id="business.miss_customers" defaultMessage="!We don't want you to miss new customers!" />
      </div>
    </div>
    <div style={{ flex: 1 }} className="line" />
    <div className="check-email">
      <div className="form-group flex-center">
        <input
          type="email"
          name="email"
          className="form-control email-input"
          style={{ height: 50, width: 255 }}
          value={email}
          onChange={onChange}
          placeholder={formatMessage({ id: 'business.enter_email', defaultMessage: '!Enter your Email' })}
        />
      </div>
      <div className="form-group flex-center">
        <Button
          className="input-button"
          title={formatMessage({ id: 'business.continue', defaultMessage: '!CONTINUE' })}
          style={{
            paddingLeft: 72, paddingRight: 72, height: 50, width: 255
          }}
          onClick={confirmEmail}
        />
      </div>
    </div>
    <div style={{ flex: 1 }} className="line" />
    <div className="email-bottom-text">
      <FormattedMessage
        id="business.never_disclose"
        defaultMessage="!We will never disclose your email with any 3rd party"
      />
    </div>
  </div>
)

CheckEmail.propTypes = {
  email: PropTypes.string,
  intl: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  confirmEmail: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(CheckEmail)
