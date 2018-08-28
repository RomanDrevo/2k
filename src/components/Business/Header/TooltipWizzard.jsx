import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import './TooltipWizzard.css'

const preventDefault = (e) => {
  if (e.preventDefault) {
    e.preventDefault()
  }
  if (e.stopPropagation) {
    e.stopPropagation()
  }
}

const preventDefaultForScrollKeys = (e) => {
  const keys = {
    37: 1,
    38: 1,
    39: 1,
    40: 1
  }
  if (keys[e.keyCode]) {
    preventDefault(e)
  }
  return false
}

class TooltipWizzard extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onAdminEnable: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }
  state = {
    wizzard: 1
  }

  componentDidMount() {
    this.targets = {}
    const { wizzard } = this.state
    this.targets[wizzard] = this.targets[wizzard]
      || document.getElementById(this.getWizzard(wizzard).id)
    this.calculatePosition()
    if (this.props.visible) {
      window.onwheel = preventDefault // modern standard
      window.ontouchmove = preventDefault // mobile
      document.onkeydown = preventDefaultForScrollKeys
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      window.onwheel = preventDefault // modern standard
      window.ontouchmove = preventDefault // mobile
      document.onkeydown = preventDefaultForScrollKeys
    }
    if (this.props.visible && !nextProps.visible) {
      window.onwheel = null // modern standard
      window.ontouchmove = null // mobile
      document.onkeydown = null
    }
  }

  getWizzard = (key) => {
    const { intl: { formatMessage } } = this.props
    const defaultMessage = `!This is your new 2key Business page URL!
        Here, people can see your business details and recommend you to the world :)`
    const wizzards = {
      1: {
        id: 'createWizzard-1',
        prev: false,
        next: true,
        place: 'bottom',
        text: formatMessage({ id: 'business.wizzard1', defaultMessage })
      },
      2: {
        id: 'createWizzard-2',
        prev: true,
        next: true,
        place: 'top',
        text: formatMessage({
          id: 'business.wizzard2',
          defaultMessage: '!Switch view mode between admin and  visitor point of view'
        })
      },
      3: {
        id: 'createWizzard-3',
        prev: true,
        next: false,
        place: 'left',
        text: formatMessage({
          id: 'business.wizzard3',
          defaultMessage: '!Click each pencil/camera icon to edit the field or image'
        })
      }
    }
    return wizzards[key] || {}
  }

  calculatePosition = () => {
    const { wizzard } = this.state
    this.targets[wizzard] = this.targets[wizzard]
      || document.getElementById(this.getWizzard(wizzard).id)
    const bounding = this.targets[wizzard].getBoundingClientRect()
    const { place } = this.getWizzard(wizzard)
    const style = {}
    if (place === 'bottom') {
      style.top = '15px'
      style.left = `${bounding.x + ((bounding.right - bounding.left) / 2)}px`
    } else if (place === 'top') {
      style.top = 'initial'
      style.bottom = `${window.innerHeight - bounding.y}px`
      style.right = `${(window.innerWidth - bounding.right) + ((bounding.right - bounding.left) / 2)}px`
    } else if (place === 'left') {
      style.top = `${bounding.y + (bounding.height / 2)}px`
      style.right = `${window.innerWidth - bounding.x}px`
    } else {
      style.top = '-400px'
    }
    this.setState({ style })
  }

  handlePrevTipClick = (e) => {
    e.stopPropagation()
    const wizzard = this.state.wizzard - 1
    this.setState({ wizzard })
  }

  handleNextTipClick = (e) => {
    e.stopPropagation()
    if (this.state.wizzard === 2) {
      this.props.onAdminEnable()
    }
    if (this.getWizzard(this.state.wizzard).next) {
      this.setState({ wizzard: this.state.wizzard + 1 }, () => {
        this.calculatePosition()
      })
    } else {
      this.props.onClose()
    }
  }

  handleClose = (e) => {
    e.stopPropagation()
    window.onwheel = null // modern standard
    window.ontouchmove = null // mobile
    document.onkeydown = null
    this.props.onClose()
  }

  render() {
    const { wizzard, style } = this.state
    const { visible } = this.props
    return visible ? (
      <div className="createWizzardContainer">
        <section className={`createWizzard ${this.getWizzard(wizzard).place}`} style={style}>
          <div>
            <header>
              <div>
                <button onClick={this.handlePrevTipClick} disabled={!this.getWizzard(wizzard).prev}>
                  <i className="fa fa-chevron-left" />
                </button>
                <span>{wizzard}/3</span>
                <button onClick={this.handleNextTipClick} disabled={!this.getWizzard(wizzard).prev}>
                  <i className="fa fa-chevron-right" />
                </button>
              </div>
              <button onClick={this.handleClose}>
                <i className="fa fa-close" />
              </button>
            </header>
            <main>
              {this.getWizzard(wizzard).text}
            </main>
            <footer>
              <button onClick={this.handleNextTipClick}>
                {this.getWizzard(wizzard).next ? (
                  <FormattedMessage id="business.next_tip" defaultMessage="!next tip" />
                ) : (
                  <FormattedMessage id="business.close" defaultMessage="!close" />
                )}
              </button>
            </footer>
          </div>
        </section>
      </div>
    ) : null
  }
}

export default injectIntl(TooltipWizzard)
