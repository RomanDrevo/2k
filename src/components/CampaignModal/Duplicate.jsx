import Modal from 'react-modal'
import PropTypes from 'prop-types'
import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import IFrame from 'react-iframe'
import { injectIntl } from 'react-intl'
import { fetchAPI } from '../../_core/http'
import './duplicate.css'
import chat from '../../icons/chat.svg'
import thumbUp from '../../icons/ic_thumb_up_black_24px.svg'
import thumbDown from '../../icons/ic_thumb_down_black_24px.svg'

let mounted
let interval

class Duplicate extends React.PureComponent {
  static propTypes = {
    isDuplicateOpen: PropTypes.bool,
    hosted: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    updateHosted: PropTypes.func.isRequired
  }

  state = {
    countdown: false,
    statusCode: 3,
    stage: 0
  }

  componentDidMount() {
    mounted = true
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isDuplicateOpen && nextProps.isDuplicateOpen) {
      const { hosted } = nextProps
      if (!hosted || !hosted.id) {
        this.setState({ countdown: false })
      } else {
        this.setState({
          countdown: true, success: false, stage: 0, statusCode: 3
        })
        this.getHostedInfo(hosted)
        interval = setInterval(() => {
          this.getHostedInfo()
        }, 3532)
      }
    }
  }

  componentWillUnmount() {
    mounted = false
    clearInterval(interval)
    interval = null
  }

  getHostedInfo = (hosted = this.props.hosted) => {
    if (mounted && !this.state.expired) {
      fetchAPI(`hosted?hosted_id=${hosted.id}`)
        .then(({ hosted_site }) => {
          if (mounted) {
            if (hosted_site && hosted_site.is_duplication_ready !== null) {
              this.setState({
                success: hosted_site.is_duplication_ready,
                stage: hosted_site.is_duplication_ready && hosted_site.duplicate_site_entrypoint_full_url ? 1 : 3,
                countdown: false,
                thumb: hosted_site.duplicate_site_entrypoint_full_url
                  || hosted_site.original_landing_page_url
              })
              this.props.updateHosted(hosted_site)
              clearInterval(interval)
              interval = null
            }
          }
        })
    } else {
      clearInterval(interval)
      interval = null
    }
  }

  getChatMessages = (stage) => {
    const { intl: { formatMessage } } = this.props
    const result = {
      0: {
        title: formatMessage({ id: 'campaign.duplicate0', defaultMessage: 'LANGUAGE ERROR' }),
        message: formatMessage({ id: 'campaign.duplicate0_msg', defaultMessage: 'LANGUAGE ERROR' })
      },
      1: {
        title: formatMessage({ id: 'campaign.duplicate1', defaultMessage: 'LANGUAGE ERROR' }),
        message: formatMessage({ id: 'campaign.duplicate1_msg', defaultMessage: 'LANGUAGE ERROR' })
      },
      2: {
        title: formatMessage({ id: 'campaign.duplicate2', defaultMessage: 'LANGUAGE ERROR' }),
        message: formatMessage({ id: 'campaign.duplicate2_msg', defaultMessage: 'LANGUAGE ERROR' })
      },
      3: {
        title: formatMessage({ id: 'campaign.duplicate3', defaultMessage: 'LANGUAGE ERROR' }),
        message: formatMessage({ id: 'campaign.duplicate3_msg', defaultMessage: 'LANGUAGE ERROR' })
      },
      4: {
        title: formatMessage({ id: 'campaign.duplicate4', defaultMessage: 'LANGUAGE ERROR' }),
        message: formatMessage({ id: 'campaign.duplicate4_msg', defaultMessage: 'LANGUAGE ERROR' })
      },
      5: {
        title: formatMessage({ id: 'campaign.duplicate5', defaultMessage: 'LANGUAGE ERROR' }),
        message: formatMessage({ id: 'campaign.duplicate5_msg', defaultMessage: 'LANGUAGE ERROR' })
      }

    }
    return result[stage]
  }

  handleClose = (status = this.state.statusCode) => {
    clearInterval(interval)
    interval = null
    this.props.onClose(status, this.state.success)
    this.setState({
      stage: 0, thumb: null, statusCode: 3, countdown: false
    })
  }

  handleCountdownExpire = () => {
    this.setState({ expired: true, countdown: false, stage: 3 })
  }

  handleThumbUp = () => {
    const { stage } = this.state
    if (stage === 1) {
      this.handleClose(stage)
    } else {
      this.handleClose(2)
    }
  }

  handleThumbDown = () => {
    const { stage } = this.state
    if (stage === 0) {
      this.handleClose(stage)
    } else if (stage === 1) {
      this.setState({ stage: 4 })
    } else {
      this.handleClose(3)
    }
  }

  render() {
    const { countdown, stage, thumb } = this.state
    const { title, message } = this.getChatMessages(stage)
    return (
      <Modal
        className="modal-trans duplicate-modal"
        isOpen={this.props.isDuplicateOpen}
        onRequestClose={this.handleClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
      >
        <section className="duplicate-flow">
          {countdown ? (
            <ReactCountdownClock
              seconds={60}
              color="#1a936f"
              alpha={0.9}
              size={150}
              onComplete={this.handleCountdownExpire}
            />
          ) : thumb && (
            <IFrame url={thumb} width="100%" height="100%" allowFullScreen />
          )}
          <div className="chat">
            <div className="chat-women">
              <img src={chat} alt="Need help?" />
            </div>
            <div className="chat-description">
              <div>
                <h4>{title}</h4>
                <p>{message}</p>
              </div>
              {stage > 0 && (
                <div className="chat-thumbs">
                  <button onClick={this.handleThumbUp}>
                    <img src={thumbUp} alt="up" />
                  </button>
                  <button onClick={this.handleThumbDown}>
                    <img src={thumbDown} alt="down" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </Modal>
    )
  }
}

export default injectIntl(Duplicate)
