import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import Alert from './Alert'
import { UtilActions } from '../../_redux'

class LogoutDialogue extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    CLOSE_LOGOUT_DIALOGUE: PropTypes.func.isRequired,
    TOGGLE_MENU: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
  }

  static contextTypes = {
    auth: PropTypes.object.isRequired
  }

  onYesClick = () => {
    this.props.CLOSE_LOGOUT_DIALOGUE()
    this.props.TOGGLE_MENU(false)
    this.props.onLogout()
  }

  render() {
    const { isAuthenticated } = this.context.auth
    return (
      isAuthenticated() &&
        <Alert
          isOpen={this.props.isOpen}
          title={(<FormattedMessage id="general.Log_OutQM" defaultMessage="!Log Out?" />)}
          buttonNo={(<FormattedMessage id="general.cancel" defaultMessage="!Cancel" />)}
          buttonYes={(<FormattedMessage id="general.Log_out" defaultMessage="!Log out" />)}
          onYesClick={this.onYesClick}
          onNoClick={this.props.CLOSE_LOGOUT_DIALOGUE}
        />
    )
  }
}

export default injectIntl(connect(null, {
  ...UtilActions
})(LogoutDialogue))

