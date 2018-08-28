import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl } from 'react-intl'
import './thumbnail-view.css'

class ThumbnailView extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    multiple: PropTypes.bool,
    selections: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    itemRenderer: PropTypes.func,
    itemProps: PropTypes.object,
    newItemEnabled: PropTypes.bool,
    newItemRenderer: PropTypes.func,
    style: PropTypes.object,
    onChange: PropTypes.func,
    onNewItem: PropTypes.func,
    loading: PropTypes.bool
  };

  static defaultItemRenderer = (item) => (
    <div className="thumbnail-wrapper">
      <div className="thumbnail-content">
        {item.title}
      </div>
    </div>
  );

  static defaultNewItemRenderer = () => (
    <div className="thumbnail-wrapper">
      <div className="thumbnail-content">
        <i className="fa fa-plus-circle thumbnail-content-new-item" />
      </div>
    </div>
  );

  constructor(props) {
    super(props)

    this.state = {
      selections: props.selections
    }
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(newProps.selections, this.props.selections)) {
      this.setState({ selections: newProps.selections })
    }
  }

  onNewItem = () => {
    if (this.props.onNewItem) this.props.onNewItem()
  }

  toggleSelection = (item) => {
    const { multiple } = this.props
    let { selections } = this.state

    if (multiple) {
      selections = selections || []
      const index = _.indexOf(selections, item)
      if (index > -1) selections.splice(index, 1)
      else selections.push(item)
    } else if (_.isEqual(selections, item)) {
      selections = null
    } else {
      selections = item
    }

    this.setState({ selections }, () => {
      if (this.props.onChange) this.props.onChange(selections)
    })
  }


  renderItem = (item) => {
    const { itemRenderer, itemProps } = this.props
    const props = itemProps ? { ...itemProps, item } : item
    return itemRenderer && typeof itemRenderer === 'function'
      ? itemRenderer(props) : ThumbnailView.defaultItemRenderer(item)
  };

  renderNewItem = () => {
    const { newItemRenderer } = this.props

    return (
      <div className="thumbnail-item-wrapper" onClick={() => this.onNewItem()}>
        {newItemRenderer && typeof newItemRenderer === 'function'
          ? newItemRenderer() : ThumbnailView.defaultNewItemRenderer()}
      </div>
    )
  };

  render() {
    const { data, newItemEnabled, loading } = this.props

    return (
      <div className="thumbnail-view-container" style={this.props.style}>
        {loading && <div className="loading-indicator"><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" /></div>}
        {!loading && newItemEnabled && this.renderNewItem()}
        {!loading && (data || []).map((item) => {
          const { multiple } = this.props
          const { selections } = this.state
          const selected = (multiple && _.indexOf(selections, item) > -1)
            || (!multiple && _.isEqual(selections, item))
          if (!item.id) return null
          return (
            <div
              key={`thumbnail-item-${item.id}`}
              className={`thumbnail-item-wrapper${selected ? ' selected' : ''}`}
              onClick={() => this.toggleSelection(item)}
            >
              {this.renderItem(item)}
              {selected && <div className="thumbnail-item-selection"><i className="fa fa-check-circle" /></div>}
            </div>
          )
        })}
      </div>
    )
  }
}

export default injectIntl(ThumbnailView)
