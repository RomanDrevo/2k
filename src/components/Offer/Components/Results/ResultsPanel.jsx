import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl'
import { ArrowBox, DateRangePicker, DisplayField, Grid, IconButton } from '../../../_common'
import LeadDisputeForm from './LeadDisputeForm'
import loadingImg from '../../../../loading.svg'
import './ResultsPanel.css'

class CampaignResultsPanel extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    isMobile: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      expandedLeadStatusRows: [],
      arrowOffset: null,
      filteredLeads: props.results ? props.results.leads : [],
      dateRange: [moment().startOf('isoWeek'), moment().endOf('isoWeek')]
    }

    this.lastStatusTrigger = null
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading && nextProps.results) {
      this.filterLeads(nextProps.results.leads, this.state.dateRange)
    }
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

  handleResize = () => {
    this.invalidateArrowOffset()
  }

  refContainer = (e) => {
    this.container = e
  }

  filterLeads = (leads = [], range = []) => {
    const [start, end] = range
    const filteredLeads = [...leads]
      .filter((lead) => (!start || !end || (moment(lead.date).isBetween(start, end))))
    this.setState({ filteredLeads })
  }

  leadsDataColumns() {
    const { formatMessage } = this.props.intl

    return [{
      dataIndex: 'date',
      name: formatMessage({ id: 'campaign_results.date', defaultMessage: '!Date' }),
      sort: true,
      renderer: (record, val) => (moment(val).format('DD/MM/YY hh:mm'))
    }, {
      dataIndex: 'lead_name',
      name: formatMessage({ id: 'campaign_results.lead', defaultMessage: '!Lead' })
    }, {
      name: formatMessage({ id: 'campaign_results.status', defaultMessage: '!Status' }),
      renderer: this.renderLeadStatus
    }]
  }

  invalidateArrowOffset() {
    if (!this.lastStatusTrigger) return
    const { x, width } = this.getClientRect(this.lastStatusTrigger)
    if (this.state.arrowOffset !== x + (width / 2)) {
      this.setState({ arrowOffset: x + (width / 2) })
    }
  }

  expandLeadStatusRow = (lead, e) => {
    this.lastStatusTrigger = e.currentTarget
    this.invalidateArrowOffset()
    const { expandedLeadStatusRows } = this.state

    if (expandedLeadStatusRows.indexOf(lead) === -1) {
      expandedLeadStatusRows.push(lead)
      this.setState({ expandedLeadStatusRows })
    }
  }

  collapseLeadStatusRow = (lead) => {
    const { expandedLeadStatusRows } = this.state

    const index = expandedLeadStatusRows.indexOf(lead)
    if (index > -1) {
      expandedLeadStatusRows.splice(index, 1)
      this.setState({ expandedLeadStatusRows })
    }
  }

  updateDateRange = (dateRange) => {
    this.setState({ dateRange })
    if (this.props.results) {
      this.filterLeads(this.props.results.leads, dateRange)
    }
  }

  renderLeadStatus = (record) => {
    const { verification_status } = record

    return (
      <div style={{ margin: 'auto', padding: '0 10px', textAlign: 'center' }}>
        {verification_status === 'APPROVED' && (
          <i className="fa fa-check" />
        )}
        {verification_status === 'REJECTED' && (
          <IconButton icon="close" onClick={(e) => this.expandLeadStatusRow(record, e)} />
        )}
        {verification_status === 'PENDING' && (
          <IconButton iconLetter="P" onClick={(e) => this.expandLeadStatusRow(record, e)} />
        )}
      </div>
    )
  }

  renderLeadStatusRow = (lead) => {
    const { verification_status } = lead
    const borderColor = verification_status === 'PENDING' ? '#1a936f' : '#D68686'
    return (
      <ArrowBox
        arrow="top"
        backgroundColor="white"
        borderColor={borderColor}
        borderWidth={2}
        borderRadius={0}
        arrowOffset={this.state.arrowOffset ? `${this.state.arrowOffset - 5}px` : undefined}
      >
        {verification_status === 'PENDING' && (
          <div className="flex">
            <div className="flex-1 text-center" style={{ color: '#434343' }}>
              <FormattedMessage
                id="campaign_results.waiting_approval"
                defaultMessage="!This Lead is waiting for Business Approval"
              />
            </div>
            <div>
              <IconButton style={{ color: '#434343' }} icon="close" onClick={() => this.collapseLeadStatusRow(lead)} />
            </div>
          </div>
        )}
        {verification_status === 'REJECTED' && (
          <LeadDisputeForm
            campaign={this.props.campaign}
            lead={lead}
            onClose={() => this.collapseLeadStatusRow(lead)}
            onDispute={(reason) => this.onLeadDispute(lead, reason)}
          />
        )}
      </ArrowBox>
    )
  }

  renderMobile() {
    const { campaign, results: { lifetime_results }, intl: { formatMessage } } = this.props
    const { filteredLeads, dateRange } = this.state

    return (
      <div ref={this.refContainer} className="influencer-campaign-results-panel mobile">
        <div className="header">
          <DisplayField
            className="font-middle dark-black"
            labelStyle={{ fontWeight: 'bold' }}
            label={formatMessage({ id: 'campaign_results.campaign', defaultMessage: '!Campaign' })}
            value={campaign.name}
          />
        </div>
        <div className="body">
          <div className="pd-15 summary-statistics">
            <div className="flex border-bottom">
              <div className="flex-1 border-right">
                <div className="value">
                  <FormattedNumber value={campaign.twokey_views} />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.views" defaultMessage="!Views" />
                </div>
              </div>
              <div className="flex-1 border-right">
                <div className="value">
                  <FormattedNumber
                    value={lifetime_results.total_earnings}
                    style="currency"
                    currency={campaign.currency}
                  />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.earnings" defaultMessage="!Earnings" />
                </div>
              </div>
              <div className="flex-1">
                <div className="value">
                  <FormattedNumber value={lifetime_results.conversions} />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.convertions" defaultMessage="!Convertions" />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 border-right">
                <div className="value">
                  <FormattedNumber value={lifetime_results.convertion_rate} />%
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.convertion_rate" defaultMessage="!Convertion Rate" />
                </div>
              </div>
              <div className="flex-1 border-right">
                <div className="value">
                  <FormattedNumber
                    value={lifetime_results.avg_cpa}
                    style="currency"
                    currency={campaign.currency}
                  />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.avg_cost_per_lead" defaultMessage="!Avg.Cost Per Lead" />
                </div>
              </div>
              <div className="flex-1">
                <div className="value">
                  <FormattedNumber value={lifetime_results.rejected} />%
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.rejected" defaultMessage="!Rejected" />
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-grid">
            <DateRangePicker
              onUpdate={this.updateDateRange}
              value={dateRange}
              className="campaignResultsDate"
            />
            <Grid
              striped
              columns={this.leadsDataColumns()}
              // data={leads}
              data={filteredLeads}
              expandedRowRenderer={this.renderLeadStatusRow}
              expandedRows={this.state.expandedLeadStatusRows}
            />
          </div>
        </div>
      </div>
    )
  }

  renderDesktop() {
    const { campaign, results: { lifetime_results }, intl: { formatMessage } } = this.props
    const { filteredLeads, dateRange } = this.state

    return (
      <div ref={this.refContainer} className="influencer-campaign-results-panel">
        <div className="header">
          <DisplayField
            className="font-middle dark-black"
            labelStyle={{ fontWeight: 'bold' }}
            label={formatMessage({ id: 'campaign_results.campaign', defaultMessage: '!Campaign' })}
            value={campaign.name}
          />
          <DateRangePicker onUpdate={this.updateDateRange} value={dateRange} />
        </div>
        <div className="body">
          <div className="pd-15 summary-statistics">
            <div className="flex">
              <div className="flex-1 border-right-light">
                <div className="value">
                  <FormattedNumber value={campaign.twokey_views} />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.views" defaultMessage="!Views" />
                </div>
              </div>
              <div className="flex-1 border-right-light">
                <div className="value">
                  <FormattedNumber value={lifetime_results.conversions} />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.convertions" defaultMessage="!Convertions" />
                </div>
              </div>
              <div className="flex-1 border-right-light">
                <div className="value">
                  <FormattedNumber value={lifetime_results.convertion_rate} />%
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.convertion_rate" defaultMessage="!Convertion Rate" />
                </div>
              </div>
              <div className="flex-1 border-right-light">
                <div className="value">
                  <FormattedNumber value={lifetime_results.rejected} />%
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.rejected" defaultMessage="!Rejected" />
                </div>
              </div>
              <div className="flex-1 border-right-light">
                <div className="value">
                  <FormattedNumber
                    value={lifetime_results.avg_cpa}
                    style="currency"
                    currency={campaign.currency}
                  />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.avg_cost_per_lead" defaultMessage="!Avg.Cost Per Lead" />
                </div>
              </div>
              <div className="flex-1">
                <div className="value">
                  <FormattedNumber
                    value={lifetime_results.total_earnings}
                    style="currency"
                    currency={campaign.currency}
                  />
                </div>
                <div className="label">
                  <FormattedMessage id="campaign_results.earnings" defaultMessage="!Earnings" />
                </div>
              </div>
            </div>
          </div>
          <div className="pd-5 results">
            <Grid
              striped
              columns={this.leadsDataColumns()}
              // data={leads}
              data={filteredLeads}
              expandedRowRenderer={this.renderLeadStatusRow}
              expandedRows={this.state.expandedLeadStatusRows}
            />
          </div>
        </div>
      </div>
    )
  }


  render() {
    return this.props.loading ? (
      <div className="loading">
        <img className="loader" src={loadingImg} alt="" />
      </div>
    ) : (
      <div>
        {this.props.isMobile && this.renderMobile()}
        {!this.props.isMobile && this.renderDesktop()}
      </div>
    )
  }
}


export default injectIntl(CampaignResultsPanel)
