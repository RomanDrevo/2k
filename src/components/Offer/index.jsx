import { connect } from 'react-redux'
import { CampaignActions, UserActions } from '../../_redux'
import OfferCube from './OfferCube'

const mapStateToProps = (state) => ({
  userMetadata: state.user.get('userMetadata').toJS(),
  recommendLoading: state.campaign.get('recommendLoading').toJS(),
  isMobile: state.general.get('isMobile'),
  windowWidth: state.general.get('windowWidth')
})

const mapDispatchToProps = {
  FETCH_CAMPAIGN_INFLUENCER_RESULTS: CampaignActions.FETCH_CAMPAIGN_INFLUENCER_RESULTS,
  SET_CAMPAIGN_DATA: CampaignActions.SET_CAMPAIGN_DATA,
  recommendCampaign: CampaignActions.RECOMMEND_CAMPAIGN,
  likeCampaign: UserActions.LIKE_CAMPAIGN,
  dislikeCampaign: UserActions.DISLIKE_CAMPAIGN
}

export default connect(mapStateToProps, mapDispatchToProps)(OfferCube)
