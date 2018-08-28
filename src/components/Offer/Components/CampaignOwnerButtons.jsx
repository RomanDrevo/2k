import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const CampaignOwnerButtons = ({
  isInactive, handlePublishClick, handleEditClick, handleActivateClick
}) => (
  <div className="offer-cube__button-owner-advertiser">
    {isInactive ? (
      <a onClick={handleActivateClick} className="button-publish-activate">
        <FormattedMessage
          id="campaign_tile.activate"
          defaultMessage="!Activate"
        />
      </a>
    ) : (
      <a onClick={handlePublishClick} className="button-publish-activate">
        <i className="fa fa-bullhorn" />
        <FormattedMessage
          id="campaign_tile.publish"
          defaultMessage="!Publish"
        />
      </a>
    )}
    <a onClick={handleEditClick} className="button-edit-results">
      <FormattedMessage
        id="campaign_tile.edit_results"
        defaultMessage="!Edit/Results"
      />
    </a>
  </div>
)

CampaignOwnerButtons.propTypes = {
  isInactive: PropTypes.bool,
  handlePublishClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleActivateClick: PropTypes.func
}

export default injectIntl(CampaignOwnerButtons)
