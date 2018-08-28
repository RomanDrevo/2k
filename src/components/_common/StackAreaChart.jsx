import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedNumber } from 'react-intl'
import * as d3 from 'd3'
import { generateTempId } from '../../_core/utils'
import './stack-area-chart.css'

const VIEW_HEIGHT = 200
const MARGIN = {
  left: 20,
  top: 10,
  right: 20,
  bottom: 40
}
const COLORS = ['#57D589', '#86ECF6', '#1A936F']

const $ = window.jQuery
$.fn.textWidth = function(text, font) {
  if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body)
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'))
  return $.fn.textWidth.fakeEl.width()
}

class StackAreaChart extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.array.isRequired,
    xAxisInfo: PropTypes.object.isRequired,
    // {key:keyName, title:titleName, unit:unitName}
    yAxisInfo: PropTypes.array.isRequired,
    // [
    // {key:keyName1, title:titleName1, unit:unitName1, color:colorValue1},
    // {key:keyName2, title:titleName2, unit:unitName2, color:colorValue2},...]
    width: PropTypes.number
  }

  constructor(props) {
    super(props)

    this.state = {
      data: props.data,
      xAxisInfo: props.xAxisInfo,
      yAxisInfo: props.yAxisInfo,
      width: props.width
    }

    this.id = props.id || `stack-area-chart-${generateTempId()}`
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.refresh()
  }


  componentWillReceiveProps(newProps) {
    if (!_.isEqual(this.props.data, newProps.data)) {
      this.setState({ data: newProps.data }, () => {
        this.refresh()
      })
    }
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(this.props.data, newProps.data)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  getTotalMaxY() {
    const { data, yAxisInfo } = this.state

    let max = 0
    data.forEach((d) => {
      const m = _.max(yAxisInfo.map((info) => d[info.key]))
      if (m >= max) max = m
    })
    return max
  }

  getMax(key) {
    const { data } = this.state
    return _.max(data.map((d) => d[key]))
  }

  refresh() {
    this.clearChart()
    this.drawChart()
  }

  handleResize = () => {
    this.refresh()
  }

  clearChart() {
    d3.select(this.viewport).selectAll('*').remove()
  }

  drawChart() {
    const viewport = d3.select(this.viewport)
    const chartWidth = $(`#${this.id}`).width() - MARGIN.left - MARGIN.right
    const chartHeight = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom

    const { data, xAxisInfo, yAxisInfo } = this.state

    const xValue =
          (d) => (xAxisInfo.formatter ? xAxisInfo.formatter(d[xAxisInfo.key]) : d[xAxisInfo.key])

    const dataX = data.map(xValue)
    const yMax = this.getTotalMaxY()

    const chartX = d3.scaleBand()
      .range([0, chartWidth])
      .domain(dataX)
    const chartY = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, yMax])
    const xAxis = d3.axisBottom()
      .scale(chartX)
      .tickSize(5, 0)
    const yAxis = d3.axisRight()
      .scale(chartY)
      .tickSize(chartWidth)
      .ticks(d3.min([5, yMax]))

    const g = viewport.append('g')
    g.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Insert x-axis
    g.insert('g', ':first-child')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call((g1) => {
        g1.call(xAxis)
        g1.select('.domain').remove()

        // hidden x-axis labels if width is over
        const textsWidth = _.sum(dataX.map((x) => $.fn.textWidth(x, '1rem Roboto')))
        if (textsWidth > chartWidth) {
          g1.selectAll('.tick text').style('display', 'none')
        }
      })

      // Insert y-axis
    g.insert('g', ':first-child')
      .attr('class', 'axis y-axis')
      .call((g1) => {
        g1.call(yAxis)
        g1.select('.domain').remove()
        g1.selectAll('.tick:not(:first-of-type) line').attr('stroke', '#9D9FA0').attr('stroke-dasharray', '2,2')
        g1.selectAll('.tick text').attr('x', -15).attr('dy', -4)
      })


      // Draw area chart

    yAxisInfo.sort((i1, i2) => this.getMax(i1.key) < this.getMax(i2.key)).forEach((info, i) => {
      const area = d3.area()
        .x((d) => chartX(xValue(d)) + (chartX.bandwidth() / 2))
        .y0(chartHeight)
        .y1((d) => chartY(d[info.key]))

      g.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area)
        .attr('stroke', 'white')
        .attr('fill', info.color || COLORS[i % yAxisInfo.length])
    })

    // Draw tooltip

    setTimeout(() => {
      g.selectAll('.area')
        .on('mousemove', (d, i) => {
          const xBand = chartX.step()
          const index = Math.floor(((d3.event.offsetX - MARGIN.left) / xBand))
          const xVal = chartX.domain()[index]
          const yVal = data.find((d1) => xValue(d1) === xVal)[yAxisInfo[i].key]

          const color = yAxisInfo[i].color || COLORS[i % yAxisInfo.length]
          const tooltip = d3.select(this.tooltip)
          tooltip.select('.chart-tooltip-color')
            .style('background-color', color)
          tooltip.select('.chart-tooltip-key')
            .text(xVal)
          tooltip.select('.chart-tooltip-value')
            .text(yVal)

          const tooltipRect = tooltip.node().getBoundingClientRect()
          const legendRect = this.legend.getBoundingClientRect()

          const cx = chartX(xVal)
          const cy = chartY(yVal)
          tooltip.style('left', `${(cx + MARGIN.left) - (tooltipRect.width / 2)}px`)
            .style('top', `${(cy + legendRect.height) - tooltipRect.height}px`)
            .style('visibility', 'visible')

          const r = 4
          g.selectAll('.tooltip-point').remove()
          g.append('circle')
            .attr('class', 'tooltip-point')
            .attr('cx', cx + (xBand / 2))
            .attr('cy', cy)
            .attr('r', r)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('fill', color)
        })
        .on('mouseout', () => {
          d3.select(this.tooltip)
            .style('visibility', 'hidden')
            .style('left', '0px')
            .style('top', '0px')
          g.selectAll('.tooltip-point').remove()
        })
    }, 500)
  }

  refLegend = (node) => {
    this.legend = node
  }

  refViewport = (node) => {
    this.viewport = node
  }

  render() {
    const { data, yAxisInfo, width } = this.state
    return (
      <div
        id={this.id}
        className="stack-area-chart"
        style={{ width: `${width !== undefined ? `${width}px` : '100%'}` }}
      >
        <div ref={this.refLegend} className="legend">
          {
            yAxisInfo.map((info, i) => {
              const val = _.mean(data.map((d) => d[info.key]))
              return (
                <div key={`legend-${info.key}`} className="legend-item">
                  <div
                    className="legend-value"
                  >
                    {_.isNaN(val) ? 0 : (
                      <FormattedNumber value={Math.round(val)} />
                    )}{info.unit}
                  </div>
                  <div className="legend-desc">
                    <div
                      className="legend-icon"
                      style={{ background: info.color || COLORS[i % yAxisInfo.length] }}
                    />
                    <div className="legend-title">{info.title}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <svg ref={this.refViewport} width="100%" height={VIEW_HEIGHT} />
        <div
          ref={(node) => {
            this.tooltip = node
          }}
          className="chart-tooltip"
        >
          <div className="chart-tooltip-color" />
          <div className="chart-tooltip-key" />
          <div className="chart-tooltip-value" />
        </div>
      </div>
    )
  }
}

export default injectIntl(StackAreaChart)
