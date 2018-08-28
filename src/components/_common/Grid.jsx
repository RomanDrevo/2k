import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Collapsible from 'react-collapsible'
import { isFloat, isInt, generateTempId } from '../../_core/utils'
import './grid.css'

export default class Grid extends React.Component {
    static propTypes = {
      columns: PropTypes.array.isRequired,
      data: PropTypes.array,
      striped: PropTypes.bool,
      initialSortDisabled: PropTypes.bool,
      expandedRowRenderer: PropTypes.func,
      expandedRows: PropTypes.array, // expanded rows
      emptyMessage: PropTypes.string,
      filterFunc: PropTypes.func
    }

    constructor(props) {
      super(props)

      this.state = {}

      if (!props.initialSortDisabled) {
        const sortColumn = _.find(props.columns, { sort: true })
        if (sortColumn) {
          this.state = {
            sort: {
              column: sortColumn,
              asc: true
            }
          }
        } else {
          this.state = {}
        }
      }
    }

    componentWillReceiveProps(newProps) {
      if (newProps.initialSortDisabled && !_.isEqual(newProps.data, this.props.data)) {
        this.setState({ sort: null })
      }
    }

    getSortData = (data, column, asc = true) => {
      if (column.dataIndex) {
        return _.orderBy(data, (t) => {
          const val = t[column.dataIndex]
          if (isInt(val)) {
            return parseInt(val, 10)
          } else if (isFloat(val)) {
            return parseFloat(val)
          }
          return val
        }, asc ? 'asc' : 'desc')
      } else if (column.sortFunc) {
        return _.orderBy(data, column.sortFunc, asc ? 'asc' : 'desc')
      }
      return data
    }
    getFilteredData = () => {
      let data = this.props.data || []

      const { sort, keyword } = this.state
      if (sort) {
        data = this.getSortData(data, sort.column, sort.asc)
      }

      if (keyword && keyword !== '') {
        data = _.filter(data, (item) =>
          Object.keys(item).some((key) => {
            const val = item[key]
            return val && typeof val === 'string' && val.toLowerCase().indexOf(keyword.trim().toLowerCase()) !== -1
          }))
      }

      if (this.props.filterFunc) {
        data = this.props.filterFunc(data)
      }
      return data
    }


    sortDataBy = (column) => {
      const sort = {
        column,
        asc: this.state.sort && _.isEqual(this.state.sort.column, column) ?
          !this.state.sort.asc
          :
          true
      }
      this.setState({
        sort
      })
    }

    columnStyle(c) {
      const { width, flex, align } = c

      const style = {}
      if (width) style.width = width
      else if (flex) style.flex = flex
      else style.flex = 1

      if (align) style.textAlign = align
      else style.textAlign = 'center'

      return style
    }

    renderColumns() {
      const { columns } = this.props
      return (
        <div className="grid-header-container">
          {
            columns.map((c) => {
              const columnKey = `column-${generateTempId()}`
              if (c.columnRenderer && typeof c.columnRenderer === 'function') {
                return (
                  <div key={columnKey} className="column" style={this.columnStyle(c)}>
                    {c.columnRenderer()}
                  </div>
                )
              }
              if (c.sort) {
                const { sort } = this.state
                let sortIcon = null
                if (sort && _.isEqual(sort.column, c)) {
                  sortIcon = sort.asc ? 'asc' : 'desc'
                }
                return (
                  <div
                    key={columnKey}
                    className="column"
                    style={this.columnStyle(c)}
                    onClick={() => this.sortDataBy(c)}
                  >
                    {sortIcon && <i className={`fa fa-sort-${sortIcon}`} />} {c.name}
                  </div>
                )
              }
              return (
                <div key={columnKey} className="column" style={this.columnStyle(c)}>
                  {c.name}
                </div>
              )
            })
          }
        </div>
      )
    }

    renderRows() {
      const {
        columns, expandedRowRenderer, expandedRows, emptyMessage
      } = this.props

      const data = this.getFilteredData()

      if (!data || data.length === 0) return <div className="empty-message">{emptyMessage || 'There is no data'}</div>

      return (
        <div>
          {
            data.map((record, i) => {
              const cellEl = (column) => {
                const { dataIndex, renderer } = column
                if (renderer && typeof renderer === 'function') {
                  return renderer(record, dataIndex ? record[dataIndex] : null, i)
                } else if (dataIndex) {
                  return record[dataIndex]
                }
                return ''
              }

              const rowKey = `row-${generateTempId()}`
              const rowEl = () => (
                <div
                  key={rowKey}
                  className={classnames('grid-row-container', { striped: this.props.striped && i % 2 === 1 })}
                >
                  {columns.map((c) => (
                    <div key={`column-${generateTempId()}`} className="cell" style={this.columnStyle(c)}>
                      {cellEl(c)}
                    </div>
                  ))}
                </div>
              )

              if (expandedRowRenderer) {
                const open = expandedRows.indexOf(record) > -1
                return (
                  <Collapsible
                    key={rowKey}
                    transitionTime={200}
                    contentOuterClassName={open ? 'overflow-no-hidden' : null}
                    trigger={rowEl()}
                    triggerDisabled
                    open={open}
                  >
                    {expandedRowRenderer(record)}
                  </Collapsible>
                )
              }
              return rowEl()
            })
          }
        </div>
      )
    }

    render() {
      return (
        <div className="grid-container">
          {this.renderColumns()}
          {this.renderRows()}
        </div>
      )
    }
}
