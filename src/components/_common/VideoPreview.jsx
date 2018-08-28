import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import IconButton from './IconButton'
import './video-preview.css'

export default class VideoPreview extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    width: PropTypes.string, // 100% or 100px
    height: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      playing: false
    }
  }

  onEnded = () => this.setState({ playing: false })

  toggleMediaPlaying = () => {
    const playing = !this.state.playing
    this.setState({ playing })
  }

  render() {
    return (
      <div className="video-preview-container">
        <div className="thumbnail-content-video">
          <ReactPlayer
            url={this.props.src}
            width={this.props.width}
            height={this.props.height}
            playing={this.state.playing}
            onEnded={this.onEnded}
          />
          <IconButton
            className="thumbnail-content-video-control"
            icon={this.state.playing ? 'pause-circle' : 'play-circle'}
            onClick={this.toggleMediaPlaying}
          />
        </div>
      </div>
    )
  }
}
