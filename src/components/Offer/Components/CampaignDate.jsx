import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import * as userRoles from '../../../constants/user_roles'

const CampaignDate = ({ offer, isInactive, showRecommendOptions }) => {
  const smokedOut = isInactive ? 'offer-cube--smoked-out' : ''
  const dateFormat = 'MMM Do, YYYY'
  const ended = (offer.end_date && moment(offer.end_date).format(dateFormat))
    || (offer.last_update_at && moment(offer.last_update_at).format(dateFormat))
    || 'unknown'
  const last = (offer.twokey_last_visit && moment(offer.twokey_last_visit).format(dateFormat))
    || (offer.twokey_created_at && moment(offer.twokey_created_at).format(dateFormat))
    || 'unknown'
  if (showRecommendOptions) {
    return null
  }

  if (isInactive) {
    return (
      <div className={`offer-cube__publish-date ${smokedOut}`}>
        <FormattedMessage
          id="campaign_tile.ended"
          defaultMessage="!Ended {ended}"
          values={{
            ended
          }}
        />
      </div>
    )
  }

  if (offer.user_role === userRoles.INFLUENCER) {
    return (
      <div className={`offer-cube__publish-date ${smokedOut}`} style={{ color: '#434343' }}>
        <FormattedMessage
          id="campaign_tile.last_activity"
          defaultMessage="!Last Activity {last}"
          values={{
            last
          }}
        />
      </div>
    )
  }

  return (
    <div className={`offer-cube__publish-date ${smokedOut}`}>
      <FormattedMessage
        id="campaign_tile.published"
        defaultMessage="!Published {at}"
        values={{
          at: moment(offer.created_at).format(dateFormat)
        }}
      />
    </div>
  )
}

CampaignDate.propTypes = {
  offer: PropTypes.object.isRequired,
  isInactive: PropTypes.bool,
  showRecommendOptions: PropTypes.string
}

export default injectIntl(CampaignDate)
