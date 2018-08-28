import React from 'react'
import PropTypes from 'prop-types'
import './arrow-box.css'

export default class ArrowBox extends React.Component {
  static propTypes = {
    arrow: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    style: PropTypes.object,
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
    borderRadius: PropTypes.number,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])
  }

  static defaultProps = {
    arrow: 'left',
    borderWidth: 0
  }

  componentWillMount() {
    const hash = `arrowBox${this.props.children}`.hashCode()
    this.boxId = btoa(`${hash * Math.random()}${Date.now()}`)
  }

  componentDidMount() {
    this.box = document.getElementById(this.boxId)
    this.refresh()
  }

  componentWillReceiveProps(nextProps) {
    this.refresh(nextProps)
  }

  refresh(props = this.props) {
    const arrowSize = 10
    const {
      arrow, arrowOffset, borderColor, backgroundColor, borderWidth
    } = props

    const arrowOffsetValue = `calc(${arrowOffset} - ${arrowSize}px)`

    let borderColorName
    let arrowOffsetPosName
    let arrowBasePosName
    let beforeArrowBasePosValue
    let afterArrowBasePosValue

    switch (arrow) {
    case 'left':
      borderColorName = 'border-right-color'
      arrowOffsetPosName = 'top'
      arrowBasePosName = 'left'
      beforeArrowBasePosValue = `${-2 * arrowSize}px`
      afterArrowBasePosValue = `calc(${-2 * arrowSize}px + ${Math.sqrt(2 * borderWidth * borderWidth)}px)`
      break
    case 'top':
      borderColorName = 'border-bottom-color'
      arrowOffsetPosName = 'left'
      arrowBasePosName = 'bottom'
      beforeArrowBasePosValue = '100%'
      afterArrowBasePosValue = `calc(100% - ${Math.sqrt(2 * borderWidth * borderWidth)}px)`
      break
    case 'right':
      borderColorName = 'border-left-color'
      arrowOffsetPosName = 'top'
      arrowBasePosName = 'right'
      beforeArrowBasePosValue = `${-2 * arrowSize}px`
      afterArrowBasePosValue = `calc(${-2 * arrowSize}px + ${Math.sqrt(2 * borderWidth * borderWidth)}px)`
      break
    case 'bottom':
      borderColorName = 'border-top-color'
      arrowOffsetPosName = 'left'
      arrowBasePosName = 'top'
      beforeArrowBasePosValue = '100%'
      afterArrowBasePosValue = `calc(100% - ${Math.sqrt(2 * borderWidth * borderWidth)}px)`
      break
    default:
      borderColorName = 'border-right-color'
      arrowOffsetPosName = 'top'
      arrowBasePosName = 'left'
      beforeArrowBasePosValue = `${-2 * arrowSize}px`
      afterArrowBasePosValue = `calc(${-2 * arrowSize}px + ${Math.sqrt(2 * borderWidth * borderWidth)}px)`
    }

    if (!this.box) {
      this.box = document.getElementById(this.boxId)
    }

    if (borderColor) {
      this.box.pseudoStyle('before', borderColorName, `${borderColor} !important`)
    }
    if (backgroundColor) {
      this.box.pseudoStyle('after', borderColorName, `${backgroundColor} !important`)
    }

    this.box.pseudoStyle('before', arrowOffsetPosName, `${arrowOffsetValue} !important`)
    this.box.pseudoStyle('before', arrowBasePosName, `${beforeArrowBasePosValue} !important`)
    this.box.pseudoStyle('after', arrowOffsetPosName, `${arrowOffsetValue} !important`)
    this.box.pseudoStyle('after', arrowBasePosName, `${afterArrowBasePosValue} !important`)
  }

  render() {
    const {
      arrow, style, children, borderRadius, backgroundColor,
      color, borderWidth, borderColor, className = ''
    } = this.props
    const arrowBoxStyle = {}
    if (backgroundColor) arrowBoxStyle.backgroundColor = backgroundColor
    if (color) arrowBoxStyle.color = color
    if (borderColor) arrowBoxStyle.borderColor = borderColor
    if (borderRadius !== undefined) arrowBoxStyle.borderRadius = borderRadius
    if (borderWidth) {
      arrowBoxStyle.borderWidth = borderWidth
      arrowBoxStyle.borderStyle = 'solid'
    }

    return (
      <div className="arrow-box-container" style={style}>
        <div id={this.boxId} className={`arrow-box ${arrow} ${className}`} style={arrowBoxStyle}>
          {children}
        </div>
      </div>
    )
  }
}
