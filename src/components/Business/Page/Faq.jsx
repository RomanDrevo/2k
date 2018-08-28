import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { IconButton } from '../../_common'

/* eslint-disable max-len */
const a1 = '!You’re more influential than you think! Influencers aren’t just social media celebrities. You’re an influencer anytime you recommend a product to someone. Whether you’re an employee, business owner, consultant, blogger or social media guru, you can get rewarded'
const a2 = '!Unless otherwise stated, commissions last for the lifetime of the account'
const a3 = '!At the end of each month, your rewards are calculated and available for cash-out via PayPal (alternative methods available for non-PayPal regions)'
const a4 = '!Payments are verified and paid-out the month after your commission is earned. Feontrrecxeaivmespple,rsaonyalc. ommissions earned in'
const a5 = '!We use Cookies to track your referrals. The cookies last for 90 days after someone clicks on your link. If they click again, the'
const a6 = '!GrowSumo helps give you the tools and resources you need to promote our'
/* eslint-enable max-len */

const Faq = ({ isMobile, onClose }) => (
  <section className={`onboardFaq${isMobile ? ' mobile' : ''}`}>
    <div className="modal-header">
      <FormattedMessage tagName="h2" id="business.faq" defaultMessage="!FAQ" />
      <IconButton style={{ width: 'unset', height: 'unset', fontSize: 20 }} icon="close" onClick={onClose} />
    </div>
    <main>
      <FormattedMessage tagName="h4" id="business.faq_q1" defaultMessage="!I don't think I am an influencer..." />
      <FormattedMessage tagName="p" id="business.faq_a1" defaultMessage={a1} />
      <FormattedMessage tagName="h4" id="business.faq_q2" defaultMessage="!How long do commissions last for?" />
      <FormattedMessage tagName="p" id="business.faq_a2" defaultMessage={a2} />
      <FormattedMessage tagName="h4" id="business.faq_q3" defaultMessage="!How do I get paid?" />
      <FormattedMessage tagName="p" id="business.faq_a3" defaultMessage={a3} />
      <FormattedMessage tagName="h4" id="business.faq_q4" defaultMessage="!When do I get paid?" />
      <FormattedMessage tagName="p" id="business.faq_a4" defaultMessage={a4} />
      <FormattedMessage tagName="h4" id="business.faq_q5" defaultMessage="!How long do cookies last for?" />
      <FormattedMessage tagName="p" id="business.faq_a5" defaultMessage={a5} />
      <FormattedMessage tagName="h4" id="business.faq_q6" defaultMessage="!What is 2key?" />
      <FormattedMessage tagName="p" id="business.faq_a6" defaultMessage={a6} />
    </main>
  </section>
)

Faq.propTypes = {
  isMobile: PropTypes.bool,
  onClose: PropTypes.func.isRequired
}

export default injectIntl(Faq)
