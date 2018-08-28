import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import join2key from '../../../icons/join2key.svg'
import shareLink from '../../../icons/shareLink.svg'
import getRewarded from '../../../icons/getRewarded.svg'

const Mobile = ({ onChange, index }) => (
  <section className="onBoardMobile">
    <Slider
      dots
      arrows={false}
      centerMode
      centerPadding="0px"
      afterChange={onChange}
      slidesToShow={1}
      slidesToScroll={1}
      infinite={false}
      initialSlide={index}
    >
      <div className="onboardItem">
        <img src={join2key} alt="" />
        <FormattedMessage tagName="h3" id="business.onboard_join_2key" defaultMessage="!Join 2key" />
        <FormattedMessage
          tagName="p"
          id="business.onboard_join_2key_text"
          defaultMessage="!its a matter of 3 clicks and you can start using unique links"
        />
      </div>
      <div className="onboardItem">
        <img src={shareLink} alt="" />
        <FormattedMessage tagName="h3" id="business.onboard_share_link" defaultMessage="!Share Link" />
        <FormattedMessage
          tagName="p"
          id="business.onboard_share_link_text"
          defaultMessage="!on social media and more"
        />
      </div>
      <div className="onboardItem">
        <img src={getRewarded} alt="" />
        <FormattedMessage tagName="h3" id="business.onboard_get_rewarded" defaultMessage="!Get Rewarded" />
        <FormattedMessage
          tagName="p"
          id="business.onboard_get_rewarded_text"
          defaultMessage="!directly to your Credit Card or Paypal Account"
        />
      </div>
    </Slider>
  </section>
)

Mobile.propTypes = {
  index: PropTypes.number,
  onChange: PropTypes.func.isRequired
}

export default injectIntl(Mobile)
