import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { ClipImg } from '../../_common'
import contentEditIcon from '../../../icons/pencil_icon.png'
import { getLocationString } from '../../../_core/utils'
import photoEditIcon from '../../../icons/photo_icon.png'

const stopPropagation = (e) => {
  e.stopPropagation()
}

const ContactDetails = ({
  business,
  handleInputChange,
  isAdmin,
  wizzard,
  handleEditContactClick,
  editable,
  tooltip,
  onCreateNewCampaign,
  handleImageClick,
  intl: { formatMessage }
}) => (
  <div className={`col-lg-3 minimal-padding header-contact${editable ? ' admin' : ''}`}>
    <div className="box">
      <div className="profile-image-wrapper">
        {business.profile_media_url ? (
          <ClipImg
            className="profile-image"
            style={{ width: '100%' }}
            src={business.profile_media_url}
            x1={business.profile_x1}
            y1={business.profile_y1}
            x2={business.profile_x2}
            y2={business.profile_y2}
          />
        ) : (
          <img
            src={business.profile_media_url || 'http://via.placeholder.com/150x150'}
            className="profile-image"
            alt=""
          />
        )}
        {isAdmin && (
          <span
            className={`image-edit-icon edit-image${tooltip.includes('profile') ? ' active' : ''}`}
            data-tip="custom show"
            data-event="click"
            onMouseDown={handleImageClick}
          >
            <img src={photoEditIcon} alt="edit" width="21" height="18" />
          </span>
        )}
      </div>
      {editable && (
        <div className="contact-list-editor" onClick={stopPropagation}>
          <ul className="contact-list">
            <li className="contact-list-website">
              <input
                className="contact-list-edit"
                type="text"
                name="website"
                placeholder={formatMessage({ id: 'business.website', defaultMessage: '!Website' })}
                value={business.website || ''}
                onChange={handleInputChange}
              />
            </li>
            <li className="contact-list-phone-number">
              <input
                className="contact-list-edit"
                type="text"
                name="contact_phone_number"
                placeholder={formatMessage({ id: 'business.phone', defaultMessage: '!Phone' })}
                value={business.contact_phone_number || ''}
                onChange={handleInputChange}
              />
            </li>
            <li className="contact-list-email">
              <input
                className="contact-list-edit"
                type="text"
                name="contact_email"
                placeholder={formatMessage({ id: 'business.mail', defaultMessage: '!Mail' })}
                value={business.contact_email || ''}
                onChange={handleInputChange}
              />
            </li>
            <li className="contact-list-address">
              <input
                className="contact-list-edit"
                type="text"
                name="businessLocation"
                placeholder={formatMessage({ id: 'business.full_adress', defaultMessage: '!Full adress' })}
                value={business.businessLocation || ''}
                onChange={handleInputChange}
              />
            </li>
          </ul>
          {/*
            <a className="content-edit-icon save" href="/">
              <i className="fa fa-floppy-o" />
            </a>
          */}
        </div>
      )}
      {!editable && (
        <div className="contact-list-wrapper">
          <ul className="contact-list">
            {business.website && (
              <li className="contact-list-website">
                <a href={business.website} data-outside="">{business.website}</a>
              </li>
            )}
            {business.contact_phone_number && (
              <li className="contact-list-phone-number">{business.contact_phone_number}</li>
            )}
            {business.contact_email && (
              <li className="contact-list-email">{business.contact_email}</li>
            )}
            {(business.businessLocation || getLocationString(business)) && (
              <li className="contact-list-address">{business.businessLocation || getLocationString(business)}</li>
            )}
          </ul>
          {isAdmin && (
            <a className="content-edit-icon" onClick={handleEditContactClick}>
              <img src={contentEditIcon} alt="edit" width="21" height="18" />
            </a>
          )}
        </div>
      )}
      {isAdmin && wizzard && (
        <a onClick={onCreateNewCampaign} className="create-new-campaign">
          <FormattedMessage id="business.create_campaign" defaultMessage="!Create new campaign" />
        </a>
      )}
    </div>
  </div>
)

ContactDetails.propTypes = {
  editable: PropTypes.bool,
  isAdmin: PropTypes.bool,
  wizzard: PropTypes.bool,
  tooltip: PropTypes.string,
  business: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEditContactClick: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
  onCreateNewCampaign: PropTypes.func.isRequired
}

export default injectIntl(ContactDetails)
