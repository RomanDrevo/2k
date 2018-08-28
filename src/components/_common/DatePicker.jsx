import { injectIntl } from 'react-intl'
import React from 'react'
import PropTypes from 'prop-types'
import Calendar from 'rc-calendar'
import Picker from 'rc-calendar/lib/Picker'
// import zhCN from 'rc-calendar/lib/locale/zh_CN'
import enUS from 'rc-calendar/lib/locale/en_US'
import 'rc-time-picker/assets/index.css'
import TimePickerPanel from 'rc-time-picker/lib/Panel'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'moment/locale/en-gb'
import './text-input.css'

const format = 'YYYY-MM-DD HH:mm:ss'


function getFormat(time) {
  return time ? format : 'DD/MM/YYYY'
}

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />

function disabledTime(date) {
  if (date && (date.date() === 15)) {
    return {
      disabledHours() {
        return [3, 4]
      }
    }
  }
  return {
    disabledHours() {
      return [1, 2]
    }
  }
}

const DatePicker = (props) => {
  const {
    showTime, showDateInput, showToday, disabled, inputStyle,
    inputClassName, placeholder, errorInside, error, border,
    disabledDate, defaultValue, value, onChange
  } = props


  const calendar = (
    <Calendar
      locale={enUS}
      style={{ zIndex: 1000 }}
      dateInputPlaceholder="please input"
      formatter={getFormat(showTime)}
      disabledTime={showTime ? disabledTime : null}
      timePicker={showTime ? timePickerElement : null}
      defaultValue={defaultValue || moment()}
      showDateInput={showDateInput}
      disabledDate={disabledDate}
      showToday={showToday}
    />
  )

  return (
    <Picker
      animation="slide-up"
      disabled={disabled}
      calendar={calendar}
      value={value}
      onChange={onChange}
    >
      {() => (
        <div className="text-input-container">
          <div className="field-input">
            <div className={`input-wrapper${border ? ' border' : ''}${error && errorInside ? ' error-inside' : ''}`}>
              <input
                placeholder={placeholder}
                style={inputStyle}
                disabled={disabled}
                readOnly
                tabIndex="-1"
                className={`date-picker-input-cls ${inputClassName}`}
                value={(value && value.format(getFormat(showTime))) || ''}
              />
            </div>
          </div>
          {error && !errorInside && <div className="msg small error">{error}</div>}
        </div>
      )}
    </Picker>
  )
}

DatePicker.propTypes = {
  border: PropTypes.bool,
  errorInside: PropTypes.bool,
  showTime: PropTypes.bool,
  showDateInput: PropTypes.bool,
  showToday: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  inputClassName: PropTypes.string,
  error: PropTypes.string,
  inputStyle: PropTypes.object,
  defaultValue: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabledDate: PropTypes.func,
  onChange: PropTypes.func
}

DatePicker.defaultProps = {
  showDateInput: false,
  showTime: false
}

export default injectIntl(DatePicker)
