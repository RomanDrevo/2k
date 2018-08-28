import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import swal from 'sweetalert2'
import Modal from 'react-modal'
import querystring from 'querystring'
import { withRouter } from 'react-router'
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  BusinessActions, CampaignActions, PendingActions, ProductActions
} from '../../../_redux'
import '../../../styles/global.css'
import { IconButton } from '../../_common'
// import Header from './Header'
import Campaigns from './Campaigns'
import loadingImg from '../../../loading.svg'
import CashInOptionsButtons from './CashInOptionsButtons'
import './finances.css'
import PayPalDepositWindow from './PayPalDepositWindow'

class Finances extends Component {
  static propTypes = {
    FETCH_BUSINESS_DETAILS: PropTypes.func.isRequired,
    FETCH_CAMPAIGNS: PropTypes.func.isRequired,
    match: PropTypes.object,
    businessDetails: PropTypes.object,
    location: PropTypes.object,
    offers: PropTypes.array,
    SET_AMOUNT_TO_DEPOSIT: PropTypes.func,
    amountToDeposit: PropTypes.number,
    isDepositButtonsOpen: PropTypes.bool.isRequired,
    isDepositBudgetAlertOpen: PropTypes.bool.isRequired,
    SHOW_DEPOSIT_BUTTONS: PropTypes.func.isRequired,
    HIDE_DEPOSIT_BUTTONS: PropTypes.func.isRequired,
    SET_SELECTED_CAMPAIGN: PropTypes.func.isRequired,
    SET_CURRENCY_TO_DEPOSIT: PropTypes.func.isRequired,
    HIDE_DEPOSIT_BUDGET_ALERT: PropTypes.func.isRequired,
    currencyToDeposit: PropTypes.string.isRequired,
    selectedCampaign: PropTypes.number.isRequired,
    isPayPalDepositWindowOpen: PropTypes.bool.isRequired,
    OPEN_PAYPAL_DEPOSIT_WINDOW: PropTypes.func.isRequired,
    CLOSE_PAYPAL_DEPOSIT_WINDOW: PropTypes.func.isRequired
  }

  state={}

  componentWillMount() {
    const parsed = querystring.parse(this.props.location.search)
    console.log('querystring: ', parsed)
    if (parsed.paymentId) {
      console.log('PAYPAL PAYMENT ID: ', querystring.paymentId)
      swal({
        title: `You have successfully updated your Total Budget! Pay Pal Payment ID is: ${parsed.paymentId}`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
        // cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
        confirmButtonClass: 'btn swal confirm',
        // cancelButtonClass: 'btn swal cancel',
        customClass: 'border-green'
      })
    } else if (parsed.httpStatusCode > 300) {
      swal({
        title: 'Something went wrong with your Pay Pal transaction! Please try again.',
        text: `Error: ${parsed.name}.`,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK',
        // cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
        confirmButtonClass: 'btn swal btn-danger',
        // cancelButtonClass: 'btn swal cancel',
        customClass: 'border-green'
      })
    }
  }

  componentDidMount() {
    const {
      FETCH_BUSINESS_DETAILS,
      match: { params: { handle } },
      FETCH_CAMPAIGNS,
      isDepositBudgetAlertOpen,
      HIDE_DEPOSIT_BUDGET_ALERT
    } = this.props

    Promise.resolve(FETCH_BUSINESS_DETAILS(handle)
      .then(() => {
        FETCH_CAMPAIGNS(this.props.businessDetails.id)
      }))
      .then(() => {
      // swal({
      //   title: formatMessage({ id: 'campaign.save_changes', defaultMessage: '!Save Changes?' }),
      //   showCancelButton: true,
      //   confirmButtonText: formatMessage({ id: 'campaign.yes', defaultMessage: '!YES' }),
      //   cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
      //   confirmButtonClass: 'btn swal confirm',
      //   cancelButtonClass: 'btn swal cancel',
      //   customClass: 'border-green'
      // })
        if (isDepositBudgetAlertOpen) {
          swal({
            title: 'New campaign has been successfully created!',
            text: 'Please deposit the funds for the campaign.',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
            // cancelButtonText: formatMessage({ id: 'campaign.cancel', defaultMessage: '!CANCEL' }),
            confirmButtonClass: 'btn swal confirm',
            // cancelButtonClass: 'btn swal cancel',
            customClass: 'border-green'
          })
            .then(HIDE_DEPOSIT_BUDGET_ALERT())
        }
      })
  }
  onModalClose = () => {
    this.props.HIDE_DEPOSIT_BUTTONS()
  }

  render() {
    const {
      offers,
      businessDetails,
      SET_AMOUNT_TO_DEPOSIT,
      amountToDeposit,
      isDepositButtonsOpen,
      SHOW_DEPOSIT_BUTTONS,
      HIDE_DEPOSIT_BUTTONS,
      SET_SELECTED_CAMPAIGN,
      SET_CURRENCY_TO_DEPOSIT,
      location,
      selectedCampaign,
      currencyToDeposit,
      isPayPalDepositWindowOpen,
      OPEN_PAYPAL_DEPOSIT_WINDOW,
      CLOSE_PAYPAL_DEPOSIT_WINDOW
    } = this.props

    const amountWithCurrency = `${this.props.amountToDeposit} ${this.props.currencyToDeposit}`

    console.log('Finances Props: ', this.props)

    return (
      <div className="finances-wrapper container pt-10">
        {/* <Header />*/}

        {
          isPayPalDepositWindowOpen ?
            <PayPalDepositWindow
              amountToDeposit={amountToDeposit}
              currencyToDeposit={currencyToDeposit}
              amountWithCurrency={amountWithCurrency}
              selectedCampaign={selectedCampaign}
              businessDetails={businessDetails}
              closePaypalDepositWindow={CLOSE_PAYPAL_DEPOSIT_WINDOW}
            />
            :
            null
        }

        {
          isDepositButtonsOpen ?
            <Modal
              className="modal-trans createCampaign"
              isOpen="true"
              // onRequestClose={this.onClose}
              closeTimeoutMS={100}
              shouldCloseOnOverlayClick
              overlayClassName="flex"
            >
              <div className="modal-container middle campaign-create-modal">
                {/* {this.state.submitting && <Spinner />}*/}
                <div className="modal-content">
                  <div className="modal-header dark">
                    <div className="title">
                      {/* <FormattedMessage id="campaign.create_campaign" defaultMessage="!Create Campaign" />*/}
                      <FormattedMessage
                        tagName="b"
                        id="business_finances.how_to"
                        defaultMessage="!How do you want to Deposit?"
                      />
                    </div>
                    <IconButton
                      style={{ width: 'unset', height: 'unset', fontSize: 20 }}
                      icon="close"
                      onClick={this.onModalClose}
                    />
                  </div>
                  <div className="modal-body pd-0">
                    <CashInOptionsButtons
                      hideDepositButtons={HIDE_DEPOSIT_BUTTONS}
                      businessDetails={businessDetails}
                      location={location}
                      openPayPalDepositWindow={OPEN_PAYPAL_DEPOSIT_WINDOW}
                    />
                  </div>
                </div>
              </div>
            </Modal>
            : null
        }

        {
          offers.length ?
            <Campaigns
              campaigns={offers}
              businessDetails={businessDetails}
              setAmountToDeposit={SET_AMOUNT_TO_DEPOSIT}
              setCurrencyToDeposit={SET_CURRENCY_TO_DEPOSIT}
              amountToDeposit={amountToDeposit}
              isDepositButtonsOpen={isDepositButtonsOpen}
              showDepositButtons={SHOW_DEPOSIT_BUTTONS}
              hideDepositButtons={HIDE_DEPOSIT_BUTTONS}
              setSelectedCampaign={SET_SELECTED_CAMPAIGN}
              openPayPalDepositWindow={OPEN_PAYPAL_DEPOSIT_WINDOW}
            />
            :
            <img className="loader" src={loadingImg} alt="" />
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  const amountToDeposit = state.campaign.get('amountToDeposit')
  const isDepositButtonsOpen = state.campaign.get('isDepositButtonsOpen')
  const offers = state.campaign.get('campaigns').toList().toJS()
  offers.sort((a, b) => {
    const c = new Date(a.created_at)
    const d = new Date(b.created_at)
    return d - c
  })
  const onboarding = props.match.params.join === 'join'
  const focusedCampaign = state.campaign.get('campaign').toJS()
  const isDepositBudgetAlertOpen = state.campaign.get('isDepositBudgetAlertOpen')
  const isPayPalDepositWindowOpen = state.campaign.get('isPayPalDepositWindowOpen')
  // const activeOffers = onboarding
  //   ? [...offers].filter((offer) => !detectInactiveOffer(offer))
  //     .filter((item) => item.id !== focusedCampaign.id)
  //   : [...offers].filter((offer) => !detectInactiveOffer(offer))
  // const inactiveOffers = [...offers].filter((offer) => detectInactiveOffer(offer))
  // console.log(activeOffers, inactiveOffers)
  const businessDetails = state.business.get('businessDetails').toJS().business
  const businessList = state.business.get('businessList').toJS()
  const isAdmin = businessDetails && businessDetails.id && Boolean(businessList[businessDetails.id])
  const selectedCampaign = state.campaign.get('selectedCampaign')
  const currencyToDeposit = state.campaign.get('currencyToDeposit')
  return {
    loading: state.business.get('loading'),
    businessDetails,
    focusedCampaign,
    isAdmin,
    onboarding,
    windowWidth: state.general.get('windowWidth'),
    isMobile: state.general.get('isMobile'),
    offers,
    amountToDeposit,
    isDepositButtonsOpen,
    isDepositBudgetAlertOpen,
    selectedCampaign,
    currencyToDeposit,
    isPayPalDepositWindowOpen
  }
}

export default withRouter(injectIntl(connect(mapStateToProps, {
  SET_AMOUNT_TO_DEPOSIT: CampaignActions.SET_AMOUNT_TO_DEPOSIT,
  SET_CURRENCY_TO_DEPOSIT: CampaignActions.SET_CURRENCY_TO_DEPOSIT,
  SHOW_DEPOSIT_BUTTONS: CampaignActions.SHOW_DEPOSIT_BUTTONS,
  HIDE_DEPOSIT_BUTTONS: CampaignActions.HIDE_DEPOSIT_BUTTONS,
  FETCH_BUSINESS_DETAILS: BusinessActions.FETCH_BUSINESS_DETAILS,
  UPDATE_BUSINESS_INFO: BusinessActions.UPDATE_BUSINESS_INFO,
  FETCH_CAMPAIGNS: CampaignActions.FETCH_CAMPAIGNS,
  UPDATE_CAMPAIGN: CampaignActions.UPDATE_CAMPAIGN,
  SET_EDIT_CAMPAIGN_ID: CampaignActions.SET_EDIT_CAMPAIGN_ID,
  OPEN_CAMPAIGN_CREATE_MODAL: CampaignActions.OPEN_CAMPAIGN_CREATE_MODAL,
  FETCH_PRODUCT_LIST: ProductActions.FETCH_PRODUCT_LIST,
  FETCH_PENDINGS: PendingActions.FETCH_PENDINGS,
  FETCH_CAMPAIGN: CampaignActions.FETCH_CAMPAIGN,
  SET_SELECTED_CAMPAIGN: CampaignActions.SET_SELECTED_CAMPAIGN,
  HIDE_DEPOSIT_BUDGET_ALERT: CampaignActions.HIDE_DEPOSIT_BUDGET_ALERT,
  OPEN_PAYPAL_DEPOSIT_WINDOW: CampaignActions.OPEN_PAYPAL_DEPOSIT_WINDOW,
  CLOSE_PAYPAL_DEPOSIT_WINDOW: CampaignActions.CLOSE_PAYPAL_DEPOSIT_WINDOW,
  FETCH_BUSINESS_AUDIENCES: BusinessActions.FETCH_BUSINESS_AUDIENCES
})(Finances)))
