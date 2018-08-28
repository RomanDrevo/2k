import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

const VIEW_WIDTH = 380
const VIEW_HEIGHT = 112
const BAR_WIDTH = 340
const BAR_HEIGHT = 32
const R = BAR_HEIGHT / 2
const COLORS = ['#57D589', '#1A936F', '#86ECF6']

export default class StackBarChart extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    colors: PropTypes.array
  }

  componentDidMount() {
    this.drawBar()
  }

  colors(i) {
    const colors = this.props.colors || COLORS
    return colors[i % colors.length]
  }

  drawBar() {
    const svg = d3.select(this.viewport)
    const g = svg.append('g').attr(
      'transform',
      `translate(${(VIEW_WIDTH - BAR_WIDTH) / 2},${((VIEW_HEIGHT - BAR_HEIGHT) / 2) + (BAR_HEIGHT / 2)})`
    )

    const { data } = this.props

    const sum = _.sum(Object.values(data))

    const keys = Object.keys(data)
    const pathData = []
    let left = 0
    keys.forEach((key, i) => {
      const val = data[key]
      const w = (BAR_WIDTH * val) / sum
      if (i === 0) {
        // eslint-disable-next-line
        pathData.push(`M0 0 a ${R} ${R} 0 0 1 ${R} ${-R} h ${w - R} v ${BAR_HEIGHT} h ${-(w - R)} a ${R} ${R} 0 0 1 ${-R} ${-R} Z`)
      } else if (i === keys.length - 1) {
        // eslint-disable-next-line
        pathData.push(`M${left} 0 v ${-R} h ${w - R} a ${R} ${R} 0 0 1 ${R} ${R} a ${R} ${R} 0 0 1 ${-R} ${R} h ${-(w - R)} v ${-R} Z`)
      } else {
        pathData.push(`M${left} 0 v ${-R} h ${w} v ${BAR_HEIGHT} h ${-w} v ${-R} Z`)
      }

      left += w
    })

    pathData.forEach((d, i) => {
      g.insert('path').attr('d', d).attr('stroke', 'white').attr('stroke-width', 1)
        .attr('fill', this.colors(i))
    })
  }

  refViewport = (e) => {
    this.viewport = e
  }

  render() {
    return (
      <svg ref={this.refViewport} width={380} height={112} />
    )
  }
}
