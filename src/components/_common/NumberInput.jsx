import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedNumber } from 'react-intl'
import InfoTooltip from './InfoTooltip'
import './number-input.css'

class NumberInput extends React.Component {
  static propTypes = {
    inline: PropTypes.bool, // label and input layout, if `inline` true should be placed on one line
    tIndex: PropTypes.number, // label and input layout, if `inline` true should be placed on one line
    sign: PropTypes.string,
    error: PropTypes.string,
    label: PropTypes.string,
    meta: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
    onChange: PropTypes.func
  };

  static defaultProps = {
    min: 0
  };

  state = {
    editing: false,
    value: this.props.value || 0
  }

  componentWillMount() {
    const hash = `${this.props.label || ''}${this.props.tooltip || ''}`.hashCode()
    this.tooltipId = btoa(`${hash * Math.random()}${Date.now()}`)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({ value: newProps.value })
    }
  }

  onChangeInput = (e) => {
    let value = parseFloat(e.target.value)

    let { max, min } = this.props
    max = parseFloat(max)
    min = parseFloat(min)

    if (min && value < min) value = min
    if (max && value > max) value = max

    this.setState({ value }, () => {
      if (this.props.onChange) this.props.onChange(parseFloat(value))
    })
  }

  onClick = () => {
    this.setState({ editing: true }, () => {
      this.input.focus()
    })
  }

  onBlur = () => {
    this.setState({ editing: false })
  }

  increaseValue = (e) => {
    e.preventDefault()
    let { value } = this.state
    const { min, max } = this.props
    value = parseFloat(value) || (min && min - 1) || 0
    if (max && parseFloat(max) <= value) return

    value += 1

    this.setState({ value }, () => {
      if (this.props.onChange) this.props.onChange(value)
    })
  }

  decreaseValue = (e) => {
    e.preventDefault()
    let { value } = this.state
    value = parseFloat(value) || 0
    if (this.props.min && value <= parseFloat(this.props.min)) {
      return
    }
    value -= 1
    this.setState({ value }, () => {
      if (this.props.onChange) this.props.onChange(value)
    })
  }

  refInput = (e) => {
    this.input = e
  }

  render() {
    const {
      label, inline, tooltip, meta, tIndex
    } = this.props
    const error = this.props.error || (meta && meta.touched ? meta.error : null)
    const { editing, value } = this.state

    return (
      <div
        className={`number-input-container${inline ? ' inline' : ''}`}
        style={{ display: inline ? 'flex' : 'block' }}
      >
        <div className="flex vCenter">
          {label && <div className="field-label">{label}</div>}
          {tooltip && <InfoTooltip id={this.tooltipId} content={tooltip} />}
        </div>
        <div className="flex-1">
          <div className="flex">
            <div className={`number-input-value-wrapper${editing ? ' focused' : ''}`}>
              <input
                ref={this.refInput}
                style={{ display: editing ? 'block' : 'none' }}
                type="number"
                value={value || ''}
                onBlur={this.onBlur}
                onChange={this.onChangeInput}
                tabIndex={tIndex}
              />
              <div
                style={{ display: !editing ? 'block' : 'none' }}
                className="number-input-value"
                onClick={this.onClick}
              >
                <FormattedNumber value={value} />{this.props.sign || ''}
              </div>
            </div>
            <div className="number-input-control-wrapper">
              <button className="number-input-control" onClick={this.increaseValue}>
                <i className="fa fa-plus" />
              </button>
              <button className="number-input-control" onClick={this.decreaseValue}>
                <i className="fa fa-minus" />
              </button>
            </div>
          </div>
          {error && <div className="msg small error">{error}</div>}
        </div>
      </div>
    )
  }
}

export default injectIntl(NumberInput)
