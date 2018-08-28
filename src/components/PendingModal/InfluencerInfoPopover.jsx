import PropTypes from 'prop-types'
import React from 'react'
import { Popover } from '../_common'
import InfluencerInfoCard from './InfluencerInfoCard'

const InfluencerInfoPopover = ({
  clientRect, lead, closeInfluencerInfoPopover, pendings
}) => {
  if (clientRect === undefined || lead === undefined) {
    return null
  }

  const influencerInfo = Object.assign({
    email: lead.influencer_email,
    name: lead.influencer_name,
    phone: lead.lead_contact_number
  }, pendings.influencer_to_stats[lead.influencer_email])


  return (
    <Popover
      clientRect={clientRect}
      size={{ width: 307, height: 176 }}
      arrow="top"
      borderColor="green"
      onRequestClose={closeInfluencerInfoPopover}
    >
      <InfluencerInfoCard data={influencerInfo} onClose={closeInfluencerInfoPopover} />
    </Popover>
  )
}

InfluencerInfoPopover.propTypes = {
  clientRect: PropTypes.object,
  lead: PropTypes.object,
  pendings: PropTypes.object,
  closeInfluencerInfoPopover: PropTypes.func.isRequired
}

export default InfluencerInfoPopover
