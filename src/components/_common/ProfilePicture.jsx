import React from 'react'
import PropTypes from 'prop-types'
import './profile-picture.css'

class ProfilePicture extends React.Component {
  render() {
    const {
      size, picture, first_name, last_name
    } = this.props
    const abbreviation = () => {
      let str = ''

      if (first_name && first_name.length > 0) {
        str += ` ${first_name.toUpperCase().substr(0, 1)}`
      }
      if (last_name && last_name.length > 0) {
        str += ` ${last_name.toUpperCase().substr(0, 1)}`
      }

      return str
    }

    const style = {}
    if (size) {
      style.width = size
      style.height = size
      style.borderRadius = size / 2
      style.fontSize = (size * 25) / 80
    }
    return (
      <div className="profile-picture" style={style}>
        {picture && <img src={picture} alt="" />}
        {!picture && <div>{abbreviation()}</div>}
      </div>
    )
  }
}

ProfilePicture.propTypes = {
  size: PropTypes.number,
  picture: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string
}

export default ProfilePicture
