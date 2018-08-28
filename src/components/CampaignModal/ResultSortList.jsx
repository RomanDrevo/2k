import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import './result-sort-list.css'

export const SORT_BY_NAME = 'by_name'
export const SORT_BY_ACTIVITY = 'by_activity'
class ResultSortList extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  }
  sortByName = () => {
    this.props.onSelect(SORT_BY_NAME)
  }
  sortByActivity = () => {
    this.props.onSelect(SORT_BY_ACTIVITY)
  }
  render() {
    return (
      <div className="result-sort-list">
        <div className="result-sort-list-title border-bottom">
          <FormattedMessage id="campaign_results.sort" defaultMessage="!Sort" />
        </div>
        <div className="result-sort-list-item border-bottom" onClick={this.sortByName}>
          <FormattedMessage id="campaign_results.sort_by_name" defaultMessage="!By Name a-z" />
        </div>
        <div className="result-sort-list-item" onClick={this.sortByActivity}>
          <FormattedMessage id="campaign_results.sort_by_activity" defaultMessage="!By Activity" />
        </div>
      </div>
    )
  }
}

export default injectIntl(ResultSortList)
