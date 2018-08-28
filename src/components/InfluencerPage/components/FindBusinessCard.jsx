import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import { Button, Card, ListView } from '../../_common'

const data = [{
  title: 'JOEN BRYCE',
  description: 'High - Tech Education',
  location: 'Tel Aviv Israel',
  img_url: '/img/sample_business1.png'
}, {
  title: 'Roey Karib',
  description: 'Privet Lessons Education',
  location: 'Tel Aviv Israel',
  img_url: '/img/sample_business2.png'
}, {
  title: 'Anat Gabriel YOGA',
  description: 'Yoga Teacher',
  location: 'Tel Aviv Israel',
  img_url: '/img/sample_business3.png'
}, {
  title: 'Wonderfood',
  description: 'Vegeterian Cooking Classes',
  location: 'Tel Aviv Israel',
  img_url: '/img/sample_business4.png'
}, {
  title: 'Pnima Interior Design',
  description: 'Design Your New Place',
  location: 'Tel Aviv Israel',
  img_url: '/img/sample_business5.png'
}]

class FindBusinessCard extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired
  }

  renderDesktop() {
    const { intl: { formatMessage } } = this.props

    const itemEl = (item) => (
      <div className="flex pd-5" style={{ background: 'white' }}>
        <div className="list-item-icon"><img src={item.img_url} alt="" /></div>
        <div className="flex-1 ml-10">
          <div className="list-item-title">{item.title}</div>
          <div className="list-item-desc">{item.description}</div>
          <div className="list-item-desc">{item.location}</div>
        </div>
      </div>
    )

    return (
      <div style={{ padding: 10 }}>
        <div>
          <ListView data={data} itemEl={itemEl} />
        </div>
        <div className="mt-10 flex align-center">
          <Button
            bsSize="small"
            style={{ background: 'none', color: '#1A936F', fontSize: 12 }}
            icon="plus"
            title={formatMessage({ id: 'main.more', defaultMessage: '!More' })}
          />
        </div>
      </div>
    )
  }

  render() {
    const { intl: { formatMessage } } = this.props
    return (
      <Card
        title={formatMessage({ id: 'influencer.find_business', defaultMessage: '!Find Business You Love' })}
        className="d-md-none"
      >
        {this.renderDesktop()}
      </Card>
    )
  }
}

export default injectIntl(FindBusinessCard)
