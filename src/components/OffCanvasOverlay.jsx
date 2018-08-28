import React, { Component } from 'react'
import PropTypes from 'prop-types'

class OffCanvasOverlay extends Component {
  static propTypes = {
    visible: PropTypes.bool
  }
  state = {
    isOverlayVisible: this.props.visible
  }

  hide = () => this.setState({ isOverlayVisible: false })

  show = () => this.setState({ isOverlayVisible: true })

  render() {
    return (
      <div
        className={`js-overlay ${this.state.isOverlayVisible ? 'visible' : ''}`}
        onClick={this.close}
      />
    )
  }
}

export default OffCanvasOverlay
