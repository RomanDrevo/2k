import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Modal from 'react-modal'
import Webcam from 'react-webcam'
import { Button, IconButton } from '../_common'
import '../../styles/modal.css'
import './take-photo-modal.css'

class TakePhotoModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    onTake: PropTypes.func
  }

  state = {}

  onConfirm = () => {
    if (this.props.onTake) this.props.onTake(this.state.capturedImage)
  }

  setRef = (webcam) => {
    this.webcam = webcam
  }

  capture = () => {
    this.setState({ capturedImage: this.webcam.getScreenshot() })
  }

  reset = () => {
    this.setState({ capturedImage: null })
  }

  render() {
    const { isOpen, intl: { formatMessage }, onClose } = this.props

    const { capturedImage } = this.state

    return (
      <Modal
        className="modal-trans"
        isOpen={isOpen}
        onRequestClose={onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
      >
        <div className="modal-container small">
          <div className="modal-content">
            <div className="modal-header dark">
              <div className="title">
                <FormattedMessage id="settings.take_photo" defaultMessage="!Take a Photo" />
              </div>
              <IconButton style={{ width: 'unset', height: 'unset', fontSize: 20 }} icon="close" onClick={onClose} />
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center">
              <div style={{ display: !capturedImage ? 'block' : 'none' }}>
                <div className="camera-view">
                  <Webcam
                    ref={this.setRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    height="100%"
                  />
                  <IconButton
                    style={{ fontSize: 25, position: 'absolute', bottom: 20 }}
                    icon="camera"
                    onClick={this.capture}
                  />
                </div>
              </div>
              {
                capturedImage && (
                  <div className="camera-view">
                    <img src={capturedImage} alt="" />
                    <IconButton
                      style={{ fontSize: 25, position: 'absolute', bottom: 20 }}
                      icon="refresh"
                      onClick={this.reset}
                    />
                  </div>
                )
              }
            </div>
            <div className="modal-footer border-top flex" style={{ background: '#E8F0F2', height: 50 }}>
              <Button
                bsType="cancel"
                title={formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' })}
                onClick={onClose}
              />&nbsp;
              <Button
                title={formatMessage({ id: 'main.confirm', defaultMessage: '!Confirm' })}
                onClick={this.onConfirm}
                disabled={!this.state.capturedImage}
              />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}


export default injectIntl(TakePhotoModal)
