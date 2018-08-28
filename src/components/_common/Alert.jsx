import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import './alert.css'

export default class Alert extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    titleStyle: PropTypes.oneOf([
      PropTypes.object,
      PropTypes.string
    ]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    iconNo: PropTypes.oneOf([
      PropTypes.element,
      PropTypes.string,
      PropTypes.node
    ]),
    buttonNo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    iconYes: PropTypes.oneOf([
      PropTypes.element,
      PropTypes.string,
      PropTypes.node
    ]),
    buttonYes: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onYesClick: PropTypes.func,
    onNoClick: PropTypes.func,
    children: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.element,
      PropTypes.string
    ])
  }
  render() {
    const {
      isOpen, titleStyle, title, children, iconNo,
      buttonNo, iconYes, buttonYes, onYesClick, onNoClick
    } = this.props

    return (
      <Modal
        className="alert alert-container"
        isOpen={isOpen}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick={false}
      >
        <div className="alert-box">
          {!children && <div className="alert-title" style={titleStyle}>{title}</div>}
          {!children &&
            <div className="row" style={{ marginTop: 19 }}>
              <a className="col-sm btn-reject" onClick={onNoClick}>
                {iconNo && <img src={iconNo} alt="no" className="iconNo" />}
                <div>{buttonNo}</div>
              </a>
              <a className="col-sm btn-approve" onClick={onYesClick}>
                {iconYes && <img src={iconYes} alt="yes" className="iconNo" />}
                <div>{buttonYes}</div>
              </a>
            </div>
          }
        </div>
      </Modal>
    )
  }
}
