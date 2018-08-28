import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import './slider.css'

export default class Slider extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string
    })).isRequired,
    // value: PropTypes.any,
    // showValue: PropTypes.bool,
    onSelect: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = this.getInitialState(props)
  }

  getInitialState(props) {
    const { options, value } = props
    let currentItem = value ? options.find((item) => item.value === value) : null
    if (!currentItem) {
      const [option] = options
      currentItem = option
    }

    return {
      currentItem,
      startIndex: options.indexOf(currentItem),
      position: {
        x: 0,
        y: 0
      },
      bounds: null
    }
  }

  componentDidMount() {
    this.setBounds()
    this.bar = document.getElementById('slider_refBar')
    this.handle = document.getElementById('slider_refHandle')
    this.onSelect(this.props.options.indexOf(this.state.currentItem))
  }

  componentWillReceiveProps(newProps) {
    if (!isEqual(this.props, newProps)) {
      const newState = this.getInitialState(newProps)
      this.setState({ ...newState, bounds: this.getBounds(newProps, newState.startIndex) })
    }
  }

  onSelect = (index) => {
    if (!this.bar || !this.handle) return
    const { width, height } = this.getTokenSize()
    const handleSize = 18
    if (!this.handle) {
      this.handle = document.getElementById('slider_refHandle')
    }
    this.handle.style.left = `${(index * width) - (handleSize / 2)}px`
    this.handle.style.top = `${-Math.round((handleSize - height) / 2)}px`
    this.handle.style.display = 'block'

    if (this.props.onSelect) {
      this.props.onSelect(this.props.options[index])
    }
  }

  onItemClick = (index, e) => {
    const { clientX } = e
    const { x, width } = e.target.getBoundingClientRect()

    if (clientX < x + (width / 2)) {
      this.onSelect(index)
    } else this.onSelect(index + 1)
  }

  onDragStop = (e, data) => {
    const { x } = data
    const { width } = this.getTokenSize()
    const index = parseInt(Math.round(x / width), 10)
    this.onSelect(index + this.state.startIndex)
  }

  getBounds(props, startIndex) {
    const { options } = props
    const { width } = this.getTokenSize()

    return {
      left: -startIndex * width,
      right: (options.length - startIndex - 1) * width
    }
  }

  getTokens() {
    const { options } = this.props
    return options.length > 1 ? clone(options).slice(0, options.length - 1) : []
  }

  getTokenSize() {
    if (!this.bar) {
      this.bar = document.getElementById('slider_refBar')
    }
    const { width, height } = this.bar.getBoundingClientRect()
    return {
      width: width / this.getTokens().length,
      height
    }
  }

  setBounds = () => {
    this.setState({
      bounds: this.getBounds(this.props, this.state.startIndex)
    })
  }

  render() {
    const { currentItem } = this.state

    const tokens = this.getTokens()

    return (
      <div className="slider-wrapper">
        {currentItem && (
          <div className="slider-value-wrapper">
            <span className="slider-value">{currentItem.label}</span>
          </div>
        )}
        <div id="slider_refBar" className="slider-item-wrapper">
          {tokens.map((item, index) => (
            <div
              key={`slider-item-${index}`}
              className={`slider-item${index < tokens.length - 1 ? ' border-right' : ''}`}
              onClick={(e) => this.onItemClick(index, e)}
            />
          ))}
          <Draggable axis="x" onStop={this.onDragStop} position={this.state.position} bounds={this.state.bounds}>
            <div id="slider_refHandle" style={{ display: 'none' }} className="slider-handle" />
          </Draggable>
        </div>
      </div>
    )
  }
}
