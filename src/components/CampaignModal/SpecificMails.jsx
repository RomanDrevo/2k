import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Dropzone from 'react-dropzone'
import { Button, IconButton, Radio, Select, TextArea, TextInput } from '../../components/_common'


class SpecificMails extends React.PureComponent {
  static propTypes = {
    editing: PropTypes.bool,
    isNewAudience: PropTypes.bool,
    emailType: PropTypes.string,
    emails: PropTypes.string,
    intl: PropTypes.object,
    audiences: PropTypes.array,
    upload: PropTypes.object,
    fields: PropTypes.object.isRequired,
    selectAudience: PropTypes.func.isRequired,
    onNewAudience: PropTypes.func.isRequired,
    onDropAudienceFile: PropTypes.func.isRequired,
    retryCreateFile: PropTypes.func.isRequired,
    addEmails: PropTypes.func.isRequired,
    removeEmails: PropTypes.func.isRequired,
    clearAudienceEmails: PropTypes.func.isRequired
  }

  onOpenClick = () => {
    this.dropzone.open()
  }

  refDropzone = (e) => {
    this.dropzone = e
  }

  // dropzone: ?HTMLDivElement

  render() {
    const {
      intl: { formatMessage }, fields, editing, audiences,
      selectAudience, isNewAudience, emailType,
      onNewAudience, onDropAudienceFile, upload, emails,
      retryCreateFile, addEmails, removeEmails,
      clearAudienceEmails
    } = this.props

    return (
      <div>
        <div className="flex mt-10">
          <Select
            style={{ width: 300 }}
            items={audiences.map((aud) => ({ key: aud.id, label: aud.name, value: aud.id }))}
            value={fields.white_list_audience_id.input.value}
            title={formatMessage({ id: 'campaign.choose_audience', defaultMessage: '!Choose Audience' })}
            onSelect={selectAudience}
          />
          <Button
            bsType="select"
            bsSize="middle"
            title={formatMessage({ id: 'campaign.new_audience', defaultMessage: '!New Audience' })}
            icon="plus"
            onClick={onNewAudience}
            tooltip={formatMessage({ id: 'campaign.new_audience', defaultMessage: '!New Audience' })}
            className="select-container vCenter"
            style={{ height: '38px', marginLeft: 5 }}
          />
        </div>
        {(isNewAudience || fields.white_list_audience_id.input.value) && (
          <div>
            <div>
              <div className="flex mt-10" style={{ position: 'relative' }}>
                <TextInput
                  inline
                  disabled={!isNewAudience}
                  label={formatMessage({ id: 'campaign.audience_name', defaultMessage: '!Audience name' })}
                  tooltip={formatMessage({ id: 'campaign.audience_name', defaultMessage: '!Audience name' })}
                  placeholder={formatMessage({
                    id: 'campaign.audience_name_placeholer',
                    defaultMessage: '!Name your audience'
                  })}
                  value={fields.white_list_audience_name.input.value}
                  onChange={fields.white_list_audience_name.input.onChange}
                />
              </div>
              {fields.white_list_audience_name.meta.touched
                && fields.white_list_audience_name.meta.error && (
                  <div className="msg small error" style={{ textAlign: 'right' }}>
                    {fields.white_list_audience_name.meta.error}
                  </div>
                )}
              {editing && fields.white_list_audience_id.input.value && (
                <div className="flex mt-10">
                  <div className="field-input flex flex-3">
                    <div className="flex-1">
                      <Radio
                        title={formatMessage({ id: 'campaign.add_emails', defaultMessage: '!Add Emails To Audience' })}
                        checked={emailType === 'add'}
                        onClick={addEmails}
                      />
                    </div>
                    <div className="flex-1">
                      <Radio
                        title={formatMessage({
                          id: 'campaign.remove_emails',
                          defaultMessage: '!Remove Emails From Audience'
                        })}
                        checked={emailType === 'remove'}
                        onClick={removeEmails}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-10 audience-dropzone">
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
                    {...fields.white_list_audience_records_text}
                    disabled={Boolean(emails)}
                  />
                  <Button
                    style={{ position: 'absolute', left: 5, bottom: 20 }}
                    bsType="select"
                    bsSize="middle"
                    title={formatMessage({ id: 'campaign.upload_file', defaultMessage: 'Upload file' })}
                    onClick={this.onOpenClick}
                  />
                  {fields.white_list_audience_records_file_id.input.value && (
                    <IconButton
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        fontSize: 20
                      }}
                      icon="close"
                      onClick={clearAudienceEmails}
                    />
                  )}
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
                    {upload.progress < 100 && (
                      <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" style={{ fontSize: 12 }} />
                    )}
                    <FormattedMessage
                      id="campaign.upload_progress"
                      defaultMessage="!Uploading {file}...{progress}%"
                      values={{ file: upload.file.name, progress: upload.progress || 0 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default injectIntl(SpecificMails)
