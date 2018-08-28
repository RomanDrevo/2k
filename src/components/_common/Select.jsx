import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import InfoTooltip from './InfoTooltip'
import SelectItem from './SelectItem'
import './select.css'

export default class Select extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.element,
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    items: PropTypes.array,
    onSelect: PropTypes.func,
    style: PropTypes.object,
    tooltip: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    rounded: PropTypes.bool,
    noShadow: PropTypes.bool,
    white: PropTypes.bool // white background
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpenDropdown: false,
      value: props.value || (props.multiple ? [] : '')
    }
  }

  componentWillMount() {
    const hash = `${this.props.tooltip || ''}`.hashCode()
    this.tooltipId = btoa(`${hash * Math.random()}${Date.now()}`)
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(newProps.value, this.state.value)) {
      this.setState({ value: newProps.value })
    }
  }

  getSelection = () => {
    const { items, multiple } = this.props
    const { value } = this.state
    if (multiple) {
      return [...items].filter((item) => (value.indexOf(item.value) > -1))
    }
    return items.find((item) => (item.value === value))
  }

  getSelectionLabel = () => {
    const selection = this.getSelection()
    if (!selection || selection.length === 0) {
      return this.props.placeholder ? this.props.placeholder : 'Select...'
    }
    if (this.props.multiple) {
      return selection.map((item) => item.label).join(',')
    }
    return selection.label
  }

  closeDropdown = () => {
    this.setState({ isOpenDropdown: false })
  }

  toggleDropdown = () => {
    if (this.props.disabled) return
    const { isOpenDropdown } = this.state
    this.setState({ isOpenDropdown: !isOpenDropdown })
  }

  selectItem = (item) => {
    const { multiple, onSelect } = this.props
    let newValue = [...this.state.value]

    if (multiple) {
      const index = newValue.indexOf(item.value)
      if (index > -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(item.value)
      }
    } else if (newValue === item.value) {
      newValue = null
    } else {
      newValue = item.value
    }
    this.setState({
      value: newValue,
      isOpenDropdown: false
    }, () => {
      if (onSelect) {
        onSelect(this.getSelection())
      }
    })
  }

  isSelected = (item) => {
    const { value } = this.state
    if (this.props.multiple) {
      return value && value.length > 0 ? value.indexOf(item.value) > -1 : false
    }
    return value === item.value
  }

  render() {
    const {
      title, icon, items, style, tooltip, loading, disabled, rounded, noShadow, white, className = ''
    } = this.props
    const { isOpenDropdown } = this.state
    const selectClass = `select-trigger-wrapper${disabled
      ? ' disabled' : ''}${rounded
      ? ' rounded' : ''}${noShadow
      ? ' no-shadow' : ''}`

    return (
      <div className={`select-container vCenter${disabled ? ' disabled' : ''} ${className}`} style={style}>
        {isOpenDropdown && <div className="select-overlay" onClick={this.closeDropdown} />}
        <div className={`select-content${white ? ' white' : ''}`}>
          <div className={selectClass} onClick={this.toggleDropdown}>
            {title && <div className="select-trigger-title">{title}</div>}
            <div className="select-trigger-value">{this.getSelectionLabel()}</div>
            <div className="select-trigger-icon">{icon || <i className="fa fa-caret-down" />}</div>
          </div>
          {
            isOpenDropdown && (
              <div className="select-list-wrapper">
                {
                  !loading && items.map((item) => (
                    <SelectItem
                      key={item.value}
                      item={item}
                      isSelected={this.isSelected(item)}
                      selectItem={this.selectItem}
                    />
                  ))
                }
                {loading && (
                  <div className="loading-indicator">
                    <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
                  </div>
                )}
              </div>
            )
          }
        </div>
        {tooltip && <InfoTooltip id={this.tooltipId} content={tooltip} />}
      </div>
    )
  }
}
