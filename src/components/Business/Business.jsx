import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { CampaignCreateModal, CampaignEditModal } from '../CampaignModal'
import { PendingModal } from '../PendingModal'
import SubMenu from './SubMenu'
import { BusinessActions } from '../../_redux'

const mapStateToProps = (state) => ({
  isMobile: state.general.get('isMobile'),
  businessList: state.business.get('businessList').toJS(),
  businessDetails: state.business.get('businessDetails')
    && state.business.get('businessDetails').toJS().business
})

const mapDispatchToProps = { FETCH_BUSINESS_DETAILS: BusinessActions.FETCH_BUSINESS_DETAILS }

class Business extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    match: PropTypes.object,
    businessDetails: PropTypes.object,
    businessList: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.array
    ])
  }

  state = {
    isOpenPendingModal: false
  }

  onClosePending = () => {
    this.setState({ isOpenPendingModal: false })
  }

  onClickPending = () => this.setState({ isOpenPendingModal: true })

  render() {
    const {
      match: { params: { handle } }, businessDetails, businessList, isMobile
    } = this.props
    const id = businessDetails && businessDetails.id
    const isAdmin = Boolean(businessList[id])

    return (
      <div>

        {isAdmin ? (
          <SubMenu onClickPendingButton={this.onClickPending} isMobile={isMobile} />
        ) : null}
        {this.props.children}
        <PendingModal
          isOpen={this.state.isOpenPendingModal}
          onClose={this.onClosePending}
          business_id={id}
          handle={handle}
        />
        {isAdmin ? <CampaignCreateModal isMobile={isMobile} business_id={id} /> : null}
        {isAdmin ? <CampaignEditModal isMobile={isMobile} business_id={id} /> : null}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Business)
