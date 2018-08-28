import React from 'react'
import PropTypes from 'prop-types'
import './radio.css'

export default class Radio extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  onChange = () => {}

  /* eslint-disable jsx-a11y/label-has-for */
  render() {
    const { checked, id } = this.props
    return (
      <div style={{ cursor: 'pointer' }} onClick={this.onClick}>
        <input id={id} type="radio" checked={checked} onClick={this.onClick} onChange={this.onChange} />
        <label htmlFor={id}>{this.props.title}</label>
      </div>
    )
  }
}

/* eslint-enable jsx-a11y/label-has-for */

