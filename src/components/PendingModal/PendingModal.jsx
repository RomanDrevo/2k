import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Modal from 'react-modal'
import moment from 'moment'
import swal from 'sweetalert2'
import { Button, Grid, IconButton, ListView, Spinner } from '../_common'
import { REJECT_TYPES } from './RejectForm'
import pendingActions from '../../_redux/pending/actions'
import { exportToCSV } from '../../_core/utils'
import RejectPopover from './RejectPopover'
import InfluencerInfoPopover from './InfluencerInfoPopover'
import ItemActions from './ItemActions'
import '../../styles/modal.css'

// TODO: plug in influencer's avatar

class PendingModal extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    pendings: PropTypes.object,
    VerificationStatus: PropTypes.object,
    FETCH_PENDINGS: PropTypes.func,
    CHANGE_PENDINGS: PropTypes.func,
    UPDATE_PENDINGS: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    business: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      rejectPopover: {},
      influencerInfoPopover: {},
      submitting: false,
      changedData: false
    }
  }

  onClose = () => {
    const { intl: { formatMessage } } = this.props
    const doClose = () => {
      this.setState({
        changedData: false,
        rejectPopover: {},
        influencerInfoPopover: {}
      }, () => {
        if (this.props.onClose) this.props.onClose()
        this.props.FETCH_PENDINGS(this.props.business.id)
      })
    }

    if (this.state.changedData) {
      swal({
        text: formatMessage({ id: 'pending.delete_photo', defaultMessage: '!Leave? This Will Discard Your Changes?' }),
        showCancelButton: true,
        confirmButtonClass: 'btn black-color swal transparent',
        cancelButtonClass: 'btn black-color swal transparent',
        customClass: 'border-green'
      }).then((res) => {
        if (res.value) {
          doClose()
        }
      })
    } else {
      doClose()
    }
  }

  getClientRect = (e) => {
    const currentTargetRect = e.currentTarget.getBoundingClientRect()
    const containerRect = this.container.getBoundingClientRect()

    return {
      x: currentTargetRect.x - containerRect.x,
      y: currentTargetRect.y - containerRect.y,
      width: currentTargetRect.width,
      height: currentTargetRect.height
    }
  }

  refContainer = (e) => {
    this.container = e
  }

  toggleApprove = (campaignLeadId) => {
    const { pendings } = this.props
    pendings.leads = pendings.leads.map((item) => {
      const lead = { ...item }
      if (lead.campaign_lead_id === campaignLeadId) {
        if (lead.verification_status === this.props.VerificationStatus.Approved) {
          delete lead.verification_status
        } else {
          lead.verification_status = this.props.VerificationStatus.Approved
          if (lead.rejection_text !== undefined) {
            delete lead.rejection_text
          }
          if (lead.rejection_type !== undefined) {
            delete lead.rejection_type
          }
        }
      }
      return lead
    })

    this.setState({ changedData: true })
    this.props.CHANGE_PENDINGS(pendings)
  }

  approveAll = () => {
    const { pendings } = this.props
    pendings.leads = pendings.leads.map((item) => {
      const lead = { ...item }
      lead.verification_status = this.props.VerificationStatus.Approved
      if (lead.rejection_text !== undefined) {
        delete lead.rejection_text
      }
      if (lead.rejection_type !== undefined) {
        delete lead.rejection_type
      }
      return lead
    })

    this.setState({ submitting: true })
    this.props.UPDATE_PENDINGS(pendings)
      .then(() => {
        this.props.FETCH_PENDINGS(this.props.business.id)
          .then(() => {
            this.setState({ changedData: false }, () => this.onClose())
          })
      })
      .finally(() => {
        this.setState({ submitting: false })
      })
  }

  doneReject = (rejectReasonType, rejectReasonOther) => {
    this.closeRejectPopover()
    const { pendings } = this.props
    const { rejectPopover: { campaignLeadId } } = this.state
    pendings.leads = pendings.leads.map((item) => {
      const lead = { ...item }
      if (lead.campaign_lead_id === campaignLeadId) {
        lead.verification_status = this.props.VerificationStatus.Rejected
        lead.rejection_type = rejectReasonType
        if (rejectReasonType === REJECT_TYPES.other) {
          lead.rejection_text = rejectReasonOther
        }
      }
      return lead
    })

    this.setState({ changedData: true })
    this.props.CHANGE_PENDINGS(pendings)
  }

  cancelReject = (campaignLeadId) => {
    const { pendings } = this.props
    pendings.leads = pendings.leads.map((item) => {
      const lead = { ...item }
      if (lead.campaign_lead_id === campaignLeadId) {
        lead.verification_status = null
        lead.rejection_text = null
        lead.rejection_type = null
      }
      return lead
    })

    this.setState({ changedData: true })
    this.props.CHANGE_PENDINGS(pendings)
  }

  saveData = () => {
    this.setState({ submitting: true })
    this.props.UPDATE_PENDINGS(this.props.pendings)
      .then(() => {
        this.props.FETCH_PENDINGS(this.props.business.id)
          .then(() => {
            this.setState({ changedData: false }, () => this.onClose())
          })
      })
      .finally(() => {
        this.setState({ submitting: false })
      })
  }

  openRejectPopover = (e, campaign_lead_id) => {
    this.setState({
      rejectPopover: {
        clientRect: this.getClientRect(e),
        campaignLeadId: campaign_lead_id
      }
    })
  }

  closeRejectPopover = () => {
    this.setState({ rejectPopover: {} })
  }

  openInfluencerInfoPopver = (e, lead) => {
    this.setState({
      influencerInfoPopover: {
        clientRect: this.getClientRect(e),
        lead
      }
    })
  }

  closeInfluencerInfoPopover = () => {
    this.setState({ influencerInfoPopover: {} })
  }

  pendingDataColumns = () => {
    const { intl: { formatMessage, formatDate, formatTime }, VerificationStatus } = this.props
    return [{
      dataIndex: 'date',
      name: formatMessage({ id: 'pendings.date', defaultMessage: '!Date' }),
      sort: true,
      renderer: (record, val) => {
        const date = new Date(val)
        return `${formatDate(date)} ${formatTime(date)}`
      }
    }, {
      dataIndex: 'campaign_name',
      name: formatMessage({ id: 'pendings.campaign', defaultMessage: '!Campaign' }),
      sort: true,
      flex: 2
    }, {
      name: formatMessage({ id: 'pendings.influencer', defaultMessage: '!Influencer' }),
      sort: true,
      renderer: (record) => (
        <div style={{ cursor: 'pointer' }} onMouseOver={(e) => this.openInfluencerInfoPopver(e, record)}>
          {record.influencer_name || record.influencer_email}
        </div>
      )
    }, {
      dataIndex: 'lead_name',
      name: formatMessage({ id: 'pendings.lead', defaultMessage: '!Lead' })
    }, {
      dataIndex: 'lead_email',
      name: formatMessage({ id: 'pendings.mail', defaultMessage: '!Mail' }),
      flex: 2
    }, {
      dataIndex: 'lead_contact_number',
      name: formatMessage({ id: 'pendings.phone', defaultMessage: '!Phone' }),
      flex: 2
    }, {
      name: formatMessage({ id: 'pendings.pending', defaultMessage: '!Pending' }),
      renderer: (record) => {
        const hours = moment().diff(moment(record.date), 'hours')
        return (
          <div className={hours > 72 ? 'font-weight-bold text-danger' : ''}>
            <FormattedMessage id="pendings.hours" defaultMessage="!{hours} H" values={{ hours }} />
          </div>
        )
      }
    }, {
      name: formatMessage({ id: 'pendings.approve', defaultMessage: '!Approve' }),
      renderer: (record) => (
        <ItemActions
          record={record}
          verificationStatus={VerificationStatus}
          toggleApprove={this.toggleApprove}
          cancelReject={this.cancelReject}
          openRejectPopover={this.openRejectPopover}
        />
      )
    }]
  }

  renderMobileItem = (record) => {
    const { VerificationStatus } = this.props

    return (
      <div style={{ padding: '5px 0' }}>
        <div className="flex">
          <div style={{ flex: 1 }} className="title">12h</div>
          <div className="flex" style={{ flex: 3, borderBottom: '1px solid #95989A' }}>
            <div style={{ flex: 1 }}>
              <div className="name">{record.lead_name}</div>
              <div className="description">{record.lead_contact_number}</div>
              <div className="description">{record.lead_email}</div>
            </div>
            <ItemActions
              record={record}
              verificationStatus={VerificationStatus}
              toggleApprove={this.toggleApprove}
              cancelReject={this.cancelReject}
              openRejectPopover={this.openRejectPopover}
            />
          </div>
        </div>
        <div className="flex">
          <div style={{ flex: 1 }}>
            <div className="avatar">
              <img src="/img/default_user.png" alt="user-avatar" width="100%" />
            </div>
          </div>
          <div style={{ flex: 3 }}>
            <div className="flex">
              <div
                className="name"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  this.openInfluencerInfoPopver(e, record)
                }}
              >
                <FormattedMessage
                  id="pendings.by_influencer"
                  defaultMessage="!By: {influencer}"
                  values={{ influencer: record.influencer_name || record.influencer_email }}
                />
              </div>
              <div style={{ flex: 1 }}>&nbsp;</div>
            </div>
            <div className="description">{record.campaign_name}</div>
          </div>
        </div>
      </div>
    )
  }

  // TODO: calculate the date range to for the PendingModal leads (sort asc, by date)
  render() {
    const { isOpen, intl: { formatMessage }, pendings } = this.props
    const {
      rejectPopover: {
        clientRect, campaignLeadId
      },
      influencerInfoPopover: {
        clientRect: influencerClientRect, lead
      }
    } = this.state

    const newData = [[
      'Campaign Lead ID', 'Date', 'Campaign Name', 'Influencer Name',
      'Influencer Email', 'Lead', 'Mail', 'Phone', 'Pending', 'Status'
    ]]

    if (this.props.pendings.leads) {
      this.props.pendings.leads.forEach((item) => {
        const {
          campaign_lead_id, date, campaign_name, influencer_name,
          influencer_email, lead_name, lead_email, lead_contact_number,
          verification_status
        } = item
        newData.push([
          campaign_lead_id, date, campaign_name, influencer_name,
          influencer_email, lead_name, lead_email, lead_contact_number,
          formatMessage(
            { id: 'pendings.hours', defaultMessage: '!{hours} H' },
            { hours: moment().diff(moment(date), 'hours') }
          ),
          verification_status
        ])
      })
    }

    return (
      <Modal
        className="modal-trans pending-modal"
        isOpen={isOpen}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick={false}
      >
        <div ref={this.refContainer} className="modal-container large">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-lg-none"><IconButton icon="close" onClick={this.onClose} /></div>
              <div className="title">
                <FormattedMessage id="pendings.new_pending_leads" defaultMessage="!New Pending Leads" />
              </div>
              <div className="d-none d-lg-block"><IconButton icon="close" onClick={this.onClose} /></div>
            </div>
            <div className="modal-body">
              <div className="clearfix">
                <div className="label float-lg-left d-none d-lg-block">
                  <FormattedMessage id="pendings.pending_conversions" defaultMessage="!Pending Conversions" />
                </div>
                <div className="label float-left float-lg-right">
                  <FormattedMessage
                    id="pendings.dates"
                    defaultMessage="!Dates {dates}"
                    values={{ dates: 'Aug 11 - Aug 16, 2017' }}
                  />
                </div>
                <div className="float-right d-block d-lg-none">
                  <Button bsSize="middle" onClick={this.approveAll} style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id="pendings.approve_all" defaultMessage="!Approve all" />
                  </Button>
                </div>
              </div>
              <div className="d-none d-lg-block">
                <Grid
                  striped
                  columns={this.pendingDataColumns()}
                  data={this.props.pendings.leads}
                />
              </div>
              <div className="d-lg-none" style={{ maxHeight: 'calc(100vh - 170px)', overflow: 'auto' }}>
                <ListView
                  striped
                  data={this.props.pendings.leads || []}
                  itemEl={this.renderMobileItem}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="d-none d-lg-block">
                <div className="d-flex">
                  <Button onClick={() => exportToCSV('qw.csv', newData)} type="select">
                    <i className="fa fa-download" />&nbsp;
                    <FormattedMessage id="pendings.export" defaultMessage="!Export" />
                  </Button>&nbsp;
                  <Button
                    onClick={this.saveData}
                    disabled={!this.state.changedData}
                    style={{ textTransform: 'uppercase' }}
                  >
                    <FormattedMessage id="pendings.done" defaultMessage="!done" />
                  </Button>&nbsp;
                  <Button onClick={this.approveAll} style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage id="pendings.approve_all" defaultMessage="!Approve all" />
                  </Button>
                </div>
              </div>
              <div className="d-lg-none">
                <Button
                  bsSize="middle"
                  onClick={this.saveData}
                  disabled={!this.state.changedData}
                  style={{ textTransform: 'uppercase' }}
                >
                  <FormattedMessage id="pendings.done" defaultMessage="!done" />
                </Button>
              </div>
            </div>
            <RejectPopover
              clientRect={clientRect}
              campaignLeadId={campaignLeadId}
              doneReject={this.doneReject}
              closeRejectPopover={this.closeRejectPopover}
            />
            <InfluencerInfoPopover
              clientRect={influencerClientRect}
              lead={lead}
              pendings={pendings}
              closeInfluencerInfoPopover={this.closeInfluencerInfoPopover}
            />
            {this.state.submitting && <Spinner />}
          </div>
        </div>
      </Modal>
    )
  }
}

const connectedComponent = connect(
  (state) => {
    const pendings = state.pending.get('pendings').toJS()
    const enums = state.enums.get('enums').toJS()

    return {
      pendings,
      VerificationStatus: enums.VerificationStatus
        ? enums.VerificationStatus.VerificationStatus.value_to_name : {},
      business: state.business.get('businessDetails').toJS().business
    }
  },
  {
    FETCH_PENDINGS: pendingActions.FETCH_PENDINGS,
    UPDATE_PENDINGS: pendingActions.UPDATE_PENDINGS,
    CHANGE_PENDINGS: pendingActions.CHANGE_PENDINGS
  }
)(PendingModal)

export default injectIntl(connectedComponent)
