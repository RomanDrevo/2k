import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { IconButton, Panel } from '../_common'

const NotificationSettings = () => {
  const titleEl = (
    <div className="d-flex">
      <div className="d-block d-sm-none"><IconButton icon="close" /></div>
      <div className="col-sm-auto">
        <FormattedMessage id="settings.notification_settings" defaultMessage="!Notification Settings" />
      </div>
    </div>
  )
  return (
    <Panel className="black small" title={titleEl} style={{ padding: 0 }}>
      Here is NotificationSettings Panel
    </Panel>
  )
}

export default injectIntl(NotificationSettings)
