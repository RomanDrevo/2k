import max from 'lodash/max'
import React from 'react'
import PropTypes from 'prop-types'
import './circle-percent-bar.css'

const CirclePercentBar = (props) => {
  const {
    sqSize, backStrokeWidth, progressStrokeWidth, percentage,
    backgroundColor, progressColor, numberText, labelText
  } = props
  // Size of the enclosing square
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - max([backStrokeWidth, progressStrokeWidth])) / 2
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - ((dashArray * percentage) / 100)

  return (
    <svg
      width={sqSize}
      height={sqSize}
      viewBox={viewBox}
      className="svg-wrapper"
    >
      <circle
        className="circle-background"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={`${backStrokeWidth}px`}
      />
      <circle
        className="circle-progress"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        stroke={progressColor}
        strokeWidth={`${progressStrokeWidth}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset
        }}
      />
      <text
        className="circle-text number"
        x="50%"
        y="45%"
        textAnchor="middle"
      >
        {numberText}
      </text>
      <text
        className="circle-text"
        x="50%"
        y="70%"
        textAnchor="middle"
      >
        {labelText}
      </text>
    </svg>
  )
}

CirclePercentBar.propTypes = {
  sqSize: PropTypes.number,
  backStrokeWidth: PropTypes.number,
  progressStrokeWidth: PropTypes.number,
  percentage: PropTypes.number,
  backgroundColor: PropTypes.string,
  progressColor: PropTypes.string,
  numberText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelText: PropTypes.string
}

CirclePercentBar.defaultProps = {
  sqSize: 200,
  percentage: 25,
  backStrokeWidth: 3,
  progressStrokeWidth: 5
}

export default CirclePercentBar
