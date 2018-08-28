import Modal from 'react-modal'
import PropTypes from 'prop-types'
import React from 'react'

const CreateModal = ({ isOpen, handleClose, children }) => (
  <Modal
    className="create-business-modal create-business-fb-container"
    isOpen={isOpen}
    onRequestClose={handleClose}
    closeTimeoutMS={100}
    shouldCloseOnOverlayClick
  >
    <div className="create-business-fb-box">
      {children}
    </div>
  </Modal>
)

CreateModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
}

export default CreateModal
