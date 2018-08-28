import React from 'react'
import PropTypes from 'prop-types'
import './round-button.css'

const RoundButton = ({
  title, textColor, backgroundColor, width, height, onPress
}) => {
  const textSize = (height / 2) - 2
  return (
    <a
      className="round-button"
      style={{
        background: backgroundColor,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
      }}
      onClick={onPress}
    >
      <div
        className="rount-button-text"
        style={{
          fontSize: textSize, color: textColor, fontFamily: 'roboto', fontWeight: '100'
        }}
      >{ title }
      </div>
    </a>
  )
}

RoundButton.propTypes = {
  title: PropTypes.string,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  // textSize: PropTypes.number,
  onPress: PropTypes.func
}

export default RoundButton
