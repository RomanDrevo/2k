import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Toggle from 'react-toggle'

class Notifications extends Component {
    static propTypes = {

    }

    state={

    }

    render() {
      return (
        <div className="business-info-wrapper">
          <div className="business-info-body pt2 mt-30">
            <h4 className="ml2">Notifications Settings</h4>
            <div className="notifications-settings-list">
              <div className="notifications-settings-item flex justify-between pt1 pb1 mb1 pl3">
                <div><b>New Lead</b></div>
                <Toggle
                  className="mr3"
                  icons={false}
                  // checked={value === 'right'}
                  // onChange={this.toggleCheck}
                />
              </div>
              <div className="notifications-settings-item flex justify-between pt1 pb1 mb1 pl3">
                <div><b>Daily Result Summary</b></div>
                <Toggle
                  className="mr3"
                  icons={false}
                  // checked={value === 'right'}
                  // onChange={this.toggleCheck}
                />
              </div>
              <div className="notifications-settings-item flex justify-between pt1 pb1 mb1 pl3">
                <div><b>Weekly Result Summary</b></div>
                <Toggle
                  className="mr3"
                  icons={false}
                  // checked={value === 'right'}
                  // onChange={this.toggleCheck}
                />
              </div>
              <div className="notifications-settings-item flex justify-between pt1 pb1 mb1 pl3">
                <div><b>Monthly Result Summary</b></div>
                <Toggle
                  className="mr3"
                  icons={false}
                  // checked={value === 'right'}
                  // onChange={this.toggleCheck}
                />
              </div>
              <div className="notifications-settings-item flex justify-between items-center pt1 pb1 pl3">
                <div><b>2Key &#39; s Blog</b></div>
                <Toggle
                  className="mr3"
                  icons={false}
                  // checked={value === 'right'}
                  // onChange={this.toggleCheck}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
}

export default Notifications
