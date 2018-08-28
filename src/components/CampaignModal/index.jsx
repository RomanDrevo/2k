import React from 'react'
import Loadable from 'react-loadable'
import Loading from '../_common/Loading'

const CreateCampaign = Loadable({
  loading: Loading,
  loader: () => import('./CampaignEdit')
})
const EditCampaign = Loadable({
  loading: Loading,
  loader: () => import('./CampaignCreate')
})

export const CampaignEditModal = () => <CreateCampaign />
export const CampaignCreateModal = () => <EditCampaign />
