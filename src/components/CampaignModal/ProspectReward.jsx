import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { InfoTooltip, LeftRightSwitch, NumberInput, Panel, Radio, TextInput } from '../../components/_common'

class ProspectReward extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    enums: PropTypes.object
  }

  onIfWhenChange = (e) => {
    const { fields } = this.props
    fields.prospect_reward_condition.input.onChange(e)
    const message = this.setSuggestionMessage(e)
    fields.prospect_reward_message.input.onChange(message)
  }

  onDiscountAmountChange = (e) => {
    const { fields } = this.props
    fields.discount_amount.input.onChange(e)
    setTimeout(() => {
      fields.prospect_reward_message.input.onChange(this.setSuggestionMessage())
    }, 100)
  }

  onGiftChange = (e) => {
    const { fields } = this.props
    fields.prospect_reward_gift.input.onChange(e)
    setTimeout(() => {
      fields.prospect_reward_message.input.onChange(this.setSuggestionMessage())
    }, 100)
  }

  setSuggestionMessage = (conditions) => {
    const {
      fields,
      intl: { formatMessage, formatNumber },
      enums: {
        DiscountType: { DiscountType: discountTypes },
        RewardType: { RewardType: rewardTypes }
      }
    } = this.props

    if (fields.prospect_reward_type.input.value === rewardTypes.value_to_name.Gift) {
      return formatMessage({
        id: 'campaign.reward_message',
        defaultMessage: '!This link also gives you {amount} When {condition}'
      }, {
        amount: fields.prospect_reward_gift.input.value,
        condition: conditions || fields.prospect_reward_condition.input.value
      })
    }

    const message = fields.discount_type.input.value === discountTypes.value_to_name.Percentage
      ? formatMessage({
        id: 'campaign.reward_message',
        defaultMessage: '!This link also gives you {amount} When {condition}'
      }, {
        amount: `${fields.discount_amount.input.value}%`,
        condition: conditions || fields.prospect_reward_condition.input.value
      })
      : formatMessage({
        id: 'campaign.reward_message',
        defaultMessage: '!This link also gives you {amount} When {condition}'
      }, {
        amount: formatNumber(fields.discount_amount.input.value, {
          style: fields.discount_type.input.value === discountTypes.value_to_name.Percentage ? 'percent' : 'currency',
          currency: fields.currency.input.value
        }),
        condition: conditions || fields.prospect_reward_condition.input.value
      })
    return message
  }

  setProspectType = (val) => {
    const { fields } = this.props
    fields.prospect_has_reward.input.onChange(val === 'left')
    if (val !== 'left') {
      fields.prospect_reward_condition.input.onChange(null)
      fields.prospect_reward_message.input.onChange(null)
      fields.prospect_reward_gift.input.onChange(null)
      fields.discount_amount.input.onChange(null)
    }
  }

  setRewardGift = () => {
    const {
      enums: {
        RewardType: { RewardType: rewardTypes }
      },
      fields
    } = this.props
    fields.prospect_reward_gift.input.onChange(null)
    fields.discount_amount.input.onChange(null)
    fields.prospect_reward_type.input.onChange(rewardTypes.value_to_name.Gift)
    setTimeout(() => {
      fields.prospect_reward_message.input.onChange(this.setSuggestionMessage())
    }, 100)
  }

  setRewardDiscount = () => {
    const {
      enums: {
        RewardType: { RewardType: rewardTypes },
        DiscountType: { DiscountType: discountTypes }
      },
      fields
    } = this.props
    fields.discount_amount.input.onChange(null)
    fields.prospect_reward_gift.input.onChange(null)
    fields.discount_type.input.onChange(discountTypes.value_to_name.Percentage)
    fields.prospect_reward_type.input.onChange(rewardTypes.value_to_name.Discount)
    setTimeout(() => {
      fields.prospect_reward_message.input.onChange(this.setSuggestionMessage())
    }, 100)
  }

  setDiscountType = (type) => {
    const {
      enums: {
        DiscountType: { DiscountType: discountTypes }
      }
    } = this.props

    this.props.fields.discount_type.input.onChange(type === 'left'
      ? discountTypes.value_to_name.Percentage : discountTypes.value_to_name.Currency)
    setTimeout(() => {
      this.props.fields.prospect_reward_message.input.onChange(this.setSuggestionMessage())
    }, 100)
  }

  render() {
    const {
      intl: {
        messages
      },
      fields: {
        prospect_has_reward,
        prospect_reward_condition,
        prospect_reward_message,
        prospect_reward_type,
        discount_amount,
        discount_type,
        prospect_reward_gift
      },
      enums: {
        RewardType: { RewardType: rewardTypes },
        DiscountType: { DiscountType: discountTypes }
      }
    } = this.props
    const prospectHasReward = prospect_has_reward.input.value === true
      || prospect_has_reward.input.value === undefined || prospect_has_reward.input.value === null
      || prospect_has_reward.input.value === ''
    const rewardType = prospect_reward_type.input.value || rewardTypes.value_to_name.Discount
    const discountType = discount_type.input.value || discountTypes.value_to_name.Percentage
    return (
      <Panel title={messages.prospect_reward || 'Prospect Reward'}>
        <div className="flex mt-10 border-bottom">
          <LeftRightSwitch
            leftTitle={messages.prospect_reward || 'Prospect Reward'}
            rightTitle={messages.no_prospect_reward || 'No Prospect Reward'}
            onChange={this.setProspectType}
            value={prospectHasReward ? 'left' : 'right'}
            tooltip="Prospect Reward"
          />
        </div>
        {prospectHasReward && (
          <div>
            <div className="flex vCenter">
              <div className="field-label">{messages.reward || 'Reward'}</div>
              <InfoTooltip id="rewardTooltip" content="Reward" />
            </div>
            <div className="border-bottom">
              <Radio
                title={messages.discount || 'Discount'}
                checked={rewardType === rewardTypes.value_to_name.Discount}
                onClick={this.setRewardDiscount}
              />
              <Radio
                title={messages.gift || 'Gift'}
                checked={rewardType === rewardTypes.value_to_name.Gift}
                onClick={this.setRewardGift}
              />
            </div>
            {rewardType === rewardTypes.value_to_name.Discount && (
              <div>
                <div className="flex mt-10">
                  <NumberInput
                    label={messages.discount || 'Discount'}
                    min={0}
                    sign={discountType === discountTypes.value_to_name.Percentage ? '%' : '$'}
                    max={discountType === discountTypes.value_to_name.Percentage ? 100 : null}
                    {...discount_amount.input}
                    onChange={this.onDiscountAmountChange}
                  />
                  <LeftRightSwitch
                    style={{ margin: 20 }}
                    leftTitle="%"
                    rightTitle="$"
                    value={discountType === discountTypes.value_to_name.Percentage ? 'left' : 'right'}
                    onChange={this.setDiscountType}
                  />
                </div>
                {discount_amount.meta.touched && discount_amount.meta.error && (
                  <div className="msg small error">
                    {discount_amount.meta.error}
                  </div>
                )}

              </div>
            )}
            {rewardType === rewardTypes.value_to_name.Gift && (
              <div className="mt-10" id="campaign-form-error-prospect_reward_gift">
                <TextInput
                  label={messages.gift || 'Gift'}
                  placeholder={messages.english_cake || 'English Cake'}
                  maxLength={100}
                  {...prospect_reward_gift.input}
                  onChange={this.onGiftChange}
                />
                {prospect_reward_gift.meta.touched && prospect_reward_gift.meta.error && (
                  <div className="msg small error">
                    {prospect_reward_gift.meta.error}
                  </div>
                )}
              </div>
            )}
            <div className="mt-10">
              <TextInput
                label={messages.if_when || 'If/When'}
                placeholder={messages.buying_wedding_cake || 'Buying Wedding Cake'}
                {...prospect_reward_condition.input}
                onChange={this.onIfWhenChange}
                maxLength={40}
              />
              {prospect_reward_condition.meta.touched && prospect_reward_condition.meta.error && (
                <div className="msg small error">
                  {prospect_reward_condition.meta.error}
                </div>
              )}
            </div>
            <div className="mt-10">
              <TextInput
                label={messages.your_message || 'Your Message'}
                placeholder={messages.your_message_description
                  || 'This link also giving you English Cake as a gift  When  Buying a Wedding Cake'}
                {...prospect_reward_message.input}
                maxLength={40}
              />
              {prospect_reward_message.meta.touched && prospect_reward_message.meta.error && (
                <div className="msg small error">
                  {prospect_reward_message.meta.error}
                </div>
              )}
            </div>
          </div>
        )}
      </Panel>
    )
  }
}

export default injectIntl(connect((state) => ({
  enums: state.enums.get('enums').toJS()
}))(ProspectReward))

