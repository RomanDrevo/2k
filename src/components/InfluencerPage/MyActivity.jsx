import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import Collapsible from 'react-collapsible'
import { InfluencerActions } from '../../_redux'
import { EarningsCard, FindBusinessCard, ProfileCard } from './components'
import OfferCube from '../Offer'
import InfluencerWrapper from '../Offer/Components/InfluencerWrapper'
import Menu from './Menu'

class MyActivity extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    last_activity: PropTypes.instanceOf(Date),
    user: PropTypes.object,
    summary_data: PropTypes.object,
    campaigns_data: PropTypes.array,
    balance_data: PropTypes.object,
    FETCH_INFLUENCER_SUMMARY: PropTypes.func.isRequired,
    FETCH_INFLUENCER_BALANCE: PropTypes.func.isRequired,
    FETCH_INFLUENCER_CAMPAIGNS: PropTypes.func.isRequired
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
    const noData = !campaigns_data
      || (!campaigns_data.active && !campaigns_data.inactive)
      || (campaigns_data.active.length === 0 && campaigns_data.inactive.length === 0)

    return (
      <div className="container flex">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
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
          <div className="col-sm-12 col-lg-9">
            {noData ? (
              <div className="no-results-wrapper">
                <div className="no-results-icon">
                  <img src="/img/placeholder-no-activities.png" alt="" />
                </div>
                <div className="no-results-message">
                  <FormattedMessage id="influencer.no_results" defaultMessage="!There are no results yet" />
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <div className="campaign-category-title-wrapper ml-10">
                    <FormattedMessage
                      id="influencer.active_business"
                      defaultMessage="!Active {active}, Business {business}"
                      values={{
                        active: campaigns_data.n_active,
                        business: campaigns_data.n_businesses_active
                      }}
                    />
                  </div>
                  <div className="row no-gutters">
                    {campaigns_data.active && campaigns_data.active.map((campaign) => (
                      <InfluencerWrapper key={campaign.id} offer={campaign}>
                        <OfferCube
                          offer={campaign}
                        />
                      </InfluencerWrapper>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="campaign-category-title-wrapper ml-10">
                    <FormattedMessage
                      id="influencer.inactive_business"
                      defaultMessage="!Ended {inactive}, Business {business}"
                      values={{
                        inactive: campaigns_data.n_inactive,
                        business: campaigns_data.n_businesses_inactive
                      }}
                    />
                  </div>
                  <div className="row no-gutters">
                    {
                      campaigns_data.inactive && campaigns_data.inactive.map((campaign) => (
                        <InfluencerWrapper key={campaign.id} offer={campaign}>
                          <OfferCube
                            offer={campaign}
                          />
                        </InfluencerWrapper>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderMobile() {
    const {
      isMobile, user, summary_data, last_activity, campaigns_data
    } = this.props
    const noData = !campaigns_data
      || (!campaigns_data.active && !campaigns_data.inactive)
      || (campaigns_data.active.length === 0 && campaigns_data.inactive.length === 0)
    const triggerEl = (type, open) => {
      if (type === 'active' || type === 'inactive') {
        return (
          <div className="campaign-category-title-wrapper mobile">
            <span className="green">
              <i className={`fa fa-${open ? 'minus' : 'plus'}`} />
            </span>&nbsp;
            {type === 'active' ? (
              <FormattedMessage
                id="influencer.active_business"
                defaultMessage="!Active {active}, Business {business}"
                values={{
                  active: campaigns_data.n_active,
                  business: campaigns_data.n_businesses_active
                }}
              />
            ) : (
              <FormattedMessage
                id="influencer.inactive_business"
                defaultMessage="!Ended {inactive}, Business {business}"
                values={{
                  inactive: campaigns_data.n_inactive,
                  business: campaigns_data.n_businesses_inactive
                }}
              />
            )}
          </div>
        )
      }
      return null
    }

    return (
      <div>
        <div className="container">
          <ProfileCard
            user={user}
            lastActivity={last_activity}
            summary={summary_data}
            isMobile={isMobile}
            noData={noData}
            onFilterByTime={this.onFilterByTime}
          />
        </div>
        <Menu isMobile />
        <div className="flex-1 text-left">
          {noData ? (
            <div className="no-results-wrapper">
              <div className="no-results-icon">
                <img src="/img/placeholder-no-activities.png" alt="" />
              </div>
              <div className="no-results-message">
                <FormattedMessage id="influencer.no_results" defaultMessage="!There are no results yet" />
              </div>
            </div>
          ) : (
            <div>
              <div>
                <Collapsible
                  open
                  trigger={triggerEl('active')}
                  triggerWhenOpen={triggerEl('active', true)}
                >
                  <div className="text-center">
                    {campaigns_data.active && campaigns_data.active.map((campaign) => (
                      <InfluencerWrapper key={campaign.id} offer={campaign}>
                        <OfferCube
                          offer={campaign}
                        />
                      </InfluencerWrapper>
                    ))}
                  </div>
                </Collapsible>
              </div>
              <div>
                <Collapsible
                  trigger={triggerEl('inactive')}
                  triggerWhenOpen={triggerEl('inactive', true)}
                >
                  <div className="text-center">
                    {campaigns_data.inactive && campaigns_data.inactive.map((campaign) => (
                      <InfluencerWrapper key={campaign.id} offer={campaign}>
                        <OfferCube
                          offer={campaign}
                        />
                      </InfluencerWrapper>
                    ))}
                  </div>
                </Collapsible>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="my-activity">
        {this.props.isMobile ? this.renderMobile() : this.renderDesktop()}
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const userMetadata = state.user.get('userMetadata').toJS()
  const last_activity = state.influencer.get('last_activity')
  return {
    user: { ...userMetadata },
    isMobile: state.general.get('isMobile'),
    summary_data: state.influencer.get('summary_data').toJS(),
    campaigns_data: state.influencer.get('campaigns_data').toJS().influencer,
    balance_data: state.influencer.get('balance_data').toJS(),
    last_activity
  }
}, {
  FETCH_INFLUENCER_SUMMARY: InfluencerActions.FETCH_INFLUENCER_SUMMARY,
  FETCH_INFLUENCER_BALANCE: InfluencerActions.FETCH_INFLUENCER_BALANCE,
  FETCH_INFLUENCER_CAMPAIGNS: InfluencerActions.FETCH_INFLUENCER_CAMPAIGNS
})(MyActivity))
