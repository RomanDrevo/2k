import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import TagsInput from 'react-tagsinput'

const stopPropagation = (e) => e.stopPropagation()

const About = ({
  isAdmin,
  isAdminPreviewMode,
  contentEditIcon,
  isEditAboutEnabled,
  isEditTagsEnabled,
  business,
  handleInputChange,
  handleEditAboutClick,
  handleEditTagsClick,
  handleTagsChange,
  updatePreviewMode,
  intl: { formatMessage }
}) => (
  <div className="col-lg-3 header-about minimal-padding">
    <div className="box">
      <FormattedMessage tagName="h3" id="business.tab_about" defaultMessage="!About" />
      <div className={`about-wrapper${isEditAboutEnabled ? ' edit' : ''}`}>
        <textarea
          className="about-editor"
          rows={6}
          name="description"
          placeholder={formatMessage({
            id: 'business.description',
            defaultMessage: '!Founded: Year Description about your business and it\'s dervices'
          })}
          value={business.description || ''}
          onChange={handleInputChange}
          data-state-field="about"
          onClick={stopPropagation}
          readOnly={!isEditAboutEnabled}
        />
        {isAdmin && isAdminPreviewMode && !isEditAboutEnabled && (
          <a className="content-edit-icon" onClick={handleEditAboutClick}>
            <img src={contentEditIcon} alt="edit" width="21" height="18" />
          </a>
        )}
      </div>
      <hr className="horizontal-divider" />
      {isEditTagsEnabled && (
        <div onClick={stopPropagation}>
          <TagsInput
            className="tag-editor"
            value={(business.tags && business.tags.split(',')) || []}
            onChange={handleTagsChange}
          />
        </div>
      )}
      {!isEditTagsEnabled && (
        <div className="tags-wrapper">
          <div className="tags-container">
            {business.tags && business.tags.split(',').map((tag) => (
              <span key={`${tag}${Math.random()}${Date.now()}`}>{tag}</span>
            ))}
          </div>
          {isAdmin && isAdminPreviewMode && (
            <a className="content-edit-icon" onClick={handleEditTagsClick}>
              <img src={contentEditIcon} alt="edit" width="21" height="18" />
            </a>
          )}
        </div>
      )}
      {isAdmin && (
        <div className="toggle-wrapper" id="createWizzard-2">
          <FormattedMessage tagName="h4" id="business.view_mode" defaultMessage="!View mode" />
          <span className={!isAdminPreviewMode ? 'active' : ''}>
            <FormattedMessage id="business.visitor" defaultMessage="!Visitor" />
          </span>
          <label htmlFor="adminToggle" className="switch">
            <input
              id="adminToggle"
              type="checkbox"
              className="checkbox"
              data-tip="wizzard"
              data-for="createWizzard"
              checked={isAdminPreviewMode}
              onChange={updatePreviewMode}
            />
            <div className="" />
          </label>
          <span className={isAdminPreviewMode ? 'active' : ''}>
            <FormattedMessage id="business.admin" defaultMessage="!Admin" />
          </span>
        </div>
      )}
    </div>
  </div>
)

About.propTypes = {
  isAdmin: PropTypes.bool,
  isAdminPreviewMode: PropTypes.bool,
  contentEditIcon: PropTypes.string,
  isEditAboutEnabled: PropTypes.bool,
  isEditTagsEnabled: PropTypes.bool,
  business: PropTypes.object,
  intl: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEditAboutClick: PropTypes.func.isRequired,
  handleEditTagsClick: PropTypes.func.isRequired,
  handleTagsChange: PropTypes.func.isRequired,
  updatePreviewMode: PropTypes.func.isRequired
}

export default injectIntl(About)
