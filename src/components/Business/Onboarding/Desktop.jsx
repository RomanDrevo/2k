import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import join2key from '../../../icons/join2key.svg'
import shareLink from '../../../icons/shareLink.svg'
import getRewarded from '../../../icons/getRewarded.svg'

/* eslint-disable max-len */
const a1 = '!You’re more influential than you think! Influencers aren’t just social media celebrities. You’re an influencer anytime you recommend a product to someone. Whether you’re an employee, business owner, consultant, blogger or social media guru, you can get rewarded'
const a2 = '!Unless otherwise stated, commissions last for the lifetime of the account'
const a3 = '!At the end of each month, your rewards are calculated and available for cash-out via PayPal (alternative methods available for non-PayPal regions)'
const a4 = '!Payments are verified and paid-out the month after your commission is earned. Feontrrecxeaivmespple,rsaonyalc. ommissions earned in'
const a5 = '!We use Cookies to track your referrals. The cookies last for 90 days after someone clicks on your link. If they click again, the'
const a6 = '!GrowSumo helps give you the tools and resources you need to promote our'
/* eslint-enable max-len */

const Desktop = () => (
  <div className="containet">
    <div className="modal-header">
      <div className="row">
        <div className="col-sm-4">
          <div className="onboardItem">
            <img src={join2key} alt="" />
            <FormattedMessage tagName="h3" id="business.onboard_join_2key" defaultMessage="!Join 2key" />
            <FormattedMessage
              tagName="p"
              id="business.onboard_join_2key_text"
              defaultMessage="!its a matter of 3 clicks and you can start using unique links"
            />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="onboardItem">
            <img src={shareLink} alt="" />
            <FormattedMessage tagName="h3" id="business.onboard_share_link" defaultMessage="!Share Link" />
            <FormattedMessage
              tagName="p"
              id="business.onboard_share_link_text"
              defaultMessage="!on social media and more"
            />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="onboardItem">
            <img src={getRewarded} alt="" />
            <FormattedMessage tagName="h3" id="business.onboard_get_rewarded" defaultMessage="!Get Rewarded" />
            <FormattedMessage
              tagName="p"
              id="business.onboard_get_rewarded_text"
              defaultMessage="!directly to your Credit Card or Paypal Account"
            />
          </div>
        </div>
      </div>
    </div>
    <main>
      <div className="modal-header">
        <FormattedMessage tagName="h2" id="business.faq" defaultMessage="!FAQ" />
      </div>
      <div className="row faq">
        <div className="col-sm-6">
          <FormattedMessage tagName="h4" id="business.faq_q1" defaultMessage="!I don't think I am an influencer..." />
          <FormattedMessage tagName="p" id="business.faq_a1" defaultMessage={a1} />
          <FormattedMessage tagName="h4" id="business.faq_q2" defaultMessage="!How long do commissions last for?" />
          <FormattedMessage tagName="p" id="business.faq_a2" defaultMessage={a2} />
          <FormattedMessage tagName="h4" id="business.faq_q3" defaultMessage="!How do I get paid?" />
          <FormattedMessage tagName="p" id="business.faq_a3" defaultMessage={a3} />
        </div>
        <div className="col-sm-6">
          <FormattedMessage tagName="h4" id="business.faq_q4" defaultMessage="!When do I get paid?" />
          <FormattedMessage tagName="p" id="business.faq_a4" defaultMessage={a4} />
          <FormattedMessage tagName="h4" id="business.faq_q5" defaultMessage="!How long do cookies last for?" />
          <FormattedMessage tagName="p" id="business.faq_a5" defaultMessage={a5} />
          <FormattedMessage tagName="h4" id="business.faq_q6" defaultMessage="!What is 2key?" />
          <FormattedMessage tagName="p" id="business.faq_a6" defaultMessage={a6} />
        </div>
      </div>
    </main>
  </div>
)

export default injectIntl(Desktop)
