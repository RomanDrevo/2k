import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { detectInactiveOffer } from '../../_core/utils'

import OfferCube from './index'

import './OfferCubeGrid.css'
// import loadingImg from '../../loading.svg'

class OfferCubeGrid extends Component {
  renderOfferCubes() {
    const {
      offers,
      isAdmin,
      isActive,
      handleEditOffer,
      isAdminPreviewMode,
      updateCampaign
    } = this.props
    const isFeatured = offers.length < 3
    const className = isFeatured && isActive
      ? 'col-lg-6 col-md-6 col-sm-6 minimal-padding offset-lg-3'
      : 'col-lg-3 col-md-6 col-sm-6 minimal-padding'
    return (
      <div className="row">
        {offers.map((offer) => (
          <div
            key={`offer-${offer.id}`}
            className={className}
          >
            <OfferCube
              isFeatured={isFeatured && isActive}
              offer={offer}
              isInactive={detectInactiveOffer(offer)}
              isAdmin={isAdmin}
              handleEdit={handleEditOffer}
              isAdminPreviewMode={isAdmin && isAdminPreviewMode}
              updateCampaign={updateCampaign}
            />
          </div>
        ))}
      </div>
    )
  }

  render() {
    const { offers, emptyMessage = '' } = this.props

    // if (offers.length === 0 || loading) {
    //   return <img className="loader" src={loadingImg} alt="" />
    // }

    if (offers.length <= 0) {
      return (
        <div className="offer-cube-grid-empty">
          <h4>{emptyMessage}</h4>
        </div>
      )
    }
    return (
      <div className="container offer-cube-grid">
        {this.renderOfferCubes()}
      </div>
    )
  }
}

OfferCubeGrid.propTypes = {
  emptyMessage: PropTypes.string,
  isAdminPreviewMode: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isActive: PropTypes.bool,
  offers: PropTypes.array,
  handleEditOffer: PropTypes.func.isRequired,
  updateCampaign: PropTypes.func.isRequired
}

/* export default connect(mapStateToProps, { FETCH_BUSINESS_OFFERS:
  , setOffers, setFavoriteOffers, favoriteOffer, removeFavoriteOffer })(OfferCubeGrid)*/
export default OfferCubeGrid
