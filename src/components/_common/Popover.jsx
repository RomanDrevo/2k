import React from 'react'
import PropTypes from 'prop-types'
import ArrowBox from './ArrowBox'
import './popover.css'

export default class Popover extends React.Component {
  static propTypes = {
    clientRect: PropTypes.object.isRequired,
    mobileFullwidth: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    arrow: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    size: PropTypes.object,
    borderWidth: PropTypes.number,
    borderRadius: PropTypes.number,
    borderColor: PropTypes.string,
    arrowOffset: PropTypes.string,
    onRequestClose: PropTypes.func,
    backgroundColor: PropTypes.string,
    children: PropTypes.element
  }
  static defaultProps = {
    arrow: 'top',
    size: {},
    mobileFullwidth: false,
    borderWidth: 2,
    borderRadius: 0,
    borderColor: '#1A936F',
    backgroundColor: 'white'
  }

  onClickOverlay = (e) => {
    if (e.target.id === 'popover-overlay' && this.props.onRequestClose) this.props.onRequestClose()
  }

  calculateContainerPosition() {
    const { clientRect, arrow } = this.props
    const width = this.props.size.width || 0
    const height = this.props.size.height || 0
    const offsetX = this.props.offsetX || 0
    const offsetY = this.props.offsetY || 0

    if (!clientRect) return null
    let obj = {}

    if (arrow === 'top') {
      obj = {
        left: (clientRect.x - ((width - clientRect.width) / 2)) + offsetX,
        top: (clientRect.y + clientRect.height) + (2 + offsetY)
      }
    } else if (arrow === 'bottom') {
      obj = {
        left: (clientRect.x - ((width - clientRect.width) / 2)) + offsetX,
        top: (clientRect.y - height) - (2 + offsetY)
      }
    } else if (arrow === 'left') {
      obj = {
        left: (clientRect.x - width) - (13 + offsetX),
        top: (clientRect.y - ((height - clientRect.height) / 2)) +
            ((clientRect.height / 2) + offsetY)
      }
    } else if (arrow === 'right') {
      obj = {
        left: (clientRect.x - width) - (13 + offsetX),
        top: clientRect.y - (((height - clientRect.height) / 2) + offsetY)
      }
    }

    if (this.props.mobileFullwidth && window.matchMedia('(max-width: 992px)') && arrow !== 'left') {
      obj.left = 0
    }
    return obj
  }

  render() {
    const { size } = this.props

    const containerStyle = { position: 'absolute' }
    if (size.width > 0) containerStyle.width = size.width
    if (size.height > 0) containerStyle.height = size.height

    const containerPosition = this.calculateContainerPosition()

    if (containerPosition) {
      containerStyle.left = containerPosition.left
      containerStyle.top = containerPosition.top
    }


    if (this.props.mobileFullwidth && window.matchMedia('(max-width: 992px)')) {
      containerStyle.width = '100%'
    }

    return (
      <div id="popover-overlay" className="overlay" onClick={this.onClickOverlay}>
        <ArrowBox {...this.props} style={containerStyle}>
          {this.props.children}
        </ArrowBox>
      </div>
    )
  }
}
