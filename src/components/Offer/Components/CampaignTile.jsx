import PropTypes from 'prop-types'
import React from 'react'
import * as viewModes from '../../../constants/view_modes'
import * as userRoles from '../../../constants/user_roles'
import { getClasses } from '../../../_core/utils'
import { ClipImg } from '../../_common'

class CampaignTile extends React.Component {
  state = {
    isFavoriteClicked: ''
  }
  componentDidMount() {
    const elm = this.favoriteIcon
    elm.addEventListener('animationend', this.fadingDone)
  }

  componentWillUnmount() {
    const elm = this.favoriteIcon
    elm.removeEventListener('animationend', this.fadingDone)
  }

  fadingDone = () => {
    this.setState({ isFavoriteClicked: '' })
  }

  handleAddFavorite = () => {
    this.setState({ isFavoriteClicked: 'favoriteButtonClicked' })
    this.props.handleAddFavorite()
  }

  refFavoriteIcon = (e) => {
    this.favoriteIcon = e
  }

  render() {
    const {
      campaign,
      favorite,
      role,
      priceInfo,
      viewMode
    } = this.props
    const { isFavoriteClicked } = this.state

    const classes = getClasses('offer-cube__favorite', 'offer-cube__favorite offer-cube__favorite--favorited', favorite)
    const disabled = !(role === userRoles.INFLUENCER
      || role === userRoles.GUEST || role === userRoles.LIKES) && viewMode !== viewModes.GUEST

    return (
      <div className="offer-cube__image-wrapper">
        <span key="offer-cube__price" className="offer-cube__price">{priceInfo}</span>
        <span
          ref={this.refFavoriteIcon}
          key="offer-cube__favorite"
          className={`${classes} ${isFavoriteClicked}${disabled ? ' disabled' : ''}`}
          onClick={this.handleAddFavorite}
        />
        <ClipImg
          className="offer-cube__image"
          src={campaign.media_url}
          x1={campaign.media_x1}
          x2={campaign.media_x2}
          y1={campaign.media_y1}
          y2={campaign.media_y2}
        />
      </div>
    )
  }
}

CampaignTile.propTypes = {
  favorite: PropTypes.bool,
  viewMode: PropTypes.string,
  role: PropTypes.string,
  priceInfo: PropTypes.string,
  campaign: PropTypes.object.isRequired,
  handleAddFavorite: PropTypes.func.isRequired
}

export default CampaignTile
