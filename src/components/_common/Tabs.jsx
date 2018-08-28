import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './tabs.css'

export default class Tabs extends React.Component {
  static propTypes = {
    activeKey: PropTypes.number,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
  };

  static defaultProps = {
    activeKey: 1
  };

  onClickTab = (eventKey) => {
    if (this.props.onSelect) {
      this.props.onSelect(eventKey)
    }
  };

  render() {
    const { children, activeKey, className } = this.props
    return (
      <div>
        <div className={`tab-bar-container ${className}`}>
          {children.map((tab) => {
            if (!tab) {
              return null
            }
            const { title, eventKey, selectedExtraEl } = tab.props
            const selected = eventKey === activeKey
            const classNames = classnames('tab', { selected })

            return (
              <div key={`tab-${eventKey}`} className={classNames} onClick={() => this.onClickTab(eventKey)}>
                <div style={{ display: 'flex' }}>
                  <div className="tab-title">{title}</div>
                  {selected && selectedExtraEl}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          {children.map((tab, index) => (tab ? (
            <div key={`tab-content-${index}`} style={{ display: tab.props.eventKey === activeKey ? 'block' : 'none' }}>
              {tab}
            </div>
          ) : null))}
        </div>
      </div>
    )
  }
}

export const Tab = ({ children }) => (
  <div>
    {children}
  </div>
)

Tab.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
}
