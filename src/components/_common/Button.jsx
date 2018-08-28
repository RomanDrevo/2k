import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import InfoTooltip from './InfoTooltip'
import './button.css'

export default class Button extends React.Component {
  static propTypes = {
    bsSize: PropTypes.oneOf(['small', 'large', 'middle']),
    className: PropTypes.string,
    bsType: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
    type: PropTypes.string,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    disabledStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    loading: PropTypes.bool,
    id: PropTypes.string
  };

  componentWillMount() {
    const hash = `${this.props.title || ''}${this.props.tooltip || ''}`.hashCode()
    this.tooltipId = btoa(`${hash * Math.random()}${Date.now()}`)
  }

  onClick = (e) => {
    if (this.props.type !== 'submit') {
      e.preventDefault()
    }
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  onMouseDown = (e) => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(e)
    }
  }

  render() {
    const {
      bsType, disabled, bsSize, title, icon, children, tooltip, type, id,
      wrapperStyle, rounded, disabledStyle, loading, className = ''
    } = this.props
    let { style } = this.props
    const classNames = classnames('btn', {
      default: !bsType || bsType === 'default',
      cancel: bsType === 'cancel',
      select: bsType === 'select',
      transparent: bsType === 'transparent',
      disabled,
      small: bsSize === 'small',
      large: bsSize === 'large',
      middle: bsSize === 'middle',
      rounded,
      loading
    })
    if (disabled && disabledStyle) {
      style = { ...style, ...disabledStyle }
    }

    return (
      <div className={`flex ${className}`} style={wrapperStyle}>
        <button
          id={id}
          type={type}
          className={classNames}
          style={style}
          disabled={disabled}
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
        >
          {children && children}
          {!children && icon && <i className={`fa fa-${icon}`} style={{ margin: 5 }} />}
          {!children && !loading && title && `${title}`}
        </button>
        {tooltip && <InfoTooltip id={this.tooltipId} content={tooltip} />}
      </div>
    )
  }
}
