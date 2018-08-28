import _ from 'lodash'
import 'rc-calendar/assets/index.css'
import 'rc-time-picker/assets/index.css'
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar'
import Picker from 'rc-calendar/lib/Picker'
import enUS from 'rc-calendar/lib/locale/en_US'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'moment/locale/en-gb'
import Button from './Button'
import './date-range-picker.css'

const locales = {
  enUS,
  en: enUS
}

/* export const CATEGORIES = {
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 days',
  last_14_days: 'Last 14 days',
  last_30_days: 'Last 30 days',
  this_week: 'This week',
  last_week: 'Last week',
  this_month: 'This month',
  last_month: 'Last month',
  custom: 'Custom'
}*/
const now = moment()
now.locale('en-gb').utcOffset(0)

const defaultCalendarValue = now.clone()
defaultCalendarValue.add(-1, 'month')


function isValidRange(v) {
  return v && v[0] && v[1]
}

class DateRangePicker extends React.Component {
  static propTypes = {
    hideCategory: PropTypes.bool,
    hideTriggerIcon: PropTypes.bool,
    category: PropTypes.string,
    dateFormat: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    valueStyle: PropTypes.object,
    intl: PropTypes.object.isRequired,
    value: PropTypes.array, // [moment1, moment2]
    onUpdate: PropTypes.func,
    onCancel: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.value = props.value && props.value.length === 2 && props.value[0] && props.value[1]
      ? props.value : [moment().startOf('isoWeek'), moment().endOf('isoWeek')]
    this.category = props.category || 'this_week'
    this.state = {
      open: false,
      value: this.value,
      hoverValue: [],
      category: this.category
    }
    if (props.onUpdate) {
      props.onUpdate(this.value, this.category)
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value) {
      this.value = newProps.value
    }
    if (newProps.category) {
      this.category = newProps.category
    }
  }

  onChange = (value) => {
    this.setState({
      value,
      category: 'custom'
    })
  }

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue })
  }

  onSelectCategory = (category) => {
    let value
    const today = moment()
    const yesterday = moment().subtract(1, 'day')
    switch (category) {
    case 'yesterday':
      value = [yesterday, yesterday]
      break
    case 'last_7_days':
      value = [moment().subtract(7, 'day'), today]
      break
    case 'last_14_days':
      value = [moment().subtract(14, 'day'), today]
      break
    case 'last_30_days':
      value = [moment().subtract(30, 'day'), today]
      break
    case 'this_week':
      value = [moment().startOf('isoWeek'), moment().endOf('isoWeek')]
      break
    case 'last_week':
      value = [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')]
      break
    case 'this_month':
      value = [moment().startOf('month'), moment().endOf('month')]
      break
    case 'last_month':
      value = [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')]
      break
    case 'custom':
      value = [null, null]
      break
    case 'today':
    default:
      value = [today, today]
    }
    this.setState({
      category,
      value,
      hoverValue: []
    })
  }

  onClickTrigger = () => {
    this.setState({ open: true })
  }

  getCategories = () => {
    const { intl: { formatMessage } } = this.props
    return {
      today: formatMessage({ id: 'date_picker.today', defaultMessage: '!Today' }),
      yesterday: formatMessage({ id: 'date_picker.yesterday', defaultMessage: '!Yesterday' }),
      last_7_days: formatMessage({ id: 'date_picker.last_7_days', defaultMessage: '!Last 7 days' }),
      last_14_days: formatMessage({ id: 'date_picker.last_14_days', defaultMessage: '!Last 14 days' }),
      last_30_days: formatMessage({ id: 'date_picker.last_30_days', defaultMessage: '!Last 30 days' }),
      this_week: formatMessage({ id: 'date_picker.this_week', defaultMessage: '!This week' }),
      last_week: formatMessage({ id: 'date_picker.last_week', defaultMessage: '!Last week' }),
      this_month: formatMessage({ id: 'date_picker.this_month', defaultMessage: '!This month' }),
      last_month: formatMessage({ id: 'date_picker.last_month', defaultMessage: '!Last month' }),
      custom: formatMessage({ id: 'date_picker.custom', defaultMessage: '!Custom' })
    }
  }

  format = (v) => {
    const { dateFormat, intl: { formatDate } } = this.props
    // return v ? v.format(dateFormat || 'MMM DD') : ''
    return v ? formatDate(v, dateFormat || { day: '2-digit', month: 'short' }) : ''
  }

  handleCancel = () => {
    this.setState({
      value: this.value,
      category: this.category,
      open: false,
      hoverValue: []
    }, () => {
      if (this.props.onCancel) {
        this.props.onCancel()
      }
    })
  };

  handleUpdate = () => {
    const { onUpdate } = this.props
    const { value, category } = this.state
    this.setState({
      open: false,
      hoverValue: []
    }, () => {
      if (onUpdate && (!_.isEqual(value, this.value) || category !== this.category)) {
        onUpdate(value, category)
      }
    })
  };

  renderFooter = () => (
    <div className="drpc-footer">
      <Button bsSize="middle" bsType="cancel" onClick={this.handleCancel}>
        <FormattedMessage id="date_picker.cancel" defaultMessage="!Cancel" />
      </Button>&nbsp;&nbsp;
      <Button bsSize="middle" onClick={this.handleUpdate}>
        <FormattedMessage id="date_picker.update" defaultMessage="!Update" />
      </Button>
    </div>
  )

  renderSidebar = () => {
    const { category } = this.state

    return (
      <div className="drpc-sidebar">
        {Object.keys(this.getCategories()).map((key) => (
          <div
            key={key}
            className={`drpc-sidebar-item${category === key ? ' selected' : ''}`}
            onClick={() => this.onSelectCategory(key)}
          >
            {this.getCategories()[key]}
          </div>
        ))}
      </div>
    )
  }

  renderCalendar() {
    const { value, hoverValue } = this.state
    const { className = '', intl: { locale } } = this.props
    if (this.props.hideCategory) {
      return (
        <RangeCalendar
          className={`date-range-picker-calendar hide-category ${className}`}
          hoverValue={hoverValue}
          onHoverChange={this.onHoverChange}
          selectedValue={value}
          showWeekNumber={false}
          dateInputPlaceholder={['start', 'end']}
          locale={locales[locale] || enUS}
          renderFooter={this.renderFooter}
          showToday={false}
        />
      )
    }

    return (
      <RangeCalendar
        className={`date-range-picker-calendar ${className}`}
        hoverValue={hoverValue}
        onHoverChange={this.onHoverChange}
        selectedValue={value}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        locale={locales[locale] || enUS}
        renderSidebar={this.renderSidebar}
        renderFooter={this.renderFooter}
        showToday={false}
      />
    )
  }

  renderValue() {
    const { category, value } = this.state
    if (!isValidRange(value)) {
      return ''
    }
    if (category === 'today' || category === 'yesterday') {
      return `${!this.props.hideCategory
        ? `${this.getCategories()[category]}: `
        : ''}${this.format(value[0])}`
    }

    return `${!this.props.hideCategory
      ? `${this.getCategories()[category]}: `
      : ''}${this.format(value[0])} - ${this.format(value[1])}`
  }

  render() {
    const { open, value } = this.state

    return (
      <Picker
        open={open}
        value={value}
        onChange={this.onChange}
        // animation="slide-up"
        calendar={this.renderCalendar()}
      >
        {() => (
          <div className="date-range-picker-trigger" onClick={this.onClickTrigger} style={this.props.style}>
            <div className="date-range-picker-trigger-title" style={this.props.valueStyle}>{this.renderValue()}</div>
            {!this.props.hideTriggerIcon &&
              <div className="date-range-picker-trigger-icon"><i className="fa fa-caret-down" /></div>}
          </div>
        )}
      </Picker>
    )
  }
}

export default injectIntl(DateRangePicker)
