import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  injectIntl, FormattedMessage, FormattedDate, FormattedTime, FormattedNumber
} from 'react-intl'
import { connect } from 'react-redux'
import campaignActions from '../../_redux/campaign/actions'
import { exportToCSV } from '../../_core/utils'
import { Button, DateRangePicker, Grid, IconButton, ListView, Popover, StackAreaChart, DisplayField } from '../_common'
import InfluencerInfoCard from '../PendingModal/InfluencerInfoCard'
import SpentChart from './SpentChart'
import LeadStatusForm from './LeadStatusForm'
import ResultSortList, { SORT_BY_ACTIVITY, SORT_BY_NAME } from './ResultSortList'
import './campaign.css'

class CampaignResultPanel extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    intl: PropTypes.object,
    results: PropTypes.object.isRequired,
    FETCH_CAMPAIGN_RESULTS: PropTypes.func.isRequired,
    editCampaignId: PropTypes.number,
    campaign: PropTypes.object,
    SORT_CAMPAIGN_RESULTS: PropTypes.func,
    UPDATE_CAMPAIGN_RESULTS: PropTypes.func,
    VerificationStatus: PropTypes.object
  }

  state = {
    dateCategory: 'last_month',
    dateValue: [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],

    statusPopover: {},
    influencerInfoPopover: {},
    sortPopover: {},
    sortLeads: {
      by: null,
      asc: false
    }
  }

  componentWillMount() {
    const { FETCH_CAMPAIGN_RESULTS, editCampaignId } = this.props
    FETCH_CAMPAIGN_RESULTS(editCampaignId)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  getClientRect(trigger) {
    const triggerRect = trigger.getBoundingClientRect()
    const containerRect = this.container.getBoundingClientRect()

    return {
      x: triggerRect.x - containerRect.x,
      y: (triggerRect.y - containerRect.y) + (this.props.isMobile ? 47 : 60),
      width: triggerRect.width,
      height: triggerRect.height
    }
  }

  getAreaChartData(data) {
    if (!data) {
      return []
    }
    const { dateValue } = this.state
    return data.filter(({ date }) => {
      const dateObj = moment(date)
      return dateObj >= dateValue[0] && dateObj <= dateValue[1]
    })
  }

  handleResize = () => {
    const { statusPopover, influencerInfoPopover, sortPopover } = this.state

    if (!_.isEmpty(statusPopover)) {
      statusPopover.clientRect = this.getClientRect(statusPopover.trigger)
      this.setState({ statusPopover })
    } else if (!_.isEmpty(influencerInfoPopover)) {
      influencerInfoPopover.clientRect = this.getClientRect(influencerInfoPopover.trigger)
      this.setState({ influencerInfoPopover })
    } else if (!_.isEmpty(sortPopover)) {
      sortPopover.clientRect = this.getClientRect(sortPopover.trigger)
      this.setState({ sortPopover })
    }
  }

  areaChart(data) {
    return {
      data: this.getAreaChartData(data),
      xAxisInfo: { key: 'date', title: 'Date', formatter: (d) => moment(d).format('MMM DD') },
      yAxisInfo: [{ key: 'reach', title: 'Reach', color: '#86ECF6' }, {
        key: 'leads',
        title: 'Leads',
        color: '#57D589'
      }, {
        key: 'convertion_rate', title: 'Convertion Rate', unit: '%', color: '#1A936F'
      }]
    }
  }

  leadsDataColumns = () => {
    const { intl: { formatMessage } } = this.props
    return [{
      dataIndex: 'date',
      name: formatMessage({ id: 'campaign_results.date', defaultMessage: '!Date' }),
      sort: true,
      renderer: (record, val) => moment(val).format('DD/MM/YY hh:mm')
    }, {
      dataIndex: 'influencer_name',
      name: formatMessage({ id: 'campaign_results.influencer', defaultMessage: '!Influencer' }),
      width: 150,
      columnRenderer: () => (
        <div className="column-label">
          <i className="fa fa-sort-desc" onClick={(e) => this.openSortPopover(e)} style={{ marginLeft: -10 }} />
          <FormattedMessage id="campaign_results.influencer" defaultMessage="!Influencer" />
        </div>
      ),
      renderer: (record) => (
        <div
          style={{ cursor: 'pointer' }}
          onMouseOver={(e) => this.openInfluencerInfoPopover(e, record)}
        >
          {record.influencer_name || record.influencer_email}
        </div>
      )
    }, {
      dataIndex: 'lead_name',
      name: formatMessage({ id: 'campaign_results.lead', defaultMessage: '!Lead' })
    }, {
      dataIndex: 'lead_email',
      name: formatMessage({ id: 'campaign_results.mail', defaultMessage: '!Mail' }),
      flex: 2
    }, {
      dataIndex: 'lead_contact_number',
      name: formatMessage({ id: 'campaign_results.phone', defaultMessage: '!Phone' }),
      flex: 1
    }, {
      dataIndex: 'campaign_name',
      name: formatMessage({ id: 'campaign_results.campaign', defaultMessage: '!Campaign' }),
      sort: true,
      flex: 2
    }, {
      name: formatMessage({ id: 'campaign_results.status', defaultMessage: '!Status' }),
      renderer: this.renderItemActions
    }]
  }

  openStatusPopover = (e, lead, showApprove = true) => {
    const trigger = e.currentTarget
    this.setState({
      statusPopover: {
        clientRect: this.getClientRect(trigger),
        trigger,
        campaignLead: lead,
        showApprove
      },
      statusMessage: null
    })
  }

  closeStatusPopover = () => {
    this.setState({ statusPopover: {}, statusMessage: null })
  }

  openInfluencerInfoPopover = (e, lead) => {
    const trigger = e.currentTarget
    this.setState({
      influencerInfoPopover: {
        clientRect: this.getClientRect(trigger),
        trigger,
        lead
      }
    })
  }

  closeInfluencerInfoPopover = () => {
    this.setState({ influencerInfoPopover: {} })
  }

  openSortPopover = (e) => {
    const trigger = e.currentTarget
    this.setState({
      sortPopover: {
        clientRect: this.getClientRect(trigger),
        trigger
      }
    })
  }

  closeSortPopover = () => {
    this.setState({ sortPopover: {} })
  }

  handleReject = ({ campaign_lead_id, rejection_type, rejection_text }) => {
    const { results } = this.props

    const lead = results.leads.find((l) => l.campaign_lead_id === campaign_lead_id)
    if (lead) {
      lead.verification_status = this.props.VerificationStatus.Rejected
      lead.rejection_type = rejection_type
      lead.rejection_text = rejection_text
    }
    results.leads = [lead]
    const me = this

    this.props.UPDATE_CAMPAIGN_RESULTS(results)
      .then(() => me.setState({ statusMessage: me.props.intl.messages.we_will_look_into_it || 'We’ll look into it' }))
      .catch((err) => me.setState({ statusMessage: err.error || err.reason || err.message }))
  }

  handleApprove = (campaign_lead_id) => {
    const { results } = this.props
    const lead = results.leads.find((l) => l.campaign_lead_id === campaign_lead_id)
    if (lead) {
      lead.verification_status = this.props.VerificationStatus.Approved
      lead.rejection_type = null
      lead.rejection_text = null
    }
    results.leads = [lead]
    this.props.UPDATE_CAMPAIGN_RESULTS(results)
      .then(() => {
        this.setState({ statusMessage: this.props.intl.messages.lead_has_been_approved || 'Lead has been approved' })
      })
      .catch((err) => {
        this.setState({ statusMessage: err.error || err.reason || err.message })
      })
  }

  updateDateRange = (value, category) => {
    this.setState({ dateValue: value, dateCategory: category })
  }

  sortLeadsBy = (item) => {
    const { results } = this.props

    let { sortLeads: { by, asc } } = this.state
    let sortFunc
    if (item === SORT_BY_NAME) {
      if (by === SORT_BY_NAME) {
        asc = !asc
      } else {
        by = SORT_BY_NAME
        asc = true
      }
      sortFunc = (r1, r2) => (asc ?
        r1.influencer_name > r2.influencer_name
        :
        r1.influencer_name < r2.influencer_name
      )
    } else if (item === SORT_BY_ACTIVITY) {
      if (by === SORT_BY_ACTIVITY) {
        asc = !asc
      } else {
        by = SORT_BY_ACTIVITY
        asc = false
      }
      sortFunc = (r1, r2) => {
        const influencer1 = results.influencer_to_stats[r1.influencer_email]
        const influencer2 = results.influencer_to_stats[r2.influencer_email]
        return asc ?
          influencer1.n_leads_generated > influencer2.n_leads_generated
          :
          influencer1.n_leads_generated < influencer2.n_leads_generated
      }
    }

    this.setState({ sortPopover: {}, sortLeads: { by, asc } }, () => {
      this.props.SORT_CAMPAIGN_RESULTS(sortFunc)
    })
  }

  filteredLeads = (leads) => {
    if (!leads) return []

    const { dateValue } = this.state

    return leads.filter(({ date }) => {
      const dateObj = moment(date)
      return dateObj >= dateValue[0] && dateObj <= dateValue[1]
    })
  }

  exportDataToCSV = (leads) => {
    if (!leads || leads.length === 0) return

    const rows = [Object.keys(leads[0])]
    leads.forEach((lead) => {
      rows.push(Object.values(lead))
    })

    exportToCSV('leads.csv', rows)
  }

  refContainer = (e) => {
    this.container = e
  }

  renderItemActions = (record) => {
    const { verification_status } = record

    const approved = verification_status === this.props.VerificationStatus.Approved
    const rejected = verification_status === this.props.VerificationStatus.Rejected

    return (
      <div style={{ margin: 'auto', padding: '0 10px', textAlign: 'center' }}>
        {
          !approved && !rejected && (
            <div>
              <IconButton
                icon="close"
                style={{ background: '#D68686', color: 'white' }}
                onClick={(e) => this.openStatusPopover(e, record, false)}
              />&nbsp;&nbsp;
              <IconButton
                icon="check"
                style={{ background: '#57D589', color: 'white' }}
                onClick={() => this.handleApprove(record.campaign_lead_id)}
              />
            </div>
          )
        }
        {approved && <i className="fa fa-check" />}
        {rejected && <IconButton
          icon="close"
          style={{ background: '#747474', color: 'white' }}
          onClick={(e) => this.openStatusPopover(e, record)}
        />}
      </div>
    )
  }

  renderStatusPopover = () => {
    const {
      statusPopover: {
        clientRect, campaignLead
      }
    } = this.state

    if (clientRect === undefined || campaignLead === undefined) return ''

    return (
      <Popover
        clientRect={clientRect}
        size={{ width: 216, height: 250 }}
        arrow="right"
        borderColor="#D68686"
        onRequestClose={this.closeStatusPopover}
      >
        <LeadStatusForm
          campaignLead={campaignLead}
          onApprove={this.handleApprove}
          onReject={this.handleReject}
          responseMessage={this.state.statusMessage}
          onClose={this.closeStatusPopover}
          showApprove={this.state.showApprove}
        />
      </Popover>
    )
  }

  renderInfluencerInfoPopover = () => {
    const {
      influencerInfoPopover: {
        clientRect, lead
      }
    } = this.state

    if (clientRect === undefined || lead === undefined) return ''


    const influencerInfo = Object.assign({
      email: lead.influencer_email,
      name: lead.influencer_name,
      phone: lead.lead_contact_number
    }, this.props.results.influencer_to_stats[lead.influencer_email])
    return (
      <Popover
        clientRect={clientRect}
        size={{ width: 307, height: 176 }}
        arrow="top"
        borderColor="green"
        offsetX={this.props.isMobile ? 100 : 0}
        arrowOffset={this.props.isMobile ? '15%' : null}
        onRequestClose={this.closeInfluencerInfoPopover}
      >
        <InfluencerInfoCard data={influencerInfo} onClose={this.closeInfluencerInfoPopover} />
      </Popover>
    )
  }

  renderSortPopover = () => {
    const {
      sortPopover: { clientRect }
    } = this.state

    if (clientRect === undefined) return ''

    return (
      <Popover
        clientRect={clientRect}
        size={{ width: 100, height: 95 }}
        arrow="bottom"
        borderColor="darkgreen"
        onRequestClose={this.closeSortPopover}
      >
        <ResultSortList onSelect={this.sortLeadsBy} />
      </Popover>
    )
  }

  renderMobile() {
    const {
      campaign,
      results: { lifetime_results, leads },
      intl: { formatMessage }
    } = this.props

    const itemEl = (record) => (
      <div className="flex">
        <div className="flex-2 padding-5 align-center">
          <div className="description">
            {record.date && (<FormattedDate value={new Date(record.date)} />)}
          </div>
          <div className="description">
            {record.date && (<FormattedTime value={new Date(record.date)} />)}
          </div>
          <div
            className="name"
            style={{ cursor: 'pointer' }}
            onClick={(e) => this.openInfluencerInfoPopover(e, record)}
          >
            {record.influencer_name || record.influencer_email}
          </div>
        </div>
        <div className="flex-3 padding-5">
          <div className="name">{record.lead_name}</div>
          <div className="description">{record.lead_contact_number}</div>
          <div className="description">{record.lead_email}</div>
        </div>
        <div className="flex-2 padding-5 margin-auto">
          {this.renderItemActions(record)}
        </div>
      </div>
    )

    return (
      <div ref={this.refContainer} className="campaign-result-panel mobile">
        <div className="header">
          <div style={{ flex: 1 }}>
            <DisplayField
              className="large inverse black"
              label={formatMessage({ id: 'campaign_results.campaign', defaultMessage: '!Campaign' })}
              value={campaign.name}
            />
          </div>
        </div>
        <div className="body">
          <div className="pd-15 summary-statistics">
            <div className="flex border-bottom">
              <div className="flex-1 border-right">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber value={lifetime_results.reach} />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.people_reached" defaultMessage="!People Reached" />
                </div>
              </div>
              <div className="flex-1 border-right">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber value={lifetime_results.results} />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.results" defaultMessage="!Results" />
                </div>
              </div>
              <div className="flex-1">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber value={lifetime_results.influencers} />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.influencers" defaultMessage="!Influencers" />
                </div>
              </div>
            </div>
            <div className="flex border-bottom">
              <div className="flex-1 border-right">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber value={lifetime_results.conversion_rate} />
                  ) : '0'}%
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.conversion_rate" defaultMessage="!Conversion Rate" />
                </div>
              </div>
              <div className="flex-1 border-right">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber
                      value={lifetime_results.avg_cpa}
                      style="currency"
                      currency={lifetime_results.currency}
                    />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.cost_per_lead" defaultMessage="!Avg.Cost Per Lead" />
                </div>
              </div>
              <div className="flex-1">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber value={lifetime_results.rejected} />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.rejected" defaultMessage="!Rejected" />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 border-right">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber
                      value={lifetime_results.total_budget}
                      style="currency"
                      currency={lifetime_results.currency}
                    />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.total_budget" defaultMessage="!Total Budget" />
                </div>
              </div>
              <div className="flex-1 border-right">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber
                      value={lifetime_results.spent_budget}
                      style="currency"
                      currency={lifetime_results.currency}
                    />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.spend" defaultMessage="!Spend" />
                </div>
              </div>
              <div className="flex-1">
                <div className="value bold">
                  {lifetime_results ? (
                    <FormattedNumber
                      value={lifetime_results.remaining_budget}
                      style="currency"
                      currency={lifetime_results.currency}
                    />
                  ) : '0'}
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.remain" defaultMessage="!Remain" />
                </div>
              </div>
            </div>
          </div>
          <div className="pd-5">
            <div>
              <ListView striped data={this.filteredLeads(leads)} itemEl={itemEl} />
            </div>
          </div>
        </div>
        {this.renderStatusPopover()}
        {this.renderInfluencerInfoPopover()}
      </div>
    )
  }

  renderDesktop() {
    const {
      campaign,
      results: { lifetime_results, daily_high_level_results, leads },
      intl: { formatMessage, formatNumber, formatDate }
    } = this.props
    const areaChart = this.areaChart(daily_high_level_results)
    const leadData = this.filteredLeads(leads)

    return (
      <div ref={this.refContainer} className="campaign-result-panel">
        <div className="header">
          <div style={{ flex: 1 }}>
            <DisplayField
              className="large inverse black"
              label={formatMessage({ id: 'campaign_results.review_campaign', defaultMessage: '!Review Campaign' })}
              value={campaign.name}
            />
          </div>
          <div>
            <DateRangePicker
              onUpdate={this.updateDateRange}
              value={this.state.dateValue}
              category={this.state.dateCategory}
            />
          </div>
        </div>
        <div className="body flex">
          <div className="side">
            <div className="title border-bottom">
              <FormattedMessage id="campaign_results.lifetime_results" defaultMessage="!Lifetime Results" />
            </div>
            <div className="border-bottom padding-5">
              <div>
                <DisplayField
                  className="large black"
                  hyphenSymbol=" - "
                  label={formatMessage({ id: 'campaign_results.results', defaultMessage: '!Results' })}
                  value={lifetime_results ? formatNumber(lifetime_results.results) : '0'}
                />
              </div>
              <div>
                <DisplayField
                  className="large black"
                  hyphenSymbol=" - "
                  label={formatMessage({ id: 'campaign_results.influencers', defaultMessage: '!Influencers' })}
                  value={lifetime_results ? formatNumber(lifetime_results.influencers) : '0'}
                />
              </div>
            </div>
            <div className="border-bottom padding-5">
              <DisplayField
                className="large black block"
                colon={false}
                label={formatMessage({ id: 'campaign_results.people_reached', defaultMessage: '!People Reached' })}
                value={lifetime_results ? formatNumber(lifetime_results.reach) : '0'}
              />
            </div>
            <div className="border-bottom padding-5">
              <DisplayField
                className="large black block"
                colon={false}
                label={formatMessage({ id: 'campaign_results.cost_per_lead', defaultMessage: '!Avg.Cost Per Lead' })}
                value={lifetime_results
                  ? formatNumber(
                    lifetime_results.avg_cpa,
                    { style: 'currency', currency: lifetime_results.currency }
                  ) : '$0'}
              />
            </div>
            <div className="border-bottom padding-5">
              <DisplayField
                className="large black block"
                colon={false}
                label={formatMessage({ id: 'campaign_results.conversion_rate', defaultMessage: '!Conversion Rate' })}
                value={lifetime_results ? `${formatNumber(lifetime_results.conversion_rate)}%` : '0%'}
              />
            </div>
            <div className="border-bottom padding-5">
              <DisplayField
                className="large black block"
                colon={false}
                label={formatMessage({ id: 'campaign_results.rejected', defaultMessage: '!Rejected' })}
                value={lifetime_results ? formatNumber(lifetime_results.rejected) : '0'}
              />
            </div>
            <div className="border-bottom padding-5">
              <DisplayField
                className="large black block"
                colon={false}
                label={formatMessage({ id: 'campaign_results.total_budget', defaultMessage: '!Total Budget' })}
                value={lifetime_results
                  ? formatNumber(
                    lifetime_results.total_budget,
                    { style: 'currency', currency: lifetime_results.currency }
                  ) : '$0'}
              />
            </div>
            <div className="padding-5">
              <DisplayField
                className="large black block"
                colon={false}
                label={formatMessage({ id: 'campaign_results.ending_date', defaultMessage: '!Ending Date' })}
                value={lifetime_results && lifetime_results.campaign_ending_date
                  ? formatDate(new Date(lifetime_results.campaign_ending_date)) : ''}
              />
            </div>
          </div>
          <div className="flex-1 padding-5">
            <div className="flex">
              <div className="flex-1 margin-auto">
                <SpentChart
                  width={350}
                  spent_budget={lifetime_results ? lifetime_results.spent_budget : 0}
                  remaining_budget={lifetime_results ? lifetime_results.remaining_budget : 0}
                  currency={lifetime_results ? lifetime_results.currency : 'USD'}
                />
              </div>
              <div className="flex-1">
                <StackAreaChart
                  width={400}
                  data={areaChart.data}
                  xAxisInfo={areaChart.xAxisInfo}
                  yAxisInfo={areaChart.yAxisInfo}
                />
              </div>
            </div>
            <div>
              <Grid
                striped
                columns={this.leadsDataColumns()}
                data={leadData}
                initialSortDisabled
                emptyMessage={formatMessage({ id: 'campaign_results.no_data', defaultMessage: '!There is no data' })}
              />
            </div>
            <div className="modal-footer">
              <Button
                bsType="select"
                onClick={() => this.exportDataToCSV(leadData)}
                disabled={leadData.length === 0}
              >
                <i className="fa fa-download" />&nbsp;
                <FormattedMessage id="campaign_results.export" defaultMessage="!Export" />
              </Button>
            </div>
          </div>
        </div>
        {this.renderStatusPopover()}
        {this.renderInfluencerInfoPopover()}
        {this.renderSortPopover()}
      </div>
    )
  }

  render() {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop()
  }
}


export default connect(
  (state) => {
    const enums = state.enums.get('enums').toJS()
    return {
      campaign: state.campaign.get('campaign').toJS(),
      isMobile: state.general.get('isMobile'),
      results: state.campaign.get('results').toJS(),
      editCampaignId: state.campaign.get('editCampaignId'),
      // currencies: state.enums.get('enums').get('Currency').get('Currency').get('name_to_value')
      //   .toJS(),
      VerificationStatus: enums.VerificationStatus ?
        enums.VerificationStatus.VerificationStatus.value_to_name : {}
    }
  },
  {
    UPDATE_CAMPAIGN_RESULTS: campaignActions.UPDATE_CAMPAIGN_RESULTS,
    FETCH_CAMPAIGN_RESULTS: campaignActions.FETCH_CAMPAIGN_RESULTS,
    SORT_CAMPAIGN_RESULTS: campaignActions.SORT_CAMPAIGN_RESULTS
  }
)(injectIntl(CampaignResultPanel))
