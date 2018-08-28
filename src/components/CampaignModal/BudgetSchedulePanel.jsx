import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  DateRangePicker,
  // InfoTooltip,
  LeftRightSwitch,
  Panel
} from '../../components/_common'
import WithGift from './WithGift'
import WithCash from './WithCash'
import '../../components/_common/info-tooltip.css'

class BudgetSchedulePanel extends React.Component {
  static propTypes = {
    editing: PropTypes.bool,
    fields: PropTypes.object,
    subs: PropTypes.object,
    currencies: PropTypes.object,
    intl: PropTypes.object
  };

  constructor(props) {
    super(props)

    this.state = {
      withGift: false
    }

    this.data = {}
  }

  onSelectCurrency = (selection) => {
    this.props.fields.currency.input.onChange(selection.value)
  }

  setScheduleType = (val) => {
    const { subs: { budget_has_dates }, fields: { start_date, end_date } } = this.props
    if (val === 'right') {
      budget_has_dates.input.onChange(true)
    } else {
      start_date.input.onChange(null)
      end_date.input.onChange(null)
      budget_has_dates.input.onChange(false)
    }
  }

  // setRewardType = (val) => {
  //   const { subs: { budget_has_reward }, fields: { currency, total_budget, max_cpa } } = this.props
  //   if (val === 'left') {
  //     budget_has_reward.input.onChange(true)
  //   } else {
  //     budget_has_reward.input.onChange(false)
  //     currency.input.onChange(null)
  //     total_budget.input.onChange(null)
  //     max_cpa.input.onChange(null)
  //   }
  // }

  toggleWithGift = () => {
    this.setState({ withGift: !this.state.withGift })
  }

  updateDateRange = (value) => {
    this.props.fields.start_date.input.onChange(value[0])
    this.props.fields.end_date.input.onChange(value[1])
  };

  render() {
    const {
      intl: { formatMessage }, fields: { start_date, end_date },
      subs: { budget_has_dates, budget_has_reward },
      fields, editing, currencies
    } = this.props
    const { withGift } = this.state

    return (
      <Panel title={formatMessage({ id: 'campaign.step_budget', defaultMessage: '!Budget and Schedule' })}>
        <div className="flex">
          <LeftRightSwitch
            leftTitle={formatMessage({ id: 'campaign.run_continuously', defaultMessage: '!Run Continuously' })}
            rightTitle={formatMessage({ id: 'campaign.campaign_dates', defaultMessage: '!Campaign Dates' })}
            onChange={this.setScheduleType}
            value={budget_has_dates.input.value ? 'right' : 'left'}
            tooltip="Budget schedule type description"
          />
        </div>
        {budget_has_dates.input.value && (
          <div className="flex mt-10">
            <DateRangePicker
              style={{ background: 'white', border: 'none', boxShadow: 'none' }}
              valueStyle={{ fontSize: 13, fontWeight: 'normal' }}
              // dateFormat="DD/MM/YYYY"
              onUpdate={this.updateDateRange}
              value={[start_date.input.value, end_date.input.value]}
              hideCategory
              hideTriggerIcon
            />
          </div>
        )}
        {/* <div className="flex mt-10">
          <LeftRightSwitch
            leftTitle={messages.influencer_reward || 'Influencer Reward'}
            rightTitle={messages.no_reward || 'No Reward'}
            onChange={this.setRewardType}
            value={budget_has_reward.input.value ? 'left' : 'right'}
            tooltip="Budget reward type description"
          />
        </div>*/}
        {budget_has_reward.input.value && (
          <div>
            {withGift ? (
              <WithGift fields={fields} />
            ) : (
              <WithCash
                fields={fields}
                editing={editing}
                currencies={currencies}
                onSelectCurrency={this.onSelectCurrency}
              />
            )}
            {/* <div className="flex border-top mt-10 align-center vCenter">
              <div className="field-label" onClick={this.toggleWithGift}>
                {messages.i_prefer_to_reward || `I prefer to reward my influencers with ${withGift
                  ? messages.cash || 'Cash' : messages.a_gift || 'a Gift'}`}
              </div>
              <div><InfoTooltip id="infotooltip5" content="Prefer to reward" /></div>
            </div>*/}
          </div>
        )}
      </Panel>
    )
  }
}

const mapStateToProps = (state) => ({
  currencies: state.enums.get('enums').get('Currency').get('Currency').get('name_to_value')
    .toJS()
})

// const mapDispatchToProps = (dispatch) => {
//   return {}
// }

export default injectIntl(connect(mapStateToProps)(BudgetSchedulePanel))

