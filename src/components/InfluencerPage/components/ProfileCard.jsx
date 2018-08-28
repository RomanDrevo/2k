import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Card, DisplayField, Slider, ProfilePicture } from '../../_common'
import StarField from './StarField'
import './profile-card.css'


const TIME_FILTER_OPTIONS = [{
  value: 'last_24h',
  label: 'Last 24h'
}, {
  value: 'last_7d',
  label: 'Last 7d'
}, {
  value: 'last_30d',
  label: 'Last 30 days'
}, {
  value: 'last_365d',
  label: 'Last 365d'
}, {
  value: 'lifetime',
  label: 'Lifetime'
}]

class ProfileCard extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    noData: PropTypes.bool,
    onFilterByTime: PropTypes.func,
    lastActivity: PropTypes.instanceOf(Date)
  }

  state = {
    timeFilter: TIME_FILTER_OPTIONS[2].value
  }

  onTimeFilterSelect = (item) => {
    if (this.state.timeFilter !== item.value) {
      this.setState({ timeFilter: item.value }, () => {
        if (this.props.onFilterByTime) this.props.onFilterByTime(item.value)
      })
    }
  }

  greeting() {
    const { intl: { formatMessage } } = this.props
    const hours = new Date().getHours()
    if (hours <= 12) {
      return formatMessage({ id: 'influencer.good_morning', defaultMessage: '!Good Morning' })
    } else if (hours > 12 && hours <= 17) {
      return formatMessage({ id: 'influencer.good_afternoon', defaultMessage: '!Good Afternoon' })
    }
    return formatMessage({ id: 'influencer.good_evening', defaultMessage: '!Good Evening' })
  }

  renderMobile() {
    const {
      intl: { formatMessage, formatNumber }, user, summary, noData, lastActivity
    } = this.props
    const dataByTime = summary && summary.results
      ? (summary.results[this.state.timeFilter] || {}) : {}
    const asCurrency = summary.currency
      ? { style: 'currency', currency: summary.currency } : {
        style: 'decimal'
      }

    return (
      <div className="profile-card-wrapper">
        <div className="pd-5">
          <div className="flex">
            <div className="flex flex-1">
              <div className="greeting-txt">
                {this.greeting()},&nbsp;<b>{user.first_name || user.given_name}</b>
              </div>
              <div>
                <StarField value={summary.reputation_score} />
              </div>
            </div>
            <div className="value green font-x-normal text-right">
              <FormattedMessage
                id="influencer.total_earnings"
                defaultMessage="!Total Earnings {total}"
                values={{
                  total: isEmpty(summary) ? '$0.0'
                    : formatNumber(summary.total_earnings || 0, asCurrency)
                }}
              />
            </div>
          </div>
          <div className="flex">
            <div className="flex-1">
              <DisplayField
                valueStyle={{ fontWeight: 500 }}
                label={formatMessage({ id: 'influencer.last_activity', defaultMessage: '!Last Activity' })}
                value={lastActivity ? moment(lastActivity).fromNow() : ''}
              />
            </div>
            <div>
              <DisplayField
                colon={false}
                valueStyle={{ fontWeight: 500 }}
                label={formatMessage({ id: 'influencer.current_balance', defaultMessage: '!Current Balance' })}
                value={isEmpty(summary) ? ' $0.0'
                  : formatNumber(summary.current_balance || 0, asCurrency)}
              />
            </div>
          </div>
        </div>
        <div>
          {!noData ? (
            <Slider
              options={TIME_FILTER_OPTIONS}
              value={this.state.timeFilter}
              onSelect={this.onTimeFilterSelect}
            />
          ) : (
            <div className="no-results">
              <FormattedMessage
                id="influencer.no_activity"
                defaultMessage="!No Activity yet, We are ready when you are"
              />
            </div>
          )}
        </div>
        <div className="pd-15 summary-statistics">
          <div className="flex">
            <div className="flex-1 border-right-light">
              <div className="value" title={numeral(dataByTime.views).format('0,0')}>
                {noData ? 0 : numeral(dataByTime.views).format('0a')}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.views" defaultMessage="!Views" />
              </div>
            </div>
            <div className="flex-1 border-right-light">
              <div className="value" title={numeral(dataByTime.conversions).format('0,0')}>
                {noData ? 0 : numeral(dataByTime.conversions).format('0a')}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.conversions" defaultMessage="!Conversions" />
              </div>
            </div>
            <div className="flex-1 border-right-light">
              <div
                className="value"
                title={numeral(dataByTime.rejected).format('0,0')}
              >{noData ? 0 : numeral(dataByTime.rejected).format('0a')}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.rejected" defaultMessage="!Rejected" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="value"
                title={isEmpty(summary) ? ' $0' : numeral(dataByTime.earnings).format('0,0')}
              >
                {formatNumber(dataByTime.earnings || 0, asCurrency)}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.earnings" defaultMessage="!Earnings" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderDesktop() {
    const {
      intl: { formatMessage, formatNumber }, user, summary, noData, lastActivity
    } = this.props
    const dataByTime = summary && summary.results
      ? summary.results[this.state.timeFilter] || {} : {}
    const asCurrency = summary.currency
      ? { style: 'currency', currency: summary.currency } : {
        style: 'decimal'
      }

    return (
      <div className="profile-card-wrapper">
        <div className="profile-pic-wrapper">
          <div className="profile-pic-top-bg">
            <div className="flex-1">
              <DisplayField
                valueStyle={{ fontWeight: 500 }}
                label={formatMessage({ id: 'influencer.last_activity', defaultMessage: '!Last Activity' })}
                value={lastActivity ? moment(lastActivity).fromNow() : ''}
              />
            </div>
            <div><StarField value={summary.reputation_score} /></div>
          </div>
          <div className="profile-pic-bottom-bg" />
          <div className="profile-pic-body">
            <div>
              <div className="profile-pic-img">
                <ProfilePicture
                  size={80}
                  picture={user.profile_media_url}
                  first_name={user.first_name || user.given_name}
                  last_name={user.last_name || user.family_name}
                />
              </div>
              <div className="greeting-txt">{this.greeting()},&nbsp;
                <b>{user.first_name || user.given_name}</b>
              </div>
            </div>
          </div>
        </div>
        <div className="flex" style={{ alignItems: 'flex-end', padding: '5px 7px' }}>
          <div>
            <div
              className="value green large"
              title={isEmpty(summary) ? '$0.0' : numeral(summary.total_earnings).format('0,0')}
            >
              {isEmpty(summary) ? '$0.0'
                : formatNumber(summary.total_earnings || 0, asCurrency)}
            </div>
            <div className="label green font-x-normal">
              <FormattedMessage
                id="influencer.total_earnings"
                defaultMessage="!Total Earnings {total}"
                values={{
                  total: ''
                }}
              />
            </div>
          </div>
          <div className="flex-1" style={{ textAlign: 'right' }}>
            <DisplayField
              className="dark-black font-x-normal"
              valueStyle={{ fontWeight: 500 }}
              label={formatMessage({ id: 'influencer.current_balance', defaultMessage: '!Current Balance' })}
              value={isEmpty(summary) ? ' $0.0'
                : formatNumber(summary.current_balance || 0, asCurrency)}
            />
            <DisplayField
              className="font-x-normal"
              valueStyle={{ fontWeight: 500 }}
              label={formatMessage({ id: 'influencer.pending', defaultMessage: '!Pending' })}
              value={isEmpty(summary) ? '$0.0'
                : formatNumber(summary.current_balance_pending || 0, asCurrency)}
            />
          </div>
        </div>
        <div>
          {!noData ? (
            <Slider
              options={TIME_FILTER_OPTIONS}
              value={this.state.timeFilter}
              onSelect={this.onTimeFilterSelect}
            />
          ) : (
            <div className="no-results">
              <FormattedMessage
                id="influencer.no_activity"
                defaultMessage="!No Activity yet, We are ready when you are"
              />
            </div>
          )}
        </div>
        <div className="pd-15 summary-statistics">
          <div className="flex border-bottom-light">
            <div className="flex-1 border-right-light">
              <div
                className="value"
                title={numeral(dataByTime.views).format('0,0')}
              >{noData ? 0 : numeral(dataByTime.views).format('0a')}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.views" defaultMessage="!Views" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="value"
                title={numeral(dataByTime.conversions).format('0,0')}
              >{noData ? 0 : numeral(dataByTime.conversions).format('0a')}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.conversions" defaultMessage="!Conversions" />
              </div>
            </div>
          </div>
          <div className="flex border-bottom-light">
            <div className="flex-1 border-right-light">
              <div
                className="value"
                title={numeral(dataByTime.rejected).format('0,0')}
              >{noData ? 0 : numeral(dataByTime.rejected).format('0a')}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.rejected" defaultMessage="!Rejected" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="value"
                title={isEmpty(summary) ? '$0' : numeral(dataByTime.earnings).format('0,0')}
              >
                {formatNumber(dataByTime.earnings || 0, asCurrency)}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.earnings" defaultMessage="!Earnings" />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1 border-right-light">
              <div className="value">{noData ? 0 : dataByTime.conversion_rate}%</div>
              <div className="label">
                <FormattedMessage id="influencer.convertion_rate" defaultMessage="!Convertion Rate" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="value"
                title={isEmpty(summary) ? '$0' : numeral(dataByTime.avg_earn_per_lead).format('0,0')}
              >
                {formatNumber(dataByTime.avg_earn_per_lead || 0, asCurrency)}
              </div>
              <div className="label">
                <FormattedMessage id="influencer.avg_cost_per_lead" defaultMessage="!Avg. Cost Per Lead" />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center pd-10">
          <div>
            <DisplayField
              style={{ color: '#1A936F', fontSize: 13 }}
              label={formatMessage({ id: 'influencer.total_campaigns', defaultMessage: '!Total Campaigns' })}
              value={isEmpty(summary) ? '0' : summary.n_total_campaigns}
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    // TODO: Fix the ugly "media query" rendering to a more understood way.
    const isMobile = this.props.isMobile || window.innerWidth <= 768

    const style = {}
    if (isMobile) style.borderRadius = 5
    return (
      <Card style={style}>
        {isMobile ? this.renderMobile() : this.renderDesktop()}
      </Card>
    )
  }
}

export default injectIntl(ProfileCard)
