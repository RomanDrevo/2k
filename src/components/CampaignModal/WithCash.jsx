import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { NumberInput, Select, ArrowBox } from '../../components/_common'

const getCurrencySign = (code, currencies) => {
  const currency = _.find(currencies, (v, k) => k === code)
  return currency || null
}

const ToolTip = () => (
  <FormattedMessage
    tagName="span"
    id="campaign.maximum_reward_tooltip"
    defaultMessage="!Your budget is good for at least 200 leads! You can always add budget to this campaign"
    values={{ amount: '' }}
  />
)

const Tooltip = injectIntl(ToolTip)

const WithCash = ({
  intl: { formatMessage, formatNumber }, fields, editing, currencies, onSelectCurrency
}) => (
  <div>
    <div className="flex mt-10">
      <div id="campaign-form-error-max_cpa">
        <NumberInput
          label={formatMessage({ id: 'campaign.maximum_reward', defaultMessage: 'Maximum Reward' })}
          tooltip={<Tooltip />}
          sign={getCurrencySign(fields.currency.input.value, currencies)}
          value={fields.max_cpa.input.value}
          onChange={fields.max_cpa.input.onChange}
          meta={fields.max_cpa.meta}
          tIndex={4}
        />
      </div>
      <div className="flex-1">
        {editing && fields.max_cpa.input.value > 0
            && fields.remaining_budget.input.value > 0 && (
            <div style={{ padding: '0 10px', marginBottom: -10 }}>
              <ArrowBox arrow="bottom" style={{ width: '100%' }} className="pl-10">
                <FormattedMessage
                  id="campaign.budget_bubble"
                  defaultMessage={`!Your remaining budget is good for at least {amount} leads!
                   Add budget Now to have more Leads!`}
                  values={{
                    amount: formatNumber((fields.withstanding_budget.input.value + (fields.add_budget.input.value || 0))
                      / fields.max_cpa.input.value)
                  }}
                />
              </ArrowBox>
            </div>
          )}
        {!editing && (
          <div className="flex mt-15 align-right">
            <div id="campaign-form-error-currency">
              <Select
                style={{ width: 200, marginRight: 50 }}
                placeholder={formatMessage({ id: 'campaign.currency', defaultMessage: '!Currency' })}
                items={_.map(currencies, (key, value) => ({ value, label: `${key} ${value}` }))}
                value={fields.currency.input.value}
                onSelect={onSelectCurrency}
              />
              {fields.currency.meta.touched && fields.currency.meta.error && (
                <div className="msg small error">{fields.currency.meta.error}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="flex mt-10">
      <div>
        {!editing && (
          <div id="campaign-form-error-withstanding_budget">
            <NumberInput
              label={formatMessage({ id: 'campaign.withstanding_budget', defaultMessage: '!Total Budget' })}
              sign={getCurrencySign(fields.currency.input.value, currencies)}
              value={fields.withstanding_budget.input.value}
              onChange={fields.withstanding_budget.input.onChange}
              meta={fields.withstanding_budget.meta}
              tIndex={5}
            />
          </div>
        )}
        {editing && (
          <div id="campaign-form-error-remaining_budget">
            <NumberInput
              label={formatMessage({ id: 'campaign.remaining_budget', defaultMessage: '!Remaining Budget' })}
              sign={getCurrencySign(fields.currency.input.value, currencies)}
              value={fields.remaining_budget.input.value}
              onChange={fields.remaining_budget.input.onChange}
              meta={fields.remaining_budget.meta}
              tIndex={5}
            />
          </div>
        )}
      </div>
      <div className="flex-1 pl-20 vBottom flex">
        {!editing && fields.max_cpa.input.value > 0 && fields.withstanding_budget.input.value > 0 && (
          <div className="fullWidth">
            <ArrowBox arrow="left" arrowOffset="20px" className="pdl-5 pdr-5">
              <FormattedMessage
                tagName="span"
                id="campaign.maximum_reward_tooltip"
                defaultMessage="!Your budget is good for at least 200 leads! You can always add budget to this campaign"
                values={{
                  amount: formatNumber(fields.withstanding_budget.input.value / fields.max_cpa.input.value)
                }}
              />
            </ArrowBox>
          </div>
        )}
        {editing && (
          <div className="mt-20 flex">
            <NumberInput
              min={fields.max_cpa.input.value}
              inline
              label={formatMessage({ id: 'campaign.add_budget', defaultMessage: '!Add Budget' })}
              sign={getCurrencySign(fields.currency.input.value, currencies)}
              value={fields.add_budget.input.value}
              onChange={fields.add_budget.input.onChange}
              tIndex={6}
            />
          </div>
        )}
        {/* <form target="_blank" action="http://localhost:5000/pay" method="post">*/}
        {/* <input type="hidden" name="amount" />*/}
        {/* <input type="submit" value="Update PayPal Account" />*/}
        {/* </form>*/}

      </div>
    </div>
  </div>
)

WithCash.propTypes = {
  intl: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  currencies: PropTypes.object,
  onSelectCurrency: PropTypes.func.isRequired
}

export default injectIntl(WithCash)
