import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl } from 'react-intl'
import './Business.css'
import BusinessItem from './BusinessItem'
import plus from '../../icons/plus.svg'

class BusinessList extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    currentBusinessId: PropTypes.number,
    businessList: PropTypes.object,
    intl: PropTypes.object.isRequired,
    click: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props.isVisible !== nextProps.isVisible
      || this.props.businessList !== nextProps.businessList
  }

  render() {
    const { isVisible, currentBusinessId, intl: { formatMessage } } = this.props
    const businessList = !Object.keys(this.props.businessList).length ? [] : this.props.businessList
    return (
      <ul className={`nested vertical menu business-list-menu ${isVisible ? '' : 'd-none'}`}>
        {Object.keys(businessList).map((key) => (
          <BusinessItem
            key={businessList[key].id}
            isActive={businessList[key].id === currentBusinessId}
            business={businessList[key]}
            click={this.props.click}
          />
        ))}
        <BusinessItem
          business={{
            name: formatMessage({ id: 'main_menu.create_business', defaultMessage: '!Create new business' }),
            handle: 'create',
            logo: plus
          }}
          click={this.props.click}
        />
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  businessList: state.business.get('businessList').toJS(),
  currentBusinessId: state.business.get('currentBusinessId')
})

export default injectIntl(connect(mapStateToProps)(BusinessList))
