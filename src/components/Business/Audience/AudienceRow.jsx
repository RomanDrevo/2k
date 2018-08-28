import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedDate, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { BusinessActions } from '../../../_redux'
import AudiencePanel from './AudiencePanel'
import { TextInput } from '../../_common/index'


class AudienceRow extends Component {
  static propTypes = {
    audience: PropTypes.object,
    selectedAudience: PropTypes.object,
    OPEN_EDIT_AUDIENCE_WINDOW: PropTypes.func.isRequired,
    DELETE_BUSINESS_AUDIENCE: PropTypes.func.isRequired
  }

  state = {
    audienceName: ''
  }

  onClick = () => {
    this.props.OPEN_EDIT_AUDIENCE_WINDOW(this.props.audience.id)
  }

  onNameChange = (e) => this.setState({ audienceName: e })

  onDeleteAudience = () => {
    const { audience, DELETE_BUSINESS_AUDIENCE } = this.props
    DELETE_BUSINESS_AUDIENCE({ businessId: audience.business_id, audienceId: audience.id })
  }

  render() {
    const { audience, selectedAudience } = this.props
    const edit = selectedAudience && selectedAudience.id === audience.id
    return (
      <div className="table-row">
        <div className="row">
          {!edit ? (
            <div className="divTableCell col-sm-4 audience-name">{audience.name}</div>
          ) : (
            <div className="divTableCell col-sm-4 audience-name">
              <TextInput inline value={audience.name} onChange={this.onNameChange} />
            </div>
          )}
          <div className="divTableCell col-sm-3 text-center">
            {audience.created_at && (
              <FormattedDate
                value={new Date(audience.created_at)}
                year="numeric"
                day="2-digit"
                month="short"
              />
            )}
          </div>
          <div className="divTableCell col-sm-3 text-center">
            {audience.last_update_at && (
              <FormattedDate
                value={new Date(audience.last_update_at)}
                year="numeric"
                day="2-digit"
                month="short"
              />
            )}
          </div>
          <div className="divTableCell col-sm-1 text-center">{audience.size}</div>
          <div
            className="divTableCell green pointer col-sm-1 text-center"
            onClick={this.onClick}
          >
            {edit ? (
              <FormattedMessage id="main.cancel" defaultMessage="!Cancel" />
            ) : (
              <FormattedMessage id="main.edit" defaultMessage="!Edit" />
            )}
          </div>
        </div>
        {edit ? (
          <div className="add-audience-window">
            <div className="flex justify-end edit-window-controls pt2 pr2">
              <button type="button" className="btn btn-secondary">
                <i className="fa fa-download" aria-hidden="true" />
                <span className="ml1">
                  <FormattedMessage id="business.audience_export" defaultMessage="!Export" />
                </span>
              </button>
              <button type="button" className="btn btn-secondary">
                <i className="fa fa-clone" aria-hidden="true" />
                <span className="ml1">
                  <FormattedMessage id="business.audience_duplicate" defaultMessage="!Duplicate" />
                </span>
              </button>
              <button
                type="button"
                className="btn btn-secondary flex items-center"
                onClick={this.onDeleteAudience}
              >
                <i className="fa fa-trash" aria-hidden="true" />
                <span className="ml1">
                  <FormattedMessage id="business.audience_delete" defaultMessage="!Delete" />
                </span>
              </button>
            </div>
            <AudiencePanel edit audienceToEdit={{ id: selectedAudience.id, name: this.state.audienceName }} />
          </div>
        ) : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const isEditAudienceWindowOpen = state.business.get('isCreateNewAudienceWindowOpen')
  return {
    loading: state.business.get('loading'),
    isEditAudienceWindowOpen
  }
}

export default injectIntl(connect(mapStateToProps, {
  OPEN_EDIT_AUDIENCE_WINDOW: BusinessActions.OPEN_EDIT_AUDIENCE_WINDOW,
  DELETE_BUSINESS_AUDIENCE: BusinessActions.DELETE_BUSINESS_AUDIENCE
})(AudienceRow))
