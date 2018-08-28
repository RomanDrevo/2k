import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, InfoTooltip } from '../../../components/_common'
import ModalHeader from './ModalHeader'

const LoginFaceBook = ({
  onBack, loginWithFaceBook, onLogin, intl: { formatMessage }
}) => (
  <div>
    <ModalHeader onBack={onBack} />
    <div className="create-business-modal create-business-fb-contents">
      <div className="create-business-fb-title-content">
        <FormattedMessage
          id="business.create_your_business"
          defaultMessage="!Create your 2key Bussiness page in less than a minute"
        />
      </div>
      <div className="create-business-fb-bottom-content">
        <FormattedMessage
          id="business.after_login"
          defaultMessage="!After You Login and choose your Facebook Business page. we
            will automatically your 2key page!"
        />
      </div>
    </div>
    <div style={{ flex: 1 }} className="line" />
    <div className="flex-center">
      <Button
        style={{
          backgroundColor: '#2e71cd', marginBottom: 20, display: 'inline-flex', alignItems: 'center'
        }}
        icon="facebook"
        title={formatMessage({ id: 'business.login_with_facebook', defaultMessage: '!Login with Facebook' })}
        onClick={loginWithFaceBook}
      />
    </div>
    <div className="create-business-fb-center-content">
      <FormattedMessage
        id="business.dont_wory"
        defaultMessage="!Don't worry, we won't publich anything on your behalf without your consent"
      />
    </div>
    <div className="buttom_content">
      <a onClick={onLogin}>
        <FormattedMessage
          id="business.dont_have_page"
          defaultMessage="!I don't have a Facebook Business Page"
        />
      </a>
      <InfoTooltip
        style={{ display: 'unset' }}
        content={formatMessage({ id: 'business.create_page', defaultMessage: '!Create Businiss page' })}
      />
    </div>
  </div>
)

LoginFaceBook.propTypes = {
  intl: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  loginWithFaceBook: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default injectIntl(LoginFaceBook)
