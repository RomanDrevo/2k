import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { getShareableLink, copyContentToClipboard } from '../../../_core/utils'
import backIcon from '../../../icons/social/arrow.svg'
import facebookIcon from '../../../icons/social/facebook.svg'
import messengerIcon from '../../../icons/social/messenger.svg'
import googleplusIcon from '../../../icons/social/google.svg'
import twitterIcon from '../../../icons/social/twitter.svg'
import whatsappIcon from '../../../icons/social/whatsapp.svg'
import mailIcon from '../../../icons/social/mail.svg'

class CampaignShareItems extends React.Component {
  static propTypes = {
    showFullDescription: PropTypes.string,
    showRecommendOptions: PropTypes.string,
    offer: PropTypes.object.isRequired,
    handleBackClick: PropTypes.func.isRequired
  }

  handleCopyClick = () => {
    copyContentToClipboard(this.props.offer.twokey_link)
  }

  render() {
    const {
      offer, showFullDescription, showRecommendOptions, handleBackClick
    } = this.props
    return (
      <div className="share-container">
        <div key="recommend_row" className={`hidden-sm-down icons-row ${showFullDescription} ${showRecommendOptions}`}>
          <div key="icon-back" className="icon">
            <a onClick={handleBackClick}>
              <img src={backIcon} alt="Back" className={`icon--back ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="main.back" defaultMessage="!Back" />
            </a>
          </div>
          <div key="icon-facebook" className="icon">
            <a href={getShareableLink('facebook', offer.twokey_link)} target="_blank">
              <img src={facebookIcon} alt="Facebook share" className={`icon--facebook ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="social.facebook" defaultMessage="!Facebook" />
            </a>
          </div>

          <div key="icon-googleplus" className="icon">
            <a href={getShareableLink('google-plus', offer.twokey_link)} target="_blank">
              <img src={googleplusIcon} alt="Googleplus share" className={`icon--googleplus ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="social.google_plus" defaultMessage="!Google +" />
            </a>
          </div>

          <div key="icon-twitter" className="icon">
            <a href={getShareableLink('twitter', `${offer.name} ${offer.twokey_link}`)} target="_blank">
              <img src={twitterIcon} alt="Twitter share" className={`icon--twitter ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="social.twitter" defaultMessage="!Twitter" />
            </a>
          </div>

          <div key="icon-mail" className="icon">
            <a href={getShareableLink('mail', offer.twokey_link)} target="_blank">
              <img src={mailIcon} alt="Mail share" className={`icon--mail ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="main.mail" defaultMessage="!Mail" />
            </a>
          </div>
        </div>

        <div
          key="recommend_row_mobile"
          className={`hidden-md-up icons-row-mobile ${showFullDescription} ${showRecommendOptions}`}
        >
          <div key="icon-back" className="icon-mobile">
            <a onClick={handleBackClick}>
              <img src={backIcon} alt="Back" className={`icon--back ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="main.back" defaultMessage="!Back" />
            </a>
          </div>

          <div key="icon-messenger-mobile" className="icon-mobile">
            <a href={getShareableLink('messenger', offer.twokey_link)} target="_blank">
              <img src={messengerIcon} alt="Mesenger share" className={`icon--messenger ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="social.messenger" defaultMessage="!Mesenger" />
            </a>
          </div>

          <div key="icon-whatsapp-mobile" className="icon-mobile">
            <a href={getShareableLink('whatsapp', `${offer.name} ${offer.twokey_link}`)} target="_blank">
              <img src={whatsappIcon} alt="Whatsapp share" className={`icon--whatsapp ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="social.whatsapp" defaultMessage="!Whatsapp" />
            </a>
          </div>

          <div key="icon-twitter-mobile" className="icon-mobile">
            <a href={getShareableLink('twitter', `${offer.name} ${offer.twokey_link}`)} target="_blank">
              <img src={twitterIcon} alt="Twitter share" className={`icon--twitter-mobile ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="social.twitter" defaultMessage="!Twitter" />
            </a>
          </div>

          <div key="icon-mail-mobile" className="icon-mobile">
            <a href={getShareableLink('mail', offer.twokey_link)} target="_blank">
              <img src={mailIcon} alt="Mail share" className={`icon--mail-mobile ${showRecommendOptions}`} />
              <FormattedMessage tagName="span" id="main.mail" defaultMessage="!Mail" />
            </a>
          </div>
        </div>

        <a
          key="recommend_share_link"
          className={`recommend_share_link ${showFullDescription}  ${showRecommendOptions}`}
          onClick={this.handleCopyClick}
        >
          <FormattedMessage id="main.copy_link" defaultMessage="!Copy link" />
        </a>
      </div>
    )
  }
}

export default injectIntl(CampaignShareItems)
