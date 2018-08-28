import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggle'
import InfoTooltip from './InfoTooltip'
import './left-right-switch.css'

export default class LeftRightSwitch extends React.Component {
  static propTypes = {
    leftTitle: PropTypes.string.isRequired,
    rightTitle: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string,
    tooltip: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    value: 'left'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillMount() {
    const hash = `${this.props.leftTitle || ''}${this.props.tooltip || ''}`.hashCode()
    this.tooltipId = btoa(`${hash * Math.random()}${Date.now()}`)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.state.value) {
      this.setState({ value: newProps.value })
    }
  }

  onChange = (value) => {
    this.setState({ value }, () => {
      if (this.props.onChange) {
        this.props.onChange(value)
      }
    })
  }

  toggleLeft = () => {
    this.onChange('left')
  }

  toggleRight = () => {
    this.onChange('right')
  }

  toggleCheck = (e) => {
    this.onChange(e.target.checked ? 'right' : 'left')
  }

  render() {
    const {
      leftTitle, rightTitle, tooltip, style
    } = this.props
    const { value } = this.state
    return (
      <div className="left-right-switch-container vCenter" style={style}>
        <div
          className={`left-right-switch-title ${value === 'left' ? 'active' : 'inactive'}`}
          onClick={this.toggleLeft}
        >
          {leftTitle}
        </div>
        <div className="left-right-switch-toggle">
          <Toggle
            icons={false}
            checked={value === 'right'}
            onChange={this.toggleCheck}
          />
        </div>
        <div
          className={`left-right-switch-title ${value === 'right' ? 'active' : 'inactive'}`}
          onClick={this.toggleRight}
        >
          {rightTitle}
        </div>
        {tooltip && (<InfoTooltip id={this.tooltipId} content={tooltip} />)}
      </div>
    )
  }
}
