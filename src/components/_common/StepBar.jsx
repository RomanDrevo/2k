import React from 'react'
import PropTypes from 'prop-types'
import Step from './Step'
import './step-bar.css'

const StepBar = ({ data, activeIndex, active }) => (
  <div className="step-bar-container">
    {Object.keys(data).map((key) => {
      const isFirstItem = data[key].index === 0
      const isLastItem = data[key].index === Object.keys(data).length - 1
      return (
        <Step
          key={data[key].index}
          isFirstItem={isFirstItem}
          activeItem={activeIndex === data[key].index}
          isLastItem={isLastItem}
          active={active}
          item={data[key]}
        />
      )
    })}
  </div>
)

StepBar.propTypes = {
  activeIndex: PropTypes.number,
  data: PropTypes.object.isRequired,
  active: PropTypes.func.isRequired
}

StepBar.defaultProps = {
  activeIndex: 0
}

export default StepBar
