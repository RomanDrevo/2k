import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import React from 'react'
import swal from 'sweetalert2'
import { IconButton, Spinner } from '../_common'
import { CampaignActions } from '../../_redux'
import CampaignForm from './CampaignForm'
import '../../styles/modal.css'

class CampaignCreateModal extends React.Component {
  static propTypes = {
    business_id: PropTypes.number,
    isOpenCampaignCreateModal: PropTypes.bool,
    intl: PropTypes.object,
    OPEN_CAMPAIGN_CREATE_MODAL: PropTypes.func.isRequired,
    CREATE_CAMPAIGN: PropTypes.func.isRequired,
    SHOW_DEPOSIT_BUDGET_ALERT: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }
  state = {
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
      }
      Promise.resolve(this.props.OPEN_CAMPAIGN_CREATE_MODAL(false))
        .then(() => {
          this.setState({ changed: false, fields: null, submitting: false })
        })
    })
  };

  onSubmit = ({ fields, subs }) => {
    const {
      intl: { formatMessage }, CREATE_CAMPAIGN, OPEN_CAMPAIGN_CREATE_MODAL, SHOW_DEPOSIT_BUDGET_ALERT
    } = this.props
    const data = { ...fields }
    data.start_date = data.start_date ? data.start_date.format('YYYY-MM-DD hh:mm:ss') : null
    data.end_date = data.end_date ? data.end_date.format('YYYY-MM-DD hh:mm:ss') : null
    data.tags = data.tags && data.tags.length > 0 ? data.tags.join(',') : null
    data.countries = data.countries && data.countries.length > 0 ? data.countries.join(',') : null

    // TODO  REMOVE this in FEATURE
    data.action_type = 'LEADS'

    console.log('Campaign Data to send: ', data)

    if (!subs.campaign_is_public) {
      if (data.white_list_audience_records_file_id) {
        delete data.white_list_audience_records_text
      }
    }
    this.setState({ submitting: true })
    Promise.resolve(CREATE_CAMPAIGN({ ...data, business_id: this.props.business_id }))
      .then(() => {
        if (data.is_active === false) {
          swal({
            title: formatMessage({ id: 'campaign.campaign_saved', defaultMessage: '!Campaign saved!' }),
            text: formatMessage({
              id: 'campaign.campaign_hold_description',
              defaultMessage: '!Come back to Finish or Activate it anytime'
            }),
            confirmButtonText: formatMessage({ id: 'campaign.close', defaultMessage: '!CLOSE' }),
            confirmButtonClass: 'btn swal confirm',
            customClass: 'border-green'
          }).then(() => {
            Promise.resolve(OPEN_CAMPAIGN_CREATE_MODAL(false))
              .then(() => {
                this.setState({ changed: false, fields: null, submitting: false })
              })
          })
        } else {
          Promise.resolve(OPEN_CAMPAIGN_CREATE_MODAL(false))
            .then(() => {
              this.setState({ changed: false, fields: null, submitting: false })
            })
        }
      })
      // .then(() => {
      //   this.props.SET_AMOUNT_TO_DEPOSIT(amount)
      //   this.props.SET_SELECTED_CAMPAIGN(campaignId)
      //   this.props.SET_CURRENCY_TO_DEPOSIT(campaignCurrency)
      // })
      .then(() => {
        SHOW_DEPOSIT_BUDGET_ALERT()
        this.props.history.push({
          pathname: `/business/${this.props.business_id}/finances`
          // state: {
          //   businessId: this.props.business_id,
          //   selectedCampaign: this.props.selectedCampaign,
          //   currencyToDeposit: this.props.currencyToDeposit
          // }
        })
      })
      .catch((err) => {
        console.error(err)
        this.setState({ changed: false, fields: null, submitting: false })
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
    const { intl: { formatMessage } } = this.props

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
        Promise.resolve(this.props.OPEN_CAMPAIGN_CREATE_MODAL(false))
          .then(() => {
            this.setState({ changed: false, fields: null, submitting: false })
          })
      }
    })
  }

  render() {
    console.log('Camp create props: ', this.props)
    const { isOpenCampaignCreateModal } = this.props
    return (
      <Modal
        className="modal-trans createCampaign"
        isOpen={isOpenCampaignCreateModal}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
        overlayClassName="flex"
      >
        <div className="modal-container middle campaign-create-modal">
          {this.state.submitting && <Spinner />}
          <div className="modal-content">
            <div className="modal-header dark">
              <div className="title">
                <FormattedMessage id="campaign.create_campaign" defaultMessage="!Create Campaign" />
              </div>
              <IconButton
                style={{ width: 'unset', height: 'unset', fontSize: 20 }}
                icon="close"
                onClick={this.onClose}
              />
            </div>
            <div className="modal-body pd-0">
              <CampaignForm
                onSubmit={this.onSubmit}
                onChange={this.onChange}
                onCancel={this.onCancel}
                newCampaign
              />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default withRouter(injectIntl(connect((state) => ({
  business_id: state.business.get('currentBusinessId'),
  isOpenCampaignCreateModal: state.campaign.get('isOpenCampaignCreateModal'),
  amountToDeposit: state.campaign.get('amountToDeposit'),
  currencyToDeposit: state.campaign.get('currencyToDeposit'),
  selectedCampaign: state.campaign.get('selectedCampaign')
}), {
  OPEN_CAMPAIGN_CREATE_MODAL: CampaignActions.OPEN_CAMPAIGN_CREATE_MODAL,
  CREATE_CAMPAIGN: CampaignActions.CREATE_CAMPAIGN,
  SET_AMOUNT_TO_DEPOSIT: CampaignActions.SET_AMOUNT_TO_DEPOSIT,
  SET_SELECTED_CAMPAIGN: CampaignActions.SET_SELECTED_CAMPAIGN,
  SET_CURRENCY_TO_DEPOSIT: CampaignActions.SET_CURRENCY_TO_DEPOSIT,
  SHOW_DEPOSIT_BUDGET_ALERT: CampaignActions.SHOW_DEPOSIT_BUDGET_ALERT
})(CampaignCreateModal)))
