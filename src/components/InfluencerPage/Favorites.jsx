import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { InfluencerActions } from '../../_redux'
import { EarningsCard, FindBusinessCard, ProfileCard } from './components'
import OfferCube from '../Offer'
import InfluencerWrapper from '../Offer/Components/InfluencerWrapper'
import Menu from './Menu'

class Favorites extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    user: PropTypes.object,
    summary_data: PropTypes.object,
    campaigns_data: PropTypes.object,
    balance_data: PropTypes.object,
    FETCH_INFLUENCER_SUMMARY: PropTypes.func.isRequired,
    FETCH_INFLUENCER_BALANCE: PropTypes.func.isRequired,
    FETCH_INFLUENCER_CAMPAIGNS: PropTypes.func.isRequired,
    last_activity: PropTypes.string
  }

  componentWillMount() {
    this.props.FETCH_INFLUENCER_SUMMARY()
    this.props.FETCH_INFLUENCER_BALANCE()
    this.props.FETCH_INFLUENCER_CAMPAIGNS()
  }

  onFilterByTime = (time) => {
    console.log(time)
  }

  renderDesktop() {
    const {
      user, summary_data, balance_data, last_activity, campaigns_data
    } = this.props
    const noData = !campaigns_data || !campaigns_data.likes || campaigns_data.likes.length === 0

    return (
      <div className="container flex">
        <div>
          <ProfileCard
            user={user}
            lastActivity={last_activity}
            summary={summary_data}
            noData={noData}
            onFilterByTime={this.onFilterByTime}
          />
          <EarningsCard data={balance_data} />
          <FindBusinessCard />
        </div>
        <div className="flex-1 text-left ml-10" style={{ maxWidth: 1100 }}>
          {noData ? (
            <div className="no-results-wrapper">
              <div className="no-results-icon">
                <img src="/img/placeholder-no-favorites.png" alt="" />
              </div>
              <div className="no-results-message">
                <FormattedMessage id="influencer.no_favorites" defaultMessage="There are no favorites yet" />
              </div>
            </div>
          ) : (
            <div>
              {campaigns_data.likes && campaigns_data.likes.map((campaign) => (
                <InfluencerWrapper key={campaign.id} offer={campaign}>
                  <OfferCube
                    offer={campaign}
                    onResults={() => this.onCampaignResults(campaign)}
                  />
                </InfluencerWrapper>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  renderMobile() {
    const {
      isMobile, user, summary_data, last_activity, campaigns_data
    } = this.props
    const noData = !campaigns_data || !campaigns_data.likes || campaigns_data.likes.length === 0

    return (
      <div>
        <ProfileCard
          user={user}
          lastActivity={last_activity}
          summary={summary_data}
          isMobile={isMobile}
          noData={noData}
          onFilterByTime={this.onFilterByTime}
        />
        <Menu isMobile />
        <div className="flex-1 text-left ml-10">
          {noData ? (
            <div className="no-results-wrapper">
              <div className="no-results-icon">
                <img src="/img/placeholder-no-favorites.png" alt="" />
              </div>
              <div className="no-results-message">
                <FormattedMessage id="influencer.no_favorites" defaultMessage="There are no favorites yet" />
              </div>
            </div>
          ) : (
            <div>
              {campaigns_data.likes && campaigns_data.likes.map((campaign) => (
                <InfluencerWrapper key={campaign.id} offer={campaign}>
                  <OfferCube
                    offer={campaign}
                    onResults={() => this.onCampaignResults(campaign)}
                  />
                </InfluencerWrapper>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.props.isMobile ? this.renderMobile() : this.renderDesktop()}
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  return {
    user: { ...userMetadata },
    isMobile: state.general.get('isMobile'),
    summary_data: state.influencer.get('summary_data').toJS(),
    campaigns_data: state.influencer.get('campaigns_data').toJS(),
    balance_data: state.influencer.get('balance_data').toJS(),
    last_activity: state.influencer.get('last_activity')
  }
}, {
  FETCH_INFLUENCER_SUMMARY: InfluencerActions.FETCH_INFLUENCER_SUMMARY,
  FETCH_INFLUENCER_BALANCE: InfluencerActions.FETCH_INFLUENCER_BALANCE,
  FETCH_INFLUENCER_CAMPAIGNS: InfluencerActions.FETCH_INFLUENCER_CAMPAIGNS
})(Favorites))
