import React from 'react'
import PropTypes from 'prop-types'
import { hashCode } from '../../_core/utils'
import InfoTooltip from './InfoTooltip'
import './text-input.css'

export default class TextInput extends React.Component {
  static propTypes = {
    inline: PropTypes.bool, // label and input layout, if `inline` true should be placed on one line
    border: PropTypes.bool,
    disabled: PropTypes.bool,
    errorInside: PropTypes.bool,
    focusAfterRender: PropTypes.bool,
    maxLength: PropTypes.number,
    tIndex: PropTypes.number,
    type: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    meta: PropTypes.object,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
    action: PropTypes.node,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func
  };

  static defaultProps = {
    focusAfterRender: false
  };


  constructor(props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentWillMount() {
    const hash = hashCode(`${this.props.label || ''}${this.props.tooltip || ''}`)
    // .hashCode()
    this.tooltipId = btoa(`${hash * Math.random()}${Date.now()}`)
  }

  componentDidMount() {
    if (this.props.focusAfterRender) {
      this.Input.focus()
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({ value: newProps.value })
    }
  }

  onKeyDownInput = (e) => {
    if (e.key === 'Enter') {
      // this.refs.input.blur()
      this.onBlurInput()
    }
  }

  onBlurInput = () => {
    const { onSubmit } = this.props
    const { value } = this.state
    this.setState({ focused: false })
    if (onSubmit && typeof onSubmit === 'function' && value && value.length > 0) onSubmit(value)
  };

  onChangeInput = (e) => {
    this.setState({ value: e.target.value })
    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }
  }

  onFocusInput = (e) => {
    this.setState({ focused: true })
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  reset = () => {
    this.setState({ value: '' }, () => {
      this.Input.focus()
    })
  }

  focus = () => {
    this.Input.focus()
  }

  value = () => this.Input.value

  refInput = (e) => {
    this.Input = e
  }

  render() {
    const {
      label, placeholder, inline, tooltip, disabled,
      action, meta, border, errorInside, type, maxLength, tIndex
    } = this.props
    const error = this.props.error || (meta && meta.touched ? meta.error : null)
    const wrapperClass = `input-wrapper
      ${border ? ' border' : ''}
      ${error && errorInside ? ' error-inside' : ''}
      ${action ? ' action-exist' : ''}
      ${disabled ? ' disabled' : ''}
      ${this.state.focused ? ' focused' : ''}`
    return (
      <div
        className={`text-input-container${inline ? ' inline' : ''}`}
        style={{ display: inline ? 'flex' : 'block' }}
      >
        <div className="flex vCenter">
          {label && <div className="field-label">{label}</div>}
          {tooltip && <InfoTooltip id={this.tooltipId} content={tooltip} />}
        </div>
        <div className="flex-1">
          <div className="field-input">
            <div className={wrapperClass}>
              <input
                ref={this.refInput}
                type={type || 'text'}
                disabled={disabled}
                placeholder={placeholder}
                value={this.state.value}
                maxLength={maxLength}
                onKeyDown={this.onKeyDownInput}
                onBlur={this.onBlurInput}
                onChange={this.onChangeInput}
                onFocus={this.onFocusInput}
                tabIndex={tIndex}
              />
              {action && <div className="text-input-action">{action}</div>}
            </div>
          </div>
          {error && <div className="msg small error">{error}</div>}
        </div>
      </div>
    )
  }
}
