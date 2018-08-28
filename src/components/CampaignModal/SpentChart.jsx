import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import { injectIntl } from 'react-intl'
import { generateTempId } from '../../_core/utils'

const VIEW_HEIGHT = 112
const MARGIN_LEFT = 30
const MARGIN_RIGHT = 30
const BAR_HEIGHT = 32
const R = BAR_HEIGHT / 2
const COLORS = ['#57D589', '#1A936F']
const VALUE_COLOR = '#434343'

const $ = window.jQuery

class SpentChart extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    currency: PropTypes.string,
    spent_budget: PropTypes.number.isRequired,
    remaining_budget: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    intl: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.id = props.id || `spent-chart-${generateTempId()}`

    this.state = {
      spent_budget: props.spent_budget,
      remaining_budget: props.remaining_budget,
      width: props.width,
      height: props.height,
      currency: props.currency
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.refresh)
    setTimeout(() => this.refresh(), 1000)
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(newProps, this.props)) {
      this.setState({
        ...newProps
      }, () => this.refresh())
    }
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props, newProps)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refresh)
  }

  refresh = () => {
    this.barWidth = $(`#${this.id}`).width() - MARGIN_LEFT - MARGIN_RIGHT

    this.clearChart()
    this.drawBar()
    this.drawPercentTooltip()
    this.drawValueLabels()
  }

  clearChart = () => {
    d3.select(this.viewport).selectAll('*').remove()
  }

  drawBar = () => {
    const { spent_budget, remaining_budget } = this.state
    if (spent_budget === 0 && remaining_budget === 0) {
      return
    }
    const svg = d3.select(this.viewport)
    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN_LEFT},${((VIEW_HEIGHT - BAR_HEIGHT) / 2) + (BAR_HEIGHT / 2)})`)
    const sum = spent_budget + remaining_budget
    // Insert spent budget bar
    let spent_width = (this.barWidth * spent_budget) / sum
    if (spent_width < R) {
      spent_width = R
    }
    g.insert('path')
      // eslint-disable-next-line
      .attr('d', `M0 0 a ${R} ${R} 0 0 1 ${R} ${-R} h ${spent_width - R} v ${BAR_HEIGHT} h ${-(spent_width - R)} a ${R} ${R} 0 0 1 ${-R} ${-R} Z`)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('fill', COLORS[0])

      // Insert remaining budget bar
    let remaining_width = (this.barWidth * remaining_budget) / sum
    if (remaining_width > this.barWidth - R) remaining_width = this.barWidth - R
    g.insert('path')
      // eslint-disable-next-line
      .attr('d', `M${spent_width} 0 v ${-R} h ${remaining_width - R} a ${R} ${R} 0 0 1 ${R} ${R} a ${R} ${R} 0 0 1 ${-R} ${R} h ${-(remaining_width - R)} v ${-R} Z`)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('fill', COLORS[1])
  }

  drawPercentTooltip = () => {
    const { spent_budget, remaining_budget } = this.state
    if (spent_budget === 0 && remaining_budget === 0) {
      return
    }
    const sum = spent_budget + remaining_budget
    const percent = (100 * remaining_budget) / sum
    let spent_width = (this.barWidth * spent_budget) / sum
    if (spent_width < R) {
      spent_width = R
    }
    const svg = d3.select(this.viewport)
    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN_LEFT + spent_width},${((VIEW_HEIGHT - BAR_HEIGHT) / 2) - 5})`)

    // Insert tooltip container
    g.insert('path')
      .attr('d', 'M0 0 l 5 -5 h 30 v -28 h -70 v 28 h 30 l 5 5 Z')
      .attr('fill', COLORS[1])

      // Insert text
    g.append('text')
      .style('fill', 'white')
      .style('font-size', '12px')
      .attr('x', 0)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .text(`${percent}% Left`)
  }

  drawValueLabels = () => {
    const { spent_budget, remaining_budget } = this.state
    const { intl: { formatNumber, formatMessage } } = this.props
    if (spent_budget === 0 && remaining_budget === 0) {
      return
    }
    const svg = d3.select(this.viewport)
    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN_LEFT},${((VIEW_HEIGHT - BAR_HEIGHT) / 2) + BAR_HEIGHT + 5})`)

    // Insert spent budget value text
    g.append('text')
      .style('fill', VALUE_COLOR)
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .attr('x', 0)
      .attr('y', 0) // set y position of bottom of text
      .attr('dy', '18px')
      .attr('text-anchor', 'start')
      .text(formatMessage(
        { id: 'campaign_results.spent_value', defaultMessage: '!{spent} Spent' },
        { spent: formatNumber(spent_budget, { style: 'currency', currency: this.state.currency }) }
      ))

      // Insert remaining budget value text
    g.append('text')
      .style('fill', VALUE_COLOR)
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .attr('x', this.barWidth)
      .attr('y', 0) // set y position of bottom of text
      .attr('dy', '18px')
      .attr('text-anchor', 'end')
      .text(formatMessage(
        { id: 'campaign_results.remain_value', defaultMessage: '!{remain} Remain' },
        { remain: formatNumber(remaining_budget, { style: 'currency', currency: this.state.currency }) }
      ))
  }

  refViewport = (e) => {
    this.viewport = e
  }

  render() {
    const { width, height } = this.state

    return (
      <div
        id={this.id}
        style={{
          width: `${width !== undefined ? `${width}px` : '100%'}`,
          height: `${height !== undefined ? `${height}px` : '100%'}`,
          margin: 'auto'
        }}
      >
        <svg ref={this.refViewport} width="100%" height={VIEW_HEIGHT} />
      </div>
    )
  }
}

export default injectIntl(SpentChart)
