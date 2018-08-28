import PropTypes from 'prop-types'
import React, { Component } from 'react'

class NotificationIcon extends Component {
  static propTypes = {
    notificationCount: PropTypes.number
  }
  renderNotificationIcon() {
    if (!this.props.notificationCount) return null

    return [
      <path
        key="circle-red"
        id="Path_1121"
        style={{ fill: 'red' }}
        d="M707.75,173.607a9.949,9.949,0,1,1,9.852-9.948A9.886,9.886,0,0,1,707.75,173.607Z"
        transform="translate(-678.435 -153.312)"
      />,
      <path
        key="white-outline"
        id="Path_1122"
        style={{ fill: '#fff' }}
        // eslint-disable-next-line
        d="M707.638,154a9.536,9.536,0,1,1-9.413,9.535A9.475,9.475,0,0,1,707.638,154m0-.795a10.331,10.331,0,1,0,10.2,10.33,10.264,10.264,0,0,0-10.2-10.33Z"
        transform="translate(-678.325 -153.21)"
      />,
      <text
        key="notification-count"
        id="_7"
        style={{
          fill: '#fff',
          fontSize: '10px',
          fontFamily: 'Helvetica-Bold, Helvetica',
          fontWeight: '700'
        }}
        transform="translate(29.018 13.647)"
      >
        <tspan x="-2.781" y="0">{this.props.notificationCount}</tspan>
      </text>
    ]
  }

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2676.9 108.944 39.51 41.025"
        width="32"
        height="32"
        style={{ float: 'right', marginRight: '10px' }}
      >
        <g id="Group_3063" transform="translate(-2676.9 108.944)">
          <path
            id="Path_1119"
            style={{ fill: '#434343' }}
            // eslint-disable-next-line
            d="M702.721,183.34V171.572a12.408,12.408,0,0,0-10.135-12.253v-.938a1.453,1.453,0,0,0-1.443-1.462H689.7a1.453,1.453,0,0,0-1.443,1.462v.938a12.408,12.408,0,0,0-10.111,12.245V183.34L673.07,187.5v2.384H707.78V187.5Zm3.6,5.07H674.505V188.2l4.542-3.719.533-.437V171.564a10.849,10.849,0,1,1,21.7,0V184l.533.437,4.518,3.727Z"
            transform="translate(-673.07 -153.971)"
          />
          <path
            id="Path_1120"
            style={{ fill: '#434343' }}
            // eslint-disable-next-line
            d="M694.184,203.893a3.64,3.64,0,0,0,3.616-3.663h-7.24a3.688,3.688,0,0,0,1.062,2.593,3.592,3.592,0,0,0,2.562,1.07Z"
            transform="translate(-676.842 -162.868)"
          />
          {this.renderNotificationIcon()}
        </g>
      </svg>
    )
  }
}

export default NotificationIcon
