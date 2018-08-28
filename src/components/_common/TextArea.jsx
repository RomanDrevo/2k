import React from 'react'
import PropTypes from 'prop-types'
import InfoTooltip from './InfoTooltip'
import './text-area.css'

export default class TextArea extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    inline: PropTypes.bool, // label and input layout, if `inline` true should be placed on one line
    maxLength: PropTypes.number,
    tIndex: PropTypes.number,
    rows: PropTypes.number,
    maxLen: PropTypes.number,
    label: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
    action: PropTypes.element,
    input: PropTypes.object,
    meta: PropTypes.object,
    style: PropTypes.object,
    inputStyle: PropTypes.object,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      currentLen: 0
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value) this.setState({ currentLen: newProps.value.length })
  }

  onChange = (e) => {
    const val = e.target.value
    if (this.props.maxLen) {
      if (val.length > this.props.maxLen) return

      this.setState({ currentLen: val.length })
    }
    if (this.props.onChange) {
      this.props.onChange(val)
    }
  }

  render() {
    const {
      label, placeholder, inline, tooltip, disabled, action,
      rows, input, meta, inputStyle, style, maxLen, value,
      className = '', maxLength, tIndex
    } = this.props
    const error = this.props.error || (meta && meta.touched ? meta.error : null)

    return (
      <div
        className={`text-area-container ${className}`}
        style={Object.assign({ display: inline ? 'flex' : 'block' }, { ...style })}
      >
        <div className="flex vCenter">
          {label && <div className="field-label">{label}</div>}
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        <div className="flex-1">
          <div className="field-input" style={{ position: 'relative' }}>
            <textarea
              style={inputStyle}
              rows={rows || 3}
              disabled={disabled}
              placeholder={placeholder}
              value={value || ''}
              onChange={this.onChange}
              {...input}
              maxLength={maxLength}
              tabIndex={tIndex}
            />
            <div className="text-area-corner">
              {action && <div>{action}</div>}
              {maxLen && <div className="text-area-len">&nbsp;{this.state.currentLen}/{maxLen}</div>}
            </div>
          </div>
          {error && <div className="msg small error">{error}</div>}
        </div>
      </div>
    )
  }
}
