import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { IconButton, DisplayField, Rating } from '../_common'
import defaultUserIcon from '../../icons/default_user.png'
import './influencer-info-card.css'

class InfluencerInfoCard extends React.Component {
    static propTypes = {
      onClose: PropTypes.func,
      data: PropTypes.object,
      intl: PropTypes.object.isRequired
    }
    onClose = () => {
      if (this.props.onClose) this.props.onClose()
    }

    render() {
      const { intl: { formatDate, formatMessage } } = this.props
      const {
        data: {
          email, name, phone, n_campaigns, n_products,
          n_leads_generated, n_views_generated, total_earned,
          /* earnings_currency, total_cashed, */
          total_balance, avg_convertion_rate, member_since, last_activity
        }
      } = this.props
      return (
        <div className="contact-card-container">
          <div className="contact-info-main">
            <div className="sub-title">
              <FormattedMessage id="pendings.influencer" defaultMessage="!Influencer" />
            </div>
            <div className="avatar"><img src={defaultUserIcon} alt="user-avatar" /></div>
            <div className="name">{name}</div>
            <Rating rating={avg_convertion_rate} disabled />
            <div className="description">
              <FormattedMessage
                id="settings.member_since"
                defaultMessage="!Member Since {date}"
                values={{
                  date: formatDate(new Date(member_since), { month: 'short', year: 'numeric' })
                }}
              />
            </div>
          </div>
          <div style={{ width: 1, height: '100%' }} />
          <div className="contact-info-detail">
            <div>
              <div style={{ display: 'flex' }}>
                <div className="sub-title" style={{ flex: 1 }}>
                  <FormattedMessage id="pendings.personal_info" defaultMessage="!Personal Info" />
                </div>
                <IconButton icon="close" onClick={this.onClose} style={{ color: '#434343' }} />
              </div>

              <DisplayField icon="envelope-o" value={email} />
              <DisplayField icon="phone" value={phone} />
            </div>
            <div style={{ marginTop: 5 }}>
              <div className="sub-title">
                <FormattedMessage id="pendings.results_summary" defaultMessage="!Results Summary" />
              </div>
              <div style={{ display: 'flex' }}>
                <DisplayField
                  label={formatMessage({ id: 'pendings.products', defaultMessage: 'Products' })}
                  value={n_products}
                />
                <DisplayField
                  label={formatMessage({ id: 'pendings.campaigns', defaultMessage: 'Campaigns' })}
                  value={n_campaigns}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <DisplayField
                  label={formatMessage({ id: 'pendings.reach', defaultMessage: 'Reach' })}
                  value={n_views_generated}
                />
                <DisplayField
                  label={formatMessage({ id: 'pendings.leads', defaultMessage: 'Leads' })}
                  value={n_leads_generated}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <DisplayField
                  label={formatMessage({ id: 'pendings.earned', defaultMessage: 'Earned' })}
                  value={`${total_earned}$`}
                />
                <DisplayField
                  label={formatMessage({ id: 'pendings.balance', defaultMessage: 'Balance' })}
                  value={`${total_balance}$`}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <DisplayField
                  label={formatMessage({ id: 'pendings.last_activity', defaultMessage: 'Last Activity' })}
                  value={formatDate(new Date(last_activity), { month: 'short', day: 'numeric', year: 'numeric' })}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
}

export default injectIntl(InfluencerInfoCard)
