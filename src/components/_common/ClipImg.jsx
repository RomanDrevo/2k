import PropTypes from 'prop-types'
import React from 'react'
import loading from './loading.svg'
import { hashCode } from '../../_core/utils'

export default class ClipImg extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    x1: PropTypes.number,
    y1: PropTypes.number,
    x2: PropTypes.number,
    y2: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string
  }

  state = {
    loading: false,
    width: 0,
    originalWidth: 0,
    originalHeight: 0
  }

  componentWillMount() {
    const imgHash = hashCode(this.props.src)
    this.id = btoa(`img${imgHash * Math.random()}${Date.now()}`)
    this.containerId = btoa(`container${imgHash * Math.random()}${Date.now()}`)
  }

  componentDidMount() {
    this.container = document.getElementById(this.containerId)
    this.mounted = true
    this.setDimensions()
    this.setOriginalDimensions(this.props.src)
  }

  componentWillReceiveProps(nextProps) {
    const {
      x1, y1, x2, y2, src
    } = this.props
    if (src !== nextProps.src || x1 !== nextProps.x1 || y1 !== nextProps.y1
      || x2 !== nextProps.x2 || y2 !== nextProps.y2) {
      this.setDimensions()
      this.setOriginalDimensions(nextProps.src)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  setDimensions = () => {
    if (!this.container) {
      this.container = document.getElementById(this.containerId)
    }
    this.setState({ width: this.container.clientWidth })
  }

  setOriginalDimensions = (src = this.props.src) => {
    const img = new Image()
    img.onload = () => {
      if (this.mounted) {
        this.setState({ originalWidth: img.width, originalHeight: img.height })
      }
    }
    img.src = src
  }

  render() {
    const {
      className = '', style, src, x1, y1, x2, y2
    } = this.props
    const cropped = !(Number.isNaN(parseInt(x1, 10)) || Number.isNaN(parseInt(y1, 10))
      || Number.isNaN(parseInt(x2, 10)) || Number.isNaN(parseInt(y2, 10)))
    let imgStyle = {
      width: '100%'
    }
    let containerStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
      width: '100%',
      height: '100%',
      padding: 0,
      overflow: 'hidden'
    }
    if (cropped) {
      const scale = this.state.width ? this.state.width / (x2 - x1) : 1
      imgStyle = {
        width: (this.state.originalWidth * scale) || '100%',
        height: (this.state.originalHeight * scale) || '100%',
        marginTop: `-${y1 * scale}px`,
        marginLeft: `-${x1 * scale}px`
      }
      containerStyle = {
        ...containerStyle,
        width: (x2 - x1) * scale,
        height: (y2 - y1) * scale
      }
      // console.log(containerStyle, imgStyle)
      if (containerStyle.width > imgStyle.width || containerStyle.height > imgStyle.height) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
      }
    } else {
      containerStyle.display = 'flex'
      containerStyle.alignItems = 'center'
      containerStyle.justifyContent = 'center'
    }
    return (
      <div
        style={{
          ...style, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        className={className}
      >
        <div id={this.containerId} style={containerStyle}>
          <img src={src} alt="" style={imgStyle} />
        </div>
        {this.state.loading && <img className="clipLoader" src={loading} alt="loading" />}
      </div>
    )
  }
}
