import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

class BusinessItem extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    business: PropTypes.object.isRequired,
    click: PropTypes.func.isRequired,
    isActive: PropTypes.bool
  }
  handleClick = (e) => {
    const { business, click, history } = this.props
    click(e)
    history.push({
      pathname: `/business/${business.handle}`,
      state: { id: business.id }
    })
  }
  render() {
    const { business, isActive } = this.props
    return (
      <li className={`${isActive ? 'active' : ''}`}>
        {!!business.logo && (
          <img className="" src={business.logo} alt="" />
        )}
        <a
          onClick={this.handleClick}
        >
          {business.name}
        </a>
      </li>
    )
  }
}

export default withRouter(BusinessItem)
