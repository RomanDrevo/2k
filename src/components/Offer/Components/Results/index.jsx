import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Modal from 'react-modal'
import { IconButton } from '../../../_common'
import ResultsPanel from './ResultsPanel'
import './CampaignResults.css'
import '../../../../styles/modal.css'

class CampaignResultsModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    loading: PropTypes.bool,
    campaign: PropTypes.object,
    results: PropTypes.object,
    onClose: PropTypes.func,
    isMobile: PropTypes.bool
  }

  onClose = () => {
    if (this.props.onClose) this.props.onClose()
  }

  renderDesktop() {
    return (
      <div className="modal-container campaignResults">
        <div className="modal-content">
          <div className="modal-content">
            <div className="modal-header dark">
              <div className="title">
                <FormattedMessage id="campaign_tile.results" defaultMessage="!Results" />
              </div>
              <IconButton
                style={{ width: 'unset', height: 'unset', fontSize: 20 }}
                icon="close"
                onClick={this.onClose}
              />
            </div>
            <div className="modal-body pd-0">
              <ResultsPanel
                campaign={this.props.campaign}
                results={this.props.results}
                loading={this.props.loading}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderMobile() {
    return (
      <div className="modal-container large campaignResults">
        <div className="modal-content">
          <div className="modal-header dark">
            <div>
              <IconButton
                style={{ color: 'white', fontSize: 13 }}
                icon="angle-left"
                onClick={this.onClose}
              >
                <FormattedMessage id="main.back" defaultMessage="!Back" />
              </IconButton>
            </div>
            <div className="title" style={{ marginLeft: -20 }}>
              <FormattedMessage id="campaign_tile.results" defaultMessage="!Results" />
            </div>
          </div>
          <div className="modal-body mobile">
            <ResultsPanel
              isMobile
              campaign={this.props.campaign}
              results={this.props.results}
              loading={this.props.loading}
            />
          </div>
        </div>
      </div>
    )
  }


  render() {
    const { isMobile } = this.props

    return (
      <Modal
        className="modal-trans"
        isOpen={this.props.open}
        onRequestClose={this.onClose}
        closeTimeoutMS={100}
        shouldCloseOnOverlayClick
      >
        {isMobile ? this.renderMobile() : this.renderDesktop()}
      </Modal>
    )
  }
}

export default injectIntl(CampaignResultsModal)
