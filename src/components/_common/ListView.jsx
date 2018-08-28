import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './list-view.css'

const ListView = ({ itemEl, data = [], striped }) => (
  <div>
    {data.map((record, i) => (
      <div
        key={`list-item-${i}`}
        className={classnames('list-row-container', { striped: striped && i % 2 === 0 })}
      >
        {itemEl(record)}
      </div>
    ))}
  </div>
)

ListView.propTypes = {
  data: PropTypes.array.isRequired,
  itemEl: PropTypes.func.isRequired,
  striped: PropTypes.bool
}

export default ListView
