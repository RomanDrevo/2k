import React from 'react'
import PropTypes from 'prop-types'
import './search-input.css'

export default class SearchInput extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func,
    value: PropTypes.string,
    onEditClicked: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({ value: newProps.value })
    }
  }

  onClickEdit = () => {
    const { onEditClicked } = this.props
    if (onEditClicked && typeof onEditClicked === 'function') {
      onEditClicked()
    }
  }

  onKeyDownInput = (e) => {
    const { onSubmit } = this.props
    const { value } = this.state
    if (e.key === 'Enter' && onSubmit && typeof onSubmit === 'function' && value && value.length > 0) {
      this.input.blur()
    }
  }

  onBlurInput = () => {
    const { onSubmit } = this.props
    const { value } = this.state
    if (onSubmit && typeof onSubmit === 'function' && value && value.length > 0) onSubmit(value)
  }

  onChangeInput = (e) => {
    this.setState({ value: e.target.value })
  }

  reset() {
    this.setState({ value: '' }, () => {
      this.input.focus()
    })
  }

  value() {
    return this.input.value
  }


  refInput = (e) => {
    this.input = e
  }

  render() {
    const { disabled } = this.props
    return (
      <div className="search-input-container">
        <div className="search-input-icon"><i className="fa fa-search" /></div>
        <input
          ref={this.refInput}
          type="text"
          style={{ width: '100%' }}
          value={this.state.value}
          disabled={disabled}
          onKeyDown={this.onKeyDownInput}
          onBlur={this.onBlurInput}
          onChange={this.onChangeInput}
        />
      </div>
    )
  }
}
