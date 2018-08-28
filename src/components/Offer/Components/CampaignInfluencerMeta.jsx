import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedNumber, FormattedMessage } from 'react-intl'
import { CirclePercentBar } from '../../_common'

const CampaignInfluencerMeta = ({
  offer, intl: { formatNumber, formatMessage }
}) => {
  const wins = formatNumber(offer.twokey_actions_approved || 0)
  const earnings = offer.twokey_total_earned
    ? formatNumber(offer.twokey_total_earned, {
      style: 'currency',
      currency: offer.currency
    }) : 0
  const earningsPercent = Math.round(((offer.twokey_total_earned || 0) / ((offer.bid_amount || 0) * 10)) * 100)
  const labelWins = formatMessage({
    id: 'campaign_tile.wins',
    defaultMessage: '!wins'
  })
  const labelEarnings = formatMessage({
    id: 'campaign_tile.earnings',
    defaultMessage: '!earnings'
  })
  const toCash = offer.twokey_total_balance
    ? formatNumber(offer.twokey_total_balance, {
      style: 'currency',
      currency: offer.currency
    }) : 0
  return (
    <div className="offer-cube__influencer-meta">
      <div className="meta-item">
        <CirclePercentBar
          sqSize={66}
          percentage={100}
          backStrokeWidth={3}
          progressStrokeWidth={5}
          backgroundColor="#c2bfbf"
          progressColor="#1a936f"
          numberText={wins}
          labelText={labelWins}
        />
        <FormattedMessage
          id="campaign_tile.views"
          defaultMessage="!{views} Views"
          values={{
            views: offer.twokey_views
          }}
        />
      </div>

      <div className="meta-item">
        <span className="meta-value green">
          <FormattedNumber value={offer.twokey_actions_pending || 0} />
        </span>
        <span className="meta-desc green">
          <FormattedMessage id="campaign_tile.pending" defaultMessage="!Pending" />
        </span>
        <span className="meta-value red">
          <FormattedNumber value={offer.twokey_actions_rejected || 0} />
        </span>
        <span className="meta-desc red">
          <FormattedMessage id="campaign_tile.rejected" defaultMessage="!Rejected" />
        </span>
      </div>

      <div className="meta-item">
        <CirclePercentBar
          sqSize={66}
          percentage={earningsPercent}
          backStrokeWidth={3}
          progressStrokeWidth={5}
          backgroundColor="#89d498"
          progressColor="#1a936f"
          numberText={earnings}
          labelText={labelEarnings}
        />
        <FormattedMessage
          id="campaign_tile.to_cash_value"
          defaultMessage="!{toCash} To cash"
          values={{ toCash }}
        />
      </div>
    </div>
  )
}

CampaignInfluencerMeta.propTypes = {
  offer: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
}

export default injectIntl(CampaignInfluencerMeta)
