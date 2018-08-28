import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'
import { uploadFile } from '../../../_core/upload-file'
import { BusinessActions } from '../../../_redux'
import DragAndDropZone from './DragAndDropZone'
import { IconButton, TextInput } from '../../_common/index'


class AudiencePanel extends React.Component {
  static propTypes = {
    editCampaignId: PropTypes.number,
    business_id: PropTypes.number,
    editing: PropTypes.bool,
    countries: PropTypes.object,
    audiences: PropTypes.array,
    DELETE_FILE: PropTypes.func.isRequired,
    CREATE_FILE: PropTypes.func.isRequired,
    CLOSE_CREATE_AUDIENCE_WINDOW: PropTypes.func.isRequired,
    intl: PropTypes.object,
    audienceToEdit: PropTypes.object,
    edit: PropTypes.bool
  }

  state = {
    isNewAudience: false,
    upload: {
      file: null,
      progress: null,
      failedCount: null
    },
    emailType: 'add',
    emails: '',
    file_id: null,
    audienceName: ''
  }

  onDropAudienceFile = (accepted) => this.createFile(accepted[0])

  onNewAudience = () => this.setState({ isNewAudience: true })

  onOpenClick = () => this.dropzone.open()

  getSpecificMailsProps = () => {
    const { upload, isNewAudience, emailType } = this.state
    const { editing, audiences } = this.props

    return {
      editing,
      isNewAudience,
      emailType,
      audiences,
      upload,
      selectAudience: this.selectAudience,
      onNewAudience: this.onNewAudience,
      onDropAudienceFile: this.onDropAudienceFile,
      retryCreateFile: this.retryCreateFile,
      addEmails: this.addEmails,
      removeEmails: this.removeEmails
    }
  }

  updateUploadProgress = (progress) => {
    const { upload } = this.state
    upload.progress = progress.toFixed(0)
    this.setState({ upload })
  }

  createFile = (file) => {
    const { CREATE_FILE, business_id } = this.props
    const file_name = file.name
    const upload = { ...this.state.upload }
    upload.file = file
    upload.uploading = true
    upload.progress = 0
    this.setState({ upload })
    Promise.resolve(CREATE_FILE({ business_id, file_name }))
      .then((res) => {
        console.log('CREATE FILE RESPONSE: ', res)
        this.setState({ file_id: res.file.id })
        this.updateUploadProgress(0)
        uploadFile({
          url: res.file.presigned_upload_url,
          file,
          progressCallback: (evt) => {
            this.updateUploadProgress((100 * evt.loaded) / evt.total)
          },
          doneCallback: () => {
            this.setState({ upload: {} })
            const fr = new FileReader()
            fr.onload = () => {
              console.log('FILE', fr.result)
              this.setState({ emails: fr.result })
            }
            fr.onerror = (err) => console.warn(err)
            fr.readAsText(file)
          },
          errorCallback: (evt) => {
            console.error('Uploading via presigned url error', evt)
            this.deleteUpload(res.file.id)
          }
        })
      })
      .catch((err) => {
        console.error(err)
        const newUpload = { ...this.state.upload }
        newUpload.failedCount = (upload.failedCount || 0) + 1
        newUpload.uploading = false
        this.setState({ upload: newUpload })
      })
  }

  retryCreateFile = () => this.createFile(this.state.upload.file)

  addEmails = () => this.setState({ emailType: 'add' })

  removeEmails = () => this.setState({ emailType: 'remove' })

  deleteUpload = (file) => {
    Promise.resolve(this.props.DELETE_FILE(file.id))
      .then(() => this.setState({ upload: {} }))
  }

  clearAudienceEmails = () => this.setState({ emails: '' })

  handleOnChange = (event) => this.setState({ emails: event })

  render() {
    const { intl: { formatMessage }, CLOSE_CREATE_AUDIENCE_WINDOW } = this.props
    return (
      <div>
        {!this.props.edit ? (
          <div className="flex justify-between items-center table-row row">
            <TextInput
              inline
              placeholder={formatMessage({
                id: 'business.audience_name_placeholder',
                defaultMessage: '!Enter Audience Name'
              })}
              onChange={(e) => this.setState({ audienceName: e })}
              action={(
                <IconButton
                  icon="edit"
                  style={{ border: '1px solid #95989A', color: '#95989A' }}
                />
              )}
            />
            <div onClick={CLOSE_CREATE_AUDIENCE_WINDOW} className="pointer green mr3">
              <FormattedMessage id="main.cancel" defaultMessage="!Cancel" />
            </div>
          </div>
        ) : null}
        <div className="drag-and-drop">
          <DragAndDropZone
            audienceToEdit={this.props.audienceToEdit}
            edit={this.props.edit}
            audienceName={this.state.audienceName}
            file_id={this.state.file_id}
            businessId={this.props.business_id}
            emails={this.state.emails}
            {...this.getSpecificMailsProps()}
            clearAudienceEmails={this.clearAudienceEmails}
            handleOnChange={this.handleOnChange}
          />
        </div>
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  const selector = formValueSelector('campaign-form')
  const audience_name = selector(state, 'fields.white_list_audience_name')

  const white_list_audience_names = state.business
    .get('businessDetails').toJS().business.white_list_audience_names || []
  if (audience_name && audience_name.length > 0) white_list_audience_names.push(audience_name)
  return {
    business_id: state.business.get('currentBusinessId'),
    white_list_audience_names,
    audiences: state.business.get('businessAudiences').toJS()
  }
}, {
  CREATE_FILE: BusinessActions.CREATE_FILE,
  DELETE_FILE: BusinessActions.DELETE_FILE,
  CLOSE_CREATE_AUDIENCE_WINDOW: BusinessActions.CLOSE_CREATE_AUDIENCE_WINDOW
})(AudiencePanel))

