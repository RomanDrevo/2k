import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl'

const CampaignAdminMeta = ({ offer }) => (
  <div className="offer-cube__admin-meta">
    <div className="meta-item">
      <span className="meta-value">
        <FormattedNumber value={offer.n_generated_views} />
      </span>
      <span className="meta-desc">
        <FormattedMessage id="campaign_tile.reach" defaultMessage="!Reach" />
      </span>
    </div>

    <div className="meta-item">
      <span className="meta-value">
        <FormattedNumber value={offer.n_generated_actions} />
      </span>
      <span className="meta-desc">
        <FormattedMessage id="campaign_tile.results" defaultMessage="!Results" />
      </span>
    </div>

    <div className="meta-item red">
      <span className="meta-value">
        <FormattedNumber value={offer.n_generated_actions_pending_approval} />
      </span>
      <span className="meta-desc">
        <FormattedMessage id="campaign_tile.pending" defaultMessage="!Pending" />
      </span>
    </div>

    <div className="meta-item">
      <span className="meta-value">
        <FormattedNumber
          style="currency"
          currency={offer.currency}
          value={offer.remaining_budget}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
      </span>
      <span className="meta-desc">
        <FormattedMessage id="campaign_tile.left" defaultMessage="!Left" />
      </span>
    </div>
  </div>
)

CampaignAdminMeta.propTypes = {
  offer: PropTypes.object.isRequired
}

export default injectIntl(CampaignAdminMeta)
