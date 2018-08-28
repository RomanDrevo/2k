import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import ModalHeader from './ModalHeader'

const FacebookPageList = ({ onBack, facebookAccounts, businessPageDetail }) => (
  <div>
    <ModalHeader onBack={onBack} />
    <div className="create-business-modal create-business-fb-contents">
      <div className="create-business-fb-title-content">
        <FormattedMessage id="business.choose_page" defultMessage="!Choose a page to turn" />
      </div>
      <div className="create-business-fb-bottom-content" />
    </div>
    <div style={{ flex: 1 }} className="line" />
    <div className="business-page-container">
      {facebookAccounts.map((o) => (
        <a key={o.id} className="create-business-page" onClick={() => businessPageDetail(o)}>
          <div>
            <img className="business-page-image" src={`//graph.facebook.com/${o.id}/picture?width=70`} alt="" />
          </div>
          <div className="business-page-text">{o.name}</div>
          <div
            style={{
              flex: 1, marginLeft: 50, marginRight: 50, backgroundColor: '#747474'
            }}
            className="line"
          />
        </a>
      ))}
    </div>
  </div>
)


FacebookPageList.propTypes = {
  onBack: PropTypes.func,
  facebookAccounts: PropTypes.array,
  businessPageDetail: PropTypes.func.isRequired
}

export default injectIntl(FacebookPageList)
