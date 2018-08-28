import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { ClipImg } from '../../_common'
import { getLocationString } from '../../../_core/utils'
import photoEditIcon from '../../../icons/photo_icon.png'

const stopPropagation = (e) => e.stopPropagation()

const TitleDetails = ({
  isAdmin,
  contentEditIcon,
  business,
  tooltip,
  isEditBusinessNameEnabled,
  isEditBusinessLocationEnabled,
  handleEditNameClick,
  handleEditLocationClick,
  handleInputChange,
  handleBusinessNameKeyPress,
  handleImageClick,
  enums = {},
  intl: { formatMessage }
}) => (
  <div className="col-lg-6 header-image minimal-padding">
    <div className="box">
      <div className="cover-image-wrapper">
        {business.cover_media_url ? (
          <ClipImg
            className="cover-image"
            style={{ width: '100%' }}
            src={business.cover_media_url}
            x1={business.cover_x1}
            y1={business.cover_y1}
            x2={business.cover_x2}
            y2={business.cover_y2}
          />
        ) : (
          <img src={business.cover_media_url || 'http://via.placeholder.com/350x150'} className="cover-image" alt="" />
        )}
        {isAdmin && (
          <span
            className={`image-edit-icon edit-image${tooltip.includes('cover') ? ' active' : ''}`}
            data-tip="custom show"
            data-event="click"
            onMouseDown={handleImageClick}
            id="createWizzard-3"
          >
            <img
              src={photoEditIcon}
              alt="edit"
              width="21"
              height="18"
            />
          </span>
        )}
      </div>
      <div className="business-cover" onClick={stopPropagation}>
        <div className={`business-name-wrapper${isEditBusinessNameEnabled ? ' edit' : ''}`}>
          {isEditBusinessNameEnabled ? (
            <input
              className={`business-name-editor${isAdmin ? '' : ' view'}`}
              type="text"
              name="name"
              placeholder={formatMessage({ id: 'business.business_name', defaultMessage: '!Your Business Name' })}
              value={business.name}
              onChange={handleInputChange}
              onKeyPress={handleBusinessNameKeyPress}
              data-state-field="businessName"
            />
          ) : (
            <div>
              <h2>{business.name}</h2>
              {isAdmin && (
                <a className="content-edit-icon inline" onClick={handleEditNameClick}>
                  <img src={contentEditIcon} alt="edit" width="21" height="18" />
                </a>
              )}
            </div>
          )}
        </div>
        <div className={`business-location-wrapper${isEditBusinessLocationEnabled ? ' edit' : ''}`}>
          {isEditBusinessLocationEnabled ? (
            <div>
              <input
                className="business-location-editor"
                type="text"
                name="location_city"
                value={business.location_city || ''}
                placeholder={formatMessage({ id: 'business.city_state', defaultMessage: '!City and State' })}
                onChange={handleInputChange}
                data-state-field="businessLocation"
              />
              <select
                value={business.location_country || 0}
                name="location_country"
                onChange={handleInputChange}
              >
                <option value={0} disabled>
                  <FormattedMessage id="business.select_country" defaultMessage="!Select Coutry" />
                </option>
                {enums.name_to_value && Object.keys(enums.name_to_value).map((key) => (
                  <option key={key} value={key}>{enums.name_to_value[key]}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <h3>{getLocationString(business)}</h3>
              {isAdmin && (
                <a className="content-edit-icon inline" onClick={handleEditLocationClick}>
                  <img src={contentEditIcon} alt="edit" width="21" height="18" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

TitleDetails.propTypes = {
  isAdmin: PropTypes.bool,
  isEditBusinessNameEnabled: PropTypes.bool,
  isEditBusinessLocationEnabled: PropTypes.bool,
  contentEditIcon: PropTypes.string,
  tooltip: PropTypes.string,
  business: PropTypes.object.isRequired,
  enums: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  handleEditNameClick: PropTypes.func.isRequired,
  handleEditLocationClick: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
  handleBusinessNameKeyPress: PropTypes.func.isRequired
}

export default injectIntl(TitleDetails)
