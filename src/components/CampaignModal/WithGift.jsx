import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { NumberInput, TextArea, ArrowBox } from '../../components/_common'

const WithGift = ({ intl: { formatMessage, formatNumber }, fields }) => (
  <div>
    <div className="mt-10">
      <TextArea
        label={formatMessage({ id: 'campaign.reward_with', defaultMessage: '!I want to reward my influencers with' })}
        placeholder={formatMessage({
          id: 'campaign.reward_with_desc',
          defaultMessage: '!Describe your reward for influencer in words'
        })}
        tooltip={formatMessage({ id: 'campaign.gift_description', defaultMessage: '!Description' })}
        {...fields.gift_description}
      />
    </div>
    <div className="flex mt-10">
      <div>
        <NumberInput
          label={formatMessage({ id: 'campaign.gift_value', defaultMessage: '!Gift value' })}
          tooltip={formatMessage({
            id: 'campaign.gift_comision',
            defaultMessage: '!2key comision will be 15% From Gift value'
          })}
          value={fields.gift_value.input.value}
          onChange={fields.gift_value.input.onChange}
        />
      </div>
      <div className="flex-1 mt-30 pl-20 field-description">
        <FormattedMessage
          id="campaign.gift_comision"
          defaultMessage="!2key comision will be 15% From Gift value"
        />
      </div>
    </div>
    <div className="flex mt-10">
      <div>
        <NumberInput
          label={formatMessage({ id: 'campaign.amount_of_gifts', defaultMessage: '!Amount of Gifts' })}
          tooltip={formatMessage({ id: 'campaign.amount_of_gifts', defaultMessage: '!Amount of Gifts' })}
          value={fields.amount_of_gifts.input.value}
          onChange={fields.amount_of_gifts.input.onChange}
        />
      </div>
      {fields.amount_of_gifts.input.value > 0 && (
        <div className="flex-1 pl-20">
          <div className="fullWidth">
            <ArrowBox arrow="left" className="pl-10 pdr-5">
              <FormattedMessage
                id="campaign.gifts_bubble"
                defaultMessage={`Your gifts count is good for at least
                 {amount} leads! You can always add more gifts to this campaign`}
                values={{
                  amount: formatNumber(fields.amount_of_gifts.input.value)
                }}
              />
            </ArrowBox>
          </div>
        </div>
      )}
    </div>
  </div>
)

WithGift.propTypes = {
  intl: PropTypes.object,
  fields: PropTypes.object.isRequired
}

export default injectIntl(WithGift)
