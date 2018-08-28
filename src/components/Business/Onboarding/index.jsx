import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import Mobile from './Mobile'
import Desktop from './Desktop'
import { IconButton, Button } from '../../_common'
import './styles.css'

const steps = {
  join: 0,
  share: 1,
  reward: 2
}

class Onboarding extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    isMobile: PropTypes.bool,
    step: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }
  state = {
    index: steps[this.props.step] || 0
  }
  onClose = () => {
    this.props.onRequestClose()
  }
  onSlideChange = (currentIndex, newIndex) => {
    const index = newIndex !== undefined ? newIndex : currentIndex
    if (this.state.index !== index) {
      this.setState({ index })
    }
  }
  onCreateClick = () => {
    this.props.push('/signup')
  }
  render() {
    const { isOpen, isMobile, intl: { formatMessage } } = this.props
    const { index } = this.state
    return (
      <Modal
        className={`modal-trans onBoarding${isMobile ? ' mobile' : ''}`}
        isOpen={isOpen}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
        overlayClassName={`flex onBoarding-overlay${isMobile ? ' mobile' : ''}`}
      >
        <div className="closeContainer">
          <IconButton style={{ width: 'unset', height: 'unset', fontSize: 20 }} icon="close" onClick={this.onClose} />
        </div>
        {isMobile ? (
          <section>
            <Mobile onChange={this.onSlideChange} index={index} />
            <div className="footerContainer">
              {index === 2 && (
                <Button
                  title={formatMessage({ id: 'business.create_account', defaultMessage: '!Create Account' })}
                  onClick={this.onCreateClick}
                />
              )}
              <p>
                <FormattedMessage id="business.have_account" defaultMessage="!Already have an account?" />&nbsp;
                <Link to="/login">
                  <FormattedMessage id="menu.login" defaultMessage="!Login" />&nbsp;
                </Link>
              </p>
            </div>
          </section>
        ) : (
          <Desktop />
        )}
      </Modal>
    )
  }
}

export default injectIntl(Onboarding)
