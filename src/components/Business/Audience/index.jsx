import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'
import { withRouter } from 'react-router-dom'
import { BusinessActions } from '../../../_redux'
import '../../../styles/global.css'
import loadingImg from '../../../loading.svg'
import './Audience.css'
import AudiencePanel from './AudiencePanel'
import AudienceRow from './AudienceRow'


class Audience extends Component {
  static propTypes = {
    FETCH_BUSINESS_DETAILS: PropTypes.func,
    FETCH_BUSINESS_AUDIENCES: PropTypes.func,
    businessDetails: PropTypes.object,
    audience: PropTypes.object,
    match: PropTypes.object,
    loading: PropTypes.bool,
    OPEN_CREATE_AUDIENCE_WINDOW: PropTypes.func,
    isCreateNewAudienceWindowOpen: PropTypes.bool,
    businessAudiences: PropTypes.array
  }

  componentWillMount() {
    Promise.resolve(this.props.FETCH_BUSINESS_DETAILS(this.props.match.params.handle))
      .then(() => {
        this.props.FETCH_BUSINESS_AUDIENCES(this.props.businessDetails.id)
      })
  }

  handleOpenNewAudienceWindow = () => {
    this.props.OPEN_CREATE_AUDIENCE_WINDOW()
  }

  render() {
    const {
      businessDetails, loading, businessAudiences, isCreateNewAudienceWindowOpen
    } = this.props

    return (
      <div className="audience-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-sm-2" />
            <div className="col-sm-8">
              <div className="row">
                <div className="business-info mt-30">
                  <div className="business-info-header flex items-center">
                    <div className="business-profile-img mr2">
                      <img src={businessDetails.profile_media_url} alt="business-profile" />
                    </div>
                    <div className="business-name">
                      {businessDetails.name}
                    </div>
                  </div>
                  <div className="business-description mt3">
                    {businessDetails.description}
                  </div>
                </div>
              </div>
              <div className="row flex justify-center mt-20">
                <div className="audience-panel-wrapper">
                  <div className="create-audience-btn flex justify-between mb1">
                    <div onClick={this.handleOpenNewAudienceWindow} className="green pointer">
                      <FormattedMessage
                        tagName="b"
                        id="business.create_audience"
                        defaultMessage="!+ Create New Audience"
                      />
                    </div>
                    <div className="dark-gray">
                      <FormattedMessage id="business.total_audience" defaultMessage="!Total Audiences:" />&nbsp;
                      <b>{businessAudiences.length}</b>
                    </div>
                  </div>
                  {loading ? (
                    <img src={loadingImg} className="loader" alt="loading-spinner" />
                  ) : (
                    <div className="audience-table">
                      <div className="table-header table-row flex flex-column">
                        <div className="row header-row">
                          <div className="divTableCell col-sm-4 audience-name">
                            <FormattedMessage id="business.th_name" defaultMessage="!Audience Name" />
                          </div>
                          <div className="divTableCell col-sm-3 text-center">
                            <FormattedMessage id="business.th_created" defaultMessage="!Created" />
                          </div>
                          <div className="divTableCell col-sm-3 text-center">
                            <FormattedMessage id="business.th_last_updated" defaultMessage="!Last Updated" />
                          </div>
                          <div className="divTableCell col-sm-1 text-center">
                            <FormattedMessage id="business.th_size" defaultMessage="!Size" />
                          </div>
                          <div className="divTableCell col-sm-1 text-center" />
                        </div>
                        {isCreateNewAudienceWindowOpen ? (
                          <div className="add-audience-window">
                            <AudiencePanel edit={false} />
                          </div>
                        ) : null}
                      </div>
                      <div className="audience-table-body">
                        <Scrollbars autoHide style={{ height: '100%' }}>
                          {businessAudiences.map((audience) => (
                            <AudienceRow
                              key={audience.id}
                              audience={audience}
                              selectedAudience={this.props.audience}
                            />
                          ))}
                        </Scrollbars>
                      </div>
                    </div>
                  )}
                  {!businessAudiences.length ? (
                    <div className="flex justify-center mt-50 no-audiences-message">
                      <div className="flex flex-column dark-gray">
                        <div className="text-center">
                          <FormattedMessage
                            id="business.no_audience"
                            defaultMessage="!You Do Not Have Any Audiences yet"
                          />
                        </div>
                        <div className="text-center">
                          <FormattedMessage
                            id="business.create_first_audience"
                            defaultMessage="!Create your First one and target the right people"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-sm-2" />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const businessDetails = state.business.get('businessDetails').toJS().business
  const businessList = state.business.get('businessList').toJS()
  const businessAudiences = state.business.get('businessAudiences').toJS()
    .filter((x) => x.is_deleted === false)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const isAdmin = businessDetails && businessDetails.id && Boolean(businessList[businessDetails.id])
  const isCreateNewAudienceWindowOpen = state.business.get('isCreateNewAudienceWindowOpen')
  const isEditAudienceWindowOpen = state.business.get('isCreateNewAudienceWindowOpen')
  const selector = formValueSelector('campaign-form')
  const audience_name = selector(state, 'fields.white_list_audience_name')
  const white_list_audience_names = state.business
    .get('businessDetails').toJS().business.white_list_audience_names || []
  if (audience_name && audience_name.length > 0) white_list_audience_names.push(audience_name)

  return {
    loading: state.business.get('loading'),
    businessDetails,
    businessList,
    isAdmin,
    businessAudiences,
    isCreateNewAudienceWindowOpen,
    white_list_audience_names,
    isEditAudienceWindowOpen,
    audience: state.business.get('audience').toJS()
  }
}

export default injectIntl(withRouter(connect(mapStateToProps, {
  FETCH_BUSINESS_DETAILS: BusinessActions.FETCH_BUSINESS_DETAILS,
  UPDATE_BUSINESS_INFO: BusinessActions.UPDATE_BUSINESS_INFO,
  FETCH_BUSINESS_AUDIENCES: BusinessActions.FETCH_BUSINESS_AUDIENCES,
  OPEN_CREATE_AUDIENCE_WINDOW: BusinessActions.OPEN_CREATE_AUDIENCE_WINDOW,
  OPEN_EDIT_AUDIENCE_WINDOW: BusinessActions.OPEN_CREATE_AUDIENCE_WINDOW,
  CLOSE_EDIT_AUDIENCE_WINDOW: BusinessActions.OPEN_CREATE_AUDIENCE_WINDOW,
  CREATE_FILE: BusinessActions.CREATE_FILE,
  DELETE_FILE: BusinessActions.DELETE_FILE
})(Audience)))

