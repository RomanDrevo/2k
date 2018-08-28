import PropTypes from 'prop-types'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import { injectIntl, FormattedMessage } from 'react-intl'
import image from '../../icons/info.svg'
import './info-tooltip.css'

const InfoTooltip = ({ id, content }) => (
  <div className="info-tooltip-container">
    <span className="info-tooltip-trigger" data-for={id} data-tip="info">
      <img alt="dummy" src={image} />
    </span>
    <ReactTooltip id={id} place="right" type="light" effect="float" className="info-tooltip-box">
      <FormattedMessage tagName="h4" id="main.info" defaultMessage="!Info" />
      {content}
    </ReactTooltip>
  </div>
)

InfoTooltip.propTypes = {
  id: PropTypes.string,
  // content: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string, PropTypes.element,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element]))
  ])
}

export default injectIntl(InfoTooltip)
