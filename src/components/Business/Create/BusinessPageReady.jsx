import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import readyPhone from '../../../icons/ready_phone.png'

const BusinessPageReady = () => (
  <div className="waiting-page">
    <div className="flex-center" style={{ flex: 1, height: 268, backgroundColor: '#88d498' }}>
      <img src={readyPhone} alt="" />
    </div>
    <div className="flex-center waiting-page-text" style={{ flex: 0.8, height: 209, backgroundColor: '#ffffff' }}>
      <FormattedMessage id="business.your" defaultMessage="!Your" />&nbsp;
      <div style={{ color: '#88d498' }}>
        <FormattedMessage id="business.business_page" defaultMessage="!2key" />
      </div>&nbsp;
      <FormattedMessage id="business.page_ready" defaultMessage="!Business Page is Ready!" />
    </div>
  </div>
)

export default injectIntl(BusinessPageReady)
