import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import swal from 'sweetalert2'

import campaignActions from '../../_redux/campaign/actions'
import { IconButton, Spinner, Tab, Tabs } from '../_common'
import CampaignResultPanel from './CampaignResultPanel'
import CampaignForm from './CampaignForm'
import '../../styles/modal.css'

class CampaignEditModal extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    editCampaignId: PropTypes.number,
    intl: PropTypes.object.isRequired,
    SET_EDIT_CAMPAIGN_ID: PropTypes.func.isRequired,
    UPDATE_CAMPAIGN: PropTypes.func.isRequired,
    OPEN_CAMPAIGN_CREATE_MODAL: PropTypes.func.isRequired,
    SET_CAMPAIGN_DATA: PropTypes.func.isRequired
  }

  state = {
    activeTab: 1,
    changed: false,
    fields: null
  }

  onClose = () => {
    if (this.state.submitting) {
      return
    }
    if (!this.state.changed || !this.state.fields) {
      this.onCancel()
      return
    }
    const { intl: { formatMessage } } = this.props
    swal({
      title: formatMessage({ id: 'campaign.save_changes', defaultMessage: '!Save Changes?' }),
      showCancelButton: true,
      confirmButtonText: formatMessage({ id: 'campaign.yes', defaultMessage: '!YES' }),
      cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
      confirmButtonClass: 'btn swal confirm',
      cancelButtonClass: 'btn swal cancel',
      customClass: 'border-green'
    }).then((res) => {
      if (res.value) {
        this.onSubmit(this.state.fields)
      } else {
        this.props.SET_EDIT_CAMPAIGN_ID(null)
      }
    })
  };

  onSubmit = ({ fields, subs }) => {
    const { intl: { formatMessage }, UPDATE_CAMPAIGN } = this.props
    const data = { ...fields }
    data.start_date = data.start_date ? data.start_date.format('YYYY-MM-DD hh:mm:ss') : null
    data.end_date = data.end_date ? data.end_date.format('YYYY-MM-DD hh:mm:ss') : null
    data.tags = data.tags && data.tags.length > 0 ? data.tags.join(',') : null
    data.countries = data.countries && data.countries.length > 0 ? data.countries.join(',') : null
    if (fields.add_budget) {
      data.withstanding_budget =
        parseInt(data.withstanding_budget, 10) + parseInt(fields.add_budget, 10)
    }
    if (!subs.campaign_is_public) {
      if (data.white_list_audience_records_file_id) {
        delete data.white_list_audience_records_text
      }
      if (data.white_list_audience_id) {
        delete data.white_list_audience_name
      } else {
        delete data.white_list_audience_operation
      }
    }
    this.setState({ submitting: true })
    Promise.resolve(UPDATE_CAMPAIGN(fields.id, data))
      .then(() => {
        this.setState({ changed: false, fields: null, submitting: false })
        toast.success('Success')
        if (fields.is_active === false
          && (!fields.end_date || new Date(fields.end_date) >= new Date())) {
          swal({
            title: formatMessage({ id: 'campaign.campaign_on_hold', defaultMessage: '!Campaign On Hold!' }),
            text: formatMessage({
              id: 'campaign.campaign_hold_description',
              defaultMessage: '!Come back to Finish or Activate it anytime'
            }),
            confirmButtonText: formatMessage({ id: 'campaign.close', defaultMessage: '!CLOSE' }),
            confirmButtonClass: 'btn swal confirm',
            customClass: 'border-green'
          }).then(() => {
            this.props.SET_EDIT_CAMPAIGN_ID(null)
          })
        } else {
          this.props.SET_EDIT_CAMPAIGN_ID(null)
        }
      })
      .catch((err) => {
        console.warn(err)
        this.setState({ submitting: false })
        swal({
          title: formatMessage({ id: 'campaign.campaign_create_failed', defaultMessage: '!Campaign create failed!' }),
          confirmButtonText: formatMessage({ id: 'campaign.close', defaultMessage: '!CLOSE' }),
          confirmButtonClass: 'btn swal confirm',
          customClass: 'border-green'
        }).then(() => { })
      })
  }

  onChange = (values, dispatch, props) => {
    if (!props.pristine) {
      this.setState({
        changed: true,
        fields: values
      })
    }
  }

  onCancel = () => {
    const { intl: { formatMessage }, isMobile } = this.props
    if (isMobile) {
      this.props.SET_EDIT_CAMPAIGN_ID(null)
    } else {
      swal({
        title: formatMessage({ id: 'campaign.are_you_sure', defaultMessage: '!Are You Sure?' }),
        showCancelButton: true,
        confirmButtonText: formatMessage({ id: 'campaign.NO', defaultMessage: '!NO' }),
        cancelButtonText: formatMessage({ id: 'campaign.discard', defaultMessage: '!DISCARD' }),
        confirmButtonClass: 'btn swal confirm',
        cancelButtonClass: 'btn swal cancel',
        customClass: 'border-green'
      }).then((res) => {
        if (!res.value) {
          Promise.resolve(this.props.SET_EDIT_CAMPAIGN_ID(null))
            .then(() => {
              this.setState({ changed: false, fields: null })
            })
        }
      })
    }
  }

  onDuplicateCampaign = (values) => {
    const { intl: { formatMessage } } = this.props
    swal({
      title: formatMessage({ id: 'campaign.duplicate_campaign', defaultMessage: '!Duplicate Campaign?' }),
      showCancelButton: true,
      confirmButtonText: formatMessage({ id: 'campaign.yes', defaultMessage: '!YES' }),
      cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
      confirmButtonClass: 'btn swal confirm',
      cancelButtonClass: 'btn swal cancel',
      customClass: 'border-green'
    }).then((res) => {
      if (res.value) {
        const duplicate = { ...values }
        duplicate.fields.id = null
        duplicate.fields.max_cpa = null
        duplicate.fields.withstanding_budget = null
        duplicate.fields.remaining_budget = null
        Promise.resolve(this.props.SET_EDIT_CAMPAIGN_ID(null))
          .then(() => {
            setTimeout(() => {
              Promise.resolve(this.props.OPEN_CAMPAIGN_CREATE_MODAL(true))
                .then(() => this.props.SET_CAMPAIGN_DATA(duplicate.fields))
            }, 100)
          })
      }
    })
  }

  onEndCampaign = (values) => {
    const { intl: { formatMessage } } = this.props
    swal({
      title: formatMessage({ id: 'campaign.end_campaign', defaultMessage: '!End Campaign?' }),
      showCancelButton: true,
      confirmButtonText: formatMessage({ id: 'campaign.yes', defaultMessage: '!YES' }),
      cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
      confirmButtonClass: 'btn swal confirm',
      cancelButtonClass: 'btn swal cancel',
      customClass: 'border-green'
    }).then((res) => {
      if (res.value) {
        const end = { ...values }
        end.fields.is_active = false
        end.fields.end_date = moment()
        this.onSubmit(end)
      }
    })
  }

  renderDesktop() {
    const { editCampaignId, intl: { formatMessage } } = this.props
    return (
      <div className="modal-container middle">
        {this.state.submitting && <Spinner />}
        <div className="modal-content">
          <Tabs
            activeKey={this.state.activeTab || 1}
            onSelect={(eventKey) => {
              this.setState({ activeTab: eventKey })
            }}
          >
            <Tab eventKey={1} title={formatMessage({ id: 'campaign.campaign_edit', defaultMessage: '!Edit' })}>
              <div>
                <CampaignForm
                  editCampaignId={editCampaignId}
                  onSubmit={this.onSubmit}
                  onChange={this.onChange}
                  onCancel={this.onCancel}
                  onDuplicateCampaign={this.onDuplicateCampaign}
                  onEndCampaign={this.onEndCampaign}
                />
              </div>
            </Tab>
            <Tab eventKey={2} title={formatMessage({ id: 'campaign.campaign_results', defaultMessage: '!Results' })}>
              <CampaignResultPanel />
            </Tab>
          </Tabs>
          <div style={{ position: 'absolute', right: 15, top: 15 }}>
            <IconButton
              style={{ width: 'unset', height: 'unset', fontSize: 20 }}
              icon="close"
              onClick={this.onClose}
            />
          </div>
        </div>
      </div>
    )
  }

  renderMobile() {
    return (
      <div className="modal-container large">
        <div className="modal-content mobile">
          <div className="modal-header">
            <div>
              <IconButton
                style={{ color: 'white', fontSize: 13 }}
                icon="angle-left"
                onClick={this.onClose}
              >
                <FormattedMessage id="main.back" defultMessage="!Back" />
              </IconButton>
            </div>
            <div className="title" style={{ marginLeft: -20 }}>
              <FormattedMessage id="campaign.campaign_results" defultMessage="!Results" />
            </div>
          </div>
          <div className="modal-body">
            <CampaignResultPanel isMobile />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { editCampaignId, isMobile } = this.props

    return (
      <Modal
        className="modal-trans createCampaign"
        isOpen={editCampaignId !== null}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
        overlayClassName="flex"
      >
        {isMobile ? this.renderMobile() : this.renderDesktop()}
      </Modal>
    )
  }
}

const connectedComponent = connect((state) => ({
  editCampaignId: state.campaign.get('editCampaignId'),
  isMobile: state.general.get('isMobile')
}), {
  SET_EDIT_CAMPAIGN_ID: campaignActions.SET_EDIT_CAMPAIGN_ID,
  SET_CAMPAIGN_DATA: campaignActions.SET_CAMPAIGN_DATA,
  OPEN_CAMPAIGN_CREATE_MODAL: campaignActions.OPEN_CAMPAIGN_CREATE_MODAL,
  UPDATE_CAMPAIGN: campaignActions.UPDATE_CAMPAIGN
})(CampaignEditModal)

export default injectIntl(connectedComponent)
