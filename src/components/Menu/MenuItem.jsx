import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

class MenuItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    img: PropTypes.string,
    to: PropTypes.string,
    href: PropTypes.string,
    history: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
    onClick: PropTypes.func.isRequired
  }
  handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onClick(e)
    if (this.props.href) {
      window.open(this.props.href)
    } else if (this.props.to) {
      this.props.history.push(this.props.to)
    }
  }
  render() {
    const {
      className = '', img, children, to = ''
    } = this.props
    return (
      <li className={`nav-item ${className}`}>
        {img && (
          <div className="menuIcon">
            <img alt="" src={img} />
          </div>
        )}
        <Link className="nav-link" to={to} onClick={this.handleClick}>
          {children}
        </Link>
      </li>
    )
  }
}

export default withRouter(MenuItem)
