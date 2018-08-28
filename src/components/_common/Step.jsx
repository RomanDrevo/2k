import PropTypes from 'prop-types'
import React from 'react'

export default class Step extends React.PureComponent {
  static propTypes = {
    isFirstItem: PropTypes.bool,
    activeItem: PropTypes.bool,
    isLastItem: PropTypes.bool,
    item: PropTypes.object.isRequired,
    active: PropTypes.func.isRequired
  }
  handleStepClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.active(this.props.item.id, true)
  }
  render() {
    const {
      isFirstItem, activeItem, isLastItem, item
    } = this.props
    return (
      <div>
        <div className="step-bar-step-wrapper">
          <div className={`step-bar-step-hyphen${isFirstItem ? ' hidden' : ''}`} />
          <div className={`step-bar-step-circle${activeItem ? ' active' : ''}`} onClick={this.handleStepClick}>
            {item.index + 1}
          </div>
          <div className={`step-bar-step-hyphen${isLastItem ? ' hidden' : ''}`} />
        </div>
        <div className="step-bar-step-title" onClick={this.handleStepClick}>{item.label}</div>
      </div>
    )
  }
}
