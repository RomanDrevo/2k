import {
  Fields, getFormValues, reduxForm
  // getFormAsyncErrors, getFormError, getFormSubmitErrors, getFormSyncErrors, hasSubmitFailed
} from 'redux-form'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import debounce from 'lodash/debounce'
import { Scrollbars } from 'react-custom-scrollbars'
import { Button, StepBar, Spinner } from '../_common'
import AudiencePanel from './AudiencePanel'
import BudgetSchedulePanel from './BudgetSchedulePanel'
import { CampaignActions, MediaActions } from '../../_redux'
import CampaignPanel from './CampaignPanel'
import CampaignPreview from './CampaignPreview'
import CreativePanel from './CreativePanel'
import ProductPanel from './ProductPanel'
import ProspectRewardPanel from './ProspectReward'
import '../../styles/form.css'
import './campaign-form.css'

function validate({ fields, subs }, { intl: { formatMessage }, enums }) {
  const errors = {}
  const {
    RewardType: { RewardType: rewardTypes }
  } = enums

  if (!fields) {
    return { fields: errors }
  }
  const {
    product_id, hosted_site_id, media_id, headline,
    description, max_cpa, withstanding_budget, currency,
    countries, remaining_budget, name, id,
    white_list_audience_records_file_id,
    white_list_audience_records_text,
    white_list_audience_name,
    white_list_audience_id,
    prospect_has_reward,
    prospect_reward_type,
    prospect_reward_gift,
    prospect_reward_condition,
    discount_type,
    discount_amount
  } = fields
  const { budget_has_reward, campaign_is_public } = subs
  const required = formatMessage({ id: 'form_validation.required', defaultMessage: '!Required' })
  if (!product_id) {
    errors.product_id = required
  }

  if (!hosted_site_id) {
    errors.hosted_site_id = required
  }

  if (!media_id) {
    errors.media_id = required
  }

  if (!campaign_is_public) {
    if (!white_list_audience_id &&
      !(white_list_audience_records_file_id || white_list_audience_records_text)) {
      errors.white_list_audience_records_text = required
    }

    if (!white_list_audience_id && !white_list_audience_name) {
      errors.white_list_audience_name = required
    }
  }

  if (!headline) {
    errors.headline = required
  } else if (headline.length < 3) {
    errors.headline = formatMessage({ id: 'form_validation.more_three', defaultMessage: '!Must be longer than 3' })
  }

  if (!description) {
    errors.description = required
  } else if (description.length < 5) {
    errors.description = formatMessage({ id: 'form_validation.more_five', defaultMessage: '!Must be longer than 5' })
  }

  if (!countries && !id) {
    errors.countries = required
  }

  if (budget_has_reward) {
    if (!currency) {
      errors.currency = required
    }

    if (!withstanding_budget) {
      errors.withstanding_budget = required
    } else if (withstanding_budget < 0) {
      errors.withstanding_budget =
        formatMessage({ id: 'form_validation.less_zero', defaultMessage: '!Can not be lower than 0' })
    }

    if (prospect_has_reward) {
      if (!prospect_reward_type) {
        errors.prospect_reward_type = required
      } else if (prospect_reward_type === rewardTypes.value_to_name.Gift) {
        if (!prospect_reward_gift) {
          errors.prospect_reward_gift = required
        }
      } else if (!discount_amount) {
        errors.discount_amount = required
      }
      if (!discount_type) {
        errors.discount_type = required
      }
      if (!prospect_reward_condition) {
        errors.prospect_reward_condition = required
      }
    }

    if (!max_cpa) {
      errors.max_cpa = required
    } else if (max_cpa < 0.1) {
      errors.max_cpa =
        formatMessage({ id: 'form_validation.more_zero', defaultMessage: '!Can not be lower than 0.1' })
    } else if (withstanding_budget > 0 && max_cpa > withstanding_budget) {
      errors.max_cpa =
        formatMessage({
          id: 'form_validation.less_than_value',
          defaultMessage: '!Can not be higher than Total Budget({withstanding_budget})'
        }, { withstanding_budget })
    }

    if (remaining_budget && withstanding_budget && remaining_budget > withstanding_budget) {
      errors.remaining_budget =
        formatMessage({
          id: 'form_validation.less_than_value',
          defaultMessage: '!Can not be higher than Total Budget({withstanding_budget})'
        }, { withstanding_budget })
    }
  }

  if (!name) {
    errors.name = required
  }
  return { fields: errors }
}

/*
function checkErrorsAndScroll(errors) {
  const fields = [
    'product_id',
    'hosted_site_id',
    'headline',
    'description',
    'media_id',
    'max_cpa',
    'currency',
    'withstanding_budget',
    'remaining_budget',
    'countries',
    'name'
  ]

  if (errors && errors.fields) {
    for (let i = 0; i < fields.length; i += 1) {
      if (errors.fields[fields[i]]) {
        const el = document.getElementById(`campaign-form-error-${fields[i]}`)
        if (el) {
          el.scrollIntoView({ block: 'start', behaviour: 'smooth' })
          return
        }
      }
    }
  }
}
*/

class CampaignForm extends React.Component {
  static propTypes = {
    editCampaignId: PropTypes.number,
    intl: PropTypes.object,
    currentValues: PropTypes.object,
    onCancel: PropTypes.func,
    onDuplicateCampaign: PropTypes.func,
    onEndCampaign: PropTypes.func,
    handleSubmit: PropTypes.func,
    FETCH_CAMPAIGN: PropTypes.func,
    FETCH_MEDIA_LIST: PropTypes.func
  };

  constructor(props) {
    super(props)
    this.state = {
      step: 0
    }
    const { formatMessage } = props.intl
    this.steps = {
      ProductPanel: {
        index: 0,
        label: formatMessage({ id: 'campaign.step_product', defaultMessage: '!Product' }),
        id: 'ProductPanel'
      },
      CreativePanel: {
        index: 1,
        label: formatMessage({ id: 'campaign.step_creative', defaultMessage: '!Creative' }),
        id: 'CreativePanel'
      },
      BudgetSchedulePanel: {
        index: 2,
        label: formatMessage({ id: 'campaign.step_budget', defaultMessage: '!Budget and Schedule' }),
        id: 'BudgetSchedulePanel'
      },
      AudiencePanel: {
        index: 3,
        label: formatMessage({ id: 'campaign.step_audience', defaultMessage: '!Audience' }),
        id: 'AudiencePanel'
      },
      ProspectRewardPanel: {
        index: 4,
        label: formatMessage({ id: 'campaign.step_reward', defaultMessage: '!Prospect Reward' }),
        id: 'ProspectRewardPanel'
      }
    }
  }

  componentDidMount() {
    const { editCampaignId } = this.props
    if (editCampaignId) {
      this.loadCampaign(editCampaignId)
    }
    this.steps.ProductPanel.elm = document.getElementById('ProductPanel')
    this.steps.CreativePanel.elm = document.getElementById('CreativePanel')
    this.steps.BudgetSchedulePanel.elm = document.getElementById('BudgetSchedulePanel')
    this.steps.AudiencePanel.elm = document.getElementById('AudiencePanel')
    this.steps.ProspectRewardPanel.elm = document.getElementById('ProspectRewardPanel')
  }

  onCancel = (e) => {
    if (this.props.onCancel) {
      this.props.onCancel(e)
    }
  }

  onDuplicateCampaign = () => {
    if (this.props.onDuplicateCampaign) {
      this.props.onDuplicateCampaign(this.props.currentValues)
    }
  }

  onEndCampaign = () => {
    if (this.props.onEndCampaign) {
      this.props.onEndCampaign(this.props.currentValues)
    }
  }

  onNameChange = () => {
    if (!this.state.nameChangedByUser) {
      this.setState({ nameChangedByUser: true })
    }
  }

  onScrollFrame = debounce((e) => {
    const { scrollTop, top } = e
    const {
      CreativePanel: creativePanel,
      BudgetSchedulePanel: budgetPanel,
      AudiencePanel: audiencePanel,
      ProspectRewardPanel: rewardPanel
    } = this.steps
    if (top === 1) {
      this.gotoProspectReward()
    } else if (scrollTop < creativePanel.elm.offsetTop - (creativePanel.elm.offsetHeight / 2)) {
      this.gotoProduct()
    } else if (scrollTop < budgetPanel.elm.offsetTop
      - (budgetPanel.elm.offsetHeight / 2)) {
      this.gotoCreative()
    } else if (scrollTop < audiencePanel.elm.offsetTop - (audiencePanel.elm.offsetHeight / 2)) {
      this.gotoBudgetSchedule()
    } else if (scrollTop < rewardPanel.elm.offsetTop - (rewardPanel.elm.offsetHeight / 2)) {
      this.gotoAudience()
    } else {
      this.gotoProspectReward()
    }
  }, 50)

  loadCampaign = (editCampaignId) => {
    this.setState({ loading: true })
    Promise.resolve(this.props.FETCH_CAMPAIGN(editCampaignId))
      .then(({ campaign = {} }) => {
        this.setState({ loading: false })
        this.props.FETCH_MEDIA_LIST({ business_id: campaign.business_id, hosted_site_id: campaign.hosted_site_id })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  gotoStep = (id) => {
    this.setState({ step: this.steps[id].index }, () => {
      if (!this.steps[id].elm) {
        this.steps[id].elm = document.getElementById(id)
      }
      this.steps[id].elm.scrollIntoView({ block: 'start', behaviour: 'smooth' })
    })
  };

  gotoProduct = () => this.setState({ step: 0 })

  gotoCreative = () => this.setState({ step: 1 })

  gotoBudgetSchedule = () => this.setState({ step: 2 })

  gotoAudience = () => this.setState({ step: 3 })

  gotoProspectReward = () => this.setState({ step: 4 })

  gotoCreativeFromProduct = () => {
    this.gotoStep('CreativePanel')
  }

  render() {
    const { intl: { formatMessage } } = this.props
    const { handleSubmit, editCampaignId } = this.props

    return (
      <form className="form-container campaign-form" onSubmit={handleSubmit}>
        {this.state.loading && (
          <Spinner
            text={formatMessage({
              id: 'campaign.loading_campaign',
              defaultMessage: '!Loading Campaign...'
            })}
          />
        )}
        <div className="form-header">
          <StepBar
            data={this.steps}
            activeIndex={this.state.step}
            active={this.gotoStep}
          />
        </div>
        <div className="form-body">
          <div className="flex">
            <div style={{ width: '60%' }} className="">
              {editCampaignId && (
                <div className="flex pt-10 pl-10">
                  <Button
                    bsType="select"
                    bsSize="middle"
                    icon="clone"
                    title={formatMessage({
                      id: 'campaign.dublicate_btn',
                      defaultMessage: '!Duplicate this Campaign'
                    })}
                    onClick={this.onDuplicateCampaign}
                  />
                  &nbsp;&nbsp;
                  <Button
                    bsType="select"
                    bsSize="middle"
                    icon="ban"
                    title={formatMessage({
                      id: 'campaign.end_btn',
                      defaultMessage: '!End Campaign'
                    })}
                    onClick={this.onEndCampaign}
                  />
                </div>
              )}
              <Scrollbars
                className={`content-region${editCampaignId ? ' edit' : ''}`}
                onScrollFrame={this.onScrollFrame}
              >
                <div id="ProductPanel">
                  <Fields
                    names={['fields.product_id', 'fields.hosted_site_id', 'fields.name']}
                    onNext={this.gotoCreativeFromProduct}
                    editing={editCampaignId !== undefined}
                    component={ProductPanel}
                    nameChangedByUser={this.state.nameChangedByUser}
                  />
                </div>
                <div id="CreativePanel">
                  <Fields
                    names={[
                      'fields.hosted_site_id', 'fields.headline', 'fields.description',
                      'fields.tags', 'fields.media_id', 'fields.media_type',
                      'fields.media_url', 'fields.media_x1', 'fields.media_y1',
                      'fields.media_x2', 'fields.media_y2'
                    ]}
                    component={CreativePanel}
                  />
                </div>
                <div id="BudgetSchedulePanel">
                  <Fields
                    names={[
                      'subs.budget_has_dates', 'fields.add_budget', 'fields.start_date',
                      'fields.end_date', 'subs.budget_has_reward', 'fields.currency',
                      'fields.max_cpa', 'fields.withstanding_budget', 'fields.remaining_budget',
                      'fields.gift_description', 'fields.gift_value', 'fields.amount_of_gifts'
                    ]}
                    component={BudgetSchedulePanel}
                    editing={editCampaignId !== undefined}
                  />
                </div>
                <div id="AudiencePanel">
                  <Fields
                    names={[
                      'subs.campaign_is_public',
                      'fields.countries', 'fields.minimum_age',
                      'fields.white_list_audience_operation',
                      'fields.white_list_audience_id', 'fields.white_list_audience_name',
                      'fields.white_list_audience_records_text',
                      'fields.white_list_audience_records_file_id'
                    ]}
                    component={AudiencePanel}
                    editing={editCampaignId !== undefined}
                  />
                </div>
                <div>
                  <div id="ProspectRewardPanel">
                    <Fields
                      names={[
                        'fields.prospect_has_reward', 'fields.discount_amount', 'fields.discount_type',
                        'fields.prospect_reward_condition', 'fields.prospect_reward_message',
                        'fields.prospect_reward_type', 'fields.prospect_reward_gift', 'fields.currency'
                      ]}
                      component={ProspectRewardPanel}
                    />
                  </div>
                  <Fields
                    names={['fields.name', 'fields.is_active']}
                    component={CampaignPanel}
                    editing={editCampaignId !== undefined}
                    onCancel={this.onCancel}
                    {...this.props}
                    onNameChange={this.onNameChange}
                  />
                </div>
              </Scrollbars>
            </div>
            <div style={{ width: '40%' }} className="">
              <CampaignPreview />
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default injectIntl(connect((state) => {
  const audiences = state.business.get('businessAudiences').toJS()
  const fields = state.campaign.get('campaign').toJS()
  const enums = state.enums.get('enums').toJS()
  const {
    RewardType: { RewardType: rewardTypes },
    DiscountType: { DiscountType: discountTypes }
  } = enums

  if (fields.white_list_audience_id) {
    const audience = audiences.find((item) => item.id === fields.white_list_audience_id)
    if (audience && audience.name) {
      fields.white_list_audience_name = audience.name
    }
  }
  fields.prospect_reward_type = fields.prospect_reward_type || rewardTypes.value_to_name.Discount
  fields.discount_type = fields.discount_type || discountTypes.value_to_name.Percentage

  /*
  setTimeout(() => {
    if (hasSubmitFailed('campaign-form')(state)) {
      checkErrorsAndScroll(getFormSyncErrors('campaign-form)(state))
    }
  }, 100)
*/
  return {
    initialValues: {
      fields,
      subs: {
        budget_has_reward: true,
        budget_has_dates: fields.start_date || fields.end_date,
        campaign_is_public: !(fields.white_list_audience_id || fields.black_list_audience_id)
      }
    },
    currentValues: {
      ...getFormValues('campaign-form')(state)
    },
    enums
  }
}, {
  FETCH_CAMPAIGN: CampaignActions.FETCH_CAMPAIGN,
  FETCH_MEDIA_LIST: MediaActions.FETCH_MEDIA_LIST
})(reduxForm({
  form: 'campaign-form',
  validate,
  enableReinitialize: true
})(CampaignForm)))
