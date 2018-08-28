import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'
import { LeftRightSwitch, Panel, Select } from '../../components/_common'

import { uploadFile } from '../../_core/upload-file'
import { BusinessActions } from '../../_redux'
import SpecificMails from './SpecificMails'

export const AGES = []
for (let i = 13; i <= 100; i += 1) AGES.push(i)

class AudiencePanel extends React.Component {
  static propTypes = {
    editCampaignId: PropTypes.number,
    business_id: PropTypes.number,
    editing: PropTypes.bool,
    fields: PropTypes.object.isRequired,
    subs: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    countries: PropTypes.object,
    audiences: PropTypes.array,
    DELETE_FILE: PropTypes.func.isRequired,
    CREATE_FILE: PropTypes.func.isRequired
  }

  state = {
    isNewAudience: false,
    upload: {
      file: null,
      progress: null,
      failedCount: null
    },
    emailType: 'add',
    emails: ''
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.fields.white_list_audience_id && nextProps.fields.white_list_audience_id) {
      const audience = nextProps.audiences
        .find((item) => item.id === nextProps.fields.white_list_audience_id)
      if (audience && audience.id) {
        this.props.fields.white_list_audience_name.input.onChange(audience.name)
      }
    }
  }

  onDropAudienceFile = (accepted) => {
    this.createFile(accepted[0])
  }

  onNewAudience = () => {
    this.setState({ isNewAudience: true, emails: '', upload: {} })
    this.props.fields.white_list_audience_id.input.onChange(null)
    this.props.fields.white_list_audience_name.input.onChange(null)
    this.onClearEmails()
  }

  onCountrySelect = (items) => {
    this.props.fields.countries.input.onChange(items.map((item) => item.value))
  }

  onAgeSelect = (item) => {
    this.props.fields.minimum_age.input.onChange(item.value)
  }

  onClearEmails = () => {
    const { fields } = this.props
    fields.white_list_audience_records_file_id.input.onChange(null)
    fields.white_list_audience_records_text.input.onChange(null)
    this.setState({ emails: '', upload: {} })
  }

  onEnableAudienceName = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ enableAudienceName: !this.state.enableAudienceName })
  }

  setPublicType = (val) => {
    if (val === 'left') {
      this.props.subs.campaign_is_public.input.onChange(true)
    } else {
      this.props.subs.campaign_is_public.input.onChange(false)
    }
  }

  getSpecificMailsProps = () => {
    const {
      upload, isNewAudience, emailType, emails,
      enableAudienceName
    } = this.state
    const {
      intl, fields, editing, audiences
    } = this.props

    return {
      editing,
      isNewAudience,
      enableAudienceName,
      emails,
      emailType,
      audiences,
      intl,
      upload,
      fields,
      selectAudience: this.selectAudience,
      onNewAudience: this.onNewAudience,
      onDropAudienceFile: this.onDropAudienceFile,
      retryCreateFile: this.retryCreateFile,
      addEmails: this.addEmails,
      removeEmails: this.removeEmails,
      onEnableAudienceName: this.onEnableAudienceName,
      clearAudienceEmails: this.onClearEmails
    }
  }

  updateUploadProgress = (progress) => {
    const { upload } = this.state
    upload.progress = progress.toFixed(0)
    this.setState({ upload })
  }

  createFile = (file) => {
    const {
      CREATE_FILE, business_id, fields, editing
    } = this.props
    const file_name = file.name
    const upload = { ...this.state.upload }
    upload.file = file
    upload.uploading = true
    upload.progress = 0
    this.setState({ upload })
    Promise.resolve(CREATE_FILE({ business_id, file_name }))
      .then((res) => {
        this.updateUploadProgress(0)
        uploadFile({
          url: res.file.presigned_upload_url,
          file,
          progressCallback: (evt) => {
            this.updateUploadProgress((100 * evt.loaded) / evt.total)
          },
          doneCallback: () => {
            // this.setState({ upload: {} })
            const fr = new FileReader()
            fr.onload = () => {
              // fields.add_audience_records_text.input.onChange(fr.result)
              const result = fr.result.split(',')
              if (result.length > 4) {
                result.splice(4)
              }
              fields.white_list_audience_records_text.input.onChange(result.join(','))
              this.setState({ emails: fr.result })
            }
            fr.onerror = (err) => console.warn(err)
            fr.readAsText(file)
            if (editing && fields.white_list_audience_id) {
              fields.white_list_audience_operation.input.onChange(this.state.emailType)
            } else {
              fields.white_list_audience_operation.input.onChange(null)
            }
            /* if (editing) {
              if (this.state.emailType === 'add') {
                fields.add_audience_records_file_id.input.onChange(res.file.id)
                fields.add_audience_records_file_url.input.onChange(res.file.full_url)
              } else {
                fields.remove_audience_records_file_id.input.onChange(res.file.id)
                fields.remove_audience_records_file_url.input.onChange(res.file.full_url)
              }
            }*/
            fields.white_list_audience_records_file_id.input.onChange(res.file.id)
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

  retryCreateFile = () => {
    this.createFile(this.state.upload.file)
  }

  addEmails = () => {
    this.setState({ emailType: 'add' })
    this.onClearEmails()
  }

  removeEmails = () => {
    this.setState({ emailType: 'remove' })
    this.onClearEmails()
  }

  deleteUpload = (file) => {
    Promise.resolve(this.props.DELETE_FILE(file.id))
      .then(() => this.setState({ upload: {} }))
  };

  selectAudience = (item) => {
    this.setState({ isNewAudience: false, emails: '' }, () => {
      const { fields } = this.props
      fields.white_list_audience_id.input.onChange(item.value)
      fields.white_list_audience_name.input.onChange(item.label)
      this.onClearEmails()
    })
  }

  render() {
    const {
      intl: { formatMessage }, fields, countries, editCampaignId, subs
    } = this.props

    return (
      <Panel title={formatMessage({ id: 'campaign.step_audience', defaultMessage: '!Audience' })}>
        <div className="flex mt-10">
          <div id="campaign-form-error-countries" className="field-input">
            <Select
              style={{ width: 250 }}
              items={_.map(countries, (key, value) => ({ value, label: key }))}
              placeholder={formatMessage({
                id: 'campaign.influencers_country',
                defaultMessage: '!Influencers country'
              })}
              tooltip={formatMessage({ id: 'campaign.influencers_country', defaultMessage: '!Influencers country' })}
              multiple
              value={fields.countries.input.value || []}
              onSelect={this.onCountrySelect}
              disabled={Boolean(editCampaignId)}
            />
            {fields.countries.meta.touched && fields.countries.meta.error && (
              <div className="msg small error">{fields.countries.meta.error}</div>
            )}
          </div>
        </div>
        <div className="flex border-top mt-10">
          <div className="field-label">
            <FormattedMessage id="campaign.minimum_age" defaultMessage="Minimum age" />&nbsp;
          </div>
          <div className="field-input">
            <Select
              style={{ width: 160 }}
              items={AGES.map((n) => ({ value: n, label: n }))}
              placeholder={formatMessage({ id: 'campaign.none', defaultMessage: '!None' })}
              tooltip={formatMessage({ id: 'campaign.minimum_age', defaultMessage: '!Minimum age' })}
              value={fields.minimum_age.input.value}
              onSelect={this.onAgeSelect}
            />
          </div>
        </div>
        <div className="flex border-top mt-10">
          <LeftRightSwitch
            leftTitle={formatMessage({ id: 'campaign.public_campaign', defaultMessage: '!Public Campaign' })}
            rightTitle={formatMessage({ id: 'campaign.private_campaign', defaultMessage: '!Only Specific Mails' })}
            onChange={this.setPublicType}
            value={subs.campaign_is_public.input.value ? 'left' : 'right'}
            tooltip={`${formatMessage({
              id: 'campaign.public_campaign',
              defaultMessage: '!Public Campaign'
            })}/${formatMessage({
              id: 'campaign.private_campaign',
              defaultMessage: '!Only Specific Mails'
            })}`}
          />
        </div>
        {!subs.campaign_is_public.input.value && (<SpecificMails {...this.getSpecificMailsProps()} />)}
      </Panel>
    )
  }
}

export default injectIntl(connect((state) => {
  const selector = formValueSelector('campaign-form')
  const white_list_audience_name = selector(state, 'fields.white_list_audience_name')

  const audience_names = state.business
    .get('businessDetails').toJS().business.audience_names || []
  if (white_list_audience_name && white_list_audience_name.length > 0) audience_names.push(white_list_audience_name)
  return {
    editCampaignId: state.campaign.get('editCampaignId'),
    business_id: state.business.get('currentBusinessId'),
    audience_names,
    audiences: state.business.get('businessAudiences').toJS(),
    countries: state.enums.get('enums').get('Country').get('Country').get('name_to_value')
      .toJS()
  }
}, {
  // FETCH_BUSINESS_AUDIENCES: BusinessActions.FETCH_BUSINESS_AUDIENCES,
  CREATE_FILE: BusinessActions.CREATE_FILE,
  DELETE_FILE: BusinessActions.DELETE_FILE
})(AudiencePanel))

