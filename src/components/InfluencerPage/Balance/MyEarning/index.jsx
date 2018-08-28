import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'

import { ClipImg, IconButton } from '../../../_common'
import { InfluencerActions } from '../../../../_redux'
import DesktopBusinessSummary from './DesktopBusinessSummary'
import DesktopBusinessCmpaign from './DesktopBusinessCampaign'
// import MobileBusinessSummary from './MobileBusinessSummary'
// import MobileBusinessCmpaign from './MobileBusinessCampaign'

class DesktopMyEarning extends React.Component {
  static propTypes = {
    // isMobile: PropTypes.bool,
    my_earnings_business_summary: PropTypes.array,
    my_earnings_business_id_to_campaigns: PropTypes.array,
    OPEN_WITHDRAWAL_WINDOW: PropTypes.func.isRequired,
    SET_AMOUNT_TO_WITHDRAWAL: PropTypes.func.isRequired
  }

  state = { playing: false }

  onEnded= () => this.setState({ playing: false })

  toggleMediaPlaying = () => {
    const playing = !this.state.playing
    this.setState({ playing })
  }

  handleCampaignClick = () => this.setState({ action: !this.state.action })

  handleOnCashOutClick = (amountToWithdrawal) => {
    this.props.OPEN_WITHDRAWAL_WINDOW()
    this.props.SET_AMOUNT_TO_WITHDRAWAL(amountToWithdrawal)
  }

  renderMediaPreview = (item) => {
    if (item && item.campaign_image_url) {
      const {
        campaign_media_type,
        campaign_image_url,
        campaign_media_x1,
        campaign_media_y1,
        campaign_media_x2,
        campaign_media_y2
      } = item

      if (campaign_media_type !== 'VIDEO') {
        return (
          <ClipImg
            src={campaign_image_url}
            x1={campaign_media_x1}
            y1={campaign_media_y1}
            x2={campaign_media_x2}
            y2={campaign_media_y2}
          />
        )
      }
      return (
        <div className="thumbnail-content-video">
          <ReactPlayer
            url={campaign_image_url}
            width="100%"
            height="100%"
            playing={this.state.playing}
            onEnded={this.onEnded}
          />
          <IconButton
            className="thumbnail-content-video-control"
            icon={this.state.playing ? 'pause-circle' : 'play-circle'}
            onClick={this.toggleMediaPlaying}
          />
        </div>
      )
    }
    return <img alt="blank" />
  }

  render() {
    const {
      my_earnings_business_summary,
      my_earnings_business_id_to_campaigns
      // isMobile
    } = this.props

    // console.log('my_earnings_business_summary: ', my_earnings_business_summary)
    // console.log('my_earnings_business_id_to_campaigns: ', my_earnings_business_id_to_campaigns)

    return (
      <div className="my-earning">
        <Accordion>
          {
            my_earnings_business_summary.map((item) => (
              <AccordionItem>
                <AccordionItemTitle>
                  <DesktopBusinessSummary data={item} />
                </AccordionItemTitle>
                <AccordionItemBody>
                  {
                    my_earnings_business_id_to_campaigns.map((campaign) => (
                      <DesktopBusinessCmpaign
                        key={campaign.campaign_id}
                        campaign={campaign}
                        handleOnCashOutClick={this.handleOnCashOutClick}
                        renderMediaPreview={this.renderMediaPreview}
                      />
                    ))
                  }
                </AccordionItemBody>
              </AccordionItem>
            ))
          }
        </Accordion>

        {/* <div id="accordion">*/}
        {/* {my_earnings_business_summary.map((item, i) => (*/}
        {/* <div className="card" key={i}>*/}
        {/* <div className="card-header" id={i}>*/}
        {/* <button*/}
        {/* className="btn collapsed flex"*/}
        {/* data-toggle="collapse"*/}
        {/* data-target="#collapseTwo"*/}
        {/* aria-expanded="false"*/}
        {/* aria-controls="collapseTwo"*/}
        {/* >*/}
        {/* {isMobile ? (<MobileBusinessSummary data={item} />) : (<DesktopBusinessSummary data={item} />)}*/}
        {/* </button>*/}
        {/* </div>*/}
        {/* <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">*/}
        {/* <div className="card-body">*/}
        {/* xxxxxxxxxxx*/}
        {/* <div style={{ paddingTop: 2.5, paddingBottom: 2.5, backgroundColor: '#E3E3E3' }}>*/}
        {/* {my_earnings_business_id_to_campaigns.map((campaign) => (isMobile ? (*/}
        {/* <MobileBusinessCmpaign*/}
        {/* key={campaign.campaign_id}*/}
        {/* campaign={campaign}*/}
        {/* handleOnCashOutClick={this.handleOnCashOutClick}*/}
        {/* renderMediaPreview={this.renderMediaPreview}*/}
        {/* />*/}
        {/* ) : (*/}
        {/* <DesktopBusinessCmpaign*/}
        {/* key={campaign.campaign_id}*/}
        {/* campaign={campaign}*/}
        {/* handleOnCashOutClick={this.handleOnCashOutClick}*/}
        {/* renderMediaPreview={this.renderMediaPreview}*/}
        {/* />*/}
        {/* )))}*/}
        {/* </div>*/}
        {/* </div>*/}
        {/* </div>*/}
        {/* </div>*/}
        {/* ))}*/}
        {/* </div>*/}
      </div>
    )
  }
}

export default injectIntl(connect(
  (state) => {
    const paymentMethodsList = state.influencer.get('payment_methods_list').toJS()
    const summaryDetails = state.influencer.get('summary_data').toJS()
    const balanceDetails = state.influencer.get('balance_data').toJS()
    const loading = state.influencer.get('loading')

    return {
      isMobile: state.general.get('isMobile'),
      balanceDetails,
      summaryDetails,
      paymentMethodsList,
      loading
    }
  },
  {
    OPEN_WITHDRAWAL_WINDOW: InfluencerActions.OPEN_WITHDRAWAL_WINDOW,
    SET_AMOUNT_TO_WITHDRAWAL: InfluencerActions.SET_AMOUNT_TO_WITHDRAWAL
  }
)(DesktopMyEarning))

