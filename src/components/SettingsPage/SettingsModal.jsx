import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import Modal from 'react-modal'
import { SettingsActions } from '../../_redux'
import { loadHistory } from '../../_core/utils'
import { IconButton } from '../_common'
import Menu from './Menu'
import { ProfileSettings, PaymentOptions, NotificationSettings } from '.'
import '../../styles/modal.css'

class SettingsModal extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    isOpen: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    OPEN_SETTINGS_MODAL: PropTypes.func.isRequired
  }

  state = {
    selected: null,
    backupRoute: this.props.location.pathname.includes('settings') ? loadHistory() : this.props.location.pathname
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname
      && !nextProps.location.pathname.includes('settings')) {
      this.setState({ backupRoute: nextProps.location.pathname })
    }
  }

  onClose = () => {
    const { selected } = this.state
    if (selected) {
      this.setState({ selected: null })
    } else {
      this.props.history.push(this.state.backupRoute)
      this.props.OPEN_SETTINGS_MODAL(false)
    }
  }

  onLinkClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ selected: e.target.getAttribute('href') })
  }

  renderTitle(selected) {
    const { intl: { formatMessage } } = this.props
    if (!selected) {
      return formatMessage({ id: 'settings', defaultMessage: '!Settings' })
    }
    if (selected.includes('profile')) {
      return formatMessage({ id: 'settings.profile', defaultMessage: '!Profile Settings' })
    } else if (selected.includes('payment')) {
      return formatMessage({ id: 'settings.payment_options', defaultMessage: '!Payment Options' })
    } else if (selected.includes('notification')) {
      return formatMessage({ id: 'settings.notification_settings', defaultMessage: '!Notification Settings' })
    }
    return ''
  }

  renderContent(selected) {
    const { isMobile } = this.props
    if (selected.includes('profile')) return <ProfileSettings hideTitle={isMobile} />
    else if (selected.includes('payment')) return <PaymentOptions hideTitle={isMobile} />
    else if (selected.includes('notification')) return <NotificationSettings hideTitle={isMobile} />
    return null
  }

  render() {
    const { selected } = this.state
    return (
      <Modal
        className="modal-trans"
        isOpen={this.props.isOpen}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
      >
        <div className="modal-container large" >
          <div className="modal-content" style={{ height: '100vh', background: 'white' }}>
            <div className="modal-header black" style={{ height: 50 }}>
              <div><IconButton style={{ color: 'white', fontSize: 13 }} icon="close" onClick={this.onClose} /></div>
              <div className="title" style={{ textAlign: 'left', fontSize: 15 }}>{this.renderTitle(selected)}</div>
            </div>
            <div className="modal-body mobile">
              {!selected && <Menu isMobile onLinkClick={this.onLinkClick} />}
              {selected && this.renderContent(selected)}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default withRouter(injectIntl(connect((state) => ({
  isOpen: state.settings.get('isOpenSettingsModal')
}), {
  OPEN_SETTINGS_MODAL: SettingsActions.OPEN_SETTINGS_MODAL
})(SettingsModal)))
