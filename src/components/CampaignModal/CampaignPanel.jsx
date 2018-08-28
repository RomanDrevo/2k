import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, LeftRightSwitch, Panel, TextInput } from '../../components/_common'


class CampaignPanel extends React.Component {
  static propTypes = {
    editing: PropTypes.bool,
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
    submitting: PropTypes.bool,
    fields: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    campaign: PropTypes.object.isRequired
  }

  onCancel = (e) => {
    if (this.props.onCancel) {
      this.props.onCancel(e)
    }
  }

  onNameChange = (e) => {
    this.props.onNameChange()
    this.props.fields.name.input.onChange(e)
  }

  setActiveType = (val) => {
    this.props.fields.is_active.input.onChange(val === 'left')
  }

  render() {
    const {
      intl: { formatMessage }, fields, submitting,
      editing, invalid, valid, campaign
    } = this.props

    console.log('campaign2: ', campaign)

    return (
      <Panel className="campaign-panel">
        <div>
          <div id="campaign-form-error-name" className="flex">
            <TextInput
              inline
              label={formatMessage({ id: 'campaign.campaign_name', defaultMessage: '!Campaign Name' })}
              value={fields.name.input.value}
              onChange={this.onNameChange}
            />
          </div>
          {fields.name.meta.touched && fields.name.meta.error && (
            <div className="msg small error" style={{ textAlign: 'right' }}>
              {fields.name.meta.error}
            </div>
          )}
          <div className="flex mt-10 pt-10 border-top">
            <div>
              <LeftRightSwitch
                leftTitle={formatMessage({ id: 'campaign.active', defaultMessage: '!ACTIVE' })}
                rightTitle={formatMessage({ id: 'campaign.on_hold', defaultMessage: '!ON HOLD' })}
                tooltip={formatMessage({ id: 'campaign.active_on_hold', defaultMessage: '!Campaign ACTIVE/ON HOLD' })}
                // value={fields.is_active.input.value === true ? 'left' : 'right'}
                value={campaign.withstanding_budget > 0 ? 'left' : 'right'}
                onChange={this.setActiveType}

              />
            </div>
            <div className="flex flex-1 flex-end">
              <Button
                bsType="cancel"
                title={formatMessage({ id: 'main.cancel', defaultMessage: '!Cancel' })}
                onClick={this.onCancel}
                style={{ textTransform: 'uppercase' }}
              />&nbsp;
              <Button
                type="submit"
                title={formatMessage({ id: 'main.save', defaultMessage: '!Save' })}
                disabled={submitting}
                className={invalid ? 'invalid' : ''}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>
          <div className="flex flex-end msg">
            {editing ? fields.is_active.input.value !== true && (
              <FormattedMessage
                id="campaign.keep_on"
                defaultMessage="!Save Campaign But Keep On'"
              />
            ) : (valid && (
              <FormattedMessage
                id="campaign.ready_to_launch"
                defaultMessage="!Ready to Launch Campaign!"
              />
            )) || (
              <FormattedMessage
                id="campaign.fill_all"
                defaultMessage="!Fill all required fields"
              />
            )}
          </div>
        </div>
      </Panel>
    )
  }
}

export default injectIntl(connect((state) => {
  const campaign = state.campaign.get('campaign').toJS()
  return {
    campaign
  }
})(CampaignPanel))

