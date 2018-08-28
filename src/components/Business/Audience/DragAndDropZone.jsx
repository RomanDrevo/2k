import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import Dropzone from 'react-dropzone'
import { Tab, Tabs } from 'react-bootstrap'
import { Button, IconButton, TextArea } from '../../../components/_common'
import { BusinessActions } from '../../../_redux'


const AudienceTabs = {
  ADD_USERS: 'add',
  REMOVE_USERS: 'remove'
}

class DragAndDropZone extends React.PureComponent {
  static propTypes = {
    edit: PropTypes.bool,
    file_id: PropTypes.number,
    audienceName: PropTypes.string,
    emails: PropTypes.string,
    intl: PropTypes.object.isRequired,
    upload: PropTypes.object,
    audienceToEdit: PropTypes.object,
    CREATE_BUSINESS_AUDIENCE: PropTypes.func.isRequired,
    onDropAudienceFile: PropTypes.func.isRequired,
    retryCreateFile: PropTypes.func.isRequired,
    businessId: PropTypes.number.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    EDIT_BUSINESS_AUDIENCE: PropTypes.func.isRequired,
    CLOSE_CREATE_AUDIENCE_WINDOW: PropTypes.func.isRequired,
    OPEN_EDIT_AUDIENCE_WINDOW: PropTypes.func.isRequired
  }

  state={
    emails: '',
    activeTab: AudienceTabs.ADD_USERS,
    btnIsLoading: false
  }

  onOpenClick = () => {
    this.dropzone.open()
  }

  onSelectTab = (key) => this.setState({ activeTab: key })

  refDropzone = (e) => {
    this.dropzone = e
  }

  handleOnSubmit = () => {
    this.setState({ btnIsLoading: true })
    const dataToSend = {
      business_id: this.props.businessId,
      audience_name: this.props.audienceName,
      audience_records_text: this.props.emails,
      file_id: this.props.file_id
    }
    Promise.resolve(this.props.CREATE_BUSINESS_AUDIENCE(dataToSend))
      .then(() => {
        this.props.CLOSE_CREATE_AUDIENCE_WINDOW()
        this.setState({ btnIsLoading: false })
      })
  }

  handleEditAudience = () => {
    this.setState({ btnIsLoading: true })
    const {
      audienceToEdit, EDIT_BUSINESS_AUDIENCE, businessId, OPEN_EDIT_AUDIENCE_WINDOW
    } = this.props
    const audienceOperation = this.state.activeTab
    const dataToSend = {
      audience_id: audienceToEdit.id,
      business_id: businessId,
      audience_name: audienceToEdit.name,
      audience_records_text: this.state.emails,
      audience_operation: this.state.emails ? audienceOperation : '',
      audience_records_file_id: ''
    }
    Promise.resolve(EDIT_BUSINESS_AUDIENCE(dataToSend))
      .then(() => {
        OPEN_EDIT_AUDIENCE_WINDOW(false)
        this.setState({ btnIsLoading: false })
      })
  }

  render() {
    const {
      intl: { formatMessage }, onDropAudienceFile, upload, retryCreateFile,
      handleOnChange
    } = this.props
    return (
      <div>
        <div>
          <div className="mr4 ml4">
            <Tabs
              activeKey={this.state.activeTab}
              onSelect={this.onSelectTab}
              id="controlled-tab"
              className="ignores-grid-margins"
            >
              <Tab eventKey={AudienceTabs.ADD_USERS} title="+ Add Users" />
              {this.props.edit ? (
                <Tab eventKey={AudienceTabs.REMOVE_USERS} title="- Remove Users" />
              ) : null}
            </Tabs>
            <Dropzone
              disableClick
              multiple={false}
              ref={this.refDropzone}
              style={{ position: 'relative', height: '100%' }}
              accept=".csv"
              onDrop={onDropAudienceFile}
            >
              <TextArea
                rows={5}
                placeholder={formatMessage({
                  id: 'campaign.audience_mails',
                  defaultMessage: '!Drag and drop your CSV file here or\\nPaste your data here'
                })}
                onChange={handleOnChange}
                value={this.props.emails}
                className="text-center"
              />
              <Button
                style={{ position: 'absolute', left: 5, bottom: 20 }}
                bsType="select"
                bsSize="middle"
                title={formatMessage({ id: 'campaign.upload_file', defaultMessage: 'Upload file' })}
                onClick={this.onOpenClick}
              />
              <IconButton
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  fontSize: 20
                }}
                icon="close"
                onClick={this.clearAudienceEmails}
              />
            </Dropzone>
          </div>
          {!upload.file || !upload.failedCount || upload.failedCount === 0 ? null : (
            <div className="flex">
              <div className="msg small error">
                {upload.failedCount === 1 ? (
                  <FormattedMessage
                    id="campaign.try_again"
                    defaultMessage="!Create file failed. Try again"
                  />
                ) : (
                  <FormattedMessage
                    id="campaign.try_another"
                    defaultMessage="!Create file failed. Try another file please"
                  />
                )}
              </div>
              {upload.failedCount === 1 && (
                <div>
                  <IconButton icon="refresh" onClick={retryCreateFile} />
                </div>
              )}
            </div>
          )}
          {!upload.file || !upload.uploading ? null : (
            <div className="flex">
              <div className="msg small info">
                <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style={{ fontSize: 12 }} />
                <FormattedMessage
                  id="campaign.upload_progress"
                  defaultMessage="!Uploading {file}...{progress}%"
                  values={{ file: upload.file.name, progress: upload.progress || 0 }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-10 mr-30" style={{ position: 'relative' }}>
          <Button
            title="SAVE"
            onClick={this.props.edit ? this.handleEditAudience : this.handleOnSubmit}
            loading={this.state.btnIsLoading}
          />
        </div>
      </div>


    )
  }
}

export default injectIntl(connect((state) => {
  const businessAudiences = state.business.get('businessAudiences').toJS()
  return {
    businessAudiences,
    loading: state.business.get('loading')
  }
}, {
  FETCH_BUSINESS_AUDIENCES: BusinessActions.FETCH_BUSINESS_AUDIENCES,
  CREATE_BUSINESS_AUDIENCE: BusinessActions.CREATE_BUSINESS_AUDIENCE,
  EDIT_BUSINESS_AUDIENCE: BusinessActions.EDIT_BUSINESS_AUDIENCE,
  OPEN_EDIT_AUDIENCE_WINDOW: BusinessActions.OPEN_EDIT_AUDIENCE_WINDOW,
  CLOSE_CREATE_AUDIENCE_WINDOW: BusinessActions.CLOSE_CREATE_AUDIENCE_WINDOW
})(DragAndDropZone))
