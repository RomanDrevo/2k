import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

class HostedSite extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onView: PropTypes.func.isRequired
  }

  handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onView(this.props.item.entrypoint_short_url)
  }

  render() {
    const { item } = this.props
    return (
      <div>
        <div className="thumbnail-wrapper">
          <div className="thumbnail-content">
            <img
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              src={item.thumbnail_url || 'https://via.placeholder.com/150x100?text=No+Logo'}
              alt={item.name}
            />
          </div>
          <div className="thumbnail-crop-overlay flex">
            <FormattedMessage
              tagName="span"
              id="campaign.view_hosted"
              defaultMessage="!View hosted site"
            />
            <i className="fa fa-arrows-alt" onClick={this.handleClick} />
          </div>
        </div>
        <div className="thumbnail-item-title">{item.name}</div>
      </div>
    )
  }
}

const IntlHostedSite = injectIntl(HostedSite)

export default (props) => <IntlHostedSite {...props} />
