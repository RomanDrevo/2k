import React from 'react'
import PropTypes from 'prop-types'
import './rating.css'

export default class Rating extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    rating: PropTypes.number
  }

  constructor(props) {
    super(props)

    this.state = {
      rating: this.props.rating || null,
      temp_rating: null
    }
  }

  rate(rating) {
    if (this.props.disabled) return
    this.setState({
      rating,
      temp_rating: rating
    })
  }

  star_over() {
    this.setState({
      rating: this.state.rating,
      temp_rating: this.state.temp_rating
    })
  }

  star_out = () => {
    this.setState({ rating: this.state.rating })
  }

  render() {
    const stars = []

    for (let i = 0; i < 5; i += 1) {
      let klass = 'star-rating__star'

      if (this.state.rating >= i && this.state.rating != null) {
        klass += ' is-selected'
      }
      /* eslint-disable jsx-a11y/label-has-for */
      const label = (
        <label
          key={`star-label-${i}`}
          className={klass}
          onClick={() => this.rate(i)}
          onMouseOver={() => this.star_over(i)}
          onMouseOut={this.star_out}
        >
          ★
        </label>
      )
      /* eslint-enable jsx-a11y/label-has-for */
      stars.push(label)
    }

    return (
      <div className="star-rating">
        {stars}
      </div>
    )
  }
}
