import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import IFrame from 'react-iframe'

const HostedSiteView = ({ isOpen, url, onRequestClose }) => (
  <Modal
    className="modal-trans duplicate-modal"
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    closeTimeoutMS={100}
    shouldCloseOnOverlayClick
  >
    <section className="duplicate-flow">
      {url && <IFrame url={url} width="100%" height="100%" allowFullScreen />}
    </section>
  </Modal>
)

HostedSiteView.propTypes = {
  isOpen: PropTypes.bool,
  url: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired
}

export default HostedSiteView
