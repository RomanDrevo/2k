import PropTypes from 'prop-types'
import React from 'react'

export default class SelectItems extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    isSelected: PropTypes.bool,
    selectItem: PropTypes.func.isRequired
  }

  handleSelect = () => {
    this.props.selectItem(this.props.item)
  }

  render() {
    const { item, isSelected } = this.props
    return (
      <div
        key={`select-item-${item.value}`}
        className={`select-list-item${isSelected ? ' selected' : ''}`}
        onClick={this.handleSelect}
      >
        {item.label}
      </div>
    )
  }
}
